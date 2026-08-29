# dakesliv-api

NestJS backend for DAKESLIV Group's booking platform. The full customer loop
— sign in, book, pay, get a compliant invoice, contribute to the Foundation
— is wired end to end and has been tested against a real Postgres database.
What's left is almost entirely **adding your real API keys**, not writing code.

## Structure

```
src/
  auth/         User entity, phone/OTP sign-in, JWT issuing + the guard/decorator
                that protect booking and payment creation
  business-units/  The 4 DAKESLIV business units (Grooming, Events, Security, Digital)
  services/     Bookable services with prices, one table for all 4 units
  bookings/     Bookings (online, JWT-protected) + walk-in (admin panel, cash)
  payments/     M-Pesa via IntaSend, cash for walk-ins. PaymentsService.confirm()
                is the key method — the single trigger for invoicing + foundation
  invoicing/    Odoo XML-RPC client + invoice records
  foundation/   Foundation allocations + the public /foundation/impact endpoint
  scripts/      seed.ts — placeholder prices for all 20 services
```

## What's real (tested against a live database, not just compiled)

- **Sign-in**: real 6-digit codes, delivered via Africa's Talking (SMS for
  `+254` numbers, WhatsApp elsewhere), verified against a 5-minute-expiry
  store, real JWT issued on success.
- **Booking creation is now authenticated**: `POST /bookings` requires that
  JWT and always books for whoever is actually signed in — it no longer
  trusts a client-supplied `userId`. Verified: a booking made with a valid
  token correctly links to the right user and service.
- **Payment initiation is ownership-checked**: `POST /payments` verifies the
  signed-in user actually owns the booking before charging it.
- **M-Pesa (IntaSend)**: real STK Push call. Verified the failure path is
  clean — with no IntaSend keys configured, the customer sees "couldn't
  start the payment, try again," not a crash or a hang.
- **Cash payments** (admin/walk-in path) skip the payment gateway entirely
  and confirm immediately — verified this correctly triggers both an
  invoice (with the right 16% VAT amount) and a Foundation allocation
  (the right 3% amount) automatically.
- **Odoo invoicing**: real XML-RPC client that authenticates, creates, and
  posts invoices — that part of Odoo's API is stable across versions. See
  the one honest limitation below.
- Prices: `npm run seed` populates all 20 services with placeholder KES
  prices (re-runnable — updates existing rows rather than duplicating).

## Two real bugs found and fixed by actually testing this, not just reading the code

1. **`seed.ts` never loaded `.env`** — only the NestJS app does that
   automatically; a standalone script doesn't. Fixed with `import
   'dotenv/config'` at the top of the script.
2. **A serious one**: `JwtModule.register({ secret: process.env.JWT_SECRET })`
   runs the instant each module file is *imported* — which happens before
   `NestFactory.create()` ever runs, and therefore before anything has
   loaded `.env`. `JWT_SECRET` was `undefined` everywhere it was used,
   which would have made **every signed-in request fail** with a generic
   "session expired" error, in a way that would've been very confusing to
   debug from the outside. Fixed by making `import 'dotenv/config'` the
   very first line of `main.ts`, before any other import. Confirmed fixed
   by creating a real booking with a real JWT against a running server.

## The one honest limitation: reading back the KRA control number

Creating and posting an Odoo invoice works reliably — that's stable across
Odoo versions. But reading back the KRA control number and QR code
afterward depends on which specific eTIMS module you install (native Odoo
17+ Kenya localization vs. third-party apps), and they use different field
names. `OdooClient.readEtimsResult()` has placeholder field names and clear
instructions in a comment for finding the real ones once Odoo is running —
this needs a short session with your actual instance, not more guessing
from documentation.

## What genuinely still needs your API keys, nothing more

| Service | Env vars | What breaks without it |
|---|---|---|
| Africa's Talking | `AFRICAS_TALKING_API_KEY`, `AFRICAS_TALKING_USERNAME`, `AFRICAS_TALKING_WA_NUMBER` | Sign-in can't send a code |
| IntaSend | `INTASEND_PUBLISHABLE_KEY`, `INTASEND_SECRET_KEY` | M-Pesa payment can't start |
| Odoo | `ODOO_URL`, `ODOO_DB`, `ODOO_USERNAME`, `ODOO_API_KEY`, `ODOO_VAT_TAX_ID` | Invoices stay un-transmitted to KRA (booking/payment still work fine) |
| JWT | `JWT_SECRET` | Set this to a real random string regardless — sign-in won't work without it |

Cash payments (admin panel) and the booking flow itself work today with zero
external keys — only OTP delivery, M-Pesa, and eTIMS transmission need them.

## Still genuinely unbuilt (not just missing keys)

- Card payments (`PaymentMethod.CARD`) — IntaSend supports it via a
  different, redirect-based flow than STK Push; not wired up yet
- Staff/admin authentication — the walk-in booking/payment endpoints are
  intentionally unguarded for now; don't expose them publicly until this exists
- A retry job for invoices stuck in `PENDING_ETIMS` (the query for it,
  `InvoicingService.findPendingRetries()`, already exists)
- IntaSend webhook signature verification (the "challenge" value) — the
  endpoint works, but currently trusts any request that hits it

## Running locally

```bash
cp .env.example .env   # fill in DATABASE_URL and JWT_SECRET at minimum
npm install
npm run start:dev
npm run seed            # populates business units + services with prices
```

Needs a local Postgres database matching `DATABASE_URL`. `synchronize: true`
in development auto-creates tables from the entities — switch to real
migrations before production.

For real payment testing on `localhost`, IntaSend's webhook can't reach your
machine directly — use a tunnel (e.g. `ngrok http 3001`) and set that URL
as your webhook endpoint in the IntaSend dashboard, or confirm payments
manually via `POST /payments/:id/confirm` while testing.

## Testing sign-in without Africa's Talking working yet

Outside production (`NODE_ENV` unset or anything other than `production`),
`AuthService.requestOtp()` always logs the actual code to the terminal and
won't fail the request even if real delivery fails — so you can test the
whole sign-in flow with no Africa's Talking setup at all. Look for a line
like:

```
[DEV ONLY] OTP code for +254788888888: 546531
```

and type that into the sign-in form. This behavior is gated on `NODE_ENV`,
so it's automatically off once you deploy with `NODE_ENV=production` set —
a real delivery failure fails loudly for real users, as it should.
