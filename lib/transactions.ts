import { query } from './db';
import { field, RequestError } from './http';
import { toMinor } from './money';

export const sources = ['razorpay', 'paypal', 'manual'] as const;
export const statuses = ['pending', 'paid', 'failed', 'partially_refunded', 'refunded'] as const;
export const manualMethods = ['Bank transfer', 'Cash', 'Direct UPI', 'Cheque', 'Other'] as const;
export const manualCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'CAD', 'AUD', 'SGD', 'JPY'] as const;

export type LedgerRow = {
  id: string; source: string; provider_ref: string | null; reference: string | null; method: string;
  amount_minor: string; refunded_minor: string; currency: string; status: string; note: string | null;
  recorded_by: string | null; occurred_at: Date;
};

function isDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^20\d{2}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp.getTime()) && timestamp.toISOString().slice(0, 10) === value;
}

export function transactionFilters(data: Record<string, unknown>) {
  const source = sources.find(item => item === data.source) ?? null;
  const status = statuses.find(item => item === data.status) ?? null;
  return [source, status, isDate(data.from) ? data.from : null, isDate(data.to) ? data.to : null];
}

const where = `WHERE ($1::text IS NULL OR source = $1) AND ($2::text IS NULL OR status = $2)
  AND ($3::date IS NULL OR occurred_at >= ($3::date::timestamp AT TIME ZONE 'Asia/Kolkata'))
  AND ($4::date IS NULL OR occurred_at < (($4::date + 1)::timestamp AT TIME ZONE 'Asia/Kolkata'))`;

export function transactionList(filters: (string | null)[], limit: number, offset = 0) {
  return query<LedgerRow>(`SELECT * FROM transactions ${where} ORDER BY occurred_at DESC, id DESC LIMIT $5 OFFSET $6`, [...filters, limit, offset]);
}

export function transactionTotals(filters: (string | null)[]) {
  return query<{ currency: string; count: string; collected: string; refunded: string }>(`
    SELECT currency, count(*), coalesce(sum(amount_minor) FILTER (WHERE status IN ('paid','partially_refunded','refunded')), 0) AS collected,
      coalesce(sum(refunded_minor), 0) AS refunded FROM transactions ${where} GROUP BY currency ORDER BY currency`, filters);
}

export async function recordManual(data: Record<string, unknown>, admin: string) {
  const currency = manualCurrencies.find(item => item === data.currency);
  const method = manualMethods.find(item => item === data.method);
  if (!currency || !method) throw new RequestError('Choose a supported currency and payment method.');
  const amount = toMinor(field(data.amount, 16, 'amount', true), currency);
  if (amount === null || amount <= 0) throw new RequestError('Enter a valid positive amount.');
  const date = field(data.date, 10, 'transaction date', true);
  if (!isDate(date) || +new Date(`${date}T00:00:00+05:30`) > Date.now()) throw new RequestError('Enter a valid transaction date.');
  const reference = field(data.reference, 140, 'reference');
  if (method !== 'Cash' && !reference) throw new RequestError('Enter a payment reference.');
  const invoice = field(data.invoice, 100, 'order or invoice number');
  const note = field(data.note, 400, 'note');
  const entryId = field(data.entryId, 60, 'submission ID', true);
  if (!/^[0-9a-f-]{36}$/i.test(entryId)) throw new RequestError('Invalid submission ID.');
  try {
    const { rowCount } = await query(`
      INSERT INTO transactions (source, provider_ref, reference, method, amount_minor, currency, status, note, recorded_by, occurred_at)
      VALUES ('manual', $1, $2, $3, $4, $5, 'paid', $6, $7, $8)
      ON CONFLICT (source, provider_ref) DO NOTHING`,
    [entryId, reference || null, method, amount, currency, [invoice && `Order/invoice: ${invoice}`, note].filter(Boolean).join(' · ') || null, admin, `${date}T00:00:00+05:30`]);
    return Boolean(rowCount);
  } catch (error) {
    if ((error as { code?: string }).code === '23505') throw new RequestError('A manual payment with this reference is already recorded.', 409);
    throw error;
  }
}
