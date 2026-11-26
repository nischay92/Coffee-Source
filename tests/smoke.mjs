import assert from 'node:assert/strict';
import { createHmac, randomUUID } from 'node:crypto';
import pg from 'pg';

const database = new URL(process.env.DATABASE_URL || 'postgresql://invalid/none');
const origin = new URL(process.env.TEST_ORIGIN || 'http://127.0.0.1:3101');
if (database.hostname !== '127.0.0.1' || !database.pathname.endsWith('_test') || origin.hostname !== '127.0.0.1') {
  throw new Error('Use a fresh loopback database whose name ends in _test and a loopback fixture app.');
}

const sign = (value, secret) => createHmac('sha256', secret).update(value).digest('hex');
let cookie = '';
async function post(path, data, expected, auth = false, headers = {}) {
  const response = await fetch(new URL(path, origin), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin.origin, ...(auth ? { Cookie: cookie } : {}), ...headers },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  assert.equal(response.status, expected, `${path} (${data.action ?? data.service ?? data.event ?? 'request'}): ${JSON.stringify(result)}`);
  return { body: result, response };
}

const db = new pg.Client({ connectionString: database.href });
await db.connect();
try {
  const { rows: [old] } = await db.query("SELECT count(*) FROM products WHERE handle = 'local-integration-test'");
  assert.equal(Number(old.count), 0, 'Use a fresh test database for each run.');
  const { rows: [product] } = await db.query(`
    INSERT INTO products (handle, title, description, collection, published)
    VALUES ('local-integration-test', 'Local integration fixture', 'Test fixture only', 'roasted-coffee', true) RETURNING id`);
  const { rows: [variant] } = await db.query(`
    INSERT INTO variants (product_id, sku, pack_size, price_minor, stock)
    VALUES ($1, 'LOCAL-TEST-ONLY', '250 g', 25000, 4) RETURNING id`, [product.id]);

  const customer = { name: 'Local Fixture', email: 'checkout@example.invalid', phone: '9000000000',
    address: 'Local fixture address', city: 'Madikeri', state: 'Karnataka', pin: '571201' };
  const items = [{ id: variant.id, quantity: 2 }];

  const catalogue = await fetch(new URL('/shop/?q=Local%20integration', origin));
  assert.match(await catalogue.text(), /Local integration fixture/);
  const cart = (await post('/api/shop/cart/', { items }, 200)).body;
  assert.equal(cart.lines[0].price_minor, 25000);
  assert.equal(cart.available, true);
  assert.equal(cart.shipping, 5000);
  await post('/api/shop/cart/', { items: [items[0], items[0]] }, 400);
  await post('/api/shop/checkout/', { action: 'start', items, customer, expectedTotal: 1 }, 409);
  const checkout = (await post('/api/shop/checkout/', { action: 'start', items, customer, expectedTotal: 55000 }, 201)).body;
  const statusPath = `/shop/order/${checkout.token}/`;
  assert.match(await (await fetch(new URL(statusPath, origin))).text(), /Awaiting payment confirmation/);
  await post('/api/shop/checkout/', { action: 'start', items: [{ id: variant.id, quantity: 3 }], customer, expectedTotal: 80000 }, 409);

  const verification = { action: 'verify', token: checkout.token, paymentId: 'pay_local1' };
  await post('/api/shop/checkout/', { ...verification, signature: '0'.repeat(64) }, 400);
  assert.equal((await post('/api/shop/checkout/', {
    ...verification, signature: sign(`${checkout.providerOrder}|pay_local1`, 'local-fixture-gateway'),
  }, 200)).body.status, 'paid');
  const event = { event: 'payment.captured', payload: { payment: { entity: { id: 'pay_local1' } } } };
  await post('/api/webhooks/razorpay/', event, 401);
  for (let attempt = 0; attempt < 2; attempt++) {
    await post('/api/webhooks/razorpay/', event, 200, false, { 'x-razorpay-signature': sign(JSON.stringify(event), 'local-fixture-webhook') });
  }
  const { rows: [stock] } = await db.query('SELECT stock FROM variants WHERE id = $1', [variant.id]);
  assert.equal(stock.stock, 2, 'A repeated capture must decrement inventory once.');
  const { rows: [razorpay] } = await db.query("SELECT count(*) FROM transactions WHERE source = 'razorpay'");
  assert.equal(Number(razorpay.count), 1, 'A repeated capture must create only one ledger entry.');
  const privateStatus = await fetch(new URL(statusPath, origin));
  assert.match(await privateStatus.text(), /Payment confirmed/);
  assert.equal((await fetch(new URL('/shop/order/invalid/', origin))).status, 404);

  const manual = { action: 'manual', method: 'Bank transfer', currency: 'INR', amount: '123.45',
    date: new Date().toISOString().slice(0, 10), reference: 'FIXTURE-MANUAL-1', note: '=fixture', entryId: randomUUID() };
  await post('/api/admin/', manual, 401);
  const session = await post('/api/admin/', { action: 'login', username: 'fixture-admin', password: 'fixture-admin-password' }, 200);
  const cookieHeader = session.response.headers.get('set-cookie');
  assert.match(cookieHeader, /HttpOnly/i);
  cookie = cookieHeader.split(';')[0];
  await post('/api/admin/', manual, 201, true);
  await post('/api/admin/', manual, 201, true);
  await post('/api/admin/', { ...manual, entryId: randomUUID() }, 409, true);
  await post('/api/admin/', manual, 403, true, { Origin: 'https://example.invalid' });
  await post('/api/admin/', { action: 'paypal', invoiceId: 'INV2-FIXTURE-0001' }, 200, true);
  const paypalEvent = { event_type: 'INVOICING.INVOICE.PAID', resource: { id: 'INV2-FIXTURE-0001' } };
  await post('/api/webhooks/paypal/', paypalEvent, 401);
  await post('/api/webhooks/paypal/', paypalEvent, 200, false, {
    'paypal-auth-algo': 'SHA256withRSA', 'paypal-cert-url': 'https://api-m.sandbox.paypal.com/local-fixture',
    'paypal-transmission-id': 'local', 'paypal-transmission-sig': 'local-test-signature', 'paypal-transmission-time': new Date().toISOString(),
  });
  const { rows: [total] } = await db.query('SELECT count(*) FROM transactions');
  assert.equal(Number(total.count), 3, 'Ledger should contain one record per source.');

  assert.equal((await fetch(new URL('/api/admin/export/', origin))).status, 401);
  const csv = await fetch(new URL('/api/admin/export/?source=manual', origin), { headers: { Cookie: cookie } });
  assert.equal(csv.status, 200);
  const report = await csv.text();
  assert.match(report, /123\.45/);
  assert.match(report, /'=fixture/);
  assert.doesNotMatch(report, /LOCALPAYPAL1/);

  const enquiry = { service: 'bulk-sourcing', name: 'Local Enquiry', companyName: 'Fixture', email: 'trade@example.invalid', grade: 'Local test grade' };
  await post('/api/enquiries/', { ...enquiry, email: 'wrong' }, 400);
  await post('/api/enquiries/', enquiry, 201);
  await post('/api/enquiries/', { ...enquiry, service: 'custom-blend', blend: 'Arabica: 20%, Robusta: 20%, Chicory: 20%' }, 400);
  await post('/api/enquiries/', { ...enquiry, service: 'custom-blend', blend: 'Arabica: 60%, Robusta: 20%, Chicory: 20%' }, 201);
  const { rows: [order] } = await db.query('SELECT id FROM orders WHERE access_token = $1', [checkout.token]);
  await post('/api/admin/', { action: 'fulfilment', orderId: order.id, status: 'shipped', tracking: 'FIXTURE-SHIPMENT' }, 200, true);
  assert.match(await (await fetch(new URL(statusPath, origin))).text(), /FIXTURE-SHIPMENT/);
  const adminPage = await fetch(new URL('/admin/', origin), { headers: { Cookie: cookie } });
  assert.match(await adminPage.text(), /Local Enquiry/);
  console.log('Local PostgreSQL integration passed: catalogue, cart, payment verification, duplicate webhooks, manual ledger, PayPal invoices, CSV, enquiries and fulfilment.');
} finally {
  await db.end();
}
