import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About BeanSource',
  description: 'Learn about BeanSource and the coffee-growing region of Coorg, Karnataka.',
  alternates: { canonical: '/about/' },
};

export default function AboutPage() {
  return <>
    <section className="service-hero">
      <div className="service-copy">
        <p className="eyebrow">COORG · KODAGU, INDIA</p>
        <h1>Rooted in Coorg.</h1>
        <p>BeanSource brings Arabica, Robusta and coffee blends from Coorg to customers who brew, roast and serve coffee.</p>
        <Link href="/bulk-sourcing" className="action">Explore sourcing</Link>
      </div>
      <div className="service-photo"><Image src="/images/coffee-plantation.png" fill priority sizes="(max-width: 767px) 100vw, 50vw" alt="Coffee plants shaded by taller trees" /></div>
    </section>
    <section className="site-wrap editorial-section">
      <div className="section-intro"><div><p className="eyebrow">FROM PLANT TO BEAN</p><h2>The work behind the cup.</h2></div></div>
      <div className="shop-products">
        {[
          { src: '/images/coffee-harvesting.png', alt: 'Ripe coffee cherries', name: 'Harvest' },
          { src: '/images/coffee-drying.png', alt: 'Coffee beans laid out to dry', name: 'Drying' },
          { src: '/images/coffee-roasting.png', alt: 'Roasted coffee beans', name: 'Roasting' },
        ].map(step => <figure className="collection-card" key={step.name}>
          <div className="collection-photo"><Image src={step.src} alt={step.alt} fill sizes="(max-width: 767px) 50vw, 33vw" /></div>
          <figcaption className="p-4 font-serif text-xl">{step.name}</figcaption>
        </figure>)}
      </div>
      <p className="max-w-2xl mt-7 leading-relaxed">Coffee begins as a cherry. Harvesting, drying and roasting shape what reaches the cup. Our sourcing conversations start with the variety, processing, grade and use you’re looking for.</p>
      <Link href="/shop" className="text-link inline-block mt-4">Explore the shop</Link>
    </section>
  </>;
}
