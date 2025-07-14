'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserProfile,
  selectUser,
  updateUserProfileData,
  selectProfileLoading,
  selectProfileError,
} from '@/store/slices/user/userSlice';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import ImageUploader from '@/components/ui/ImageUploader';
import EducationList from '@/components/doctor/EducationList';
import AchievementList from '@/components/doctor/AchievementList';
import AddEducationDialog from '@/components/doctor/AddEducationDialog';
import AddAchievementDialog from '@/components/doctor/AddAchievementDialog';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { User, Mail, Phone, Award, GraduationCap, Edit3, Plus, X, Camera, Save, Star, Shield, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const profileLoading = useSelector(selectProfileLoading);
  const profileError = useSelector(selectProfileError);

  const [isEditing, setIsEditing] = useState(false);
  const [openEducationDialog, setOpenEducationDialog] = useState(false);
  const [openAchievementDialog, setOpenAchievementDialog] = useState(false);
  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');

  const personalInfoSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    specialization: z.string().min(2, 'Specialization is required'),
    yearsOfExperience: z.string().min(1, 'Experience is required'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
    email: z.string().email('Invalid email address'),
    profileImage: z.string().optional(),
  });

  const DEFAULT_AVATAR = '/avatars/default-avatar.svg';

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
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        specialization: user.specialization || '',
        medicalLicenseNumber: user.medicalLicenseNumber || '',
        yearsOfExperience: user.yearsOfExperience?.toString() || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [user, reset]);

  const profileImage = watch('profileImage');
  const firstName = watch('firstName') || '';
  const lastName = watch('lastName') || '';
  const fullName = `${firstName} ${lastName}`.trim();

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
        await dispatch(updateUserProfileData(profileData)).unwrap();
        await dispatch(fetchUserProfile());
        setLocalSuccess('Profile updated successfully!');
        setIsEditing(false);
      } catch (err) {
        const errorMessage = typeof err === 'string' ? err : err?.message || 'Failed to update profile';
        setLocalError(errorMessage);
      }
    },
    [dispatch]
  );

  const handleCancel = useCallback(() => {
    reset();
    setIsEditing(false);
    setLocalError('');
    setLocalSuccess('');
  }, [reset]);

  // Image upload logic
  const handleImageUpload = useCallback(
    (imagePath) => {
      setValue('profileImage', imagePath, { shouldDirty: true });
    },
    [setValue]
  );

  const handleImageRemove = useCallback(() => {
    setValue('profileImage', '', { shouldDirty: true });
  }, [setValue]);

  if (profileLoading && !user) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('doctor.profile.title', 'Doctor Profile')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('doctor.profile.description', 'Manage your professional profile, credentials, and personal information to provide the best care for your patients.')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="text-center mb-8">
            <div className="relative mb-6 flex flex-col items-center">
              {isEditing ? (
                <ImageUploader
                  currentImage={profileImage}
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  userId={user?._id}
                  firstName={firstName}
                  lastName={lastName}
                  loading={profileLoading}
                  size="lg"
                />
              ) : (
                <Avatar
                  src={profileImage || DEFAULT_AVATAR}
                  alt="Profile Picture"
                  className="w-48 h-48 border-4 border-white shadow-2xl ring-4 ring-blue-100"
                >
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-6xl font-bold flex items-center justify-center w-full h-full rounded-full">
                    {firstName.charAt(0)}
                    {lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
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
                      disabled={profileLoading}
                      className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {profileLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleCancel}
                      disabled={profileLoading}
                      className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {(localError || localSuccess || profileError) && (
              <Alert
                className={`mt-6 max-w-md mx-auto ${
                  localError || profileError
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : 'bg-green-50 text-green-800 border-green-200'
                }`}
              >
                {localError || profileError || localSuccess}
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
                  disabled={!isEditing || profileLoading}
                  error={errors.firstName}
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  control={control}
                  placeholder="Enter your last name"
                  disabled={!isEditing || profileLoading}
                  error={errors.lastName}
                />
                <FormInput
                  label="Specialization"
                  name="specialization"
                  control={control}
                  placeholder="e.g., Cardiology, Neurology"
                  disabled={!isEditing || profileLoading}
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
                  disabled={!isEditing || profileLoading}
                  error={errors.yearsOfExperience}
                />
                <FormInput
                  label="Email Address"
                  name="email"
                  control={control}
                  placeholder="Enter email address"
                  type="email"
                  disabled={!isEditing || profileLoading}
                  error={errors.email}
                />
                <FormInput
                  label="Phone Number"
                  name="phoneNumber"
                  control={control}
                  placeholder="Enter phone number"
                  disabled={!isEditing || profileLoading}
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
                {/* AddEducationDialog can be enabled in edit mode if needed */}
              </div>
            </CardHeader>
            <CardContent>
              <EducationList education={user?.education || []} loading={false} />
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
                {/* AddAchievementDialog can be enabled in edit mode if needed */}
              </div>
            </CardHeader>
            <CardContent>
              <AchievementList achievements={user?.achievements || []} loading={false} />
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

// Extracted form input for DRYness
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