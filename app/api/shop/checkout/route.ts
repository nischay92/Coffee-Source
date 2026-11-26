import { NextResponse } from 'next/server';
import { parseItems } from '@/lib/catalogue';
import { databaseConfigured } from '@/lib/db';
import { apiError, field, rateLimit, readJSON, RequestError, requestIdentity, requireOrigin } from '@/lib/http';
import { findOrder, recordRazorpayPayment, startCheckout } from '@/lib/orders';
import { sendOrderReceipt } from '@/lib/order-email';
import { razorpayCredentials, razorpayRequest, validSignature, type RazorpayPayment } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    requireOrigin(request);
    if (!databaseConfigured()) throw new RequestError('Checkout is currently unavailable.', 503);
    const data = await readJSON(request);
    const identity = requestIdentity(request);
    if (data.action === 'verify') {
      await rateLimit(`verify:${identity}`, 30);
      const token = field(data.token, 64, 'order link', true);
      const id = field(data.paymentId, 80, 'payment ID', true);
      const signature = field(data.signature, 64, 'payment signature', true);
      const credentials = razorpayCredentials();
      const order = await findOrder(token);
      if (!credentials || !order?.razorpay_order_id || !/^pay_[a-z0-9]+$/i.test(id) ||
          !validSignature(`${order.razorpay_order_id}|${id}`, signature, credentials.secret)) {
        throw new RequestError('This payment could not be verified.', 400);
      }
      const payment = await razorpayRequest<RazorpayPayment>(`/payments/${id}`);
      if (payment.order_id !== order.razorpay_order_id || payment.id !== id) throw new RequestError('This payment does not match the order.');
      const orderId = await recordRazorpayPayment(payment);
      await sendOrderReceipt(orderId).catch(() => console.warn('Order confirmed; receipt delivery will be retried by webhook.'));
      return NextResponse.json({ status: (await findOrder(token))?.status });
    }

    if (data.action !== 'start') throw new RequestError('Invalid checkout action.');
    await rateLimit(`checkout:${identity}`, 8);
    const result = await startCheckout(parseItems(data.items), data.customer, data.expectedTotal);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
