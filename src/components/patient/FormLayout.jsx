import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
export default forwardRef(function FormLayout({
    title,
    description,
    children,
    actions,
    className,
    maxWidth = 'lg',
}, ref) {
    const maxWidthClasses = {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
        none: '', 
        full: 'max-w-full', 
    };
    return (
        <div className={cn('w-full mx-auto px-4', maxWidthClasses[maxWidth], className)} ref={ref}>
            <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3">
                    <Card className="px-6 py-8 shadow-lg rounded-lg border-border/50 bg-card hover:shadow-xl transition-all duration-200">
                        {(title || description) && (
                            <>
                                <div className="mb-8">
                                    {title && (
                                        <h2 className="font-semibold text-2xl mb-3 text-foreground">
                                            {title}
                                        </h2>
                                    )}
                                    {description && (
                                        <p className="text-muted-foreground text-base">
                                            {description}
                                        </p>
                                    )}
                                </div>
                                <div className="border-b border-border/50 mb-8" />
                            </>
                        )}
                        <div className="space-y-8">
                            {children}
                        </div>
                        {actions && (
                            <>
                                <div className="border-t border-border/50 mt-8 pt-6" />
                                <div className="flex justify-end gap-4 mt-6">
                                    {actions}
                                </div>
                            </>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}); 