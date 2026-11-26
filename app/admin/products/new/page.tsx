import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminProductEditor from '@/components/AdminProductEditor';
import { currentAdmin } from '@/lib/admin-auth';

export const metadata: Metadata = { title: 'Add product' };

export default async function AddProductPage() {
  if (!await currentAdmin()) redirect('/admin/');
  return <section className="site-wrap shop-shell">
    <header className="page-heading"><Link className="text-link" href="/admin/products/">Back to products</Link>
      <h1>Add product</h1><p>Save a draft to keep it private, or publish it when the details and variants are ready.</p></header>
    <AdminProductEditor />
  </section>;
}
