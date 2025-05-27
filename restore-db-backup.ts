/**
 * This script manually restores the database from backup
 * Run it using `npx tsx restore-db-backup.ts`
 */

import { restoreDatabaseFromBackup } from './server/db-persistence';

async function main() {
  console.log('Starting manual database restoration...');
  const result = await restoreDatabaseFromBackup();
  if (result) {
    console.log('Database restored successfully');
  } else {
    console.error('Failed to restore database');
  }
}

main().catch(console.error);