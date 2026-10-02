"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { staffApiFetch, formatKes, PendingInvoice } from "@/lib/admin-api";

export default function PendingInvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<PendingInvoice[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    staffApiFetch<PendingInvoice[]>("/invoices/pending")
      .then(setInvoices)
      .catch((err) => {
        if (err instanceof Error && err.message === "STAFF_SESSION_EXPIRED") {
          router.push("/admin/login");
          return;
        }
        setError(
          "Couldn't load pending invoices — you may not have permission, or Odoo isn't configured yet.",
        );
      });
  }, [router]);

  return (
    <div>
      <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
        Compliance
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--charcoal-text)]">
        Pending eTIMS transmission
      </h1>
      <p className="mt-2 text-sm text-[var(--charcoal-text)]/60">
        Invoices waiting on Odoo to transmit to KRA. A payment being here
        doesn&apos;t mean anything is wrong — transmission can take a
        moment — but anything stuck here for a while is worth checking in Odoo directly.
      </p>

      {error && <p className="mt-6 text-sm text-red-700">{error}</p>}

      {invoices === null && !error && (
        <p className="mt-8 text-sm text-[var(--charcoal-text)]/50">Loading…</p>
      )}

      {invoices && invoices.length === 0 && (
        <p className="mt-8 text-sm text-[var(--charcoal-text)]/50">
          Nothing pending — every invoice has transmitted.
        </p>
      )}

      {invoices && invoices.length > 0 && (
        <div className="mt-8 divide-y divide-[var(--paper-line)] rounded-md border border-[var(--paper-line)] bg-white">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-medium text-[var(--charcoal-text)]">
                  {inv.payment.booking.service.name}
                </p>
                <p className="mt-0.5 text-xs text-[var(--charcoal-text)]/60">
                  {inv.payment.booking.user.name} · Issued {new Date(inv.issuedAt).toLocaleDateString("en-KE")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[var(--gold-dim)]">
                  {formatKes(inv.payment.amount)}
                </p>
                <p className="text-xs text-[var(--charcoal-text)]/50">
                  VAT {formatKes(inv.vatAmount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
