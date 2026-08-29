export default function FoundationBanner() {
  return (
    <section id="foundation" className="bg-[var(--paper)] pb-24 pt-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-md border border-[var(--gold-dim)]/40 bg-[var(--panel)] px-8 py-14 md:px-14">
          <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
            Dakesliv Foundation
          </p>
          <h2 className="mt-3 max-w-xl font-[family-name:var(--font-display)] text-3xl text-[var(--cream)] md:text-4xl">
            A share of every booking goes back to the community.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--cream-dim)]">
            Scholarships, school supplies, mentorship, feeding programmes, and
            counselling — funded by every client who books, and growing
            through partner organisations and well-wishers joining us, in
            Kenya and abroad.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
            <a
              href="/foundation"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--gold-bright)] hover:gap-2.5"
            >
              See the impact so far
              <span aria-hidden>→</span>
            </a>
            <a
              href="/foundation#partner"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--cream-dim)] hover:text-[var(--gold-bright)]"
            >
              Become a partner
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
