'use client';

import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { cn } from '@/lib/utils';

const Button = React.forwardRef(({
    className,
    variant = 'default',
    size = 'default',
    loading = false,
    disabled = false,
    startIcon,
    endIcon,
    children,
    ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
    
    const variantStyles = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
        soft: 'bg-primary/10 text-primary hover:bg-primary/20',
    };
    
    const sizeStyles = {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
    };

    return (
        <MuiButton
            ref={ref}
            className={cn(
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                loading && 'opacity-70 cursor-not-allowed',
                className
            )}
            disabled={disabled || loading}
            startIcon={startIcon}
            endIcon={endIcon}
            {...props}
        >
            {loading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : null}
            {children}
        </MuiButton>
    );
});

Button.displayName = 'Button';

export default Button; 