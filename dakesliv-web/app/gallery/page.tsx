import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import { fetchGalleryImages } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await fetchGalleryImages();

  return (
    <>
      <Header />
      <main className="bg-[var(--paper)]">
        <section className="border-b border-[var(--paper-line)] bg-[var(--ink)] py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
              Gallery
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--cream)] md:text-4xl">
              A look at the work across Dakesliv.
            </h1>
            <p className="mt-4 text-[var(--cream-dim)]">
              Photos from events, grooming sessions, projects and community
              work — curated by the Dakesliv team.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          {images === null && (
            <div className="rounded-md border border-[var(--paper-line)] px-8 py-16 text-center">
              <p className="text-sm text-[var(--charcoal-text)]/60">
                We couldn&apos;t reach the gallery just now — please check
                back shortly.
              </p>
            </div>
          )}

          {images !== null && images.length === 0 && (
            <div className="rounded-md border border-[var(--paper-line)] px-8 py-16 text-center">
              <p className="text-sm text-[var(--charcoal-text)]/60">
                No photos have been published yet — check back soon.
              </p>
            </div>
          )}

          {images !== null && images.length > 0 && (
            <GalleryGrid images={images} />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
