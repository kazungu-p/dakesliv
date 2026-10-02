import Header from "@/components/Header";
import Hero from "@/components/Hero";
import UnitsGrid from "@/components/UnitsGrid";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

// FoundationBanner is intentionally not rendered here until the Foundation
// program is actually running — the component, its /foundation page, and
// the backend's foundation_allocations logic all stay fully working, just
// not publicly surfaced yet. To bring it back: import FoundationBanner from
// "@/components/FoundationBanner" and add <FoundationBanner /> after
// <HowItWorks />.

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <UnitsGrid />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
