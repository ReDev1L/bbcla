-- Backpack Brawl Combat Log Database Schema

-- Combat Sessions Table
CREATE TABLE IF NOT EXISTS combat_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  player_names TEXT NOT NULL, -- JSON array of player names
  total_duration REAL,
  total_events INTEGER
);

-- Combat Events Table
CREATE TABLE IF NOT EXISTS combat_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  timestamp REAL NOT NULL,
  player TEXT NOT NULL,
  item TEXT NOT NULL,
  action TEXT NOT NULL,
  value INTEGER,
  target TEXT,
  is_critical BOOLEAN DEFAULT 0,
  FOREIGN KEY (session_id) REFERENCES combat_sessions(session_id)
);

-- Player Statistics Table
CREATE TABLE IF NOT EXISTS player_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  total_damage INTEGER DEFAULT 0,
  total_healing INTEGER DEFAULT 0,
  total_armor_gained INTEGER DEFAULT 0,
  damage_taken INTEGER DEFAULT 0,
  status_effects_applied INTEGER DEFAULT 0,
  status_effects_received INTEGER DEFAULT 0,
  critical_hits INTEGER DEFAULT 0,
  missed_attacks INTEGER DEFAULT 0,
  FOREIGN KEY (session_id) REFERENCES combat_sessions(session_id)
);

-- Item Usage Statistics
CREATE TABLE IF NOT EXISTS item_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  item_name TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  total_damage INTEGER DEFAULT 0,
  total_healing INTEGER DEFAULT 0,
  FOREIGN KEY (session_id) REFERENCES combat_sessions(session_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_combat_events_session ON combat_events(session_id);
CREATE INDEX IF NOT EXISTS idx_combat_events_player ON combat_events(player);
CREATE INDEX IF NOT EXISTS idx_combat_events_timestamp ON combat_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_player_stats_session ON player_stats(session_id);
CREATE INDEX IF NOT EXISTS idx_item_usage_session ON item_usage(session_id);

