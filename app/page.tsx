import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import TechnologySection from "@/components/TechnologySection";
import DemoSection from "@/components/DemoSection";
import MarketsSection from "@/components/MarketsSection";
import CompetitiveSection from "@/components/CompetitiveSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <DemoSection />
        <ProblemSection />
        <SolutionSection />
        <TechnologySection />
        <MarketsSection />
        <CompetitiveSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
