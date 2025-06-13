'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
import {
    Event as EventIcon,
    LocalPharmacy as LocalPharmacyIcon,
    LocalPharmacy as MedicationIcon,
    Message as MessageIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    AccessTime as TimeIcon,
    Notifications as NotificationsIcon,
    ArrowForward as ArrowForwardIcon,
    Add as AddIcon,
    VideoCall as VideoCallIcon,
    Chat as ChatIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    MoreVert as MoreVertIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    HealthAndSafety as HealthIcon,
    Bloodtype as BloodIcon,
    MonitorHeart as HeartIcon,
    Scale as ScaleIcon,
} from '@mui/icons-material';
// import {
//     selectDashboardSummary,
//     selectUpcomingAppointments,
//     selectActiveMedications,
//     selectRecentMessages,
//     selectRecentConsultations,
// } from '@/store/slices/patient/dashboardSlice';
import { format, isValid } from 'date-fns';
import { appointments } from '@/mockdata/appointments';
import { medications } from '@/mockdata/medications';
import { conversations } from '@/mockdata/conversations';
import { consultations } from '@/mockdata/consultations';
import PageHeader from '@/components/patient/PageHeader';

const getColorClasses = (hexColor) => {
    let bgColor = '';
    let borderColor = '';
    let textColor = '';
    let iconBgColor = '';
    let iconTextColor = '';

    switch (hexColor) {
        case '#1976D2': // Blue for appointments
            bgColor = 'from-blue-50 to-blue-100';
            borderColor = 'border-blue-200';
            textColor = 'text-blue-600';
            iconBgColor = 'bg-blue-100';
            iconTextColor = 'text-blue-600';
            break;
        case '#4CAF50': // Green for medications
            bgColor = 'from-green-50 to-green-100';
            borderColor = 'border-green-200';
            textColor = 'text-green-600';
            iconBgColor = 'bg-green-100';
            iconTextColor = 'text-green-600';
            break;
        case '#FF9800': // Orange for messages
            bgColor = 'from-orange-50 to-orange-100';
            borderColor = 'border-orange-200';
            textColor = 'text-orange-600';
            iconBgColor = 'bg-orange-100';
            iconTextColor = 'text-orange-600';
            break;
        case '#9C27B0': // Purple for consultations
            bgColor = 'from-purple-50 to-purple-100';
            borderColor = 'border-purple-200';
            textColor = 'text-purple-600';
            iconBgColor = 'bg-purple-100';
            iconTextColor = 'text-purple-600';
            break;
        case '#F44336': // Red for blood pressure (health metrics)
            bgColor = 'from-red-50 to-red-100';
            borderColor = 'border-red-200';
            textColor = 'text-red-600';
            iconBgColor = 'bg-red-100';
            iconTextColor = 'text-red-600';
            break;
        case '#E91E63': // Pink for health records (quick actions)
            bgColor = 'from-pink-50 to-pink-100';
            borderColor = 'border-pink-200';
            textColor = 'text-pink-600';
            iconBgColor = 'bg-pink-100';
            iconTextColor = 'text-pink-600';
            break;
        case '#00BCD4': // Cyan for notifications (quick actions)
            bgColor = 'from-cyan-50 to-cyan-100';
            borderColor = 'border-cyan-200';
            textColor = 'text-cyan-600';
            iconBgColor = 'bg-cyan-100';
            iconTextColor = 'text-cyan-600';
            break;
        case '#2196F3': // Blue for heart rate (health metrics)
            bgColor = 'from-blue-50 to-blue-100';
            borderColor = 'border-blue-200';
            textColor = 'text-blue-600';
            iconBgColor = 'bg-blue-100';
            iconTextColor = 'text-blue-600';
            break;
        default:
            bgColor = 'from-gray-50 to-gray-100';
            borderColor = 'border-gray-200';
            textColor = 'text-gray-600';
            iconBgColor = 'bg-gray-100';
            iconTextColor = 'text-gray-600';
    }
    return { bgColor, borderColor, textColor, iconBgColor, iconTextColor };
};

const StatCard = ({ title, value, icon, color, subtitle, trend }) => {
    const { bgColor, borderColor, textColor, iconBgColor, iconTextColor } = getColorClasses(color);
    
    return (
        <div 
            className={`p-2 h-full rounded-xl bg-gradient-to-br ${bgColor} border ${borderColor} transition-all duration-300 hover:shadow-xl shadow-md`}
        >
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium tracking-wider mb-1">
                            {title}
                        </p>
                        <div className="flex items-baseline gap-1">
                            <h4 className="text-3xl font-bold text-gray-900 tracking-tight">
                                {value}
                            </h4>
                            <p className="text-base text-gray-500 font-medium">
                                {subtitle}
                            </p>
                        </div>
                        {trend && (
                            <div 
                                className={`flex items-center gap-1 mt-1.5 rounded-md px-1.5 py-0.5 w-fit ${trend > 0 ? 'bg-green-100' : 'bg-red-100'}`}
                            >
                                {trend > 0 ? (
                                    <TrendingUpIcon className="text-green-500" fontSize="small" />
                                ) : (
                                    <TrendingDownIcon className="text-red-500" fontSize="small" />
                                )}
                                <p 
                                    className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}
                                >
                                    {Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'}
                                </p>
                            </div>
                        )}
                        <p 
                            className="text-xs text-gray-500 mt-1.5 block opacity-80"
                        >
                            Last updated: {subtitle}
                        </p>
                    </div>
                    <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${iconBgColor} ${iconTextColor}`}
                    >
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActivityCard = ({ title, icon, color, children, onViewAll }) => {
    const { iconBgColor, iconTextColor } = getColorClasses(color);

    return (
        <div 
            className="h-full rounded-xl border border-gray-200 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl shadow-md"
        >
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div 
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${iconBgColor} ${iconTextColor}`}
                        >
                            {icon}
                        </div>
                        <h6 
                            className="text-xl font-bold tracking-tight"
                        >
                            {title}
                        </h6>
                    </div>
                    <button
                        onClick={onViewAll}
                        className="flex items-center gap-1 capitalize text-gray-600 font-medium transition-all duration-200 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md"
                    >
                        View All <ArrowForwardIcon className="text-base" />
                    </button>
                </div>
                <div className="border-b border-gray-200 mb-4 opacity-60"></div>
                {children}
            </div>
        </div>
    );
};

const QuickActionButton = ({ icon, label, onClick, color = '#1976D2' }) => {
    const { borderColor, textColor, bgColor } = getColorClasses(color);
    
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 hover:translate-y-[-1px] hover:shadow-lg shadow-sm border ${borderColor} ${textColor} hover:${borderColor} hover:bg-${bgColor.split(' ')[0].split('-')[1]}-50`}
        >
            {icon} {label}
        </button>
    );
};

const HealthMetricCard = ({ title, value, unit, icon, color, trend, lastUpdated }) => {
    const { bgColor, borderColor, textColor, iconBgColor, iconTextColor } = getColorClasses(color);
    
        return (
        <div 
            className={`p-2 h-full rounded-xl bg-gradient-to-br ${bgColor} border ${borderColor} transition-all duration-300 hover:shadow-xl shadow-md`}
        >
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p 
                            className="text-sm text-gray-500 font-medium tracking-wider mb-1"
                        >
                            {title}
                        </p>
                        <div className="flex items-baseline gap-1">
                            <h4 
                                className="text-3xl font-bold text-gray-900 tracking-tight"
                            >
                                {value}
                            </h4>
                            <p 
                                className="text-base text-gray-500 font-medium"
                            >
                                {unit}
                            </p>
                        </div>
                        {trend && (
                            <div 
                                className={`flex items-center gap-1 mt-1.5 rounded-md px-1.5 py-0.5 w-fit ${trend > 0 ? 'bg-green-100' : 'bg-red-100'}`}
                            >
                                {trend > 0 ? (
                                    <TrendingUpIcon className="text-green-500" fontSize="small" />
                                ) : (
                                    <TrendingDownIcon className="text-red-500" fontSize="small" />
                                )}
                                <p 
                                    className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}
                                >
                                    {Math.abs(trend)}% from last month
                                </p>
                            </div>
                        )}
                        <p 
                            className="text-xs text-gray-500 mt-1.5 block opacity-80"
                        >
                            Last updated: {lastUpdated}
                        </p>
                    </div>
                    <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${iconBgColor} ${iconTextColor}`}
                    >
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!isValid(date)) {
        return 'Invalid date';
    }
    return format(date, 'MMM dd, yyyy');
};

const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (!isValid(date)) {
        return 'Invalid time';
    }
    return format(date, 'hh:mm a');
};

const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    if (!isValid(date)) {
        return 'Invalid date/time';
    }
    return format(date, 'MMM dd, hh:mm a');
};

const DashboardPage = () => {
    const router = useRouter();
    // const dispatch = useDispatch();
    // const dashboardSummary = useSelector(selectDashboardSummary);
    // const upcomingAppointments = useSelector(selectUpcomingAppointments);
    // const activeMedications = useSelector(selectActiveMedications);
    // const recentMessages = useSelector(selectRecentMessages);
    // const recentConsultations = useSelector(selectRecentConsultations);

    // useEffect(() => {
    //     // dispatch(fetchDashboardSummary());
    //     // dispatch(fetchUpcomingAppointments());
    //     // dispatch(fetchActiveMedications());
    //     // dispatch(fetchRecentMessages());
    //     // dispatch(fetchRecentConsultations());
    // }, [dispatch]);

    // Mock data for now, replace with actual state when ready
    const dashboardSummary = {
        appointments: 5,
        medications: 3,
        messages: 12,
        consultations: 2,
    };

    // const upcomingAppointments = [ /* ... mock data ... */ ];
    // const activeMedications = [ /* ... mock data ... */ ];
    // const recentMessages = [ /* ... mock data ... */ ];
    // const recentConsultations = [ /* ... mock data ... */ ];
    
    // Using the imported mock data directly
    const upcomingAppointments = appointments.slice(0, 3);
    const activeMedications = medications.slice(0, 3);
    const recentMessages = conversations.slice(0, 3);
    const recentConsultations = consultations.slice(0, 3);

    const [metricAnchorEl, setMetricAnchorEl] = React.useState(null);
    const [selectedMetric, setSelectedMetric] = React.useState(null);
    const openMetricMenu = Boolean(metricAnchorEl);

    const handleMetricMenuOpen = (event, metric) => {
        setMetricAnchorEl(event.currentTarget);
        setSelectedMetric(metric);
    };

    const handleMetricMenuClose = () => {
        setMetricAnchorEl(null);
        setSelectedMetric(null);
    };

    const handleViewMetricHistory = () => {
        console.log(`Viewing history for ${selectedMetric}`);
        handleMetricMenuClose();
    };

    const handleAddMetricReading = () => {
        console.log(`Adding reading for ${selectedMetric}`);
        handleMetricMenuClose();
    };

    // Placeholder for health metrics
    const healthMetrics = [
        { title: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: <BloodIcon />, color: '#F44336', trend: 5, lastUpdated: '2024-07-26 10:30 AM' },
        { title: 'Heart Rate', value: '72', unit: 'bpm', icon: <HeartIcon />, color: '#2196F3', trend: -2, lastUpdated: '2024-07-26 10:30 AM' },
        { title: 'Weight', value: '70', unit: 'kg', icon: <ScaleIcon />, color: '#4CAF50', trend: 0, lastUpdated: '2024-07-26 10:30 AM' },
    ];

    const handleRequestAppointment = () => {
        router.push('/patient/appointments/new');
    };

    const handleStartConsultation = () => {
        router.push('/patient/consultations/new');
    };

    const handleSendMessage = () => {
        router.push('/patient/messages/new');
    };

    const handleOrderMedication = () => {
        router.push('/patient/prescriptions/refill');
    };

    const handleAccessHealthRecords = () => {
        router.push('/patient/medical-file');
    };

    const handleViewNotifications = () => {
        router.push('/patient/notifications');
    };

    return (
        <div className="container mx-auto py-6 px-6 min-h-screen bg-gray-50">
            <PageHeader
                title="Good Morning, Alex!"
                subtitle="Welcome back! Here's a quick overview of your health."
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Upcoming Appointments"
                    value={dashboardSummary.appointments}
                    subtitle="Appointments"
                    icon={<EventIcon />}
                    color="#1976D2"
                    trend={10}
                />
                <StatCard
                    title="Active Medications"
                    value={dashboardSummary.medications}
                    subtitle="Medications"
                    icon={<MedicationIcon />}
                    color="#4CAF50"
                    trend={-5}
                />
                <StatCard
                    title="New Messages"
                    value={dashboardSummary.messages}
                    subtitle="Messages"
                    icon={<MessageIcon />}
                    color="#FF9800"
                    trend={20}
                />
                <StatCard
                    title="Pending Consultations"
                    value={dashboardSummary.consultations}
                    subtitle="Consultations"
                    icon={<PersonIcon />}
                    color="#9C27B0"
                    trend={15}
                />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <QuickActionButton
                                icon={<AddIcon />}
                                label="Request New Appointment"
                                onClick={handleRequestAppointment}
                                color="#1976D2"
                            />
                            <QuickActionButton
                                icon={<VideoCallIcon />}
                                label="Start Video Consultation"
                                onClick={handleStartConsultation}
                                color="#4CAF50"
                            />
                            <QuickActionButton
                                icon={<ChatIcon />}
                                label="Send a Secure Message"
                                onClick={handleSendMessage}
                                color="#FF9800"
                            />
                            <QuickActionButton
                                icon={<LocalPharmacyIcon />}
                                label="Order Medication Refill"
                                onClick={handleOrderMedication}
                                color="#9C27B0"
                            />
                            <QuickActionButton
                                icon={<HealthIcon />}
                                label="Access Health Records"
                                onClick={handleAccessHealthRecords}
                                color="#E91E63"
                            />
                            <QuickActionButton
                                icon={<NotificationsIcon />}
                                label="View Notifications"
                                onClick={handleViewNotifications}
                                color="#00BCD4"
                            />
                        </div>
                    </div>

                    <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Health Metrics Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {healthMetrics.map((metric, index) => (
                                <HealthMetricCard
                                    key={index}
                                    title={metric.title}
                                    value={metric.value}
                                    unit={metric.unit}
                                    icon={metric.icon}
                                    color={metric.color}
                                    trend={metric.trend}
                                    lastUpdated={metric.lastUpdated}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-6">
                    <ActivityCard
                        title="Upcoming Appointments"
                        icon={<CalendarIcon />}
                        color="#1976D2"
                        onViewAll={() => console.log('View All Appointments')}
                    >
                        {upcomingAppointments.length > 0 ? (
                            <ul className="space-y-4">
                                {upcomingAppointments.map((appointment) => (
                                    <li key={appointment.id} className="flex items-start space-x-3 pb-4 border-b last:border-b-0 border-gray-100 last:pb-0">
                                        <CalendarIcon className="text-blue-500 mt-1" />
                                        <div>
                                            <p className="font-medium text-gray-900">{appointment.title}</p>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(appointment.date)} at {formatTime(appointment.date)}
                                            </p>
                                            <p className="text-xs text-gray-500">with Dr. {appointment.doctorName}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500 text-center py-4">No upcoming appointments.</div>
                            )}
                    </ActivityCard>

                    <ActivityCard
                        title="Active Medications"
                        icon={<MedicationIcon />}
                        color="#4CAF50"
                        onViewAll={() => console.log('View All Medications')}
                    >
                        {activeMedications.length > 0 ? (
                            <ul className="space-y-4">
                                {activeMedications.map((medication) => (
                                    <li key={medication.id} className="flex items-start space-x-3 pb-4 border-b last:border-b-0 border-gray-100 last:pb-0">
                                        <MedicationIcon className="text-green-500 mt-1" />
                                        <div>
                                            <p className="font-medium text-gray-900">{medication.name}</p>
                                            <p className="text-sm text-gray-600">{medication.dosage}</p>
                                            <p className="text-xs text-gray-500">Refills: {medication.refills}</p>
                                        </div>
                                    </li>
                            ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500 text-center py-4">No active medications.</div>
                            )}
                    </ActivityCard>

                    <ActivityCard
                        title="Recent Messages"
                        icon={<MessageIcon />}
                        color="#FF9800"
                        onViewAll={() => console.log('View All Messages')}
                    >
                        {recentMessages.length > 0 ? (
                            <ul className="space-y-4">
                                {recentMessages.map((message) => (
                                    <li key={message.id} className="flex items-start space-x-3 pb-4 border-b last:border-b-0 border-gray-100 last:pb-0">
                                        <img className="w-8 h-8 rounded-full flex-shrink-0 object-cover" alt={message.sender} src={message.avatar} />
                                        <div>
                                            <p className="font-medium text-gray-900">{message.sender}</p>
                                            <p className="text-sm text-gray-600 line-clamp-1">{message.lastMessage}</p>
                                            <p className="text-xs text-gray-500">{formatDateTime(message.timestamp)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500 text-center py-4">No recent messages.</div>
                            )}
                    </ActivityCard>

                    <ActivityCard
                        title="Recent Consultations"
                        icon={<PersonIcon />}
                        color="#9C27B0"
                        onViewAll={() => console.log('View All Consultations')}
                    >
                        {recentConsultations.length > 0 ? (
                            <ul className="space-y-4">
                                {recentConsultations.map((consultation) => (
                                    <li key={consultation.id} className="flex items-start space-x-3 pb-4 border-b last:border-b-0 border-gray-100 last:pb-0">
                                        <img className="w-8 h-8 rounded-full flex-shrink-0 object-cover" alt={consultation.doctorName} src={consultation.doctorAvatar} />
                                        <div>
                                            <p className="font-medium text-gray-900">{consultation.doctorName}</p>
                                            <p className="text-sm text-gray-600 line-clamp-1">{consultation.subject}</p>
                                            <p className="text-xs text-gray-500">{formatDateTime(consultation.lastMessageTimestamp)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500 text-center py-4">No recent consultations.</div>
                            )}
                    </ActivityCard>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;