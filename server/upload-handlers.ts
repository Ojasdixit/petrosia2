import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { cloudinaryService, MediaType } from './cloudinary';
import { db } from './db';
import { mediaFiles, InsertMediaFile } from '@shared/schema';

// Extend the Express Request type for multer files
declare module 'express-serve-static-core' {
  interface Request {
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
  }
}

// Temporary storage configuration for multer
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(process.cwd(), 'temp-uploads');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExt);
  }
});

// File filter to validate uploaded files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Please upload only images or videos.'));
  }
};

// Create multer uploader with optimized settings for mobile uploads
export const upload = multer({
  storage: tempStorage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit to support larger videos from mobile
    fieldSize: 25 * 1024 * 1024 // Increase field size limit for larger form data from mobile
  }
});

/**
 * Save media file metadata to database
 */
async function saveMediaMetadata(mediaData: any, entityType: string, entityId?: number): Promise<number | undefined> {
  try {
    // Determine resource type (image or video)
    const resourceType = mediaData.resource_type as 'image' | 'video';
    
    // Create media file object
    const mediaFile = {
      publicId: mediaData.public_id,
      originalFilename: mediaData.original_filename || undefined,
      url: mediaData.url,
      secureUrl: mediaData.secure_url,
      resourceType: resourceType,
      format: mediaData.format,
      width: mediaData.width || null,
      height: mediaData.height || null,
      bytes: mediaData.bytes || 0,
      duration: resourceType === 'video' ? mediaData.duration : null,
      entityType: entityType as any,
      entityId: entityId || null,
    };
    
    // Insert into database
    const result = await db.insert(mediaFiles).values(mediaFile).returning();
    
    // Return the ID of the newly created media record
    return result && result.length > 0 ? result[0].id : undefined;
  } catch (error) {
    console.error('Error saving media metadata to database:', error);
    return undefined;
  }
}

/**
 * Handler for uploading pet media files (images/videos) - enhanced for mobile compatibility
 */
export async function handlePetMediaUpload(req: Request, res: Response) {
  // Check authentication
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    // Enhanced detailed logging for debugging mobile uploads
    console.log('=== PET MEDIA UPLOAD REQUEST DETAILS ===');
    console.log('Request received at /api/upload/pet-media');
    console.log('User agent:', req.headers['user-agent']);
    console.log('Content type:', req.headers['content-type']);
    console.log('Request method:', req.method);
    console.log('Request body keys:', Object.keys(req.body || {}));
    
    // More detailed file logging
    console.log('Files in request:', 
      req.files 
        ? Array.isArray(req.files)
          ? `Array with ${req.files.length} items` 
          : 'Object with files' 
        : req.file
          ? 'Single file object'
          : 'No files detected'
    );
    
    // Process the uploaded files - handle all possible file structures from mobile devices
    let files = [];
    
    // Case 1: Multiple files in req.files array
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      files = req.files;
      console.log(`Found ${files.length} files in req.files array`);
    } 
    // Case 2: Files as object with arrays
    else if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
      // Handle case where files are in an object with keys containing arrays
      // This is common with some mobile upload libraries
      const filesObj = req.files as Record<string, any>;
      for (const key in filesObj) {
        if (Array.isArray(filesObj[key])) {
          files.push(...filesObj[key]);
        } else if (filesObj[key]) {
          files.push(filesObj[key]);
        }
      }
      console.log(`Found ${files.length} files in req.files object`);
    }
    // Case 3: Single file in req.file
    else if (req.file) {
      files = [req.file];
      console.log('Found single file in req.file');
    }
    
    // Check if we have any files to process
    if (files.length === 0) {
      console.error('No files were detected in the upload request');
      return res.status(400).json({ 
        success: false, 
        message: 'No files were uploaded. Make sure you\'re using the correct field name in your form.' 
      });
    }
    
    // Ensure all file objects are valid
    files = files.filter(file => file && typeof file === 'object');
    
    console.log(`Processing ${files.length} valid files for Cloudinary upload`);
    
    // Log each file's details for debugging
    files.forEach((file, index) => {
      console.log(`File ${index + 1} details:`, {
        fieldname: file.fieldname,
        originalname: file.originalname || 'unnamed-file',
        encoding: file.encoding,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      });
    });

    // Get entity information from request
    const entityType = req.body.entityType || 'pet';
    const entityId = req.body.entityId ? parseInt(req.body.entityId) : undefined;
    console.log(`Entity info: type=${entityType}, id=${entityId || 'undefined'}`);

    // Upload results array for response
    const uploadResults = [];
    let successCount = 0;
    let failCount = 0;
    
    // Process each file with robust error handling
    for (const file of files) {
      try {
        // Skip invalid files
        if (!file || !file.path || !file.originalname) {
          console.error('Skipping invalid file object:', file);
          failCount++;
          continue;
        }
        
        // Check file exists on disk
        if (!fs.existsSync(file.path)) {
          console.error(`File not found on disk: ${file.path}`);
          failCount++;
          continue;
        }
        
        console.log(`Processing file: ${file.originalname} (${file.size} bytes)`);
        
        // Detect if it's an image or video based on mimetype
        const mediaType = file.mimetype && file.mimetype.startsWith('video/') 
          ? MediaType.VIDEO 
          : MediaType.IMAGE;
        
        console.log(`Detected media type: ${mediaType}`);
        
        // Upload to Cloudinary with multiple retries
        let result = null;
        let retryCount = 0;
        const MAX_RETRIES = 3;
        
        while (!result && retryCount < MAX_RETRIES) {
          try {
            result = await cloudinaryService.uploadMedia(
              file.path,
              entityType as 'pet' | 'breed' | 'provider' | 'general',
              entityId,
              file.originalname,
              mediaType
            );
          } catch (uploadError) {
            console.error(`Attempt ${retryCount + 1} failed:`, uploadError);
            retryCount++;
            if (retryCount < MAX_RETRIES) {
              console.log(`Retrying upload for ${file.originalname}...`);
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }

        if (result) {
          console.log(`✓ Successfully uploaded file ${file.originalname} to Cloudinary`);
          successCount++;
          
          // Save metadata to database
          const mediaId = await saveMediaMetadata(
            result,
            entityType,
            entityId
          );
          
          // Add to results
          uploadResults.push({
            id: mediaId,
            publicId: result.public_id,
            originalName: file.originalname,
            url: result.secure_url,
            resourceType: result.resource_type,
            type: result.resource_type,
            format: result.format,
            width: result.width,
            height: result.height,
            duration: result.duration,
            size: result.bytes
          });
        } else {
          console.error(`✗ Failed to upload file ${file.originalname} after ${MAX_RETRIES} attempts`);
          failCount++;
        }
      } catch (fileError) {
        console.error(`Error processing file:`, fileError);
        failCount++;
      } finally {
        // Clean up temp file regardless of success/failure
        try {
          if (file && file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`Cleaned up temp file: ${file.path}`);
          }
        } catch (cleanupErr) {
          console.error(`Failed to remove temp file ${file.path}:`, cleanupErr);
        }
      }
    }

    console.log(`Upload summary: ${successCount} successes, ${failCount} failures`);
    
    // Even if some files failed, return success with those that worked
    return res.status(200).json({
      success: true,
      message: `${uploadResults.length} file(s) uploaded successfully to Cloudinary${failCount > 0 ? `, ${failCount} file(s) failed` : ''}`,
      count: uploadResults.length,
      totalAttempted: files.length,
      files: uploadResults
    });
  } catch (err) {
    console.error('Unhandled error in pet media upload handler:', err);
    return res.status(500).json({
      success: false,
      message: 'Error processing uploaded files',
      error: String(err)
    });
  }
}

/**
 * Handler for uploading general files like service provider images - enhanced for mobile compatibility
 */
export async function handleGeneralFileUpload(req: Request, res: Response) {
  // Check authentication
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    // Detailed logging for request debugging
    console.log('=== GENERAL FILE UPLOAD REQUEST DETAILS ===');
    console.log('User agent:', req.headers['user-agent']);
    console.log('Content type:', req.headers['content-type']);
    console.log('Request body keys:', Object.keys(req.body || {}));
    
    // Find file in the request - handle both req.file and req.files structures
    let fileToProcess = null;
    
    // Case 1: Standard multer single file in req.file
    if (req.file) {
      console.log('Found file in req.file');
      fileToProcess = req.file;
    } 
    // Case 2: Check if it's in req.files (array)
    else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      console.log(`Found ${req.files.length} files in req.files array, using first one`);
      fileToProcess = req.files[0];
    }
    // Case 3: Check if it's in req.files (object)
    else if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
      // Get the first file from the first field
      const filesObj = req.files as Record<string, any>;
      const firstField = Object.keys(filesObj)[0];
      if (firstField) {
        const fieldFiles = filesObj[firstField];
        if (Array.isArray(fieldFiles) && fieldFiles.length > 0) {
          fileToProcess = fieldFiles[0];
        } else if (fieldFiles) {
          fileToProcess = fieldFiles;
        }
        console.log(`Found file in req.files object under key '${firstField}'`);
      }
    }
    
    // Check if we found a file
    if (!fileToProcess) {
      console.error('No file found in the request');
      return res.status(400).json({ 
        success: false, 
        message: 'No file was uploaded. Please ensure the file input has the correct name in your form.' 
      });
    }
    
    // Log file details for debugging
    console.log('File details:', {
      fieldname: fileToProcess.fieldname,
      originalname: fileToProcess.originalname || 'unnamed-file',
      encoding: fileToProcess.encoding,
      mimetype: fileToProcess.mimetype,
      size: fileToProcess.size,
      path: fileToProcess.path
    });
    
    // Validate file
    if (!fileToProcess.path || !fs.existsSync(fileToProcess.path)) {
      console.error(`File not found on disk: ${fileToProcess.path}`);
      return res.status(400).json({ 
        success: false, 
        message: 'Uploaded file not found on server. Please try again.' 
      });
    }
    
    // Get entity information
    const entityType = req.body.entityType || 'general';
    const entityId = req.body.entityId ? parseInt(req.body.entityId) : undefined;
    console.log(`Entity info: type=${entityType}, id=${entityId || 'undefined'}`);

    // Detect if it's an image or video based on mimetype
    const mediaType = fileToProcess.mimetype && fileToProcess.mimetype.startsWith('video/') 
      ? MediaType.VIDEO 
      : MediaType.IMAGE;
    
    console.log(`Detected media type: ${mediaType}`);
    
    // Upload to Cloudinary with retry mechanism
    let result = null;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    
    while (!result && retryCount < MAX_RETRIES) {
      try {
        console.log(`Upload attempt ${retryCount + 1} for ${fileToProcess.originalname}`);
        
        result = await cloudinaryService.uploadMedia(
          fileToProcess.path,
          entityType as 'pet' | 'breed' | 'provider' | 'general',
          entityId,
          fileToProcess.originalname,
          mediaType
        );
      } catch (uploadError) {
        console.error(`Attempt ${retryCount + 1} failed:`, uploadError);
        retryCount++;
        
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying upload...`);
          // Wait between retries to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // Check result
    if (!result) {
      console.error(`Failed to upload file after ${MAX_RETRIES} attempts`);
      return res.status(500).json({
        success: false,
        message: `Failed to upload file to Cloudinary after ${MAX_RETRIES} attempts. Please try again later.`
      });
    }
    
    console.log(`✓ Successfully uploaded file to Cloudinary. Public ID: ${result.public_id}`);

    // Save metadata to database
    const mediaId = await saveMediaMetadata(result, entityType, entityId);
    console.log(`Saved media metadata to database with ID: ${mediaId}`);

    try {
      // Clean up temp file regardless of success/failure
      if (fileToProcess.path && fs.existsSync(fileToProcess.path)) {
        fs.unlinkSync(fileToProcess.path);
        console.log(`Cleaned up temp file: ${fileToProcess.path}`);
      }
    } catch (cleanupErr) {
      console.error(`Failed to clean up temp file: ${fileToProcess.path}`, cleanupErr);
      // Continue regardless of cleanup success
    }

    // Return success response with file details
    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully to Cloudinary',
      id: mediaId,
      publicId: result.public_id,
      url: result.secure_url,
      originalName: fileToProcess.originalname,
      width: result.width,
      height: result.height,
      duration: result.duration,
      resourceType: result.resource_type,
      type: result.resource_type,
      format: result.format,
      size: result.bytes
    });
  } catch (err) {
    console.error('Unhandled error in general file upload handler:', err);
    return res.status(500).json({
      success: false,
      message: 'Error processing uploaded file',
      error: String(err)
    });
  }
}