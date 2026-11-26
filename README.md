# BeanSource storefront v2

Next.js storefront for Coorg coffee retail and business enquiries. The same app hosts the public site, the private `/admin/` dashboard and the server endpoints for checkout and reporting.

## Run locally

With Node.js 22 or later and PostgreSQL 16 or later available:

1. Run `npm ci`.
2. Create a dedicated local PostgreSQL database. Copy [.env.example](.env.example) to `.env.local` and fill in `DATABASE_URL`. For staff sign-in, set `ADMIN_USERNAME`, a password of at least 16 characters and an independent session secret of at least 32 characters.
3. Run `npm run db:migrate`, then `npm run dev -- --hostname 127.0.0.1 --port 3100`.
4. Open [the storefront](http://127.0.0.1:3100/) or [the staff dashboard](http://127.0.0.1:3100/admin/).

The public editorial pages and empty shop can run without a database. PostgreSQL is required to save orders, enquiries and transactions. Production credentials and customer data belong in a separate environment.

## Catalogue and payments

- Import approved catalogue records with `npm run db:catalogue -- /path/to/catalogue.json`. The file is a JSON array. Each product needs a unique lowercase hyphenated `handle`, `title`, `description`, `collection` and a `variants` array. Collection values are `green-coffee`, `roasted-coffee`, `signature-blends` and `coffee-gifting`. Optional product fields include `origin`, `variety`, `processing`, `featured`, and an `images` array with `path` and `alt` per image. Set `published` to true to enable listing.
- Each variant needs a unique `sku`, `priceMinor` in INR paise and an integer `stock`. Optional fields include `grade`, `roast`, `format`, `packSize` and `active`. Importing updates the supplied SKUs, including their stock counts. Supply the current approved stock and explicitly deactivate discontinued SKUs. Product photos must exist under `public/images`.
- Razorpay Standard Checkout handles domestic orders. Enable it locally with test credentials and an approved `INDIA_FLAT_SHIPPING_PAISE` value. Enter `0` explicitly for free shipping. Product prices must include applicable taxes. Configure the Razorpay webhook for `payment.captured`, `payment.authorized`, `payment.failed` and `refund.processed` at `/api/webhooks/razorpay/` on a reachable test deployment.
- Create international quotes and send PayPal invoices from PayPal. The admin can import an invoice by ID after configuring a PayPal app. An optional verified endpoint at `/api/webhooks/paypal/` handles invoice paid and refunded events delivered to that app. Confirm that the invoicing app receives events for the invoices BeanSource sends. Mixed payment and refund histories require reconciliation in PayPal.
- Staff record verified offline receipts in the admin form. For Google Sheets, download the filtered transaction CSV and import it. Treat PostgreSQL as the transaction record.
- Guest checkout links to a private order status page. Confirmation email uses a configured Resend sender. Test-mode messages are addressed only to the explicit test recipient. Enquiries are saved to the dashboard and can also be forwarded through a server-configured Web3Forms key.

## Verify and release

Run `npm run build` and `npm run typecheck`. The application can be hosted as a single standard Next.js deployment with managed PostgreSQL. Set the confirmed `SITE_URL` on the production project to enable indexing.

For a reproducible local backend check, run `npm run build` and migrate a fresh loopback database ending in `_test`. Start the app with that database and these fixture-only values:

```sh
ADMIN_USERNAME=fixture-admin ADMIN_PASSWORD=fixture-admin-password \
ADMIN_SESSION_SECRET="$(openssl rand -hex 32)" \
RAZORPAY_MODE=test RAZORPAY_KEY_ID=rzp_test_local_fixture \
RAZORPAY_KEY_SECRET=local-fixture-gateway RAZORPAY_WEBHOOK_SECRET=local-fixture-webhook \
INDIA_FLAT_SHIPPING_PAISE=5000 PAYPAL_MODE=sandbox PAYPAL_CLIENT_ID=local-fixture \
PAYPAL_CLIENT_SECRET=local-fixture PAYPAL_WEBHOOK_ID=local-fixture \
BEANSOURCE_LOCAL_GATEWAY_TEST=1 NODE_OPTIONS=--require=./tests/gateway-fixtures.cjs \
npm run start -- --hostname 127.0.0.1 --port 3101
```

Run `node tests/smoke.mjs` with the same `DATABASE_URL`. The isolated fixture app substitutes provider responses. Use the providers’ own sandboxes for acceptance testing before production.

See [PROJECT_SPEC.md](docs/PROJECT_SPEC.md) for the agreed architecture and [PROGRESS.md](docs/PROGRESS.md) for implementation status.
