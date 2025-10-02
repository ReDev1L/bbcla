// API Route for fetching combat sessions with Drizzle ORM
// Based on: https://orm.drizzle.team/docs/connect-cloudflare-d1

import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { getDb } from '@/db';
import { combatSessions } from '@/db/schema';

export async function GET() {
  try {
    // Get Drizzle ORM instance
    const db = getDb();
    
    if (!db) {
      return NextResponse.json(
        { sessions: [] },
        { status: 200 }
      );
    }

    // Get latest sessions using Drizzle ORM
    const results = await db
      .select({
        sessionId: combatSessions.sessionId,
        playerNames: combatSessions.playerNames,
        totalDuration: combatSessions.totalDuration,
        totalEvents: combatSessions.totalEvents,
        createdAt: combatSessions.createdAt,
      })
      .from(combatSessions)
      .orderBy(desc(combatSessions.createdAt))
      .limit(20);

    const sessions = results.map((row) => ({
      sessionId: row.sessionId,
      playerNames: JSON.parse(row.playerNames || '[]'),
      totalDuration: row.totalDuration,
      totalEvents: row.totalEvents,
      createdAt: row.createdAt,
    }));

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
