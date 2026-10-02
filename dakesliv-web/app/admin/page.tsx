"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { staffApiFetch, formatKes, AdminBooking } from "@/lib/admin-api";

export default function AdminHomePage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    staffApiFetch<AdminBooking[]>("/bookings/today")
      .then(setBookings)
      .catch((err) => {
        if (err instanceof Error && err.message === "STAFF_SESSION_EXPIRED") {
          router.push("/admin/login");
          return;
        }
        setError("Couldn't load today's schedule.");
      });
  }, [router]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
            Today
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--charcoal-text)]">
            {new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" })}
          </h1>
        </div>
        <a
          href="/admin/walk-in"
          className="rounded-sm bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--gold-bright)] transition hover:bg-[var(--panel)]"
        >
          + New walk-in booking
        </a>
      </div>

      {error && <p className="mt-6 text-sm text-red-700">{error}</p>}

      {bookings === null && !error && (
        <p className="mt-8 text-sm text-[var(--charcoal-text)]/50">Loading…</p>
      )}

      {bookings && bookings.length === 0 && (
        <p className="mt-8 text-sm text-[var(--charcoal-text)]/50">
          No bookings scheduled for today.
        </p>
      )}

      {bookings && bookings.length > 0 && (
        <div className="mt-8 divide-y divide-[var(--paper-line)] rounded-md border border-[var(--paper-line)] bg-white">
          {bookings.map((b) => (
            <div key={b.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-medium text-[var(--charcoal-text)]">
                  {new Date(b.scheduledAt).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
                  {" — "}
                  {b.service.name}
                </p>
                <p className="mt-0.5 text-xs text-[var(--charcoal-text)]/60">
                  {b.user?.name ?? "Unknown customer"} · {b.user?.phone ?? "—"} · {b.service?.businessUnit?.name ?? "—"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase ${
                    b.channel === "walk_in"
                      ? "bg-[var(--gold)]/15 text-[var(--gold-dim)]"
                      : "bg-[var(--charcoal-text)]/10 text-[var(--charcoal-text)]/60"
                  }`}
                >
                  {b.channel === "walk_in" ? "Walk-in" : "Online"}
                </span>
                <span className="text-sm font-medium text-[var(--gold-dim)]">
                  {formatKes(b.service.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
