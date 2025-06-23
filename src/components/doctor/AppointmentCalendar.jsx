import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const AppointmentCalendar = () => {
    const { appointments } = useSelector((state) => state.doctorSchedule);
    const { patients } = useSelector((state) => state.doctorPatients);
    const navigate = useNavigate();
    const today = new Date();
    const todayAppointments = appointments
        .filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate.toDateString() === today.toDateString();
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const handleAppointmentClick = (appointmentId) => {
        navigate(`/doctor/appointments/${appointmentId}`);
    };
    if (todayAppointments.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-gray-500">
                    No appointments scheduled for today
                </p>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-between mb-4">
            <Button
                onClick={() => {
                }}
                variant="outline"
                size="sm"
                className="mr-2"
            >
                Today
            </Button>
            <Button
                onClick={() => {
                }}
                variant="ghost"
                size="icon"
                aria-label="Previous"
                className="mr-2"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
                onClick={() => {
                }}
                variant="ghost"
                size="icon"
                aria-label="Next"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default AppointmentCalendar;