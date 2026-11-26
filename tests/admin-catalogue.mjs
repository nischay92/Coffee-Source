import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
import sharp from 'sharp';

const database = new URL(process.env.DATABASE_URL || 'postgresql://invalid/none');
const origin = new URL(process.env.TEST_ORIGIN || 'http://127.0.0.1:3101');
if (database.hostname !== '127.0.0.1' || !database.pathname.endsWith('_test') || origin.hostname !== '127.0.0.1') {
  throw new Error('Use an isolated loopback fixture app and database ending in _test.');
}

const db = new pg.Client({ connectionString: database.href });
const prefix = randomUUID().slice(0, 8);
const handle = `catalogue-fixture-${prefix}`;
const variant = { sku: `FIXTURE-${prefix}`, price: '600', salePrice: '450', stock: '4', active: true };
const product = { title: `Catalogue fixture ${prefix}`, collection: 'roasted-coffee', variety: 'Robusta',
  description: 'Isolated catalogue test record', photos: [{ alt: 'Test coffee photo' }], variants: [variant] };
let cookie = '';

function go(path, options = {}) {
  return fetch(new URL(path, origin), options);
}

async function post(path, form, expected, admin = false) {
  const isForm = form instanceof FormData;
  const response = await go(path, {
    method: 'POST', body: isForm ? form : JSON.stringify(form),
    headers: { Origin: origin.origin, ...(admin ? { Cookie: cookie } : {}), ...(isForm ? {} : { 'Content-Type': 'application/json' }) },
  });
  const json = await response.json();
  assert.equal(response.status, expected, JSON.stringify(json));
  return { response, json };
}

function form(data, file, name = 'fixture.jpg') {
  const body = new FormData();
  body.append('product', JSON.stringify(data));
  if (file) body.append('photo-0', new Blob([file], { type: 'image/jpeg' }), name);
  return body;
}

await db.connect();
try {
  const route = '/api/admin/products/';
  await post(route, form(product), 401);
  const login = await post('/api/admin/', { action: 'login', username: 'fixture-admin', password: 'fixture-admin-password' }, 200);
  cookie = login.response.headers.get('set-cookie').split(';')[0];
  const photo = await sharp({ create: { width: 20, height: 15, channels: 3, background: '#4d362a' } }).jpeg().toBuffer();
  await post(route, form(product, Buffer.from('not a photo')), 400, true);
  await post(route, form({ ...product, variety: 'Arabica' }, photo, 'IMG_3176.jpg'), 400, true);
  await post(route, form({ ...product, variants: [{ ...variant, salePrice: '650' }] }, photo), 400, true);
  const { json: { id } } = await post(route, form(product, photo, 'IMG_3176.jpg'), 200, true);

  const getSaved = async () => (await db.query(`
    SELECT p.editor_revision AS revision, p.image_path AS path, v.id AS variant_id, v.stock
    FROM products p JOIN variants v ON v.product_id = p.id WHERE p.id = $1`, [id])).rows[0];
  const draft = await getSaved();
  assert.equal((await go(draft.path)).status, 404);
  const preview = await go(draft.path, { headers: { Cookie: cookie } });
  assert.equal(preview.headers.get('content-type'), 'image/webp');
  assert.equal(preview.headers.get('cache-control'), 'private, no-store');
  assert.equal((await go(`/shop/product/${handle}/`)).status, 404);
  const publish = { ...product, id, revision: draft.revision, published: true, photos: [{ path: draft.path, alt: 'Test coffee photo' }],
    variants: [{ ...variant, id: draft.variant_id, originalStock: '4' }] };
  await post(route, form({ ...publish, variety: 'Arabica' }), 400, true);
  await post(route, form(publish), 200, true);
  await post(route, form(publish), 409, true);
  assert.equal((await go(draft.path)).status, 200);
  const page = await go(`/shop/product/${handle}/`);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /450\.00/);
  const items = [{ id: draft.variant_id, quantity: 2 }];
  const cart = await post('/api/shop/cart/', { items }, 200);
  assert.equal(cart.json.lines[0].price_minor, 45000);
  const customer = { name: 'Test account', email: 'catalogue@example.invalid', phone: '9000000000',
    address: 'Test address', city: 'Madikeri', state: 'Karnataka', pin: '571201' };
  await post('/api/shop/checkout/', { action: 'start', items, customer, expectedTotal: 125000 }, 409);
  const order = await post('/api/shop/checkout/', { action: 'start', items, customer, expectedTotal: 95000 }, 201);
  const sale = { ...publish, revision: (await getSaved()).revision };
  await post(route, form({ ...sale, variants: [{ ...sale.variants[0], stock: '1' }] }), 409, true);
  const edited = { ...sale, variants: [{ ...sale.variants[0], salePrice: '' }] };
  await post(route, form(edited), 200, true);
  assert.equal((await post('/api/shop/cart/', { items }, 200)).json.lines[0].price_minor, 60000);
  const { rows: [snapshot] } = await db.query('SELECT i.price_minor FROM order_items i JOIN orders o ON o.id = i.order_id WHERE o.access_token = $1', [order.json.token]);
  assert.equal(snapshot.price_minor, 45000);
  await post(route, form({ ...edited, revision: (await getSaved()).revision, published: false }), 200, true);
  assert.equal((await go(draft.path)).status, 404);
  console.log('Admin catalogue integration passed: auth, photo validation and privacy, draft/publish, sale checkout, inventory reservations and stale-edit protection.');
} finally {
  await db.end();
}
