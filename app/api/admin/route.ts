import { NextResponse } from 'next/server';
import { adminCookie, currentAdmin, sessionSeconds, signIn } from '@/lib/admin-auth';
import { databaseConfigured, query } from '@/lib/db';
import { apiError, field, rateLimit, readJSON, RequestError, requestIdentity, requireOrigin } from '@/lib/http';
import { recordRazorpayPayment } from '@/lib/orders';
import { importPaypalInvoice } from '@/lib/paypal';
import { razorpayRequest, type RazorpayPayment } from '@/lib/razorpay';
import { recordManual } from '@/lib/transactions';

export async function POST(request: Request) {
  try {
    requireOrigin(request);
    const data = await readJSON(request);
    if (!databaseConfigured()) throw new RequestError('Admin storage is not configured.', 503);
    const secure = Boolean(process.env.VERCEL) || new URL(request.url).protocol === 'https:';
    if (data.action === 'login') {
      await rateLimit(`admin-login:${requestIdentity(request)}`, 8, 15);
      const session = signIn(field(data.username, 100, 'username', true), field(data.password, 256, 'password', true));
      const response = NextResponse.json({ ok: true });
      response.cookies.set(adminCookie, session, { httpOnly: true, sameSite: 'strict', secure, path: '/', maxAge: sessionSeconds });
      return response;
    }
    if (data.action === 'logout') {
      const response = NextResponse.json({ ok: true });
      response.cookies.set(adminCookie, '', { httpOnly: true, sameSite: 'strict', secure, path: '/', maxAge: 0 });
      return response;
    }
    const admin = await currentAdmin();
    if (!admin) throw new RequestError('Sign in to continue.', 401);
    if (data.action === 'manual') {
      return NextResponse.json({ message: await recordManual(data, admin) ? 'Transaction recorded.' : 'This transaction was already recorded.' }, { status: 201 });
    }
    if (data.action === 'razorpay') {
      const id = field(data.paymentId, 80, 'payment ID');
      if (id && !/^pay_[a-z0-9]+$/i.test(id)) throw new RequestError('Enter a Razorpay payment ID (pay_…).');
      const payments = id ? [await razorpayRequest<RazorpayPayment>(`/payments/${id}`)]
        : (await razorpayRequest<{ items: RazorpayPayment[] }>('/payments?count=25')).items;
      for (const payment of payments) await recordRazorpayPayment(payment);
      return NextResponse.json({ message: `Synced ${payments.length} Razorpay payment(s).` });
    }
    if (data.action === 'paypal') {
      const id = field(data.invoiceId, 70, 'invoice ID', true);
      const count = await importPaypalInvoice(id);
      return NextResponse.json({ message: count ? `Synced ${count} PayPal payment(s).` : 'No completed PayPal payments were found for this invoice.' });
    }
    if (data.action === 'fulfilment') {
      const id = field(data.orderId, 36, 'order ID', true);
      const tracking = field(data.tracking, 140, 'tracking reference');
      const status = ['pending', 'processing', 'shipped', 'delivered'].find(value => value === data.status);
      if (!status || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)) throw new RequestError('Invalid fulfilment update.');
      const { rowCount } = await query("UPDATE orders SET fulfilment_status = $2, tracking_reference = $3 WHERE id = $1 AND status = 'paid'", [id, status, tracking || null]);
      if (!rowCount) throw new RequestError('This order is unavailable for fulfilment.', 409);
      return NextResponse.json({ message: 'Fulfilment updated.' });
    }
    throw new RequestError('Invalid admin action.');
  } catch (error) {
    return apiError(error);
  }
}
