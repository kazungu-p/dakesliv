"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiFetch, formatKes, getToken, ApiBooking, ApiPayment } from "@/lib/api";

type Stage = "loading" | "ready" | "waiting" | "confirmed" | "error";

/** Turns 0712 345 678 / 254712345678 / +254712345678 into +254712345678,
 * or null if it isn't a valid Kenyan mobile number. */
function normalizeKenyanPhone(input: string): string | null {
  const digits = input.replace(/[\s-]/g, "");
  let intl: string;
  if (digits.startsWith("+")) intl = digits;
  else if (digits.startsWith("254")) intl = `+${digits}`;
  else if (digits.startsWith("0")) intl = `+254${digits.slice(1)}`;
  else intl = `+254${digits}`;
  return /^\+254[17]\d{8}$/.test(intl) ? intl : null;
}

export default function PayBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const router = useRouter();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [booking, setBooking] = useState<ApiBooking | null>(null);
  const [stage, setStage] = useState<Stage>("loading");
  const [payment, setPayment] = useState<ApiPayment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    params.then(({ bookingId }) => setBookingId(bookingId));
  }, [params]);

  useEffect(() => {
    if (!bookingId) return;
    if (!getToken()) {
      router.push(`/sign-in?redirect=/pay/${bookingId}`);
      return;
    }
    apiFetch<ApiBooking>(`/bookings/${bookingId}`)
      .then((b) => {
        setBooking(b);
        setStage("ready");
      })
      .catch(() => setStage("error"));
    // Customers who signed in with Google or email may not have a phone on
    // file yet — pre-fill it if they do, otherwise they type it below.
    apiFetch<{ phone?: string | null }>("/auth/me")
      .then((u) => {
        if (u.phone) setPhone(u.phone);
      })
      .catch(() => {});
  }, [bookingId, router]);

  // Poll for payment confirmation once M-Pesa has been triggered. This
  // reflects whatever our own database says (updated by IntaSend's
  // webhook) — so it only works once the webhook can actually reach this
  // server. On localhost that means a tunnel (e.g. ngrok) pointed at the
  // backend and configured in the IntaSend dashboard; without one, this
  // will poll indefinitely and the payment needs confirming manually via
  // POST /payments/:id/confirm for local testing.
  useEffect(() => {
    if (stage !== "waiting" || !payment) return;
    const interval = setInterval(async () => {
      try {
        const updated = await apiFetch<ApiPayment>(`/payments/${payment.id}`);
        if (updated.status === "confirmed") {
          setPayment(updated);
          setStage("confirmed");
          clearInterval(interval);
        } else if (updated.status === "failed") {
          setError("The payment didn't go through. Please try again.");
          setStage("ready");
          clearInterval(interval);
        }
      } catch {
        // transient network error — keep polling
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [stage, payment]);

  async function handlePay() {
    if (!bookingId || !booking) return;
    setError(null);
    const mpesaPhone = normalizeKenyanPhone(phone);
    if (!mpesaPhone) {
      setError("Enter a valid Safaricom number, e.g. 0712 345 678.");
      return;
    }
    setStage("waiting");
    try {
      const created = await apiFetch<ApiPayment>("/payments", {
        method: "POST",
        body: JSON.stringify({
          bookingId,
          amount: booking.service.price,
          method: "mpesa",
          phone: mpesaPhone,
        }),
      });
      setPayment(created);
    } catch (err) {
      if (err instanceof Error && err.message === "SESSION_EXPIRED") {
        router.push(`/sign-in?redirect=/pay/${bookingId}`);
        return;
      }
      setError("Couldn't start the M-Pesa payment. Please try again.");
      setStage("ready");
    }
  }

  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] items-center justify-center bg-[var(--paper)] px-6 py-20">
        <div className="w-full max-w-sm text-center">
          {stage === "loading" && (
            <p className="text-sm text-[var(--charcoal-text)]/50">Loading…</p>
          )}

          {stage === "error" && (
            <>
              <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--charcoal-text)]">
                We couldn&apos;t find that booking
              </h1>
              <p className="mt-3 text-sm text-[var(--charcoal-text)]/60">
                It may not belong to your account, or the booking system is
                temporarily unreachable.
              </p>
            </>
          )}

          {(stage === "ready" || stage === "waiting") && booking && (
            <>
              <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
                Confirm &amp; pay
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--charcoal-text)]">
                {booking.service.name}
              </h1>
              <p className="mt-1 text-sm text-[var(--charcoal-text)]/60">
                {new Date(booking.scheduledAt).toLocaleString("en-KE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <p className="mt-4 text-2xl font-medium text-[var(--gold-dim)]">
                {formatKes(booking.service.price)}
              </p>

              {stage === "ready" && (
                <div className="mt-6 text-left">
                  <label
                    htmlFor="mpesa-phone"
                    className="text-xs font-medium text-[var(--charcoal-text)]/70"
                  >
                    M-Pesa phone number
                  </label>
                  <input
                    id="mpesa-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0712 345 678"
                    className="mt-1.5 w-full rounded-sm border border-[var(--paper-line)] bg-white px-4 py-3 text-sm text-[var(--charcoal-text)] outline-none focus:border-[var(--gold-dim)]"
                  />
                </div>
              )}

              {error && <p className="mt-4 text-xs text-red-700">{error}</p>}

              {stage === "ready" ? (
                <button
                  onClick={handlePay}
                  className="mt-8 w-full rounded-sm bg-[var(--ink)] px-5 py-3.5 text-sm font-medium text-[var(--gold-bright)] transition hover:bg-[var(--panel)]"
                >
                  Pay with M-Pesa
                </button>
              ) : (
                <div className="mt-8 rounded-md border border-[var(--gold-dim)]/40 bg-[var(--panel)] px-6 py-8">
                  <p className="text-sm text-[var(--cream)]">
                    Check your phone for the M-Pesa prompt and enter your PIN
                    to complete payment.
                  </p>
                  <p className="mt-3 text-xs text-[var(--cream-dim)]">
                    Waiting for confirmation…
                  </p>
                </div>
              )}
            </>
          )}

          {stage === "confirmed" && payment && (
            <>
              <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
                Booking confirmed
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--charcoal-text)]">
                You&apos;re all set.
              </h1>
              <p className="mt-3 text-sm text-[var(--charcoal-text)]/60">
                A confirmation and tax receipt will be sent to you shortly.
              </p>
              <a
                href="/"
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--gold-dim)] hover:gap-2.5"
              >
                Back to home
                <span aria-hidden>→</span>
              </a>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
