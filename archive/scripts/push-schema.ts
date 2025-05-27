import { db } from './server/db';
import { eventRegistrations, mediaFiles } from './shared/schema';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

async function pushSchema() {
  try {
    // Create the event_registrations table manually
    await db.execute(`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        event_id INTEGER NOT NULL,
        event_name TEXT NOT NULL,
        event_date TEXT NOT NULL,
        event_location TEXT NOT NULL,
        pet_name TEXT,
        pet_breed TEXT,
        pet_age INTEGER,
        pet_type TEXT,
        special_requirements TEXT,
        status TEXT DEFAULT 'pending',
        user_id INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('Successfully created event_registrations table');
    
    // Create the media_files table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS media_files (
        id SERIAL PRIMARY KEY,
        public_id TEXT NOT NULL UNIQUE,
        original_filename TEXT,
        url TEXT NOT NULL,
        secure_url TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        format TEXT NOT NULL,
        width INTEGER,
        height INTEGER,
        bytes INTEGER NOT NULL,
        duration NUMERIC,
        entity_type TEXT NOT NULL,
        entity_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('Successfully created media_files table');
  } catch (error) {
    console.error('Error pushing schema:', error);
  }
}

pushSchema();