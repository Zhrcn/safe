'use client';
import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { useNotification } from '@/components/ui/Notification';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/utils/tokenUtils';

const ImageUploader = ({ 
    currentImage, 
    onImageUpload, 
    onImageRemove, 
    userId,
    firstName,
    lastName,
    maxSize = 5 * 1024 * 1024, // 5MB default
    acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    className = '',
    size = 'md', // sm, md, lg
    previewImage,
    setPreviewImage,
    updateProfile
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [imageError, setImageError] = useState(false);
    const fileInputRef = useRef(null);
    const { showNotification } = useNotification();

    const sizeClasses = {
        sm: 'w-20 h-20',
        md: 'w-32 h-32',
        lg: 'w-40 h-40'
    };

    // Helper to safely add cache buster
    function addCacheBuster(url) {
        if (!url) return url;
        const hasQuery = url.includes('?');
        return url + (hasQuery ? '&' : '?') + 't=' + Date.now();
    }

    console.log('ImageUploader currentImage:', currentImage);

    const handleFileSelect = async (file) => {
        if (!file) return;

        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
            showNotification('Please select a valid image file (JPEG, PNG, GIF, or WebP)', 'error');
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            showNotification(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`, 'error');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof setPreviewImage === 'function') {
                setPreviewImage(e.target.result);
            }
        };
        reader.readAsDataURL(file);

        // Upload file
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('profileImage', file);
            if (userId) formData.append('userId', userId);
            if (firstName) formData.append('firstName', firstName);
            if (lastName) formData.append('lastName', lastName);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const token = getToken();
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`/api/v1/upload/profile`, {
                method: 'POST',
                body: formData,
                signal: controller.signal,
                headers,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Upload failed with status ${response.status}`);
            }

            const data = await response.json();
            
            if (onImageUpload) {
                console.log('Uploaded image path:', data.data?.imageUrl);
                // Try to fetch the image before updating preview/state
                const fullImageUrl = data.data?.imageUrl && data.data.imageUrl.startsWith('/') ? window.location.origin + data.data.imageUrl : data.data?.imageUrl;
                // Wait for the file to be available (race condition fix)
                let imageLoaded = false;
                for (let i = 0; i < 5; i++) { // Try up to 5 times
                    try {
                        await new Promise(res => setTimeout(res, 200)); // Wait 200ms
                        const resp = await fetch(fullImageUrl + '?t=' + Date.now());
                        if (resp.ok) {
                            imageLoaded = true;
                            break;
                        }
                    } catch (e) {}
                }
                // Always send the clean URL to the parent (no cache buster)
                onImageUpload(fullImageUrl);
                // NEW: update backend profile with new image URL if function provided
                if (typeof updateProfile === 'function') {
                    try {
                        await updateProfile({ profilePicture: fullImageUrl });
                    } catch (e) {
                        console.error('Failed to update profile with new image URL:', e);
                    }
                }
                if (typeof setPreviewImage === 'function') {
                    setPreviewImage(null); // Clear preview so currentImage is used
                }
            }

            showNotification('Image uploaded successfully!', 'success');
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error.message || 'Failed to upload image. Please try again.';
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

    const displayImage = previewImage || (currentImage ? addCacheBuster(currentImage.startsWith('/') ? window.location.origin + currentImage : currentImage) : null);
    console.log('ImageUploader displayImage:', displayImage);

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

export default ImageUploader; 