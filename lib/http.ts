import { NextResponse } from 'next/server';
import { query } from './db';

export class RequestError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export function apiError(error: unknown) {
  if (error instanceof RequestError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error('BeanSource request failed', error instanceof Error ? error.name : 'unknown error');
  return NextResponse.json({ error: 'This request could not be completed. Please try again.' }, { status: 500 });
}

export function requireOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const url = new URL(request.url);
  const host = request.headers.get('host') || url.host;
  const protocol = process.env.VERCEL ? 'https:' : url.protocol;
  if (origin !== `${protocol}//${host}`) {
    throw new RequestError('Request origin could not be verified.', 403);
  }
}

export async function readJSON(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    throw new RequestError('Expected a JSON request.', 415);
  }
  const raw = await request.text();
  if (raw.length > 24_000) throw new RequestError('The request is too large.', 413);
  try {
    const value = JSON.parse(raw);
    if (value && typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>;
  } catch {
    // Invalid JSON is handled below.
  }
  throw new RequestError('The request contains invalid data.');
}

export function field(value: unknown, max: number, label: string, required = false) {
  if (value === undefined && !required) return '';
  if (typeof value !== 'string' || value.trim().length > max || (required && !value.trim())) {
    throw new RequestError(`Enter a valid ${label}.`);
  }
  return value.trim();
}

export function requestIdentity(request: Request) {
  if (process.env.VERCEL) return request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() || 'unknown';
  return 'local';
}

export async function rateLimit(key: string, max: number, minutes = 10) {
  const bucket = Math.floor(Date.now() / (minutes * 60_000));
  const { rows } = await query<{ hits: number }>(
    `INSERT INTO request_limits (key, bucket, hits) VALUES ($1, $2, 1)
     ON CONFLICT (key, bucket) DO UPDATE SET hits = request_limits.hits + 1 RETURNING hits`,
    [key, bucket],
  );
  if (rows[0].hits > max) throw new RequestError('Too many attempts. Please try again later.', 429);
}
