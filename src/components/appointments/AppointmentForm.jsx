'use client';
import React, { useState, useEffect } from 'react';
import { useNotification } from '@/components/ui/Notification';
import { cn } from '@/utils/styles';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { doctors } from '@/mockdata/doctors';

const initialFormState = {
    timeSlot: '',
    type: '',
    reason: '',
    notes: ''
};

const appointmentTypes = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'routine', label: 'Routine Check-up' }
];

const timeSlots = [
    { value: 'morning', label: 'Morning (9:00 AM - 12:00 PM)' },
    { value: 'afternoon', label: 'Afternoon (2:00 PM - 5:00 PM)' },
    { value: 'evening', label: 'Evening (6:00 PM - 9:00 PM)' }
];

export default function AppointmentForm({ 
    open, 
    onClose, 
    onSubmit, 
    patient, 
    doctor, 
    initialData = null, 
    isReschedule = false 
}) {
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                timeSlot: initialData.time || '',
                type: initialData.type || '',
                reason: initialData.reason || '',
                notes: initialData.notes || ''
            });
        } else {
            setFormData(initialFormState);
        }
        setErrors({});
        setIsSubmitting(false);
    }, [initialData, open]);

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.timeSlot) newErrors.timeSlot = 'Time slot is required';
        if (!formData.type) newErrors.type = 'Appointment type is required';
        if (!formData.reason) newErrors.reason = 'Reason is required';
        if (!formData.reason.trim()) newErrors.reason = 'Reason cannot be empty';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);
            
            try {
                const appointmentData = {
                    ...formData,
                    time: formData.timeSlot,
                    patientId: patient.id,
                    doctorId: doctor.id,
                    status: isReschedule ? (initialData?.status || 'scheduled') : 'scheduled',
                    createdAt: isReschedule ? (initialData?.createdAt || new Date().toISOString()) : new Date().toISOString(),
                    id: isReschedule ? initialData?.id : undefined
                };
                
                await onSubmit(appointmentData);
                onClose();
                showNotification({
                    type: 'success',
                    title: isReschedule ? 'Appointment Rescheduled' : 'Appointment Scheduled',
                    message: isReschedule 
                        ? 'Your appointment has been successfully rescheduled.'
                        : 'Your appointment has been successfully scheduled.'
                });
            } catch (error) {
                showNotification({
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to schedule appointment. Please try again.'
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-background rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">
                        {isReschedule ? 'Reschedule Appointment' : 'Schedule Appointment'}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="timeSlot">Preferred Time Slot</Label>
                                <Select
                                    value={formData.timeSlot}
                                    onValueChange={(value) => handleChange('timeSlot', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time slot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeSlots.map((slot) => (
                                            <SelectItem key={slot.value} value={slot.value}>
                                                {slot.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.timeSlot && (
                                    <p className="text-sm text-red-500">{errors.timeSlot}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="doctor">Doctor</Label>
                                <Select
                                    value={formData.doctorId || doctor?.id || ''}
                                    onValueChange={(value) => handleChange('doctorId', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Doctor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctors.map((doc) => (
                                            <SelectItem key={doc.id} value={doc.id}>
                                                {doc.user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Appointment Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => handleChange('type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select appointment type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {appointmentTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-red-500">{errors.type}</p>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Visit</Label>
                            <Textarea
                                id="reason"
                                value={formData.reason}
                                onChange={(e) => handleChange('reason', e.target.value)}
                                rows={3}
                                placeholder="Please describe the reason for your visit..."
                                className={cn(
                                    errors.reason && "border-red-500"
                                )}
                            />
                            {errors.reason && (
                                <p className="text-sm text-red-500">{errors.reason}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Additional Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                rows={2}
                                placeholder="Any additional information you'd like to share..."
                            />
                        </div>
                    </form>
                </div>
                
                <div className="flex justify-end gap-3 p-6 border-t border-border">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        {isSubmitting 
                            ? (isReschedule ? 'Rescheduling...' : 'Scheduling...')
                            : (isReschedule ? 'Reschedule' : 'Schedule Appointment')
                        }
                    </Button>
                </div>
            </div>
        </div>
    );
}