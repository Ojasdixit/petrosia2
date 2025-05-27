import React from 'react';
import { useOptimizedImage } from '@/hooks/use-optimized-image';
import OptimizedImage from './OptimizedImage';

/**
 * Simple test component to show optimized images
 */
const TestOptimizedImage: React.FC = () => {
  // Sample pet images to test optimization
  const originalImage = "/images/placeholder.svg";
  const optimizedImageUrl = useOptimizedImage(originalImage, {
    width: 400,
    quality: 80,
    format: 'webp'
  });

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 rounded-lg mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Image Optimization Showcase</h2>
      <p className="text-gray-600 mb-6 text-center">Demonstrating the performance benefits of using optimized images</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <h3 className="text-sm font-medium mb-2">Original Image</h3>
          <img 
            src={originalImage} 
            alt="Original image" 
            className="w-full h-auto"
            width={300}
            height={200}
          />
          <p className="text-xs text-gray-500 mt-2">Path: {originalImage}</p>
          <p className="text-xs text-gray-500">No optimization applied</p>
        </div>
        
        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <h3 className="text-sm font-medium mb-2">Hook Optimized Image</h3>
          <img 
            src={optimizedImageUrl} 
            alt="Hook optimized image" 
            className="w-full h-auto"
            width={300}
            height={200}
          />
          <p className="text-xs text-gray-500 mt-2">Path: {optimizedImageUrl}</p>
          <p className="text-xs text-gray-500">Using useOptimizedImage hook</p>
        </div>

        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <h3 className="text-sm font-medium mb-2">Component Optimized Image</h3>
          <OptimizedImage 
            src={originalImage} 
            alt="Component optimized image"
            width={300}
            height={200}
            quality={90}
            format="webp"
          />
          <p className="text-xs text-gray-500 mt-2">Using OptimizedImage component</p>
          <p className="text-xs text-gray-500">With lazy loading and fallback</p>
        </div>
      </div>

      <div className="mt-6 p-4 border border-blue-100 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-700 mb-2">Performance Benefits</h3>
        <ul className="text-sm text-blue-600 space-y-1 list-disc pl-5">
          <li>WebP format reduces file size by ~30% compared to JPEG</li>
          <li>Automatic resizing to fit container dimensions</li>
          <li>Quality optimization based on device capabilities</li>
          <li>Lazy loading prevents unnecessary downloads</li>
          <li>Fallback images for error states</li>
        </ul>
      </div>
    </div>
  );
};

export default TestOptimizedImage;