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
            <DialogContent className="bg-white border border-primary/20 shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-primary font-semibold">
                        {t('patient.medications.reminderDialogTitle', 'Set Reminders')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label className="text-primary font-medium">{t('patient.medications.enableReminders', 'Enable Reminders')}</Label>
                        <div className="mt-3">
                                                            <Button
                                    type="button"
                                    variant={remindersEnabled ? "success" : "outline"}
                                    onClick={() => setRemindersEnabled(!remindersEnabled)}
                                    className="flex items-center gap-2 transition-all duration-200"
                                >
                                {remindersEnabled ? <BellRing className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                                {remindersEnabled ? t('patient.medications.enabled', 'Enabled') : t('patient.medications.disabled', 'Disabled')}
                            </Button>
                        </div>
                    </div>
                    {remindersEnabled && (
                        <>
                            <div>
                                <Label className="text-primary font-medium">{t('patient.medications.reminderTimes', 'Reminder Times')}</Label>
                                <div className="flex flex-col gap-3 mt-3">
                                    {reminderTimes.map((time, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <Input
                                                type="time"
                                                value={time}
                                                onChange={e => handleTimeChange(e, idx)}
                                                className="w-32 border-primary/30 focus:border-primary focus:ring-primary/20"
                                            />
                                            <Button
                                                type="button"
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleRemoveTime(idx)}
                                                
                                            >
                                                <Trash2 className="h-4 w-4 text-red-400" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddTime}
                                        className="transition-colors"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t('patient.medications.addTime', 'Add Time')}
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label className="text-primary font-medium">{t('patient.medications.reminderDays', 'Reminder Days')}</Label>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {DAYS_OF_WEEK.map(day => (
                                        <Button
                                            key={day.value}
                                            type="button"
                                            variant={reminderDays.includes(day.value) ? "success" : "outline"}
                                            onClick={() => handleDayToggle(day.value)}
                                            className="w-20 transition-all duration-200"
                                        >
                                            {day.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            className="transition-colors"
                        >
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button 
                            type="submit"
                            variant="success"
                            className="transition-all duration-200"
                        >
                            {t('common.save', 'Save')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReminderDialog;