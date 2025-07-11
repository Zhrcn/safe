'use client';
import { Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function AppointmentCard({ appointments = [] }) {
    if (!appointments?.length) {
        return (
            <div className="rounded-2xl border p-6">
                <p className="text-center text-gray-500">
                    No upcoming appointments
                </p>
            </div>
        );
    }
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const formatDateTime = (date, time) => {
        try {
            if (!date) return 'Date not specified';
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) return 'Invalid date';
            return `${dateObj.toLocaleDateString()}${time ? ` at ${time}` : ''}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };
    return (
        <div className="rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">
                Upcoming Appointments
            </h2>
            <div className="flex flex-col gap-4">
                {appointments.map((appointment, index) => (
                    <div
                        key={appointment?.id || index}
                        className="flex items-center rounded-md border p-4"
                    >
                        <div className="flex-1">
                            <h3 className="font-semibold">
                                {appointment?.doctorName || 'Doctor'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {appointment?.specialty || 'General Medicine'}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5" />
                                <p className="text-sm text-gray-500">
                                    {formatDateTime(appointment?.date, appointment?.time)}
                                </p>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5" />
                                <p className="text-sm text-gray-500">
                                    {appointment?.location || 'Virtual Consultation'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={cn(
                                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                getStatusColor(appointment?.status)
                            )}>
                                {appointment?.status || 'Unknown'}
                            </span>
                            <Button variant="outline" size="sm">
                                Details
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}