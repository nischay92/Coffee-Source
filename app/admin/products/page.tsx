import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentAdmin } from '@/lib/admin-auth';
import { query } from '@/lib/db';
import { collections } from '@/lib/content';
import { isProductUpload } from '@/lib/product-media';

export const metadata: Metadata = { title: 'Admin products' };

type ProductRow = {
  id: string; title: string; collection: string; image_path: string | null; image_alt: string | null;
  published: boolean; variant_count: number; stock: string;
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string | string[]; page?: string }> }) {
  if (!await currentAdmin()) redirect('/admin/');
  const params = await searchParams;
  const search = typeof params.q === 'string' ? params.q.trim().slice(0, 100) : '';
  const page = typeof params.page === 'string' && /^\d{1,4}$/.test(params.page) ? Math.max(1, Number(params.page)) : 1;
  const { rows } = await query<ProductRow>(`
    SELECT p.id, p.title, p.collection, p.image_path, p.image_alt, p.published,
      count(v.id)::int AS variant_count, coalesce(sum(v.stock) FILTER (WHERE v.active), 0) AS stock
    FROM products p LEFT JOIN variants v ON v.product_id = p.id
    WHERE $1 = '' OR strpos(lower(p.title), lower($1)) > 0 OR EXISTS (
      SELECT 1 FROM variants sku WHERE sku.product_id = p.id AND strpos(lower(sku.sku), lower($1)) > 0
    ) GROUP BY p.id ORDER BY p.title, p.id LIMIT 31 OFFSET $2`, [search, (page - 1) * 30]);
  const link = (target: number) => `/admin/products/?${new URLSearchParams({ q: search, page: String(target) })}`;

  return <section className="site-wrap shop-shell">
    <header className="page-heading flex flex-wrap justify-between items-end gap-4">
      <div><h1>Products</h1><p>Manage catalogue listings, photos, pricing and stock.</p></div>
      <Link className="action" href="/admin/products/new/">Add product</Link>
    </header>
    <form className="shop-search" action="/admin/products/" method="get">
      <label className="field">Search products<input name="q" type="search" placeholder="Name or SKU" defaultValue={search} maxLength={100} /></label>
      <button type="submit" className="action action-outline">Search</button>
    </form>
    <div className="panel">
      {rows.length ? <div className="overflow-x-auto"><table className="admin-table">
        <thead><tr>{['Product', 'Collection', 'Status', 'Variants', 'Stock'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
        <tbody>{rows.slice(0, 30).map(product => <tr key={product.id}>
          <td><Link className="text-link flex items-center gap-3" href={`/admin/products/${product.id}/`}>
            {product.image_path && <Image src={product.image_path} alt="" width={42} height={42} className="object-cover h-[42px]" unoptimized={isProductUpload(product.image_path)} />}
            {product.title}</Link></td>
          <td>{collections.find(item => item.slug === product.collection)?.name}</td>
          <td>{product.published ? 'Published' : 'Draft'}</td><td>{product.variant_count}</td><td>{product.stock} units</td>
        </tr>)}</tbody>
      </table></div> : <p className="status-note">{search ? 'No products match that search.' : 'Your catalogue is empty. Add a product to get started.'}</p>}
      {(page > 1 || rows.length > 30) && <div className="flex gap-4 mt-4">
        {page > 1 && <Link className="text-link" href={link(page - 1)}>Previous</Link>}
        {rows.length > 30 && <Link className="text-link" href={link(page + 1)}>Next</Link>}
      </div>}
    </div>
  </section>;
}
