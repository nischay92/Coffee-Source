import type { MetadataRoute } from 'next';
import { collections, services } from '@/lib/content';
import { databaseConfigured, query } from '@/lib/db';

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.SITE_URL?.replace(/\/$/, '');
  if (!site) return [];
  const productRoutes = databaseConfigured()
    ? (await query<{ handle: string }>('SELECT handle FROM products WHERE published ORDER BY handle')).rows.map(product => `/shop/product/${product.handle}/`)
    : [];
  return [
    '/', '/about/', '/contact/', '/shop/', '/shop/custom-blend/', '/products/', '/how-it-works/', '/for-buyers/', '/for-suppliers/',
    ...collections.map(item => `/shop/collection/${item.slug}/`), ...services.map(item => `/${item.slug}/`), ...productRoutes,
  ].map(path => ({ url: `${site}${path}` }));
}
