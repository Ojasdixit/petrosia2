import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Setup neon with websockets
neonConfig.webSocketConstructor = ws;

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function updateAdminPassword() {
  // DATABASE_URL is already set in the environment
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const hashedPassword = await hashPassword('admin123');
    
    const result = await pool.query(
      `UPDATE users SET password = $1 WHERE username = 'admin' RETURNING *`,
      [hashedPassword]
    );
    
    console.log('Admin password updated:', result.rows[0].id);
  } catch (err) {
    console.error('Error updating admin password:', err);
  } finally {
    await pool.end();
  }
}

updateAdminPassword();