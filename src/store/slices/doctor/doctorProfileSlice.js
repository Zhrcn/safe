import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { extractErrorMessage } from '@/utils/errorHandling';
import { API_BASE_URL } from '@/config/api';
import {
  getDoctorProfile,
  updateDoctorProfile,
  uploadProfileImage,
  addAchievement,
  updateAchievement,
  deleteAchievement,
  addEducation,
  updateEducation,
  deleteEducation,
  addLicense,
  updateLicense,
  deleteLicense
} from '../../services/doctor/doctorApi';

const transformImageUrl = (imageUrl) => {
  if (!imageUrl) return imageUrl;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/')) return `${API_BASE_URL}${imageUrl}`;
  return imageUrl;
};

export const fetchDoctorProfile = createAsyncThunk(
    'doctorProfile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getDoctorProfile();
            return response;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const updateDoctorProfileData = createAsyncThunk(
    'doctorProfile/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await updateDoctorProfile(profileData);
            return response;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const uploadDoctorProfileImage = createAsyncThunk(
    'doctorProfile/uploadImage',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await uploadProfileImage(formData);
            return response;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const addDoctorAchievement = createAsyncThunk(
    'doctorProfile/addAchievement',
    async (achievementData, { rejectWithValue }) => {
        try {
            const response = await addAchievement(achievementData);
            return response;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const updateDoctorAchievement = createAsyncThunk(
    'doctorProfile/updateAchievement',
    async ({ achievementId, achievementData }, { rejectWithValue }) => {
        try {
            const response = await updateAchievement(achievementId, achievementData);
            return response;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const deleteDoctorAchievement = createAsyncThunk(
    'doctorProfile/deleteAchievement',
    async (achievementId, { rejectWithValue }) => {
        try {
            await deleteAchievement(achievementId);
            return achievementId;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const addDoctorEducation = createAsyncThunk(
    'doctorProfile/addEducation',
    async (educationData, { rejectWithValue }) => {
        try {
            const response = await addEducation(educationData);
            return response;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const updateDoctorEducation = createAsyncThunk(
    'doctorProfile/updateEducation',
    async ({ educationId, educationData }, { rejectWithValue }) => {
        try {
            const response = await updateEducation(educationId, educationData);
            return response;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const deleteDoctorEducation = createAsyncThunk(
    'doctorProfile/deleteEducation',
    async (educationId, { rejectWithValue }) => {
        try {
            await deleteEducation(educationId);
            return educationId;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const addDoctorLicense = createAsyncThunk(
    'doctorProfile/addLicense',
    async (licenseData, { rejectWithValue }) => {
        try {
            const response = await addLicense(licenseData);
            return response;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const updateDoctorLicense = createAsyncThunk(
    'doctorProfile/updateLicense',
    async ({ licenseId, licenseData }, { rejectWithValue }) => {
        try {
            const response = await updateLicense(licenseId, licenseData);
            return response;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const deleteDoctorLicense = createAsyncThunk(
    'doctorProfile/deleteLicense',
    async (licenseId, { rejectWithValue }) => {
        try {
            await deleteLicense(licenseId);
            return licenseId;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

const initialState = {
    profile: null,
    loading: false,
    error: null,
    success: false,
    imageUploadLoading: false,
    imageUploadError: null,
    achievementsLoading: false,
    educationLoading: false,
    licensesLoading: false
};

const doctorProfileSlice = createSlice({
    name: 'doctorProfile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
            state.error = null;
            state.success = false;
        },
        resetStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.imageUploadLoading = false;
            state.imageUploadError = null;
            state.achievementsLoading = false;
            state.educationLoading = false;
            state.licensesLoading = false;
        },
        clearImageUploadError: (state) => {
            state.imageUploadError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDoctorProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
                state.loading = false;
                const profile = {
                    ...action.payload,
                    profileImage: transformImageUrl(action.payload.profileImage)
                };
                state.profile = profile;
                state.success = true;
            })
            .addCase(fetchDoctorProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            .addCase(updateDoctorProfileData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDoctorProfileData.fulfilled, (state, action) => {
                state.loading = false;
                const profile = {
                    ...action.payload,
                    profileImage: transformImageUrl(action.payload.profileImage)
                };
                state.profile = profile;
                state.success = true;
            })
            .addCase(updateDoctorProfileData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            .addCase(uploadDoctorProfileImage.pending, (state) => {
                state.imageUploadLoading = true;
                state.imageUploadError = null;
            })
            .addCase(uploadDoctorProfileImage.fulfilled, (state, action) => {
                state.imageUploadLoading = false;
                if (state.profile) {
                    state.profile.profileImage = transformImageUrl(action.payload.imageUrl);
                }
            })
            .addCase(uploadDoctorProfileImage.rejected, (state, action) => {
                state.imageUploadLoading = false;
                state.imageUploadError = action.payload;
            })
            
            .addCase(addDoctorAchievement.pending, (state) => {
                state.achievementsLoading = true;
                state.error = null;
            })
            .addCase(addDoctorAchievement.fulfilled, (state, action) => {
                state.achievementsLoading = false;
                if (state.profile) {
                    state.profile.achievements = action.payload;
                }
                state.success = true;
            })
            .addCase(addDoctorAchievement.rejected, (state, action) => {
                state.achievementsLoading = false;
                state.error = action.payload;
            })
            
            .addCase(updateDoctorAchievement.pending, (state) => {
                state.achievementsLoading = true;
                state.error = null;
            })
            .addCase(updateDoctorAchievement.fulfilled, (state, action) => {
                state.achievementsLoading = false;
                if (state.profile) {
                    state.profile.achievements = action.payload;
                }
                state.success = true;
            })
            .addCase(updateDoctorAchievement.rejected, (state, action) => {
                state.achievementsLoading = false;
                state.error = action.payload;
            })
            
            .addCase(deleteDoctorAchievement.pending, (state) => {
                state.achievementsLoading = true;
                state.error = null;
            })
            .addCase(deleteDoctorAchievement.fulfilled, (state, action) => {
                state.achievementsLoading = false;
                if (state.profile) {
                    state.profile.achievements = action.payload;
                }
                state.success = true;
            })
            .addCase(deleteDoctorAchievement.rejected, (state, action) => {
                state.achievementsLoading = false;
                state.error = action.payload;
            })
            
            .addCase(addDoctorEducation.pending, (state) => {
                state.educationLoading = true;
                state.error = null;
            })
            .addCase(addDoctorEducation.fulfilled, (state, action) => {
                state.educationLoading = false;
                if (state.profile) {
                    state.profile.education = action.payload;
                }
                state.success = true;
            })
            .addCase(addDoctorEducation.rejected, (state, action) => {
                state.educationLoading = false;
                state.error = action.payload;
            })
            
            .addCase(updateDoctorEducation.pending, (state) => {
                state.educationLoading = true;
                state.error = null;
            })
            .addCase(updateDoctorEducation.fulfilled, (state, action) => {
                state.educationLoading = false;
                if (state.profile) {
                    state.profile.education = action.payload;
                }
                state.success = true;
            })
            .addCase(updateDoctorEducation.rejected, (state, action) => {
                state.educationLoading = false;
                state.error = action.payload;
            })
            
            .addCase(deleteDoctorEducation.pending, (state) => {
                state.educationLoading = true;
                state.error = null;
            })
            .addCase(deleteDoctorEducation.fulfilled, (state, action) => {
                state.educationLoading = false;
                if (state.profile) {
                    state.profile.education = action.payload;
                }
                state.success = true;
            })
            .addCase(deleteDoctorEducation.rejected, (state, action) => {
                state.educationLoading = false;
                state.error = action.payload;
            })
            
            .addCase(addDoctorLicense.pending, (state) => {
                state.licensesLoading = true;
                state.error = null;
            })
            .addCase(addDoctorLicense.fulfilled, (state, action) => {
                state.licensesLoading = false;
                if (state.profile && !state.profile.licenses) {
                    state.profile.licenses = [];
                }
                if (state.profile) {
                    state.profile.licenses.push(action.payload);
                }
                state.success = true;
            })
            .addCase(addDoctorLicense.rejected, (state, action) => {
                state.licensesLoading = false;
                state.error = action.payload;
            })
            
            .addCase(updateDoctorLicense.pending, (state) => {
                state.licensesLoading = true;
                state.error = null;
            })
            .addCase(updateDoctorLicense.fulfilled, (state, action) => {
                state.licensesLoading = false;
                if (state.profile && state.profile.licenses) {
                    const index = state.profile.licenses.findIndex(
                        license => license._id === action.payload._id
                    );
                    if (index !== -1) {
                        state.profile.licenses[index] = action.payload;
                    }
                }
                state.success = true;
            })
            .addCase(updateDoctorLicense.rejected, (state, action) => {
                state.licensesLoading = false;
                state.error = action.payload;
            })
            
            .addCase(deleteDoctorLicense.pending, (state) => {
                state.licensesLoading = true;
                state.error = null;
            })
            .addCase(deleteDoctorLicense.fulfilled, (state, action) => {
                state.licensesLoading = false;
                if (state.profile && state.profile.licenses) {
                    state.profile.licenses = state.profile.licenses.filter(
                        license => license._id !== action.payload
                    );
                }
                state.success = true;
            })
            .addCase(deleteDoctorLicense.rejected, (state, action) => {
                state.licensesLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearProfile, resetStatus, clearImageUploadError } = doctorProfileSlice.actions;

export const selectDoctorProfile = (state) => state.doctorProfile.profile;
export const selectDoctorProfileLoading = (state) => state.doctorProfile.loading;
export const selectDoctorProfileError = (state) => state.doctorProfile.error;
export const selectDoctorProfileSuccess = (state) => state.doctorProfile.success;
export const selectImageUploadLoading = (state) => state.doctorProfile.imageUploadLoading;
export const selectImageUploadError = (state) => state.doctorProfile.imageUploadError;
export const selectAchievementsLoading = (state) => state.doctorProfile.achievementsLoading;
export const selectEducationLoading = (state) => state.doctorProfile.educationLoading;
export const selectLicensesLoading = (state) => state.doctorProfile.licensesLoading;

export default doctorProfileSlice.reducer; 