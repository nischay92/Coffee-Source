import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ShopCatalogue from '@/components/ShopCatalogue';
import { collections } from '@/lib/content';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ collection: string }>; searchParams: Promise<{ q?: string | string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params;
  const category = collections.find(item => item.slug === collection);
  return category ? { title: category.name, alternates: { canonical: `/shop/collection/${collection}/` } } : {};
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { collection } = await params;
  if (!collections.some(item => item.slug === collection)) notFound();
  const { q } = await searchParams;
  return <ShopCatalogue collection={collection} search={typeof q === 'string' ? q.slice(0, 100) : ''} />;
}
