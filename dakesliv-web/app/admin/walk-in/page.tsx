"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { staffApiFetch, formatKes } from "@/lib/admin-api";
import { fetchBusinessUnits, ApiBusinessUnit, ApiService } from "@/lib/api";

export default function WalkInBookingPage() {
  const router = useRouter();
  const [units, setUnits] = useState<ApiBusinessUnit[] | null>(null);
  const [selectedService, setSelectedService] = useState<ApiService | null>(null);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [payMethod, setPayMethod] = useState<"cash" | "mpesa">("cash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinessUnits().then(setUnits);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedService || !date || !time) return;
    setError(null);
    setSubmitting(true);
    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString();
      const booking = await staffApiFetch<{ id: string }>("/bookings/walk-in", {
        method: "POST",
        body: JSON.stringify({
          customerPhone: phone,
          customerName: name || undefined,
          serviceId: selectedService.id,
          scheduledAt,
        }),
      });

      await staffApiFetch("/payments/walk-in", {
        method: "POST",
        body: JSON.stringify({
          bookingId: booking.id,
          amount: selectedService.price,
          method: payMethod,
        }),
      });

      setSuccess(`Booking created and ${payMethod === "cash" ? "paid in cash" : "recorded"} — confirmed.`);
      setPhone("");
      setName("");
      setDate("");
      setTime("");
      setSelectedService(null);
    } catch (err) {
      if (err instanceof Error && err.message === "STAFF_SESSION_EXPIRED") {
        router.push("/admin/login");
        return;
      }
      setError("Couldn't create that booking — check the details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const todayIso = new Date().toISOString().split("T")[0];

  return (
    <div className="mx-auto max-w-lg">
      <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
        Front desk
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--charcoal-text)]">
        New walk-in booking
      </h1>

      {success && (
        <div className="mt-6 rounded-md border border-green-700/30 bg-green-50 px-5 py-4 text-sm text-green-800">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="text-xs font-medium text-[var(--charcoal-text)]/70">Service</label>
          <select
            required
            value={selectedService?.id ?? ""}
            onChange={(e) => {
              const all = units?.flatMap((u) => u.services) ?? [];
              setSelectedService(all.find((s) => s.id === e.target.value) ?? null);
            }}
            className="mt-1.5 w-full rounded-sm border border-[var(--paper-line)] bg-white px-4 py-3 text-sm text-[var(--charcoal-text)] outline-none focus:border-[var(--gold-dim)]"
          >
            <option value="">Select a service…</option>
            {units?.map((unit) => (
              <optgroup key={unit.id} label={unit.name}>
                {unit.services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {formatKes(s.price)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="phone" className="text-xs font-medium text-[var(--charcoal-text)]/70">
              Customer phone
            </label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="+2547XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-[var(--paper-line)] bg-white px-4 py-3 text-sm text-[var(--charcoal-text)] outline-none focus:border-[var(--gold-dim)]"
            />
          </div>
          <div>
            <label htmlFor="name" className="text-xs font-medium text-[var(--charcoal-text)]/70">
              Name (if new)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-[var(--paper-line)] bg-white px-4 py-3 text-sm text-[var(--charcoal-text)] outline-none focus:border-[var(--gold-dim)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="date" className="text-xs font-medium text-[var(--charcoal-text)]/70">
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
          <div>
            <label htmlFor="time" className="text-xs font-medium text-[var(--charcoal-text)]/70">
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

        <div>
          <label className="text-xs font-medium text-[var(--charcoal-text)]/70">Payment method</label>
          <div className="mt-1.5 flex gap-3">
            {(["cash", "mpesa"] as const).map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setPayMethod(m)}
                className={`flex-1 rounded-sm border px-4 py-2.5 text-sm font-medium transition ${
                  payMethod === m
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold-dim)]"
                    : "border-[var(--paper-line)] text-[var(--charcoal-text)]/60"
                }`}
              >
                {m === "cash" ? "Cash" : "M-Pesa (till/paybill)"}
              </button>
            ))}
          </div>
          {payMethod === "mpesa" && (
            <p className="mt-2 text-xs text-[var(--charcoal-text)]/50">
              Take payment on your till/paybill directly, then record it here — this doesn&apos;t trigger an STK push.
            </p>
          )}
        </div>

        {error && <p className="text-xs text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !selectedService}
          className="w-full rounded-sm bg-[var(--ink)] px-5 py-3.5 text-sm font-medium text-[var(--gold-bright)] transition hover:bg-[var(--panel)] disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create booking & confirm payment"}
        </button>
      </form>
    </div>
  );
}
