/**
 * Script to migrate the current database to Supabase
 */
import { createClient } from '@supabase/supabase-js';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './shared/schema';
import dotenv from 'dotenv';

dotenv.config();

// Source database (current PostgreSQL)
const sourcePool = new Pool({ connectionString: process.env.DATABASE_URL });
const sourceDb = drizzle(sourcePool, { schema });

// Destination (Supabase)
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function migrateToSupabase() {
  console.log('Starting migration to Supabase...');
  
  try {
    // 1. Export all tables from the source database
    console.log('Exporting data from source database...');
    
    // Get all tables data
    const users = await sourceDb.select().from(schema.users);
    console.log(`Exported ${users.length} users`);
    
    const petListings = await sourceDb.select().from(schema.petListings);
    console.log(`Exported ${petListings.length} pet listings`);
    
    const serviceProviders = await sourceDb.select().from(schema.serviceProviders);
    console.log(`Exported ${serviceProviders.length} service providers`);
    
    const dogBreeds = await sourceDb.select().from(schema.dogBreeds);
    console.log(`Exported ${dogBreeds.length} dog breeds`);
    
    const newsArticles = await sourceDb.select().from(schema.newsArticles);
    console.log(`Exported ${newsArticles.length} news articles`);
    
    const blogPosts = await sourceDb.select().from(schema.blogPosts);
    console.log(`Exported ${blogPosts.length} blog posts`);
    
    const mediaFiles = await sourceDb.select().from(schema.mediaFiles);
    console.log(`Exported ${mediaFiles.length} media files`);
    
    const serviceBookings = await sourceDb.select().from(schema.serviceBookings);
    console.log(`Exported ${serviceBookings.length} service bookings`);
    
    const adoptionListings = await sourceDb.select().from(schema.adoptionListings);
    console.log(`Exported ${adoptionListings.length} adoption listings`);
    
    const eventRegistrations = await sourceDb.select().from(schema.eventRegistrations);
    console.log(`Exported ${eventRegistrations.length} event registrations`);
    
    const payments = await sourceDb.select().from(schema.payments);
    console.log(`Exported ${payments.length} payments`);
    
    // 2. Import into Supabase
    console.log('\nImporting data to Supabase...');

    // Insert users first (because they are referenced by other tables)
    for (const batch of chunkArray(users, 100)) {
      const { error: usersError } = await supabase.from('users').upsert(batch);
      if (usersError) throw new Error(`Error inserting users: ${usersError.message}`);
    }
    console.log(`Imported users to Supabase`);

    // Import service providers
    for (const batch of chunkArray(serviceProviders, 100)) {
      const { error: providersError } = await supabase.from('service_providers').upsert(batch);
      if (providersError) throw new Error(`Error inserting service providers: ${providersError.message}`);
    }
    console.log(`Imported service providers to Supabase`);

    // Import dog breeds
    for (const batch of chunkArray(dogBreeds, 100)) {
      const { error: breedsError } = await supabase.from('dog_breeds').upsert(batch);
      if (breedsError) throw new Error(`Error inserting dog breeds: ${breedsError.message}`);
    }
    console.log(`Imported dog breeds to Supabase`);

    // Import pet listings
    for (const batch of chunkArray(petListings, 100)) {
      const { error: listingsError } = await supabase.from('pet_listings').upsert(batch);
      if (listingsError) throw new Error(`Error inserting pet listings: ${listingsError.message}`);
    }
    console.log(`Imported pet listings to Supabase`);

    // Import news articles
    for (const batch of chunkArray(newsArticles, 100)) {
      const { error: newsError } = await supabase.from('news_articles').upsert(batch);
      if (newsError) throw new Error(`Error inserting news articles: ${newsError.message}`);
    }
    console.log(`Imported news articles to Supabase`);

    // Import blog posts
    for (const batch of chunkArray(blogPosts, 100)) {
      const { error: blogError } = await supabase.from('blog_posts').upsert(batch);
      if (blogError) throw new Error(`Error inserting blog posts: ${blogError.message}`);
    }
    console.log(`Imported blog posts to Supabase`);

    // Import media files
    for (const batch of chunkArray(mediaFiles, 100)) {
      const { error: mediaError } = await supabase.from('media_files').upsert(batch);
      if (mediaError) throw new Error(`Error inserting media files: ${mediaError.message}`);
    }
    console.log(`Imported media files to Supabase`);

    // Import service bookings
    for (const batch of chunkArray(serviceBookings, 100)) {
      const { error: bookingsError } = await supabase.from('service_bookings').upsert(batch);
      if (bookingsError) throw new Error(`Error inserting service bookings: ${bookingsError.message}`);
    }
    console.log(`Imported service bookings to Supabase`);

    // Import adoption listings
    for (const batch of chunkArray(adoptionListings, 100)) {
      const { error: adoptionsError } = await supabase.from('adoption_listings').upsert(batch);
      if (adoptionsError) throw new Error(`Error inserting adoption listings: ${adoptionsError.message}`);
    }
    console.log(`Imported adoption listings to Supabase`);

    // Import event registrations
    for (const batch of chunkArray(eventRegistrations, 100)) {
      const { error: eventsError } = await supabase.from('event_registrations').upsert(batch);
      if (eventsError) throw new Error(`Error inserting event registrations: ${eventsError.message}`);
    }
    console.log(`Imported event registrations to Supabase`);

    // Import payments
    for (const batch of chunkArray(payments, 100)) {
      const { error: paymentsError } = await supabase.from('payments').upsert(batch);
      if (paymentsError) throw new Error(`Error inserting payments: ${paymentsError.message}`);
    }
    console.log(`Imported payments to Supabase`);

    console.log('\nMigration to Supabase completed successfully!');
    console.log('To use Supabase in your application, update your DATABASE_URL environment variable to use the Supabase connection URL.');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sourcePool.end();
  }
}

// Helper function to split arrays into chunks
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

migrateToSupabase();