// Combat Log Parser Utility

import { CombatEvent, CombatSession, PlayerStats, ItemUsage, PlayerItemStats, PlayerStaminaStats, StaminaItemEvent } from '@/types/combat';

/**
 * Parses a combat log text and extracts structured data
 */
export function parseCombatLog(logText: string): CombatSession {
  const lines = logText.trim().split('\n');
  const events: CombatEvent[] = [];
  const playersSet = new Set<string>();

  for (const line of lines) {
    const event = parseLogLine(line);
    if (event) {
      events.push(event);
      playersSet.add(event.player);
    }
  }

  const playerNames = Array.from(playersSet);
  const maxTimestamp = Math.max(...events.map(e => e.timestamp), 0);
  
  return {
    sessionId: generateSessionId(),
    playerNames,
    totalDuration: maxTimestamp,
    totalEvents: events.length,
    events,
  };
}

/**
 * Parses a single log line into a CombatEvent
 */
function parseLogLine(line: string): CombatEvent | null {
  // Format: "timestamp\tplayer\titem action [value] [additional info]"
  const parts = line.split('\t');
  if (parts.length < 3) return null;

  const timestampStr = parts[0].trim();
  const player = parts[1].trim();
  const actionText = parts[2].trim();

  // Parse timestamp (can be "0.0s", "1.2s", or "-" for continuation)
  let timestamp = 0;
  if (timestampStr !== '-') {
    const match = timestampStr.match(/(\d+\.?\d*)s?/);
    if (match) {
      timestamp = parseFloat(match[1]);
    }
  }

  // Parse action text
  const actionParts = actionText.split(/\s+/);
  if (actionParts.length < 2) return null;

  const item = extractItemName(actionText);
  const { action, value, target, isCritical } = parseAction(actionText);

  return {
    timestamp,
    player,
    item,
    action,
    value,
    target,
    isCritical,
  };
}

/**
 * Extracts item name from action text
 */
function extractItemName(actionText: string): string {
  // Check for game mechanics that don't have items
  if (actionText.match(/^\d+\s+Burn\s+extinguished/)) {
    return 'Burn (Mechanic)';
  }
  
  if (actionText.match(/^Burn\s+\d+\s+Damage/)) {
    return 'Burn (Mechanic)';
  }
  
  if (actionText.includes('Day begins')) {
    return 'Day Cycle (Mechanic)';
  }
  
  // Common patterns:
  // "Item Name gained X"
  // "Item Name inflicted X"
  // "Item Name X Damage"
  // "Item Name added X"
  
  const patterns = [
    /^(.+?)\s+gained/,
    /^(.+?)\s+inflicted/,
    /^(.+?)\s+added/,
    /^(.+?)\s+\d+\s+(?:Damage|CritDamage|Healing)/,
    /^(.+?)\s+healed/,
    /^(.+?)\s+stunned/,
    /^(.+?)\s+missed/,
    /^(.+?)\s+out of/,
  ];

  for (const pattern of patterns) {
    const match = actionText.match(pattern);
    if (match) return match[1].trim();
  }

  // If no pattern matches, take first few words
  const words = actionText.split(/\s+/);
  return words.slice(0, Math.min(3, words.length)).join(' ');
}

/**
 * Parses the action details from action text
 */
function parseAction(actionText: string): {
  action: string;
  value?: number;
  target?: string;
  isCritical?: boolean;
} {
  let action = 'Unknown';
  let value: number | undefined;
  let target: string | undefined;
  let isCritical = false;

  // Extract value
  const valueMatch = actionText.match(/(\d+)\s+/);
  if (valueMatch) {
    value = parseInt(valueMatch[1]);
  }

  // Determine action type
  if (actionText.includes('Damage')) {
    action = 'Damage';
    if (actionText.includes('Critical') || actionText.includes('CritDamage')) {
      isCritical = true;
    }
  } else if (actionText.includes('healed') || actionText.includes('Health')) {
    action = 'Healing';
  } else if (actionText.includes('Armor') || actionText.includes('added')) {
    action = 'Armor';
  } else if (actionText.includes('gained') && actionText.includes('speed')) {
    action = 'Speed Buff';
  } else if (actionText.includes('gained') && (actionText.includes('Stamina') || actionText.includes('Luck') || actionText.includes('Haste'))) {
    action = 'Buff';
  } else if (actionText.includes('inflicted') && actionText.includes('Burn')) {
    action = 'Burn';
  } else if (actionText.includes('inflicted') && actionText.includes('Blind')) {
    action = 'Blind';
  } else if (actionText.includes('stunned')) {
    action = 'Stun';
    const targetMatch = actionText.match(/stunned\s+(\w+)/);
    if (targetMatch) target = targetMatch[1];
  } else if (actionText.includes('missed')) {
    action = 'Miss';
  } else if (actionText.includes('extinguished')) {
    action = 'Burn Extinguished';
  } else if (actionText.includes('out of Stamina')) {
    action = 'Out of Stamina';
  } else if (actionText.includes('Day begins')) {
    action = 'Day Begins';
  } else if (actionText.includes('Thorns')) {
    action = 'Thorns Damage';
  }

  return { action, value, target, isCritical };
}

/**
 * Calculates player statistics from combat events
 */
export function calculatePlayerStats(events: CombatEvent[]): PlayerStats[] {
  const statsMap = new Map<string, PlayerStats>();

  // Initialize stats for each player
  const players = [...new Set(events.map(e => e.player))];
  for (const player of players) {
    statsMap.set(player, {
      playerName: player,
      totalDamage: 0,
      totalHealing: 0,
      totalArmorGained: 0,
      damageTaken: 0,
      statusEffectsApplied: 0,
      statusEffectsReceived: 0,
      criticalHits: 0,
      missedAttacks: 0,
    });
  }

  // Process events
  for (const event of events) {
    const stats = statsMap.get(event.player);
    if (!stats) continue;

    const value = event.value || 0;

    switch (event.action) {
      case 'Damage':
        stats.totalDamage += value;
        if (event.isCritical) {
          stats.criticalHits++;
        }
        // Damage to target
        if (event.target) {
          const targetStats = statsMap.get(event.target);
          if (targetStats) {
            targetStats.damageTaken += value;
          }
        }
        break;
      
      case 'Healing':
        stats.totalHealing += value;
        break;
      
      case 'Armor':
        stats.totalArmorGained += value;
        break;
      
      case 'Burn':
      case 'Blind':
      case 'Stun':
        stats.statusEffectsApplied++;
        if (event.target) {
          const targetStats = statsMap.get(event.target);
          if (targetStats) {
            targetStats.statusEffectsReceived++;
          }
        }
        break;
      
      case 'Miss':
        stats.missedAttacks++;
        break;
      
      case 'Thorns Damage':
        stats.damageTaken += value;
        break;
    }
  }

  return Array.from(statsMap.values());
}

/**
 * Calculates item usage statistics by player
 */
export function calculateItemUsage(events: CombatEvent[]): PlayerItemStats[] {
  const playerItemMap = new Map<string, Map<string, ItemUsage>>();

  for (const event of events) {
    // Skip game mechanics - they're not items
    if (event.item.endsWith('(Mechanic)')) {
      continue;
    }
    
    if (!playerItemMap.has(event.player)) {
      playerItemMap.set(event.player, new Map());
    }

    const itemMap = playerItemMap.get(event.player)!;
    
    if (!itemMap.has(event.item)) {
      itemMap.set(event.item, {
        itemName: event.item,
        usageCount: 0,
        totalDamage: 0,
        totalHealing: 0,
      });
    }

    const itemStats = itemMap.get(event.item)!;
    itemStats.usageCount++;

    const value = event.value || 0;
    if (event.action === 'Damage') {
      itemStats.totalDamage += value;
    } else if (event.action === 'Healing') {
      itemStats.totalHealing += value;
    }
  }

  const result: PlayerItemStats[] = [];
  for (const [playerName, itemMap] of playerItemMap) {
    result.push({
      playerName,
      items: Array.from(itemMap.values()),
    });
  }

  return result;
}

/**
 * Calculates "Out of Stamina" statistics by player and item
 */
export function calculateStaminaStats(events: CombatEvent[]): PlayerStaminaStats[] {
  const playerStaminaMap = new Map<string, Map<string, StaminaItemEvent>>();

  for (const event of events) {
    // Only track "Out of Stamina" events
    if (event.action !== 'Out of Stamina') {
      continue;
    }
    
    if (!playerStaminaMap.has(event.player)) {
      playerStaminaMap.set(event.player, new Map());
    }

    const itemMap = playerStaminaMap.get(event.player)!;
    
    if (!itemMap.has(event.item)) {
      itemMap.set(event.item, {
        itemName: event.item,
        eventCount: 0,
        timestamps: [],
      });
    }

    const itemStats = itemMap.get(event.item)!;
    itemStats.eventCount++;
    itemStats.timestamps.push(event.timestamp);
  }

  const result: PlayerStaminaStats[] = [];
  for (const [playerName, itemMap] of playerStaminaMap) {
    const items = Array.from(itemMap.values());
    const totalStaminaEvents = items.reduce((sum, item) => sum + item.eventCount, 0);
    
    result.push({
      playerName,
      items,
      totalStaminaEvents,
    });
  }

  return result;
}

/**
 * Generates a unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

