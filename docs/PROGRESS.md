# BeanSource progress

## 2026-11-25 — Repository audit and plan

- Recorded the refreshed instructions in [AGENTS.md](../AGENTS.md) and the planning decisions in [PROJECT_SPEC.md](PROJECT_SPEC.md).
- Reviewed the Next.js App Router and Tailwind static export. The app has a home page, sourcing catalogue, about, contact, and buyer and supplier pages. The contact form submits to Web3Forms from the browser, and WhatsApp is available as a separate contact path.
- The repository has imagery and logo files, but the full logo file uses an older spelling. Confirm the approved master before changing how the logo is presented. IMG_3176 and IMG_3177 were absent from the checkout.
- The current catalogue uses in-source descriptions. Purchasable variant data, stock, cart, checkout and order handling are pending. The commerce system and authorised catalogue data are outstanding.
- Verified the baseline with `npm run build`. It passed with existing `metadataBase` warnings. The referenced social preview image and homepage video were absent from the tracked assets.
- Next build milestone is the homepage and shared navigation refresh after plan review. This milestone changed repository documentation only.

## 2026-11-25 — Local storefront and commerce milestone

- Isolated v2 in the sibling `coffee-source-v2` worktree on `storefront-v2`. The original `main` checkout is clean and matches `origin/main` at `f41ccda`.
- Refreshed the homepage, origin story, navigation and footer. Added four business service pages, a custom blend enquiry, searchable retail collections, product pages with galleries and variants, bag, guest checkout and private order-status links. Existing contact routes remain accessible.
- Added PostgreSQL migrations and approved-catalogue import, server-side enquiry recording, Razorpay order creation and verification, PayPal invoice sync and verified webhook endpoints. The private admin dashboard supports manual transactions, per-currency totals, filtering, CSV, enquiries and order fulfilment.
- Updated the v2 Next.js and React dependencies to resolve audit findings. Build, type check and production dependency audit passed.
- Verified the isolated PostgreSQL smoke test for catalogue search, price and stock checks, fixture payment verification, repeated webhooks, PayPal invoice sync, manual records, CSV, quote submission and fulfilment. Browser checks covered desktop and mobile layout, mobile navigation, search, blend validation, admin sign-in and bag changes.
- The review app runs locally at `http://127.0.0.1:3100/`. The live catalogue is empty until approved records are imported. Provider sandbox tests and receipt delivery still need configured accounts. No Vercel deployment or production settings were changed.
