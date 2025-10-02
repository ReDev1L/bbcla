// Combat Log Types and Interfaces

export interface CombatEvent {
  timestamp: number;
  player: string;
  item: string;
  action: string;
  value?: number;
  target?: string;
  isCritical?: boolean;
}

export interface CombatSession {
  sessionId: string;
  playerNames: string[];
  totalDuration: number;
  totalEvents: number;
  events: CombatEvent[];
}

export interface PlayerStats {
  playerName: string;
  totalDamage: number;
  totalHealing: number;
  totalArmorGained: number;
  damageTaken: number;
  statusEffectsApplied: number;
  statusEffectsReceived: number;
  criticalHits: number;
  missedAttacks: number;
}

export interface ItemUsage {
  itemName: string;
  usageCount: number;
  totalDamage: number;
  totalHealing: number;
}

export interface PlayerItemStats {
  playerName: string;
  items: ItemUsage[];
}

export interface StaminaItemEvent {
  itemName: string;
  eventCount: number;
  timestamps: number[];
}

export interface PlayerStaminaStats {
  playerName: string;
  items: StaminaItemEvent[];
  totalStaminaEvents: number;
}

export interface CombatAnalysis {
  session: CombatSession;
  playerStats: PlayerStats[];
  itemUsage: PlayerItemStats[];
  timeline: TimelineEvent[];
  staminaStats: PlayerStaminaStats[];
}

export interface TimelineEvent {
  timestamp: number;
  events: CombatEvent[];
}

export interface DamageOverTime {
  timestamp: number;
  [playerName: string]: number;
}

export interface ChartData {
  damageOverTime: DamageOverTime[];
  healingOverTime: DamageOverTime[];
  playerDamageComparison: { player: string; damage: number }[];
  topItems: { item: string; usage: number; damage: number }[];
}

export type ActionType = 
  | 'Damage'
  | 'Healing' 
  | 'Armor'
  | 'Status Effect'
  | 'Buff'
  | 'Debuff'
  | 'Critical'
  | 'Miss'
  | 'Stun'
  | 'Burn'
  | 'Other';

