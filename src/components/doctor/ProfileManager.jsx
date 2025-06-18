'use client';
import { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    Award,
    GraduationCap,
    Edit3,
    Plus,
    X,
    Trash2,
    Info
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doctors as mockDoctors } from '@/mockdata/doctors';
const personalInfoSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    specialty: z.string().min(2, 'Specialty is required'),
    licenseNumber: z.string().min(2, 'License number is required'),
    experience: z.string().min(1, 'Experience is required'),
    contact: z.object({
        email: z.string().email('Invalid email address'),
        phone: z.string().min(10, 'Phone number must be at least 10 characters')
    }),
    profileImage: z.string().optional()
});
const educationSchema = z.object({
    degree: z.string().min(2, 'Degree is required'),
    institution: z.string().min(2, 'Institution is required'),
    year: z.string().min(4, 'Year is required')
});
const achievementSchema = z.object({
    title: z.string().min(2, 'Title is required'),
    year: z.string().min(4, 'Year is required'),
    issuer: z.string().min(2, 'Issuer is required')
});
function PersonalInfoForm({ profile, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const { 
        control, 
        handleSubmit, 
        formState: { errors },
        reset,
        setValue
    } = useForm({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            name: profile?.name || '',
            specialty: profile?.specialty || '',
            licenseNumber: profile?.licenseNumber || '',
            experience: profile?.experienceYears || '',
            contact: {
                email: profile?.contact?.email || '',
                phone: profile?.contact?.phone || ''
            },
            profileImage: profile?.profileImage || ''
        }
    });
    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name,
                specialty: profile.specialty,
                licenseNumber: profile.licenseNumber,
                experience: profile.experienceYears,
                contact: {
                    email: profile.contact?.email,
                    phone: profile.contact?.phone
                },
                profileImage: profile.profileImage || ''
            });
            if (profile.profileImage) {
                setPreviewUrl(profile.profileImage);
            }
        }
    }, [profile, reset]);
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setError('');
        setSuccess('');
        try {
            await onSave(data);
            setSuccess('Personal information updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setError(err.message || 'Failed to update personal information');
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleCancel = () => {
        reset();
        setIsEditing(false);
        setPreviewUrl(profile?.profileImage || '');
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setValue('profileImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Personal Information
            </h2>
            {error && (
                <div className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-3 mb-4 text-sm text-green-800 rounded-lg bg-green-50">
                    {success}
                </div>
            )}
            {!isEditing ? (
                <div>
                    <div className="flex items-center mb-6">
                        <img 
                            src={profile?.profileImage || '/placeholder-avatar.jpg'} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full mr-4 object-cover"
                        />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                {profile?.name}
                            </h3>
                            <p className="text-gray-600">
                                {profile?.specialty}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="text-gray-900 font-medium">{profile?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Specialty</p>
                            <p className="text-gray-900 font-medium">{profile?.specialty}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-900 font-medium">{profile?.contact?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-900 font-medium">{profile?.contact?.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">License Number</p>
                            <p className="text-gray-900 font-medium">{profile?.licenseNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Experience (Years)</p>
                            <p className="text-gray-900 font-medium">{profile?.experienceYears}</p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button 
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <img 
                            src={previewUrl || profile?.profileImage || '/placeholder-avatar.jpg'} 
                            alt="Profile Preview" 
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <div>
                            <label htmlFor="profileImageInput" className="cursor-pointer inline-block bg-gray-100 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">
                                Upload Image
                            </label>
                            <input
                                id="profileImageInput"
                                type="file"
                                accept="image }}
                            onDelete={handleDeleteEducation}
                            onAdd={() => setOpenEducationDialog(true)}
                        />
                    )}
                    {tabValue === 2 && (
                        <AchievementsList 
                            achievements={doctorProfile.achievements}
                            onEdit={() => {  }}
                            onDelete={handleDeleteAchievement}
                            onAdd={() => setOpenAchievementDialog(true)}
                        />
                    )}
                </div>
            </div>
            <AddEducationDialog
                open={openEducationDialog}
                onClose={() => setOpenEducationDialog(false)}
                onAdd={handleAddEducation}
            />
            <AddAchievementDialog
                open={openAchievementDialog}
                onClose={() => setOpenAchievementDialog(false)}
                onAdd={handleAddAchievement}
            />
        </div>
    );
} 