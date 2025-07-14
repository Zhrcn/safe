'use client';
import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { useNotification } from '@/components/ui/Notification';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/utils/tokenUtils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, editProfile } from '@/store/slices/patient/profileSlice';

const ImageUploaderPatient = ({
    onImageUpload,
    onImageRemove,
    maxSize = 5 * 1024 * 1024, // 5MB default
    acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    className = '',
    size = 'md', // sm, md, lg
    previewImage,
    setPreviewImage,
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [imageError, setImageError] = useState(false);
    const fileInputRef = useRef(null);
    const { showNotification } = useNotification();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    const sizeClasses = {
        sm: 'w-20 h-20',
        md: 'w-32 h-32',
        lg: 'w-40 h-40',
    };

    function addCacheBuster(url) {
        if (!url) return url;
        const hasQuery = url.includes('?');
        return url + (hasQuery ? '&' : '?') + 't=' + Date.now();
    }

    const handleFileSelect = async (file) => {
        if (!file) return;
        if (!acceptedTypes.includes(file.type)) {
            showNotification('Please select a valid image file (JPEG, PNG, GIF, or WebP)', 'error');
            return;
        }
        if (file.size > maxSize) {
            showNotification(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`, 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof setPreviewImage === 'function') {
                setPreviewImage(e.target.result);
            }
        };
        reader.readAsDataURL(file);
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('profileImage', file);
            // 1. Upload image to backend (customize endpoint as needed)
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/api/v1/patient/profile/upload-image`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!response.ok) throw new Error('Failed to upload image');
            const data = await response.json();
            const imageUrl = data?.imageUrl;
            // 2. Update patient profile with new image URL
            await dispatch(editProfile({ profileImage: imageUrl })).unwrap();
            // 3. Refresh patient profile from backend
            await dispatch(fetchProfile());
            if (onImageUpload) onImageUpload(imageUrl);
            if (typeof setPreviewImage === 'function') setPreviewImage(null);
            showNotification('Image uploaded and profile updated!', 'success');
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error?.data?.message || error?.message || 'Failed to upload image. Please try again.';
            showNotification(errorMessage, 'error');
            if (typeof setPreviewImage === 'function') {
                setPreviewImage(null);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleRemoveImage = async () => {
        try {
            if (onImageRemove) {
                await onImageRemove();
            }
            if (typeof setPreviewImage === 'function') {
                setPreviewImage(null);
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error removing image:', error);
        }
    };

    const displayImage = previewImage || (user?.profileImage ? addCacheBuster(user.profileImage) : null);

    React.useEffect(() => {
        setImageError(false);
    }, [displayImage]);

    function UploaderAvatar({ src, sizeClass }) {
        return (
            <Avatar src={src} alt="Profile Picture" className={`${sizeClass} border-4 border-border shadow-lg`}>
                <AvatarFallback className="bg-muted text-muted-foreground text-2xl flex items-center justify-center w-full h-full rounded-full">
                    <Camera className="w-8 h-8" />
                </AvatarFallback>
            </Avatar>
        );
    }

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            <div className="relative">
                <UploaderAvatar
                    src={displayImage}
                    sizeClass={sizeClasses[size]}
                />
                {isUploading && (
                    <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center gap-2">
                <div
                    className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        dragActive 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={acceptedTypes.join(',')}
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                    />
                    
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                PNG, JPG, WebP up to {Math.round(maxSize / 1024 / 1024)}MB
                            </p>
                        </div>
                    </div>
                </div>

                {displayImage && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="flex items-center gap-2"
                        >
                            <Camera className="w-4 h-4" />
                            Change
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveImage}
                            disabled={isUploading}
                            className="flex items-center gap-2 text-danger hover:text-danger"
                        >
                            <X className="w-4 h-4" />
                            Remove
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploaderPatient; 