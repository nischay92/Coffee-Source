import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import AdminProductEditor from '@/components/AdminProductEditor';
import { currentAdmin } from '@/lib/admin-auth';
import { getAdminProduct } from '@/lib/admin-products';

export const metadata: Metadata = { title: 'Edit product' };

export default async function EditProductPage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }>;
}) {
  if (!await currentAdmin()) redirect('/admin/');
  const { id } = await params;
  const { saved } = await searchParams;
  const product = await getAdminProduct(id);
  if (!product) notFound();
  return <section className="site-wrap shop-shell">
    <header className="page-heading"><Link className="text-link" href="/admin/products/">Back to products</Link>
      <h1>{product.title}</h1><p>{product.published ? 'Published in the shop' : 'Draft · visible to staff only'}</p></header>
    <AdminProductEditor product={product} saved={saved === '1'} />
  </section>;
}
