'use client';
import { useState } from 'react';
import {
  X, Plus, Trash2, Edit2, Info
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
const commonMedications = [
  { name: 'Lisinopril 10mg', type: 'Tablet', dosage: '10mg', frequency: ['Once daily', 'Twice daily'] },
  { name: 'Metformin 500mg', type: 'Tablet', dosage: '500mg', frequency: ['Twice daily', 'Three times daily'] },
  { name: 'Atorvastatin 10mg', type: 'Tablet', dosage: '10mg', frequency: ['Once daily'] },
  { name: 'Levothyroxine 50mcg', type: 'Tablet', dosage: '50mcg', frequency: ['Once daily'] },
  { name: 'Amlodipine 5mg', type: 'Tablet', dosage: '5mg', frequency: ['Once daily'] },
  { name: 'Omeprazole 20mg', type: 'Capsule', dosage: '20mg', frequency: ['Once daily'] },
  { name: 'Simvastatin 20mg', type: 'Tablet', dosage: '20mg', frequency: ['Once daily'] },
  { name: 'Metoprolol 25mg', type: 'Tablet', dosage: '25mg', frequency: ['Twice daily'] },
  { name: 'Albuterol 90mcg', type: 'Inhaler', dosage: '90mcg', frequency: ['As needed'] },
  { name: 'Sertraline 50mg', type: 'Tablet', dosage: '50mg', frequency: ['Once daily'] }
];
const defaultFrequencyOptions = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'As needed',
  'Before meals',
  'After meals',
  'At bedtime'
];
const prescriptionSchema = z.object({
  medications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    type: z.string(),
    instructions: z.string().optional()
  })).min(1, 'At least one medication is required'),
  instructions: z.string().min(5, 'Instructions must be at least 5 characters'),
  duration: z.string().min(1, 'Duration is required'),
  notes: z.string().optional()
});
export default function PrescriptionForm({ patientId, patientName, onClose, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [medications, setMedications] = useState([]);
  const [newMedication, setNewMedication] = useState('');
  const [medicationError, setMedicationError] = useState('');
  const [newFrequency, setNewFrequency] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editInstructions, setEditInstructions] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medications: [],
      instructions: '',
      duration: '',
      notes: ''
    }
  });
  const handleMedicationChange = (value) => {
    setNewMedication(value || '');
    const medObj = commonMedications.find(m => m.name === value);
    if (medObj) {
      setNewDosage(medObj.dosage);
      setNewFrequency(medObj.frequency[0] || '');
    } else {
      setNewDosage('');
      setNewFrequency('');
    }
  };
  const handleAddMedication = () => {
    if (!newMedication || newMedication.trim() === '') {
      setMedicationError('Please select a medication');
      return;
    }
    const medObj = commonMedications.find(m => m.name === newMedication);
    if (!medObj) {
      setMedicationError('Please select a valid medication');
      return;
    }
    if (!newFrequency) {
      setMedicationError('Please select a frequency');
      return;
    }
    const updatedMedications = [
      ...medications,
      { ...medObj, frequency: newFrequency, dosage: newDosage || medObj.dosage, instructions: '' }
    ];
    setMedications(updatedMedications);
    setValue('medications', updatedMedications);
    setNewMedication('');
    setNewFrequency('');
    setNewDosage('');
    setMedicationError('');
  };
  const handleRemoveMedication = (index) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedications(updatedMedications);
    setValue('medications', updatedMedications);
  };
  const handleEditMedication = (index) => {
    setEditIndex(index);
    setEditInstructions(medications[index].instructions || '');
    setEditDialogOpen(true);
  };
  const handleEditDialogSave = () => {
    const updatedMedications = [...medications];
    updatedMedications[editIndex].instructions = editInstructions;
    setMedications(updatedMedications);
    setValue('medications', updatedMedications);
    setEditDialogOpen(false);
  };
  const handleReset = () => {
    reset();
    setMedications([]);
    setNewMedication('');
    setNewFrequency('');
    setNewDosage('');
    setError('');
    setSuccess('');
  };
  const handleSaveDraft = () => {
    setSuccess('Draft saved (not submitted)');
    setTimeout(() => setSuccess(''), 1500);
  };
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');
      if (data.medications.length === 0) {
        setError('At least one medication is required');
        return;
      }
      setSuccess('Prescription created successfully');
      reset();
      setMedications([]);
      if (onSuccess) onSuccess(data);
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    } catch (err) {
      setError('An error occurred while creating the prescription');
    } finally {
      setIsSubmitting(false);
    }
  };
  const SectionHeader = ({ icon, children }) => (
    <div className="flex items-center gap-2 mb-2 mt-4">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800">{children}</h3>
    </div>
  );
  return (
    <div className="max-w-xl mx-auto p-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-0">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                New Prescription
              </h2>
              {patientName && (
                <p className="text-sm text-gray-600">
                  for {patientName}
                </p>
              )}
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close prescription form">
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          {error && (
            <div className="p-3 mb-4 text-sm text-red-800 rounded-2xl bg-red-50">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 mb-4 text-sm text-green-800 rounded-2xl bg-green-50">
              {success}
            </div>
          )}
          <SectionHeader icon={<Info size={18} className="text-blue-600" />}>
            Medications
          </SectionHeader>
          <div className="border border-gray-200 rounded-2xl overflow-hidden mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Remove</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 italic">
                      No medications added yet.
                    </td>
                  </tr>
                ) : (
                  medications.map((med, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{med.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.dosage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.frequency}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="icon" onClick={() => handleEditMedication(index)} aria-label="Edit medication">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveMedication(index)} aria-label="Remove medication">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="newMedication" className="block text-sm font-medium text-gray-700">Medication</label>
              <select
                id="newMedication"
                value={newMedication}
                onChange={(e) => handleMedicationChange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-2xl"
              >
                <option key="" value="">Select medication</option>
                {commonMedications.map((med) => (
                  <option key={med.name} value={med.name}>{med.name}</option>
                ))}
              </select>
              {medicationError && <p className="mt-1 text-sm text-red-600">{medicationError}</p>}
            </div>
            <div>
              <label htmlFor="newDosage" className="block text-sm font-medium text-gray-700">Dosage</label>
              <input
                type="text"
                id="newDosage"
                value={newDosage}
                onChange={(e) => setNewDosage(e.target.value)}
                placeholder="Dosage"
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-2xl"
              />
            </div>
            <div>
              <label htmlFor="newFrequency" className="block text-sm font-medium text-gray-700">Frequency</label>
              <select
                id="newFrequency"
                value={newFrequency}
                onChange={(e) => setNewFrequency(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-2xl"
              >
                <option key="" value="">Select frequency</option>
                {defaultFrequencyOptions.map((freq) => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="default"
                onClick={handleAddMedication}
                className="w-full inline-flex items-center justify-center px-4 py-2"
              >
                <Plus className="h-5 w-5 mr-2" />Add Medication
              </Button>
            </div>
          </div>
          <div className="border-t border-gray-200 my-6" />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <SectionHeader icon={<Info size={18} className="text-blue-600" />}>
              Prescription Details
            </SectionHeader>
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Overall Instructions</label>
              <Controller
                name="instructions"
                control={control}
                render={({ field }) => (
                  <textarea
                    id="instructions"
                    rows="4"
                    {...field}
                    disabled={isSubmitting}
                    placeholder="e.g., Take with food, complete the full course..."
                    className={`mt-1 block w-full px-3 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.instructions ? 'border-red-500' : 'border-gray-300'}`}
                  ></textarea>
                )}
              />
              {errors.instructions && (
                <p className="mt-1 text-sm text-red-600">{errors.instructions.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <input
                    type="text"
                    id="duration"
                    {...field}
                    disabled={isSubmitting}
                    placeholder="e.g., 7 days, 2 weeks, indefinitely"
                    className={`mt-1 block w-full px-3 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
                  />
                )}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <textarea
                    id="notes"
                    rows="3"
                    {...field}
                    disabled={isSubmitting}
                    placeholder="Any additional notes for the pharmacist or patient"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                )}
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="px-4 py-2"
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="px-4 py-2"
                disabled={isSubmitting}
              >
                Save Draft
              </Button>
              <Button
                type="submit"
                variant="default"
                className="px-4 py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Prescription'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      {editDialogOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-6 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Medication Instructions</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="editInstructions" className="block text-sm font-medium text-gray-700">Instructions</label>
                <textarea
                  id="editInstructions"
                  rows="4"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={editInstructions}
                  onChange={(e) => setEditInstructions(e.target.value)}
                ></textarea>
              </div>
            </form>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                className="px-4 py-2"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                className="px-4 py-2"
                onClick={handleEditDialogSave}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}