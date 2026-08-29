"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// A short list is enough here — Kenya first (majority of traffic), then the
// diaspora destinations the client's document specifically mentions
// (destination weddings, diaspora celebrations). Extend as needed; consider
// swapping to a searchable full country list (e.g. via libphonenumber-js)
// as real volume grows.
const countryCodes = [
  { code: "+254", label: "🇰🇪 Kenya (+254)" },
  { code: "+44", label: "🇬🇧 United Kingdom (+44)" },
  { code: "+1", label: "🇺🇸 / 🇨🇦 US & Canada (+1)" },
  { code: "+971", label: "🇦🇪 UAE (+971)" },
  { code: "+61", label: "🇦🇺 Australia (+61)" },
];

type Step = "phone" | "code";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [step, setStep] = useState<Step>("phone");
  const [countryCode, setCountryCode] = useState("+254");
  const [localNumber, setLocalNumber] = useState("");
  const [code, setCode] = useState("");
  const [channel, setChannel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullPhone = `${countryCode}${localNumber.replace(/^0+/, "")}`;

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setChannel(data.channel);
      setStep("code");
    } catch {
      setError(
        "Couldn't send a code right now. Check the number and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, code }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      // TODO: once there's a real session/cookie strategy, replace this
      // with an httpOnly cookie set by the backend rather than
      // localStorage — fine for now to get the loop working end to end.
      localStorage.setItem("dakesliv_token", data.accessToken);
      router.push(redirectTo);
    } catch {
      setError("That code didn't work — check it and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] items-center justify-center bg-[var(--paper)] px-6 py-20">
        <div className="w-full max-w-sm">
          <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
            Sign in
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--charcoal-text)]">
            One account, every service.
          </h1>

          {step === "phone" ? (
            <>
              <p className="mt-3 text-sm text-[var(--charcoal-text)]/60">
                Enter your phone number and we&apos;ll send you a code — no
                password to remember. Kenyan numbers get an SMS; other
                countries get a WhatsApp message, since it&apos;s more
                reliable abroad.
              </p>

              <form onSubmit={handleRequestOtp} className="mt-8 space-y-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="text-xs font-medium text-[var(--charcoal-text)]/70"
                  >
                    Phone number
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <select
                      aria-label="Country code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="rounded-sm border border-[var(--paper-line)] bg-white px-2 py-3 text-sm text-[var(--charcoal-text)] outline-none focus:border-[var(--gold-dim)]"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={localNumber}
                      onChange={(e) => setLocalNumber(e.target.value)}
                      placeholder="7XX XXX XXX"
                      className="w-full rounded-sm border border-[var(--paper-line)] bg-white px-4 py-3 text-sm text-[var(--charcoal-text)] outline-none focus:border-[var(--gold-dim)]"
                    />
                  </div>
                </div>
                {error && (
                  <p className="text-xs text-red-700">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading || localNumber.length < 6}
                  className="w-full rounded-sm bg-[var(--ink)] px-5 py-3.5 text-sm font-medium text-[var(--gold-bright)] transition hover:bg-[var(--panel)] disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send code"}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-[var(--charcoal-text)]/60">
                We sent a code to {fullPhone} over{" "}
                {channel === "sms" ? "SMS" : "WhatsApp"}. Enter it below.
              </p>

              <form onSubmit={handleVerifyOtp} className="mt-8 space-y-4">
                <div>
                  <label
                    htmlFor="code"
                    className="text-xs font-medium text-[var(--charcoal-text)]/70"
                  >
                    6-digit code
                  </label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="mt-1.5 w-full rounded-sm border border-[var(--paper-line)] bg-white px-4 py-3 text-center text-lg tracking-[0.3em] text-[var(--charcoal-text)] outline-none focus:border-[var(--gold-dim)]"
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-700">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full rounded-sm bg-[var(--ink)] px-5 py-3.5 text-sm font-medium text-[var(--gold-bright)] transition hover:bg-[var(--panel)] disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify & sign in"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setCode("");
                    setError(null);
                  }}
                  className="w-full text-center text-xs text-[var(--charcoal-text)]/50 underline decoration-[var(--paper-line)] underline-offset-4"
                >
                  Use a different number
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
