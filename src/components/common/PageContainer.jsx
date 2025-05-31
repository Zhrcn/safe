'use client';

import React from 'react';
import { Box, Typography, Breadcrumbs } from '@mui/material';
import { Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * A container component for page content with consistent styling
 * 
 * @param {Object} props
 * @param {string} props.title - The page title
 * @param {string} [props.description] - Optional page description
 * @param {React.ReactNode} [props.actions] - Optional action buttons to display in the header
 * @param {boolean} [props.showBreadcrumbs=false] - Whether to show breadcrumbs
 * @param {React.ReactNode} props.children - The page content
 */
export default function PageContainer({ 
  title, 
  description, 
  actions, 
  showBreadcrumbs = false, 
  children 
}) {
  const pathname = usePathname();
  
  // Generate breadcrumbs from the current path
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    
    return [
      { label: 'Home', href: '/' },
      ...paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        return {
          label: path.charAt(0).toUpperCase() + path.slice(1),
          href
        };
      })
    ];
  };
  
  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box className="p-4 md:p-6">
      {/* Page Header */}
      <Box className="mb-6">
        {showBreadcrumbs && (
          <Breadcrumbs 
            separator={<ChevronRight size={16} />} 
            aria-label="breadcrumb"
            className="mb-4"
          >
            {breadcrumbs.map((crumb, index) => (
              <Link 
                key={crumb.href} 
                href={crumb.href}
                className={`flex items-center text-sm ${
                  index === breadcrumbs.length - 1 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {index === 0 ? (
                  <>
                    <Home size={14} className="mr-1" />
                    {crumb.label}
                  </>
                ) : (
                  crumb.label
                )}
              </Link>
            ))}
          </Breadcrumbs>
        )}
        
        <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <Box>
            <Typography variant="h4" component="h1" className="font-bold text-foreground">
              {title}
            </Typography>
            {description && (
              <Typography variant="body1" className="text-muted-foreground mt-1">
                {description}
              </Typography>
            )}
          </Box>
          
          {actions && (
            <Box className="mt-4 sm:mt-0 flex items-center space-x-2">
              {actions}
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Page Content */}
      {children}
    </Box>
  );
} 