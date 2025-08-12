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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
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
            className="border rounded-lg shadow-sm bg-white"
            style={{
                borderColor: border,
                color: text,
                background: 'var(--color-card, #fff)',
                borderRadius: 12,
                minWidth: 0,
            }}
        >
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <span className="rounded-full p-2 bg-[var(--color-primary-bg,#f0f4fa)] flex items-center justify-center">
                    <Pill className="h-6 w-6" style={{ color: primary }} />
                </span>
                <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold truncate" style={{ color: text }}>
                        {medication.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge
                            style={{
                                background: statusStyle.background,
                                color: statusStyle.color,
                                borderColor: statusStyle.borderColor,
                                borderWidth: 1,
                                borderStyle: 'solid',
                                fontWeight: 700,
                                fontSize: 11,
                                letterSpacing: 1,
                                padding: '2px 12px',
                                borderRadius: 9999,
                                textTransform: 'uppercase'
                            }}
                        >
                            {medication.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {medication.dosage} &bull; {medication.frequency}
                        </span>
                    </CardDescription>
                </div>
                <div className="flex gap-1">
                            
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(medication._id)}
                        aria-label={t('patient.medications.delete', 'Delete')}
                        className="hover:bg-[var(--color-error-bg,#fbeaea)] transition-colors"
                        style={{
                            color: error,
                            borderRadius: 8,
                            padding: 6
                        }}
                        tabIndex={0}
                        title={t('patient.medications.delete', 'Delete')}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-0">
                <div className="flex flex-col gap-2">
                    {medication.refillDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" style={{ color: primary }} />
                            <span>
                                <span className="font-semibold">{t('patient.medications.nextRefill', 'Next refill:')}</span>{' '}
                                {format(new Date(medication.refillDate), 'PPP')}
                            </span>
                        </div>
                    )}
                    {doctorName && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Hospital className="h-4 w-4" style={{ color: primary }} />
                            <span>
                                <span className="font-semibold">{t('patient.medications.prescribedBy', 'Prescribed by')}</span> {doctorName}
                            </span>
                        </div>
                    )}
                </div>
                {medication.notes && (
                    <Alert
                        style={{
                            background: 'var(--color-warning-bg, #fffbe6)',
                            color: warning,
                            borderColor: warning,
                            borderRadius: 8,
                            padding: '8px 12px'
                        }}
                        icon={<AlertCircle className="h-4 w-4" style={{ color: warning }} />}
                        className="mt-2"
                    >
                        <AlertTitle className="text-xs font-semibold">{t('patient.medications.note', 'Note')}</AlertTitle>
                        <AlertDescription className="text-xs">{medication.notes}</AlertDescription>
                    </Alert>
                )}
                {(medication.remindersEnabled && reminderText) && (
                    <Alert
                        style={{
                            background: 'var(--color-info-bg, #e6f4fa)',
                            color: info,
                            borderColor: info,
                            borderRadius: 8,
                            padding: '8px 12px'
                        }}
                        icon={<BellRing className="h-4 w-4" style={{ color: info }} />}
                        className="mt-2"
                    >
                        <AlertTitle className="text-xs font-semibold">{t('patient.medications.remindersActive', 'Reminders Active')}</AlertTitle>
                        <AlertDescription className="text-xs">{reminderText}</AlertDescription>
                    </Alert>
                )}
                {Array.isArray(medication.reminders) && medication.reminders.length > 0 && (
                    <Alert
                        style={{
                            background: 'var(--color-info-bg, #e6f4fa)',
                            color: info,
                            borderColor: info,
                            borderRadius: 8,
                            padding: '8px 12px'
                        }}
                        icon={<BellRing className="h-4 w-4" style={{ color: info }} />}
                        className="mt-2"
                    >
                        <AlertTitle className="text-xs font-semibold">{t('patient.medications.reminders', 'Reminders')}</AlertTitle>
                        <AlertDescription className="text-xs">
                            <ul className="list-disc list-inside space-y-1">
                                {medication.reminders.map((rem, idx) => (
                                    <li key={rem._id || idx}>
                                        {rem.time ? `${t('patient.medications.at', 'At')} ${rem.time}` : ''}
                                        {rem.days && rem.days.length > 0 ? ` (${rem.days.join(', ')})` : ''}
                                        {rem.note ? ` - ${rem.note}` : ''}
                                    </li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-0">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                    {isRefillable() && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => onRefill(medication)}
                            className="flex items-center gap-2 font-semibold w-full sm:w-auto"
                            style={{
                                background: primary,
                                color: 'var(--color-primary-foreground)',
                                borderColor: border,
                                borderRadius: 8,
                                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'
                            }}
                        >
                            <Pill className="h-4 w-4" />
                            {t('patient.medications.refillNow', 'Refill')}
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSetReminder(medication)}
                        className="flex items-center gap-2 font-semibold w-full sm:w-auto"
                        style={{
                            borderColor: primary,
                            color: primary,
                            background: 'var(--color-primary-bg, #f0f4fa)',
                            borderRadius: 8
                        }}
                    >
                        {medication.remindersEnabled
                            ? <BellOff className="h-4 w-4" />
                            : <BellRing className="h-4 w-4" />}
                        {medication.remindersEnabled
                            ? t('patient.medications.manageReminders', 'Reminders')
                            : t('patient.medications.setReminders', 'Reminders')}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(medication)}
                        className="flex items-center gap-2 font-semibold w-full sm:w-auto"
                        style={{
                            borderColor: border,
                            color: primary,
                            background: 'var(--color-secondary-bg, #f0f4fa)',
                            borderRadius: 8
                        }}
                    >
                        {t('patient.medications.viewDetails', 'Details')}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default MedicationCard;