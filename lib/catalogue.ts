import { databaseConfigured, query } from './db';
import { RequestError } from './http';

export type Variant = { id: string; grade: string | null; roast: string | null; format: string | null; pack_size: string | null; price_minor: number; regular_price_minor?: number; available: number };
export type Product = {
  id: string; handle: string; title: string; description: string; collection: string;
  image_path: string | null; image_alt: string | null; origin: string | null;
  variety: string | null; processing: string | null; variants: Variant[];
  images: { path: string; alt: string }[];
};
export type CartItem = { id: string; quantity: number };
export type CartLine = Variant & { title: string; handle: string; quantity: number };

export function variantLabel(variant: Pick<Variant, 'grade' | 'roast' | 'format' | 'pack_size'>) {
  return [variant.grade, variant.roast, variant.format, variant.pack_size].filter(Boolean).join(' · ') || 'Standard';
}

export const availabilitySQL = `greatest(v.stock - coalesce((
  SELECT sum(i.quantity) FROM order_items i JOIN orders o ON o.id = i.order_id
  WHERE i.variant_id = v.id AND o.status = 'pending' AND o.reservation_expires_at > now()
), 0), 0)::int`;

export const effectivePriceSQL = 'coalesce(v.sale_price_minor, v.price_minor)';

export async function getProducts({ handle, collection, search }: { handle?: string; collection?: string; search?: string } = {}) {
  if (!databaseConfigured()) return [];
  const value = search?.slice(0, 100).trim();
  const { rows } = await query<Product>(`
    SELECT p.id, p.handle, p.title, p.description, p.collection, p.image_path, p.image_alt,
      p.origin, p.variety, p.processing, coalesce((
        SELECT jsonb_agg(jsonb_build_object('path', g.path, 'alt', g.alt) ORDER BY g.position)
        FROM product_images g WHERE g.product_id = p.id
      ), '[]'::jsonb) AS images, coalesce((
        SELECT jsonb_agg(jsonb_build_object(
          'id', v.id, 'grade', v.grade, 'roast', v.roast, 'format', v.format, 'pack_size', v.pack_size,
          'price_minor', ${effectivePriceSQL}, 'regular_price_minor', v.price_minor, 'available', ${availabilitySQL}
        ) ORDER BY ${effectivePriceSQL}, v.sku)
        FROM variants v WHERE v.product_id = p.id AND v.active
      ), '[]'::jsonb) AS variants
    FROM products p WHERE p.published
      AND ($1::text IS NULL OR p.handle = $1)
      AND ($2::text IS NULL OR p.collection = $2)
      AND ($3::text IS NULL OR strpos(lower(concat_ws(' ', p.title, p.description, p.variety, p.processing)), lower($3)) > 0
        OR EXISTS (SELECT 1 FROM variants v WHERE v.product_id = p.id AND v.active
          AND strpos(lower(concat_ws(' ', v.grade, v.pack_size, v.format, v.roast)), lower($3)) > 0))
    ORDER BY p.featured DESC, p.title LIMIT 100`,
  [handle || null, collection || null, value || null]);
  return rows;
}

export function parseItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw) || raw.length < 1 || raw.length > 30) throw new RequestError('Choose between 1 and 30 items.');
  const seen = new Set<string>();
  return raw.map(item => {
    const { id, quantity } = item || {};
    if (typeof id !== 'string' || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id) ||
        seen.has(id.toLowerCase()) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new RequestError('One or more items are invalid.');
    }
    const normalized = id.toLowerCase();
    seen.add(normalized);
    return { id: normalized, quantity };
  });
}

export async function getCartLines(items: CartItem[]) {
  const { rows } = await query<Omit<CartLine, 'quantity'>>(`
    SELECT v.id, v.grade, v.roast, v.format, v.pack_size, ${effectivePriceSQL} AS price_minor, ${availabilitySQL} AS available,
      p.title, p.handle FROM variants v JOIN products p ON p.id = v.product_id
    WHERE v.active AND p.published AND v.id = ANY($1::uuid[])`,
  [items.map(item => item.id)]);
  const byId = new Map(rows.map(row => [row.id, row]));
  return items.flatMap(item => {
    const row = byId.get(item.id);
    return row ? [{ ...row, quantity: item.quantity }] : [];
  });
}

export function indiaShipping() {
  const value = process.env.INDIA_FLAT_SHIPPING_PAISE;
  if (value === undefined || !/^\d{1,8}$/.test(value)) return null;
  return Number(value);
}

export async function featuredCoffees() {
  if (!databaseConfigured()) return [];
  const { rows } = await query<Pick<Product, 'handle' | 'title' | 'image_path' | 'image_alt' | 'variety'>>(
    'SELECT handle, title, image_path, image_alt, variety FROM products WHERE published AND featured ORDER BY title LIMIT 4',
  );
  return rows;
}
