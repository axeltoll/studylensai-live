import Image from "next/image";
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import Integrations from '@/components/landing/Integrations';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';
import FeatureBlocks from '@/components/landing/FeatureBlocks';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <FeatureBlocks />
      <Features /> 
      {/* Placeholder for the third section (The last AI tools...) */}
      {/* <ToolsShowcaseSection /> */} 
      <Testimonials />
      {/* <Integrations /> Placeholder, maybe combine visually */}
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
