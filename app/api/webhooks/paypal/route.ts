import { NextResponse } from 'next/server';
import { apiError, RequestError } from '@/lib/http';
import { importPaypalInvoice, verifyPaypalWebhook } from '@/lib/paypal';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    if (body.length > 200_000) throw new RequestError('Request is too large.', 413);
    let event;
    try { event = JSON.parse(body); } catch { throw new RequestError('Invalid webhook data.'); }
    if (!await verifyPaypalWebhook(request, body)) throw new RequestError('Invalid signature.', 401);
    if (['INVOICING.INVOICE.PAID', 'INVOICING.INVOICE.REFUNDED'].includes(event.event_type)) {
      const id = event.resource?.id ?? event.resource?.invoice?.id;
      if (typeof id !== 'string') throw new RequestError('Missing invoice reference.');
      await importPaypalInvoice(id);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    return apiError(error);
  }
}
