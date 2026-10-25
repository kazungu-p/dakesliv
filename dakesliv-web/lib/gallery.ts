// Gallery categories shared by the public gallery page and the admin
// upload tool. Reuses the business-unit slugs so a photo filed under
// "events" also makes sense as that unit's slug elsewhere in the app, plus
// a couple of categories that aren't tied to one business unit.
export const galleryCategories = [
  { slug: "grooming", label: "Grooming & Wellness" },
  { slug: "events", label: "Catering & Events" },
  { slug: "security", label: "Security" },
  { slug: "digital", label: "Digital" },
  { slug: "foundation", label: "Foundation" },
  { slug: "general", label: "General / Behind the scenes" },
] as const;

export type GalleryCategorySlug = (typeof galleryCategories)[number]["slug"];

export function categoryLabel(slug: string): string {
  return galleryCategories.find((c) => c.slug === slug)?.label ?? slug;
}
