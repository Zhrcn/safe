'use client';
import React, { useState, useEffect } from 'react';
import { useNotification } from '@/components/ui/Notification';
import { cn } from '@/utils/styles';
import {Button} from '@/components/ui/Button';
export default function AppointmentForm({ open, onClose, onSubmit, patient, doctor, initialData = null, isReschedule = false, doctorsList = [] }) {
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        type: '',
        reason: '',
        duration: '30',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                date: initialData.date || '',
                time: initialData.time || '',
                type: initialData.type || '',
                reason: initialData.reason || '',
                duration: initialData.duration || '30',
                notes: initialData.notes || ''
            });
        } else {
            setFormData({
                date: '',
                time: '',
                type: '',
                reason: '',
                duration: '30',
                notes: ''
            });
        }
    }, [initialData, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
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
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.time) newErrors.time = 'Time is required';
        if (!formData.type) newErrors.type = 'Appointment type is required';
        if (!formData.reason) newErrors.reason = 'Reason is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const appointmentData = {
                ...formData,
                patientId: patient.id,
                doctorId: doctor.id,
                status: isReschedule ? (initialData?.status || 'scheduled') : 'scheduled',
                createdAt: isReschedule ? (initialData?.createdAt || new Date().toISOString()) : new Date().toISOString(),
                id: isReschedule ? initialData?.id : undefined
            };
            onSubmit(appointmentData);
            onClose();
        }
    };
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-background rounded-lg shadow-lg w-full max-w-2xl mx-4">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">{isReschedule ? 'Reschedule Appointment' : 'Schedule Appointment'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    disabled
                                    className="w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Preferred Time</label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className={cn(
                                        "w-full px-3 py-2 border rounded-md",
                                        errors.time ? "border-red-500" : "border-border",
                                        "bg-background text-foreground"
                                    )}
                                />
                                {errors.time && (
                                    <p className="mt-1 text-sm text-red-500">{errors.time}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Doctor</label>
                                <select
                                    name="doctorId"
                                    value={formData.doctorId || doctor?.id || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                                >
                                    <option value="">Select Doctor</option>
                                    {doctorsList.map((doc) => (
                                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Reason for Visit</label>
                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                rows={2}
                                className={cn(
                                    "w-full px-3 py-2 border rounded-md",
                                    errors.reason ? "border-red-500" : "border-border",
                                    "bg-background text-foreground"
                                )}
                            />
                            {errors.reason && (
                                <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
                            )}
                        </div>
                    </form>
                </div>
                <div className="flex justify-end gap-2 p-6 border-t border-border">
                    <Button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md"
                    >
                        {isReschedule ? 'Reschedule' : 'Schedule Appointment'}
                    </Button>
                </div>
            </div>
        </div>
    );
} 