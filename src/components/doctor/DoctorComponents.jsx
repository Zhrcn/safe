'use client';
import { ArrowUp, ArrowDown } from 'lucide-react';
export function DoctorPageContainer({ title, description, children }) {
    return (
        <div>
            <div className="bg-card text-card-foreground rounded-2xl shadow-md min-h-[80vh] p-6">
                <h1 className="text-2xl font-bold text-foreground mb-4">
                    {title}
                </h1>
                <p className="text-muted-foreground mb-6">
                    {description}
                </p>
                {children}
            </div>
        </div>
    );
}
export function DoctorCard({ title, children, actions }) {
    return (
        <div className="shadow-lg rounded-2xl border border-border bg-card">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
                    <h1 className="text-xl font-bold text-foreground">{title}</h1>
                    {actions && (
                        <div className="flex items-center space-x-4 w-full sm:w-auto">
                            {actions}
                        </div>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
}
export function DashboardCard({ title, icon: IconComponent, children, actionButton }) {
    return (
        <div className="h-full shadow-lg rounded-2xl border border-border bg-card text-card-foreground transition-colors duration-200 hover:shadow-xl">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-700 mr-4">
                            <IconComponent size={28} className="text-green-600 dark:text-green-200" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">
                            {title}
                        </h2>
                    </div>
                    {actionButton}
                </div>
                <div className="text-muted-foreground">
                    {children}
                </div>
            </div>
        </div>
    );
}
export function ChartContainer({ title, children, height = 300 }) {
    return (
        <div className="bg-card border border-border rounded-2xl p-4">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
                {title}
            </h2>
            <div style={{ height }} className="w-full">
                {children}
            </div>
        </div>
    );
}
export function StatCard({ title, value, icon: IconComponent, trend, trendValue }) {
    return (
        <div className="border border-border bg-card shadow-sm">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground font-medium text-sm">
                            {title}
                        </p>
                        <p className="text-2xl font-bold text-foreground mt-1">
                            {value}
                        </p>
                        {trend && (
                            <div className="flex items-center mt-1">
                                <span
                                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                        trend === 'up'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    }`}
                                >
                                    {trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />} {trendValue}
                                </span>
                            </div>
                        )}
                    </div>
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            trend === 'up'
                                ? 'bg-green-100 dark:bg-green-900'
                                : trend === 'down'
                                ? 'bg-red-100 dark:bg-red-900'
                                : 'bg-blue-100 dark:bg-blue-900'
                        }`}
                    >
                        <IconComponent
                            size={24}
                            className={
                                trend === 'up'
                                    ? 'text-green-600 dark:text-green-300'
                                    : trend === 'down'
                                    ? 'text-red-600 dark:text-red-300'
                                    : 'text-blue-600 dark:text-blue-300'
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}