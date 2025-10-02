// API Route for analyzing combat logs with Drizzle ORM
// Based on: https://orm.drizzle.team/docs/connect-cloudflare-d1

import { NextRequest, NextResponse } from 'next/server';
import { parseCombatLog, calculatePlayerStats, calculateItemUsage, calculateStaminaStats } from '@/lib/logParser';
import { getDb } from '@/db';
import { combatSessions, combatEvents, playerStats, itemUsage } from '@/db/schema';
import type { CombatAnalysis, CombatEvent, CombatSession, PlayerStats, PlayerItemStats } from '@/types/combat';

interface RequestBody {
  logText: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RequestBody;
    const { logText } = body;

    if (!logText || typeof logText !== 'string') {
      return NextResponse.json(
        { error: 'Invalid log text provided' },
        { status: 400 }
      );
    }

    // Parse the combat log
    const session = parseCombatLog(logText);
    
    if (session.events.length === 0) {
      return NextResponse.json(
        { error: 'No valid events found in the log' },
        { status: 400 }
      );
    }

    // Calculate statistics
    const playerStatsData = calculatePlayerStats(session.events);
    const itemUsageData = calculateItemUsage(session.events);
    const staminaStatsData = calculateStaminaStats(session.events);

    // Build timeline (group events by second)
    const timeline = buildTimeline(session.events);

    // Store in D1 database if available
    await storeCombatSession(session, playerStatsData, itemUsageData);

    const analysis: CombatAnalysis = {
      session,
      playerStats: playerStatsData,
      itemUsage: itemUsageData,
      timeline,
      staminaStats: staminaStatsData,
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing combat log:', error);
    return NextResponse.json(
      { error: 'Failed to analyze combat log' },
      { status: 500 }
    );
  }
}

function buildTimeline(events: CombatEvent[]) {
  const timelineMap = new Map<number, CombatEvent[]>();
  
  for (const event of events) {
    const second = Math.floor(event.timestamp);
    if (!timelineMap.has(second)) {
      timelineMap.set(second, []);
    }
    timelineMap.get(second)!.push(event);
  }

  return Array.from(timelineMap.entries())
    .map(([timestamp, events]) => ({ timestamp, events }))
    .sort((a, b) => a.timestamp - b.timestamp);
}

async function storeCombatSession(
  session: CombatSession,
  playerStatsData: PlayerStats[],
  itemUsageData: PlayerItemStats[]
) {
  try {
    // Get Drizzle ORM instance
    const db = getDb();
    
    if (!db) {
      console.warn('D1 database not available, skipping storage');
      return;
    }

    // Use a transaction to insert all data atomically with individual row inserts to avoid SQL variable limits
    await db.batch([
      // Store combat session
      db.insert(combatSessions).values({
        sessionId: session.sessionId,
        playerNames: JSON.stringify(session.playerNames),
        totalDuration: session.totalDuration,
        totalEvents: session.totalEvents,
      }),
      
      // Store combat events - one row at a time to avoid SQL variable limit
      ...session.events.map(event => 
        db.insert(combatEvents).values({
          sessionId: session.sessionId,
          timestamp: event.timestamp,
          player: event.player,
          item: event.item,
          action: event.action,
          value: event.value || 0,
          target: event.target || null,
          isCritical: event.isCritical || false,
        })
      ),
      
      // Store player stats - one row at a time
      ...playerStatsData.map(stats =>
        db.insert(playerStats).values({
          sessionId: session.sessionId,
          playerName: stats.playerName,
          totalDamage: stats.totalDamage,
          totalHealing: stats.totalHealing,
          totalArmorGained: stats.totalArmorGained,
          damageTaken: stats.damageTaken,
          statusEffectsApplied: stats.statusEffectsApplied,
          statusEffectsReceived: stats.statusEffectsReceived,
          criticalHits: stats.criticalHits,
          missedAttacks: stats.missedAttacks,
        })
      ),
      
      // Store item usage - one row at a time
      ...itemUsageData.flatMap(playerItems =>
        playerItems.items.map(item =>
          db.insert(itemUsage).values({
            sessionId: session.sessionId,
            playerName: playerItems.playerName,
            itemName: item.itemName,
            usageCount: item.usageCount,
            totalDamage: item.totalDamage,
            totalHealing: item.totalHealing,
          })
        )
      ),
    ]);
  } catch (error) {
    console.error('Error storing combat session in D1:', error);
    // Don't throw - allow the analysis to return even if storage fails
  }
}
