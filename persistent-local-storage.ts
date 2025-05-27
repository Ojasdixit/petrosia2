import fs from 'fs';
import path from 'path';

/**
 * This script creates a more persistent solution using Replit's .data directory
 * which survives deployments and restarts.
 */
async function setupPersistentStorage() {
  console.log('Setting up persistent storage using Replit .data directory...');
  
  const servicePath = path.join(process.cwd(), 'server', 'cloudinary-service.ts');
  
  // Create a simulation implementation with persistent storage
  const newImplementation = `import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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
 * Persistent storage simulation of Cloudinary service
 * This stores files in the .data directory which survives Replit deployments
 */
export class CloudinaryService {
  private uploadsDir: string;
  private baseUrl: string;
  
  constructor() {
    // Use .data directory for persistent storage
    this.uploadsDir = path.join(process.cwd(), '.data', 'media');
    this.baseUrl = '/uploads';
    
    console.log('*** USING PERSISTENT STORAGE SIMULATION FOR CLOUDINARY ***');
    console.log('Files will be stored in .data/media directory which survives deployments');
    console.log('URLs will point to our own server');
    
    // Ensure directories exist
    ['images', 'videos'].forEach(dir => {
      const fullPath = path.join(this.uploadsDir, dir);
      if (!fs.existsSync(fullPath)) {
        try {
          fs.mkdirSync(fullPath, { recursive: true });
          console.log(\`Created directory: \${fullPath}\`);
        } catch (error) {
          console.error(\`Failed to create directory \${fullPath}:\`, error);
        }
      }
    });
    
    // Create symlinks for access via the web server
    const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(publicUploadsDir)) {
      fs.mkdirSync(publicUploadsDir, { recursive: true });
    }
    
    ['images', 'videos'].forEach(dir => {
      const targetDir = path.join(this.uploadsDir, dir);
      const linkDir = path.join(publicUploadsDir, dir);
      
      // Create symlink if it doesn't exist
      try {
        if (!fs.existsSync(linkDir)) {
          fs.symlinkSync(targetDir, linkDir, 'dir');
          console.log(\`Created symlink from \${targetDir} to \${linkDir}\`);
        }
      } catch (error) {
        console.error(\`Failed to create symlink for \${dir}:\`, error);
        
        // If symlink fails, copy existing files to .data directory
        if (fs.existsSync(linkDir) && !fs.lstatSync(linkDir).isSymbolicLink()) {
          try {
            const files = fs.readdirSync(linkDir);
            for (const file of files) {
              const sourcePath = path.join(linkDir, file);
              const destPath = path.join(targetDir, file);
              if (!fs.existsSync(destPath)) {
                fs.copyFileSync(sourcePath, destPath);
                console.log(\`Copied \${sourcePath} to \${destPath}\`);
              }
            }
          } catch (copyError) {
            console.error(\`Failed to copy files from \${linkDir}:\`, copyError);
          }
        }
      }
    });
  }
  
  /**
   * Store file in persistent directory and return metadata
   */
  async uploadMedia(
    filePath: string, 
    entityType: 'pet' | 'breed' | 'provider' | 'general',
    entityId?: number,
    originalFilename?: string,
    mediaType: MediaType = MediaType.ANY
  ): Promise<MediaMetadata | null> {
    try {
      console.log('Storing media in persistent .data directory...');
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(\`File not found: \${filePath}\`);
        return null;
      }
      
      // Generate a unique ID
      const uniqueId = generateUUID();
      
      // Determine resource type
      let resourceType = 'image';
      let format = 'png';
      
      if (originalFilename) {
        const fileExt = path.extname(originalFilename).toLowerCase();
        if (fileExt.match(/\\.(mp4|mov|avi)$/i)) {
          resourceType = 'video';
          format = fileExt.substring(1);
        } else if (fileExt) {
          format = fileExt.substring(1);
        }
      }
      
      // Generate folder structure and filename
      const subDir = resourceType === 'image' ? 'images' : 'videos';
      const entityDir = path.join(this.uploadsDir, subDir, entityType);
      if (!fs.existsSync(entityDir)) {
        fs.mkdirSync(entityDir, { recursive: true });
      }
      
      const destFilename = \`\${uniqueId}.\${format}\`;
      const destPath = path.join(entityDir, destFilename);
      
      // Copy the file to persistent storage
      fs.copyFileSync(filePath, destPath);
      
      // Generate public ID and URLs
      const publicId = \`\${entityType}/\${uniqueId}\`;
      const relativeUrl = \`\${this.baseUrl}/\${subDir}/\${entityType}/\${destFilename}\`;
      
      // Get file stats
      const stats = fs.statSync(destPath);
      
      console.log(\`Persistent storage successful: \${destPath}\`);
      console.log(\`File accessible at: \${relativeUrl}\`);
      
      // Create metadata
      const metadata: MediaMetadata = {
        public_id: publicId,
        original_filename: originalFilename,
        url: relativeUrl,
        secure_url: relativeUrl,
        resource_type: resourceType,
        format: format,
        width: 800, // Simulated width
        height: 600, // Simulated height
        bytes: stats.size,
        entity_type: entityType,
        entity_id: entityId,
        created_at: new Date()
      };
      
      return metadata;
    } catch (error) {
      console.error('Error in simulated uploadMedia:', error);
      return null;
    }
  }
  
  /**
   * Delete file from persistent storage
   */
  async deleteMedia(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<boolean> {
    try {
      const parts = publicId.split('/');
      const entityType = parts[0];
      const uniqueId = parts[1];
      
      // Try to find the file with any extension
      const subDir = resourceType === 'image' ? 'images' : 'videos';
      const searchDir = path.join(this.uploadsDir, subDir, entityType);
      
      if (fs.existsSync(searchDir)) {
        const files = fs.readdirSync(searchDir);
        const fileToDelete = files.find(file => file.startsWith(uniqueId + '.'));
        
        if (fileToDelete) {
          const filePath = path.join(searchDir, fileToDelete);
          fs.unlinkSync(filePath);
          console.log(\`Deleted file: \${filePath}\`);
          return true;
        }
      }
      
      console.log(\`No file found to delete for publicId: \${publicId}\`);
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
  
  /**
   * Get URL for media file
   */
  getSignedUrl(publicId: string, options: Record<string, any> = {}): string {
    try {
      const parts = publicId.split('/');
      const entityType = parts[0];
      const uniqueId = parts[1];
      const format = options.format || 'png';
      const resourceType = options.resource_type || 'image';
      
      const subDir = resourceType === 'image' ? 'images' : 'videos';
      const relativeUrl = \`\${this.baseUrl}/\${subDir}/\${entityType}/\${uniqueId}.\${format}\`;
      
      return relativeUrl;
    } catch (error) {
      console.error('Error generating URL:', error);
      return '';
    }
  }
}

// Create singleton instance
export const cloudinaryService = new CloudinaryService();
`;

  fs.writeFileSync(servicePath, newImplementation, 'utf-8');
  
  console.log('Created persistent storage solution for Cloudinary service');
  console.log('Files will be stored in .data/media directory which survives deployments');
  console.log('Please restart the server for changes to take effect');
}

// Run the setup
setupPersistentStorage();