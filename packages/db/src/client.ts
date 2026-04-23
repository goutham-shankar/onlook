import * as schema from '@onlook/db/src/schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
    conn: postgres.Sql | undefined;
};

const databaseUrl = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL ?? process.env.DIRECT_URL;

if (!databaseUrl) {
    throw new Error('Missing database connection string. Set SUPABASE_DATABASE_URL, DATABASE_URL, or DIRECT_URL.');
}

const conn = globalForDb.conn ?? postgres(databaseUrl, { prepare: false });
if (process.env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
export type DrizzleDb = typeof db;