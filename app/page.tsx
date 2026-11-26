import Image from 'next/image';
import Link from 'next/link';
import { Coffee, MapPin, PackageCheck } from 'lucide-react';
import { collections, services } from '@/lib/content';
import { featuredCoffees } from '@/lib/catalogue';
import { isProductUpload } from '@/lib/product-media';

export const revalidate = 300;

export default async function HomePage() {
  const featured = await featuredCoffees().catch(() => []);
  return (
    <>
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span /> COORG, KARNATAKA</div>
          <h1>A better cup<br />{' '}begins at<br className="hidden sm:block" /> <em>the source.</em></h1>
          <p>Discover Arabica, Robusta and signature blends from the coffee-growing hills of Coorg.</p>
          <div className="flex flex-wrap gap-3">
            <Link className="action" href="/shop">Explore our coffee</Link>
            <Link className="action action-outline" href="/bulk-sourcing">Discover our sourcing</Link>
          </div>
        </div>
        <div className="hero-photo">
          <Image src="/images/coffee-roasting.png" fill priority quality={85} sizes="(max-width: 767px) 100vw, 53vw" alt="Roasted coffee beans spilling into a ceramic bowl" />
          <div className="hero-caption">From Coorg to your cup</div>
        </div>
      </section>

      <div className="home-highlights">
        <div><MapPin aria-hidden="true" /><span>Coorg-origin coffee</span></div>
        <div><Coffee aria-hidden="true" /><span>Arabica, Robusta &amp; blends</span></div>
        <div><PackageCheck aria-hidden="true" /><span>Retail &amp; bulk supply</span></div>
      </div>

      <section className="site-wrap editorial-section">
        <div className="section-intro">
          <div><p className="eyebrow">THE COFFEE COLLECTION</p><h2>Find your coffee.</h2></div>
          <Link href="/shop" className="text-link">View the shop</Link>
        </div>
        <div className="collection-grid">
          {collections.map(({ slug, name, image, alt }) => (
            <Link key={slug} className="collection-card" href={`/shop/collection/${slug}`}>
              <div className="collection-photo"><Image src={image} alt={alt} fill sizes="(max-width: 767px) 50vw, 25vw" /></div>
              <h3>{name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && <section className="site-wrap editorial-section pt-0">
        <div className="section-intro"><h2>Featured coffee.</h2><Link className="text-link" href="/shop">View the shop</Link></div>
        <div className="collection-grid">
          {featured.map(product => <Link className="collection-card" key={product.handle} href={`/shop/product/${product.handle}`}>
            <div className="collection-photo">{product.image_path
              ? <Image src={product.image_path} unoptimized={isProductUpload(product.image_path)} alt={product.image_alt || product.title} fill sizes="(max-width: 767px) 50vw, 25vw" />
              : <div className="product-photo-empty"><Coffee aria-hidden="true" /></div>}</div>
            <h3>{product.title}</h3>
          </Link>)}
        </div>
      </section>}

      <section className="origin-grid">
        <div className="origin-photo"><Image src="/images/coffee-plantation.png" fill sizes="(max-width: 767px) 100vw, 50vw" alt="Coffee plants growing under a shaded canopy" /></div>
        <div className="origin-copy">
          <p className="eyebrow">OUR ORIGIN</p>
          <h2>Rooted in Coorg.</h2>
          <p>In the hills of Kodagu, coffee grows under a canopy of shade trees. BeanSource brings that place closer to the people who brew, roast and serve its coffee.</p>
          <Link href="/about" className="action action-light">Our story</Link>
        </div>
      </section>

      <section className="site-wrap editorial-section">
        <div className="section-intro"><div><p className="eyebrow">FOR BUSINESSES</p><h2>Coffee for your business.</h2></div></div>
        <div className="service-grid">
          {services.map(service => (
            <Link href={`/${service.slug}`} key={service.slug}>
              <h3>{service.title}</h3><p>{service.short}</p><span className="text-link">Explore service</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
