import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUserProfile,
    updateUserProfileData,
    uploadUserProfileImageData,
    selectCurrentUser,
    selectProfileLoading,
    selectProfileError,
    selectImageUploadLoading,
    selectImageUploadError,
    clearProfileError,
    clearImageUploadError
} from '@/store/slices/user/userSlice';

export const useUserProfile = () => {
    const dispatch = useDispatch();

    const user = useSelector(selectCurrentUser);
    const profileLoading = useSelector(selectProfileLoading);
    const profileError = useSelector(selectProfileError);
    const imageUploadLoading = useSelector(selectImageUploadLoading);
    const imageUploadError = useSelector(selectImageUploadError);

    const getProfile = () => dispatch(fetchUserProfile());
    const updateProfile = (profileData) => dispatch(updateUserProfileData(profileData));
    const uploadImage = (formData) => dispatch(uploadUserProfileImageData(formData));
    const clearError = () => dispatch(clearProfileError());
    const clearImageError = () => dispatch(clearImageUploadError());

    return {
        user,
        profileLoading,
        profileError,
        imageUploadLoading,
        imageUploadError,
        
        getProfile,
        updateProfile,
        uploadImage,
        clearError,
        clearImageError
    };
}; 