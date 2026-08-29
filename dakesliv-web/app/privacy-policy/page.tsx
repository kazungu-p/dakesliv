import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-md border border-[var(--gold-dim)]/40 bg-[var(--panel)] px-6 py-5">
            <p className="text-sm leading-relaxed text-[var(--cream-dim)]">
              <strong className="text-[var(--gold-bright)]">
                Placeholder page.
              </strong>{" "}
              This platform collects personal data — phone numbers, names,
              booking details, and payment records — and issues KRA tax
              invoices, which also carry personal data. Kenya&apos;s Data
              Protection Act requires a real, specific privacy policy
              covering what&apos;s collected, why, how long it&apos;s kept,
              and how someone can request their data be corrected or
              deleted. This needs drafting by the client or a lawyer before
              the site goes live — it should not launch with this
              placeholder in place.
            </p>
          </div>

          <div className="mt-10 space-y-6 text-sm leading-relaxed text-[var(--charcoal-text)]/70">
            <p>Sections a real policy will need to cover, at minimum:</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>What personal data is collected (name, phone, email, payment details)</li>
              <li>Why it&apos;s collected and how it&apos;s used</li>
              <li>How it&apos;s shared with third parties (payment aggregator, Odoo/eTIMS, SMS/WhatsApp provider)</li>
              <li>How long records are retained (note: tax invoices have legal retention requirements)</li>
              <li>How a client can access, correct, or request deletion of their data</li>
              <li>Contact details for data protection queries</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
