'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Clock, ArrowUp, ArrowDown, Minus, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const conditionSchema = z.object({
    status: z.string().min(1, 'Status is required'),
    notes: z.string().min(5, 'Notes must be at least 5 characters'),
});

export default function PatientConditionForm({ patientId, patientName, previousUpdates = [], onClose, onSuccess }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { 
        control, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(conditionSchema),
        defaultValues: {
            status: '',
            notes: ''
        }
    });

    const getStatusIcon = (status) => {
        switch(status.toLowerCase()) {
            case 'improving':
                return <ArrowUp size={16} className="text-green-500" />;
            case 'worsening':
                return <ArrowDown size={16} className="text-red-500" />;
            case 'stable':
                return <Minus size={16} className="text-blue-500" />;
            case 'critical':
                return <Activity size={16} className="text-orange-500" />;
            default:
                return <Clock size={16} className="text-gray-500" />;
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError('');
            const result = { success: true, update: data };
            if (result.success) {
                setSuccess('Condition update added successfully');
                reset();
                if (onSuccess) {
                    onSuccess(result.update);
                }
                setTimeout(() => {
                    if (onClose) onClose();
                }, 2000);
            } else {
                setError(result.message || 'Failed to add condition update');
            }
        } catch (err) {
            setError('An error occurred while adding the condition update');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Update Patient Condition
                    </h2>
                    {patientName && (
                        <p className="text-sm text-gray-500">
                            for {patientName}
                        </p>
                    )}
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X size={20} />
                    </Button>
                )}
            </div>
            {error && (
                <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg">
                    {success}
                </div>
            )}
            {previousUpdates && previousUpdates.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Previous Updates
                    </h3>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                        <div className="divide-y divide-gray-200">
                            {previousUpdates.map((update, index) => (
                                <div 
                                    key={index}
                                    className="p-3 flex items-start space-x-3"
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        {getStatusIcon(update.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <p className="text-sm font-medium text-gray-900">
                                                {update.status}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {update.date}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {update.notes}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <div className="border-t border-gray-200 my-4" />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    {...field}
                                    id="status"
                                    disabled={isSubmitting}
                                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.status ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select a status</option>
                                    <option value="Improving">Improving</option>
                                    <option value="Stable">Stable</option>
                                    <option value="Worsening">Worsening</option>
                                    <option value="Critical">Critical</option>
                                    <option value="In Remission">In Remission</option>
                                    <option value="Recovered">Recovered</option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.status.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                </div>
                <div>
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    {...field}
                                    id="notes"
                                    rows={4}
                                    disabled={isSubmitting}
                                    placeholder="Enter detailed notes about the patient's current condition"
                                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.notes ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.notes && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.notes.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    {onClose && (
                        <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                    )}
                    <Button variant="primary" size="sm" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Update'}
                    </Button>
                </div>
            </form>
        </div>
    );
} 