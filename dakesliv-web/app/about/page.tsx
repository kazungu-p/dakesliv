import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-[var(--paper)]">
        <section className="border-b border-[var(--paper-line)] bg-[var(--ink)] py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="font-[family-name:var(--font-label)] text-[12px] tracking-[0.25em] text-[var(--gold-dim)] uppercase">
              About Dakesliv Group
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-snug text-[var(--cream)] md:text-4xl">
              Building Businesses. Creating Experiences.
              <br />
              Transforming Communities.
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-20">
          <p className="text-[17px] leading-relaxed text-[var(--charcoal-text)]">
            Dakesliv Group Ltd is a diversified business group offering
            professional services across grooming and wellness, events and
            hospitality, security solutions, and digital innovation. Through
            our interconnected business units, we provide clients with
            reliable, professional, and complete solutions from one trusted
            group.
          </p>

          <div className="mt-16 grid gap-10 md:grid-cols-2">
            <div className="border-t-2 border-[var(--gold)] pt-6">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--charcoal-text)]">
                Our Vision
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--charcoal-text)]/70">
                To become a leading multi-service business group in Kenya,
                recognized for excellence, innovation, professionalism, and
                positive community impact.
              </p>
            </div>
            <div className="border-t-2 border-[var(--gold)] pt-6">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--charcoal-text)]">
                Our Mission
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--charcoal-text)]/70">
                To create successful businesses that deliver exceptional
                services, empower talented professionals, and contribute to
                sustainable growth within the communities we serve.
              </p>
            </div>
          </div>

          <div className="mt-20 rounded-md bg-[var(--panel)] px-8 py-12 text-center md:px-16">
            <p className="font-[family-name:var(--font-display)] text-2xl italic leading-relaxed text-[var(--cream)] md:text-[26px]">
              &ldquo;Excellence in Service. Innovation in Business. Impact in
              Communities.&rdquo;
            </p>
            <p className="mt-4 font-[family-name:var(--font-label)] text-[11px] tracking-[0.2em] text-[var(--gold-dim)] uppercase">
              The Dakesliv Group motto
            </p>
          </div>

          <div className="mt-20">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--charcoal-text)]">
              How the businesses work together
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--charcoal-text)]/70">
              A wedding client books Dakesliv Catering &amp; Event
              Management. From there, one group quietly brings in the rest:
              Grooming &amp; Wellness for bridal beauty, Security Solutions
              for guest safety, and Digital for the wedding website and
              online RSVP system.
            </p>
            <p className="mt-4 font-medium text-[var(--gold-dim)]">
              One group. Multiple solutions. One trusted experience.
            </p>
          </div>

          <div className="mt-20 border-t border-[var(--paper-line)] pt-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--charcoal-text)]">
              Where we're headed
            </h2>
            <p className="mt-3 text-sm text-[var(--charcoal-text)]/60">
              Within the next 5–10 years, Dakesliv Group aims to become:
            </p>
            <ul className="mt-5 space-y-3">
              {[
                "A recognized Kenyan multi-service brand",
                "A major employer of skilled professionals",
                "A trusted partner for individuals and businesses",
                "A contributor to community development",
                "A company that combines business success with social responsibility",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-[var(--charcoal-text)]/80">
                  <span className="mt-0.5 text-[var(--gold-dim)]" aria-hidden>
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
