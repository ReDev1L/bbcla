'use client';

import { AgCharts } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';
import { useMemo } from 'react';
import { PlayerStaminaStats } from '@/types/combat';

interface StaminaChartProps {
  staminaStats: PlayerStaminaStats[];
}

export default function StaminaChart({ staminaStats }: StaminaChartProps) {
  const itemCountOptions = useMemo(() => {
    // Aggregate all items across all players
    const itemMap = new Map<string, number>();

    staminaStats.forEach(playerStats => {
      playerStats.items.forEach(item => {
        const existing = itemMap.get(item.itemName) || 0;
        itemMap.set(item.itemName, existing + item.eventCount);
      });
    });

    // Convert to array and sort by count
    const data = Array.from(itemMap.entries())
      .map(([item, count]) => ({
        item,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15); // Top 15 items

    const options: AgChartOptions = {
      data,
      title: {
        text: 'Items Running Out of Stamina',
        fontSize: 18,
        fontWeight: 'bold',
      },
      series: [
        {
          type: 'bar',
          xKey: 'item',
          yKey: 'count',
          yName: 'Out of Stamina Events',
          fill: '#f59e0b',
          stroke: '#d97706',
          strokeWidth: 1,
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Item',
          },
          label: {
            rotation: 45,
            fontSize: 10,
          },
        },
        {
          type: 'number',
          position: 'left',
          title: {
            text: 'Number of Events',
          },
        },
      ],
      legend: {
        enabled: false,
      },
    };

    return options;
  }, [staminaStats]);

  const timelineOptions = useMemo(() => {
    // Create timeline data: group events by second and count them
    const timelineMap = new Map<number, Map<string, number>>();

    staminaStats.forEach(playerStats => {
      playerStats.items.forEach(item => {
        item.timestamps.forEach(timestamp => {
          const second = Math.floor(timestamp);
          
          if (!timelineMap.has(second)) {
            timelineMap.set(second, new Map());
          }
          
          const playerMap = timelineMap.get(second)!;
          const key = `${playerStats.playerName}`;
          const currentCount = playerMap.get(key) || 0;
          playerMap.set(key, currentCount + 1);
        });
      });
    });

    // Get unique players
    const players = staminaStats.map(ps => ps.playerName);

    // Convert to array format for chart
    const data = Array.from(timelineMap.entries())
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
        text: 'Stamina Events Timeline',
        fontSize: 18,
        fontWeight: 'bold',
      },
      subtitle: {
        text: 'Number of stamina events per second',
      },
      series: players.map(player => ({
        type: 'line',
        xKey: 'timestamp',
        yKey: player,
        yName: player,
        strokeWidth: 2,
        marker: {
          enabled: true,
          size: 6,
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
            text: 'Stamina Events',
          },
        },
      ],
      legend: {
        enabled: true,
        position: 'bottom',
      },
    };

    return options;
  }, [staminaStats]);

  // Check if there's any stamina data
  const hasData = staminaStats.some(ps => ps.totalStaminaEvents > 0);

  if (!hasData) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Out of Stamina Statistics
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No &ldquo;Out of Stamina&rdquo; events detected in this combat session.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Out of Stamina Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {staminaStats.map(playerStats => (
            <div key={playerStats.playerName} className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                {playerStats.playerName}
              </div>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {playerStats.totalStaminaEvents}
              </div>
              <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                Total Stamina Events
              </div>
              <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                {playerStats.items.length} different items
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item Count Chart */}
      <div className="w-full h-96 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <AgCharts options={itemCountOptions} />
      </div>

      {/* Timeline Chart */}
      <div className="w-full h-96 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <AgCharts options={timelineOptions} />
      </div>

      {/* Detailed Breakdown by Player */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Detailed Breakdown by Player
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {staminaStats.map(playerStats => (
            <div key={playerStats.playerName} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {playerStats.playerName}
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {playerStats.items
                  .sort((a, b) => b.eventCount - a.eventCount)
                  .map(item => (
                    <div 
                      key={item.itemName}
                      className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded"
                    >
                      <span className="text-gray-700 dark:text-gray-300 font-medium truncate flex-1">
                        {item.itemName}
                      </span>
                      <div className="flex gap-3 ml-2">
                        <span className="text-orange-600 dark:text-orange-400 font-semibold">
                          ×{item.eventCount}
                        </span>
                        <span className="text-gray-500 dark:text-gray-500 text-xs">
                          @ {item.timestamps.map(t => t.toFixed(1)).join(', ')}s
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

