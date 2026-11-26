import { readFile, stat } from 'node:fs/promises';
import pg from 'pg';

const source = process.argv[2];
if (!process.env.DATABASE_URL || !source) throw new Error('Set DATABASE_URL and pass the path to the approved catalogue JSON.');
const products = JSON.parse(await readFile(source, 'utf8'));
if (!Array.isArray(products) || products.length === 0) throw new Error('Provide an array of approved products.');

const collections = ['green-coffee', 'roasted-coffee', 'signature-blends', 'coffee-gifting'];
const handles = new Set();
const skus = new Set();

function text(value, label, max, optional = false) {
  if (value == null && optional) return null;
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new Error(`Invalid ${label}.`);
  return value.trim();
}

async function image(value, variety) {
  const path = text(value?.path, 'image path', 180);
  if (!/^\/images\/[a-z0-9][a-z0-9_.-]*\.(avif|gif|jpe?g|png|webp)$/i.test(path)) throw new Error(`Invalid catalogue image path: ${path}`);
  if (/img_317[67]/i.test(path) && variety?.toLowerCase() !== 'robusta') throw new Error(`${path} is a Robusta image.`);
  if (!(await stat(new URL(`../public${path}`, import.meta.url))).isFile()) throw new Error(`Missing catalogue image: ${path}`);
  return { path, alt: text(value.alt, 'image alt text', 200) };
}

const validated = [];
for (const product of products) {
  const handle = text(product.handle, 'product handle', 80);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(handle) || handles.has(handle)) throw new Error(`Invalid or duplicate handle: ${handle}`);
  handles.add(handle);
  if (!collections.includes(product.collection)) throw new Error(`Invalid collection for ${handle}.`);
  const variety = text(product.variety, 'variety', 80, true);
  if (!Array.isArray(product.variants) || (product.images != null && !Array.isArray(product.images))) throw new Error(`Invalid options or images for ${handle}.`);
  if (product.published === true && !product.variants.some(option => option.active !== false)) throw new Error(`Published coffee requires at least one active variant: ${handle}`);
  validated.push({
    handle, title: text(product.title, 'title', 140), description: text(product.description, 'description', 3500),
    collection: product.collection, origin: text(product.origin, 'origin', 100, true),
    variety, processing: text(product.processing, 'processing', 120, true),
    featured: product.featured === true, published: product.published === true,
    images: await Promise.all((product.images ?? []).map(value => image(value, variety))),
    variants: product.variants.map(option => {
      const sku = text(option.sku, 'SKU', 100);
      if (skus.has(sku)) throw new Error(`Duplicate SKU: ${sku}`);
      skus.add(sku);
      if (!Number.isInteger(option.priceMinor) || option.priceMinor < 1 || option.priceMinor > 2_147_483_647 ||
        !Number.isInteger(option.stock) || option.stock < 0 || option.stock > 2_147_483_647) throw new Error(`Invalid price or stock for ${sku}.`);
      if (option.salePriceMinor != null && (!Number.isInteger(option.salePriceMinor) || option.salePriceMinor <= 0 || option.salePriceMinor >= option.priceMinor)) {
        throw new Error(`Invalid sale price for ${sku}.`);
      }
      return {
        sku, grade: text(option.grade, 'grade', 80, true), roast: text(option.roast, 'roast', 80, true),
        format: text(option.format, 'format', 80, true), packSize: text(option.packSize, 'pack size', 80, true),
        priceMinor: option.priceMinor, salePriceMinor: option.salePriceMinor ?? null, stock: option.stock, active: option.active !== false,
      };
    }),
  });
}

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();
try {
  await db.query('BEGIN');
  for (const item of validated) {
    const cover = item.images[0];
    const { rows: [{ id }] } = await db.query(`INSERT INTO products
      (handle, title, description, collection, image_path, image_alt, origin, variety, processing, featured, published)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT (handle) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description,
        collection = EXCLUDED.collection, image_path = EXCLUDED.image_path, image_alt = EXCLUDED.image_alt,
        origin = EXCLUDED.origin, variety = EXCLUDED.variety, processing = EXCLUDED.processing,
        featured = EXCLUDED.featured, published = EXCLUDED.published, editor_revision = gen_random_uuid() RETURNING id`,
    [item.handle, item.title, item.description, item.collection, cover?.path ?? null, cover?.alt ?? null, item.origin, item.variety, item.processing, item.featured, item.published]);
    await db.query('DELETE FROM product_images WHERE product_id = $1', [id]);
    await db.query('DELETE FROM product_image_uploads WHERE product_id = $1', [id]);
    for (const [position, cover] of item.images.entries()) {
      await db.query('INSERT INTO product_images (product_id, path, alt, position) VALUES ($1,$2,$3,$4)', [id, cover.path, cover.alt, position]);
    }
    for (const option of item.variants) {
      const result = await db.query(`INSERT INTO variants
        (product_id, sku, grade, roast, format, pack_size, price_minor, sale_price_minor, stock, active)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT (sku) DO UPDATE SET grade = EXCLUDED.grade, roast = EXCLUDED.roast, format = EXCLUDED.format,
          pack_size = EXCLUDED.pack_size, price_minor = EXCLUDED.price_minor, sale_price_minor = EXCLUDED.sale_price_minor,
          stock = EXCLUDED.stock, active = EXCLUDED.active
        WHERE variants.product_id = EXCLUDED.product_id`,
      [id, option.sku, option.grade, option.roast, option.format, option.packSize, option.priceMinor, option.salePriceMinor, option.stock, option.active]);
      if (!result.rowCount) throw new Error(`SKU already belongs to another product: ${option.sku}`);
    }
  }
  await db.query('COMMIT');
  console.log(`Imported ${validated.length} approved product record(s).`);
} catch (error) {
  await db.query('ROLLBACK');
  throw error;
} finally {
  await db.end();
}
