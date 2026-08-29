"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiFetch, fetchService, formatKes, getToken, ApiService } from "@/lib/api";

export default function BookServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [service, setService] = useState<ApiService | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ serviceId }) => setServiceId(serviceId));
  }, [params]);

  useEffect(() => {
    if (!serviceId) return;

    if (!getToken()) {
      router.push(`/sign-in?redirect=/book/${serviceId}`);
      return;
    }

    fetchService(serviceId).then((s) => {
      setService(s);
      setLoading(false);
    });
  }, [serviceId, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceId || !date || !time) return;
    setError(null);
    setSubmitting(true);
    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString();
      const booking = await apiFetch<{ id: string }>("/bookings", {
        method: "POST",
        body: JSON.stringify({ serviceId, scheduledAt }),
      });
      router.push(`/pay/${booking.id}`);
    } catch (err) {
      if (err instanceof Error && err.message === "SESSION_EXPIRED") {
        router.push(`/sign-in?redirect=/book/${serviceId}`);
        return;
      }
      setError("Couldn't create that booking — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const todayIso = new Date().toISOString().split("T")[0];

  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] items-center justify-center bg-[var(--paper)] px-6 py-20">
        <div className="w-full max-w-sm">
          {loading ? (
            <p className="text-sm text-[var(--charcoal-text)]/50">Loading…</p>
          ) : !service ? (
            <>
              <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
                Booking
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--charcoal-text)]">
                We couldn&apos;t find that service
              </h1>
              <p className="mt-3 text-sm text-[var(--charcoal-text)]/60">
                It may have been removed, or the booking system is
                temporarily unreachable.
              </p>
            </>
          ) : (
            <>
              <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
                {service.businessUnit.name}
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--charcoal-text)]">
                {service.name}
              </h1>
              <p className="mt-2 text-lg font-medium text-[var(--gold-dim)]">
                {formatKes(service.price)}
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label
                      htmlFor="date"
                      className="text-xs font-medium text-[var(--charcoal-text)]/70"
                    >
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      required
                      min={todayIso}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1.5 w-full rounded-sm border border-[var(--paper-line)] bg-white px-3 py-3 text-sm text-[var(--charcoal-text)] outline-none focus:border-[var(--gold-dim)]"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="time"
                      className="text-xs font-medium text-[var(--charcoal-text)]/70"
                    >
                      Time
                    </label>
                    <input
                      id="time"
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="mt-1.5 w-full rounded-sm border border-[var(--paper-line)] bg-white px-3 py-3 text-sm text-[var(--charcoal-text)] outline-none focus:border-[var(--gold-dim)]"
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-700">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting || !date || !time}
                  className="w-full rounded-sm bg-[var(--ink)] px-5 py-3.5 text-sm font-medium text-[var(--gold-bright)] transition hover:bg-[var(--panel)] disabled:opacity-50"
                >
                  {submitting ? "Booking…" : "Continue to payment"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
