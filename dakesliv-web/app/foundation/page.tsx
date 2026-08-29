import Header from "@/components/Header";
import Footer from "@/components/Footer";

const categories = [
  { name: "Scholarships", detail: "School fees for talented children who lack financial resources." },
  { name: "School supplies", detail: "Books, uniforms, and materials so a lack of supplies never ends a child's schooling." },
  { name: "Mentorship", detail: "Guidance and role models for young people building a future." },
  { name: "Feeding programmes", detail: "Meals that keep children in school and able to learn." },
  { name: "Counselling support", detail: "Emotional and psychological support for children who need it." },
];

export default function FoundationPage() {
  return (
    <>
      <Header />
      <main className="bg-[var(--paper)]">
        <section className="border-b border-[var(--paper-line)] bg-[var(--ink)] py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
              Dakesliv Foundation
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-snug text-[var(--cream)] md:text-4xl">
              Supporting education and opportunity for children who lack
              financial resources.
            </h1>
            <p className="mt-5 text-[var(--cream-dim)]">
              A share of every Dakesliv booking contributes toward this work
              — and we&apos;re building it to be bigger than Dakesliv alone.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--charcoal-text)]">
            Where the support goes
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {categories.map((c) => (
              <div
                key={c.name}
                className="rounded-md border border-[var(--paper-line)] p-6"
              >
                <h3 className="font-medium text-[var(--charcoal-text)]">
                  {c.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--charcoal-text)]/60">
                  {c.detail}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-[var(--charcoal-text)]/45">
            Impact numbers will appear here once bookings and contributions
            are live — this page updates automatically from the same records
            used for the Foundation ledger.
          </p>
        </section>

        <section id="partner" className="border-t border-[var(--paper-line)] bg-[var(--panel)] py-20">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
              Join us
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--cream)]">
              This is bigger than one company.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--cream-dim)]">
              We're building the Dakesliv Foundation to be a shared effort —
              open to other organisations, businesses, and well-wishers who
              want to support these children, whether you're based in Kenya
              or contributing from abroad. If that's you, we'd like to hear
              from you.
            </p>
            <a
              href="mailto:foundation@dakeslivgroup.com"
              className="mt-8 inline-flex items-center gap-1.5 rounded-sm bg-[var(--gold)] px-7 py-3.5 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--gold-bright)]"
            >
              Get in touch about partnering
            </a>
            <p className="mt-4 text-xs text-[var(--cream-dim)]/60">
              foundation@dakeslivgroup.com — placeholder address, update once
              confirmed.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
