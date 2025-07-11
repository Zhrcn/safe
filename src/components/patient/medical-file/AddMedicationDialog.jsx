import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { addMedication } from '@/store/services/patient/medicationApi';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { useNotification } from '@/components/ui/Notification';

const AddMedicationDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    prescribedBy: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  const handleSelectChange = (name) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Medication name is required';
    }
    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    }
    if (!formData.frequency) {
      newErrors.frequency = 'Frequency is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.prescribedBy.trim()) {
      newErrors.prescribedBy = 'Prescribing doctor is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await dispatch(addMedication(formData)).unwrap();
        onClose();
        setFormData({
          name: '',
          dosage: '',
          frequency: '',
          startDate: '',
          endDate: '',
          prescribedBy: '',
          notes: '',
        });
      } catch (error) {
        setErrors({
          submit: error.message || 'An unexpected error occurred',
        });
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
          <DialogDescription>
            Fill in the details for the new medication.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Medication Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={cn({ 'border-destructive': errors.name })}
              required
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              className={cn({ 'border-destructive': errors.dosage })}
              required
            />
            {errors.dosage && (
              <p className="text-sm text-destructive">{errors.dosage}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              name="frequency"
              value={formData.frequency}
              onValueChange={handleSelectChange('frequency')}
            >
              <SelectTrigger className={cn({ 'border-destructive': errors.frequency })}>
                <span>{/* Place the trigger content here, or leave empty if using <SelectValue /> elsewhere */}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once_daily">Once Daily</SelectItem>
                <SelectItem value="twice_daily">Twice Daily</SelectItem>
                <SelectItem value="three_times_daily">Three Times Daily</SelectItem>
                <SelectItem value="four_times_daily">Four Times Daily</SelectItem>
                <SelectItem value="as_needed">As Needed</SelectItem>
              </SelectContent>
            </Select>
            {errors.frequency && (
              <p className="text-sm text-destructive">{errors.frequency}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className={cn({ 'border-destructive': errors.startDate })}
              required
            />
            {errors.startDate && (
              <p className="text-sm text-destructive">{errors.startDate}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prescribedBy">Prescribed By</Label>
            <Input
              id="prescribedBy"
              name="prescribedBy"
              value={formData.prescribedBy}
              onChange={handleChange}
              className={cn({ 'border-destructive': errors.prescribedBy })}
              required
            />
            {errors.prescribedBy && (
              <p className="text-sm text-destructive">{errors.prescribedBy}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
            />
          </div>
          {errors.submit && (
            <p className="text-sm text-destructive text-center">{errors.submit}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Medication</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddMedicationDialog; 