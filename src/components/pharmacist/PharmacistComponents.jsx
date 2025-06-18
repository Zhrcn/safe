'use client';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
export function PharmacistPageContainer({ title, description, children }) {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="font-bold text-3xl text-foreground mb-2">
                    {title}
                </h2>
                <p className="text-muted-foreground text-lg">
                    {description}
                </p>
            </div>
            {children}
        </div>
    );
}
export function PharmacistCard({ title, children, actions }) {
    return (
        <Card className="p-6 bg-card border border-border rounded-lg mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="font-semibold text-xl text-foreground mb-2 sm:mb-0">
                    {title}
                </h3>
                {actions && (
                    <div className="flex space-x-2">
                        {actions}
                    </div>
                )}
            </div>
            <Separator className="mb-4" />
            {children}
        </Card>
    );
}
export function DashboardCard({ title, icon: IconComponent, children, actionButton }) {
    return (
        <Card className="shadow-sm border border-border bg-card overflow-hidden">
            <CardHeader className="pb-0">
                <CardTitle className="flex items-center text-lg font-semibold text-foreground">
                    {IconComponent && <IconComponent className="mr-2 text-primary" size={20} />}
                    {title}
                </CardTitle>
                {actionButton}
            </CardHeader>
            <CardContent>
                {children}
                {actionButton && (
                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="link"
                            className="text-primary p-0 h-auto"
                        >
                            View All <ChevronRight className="ml-1 w-4 h-4" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 