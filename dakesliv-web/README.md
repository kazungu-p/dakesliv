# dakesliv-web

Next.js frontend for DAKESLIV Group. Black-and-gold design system, built
around the four business units and the six-step booking journey — which is
now a real, working flow, not just UI.

## Structure

```
app/
  layout.tsx           Fonts (Fraunces/Inter/IBM Plex Mono via <link>, see note below)
  globals.css           Design tokens: --ink, --gold, --cream, --paper, etc.
  page.tsx              Homepage: hero, unit cards, how-it-works, foundation banner
  [unit]/page.tsx       Real prices + services fetched from the backend, with a
                        graceful fallback to static content if it's unreachable
  book/[serviceId]/     Date/time picker → creates a real booking
  pay/[bookingId]/      Triggers the real M-Pesa STK Push, polls for confirmation
  sign-in/page.tsx      Phone/OTP sign-in, wired to the backend, honors a
                        ?redirect= param so the booking flow isn't lost
  admin/                Staff-only panel — see below, entirely separate auth from
                        the customer sign-in above
components/
  Header, Hero, ServiceCrest, UnitsGrid, HowItWorks, FoundationBanner, Footer
lib/
  units.ts              Marketing copy per unit (name, tagline, image) — this
                        part stays static, it's not booking-relevant data
  api.ts                Shared fetch helpers, the JWT-attaching apiFetch()
                        wrapper, and TypeScript types matching the backend
  admin-api.ts           Same idea as api.ts but for staff — a separate token
                        (dakesliv_staff_token) and separate fetch wrapper, so a
                        customer session can never accidentally reach admin routes
```

## The admin panel

`app/admin/` is a real, working staff dashboard — login, today's schedule,
walk-in booking creation, and an owner-only pending-invoices view. Tested
end to end through the actual UI against a live backend, including a real
walk-in booking created through the form and confirmed showing up correctly
on the dashboard afterward.

- `admin/login` — email+password, stores the token under a different
  `localStorage` key (`dakesliv_staff_token`) than the customer session
- `admin/layout.tsx` — checks that token on every admin route via
  `GET /staff/auth/me`, redirects to login if it's missing or invalid, and
  shows/hides nav items based on role (only `owner` sees "Pending invoices")
- `admin/walk-in` — front-desk booking form: pick a service, enter the
  customer's phone (finds or creates them), pick date/time and payment
  method (cash, or M-Pesa collected directly at the till — either
  confirms immediately, no STK Push, since the money's already changed hands)
- `admin/invoices` — owner-only; if a non-owner account somehow reaches
  this URL, the backend rejects the request rather than the frontend just
  hiding the link

There's no public signup for staff accounts — see the backend README for
how the first one gets created.

## The real booking flow, end to end

1. `/[unit]` fetches live services + prices from `GET /business-units`
   server-side on every request (`export const dynamic = "force-dynamic"`)
2. Clicking "Book" goes to `/book/[serviceId]`, which checks for a signed-in
   session and redirects to `/sign-in?redirect=...` if there isn't one
3. After picking a date/time, `POST /bookings` creates a real booking (with
   the JWT attached automatically by `apiFetch()`) and redirects to `/pay/[bookingId]`
4. "Pay with M-Pesa" calls `POST /payments`, which triggers a real IntaSend
   STK Push, then polls `GET /payments/:id` every 3 seconds until the
   backend's webhook marks it confirmed

This was tested against a real running backend + Postgres database, not
just built and assumed to work: booking creation, price display, and the
cash-payment path (which needs no external keys) were all verified live.

## Talking to the backend

Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to
wherever `dakesliv-api` is running (defaults to `http://localhost:3001`).
Run both projects side by side — nothing on this site works meaningfully
without the backend also running.

The JWT is stored in `localStorage` for now (flagged in `lib/api.ts` as a
placeholder) — swap for an httpOnly cookie set by the backend before this
handles real production sessions.

## Fonts

Fonts load via a `<link>` tag in `app/layout.tsx` rather than `next/font/google`,
so the project builds in sandboxed/offline environments. Once you have normal
network access, switching to `next/font/google` is a drop-in change and gives
slightly better loading performance (self-hosted, no extra request).

## Not yet connected

- Card payment (only M-Pesa is wired up on the frontend — the backend
  doesn't support it yet either, see the API's README)
- No confirmation email/SMS view — the payment page shows a success screen,
  but there's no "my bookings" history page yet
- No "manage staff" screen in the admin panel — new staff accounts are
  created via the backend's seed script for now
- No unit-manager-scoped view — the role exists on staff accounts, no page
  filters by business unit yet

## Running locally

```bash
cp .env.local.example .env.local   # point this at your running backend
npm install
npm run dev
```
