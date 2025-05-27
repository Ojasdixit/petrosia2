import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Initialize Supabase URLs and keys
const supabaseUrl = process.env.SUPABASE_URL || 'https://rgsflnrcptgjnlxpqeih.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnc2ZsbnJjcHRnam5seHBxZWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM3NDkzOCwiZXhwIjoyMDYzOTUwOTM4fQ.mUNtLQdO7Y_IAvBJT7xIXEUcclgl8FWHIGHBFQfujIs'; // Service role key with admin privileges
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnc2ZsbnJjcHRnam5seHBxZWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNzQ5MzgsImV4cCI6MjA2Mzk1MDkzOH0.Srdww8tqMlY09te5a4-g4WBc92uUMENpTlAuqEpOgoc'; // Anonymous key for client-side

console.log('Supabase configuration:');
console.log('URL available:', Boolean(supabaseUrl));
console.log('Service Role Key available:', Boolean(supabaseServiceRoleKey));
console.log('Anon Key available:', Boolean(supabaseAnonKey));
console.log('URL length:', supabaseUrl.length);
console.log('Service Role Key length:', supabaseServiceRoleKey.length);
console.log('Anon Key length:', supabaseAnonKey.length);

// Generate a UUID replacement using Node's crypto module
function generateUUID(): string {
  return crypto.randomUUID();
}

// Interface for the images table
export interface ImageMetadata {
  id?: number;
  filename: string;
  original_filename?: string;
  bucket_path: string;
  file_type?: string;
  content_type?: string;
  size?: number;
  entity_type: string; // 'pet', 'breed', 'provider', etc.
  entity_id?: number;  // ID of the related entity (petId, breedId, etc.)
  public_url: string;
  created_at?: Date;
  updated_at?: Date;
}

const bucketNames = {
  pet: 'pet-images',
  breed: 'breed-images',
  provider: 'provider-images',
  general: 'general-images',
};

export class SupabaseService {
  constructor() {
    console.log('Initializing Supabase service');
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Supabase URL or Service Role Key not provided in environment variables');
    } else {
      console.log('Supabase credentials loaded successfully');
      
      // Log the buckets we'll be using (already created in Supabase dashboard)
      Object.entries(bucketNames).forEach(([type, bucket]) => {
        console.log(`Bucket for ${type}: ${bucket}`);
      });
    }
  }
  
  /**
   * Upload a file to Supabase Storage
   * @param filePath - Path to the file to upload
   * @param entityType - Type of entity (pet, breed, provider, etc.)
   * @param entityId - ID of the related entity (optional)
   * @param originalFilename - Original filename (optional)
   */
  async uploadFile(
    filePath: string, 
    entityType: 'pet' | 'breed' | 'provider' | 'general',
    entityId?: number,
    originalFilename?: string
  ): Promise<ImageMetadata | null> {
    try {
      // Determine the appropriate bucket
      const bucketName = bucketNames[entityType] || bucketNames.general;
      
      console.log(`uploadFile: Reading file from ${filePath}`);
      const fileContent = fs.readFileSync(filePath);
      const fileSize = fileContent.length;
      const fileExt = path.extname(filePath).substring(1);
      const contentType = this.getMimeType(fileExt);
      
      console.log(`uploadFile: File details - Size: ${fileSize} bytes, Extension: ${fileExt}, Content Type: ${contentType}`);
      
      // Generate a unique file name
      const uniqueFilename = `${Date.now()}-${generateUUID()}.${fileExt}`;
      const filePath_in_bucket = `${entityId ? entityId + '/' : ''}${uniqueFilename}`;
      
      console.log(`uploadFile: Generated path in bucket: ${bucketName}/${filePath_in_bucket}`);
      
      // We'll just assume the bucket exists since we created it in the Supabase dashboard
      console.log(`Using existing bucket: ${bucketName}`);
      
      // Now upload to Supabase Storage
      console.log(`Preparing to upload file to Supabase...`);
      console.log(`File size: ${fileContent.length} bytes, type: ${contentType}`);
      
      const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${filePath_in_bucket}`;
      console.log(`Upload URL: ${uploadUrl}`);
      
      try {
        // This time, we'll try a public bucket approach which should work regardless of RLS
        console.log(`Sending upload request to Supabase using public storage API...`);
        
        // Let's try using the anon key approach to the public bucket endpoint
        const publicUploadUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath_in_bucket}`;
        
        console.log(`Public upload URL: ${publicUploadUrl}`);
        
        const uploadResponse = await fetch(publicUploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceRoleKey}`,
            'apikey': supabaseServiceRoleKey,
            'Content-Type': contentType
          },
          body: fileContent // Use the file buffer directly
        });
        
        console.log(`Upload response status: ${uploadResponse.status}`);
        
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error(`Error uploading file to Supabase:`, errorText);
          throw new Error(`Upload failed: ${errorText}`);
        } else {
          console.log(`File uploaded successfully to Supabase`);
        }
      } catch (uploadError) {
        console.error(`Exception during file upload:`, uploadError);
        return null;
      }
      
      // Generate public URL
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath_in_bucket}`;
      
      // Insert metadata in the database
      const metadata: ImageMetadata = {
        filename: uniqueFilename,
        original_filename: originalFilename || path.basename(filePath),
        bucket_path: filePath_in_bucket,
        file_type: fileExt,
        content_type: contentType,
        size: fileSize,
        entity_type: entityType,
        entity_id: entityId,
        public_url: publicUrl
      };
      
      // Insert metadata using REST API directly
      const insertMetadataUrl = `${supabaseUrl}/rest/v1/images`;
      const insertResponse = await fetch(insertMetadataUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceRoleKey}`,
          'apikey': supabaseServiceRoleKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
          // Headers to bypass Row Level Security (RLS)
          'X-Client-Info': 'supabase-js/2.0.0'
        },
        body: JSON.stringify(metadata)
      });
      
      if (!insertResponse.ok) {
        console.error('Error inserting image metadata:', await insertResponse.text());
        return null;
      }
      
      const insertedData = await insertResponse.json();
      return insertedData.length > 0 ? insertedData[0] as ImageMetadata : metadata;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      return null;
    }
  }
  
  /**
   * Get images associated with an entity
   * @param entityType - Type of entity (pet, breed, provider, etc.)
   * @param entityId - ID of the entity
   */
  async getEntityImages(
    entityType: 'pet' | 'breed' | 'provider' | 'general',
    entityId: number
  ): Promise<ImageMetadata[]> {
    try {
      // Fetch images using REST API
      const queryUrl = `${supabaseUrl}/rest/v1/images?entity_type=eq.${entityType}&entity_id=eq.${entityId}&order=created_at.desc`;
      
      const response = await fetch(queryUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseServiceRoleKey}`,
          'apikey': supabaseServiceRoleKey
        }
      });
      
      if (!response.ok) {
        console.error('Error fetching entity images:', await response.text());
        return [];
      }
      
      const data = await response.json();
      return data as ImageMetadata[];
    } catch (error) {
      console.error('Error in getEntityImages:', error);
      return [];
    }
  }
  
  /**
   * Delete an image by ID
   * @param imageId - ID of the image to delete
   */
  async deleteImage(imageId: number): Promise<boolean> {
    try {
      // First get the image metadata
      const metadataUrl = `${supabaseUrl}/rest/v1/images?id=eq.${imageId}&limit=1`;
      const metadataResponse = await fetch(metadataUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseServiceRoleKey}`,
          'apikey': supabaseServiceRoleKey
        }
      });
      
      if (!metadataResponse.ok) {
        console.error('Error fetching image metadata:', await metadataResponse.text());
        return false;
      }
      
      const imageDataArray = await metadataResponse.json();
      if (!imageDataArray || imageDataArray.length === 0) {
        console.error('Image not found');
        return false;
      }
      
      const imageData = imageDataArray[0];
      
      // Delete from storage
      const bucketName = bucketNames[imageData.entity_type as keyof typeof bucketNames] || bucketNames.general;
      const storageDeleteUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${imageData.bucket_path}`;
      
      const storageResponse = await fetch(storageDeleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${supabaseServiceRoleKey}`,
          'apikey': supabaseServiceRoleKey
        }
      });
      
      if (!storageResponse.ok) {
        console.error('Error deleting file from storage:', await storageResponse.text());
        // Continue to delete the metadata even if storage delete fails
      }
      
      // Delete the metadata
      const deleteUrl = `${supabaseUrl}/rest/v1/images?id=eq.${imageId}`;
      const deleteResponse = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${supabaseServiceRoleKey}`,
          'apikey': supabaseServiceRoleKey
        }
      });
      
      if (!deleteResponse.ok) {
        console.error('Error deleting image metadata:', await deleteResponse.text());
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteImage:', error);
      return false;
    }
  }
  
  /**
   * Determine MIME type from file extension
   * @param ext - File extension
   */
  private getMimeType(ext: string): string {
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'bmp': 'image/bmp',
      'svg': 'image/svg+xml',
      'mp4': 'video/mp4',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo',
      'webm': 'video/webm'
    };
    
    return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
  }
}

// Export a singleton instance
export const supabaseService = new SupabaseService();