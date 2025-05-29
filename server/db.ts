import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

if (!process.env.SUPABASE_DB_URL) {
  throw new Error(
    "SUPABASE_DB_URL must be set. Please check your environment variables.",
  );
}

// Set NODE_TLS_REJECT_UNAUTHORIZED to allow self-signed certificates
// This is only for development - should be properly configured in production
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Create the connection pool with proper SSL configuration
export const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false, // For development only
  },
});

export const db = drizzle(pool, { schema });