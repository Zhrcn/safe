'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserRound,
  FileText,
  Calendar,
  Info,
  MapPin,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const referralSchema = z.object({
  doctorId: z.string().min(1, 'Doctor is required'),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  notes: z.string().optional(),
  urgency: z.enum(['Low', 'Medium', 'High', 'Emergency']),
});

export default function ReferralForm({
  patientId,
  patientName,
  previousReferrals = [],
  onClose,
  onSuccess,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      doctorId: '',
      reason: '',
      notes: '',
      urgency: 'Medium',
    },
  });

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        setDoctors([
          { id: '1', name: 'Dr. John Doe', specialty: 'Cardiologist' },
          { id: '2', name: 'Dr. Jane Smith', specialty: 'Dermatologist' },
          { id: '3', name: 'Dr. Bob Johnson', specialty: 'Pediatrician' },
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
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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
      const doctor = doctors.find((d) => d.id === data.doctorId);
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
        urgency: data.urgency,
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
    <div className="max-w-2xl mx-auto p-8 bg-white border border-border rounded-3xl shadow-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-2">
        <div>
          <h2 className="text-3xl text-foreground font-extrabold mb-1 flex items-center gap-2">
            <Send className="text-primary" size={28} />
            Create Referral
          </h2>
          {patientName && (
            <div className="flex items-center gap-2 text-muted-foreground text-base">
              <UserRound className="w-5 h-5" />
              <span>
                for <span className="font-semibold text-foreground">{patientName}</span>
              </span>
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          className="self-end mt-2 sm:mt-0"
          onClick={onClose}
        >
          Close
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-800 border border-green-200 rounded-xl p-3 mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {previousReferrals && previousReferrals.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg text-foreground font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Previous Referrals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previousReferrals.map((referral, index) => (
              <Card
                key={index}
                className="border border-border p-5 rounded-xl bg-gray-50 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <UserRound className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground text-base">
                      {referral.doctorName}
                    </span>
                  </div>
                  <Badge className={getStatusColor(referral.status) + " px-2 py-1 rounded-full text-xs"}>
                    {referral.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    <span>
                      <strong>Reason:</strong> {referral.reason}
                    </span>
                  </div>
                  {referral.notes && (
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>
                        <strong>Notes:</strong> {referral.notes}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      <strong>Urgency:</strong> {referral.urgency}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(referral.status)}
                    <span>Status: {referral.status}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white rounded-xl"
        autoComplete="off"
      >
        <div className="grid gap-2">
          <Label htmlFor="doctorId" className="font-semibold">
            Referral To Doctor
          </Label>
          <Controller
            name="doctorId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={cn(
                    'w-full rounded-lg border px-3 py-2 text-base',
                    errors.doctorId && 'border-danger'
                  )}
                >
                  <SelectValue placeholder="Select a doctor..." />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="" disabled>
                      Loading doctors...
                    </SelectItem>
                  ) : doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{doctor.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {doctor.specialty}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No doctors available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.doctorId && (
            <p className="text-xs text-danger mt-1">{errors.doctorId.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reason" className="font-semibold">
            Reason for Referral
          </Label>
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <Textarea
                id="reason"
                {...field}
                className={cn(
                  'rounded-lg border px-3 py-2 text-base resize-none',
                  errors.reason && 'border-danger'
                )}
                rows={4}
                placeholder="Explain the reason for referral..."
              />
            )}
          />
          {errors.reason && (
            <p className="text-xs text-danger mt-1">{errors.reason.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes" className="font-semibold">
            Additional Notes (Optional)
          </Label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Textarea
                id="notes"
                {...field}
                className="rounded-lg border px-3 py-2 text-base resize-none"
                rows={3}
                placeholder="Any additional notes for the doctor..."
              />
            )}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="urgency" className="font-semibold">
            Urgency
          </Label>
          <Controller
            name="urgency"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full rounded-lg border px-3 py-2 text-base">
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

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            className="rounded-lg px-6 py-2"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            className="rounded-lg px-6 py-2 flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Referral
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}