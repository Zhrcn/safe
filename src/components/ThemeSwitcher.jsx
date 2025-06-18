'use client';
import React from 'react';
import { useTheme } from '@/context/ThemeContext.jsx';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Palette } from 'lucide-react';

const ThemeSwitcher = () => {
  const { currentTheme, changeTheme } = useTheme();

  const themes = [
    { name: 'hopeCare', label: 'HopeCare' },
    { name: 'pureCare', label: 'PureCare' },
    { name: 'syriaWarm', label: 'SyriaWarm' },
    { name: 'safeNight', label: 'SafeNight' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => changeTheme(theme.name)}
            className={currentTheme === theme.name ? 'bg-primary/10' : ''}
          >
            {theme.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher; 