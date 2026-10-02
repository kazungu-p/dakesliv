import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export type LegalBlock =
  | { text: string }
  | { list: string[] }
  | { subheading: string; text?: string };

export type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};

export function LegalPage({
  eyebrow,
  title,
  effectiveDate,
  lastUpdated,
  intro,
  sections,
  closing,
}: {
  eyebrow: string;
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  intro: LegalBlock[];
  sections: LegalSection[];
  closing?: LegalBlock[];
}) {
  return (
    <>
      <Header />
      <main className="bg-[var(--paper)]">
        <section className="border-b border-[var(--paper-line)] bg-[var(--ink)] py-20">
          <div className="mx-auto max-w-3xl px-6">
            <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
              {eyebrow}
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--cream)] md:text-4xl">
              {title}
            </h1>
            <p className="mt-4 font-[family-name:var(--font-label)] text-[11px] tracking-[0.1em] text-[var(--cream-dim)]/70 uppercase">
              Effective {effectiveDate} · Last updated {lastUpdated}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="space-y-4 text-sm leading-relaxed text-[var(--charcoal-text)]/80">
            {intro.map((block, i) => (
              <LegalBlockView key={i} block={block} />
            ))}
          </div>

          <div className="mt-12 space-y-10">
            {sections.map((section, i) => (
              <div key={i} className="scroll-mt-24" id={`s${i + 1}`}>
                <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--charcoal-text)]">
                  {i + 1}. {section.heading}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--charcoal-text)]/75">
                  {section.blocks.map((block, j) => (
                    <LegalBlockView key={j} block={block} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {closing && (
            <div className="mt-12 space-y-3 border-t border-[var(--paper-line)] pt-8 text-sm leading-relaxed text-[var(--charcoal-text)]/75">
              {closing.map((block, i) => (
                <LegalBlockView key={i} block={block} />
              ))}
            </div>
          )}

          <div className="mt-14 rounded-md border border-[var(--gold-dim)]/30 bg-[var(--panel)] px-6 py-5">
            <p className="font-[family-name:var(--font-label)] text-[11px] tracking-[0.15em] text-[var(--gold-dim)] uppercase">
              Related documents
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link
                href="/privacy-policy"
                className="text-[var(--cream-dim)] transition hover:text-[var(--gold-bright)]"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookie-policy"
                className="text-[var(--cream-dim)] transition hover:text-[var(--gold-bright)]"
              >
                Cookie Policy
              </Link>
              <Link
                href="/terms"
                className="text-[var(--cream-dim)] transition hover:text-[var(--gold-bright)]"
              >
                Website Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function LegalBlockView({ block }: { block: LegalBlock }) {
  if ("list" in block) {
    return (
      <ul className="ml-5 list-disc space-y-1.5">
        {block.list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }
  if ("subheading" in block) {
    return (
      <div>
        <h3 className="font-medium text-[var(--charcoal-text)]">
          {block.subheading}
        </h3>
        {block.text && <p className="mt-1.5">{block.text}</p>}
      </div>
    );
  }
  return <p>{block.text}</p>;
}
