'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import type { CartLine } from '@/lib/catalogue';
import { readCart, saveCart, type CartSelection } from '@/lib/cart-local';
import { formatMoney } from '@/lib/money';

type Cart = { lines: (CartLine & { label: string })[]; shipping: number | null; available: boolean; test: boolean };
type Checkout = { token: string; providerOrder: string; amount: number; currency: string; key: string };
type RazorpayResult = { razorpay_payment_id: string; razorpay_signature: string };
type RazorpayOptions = {
  key: string; amount: number; currency: string; name: string; order_id: string; timeout: number;
  prefill: { name: string; email: string; contact: string };
  handler: (result: RazorpayResult) => Promise<void>; modal: { ondismiss: () => void };
};
type RazorpayConstructor = new (options: RazorpayOptions) => { open: () => void };

async function post<T>(url: string, data: object): Promise<T> {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Please try again.');
  return result;
}

async function loadRazorpay() {
  const gateway = window as Window & { Razorpay?: RazorpayConstructor };
  if (gateway.Razorpay) return gateway.Razorpay;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); reject(new Error('The payment window could not load.')); };
    document.head.append(script);
  });
  if (!gateway.Razorpay) throw new Error('The payment window could not load.');
  return gateway.Razorpay;
}

export default function CartCheckout() {
  const [items, setItems] = useState<CartSelection[] | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [cartError, setCartError] = useState('');
  const [orderLink, setOrderLink] = useState('');
  const [revision, refresh] = useState(0);

  useEffect(() => { setItems(readCart()); }, []);
  useEffect(() => {
    setCart(null);
    setCartError('');
    if (!items?.length) return;
    let current = true;
    post<Cart>('/api/shop/cart/', { items }).then(result => {
      if (current) setCart(result);
    }).catch(error => {
      if (current) setCartError(error.message);
    });
    return () => { current = false; };
  }, [items, revision]);

  function change(next: CartSelection[]) {
    try {
      saveCart(next);
      setItems(next);
      setNotice('');
    } catch {
      setNotice('Your browser could not save the bag.');
    }
  }

  const subtotal = cart?.lines.reduce((sum, item) => sum + item.quantity * item.price_minor, 0) ?? 0;
  const total = subtotal + (cart?.shipping ?? 0);
  const complete = Boolean(cart && items && cart.lines.length === items.length && cart.lines.every(item => item.quantity <= item.available));

  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !cart?.available || !items || !complete) return;
    const customer = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    setBusy(true);
    setNotice('');
    try {
      const Razorpay = await loadRazorpay();
      const payment = await post<Checkout>('/api/shop/checkout/', { action: 'start', items, customer, expectedTotal: total });
      const href = `/shop/order/${payment.token}/`;
      setOrderLink(href);
      const gateway = new Razorpay({
        key: payment.key, amount: payment.amount, currency: payment.currency, name: 'BeanSource',
        order_id: payment.providerOrder, timeout: 900,
        prefill: { name: customer.name, email: customer.email, contact: customer.phone },
        handler: async result => {
          try {
            const outcome = await post<{ status: string }>('/api/shop/checkout/', {
              action: 'verify', token: payment.token, paymentId: result.razorpay_payment_id, signature: result.razorpay_signature,
            });
            if (outcome.status === 'paid' || outcome.status === 'paid_review') {
              try { saveCart([]); } catch { /* The order record is already saved. */ }
            }
          } catch {
            // Show the last confirmed order state while the provider verifies payment.
          } finally {
            window.location.assign(href);
          }
        },
        modal: { ondismiss: () => {
          setBusy(false);
          setNotice('Payment window closed. Check the order status before trying another payment.');
        } },
      });
      gateway.open();
    } catch (error) {
      setBusy(false);
      setNotice(error instanceof Error ? error.message : 'Checkout could not start.');
      refresh(value => value + 1);
    }
  }

  if (!items) return <p role="status">Loading your bag…</p>;
  if (!items.length) return <div className="panel"><h2 className="font-serif text-2xl">Your bag is empty</h2><Link className="action mt-4" href="/shop">Explore the shop</Link></div>;
  if (cartError) return <p className="status-note status-error" role="status">{cartError} <button className="text-link" onClick={() => refresh(value => value + 1)}>Retry</button></p>;
  if (!cart) return <p role="status">Checking prices and availability…</p>;

  return <div className="cart-layout">
    <div className="panel">
      <h2 className="font-serif text-2xl">Coffee in your bag</h2>
      {items.map(item => {
        const line = cart.lines.find(entry => entry.id === item.id);
        const label = line?.title ?? 'Unavailable coffee';
        return <div className="summary-row border-b border-coffee-200 flex-wrap" key={item.id}>
          <div>
            {line ? <Link className="text-link" href={`/shop/product/${line.handle}`}>{label}</Link> : <span>{label}</span>}
            {line && <p className="text-sm mt-1">{line.label}</p>}
            {line && item.quantity > line.available && <p className="text-sm text-red-800 mt-1">{line.available ? `Only ${line.available} available` : 'Out of stock'}</p>}
            <button className="text-link text-sm mt-2" disabled={busy} onClick={() => change(items.filter(entry => entry.id !== item.id))}>Remove</button>
          </div>
          {line && <label className="field w-20">Quantity<select disabled={busy || line.available < 1} value={item.quantity}
            onChange={event => change(items.map(entry => entry.id === item.id ? { ...entry, quantity: Number(event.target.value) } : entry))}>
            {item.quantity > line.available && <option value={item.quantity} disabled>{item.quantity}</option>}
            {Array.from({ length: Math.min(20, line.available) }, (_, i) => <option value={i + 1} key={i + 1}>{i + 1}</option>)}
          </select></label>}
          {line && <p className="font-semibold">{formatMoney(line.price_minor * item.quantity)}</p>}
        </div>;
      })}
      <div className="summary-row"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
      <div className="summary-row"><span>India delivery</span><span>{cart.shipping === null ? 'Not configured' : formatMoney(cart.shipping)}</span></div>
      {cart.shipping !== null && <div className="summary-row font-semibold border-t border-coffee-200"><span>Total</span><span>{formatMoney(total)}</span></div>}
    </div>
    <form className="panel form-grid" onSubmit={checkout}>
      <h2 className="wide font-serif text-2xl">Delivery details</h2>
      <p className="wide text-sm">India delivery · Guest checkout</p>
      {!cart.available ? <p className="wide status-note">Online checkout is currently unavailable. <Link className="text-link" href="/contact">Contact us</Link> for help ordering.</p> : <>
        {cart.test && <p className="wide status-note">Razorpay test checkout. Use sandbox payment details only.</p>}
        <label className="field">Full name<input name="name" autoComplete="name" required maxLength={100} /></label>
        <label className="field">Email<input name="email" type="email" autoComplete="email" required maxLength={180} /></label>
        <label className="field">Phone<input name="phone" type="tel" autoComplete="tel" required maxLength={20} /></label>
        <label className="field">PIN code<input name="pin" autoComplete="shipping postal-code" required pattern="[1-9][0-9]{5}" inputMode="numeric" maxLength={6} /></label>
        <label className="field wide">Address<input name="address" autoComplete="shipping street-address" required maxLength={240} /></label>
        <label className="field">City<input name="city" autoComplete="shipping address-level2" required maxLength={100} /></label>
        <label className="field">State<input name="state" autoComplete="shipping address-level1" required maxLength={100} /></label>
        <div className="wide"><button className="action" type="submit" disabled={busy || !complete || Boolean(orderLink)}>{busy ? 'Opening checkout…' : 'Pay with Razorpay'}</button></div>
      </>}
      {notice && <p className="wide status-note status-error" role="status">{notice}</p>}
      {orderLink && <div className="wide flex flex-wrap gap-3"><Link className="text-link" href={orderLink}>Check order status</Link>
        {!busy && <button type="button" className="text-link" onClick={() => { setOrderLink(''); refresh(value => value + 1); }}>Start a new checkout</button>}</div>}
    </form>
  </div>;
}
