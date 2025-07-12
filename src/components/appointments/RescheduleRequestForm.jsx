import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Calendar, Clock, FileText, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RescheduleRequestForm = ({ appointment, onSubmit, onCancel, isLoading }) => {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    reason: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.reason) {
      newErrors.reason = 'Reason for reschedule is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        requestedDate: '',
        requestedTime: '',
        preferredTimes: [],
        reason: formData.reason,
        notes: formData.notes
      };
      onSubmit(submitData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t(
              "patient.appointments.requestReschedule",
              "Request Appointment Reschedule"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Appointment Info */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-foreground">
                {t(
                  "patient.appointments.currentAppointment",
                  "Current Appointment"
                )}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="font-medium">
                    {appointment.date
                      ? new Date(appointment.date).toLocaleDateString()
                      : "TBD"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <p className="font-medium">{appointment.time || "TBD"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Doctor:</span>
                  <p className="font-medium">
                    {appointment.doctor?.user?.firstName}{" "}
                    {appointment.doctor?.user?.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium capitalize">{appointment.type}</p>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t(
                  "patient.appointments.rescheduleReason",
                  "Reason for Reschedule"
                )}{" "}
                *
              </Label>
              <Textarea
                id="reason"
                placeholder={t(
                  "patient.appointments.rescheduleReasonPlaceholder",
                  "Please explain why you need to reschedule this appointment..."
                )}
                value={formData.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                rows={3}
                className={errors.reason ? "border-danger" : ""}
              />
              {errors.reason && (
                <p className="text-sm text-danger flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.reason}
                </p>
              )}
            </div>

            {/* Preferred Times and Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t(
                  "patient.appointments.preferredTimes",
                  "Preferred Times & Additional Notes"
                )}
              </Label>
              <Textarea
                id="notes"
                placeholder={t(
                  "patient.appointments.preferredTimesPlaceholder",
                  'Please specify your preferred dates and times for rescheduling. For example: "I prefer mornings between 9 AM - 12 PM on weekdays" or "Any afternoon slot next week would work for me"...'
                )}
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {t(
                  "patient.appointments.preferredTimesHelp",
                  "Be as specific as possible about your preferred dates and times to help the doctor accommodate your request."
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="warning"
                className=""
                onClick={onCancel}
                disabled={isLoading}
              >
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading
                  ? t(
                      "patient.appointments.submittingRequest",
                      "Submitting Request..."
                    )
                  : t("patient.appointments.submitRequest", "Submit Request")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RescheduleRequestForm; 