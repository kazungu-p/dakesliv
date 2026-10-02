import { API_URL, ApiBooking, formatKes } from "./api";

export { formatKes, API_URL };

export function getStaffToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("dakesliv_staff_token");
}

export type StaffRole = "owner" | "unit_manager" | "front_desk";

export type StaffAccount = {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  businessUnit: { id: string; name: string; slug: string } | null;
};

export type AdminBooking = ApiBooking & {
  channel: string;
  user: { id: string; phone: string; name: string };
};

export type PendingInvoice = {
  id: string;
  status: string;
  vatAmount: string;
  issuedAt: string;
  payment: {
    amount: string;
    booking: AdminBooking;
  };
};

/** Thin wrapper adding the staff Bearer token, distinct from the customer apiFetch. */
export async function staffApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStaffToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("STAFF_SESSION_EXPIRED");
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json();
}
