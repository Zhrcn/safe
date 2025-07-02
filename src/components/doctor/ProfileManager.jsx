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
import { Button } from '@/components/ui/Button';
import AddEducationDialog from './AddEducationDialog';
import AddAchievementDialog from './AddAchievementDialog';
import ProfileInfoCard from './ProfileInfoCard';
import EducationList from './EducationList';
import AchievementList from './AchievementList';
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
    const [openEducationDialog, setOpenEducationDialog] = useState(false);
    const [openAchievementDialog, setOpenAchievementDialog] = useState(false);
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
    const handleAddEducation = (education) => {
        console.log('New education added:', education);
    };
    const handleAddAchievement = (achievement) => {
        console.log('New achievement added:', achievement);
    };
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <ProfileInfoCard
                profile={profile}
                onEdit={() => setIsEditing(true)}
                onAddEducation={() => setOpenEducationDialog(true)}
                onAddAchievement={() => setOpenAchievementDialog(true)}
            />
            <EducationList education={profile?.education} />
            <AchievementList achievements={profile?.achievements} />
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
export default PersonalInfoForm; 