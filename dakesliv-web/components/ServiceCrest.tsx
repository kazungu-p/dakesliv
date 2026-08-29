import Image from "next/image";
import Link from "next/link";
import type { BusinessUnit } from "@/lib/units";

export default function ServiceCrest({ unit }: { unit: BusinessUnit }) {
  return (
    <Link
      href={`/${unit.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-md border border-[var(--paper-line)] bg-white/60 transition hover:-translate-y-1 hover:border-[var(--gold-dim)] hover:shadow-[0_12px_30px_-15px_rgba(30,24,10,0.35)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={unit.image}
          alt={`${unit.name} team`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/70 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-4 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold-bright)]/70 bg-[var(--ink)]/60 font-[family-name:var(--font-display)] text-sm text-[var(--gold-bright)] backdrop-blur-sm">
          {unit.mark}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col p-7">
        <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--charcoal-text)]">
          {unit.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-[var(--gold-dim)]">
          {unit.tagline}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--charcoal-text)]/70">
          {unit.description}
        </p>

        <ul className="mt-5 space-y-1.5 border-t border-[var(--paper-line)] pt-5">
          {unit.services.slice(0, 3).map((s) => (
            <li
              key={s}
              className="text-[13px] leading-snug text-[var(--charcoal-text)]/60"
            >
              {s}
            </li>
          ))}
        </ul>

        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--charcoal-text)] transition group-hover:gap-2.5 group-hover:text-[var(--gold-dim)]">
          View services
          <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
