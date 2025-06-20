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
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/60 to-background text-foreground relative overflow-x-hidden">
      {/* Dashboard-style background pattern */}
      <div
        className="pointer-events-none select-none fixed inset-0 z-0 opacity-10"
        aria-hidden="true"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239CA3AF\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M0 0h60v60H0z\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'20\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '120px 120px',
        }}
      />
      <main className="relative z-10 w-full flex flex-col gap-0">
        <Navbar />
        <section className="mb-0">
          <HeroSection />
        </section>
        {/* Section divider */}
        <div className="w-full h-8 bg-gradient-to-b from-transparent to-muted/30" />
        <section className="py-0">
          <FeaturesSection />
        </section>
        <div className="w-full h-8 bg-gradient-to-b from-transparent to-muted/40" />
        <section className="py-0">
          <AboutSection />
        </section>
        <div className="w-full h-8 bg-gradient-to-b from-transparent to-muted/30" />
        <section className="py-0">
          <RolesSection />
        </section>
        <div className="w-full h-8 bg-gradient-to-b from-transparent to-muted/40" />
        <section className="py-0">
          <TestimonialsSection />
        </section>
        <Footer />
      </main>
    </div>
  );
}