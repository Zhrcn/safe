import React from 'react';
import { Box, Typography, Breadcrumbs, Link, useTheme, alpha } from '@mui/material';
import { ChevronRight as ChevronRightIcon, Home as HomeIcon } from '@mui/icons-material';

export default function PageHeader({
    title,
    description,
    breadcrumbs = [],
    actions,
    className,
}) {
    const theme = useTheme();

    return (
        <Box sx={{ mb: 2, ...className }}>
            <Breadcrumbs
                separator={<ChevronRightIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
                aria-label="breadcrumb"
                sx={{ mb: 2 }}
            >
                <Link
                    href="/patient/dashboard"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.secondary',
                        textDecoration: 'none',
                        '&:hover': {
                            color: 'text.primary',
                        },
                    }}
                >
                    <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Dashboard
                </Link>
                {breadcrumbs.map((crumb, index) => (
                    <Link
                        key={index}
                        href={crumb.href}
                        sx={{
                            color: index === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary',
                            textDecoration: 'none',
                            fontWeight: index === breadcrumbs.length - 1 ? 500 : 400,
                            '&:hover': {
                                color: 'text.primary',
                            },
                        }}
                    >
                        {crumb.label}
                    </Link>
                ))}
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '1.5rem', md: '1.875rem' },
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        {title}
                    </Typography>
                    {description && (
                        <Typography
                            variant="body1"
                            sx={{
                                mt: 1,
                                color: 'text.secondary',
                            }}
                        >
                            {description}
                        </Typography>
                    )}
                </Box>
                {actions && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {actions}
                    </Box>
                )}
            </Box>
        </Box>
    );
} 