'use client';
import { useState } from 'react';
import {
    X, Search
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addPatientById } from '@/store/slices/doctor/doctorPatientsSlice';
const patientSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    age: z.number().int().positive().min(1).max(120),
    gender: z.enum(['Male', 'Female', 'Other']),
    condition: z.string().min(3, 'Condition description required'),
    contact: z.object({
        email: z.string().email('Invalid email address'),
        phone: z.string().min(10, 'Phone number must be at least 10 characters')
    })
});
const patientIdSchema = z.object({
    patientId: z.string().min(1, 'Patient ID is required')
});
export default function AddPatientForm({ onClose, onSuccess }) {
    const [activeTab, setActiveTab] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [patientId, setPatientId] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.doctorPatients);
    const { 
        control, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            name: '',
            age: '',
            gender: '',
            condition: '',
            contact: {
                email: '',
                phone: ''
            }
        }
    });
    const handleTabChange = (newValue) => {
        setActiveTab(newValue);
        setError('');
        setSuccess('');
    };
    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError('');
            data.age = Number(data.age);
            const result = { success: true, patient: { id: Date.now(), ...data, user: { firstName: data.name.split(' ')[0], lastName: data.name.split(' ')[1] || '', isActive: true }, medicalId: `MED${Date.now()}` } };
            if (result.success) {
                setSuccess('Patient added successfully');
                reset();
                if (onSuccess) {
                    onSuccess(result.patient);
                }
                setTimeout(() => {
                    if (onClose) onClose();
                }, 2000);
            } else {
                setError(result.message || 'Failed to add patient');
            }
        } catch (err) {
            setError('An error occurred while adding the patient');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleSearchById = async () => {
        if (!patientId.trim()) {
            setError('Please enter a patient ID');
            return;
        }
        try {
            setIsSearching(true);
            setError('');
            setSuccess('');
            const resultAction = await dispatch(addPatientById(patientId));
            if (addPatientById.fulfilled.match(resultAction)) {
                setSuccess('Patient added successfully');
                if (onSuccess) onSuccess();
                setTimeout(() => {
                    if (onClose) onClose();
                }, 1500);
            } else {
                setError(resultAction.payload || 'Patient not found or could not be added');
            }
        } catch (err) {
            setError('An error occurred while adding the patient');
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Add Patient
                </h2>
                {onClose && (
                    <Button onClick={onClose} variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>
            <div className="border-b border-gray-200 mb-4">
                <nav className="flex space-x-4" aria-label="Tabs">
                    <Button
                        onClick={() => handleTabChange(0)}
                        className={`py-2 px-3 text-sm font-medium rounded-t-md ${
                            activeTab === 0
                                ? 'border-b-2 border-blue-600 text-blue-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        New Patient
                    </Button>
                    <Button
                        onClick={() => handleTabChange(1)}
                        className={`py-2 px-3 text-sm font-medium rounded-t-md ${
                            activeTab === 1
                                ? 'border-b-2 border-blue-600 text-blue-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Add by ID
                    </Button>
                </nav>
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
            {activeTab === 0 ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    id="name"
                                    {...field}
                                    disabled={isSubmitting}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            )}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                            <Controller
                                name="age"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="number"
                                        id="age"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                                        disabled={isSubmitting}
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                )}
                            />
                            {errors.age && (
                                <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        id="gender"
                                        {...field}
                                        disabled={isSubmitting}
                                        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${errors.gender ? 'border-red-500' : ''}`}
                                    >
                                        <option key="" value="">Select Gender</option>
                                        <option key="Male" value="Male">Male</option>
                                        <option key="Female" value="Female">Female</option>
                                        <option key="Other" value="Other">Other</option>
                                    </select>
                                )}
                            />
                            {errors.gender && (
                                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <Controller
                            name="contact.email"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="email"
                                    id="email"
                                    {...field}
                                    disabled={isSubmitting}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.contact?.email ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            )}
                        />
                        {errors.contact?.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.contact.email.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                        <Controller
                            name="contact.phone"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="tel"
                                    id="phone"
                                    {...field}
                                    disabled={isSubmitting}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.contact?.phone ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            )}
                        />
                        {errors.contact?.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.contact.phone.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
                        <Controller
                            name="condition"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    id="condition"
                                    rows="3"
                                    {...field}
                                    disabled={isSubmitting}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.condition ? 'border-red-500' : 'border-gray-300'}`}
                                ></textarea>
                            )}
                        />
                        {errors.condition && (
                            <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button
                            onClick={() => reset()}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Patient'}
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient ID</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                                type="text"
                                id="patientId"
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                                disabled={isSearching}
                                placeholder="Enter patient ID"
                                className="flex-1 block w-full rounded-none rounded-l-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Button
                                onClick={handleSearchById}
                                disabled={isSearching}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-r-md bg-gray-50 text-gray-700 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Search className="h-5 w-5 mr-2" />
                                {isSearching ? 'Searching...' : 'Search'}
                            </Button>
                        </div>
                        {error && !String(patientId || '').trim() && (
                            <p className="mt-1 text-sm text-red-600">{error}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 