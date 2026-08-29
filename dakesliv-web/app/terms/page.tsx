import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="bg-[var(--paper)]">
        <section className="border-b border-[var(--paper-line)] bg-[var(--ink)] py-20">
          <div className="mx-auto max-w-3xl px-6">
            <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
              Legal
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--cream)] md:text-4xl">
              Terms &amp; Conditions
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-md border border-[var(--gold-dim)]/40 bg-[var(--panel)] px-6 py-5">
            <p className="text-sm leading-relaxed text-[var(--cream-dim)]">
              <strong className="text-[var(--gold-bright)]">
                Placeholder page.
              </strong>{" "}
              These terms need to cover four different service types
              (grooming, events, security, digital) with different
              cancellation, refund, and liability implications for each —
              security and event bookings in particular carry real
              liability questions worth a lawyer&apos;s review. This should
              be drafted properly before the site accepts real payments.
            </p>
          </div>

          <div className="mt-10 space-y-6 text-sm leading-relaxed text-[var(--charcoal-text)]/70">
            <p>Areas a real terms document will need to cover, at minimum:</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>Booking, cancellation, and refund policy — likely different per business unit</li>
              <li>Payment terms (M-Pesa, card, cash) and what happens if a payment fails after service delivery</li>
              <li>Liability limits, especially for VIP Security and event services</li>
              <li>What happens if a client or DAKESLIV needs to reschedule</li>
              <li>Foundation contribution — how the percentage is disclosed and whether it's optional or built into pricing</li>
              <li>Dispute resolution and governing law (Kenya)</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
