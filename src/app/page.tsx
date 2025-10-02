'use client';

import { useState } from 'react';
import LogInput from '@/components/LogInput';
import DamageChart from '@/components/DamageChart';
import PlayerStatsChart from '@/components/PlayerStatsChart';
import StatsTable from '@/components/StatsTable';
import ItemUsageChart from '@/components/ItemUsageChart';
import StaminaChart from '@/components/StaminaChart';
import type { CombatAnalysis } from '@/types/combat';
import { getVersionString } from '@/lib/version';

export default function Home() {
  const [analysis, setAnalysis] = useState<CombatAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (logText: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logText }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Failed to analyze log');
      }

      const data: CombatAnalysis = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Error analyzing log:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                ⚔️ Backpack Brawl Combat Analyzer
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Analyze your combat logs and gain strategic insights
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Log Input Section */}
        <div className="mb-8">
          <LogInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 dark:text-red-200 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-8">
            {/* Session Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Combat Session Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Players</div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {analysis.session.playerNames.length}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    {analysis.session.playerNames.join(', ')}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">Duration</div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {analysis.session.totalDuration.toFixed(1)}s
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Events</div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {analysis.session.totalEvents}
                  </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">Events/Second</div>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {(analysis.session.totalEvents / analysis.session.totalDuration).toFixed(1)}
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DamageChart events={analysis.session.events} />
              <PlayerStatsChart playerStats={analysis.playerStats} />
            </div>

            {/* Item Usage Chart */}
            <div className="grid grid-cols-1 gap-8">
              <ItemUsageChart itemUsage={analysis.itemUsage} />
            </div>

            {/* Stamina Statistics */}
            <div className="grid grid-cols-1 gap-8">
              <StaminaChart staminaStats={analysis.staminaStats} />
            </div>

            {/* Stats Table */}
            <div>
              <StatsTable playerStats={analysis.playerStats} />
            </div>

            {/* Item Usage by Player */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Item Usage by Player
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysis.itemUsage.map(playerItems => (
                  <div key={playerItems.playerName} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      {playerItems.playerName}
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {playerItems.items
                        .sort((a, b) => b.usageCount - a.usageCount)
                        .slice(0, 10)
                        .map(item => (
                          <div 
                            key={item.itemName}
                            className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded"
                          >
                            <span className="text-gray-700 dark:text-gray-300 font-medium truncate flex-1">
                              {item.itemName}
                            </span>
                            <div className="flex gap-3 ml-2">
                              <span className="text-purple-600 dark:text-purple-400">
                                ×{item.usageCount}
                              </span>
                              {item.totalDamage > 0 && (
                                <span className="text-red-600 dark:text-red-400">
                                  {item.totalDamage}dmg
                                </span>
                              )}
                              {item.totalHealing > 0 && (
                                <span className="text-green-600 dark:text-green-400">
                                  {item.totalHealing}hp
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!analysis && !isLoading && !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No analysis yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Paste a combat log above or load a sample to get started
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white dark:bg-gray-800 shadow-md border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center gap-6">
            {/* Legal Disclaimer */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-500">
              Independent fan-made project. Not affiliated with{' '}
              <a
                href="https://rapidfire.games/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:underline"
              >
                Rapidfire Games
              </a>
              {' '}or{' '}
              <a
                href="https://azurgames.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:underline"
              >
                Azur Games
              </a>
              . Backpack Brawl is a trademark and property of Rapidfire Games and Azur Games.
            </p>
            {/* Built With & GitHub */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Built with{' '}
                <a
                  href="https://opennext.js.org/cloudflare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  OpenNext.js
                </a>
                ,{' '}
                <a
                  href="https://developers.cloudflare.com/d1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Cloudflare D1
                </a>
                , and{' '}
                <a
                  href="https://www.ag-grid.com/charts/react/quick-start/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  AG Charts
                </a>
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/ReDev1L/bbcla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  aria-label="GitHub Repository"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-medium">
                  {getVersionString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
