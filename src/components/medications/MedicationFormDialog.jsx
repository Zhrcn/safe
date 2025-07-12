import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';

const MedicationFormDialog = ({ open, mode, medication, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');
    const [refillDate, setRefillDate] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (mode === 'edit' && medication) {
            setName(medication.name || '');
            setDosage(medication.dosage || '');
            setFrequency(medication.frequency || '');
            setRefillDate(medication.refillDate ? new Date(medication.refillDate).toISOString().split('T')[0] : '');
            setNotes(medication.notes || '');
        } else {
            setName('');
            setDosage('');
            setFrequency('');
            setRefillDate('');
            setNotes('');
        }
    }, [mode, medication, open]);

    const FREQUENCY_OPTIONS = [
        { value: 'once_daily', label: t('patient.medications.frequency.onceDaily', 'Once a day') },
        { value: 'twice_daily', label: t('patient.medications.frequency.twiceDaily', 'Twice a day') },
        { value: 'three_times_daily', label: t('patient.medications.frequency.threeTimesDaily', 'Three times a day') },
        { value: 'four_times_daily', label: t('patient.medications.frequency.fourTimesDaily', 'Four times a day') },
        { value: 'every_6_hours', label: t('patient.medications.frequency.every6Hours', 'Every 6 hours') },
        { value: 'every_8_hours', label: t('patient.medications.frequency.every8Hours', 'Every 8 hours') },
        { value: 'every_12_hours', label: t('patient.medications.frequency.every12Hours', 'Every 12 hours') },
        { value: 'as_needed', label: t('patient.medications.frequency.asNeeded', 'As Needed') },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            dosage,
            frequency,
            startDate: new Date().toISOString(),
            refillDate: refillDate ? new Date(refillDate).toISOString() : null,
            instructions: notes, 
            notes
        });
    };

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'edit' ? t('patient.medications.editMedication', 'Edit Medication') : t('patient.medications.addMedication', 'Add Medication')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>{t('patient.medications.name', 'Medication Name')}</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div>
                        <Label>{t('patient.medications.dosage', 'Dosage')}</Label>
                        <Input value={dosage} onChange={e => setDosage(e.target.value)} required />
                    </div>
                    <div>
                        <Label>{t('patient.medications.frequency', 'Frequency')}</Label>
                        <Select value={frequency} onValueChange={setFrequency} required>
                            <SelectTrigger>
                                <span>{/* Place the trigger content here, or leave empty if using <SelectValue /> elsewhere */}</span>
                            </SelectTrigger>
                            <SelectContent>
                                {FREQUENCY_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>{t('patient.medications.refillDate', 'Refill Date')}</Label>
                        <Input type="date" value={refillDate} onChange={e => setRefillDate(e.target.value)} />
                    </div>
                    {/* Removed prescribedBy field - will use current user as default */}
                    <div>
                        <Label>{t('patient.medications.notes', 'Notes')}</Label>
                        <Textarea value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button variant="success" type="submit">
                            {t('common.save', 'Save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default MedicationFormDialog; 