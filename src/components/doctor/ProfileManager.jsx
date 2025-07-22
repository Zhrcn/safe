'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  User,
  Mail,
  Phone,
  Award,
  GraduationCap,
  Edit3,
  Plus,
  X,
  Camera,
  Save,
  Star,
  Shield,
  Clock,
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import AddEducationDialog from './AddEducationDialog';
import AddAchievementDialog from './AddAchievementDialog';
import EducationList from './EducationList';
import AchievementList from './AchievementList';
import ImageUploader from '@/components/ui/ImageUploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { useNotification } from '@/components/ui/Notification';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { useDoctorProfile } from '@/hooks/useDoctorProfile';
import { getToken } from '@/utils/tokenUtils';
import { updateUserProfileData } from '@/store/slices/user/userSlice';

const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  specialization: z.string().min(2, 'Specialization is required'),
  yearsOfExperience: z.string().min(1, 'Experience is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  profileImage: z.string().optional(),
});

function PersonalInfoForm() {
  const { showNotification } = useNotification();
  const {
    profile,
    loading,
    error,
    success,
    imageUploadLoading,
    imageUploadError,
    achievementsLoading,
    educationLoading,
    getProfile,
    updateProfile,
    addAchievement,
    addEducation,
    resetProfileStatus,
    clearImageError,
  } = useDoctorProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [openEducationDialog, setOpenEducationDialog] = useState(false);
  const [openAchievementDialog, setOpenAchievementDialog] = useState(false);
  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      specialization: '',
      medicalLicenseNumber: '',
      yearsOfExperience: '',
      phoneNumber: '',
      email: '',
      profileImage: '',
    },
  });

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        specialization: profile.specialization || '',
        medicalLicenseNumber: profile.medicalLicenseNumber || '',
        yearsOfExperience: profile.yearsOfExperience?.toString() || '',
        phoneNumber: profile.phoneNumber || '',
        email: profile.email || '',
        profileImage: profile.profileImage || '',
      });
    }
  }, [profile, reset]);

  useEffect(() => {
    if (success) {
      setLocalSuccess('Profile updated successfully!');
      showNotification('Profile updated successfully!', 'success');
      setIsEditing(false);
      resetProfileStatus();
    }
  }, [success, showNotification, resetProfileStatus]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === 'string' ? error : error?.message || 'An error occurred';
      setLocalError(errorMessage);
      showNotification(errorMessage, 'error');
      resetProfileStatus();
    }
  }, [error, showNotification, resetProfileStatus]);

  useEffect(() => {
    if (imageUploadError) {
      const errorMessage =
        typeof imageUploadError === 'string'
          ? imageUploadError
          : imageUploadError?.message || 'Image upload failed';
      setLocalError(errorMessage);
      showNotification(errorMessage, 'error');
      clearImageError();
    }
  }, [imageUploadError, showNotification, clearImageError]);

  const profileImage = watch('profileImage');
  const firstName = watch('firstName') || '';
  const lastName = watch('lastName') || '';
  const fullName = `${firstName} ${lastName}`.trim();

  const handleImageUpload = useCallback(
    (imagePath) => {
      const fullImageUrl = imagePath.startsWith('/')
        ? window.location.origin + imagePath
        : imagePath;
      dispatch(updateUserProfileData({ profileImage: fullImageUrl }));
      setPreviewImage(null);
    },
    [dispatch]
  );

  const handleImageRemove = useCallback(async () => {
    try {
      const currentImageUrl = watch('profileImage');
      if (currentImageUrl && currentImageUrl !== DEFAULT_AVATAR) {
        const token = getToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/v1/upload/profile`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ imageUrl: currentImageUrl }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to delete image');
        }
        showNotification('Profile image deleted successfully!', 'success');
      }
      setValue('profileImage', '', { shouldDirty: true });
      await updateProfile({ profileImage: '' });
    } catch (error) {
      console.error('Error deleting image:', error);
      const errorMessage =
        typeof error === 'string' ? error : error?.message || 'Failed to delete image';
      showNotification(errorMessage, 'error');
    }
  }, [setValue, updateProfile, showNotification, watch]);

  const onSubmit = useCallback(
    async (data) => {
      setLocalError('');
      setLocalSuccess('');
      try {
        const profileData = {
          firstName: data.firstName,
          lastName: data.lastName,
          specialization: data.specialization,
          yearsOfExperience: parseInt(data.yearsOfExperience, 10),
          phoneNumber: data.phoneNumber,
          email: data.email,
          profileImage: data.profileImage,
        };
        await updateProfile(profileData);
      } catch (err) {
        const errorMessage =
          typeof err === 'string' ? err : err?.message || 'Failed to update profile';
        setLocalError(errorMessage);
        showNotification(errorMessage, 'error');
      }
    },
    [updateProfile, showNotification]
  );

  const handleCancel = useCallback(() => {
    reset();
    setIsEditing(false);
    setLocalError('');
    setLocalSuccess('');
  }, [reset]);

  const handleAddAchievement = useCallback(
    async (achievementData) => {
      try {
        await addAchievement(achievementData);
        setOpenAchievementDialog(false);
        showNotification('Achievement added successfully!', 'success');
      } catch (error) {
        const errorMessage =
          typeof error === 'string' ? error : error?.message || 'Failed to add achievement';
        showNotification(errorMessage, 'error');
      }
    },
    [addAchievement, showNotification]
  );

  const handleAddEducation = useCallback(
    async (educationData) => {
      try {
        await addEducation(educationData);
        setOpenEducationDialog(false);
        showNotification('Education added successfully!', 'success');
      } catch (error) {
        const errorMessage =
          typeof error === 'string' ? error : error?.message || 'Failed to add education';
        showNotification(errorMessage, 'error');
      }
    },
    [addEducation, showNotification]
  );

  const renderAvatarSection = useCallback(
    () => (
      <div className="relative mb-6 flex flex-col items-center">
        {isEditing ? (
          <ImageUploader
            currentImage={user?.profileImage}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            userId={user?._id}
            firstName={user?.firstName}
            lastName={user?.lastName}
            loading={imageUploadLoading}
            size="lg"
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
          />
        ) : (
          <div className="relative group">
            <Avatar className="w-48 h-48 border-4 border-white shadow-2xl ring-4 ring-blue-100">
              <AvatarImage src={user?.profileImage ? `${user.profileImage}?t=${Date.now()}` : undefined} alt={user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Profile Picture'} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-6xl font-bold flex items-center justify-center w-full h-full rounded-full">
                {getInitials(user?.firstName, user?.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
        )}
      </div>
    ),
    [isEditing, user, handleImageUpload, handleImageRemove, imageUploadLoading, previewImage, setPreviewImage, firstName, lastName]
  );

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="text-center mb-8">
        {renderAvatarSection()}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">{fullName || 'Doctor Name'}</h1>
          <p className="text-xl text-blue-600 font-semibold">
            {watch('specialization') || 'Specialty'}
          </p>

          <div className="flex flex-wrap gap-3 justify-center mt-4">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <Shield className="h-4 w-4" />
              <span>License: {watch('medicalLicenseNumber')}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span>{watch('yearsOfExperience')} Years Experience</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">
              <Star className="h-4 w-4" />
              <span>4.9/5 Rating</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <span>{watch('email')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-green-500" />
              <span>{watch('phoneNumber')}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            {!isEditing ? (
              <Button
                variant="default"
                onClick={() => setIsEditing(true)}
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="success"
                  type="submit"
                  disabled={loading || imageUploadLoading}
                  className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleCancel}
                  disabled={loading || imageUploadLoading}
                  className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {(localError || localSuccess) && (
          <Alert
            className={`mt-6 max-w-md mx-auto ${
              localError
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-green-50 text-green-800 border-green-200'
            }`}
          >
            {localError || localSuccess}
          </Alert>
        )}
      </div>

      <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="First Name"
              name="firstName"
              control={control}
              placeholder="Enter your first name"
              disabled={!isEditing || loading}
              error={errors.firstName}
            />
            <FormInput
              label="Last Name"
              name="lastName"
              control={control}
              placeholder="Enter your last name"
              disabled={!isEditing || loading}
              error={errors.lastName}
            />
            <FormInput
              label="Specialization"
              name="specialization"
              control={control}
              placeholder="e.g., Cardiology, Neurology"
              disabled={!isEditing || loading}
              error={errors.specialization}
            />
            <div className="space-y-2">
              <label className="font-medium text-gray-700">License Number</label>
              <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                {watch('medicalLicenseNumber') || 'Not assigned'}
              </div>
              <p className="text-xs text-gray-500">
                License number is managed by system administrators
              </p>
            </div>
            <FormInput
              label="Years of Experience"
              name="yearsOfExperience"
              control={control}
              placeholder="e.g., 10"
              type="number"
              disabled={!isEditing || loading}
              error={errors.yearsOfExperience}
            />
            <FormInput
              label="Email Address"
              name="email"
              control={control}
              placeholder="Enter email address"
              type="email"
              disabled={!isEditing || loading}
              error={errors.email}
            />
            <FormInput
              label="Phone Number"
              name="phoneNumber"
              control={control}
              placeholder="Enter phone number"
              disabled={!isEditing || loading}
              error={errors.phoneNumber}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
              <div className="p-2 bg-green-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
              Education & Training
            </CardTitle>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenEducationDialog(true)}
                className="bg-white/80 hover:bg-white transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <EducationList education={profile?.education || []} loading={educationLoading} />
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              Professional Achievements
            </CardTitle>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenAchievementDialog(true)}
                className="bg-white/80 hover:bg-white transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <AchievementList
            achievements={profile?.achievements || []}
            loading={achievementsLoading}
          />
        </CardContent>
      </Card>

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

      <div className="mt-4">
        <Avatar className="w-24 h-24 border-2 border-green-500">
          <AvatarImage src="https://via.placeholder.com/150" alt="Debug Avatar" />
          <AvatarFallback className="bg-green-100 text-green-900 text-2xl font-bold flex items-center justify-center w-full h-full rounded-full">
            DG
          </AvatarFallback>
        </Avatar>
        <div className="text-xs text-green-700 mt-1">Debug: Known good image</div>
      </div>
    </form>
  );
}

function FormInput({
  label,
  name,
  control,
  placeholder,
  type = 'text',
  disabled,
  error,
}) {
  return (
    <div className="space-y-2">
      <label className="font-medium text-gray-700">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
            placeholder={placeholder}
            type={type}
            {...field}
            disabled={disabled}
          />
        )}
      />
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );
}

function ProfileManager() {
  return <PersonalInfoForm />;
}

export default ProfileManager;