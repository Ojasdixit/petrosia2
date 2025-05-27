/**
 * Performance optimizations for Petrosia website
 * This file contains functions that improve site performance
 */

/**
 * Lazily loads images that are not in the viewport
 * Adds loading="lazy" attribute to images that don't have it
 */
export function setupLazyLoading() {
  // Only run in browser environment
  if (typeof document === 'undefined') return;
  
  // Get all images without loading="lazy"
  const images = document.querySelectorAll('img:not([loading])');
  
  // Add lazy loading to these images
  images.forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
  
  // If browser supports native lazy loading, we're done
  if ('loading' in HTMLImageElement.prototype) {
    return;
  }
  
  // For browsers that don't support native lazy loading, use Intersection Observer
  // This is a fallback for older browsers
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    // Find all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

/**
 * Preconnects to important third-party domains
 * This establishes early connections to speed up resource loading
 */
export function setupPreconnect() {
  // Only run in browser environment
  if (typeof document === 'undefined') return;

  // List of domains to preconnect to
  const domains = [
    'https://res.cloudinary.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  // Check if preconnect links already exist
  const existingLinks = Array.from(document.querySelectorAll('link[rel="preconnect"]'))
    .map(link => link.getAttribute('href'));
  
  // Add preconnect for each domain if not already present
  domains.forEach(domain => {
    if (!existingLinks.includes(domain)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    }
  });
}

/**
 * Defers non-critical CSS loading
 * @param cssUrl URL to the CSS file to be loaded after page load
 */
export function loadDeferredCSS(cssUrl: string) {
  // Only run in browser environment
  if (typeof document === 'undefined') return;
  
  // Create a link element for the CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl;
  
  // Set to load with low priority
  link.setAttribute('media', 'print');
  link.setAttribute('onload', "this.media='all'");
  
  // Append to document
  document.head.appendChild(link);
}

/**
 * Implements image optimization by rewriting image URLs to use the optimized endpoint
 * @param selector CSS selector for images to optimize
 */
export function optimizeImages(selector = 'img:not([data-no-optimize])') {
  // Only run in browser environment
  if (typeof document === 'undefined') return;
  
  // Find all images that don't have data-no-optimize attribute
  const images = document.querySelectorAll(selector);
  
  images.forEach(img => {
    const imgElement = img as HTMLImageElement;
    const src = imgElement.src;
    
    // Skip already optimized, SVG, or data URLs
    if (src.includes('/optimized/') || 
        src.startsWith('data:') || 
        src.endsWith('.svg')) {
      return;
    }
    
    // Skip external images
    if (src.startsWith('http') && !src.includes(window.location.hostname)) {
      return;
    }
    
    // Get image dimensions
    const width = imgElement.width || 0;
    const height = imgElement.height || 0;
    
    // Only optimize if we have dimensions
    if (width > 0 || height > 0) {
      // Get the path part of the URL
      const url = new URL(src, window.location.origin);
      const pathName = url.pathname;
      
      // Build the optimized URL
      let optimizedUrl = `/optimized${pathName}?`;
      if (width > 0) optimizedUrl += `w=${width}&`;
      if (height > 0) optimizedUrl += `h=${height}&`;
      optimizedUrl += 'format=webp&q=85';
      
      // Update the src
      imgElement.src = optimizedUrl;
    }
  });
}

/**
 * Performs resource hints to improve page load performance
 */
export function addResourceHints() {
  // Only run in browser environment
  if (typeof document === 'undefined') return;
  
  // Prefetch common navigation paths
  const pagesToPrefetch = [
    '/services',
    '/pets',
    '/dog-breeds',
    '/blog',
    '/about'
  ];
  
  // Add prefetch hints
  pagesToPrefetch.forEach(page => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = page;
    document.head.appendChild(link);
  });
}

/**
 * Initializes all performance optimizations
 */
export function initPerformanceOptimizations() {
  // Run after the DOM is loaded
  if (typeof window !== 'undefined') {
    // Run immediately
    setupPreconnect();
    
    // Run when DOM is loaded
    window.addEventListener('DOMContentLoaded', () => {
      setupLazyLoading();
      optimizeImages();
    });
    
    // Run when page is fully loaded
    window.addEventListener('load', () => {
      // Add resource hints after page load (lower priority)
      setTimeout(addResourceHints, 2000);
    });
  }
}

// Automatically initialize performance optimizations
initPerformanceOptimizations();