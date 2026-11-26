import type { Metadata } from 'next';
import CartCheckout from '@/components/CartCheckout';

export const metadata: Metadata = { title: 'Your bag', robots: { index: false, follow: false } };

export default function CartPage() {
  return <section className="site-wrap shop-shell">
    <header className="page-heading"><p className="eyebrow">BEANSOURCE SHOP</p><h1>Your bag</h1></header>
    <CartCheckout />
  </section>;
}
