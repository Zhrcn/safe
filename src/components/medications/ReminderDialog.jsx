import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { BellRing, BellOff, Trash2, Plus } from 'lucide-react';

const ReminderDialog = ({ open, medication, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [reminders, setReminders] = useState([]);
    const [remindersEnabled, setRemindersEnabled] = useState(true);

    useEffect(() => {
        if (medication && Array.isArray(medication.reminders)) {
            setReminders(medication.reminders.length > 0 ? medication.reminders : [{ time: '08:00', days: [], note: '' }]);
        } else {
            setReminders([{ time: '08:00', days: [], note: '' }]);
        }
        setRemindersEnabled(true);
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

    const handleReminderChange = (idx, field, value) => {
        setReminders(reminders => reminders.map((rem, i) => i === idx ? { ...rem, [field]: value } : rem));
    };

    const handleDayToggle = (idx, day) => {
        setReminders(reminders => reminders.map((rem, i) => {
            if (i !== idx) return rem;
            const days = rem.days || [];
            return days.includes(day)
                ? { ...rem, days: days.filter(d => d !== day) }
                : { ...rem, days: [...days, day] };
        }));
    };

    const handleAddReminder = () => {
        setReminders([...reminders, { time: '08:00', days: [], note: '' }]);
    };

    const handleRemoveReminder = (idx) => {
        setReminders(reminders => reminders.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ reminders: remindersEnabled ? reminders : [] });
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
                                <Label className="text-primary font-medium">{t('patient.medications.reminders', 'Reminders')}</Label>
                                <div className="flex flex-col gap-3 mt-3">
                                    {reminders.map((rem, idx) => (
                                        <div key={idx} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <Input
                                                    type="time"
                                                    value={rem.time}
                                                    onChange={e => handleReminderChange(idx, 'time', e.target.value)}
                                                    className="w-32 border-primary/30 focus:border-primary focus:ring-primary/20"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleRemoveReminder(idx)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-400" />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {DAYS_OF_WEEK.map(day => (
                                                    <Button
                                                        key={day.value}
                                                        type="button"
                                                        variant={rem.days && rem.days.includes(day.value) ? "success" : "outline"}
                                                        onClick={() => handleDayToggle(idx, day.value)}
                                                        className="w-20 transition-all duration-200"
                                                    >
                                                        {day.label}
                                                    </Button>
                                                ))}
                                            </div>
                                            <Input
                                                type="text"
                                                placeholder={t('patient.medications.reminderNote', 'Note (optional)')}
                                                value={rem.note || ''}
                                                onChange={e => handleReminderChange(idx, 'note', e.target.value)}
                                                className="mt-2"
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddReminder}
                                        className="transition-colors"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t('patient.medications.addReminder', 'Add Reminder')}
                                    </Button>
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