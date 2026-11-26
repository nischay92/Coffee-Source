export function currencyDecimals(currency: string) {
  return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
}

export function formatMoney(minor: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(minor / 10 ** currencyDecimals(currency));
}

export function toMinor(amount: string, currency: string) {
  const decimals = currencyDecimals(currency);
  if (!/^\d{1,9}(?:\.\d{1,3})?$/.test(amount)) return null;
  const [whole, fraction = ''] = amount.split('.');
  if (fraction.length > decimals) return null;
  return Number(whole) * 10 ** decimals + Number(fraction.padEnd(decimals, '0'));
}
