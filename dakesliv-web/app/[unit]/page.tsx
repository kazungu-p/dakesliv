import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { businessUnits } from "@/lib/units";
import Link from "next/link";
import { fetchBusinessUnits, formatKes } from "@/lib/api";
import LocationPriceEstimator from "@/components/LocationPriceEstimator";

export const dynamic = "force-dynamic";

// Support contact used for the "quote only" units (e.g. catering & events),
// where the final price depends entirely on what the client orders.
// Placeholder — confirm the real sales contact channel before launch.
const QUOTE_EMAIL = "support@dakeslivgroup.com";
const QUOTE_PHONE_DISPLAY = "+254 18 2278161";
const QUOTE_PHONE_HREF = "+254182278161";

export default async function UnitPage({
  params,
}: {
  params: Promise<{ unit: string }>;
}) {
  const { unit: slug } = await params;
  const unit = businessUnits.find((u) => u.slug === slug);
  if (!unit) notFound();

  const liveUnits = unit.quoteOnly ? null : await fetchBusinessUnits();
  // Distinguish "couldn't reach the backend at all" (liveUnits is null) from
  // "reached it fine, but this unit has no seeded services yet" (liveUnits
  // is an array, just missing this unit/its services) — these need
  // different messaging, since the second one is almost always just a
  // reminder to run `npm run seed`, not an actual outage.
  const backendUnreachable = liveUnits === null;
  const liveUnit = liveUnits?.find((u) => u.slug === slug);
  const liveServices = liveUnit?.services ?? null;

  return (
    <>
      <Header />
      <main className="bg-[var(--paper)]">
        <section className="relative min-h-[420px] overflow-hidden border-b border-[var(--paper-line)] md:min-h-[520px]">
          <Image
            src={unit.image}
            alt={`${unit.name} team`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/75 to-[var(--ink)]/40" />
          <div className="relative mx-auto flex min-h-[420px] max-w-4xl flex-col justify-end px-6 py-16 md:min-h-[520px] md:py-20">
            {unit.logo && (
              <Image
                src={unit.logo}
                alt={`${unit.name} crest`}
                width={300}
                height={420}
                className="mb-5 h-44 w-auto object-contain object-left md:h-52"
              />
            )}
            <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-bright)] uppercase">
              {unit.name}
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--cream)] md:text-5xl">
              {unit.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-[var(--cream-dim)]">
              {unit.description}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--charcoal-text)]">
            Services
          </h2>

          {unit.quoteOnly ? (
            <>
              <ul className="mt-6 divide-y divide-[var(--paper-line)] rounded-md border border-[var(--paper-line)]">
                {unit.services.map((service) => {
                  const label = typeof service === "string" ? service : service.name;
                  return (
                    <li key={label} className="px-5 py-4 text-sm text-[var(--charcoal-text)]">
                      {label}
                    </li>
                  );
                })}
              </ul>

              <QuoteCTA
                heading="Every event is priced around what you order."
                body="Guest count, menu, décor, entertainment and logistics all shape the final cost — so instead of fixed prices, tell us what you're planning and we'll put together a payment structure built around your order."
                subject="Catering & Events quote request"
              />
            </>
          ) : liveServices ? (
            <>
              <ul className="mt-6 divide-y divide-[var(--paper-line)] rounded-md border border-[var(--paper-line)]">
                {liveServices.map((service) => (
                  <li
                    key={service.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div>
                      <span className="text-sm text-[var(--charcoal-text)]">
                        {service.name}
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-[var(--gold-dim)]">
                        {formatKes(service.price)}
                      </span>
                    </div>
                    <a
                      href={`/book/${service.id}`}
                      className="shrink-0 rounded-sm border border-[var(--gold-dim)] px-4 py-2 text-xs font-medium text-[var(--gold-dim)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                    >
                      Book
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-[var(--charcoal-text)]/50">
                Prices shown are placeholders pending final confirmation.
                Booking a service requires signing in with your phone number.
              </p>
            </>
          ) : (
            <>
              <ul className="mt-6 divide-y divide-[var(--paper-line)] rounded-md border border-[var(--paper-line)]">
                {unit.services.map((service) => {
                  const label = typeof service === "string" ? service : service.name;
                  const price = typeof service === "object" && "price" in service ? service.price : null;
                  const status = typeof service === "object" && "status" in service ? service.status : null;
                  return (
                    <li
                      key={label}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <span className="text-sm text-[var(--charcoal-text)]">
                        {label}
                      </span>
                      {status === "quote" ? (
                        <span className="shrink-0 rounded-full border border-[var(--gold-dim)]/50 px-3 py-1 text-[11px] font-medium tracking-wide text-[var(--gold-dim)] uppercase">
                          Quote on request
                        </span>
                      ) : status === "coming-soon" ? (
                        <span className="shrink-0 rounded-full bg-[var(--charcoal-text)]/10 px-3 py-1 text-[11px] font-medium tracking-wide text-[var(--charcoal-text)]/50 uppercase">
                          Coming soon
                        </span>
                      ) : (
                        <span
                          className={`shrink-0 text-xs ${
                            price
                              ? "font-medium text-[var(--gold-dim)]"
                              : "text-[var(--charcoal-text)]/40"
                          }`}
                        >
                          {price ?? "Pricing unavailable"}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              {unit.services.some((s) => typeof s === "object" && "status" in s && s.status === "quote") && (
                <>
                  <QuoteCTA
                    heading="Every project is different."
                    body="Scope, platform, integrations and timeline all shape the cost — so custom websites, apps and software are quoted individually rather than sold off a price list."
                    subject="Web & software development quote request"
                  />
                  <p className="mt-4 text-center text-sm text-[var(--charcoal-text)]/60">
                    Curious what we&apos;ve built before?{" "}
                    <Link href="/portfolio" className="font-medium text-[var(--gold-dim)] hover:underline">
                      See our portfolio
                    </Link>
                  </p>
                </>
              )}

              {!unit.services.some((s) => typeof s === "object" && "status" in s) && (
                <p className="mt-4 text-xs text-[var(--charcoal-text)]/50">
                  {backendUnreachable
                    ? "We couldn't reach the booking system just now — live booking isn't available on this page at the moment. Please check back shortly, or contact us directly to arrange this service."
                    : "No services are set up for this unit yet — run npm run seed in dakesliv-api (or add services via the backend), then refresh this page."}
                </p>
              )}
            </>
          )}
        </section>

        {unit.slug === "grooming" && (
          <section className="mx-auto max-w-4xl px-6 pb-16">
            <LocationPriceEstimator />
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function QuoteCTA({
  heading,
  body,
  subject,
}: {
  heading: string;
  body: string;
  subject: string;
}) {
  return (
    <>
      <div className="mt-8 rounded-md border border-[var(--gold-dim)]/30 bg-[var(--panel)] px-8 py-10 text-center">
        <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--cream)]">
          {heading}
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[var(--cream-dim)]">
          {body}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(subject)}`}
            className="inline-flex items-center gap-1.5 rounded-sm bg-[var(--gold)] px-7 py-3.5 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--gold-bright)]"
          >
            Contact us for a quote
          </a>
          <a
            href={`tel:${QUOTE_PHONE_HREF}`}
            className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--gold-dim)] px-7 py-3.5 text-sm font-medium text-[var(--gold-bright)] transition hover:border-[var(--gold)]"
          >
            Call {QUOTE_PHONE_DISPLAY}
          </a>
        </div>
      </div>
      <p className="mt-4 text-xs text-[var(--charcoal-text)]/50">
        Placeholder contact details — confirm the real sales channel before
        launch.
      </p>
    </>
  );
}
