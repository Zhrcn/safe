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
import { addAllergy } from '@/store/slices/patient/profileSlice';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { useNotification } from '@/components/ui/Notification';

const AddAllergyDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    severity: '',
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
      newErrors.name = 'Allergy name is required';
    }
    if (!formData.severity) {
      newErrors.severity = 'Severity level is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await dispatch(addAllergy(formData)).unwrap();
        onClose();
        setFormData({
          name: '',
          severity: '',
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
          <DialogTitle>Add New Allergy</DialogTitle>
          <DialogDescription>
            Fill in the details for the new allergy.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Allergy Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={cn({ 'border-danger': errors.name })}
              required
            />
            {errors.name && (
              <p className="text-sm text-danger">{errors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="severity">Severity</Label>
            <Select
              name="severity"
              value={formData.severity}
              onValueChange={handleSelectChange('severity')}
            >
              <SelectTrigger className={cn({ 'border-danger': errors.severity })}>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
            {errors.severity && (
              <p className="text-sm text-danger">{errors.severity}</p>
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
            <p className="text-sm text-danger text-center">{errors.submit}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Allergy</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddAllergyDialog; 