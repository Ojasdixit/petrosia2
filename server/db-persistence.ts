/**
 * Database persistence and recovery system
 * 
 * This file implements database verification and schema initialization
 * to ensure the database is properly set up for the application.
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { db } from './db';
import { sql } from 'drizzle-orm';

const execAsync = promisify(exec);

// Local data directory for application storage
const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'db-backups');
const SCHEMA_DIR = path.join(DATA_DIR, 'schema');

// Ensure data directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

if (!fs.existsSync(SCHEMA_DIR)) {
  fs.mkdirSync(SCHEMA_DIR, { recursive: true });
}

/**
 * Check if the database is empty (tables don't exist)
 */
export async function isDatabaseEmpty(): Promise<boolean> {
  try {
    // Check if the users table exists as a proxy for database initialization
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `);
    
    return !result.rows[0]?.exists;
  } catch (error) {
    console.error('Error checking if database is empty:', error);
    // If we can't check, assume it's empty to trigger recovery
    return true;
  }
}

/**
 * Create a database backup
 */
export async function createDatabaseBackup(): Promise<boolean> {
  try {
    console.log('Creating database backup...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}.sql`);
    
    // Create the backup using properly escaped credentials for Windows
    const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
    await execAsync(`pg_dump "${dbUrl}" > "${backupPath}"`);
    
    // Create a copy as the latest backup
    fs.copyFileSync(backupPath, LATEST_BACKUP_PATH);
    
    console.log(`Created database backup: ${backupPath}`);
    
    // Clean up old backups (keep only the 5 most recent)
    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('backup-'))
      .map(file => path.join(BACKUP_DIR, file))
      .sort((a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime());
    
    if (backups.length > 5) {
      backups.slice(5).forEach(oldBackup => {
        fs.unlinkSync(oldBackup);
        console.log(`Removed old backup: ${oldBackup}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error creating database backup:', error);
    return false;
  }
}

/**
 * Restore the database from the latest backup
 */
export async function restoreDatabaseFromBackup(): Promise<boolean> {
  try {
    if (!fs.existsSync(LATEST_BACKUP_PATH)) {
      console.log('No backup file found to restore');
      return false;
    }
    
    console.log('Restoring database from backup...');
    
    // First drop and recreate the schema to ensure clean restoration
    await db.execute(sql`DROP SCHEMA public CASCADE`);
    await db.execute(sql`CREATE SCHEMA public`);
    
    // Restore from backup using properly escaped credentials for Windows
    const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
    await execAsync(`psql "${dbUrl}" < "${LATEST_BACKUP_PATH}"`);
    
    console.log('Database restored successfully from backup');
    return true;
  } catch (error) {
    console.error('Error restoring database from backup:', error);
    return false;
  }
}

/**
 * Initialize the database connection and validate it
 */
export async function initDatabasePersistence(): Promise<void> {
  try {
    console.log('Initializing database connection...');
    
    // Check if the database is accessible and has tables
    try {
      const empty = await isDatabaseEmpty();
      
      if (empty) {
        console.log('Database appears to be empty. Tables will be created as needed.');
      } else {
        console.log('Database connection successful - tables exist.');
      }
    } catch (dbErr) {
      console.warn('Could not verify database state:', dbErr);
      console.log('Continuing server startup...');
    }
    
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error during database initialization:', error);
    console.log('Continuing server startup despite database errors');
  }
}

/**
 * Check if PostgreSQL command line tools are available
 */
async function checkPgToolsAvailable(): Promise<boolean> {
  try {
    await execAsync('pg_dump --version');
    await execAsync('psql --version');
    return true;
  } catch (error) {
    return false;
  }
}