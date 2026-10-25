"use client";

import { useEffect, useRef, useState } from "react";
import { HUB, formatKm, haversineKm, travelFeeForDistance } from "@/lib/geo";

type SearchResult = {
  label: string;
  lat: number;
  lng: number;
};

type Picked = { label: string; lat: number; lng: number } | null;

// Free, no-API-key geocoding via OpenStreetMap's Nominatim. Fine for an
// MVP / low-traffic launch, but it's a shared public service with a strict
// ~1 request/second usage policy, not meant for sustained commercial
// autocomplete traffic. Before this gets real volume, switch to either a
// self-hosted Nominatim/Photon instance or a paid provider (Google Places,
// Mapbox, OpenCage) — swap it out here, the rest of this component doesn't
// care where searchLocations' results come from.
async function searchLocations(query: string): Promise<SearchResult[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", query);
  url.searchParams.set("countrycodes", "ke");
  url.searchParams.set("limit", "5");
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("search failed");
  const data: Array<{ display_name: string; lat: string; lon: string }> = await res.json();
  return data.map((d) => ({
    label: d.display_name,
    lat: parseFloat(d.lat),
    lng: parseFloat(d.lon),
  }));
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("reverse geocode failed");
  const data: { display_name?: string } = await res.json();
  return data.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export default function LocationPriceEstimator() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [picked, setPicked] = useState<Picked>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const q = query.trim();
      if (q.length < 3) {
        setResults([]);
        return;
      }
      setSearching(true);
      setError(null);
      try {
        const r = await searchLocations(q);
        setResults(r);
      } catch {
        setError("Couldn't search locations just now — try again in a moment.");
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function detectLocation() {
    if (!("geolocation" in navigator)) {
      setError("Your browser doesn't support location detection — search for your area instead.");
      return;
    }
    setDetecting(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const label = await reverseGeocode(latitude, longitude);
          setPicked({ label, lat: latitude, lng: longitude });
          setResults([]);
          setQuery("");
        } catch {
          setPicked({ label: "Current location", lat: latitude, lng: longitude });
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setDetecting(false);
        setError("Couldn't get your location — check your browser's permission, or search for your area instead.");
      },
      { timeout: 10000 },
    );
  }

  function selectResult(r: SearchResult) {
    setPicked({ label: r.label, lat: r.lat, lng: r.lng });
    setResults([]);
    setQuery("");
  }

  const distanceKm = picked ? haversineKm(HUB.lat, HUB.lng, picked.lat, picked.lng) : null;
  const band = distanceKm !== null ? travelFeeForDistance(distanceKm) : null;

  return (
    <div className="rounded-md border border-[var(--paper-line)] bg-white p-6 md:p-8">
      <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--charcoal-text)]">
        Get a delivery estimate
      </h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--charcoal-text)]/70">
        Our stylists come to you, so a visit outside our base adds a travel
        fee — shown transparently below. The service price itself never
        changes by area; only this travel fee does.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={detectLocation}
          disabled={detecting}
          className="rounded-sm bg-[var(--gold)] px-5 py-2.5 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--gold-bright)] disabled:opacity-50"
        >
          {detecting ? "Detecting…" : "Use my current location"}
        </button>
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Or search your area, e.g. Nyali, Changamwe…"
            className="w-full rounded-sm border border-[var(--paper-line)] px-4 py-2.5 text-sm text-[var(--charcoal-text)]"
          />
          {(results.length > 0 || searching) && (
            <div className="absolute z-10 mt-1 w-full rounded-sm border border-[var(--paper-line)] bg-white shadow-lg">
              {searching && (
                <p className="px-4 py-2.5 text-xs text-[var(--charcoal-text)]/50">Searching…</p>
              )}
              {results.map((r) => (
                <button
                  key={`${r.lat},${r.lng}`}
                  onClick={() => selectResult(r)}
                  className="block w-full px-4 py-2.5 text-left text-sm text-[var(--charcoal-text)] hover:bg-[var(--panel)]"
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      {picked && distanceKm !== null && band && (
        <div className="mt-6 rounded-md border border-[var(--gold-dim)]/30 bg-[var(--panel)] p-5">
          <p className="text-xs tracking-wide text-[var(--gold-dim)] uppercase">
            {picked.label}
          </p>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <span className="text-sm text-[var(--cream-dim)]">
              Approximately {formatKm(distanceKm)} from our base
            </span>
            <span className="text-lg font-medium text-[var(--gold-bright)]">
              {band.fee === 0 ? "Free travel" : `+ KES ${band.fee.toLocaleString()} travel fee`}
            </span>
          </div>
          <p className="mt-2 text-xs text-[var(--cream-dim)]/70">
            Added to the price of whichever service you book — the service
            price itself is the same everywhere.
          </p>
        </div>
      )}

      <details className="mt-5 text-xs text-[var(--charcoal-text)]/50">
        <summary className="cursor-pointer select-none">How the travel fee is worked out</summary>
        <ul className="mt-2 ml-4 list-disc space-y-1">
          <li>Within 5 km of our base — free</li>
          <li>5–15 km — KES 300</li>
          <li>15–30 km — KES 700</li>
          <li>Over 30 km — KES 1,200, please confirm availability first</li>
        </ul>
        <p className="mt-2">
          Estimate only, measured in a straight line rather than actual
          road distance — final travel fee is confirmed when you book.
        </p>
      </details>
    </div>
  );
}
