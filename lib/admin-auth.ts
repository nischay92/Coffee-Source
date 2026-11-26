import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { RequestError } from './http';

export const adminCookie = 'beansource_admin';
export const sessionSeconds = 8 * 60 * 60;

export function adminConfig() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  return username && password && password.length >= 16 && secret && secret.length >= 32
    ? { username, password, secret } : null;
}

function equal(left: string, right: string) {
  const digest = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(left), digest(right));
}

function sign(value: string, password: string, secret: string) {
  return createHmac('sha256', secret).update(value).update('\0').update(password).digest('base64url');
}

export function signIn(username: string, password: string) {
  const config = adminConfig();
  if (!config) throw new RequestError('Admin access is not configured.', 503);
  const passwordMatches = equal(password, config.password);
  if (!equal(username, config.username) || !passwordMatches) throw new RequestError('Incorrect username or password.', 401);
  const payload = `${Math.floor(Date.now() / 1000) + sessionSeconds}.${Buffer.from(username).toString('base64url')}`;
  return `${payload}.${sign(payload, config.password, config.secret)}`;
}

export async function currentAdmin() {
  const config = adminConfig();
  if (!config) return null;
  const cookie = (await cookies()).get(adminCookie)?.value;
  if (!cookie || cookie.length > 512) return null;
  const [expiry, user, signature, extra] = cookie.split('.');
  if (!expiry || !user || !signature || extra || !/^\d{10}$/.test(expiry) || +expiry <= Date.now() / 1000) return null;
  if (!equal(signature, sign(`${expiry}.${user}`, config.password, config.secret))) return null;
  return Buffer.from(user, 'base64url').toString() === config.username ? config.username : null;
}
