import type { Metadata } from 'next';
import Link from 'next/link';
import AdminForm from '@/components/AdminForms';
import { adminConfig, currentAdmin } from '@/lib/admin-auth';
import { databaseConfigured, query } from '@/lib/db';
import { formatMoney } from '@/lib/money';
import { paypalConfigured } from '@/lib/paypal';
import { razorpayCredentials } from '@/lib/razorpay';
import { manualCurrencies, manualMethods, sources, statuses, transactionFilters, transactionList, transactionTotals } from '@/lib/transactions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'BeanSource admin', robots: { index: false, follow: false }, referrer: 'no-referrer' };

const sourceName: Record<string, string> = { razorpay: 'Razorpay', paypal: 'PayPal', manual: 'Manual' };
const orderStatus: Record<string, string> = { paid: 'Paid', paid_review: 'Paid · needs review', pending: 'Pending', closed: 'Closed', refunded: 'Refunded' };
const statusName = (value: string) => value.replaceAll('_', ' ').replace(/^./, letter => letter.toUpperCase());
const displayDate = (date: Date) => date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });

type Query = Record<string, string | string[] | undefined>;
type OrderRow = {
  id: string; display_status: string; fulfilment_status: string; tracking_reference: string | null;
  subtotal_minor: number; shipping_minor: number; created_at: Date;
  customer: { name: string; email: string; phone: string; address: string; city: string; state: string; pin: string };
  items: string[] | null;
};
type Enquiry = { id: string; service: string; created_at: Date; contact: Record<string, string> };

export default async function AdminPage({ searchParams }: { searchParams: Promise<Query> }) {
  const configured = databaseConfigured() && adminConfig();
  if (!configured) return <section className="site-wrap shop-shell"><header className="page-heading"><h1>BeanSource admin</h1></header><p className="status-note">Admin access is unavailable. Configure the database and admin account to continue.</p></section>;
  const admin = await currentAdmin();
  if (!admin) return <section className="site-wrap shop-shell max-w-lg">
    <header className="page-heading"><p className="eyebrow">BEANSOURCE STAFF</p><h1>Admin sign in</h1></header>
    <AdminForm action="login" label="Sign in">
      <label className="field wide">Username<input name="username" autoComplete="username" required maxLength={100} /></label>
      <label className="field wide">Password<input name="password" type="password" autoComplete="current-password" required maxLength={256} /></label>
    </AdminForm>
  </section>;

  const params = await searchParams;
  const filters = transactionFilters(params);
  const page = typeof params.page === 'string' && /^\d{1,4}$/.test(params.page) ? Math.max(1, Number(params.page)) : 1;
  const queryString = new URLSearchParams(Object.fromEntries(
    ['source', 'status', 'from', 'to'].flatMap((key, i) => filters[i] ? [[key, filters[i] as string]] : []),
  ));
  const [transactions, totals, orders, enquiries] = await Promise.all([
    transactionList(filters, 31, (page - 1) * 30),
    transactionTotals(filters),
    query<OrderRow>(`SELECT id, customer, subtotal_minor, shipping_minor, created_at, fulfilment_status, tracking_reference,
      CASE WHEN status = 'pending' AND reservation_expires_at <= now() THEN 'closed' ELSE status END AS display_status,
      (SELECT array_agg(i.quantity || ' × ' || i.product_title || ' (' || i.variant_label || ')') FROM order_items i WHERE i.order_id = o.id) AS items
      FROM orders o ORDER BY created_at DESC LIMIT 20`),
    query<Enquiry>('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 20'),
  ]);
  const razorpay = razorpayCredentials();
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const pageLink = (value: number) => {
    const query = new URLSearchParams(queryString);
    query.set('page', String(value));
    return `/admin/?${query}#transactions`;
  };

  return <section className="site-wrap shop-shell">
    <header className="page-heading flex flex-wrap justify-between items-end gap-4">
      <div><p className="eyebrow">BEANSOURCE STAFF</p><h1>Transactions &amp; orders</h1><p>Signed in as {admin}.</p></div>
      <Link className="action mb-4" href="/admin/products/new/">Add product</Link>
    </header>
    <nav className="shop-filters" aria-label="Admin sections"><a href="#transactions">Transactions</a><a href="#record">Record or sync</a><a href="#orders">Retail orders</a><a href="#enquiries">Enquiries</a></nav>

    <section className="panel mb-6" id="transactions">
      <h2 className="font-serif text-3xl">Transactions</h2>
      <form className="flex gap-3 flex-wrap items-end my-5" action="/admin/" method="get">
        <label className="field">Source<select name="source" defaultValue={filters[0] ?? ''}><option value="">All sources</option>{sources.map(source => <option key={source} value={source}>{sourceName[source]}</option>)}</select></label>
        <label className="field">Status<select name="status" defaultValue={filters[1] ?? ''}><option value="">All statuses</option>{statuses.map(status => <option key={status} value={status}>{statusName(status)}</option>)}</select></label>
        <label className="field">From (IST)<input name="from" type="date" defaultValue={filters[2] ?? ''} /></label>
        <label className="field">To (IST)<input name="to" type="date" defaultValue={filters[3] ?? ''} /></label>
        <button className="action" type="submit">Apply filters</button>
        <a className="action action-outline" href={`/api/admin/export/?${queryString}`}>Download CSV</a>
      </form>
      <div className="flex flex-wrap gap-3 my-5">
        {totals.rows.map(row => <div className="border border-coffee-200 p-3 min-w-40" key={row.currency}>
          <p className="text-sm">{row.currency} · {row.count} records</p>
          <p className="text-xl font-semibold">{formatMoney(Number(row.collected) - Number(row.refunded), row.currency)}</p>
          <p className="text-sm">Collected less refunds</p>
        </div>)}
      </div>
      {transactions.rows.length ? <>
        <div className="overflow-x-auto"><table className="admin-table">
          <thead><tr>{['Date (IST)', 'Source', 'Method', 'Reference', 'Amount', 'Refunded', 'Status', 'Note'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
          <tbody>{transactions.rows.slice(0, 30).map(row => <tr key={row.id}>
            <td>{displayDate(row.occurred_at)}</td><td>{sourceName[row.source]}</td><td>{row.method}</td>
            <td>{row.reference || '—'}{row.source !== 'manual' && row.provider_ref && <small className="block">{row.provider_ref}</small>}</td>
            <td>{formatMoney(Number(row.amount_minor), row.currency)}</td><td>{Number(row.refunded_minor) ? formatMoney(Number(row.refunded_minor), row.currency) : '—'}</td>
            <td>{statusName(row.status)}</td><td className="!whitespace-normal min-w-40">{row.note || '—'}{row.recorded_by && <small className="block">By {row.recorded_by}</small>}</td>
          </tr>)}</tbody>
        </table></div>
        {(page > 1 || transactions.rows.length > 30) && <div className="flex gap-4 mt-4">
          {page > 1 && <Link className="text-link" href={pageLink(page - 1)}>Previous</Link>}
          {transactions.rows.length > 30 && <Link className="text-link" href={pageLink(page + 1)}>Next</Link>}
        </div>}
      </> : <p className="status-note">No transactions match these filters.</p>}
    </section>

    <div className="cart-layout mb-6" id="record">
      <AdminForm action="manual" label="Record received payment">
        <h2 className="wide font-serif text-3xl">Add a manual transaction</h2>
        <p className="wide text-sm">For payments already received by cash, bank transfer or direct UPI. Use gateway sync for Razorpay or PayPal payments.</p>
        <label className="field">Amount<input name="amount" inputMode="decimal" required maxLength={13} /></label>
        <label className="field">Currency<select name="currency" defaultValue="INR">{manualCurrencies.map(currency => <option key={currency}>{currency}</option>)}</select></label>
        <label className="field">Date (IST)<input name="date" type="date" defaultValue={today} max={today} required /></label>
        <label className="field">Method<select name="method">{manualMethods.map(method => <option key={method}>{method}</option>)}</select></label>
        <label className="field">Payment reference<input name="reference" maxLength={140} /></label>
        <label className="field">Order or invoice number<input name="invoice" maxLength={100} /></label>
        <label className="field wide">Note<textarea name="note" maxLength={400} /></label>
      </AdminForm>
      <div className="panel flex flex-col gap-6">
        <h2 className="font-serif text-3xl">Sync gateway records</h2>
        {razorpay ? <AdminForm action="razorpay" label="Sync Razorpay" className="flex flex-col gap-3">
          <label className="field">Razorpay payment ID ({razorpay.id.startsWith('rzp_test_') ? 'test' : 'live'})<input name="paymentId" placeholder="Blank syncs the latest 25" maxLength={80} /></label>
        </AdminForm> : <p className="status-note">Razorpay sync is awaiting gateway credentials.</p>}
        {paypalConfigured() ? <AdminForm action="paypal" label="Sync PayPal invoice" className="flex flex-col gap-3">
          <label className="field">PayPal invoice ID<input name="invoiceId" required placeholder="INV2-…" maxLength={70} /></label>
        </AdminForm> : <p className="status-note">PayPal sync is awaiting API credentials. Invoices can be sent from PayPal.</p>}
      </div>
    </div>

    <section className="panel mb-6" id="orders">
      <h2 className="font-serif text-3xl mb-4">Recent retail orders</h2>
      {!orders.rows.length && <p className="status-note">No retail orders yet.</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {orders.rows.map(order => <details key={order.id} className="border border-coffee-200 p-3">
          <summary className="cursor-pointer font-semibold">#{order.id.slice(0, 8).toUpperCase()} · {orderStatus[order.display_status]} · {formatMoney(order.subtotal_minor + order.shipping_minor)}</summary>
          <div className="my-3">
            <p>{displayDate(order.created_at)} · {order.customer.name}</p>
            <p>{order.customer.email} · {order.customer.phone}</p>
            <p>{order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.pin}</p>
            <ul className="list-disc pl-5 mt-2">{order.items?.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
          {order.display_status === 'paid' && <AdminForm action="fulfilment" label="Save fulfilment" className="form-grid">
            <input type="hidden" name="orderId" value={order.id} />
            <label className="field">Fulfilment<select name="status" defaultValue={order.fulfilment_status}>{['pending', 'processing', 'shipped', 'delivered'].map(status => <option value={status} key={status}>{statusName(status)}</option>)}</select></label>
            <label className="field">Tracking reference<input name="tracking" defaultValue={order.tracking_reference ?? ''} maxLength={140} /></label>
          </AdminForm>}
        </details>)}
      </div>
    </section>
    <section className="panel" id="enquiries">
      <h2 className="font-serif text-3xl mb-4">Recent enquiries</h2>
      {!enquiries.rows.length && <p className="status-note">No enquiries yet.</p>}
      <div className="grid md:grid-cols-2 gap-3">
        {enquiries.rows.map(enquiry => <details key={enquiry.id} className="border border-coffee-200 p-3">
          <summary className="cursor-pointer">{displayDate(enquiry.created_at)} · {statusName(enquiry.service.replaceAll('-', ' '))} · {enquiry.contact.name}</summary>
          <dl className="mt-3 break-words">{Object.entries(enquiry.contact).map(([key, value]) => value && <div key={key} className="mt-1"><dt className="inline font-semibold">{statusName(key === 'companyName' ? 'company' : key)}: </dt><dd className="inline whitespace-pre-wrap">{value}</dd></div>)}</dl>
        </details>)}
      </div>
    </section>
  </section>;
}
