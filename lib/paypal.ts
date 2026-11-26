import { query } from './db';
import { RequestError } from './http';
import { toMinor } from './money';

type Money = { currency_code: string; value: string };
type Invoice = {
  id: string; status: string; detail?: { invoice_number?: string };
  payments?: { transactions?: { type?: string; payment_id?: string; payment_date?: string; amount?: Money }[] };
  refunds?: { refund_amount?: Money; transactions?: { type?: string }[] };
};

export function paypalConfigured() {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

const api = () => process.env.PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

async function accessToken() {
  if (!paypalConfigured()) throw new RequestError('PayPal sync is not configured.', 503);
  const token = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${api()}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${token}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new RequestError('Could not authenticate to PayPal.', 502);
  return (await response.json()).access_token as string;
}

export async function importPaypalInvoice(id: string) {
  if (!/^INV2-[A-Z0-9-]{4,60}$/i.test(id)) throw new RequestError('Enter the PayPal invoice ID (INV2-…).');
  const token = await accessToken();
  const response = await fetch(`${api()}/v2/invoicing/invoices/${id}`, {
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new RequestError('PayPal could not retrieve that invoice.', 502);
  const invoice = await response.json() as Invoice;
  if (!['PAID', 'PARTIALLY_PAID', 'REFUNDED', 'PARTIALLY_REFUNDED'].includes(invoice.status)) return 0;
  const payments = invoice.payments?.transactions ?? [];
  const refundTotal = invoice.refunds?.refund_amount;
  const refunds = refundTotal && Number(refundTotal.value) !== 0 ? refundTotal : undefined;
  const history = invoice.refunds?.transactions ?? [];
  if (refunds && (payments.length !== 1 || history.some(refund => refund.type !== 'PAYPAL'))) {
    throw new RequestError('This invoice has a mixed payment or refund history. Reconcile it in PayPal.', 409);
  }
  let imported = 0;
  for (const payment of payments) {
    if (payment.type !== 'PAYPAL' || !payment.payment_id || !payment.amount || !payment.payment_date) continue;
    const currency = payment.amount.currency_code;
    const amount = /^[A-Z]{3}$/.test(currency) ? toMinor(payment.amount.value, currency) : null;
    const returned = refunds?.currency_code === currency ? toMinor(refunds.value, currency) : 0;
    if (!amount || returned === null || returned > amount || (refunds && refunds.currency_code !== currency) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(payment.payment_date)) throw new RequestError('PayPal returned an unexpected payment amount or date.', 502);
    const status = returned === amount ? 'refunded' : returned > 0 ? 'partially_refunded' : 'paid';
    await query(`
      INSERT INTO transactions (source, provider_ref, reference, method, amount_minor, refunded_minor, currency, status, occurred_at, note)
      VALUES ('paypal', $1, $2, 'PayPal invoice', $3, $4, $5, $6, $7, $8)
      ON CONFLICT (source, provider_ref) DO UPDATE SET
        refunded_minor = greatest(EXCLUDED.refunded_minor, transactions.refunded_minor),
        status = CASE WHEN EXCLUDED.refunded_minor >= transactions.refunded_minor THEN EXCLUDED.status ELSE transactions.status END`,
    [payment.payment_id, invoice.id, amount, returned, currency, status, `${payment.payment_date}T00:00:00+05:30`, invoice.detail?.invoice_number ?? null]);
    imported++;
  }
  return imported;
}

export async function verifyPaypalWebhook(request: Request, body: string) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) throw new RequestError('PayPal webhook is not configured.', 503);
  const fields = {
    auth_algo: request.headers.get('paypal-auth-algo'),
    cert_url: request.headers.get('paypal-cert-url'),
    transmission_id: request.headers.get('paypal-transmission-id'),
    transmission_sig: request.headers.get('paypal-transmission-sig'),
    transmission_time: request.headers.get('paypal-transmission-time'),
    webhook_id: webhookId,
  };
  if (Object.values(fields).some(value => !value || value.length > 2048)) return false;
  const response = await fetch(`${api()}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json' },
    body: `${JSON.stringify(fields).slice(0, -1)},"webhook_event":${body}}`,
    signal: AbortSignal.timeout(8000),
    cache: 'no-store',
  });
  if (!response.ok) throw new RequestError('PayPal could not verify this webhook.', 502);
  return (await response.json()).verification_status === 'SUCCESS';
}
