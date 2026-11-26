import { query } from './db';
import { RequestError } from './http';
import { formatMoney } from './money';

export async function sendOrderReceipt(id: string | undefined) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM;
  const site = process.env.SITE_URL;
  if (!id || !key || !from || !site) return;
  const test = process.env.RAZORPAY_MODE !== 'live';
  if (test && !process.env.ORDER_EMAIL_TEST_RECIPIENT) return;
  const { rows: [order] } = await query<{
    access_token: string; customer: { email: string }; subtotal_minor: number; shipping_minor: number; currency: string;
  }>(`SELECT access_token, customer, subtotal_minor, shipping_minor, currency FROM orders
    WHERE id = $1 AND status = 'paid' AND receipt_sent_at IS NULL`, [id]);
  if (!order) return;
  const statusURL = new URL(`/shop/order/${order.access_token}/`, site);
  const reference = id.slice(0, 8).toUpperCase();
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `order-receipt/${id}` },
    body: JSON.stringify({
      from, to: [test ? process.env.ORDER_EMAIL_TEST_RECIPIENT : order.customer.email],
      subject: `${test ? '[Test] ' : ''}BeanSource order #${reference} confirmed`,
      text: `We received your payment for BeanSource order #${reference}.\n\nTotal: ${formatMoney(order.subtotal_minor + order.shipping_minor, order.currency)}\n\nSave this private link to check order status: ${statusURL.href}\n\nQuestions? Email info@beansource.in.`,
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new RequestError('Order saved, but the receipt could not be sent.', 502);
  await query('UPDATE orders SET receipt_sent_at = now() WHERE id = $1 AND receipt_sent_at IS NULL', [id]);
}
