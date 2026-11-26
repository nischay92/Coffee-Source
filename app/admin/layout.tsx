import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AdminForm from '@/components/AdminForms';
import { currentAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await currentAdmin();
  return <>
    <div className="admin-bar">
      <div className="site-wrap admin-bar-inner">
        <span className="brand"><Image src="/images/logo-icon.png" alt="" width={40} height={40} />BeanSource Admin</span>
        {admin && <nav className="admin-navigation" aria-label="Admin navigation">
          <Link href="/admin/">Overview</Link>
          <Link href="/admin/products/">Products</Link>
          <AdminForm action="logout" label="Sign out" className="admin-sign-out" />
        </nav>}
      </div>
    </div>
    {children}
  </>;
}
