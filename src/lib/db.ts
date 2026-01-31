import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/src/db/schema/schema';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

export const db = drizzle({ client: sql, schema });

export type DB = typeof db;
