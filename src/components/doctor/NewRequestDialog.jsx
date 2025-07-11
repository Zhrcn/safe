import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import { useCreateRequestMutation } from '@/store/services/doctor/medicineApi';

const NewRequestDialog = ({ open, onClose, pharmacies }) => {
  const [pharmacyId, setPharmacyId] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [error, setError] = useState('');
  const [createRequest, { isLoading }] = useCreateRequestMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!pharmacyId || !medicineName.trim()) {
      setError('Please select a pharmacy and enter a medicine name.');
      return;
    }
    try {
      await createRequest({ pharmacyId, medicineName }).unwrap();
      setPharmacyId('');
      setMedicineName('');
      onClose();
    } catch (err) {
      setError('Failed to create request.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Medicine Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Pharmacy</label>
            <Select value={pharmacyId} onValueChange={setPharmacyId} disabled={isLoading}>
              <SelectTrigger className="w-full">
                <span>{/* Place the trigger content here, or leave empty if using <SelectValue /> elsewhere */}</span>
              </SelectTrigger>
              <SelectContent>
                {pharmacies.map((pharmacy) => (
                  <SelectItem key={pharmacy.id} value={pharmacy.id}>
                    {pharmacy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Medicine Name</label>
            <Input
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="Enter medicine name"
              required
              disabled={isLoading}
            />
          </div>
          {error && <div className="text-sm text-error">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRequestDialog; 