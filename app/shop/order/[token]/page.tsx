import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { databaseConfigured, query } from '@/lib/db';
import { formatMoney } from '@/lib/money';
import { findOrder } from '@/lib/orders';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Order status', robots: { index: false, follow: false }, referrer: 'no-referrer' };

const labels: Record<string, string> = {
  pending: 'Awaiting payment confirmation', closed: 'Checkout window closed',
  paid: 'Payment confirmed', paid_review: 'Payment received — order under review', refunded: 'Payment refunded',
};

export default async function OrderPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = databaseConfigured() ? await findOrder(token) : null;
  if (!order) notFound();
  const { rows: items } = await query<{ product_title: string; variant_label: string; quantity: number; price_minor: number }>(
    'SELECT product_title, variant_label, quantity, price_minor FROM order_items WHERE order_id = $1 ORDER BY product_title', [order.id],
  );
  return <section className="site-wrap shop-shell max-w-3xl">
    <header className="page-heading"><p className="eyebrow">ORDER {order.id.slice(0, 8).toUpperCase()}</p><h1>Order status</h1><p>Save this private link to check on your order.</p></header>
    <div className="panel">
      <h2 className="font-serif text-2xl">{labels[order.display_status]}</h2>
      {order.display_status === 'pending' && <p className="mt-2">If you’ve paid, refresh this page in a moment.</p>}
      {order.status === 'paid' && <p className="mt-2">Fulfilment: {order.fulfilment_status}{order.tracking_reference ? ` · Tracking: ${order.tracking_reference}` : ''}</p>}
      <ul className="mt-5">
        {items.map((item, index) => <li className="summary-row border-b border-coffee-200" key={index}><span>{item.quantity} × {item.product_title}<small className="block">{item.variant_label}</small></span><span>{formatMoney(item.price_minor * item.quantity)}</span></li>)}
      </ul>
      <div className="summary-row"><span>Delivery</span><span>{formatMoney(order.shipping_minor)}</span></div>
      <div className="summary-row font-semibold"><span>Total</span><span>{formatMoney(order.subtotal_minor + order.shipping_minor)}</span></div>
      <Link className="text-link inline-block mt-3" href="/contact">Contact us about this order</Link>
    </div>
  </section>;
}
