import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { cache } from 'react';
import { Coffee } from 'lucide-react';
import { notFound } from 'next/navigation';
import VariantPicker from '@/components/VariantPicker';
import { getProducts, variantLabel } from '@/lib/catalogue';

export const dynamic = 'force-dynamic';
const findProduct = cache(async (handle: string) => (await getProducts({ handle }))[0]);
type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await findProduct(handle);
  return product ? { title: product.title, description: product.description.slice(0, 160), alternates: { canonical: `/shop/product/${handle}/` } } : {};
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await findProduct(handle);
  if (!product) notFound();
  const details = [['Origin', product.origin], ['Variety', product.variety], ['Processing', product.processing]];
  const json = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: product.title,
    description: product.description, ...(product.image_path && process.env.SITE_URL ? { image: new URL(product.image_path, process.env.SITE_URL).href } : {}),
    ...(product.variants.length ? { offers: product.variants.map(variant => ({
      '@type': 'Offer', priceCurrency: 'INR', price: (variant.price_minor / 100).toFixed(2),
      availability: variant.available > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    })) } : {}),
  }).replace(/</g, '\\u003c');
  return <section className="site-wrap editorial-section">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
    <Link className="text-link inline-block mb-6" href="/shop">Back to shop</Link>
    <div className="store-product">
      <div>
        <div className="product-photo">{product.image_path ? <Image src={product.image_path} alt={product.image_alt || product.title} fill sizes="(max-width: 767px) 100vw, 50vw" priority /> :
          <div className="product-photo-empty"><Coffee size={48} aria-hidden="true" /></div>}</div>
        {product.images.length > 1 && <div className="grid grid-cols-2 gap-3 mt-3">{product.images.slice(1).map(photo =>
          <div key={photo.path} className="product-photo"><Image src={photo.path} alt={photo.alt} fill sizes="(max-width: 767px) 50vw, 25vw" /></div>)}</div>}
      </div>
      <div>
        <header className="page-heading !pt-0"><h1>{product.title}</h1><p>{product.description}</p></header>
        <dl className="product-meta">{details.map(([label, value]) => value && <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <VariantPicker variants={product.variants.map(variant => ({ ...variant, label: variantLabel(variant) }))} />
      </div>
    </div>
  </section>;
}
