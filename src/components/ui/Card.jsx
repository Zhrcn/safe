'use client';

import React from 'react';
import { Box } from '@mui/material';
import { cn } from '@/lib/utils';

const Card = React.forwardRef(({
    className,
    variant = 'default',
    noPadding = false,
    bordered = false,
    hoverable = false,
    children,
    ...props
}, ref) => {
    const baseStyles = 'rounded-lg transition-all duration-200';
    const variantStyles = {
        default: 'bg-card text-card-foreground',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-border bg-transparent',
        ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground',
        elevated: 'bg-card text-card-foreground shadow-md',
    };
    const hoverStyles = hoverable ? 'hover:shadow-lg hover:translate-y-[-2px]' : '';
    const borderStyles = bordered ? 'border border-border' : '';
    const paddingStyles = noPadding ? '' : 'p-6';

    return (
        <Box
            ref={ref}
            className={cn(
                baseStyles,
                variantStyles[variant],
                hoverStyles,
                borderStyles,
                paddingStyles,
                className
            )}
            {...props}
        >
            {children}
        </Box>
    );
});

Card.displayName = 'Card';

export default Card; 