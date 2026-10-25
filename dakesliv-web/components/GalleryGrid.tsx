"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/api";
import { categoryLabel } from "@/lib/gallery";

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  // Only show tabs for categories that actually have at least one image,
  // so the filter bar never offers an empty category.
  const presentCategories = useMemo(() => {
    const slugs = Array.from(new Set(images.map((img) => img.category)));
    return slugs.map((slug) => ({ slug, label: categoryLabel(slug) }));
  }, [images]);

  const [active, setActive] = useState<string>("all");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const filtered =
    active === "all" ? images : images.filter((img) => img.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActive("all")}
          className={`rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide uppercase transition ${
            active === "all"
              ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--ink)]"
              : "border-[var(--paper-line)] text-[var(--charcoal-text)]/60 hover:border-[var(--gold-dim)]"
          }`}
        >
          All
        </button>
        {presentCategories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide uppercase transition ${
              active === c.slug
                ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--ink)]"
                : "border-[var(--paper-line)] text-[var(--charcoal-text)]/60 hover:border-[var(--gold-dim)]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-[var(--charcoal-text)]/50">
          No photos in this category yet.
        </p>
      ) : (
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((img) => (
            <button
              key={img.id}
              onClick={() => setLightbox(img)}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-md border border-[var(--paper-line)] bg-white text-left"
            >
              <div className="relative">
                <Image
                  src={img.url}
                  alt={img.caption ?? categoryLabel(img.category)}
                  width={600}
                  height={450}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full object-cover transition group-hover:opacity-90"
                />
              </div>
              {img.caption && (
                <p className="px-3 py-2 text-xs text-[var(--charcoal-text)]/70">
                  {img.caption}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6"
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute top-5 right-5 text-3xl leading-none text-[var(--cream)]/80 hover:text-[var(--cream)]"
          >
            ×
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-4xl"
          >
            <Image
              src={lightbox.url}
              alt={lightbox.caption ?? categoryLabel(lightbox.category)}
              width={1200}
              height={900}
              sizes="90vw"
              className="max-h-[80vh] w-auto rounded-sm object-contain"
            />
            <div className="mt-3 flex items-center justify-between text-sm text-[var(--cream-dim)]">
              <span>{lightbox.caption}</span>
              <span className="text-xs tracking-wide text-[var(--gold-dim)] uppercase">
                {categoryLabel(lightbox.category)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
