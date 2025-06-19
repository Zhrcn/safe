'use client';
import { useState, useEffect } from 'react';
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

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    const section = document.getElementById(sectionId.substring(1));
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HideOnScroll>
      <nav className="sticky top-0 w-full bg-white border-b border-gray-200 z-50">
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
                  className="rounded-md px-4 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary transition"
                >
                  {page.name}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <ThemeSwitcher />
              <div className="hidden sm:flex sm:items-center sm:space-x-2">
                <Button variant="outline" asChild className="rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="rounded-md px-4 py-2 bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
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
                        className="rounded-md justify-start px-4 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary transition"
                      >
                        {page.name}
                      </Button>
                    ))}
                    <div className="flex flex-col space-y-2 pt-4 border-t">
                      <Button variant="outline" asChild className="rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild className="rounded-md px-4 py-2 bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition">
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
    </HideOnScroll>
  );
} 