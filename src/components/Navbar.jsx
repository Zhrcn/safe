'use client';
import { useState, useEffect, useRef } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import Link from 'next/link';
import { APP_NAME } from '@/config/app-config';
import { Button } from '@/components/ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const pages = [
  { name: 'Features', href: '#features' },
  { name: 'Roles', href: '#roles' },
  { name: 'About', href: '#about' },
];

function HideOnScroll({ children }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
      isVisible ? "translate-y-0" : "-translate-y-full"
    )}>
      {children}
    </div>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Animated wave logic
  const wavePathRef = useRef(null);
  const navbarRef = useRef(null);
  const [waveTarget, setWaveTarget] = useState(0); // 0 = rest, 1 = max wave
  const waveState = useRef(0);
  const animFrame = useRef();

  // Mouse proximity detection
  const handleWaveMouseMove = (e) => {
    if (!navbarRef.current) return;
    const rect = navbarRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    // If mouse is within 80px of the bottom of the navbar, trigger wave
    setWaveTarget(rect.height - mouseY < 80 ? 1 : 0);
  };
  const handleWaveMouseLeave = () => setWaveTarget(0);

  // Animate the wave
  useEffect(() => {
    let running = true;
    function animate() {
      // Lerp waveState toward waveTarget
      waveState.current += (waveTarget - waveState.current) * 0.08;
      // Calculate new path (simple sine wave mod on the main curve)
      const wave = waveState.current;
      // The base path:
      // M0,224L48,197.3C96,171,192,117,288,122.7C384,128,480,192,576,197.3C672,203,768,149,864,133.3C960,117,1056,139,1152,154.7C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
      // We'll modulate the y values with a sine wave
      const baseYs = [224,197.3,171,117,122.7,128,192,197.3,203,149,133.3,117,139,154.7,171,181,186.7,192];
      const xs = [0,48,96,192,288,384,480,576,672,768,864,960,1056,1152,1248,1344,1392,1440];
      // Modulate y values
      const wavedYs = baseYs.map((y,i) => y + Math.sin(Date.now()/600 + i) * 8 * wave);
      // Reconstruct path
      let d = `M${xs[0]},${wavedYs[0]}L${xs[1]},${wavedYs[1]}C${xs[2]},${wavedYs[2]},${xs[3]},${wavedYs[3]},${xs[4]},${wavedYs[4]}C${xs[5]},${wavedYs[5]},${xs[6]},${wavedYs[6]},${xs[7]},${wavedYs[7]}C${xs[8]},${wavedYs[8]},${xs[9]},${wavedYs[9]},${xs[10]},${wavedYs[10]}C${xs[11]},${wavedYs[11]},${xs[12]},${wavedYs[12]},${xs[13]},${wavedYs[13]}C${xs[14]},${wavedYs[14]},${xs[15]},${wavedYs[15]},${xs[16]},${wavedYs[16]}L${xs[17]},192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z`;
      if (wavePathRef.current) {
        wavePathRef.current.setAttribute('d', d);
      }
      if (running) animFrame.current = requestAnimationFrame(animate);
    }
    animFrame.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [waveTarget]);

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    const section = document.getElementById(sectionId.substring(1));
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HideOnScroll>
      <div className="relative w-full z-50">
        <nav
          ref={navbarRef}
          className="sticky top-0 w-full bg-primary text-primary-foreground z-50"
          onMouseMove={handleWaveMouseMove}
          onMouseLeave={handleWaveMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/"
                className="flex items-center text-2xl font-bold text-primary hover:text-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {APP_NAME}
              </Link>
              <div className="hidden md:flex md:items-center md:space-x-2">
                {pages.map((page) => (
                  <Button
                    key={page.name}
                    variant="ghost"
                    onClick={() => scrollToSection(page.href)}
                    className="px-4 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary transition"
                  >
                    {page.name}
                  </Button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <ThemeSwitcher />
                <div className="hidden sm:flex sm:items-center sm:space-x-2">
                  <Button variant="outline" asChild className="px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="px-4 py-2 bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition">
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden focus:outline-none focus:ring-2 focus:ring-primary">
                      <MenuIcon className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col space-y-4 mt-4">
                      {pages.map((page) => (
                        <Button
                          key={page.name}
                          variant="ghost"
                          onClick={() => scrollToSection(page.href)}
                          className="px-4 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary transition"
                        >
                          {page.name}
                        </Button>
                      ))}
                      <div className="flex flex-col space-y-2 pt-4 border-t">
                        <Button variant="outline" asChild className="px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild className="px-4 py-2 bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition">
                          <Link href="/register">Sign Up</Link>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>
        {/* Animated wave at the bottom of the navbar, always attached */}
        <div className="absolute left-0 top-[100%] w-full h-[60px] sm:h-[80px] md:h-[100px] pointer-events-none select-none z-40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="absolute top-0 left-0 w-full h-full"
            aria-hidden="true"
            focusable="false"
            preserveAspectRatio="none"
            style={{ transform: 'scaleY(-1)' }}
          >
            <path
              ref={wavePathRef}
              fill="var(--color-primary)"
              fillOpacity="1"
              d="M0,224L48,197.3C96,171,192,117,288,122.7C384,128,480,192,576,197.3C672,203,768,149,864,133.3C960,117,1056,139,1152,154.7C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </div>
    </HideOnScroll>
  );
} 