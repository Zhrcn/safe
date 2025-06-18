'use client';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AboutSection from '@/components/AboutSection';
import RolesSection from '@/components/RolesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="w-full">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <RolesSection />
        <TestimonialsSection />
        <Footer />
      </main>
    </div>
  );
}