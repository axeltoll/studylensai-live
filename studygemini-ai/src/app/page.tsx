import Image from "next/image";
import Navbar from '@/app/components/landing/Navbar';
import Hero from '@/app/components/landing/Hero';
import Features from '@/app/components/landing/Features';
import Pricing from '@/app/components/landing/Pricing';
import Testimonials from '@/app/components/landing/Testimonials';
import FAQ from '@/app/components/landing/FAQ';
import Integrations from '@/app/components/landing/Integrations';
import CTA from '@/app/components/landing/CTA';
import Footer from '@/app/components/landing/Footer';
import FeatureBlocks from '@/app/components/landing/FeatureBlocks';

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
