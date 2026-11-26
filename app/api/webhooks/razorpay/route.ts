import { NextResponse } from 'next/server';
import { apiError, RequestError } from '@/lib/http';
import { recordRazorpayPayment } from '@/lib/orders';
import { sendOrderReceipt } from '@/lib/order-email';
import { razorpayRequest, validSignature, type RazorpayPayment } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) throw new RequestError('Webhook is not configured.', 503);
    const body = await request.text();
    if (body.length > 200_000) throw new RequestError('Request is too large.', 413);
    if (!validSignature(body, request.headers.get('x-razorpay-signature') ?? '', secret)) throw new RequestError('Invalid signature.', 401);
    const event = JSON.parse(body);
    if (['payment.captured', 'payment.authorized', 'payment.failed', 'refund.processed'].includes(event.event)) {
      const id = event.payload?.payment?.entity?.id ?? event.payload?.refund?.entity?.payment_id;
      if (typeof id !== 'string' || !/^pay_[a-z0-9]+$/i.test(id)) throw new RequestError('Invalid payment ID.');
      const orderId = await recordRazorpayPayment(await razorpayRequest<RazorpayPayment>(`/payments/${id}`));
      await sendOrderReceipt(orderId);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    return apiError(error);
  }
}
