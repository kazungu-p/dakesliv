"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getStaffToken, staffApiFetch, StaffAccount } from "@/lib/admin-api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [staff, setStaff] = useState<StaffAccount | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecked(true);
      return;
    }
    // Reset before the async check starts — otherwise, navigating here
    // from /admin/login (where checked was already set true) leaves the
    // loading guard skipped for the instant this fetch is in flight,
    // letting children render with `staff` still null.
    setChecked(false);
    if (!getStaffToken()) {
      router.push("/admin/login");
      return;
    }
    staffApiFetch<StaffAccount>("/staff/auth/me")
      .then((s) => {
        setStaff(s);
        setChecked(true);
      })
      .catch(() => {
        localStorage.removeItem("dakesliv_staff_token");
        router.push("/admin/login");
      });
  }, [pathname, router]);

  // The login page renders its own minimal layout, no nav shell.
  if (pathname === "/admin/login") return <>{children}</>;

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--paper)]">
        <p className="text-sm text-[var(--charcoal-text)]/50">Loading…</p>
      </div>
    );
  }

  function handleSignOut() {
    localStorage.removeItem("dakesliv_staff_token");
    router.push("/admin/login");
  }

  const navLinks = [
    { label: "Today's schedule", href: "/admin" },
    { label: "New walk-in booking", href: "/admin/walk-in" },
    ...(staff?.role === "owner"
      ? [{ label: "Pending invoices", href: "/admin/invoices" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <header className="border-b border-[var(--rule)] bg-[var(--ink)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="DAKESLIV Group" width={32} height={32} className="rounded-sm" />
            <span className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.18em] text-[var(--cream)] uppercase">
              Admin
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition hover:text-[var(--gold-bright)] ${
                  pathname === link.href ? "text-[var(--gold-bright)]" : "text-[var(--cream-dim)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            {staff && (
              <span className="hidden text-xs text-[var(--cream-dim)] sm:inline">
                {staff.name} · {staff.role.replace("_", " ")}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="rounded-sm border border-[var(--rule)] px-3 py-1.5 text-xs font-medium text-[var(--cream)] transition hover:border-[var(--gold-dim)]"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-[var(--rule)] px-6 py-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-xs ${
                pathname === link.href ? "text-[var(--gold-bright)]" : "text-[var(--cream-dim)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
