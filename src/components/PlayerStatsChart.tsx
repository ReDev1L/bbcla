'use client';

import { AgCharts } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';
import { useMemo } from 'react';
import { PlayerStats } from '@/types/combat';

interface PlayerStatsChartProps {
  playerStats: PlayerStats[];
}

export default function PlayerStatsChart({ playerStats }: PlayerStatsChartProps) {
  const chartOptions = useMemo(() => {
    const data = playerStats.map(stats => ({
      player: stats.playerName,
      damage: stats.totalDamage,
      healing: stats.totalHealing,
      armor: stats.totalArmorGained,
    }));

    const options: AgChartOptions = {
      data,
      title: {
        text: 'Player Statistics Comparison',
        fontSize: 18,
        fontWeight: 'bold',
      },
      series: [
        {
          type: 'bar',
          xKey: 'player',
          yKey: 'damage',
          yName: 'Total Damage',
          fill: '#ef4444',
        },
        {
          type: 'bar',
          xKey: 'player',
          yKey: 'healing',
          yName: 'Total Healing',
          fill: '#22c55e',
        },
        {
          type: 'bar',
          xKey: 'player',
          yKey: 'armor',
          yName: 'Total Armor',
          fill: '#3b82f6',
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Player',
          },
        },
        {
          type: 'number',
          position: 'left',
          title: {
            text: 'Value',
          },
        },
      ],
      legend: {
        position: 'bottom',
      },
    };

    return options;
  }, [playerStats]);

  return (
    <div className="w-full h-96 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <AgCharts options={chartOptions} />
    </div>
  );
}

