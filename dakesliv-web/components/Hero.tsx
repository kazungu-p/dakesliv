export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--ink)]">
      {/* faint corner rule, echoes a document seal rather than a gradient blob */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[var(--rule)]" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full border border-[var(--rule)]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
          Dakesliv Group Ltd
        </p>

        <h1 className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[1.05] text-[var(--cream)] md:text-7xl">
          Four businesses.
          <br />
          <span className="text-[var(--gold)]">One trusted account.</span>
        </h1>

        <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--cream-dim)]">
          Grooming, events, security and digital services — book any of it,
          sign in once, pay securely and get confirmed in minutes.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#units"
            className="rounded-sm bg-[var(--gold)] px-7 py-3.5 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--gold-bright)]"
          >
            Browse services
          </a>
          <a
            href="#how-it-works"
            className="rounded-sm border border-[var(--rule)] px-7 py-3.5 text-sm font-medium text-[var(--cream)] transition hover:border-[var(--gold-dim)]"
          >
            How booking works
          </a>
        </div>
      </div>
    </section>
  );
}
