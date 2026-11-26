import { randomBytes } from 'node:crypto';
import { inTransaction, query } from './db';
import { availabilitySQL, indiaShipping, variantLabel, type CartItem, type Variant } from './catalogue';
import { field, RequestError } from './http';
import { razorpayCredentials, razorpayRequest, type RazorpayPayment } from './razorpay';

export const orderTokenPattern = /^[a-f0-9]{64}$/;

type Customer = { name: string; email: string; phone: string; address: string; city: string; state: string; pin: string };
type ItemSnapshot = Variant & { title: string; quantity: number };
type Order = { id: string; access_token: string; subtotal_minor: number; shipping_minor: number; currency: string; status: string; razorpay_order_id: string | null };

function getCustomer(data: unknown): Customer {
  if (!data || typeof data !== 'object') throw new RequestError('Enter your delivery details.');
  const values = data as Record<string, unknown>;
  const customer = {
    name: field(values.name, 100, 'name', true),
    email: field(values.email, 180, 'email', true),
    phone: field(values.phone, 20, 'phone number', true),
    address: field(values.address, 240, 'address', true),
    city: field(values.city, 100, 'city', true),
    state: field(values.state, 100, 'state', true),
    pin: field(values.pin, 6, 'PIN code', true),
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) throw new RequestError('Enter a valid email address.');
  if (!/^\+?\d[\d -]{8,18}$/.test(customer.phone)) throw new RequestError('Enter a valid phone number.');
  if (!/^[1-9]\d{5}$/.test(customer.pin)) throw new RequestError('Enter a valid six-digit Indian PIN code.');
  return customer;
}

export async function startCheckout(items: CartItem[], customerData: unknown, expectedTotal: unknown) {
  const shipping = indiaShipping();
  const credentials = razorpayCredentials();
  if (shipping === null || !credentials) throw new RequestError('Online checkout is currently unavailable. Contact BeanSource for help.', 503);
  const customer = getCustomer(customerData);
  const ids = items.map(item => item.id);
  const order = await inTransaction(async db => {
    await db.query('SELECT id FROM variants WHERE id = ANY($1::uuid[]) ORDER BY id FOR UPDATE', [ids]);
    const { rows } = await db.query<Omit<ItemSnapshot, 'quantity'>>(`
      SELECT v.id, v.grade, v.roast, v.format, v.pack_size, v.price_minor, p.title,
        ${availabilitySQL} AS available
      FROM variants v JOIN products p ON p.id = v.product_id
      WHERE v.active AND p.published AND v.id = ANY($1::uuid[])`, [ids]);
    const selected = items.map(item => {
      const row = rows.find(entry => entry.id === item.id);
      if (!row || item.quantity > row.available) throw new RequestError('A coffee in your bag is no longer available in that quantity.', 409);
      return { ...row, quantity: item.quantity };
    });
    const subtotal = selected.reduce((sum, item) => sum + item.price_minor * item.quantity, 0);
    if (subtotal + shipping > 2_147_483_647) throw new RequestError('This order is above the online checkout limit.');
    if (expectedTotal !== subtotal + shipping) throw new RequestError('The order total has changed. Review your bag and try again.', 409);
    const { rows: [created] } = await db.query<Order>(`
      INSERT INTO orders (access_token, customer, subtotal_minor, shipping_minor, reservation_expires_at)
      VALUES ($1, $2, $3, $4, now() + interval '20 minutes')
      RETURNING id, access_token, subtotal_minor, shipping_minor, currency, status, razorpay_order_id`,
    [randomBytes(32).toString('hex'), customer, subtotal, shipping]);
    for (const item of selected) {
      await db.query(`INSERT INTO order_items (order_id, variant_id, product_title, variant_label, quantity, price_minor)
        VALUES ($1, $2, $3, $4, $5, $6)`, [created.id, item.id, item.title, variantLabel(item), item.quantity, item.price_minor]);
    }
    return created;
  });

  try {
    const amount = order.subtotal_minor + order.shipping_minor;
    const provider = await razorpayRequest<{ id: string; amount: number; currency: string }>('/orders', {
      amount, currency: order.currency, receipt: order.id, partial_payment: false,
    });
    if (!/^order_[a-z0-9]+$/i.test(provider.id) || provider.amount !== amount || provider.currency !== order.currency) {
      throw new RequestError('Razorpay returned an unexpected order.', 502);
    }
    await query('UPDATE orders SET razorpay_order_id = $2 WHERE id = $1', [order.id, provider.id]);
    return { token: order.access_token, providerOrder: provider.id, amount, currency: order.currency, key: credentials.id, test: credentials.id.startsWith('rzp_test_') };
  } catch (error) {
    await query("UPDATE orders SET status = 'closed' WHERE id = $1 AND razorpay_order_id IS NULL", [order.id]);
    throw error;
  }
}

export async function findOrder(token: string) {
  if (!orderTokenPattern.test(token)) return null;
  const { rows } = await query<Order & { display_status: string; fulfilment_status: string; tracking_reference: string | null }>(`
    SELECT id, status, access_token, razorpay_order_id, subtotal_minor, shipping_minor, currency,
      fulfilment_status, tracking_reference,
      CASE WHEN status = 'pending' AND reservation_expires_at <= now() THEN 'closed' ELSE status END AS display_status
    FROM orders WHERE access_token = $1`, [token]);
  return rows[0] ?? null;
}

export async function recordRazorpayPayment(payment: RazorpayPayment) {
  if (!/^pay_[a-z0-9]+$/i.test(payment.id) || !Number.isSafeInteger(payment.amount) || payment.amount < 1 ||
      !/^[A-Z]{3}$/.test(payment.currency) || !Number.isFinite(payment.created_at)) throw new RequestError('Invalid Razorpay payment.', 502);
  const amountRefunded = Number(payment.amount_refunded ?? 0);
  if (!Number.isSafeInteger(amountRefunded) || amountRefunded < 0 || amountRefunded > payment.amount) throw new RequestError('Invalid Razorpay refund amount.', 502);
  const state = amountRefunded === payment.amount ? 'refunded'
    : amountRefunded > 0 ? 'partially_refunded'
    : payment.status === 'captured' ? 'paid' : payment.status === 'failed' ? 'failed' : 'pending';
  return inTransaction(async db => {
    const { rows: [order] } = await db.query<Order>('SELECT * FROM orders WHERE razorpay_order_id = $1 FOR UPDATE', [payment.order_id]);
    const { rows: [ledger] } = await db.query<{ status: string }>(`
      INSERT INTO transactions (source, provider_ref, order_id, reference, method, amount_minor, refunded_minor, currency, status, occurred_at)
      VALUES ('razorpay', $1, $2, $3, $4, $5, $6, $7, $8, to_timestamp($9))
      ON CONFLICT (source, provider_ref) DO UPDATE SET
        order_id = coalesce(EXCLUDED.order_id, transactions.order_id),
        refunded_minor = greatest(EXCLUDED.refunded_minor, transactions.refunded_minor),
        status = CASE
          WHEN transactions.status = 'refunded' OR EXCLUDED.status = 'refunded' THEN 'refunded'
          WHEN transactions.status = 'partially_refunded' OR EXCLUDED.status = 'partially_refunded' THEN 'partially_refunded'
          WHEN transactions.status = 'paid' OR EXCLUDED.status = 'paid' THEN 'paid'
          WHEN transactions.status = 'failed' THEN 'failed' ELSE EXCLUDED.status END
      RETURNING status`,
    [payment.id, order?.id ?? null, payment.order_id, payment.method ?? 'Razorpay', payment.amount, amountRefunded, payment.currency, state, payment.created_at]);

    if (!order || (ledger.status !== 'paid' && ledger.status !== 'refunded' && ledger.status !== 'partially_refunded')) return;
    if (order.currency !== payment.currency || order.subtotal_minor + order.shipping_minor !== payment.amount) {
      console.warn('BeanSource found a Razorpay payment that does not match its order.');
      return;
    }
    if (ledger.status === 'refunded') {
      await db.query("UPDATE orders SET status = 'refunded' WHERE id = $1", [order.id]);
      return;
    }
    if (order.status === 'paid') return order.id;
    if (!['pending', 'closed'].includes(order.status)) return;
    const { rows: reservations } = await db.query<{ id: string; stock: number; quantity: number }>(`
      SELECT v.id, v.stock, i.quantity FROM order_items i JOIN variants v ON v.id = i.variant_id
      WHERE i.order_id = $1 ORDER BY v.id FOR UPDATE OF v`, [order.id]);
    const { rows: held } = await db.query<{ variant_id: string; quantity: number }>(`
      SELECT i.variant_id, sum(i.quantity)::int AS quantity FROM order_items i JOIN orders o ON o.id = i.order_id
      WHERE i.variant_id = ANY($1::uuid[]) AND o.status = 'pending' AND o.id <> $2 AND o.reservation_expires_at > now()
      GROUP BY i.variant_id`, [reservations.map(item => item.id), order.id]);
    const available = reservations.length > 0 && reservations.every(item =>
      item.stock - (held.find(entry => entry.variant_id === item.id)?.quantity ?? 0) >= item.quantity);
    const canFulfil = available && ledger.status === 'paid';
    if (canFulfil) {
      for (const item of reservations) await db.query('UPDATE variants SET stock = stock - $2 WHERE id = $1', [item.id, item.quantity]);
    }
    await db.query('UPDATE orders SET status = $2 WHERE id = $1', [order.id, canFulfil ? 'paid' : 'paid_review']);
    return canFulfil ? order.id : undefined;
  });
}
