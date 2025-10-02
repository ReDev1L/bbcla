CREATE TABLE `combat_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`timestamp` real NOT NULL,
	`player` text NOT NULL,
	`item` text NOT NULL,
	`action` text NOT NULL,
	`value` integer,
	`target` text,
	`is_critical` integer DEFAULT false
);
--> statement-breakpoint
CREATE INDEX `idx_combat_events_session` ON `combat_events` (`session_id`);--> statement-breakpoint
CREATE INDEX `idx_combat_events_player` ON `combat_events` (`player`);--> statement-breakpoint
CREATE INDEX `idx_combat_events_timestamp` ON `combat_events` (`timestamp`);--> statement-breakpoint
CREATE TABLE `combat_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`player_names` text NOT NULL,
	`total_duration` real,
	`total_events` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `combat_sessions_session_id_unique` ON `combat_sessions` (`session_id`);--> statement-breakpoint
CREATE TABLE `item_usage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`player_name` text NOT NULL,
	`item_name` text NOT NULL,
	`usage_count` integer DEFAULT 0,
	`total_damage` integer DEFAULT 0,
	`total_healing` integer DEFAULT 0
);
--> statement-breakpoint
CREATE INDEX `idx_item_usage_session` ON `item_usage` (`session_id`);--> statement-breakpoint
CREATE TABLE `player_stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`player_name` text NOT NULL,
	`total_damage` integer DEFAULT 0,
	`total_healing` integer DEFAULT 0,
	`total_armor_gained` integer DEFAULT 0,
	`damage_taken` integer DEFAULT 0,
	`status_effects_applied` integer DEFAULT 0,
	`status_effects_received` integer DEFAULT 0,
	`critical_hits` integer DEFAULT 0,
	`missed_attacks` integer DEFAULT 0
);
--> statement-breakpoint
CREATE INDEX `idx_player_stats_session` ON `player_stats` (`session_id`);