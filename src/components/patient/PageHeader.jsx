'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/auth/authSlice';
import { useTranslation } from 'react-i18next';

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  className,
}) {
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const { t } = useTranslation('common');

  const pathSegments = pathname.split('/').filter(Boolean);
  const generatedBreadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { href, label };
  });

  const finalBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : generatedBreadcrumbs;

  return (
    <div className={cn("space-y-4", className)}>
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
        <Link
          href={`/${user?.role?.toLowerCase() || 'patient'}/dashboard`}
          className="flex items-center hover:text-foreground transition-colors"
        >
          <HomeIcon className="h-4 w-4 mr-1" />
        </Link>
        {finalBreadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <ChevronRightIcon className="h-4 w-4" />
            <Link
              href={crumb.href}
              className={cn(
                "hover:text-foreground transition-colors",
                index === finalBreadcrumbs.length - 1 && "text-foreground font-medium"
              )}
            >
              {crumb.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      <Separator />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
} 