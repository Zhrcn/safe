'use client';
import React from 'react';
import { Search, TrendingUp, TrendingDown, Minus, Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator'; 
const DEFAULT_AVATAR_PATH = '/avatars/default-avatar.svg';
export function PatientPageContainer({ children }) {
    return (
        <div className="container mx-auto px-4 py-6 space-y-6 bg-background min-h-screen">
            {children}
        </div>
    );
}
export function PatientCard({ title, subtitle, status, date, time, location, actions }) {
    return (
        <Card className="p-6 hover:shadow-lg transition-all duration-200 rounded-2xl border-border/50 bg-card">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold mb-1 text-foreground">
                        {title}
                    </h3>
                    <p className="text-muted-foreground mb-2">
                        {subtitle}
                    </p>
                </div>
                {status}
            </div>
            <div className="space-y-3">
                {date && (
                    <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <p className="text-sm">{date}</p>
                    </div>
                )}
                {time && (
                    <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <p className="text-sm">{time}</p>
                    </div>
                )}
                {location && (
                    <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <p className="text-sm">{location}</p>
                    </div>
                )}
            </div>
            {actions && (
                <div className="mt-4 pt-4 border-t border-border/50">
                    {actions}
                </div>
            )}
        </Card>
    );
}
export function StatCard({ title, value, trend = null, icon, description, className = '' }) {
    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
        if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
        if (trend === 'neutral') return <Minus className="h-4 w-4 text-yellow-500" />;
        return null;
    };
    return (
        <Card className={`border border-border/50 bg-card shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {title}
                        </p>
                        <h4 className="text-2xl font-bold mt-1 text-foreground">
                            {value}
                        </h4>
                        {trend && (
                            <div className="flex items-center mt-1">
                                {getTrendIcon()}
                                <p
                                    className={`ml-1 text-sm ${
                                        trend === 'up'
                                            ? 'text-green-500'
                                            : trend === 'down'
                                            ? 'text-red-500'
                                            : 'text-yellow-500'
                                    }`}
                                >
                                    {trend === 'up' ? 'Up' : trend === 'down' ? 'Down' : 'Stable'}
                                </p>
                            </div>
                        )}
                        {description && (
                            <p className="text-sm mt-1 text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                    {icon && (
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                            {icon}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
export function ChartContainer({ title, subtitle, children, className = '' }) {
    return (
        <Card className={`border border-border/50 bg-card shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
            <CardContent className="p-6">
                {(title || subtitle) && (
                    <div className="mb-6">
                        {title && <h3 className="text-lg font-medium text-foreground">{title}</h3>}
                        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
                    </div>
                )}
                {children}
            </CardContent>
        </Card>
    );
}
export function HealthIndicator({ value, type, className = '' }) {
    const getIndicatorInfo = () => {
        switch (type) {
            case 'bloodPressure':
                if (value.systolic < 120 && value.diastolic < 80) return { label: 'Normal', color: 'bg-success' };
                if (value.systolic < 130 && value.diastolic < 85) return { label: 'Elevated', color: 'bg-warning' };
                if (value.systolic < 140 && value.diastolic < 90) return { label: 'Stage 1', color: 'bg-warning' };
                return { label: 'Stage 2', color: 'bg-error' };
            case 'heartRate':
                if (value >= 60 && value <= 100) return { label: 'Normal', color: 'bg-success' };
                if (value > 100) return { label: 'Elevated', color: 'bg-warning' };
                return { label: 'Low', color: 'bg-info' };
            case 'bloodGlucose':
                if (value < 100) return { label: 'Normal', color: 'bg-success' };
                if (value < 126) return { label: 'Prediabetes', color: 'bg-warning' };
                return { label: 'Diabetes', color: 'bg-error' };
            default:
                return { label: 'Unknown', color: 'bg-muted' };
        }
    };
    const info = getIndicatorInfo();
    return (
        <div className={`flex items-center ${className}`}>
            <div className={`w-3 h-3 rounded-2xl ${info.color} mr-2`}></div>
            <p className="text-sm text-muted-foreground">
                {info.label}
            </p>
        </div>
    );
}
export function MedicationStatusBadge({ status }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-2xl text-xs font-medium bg-muted text-muted-foreground`}>
            {status}
        </span>
    );
}
export function AppointmentStatusBadge({ status }) {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'rescheduled':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
        }
    };
    const getStatusLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'scheduled':
                return 'Scheduled';
            case 'completed':
                return 'Completed';
            case 'cancelled':
                return 'Cancelled';
            case 'rescheduled':
                return 'Rescheduled';
            default:
                return status;
        }
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-2xl text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusLabel(status)}
        </span>
    );
} 