'use client';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeProviderWrapper';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { currentTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    { name: 'hopeCare', label: 'HopeCare' },
    { name: 'pureCare', label: 'PureCare' },
    { name: 'syriaWarm', label: 'SyriaWarm' },
    { name: 'safeNight', label: 'SafeNight' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative focus:outline-none focus:ring-2 focus:ring-primary rounded-lg shadow hover:bg-primary/10 transition-colors"
        >
          <Palette className="h-5 w-5" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-lg shadow-xl border border-border bg-card">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => setTheme(theme.name)}
            className={cn(
              "flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-3 py-2 text-base font-medium transition-all",
              currentTheme === theme.name && "bg-primary/10 text-primary shadow"
            )}
            tabIndex={0}
            aria-label={`Switch to ${theme.label} theme`}
          >
            <span>{theme.label}</span>
            {currentTheme === theme.name && (
              <span className="h-2.5 w-2.5 rounded-lg bg-primary border-2 border-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher; 