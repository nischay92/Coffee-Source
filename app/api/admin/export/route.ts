import { currentAdmin } from '@/lib/admin-auth';
import { apiError, RequestError } from '@/lib/http';
import { currencyDecimals } from '@/lib/money';
import { transactionFilters, transactionList } from '@/lib/transactions';

export const dynamic = 'force-dynamic';

function cell(value: unknown) {
  const text = String(value ?? '').replace(/\r\n/g, '\n');
  const safe = /^[\s]*[=+\-@]|^[\t\r\n]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  try {
    if (!await currentAdmin()) throw new RequestError('Sign in to export transactions.', 401);
    const filters = transactionFilters(Object.fromEntries(new URL(request.url).searchParams));
    const { rows } = await transactionList(filters, 25_001);
    if (rows.length > 25_000) throw new RequestError('Choose a shorter date range for this export.', 400);
    const columns = ['Date (UTC)', 'Source', 'Method', 'Reference', 'Provider payment ID', 'Amount', 'Refunded', 'Currency', 'Status', 'Recorded by', 'Note'];
    const content = rows.map(row => {
      const decimals = currencyDecimals(row.currency);
      return [row.occurred_at.toISOString(), row.source, row.method, row.reference, row.source === 'manual' ? '' : row.provider_ref,
        (Number(row.amount_minor) / 10 ** decimals).toFixed(decimals), (Number(row.refunded_minor) / 10 ** decimals).toFixed(decimals),
        row.currency, row.status, row.recorded_by, row.note].map(cell).join(',');
    });
    return new Response('\uFEFF' + [columns.map(cell).join(','), ...content].join('\r\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="beansource-transactions.csv"',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
