import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { portfolioProjects } from "@/lib/portfolio";
import { categoryLabel } from "@/lib/gallery";

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main className="bg-[var(--paper)]">
        <section className="border-b border-[var(--paper-line)] bg-[var(--ink)] py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
              Portfolio
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--cream)] md:text-4xl">
              Work we&apos;ve delivered.
            </h1>
            <p className="mt-4 text-[var(--cream-dim)]">
              A sample of completed projects across Dakesliv&apos;s divisions
              — from apps and websites to events and more.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-2">
            {portfolioProjects.map((p) => (
              <div
                key={p.slug}
                className="rounded-md border border-[var(--paper-line)] bg-white p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-medium tracking-wide text-[var(--gold-dim)] uppercase">
                    {categoryLabel(p.category)}
                  </span>
                  <span className="text-[11px] text-[var(--charcoal-text)]/40">
                    {p.year}
                  </span>
                </div>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl text-[var(--charcoal-text)]">
                  {p.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--charcoal-text)]/70">
                  {p.summary}
                </p>
                <ul className="mt-4 space-y-1.5 border-t border-[var(--paper-line)] pt-4">
                  {p.highlights.map((h) => (
                    <li
                      key={h}
                      className="text-[13px] leading-snug text-[var(--charcoal-text)]/60"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
                {p.placeholder && (
                  <p className="mt-4 text-[11px] text-[var(--charcoal-text)]/35">
                    Sample entry — replace with a real project in
                    lib/portfolio.ts.
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-md border border-[var(--paper-line)] px-8 py-10 text-center">
            <p className="text-sm text-[var(--charcoal-text)]/60">
              More case studies — including completed mobile apps — added as
              projects wrap up.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
