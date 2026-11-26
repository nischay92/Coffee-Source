import type { Metadata } from 'next';
import BlendBuilder from '@/components/BlendBuilder';

export const metadata: Metadata = { title: 'Plan a custom blend', alternates: { canonical: '/shop/custom-blend/' } };

export default function CustomBlendPage() {
  return <section className="site-wrap shop-shell">
    <header className="page-heading"><p className="eyebrow">SIGNATURE BLENDS</p><h1>Plan a custom blend.</h1>
      <p>Choose proportions for Arabica, Robusta and chicory. We’ll confirm what we can make, the available pack sizes and the price for your request.</p>
    </header>
    <BlendBuilder />
  </section>;
}
