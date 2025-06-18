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
      <nav className="sticky top-0 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center text-xl font-bold text-primary hover:text-primary/90 transition-colors"
            >
              {APP_NAME}
            </Link>

            <div className="hidden md:flex md:items-center md:space-x-4">
              {pages.map((page) => (
                <Button
                  key={page.name}
                  variant="ghost"
                  onClick={() => scrollToSection(page.href)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {page.name}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <ThemeSwitcher />

              <div className="hidden sm:flex sm:items-center sm:space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>

              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
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
                        className="justify-start"
                      >
                        {page.name}
                      </Button>
                    ))}
                    <div className="flex flex-col space-y-2 pt-4 border-t">
                      <Button variant="outline" asChild>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild>
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