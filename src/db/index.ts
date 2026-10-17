import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';
import postgres from 'postgres';
import fs from 'node:fs';
import path from 'node:path';
import * as schema from './schema';

export * from './schema';

const connectionString = process.env.DATABASE_URL;

let dbInstance: any = null;
let isInitialized = false;

async function initLocalSchema(pg: PGlite) {
  if (isInitialized) return;
  try {
    await pg.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        location VARCHAR(150),
        author_name VARCHAR(150) NOT NULL,
        author_role VARCHAR(150),
        cover_image VARCHAR(500) NOT NULL,
        status VARCHAR(20) DEFAULT 'draft' NOT NULL,
        scheduled_for TIMESTAMP WITH TIME ZONE,
        published_at TIMESTAMP WITH TIME ZONE,
        is_featured BOOLEAN DEFAULT false,
        read_time VARCHAR(50) DEFAULT '٥ دقائق',
        views_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS subscribers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(150) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    isInitialized = true;
  } catch (err) {
    console.error('Error initializing local tables:', err);
  }
}

const globalForDb = globalThis as unknown as {
  __localPgliteClient?: PGlite;
  __dbInstance?: any;
  __isInitialized?: boolean;
};

export function getDb() {
  if (globalForDb.__dbInstance) return globalForDb.__dbInstance;

  // 1. If remote Supabase DATABASE_URL is provided, use postgres client
  if (
    connectionString &&
    (connectionString.startsWith('postgres://') || connectionString.startsWith('postgresql://'))
  ) {
    try {
      const client = postgres(connectionString, {
        prepare: false,
        ssl: connectionString.includes('localhost') ? false : 'require',
        max: 10,
      });
      globalForDb.__dbInstance = drizzlePg(client, { schema });
      return globalForDb.__dbInstance;
    } catch (e) {
      console.warn('⚠️ تعذر الاتصال بـ Supabase، التحويل تلقائياً لقاعدة البيانات المحلية PGlite');
    }
  }

  // 2. Otherwise: Use Local PostgreSQL (PGlite)
  try {
    const dataDir = path.resolve(process.cwd(), 'local-data', 'pglite');
    fs.mkdirSync(dataDir, { recursive: true });

    if (!globalForDb.__localPgliteClient) {
      globalForDb.__localPgliteClient = new PGlite(dataDir);
      initLocalSchema(globalForDb.__localPgliteClient);
    }

    globalForDb.__dbInstance = drizzlePglite(globalForDb.__localPgliteClient, { schema });
    return globalForDb.__dbInstance;
  } catch (error) {
    console.error('Failed to initialize local PGlite:', error);
    return null;
  }
}

export function isLocalDatabase(): boolean {
  return !(
    connectionString &&
    (connectionString.startsWith('postgres://') || connectionString.startsWith('postgresql://'))
  );
}

export const db = getDb();
