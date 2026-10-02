"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { API_URL, StaffAccount } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/staff/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error();
      const data: { staff: StaffAccount; accessToken: string } = await res.json();
      localStorage.setItem("dakesliv_staff_token", data.accessToken);
      router.push("/admin");
    } catch {
      setError("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--ink)] px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="DAKESLIV Group" width={48} height={48} className="rounded-sm" />
        </div>
        <p className="mt-6 text-center font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
          Staff admin
        </p>
        <h1 className="mt-2 text-center font-[family-name:var(--font-display)] text-2xl text-[var(--cream)]">
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="text-xs font-medium text-[var(--cream-dim)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-[var(--rule)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--cream)] outline-none focus:border-[var(--gold-dim)]"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-medium text-[var(--cream-dim)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-[var(--rule)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--cream)] outline-none focus:border-[var(--gold-dim)]"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-[var(--gold)] px-5 py-3.5 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--gold-bright)] disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--cream-dim)]/60">
          Staff accounts only. No public sign-up — contact an owner for access.
        </p>
      </div>
    </div>
  );
}
