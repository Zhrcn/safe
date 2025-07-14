import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
    Edit,
    Trash2,
    BellRing,
    BellOff,
    Hospital,
    Pill,
    AlertCircle,
    Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';

const MedicationCard = ({ 
    medication, 
    onRefill, 
    onViewDetails, 
    onSetReminder, 
    onEdit, 
    onDelete 
}) => {
    const { t } = useTranslation();

    const primary = 'var(--color-primary)';
    const success = 'var(--color-success)';
    const secondary = 'var(--color-secondary)';
    const error = 'var(--color-error)';
    const warning = 'var(--color-warning)';
    const info = 'var(--color-info)';
    const border = 'var(--color-border)';
    const cardBg = 'var(--color-card)';
    const text = 'var(--color-foreground)';
    const muted = 'var(--color-muted-foreground)';

    const DAYS_OF_WEEK = [
        { value: 'monday', label: t('patient.medications.days.mon', 'Mon') },
        { value: 'tuesday', label: t('patient.medications.days.tue', 'Tue') },
        { value: 'wednesday', label: t('patient.medications.days.wed', 'Wed') },
        { value: 'thursday', label: t('patient.medications.days.thu', 'Thu') },
        { value: 'friday', label: t('patient.medications.days.fri', 'Fri') },
        { value: 'saturday', label: t('patient.medications.days.sat', 'Sat') },
        { value: 'sunday', label: t('patient.medications.days.sun', 'Sun') },
    ];

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return {
                    background: 'var(--color-success-bg, #e6f9f0)',
                    color: success,
                    borderColor: success
                };
            case 'completed':
                return {
                    background: 'var(--color-secondary-bg, #f0f4fa)',
                    color: secondary,
                    borderColor: secondary
                };
            case 'expired':
                return {
                    background: 'var(--color-error-bg, #fbeaea)',
                    color: error,
                    borderColor: error
                };
            default:
                return {
                    background: 'var(--color-secondary-bg, #f0f4fa)',
                    color: secondary,
                    borderColor: secondary
                };
        }
    };

    const isRefillable = () => {
        return medication.status.toLowerCase() === 'active' &&
            (medication.refillDate && new Date(medication.refillDate) <= new Date());
    };

    const getDoctorName = () => {
        if (!medication.prescribedBy) return '';
        return `${medication.prescribedBy.firstName} ${medication.prescribedBy.lastName}`;
    };

    const getReminderText = () => {
        if (!medication.remindersEnabled || !medication.reminderTimes || !medication.reminderDays) {
            return '';
        }
        
        const times = medication.reminderTimes.join(', ');
        const days = medication.reminderDays
            .map(day => DAYS_OF_WEEK.find(d => d.value === day)?.label)
            .filter(Boolean)
            .join(', ');
        
        return `${t('patient.medications.dailyAt', 'Daily at:')} ${times} ${t('patient.medications.on', 'on')} ${days}`;
    };

    const statusStyle = getStatusColor(medication.status);
    const doctorName = getDoctorName();
    const reminderText = getReminderText();

    return (
        <Card
            className="transition-all duration-300 hover:shadow-lg"
            style={{ background: cardBg, color: text, borderColor: border }}
        >
            <CardContent className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <Pill className="h-6 w-6" style={{ color: primary }} />
                        <h3 className="text-lg font-bold" style={{ color: text }}>
                            {medication.name}
                        </h3>
                    </div>

                    <p className="text-sm" style={{ color: muted }}>
                        {medication.dosage} - {medication.frequency}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" style={{ color: muted }}>
                        {medication.refillDate && (
                            <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" style={{ color: primary }} />
                                <span>
                                    {t('patient.medications.nextRefill', 'Next refill:')} {format(new Date(medication.refillDate), 'PPP')}
                                </span>
                            </div>
                        )}
                        {doctorName && (
                            <div className="flex items-center gap-1">
                                <Hospital className="h-4 w-4" style={{ color: primary }} />
                                <span>
                                    {t('patient.medications.prescribedBy', 'Prescribed by')} {doctorName}
                                </span>
                            </div>
                        )}
                    </div>

                    {medication.notes && (
                        <Alert
                            className="mt-3"
                            style={{
                                background: 'var(--color-warning-bg, #fffbe6)',
                                color: warning,
                                borderColor: warning
                            }}
                            icon={<AlertCircle className="h-4 w-4" style={{ color: warning }} />}
                        >
                            <AlertTitle>{t('patient.medications.note', 'Note')}</AlertTitle>
                            <AlertDescription>{medication.notes}</AlertDescription>
                        </Alert>
                    )}

                    {medication.remindersEnabled && reminderText && (
                        <Alert
                            className="mt-3"
                            style={{
                                background: 'var(--color-info-bg, #e6f4fa)',
                                color: info,
                                borderColor: info
                            }}
                            icon={<BellRing className="h-4 w-4" style={{ color: info }} />}
                        >
                            <AlertTitle>{t('patient.medications.remindersActive', 'Reminders Active')}</AlertTitle>
                            <AlertDescription>{reminderText}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="flex flex-col items-end gap-3">
                    <Badge
                        style={{
                            background: statusStyle.background,
                            color: statusStyle.color,
                            borderColor: statusStyle.borderColor,
                            borderWidth: 1,
                            borderStyle: 'solid'
                        }}
                    >
                        {medication.status}
                    </Badge>

                    <div className="flex flex-wrap gap-2 justify-end">
                        {isRefillable() && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => onRefill(medication)}
                                className="flex items-center gap-2"
                                style={{
                                    background: primary,
                                    color: 'var(--color-primary-foreground)',
                                    borderColor: border,
                                    fontWeight: 500,
                                    transition: 'background 0.2s, color 0.2s'
                                }}
                            >
                                <Pill className="h-4 w-4" />
                                {t('patient.medications.refillNow', 'Refill Now')}
                            </Button>
                        )}

                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => onSetReminder(medication)}
                            className="bg-primary flex items-center gap-2"
                            style={{
                                background: 'var(--color-primary-bg, #f0f4fa)',
                                color: primary,
                                borderColor: border,
                                fontWeight: 500,
                                transition: 'background 0.2s, color 0.2s'
                            }}
                        >
                            {medication.remindersEnabled ? <BellOff className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
                            {medication.remindersEnabled 
                                ? t('patient.medications.manageReminders', 'Manage Reminders') 
                                : t('patient.medications.setReminders', 'Set Reminders')
                            }
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails(medication)}
                            className="text-primary border-primary flex items-center gap-2"
                            style={{
                                borderColor: border,
                                color: primary,
                                background: 'var(--color-secondary-bg, #f0f4fa)',
                                fontWeight: 500,
                                transition: 'background 0.2s, color 0.2s'
                            }}
                        >
                            {t('patient.medications.viewDetails', 'View Details')}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(medication)}
                            className="text-primary border-primary flex items-center gap-2"
                            style={{
                                borderColor: border,
                                color: primary,
                                background: 'var(--color-secondary-bg, #f0f4fa)',
                                fontWeight: 500,
                                transition: 'background 0.2s, color 0.2s'
                            }}
                        >
                            <Edit className="h-4 w-4" />
                            {t('patient.medications.edit', 'Edit')}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(medication._id)}
                            className="flex items-center gap-2 group"
                            style={{
                                background: '#fff',
                                color: 'var(--color-error, #ef4444)',
                                borderColor: 'var(--color-error, #ef4444)',
                                fontWeight: 500,
                                transition: 'background 0.2s, color 0.2s'
                            }}
                        >
                            <Trash2
                                className="h-4 w-4"
                                style={{
                                    color: 'var(--color-error, #ef4444)',
                                    transition: 'color 0.2s'
                                }}
                            />
                            <span
                                style={{
                                    color: 'var(--color-error, #ef4444)',
                                    transition: 'color 0.2s'
                                }}
                            >
                                {t('patient.medications.delete', 'Delete')}
                            </span>
                            <style jsx>{`
                                .group:hover {
                                    background: var(--color-error, #ef4444) !important;
                                }
                                .group:hover .h-4 {
                                    color: #fff !important;
                                }
                                .group:hover span {
                                    color: #fff !important;
                                }
                            `}</style>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MedicationCard; 