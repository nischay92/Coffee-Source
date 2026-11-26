import type { Metadata } from 'next';
import ShopCatalogue from '@/components/ShopCatalogue';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Shop coffee', alternates: { canonical: '/shop/' } };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  return <ShopCatalogue search={typeof q === 'string' ? q.slice(0, 100) : ''} />;
}
