import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { businessUnits } from "@/lib/units";
import { fetchBusinessUnits, formatKes } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function UnitPage({
  params,
}: {
  params: Promise<{ unit: string }>;
}) {
  const { unit: slug } = await params;
  const unit = businessUnits.find((u) => u.slug === slug);
  if (!unit) notFound();

  const liveUnits = await fetchBusinessUnits();
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

          {liveServices ? (
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
                {unit.services.map((service) => (
                  <li
                    key={service}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <span className="text-sm text-[var(--charcoal-text)]">
                      {service}
                    </span>
                    <span className="shrink-0 text-xs text-[var(--charcoal-text)]/40">
                      Pricing unavailable
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-[var(--charcoal-text)]/50">
                {backendUnreachable
                  ? "We couldn't reach the booking system just now — pricing and booking aren't available on this page at the moment. Please check back shortly."
                  : "No services are set up for this unit yet — run npm run seed in dakesliv-api (or add services via the backend), then refresh this page."}
              </p>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
