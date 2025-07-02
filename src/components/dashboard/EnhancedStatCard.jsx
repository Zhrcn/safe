'use client';rounded-2xl
import { Calendar, Pill, Stethoscope } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
const iconMap = {
    calendar: Calendar,
    medication: Pill,
    stethoscope: Stethoscope,
};
export default function EnhancedStatCard({ title, value, icon, color }) {
    const Icon = iconMap[icon] || Calendar;
    const getColorClasses = (color) => {
        switch (color) {
            case 'primary':
                return 'bg-blue-100 text-blue-600';
            case 'secondary':
                return 'bg-purple-100 text-purple-600';
            case 'success':
                return 'bg-green-100 text-green-600';
            case 'warning':
                return 'bg-yellow-100 text-yellow-600';
            case 'error':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };
    return (
        <Card className="h-full transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg">
            <CardContent className="p-6">
                <div className="flex items-center">
                    <div className={`p-3 rounded-lg mr-4 ${getColorClasses(color)}`}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            {title}
                        </p>
                        <p className="text-2xl font-bold mt-1">
                            {value}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 