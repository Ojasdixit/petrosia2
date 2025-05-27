import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { promisify } from 'util';

const access = promisify(fs.access);
const mkdir = promisify(fs.mkdir);

/**
 * Configuration for the image optimizer
 */
const config = {
  // Cache directory for optimized images
  cacheDir: './.data/image-cache',
  
  // Default quality for images
  defaultQuality: 80,
  
  // Default format for images
  defaultFormat: 'webp',
  
  // Whitelisted image extensions
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'],
  
  // Image directories to search in order
  imageDirs: [
    './public',
    './public/uploads',
    './uploads',
    './.data/uploads',
    './.data/media'
  ]
};

/**
 * Ensure cache directory exists
 */
async function ensureCacheDirectory() {
  try {
    await access(config.cacheDir, fs.constants.F_OK);
  } catch (error) {
    await mkdir(config.cacheDir, { recursive: true });
    console.log(`Created image cache directory: ${config.cacheDir}`);
  }
}

/**
 * Generate a cache key for an image
 */
function generateCacheKey(imagePath: string, query: any): string {
  // Normalize path by removing leading slash
  const normalizedPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  // Create a cache key based on path and query params
  const queryString = Object.entries(query)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('-');
    
  // Remove special characters that might cause filesystem issues
  const sanitizedPath = normalizedPath.replace(/[^a-zA-Z0-9\-_\.]/g, '_');
  
  return path.join(
    config.cacheDir, 
    queryString ? `${sanitizedPath}-${queryString}` : sanitizedPath
  );
}

/**
 * Find the image file in one of the image directories
 */
async function findImageFile(imagePath: string): Promise<string | null> {
  // Normalize path by removing leading slash
  const normalizedPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  for (const dir of config.imageDirs) {
    const fullPath = path.join(dir, normalizedPath);
    try {
      await access(fullPath, fs.constants.R_OK);
      return fullPath;
    } catch (error) {
      // Continue to next directory
    }
  }
  
  return null;
}

/**
 * Get the content type based on the format
 */
function getContentType(format: string): string {
  switch (format.toLowerCase()) {
    case 'jpeg':
    case 'jpg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'avif':
      return 'image/avif';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'image/jpeg';
  }
}

/**
 * Middleware for optimizing images
 */
export async function imageOptimizerMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Initialize the cache directory
    await ensureCacheDirectory();
    
    // Get the image path from the URL
    const imagePath = req.path.replace('/optimized', '');
    
    // Get the query parameters
    const width = parseInt(req.query.w as string) || undefined;
    const height = parseInt(req.query.h as string) || undefined;
    const quality = parseInt(req.query.q as string) || config.defaultQuality;
    const format = (req.query.format as string) || config.defaultFormat;
    
    // Skip optimization for SVG images
    const extension = path.extname(imagePath).toLowerCase();
    if (extension === '.svg') {
      const imageLoc = await findImageFile(imagePath);
      if (!imageLoc) {
        return next();
      }
      
      const contentType = getContentType(extension);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      return fs.createReadStream(imageLoc).pipe(res);
    }
    
    // Check if the extension is allowed
    if (!config.allowedExtensions.includes(extension)) {
      console.warn(`Unsupported image format: ${extension}`);
      return next();
    }
    
    // Generate a cache key
    const cacheKey = generateCacheKey(imagePath, { w: width, h: height, q: quality, format });
    
    // Check if the image is already cached
    try {
      await access(cacheKey, fs.constants.R_OK);
      // Image exists in cache, serve it
      const contentType = getContentType(format);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      return fs.createReadStream(cacheKey).pipe(res);
    } catch (error) {
      // Image not in cache, optimize it
    }
    
    // Find the original image
    const originalImagePath = await findImageFile(imagePath);
    if (!originalImagePath) {
      console.warn(`Image not found: ${imagePath}`);
      return next();
    }
    
    // Create a sharp instance
    let pipeline = sharp(originalImagePath);
    
    // Resize if width or height is specified
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Convert to the specified format
    switch (format) {
      case 'webp':
        pipeline = pipeline.webp({ quality });
        break;
      case 'jpeg':
      case 'jpg':
        pipeline = pipeline.jpeg({ quality });
        break;
      case 'png':
        pipeline = pipeline.png({ quality });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality });
        break;
      default:
        pipeline = pipeline.webp({ quality });
    }
    
    // Save the optimized image to cache
    await pipeline.toFile(cacheKey);
    
    // Serve the optimized image
    const contentType = getContentType(format);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    fs.createReadStream(cacheKey).pipe(res);
  } catch (error) {
    console.error('Image optimization error:', error);
    next(error);
  }
}