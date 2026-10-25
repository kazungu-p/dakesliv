// Distance-based travel fee for home/mobile grooming visits.
//
// Deliberately NOT neighbourhood-based pricing. The service price stays the
// same everywhere — only a transparent, distance-based travel fee is added,
// shown as its own line item before anyone books. See the estimator's
// explanatory copy in components/LocationPriceEstimator.tsx for why this
// matters: pricing the same haircut differently by area name (rather than
// by an honest, visible delivery cost) reads as arbitrary once clients
// compare notes, and the gap can look like it tracks a neighbourhood's
// perceived wealth rather than any real cost to Dakesliv.
//
// HUB is the point travel distance is measured from — set this to the
// studio/base the grooming team actually works out of. If there's more
// than one base, the backend should instead return the distance to the
// *nearest* one; this placeholder just picks a single central point.
export const HUB = {
  label: "Mombasa CBD (placeholder — set to your real base)",
  lat: -4.0435,
  lng: 39.6682,
};

export type FeeBand = {
  upToKm: number | null; // null = "and beyond"
  fee: number; // KES, 0 = free
  label: string;
};

// Flat bands rather than a per-km rate: easier for a client to understand
// and to sanity-check ("why KES 300?") than a formula, and easier for you
// to tune without touching code (just edit the numbers below).
export const TRAVEL_FEE_BANDS: FeeBand[] = [
  { upToKm: 5, fee: 0, label: "Within 5 km — free" },
  { upToKm: 15, fee: 300, label: "5–15 km — KES 300" },
  { upToKm: 30, fee: 700, label: "15–30 km — KES 700" },
  { upToKm: null, fee: 1200, label: "Over 30 km — KES 1,200 (please confirm availability)" },
];

/** Great-circle distance in km between two lat/lng points. */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function travelFeeForDistance(km: number): FeeBand {
  return TRAVEL_FEE_BANDS.find((b) => b.upToKm === null || km <= b.upToKm)!;
}

export function formatKm(km: number): string {
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}
