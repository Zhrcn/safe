'use client';
import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/styles';

export default function PageContainer({ 
  title, 
  description, 
  actions, 
  showBreadcrumbs = false, 
  children 
}) {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    if (!pathname) return [{ label: 'Home', href: '/' }];
    
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Home', href: '/' }
    ];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      breadcrumbs.push({
        label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
        href: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <div className="space-y-2">
          {showBreadcrumbs && (
            <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  )}
                  <Link
                    href={crumb.href}
                    className={cn(
                      "hover:text-foreground transition-colors",
                      index === breadcrumbs.length - 1 ? "text-foreground font-medium" : ""
                    )}
                  >
                    {index === 0 ? (
                      <Home className="h-4 w-4" />
                    ) : (
                      crumb.label
                    )}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          )}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              {description && (
                <p className="text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
          </div>
        </div>
        <div className="bg-background rounded-lg border border-border shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
} 