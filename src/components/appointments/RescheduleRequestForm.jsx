import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Calendar, Clock, FileText, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RescheduleRequestForm = ({ appointment, onSubmit, onCancel, isLoading }) => {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    requestedDate: '',
    requestedTime: '',
    preferredTimes: [],
    reason: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePreferredTimeChange = (time, isChecked) => {
    setFormData(prev => ({
      ...prev,
      preferredTimes: isChecked 
        ? [...prev.preferredTimes, time]
        : prev.preferredTimes.filter(t => t !== time)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.requestedDate) {
      newErrors.requestedDate = 'Requested date is required';
    }
    
    if (!formData.requestedTime) {
      newErrors.requestedTime = 'Requested time is required';
    }
    
    if (!formData.reason) {
      newErrors.reason = 'Reason for reschedule is required';
    }

    // Validate date is in the future
    if (formData.requestedDate) {
      const requestedDate = new Date(formData.requestedDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (requestedDate < now) {
        newErrors.requestedDate = 'Requested date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Minimum 1 day from today
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // Maximum 3 months from today
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t('patient.appointments.requestReschedule', 'Request Appointment Reschedule')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Appointment Info */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-foreground">
                {t('patient.appointments.currentAppointment', 'Current Appointment')}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="font-medium">
                    {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'TBD'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <p className="font-medium">{appointment.time || 'TBD'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Doctor:</span>
                  <p className="font-medium">
                    {appointment.doctor?.user?.firstName} {appointment.doctor?.user?.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium capitalize">{appointment.type}</p>
                </div>
              </div>
            </div>

            {/* Requested Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requestedDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('patient.appointments.requestedDate', 'Requested Date')} *
                </Label>
                <Input
                  id="requestedDate"
                  type="date"
                  value={formData.requestedDate}
                  onChange={(e) => handleChange('requestedDate', e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className={errors.requestedDate ? 'border-destructive' : ''}
                />
                {errors.requestedDate && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.requestedDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestedTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t('patient.appointments.requestedTime', 'Requested Time')} *
                </Label>
                <Select
                  value={formData.requestedTime}
                  onValueChange={(value) => handleChange('requestedTime', value)}
                >
                  <SelectTrigger className={errors.requestedTime ? 'border-destructive' : ''}>
                    <SelectValue placeholder={t('patient.appointments.selectTime', 'Select time')} />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.requestedTime && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.requestedTime}
                  </p>
                )}
              </div>
            </div>

            {/* Preferred Times */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t('patient.appointments.preferredTimes', 'Preferred Alternative Times')}
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <label key={time} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferredTimes.includes(time)}
                      onChange={(e) => handlePreferredTimeChange(time, e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{time}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('patient.appointments.preferredTimesHelp', 'Select alternative times if your preferred time is not available')}
              </p>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('patient.appointments.rescheduleReason', 'Reason for Reschedule')} *
              </Label>
              <Textarea
                id="reason"
                placeholder={t('patient.appointments.rescheduleReasonPlaceholder', 'Please explain why you need to reschedule this appointment...')}
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                rows={3}
                className={errors.reason ? 'border-destructive' : ''}
              />
              {errors.reason && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.reason}
                </p>
              )}
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">
                {t('patient.appointments.additionalNotes', 'Additional Notes (Optional)')}
              </Label>
              <Textarea
                id="notes"
                placeholder={t('patient.appointments.additionalNotesPlaceholder', 'Any additional information for the doctor...')}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading 
                  ? t('patient.appointments.submittingRequest', 'Submitting Request...')
                  : t('patient.appointments.submitRequest', 'Submit Request')
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RescheduleRequestForm; 