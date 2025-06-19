'use client';
import { useTheme } from '@/components/ThemeProviderWrapper';
import { Button } from '@/components/ui/Button';
import { Moon, Sun, Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useEffect, useState } from 'react';

export function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="focus:outline-none focus:ring-2 focus:ring-primary">
          <Palette className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => theme.toggleTheme('hopeCare')} className="focus:outline-none focus:ring-2 focus:ring-primary" tabIndex={0} aria-label="Switch to Hope Care theme">
          Hope Care
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => theme.toggleTheme('pureCare')} className="focus:outline-none focus:ring-2 focus:ring-primary" tabIndex={0} aria-label="Switch to Pure Care theme">
          Pure Care
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => theme.toggleTheme('syriaWarm')} className="focus:outline-none focus:ring-2 focus:ring-primary" tabIndex={0} aria-label="Switch to Syria Warm theme">
          Syria Warm
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => theme.toggleTheme('safeNight')} className="focus:outline-none focus:ring-2 focus:ring-primary" tabIndex={0} aria-label="Switch to Safe Night theme">
          Safe Night
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 