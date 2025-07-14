import React, { useState } from 'react';

const ImageTest = ({ src, alt, className }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  console.log('ImageTest - src:', src);

  if (!src || imageError) {
    return (
      <div className={`bg-gray-200 rounded-full flex items-center justify-center ${className}`}>
        <span className="text-gray-500">No Image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onLoad={() => {
        console.log('Image loaded successfully:', src);
        setImageLoaded(true);
        setImageError(false);
      }}
      onError={(e) => {
        console.log('Image failed to load:', src);
        console.log('Error event:', e);
        setImageError(true);
        setImageLoaded(false);
      }}
      style={{ 
        opacity: imageLoaded ? 1 : 0.5,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
};

export default ImageTest; 