import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Foundation", href: "/foundation" },
];

const supportLinks = [
  { label: "Help & Support", href: "/help" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--rule)] bg-[var(--ink)]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2">
            <span className="font-[family-name:var(--font-label)] text-[13px] tracking-[0.18em] text-[var(--cream)] uppercase">
              Dakesliv Group
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--cream-dim)]">
              One trusted account. Excellence in service, innovation in
              business, impact in communities.
            </p>
          </div>

          <div>
            <p className="font-[family-name:var(--font-label)] text-[11px] tracking-[0.15em] text-[var(--gold-dim)] uppercase">
              Quick links
            </p>
            <ul className="mt-3 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--cream-dim)] transition hover:text-[var(--gold-bright)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-[family-name:var(--font-label)] text-[11px] tracking-[0.15em] text-[var(--gold-dim)] uppercase">
              Support
            </p>
            <ul className="mt-3 space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--cream-dim)] transition hover:text-[var(--gold-bright)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--rule)] pt-6 text-xs text-[var(--cream-dim)]/70 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Dakesliv Group Ltd.</span>
          <span>All prices in KES. Tax invoices issued via eTIMS.</span>
        </div>
      </div>
    </footer>
  );
}
