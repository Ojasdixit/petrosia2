/**
 * This script manually creates a database backup
 * Run it using `npx tsx create-db-backup.ts`
 */

import { createDatabaseBackup } from './server/db-persistence';

async function main() {
  console.log('Starting manual database backup...');
  const result = await createDatabaseBackup();
  if (result) {
    console.log('Database backup created successfully');
  } else {
    console.error('Failed to create database backup');
  }
}

main().catch(console.error);