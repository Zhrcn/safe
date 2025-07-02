'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserRound, Send, Clock, CheckCircle2, XCircle, AlertCircle, FileText, Calendar, Info, MapPin } from 'lucide-react'; 
import { cn } from '@/lib/utils';
const referralSchema = z.object({
    doctorId: z.string().min(1, 'Doctor is required'),
    reason: z.string().min(5, 'Reason must be at least 5 characters'),
    notes: z.string().optional(),
    urgency: z.enum(['Low', 'Medium', 'High', 'Emergency'])
});
export default function ReferralForm({ patientId, patientName, previousReferrals = [], onClose, onSuccess }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(referralSchema),
        defaultValues: {
            doctorId: '',
            reason: '',
            notes: '',
            urgency: 'Medium'
        }
    });
    useEffect(() => {
        const loadDoctors = async () => {
            try {
                setLoading(true);
                setDoctors([
                    { id: '1', name: 'Dr. John Doe', specialty: 'Cardiologist' },
                    { id: '2', name: 'Dr. Jane Smith', specialty: 'Dermatologist' },
                    { id: '3', name: 'Dr. Bob Johnson', specialty: 'Pediatrician' }
                ]);
            } catch (err) {
                console.error('Failed to load doctors:', err);
                setError('Failed to load available doctors');
            } finally {
                setLoading(false);
            }
        };
        loadDoctors();
    }, []);
    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusIcon = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending':
                return <Clock size={16} className="text-amber-500" />;
            case 'accepted':
                return <CheckCircle2 size={16} className="text-green-500" />;
            case 'rejected':
                return <XCircle size={16} className="text-red-500" />;
            case 'completed':
                return <CheckCircle2 size={16} className="text-blue-500" />;
            default:
                return <AlertCircle size={16} className="text-gray-500" />;
        }
    };
    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError('');
            const doctor = doctors.find(d => d.id === data.doctorId);
            if (!doctor) {
                setError('Selected doctor not found');
                return;
            }
            const referralData = {
                doctorId: data.doctorId,
                doctorName: doctor.name,
                doctorSpecialty: doctor.specialty,
                reason: data.reason,
                notes: data.notes || '',
                urgency: data.urgency
            };
            const result = { success: true, referral: referralData };
            if (result.success) {
                setSuccess('Referral created successfully');
                reset();
                if (onSuccess) {
                    onSuccess(result.referral);
                }
                setTimeout(() => {
                    if (onClose) onClose();
                }, 2000);
            } else {
                setError(result.message || 'Failed to create referral');
            }
        } catch (err) {
            setError('An error occurred while creating the referral');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="p-6 bg-card border border-border rounded-2xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl text-foreground font-bold mb-1">
                        Create Referral
                    </h2>
                    {patientName && (
                        <p className="text-muted-foreground text-base">
                            for {patientName}
                        </p>
                    )}
                </div>
            </div>
            {error && (
                <div className="bg-red-100 text-red-800 border border-red-200 rounded-2xl p-3 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm">{error}</p>
                </div>
            )}
            {success && (
                <div className="bg-green-100 text-green-800 border border-green-200 rounded-2xl p-3 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <p className="text-sm">{success}</p>
                </div>
            )}
            {previousReferrals && previousReferrals.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg text-foreground font-semibold mb-3">
                        Previous Referrals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {previousReferrals.map((referral, index) => (
                            <Card key={index} className="border border-border p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium text-foreground text-base">
                                        {referral.doctorName}
                                    </p>
                                    <Badge className={getStatusColor(referral.status)}>
                                        {referral.status}
                                    </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p><strong>Reason:</strong> {referral.reason}</p>
                                    {referral.notes && <p><strong>Notes:</strong> {referral.notes}</p>}
                                    <p><strong>Urgency:</strong> {referral.urgency}</p>
                                    <p className="flex items-center gap-1">
                                        {getStatusIcon(referral.status)}
                                        <span>Status: {referral.status}</span>
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="doctorId">Referral To Doctor</Label>
                    <Controller
                        name="doctorId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger className={cn({ 'border-destructive': errors.doctorId })}>
                                    <SelectValue placeholder="Select a doctor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {loading ? (
                                        <SelectItem value="" disabled>Loading doctors...</SelectItem>
                                    ) : doctors.length > 0 ? (
                                        doctors.map((doctor) => (
                                            <SelectItem key={doctor.id} value={doctor.id}>
                                                {doctor.name} ({doctor.specialty})
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="" disabled>No doctors available</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.doctorId && (
                        <p className="text-sm text-destructive">{errors.doctorId.message}</p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="reason">Reason for Referral</Label>
                    <Textarea
                        id="reason"
                        {...control.register('reason')}
                        className={cn({ 'border-destructive': errors.reason })}
                        rows={4}
                        placeholder="Explain the reason for referral..."
                    />
                    {errors.reason && (
                        <p className="text-sm text-destructive">{errors.reason.message}</p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                        id="notes"
                        {...control.register('notes')}
                        rows={4}
                        placeholder="Any additional notes for the doctor..."
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Controller
                        name="urgency"
                        control={control}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select urgency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Emergency">Emergency</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Referral'}
                    </Button>
                </div>
            </form>
        </div>
    );
} 