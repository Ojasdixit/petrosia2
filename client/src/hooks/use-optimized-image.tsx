import { useMemo } from 'react';

interface OptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
}

/**
 * Custom hook to generate optimized image URLs
 * 
 * @param src Original image source path
 * @param options Optimization options (width, height, quality, format)
 * @returns Optimized image URL
 */
export function useOptimizedImage(src: string, options: OptimizeOptions = {}) {
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
  } = options;

  return useMemo(() => {
    // Skip optimization for external or data URLs
    if (!src || src.startsWith('http') || src.startsWith('data:')) {
      return src;
    }

    // Remove leading slash if present
    const normalizedSrc = src.startsWith('/') ? src : `/${src}`;
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality) params.append('q', quality.toString());
    if (format) params.append('format', format);
    
    // Construct the final URL with optimization parameters
    return `/optimized${normalizedSrc}?${params.toString()}`;
  }, [src, width, height, quality, format]);
}