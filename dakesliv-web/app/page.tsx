import Header from "@/components/Header";
import Hero from "@/components/Hero";
import UnitsGrid from "@/components/UnitsGrid";
import HowItWorks from "@/components/HowItWorks";
import FoundationBanner from "@/components/FoundationBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <UnitsGrid />
        <HowItWorks />
        <FoundationBanner />
      </main>
      <Footer />
    </>
  );
}
