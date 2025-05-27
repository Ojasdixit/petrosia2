import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  ANY = 'auto'
}

export interface MediaMetadata {
  id?: number;
  public_id: string;           // Cloudinary public ID
  original_filename?: string;  // Original filename
  url: string;                 // Cloudinary URL
  secure_url: string;          // Cloudinary secure URL
  resource_type: string;       // 'image' or 'video'
  format: string;              // File extension (jpg, png, mp4, etc.)
  width?: number;              // For images and videos
  height?: number;             // For images and videos
  bytes: number;               // File size in bytes
  duration?: number;           // For videos only (in seconds)
  entity_type: string;         // 'pet', 'breed', 'provider', etc.
  entity_id?: number;          // ID of the related entity (petId, breedId, etc.)
  created_at?: Date;           // When the media was uploaded
}

/**
 * Final Cloudinary Service implementation that tries multiple approaches
 */
export class CloudinaryService {
  private cloudName: string;
  private apiKey: string;
  private apiSecret: string;
  private uploadPreset: string;
  
  constructor() {
    // Hardcoded fallback values (only used if environment variables are missing)
    const DEFAULT_CLOUD_NAME = 'djxv1usyv';
    const DEFAULT_API_KEY = '879183339952735';
    const DEFAULT_API_SECRET = 'A2VekLGfqpFZIcGfBW-NfQbDlKw';
    const DEFAULT_UPLOAD_PRESET = 'ml_default';
    
    // First try CLOUDINARY_URL format as it's most reliable
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    if (cloudinaryUrl) {
      try {
        console.log('Found CLOUDINARY_URL, parsing...');
        const match = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
        if (match) {
          this.apiKey = match[1];
          this.apiSecret = match[2];
          this.cloudName = match[3];
          console.log(`Successfully parsed CLOUDINARY_URL for cloud: ${this.cloudName}`);
        } else {
          console.warn('CLOUDINARY_URL format incorrect, falling back to individual variables');
        }
      } catch (error) {
        console.error('Failed to parse CLOUDINARY_URL:', error);
      }
    }
    
    // If CLOUDINARY_URL didn't work, try individual environment variables
    if (!this.cloudName || !this.apiKey || !this.apiSecret) {
      console.log('Using individual environment variables for Cloudinary credentials');
      this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;
      this.apiKey = process.env.CLOUDINARY_API_KEY || DEFAULT_API_KEY;
      this.apiSecret = process.env.CLOUDINARY_API_SECRET || DEFAULT_API_SECRET;
    }
    
    // Always get upload preset separately, as it's not part of CLOUDINARY_URL
    this.uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || DEFAULT_UPLOAD_PRESET;
    
    console.log('=== CloudinaryService Initialized ===');
    console.log(`- Cloud name: ${this.cloudName}`);
    console.log(`- API key: ${this.apiKey ? this.apiKey.substring(0, 5) + '...' : 'MISSING'}`);
    console.log(`- API secret: ${this.apiSecret ? 'PRESENT' : 'MISSING'}`);
    console.log(`- Upload preset: ${this.uploadPreset}`);
    
    // Validate that we have the minimum required credentials
    if (!this.cloudName || !this.apiKey) {
      console.error('WARNING: Missing critical Cloudinary credentials. Local fallback will be used.');
    }
    
    // Ensure media directories exist for fallback
    this.ensureMediaDirectoriesExist();
  }
  
  /**
   * Ensure all media directories for fallback storage exist
   */
  private ensureMediaDirectoriesExist() {
    const mediaDir = path.join(process.cwd(), '.data', 'media');
    const imageDirs = ['pet', 'breed', 'provider', 'general'].map(dir => 
      path.join(mediaDir, 'images', dir)
    );
    const videoDirs = ['pet', 'breed', 'provider', 'general'].map(dir => 
      path.join(mediaDir, 'videos', dir)
    );
    
    [...imageDirs, ...videoDirs].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    const directories = [
      path.join(process.cwd(), '.data', 'media'),
      path.join(process.cwd(), '.data', 'uploads'),
      path.join(process.cwd(), 'public', 'uploads'),
      path.join(process.cwd(), 'uploads')
    ];
    
    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    console.log('Media serving paths configured:');
    directories.forEach(dir => console.log(`- ${dir}`));
  }
  
  /**
   * Upload media with multiple approaches
   */
  async uploadMedia(
    filePath: string, 
    entityType: 'pet' | 'breed' | 'provider' | 'general',
    entityId?: number,
    originalFilename?: string,
    mediaType: MediaType = MediaType.ANY
  ): Promise<MediaMetadata | null> {
    console.log(`Starting Cloudinary upload sequence...`);
    
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return null;
      }
      
      // Generate folder and public_id
      const folder = `petrosia/${entityType}${entityId ? '/' + entityId : ''}`;
      const uniqueId = generateUUID();
      const publicId = `${folder}/${uniqueId}`;
      
      console.log(`Using public_id: ${publicId}`);
      
      // Determine resource type based on file
      let resourceType: 'image' | 'video' | 'auto' = 'auto';
      
      if (mediaType !== MediaType.ANY) {
        resourceType = mediaType as 'image' | 'video';
      } else if (originalFilename) {
        const ext = path.extname(originalFilename).toLowerCase();
        if (ext.match(/\.(mp4|mov|avi)$/i)) {
          resourceType = 'video';
        } else {
          resourceType = 'image';
        }
      }
      
      console.log(`Resource type: ${resourceType}`);
      
      // Read file data
      const fileBuffer = fs.readFileSync(filePath);
      
      // Special handling for video files (especially from mobile)
      if (resourceType === 'video') {
        console.log("📹 VIDEO DETECTED - Using specialized video upload handling");
        
        try {
          // For videos, use auto upload with optimized parameters for better performance
          console.log("Trying optimized video upload via auto endpoint...");
          const formData = new FormData();
          formData.append('file', fileBuffer, originalFilename || 'video.mp4');
          formData.append('upload_preset', this.uploadPreset);
          formData.append('resource_type', 'auto');
          formData.append('tags', 'petrosia,video');
          
          // Performance optimizations
          formData.append('eager_async', 'true');        // Process transformations asynchronously
          formData.append('eager_notification_url', ''); // No notification needed for transformations
          formData.append('overwrite', 'true');          // Allow overwriting of identical public_ids
          
          // Simplified transformations for better mobile performance
          formData.append('transformation', 'q_auto');   // Automatic quality optimization
          
          const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/auto/upload`;
          console.log(`Optimized video upload URL: ${uploadUrl}`);
          
          const result = await this.uploadToCloudinary(uploadUrl, formData);
          console.log("Video upload succeeded!");
          return result;
        } catch (error) {
          console.log(`Video upload failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      
      // Regular files proceed with standard approach sequence
      let result;
      
      // ============ Approach 1: Unsigned Upload (Now Configured) ============
      try {
        console.log("Trying approach 1: Unsigned upload with preset...");
        result = await this.tryUnsignedUpload(fileBuffer, publicId, resourceType, originalFilename);
        console.log("Approach 1 succeeded!");
        return result;
      } catch (error) {
        console.log(`Approach 1 failed: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // ============ Approach 2: Signed Upload as Fallback ============
      try {
        console.log("Trying approach 2: Signed upload...");
        result = await this.trySignedUpload(fileBuffer, publicId, resourceType, originalFilename);
        console.log("Approach 2 succeeded!");
        return result;
      } catch (error) {
        console.log(`Approach 2 failed: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // If all attempts fail, fall back to local storage
      console.log('All Cloudinary attempts failed, falling back to local storage...');
      return this.storeLocalFile(
        filePath,
        entityType,
        entityId,
        originalFilename,
        mediaType
      );
    } catch (error) {
      console.error('Error in uploadMedia:', error);
      
      // If any upload fails, fallback to local file storage
      console.log('Falling back to local storage...');
      return this.storeLocalFile(
        filePath,
        entityType,
        entityId,
        originalFilename,
        mediaType
      );
    }
  }
  
  /**
   * Try signed upload approach - Updated for better mobile compatibility
   */
  private async trySignedUpload(
    fileBuffer: Buffer, 
    publicId: string, 
    resourceType: string,
    originalFilename?: string
  ): Promise<MediaMetadata> {
    console.log(`Starting signed upload for public_id: ${publicId}, resource_type: ${resourceType}`);
    
    // Generate timestamp in seconds
    const timestamp = Math.floor(Date.now() / 1000);
    console.log(`Timestamp: ${timestamp}`);
    
    // Create parameter object (must be in alphabetical order for Cloudinary)
    const params: Record<string, any> = {
      public_id: publicId,
      timestamp: timestamp.toString(),
      upload_preset: this.uploadPreset // Include upload_preset in the signature
    };
    
    // Building signature string in the exact format Cloudinary requires 
    let signatureString = '';
    Object.keys(params).sort().forEach(key => {
      signatureString += `${key}=${params[key]}&`;
    });
    // Remove trailing ampersand
    signatureString = signatureString.slice(0, -1);
    
    console.log(`Signature string: ${signatureString}`);
    
    // Generate signature
    const signature = crypto
      .createHash('sha1')
      .update(signatureString + this.apiSecret)
      .digest('hex');
    
    console.log(`Generated signature: ${signature}`);
    
    // Build multipart form data
    const formData = new FormData();
    formData.append('file', fileBuffer, originalFilename || 'file.png');
    formData.append('api_key', this.apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('public_id', publicId);
    
    // Adding upload_preset to help with mobile uploads
    formData.append('upload_preset', this.uploadPreset);
    
    // Upload URL
    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/upload`;
    console.log(`Upload URL: ${uploadUrl}`);
    
    // Perform upload
    return await this.uploadToCloudinary(uploadUrl, formData);
  }
  
  /**
   * Try unsigned upload approach - Optimized for mobile devices
   */
  private async tryUnsignedUpload(
    fileBuffer: Buffer, 
    publicId: string, 
    resourceType: string,
    originalFilename?: string
  ): Promise<MediaMetadata> {
    console.log(`Starting unsigned upload with preset for public_id: ${publicId}`);
    
    // Create a filename if not provided
    const fileName = originalFilename || `file.${resourceType === 'video' ? 'mp4' : 'png'}`;
    console.log(`Using filename: ${fileName}`);
    
    // For mobile uploads and larger files, use a simplified set of params
    // Only include the minimum necessary parameters for unsigned uploads
    const formData = new FormData();
    formData.append('file', fileBuffer, fileName);
    formData.append('upload_preset', this.uploadPreset);
    
    // For videos, make sure resource_type is explicitly set to video
    if (resourceType === 'video') {
      formData.append('resource_type', 'video');
    }
    
    // Add tags for organization and searchability in Cloudinary
    formData.append('tags', 'petrosia');
    
    // Upload URL with auto detection for resource type
    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/auto/upload`;
    console.log(`Unsigned upload URL: ${uploadUrl}`);
    
    // Perform upload
    return await this.uploadToCloudinary(uploadUrl, formData);
  }
  
  /**
   * Store file locally as fallback
   */
  private async storeLocalFile(
    filePath: string,
    entityType: 'pet' | 'breed' | 'provider' | 'general',
    entityId?: number,
    originalFilename?: string,
    mediaType: MediaType = MediaType.ANY
  ): Promise<MediaMetadata> {
    console.log('Using local storage as fallback');
    
    // Use .data directory for persistent storage
    const uploadsDir = path.join(process.cwd(), '.data', 'media');
    
    // Determine resource type and format
    let resourceType = 'image';
    let format = 'png';
    
    if (originalFilename) {
      const fileExt = path.extname(originalFilename).toLowerCase();
      if (fileExt.match(/\.(mp4|mov|avi)$/i)) {
        resourceType = 'video';
        format = fileExt.substring(1);
      } else if (fileExt) {
        format = fileExt.substring(1);
      }
    }
    
    // Generate folder structure and filename
    const subDir = resourceType === 'image' ? 'images' : 'videos';
    const entityDir = path.join(uploadsDir, subDir, entityType);
    
    // Ensure directory exists
    if (!fs.existsSync(entityDir)) {
      fs.mkdirSync(entityDir, { recursive: true });
    }
    
    const uniqueId = generateUUID();
    const destFilename = `${uniqueId}.${format}`;
    const destPath = path.join(entityDir, destFilename);
    
    // Copy the file to persistent storage
    fs.copyFileSync(filePath, destPath);
    
    // Generate public ID and URLs
    const publicId = `${entityType}/${uniqueId}`;
    const relativeUrl = `/uploads/${subDir}/${entityType}/${destFilename}`;
    
    // Get file stats
    const stats = fs.statSync(destPath);
    
    console.log(`Local storage successful: ${destPath}`);
    console.log(`File accessible at: ${relativeUrl}`);
    
    // Create metadata
    return {
      public_id: publicId,
      original_filename: originalFilename,
      url: relativeUrl,
      secure_url: relativeUrl,
      resource_type: resourceType,
      format: format,
      width: 800, // Simulated width for images
      height: 600, // Simulated height for images
      bytes: stats.size,
      entity_type: entityType,
      entity_id: entityId,
      created_at: new Date()
    };
  }
  
  /**
   * Upload file to Cloudinary
   */
  private async uploadToCloudinary(url: string, formData: FormData): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('Uploading to Cloudinary URL:', url);
      console.log('Form data headers:', formData.getHeaders());
      
      const req = https.request(
        url, 
        { 
          method: 'POST',
          headers: formData.getHeaders()
        },
        (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            console.log(`Cloudinary response status: ${res.statusCode}`);
            
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              try {
                const result = JSON.parse(data);
                console.log('Cloudinary upload successful!');
                console.log('Cloudinary response:', JSON.stringify(result, null, 2));
                
                const metadata: MediaMetadata = {
                  public_id: result.public_id,
                  original_filename: result.original_filename,
                  url: result.url,
                  secure_url: result.secure_url,
                  resource_type: result.resource_type,
                  format: result.format,
                  width: result.width,
                  height: result.height,
                  bytes: result.bytes,
                  duration: result.resource_type === 'video' ? result.duration : undefined,
                  entity_type: result.public_id.split('/')[0] || 'general', // Changed index from 1 to 0
                  entity_id: result.public_id.includes('/') ? parseInt(result.public_id.split('/')[1]) : undefined, // Changed index from 2 to 1
                  created_at: new Date()
                };
                
                resolve(metadata);
              } catch (error) {
                console.error('Failed to parse response:', data);
                reject(new Error(`Failed to parse response: ${data}`));
              }
            } else {
              console.error(`Upload failed with status ${res.statusCode}:`, data);
              reject(new Error(`Upload failed with status ${res.statusCode}: ${data}`));
            }
          });
        }
      );
      
      req.on('error', (error) => {
        console.error('Request error:', error);
        reject(error);
      });
      
      formData.pipe(req);
    });
  }
  
  /**
   * Delete media from Cloudinary
   */
  async deleteMedia(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<boolean> {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      
      // Create signature string
      const stringToSign = `public_id=${publicId}&timestamp=${timestamp}`;
      
      // Generate signature
      const signature = crypto
        .createHash('sha1')
        .update(stringToSign + this.apiSecret)
        .digest('hex');
      
      // Create form data
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('api_key', this.apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      
      // Destroy URL
      const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/destroy`;
      
      const response = await this.uploadToCloudinary(url, formData);
      return response && response.result === 'ok';
    } catch (error) {
      console.error('Error in deleteMedia:', error);
      return false;
    }
  }
  
  /**
   * Get URL for a Cloudinary resource
   */
  getSignedUrl(publicId: string, options: Record<string, any> = {}): string {
    try {
      // First check if this is a local file path
      if (publicId.startsWith('/uploads/')) {
        return publicId;
      }
      
      const baseUrl = `https://res.cloudinary.com/${this.cloudName}`;
      const resourceType = options.resource_type || 'image';
      
      // Apply transformations if provided
      const transformation = options.transformation || '';
      
      // Generate the URL
      const url = `${baseUrl}/${resourceType}/upload/${transformation}/${publicId}`;
      
      return url;
    } catch (error) {
      console.error('Error generating URL:', error);
      return '';
    }
  }
}

/**
 * Custom FormData implementation for Node.js
 */
class FormData {
  private boundary: string;
  private parts: { name: string; value: any; filename?: string; contentType?: string }[] = [];

  constructor() {
    this.boundary = `----FormBoundary${Math.random().toString(16).substring(2)}`;
  }

  append(name: string, value: any, filename?: string): void {
    let contentType;
    
    if (value instanceof Buffer) {
      contentType = 'application/octet-stream';
      if (filename) {
        const ext = path.extname(filename).toLowerCase();
        if (ext.match(/\.(jpe?g)$/i)) contentType = 'image/jpeg';
        else if (ext.match(/\.(png)$/i)) contentType = 'image/png';
        else if (ext.match(/\.(gif)$/i)) contentType = 'image/gif';
        else if (ext.match(/\.(mp4|avi|mov)$/i)) contentType = 'video/mp4';
      }
    }
    
    this.parts.push({
      name,
      value,
      filename,
      contentType
    });
  }

  getHeaders(): { [key: string]: string } {
    return {
      'Content-Type': `multipart/form-data; boundary=${this.boundary}`
    };
  }

  pipe(stream: any): void {
    const buffers = this.getBuffers();
    for (const buffer of buffers) {
      stream.write(buffer);
    }
    stream.end();
  }

  getBuffers(): Buffer[] {
    const buffers: Buffer[] = [];
    
    // Add each part to the form
    for (const part of this.parts) {
      const headers = [`--${this.boundary}\r\n`];
      headers.push(`Content-Disposition: form-data; name="${part.name}"`);
      
      if (part.filename) {
        headers[headers.length - 1] += `; filename="${part.filename}"`;
      }
      
      headers.push('\r\n');
      
      if (part.contentType) {
        headers.push(`Content-Type: ${part.contentType}\r\n`);
      }
      
      headers.push('\r\n');
      
      buffers.push(Buffer.from(headers.join('')));
      
      if (part.value instanceof Buffer) {
        buffers.push(part.value);
      } else {
        buffers.push(Buffer.from(String(part.value)));
      }
      
      buffers.push(Buffer.from('\r\n'));
    }
    
    // Add the closing boundary
    buffers.push(Buffer.from(`--${this.boundary}--\r\n`));
    
    return buffers;
  }
}

// Create singleton instance
export const cloudinaryService = new CloudinaryService();
