'use client';
import React, { useState, useEffect } from 'react';
import { useNotification } from '@/components/ui/Notification';
import { cn } from '@/utils/styles';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { getDoctors } from '@/store/services/doctor/doctorApi';

const initialFormState = {
    doctorId: '',
    preferredDate: '',
    type: '',
    reason: '',
    notes: ''
};

const appointmentTypes = [
    { value: 'checkup', label: 'Checkup' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'emergency', label: 'Emergency' },
];

const timeSlots = [
    { value: 'morning', label: 'Morning (9:00 AM - 12:00 PM)' },
    { value: 'afternoon', label: 'Afternoon (2:00 PM - 5:00 PM)' },
    { value: 'evening', label: 'Evening (6:00 PM - 9:00 PM)' }
];

function DoctorSelect({ value, onChange, doctors, loading, error }) {
    return (
        <div className="space-y-2">
            <Label htmlFor="doctor">Doctor</Label>
            <Select
                value={value}
                onValueChange={onChange}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                    {loading
                        ? null
                        : doctors.map((doc) => (
                            <SelectItem key={doc._id} value={doc._id}>
                                {doc.firstName && doc.lastName
                                    ? `${doc.firstName} ${doc.lastName}`
                                    : doc.name
                                        ? doc.name
                                        : doc.user?.firstName && doc.user?.lastName
                                            ? `${doc.user.firstName} ${doc.user.lastName}`
                                            : doc.user?.email
                                                ? doc.user.email
                                                : doc._id}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

function AppointmentTypeSelect({ value, onChange, error }) {
    return (
        <div className="space-y-2">
            <Label htmlFor="type">Appointment Type</Label>
            <Select
                value={value}
                onValueChange={onChange}
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
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

function ReasonTextarea({ value, onChange, error }) {
    return (
        <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Textarea
                id="reason"
                value={value}
                onChange={onChange}
                rows={3}
                placeholder="Please describe the reason for your visit..."
                className={cn(
                    error && "border-red-500"
                )}
            />
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

function AppointmentForm({ onClose, isReschedule, initialData, onSubmit }) {
    const [formData, setFormData] = useState({
        ...initialFormState,
        ...initialData,
        date: '1111-01-01',
        time: initialData?.time || 'TBD',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [doctorsData, setDoctorsData] = useState([]);
    const [doctorsLoading, setDoctorsLoading] = useState(false);
    const [doctorsError, setDoctorsError] = useState(null);

    useEffect(() => {
        setDoctorsLoading(true);
        setDoctorsError(null);
        getDoctors()
            .then(data => setDoctorsData(data))
            .catch(err => setDoctorsError(err.message || 'Failed to fetch doctors'))
            .finally(() => setDoctorsLoading(false));
    }, []);

    const handleChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.doctorId && !isReschedule) newErrors.doctorId = 'Doctor is required';
        if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
        if (!formData.type) newErrors.type = 'Appointment type is required';
        if (!formData.reason) newErrors.reason = 'Reason for visit is required';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setIsSubmitting(true);
            try {
                await onSubmit(formData);
            } catch (err) {
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-background rounded-2xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">
                        {isReschedule ? 'Reschedule Appointment' : 'Schedule Appointment'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="doctor">Doctor</Label>
                                {isReschedule ? (
                                    <Input
                                        value={(() => {
                                            if (initialData && initialData.doctor && initialData.doctor.user) {
                                                const { firstName, lastName } = initialData.doctor.user;
                                                return `${firstName || ''} ${lastName || ''}`.trim();
                                            }
                                            return '';
                                        })()}
                                        disabled
                                        readOnly
                                        className="bg-muted cursor-not-allowed"
                                    />
                                ) : (
                                    <Select
                                        value={formData.doctorId}
                                        onValueChange={(value) => handleChange('doctorId', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Doctor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {doctorsLoading
                                                ? null
                                                : doctorsData.map((doc) => (
                                                    <SelectItem key={doc._id} value={doc._id}>
                                                        {doc.firstName && doc.lastName
                                                            ? `${doc.firstName} ${doc.lastName}`
                                                            : doc.name
                                                                ? doc.name
                                                                : doc.user?.firstName && doc.user?.lastName
                                                                    ? `${doc.user.firstName} ${doc.user.lastName}`
                                                                    : doc.user?.email
                                                                        ? doc.user.email
                                                                        : doc._id}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                )}
                                {!isReschedule && errors.doctorId && (
                                    <p className="text-sm text-red-500">{errors.doctorId}</p>
                                )}
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
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="preferredDate">Preferred Date</Label>
                            <Input
                                id="preferredDate"
                                type="text"
                                value={formData.preferredDate}
                                onChange={(e) => handleChange('preferredDate', e.target.value)}
                                placeholder="e.g., Next Monday, March 15th, or any day next week"
                                className={cn(
                                    errors.preferredDate && "border-red-500"
                                )}
                            />
                            <p className="text-sm text-muted-foreground">
                                Please describe when you'd prefer to have your appointment. The doctor will schedule the exact date and time.
                            </p>
                            {errors.preferredDate && (
                                <p className="text-sm text-red-500">{errors.preferredDate}</p>
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
                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="success"
                                disabled={isSubmitting}
                            >
                                {isSubmitting 
                                    ? (isReschedule ? 'Rescheduling...' : 'Scheduling...')
                                    : (isReschedule ? 'Reschedule' : 'Schedule Appointment')
                                }
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AppointmentForm;
