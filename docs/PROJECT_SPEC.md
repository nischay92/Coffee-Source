# BeanSource project specification

## Outcome and requirements

Refresh the existing BeanSource app into a premium Coorg (Kodagu) coffee experience with two clear paths. Retail customers browse and buy coffee. Business customers explore bulk sourcing, corporate supply, private labelling and custom gifting, then request a quote.

- Preserve the existing Next.js App Router, TypeScript and Tailwind foundation. Reuse working components and retain existing routes and contact paths while refreshing them.
- Use the original BeanSource logo without alteration. Use authentic Coorg imagery and verified product photography. IMG_3176 and IMG_3177 are Robusta. Keep them out of Arabica galleries.
- Carry forward the brown, warm beige, ivory and restrained navy palette, editorial serif headings and coffee photography. Exclude the prohibited branding phrase specified in [AGENTS.md](../AGENTS.md).
- Show verified INR prices only in the retail journey, including Shop, product details, cart and checkout. Homepage features and business enquiry pages are price-free. Retail gift products belong in Shop.
- Use approved product descriptions, attributes, options, prices and availability. Keep unsupported combinations unavailable. Confirm payment success from the payment service on the server before marking an order paid.
- Keep private credentials server-side. Shopify is excluded. Production infrastructure changes require approval.

## Proposed build sequence

1. **Brand and homepage.** Refresh the header, mobile navigation, footer and homepage in the existing codebase. Lead with the Coorg origin story and clear Shop and sourcing actions. Reuse the existing approved logo and imagery. Confirm the master logo and photo provenance where unclear.
2. **Business services.** Build pages for bulk sourcing, corporate supply, private labelling and gifting with service-specific quote forms. Retain the existing contact paths. Verify enquiry delivery, validation and failure handling when the receiving service is available.
3. **Retail catalogue.** Add Shop, collection and product detail routes with search and filtering as the approved catalogue supports them. Model variety, processing, grade, roast, format and pack size from confirmed data. Staff manage approved photos, draft and published listings, variant prices, sales and stock in the private admin area.
4. **Cart and checkout.** Add quantity changes, removal and subtotals. Revalidate price and availability before creating a Razorpay order for domestic retail. Test payment status and order handoff locally and in a sandbox. A custom blend purchase depends on approved recipe options, production rules and prices. Use guest checkout with a private order-status link and optional confirmation email.
5. **Release verification.** Check mobile layouts, keyboard access, existing routes, enquiry delivery, product variants, checkout success and failure cases, metadata, sitemap and performance. Use a local or private preview for review before requesting approval for production changes.

## Commerce and deployment decisions

Develop v2 in the separate `storefront-v2` worktree and verify it locally before requesting any Vercel deployment. Use a single Next.js App Router deployment for the storefront, private dashboard and server endpoints, with PostgreSQL as the durable retail and transaction store. Public editorial pages remain prebuilt. The existing `main` checkout is the live code baseline.

Use Razorpay for INR retail payments, PayPal invoices for international clients and staff-recorded entries for confirmed offline receipts. Keep payment source, method, currency, status and references in the transaction ledger. Provide staff filters, order and enquiry views, fulfilment updates and CSV export for Google Sheets. Save authorised gateway events server-side and deduplicate by provider payment ID.

The catalogue needs approved product records and verified photographs. Provider acceptance tests require sandbox credentials. Live checkout requires approved prices, inventory, tax treatment, shipping and fulfilment rules. Also confirm the master logo, canonical domain, customer policies, social profiles and the business enquiry destination before launch.

Reference for the static export constraints: [Next.js 14 static exports](https://nextjs.org/docs/14/app/building-your-application/deploying/static-exports).
