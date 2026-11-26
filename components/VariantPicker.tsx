'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Variant } from '@/lib/catalogue';
import { readCart, saveCart } from '@/lib/cart-local';
import { formatMoney } from '@/lib/money';

type Option = Variant & { label: string };

export default function VariantPicker({ variants }: { variants: Option[] }) {
  const [variantId, selectVariant] = useState(variants.find(item => item.available > 0)?.id ?? variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const variant = variants.find(item => item.id === variantId);
  if (!variant) return <p className="status-note">Enquire with us about availability.</p>;
  const limit = Math.min(20, variant.available);
  const showQuantity = Math.min(quantity, Math.max(1, limit));

  function add() {
    if (!variant || limit < 1) return;
    const cart = readCart();
    const entry = cart.find(item => item.id === variant?.id);
    if ((entry?.quantity ?? 0) + showQuantity > limit) { setMessage('Your bag already contains the maximum available quantity.'); return; }
    if (!entry && cart.length >= 30) { setMessage('Your bag is at its item limit.'); return; }
    try {
      if (entry) entry.quantity += showQuantity;
      else cart.push({ id: variant.id, quantity: showQuantity });
      saveCart(cart);
      setMessage('Added to your bag.');
    } catch {
      setMessage('Your browser could not save the bag.');
    }
  }

  return <div className="panel flex flex-col gap-4">
    <p className="text-2xl font-semibold flex flex-wrap items-baseline gap-3">
      {formatMoney(variant.price_minor)}
      {variant.regular_price_minor != null && variant.regular_price_minor > variant.price_minor &&
        <del className="text-base font-normal text-coffee-700" aria-label={`Regular price ${formatMoney(variant.regular_price_minor)}`}>{formatMoney(variant.regular_price_minor)}</del>}
    </p>
    <label className="field">Coffee option<select value={variant.id} onChange={event => { selectVariant(event.target.value); setQuantity(1); setMessage(''); }}>
      {variants.map(item => <option key={item.id} value={item.id}>{item.label}{item.available < 1 ? ' — unavailable' : ''}</option>)}
    </select></label>
    <label className="field max-w-28">Quantity<input type="number" min={1} max={Math.max(1, limit)} value={showQuantity} disabled={limit < 1}
      onChange={event => setQuantity(Math.max(1, Number(event.target.value) || 1))} /></label>
    <div className="flex gap-4 flex-wrap items-center"><button className="action" type="button" disabled={limit < 1} onClick={add}>{limit < 1 ? 'Unavailable' : 'Add to bag'}</button>
      <Link className="text-link" href="/shop/cart">View bag</Link></div>
    {message && <p role="status">{message}</p>}
  </div>;
}
