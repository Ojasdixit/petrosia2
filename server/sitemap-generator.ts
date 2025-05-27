import fs from 'fs';
import path from 'path';
import * as nodeCron from 'node-cron';
import { storage } from './storage';

// Helper function to create XML header
function createXmlHeader() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
}

// Helper function to create XML footer
function createXmlFooter() {
  return `
</urlset>`;
}

// Helper function to create a URL entry
function createUrlEntry(baseUrl: string, path: string, changefreq: string, priority: string, currentDate: string) {
  return `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// Function to generate main sitemap index
export async function generateSitemapIndex(baseUrl: string = 'https://petrosia.in'): Promise<string> {
  try {
    console.log('Generating sitemap index...');
    
    // Get current date in the format required for sitemap (YYYY-MM-DD)
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Define all our sitemap files
    const sitemaps = [
      'sitemap.xml',        // Main sitemap
      'services.xml',       // Services sitemap
      'pets.xml',           // Pets category sitemap
      'dog-breeds.xml',     // Dog breeds sitemap
      'blog.xml',           // Blog sitemap
      'listings.xml'        // Pet listings sitemap
    ];
    
    // Start the XML document
    let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Add each sitemap to the index
    sitemaps.forEach(sitemap => {
      sitemapIndex += `
  <sitemap>
    <loc>${baseUrl}/${sitemap}</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`;
    });
    
    // Close the XML document
    sitemapIndex += `
</sitemapindex>`;
    
    // Write the sitemap index to the public directory
    const sitemapIndexPath = path.join(process.cwd(), 'public', 'sitemap_index.xml');
    fs.writeFileSync(sitemapIndexPath, sitemapIndex);
    console.log(`Sitemap index generated and saved to ${sitemapIndexPath}`);
    
    return sitemapIndex;
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    throw error;
  }
}

// Function to generate main XML sitemap
export async function generateSitemap(baseUrl: string = 'https://petrosia.in'): Promise<string> {
  try {
    console.log('Generating main sitemap...');
    
    // Get current date in the format required for sitemap (YYYY-MM-DD)
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Start the XML document
    let sitemap = createXmlHeader();
    
    // Add static pages
    const staticPages = [
      '',                  // homepage
      '/about-us',         // about page
      '/pet-care',         // pet care page
      '/events',           // events page
      '/news',             // news page
      '/franchise',        // franchise page
      '/privacy-policy',   // privacy policy
      '/terms-of-use',     // terms of use
      '/refund-policy',    // refund policy
      '/auth'              // authentication page
    ];
    
    // Add static pages to sitemap
    staticPages.forEach(page => {
      sitemap += createUrlEntry(
        baseUrl, 
        page, 
        'weekly', 
        page === '' ? '1.0' : '0.8', 
        currentDate
      );
    });
    
    // Close the XML document
    sitemap += createXmlFooter();
    
    // Write the sitemap to the public directory
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`Main sitemap generated and saved to ${sitemapPath}`);
    
    return sitemap;
  } catch (error) {
    console.error('Error generating main sitemap:', error);
    throw error;
  }
}

// Function to generate a sitemap specifically for service pages
export async function generateServicesSitemap(baseUrl: string = 'https://petrosia.in'): Promise<string> {
  try {
    console.log('Generating services sitemap...');
    
    // Get current date in the format required for sitemap (YYYY-MM-DD)
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Start the XML document
    let servicesXml = createXmlHeader();
    
    // Define all service pages
    const servicePages = [
      '/services',                   // main services page
      '/services/grooming',          // grooming services
      '/services/vets',              // veterinary services
      '/services/walkers',           // dog walking services
      '/services/delivery',          // pet delivery services
      '/services/premium-foods',     // premium foods services
      '/services/checkup',           // health checkup services
      '/services/daycare',           // pet daycare services
      '/services/boarding',          // pet boarding services
      '/services/providers',         // all service providers
      '/services/providers/grooming', // grooming providers
      '/services/providers/vets',     // vet providers
      '/services/providers/walkers',  // walker providers
      '/services/providers/daycare',  // daycare providers
      '/services/providers/boarding'  // boarding providers
    ];
    
    // Add service pages to sitemap
    servicePages.forEach(page => {
      servicesXml += createUrlEntry(
        baseUrl, 
        page, 
        'weekly', 
        page === '/services' ? '0.9' : '0.8', 
        currentDate
      );
    });
    
    // Close the XML document
    servicesXml += createXmlFooter();
    
    // Write the sitemap to the public directory
    const servicesXmlPath = path.join(process.cwd(), 'public', 'services.xml');
    fs.writeFileSync(servicesXmlPath, servicesXml);
    console.log(`Services sitemap generated and saved to ${servicesXmlPath}`);
    
    return servicesXml;
  } catch (error) {
    console.error('Error generating services sitemap:', error);
    throw error;
  }
}

// Function to generate a sitemap for pet category pages
export async function generatePetsSitemap(baseUrl: string = 'https://petrosia.in'): Promise<string> {
  try {
    console.log('Generating pets sitemap...');
    
    // Get current date in the format required for sitemap (YYYY-MM-DD)
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Start the XML document
    let petsXml = createXmlHeader();
    
    // Define all pet category pages
    const petPages = [
      '/pets',             // main pets page
      '/pets/dogs',        // dogs category
      '/pets/cats',        // cats category
      '/pets/birds',       // birds category
      '/pets/fish'         // fish category
    ];
    
    // Add pet pages to sitemap
    petPages.forEach(page => {
      petsXml += createUrlEntry(
        baseUrl, 
        page, 
        'weekly', 
        page === '/pets' ? '0.9' : '0.8', 
        currentDate
      );
    });
    
    // Close the XML document
    petsXml += createXmlFooter();
    
    // Write the sitemap to the public directory
    const petsXmlPath = path.join(process.cwd(), 'public', 'pets.xml');
    fs.writeFileSync(petsXmlPath, petsXml);
    console.log(`Pets sitemap generated and saved to ${petsXmlPath}`);
    
    return petsXml;
  } catch (error) {
    console.error('Error generating pets sitemap:', error);
    throw error;
  }
}

// Function to generate a sitemap for dog breeds pages
export async function generateDogBreedsSitemap(baseUrl: string = 'https://petrosia.in'): Promise<string> {
  try {
    console.log('Generating dog breeds sitemap...');
    
    // Get current date in the format required for sitemap (YYYY-MM-DD)
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Start the XML document
    let breedsXml = createXmlHeader();
    
    // Add static breed pages
    const breedPages = [
      '/dog-breeds',                // main dog breeds page
      '/dog-breeds/compare',        // breed comparison tool
      '/dog-breeds/size/small',     // small dog breeds
      '/dog-breeds/size/medium',    // medium dog breeds
      '/dog-breeds/size/large'      // large dog breeds
    ];
    
    // Add static breed pages to sitemap
    breedPages.forEach(page => {
      breedsXml += createUrlEntry(
        baseUrl, 
        page, 
        'weekly', 
        page === '/dog-breeds' ? '0.9' : '0.8', 
        currentDate
      );
    });
    
    // Add dynamic dog breed pages
    try {
      const breeds = await storage.getAllDogBreeds();
      
      if (breeds && breeds.length > 0) {
        breeds.forEach((breed: { slug?: string; name: string }) => {
          const breedSlug = breed.slug || breed.name.toLowerCase().replace(/\s+/g, '-');
          breedsXml += createUrlEntry(
            baseUrl, 
            `/dog-breeds/${breedSlug}`, 
            'monthly', 
            '0.7', 
            currentDate
          );
        });
      }
    } catch (error) {
      console.error('Error fetching breeds for sitemap:', error);
    }
    
    // Close the XML document
    breedsXml += createXmlFooter();
    
    // Write the sitemap to the public directory
    const breedsXmlPath = path.join(process.cwd(), 'public', 'dog-breeds.xml');
    fs.writeFileSync(breedsXmlPath, breedsXml);
    console.log(`Dog breeds sitemap generated and saved to ${breedsXmlPath}`);
    
    return breedsXml;
  } catch (error) {
    console.error('Error generating dog breeds sitemap:', error);
    throw error;
  }
}

// Function to generate a sitemap for blog pages
export async function generateBlogSitemap(baseUrl: string = 'https://petrosia.in'): Promise<string> {
  try {
    console.log('Generating blog sitemap...');
    
    // Get current date in the format required for sitemap (YYYY-MM-DD)
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Start the XML document
    let blogXml = createXmlHeader();
    
    // Add main blog page
    blogXml += createUrlEntry(baseUrl, '/blog', 'weekly', '0.9', currentDate);
    
    // Add dynamic blog posts
    try {
      const blogPosts = await storage.getAllBlogPosts();
      const approvedPosts = blogPosts.filter(post => post.approved);
      
      approvedPosts.forEach((post: { slug: string }) => {
        blogXml += createUrlEntry(
          baseUrl, 
          `/blog/${post.slug}`, 
          'weekly', 
          '0.7', 
          currentDate
        );
      });
    } catch (error) {
      console.error('Error fetching blog posts for sitemap:', error);
    }
    
    // Close the XML document
    blogXml += createXmlFooter();
    
    // Write the sitemap to the public directory
    const blogXmlPath = path.join(process.cwd(), 'public', 'blog.xml');
    fs.writeFileSync(blogXmlPath, blogXml);
    console.log(`Blog sitemap generated and saved to ${blogXmlPath}`);
    
    return blogXml;
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    throw error;
  }
}

// Function to generate a sitemap for pet listings
export async function generateListingsSitemap(baseUrl: string = 'https://petrosia.in'): Promise<string> {
  try {
    console.log('Generating pet listings sitemap...');
    
    // Get current date in the format required for sitemap (YYYY-MM-DD)
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Start the XML document
    let listingsXml = createXmlHeader();
    
    // Add main listings page
    listingsXml += createUrlEntry(baseUrl, '/listings', 'daily', '0.8', currentDate);
    
    // Add dynamic content - Pet Listings
    try {
      const petListings = await storage.getAllPetListings();
      const approvedListings = petListings.filter(listing => listing.approved);
      
      approvedListings.forEach(listing => {
        listingsXml += createUrlEntry(
          baseUrl, 
          `/pet/${listing.id}`, 
          'daily', 
          '0.7', 
          currentDate
        );
      });
    } catch (error) {
      console.error('Error fetching pet listings for sitemap:', error);
    }
    
    // Close the XML document
    listingsXml += createXmlFooter();
    
    // Write the sitemap to the public directory
    const listingsXmlPath = path.join(process.cwd(), 'public', 'listings.xml');
    fs.writeFileSync(listingsXmlPath, listingsXml);
    console.log(`Pet listings sitemap generated and saved to ${listingsXmlPath}`);
    
    return listingsXml;
  } catch (error) {
    console.error('Error generating pet listings sitemap:', error);
    throw error;
  }
}

// Function to generate all sitemaps
export async function generateAllSitemaps(baseUrl: string = 'https://petrosia.in'): Promise<void> {
  try {
    // Generate all individual sitemaps
    await generateSitemap(baseUrl);
    await generateServicesSitemap(baseUrl);
    await generatePetsSitemap(baseUrl);
    await generateDogBreedsSitemap(baseUrl);
    await generateBlogSitemap(baseUrl);
    await generateListingsSitemap(baseUrl);
    
    // Generate sitemap index
    await generateSitemapIndex(baseUrl);
    
    console.log('All sitemaps generated successfully');
  } catch (error) {
    console.error('Error generating all sitemaps:', error);
    throw error;
  }
}



export function scheduleSitemapGeneration(baseUrl: string = 'https://petrosia.in'): void {
  try {
    // Generate all sitemaps immediately at startup
    generateAllSitemaps(baseUrl).catch(err => console.error('Error generating initial sitemaps:', err));
    
    // Schedule daily regeneration (at midnight)
    nodeCron.schedule('0 0 * * *', () => {
      console.log('Running scheduled sitemap generation...');
      generateAllSitemaps(baseUrl).catch(err => console.error('Error in scheduled sitemap generation:', err));
    });
    
    console.log('Sitemap generation scheduled to run daily at midnight');
  } catch (error) {
    console.error('Error scheduling sitemap generation:', error);
  }
}