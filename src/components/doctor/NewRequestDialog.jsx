import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import { useCreateRequestMutation } from '@/store/services/doctor/medicineApi';

const NewRequestDialog = ({ open, onClose, pharmacies, medicines = [], onCreate, isCreating, requirePharmacy }) => {
  const [pharmacyId, setPharmacyId] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [error, setError] = useState('');
  const [createRequest, { isLoading }] = useCreateRequestMutation();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Filtered suggestions for autocomplete
  const filteredSuggestions =
    medicineName && medicines.length > 0
      ? medicines.filter((m) =>
          m.name.toLowerCase().includes(medicineName.toLowerCase())
        ).slice(0, 8)
      : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if ((requirePharmacy && !pharmacyId) || !medicineName.trim()) {
      setError('Please select a pharmacy and enter a medicine name.');
      return;
    }
    try {
      if (onCreate) {
        await onCreate({ pharmacyId, medicineName });
      }
      setPharmacyId('');
      setMedicineName('');
      onClose();
    } catch (err) {
      setError('Failed to create request.');
    }
  };

  const handleMedicineInput = (e) => {
    setMedicineName(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (name) => {
    setMedicineName(name);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const selectedPharmacy = pharmacies.find((p) => p.id === pharmacyId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Medicine Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Pharmacy</label>
            <Select value={pharmacyId} onValueChange={setPharmacyId} disabled={isCreating} required={requirePharmacy}>
              <SelectTrigger className="w-full">
                <span>{selectedPharmacy ? selectedPharmacy.name : 'Select a pharmacy'}</span>
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
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Medicine Name</label>
            <Input
              ref={inputRef}
              value={medicineName}
              onChange={handleMedicineInput}
              placeholder="Enter medicine name"
              required
              disabled={isCreating}
              autoComplete="off"
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-border rounded shadow mt-1 max-h-48 overflow-auto">
                {filteredSuggestions.map((m) => (
                  <div
                    key={m._id || m.id || m.name}
                    className="px-3 py-2 cursor-pointer hover:bg-muted"
                    onMouseDown={() => handleSuggestionClick(m.name)}
                  >
                    {m.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {error && <div className="text-sm text-error">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isCreating}>
              {isCreating ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRequestDialog; 