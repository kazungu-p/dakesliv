"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { label: "Services", href: "/#units" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Foundation", href: "/foundation" },
];

// Section ids on the homepage that the anchor links above point to. Kept as
// a separate list so the scroll-tracking effect knows exactly what to watch
// for, without parsing hrefs.
const homepageSectionIds = ["units", "how-it-works"];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  // null = not checked yet (avoids a flash of "Sign in" before we've read
  // localStorage on mount); false/true = the real signed-in state.
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Runs on every route change too, so signing in/out is reflected
    // immediately after router.push() rather than only on a hard refresh.
    setSignedIn(!!localStorage.getItem("dakesliv_token"));
  }, [pathname]);

  function handleSignOut() {
    localStorage.removeItem("dakesliv_token");
    setSignedIn(false);
    router.push("/");
  }

  useEffect(() => {
    // Only the homepage has these sections — everywhere else this simply
    // finds nothing and does nothing.
    const sections = homepageSectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    // Tracks every watched section's current intersection ratio, not just
    // whichever section happened to cross a threshold in the latest
    // callback. IntersectionObserver only reports entries that *changed*
    // on a given tick — recomputing "which section is active" from just
    // that tick's entries (rather than this full, persisted map) is what
    // caused the highlight to get stuck: a tall section like `units` can
    // exit without a matching `how-it-works` entry arriving in the same
    // batch, and vice versa on the way back up.
    const ratios: Record<string, number> = {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });

        const [bestId, bestRatio] = Object.entries(ratios).reduce(
          (best, current) => (current[1] > best[1] ? current : best),
          ["", 0] as [string, number],
        );
        setActiveSection(bestRatio > 0 ? bestId : null);
      },
      // A thin trigger line just below the sticky header, rather than a
      // tall band: bottom margin of -85% leaves only the top ~15% of the
      // viewport as the "active" zone. This matters because `units` is
      // ~1700px tall versus a 900px viewport — a tall band could never see
      // more than ~20% of it at once, so it would rarely cross threshold
      // values above 0. A thin line just needs threshold 0 (has the
      // section's top/bottom crossed the line at all) to work reliably
      // regardless of how tall or short a section is.
      { rootMargin: "-80px 0px -85% 0px", threshold: [0] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--rule)] bg-[var(--ink)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="DAKESLIV Group"
            width={36}
            height={36}
            className="rounded-sm"
          />
          <span
            className="font-[family-name:var(--font-label)] text-[13px] tracking-[0.18em] text-[var(--cream)] uppercase"
          >
            Dakesliv Group
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isAnchor = link.href.includes("#");
            const isActive = isAnchor
              ? pathname === "/" && activeSection === link.href.split("#")[1]
              : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-sm transition hover:text-[var(--gold-bright)] ${
                  isActive
                    ? "text-[var(--gold-bright)]"
                    : "text-[var(--cream-dim)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {signedIn ? (
          <button
            onClick={handleSignOut}
            className="rounded-sm border border-[var(--rule)] px-4 py-2 text-sm font-medium text-[var(--cream)] transition hover:border-[var(--gold-dim)]"
          >
            Sign out
          </button>
        ) : (
          <Link
            href="/sign-in"
            className="rounded-sm border border-[var(--gold-dim)] px-4 py-2 text-sm font-medium text-[var(--gold-bright)] transition hover:border-[var(--gold)] hover:bg-[var(--panel-raised)]"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
