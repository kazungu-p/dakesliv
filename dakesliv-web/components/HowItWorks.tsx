import { journeySteps } from "@/lib/units";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[var(--ink)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
          The process
        </p>
        <h2 className="mt-3 max-w-lg font-[family-name:var(--font-display)] text-4xl text-[var(--cream)]">
          Six steps, same for every service.
        </h2>

        <ol className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-6">
          {journeySteps.map((step, i) => (
            <li key={step.label} className="relative pl-0">
              <span className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-dim)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 font-medium text-[var(--cream)]">
                {step.label}
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-[var(--cream-dim)]">
                {step.detail}
              </p>
              {i < journeySteps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute right-[-14px] top-2 hidden h-px w-6 bg-[var(--rule)] md:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
