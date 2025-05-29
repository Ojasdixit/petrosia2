import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// Import service provider storage extensions
import "./storage-service-provider";
import { setupAuth } from "./auth";
import { 
  insertPetListingSchema, 
  insertAdoptionListingSchema, 
  insertDogBreedSchema, 
  insertEventRegistrationSchema,
  insertNewsArticleSchema,
  insertBlogPostSchema,
  insertServiceBookingSchema,
  blogPosts,
  AdoptionStatus, 
  NewsSource, 
  DogSize,
  RegistrationStatus,
  ServiceType,
  BookingStatus
} from "@shared/schema";
import { scheduleRssFeedFetching, fetchAllRssFeeds } from "./news-service";
import paymentRoutes from "./payment-routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
// Import the custom upload handlers
import { upload, handlePetMediaUpload, handleGeneralFileUpload } from './upload-handlers';
// Import image optimization middleware
import { imageOptimizerMiddleware } from './image-optimizer';

// Create a persistent uploads directory using a standard folder structure
const persistentUploadsDir = path.join(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(persistentUploadsDir)) {
  fs.mkdirSync(persistentUploadsDir, { recursive: true });
}

// Create a directory or symlink from the persistent directory to uploads to maintain compatibility
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  // On Windows, symlinks require admin privileges, so we'll just create a directory
  console.log('Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
  
  // Copy existing files from persistent directory if they exist
  if (fs.existsSync(persistentUploadsDir) && fs.readdirSync(persistentUploadsDir).length > 0) {
    console.log('Copying existing files from persistent directory...');
    fs.readdirSync(persistentUploadsDir).forEach(file => {
      const srcPath = path.join(persistentUploadsDir, file);
      const destPath = path.join(uploadsDir, file);
      if (fs.statSync(srcPath).isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }
} else if (!fs.lstatSync(uploadsDir).isSymbolicLink()) {
  // If uploads directory exists but is not a symlink, move its contents to persistent dir
  try {
    // Get contents of uploads directory
    const contents = fs.readdirSync(uploadsDir);

    // Move each file/folder to the persistent directory
    for (const item of contents) {
      const sourcePath = path.join(uploadsDir, item);
      const targetPath = path.join(persistentUploadsDir, item);

      // Skip if target already exists
      if (fs.existsSync(targetPath)) continue;

      // Move files and directories
      if (fs.lstatSync(sourcePath).isDirectory()) {
        fs.mkdirSync(targetPath, { recursive: true });
        const subContents = fs.readdirSync(sourcePath);
        for (const subItem of subContents) {
          fs.renameSync(
            path.join(sourcePath, subItem),
            path.join(targetPath, subItem)
          );
        }
      } else {
        fs.renameSync(sourcePath, targetPath);
      }
    }

    // Remove the uploads directory
    fs.rmdirSync(uploadsDir, { recursive: true });

    // Create the symlink
    fs.symlinkSync(persistentUploadsDir, uploadsDir, 'dir');
    console.log(`Created symlink from ${persistentUploadsDir} to ${uploadsDir}`);
  } catch (error) {
    console.error('Error migrating existing uploads to persistent storage:', error);
  }
}

// We're now using the upload configuration from upload-handlers.ts

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user is a seller
const isSeller = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user.role === "seller") {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Seller access required" });
};

// Middleware to check if user is an admin
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Admin access required" });
};

// Cache duration constants (in seconds)
const CACHE_DURATIONS = {
  STATIC: 60 * 60 * 24 * 30, // 30 days for static assets
  IMAGES: 60 * 60 * 24 * 7,  // 7 days for images
  SITEMAP: 60 * 60 * 24,     // 1 day for sitemaps
  DYNAMIC: 60 * 5            // 5 minutes for dynamic content
};

/**
 * Sets cache headers for static assets
 * @param maxAge Cache duration in seconds
 */
function setStaticCacheHeaders(maxAge: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip for development environment
    if (process.env.NODE_ENV === 'development') {
      return next();
    }
    
    // Set cache headers
    res.setHeader('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=86400`);
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Add image optimization route
  app.use('/optimized', imageOptimizerMiddleware);

  // Serve uploaded files from all possible locations with our data directory having highest priority
  app.use('/uploads', 
    setStaticCacheHeaders(CACHE_DURATIONS.IMAGES),
    express.static(path.join(process.cwd(), 'data', 'media'))
  );
  app.use('/uploads', 
    setStaticCacheHeaders(CACHE_DURATIONS.IMAGES),
    express.static(path.join(process.cwd(), 'data', 'uploads'))
  );
  app.use('/uploads', 
    setStaticCacheHeaders(CACHE_DURATIONS.IMAGES),
    express.static(path.join(process.cwd(), 'public', 'uploads'))
  );
  app.use('/uploads', 
    setStaticCacheHeaders(CACHE_DURATIONS.IMAGES),
    express.static(path.join(process.cwd(), 'uploads'))
  );

  // Directly serve favicon as SVG to avoid caching and file system issues
  app.get('/favicon.ico', (req, res) => {
    // Serve as SVG directly embedded in response
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Generate the Petrosia website logo as SVG directly from the website header code
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="transform: rotate(45deg);" fill="#ff6b00">
      <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"/>
    </svg>`;
    res.send(svgIcon);
  });
  
  // Serve XML sitemaps with proper content type
  app.get('/sitemap.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATIONS.SITEMAP}`);
    res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
  });
  
  app.get('/sitemap_index.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATIONS.SITEMAP}`);
    res.sendFile(path.join(process.cwd(), 'public', 'sitemap_index.xml'));
  });
  
  // Category-specific sitemaps
  app.get('/services.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATIONS.SITEMAP}`);
    res.sendFile(path.join(process.cwd(), 'public', 'services.xml'));
  });
  
  app.get('/pets.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATIONS.SITEMAP}`);
    res.sendFile(path.join(process.cwd(), 'public', 'pets.xml'));
  });
  
  app.get('/dog-breeds.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATIONS.SITEMAP}`);
    res.sendFile(path.join(process.cwd(), 'public', 'dog-breeds.xml'));
  });
  
  app.get('/blog.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATIONS.SITEMAP}`);
    res.sendFile(path.join(process.cwd(), 'public', 'blog.xml'));
  });
  
  // HTML Sitemap with proper content type
  app.get('/sitemap.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATIONS.SITEMAP}`);
    res.sendFile(path.join(process.cwd(), 'public', 'sitemap.html'));
  });
  
  app.get('/listings.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', `public, max-age=${CACHE_DURATIONS.SITEMAP}`);
    res.sendFile(path.join(process.cwd(), 'public', 'listings.xml'));
  });
  
  // Add redirects for commonly mistyped URLs - Services
  app.get('/service/sitemap.xml', (req, res) => {
    res.redirect('/services.xml');
  });
  
  app.get('/services/sitemap.xml', (req, res) => {
    res.redirect('/services.xml');
  });
  
  // Add redirects for commonly mistyped URLs - Pets
  app.get('/pet/sitemap.xml', (req, res) => {
    res.redirect('/pets.xml');
  });
  
  app.get('/pets/sitemap.xml', (req, res) => {
    res.redirect('/pets.xml');
  });
  
  // Add redirects for commonly mistyped URLs - Breeds
  app.get('/dog-breed/sitemap.xml', (req, res) => {
    res.redirect('/dog-breeds.xml');
  });
  
  app.get('/dog-breeds/sitemap.xml', (req, res) => {
    res.redirect('/dog-breeds.xml');
  });
  
  app.get('/breeds/sitemap.xml', (req, res) => {
    res.redirect('/dog-breeds.xml');
  });
  
  // Add redirects for commonly mistyped URLs - Blog
  app.get('/blog/sitemap.xml', (req, res) => {
    res.redirect('/blog.xml');
  });
  
  // Add redirects for commonly mistyped URLs - Listings
  app.get('/listing/sitemap.xml', (req, res) => {
    res.redirect('/listings.xml');
  });
  
  app.get('/listings/sitemap.xml', (req, res) => {
    res.redirect('/listings.xml');
  });

  // Special test routes for favicon testing
  app.get('/favicon-direct', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Direct Favicon Test</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <h1>Direct Favicon Test</h1>
        <p>This page should display the orange paw favicon.</p>
      </body>
      </html>
    `);
  });

  // Direct route for favicon-test.html
  app.get('/favicon-test.html', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Favicon Test</title>
        <link rel="icon" href="/favicon.ico?v=9" type="image/svg+xml">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            text-align: center;
          }
          .main {
            border: 2px solid #ff6b00;
            border-radius: 10px;
            padding: 20px;
            margin: 20px auto;
            max-width: 600px;
          }
          h1 {
            color: #ff6b00;
          }
          .logo {
            margin: 20px auto;
            width: 100px;
            height: 100px;
          }
          .logo svg {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div class="main">
          <h1>Favicon Test Page</h1>
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="transform: rotate(45deg);" fill="#ff6b00">
              <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"/>
            </svg>
          </div>
          <p>This page should display the orange paw favicon in your browser tab, matching the logo shown above.</p>
          <p>If you can't see the favicon, try clearing your browser cache or opening in an incognito window.</p>
          <p>Current favicon version: 9</p>
        </div>
      </body>
      </html>
    `);
  });

  console.log('Media serving paths configured:');
  console.log(`- ${path.join(process.cwd(), '.data', 'media')}`);
  console.log(`- ${path.join(process.cwd(), '.data', 'uploads')}`);
  console.log(`- ${path.join(process.cwd(), 'public', 'uploads')}`);
  console.log(`- ${path.join(process.cwd(), 'uploads')}`);

  // Auth routes
  setupAuth(app);

  // Payment routes
  app.use(paymentRoutes);

  // Service Providers API routes
  app.get("/api/service-providers", async (req, res) => {
    try {
      const { serviceType, location } = req.query;

      let providers = await storage.getAllServiceProviders();

      // Filter by service type if specified
      if (serviceType && typeof serviceType === 'string') {
        providers = providers.filter(provider => provider.serviceType === serviceType);
      }

      // Filter by location if specified
      if (location && typeof location === 'string') {
        providers = providers.filter(provider => provider.location === location);
      }

      // Only return active providers
      const activeProviders = providers.filter(provider => provider.isActive);

      res.json(activeProviders);
    } catch (error) {
      console.error("Error fetching service providers:", error);
      res.status(500).json({ message: "Failed to fetch service providers" });
    }
  });

  app.get("/api/service-providers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const provider = await storage.getServiceProviderById(id);

      if (!provider) {
        return res.status(404).json({ message: "Service provider not found" });
      }

      if (!provider.isActive) {
        return res.status(404).json({ message: "Service provider not available" });
      }

      res.json(provider);
    } catch (error) {
      console.error("Error fetching service provider:", error);
      res.status(500).json({ message: "Failed to fetch service provider" });
    }
  });

  // Get all pet listings (public endpoint with limited info)
  app.get("/api/pet-listings", async (req, res) => {
    try {
      const { petType } = req.query;

      let listings = await storage.getAllPetListings();

      // Filter by pet type if specified
      if (petType && typeof petType === 'string') {
        listings = listings.filter(listing => listing.petType === petType);
      }

      // Only return approved listings for public view
      const approvedListings = listings
        .filter(listing => listing.approved)
        .map(listing => {
          // Exclude price and detailed description for non-authenticated users
          if (!req.isAuthenticated()) {
            const { price, description, ...publicListing } = listing;
            return {
              ...publicListing,
              description: description.substring(0, 100) + "...",
            };
          }
          return listing;
        });

      res.json(approvedListings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pet listings" });
    }
  });

  // Get pet listings by breed
  app.get("/api/pet-listings/breed/:breed", async (req, res) => {
    try {
      const breed = req.params.breed;
      console.log(`API: Fetching pet listings for breed: ${breed}`);
      const listings = await storage.getPetListingsByBreed(breed);

      // Only return approved listings for public view
      const approvedListings = listings
        .filter(listing => listing.approved)
        .map(listing => {
          // Exclude price and detailed description for non-authenticated users
          if (!req.isAuthenticated()) {
            const { price, description, ...publicListing } = listing;
            return {
              ...publicListing,
              description: description.substring(0, 100) + "...",
            };
          }
          return listing;
        });

      res.json(approvedListings);
    } catch (error) {
      console.error("Error fetching listings by breed:", error);
      res.status(500).json({ message: "Failed to fetch pet listings by breed" });
    }
  });

  // Get a specific pet listing
  app.get("/api/pet-listings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getPetListingById(id);

      if (!listing) {
        return res.status(404).json({ message: "Pet listing not found" });
      }

      // If not approved and requester is not the seller or admin, return 404
      if (!listing.approved && 
          (!req.isAuthenticated() || 
           (req.user.role !== "admin" && req.user.id !== listing.sellerId))) {
        return res.status(404).json({ message: "Pet listing not found" });
      }

      // If user is not authenticated, return limited information
      if (!req.isAuthenticated()) {
        const { price, description, ...publicListing } = listing;
        return res.json({
          ...publicListing,
          description: description.substring(0, 100) + "...",
        });
      }

      // Return full listing for authenticated users
      res.json(listing);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pet listing" });
    }
  });

  // Create a new pet listing (seller only)
  app.post("/api/pet-listings", isSeller, async (req, res) => {
    try {
      // Log request data for debugging
      console.log('Creating pet listing with data:', JSON.stringify(req.body));

      const requestData = {
        ...req.body,
        sellerId: req.user.id,
        approved: false, // New listings are unapproved by default
      };

      // Make sure images is always an array
      if (!requestData.images) {
        requestData.images = [];
      } else if (!Array.isArray(requestData.images)) {
        requestData.images = [requestData.images].filter(Boolean);
      }

      try {
        const validatedData = insertPetListingSchema.parse(requestData);
        console.log('Validated data:', JSON.stringify(validatedData));

        const newListing = await storage.createPetListing(validatedData);
        return res.status(201).json(newListing);
      } catch (zodError) {
        if (zodError instanceof z.ZodError) {
          console.error('Validation error:', zodError.errors);
          return res.status(400).json({ 
            message: "Validation error", 
            errors: zodError.errors 
          });
        }
        throw zodError; // Re-throw if it's not a ZodError
      }
    } catch (error) {
      console.error('Error creating pet listing:', error);
      return res.status(500).json({ message: "Failed to create pet listing", error: error.message });
    }
  });

  // Update a pet listing (seller can update their own, admin can update any)
  app.put("/api/pet-listings/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getPetListingById(id);

      if (!listing) {
        return res.status(404).json({ message: "Pet listing not found" });
      }

      // Check if user is the seller or admin
      if (req.user.role !== "admin" && req.user.id !== listing.sellerId) {
        return res.status(403).json({ message: "Forbidden - You can only update your own listings" });
      }

      const validatedData = insertPetListingSchema.partial().parse(req.body);

      // Only admin can update approval status
      if (req.user.role !== "admin" && 'approved' in validatedData) {
        delete validatedData.approved;
      }

      const updatedListing = await storage.updatePetListing(id, validatedData);
      res.json(updatedListing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update pet listing" });
    }
  });

  // Delete a pet listing (seller can delete their own, admin can delete any)
  app.delete("/api/pet-listings/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getPetListingById(id);

      if (!listing) {
        return res.status(404).json({ message: "Pet listing not found" });
      }

      // Check if user is the seller or admin
      if (req.user.role !== "admin" && req.user.id !== listing.sellerId) {
        return res.status(403).json({ message: "Forbidden - You can only delete your own listings" });
      }

      await storage.deletePetListing(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete pet listing" });
    }
  });

  // Get all listings for a seller
  app.get("/api/seller/pet-listings", isSeller, async (req, res) => {
    try {
      const sellerId = req.user.id;
      console.log(`Fetching listings for seller ID: ${sellerId}`);

      const listings = await storage.getPetListingsBySellerId(sellerId);
      console.log(`Found ${listings.length} listings for seller ID ${sellerId}`);
      console.log('Listing IDs:', listings.map(l => l.id).join(', '));

      res.json(listings);
    } catch (error) {
      console.error('Error fetching seller listings:', error);
      res.status(500).json({ message: "Failed to fetch seller's pet listings" });
    }
  });

  // Admin routes
  // Get all listings including unapproved ones (admin only)
  app.get("/api/admin/pet-listings", isAdmin, async (req, res) => {
    try {
      const listings = await storage.getAllPetListings();
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pet listings" });
    }
  });

  // Update pet listing media (authenticated users only)
  app.post("/api/pet-listings/:id/update-media", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { mediaUrls } = req.body;

      // Allow empty arrays for clearing images
      if (!Array.isArray(mediaUrls)) {
        return res.status(400).json({ 
          success: false, 
          message: "Media URLs must be an array (can be empty to clear images)" 
        });
      }

      console.log(`Updating pet listing ${id} with media URLs:`, mediaUrls);

      // Get the current listing
      const listing = await storage.getPetListingById(id);
      if (!listing) {
        return res.status(404).json({ 
          success: false, 
          message: "Pet listing not found" 
        });
      }

      // Check if user is the seller or admin
      if (req.user.role !== "admin" && req.user.id !== listing.sellerId) {
        return res.status(403).json({ 
          success: false, 
          message: "You can only update your own listings"
        });
      }

      // Handle the case where user may clear all images before uploading new ones
      const imagesToUpdate = mediaUrls.filter(url => url && url.trim() !== '');

      // Update the listing with the new media URLs
      const updatedListing = await storage.updatePetListing(id, { images: imagesToUpdate });

      return res.status(200).json({
        success: true,
        message: "Media URLs updated successfully",
        listing: updatedListing
      });
    } catch (error) {
      console.error('Error updating pet listing media:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Error updating media URLs",
        error: String(error)
      });
    }
  });

  // Approve a pet listing (admin only)
  app.post("/api/admin/pet-listings/:id/approve", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getPetListingById(id);

      if (!listing) {
        return res.status(404).json({ message: "Pet listing not found" });
      }

      const updatedListing = await storage.updatePetListing(id, { approved: true });
      res.json(updatedListing);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve pet listing" });
    }
  });

  // Reject a pet listing (admin only)
  app.post("/api/admin/pet-listings/:id/reject", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getPetListingById(id);

      if (!listing) {
        return res.status(404).json({ message: "Pet listing not found" });
      }

      const updatedListing = await storage.updatePetListing(id, { approved: false });
      res.json(updatedListing);
    } catch (error) {
      res.status(500).json({ message: "Failed to reject pet listing" });
    }
  });

  // ADOPTION ROUTES
  // Get all adoption listings (public endpoint)
  app.get("/api/adoption-listings", async (req, res) => {
    try {
      const { petType } = req.query;

      let listings = await storage.getAllAdoptionListings();

      // Filter by pet type if specified
      if (petType && typeof petType === 'string') {
        listings = listings.filter(listing => listing.petType === petType);
      }

      // Only return available and pending adoptions
      const filteredListings = listings.filter(listing => 
        listing.status === "available" || listing.status === "pending"
      );
      res.json(filteredListings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch adoption listings" });
    }
  });

  // Get a specific adoption listing
  app.get("/api/adoption-listings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getAdoptionListingById(id);

      if (!listing) {
        return res.status(404).json({ message: "Adoption listing not found" });
      }

      // If the adoption is already complete and requester is not the admin, return 404
      if (listing.status === "adopted" && 
          (!req.isAuthenticated() || req.user.role !== "admin")) {
        return res.status(404).json({ message: "Adoption listing not found" });
      }

      res.json(listing);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch adoption listing" });
    }
  });

  // Create a new adoption listing (admin only)
  app.post("/api/adoption-listings", isAdmin, async (req, res) => {
    try {
      const validatedData = insertAdoptionListingSchema.parse({
        ...req.body,
        adminId: req.user.id,
        status: "available", // New listings are available by default
      });

      const newListing = await storage.createAdoptionListing(validatedData);
      res.status(201).json(newListing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create adoption listing" });
    }
  });

  // Update an adoption listing (admin only)
  app.put("/api/adoption-listings/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getAdoptionListingById(id);

      if (!listing) {
        return res.status(404).json({ message: "Adoption listing not found" });
      }

      const validatedData = insertAdoptionListingSchema.partial().parse(req.body);

      const updatedListing = await storage.updateAdoptionListing(id, validatedData);
      res.json(updatedListing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update adoption listing" });
    }
  });

  // Update adoption status (admin only)
  app.post("/api/adoption-listings/:id/status", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getAdoptionListingById(id);

      if (!listing) {
        return res.status(404).json({ message: "Adoption listing not found" });
      }

      const { status } = req.body;
      if (!status || !["available", "pending", "adopted"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const updatedListing = await storage.updateAdoptionStatus(id, status as AdoptionStatus);
      res.json(updatedListing);
    } catch (error) {
      res.status(500).json({ message: "Failed to update adoption status" });
    }
  });

  // Delete an adoption listing (admin only)
  app.delete("/api/adoption-listings/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getAdoptionListingById(id);

      if (!listing) {
        return res.status(404).json({ message: "Adoption listing not found" });
      }

      await storage.deleteAdoptionListing(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete adoption listing" });
    }
  });

  // Get all adoption listings managed by an admin
  app.get("/api/admin/adoption-listings", isAdmin, async (req, res) => {
    try {
      const adminId = req.user.id;
      const listings = await storage.getAdoptionListingsByAdminId(adminId);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin's adoption listings" });
    }
  });

  // Get adoption listings by status
  app.get("/api/adoption-listings/status/:status", isAdmin, async (req, res) => {
    try {
      const status = req.params.status as AdoptionStatus;
      if (!["available", "pending", "adopted"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const listings = await storage.getAdoptionListingsByStatus(status);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch adoption listings by status" });
    }
  });

  // Configure file uploads with multer - renamed to avoid conflict with storage import
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isVideo = file.mimetype.startsWith('video/');
      // Use persistent directory for uploads that will survive deployments
      const uploadDir = isVideo 
        ? path.join(persistentUploadsDir, 'pet-videos') 
        : path.join(persistentUploadsDir, 'pet-images');

      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExt = path.extname(file.originalname);
      cb(null, uniqueSuffix + fileExt);
    }
  });

  // File filter to validate uploaded files
  const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Please upload only images or videos.'));
    }
  };

  const regularUpload = multer({ 
    storage: fileStorage, // Use the renamed storage variable
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    }
  });

  // Enhanced endpoint for uploading images with better error handling
  // Using the Supabase upload handlers imported at the top of the file

  // Pet media upload endpoint (using Supabase)
  // Pet media upload endpoint using Cloudinary
  app.post('/api/upload/pet-media', isAuthenticated, (req, res) => {
    // Set JSON content type from the start
    res.setHeader('Content-Type', 'application/json');

    console.log('Processing pet media upload request for Cloudinary storage');

    // Create a temporary upload directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp-uploads');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Use the upload middleware directly with Cloudinary handler
    upload.array('files', 5)(req, res, function(err) {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ 
          success: false,
          message: err.message || 'File upload error' 
        });
      }

      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        return res.status(400).json({ 
          success: false, 
          message: 'No files were uploaded' 
        });
      }

      // Process the upload using Cloudinary handler
      handlePetMediaUpload(req, res);
    });
  });

  // General file upload endpoint for service provider images, dog breeds, etc.
  app.post('/api/upload', isAuthenticated, (req, res) => {
    // Set JSON content type from the start
    res.setHeader('Content-Type', 'application/json');

    console.log('Processing general file upload request using Cloudinary');

    // Create a temporary upload directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp-uploads');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Use the upload middleware with Cloudinary handler
    upload.single('file')(req, res, function(err) {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ 
          success: false, 
          message: err.message || 'File upload error' 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: 'No file was uploaded' 
        });
      }

      // Process the upload using Cloudinary handler for general files
      handleGeneralFileUpload(req, res);
    });
  });

  // Service providers API endpoints
  app.get('/api/service-providers', (req, res) => {
    try {
      // In a real application, you would fetch this from a database
      // For now, we'll return mock data
      const serviceProviders = {
        vets: [
          {
            id: 1,
            name: "Dr. Anika Sharma",
            specialty: "General Veterinarian",
            qualification: "BVSc & AH, MVSc",
            experience: 8,
            rating: 4.8,
            clinic: "PetCare Clinic",
            location: "123 Main Street",
            city: "Delhi",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
            hours: "Mon-Sat: 10:00 AM - 7:00 PM",
            services: ["Vaccination", "Surgery", "Dental Care", "X-Ray", "Laboratory"]
          },
          {
            id: 2,
            name: "Dr. Raj Patel",
            specialty: "Surgical Specialist",
            qualification: "BVSc, MS Surgery",
            experience: 12,
            rating: 4.9,
            clinic: "Animal Care Hospital",
            location: "456 Park Avenue",
            city: "Mumbai",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
            hours: "Mon-Fri: 9:00 AM - 6:00 PM",
            services: ["Orthopedic Surgery", "Soft Tissue Surgery", "Endoscopy", "Ultrasound"]
          }
        ],
        groomers: [
          {
            id: 1,
            name: "Priya's Pet Salon",
            rating: 4.7,
            location: "78 Green Park",
            city: "Delhi",
            image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
            hours: "Tue-Sun: 9:00 AM - 8:00 PM",
            priceRange: "₹800 - ₹3,000",
            homeService: true,
            petTypes: ["Dogs", "Cats", "Small Pets"],
            services: ["Bathing", "Haircut", "Nail Trimming", "Ear Cleaning", "Teeth Brushing"],
            special: ["De-shedding", "Flea Treatment", "Aromatherapy"]
          },
          {
            id: 2,
            name: "Pawsome Grooming",
            rating: 4.5,
            location: "123 Marine Drive",
            city: "Mumbai",
            image: "https://images.unsplash.com/photo-1527666183277-34569c8eeb26?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
            hours: "Mon-Sat: 10:00 AM - 7:00 PM",
            priceRange: "₹1,000 - ₹3,500",
            homeService: false,
            petTypes: ["Dogs", "Cats"],
            services: ["Full Grooming", "Bath & Brush", "Nail Trim", "Ear Cleaning"],
            special: ["Medicated Baths", "Hand Stripping", "Breed-Specific Cuts"]
          }
        ],
        walkers: [
          {
            id: 1,
            name: "Rahul Walkies",
            age: 28,
            experience: 5,
            rating: 4.6,
            location: "Koramangala",
            city: "Bangalore",
            image: "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
            hours: "Mon-Fri: 6:00 AM - 10:00 AM, 4:00 PM - 7:00 PM",
            priceRange: "₹300 - ₹600 per walk",
            petTypes: ["Dogs (All Sizes)"],
            services: ["Individual Walks", "Group Walks", "Puppy Walks", "Play Sessions"]
          },
          {
            id: 2,
            name: "Delhi Dog Walkers",
            age: 30,
            experience: 7,
            rating: 4.8,
            location: "Hauz Khas",
            city: "Delhi",
            image: "https://images.unsplash.com/photo-1494947665470-20322015e3a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
            hours: "Daily: 6:00 AM - 9:00 AM, 5:00 PM - 8:00 PM",
            priceRange: "₹350 - ₹700 per walk",
            petTypes: ["Dogs (Small to Medium)"],
            services: ["Regular Walks", "Exercise Sessions", "Training During Walks", "Pet Sitting"]
          }
        ],
        trainers: [
          {
            id: 1,
            name: "Ajay's Pet Training",
            specialty: "Behavior Modification",
            experience: 10,
            rating: 4.9,
            location: "Indiranagar",
            city: "Bangalore",
            image: "https://images.unsplash.com/photo-1551887196-72e32bfc7bf3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
            hours: "By appointment: Mon-Sat, 8:00 AM - 6:00 PM",
            priceRange: "₹2,000 - ₹15,000 per course",
            petTypes: ["Dogs", "Cats"],
            services: ["Basic Obedience", "Advanced Training", "Behavior Modification", "Puppy Training"]
          },
          {
            id: 2,
            name: "K9 Commandos",
            specialty: "Protection Training",
            experience: 15,
            rating: 4.7,
            location: "Worli",
            city: "Mumbai",
            image: "https://images.unsplash.com/photo-1554224311-beee415c201f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
            hours: "Mon-Fri: 9:00 AM - 5:00 PM",
            priceRange: "₹5,000 - ₹25,000 per course",
            petTypes: ["Dogs (Medium to Large)"],
            services: ["Obedience Training", "Protection Training", "Guard Dog Training", "Search & Rescue"]
          }
        ]
      };

      res.json(serviceProviders);
    } catch (error) {
      console.error("Error fetching service providers:", error);
      res.status(500).json({ error: "Failed to fetch service providers" });
    }
  });

  // Update service providers
  app.post('/api/service-providers/update', isAdmin, (req, res) => {
    try {
      const { type, providers } = req.body;

      if (!type || !providers || !Array.isArray(providers)) {
        return res.status(400).json({ error: "Invalid request format" });
      }

      // In a real application, you would update this in a database
      // For now, we'll just return success
      console.log(`Updated ${type} providers:`, providers);

      res.json({ 
        success: true, 
        message: `Successfully updated ${providers.length} ${type} providers` 
      });
    } catch (error) {
      console.error("Error updating service providers:", error);
      res.status(500).json({ error: "Failed to update service providers" });
    }
  });

  // We already have an express.static middleware for /uploads at the top of registerRoutes

  // NEWS ARTICLE ROUTES
  // Get all news articles
  app.get("/api/news", async (req, res) => {
    try {
      const articles = await storage.getAllNewsArticles();
      res.json(articles);
    } catch (error) {
      console.error("Error fetching news articles:", error);
      res.status(500).json({ message: "Failed to fetch news articles" });
    }
  });

  // Get latest news articles with limit
  app.get("/api/news/latest/:limit", async (req, res) => {
    try {
      const limit = parseInt(req.params.limit) || 10;
      const articles = await storage.getLatestNewsArticles(limit);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching latest news:", error);
      res.status(500).json({ message: "Failed to fetch latest news articles" });
    }
  });

  // Get news articles by source
  app.get("/api/news/source/:source", async (req, res) => {
    try {
      const source = req.params.source as NewsSource;
      if (!["petsworld", "dogexpress", "oliverpetcare", "other"].includes(source)) {
        return res.status(400).json({ message: "Invalid news source" });
      }

      const articles = await storage.getNewsBySource(source);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching news by source:", error);
      res.status(500).json({ message: "Failed to fetch news articles by source" });
    }
  });

  // Get a specific news article
  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getNewsArticleById(id);

      if (!article) {
        return res.status(404).json({ message: "News article not found" });
      }

      res.json(article);
    } catch (error) {
      console.error("Error fetching news article:", error);
      res.status(500).json({ message: "Failed to fetch news article" });
    }
  });

  // DOG BREEDS API ROUTES
  // Get all dog breeds
  app.get("/api/dog-breeds", async (req, res) => {
    try {
      const breeds = await storage.getAllDogBreeds();
      res.json(breeds);
    } catch (error) {
      console.error("Error fetching dog breeds:", error);
      res.status(500).json({ message: "Failed to fetch dog breeds" });
    }
  });

  // Get popular dog breeds with limit
  app.get("/api/dog-breeds/popular/:limit", async (req, res) => {
    try {
      const limit = parseInt(req.params.limit);
      const breeds = await storage.getPopularDogBreeds(limit);
      res.json(breeds);
    } catch (error) {
      console.error("Error fetching popular dog breeds:", error);
      res.status(500).json({ message: "Failed to fetch popular dog breeds" });
    }
  });

  // Get dog breeds by size
  app.get("/api/dog-breeds/size/:size", async (req, res) => {
    try {
      const size = req.params.size as DogSize;
      if (!["small", "medium", "large", "giant"].includes(size)) {
        return res.status(400).json({ message: "Invalid dog size" });
      }

      const breeds = await storage.getDogBreedsBySize(size);
      res.json(breeds);
    } catch (error) {
      console.error("Error fetching dog breeds by size:", error);
      res.status(500).json({ message: "Failed to fetch dog breeds by size" });
    }
  });

  // Get popular dog breeds with limit
  app.get("/api/dog-breeds/popular/:limit", async (req, res) => {
    try {
      const limit = parseInt(req.params.limit) || 10;
      const breeds = await storage.getPopularDogBreeds(limit);
      res.json(breeds);
    } catch (error) {
      console.error("Error fetching popular dog breeds:", error);
      res.status(500).json({ message: "Failed to fetch popular dog breeds" });
    }
  });

  // Get dog breeds by group
  app.get("/api/dog-breeds/group/:group", async (req, res) => {
    try {
      const group = req.params.group;
      const breeds = await storage.getDogBreedsByGroup(group);
      res.json(breeds);
    } catch (error) {
      console.error("Error fetching dog breeds by group:", error);
      res.status(500).json({ message: "Failed to fetch dog breeds by group" });
    }
  });

  // Get a specific dog breed
  app.get("/api/dog-breeds/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const breed = await storage.getDogBreedById(id);

      if (!breed) {
        return res.status(404).json({ message: "Dog breed not found" });
      }

      res.json(breed);
    } catch (error) {
      console.error("Error fetching dog breed:", error);
      res.status(500).json({ message: "Failed to fetch dog breed" });
    }
  });

  // Compare dog breeds
  app.post("/api/dog-breeds/compare", async (req, res) => {
    try {
      const { breedIds } = req.body;

      if (!Array.isArray(breedIds) || breedIds.length < 2) {
        return res.status(400).json({ message: "At least 2 breed IDs are required for comparison" });
      }

      const breeds = await storage.compareDogBreeds(breedIds);
      res.json(breeds);
    } catch (error) {
      console.error("Error comparing dog breeds:", error);
      res.status(500).json({ message: "Failed to compare dog breeds" });
    }
  });

  // Admin dog breed management routes
  app.post("/api/dog-breeds", isAdmin, async (req, res) => {
    try {
      const validatedData = insertDogBreedSchema.parse(req.body);
      const newBreed = await storage.createDogBreed(validatedData);
      res.status(201).json(newBreed);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating dog breed:", error);
      res.status(500).json({ message: "Failed to create dog breed" });
    }
  });

  app.patch("/api/dog-breeds/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const breed = await storage.getDogBreedById(id);

      if (!breed) {
        return res.status(404).json({ message: "Dog breed not found" });
      }

      const updates = insertDogBreedSchema.partial().parse(req.body);
      const updatedBreed = await storage.updateDogBreed(id, updates);
      res.json(updatedBreed);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error updating dog breed:", error);
      res.status(500).json({ message: "Failed to update dog breed" });
    }
  });

  app.delete("/api/dog-breeds/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const breed = await storage.getDogBreedById(id);

      if (!breed) {
        return res.status(404).json({ message: "Dog breed not found" });
      }

      await storage.deleteDogBreed(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting dog breed:", error);
      res.status(500).json({ message: "Failed to delete dog breed" });
    }
  });

  // API Routes for Event Registrations
  app.post("/api/event-registrations", async (req, res) => {
    try {
      const registrationData = req.body;

      // Set userId from authenticated user if available
      if (req.isAuthenticated()) {
        registrationData.userId = req.user.id;
      }

      try {
        const validatedData = insertEventRegistrationSchema.parse(registrationData);
        const eventRegistration = await storage.createEventRegistration(validatedData);
        res.status(201).json(eventRegistration);
      } catch (zodError) {
        if (zodError instanceof z.ZodError) {
          console.error("Validation error:", zodError.errors);
          return res.status(400).json({
            message: "Validation error",
            errors: zodError.errors
          });
        }
        throw zodError; // Re-throw if it's not a ZodError
      }
    } catch (error) {
      console.error("Error creating event registration:", error);
      res.status(500).json({ message: "Failed to create event registration" });
    }
  });

  app.get("/api/event-registrations", isAdmin, async (req, res) => {
    try {
      const eventRegistrations = await storage.getAllEventRegistrations();
      res.json(eventRegistrations);
    } catch (error) {
      console.error("Error getting event registrations:", error);
      res.status(500).json({ message: "Failed to get event registrations" });
    }
  });

  app.get("/api/event-registrations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const eventRegistration = await storage.getEventRegistrationById(id);

      if (!eventRegistration) {
        return res.status(404).json({ message: "Event registration not found" });
      }

      res.json(eventRegistration);
    } catch (error) {
      console.error("Error getting event registration:", error);
      res.status(500).json({ message: "Failed to get event registration" });
    }
  });

  app.patch("/api/event-registrations/:id/status", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!status || !["pending", "approved", "rejected", "attended"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const eventRegistration = await storage.updateEventRegistrationStatus(id, status);
      res.json(eventRegistration);
    } catch (error) {
      console.error("Error updating event registration status:", error);
      res.status(500).json({ message: "Failed to update event registration status" });
    }
  });

  app.patch("/api/event-registrations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;

      const eventRegistration = await storage.updateEventRegistration(id, updateData);
      res.json(eventRegistration);
    } catch (error) {
      console.error("Error updating event registration:", error);
      res.status(500).json({ message: "Failed to update event registration" });
    }
  });

  app.delete("/api/event-registrations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEventRegistration(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event registration:", error);
      res.status(500).json({ message: "Failed to delete event registration" });
    }
  });

  // Create a new news article (admin only)
  app.post("/api/admin/news", isAdmin, async (req, res) => {
    try {
      const articleData = req.body;

      // Set default values if not provided
      if (!articleData.publishedAt) {
        articleData.publishedAt = new Date();
      }

      if (!articleData.source) {
        articleData.source = "other";
      }

      if (!articleData.sourceUrl) {
        articleData.sourceUrl = "https://www.petrosia.in";
      }

      try {
        const validatedData = insertNewsArticleSchema.parse(articleData);
        const article = await storage.createNewsArticle(validatedData);
        res.status(201).json(article);
      } catch (zodError) {
        if (zodError instanceof z.ZodError) {
          console.error("Validation error:", zodError.errors);
          return res.status(400).json({
            message: "Validation error",
            errors: zodError.errors
          });
        }
        throw zodError;
      }
    } catch (error) {
      console.error("Error creating news article:", error);
      res.status(500).json({ message: "Failed to create news article" });
    }
  });

  // Manually trigger news feed fetch (admin only)
  app.post("/api/admin/news/fetch", isAdmin, async (req, res) => {
    try {
      console.log("Manually triggering RSS feed fetch");
      // Use non-blocking fetch
      fetchAllRssFeeds().catch(error => {
        console.error("Error during manual RSS feed fetch:", error);
      });

      res.status(202).json({ message: "RSS feed fetch triggered" });
    } catch (error) {
      console.error("Error triggering RSS feed fetch:", error);
      res.status(500).json({ message: "Failed to trigger RSS feed fetch" });
    }
  });

  // Delete a news article (admin only)
  app.delete("/api/admin/news/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNewsArticleById(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting news article:", error);
      res.status(500).json({ message: "Failed to delete news article" });
    }
  });

  // Update pet listing wishlist count
  app.post("/api/pet-listings/:id/wishlist", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { action } = req.body; // 'add' or 'remove'

      const petListing = await storage.getPetListingById(parseInt(id));
      if (!petListing) {
        return res.status(404).json({ message: "Pet listing not found" });
      }

      // Update the wishlist count
      let newWishlistCount = petListing.wishlistCount || 0;
      if (action === 'add') {
        newWishlistCount += 1;
      } else if (action === 'remove' && newWishlistCount > 0) {
        newWishlistCount -= 1;
      }

      // Update the pet listing
      const updatedListing = await storage.updatePetListing(parseInt(id), {
        wishlistCount: newWishlistCount
      });

      res.json(updatedListing);
    } catch (error) {
      console.error("Error updating wishlist count:", error);
      res.status(500).json({ message: "Failed to update wishlist count" });
    }
  });

  // Update pet listing enquiry count
  app.post("/api/pet-listings/:id/enquiry", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;

      const petListing = await storage.getPetListingById(parseInt(id));
      if (!petListing) {
        return res.status(404).json({ message: "Pet listing not found" });
      }

      // Update the enquiry count
      const newEnquiryCount = (petListing.enquiryCount || 0) + 1;

      // Check if listing should be marked as highly enquired (e.g., more than 5 enquiries)
      const isHighlyEnquired = newEnquiryCount >= 5;

      // Update the pet listing
      const updatedListing = await storage.updatePetListing(parseInt(id), {
        enquiryCount: newEnquiryCount,
        isHighlyEnquired
      });

      res.json(updatedListing);
    } catch (error) {
      console.error("Error updating enquiry count:", error);
      res.status(500).json({ message: "Failed to update enquiry count" });
    }
  });

  // BLOG ROUTES
  // Get all blog posts (public endpoint with filters for approved/featured)
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const { approved, featured, limit } = req.query;
      let posts = await storage.getAllBlogPosts();

      // Filter by approved status
      if (approved === 'true') {
        posts = posts.filter(post => post.approved);
      } else if (approved === 'false' && req.isAuthenticated() && req.user.role === 'admin') {
        // Only admins can see unapproved posts
        posts = posts.filter(post => !post.approved);
      } else if (approved === 'false') {
        // For non-admins requesting unapproved posts, return empty
        posts = [];
      }

      // Filter by featured status
      if (featured === 'true') {
        posts = posts.filter(post => post.featured);
      }

      // Apply limit if specified
      if (limit && !isNaN(parseInt(limit as string))) {
        posts = posts.slice(0, parseInt(limit as string));
      }

      res.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Get a specific blog post by slug
  app.get("/api/blog-posts/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getBlogPostBySlug(slug);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // If not approved and requester is not the author or admin, return 404
      if (!post.approved && 
          (!req.isAuthenticated() || 
           (req.user.role !== "admin" && req.user.id !== post.authorId))) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Get a specific blog post by ID
  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPostById(id);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // If not approved and requester is not the author or admin, return 404
      if (!post.approved && 
          (!req.isAuthenticated() || 
           (req.user.role !== "admin" && req.user.id !== post.authorId))) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Create a new blog post (authenticated users only)
  app.post("/api/blog-posts", isAuthenticated, async (req, res) => {
    try {
      // Generate slug from title
      const slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

      const requestData = {
        ...req.body,
        authorId: req.user.id,
        approved: false, // New posts are unapproved by default
        featured: false, // New posts are not featured by default
        publishedAt: null, // Will be set when approved
        createdAt: new Date(),
        updatedAt: new Date(),
        slug: slug
      };

      // Make sure images is always an array
      if (!requestData.images) {
        requestData.images = [];
      } else if (!Array.isArray(requestData.images)) {
        requestData.images = [requestData.images].filter(Boolean);
      }

      // Make sure tags is always an array
      if (!requestData.tags) {
        requestData.tags = [];
      } else if (!Array.isArray(requestData.tags)) {
        requestData.tags = [requestData.tags].filter(Boolean);
      }

      try {
        const validatedData = insertBlogPostSchema.parse(requestData);
        console.log('Validated blog post data:', JSON.stringify(validatedData));

        const newPost = await storage.createBlogPost(validatedData);
        return res.status(201).json(newPost);
      } catch (zodError) {
        if (zodError instanceof z.ZodError) {
          console.error('Validation error:', zodError.errors);
          return res.status(400).json({ 
            message: "Validation error", 
            errors: zodError.errors 
          });
        }
        throw zodError; // Re-throw if it's not a ZodError
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      return res.status(500).json({ message: "Failed to create blog post", error: error.message });
    }
  });

  // Update a blog post (author can update their own, admin can update any)
  app.put("/api/blog-posts/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPostById(id);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Check if user is the author or admin
      if (req.user.role !== "admin" && req.user.id !== post.authorId) {
        return res.status(403).json({ message: "Forbidden - You can only update your own blog posts" });
      }

      // Add updatedAt timestamp
      const updatedData = {
        ...req.body,
        updatedAt: new Date()
      };

      // Only admin can update approval and featured status
      if (req.user.role !== "admin") {
        delete updatedData.approved;
        delete updatedData.featured;
      }

      // If post is being approved and doesn't have a publishedAt date, set it
      if (req.user.role === "admin" && updatedData.approved === true && !post.publishedAt) {
        updatedData.publishedAt = new Date();
      }

      const validatedData = insertBlogPostSchema.partial().parse(updatedData);
      const updatedPost = await storage.updateBlogPost(id, validatedData);

      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error updating blog post:', error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  // Delete a blog post (author can delete their own, admin can delete any)
  app.delete("/api/blog-posts/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPostById(id);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Check if user is the author or admin
      if (req.user.role !== "admin" && req.user.id !== post.authorId) {
        return res.status(403).json({ message: "Forbidden - You can only delete your own blog posts" });
      }

      await storage.deleteBlogPost(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Like/unlike a blog post (authenticated users only)
  app.post("/api/blog-posts/:id/like", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;

      const post = await storage.getBlogPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      const updatedPost = await storage.likeBlogPost(id, userId);
      res.json(updatedPost);
    } catch (error) {
      console.error('Error liking blog post:', error);
      res.status(500).json({ message: "Failed to like blog post" });
    }
  });

  // Add a comment to a blog post (authenticated users only)
  app.post("/api/blog-posts/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      const { content } = req.body;

      // Validate content
      if (!content || content.trim() === '') {
        return res.status(400).json({ message: "Comment content is required" });
      }

      const post = await storage.getBlogPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      const comment = {
        authorId: userId,
        authorName: req.user.username,
        content: content.trim()
      };

      const updatedPost = await storage.addCommentToBlogPost(id, comment);
      res.json(updatedPost);
    } catch (error) {
      console.error('Error adding comment to blog post:', error);
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  // Admin routes for blog posts
  // Approve a blog post (admin only)
  app.post("/api/admin/blog-posts/:id/approve", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPostById(id);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Set publishedAt date if it doesn't exist
      const updateData = { 
        approved: true,
        publishedAt: post.publishedAt || new Date() 
      };

      const updatedPost = await storage.updateBlogPost(id, updateData);
      res.json(updatedPost);
    } catch (error) {
      console.error('Error approving blog post:', error);
      res.status(500).json({ message: "Failed to approve blog post" });
    }
  });

  // Reject a blog post (admin only)
  app.post("/api/admin/blog-posts/:id/reject", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPostById(id);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      const updatedPost = await storage.updateBlogPost(id, { 
        approved: false,
        publishedAt: null
      });

      res.json(updatedPost);
    } catch (error) {
      console.error('Error rejecting blog post:', error);
      res.status(500).json({ message: "Failed to reject blog post" });
    }
  });

  // Feature or unfeature a blog post (admin only)
  app.post("/api/admin/blog-posts/:id/feature", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { featured } = req.body;
      const post = await storage.getBlogPostById(id);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      const updatedPost = await storage.updateBlogPost(id, { 
        featured: featured === true
      });

      res.json(updatedPost);
    } catch (error) {
      console.error('Error featuring/unfeaturing blog post:', error);
      res.status(500).json({ message: "Failed to update blog post featured status" });
    }
  });

  // SERVICE BOOKING ROUTES
  app.post("/api/service-bookings", isAuthenticated, async (req, res) => {
    try {
      const bookingData = {
        ...req.body,
        userId: req.user.id,
        status: "pending"
      };

      try {
        const validatedData = insertServiceBookingSchema.parse(bookingData);
        const booking = await storage.createServiceBooking(validatedData);
        res.status(201).json(booking);
      } catch (zodError) {
        if (zodError instanceof z.ZodError) {
          console.error("Validation error:", zodError.errors);
          return res.status(400).json({
            message: "Validation error",
            errors: zodError.errors
          });
        }
        throw zodError;
      }
    } catch (error) {
      console.error("Error creating service booking:", error);
      res.status(500).json({ message: "Failed to create service booking" });
    }
  });

  app.get("/api/service-bookings", isAuthenticated, async (req, res) => {
    try {
      const bookings = await storage.getServiceBookingsByUserId(req.user.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching service bookings:", error);
      res.status(500).json({ message: "Failed to fetch service bookings" });
    }
  });

  app.get("/api/service-bookings/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getServiceBookingById(id);

      if (!booking) {
        return res.status(404).json({ message: "Service booking not found" });
      }

      // Only return booking if user is the owner or admin
      if (req.user.role !== "admin" && booking.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden - You can only view your own bookings" });
      }

      res.json(booking);
    } catch (error) {
      console.error("Error fetching service booking:", error);
      res.status(500).json({ message: "Failed to fetch service booking" });
    }
  });

  app.patch("/api/service-bookings/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!status || !Object.values(BookingStatus).includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const booking = await storage.updateServiceBookingStatus(id, status);
      res.json(booking);
    } catch (error) {
      console.error("Error updating service booking status:", error);
      res.status(500).json({ message: "Failed to update service booking status" });
    }
  });

  app.delete("/api/service-bookings/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteServiceBooking(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting service booking:", error);
      res.status(500).json({ message: "Failed to delete service booking" });
    }
  });

  app.get("/api/admin/service-bookings", isAdmin, async (req, res) => {
    try {
      const bookings = await storage.getAllServiceBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching service bookings:", error);
      res.status(500).json({ message: "Failed to fetch service bookings" });
    }
  });


  // Initialize news service
  scheduleRssFeedFetching();

  // We'll initialize sitemap generator in index.ts to avoid import issues

  // Serve robots.txt from public directory or generate dynamically
  app.get('/robots.txt', (req, res) => {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.sendFile(robotsPath);
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /uploads/

# Allow Google Image to index images
User-agent: Googlebot-Image
Allow: /uploads/

# Allow Googlebot to index everything
User-agent: Googlebot
Allow: /

# XML sitemap location
Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml
Sitemap: ${req.protocol}://${req.get('host')}/services.xml`);
    }
  });
  
  // Serve services.xml sitemap specifically for service pages
  app.get('/services.xml', (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const currentDate = new Date().toISOString().split('T')[0];
      
      let servicesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/grooming</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/vets</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/walkers</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/delivery</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/checkup</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/daycare</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/boarding</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/training</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/service-providers</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
      
      res.setHeader('Content-Type', 'application/xml');
      res.send(servicesXml);
    } catch (error) {
      console.error('Error serving services sitemap:', error);
      res.status(500).send('Error generating services sitemap');
    }
  });

  // Serve dynamic sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    try {
      // Create a simple XML sitemap with core pages
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const currentDate = new Date().toISOString().split('T')[0];
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/pets</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/breeds</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/grooming</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/veterinary</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/walking</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/daycare</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/services/boarding</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/franchise</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/service-providers</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
      
      res.setHeader('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Error serving sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // ALWAYS serve the app on port 5000
  const httpServer = createServer(app);

  return httpServer;
}