import { createHmac, timingSafeEqual } from 'node:crypto';
import { RequestError } from './http';

export type RazorpayPayment = {
  id: string; order_id: string | null; amount: number; amount_refunded?: number;
  currency: string; method?: string; status: string; created_at: number;
};

export function razorpayCredentials() {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const expected = process.env.RAZORPAY_MODE === 'live' ? 'rzp_live_' : 'rzp_test_';
  return id?.startsWith(expected) && secret ? { id, secret } : null;
}

export function validSignature(value: string, signature: string, secret: string) {
  if (!/^[0-9a-f]{64}$/i.test(signature)) return false;
  const expected = createHmac('sha256', secret).update(value).digest();
  return timingSafeEqual(expected, Buffer.from(signature, 'hex'));
}

export async function razorpayRequest<T>(path: string, data?: Record<string, unknown>): Promise<T> {
  const credentials = razorpayCredentials();
  if (!credentials) throw new RequestError('Razorpay is currently unavailable.', 503);
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    method: data ? 'POST' : 'GET',
    headers: {
      Authorization: `Basic ${Buffer.from(`${credentials.id}:${credentials.secret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
    cache: 'no-store',
    signal: AbortSignal.timeout(9_000),
  });
  if (!response.ok) throw new RequestError('Razorpay could not complete this request.', 502);
  return response.json();
}
