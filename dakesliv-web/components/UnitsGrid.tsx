import ServiceCrest from "@/components/ServiceCrest";
import { businessUnits } from "@/lib/units";

export default function UnitsGrid() {
  return (
    <section id="units" className="bg-[var(--paper)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
          Choose a service
        </p>
        <h2 className="mt-3 max-w-lg font-[family-name:var(--font-display)] text-4xl text-[var(--charcoal-text)]">
          Four businesses, each held to the same standard.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {businessUnits.map((unit) => (
            <ServiceCrest key={unit.slug} unit={unit} />
          ))}
        </div>
      </div>
    </section>
  );
}
