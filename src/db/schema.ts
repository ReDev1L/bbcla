// Drizzle ORM Schema for Cloudflare D1

import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';

// Combat Sessions Table
export const combatSessions = sqliteTable('combat_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: text('session_id').notNull().unique(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  playerNames: text('player_names').notNull(), // JSON array of player names
  totalDuration: real('total_duration'),
  totalEvents: integer('total_events'),
});

// Combat Events Table
export const combatEvents = sqliteTable('combat_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: text('session_id').notNull(),
  timestamp: real('timestamp').notNull(),
  player: text('player').notNull(),
  item: text('item').notNull(),
  action: text('action').notNull(),
  value: integer('value'),
  target: text('target'),
  isCritical: integer('is_critical', { mode: 'boolean' }).default(false),
}, (table) => ({
  sessionIdx: index('idx_combat_events_session').on(table.sessionId),
  playerIdx: index('idx_combat_events_player').on(table.player),
  timestampIdx: index('idx_combat_events_timestamp').on(table.timestamp),
}));

// Player Statistics Table
export const playerStats = sqliteTable('player_stats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: text('session_id').notNull(),
  playerName: text('player_name').notNull(),
  totalDamage: integer('total_damage').default(0),
  totalHealing: integer('total_healing').default(0),
  totalArmorGained: integer('total_armor_gained').default(0),
  damageTaken: integer('damage_taken').default(0),
  statusEffectsApplied: integer('status_effects_applied').default(0),
  statusEffectsReceived: integer('status_effects_received').default(0),
  criticalHits: integer('critical_hits').default(0),
  missedAttacks: integer('missed_attacks').default(0),
}, (table) => ({
  sessionIdx: index('idx_player_stats_session').on(table.sessionId),
}));

// Item Usage Statistics Table
export const itemUsage = sqliteTable('item_usage', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: text('session_id').notNull(),
  playerName: text('player_name').notNull(),
  itemName: text('item_name').notNull(),
  usageCount: integer('usage_count').default(0),
  totalDamage: integer('total_damage').default(0),
  totalHealing: integer('total_healing').default(0),
}, (table) => ({
  sessionIdx: index('idx_item_usage_session').on(table.sessionId),
}));

// Export types for use in application
export type CombatSession = typeof combatSessions.$inferSelect;
export type NewCombatSession = typeof combatSessions.$inferInsert;

export type CombatEvent = typeof combatEvents.$inferSelect;
export type NewCombatEvent = typeof combatEvents.$inferInsert;

export type PlayerStat = typeof playerStats.$inferSelect;
export type NewPlayerStat = typeof playerStats.$inferInsert;

export type ItemUsageStat = typeof itemUsage.$inferSelect;
export type NewItemUsageStat = typeof itemUsage.$inferInsert;

