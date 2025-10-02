// Database initialization for Drizzle ORM with Cloudflare D1
// Based on: https://orm.drizzle.team/docs/get-started/d1-new

import { drizzle } from 'drizzle-orm/d1';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import * as schema from './schema';

// Export schema for use in other modules
export { schema };

/**
 * Get Drizzle ORM instance with D1 database binding
 * Accesses DB from Cloudflare runtime context via OpenNext
 * 
 * @param db - Optional D1Database binding. If not provided, will attempt to get from Cloudflare context
 * @returns Drizzle ORM instance or null if DB is not available
 * @example
 * // In API routes:
 * const db = getDb();
 * if (db) {
 *   const result = await db.select().from(users);
 * }
 */
export function getDb(db?: D1Database): DrizzleD1Database<typeof schema> | null {
  // If D1Database is passed directly, use it
  if (db) {
    return drizzle(db, { schema });
  }
  
  // Otherwise, try to get it from Cloudflare context
  try {
    const context = getCloudflareContext();
    if (context?.env?.DB) {
      return drizzle(context.env.DB as D1Database, { schema });
    }
  } catch (error) {
    console.warn('Failed to get Cloudflare context:', error);
  }
  
  return null;
}

