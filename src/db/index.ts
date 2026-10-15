import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

// Re-export schema
export * from './schema';

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  if (!connectionString || connectionString.trim() === '') {
    // Graceful fallback for local development before Supabase URL is set
    return null;
  }

  try {
    // Configure postgres client for Supabase connection pooler or direct
    const client = postgres(connectionString, {
      prepare: false, // Required for Supabase transaction pooler (port 6543)
      ssl: connectionString.includes('localhost') ? false : 'require',
      max: 10,
    });
    dbInstance = drizzle(client, { schema });
    return dbInstance;
  } catch (error) {
    console.warn('⚠️ فشل الاتصال بقاعدة بيانات Supabase:', error);
    return null;
  }
}

export const db = getDb();
