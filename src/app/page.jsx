'use client';

import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AboutSection from '@/components/AboutSection';
import RolesSection from '@/components/RolesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div>
      <Box component="main" className='w-full' sx={{ minHeight: '100vh' }}>
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <RolesSection />
        <TestimonialsSection />
        <Footer />  
      </Box>
    </div>
  );
}