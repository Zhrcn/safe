'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Activity,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const STATUS_OPTIONS = [
  { value: '', label: 'Select a status' },
  { value: 'Improving', label: 'Improving' },
  { value: 'Stable', label: 'Stable' },
  { value: 'Worsening', label: 'Worsening' },
  { value: 'Critical', label: 'Critical' },
  { value: 'In Remission', label: 'In Remission' },
  { value: 'Recovered', label: 'Recovered' },
];

const conditionSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  notes: z.string().min(5, 'Notes must be at least 5 characters'),
});

const STATUS_ICON_MAP = {
  Improving: ArrowUp,
  Stable: Minus,
  Worsening: ArrowDown,
  Critical: AlertTriangle,
  'In Remission': Info,
  Recovered: CheckCircle2,
  Default: Clock,
};

const STATUS_COLOR_MAP = {
  Improving: 'text-green-600',
  Stable: 'text-blue-500',
  Worsening: 'text-yellow-600',
  Critical: 'text-red-600',
  'In Remission': 'text-purple-600',
  Recovered: 'text-emerald-600',
  Default: 'text-gray-400',
};

const STATUS_BADGE_BG = {
  Improving: 'bg-green-50 border-green-200',
  Stable: 'bg-blue-50 border-blue-200',
  Worsening: 'bg-yellow-50 border-yellow-200',
  Critical: 'bg-red-50 border-red-200',
  'In Remission': 'bg-purple-50 border-purple-200',
  Recovered: 'bg-emerald-50 border-emerald-200',
  Default: 'bg-gray-50 border-gray-200',
};

function StatusIcon({ status, className = '' }) {
  const Icon =
    STATUS_ICON_MAP[status] || STATUS_ICON_MAP.Default;
  const color =
    STATUS_COLOR_MAP[status] || STATUS_COLOR_MAP.Default;
  return <Icon size={18} strokeWidth={2} className={`${color} ${className}`} />;
}

function StatusBadge({ status }) {
  if (!status) return null;
  const bg =
    STATUS_BADGE_BG[status] || STATUS_BADGE_BG.Default;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium shadow-sm ${bg}`}
    >
      <StatusIcon status={status} />
      {status}
    </span>
  );
}

function PreviousUpdatesList({ updates }) {
  if (!updates?.length)
    return (
      <div className="mb-6 flex items-center gap-2 text-muted-foreground text-sm bg-muted/40 rounded-xl px-4 py-3">
        <Info className="h-4 w-4" />
        No previous updates yet.
      </div>
    );
  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-card-foreground mb-3 flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        Previous Updates
      </h3>
      <div className="max-h-56 overflow-y-auto border border-border rounded-2xl bg-muted/30 shadow-inner">
        <div className="divide-y divide-border">
          {updates.map((update, idx) => (
            <div
              key={idx}
              className="p-4 flex items-start gap-4 hover:bg-muted/60 transition group"
            >
              <div className="flex-shrink-0 mt-1">
                <StatusBadge status={update.status} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    {update.date}
                  </span>
                </div>
                <p className="text-sm text-card-foreground mt-1 whitespace-pre-line group-hover:text-primary transition">
                  {update.notes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PatientConditionForm({
  patientId,
  patientName,
  previousUpdates = [],
  onClose,
  onSuccess,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(conditionSchema),
    defaultValues: {
      status: '',
      notes: '',
    },
  });

  const statusOptions = useMemo(() => STATUS_OPTIONS, []);

  const handleFormSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true);
      setError('');
      try {
        const result = { success: true, update: { ...data, date: new Date().toLocaleString() } };
        if (result.success) {
          setSuccess('Condition update added successfully');
          reset();
          onSuccess?.(result.update);
          setTimeout(() => {
            onClose?.();
          }, 1200);
        } else {
          setError(result.message || 'Failed to add condition update');
        }
      } catch (err) {
        setError('An error occurred while adding the condition update');
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onClose, onSuccess, reset]
  );

  return (
    <div className="p-8 bg-card rounded-2xl shadow-xl border border-border max-w-md w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-card-foreground">
          Update Patient Condition
        </h2>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:!bg-[rgb(var(--tw-color-danger,239_68_68))] hover:!text-white transition-colors"
          >
            <div className="text-gray-400 hover:text-white w-full h-full flex items-center justify-center">
              <X size={20} />
            </div>
          </Button>
        )}
      </div>
      {error && (
        <div className="p-4 mb-4 text-red-600 border border-red-600 bg-error/10 rounded-2xl">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 mb-4 text-success bg-success/10 rounded-2xl">
          {success}
        </div>
      )}
      <PreviousUpdatesList updates={previousUpdates} />
      <div className="border-t border-border my-4" />
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  Notes
                </label>
                <textarea
                  {...field}
                  id="notes"
                  rows={4}
                  disabled={isSubmitting}
                  placeholder="Enter detailed notes about the patient's current condition"
                  className={`w-full px-3 py-2 border border-border rounded-2xl bg-card text-card-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.notes ? "border-error" : "border-border"
                  }`}
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-error">
                    {errors.notes.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
        <div>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  Status
                </label>
                <select
                  {...field}
                  id="status"
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border border-border rounded-2xl bg-card text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.status ? "border-error" : "border-border"
                  }`}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-error">
                    {errors.status.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          {onClose && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className=" border-red-500 hover:bg-red-500 transition-colors"
            >
              <div className="text-gray-400 hover:text-white w-full h-full flex items-center justify-center">
                Cancel{" "}
              </div>{" "}
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            style={{
              backgroundColor: "var(--color-primary, #2563eb)",
              color: "var(--color-on-primary, #fff)",
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}