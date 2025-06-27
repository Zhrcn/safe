'use client';
import { useState, useEffect, useRef } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const NAV_SECTIONS = [
  { name: 'about', href: '#about' },
  { name: 'services', href: '#services' },
  { name: 'doctors', href: '#doctors' },
  { name: 'departments', href: '#departments' },
  { name: 'contact', href: '#contact' },
];

function HideOnScroll({ children }) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY.current || currentScrollY < 10);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-transform duration-300',
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      {children}
    </div>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  const wavePathRef = useRef(null);
  const navbarRef = useRef(null);
  const [waveTarget, setWaveTarget] = useState(0);
  const waveState = useRef(0);
  const animFrame = useRef();

  const handleWaveMouseMove = (e) => {
    if (!navbarRef.current) return;
    const rect = navbarRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    setWaveTarget(rect.height - mouseY < 80 ? 1 : 0);
  };
  const handleWaveMouseLeave = () => setWaveTarget(0);

  useEffect(() => {
    let running = true;
    function animate() {
      waveState.current += (waveTarget - waveState.current) * 0.08;
      const wave = waveState.current;
      const baseYs = [224,197.3,171,117,122.7,128,192,197.3,203,149,133.3,117,139,154.7,171,181,186.7,192];
      const xs = [0,48,96,192,288,384,480,576,672,768,864,960,1056,1152,1248,1344,1392,1440];
      const wavedYs = baseYs.map((y,i) => y + Math.sin(Date.now()/600 + i) * 8 * wave);
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
    if (sectionId.startsWith('#')) {
      const section = document.getElementById(sectionId.substring(1));
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <HideOnScroll>
      <div className="relative w-full z-50">
        <nav
          ref={navbarRef}
          className="sticky top-0 w-full h-16 sm:h-20 bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-lg transition-all duration-300 px-3 sm:px-6 md:px-12"
          onMouseMove={handleWaveMouseMove}
          onMouseLeave={handleWaveMouseLeave}
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between h-16 sm:h-20">
            <a
              href="/"
              className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              aria-label="Home"
            >
              <span
                className="relative flex items-center justify-center transition-all duration-300"
                style={{ width: 48, height: 48 }}
                onMouseEnter={() => setLogoHovered(true)}
                onMouseLeave={() => setLogoHovered(false)}
              >
                <svg
                  viewBox="0 0 60 54"
                  width={40}
                  height={36}
                  className="absolute z-10 transition-all duration-300 pointer-events-none"
                  style={{
                    left: 0,
                    top: 0,
                    opacity: 1,
                    transform: logoHovered ? 'scale(1.08)' : 'scale(1)',
                  }}
                  aria-hidden="true"
                >
                  <path
                    d="M30 52s-1.7-1.5-4.2-3.4C13.2 39.2 2 30.1 2 19.5 2 11.1 8.6 4.5 17 4.5c4.2 0 8.1 2 10.5 5.2C29.9 6.5 33.8 4.5 38 4.5c8.4 0 15 6.6 15 15 0 10.6-11.2 19.7-23.8 29.1C31.7 50.5 30 52 30 52z"
                    fill={logoHovered ? '#fff' : 'var(--color-primary)'}
                    className="transition-all duration-300"
                  />
                </svg>
                <img
                  src="/logo_traced.svg"
                  alt="SAFE Logo"
                  className="z-20 transition-all duration-300"
                  style={{
                    width: logoHovered ? 28 : 32,
                    height: logoHovered ? 28 : 32,
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) scale(${logoHovered ? 1 : 1.12})`,
                    filter: logoHovered
                      ? 'brightness(0) saturate(100%) sepia(100%) hue-rotate(var(--primary-hue, 210deg)) saturate(600%) brightness(0.95)'
                      : 'invert(1) brightness(1000%)',
                  }}
                  draggable="false"
                  aria-label="SAFE Logo"
                />
              </span>
              <span
                className="text-lg sm:text-2xl font-extrabold tracking-tight ml-2"
                style={{
                  color: 'var(--color-on-primary)',
                }}
              >
                {t('appName')}
              </span>
            </a>
            <div className="hidden md:flex md:items-center md:space-x-2">
              {NAV_SECTIONS.map((section) => (
                <button
                  key={section.name}
                  onClick={() => scrollToSection(section.href)}
                  className="relative px-3 sm:px-5 py-2 font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-on-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-on-primary)/10] group text-sm sm:text-base"
                  style={{ fontWeight: 600, background: 'none', border: 'none' }}
                >
                  <span className="relative z-10">{t(`navbar.${section.name}`)}</span>
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-1 w-8 h-1 rounded-full bg-[var(--color-on-primary)] opacity-0 group-hover:opacity-80 transition-all duration-200" />
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <MenuIcon className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-[var(--color-primary)]/95 shadow-xl text-[var(--color-on-primary)] w-full max-w-xs sm:max-w-sm md:max-w-md"
                >
                  <SheetHeader>
                    <SheetTitle>{t('menu', { defaultValue: 'Menu' })}</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 mt-4">
                    {NAV_SECTIONS.map((section) => (
                      <Button
                        key={section.name}
                        variant="ghost"
                        onClick={() => scrollToSection(section.href)}
                        className="px-5 py-3 text-lg font-semibold rounded-full text-[var(--color-on-primary)] hover:bg-[var(--color-on-primary)/10] focus:outline-none focus:ring-2 focus:ring-[var(--color-on-primary)] transition-all duration-200"
                      >
                        {t(`navbar.${section.name}`)}
                      </Button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
        <div className="absolute left-0 top-[100%] w-full h-[60px] sm:h-[80px] md:h-[100px] select-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="absolute top-0 left-0 w-full h-full"
            aria-hidden="true"
            focusable="false"
            preserveAspectRatio="none"
            style={{ transform: 'scaleY(-1)', display: 'block' }}
          >
            <defs>
              <linearGradient
                id="navbar-wave-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--color-primary)"
                  stopOpacity="1"
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-primary)"
                  stopOpacity="1"
                />
              </linearGradient>
            </defs>
            <path
              ref={wavePathRef}
              fill="url(#navbar-wave-gradient)"
              fillOpacity="1"
              d="M0,224L48,197.3C96,171,192,117,288,122.7C384,128,480,192,576,197.3C672,203,768,149,864,133.3C960,117,1056,139,1152,154.7C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </div>
    </HideOnScroll>
  );
}