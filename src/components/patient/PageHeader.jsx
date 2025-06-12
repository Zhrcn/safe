import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/styles';

export default function PageHeader({
    title,
    description,
    breadcrumbs = [],
    actions,
    className,
}) {
    return (
        <Box className={cn('mb-2', className)}>
            <Breadcrumbs
                separator={<ChevronRight size={16} className="text-muted-foreground" />}
                aria-label="breadcrumb"
                className="mb-2"
            >
                <Link
                    href="/patient/dashboard"
                    className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Home size={16} className="mr-1" />
                    Dashboard
                </Link>
                {breadcrumbs.map((crumb, index) => (
                    <Link
                        key={index}
                        href={crumb.href}
                        className={cn(
                            'text-muted-foreground hover:text-foreground transition-colors',
                            index === breadcrumbs.length - 1 && 'text-foreground font-medium'
                        )}
                    >
                        {crumb.label}
                    </Link>
                ))}
            </Breadcrumbs>

            <Box className="flex items-center justify-between">
                <Box>
                    <Typography
                        variant="h4"
                        className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent"
                    >
                        {title}
                    </Typography>
                    {description && (
                        <Typography
                            variant="body1"
                            className="mt-1 text-muted-foreground"
                        >
                            {description}
                        </Typography>
                    )}
                </Box>
                {actions && (
                    <Box className="flex items-center gap-2">
                        {actions}
                    </Box>
                )}
            </Box>
        </Box>
    );
} 