import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { collections } from './content';
import { inTransaction, query } from './db';
import { field, RequestError } from './http';
import { toMinor } from './money';
import { maxProductPhotos, maxProductPhotoBytes, maxProductUploadBytes, productUploadPath, uuidPattern } from './product-media';

export type AdminVariant = {
  id: string; sku: string; grade: string | null; roast: string | null; format: string | null;
  pack_size: string | null; price_minor: number; sale_price_minor: number | null; stock: number; active: boolean;
};

export type AdminProduct = {
  id: string; editor_revision: string; handle: string; title: string; description: string; collection: string;
  image_path: string | null; image_alt: string | null; origin: string | null; variety: string | null;
  processing: string | null; featured: boolean; published: boolean;
  images: { path: string; alt: string }[]; variants: AdminVariant[];
};

export async function getAdminProduct(id: string) {
  if (!uuidPattern.test(id)) return null;
  const { rows: [product] } = await query<AdminProduct>(`
    SELECT p.*, coalesce((SELECT jsonb_agg(jsonb_build_object('path', path, 'alt', alt) ORDER BY position)
      FROM product_images WHERE product_id = p.id), '[]'::jsonb) AS images,
      coalesce((SELECT jsonb_agg(to_jsonb(v) - 'product_id' ORDER BY v.sku)
      FROM variants v WHERE v.product_id = p.id), '[]'::jsonb) AS variants
    FROM products p WHERE p.id = $1`, [id]);
  if (product && !product.images.length && product.image_path) {
    product.images.push({ path: product.image_path, alt: product.image_alt || product.title });
  }
  return product ?? null;
}

function object(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new RequestError('Enter valid product details.');
  return input as Record<string, unknown>;
}

function stock(input: unknown) {
  if (typeof input !== 'string' || !/^\d{1,10}$/.test(input) || Number(input) > 2_147_483_647) {
    throw new RequestError('Enter stock as a whole number, including 0 for out of stock.');
  }
  return Number(input);
}

function parseVariant(input: unknown) {
  const value = object(input);
  const id = field(value.id, 36, 'variant ID');
  if (id && !uuidPattern.test(id)) throw new RequestError('Invalid product variant.');
  const price = toMinor(field(value.price, 15, 'regular price', true), 'INR');
  const sale = field(value.salePrice, 15, 'sale price');
  const salePrice = sale ? toMinor(sale, 'INR') : null;
  if (!price || price > 2_147_483_647) throw new RequestError('Enter a positive INR price with up to two decimals.');
  if (sale && (!salePrice || salePrice >= price)) throw new RequestError('A sale price must be positive and lower than the regular price.');
  return {
    id, sku: field(value.sku, 100, 'SKU', true), price, salePrice, stock: stock(value.stock),
    originalStock: id ? stock(value.originalStock) : null, active: value.active === true,
    grade: field(value.grade, 80, 'grade') || null, roast: field(value.roast, 80, 'roast level') || null,
    format: field(value.format, 80, 'format') || null, packSize: field(value.packSize, 80, 'pack size') || null,
  };
}

type Photo = { path: string; alt: string; upload?: { id: string; name: string; content: Buffer } };

function checkPhotoVariety(filename: string, variety: string) {
  if (/img_317[67]/i.test(filename) && variety.toLowerCase() !== 'robusta') {
    throw new RequestError('IMG_3176 and IMG_3177 can only be used for Robusta products.');
  }
}

async function photos(form: FormData, list: unknown, variety: string) {
  if (!Array.isArray(list) || list.length > maxProductPhotos) throw new RequestError(`Choose up to ${maxProductPhotos} photos.`);
  const result: Photo[] = [];
  let totalBytes = 0;
  for (const [index, input] of list.entries()) {
    const photo = object(input);
    const alt = field(photo.alt, 200, 'photo description', true);
    const path = field(photo.path, 200, 'photo path');
    if (path) {
      checkPhotoVariety(path, variety);
      result.push({ path, alt });
      continue;
    }
    const file = form.get(`photo-${index}`);
    if (!file || typeof file === 'string' || !file.size) throw new RequestError('Choose a file for each new photo.');
    totalBytes += file.size;
    if (file.size > maxProductPhotoBytes || totalBytes > maxProductUploadBytes) {
      throw new RequestError('Photos must be 2 MB or less each and 4 MB or less per save.', 413);
    }
    const name = file.name.slice(0, 180);
    checkPhotoVariety(name, variety);
    let content: Buffer;
    try {
      const photo = sharp(await file.arrayBuffer(), { limitInputPixels: 20_000_000 });
      const meta = await photo.metadata();
      if (!meta.format || !['jpeg', 'png', 'webp'].includes(meta.format) || (meta.pages ?? 1) > 1) throw new Error('Unsupported image');
      content = await photo.autoOrient().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 84 }).toBuffer();
      if (content.length > maxProductPhotoBytes) throw new Error('Image is too large');
    } catch {
      throw new RequestError('Upload a valid JPEG, PNG or WebP photo under 20 megapixels.');
    }
    const id = randomUUID();
    result.push({ path: productUploadPath(id), alt, upload: { id, name, content } });
  }
  if (new Set(result.map(photo => photo.path)).size !== result.length) throw new RequestError('Each photo can be listed once.');
  return result;
}

export async function saveAdminProduct(input: unknown, form: FormData) {
  const value = object(input);
  const id = field(value.id, 36, 'product ID');
  const revision = field(value.revision, 36, 'editor revision');
  if (id && (!uuidPattern.test(id) || !uuidPattern.test(revision))) throw new RequestError('Invalid product reference.');
  const title = field(value.title, 140, 'product title', true);
  const description = field(value.description, 3500, 'description');
  const collection = collections.find(item => item.slug === value.collection)?.slug;
  if (!collection) throw new RequestError('Choose a collection.');
  const variety = field(value.variety, 80, 'coffee variety');
  const origin = field(value.origin, 100, 'origin');
  const processing = field(value.processing, 120, 'processing');
  const published = value.published === true;
  const featured = value.featured === true;
  if (!Array.isArray(value.variants) || value.variants.length > 30) throw new RequestError('Choose up to 30 variants.');
  const variants = value.variants.map(parseVariant);
  const variantIds = variants.map(option => option.id).filter(Boolean);
  if (new Set(variantIds).size !== variantIds.length || new Set(variants.map(option => option.sku)).size !== variants.length) {
    throw new RequestError('Each variant needs a unique SKU.');
  }
  if (published && (!description || !variants.some(option => option.active))) {
    throw new RequestError('Add a description and at least one active variant before publishing.');
  }
  const gallery = await photos(form, value.photos, variety);
  const handle = title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80).replace(/^-|-$/g, '');
  if (!id && !handle) throw new RequestError('Include a letter or number in the product title for its shop URL.');

  try {
    return await inTransaction(async db => {
      let productId = id;
      let originalVariants: AdminVariant[] = [];
      if (!id) {
        if (variantIds.length || gallery.some(photo => !photo.upload)) throw new RequestError('New products must use new variants and photos.');
        const { rows: [product] } = await db.query<{ id: string }>(
          'INSERT INTO products (handle, title, description, collection) VALUES ($1, $2, $3, $4) RETURNING id',
          [handle, title, description, collection],
        );
        productId = product.id;
      } else {
        const { rows: [current] } = await db.query<Pick<AdminProduct, 'editor_revision' | 'image_path'>>(
          'SELECT editor_revision, image_path FROM products WHERE id = $1 FOR UPDATE', [id],
        );
        if (!current) throw new RequestError('Product not found.', 404);
        if (current.editor_revision !== revision) throw new RequestError('This product was changed. Reload it before saving again.', 409);
        originalVariants = (await db.query<AdminVariant>(
          'SELECT * FROM variants WHERE product_id = $1 ORDER BY id FOR UPDATE', [id],
        )).rows;
        if (originalVariants.length !== variantIds.length || originalVariants.some(option => !variantIds.includes(option.id))) {
          throw new RequestError('Existing variants can be deactivated from this form.', 409);
        }
        const { rows: existingPhotos } = await db.query<{ path: string }>('SELECT path FROM product_images WHERE product_id = $1', [id]);
        const allowed = new Set([...existingPhotos.map(photo => photo.path), current.image_path]);
        const { rows: uploaded } = await db.query<{ id: string; source_name: string }>(
          'SELECT id, source_name FROM product_image_uploads WHERE product_id = $1', [id],
        );
        for (const photo of gallery.filter(item => !item.upload)) {
          if (!allowed.has(photo.path)) throw new RequestError('This photo does not belong to this product.');
          checkPhotoVariety(uploaded.find(item => productUploadPath(item.id) === photo.path)?.source_name ?? photo.path, variety);
        }
      }

      for (const option of variants) {
        if (!option.id) {
          await db.query(`INSERT INTO variants (product_id, sku, price_minor, sale_price_minor, stock, active, grade, roast, format, pack_size)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [productId, option.sku, option.price, option.salePrice, option.stock, option.active, option.grade, option.roast, option.format, option.packSize]);
          continue;
        }
        const original = originalVariants.find(item => item.id === option.id)!;
        const changed = option.stock !== option.originalStock;
        if (changed) {
          if (original.stock !== option.originalStock) throw new RequestError(`Stock for ${option.sku} changed while you were editing. Reload it and try again.`, 409);
          const { rows: [reservation] } = await db.query<{ held: number }>(`SELECT coalesce(sum(i.quantity), 0)::int AS held
            FROM order_items i JOIN orders o ON o.id = i.order_id
            WHERE i.variant_id = $1 AND o.status = 'pending' AND o.reservation_expires_at > now()`, [option.id]);
          if (option.stock < reservation.held) throw new RequestError(`Stock for ${option.sku} cannot go below the ${reservation.held} units reserved for checkout.`, 409);
        }
        await db.query(`UPDATE variants SET sku = $2, price_minor = $3, sale_price_minor = $4, stock = $5,
          active = $6, grade = $7, roast = $8, format = $9, pack_size = $10 WHERE id = $1`,
        [option.id, option.sku, option.price, option.salePrice, changed ? option.stock : original.stock,
          option.active, option.grade, option.roast, option.format, option.packSize]);
      }

      await db.query('DELETE FROM product_images WHERE product_id = $1', [productId]);
      for (const [position, photo] of gallery.entries()) {
        if (photo.upload) await db.query('INSERT INTO product_image_uploads (id, product_id, source_name, content) VALUES ($1,$2,$3,$4)',
          [photo.upload.id, productId, photo.upload.name, photo.upload.content]);
        await db.query('INSERT INTO product_images (product_id, path, alt, position) VALUES ($1,$2,$3,$4)',
          [productId, photo.path, photo.alt, position]);
      }
      await db.query(`DELETE FROM product_image_uploads u WHERE u.product_id = $1 AND NOT EXISTS (
        SELECT FROM product_images g WHERE g.product_id = u.product_id AND g.path = '/images/uploads/' || u.id || '/'
      )`, [productId]);
      await db.query(`UPDATE products SET title = $2, description = $3, collection = $4, origin = $5, variety = $6, processing = $7,
        published = $8, featured = $9, image_path = $10, image_alt = $11, editor_revision = gen_random_uuid() WHERE id = $1`,
      [productId, title, description, collection, origin || null, variety || null, processing || null, published, featured,
        gallery[0]?.path ?? null, gallery[0]?.alt ?? null]);
      return productId;
    });
  } catch (error) {
    if ((error as { code?: string }).code === '23505') throw new RequestError('A product URL or SKU is already in use. Choose a distinct name or SKU.', 409);
    throw error;
  }
}
