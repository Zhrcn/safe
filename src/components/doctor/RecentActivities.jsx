import React from 'react';
import { useSelector } from 'react-redux';
import {
    Calendar,
    Pill,
    User,
    FileText
} from 'lucide-react';
import { Separator } from '@/components/ui/Separator';
import { Button } from '@/components/ui/Button';

const ActivityIcon = ({ type }) => {
    const icons = {
        consultation: <FileText className="w-5 h-5 text-blue-600" />,
        prescription: <Pill className="w-5 h-5 text-purple-600" />,
        appointment: <Calendar className="w-5 h-5 text-green-600" />,
        patient: <User className="w-5 h-5 text-indigo-600" />
    };
    return icons[type] || <FileText className="w-5 h-5 text-blue-600" />;
};

const RecentActivities = () => {
    const { consultations } = useSelector((state) => state.doctorConsultations);
    const { prescriptions } = useSelector((state) => state.doctorPrescriptions);
    const { appointments } = useSelector((state) => state.doctorSchedule);
    const { patients } = useSelector((state) => state.doctorPatients);

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const activities = [
        ...consultations.map(c => ({ ...c, type: 'consultation' })),
        ...prescriptions.map(p => ({ ...p, type: 'prescription' })),
        ...appointments.map(a => ({ ...a, type: 'appointment' })),
        ...patients.map(p => ({ ...p, type: 'patient' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    const handleViewAll = () => {
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <React.Fragment key={`${activity.type}-${activity.id}`}>
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <ActivityIcon type={activity.type} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {activity.type === 'consultation' && `Consultation with ${activity.patientName}`}
                                    {activity.type === 'prescription' && `Prescribed ${activity.medicationName} to ${activity.patientName}`}
                                    {activity.type === 'appointment' && `Appointment scheduled with ${activity.patientName}`}
                                    {activity.type === 'patient' && `New patient ${activity.name} registered`}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDate(activity.date)}
                                </p>
                            </div>
                        </div>
                        {index < activities.length - 1 && <Separator />}
                    </React.Fragment>
                ))}
            </div>
            <Button
                onClick={handleViewAll}
                variant="outline"
                size="sm"
                className="ml-auto"
            >
                View All
            </Button>
        </div>
    );
};

export default RecentActivities; 