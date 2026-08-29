export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("dakesliv_token");
}

export function formatKes(amount: string | number): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return `KES ${value.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;
}

export type ApiService = {
  id: string;
  name: string;
  price: string;
  durationMinutes: number;
  businessUnit: { id: string; name: string; slug: string };
};

export type ApiBusinessUnit = {
  id: string;
  name: string;
  slug: string;
  services: ApiService[];
};

export type ApiBooking = {
  id: string;
  scheduledAt: string;
  status: string;
  service: ApiService;
};

export type ApiPayment = {
  id: string;
  amount: string;
  method: string;
  status: string;
  booking: ApiBooking;
};

/** Fetches business units + services for the unit pages. Returns null on any
 * failure (backend down, network error) so pages can fall back gracefully
 * rather than showing a broken page. */
export async function fetchBusinessUnits(): Promise<ApiBusinessUnit[] | null> {
  try {
    const res = await fetch(`${API_URL}/business-units`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchService(id: string): Promise<ApiService | null> {
  try {
    const res = await fetch(`${API_URL}/services/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** Thin wrapper adding the Bearer token and throwing a readable error on failure. */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("SESSION_EXPIRED");
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json();
}
