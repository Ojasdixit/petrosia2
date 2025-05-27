import { generateSitemap, generateServicesSitemap } from './server/sitemap-generator';

async function main() {
  try {
    // Manually generate the sitemaps
    console.log('Manually generating sitemaps...');
    
    // First generate the main sitemap
    await generateSitemap();
    console.log('Main sitemap generated successfully.');
    
    // Then generate the services sitemap
    await generateServicesSitemap();
    console.log('Services sitemap generated successfully.');
    
    console.log('All sitemaps generated successfully!');
  } catch (error) {
    console.error('Error generating sitemaps:', error);
  }
}

main();