# dakesliv-api

NestJS backend for DAKESLIV Group's booking platform. The full customer loop
— sign in, book, pay, get a compliant invoice, contribute to the Foundation
— is wired end to end and has been tested against a real Postgres database.
What's left is almost entirely **adding your real API keys**, not writing code.

## Pre-DigitalOcean-hosting audit (September 2026)

Went through every file in `src/` looking for dead code and correctness
bugs before this gets deployed for real. Found and fixed several real
issues — each one verified by actually running it, not just reading the
code:

- **Payment amount was trusted from the client.** `CreatePaymentDto` used
  to accept an `amount` field directly from the request body, with nothing
  checking it against the booking's real price. Verified this exact
  attack: submitted `amount: "1"` for a KES 1,500 booking, and the old
  code would have charged KES 1. Fixed by removing `amount` from the DTO
  entirely — it's now always derived server-side from
  `booking.service.price`, so a client literally cannot supply it anymore.
- **The IntaSend webhook was completely unauthenticated.** Anyone who
  found or guessed a payment id could `POST` a fake "payment complete"
  event and trigger a real invoice + Foundation allocation for money that
  was never paid. Fixed with the challenge-string check IntaSend supports;
  verified all three states — no challenge configured in production (403),
  wrong challenge (403), correct challenge (passes through to real
  processing).
- **A staff JWT could reach customer-only routes.** `JwtAuthGuard` never
  checked token type, unlike `StaffAuthGuard` which explicitly rejects
  customer tokens. A staff token would have failed today anyway (their id
  doesn't exist in the `users` table) but for the wrong reason, with a
  confusing error. Both guards now explicitly check token type in both
  directions.
- **Staff sessions never expired.** `StaffAuthModule`'s JWT config had no
  `expiresIn` set at all — a lost device or leaked staff token would have
  stayed valid forever. Now expires in 12 hours (customer tokens stay at
  30 days — staff accounts touch far more sensitive data, so a shorter
  leash makes sense).
- **Booking status never actually updated.** `BookingStatus.CONFIRMED` was
  defined but nothing ever set it — every booking sat at `pending` forever
  in the database, even fully paid ones. Now `PaymentsService.confirm()`
  updates it, verified against the real database row, not just the API
  response (which had its own smaller version of this bug — fixed too).
- **Failed invoices were invisible.** The admin panel's pending-invoices
  view only queried `PENDING_ETIMS`, so a transmission that genuinely
  failed (caught in `InvoicingService`'s own catch block, set to `FAILED`)
  would silently disappear with no way for staff to know it needed retrying.
- **`/auth/*` and `/staff/auth/login` skipped validation entirely** —
  raw `@Body('field')` params with no DTO, unlike every other endpoint in
  the app. A malformed request would crash deep inside a service with a
  confusing 500 instead of a clean 400. Added proper DTOs to both.
- **No health check endpoint existed**, and no route handled bare `/` —
  DigitalOcean's default health check would have 404'd, which could cause
  it to think the app is unhealthy and restart it in a loop. Added a
  minimal one.
- **Dead code removed**: a stray literal directory left over from an early
  `mkdir` typo (harmless but cluttered), an unused `createAccount()` method
  on `StaffAuthService` that duplicated logic the seed script already had
  inline, and its now-unused imports.
- **`providerRef` on payments was defined but never populated** — added
  capturing IntaSend's own invoice id from the STK Push response, which
  matters for reconciling your records against IntaSend's dashboard later.

### One thing to get right on DigitalOcean specifically

`synchronize: process.env.NODE_ENV !== 'production'` in `app.module.ts` is
correct code, but it only protects you if `NODE_ENV=production` is
actually set in your DigitalOcean environment variables. If it's
forgotten, TypeORM's automatic schema sync stays active against your live
database — able to alter or drop columns based on entity changes. This is
the single most important environment variable to double-check before
connecting this to a database with real customer data.

## Structure

```
src/
  auth/         User entity, Google + email-code sign-in, JWT issuing, customer guard/decorator,
                PLUS Staff entity, staff email+password login, staff guard/decorator —
                see "The admin panel" below for why these are kept strictly separate
  business-units/  The 4 DAKESLIV business units (Grooming, Events, Security, Digital)
  services/     Bookable services with prices, one table for all 4 units
  bookings/     Bookings (online, customer-JWT-protected) + walk-in (staff-JWT-protected)
  payments/     M-Pesa via IntaSend, cash/manual-M-Pesa for walk-ins. PaymentsService.confirm()
                is the key method — the single trigger for invoicing + foundation
  invoicing/    Odoo XML-RPC client + invoice records
  foundation/   Foundation allocations + the public /foundation/impact endpoint
  scripts/      seed.ts — placeholder prices for all 20 services + the first staff account
```

## What's real (tested against a live database, not just compiled)

- **Sign-in**: Google (ID token verified server-side) or a 6-digit code
  emailed to any address (iCloud, Gmail, Outlook...) over SMTP — 5-minute
  expiry, 30s resend cooldown, 5 attempts per code, real JWT on success.
  Both methods resolve to one account per email.
- **Booking creation is authenticated**: `POST /bookings` requires that
  JWT and always books for whoever is actually signed in — it no longer
  trusts a client-supplied `userId`. Verified: a booking made with a valid
  token correctly links to the right user and service.
- **Payment initiation is ownership-checked**: `POST /payments` verifies the
  signed-in user actually owns the booking before charging it.
- **M-Pesa (IntaSend)**: real STK Push call. Verified the failure path is
  clean — with no IntaSend keys configured, the customer sees "couldn't
  start the payment, try again," not a crash or a hang.
- **The full staff admin panel**: real email+password login, walk-in
  booking creation (finds or creates the customer by phone), cash/manual
  M-Pesa payment recording, today's schedule, and an owner-only pending
  invoices view. All tested end to end through the actual UI, not just the API.
- **Cash/walk-in payments** skip the payment gateway entirely and confirm
  immediately — verified this correctly triggers both an invoice (with the
  right 16% VAT amount) and a Foundation allocation (the right 3% amount)
  automatically.
- **Odoo invoicing**: real XML-RPC client that authenticates, creates, and
  posts invoices — that part of Odoo's API is stable across versions. See
  the one honest limitation below.
- Prices: `npm run seed` populates all 20 services with placeholder KES
  prices (re-runnable — updates existing rows rather than duplicating).

## The admin panel

Staff accounts are entirely separate from customer accounts — real
email+password (bcrypt-hashed) with a JWT tagged `type: 'staff'`, checked
explicitly by `StaffAuthGuard` so a customer's OTP-issued token can never
reach an admin route, even though both are signed with the same
`JWT_SECRET`. Verified this boundary directly: a real customer token gets
a clean 401 on every staff route.

Three roles: `owner` (sees everything, every unit), `unit_manager` (scoped
to one business unit — the field exists, no UI uses it yet), `front_desk`
(walk-in bookings only, no financial visibility — verified a front-desk
account gets rejected from `/invoices/pending` with a clear "your role
doesn't have access" message).

Creating the first account: set `SEED_OWNER_EMAIL` / `SEED_OWNER_PASSWORD`
in `.env` and run `npm run seed` — creates one OWNER account if it doesn't
already exist. There's no public signup; further staff accounts need
creating the same way for now (a "manage staff" screen is a natural next
step, not yet built).

## Three real bugs found and fixed by actually testing this, not just reading the code

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
3. **`findForToday()` and `findForUnit()` silently dropped relations**:
   both used TypeORM's `createQueryBuilder()`, which does **not** apply
   the `eager: true` setting configured on the `Booking` entity's `user`
   and `service` relations — that only auto-loads through the repository's
   own `.find()`/`.findOne()`. Without explicit `.leftJoinAndSelect()`
   calls, `/bookings/today` was returning bookings with `user` and
   `service.businessUnit` completely missing, which crashed the admin
   dashboard the instant a real booking existed for today. Caught by
   creating a real walk-in booking through the actual UI and loading the
   dashboard — not by reading the code — and confirmed fixed the same way.

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
| Google sign-in | `GOOGLE_CLIENT_IDS` | Google sign-in is rejected |
| SMTP (email codes) | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | Email sign-in can't send a code |
| IntaSend | `INTASEND_PUBLISHABLE_KEY`, `INTASEND_SECRET_KEY` | M-Pesa payment can't start |
| Odoo | `ODOO_URL`, `ODOO_DB`, `ODOO_USERNAME`, `ODOO_API_KEY`, `ODOO_VAT_TAX_ID` | Invoices stay un-transmitted to KRA (booking/payment still work fine) |
| JWT | `JWT_SECRET` | Set this to a real random string regardless — sign-in won't work without it |

Cash payments (admin panel) and the booking flow itself work today with zero
external keys — only email delivery, Google sign-in, M-Pesa, and eTIMS transmission need them.

## Still genuinely unbuilt (not just missing keys)

- Card payments (`PaymentMethod.CARD`) — IntaSend supports it via a
  different, redirect-based flow than STK Push; not wired up yet
- A "manage staff" screen — new staff accounts need `npm run seed` (with
  updated env vars) or a direct database insert for now
- Unit-manager-scoped dashboard views — the role and `businessUnitId`
  exist on staff accounts, no UI filters by it yet
- A retry job for invoices stuck in `PENDING_ETIMS` (the query for it,
  `InvoicingService.findPendingRetries()`, already exists)
- IntaSend webhook signature verification (the "challenge" value) — the
  endpoint works, but currently trusts any request that hits it

## Running locally

```bash
cp .env.example .env   # fill in DATABASE_URL and JWT_SECRET at minimum
npm install
npm run start:dev
npm run seed            # populates business units + services with prices,
                         # and the first staff account if SEED_OWNER_EMAIL/
                         # SEED_OWNER_PASSWORD are set
```

Needs a local Postgres database matching `DATABASE_URL`. `synchronize: true`
in development auto-creates tables from the entities — switch to real
migrations before production.

For real payment testing on `localhost`, IntaSend's webhook can't reach your
machine directly — use a tunnel (e.g. `ngrok http 3001`) and set that URL
as your webhook endpoint in the IntaSend dashboard, or confirm payments
manually via `POST /payments/:id/confirm` while testing.

## Sign-in API

| Endpoint | Body | Notes |
|---|---|---|
| `POST /auth/google` | `{ "idToken": "..." }` | ID token from the Google sign-in SDK/button |
| `POST /auth/email/request` | `{ "email": "..." }` | Emails a 6-digit code (429 if requested again within 30s) |
| `POST /auth/email/verify` | `{ "email": "...", "code": "123456", "name"?: "..." }` | `name` is only used if this creates a new account |
| `GET /auth/me` | — | Bearer token; returns the signed-in customer |
| `PATCH /auth/me` | `{ "name"?, "phone"? }` | Bearer token; save a phone number for M-Pesa |

All sign-in routes return `{ user, accessToken }`. A phone number is no
longer required to sign in; M-Pesa payments take an optional `phone` in
`POST /payments` (or use the one saved via `PATCH /auth/me`).

## Testing sign-in without SMTP set up yet

Outside production (`NODE_ENV` unset or anything other than `production`),
`AuthService.requestEmailOtp()` always logs the actual code to the terminal
and won't fail the request even if the email can't be sent. Look for:

```
[DEV ONLY] OTP code for you@icloud.com: 546531
```

This is gated on `NODE_ENV`, so it's automatically off in production — a
real delivery failure fails loudly for real users, as it should.
