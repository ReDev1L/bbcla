'use client';

import { AgCharts } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';
import { useMemo } from 'react';
import { CombatEvent } from '@/types/combat';

interface DamageChartProps {
  events: CombatEvent[];
}

export default function DamageChart({ events }: DamageChartProps) {
  const chartOptions = useMemo(() => {
    // Group events by player and timestamp
    const damageByTime = new Map<number, Map<string, number>>();

    events.forEach(event => {
      if (event.action === 'Damage' && event.value) {
        const second = Math.floor(event.timestamp);
        
        if (!damageByTime.has(second)) {
          damageByTime.set(second, new Map());
        }
        
        const playerMap = damageByTime.get(second)!;
        const currentDamage = playerMap.get(event.player) || 0;
        playerMap.set(event.player, currentDamage + event.value);
      }
    });

    // Get unique players
    const players = [...new Set(events.map(e => e.player))];

    // Convert to array format for chart
    const data = Array.from(damageByTime.entries())
      .map(([timestamp, playerMap]) => {
        const point: Record<string, number> = { timestamp };
        players.forEach(player => {
          point[player] = playerMap.get(player) || 0;
        });
        return point;
      })
      .sort((a, b) => a.timestamp - b.timestamp);

    const options: AgChartOptions = {
      data,
      title: {
        text: 'Damage Over Time',
        fontSize: 18,
        fontWeight: 'bold',
      },
      subtitle: {
        text: 'Damage dealt per second',
      },
      series: players.map(player => ({
        type: 'line',
        xKey: 'timestamp',
        yKey: player,
        yName: player,
        strokeWidth: 2,
        marker: {
          enabled: true,
          size: 4,
        },
      })),
      axes: [
        {
          type: 'number',
          position: 'bottom',
          title: {
            text: 'Time (seconds)',
          },
        },
        {
          type: 'number',
          position: 'left',
          title: {
            text: 'Damage',
          },
        },
      ],
      legend: {
        position: 'bottom',
      },
    };

    return options;
  }, [events]);

  return (
    <div className="w-full h-96 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <AgCharts options={chartOptions} />
    </div>
  );
}

