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

const AddAchievementDialog = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
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
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.issuer.trim()) {
      newErrors.issuer = 'Issuer is required';
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
      const achievementText = `${formData.title} - ${formData.issuer} (${formData.year})`;
      if (onAdd) onAdd({ achievement: achievementText });
      setFormData({ title: '', issuer: '', year: '' });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Achievement</DialogTitle>
          <DialogDescription>
            Fill in the details for the new achievement.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={errors.title ? 'border-danger' : ''}
            />
            {errors.title && (
              <p className="text-sm text-danger">{errors.title}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="issuer">Issuer</Label>
            <Input
              id="issuer"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              required
              className={errors.issuer ? 'border-danger' : ''}
            />
            {errors.issuer && (
              <p className="text-sm text-danger">{errors.issuer}</p>
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
              className={errors.year ? 'border-danger' : ''}
              maxLength={4}
            />
            {errors.year && (
              <p className="text-sm text-danger">{errors.year}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default">Add Achievement</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAchievementDialog; 