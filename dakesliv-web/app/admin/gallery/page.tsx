"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  staffApiFetch,
  staffApiUpload,
  GalleryImage,
} from "@/lib/admin-api";
import { galleryCategories, categoryLabel } from "@/lib/gallery";

export default function AdminGalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>(galleryCategories[0].slug);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function load() {
    staffApiFetch<GalleryImage[]>("/gallery")
      .then(setImages)
      .catch((err) => {
        if (err instanceof Error && err.message === "STAFF_SESSION_EXPIRED") {
          router.push("/admin/login");
          return;
        }
        setError("Couldn't load the gallery — the backend may not have the /gallery endpoint set up yet.");
      });
  }

  useEffect(load, [router]);

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setUploadError("Choose an image to upload.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      if (caption.trim()) formData.append("caption", caption.trim());

      const created = await staffApiUpload<GalleryImage>("/gallery", formData);
      setImages((prev) => (prev ? [created, ...prev] : [created]));
      setFile(null);
      setCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      if (err instanceof Error && err.message === "STAFF_SESSION_EXPIRED") {
        router.push("/admin/login");
        return;
      }
      setUploadError(
        err instanceof Error
          ? err.message
          : "Upload failed — the backend may not have the /gallery upload endpoint set up yet.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await staffApiFetch(`/gallery/${id}`, { method: "DELETE" });
      setImages((prev) => prev?.filter((img) => img.id !== id) ?? prev);
    } catch (err) {
      if (err instanceof Error && err.message === "STAFF_SESSION_EXPIRED") {
        router.push("/admin/login");
        return;
      }
      setError("Couldn't delete that photo — try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
        Content
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--charcoal-text)]">
        Gallery
      </h1>
      <p className="mt-2 text-sm text-[var(--charcoal-text)]/60">
        Upload photos for the public gallery and sort them into a category.
        Published photos appear immediately at /gallery.
      </p>

      <form
        onSubmit={handleUpload}
        className="mt-8 grid gap-4 rounded-md border border-[var(--paper-line)] bg-white p-6 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[var(--charcoal-text)]/70">
            Image
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1.5 block w-full text-sm text-[var(--charcoal-text)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--charcoal-text)]/70">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1.5 w-full rounded-sm border border-[var(--paper-line)] px-3 py-2 text-sm text-[var(--charcoal-text)]"
          >
            {galleryCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--charcoal-text)]/70">
            Caption (optional)
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Diaspora wedding, Karen — March 2026"
            className="mt-1.5 w-full rounded-sm border border-[var(--paper-line)] px-3 py-2 text-sm text-[var(--charcoal-text)]"
          />
        </div>

        <div className="sm:col-span-2">
          {uploadError && <p className="mb-3 text-sm text-red-700">{uploadError}</p>}
          <button
            type="submit"
            disabled={uploading}
            className="rounded-sm bg-[var(--gold)] px-6 py-2.5 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--gold-bright)] disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Upload photo"}
          </button>
        </div>
      </form>

      {error && <p className="mt-6 text-sm text-red-700">{error}</p>}

      {images === null && !error && (
        <p className="mt-8 text-sm text-[var(--charcoal-text)]/50">Loading…</p>
      )}

      {images && images.length === 0 && (
        <p className="mt-8 text-sm text-[var(--charcoal-text)]/50">
          No photos uploaded yet.
        </p>
      )}

      {images && images.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-md border border-[var(--paper-line)] bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- admin
                  thumbnail grid of arbitrary upload URLs; not worth wiring
                  through next/image config churn for an internal tool. */}
              <img src={img.url} alt={img.caption ?? img.category} className="h-40 w-full object-cover" />
              <div className="flex items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="text-xs font-medium tracking-wide text-[var(--gold-dim)] uppercase">
                    {categoryLabel(img.category)}
                  </p>
                  {img.caption && (
                    <p className="mt-0.5 text-sm text-[var(--charcoal-text)]/70">
                      {img.caption}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={deletingId === img.id}
                  className="shrink-0 text-xs font-medium text-red-700 hover:underline disabled:opacity-50"
                >
                  {deletingId === img.id ? "Removing…" : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
