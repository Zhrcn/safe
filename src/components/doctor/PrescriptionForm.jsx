'use client';
import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Info } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { createPrescription } from '@/store/services/doctor/prescriptionsApi';
import { useSelector, useDispatch } from 'react-redux';
import { selectDoctorProfile, fetchDoctorProfile } from '@/store/slices/doctor/doctorProfileSlice';

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
  'Once daily', 'Twice daily', 'Three times daily', 'As needed', 'Before meals', 'After meals', 'At bedtime'
];
const prescriptionSchema = z.object({
  medications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    type: z.string(),
    instructions: z.string().optional(),
    refillLimit: z.string().min(1, 'Refill limit required'),
    duration: z.string().min(1, 'Duration is required'),
  })).min(1, 'At least one medication is required'),
  diagnosis: z.string().min(2, 'Diagnosis is required'),
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
  const [customMedication, setCustomMedication] = useState('');
  const [medicationError, setMedicationError] = useState('');
  const [newFrequency, setNewFrequency] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newRefillLimit, setNewRefillLimit] = useState('1');
  const [editIndex, setEditIndex] = useState(null);
  const [editInstructions, setEditInstructions] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const doctorProfile = useSelector(selectDoctorProfile);
  const doctorId = doctorProfile?.doctorId || doctorProfile?._id || doctorProfile?.id;
  const dispatch = useDispatch();

  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: { medications: [], diagnosis: '', instructions: '', duration: '', notes: '' }
  });

  useEffect(() => {
    if (!doctorProfile || !doctorId) dispatch(fetchDoctorProfile());
  }, [doctorProfile, doctorId, dispatch]);
  useEffect(() => {
    if (!patientId) setError('Patient ID is missing.');
    if (!doctorId) setError('Doctor ID is missing.');
  }, [patientId, doctorId]);

  if (!doctorProfile || !doctorId)
    return <div className="p-4 text-center text-sm text-muted-foreground">Loading doctor profile...</div>;
  if (!patientId)
    return <div className="p-4 text-center text-sm text-red-600">Error: Patient ID is missing.<br /><button onClick={onClose} className="mt-2 underline text-blue-600">Close</button></div>;

  // Medication handlers
  const handleMedicationChange = (value) => {
    setNewMedication(value || ''); setCustomMedication('');
    const medObj = commonMedications.find(m => m.name === value);
    setNewDosage(medObj?.dosage || '');
    setNewFrequency(medObj?.frequency[0] || '');
    setNewDuration('');
  };
  const handleAddMedication = () => {
    let medObj = commonMedications.find(m => m.name === newMedication);
    let medName = newMedication, medType = medObj ? medObj.type : '';
    if (!newMedication && !customMedication) return setMedicationError('Select or enter a medication');
    if (!medObj && customMedication) { medName = customMedication; medType = ''; }
    if (!newFrequency) return setMedicationError('Select a frequency');
    if (!newDosage) return setMedicationError('Enter a dosage');
    if (!newRefillLimit || isNaN(Number(newRefillLimit)) || Number(newRefillLimit) < 1) return setMedicationError('Valid refill limit (>=1)');
    if (!newDuration) return setMedicationError('Enter a duration');
    const updated = [...medications, { name: medName, type: medType, frequency: newFrequency, dosage: newDosage, instructions: '', refillLimit: newRefillLimit, duration: newDuration }];
    setMedications(updated); setValue('medications', updated);
    setNewMedication(''); setCustomMedication(''); setNewFrequency(''); setNewDosage(''); setNewDuration(''); setNewRefillLimit('1'); setMedicationError('');
  };
  const handleRemoveMedication = (i) => {
    const updated = medications.filter((_, idx) => idx !== i);
    setMedications(updated); setValue('medications', updated);
  };
  const handleEditMedication = (i) => { setEditIndex(i); setEditInstructions(medications[i].instructions || ''); setEditDialogOpen(true); };
  const handleEditDialogSave = () => {
    const updated = [...medications];
    updated[editIndex].instructions = editInstructions;
    setMedications(updated); setValue('medications', updated); setEditDialogOpen(false);
  };
  const handleReset = () => { reset(); setMedications([]); setNewMedication(''); setCustomMedication(''); setNewFrequency(''); setNewDosage(''); setNewDuration(''); setError(''); setSuccess(''); };
  const handleSaveDraft = () => { setSuccess('Draft saved'); setTimeout(() => setSuccess(''), 1200); };

  // Submit
  const onSubmit = async (data) => {
    setIsSubmitting(true); setError('');
    if (!data.medications.length) return setError('Add at least one medication');
    if (!patientId || !doctorId) return setError('Missing patient or doctor ID.');
    if (!data.diagnosis) return setError('Diagnosis is required.');
    try {
      await createPrescription({
        patientId, doctorId,
        medications: data.medications.map(med => ({ ...med, refillLimit: Number(med.refillLimit), duration: med.duration || data.duration })),
        instructions: data.instructions, duration: data.duration, notes: data.notes, diagnosis: data.diagnosis,
      });
      setSuccess('Prescription created'); reset(); setMedications([]);
      if (onSuccess) onSuccess(data);
      setTimeout(() => { if (onClose) onClose(); }, 1200);
    } catch {
      setError('Error creating prescription');
    } finally { setIsSubmitting(false); }
  };

  // UI
  const SectionHeader = ({ icon, children }) => (
    <div className="flex items-center gap-2 mb-2 mt-4">{icon}<h3 className="text-lg font-semibold text-gray-800">{children}</h3></div>
  );

  return (
    <div className="max-w-xl mx-auto p-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-0">
        <div className="p-4 sm:p-5">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">New Prescription</h2>
              {patientName && <p className="text-xs text-gray-600">for {patientName}</p>}
            </div>
            {onClose && <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>}
          </div>
          {error && <div className="p-2 mb-3 text-xs text-red-800 rounded-2xl bg-red-50">{error}</div>}
          {success && <div className="p-2 mb-3 text-xs text-green-800 rounded-2xl bg-green-50">{success}</div>}
          <SectionHeader icon={<Info size={16} className="text-blue-600" />}>Medications</SectionHeader>
          <div className="mb-3">
            <label htmlFor="diagnosis" className="block text-xs font-medium text-gray-700">Diagnosis</label>
            <Controller
              name="diagnosis"
              control={control}
              render={({ field }) => (
                <input type="text" id="diagnosis" {...field} disabled={isSubmitting}
                  placeholder="e.g., Hypertension, Diabetes, etc."
                  className={`mt-1 block w-full px-2 py-1.5 border rounded-2xl shadow-sm text-xs ${errors.diagnosis ? 'border-red-500' : 'border-gray-300'}`} />
              )}
            />
            {errors.diagnosis && <p className="mt-1 text-xs text-red-600">{errors.diagnosis.message}</p>}
          </div>
          <div className="border border-gray-200 rounded-2xl overflow-hidden mb-3">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dosage</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Refill</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Edit</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Remove</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medications.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-2 text-center text-xs text-gray-500 italic">No medications added.</td>
                  </tr>
                ) : (
                  medications.map((med, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{med.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{med.type}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{med.dosage}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{med.frequency}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{med.refillLimit}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-xs">
                        <Button variant="ghost" size="icon" onClick={() => handleEditMedication(i)}><Edit2 className="h-4 w-4" /></Button>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-xs">
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveMedication(i)}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label htmlFor="newMedication" className="block text-xs font-medium text-gray-700">Medication</label>
              <div className="flex gap-2">
                <select id="newMedication" value={newMedication} onChange={e => handleMedicationChange(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-1.5 text-xs border-gray-300 rounded-2xl">
                  <option value="">Select medication</option>
                  {commonMedications.map(med => <option key={med.name} value={med.name}>{med.name}</option>)}
                </select>
              </div>
              <div className="mt-2">
                <input type="text" id="customMedication" value={customMedication}
                  onChange={e => { setCustomMedication(e.target.value); setNewMedication(''); }}
                  placeholder="Or enter medication name"
                  className="block w-full shadow-sm text-xs border-gray-300 rounded-2xl py-1.5" />
              </div>
              {medicationError && <p className="mt-1 text-xs text-red-600">{medicationError}</p>}
            </div>
            <div>
              <label htmlFor="newDosage" className="block text-xs font-medium text-gray-700">Dosage</label>
              <input type="text" id="newDosage" value={newDosage} onChange={e => setNewDosage(e.target.value)}
                placeholder="Dosage" className="mt-1 block w-full shadow-sm text-xs border-gray-300 rounded-2xl py-1.5" />
            </div>
            <div>
              <label htmlFor="newFrequency" className="block text-xs font-medium text-gray-700">Frequency</label>
              <select id="newFrequency" value={newFrequency} onChange={e => setNewFrequency(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-1.5 text-xs border-gray-300 rounded-2xl">
                <option value="">Select frequency</option>
                {defaultFrequencyOptions.map(freq => <option key={freq} value={freq}>{freq}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="newDuration" className="block text-xs font-medium text-gray-700">Duration</label>
              <input type="text" id="newDuration" value={newDuration} onChange={e => setNewDuration(e.target.value)}
                placeholder="e.g., 7 days" className="mt-1 block w-full shadow-sm text-xs border-gray-300 rounded-2xl py-1.5" />
            </div>
            <div>
              <label htmlFor="newRefillLimit" className="block text-xs font-medium text-gray-700">Refill Limit</label>
              <input type="number" id="newRefillLimit" min="1" value={newRefillLimit} onChange={e => setNewRefillLimit(e.target.value)}
                placeholder="Refill Limit" className="mt-1 block w-full shadow-sm text-xs border-gray-300 rounded-2xl py-1.5" />
            </div>
            <div className="flex items-end">
              <Button type="button" variant="default" onClick={handleAddMedication}
                className="w-full inline-flex items-center justify-center px-3 py-1.5 text-xs">
                <Plus className="h-5 w-5 mr-2" />Add Medication
              </Button>
            </div>
          </div>
          <div className="border-t border-gray-200 my-4" />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <SectionHeader icon={<Info size={16} className="text-blue-600" />}>Prescription Details</SectionHeader>
            <div>
              <label htmlFor="instructions" className="block text-xs font-medium text-gray-700">Overall Instructions</label>
              <Controller
                name="instructions"
                control={control}
                render={({ field }) => (
                  <textarea id="instructions" rows="2" {...field} disabled={isSubmitting}
                    placeholder="e.g., Take with food, complete the full course..."
                    className={`mt-1 block w-full px-2 py-1.5 border rounded-2xl shadow-sm text-xs ${errors.instructions ? 'border-red-500' : 'border-gray-300'}`} />
                )}
              />
              {errors.instructions && <p className="mt-1 text-xs text-red-600">{errors.instructions.message}</p>}
            </div>
            <div>
              <label htmlFor="duration" className="block text-xs font-medium text-gray-700">Duration</label>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <input type="text" id="duration" {...field} disabled={isSubmitting}
                    placeholder="e.g., 7 days, 2 weeks"
                    className={`mt-1 block w-full px-2 py-1.5 border rounded-2xl shadow-sm text-xs ${errors.duration ? 'border-red-500' : 'border-gray-300'}`} />
                )}
              />
              {errors.duration && <p className="mt-1 text-xs text-red-600">{errors.duration.message}</p>}
            </div>
            <div>
              <label htmlFor="notes" className="block text-xs font-medium text-gray-700">Notes (Optional)</label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <textarea id="notes" rows="2" {...field} disabled={isSubmitting}
                    placeholder="Any additional notes"
                    className="mt-1 block w-full px-2 py-1.5 border border-gray-300 rounded-2xl shadow-sm text-xs" />
                )}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button type="button" variant="outline" onClick={handleReset} className="px-3 py-1.5 text-xs" disabled={isSubmitting}>Reset</Button>
              <Button type="button" variant="outline" onClick={handleSaveDraft} className="px-3 py-1.5 text-xs" disabled={isSubmitting}>Save Draft</Button>
              <Button type="submit" variant="default" className="px-3 py-1.5 text-xs" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Prescription'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      {editDialogOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-4 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Edit Medication Instructions</h3>
            <form>
              <label htmlFor="editInstructions" className="block text-xs font-medium text-gray-700">Instructions</label>
              <textarea id="editInstructions" rows="2"
                className="mt-1 block w-full px-2 py-1.5 border border-gray-300 rounded-2xl shadow-sm text-xs"
                value={editInstructions}
                onChange={e => setEditInstructions(e.target.value)}
              />
            </form>
            <div className="mt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" className="px-3 py-1.5 text-xs" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button type="button" variant="default" className="px-3 py-1.5 text-xs" onClick={handleEditDialogSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}