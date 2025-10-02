'use client';

import { AgCharts } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';
import { useMemo } from 'react';
import { PlayerItemStats } from '@/types/combat';

interface ItemUsageChartProps {
  itemUsage: PlayerItemStats[];
}

export default function ItemUsageChart({ itemUsage }: ItemUsageChartProps) {
  const chartOptions = useMemo(() => {
    // Aggregate all items across all players
    const itemMap = new Map<string, { usage: number; damage: number }>();

    itemUsage.forEach(playerItems => {
      playerItems.items.forEach(item => {
        const existing = itemMap.get(item.itemName) || { usage: 0, damage: 0 };
        itemMap.set(item.itemName, {
          usage: existing.usage + item.usageCount,
          damage: existing.damage + item.totalDamage,
        });
      });
    });

    // Convert to array and get top 10 most used items
    const data = Array.from(itemMap.entries())
      .map(([item, stats]) => ({
        item,
        usage: stats.usage,
        damage: stats.damage,
      }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 10);

    const options: AgChartOptions = {
      data,
      title: {
        text: 'Top 10 Most Used Items',
        fontSize: 18,
        fontWeight: 'bold',
      },
      series: [
        {
          type: 'bar',
          xKey: 'item',
          yKey: 'usage',
          yName: 'Times Used',
          fill: '#8b5cf6',
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
            text: 'Usage Count',
          },
        },
      ],
      legend: {
        enabled: false,
      },
    };

    return options;
  }, [itemUsage]);

  return (
    <div className="w-full h-96 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <AgCharts options={chartOptions} />
    </div>
  );
}

