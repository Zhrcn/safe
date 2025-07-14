import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
    fetchDoctorProfile,
    updateDoctorProfileData,
    uploadDoctorProfileImage,
    addDoctorAchievement,
    updateDoctorAchievement,
    deleteDoctorAchievement,
    addDoctorEducation,
    updateDoctorEducation,
    deleteDoctorEducation,
    addDoctorLicense,
    updateDoctorLicense,
    deleteDoctorLicense,
    selectDoctorProfile,
    selectDoctorProfileLoading,
    selectDoctorProfileError,
    selectDoctorProfileSuccess,
    selectImageUploadLoading,
    selectImageUploadError,
    selectAchievementsLoading,
    selectEducationLoading,
    selectLicensesLoading,
    resetStatus,
    clearImageUploadError
} from '@/store/slices/doctor/doctorProfileSlice';

export const useDoctorProfile = () => {
    const dispatch = useDispatch();

    // Selectors
    const profile = useSelector(selectDoctorProfile);
    const loading = useSelector(selectDoctorProfileLoading);
    const error = useSelector(selectDoctorProfileError);
    const success = useSelector(selectDoctorProfileSuccess);
    const imageUploadLoading = useSelector(selectImageUploadLoading);
    const imageUploadError = useSelector(selectImageUploadError);
    const achievementsLoading = useSelector(selectAchievementsLoading);
    const educationLoading = useSelector(selectEducationLoading);
    const licensesLoading = useSelector(selectLicensesLoading);

    // Actions (memoized)
    const getProfile = useCallback(() => dispatch(fetchDoctorProfile()), [dispatch]);
    const updateProfile = useCallback((profileData) => dispatch(updateDoctorProfileData(profileData)), [dispatch]);
    const uploadImage = useCallback((formData) => dispatch(uploadDoctorProfileImage(formData)), [dispatch]);
    const addAchievement = useCallback((achievementData) => dispatch(addDoctorAchievement(achievementData)), [dispatch]);
    const updateAchievement = useCallback((achievementId, achievementData) => dispatch(updateDoctorAchievement({ achievementId, achievementData })), [dispatch]);
    const deleteAchievement = useCallback((achievementId) => dispatch(deleteDoctorAchievement(achievementId)), [dispatch]);
    const addEducation = useCallback((educationData) => dispatch(addDoctorEducation(educationData)), [dispatch]);
    const updateEducation = useCallback((educationId, educationData) => dispatch(updateDoctorEducation({ educationId, educationData })), [dispatch]);
    const deleteEducation = useCallback((educationId) => dispatch(deleteDoctorEducation(educationId)), [dispatch]);
    const addLicense = useCallback((licenseData) => dispatch(addDoctorLicense(licenseData)), [dispatch]);
    const updateLicense = useCallback((licenseId, licenseData) => dispatch(updateDoctorLicense({ licenseId, licenseData })), [dispatch]);
    const deleteLicense = useCallback((licenseId) => dispatch(deleteDoctorLicense(licenseId)), [dispatch]);
    const resetProfileStatus = useCallback(() => dispatch(resetStatus()), [dispatch]);
    const clearImageError = useCallback(() => dispatch(clearImageUploadError()), [dispatch]);

    return {
        // State
        profile,
        loading,
        error,
        success,
        imageUploadLoading,
        imageUploadError,
        achievementsLoading,
        educationLoading,
        licensesLoading,
        
        // Actions
        getProfile,
        updateProfile,
        uploadImage,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        addEducation,
        updateEducation,
        deleteEducation,
        addLicense,
        updateLicense,
        deleteLicense,
        resetProfileStatus,
        clearImageError
    };
}; 