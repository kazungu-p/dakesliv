import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
  {
    q: "How do I book a service?",
    a: "Choose a service category from the homepage, sign in with your phone number, then pick a date, time, and pay to confirm.",
  },
  {
    q: "What payment methods are accepted?",
    a: "M-Pesa and card online. Cash is available for bookings made in person at the office.",
  },
  {
    q: "I'm booking from outside Kenya — how does sign-in work?",
    a: "Kenyan numbers receive a code by SMS. Every other country receives it over WhatsApp instead, since it's more reliable internationally.",
  },
  {
    q: "How do I get a tax receipt?",
    a: "Every payment automatically generates a KRA-compliant invoice, emailed to you along with your booking confirmation.",
  },
];

export default function HelpPage() {
  return (
    <>
      <Header />
      <main className="bg-[var(--paper)]">
        <section className="border-b border-[var(--paper-line)] bg-[var(--ink)] py-20">
          <div className="mx-auto max-w-3xl px-6">
            <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
              Help &amp; Support
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--cream)] md:text-4xl">
              Common questions
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="divide-y divide-[var(--paper-line)] rounded-md border border-[var(--paper-line)]">
            {faqs.map((item) => (
              <div key={item.q} className="px-6 py-6">
                <h2 className="font-medium text-[var(--charcoal-text)]">
                  {item.q}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--charcoal-text)]/65">
                  {item.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-md bg-[var(--panel)] px-8 py-10 text-center">
            <p className="text-sm text-[var(--cream-dim)]">
              Can&apos;t find what you&apos;re looking for?
            </p>
            <a
              href="mailto:support@dakeslivgroup.com"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--gold-bright)] hover:gap-2.5"
            >
              Contact support
              <span aria-hidden>→</span>
            </a>
          </div>

          <p className="mt-10 text-xs text-[var(--charcoal-text)]/40">
            Placeholder content — confirm the real support contact channel
            (email, WhatsApp, phone line) with the client before launch.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
