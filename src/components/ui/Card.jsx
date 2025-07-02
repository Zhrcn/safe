'use client';
import React from 'react';
import { cn } from '@/utils/styles';
const Card = React.forwardRef(({
    className,
    variant = 'default',
    noPadding = false,
    bordered = false,
    hoverable = false,
    children,
    ...props
}, ref) => {
    const baseStyles = 'rounded-2xl border border-border bg-card text-card-foreground shadow-lg';
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
        <div
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
        </div>
    );
});
Card.displayName = 'Card';
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
    />
));
CardHeader.displayName = 'CardHeader';
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
        {...props}
    />
));
CardTitle.displayName = 'CardTitle';
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
    />
));
CardDescription.displayName = 'CardDescription';
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex items-center p-6 pt-0', className)}
        {...props}
    />
));
CardFooter.displayName = 'CardFooter';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }; 