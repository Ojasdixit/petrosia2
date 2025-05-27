import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';
import querystring from 'querystring';

// Generate a UUID for unique file names using Node's crypto module
function generateUUID(): string {
  return crypto.randomUUID();
}

// Define media types for upload
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  ANY = 'auto'
}

// Define metadata structure for media files
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
  duration?: number;           // For videos only
  entity_type: string;         // 'pet', 'breed', 'provider', etc.
  entity_id?: number;          // ID of the related entity
  created_at?: Date;           // Creation timestamp
  updated_at?: Date;           // Last update timestamp
}

export class CloudinaryService {
  private cloudName: string;
  private apiKey: string;
  private apiSecret: string;
  private uploadPreset: string;
  private baseUrl: string;
  private secureBaseUrl: string;
  
  constructor() {
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'djxv1usyv';
    this.apiKey = process.env.CLOUDINARY_API_KEY || '';
    this.apiSecret = process.env.CLOUDINARY_API_SECRET || '';
    this.uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default';
    this.baseUrl = `http://api.cloudinary.com/v1_1/${this.cloudName}`;
    this.secureBaseUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}`;
    
    console.log('Cloudinary Service initialized');
    console.log('Cloud name:', this.cloudName);
    console.log('Upload preset:', this.uploadPreset);
    console.log('API key available:', Boolean(this.apiKey));
    console.log('API secret available:', Boolean(this.apiSecret));
  }
  
  /**
   * Upload a file to Cloudinary
   * @param filePath Path to the file to upload
   * @param folder Optional folder to organize assets
   * @param resourceType Type of resource (image, video, etc.)
   * @param publicId Optional custom public ID
   * @returns Promise resolving to media metadata
   */
  async uploadFile(
    filePath: string,
    folder?: string,
    resourceType: MediaType = MediaType.ANY,
    publicId?: string
  ): Promise<MediaMetadata | null> {
    try {
      console.log(`Uploading file: ${filePath}`);
      
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return null;
      }
      
      const fileContent = fs.readFileSync(filePath);
      const fileExt = path.extname(filePath).substring(1);
      const fileName = path.basename(filePath, path.extname(filePath));
      
      // Generate a unique public ID if not provided
      if (!publicId) {
        publicId = `${fileName}_${Date.now()}_${generateUUID()}`;
      }
      
      if (folder) {
        publicId = `${folder}/${publicId}`;
      }
      
      // Use signed upload with API key and secret
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const params: any = {
        timestamp,
        public_id: publicId,
        api_key: this.apiKey,
        upload_preset: this.uploadPreset
      };
      
      // Generate signature
      const signature = this.generateSignature(params);
      params.signature = signature;
      
      // Construct form data for upload
      const formData = new FormData();
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      
      // Add file data
      const blob = new Blob([fileContent]);
      formData.append('file', blob);
      
      // Upload to Cloudinary
      const uploadUrl = `${this.secureBaseUrl}/${resourceType}/upload`;
      
      return new Promise((resolve, reject) => {
        const req = https.request(
          uploadUrl,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          },
          (res) => {
            let data = '';
            res.on('data', (chunk) => {
              data += chunk;
            });
            
            res.on('end', () => {
              if (res.statusCode !== 200) {
                console.error(`Upload failed with status: ${res.statusCode}`);
                console.error(`Response: ${data}`);
                return reject(new Error(`Upload failed: ${data}`));
              }
              
              try {
                const result = JSON.parse(data);
                
                const metadata: MediaMetadata = {
                  public_id: result.public_id,
                  original_filename: fileName,
                  url: result.url,
                  secure_url: result.secure_url,
                  resource_type: result.resource_type,
                  format: result.format,
                  width: result.width,
                  height: result.height,
                  bytes: result.bytes,
                  duration: result.duration,
                  entity_type: folder || 'general',
                  entity_id: undefined,
                  created_at: new Date(),
                  updated_at: new Date()
                };
                
                resolve(metadata);
              } catch (error) {
                console.error('Failed to parse upload response:', error);
                reject(error);
              }
            });
          }
        );
        
        req.on('error', (error) => {
          console.error('Upload request error:', error);
          reject(error);
        });
        
        // Send form data
        formData.pipe(req);
      });
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  }
  
  /**
   * Delete a file from Cloudinary
   * @param publicId Public ID of the file to delete
   * @param resourceType Type of resource (image, video, etc.)
   * @returns Promise resolving to true if successful
   */
  async deleteFile(publicId: string, resourceType: MediaType = MediaType.IMAGE): Promise<boolean> {
    try {
      console.log(`Deleting file with public ID: ${publicId}`);
      
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const params: any = {
        timestamp,
        public_id: publicId,
        api_key: this.apiKey
      };
      
      // Generate signature
      const signature = this.generateSignature(params);
      params.signature = signature;
      
      // Create query string
      const queryString = querystring.stringify(params);
      
      // Delete from Cloudinary
      const deleteUrl = `${this.secureBaseUrl}/${resourceType}/destroy?${queryString}`;
      
      return new Promise((resolve, reject) => {
        const req = https.request(
          deleteUrl,
          {
            method: 'POST'
          },
          (res) => {
            let data = '';
            res.on('data', (chunk) => {
              data += chunk;
            });
            
            res.on('end', () => {
              if (res.statusCode !== 200) {
                console.error(`Delete failed with status: ${res.statusCode}`);
                console.error(`Response: ${data}`);
                return resolve(false);
              }
              
              try {
                const result = JSON.parse(data);
                resolve(result.result === 'ok');
              } catch (error) {
                console.error('Failed to parse delete response:', error);
                resolve(false);
              }
            });
          }
        );
        
        req.on('error', (error) => {
          console.error('Delete request error:', error);
          resolve(false);
        });
        
        req.end();
      });
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    }
  }
  
  /**
   * Generate a signed URL for a file
   * @param publicId Public ID of the file
   * @param options Transformation options
   * @returns Signed URL
   */
  generateSignedUrl(publicId: string, options: any = {}): string {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const params = {
      timestamp,
      public_id: publicId,
      ...options
    };
    
    // Generate signature
    const signature = this.generateSignature(params);
    
    // Construct signed URL
    const transformations = options.transformation ? `${options.transformation}/` : '';
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformations}s--${signature}--/${publicId}`;
  }
  
  /**
   * Generate a signature for Cloudinary API requests
   * @param params Parameters to include in the signature
   * @returns Signature string
   */
  private generateSignature(params: any): string {
    // Remove api_key from signature calculation
    const { api_key, ...signParams } = params;
    
    // Sort params alphabetically
    const sortedParams = Object.keys(signParams)
      .sort()
      .map(key => `${key}=${signParams[key]}`)
      .join('&');
    
    // Generate signature using HMAC SHA-256
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(sortedParams)
      .digest('hex');
  }
  
  /**
   * Upload media with multiple approaches - handles both images and videos
   * with fallback strategies for reliability
   * @param filePath Path to the file to upload
   * @param entityType Type of entity (pet, breed, provider, general)
   * @param entityId Optional ID of the entity
   * @param originalFilename Optional original filename
   * @param mediaType Type of media (image, video, auto)
   * @returns Promise resolving to media metadata
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
      
      // Use our existing uploadFile method which has all the functionality we need
      return this.uploadFile(filePath, folder, resourceType as MediaType, uniqueId);
    } catch (error) {
      console.error('Error in uploadMedia:', error);
      return null;
    }
  }
}

// Export singleton instance
export const cloudinaryService = new CloudinaryService();
