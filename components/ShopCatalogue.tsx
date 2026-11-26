import { Coffee } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/catalogue';
import { collections } from '@/lib/content';
import { formatMoney } from '@/lib/money';

export default async function ShopCatalogue({ collection, search }: { collection?: string; search: string }) {
  const category = collections.find(item => item.slug === collection);
  const products = await getProducts({ collection, search });
  const action = category ? `/shop/collection/${category.slug}/` : '/shop/';
  return (
    <section className="site-wrap shop-shell">
      <header className="page-heading"><p className="eyebrow">BEANSOURCE COFFEE</p><h1>{category?.name ?? 'Shop coffee'}</h1><p>Explore green and roasted coffee, signature blends and gifts from Coorg.</p></header>
      <form className="shop-search" id="search" method="get" action={action}>
        <label className="field">Search coffee<input name="q" type="search" maxLength={100} placeholder="Try Arabica, Robusta or a grade" defaultValue={search} /></label>
        <button className="action" type="submit">Search</button>
      </form>
      <nav className="shop-filters" aria-label="Coffee collections">
        <Link href="/shop" aria-current={!category ? 'page' : undefined}>All coffee</Link>
        {collections.map(item => <Link key={item.slug} href={`/shop/collection/${item.slug}`} aria-current={category?.slug === item.slug ? 'page' : undefined}>{item.name}</Link>)}
      </nav>
      {products.length ? <div className="shop-products">
        {products.map(product => <Link href={`/shop/product/${product.handle}`} className="collection-card" key={product.id}>
          <div className="product-photo">
            {product.image_path ? <Image src={product.image_path} alt={product.image_alt || product.title} fill sizes="(max-width: 767px) 50vw, 33vw" />
              : <div className="product-photo-empty"><Coffee size={38} aria-hidden="true" /></div>}
          </div>
          <h3>{product.title}</h3>
          <p className="px-4 pb-4 text-sm">{product.variants.length ? `From ${formatMoney(product.variants[0].price_minor)}` : 'Availability by enquiry'}</p>
        </Link>)}
      </div> : <div className="panel">
        <h2 className="font-serif text-2xl">{search ? 'No matching coffees' : 'No coffees listed here yet'}</h2>
        <p className="mt-2">{search ? 'Try a different search or explore another collection.' : 'Get in touch for current coffee availability and sourcing enquiries.'}</p>
        <Link className="text-link inline-block mt-3" href={search ? action : '/contact'}>{search ? 'Clear search' : 'Contact BeanSource'}</Link>
      </div>}
      {collection === 'signature-blends' && <Link href="/shop/custom-blend" className="text-link inline-block mt-6">Plan a custom blend</Link>}
    </section>
  );
}
