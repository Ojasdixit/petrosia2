import React, { useState, useEffect } from 'react';
import { useOptimizedImage } from '@/hooks/use-optimized-image';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  sizes?: string;
  priority?: boolean;
  fallbackSrc?: string;
}

/**
 * Optimized image component that uses the optimized image service
 * This component provides automatic image optimization with WebP support,
 * lazy loading, and responsive image capabilities.
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  quality = 80,
  format = 'webp',
  sizes,
  priority = false,
  fallbackSrc = '/images/placeholder.svg',
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(!priority);
  const [isError, setIsError] = useState(false);

  // Get optimized image URL
  const optimizedSrc = useOptimizedImage(imgSrc, {
    width,
    height,
    quality,
    format
  });

  // Reset state when src changes
  useEffect(() => {
    setImgSrc(src);
    setIsError(false);
  }, [src]);

  // Handle image loading errors
  const handleError = () => {
    setIsError(true);
    setImgSrc(fallbackSrc);
  };

  // Handle image load complete
  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24">
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
            />
            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" />
          </svg>
        </div>
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${className}`}
        loading={priority ? 'eager' : 'lazy'}
        onError={handleError}
        onLoad={handleLoad}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;