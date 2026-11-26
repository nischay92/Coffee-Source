// Preload only on a loopback Next.js process connected to a disposable test database.
const database = new URL(process.env.DATABASE_URL || 'postgresql://invalid/none');
if (database.hostname !== '127.0.0.1' || !database.pathname.endsWith('_test') ||
    process.env.RAZORPAY_KEY_ID !== 'rzp_test_local_fixture' || process.env.PAYPAL_MODE !== 'sandbox' ||
    process.env.BEANSOURCE_LOCAL_GATEWAY_TEST !== '1') {
  throw new Error('Gateway fixtures require an isolated loopback test environment.');
}

const realFetch = globalThis.fetch;
const orders = new Map();
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  const json = (value, status = 200) => Response.json(value, { status });
  const body = () => JSON.parse(init?.body ?? '{}');
  if (url.hostname === 'api.razorpay.com') {
    if (url.pathname === '/v1/orders') {
      const order = { ...body(), id: `order_local${orders.size + 1}` };
      orders.set(order.id, order);
      return json(order);
    }
    if (url.pathname === '/v1/payments/pay_local1') {
      const order = orders.get('order_local1');
      if (!order) return json({}, 404);
      return json({ id: 'pay_local1', order_id: order.id, amount: order.amount, amount_refunded: 0,
        currency: 'INR', method: 'upi', status: 'captured', created_at: Math.floor(Date.now() / 1000) });
    }
    return json({}, 404);
  }
  if (url.hostname === 'api-m.sandbox.paypal.com') {
    if (url.pathname === '/v1/oauth2/token') return json({ access_token: 'local-fixture-token' });
    if (url.pathname === '/v1/notifications/verify-webhook-signature') {
      return json({ verification_status: body().transmission_sig === 'local-test-signature' ? 'SUCCESS' : 'FAILURE' });
    }
    if (url.pathname === '/v2/invoicing/invoices/INV2-FIXTURE-0001') return json({
      id: 'INV2-FIXTURE-0001', status: 'PAID', detail: { invoice_number: 'FIXTURE-1' },
      payments: { transactions: [{ type: 'PAYPAL', payment_id: 'LOCALPAYPAL1',
        payment_date: new Date().toISOString().slice(0, 10), amount: { currency_code: 'USD', value: '8.50' } }] },
    });
    return json({}, 404);
  }
  if (url.hostname.endsWith('paypal.com') || url.hostname === 'api.resend.com' || url.hostname === 'api.web3forms.com') {
    throw new Error('External calls are disabled for local integration fixtures.');
  }
  return realFetch(input, init);
};
