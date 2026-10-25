"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { API_URL } from "@/lib/api";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const RESEND_SECONDS = 30; // matches the backend's resend cooldown

type Step = "choose" | "code";

/** Pulls a human-readable message out of a NestJS error response. */
async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    const msg = Array.isArray(body.message) ? body.message[0] : body.message;
    return typeof msg === "string" ? msg : fallback;
  } catch {
    return fallback;
  }
}

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
  const [step, setStep] = useState<Step>("choose");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  function finishSignIn(accessToken: string) {
    // TODO: once there's a real session/cookie strategy, replace this with
    // an httpOnly cookie set by the backend rather than localStorage — fine
    // for now to get the loop working end to end.
    localStorage.setItem("dakesliv_token", accessToken);
    router.push(redirectTo);
  }

  async function handleGoogle(idToken: string) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error(await readError(res, "Google sign-in failed."));
      const data = await res.json();
      finishSignIn(data.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setLoading(false);
    }
  }

  async function requestCode() {
    const res = await fetch(`${API_URL}/auth/email/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error(await readError(res, "Couldn't send a code right now."));
    setResendIn(RESEND_SECONDS);
  }

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestCode();
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send a code right now.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    setLoading(true);
    try {
      await requestCode();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send a code right now.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/email/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) throw new Error(await readError(res, "That code didn't work."));
      const data = await res.json();
      finishSignIn(data.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code didn't work.");
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

          {step === "choose" ? (
            <>
              <p className="mt-3 text-sm text-[var(--charcoal-text)]/60">
                Continue with Google, or enter your email and we&apos;ll send
                you a code — no password to remember.
              </p>

              {GOOGLE_CLIENT_ID ? (
                <div className="mt-8 flex justify-center">
                  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <GoogleLogin
                      onSuccess={(r) => {
                        if (r.credential) handleGoogle(r.credential);
                        else setError("Google sign-in failed.");
                      }}
                      onError={() => setError("Google sign-in failed.")}
                      text="continue_with"
                      shape="rectangular"
                      width="320"
                    />
                  </GoogleOAuthProvider>
                </div>
              ) : (
                <p className="mt-8 text-xs text-red-700">
                  Google sign-in isn&apos;t configured — set
                  NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local.
                </p>
              )}

              <div className="my-6 flex items-center gap-3 text-xs text-[var(--charcoal-text)]/40">
                <span className="h-px flex-1 bg-[var(--paper-line)]" />
                or
                <span className="h-px flex-1 bg-[var(--paper-line)]" />
              </div>

              <form onSubmit={handleRequestCode} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="text-xs font-medium text-[var(--charcoal-text)]/70"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@icloud.com"
                    className="mt-1.5 w-full rounded-sm border border-[var(--paper-line)] bg-white px-4 py-3 text-sm text-[var(--charcoal-text)] outline-none focus:border-[var(--gold-dim)]"
                  />
                </div>
                {error && <p className="text-xs text-red-700">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !email.includes("@")}
                  className="w-full rounded-sm bg-[var(--ink)] px-5 py-3.5 text-sm font-medium text-[var(--gold-bright)] transition hover:bg-[var(--panel)] disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Email me a code"}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-[var(--charcoal-text)]/60">
                We emailed a code to {email}. It can take a minute — check
                your spam folder if you don&apos;t see it.
              </p>

              <form onSubmit={handleVerify} className="mt-8 space-y-4">
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
                    autoComplete="one-time-code"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="mt-1.5 w-full rounded-sm border border-[var(--paper-line)] bg-white px-4 py-3 text-center text-lg tracking-[0.3em] text-[var(--charcoal-text)] outline-none focus:border-[var(--gold-dim)]"
                  />
                </div>
                {error && <p className="text-xs text-red-700">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full rounded-sm bg-[var(--ink)] px-5 py-3.5 text-sm font-medium text-[var(--gold-bright)] transition hover:bg-[var(--panel)] disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify & sign in"}
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading || resendIn > 0}
                  className="w-full text-center text-xs text-[var(--charcoal-text)]/60 underline decoration-[var(--paper-line)] underline-offset-4 disabled:no-underline disabled:opacity-60"
                >
                  {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("choose");
                    setCode("");
                    setError(null);
                  }}
                  className="w-full text-center text-xs text-[var(--charcoal-text)]/50 underline decoration-[var(--paper-line)] underline-offset-4"
                >
                  Use a different email
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
