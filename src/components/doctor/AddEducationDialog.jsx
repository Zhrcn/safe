import React, { useState } from 'react';
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

const AddEducationDialog = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    year: '',
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.degree.trim()) {
      newErrors.degree = 'Degree is required';
    }
    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required';
    }
    if (!formData.year.trim() || !/^\d{4}$/.test(formData.year)) {
      newErrors.year = 'Valid year is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (onAdd) onAdd(formData);
      setFormData({ degree: '', institution: '', year: '' });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Education</DialogTitle>
          <DialogDescription>
            Fill in the details for the new education entry.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="degree">Degree</Label>
            <Input
              id="degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              required
              className={errors.degree ? 'border-destructive' : ''}
            />
            {errors.degree && (
              <p className="text-sm text-destructive">{errors.degree}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              className={errors.institution ? 'border-destructive' : ''}
            />
            {errors.institution && (
              <p className="text-sm text-destructive">{errors.institution}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              placeholder="e.g. 2020"
              className={errors.year ? 'border-destructive' : ''}
              maxLength={4}
            />
            {errors.year && (
              <p className="text-sm text-destructive">{errors.year}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Education</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEducationDialog; 