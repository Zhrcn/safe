import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { BellRing, BellOff, Trash2, Plus } from 'lucide-react';

const ReminderDialog = ({ open, medication, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [reminderTimes, setReminderTimes] = useState([]);
    const [reminderDays, setReminderDays] = useState([]);
    const [remindersEnabled, setRemindersEnabled] = useState(true);

    useEffect(() => {
        if (medication) {
            setReminderTimes(medication.reminderTimes || []);
            setReminderDays(medication.reminderDays || []);
            setRemindersEnabled(medication.remindersEnabled ?? true);
        }
    }, [medication, open]);

    const DAYS_OF_WEEK = [
        { value: 'monday', label: t('patient.medications.days.mon', 'Mon') },
        { value: 'tuesday', label: t('patient.medications.days.tue', 'Tue') },
        { value: 'wednesday', label: t('patient.medications.days.wed', 'Wed') },
        { value: 'thursday', label: t('patient.medications.days.thu', 'Thu') },
        { value: 'friday', label: t('patient.medications.days.fri', 'Fri') },
        { value: 'saturday', label: t('patient.medications.days.sat', 'Sat') },
        { value: 'sunday', label: t('patient.medications.days.sun', 'Sun') },
    ];

    const handleTimeChange = (e, idx) => {
        const newTimes = [...reminderTimes];
        newTimes[idx] = e.target.value;
        setReminderTimes(newTimes);
    };

    const handleAddTime = () => {
        setReminderTimes([...reminderTimes, '08:00']);
    };

    const handleRemoveTime = (idx) => {
        setReminderTimes(reminderTimes.filter((_, i) => i !== idx));
    };

    const handleDayToggle = (day) => {
        if (reminderDays.includes(day)) {
            setReminderDays(reminderDays.filter(d => d !== day));
        } else {
            setReminderDays([...reminderDays, day]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            reminderTimes,
            reminderDays,
            remindersEnabled,
        });
    };

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('patient.medications.reminderDialogTitle', 'Set Reminders')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>{t('patient.medications.enableReminders', 'Enable Reminders')}</Label>
                        <div className="mt-2">
                            <Button
                                type="button"
                                variant={remindersEnabled ? "default" : "outline"}
                                onClick={() => setRemindersEnabled(!remindersEnabled)}
                                className="flex items-center gap-2"
                            >
                                {remindersEnabled ? <BellRing className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                                {remindersEnabled ? t('patient.medications.enabled', 'Enabled') : t('patient.medications.disabled', 'Disabled')}
                            </Button>
                        </div>
                    </div>
                    {remindersEnabled && (
                        <>
                            <div>
                                <Label>{t('patient.medications.reminderTimes', 'Reminder Times')}</Label>
                                <div className="flex flex-col gap-2 mt-2">
                                    {reminderTimes.map((time, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <Input
                                                type="time"
                                                value={time}
                                                onChange={e => handleTimeChange(e, idx)}
                                                className="w-32"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveTime(idx)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddTime}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        {t('patient.medications.addTime', 'Add Time')}
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label>{t('patient.medications.reminderDays', 'Reminder Days')}</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {DAYS_OF_WEEK.map(day => (
                                        <Button
                                            key={day.value}
                                            type="button"
                                            variant={reminderDays.includes(day.value) ? "default" : "outline"}
                                            onClick={() => handleDayToggle(day.value)}
                                            className="w-20"
                                        >
                                            {day.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button type="submit">
                            {t('common.save', 'Save')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReminderDialog; 