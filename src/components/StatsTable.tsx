'use client';

import { PlayerStats } from '@/types/combat';

interface StatsTableProps {
  playerStats: PlayerStats[];
}

export default function StatsTable({ playerStats }: StatsTableProps) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Detailed Player Statistics
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Player
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Damage
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Healing
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Armor
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Damage Taken
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Critical Hits
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Misses
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Effects Applied
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {playerStats.map((stats, index) => (
              <tr 
                key={stats.playerName}              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {stats.playerName}
                </td>
                <td className="px-4 py-3 text-sm text-right text-red-600 dark:text-red-400 font-semibold">
                  {stats.totalDamage.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-right text-green-600 dark:text-green-400 font-semibold">
                  {stats.totalHealing.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-right text-blue-600 dark:text-blue-400 font-semibold">
                  {stats.totalArmorGained.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                  {stats.damageTaken.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-right text-yellow-600 dark:text-yellow-400">
                  {stats.criticalHits}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                  {stats.missedAttacks}
                </td>
                <td className="px-4 py-3 text-sm text-right text-purple-600 dark:text-purple-400">
                  {stats.statusEffectsApplied}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

