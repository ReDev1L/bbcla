'use client';

import { useState } from 'react';

interface LogInputProps {
  onAnalyze: (logText: string) => void;
  isLoading: boolean;
}

export default function LogInput({ onAnalyze, isLoading }: LogInputProps) {
  const [logText, setLogText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (logText.trim()) {
      onAnalyze(logText);
    }
  };

  const handleLoadSample = async (sampleNumber: number) => {
    try {
      const response = await fetch(`/sample_log${sampleNumber}.txt`);
      const text = await response.text();
      setLogText(text);
    } catch (error) {
      console.error('Error loading sample:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Paste Combat Log
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
            placeholder="Paste your Backpack Brawl combat log here..."
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-700 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     font-mono text-sm resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            type="submit"
            disabled={!logText.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium
                     hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                     transition-colors duration-200"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Combat Log'}
          </button>

          <button
            type="button"
            onClick={() => handleLoadSample(1)}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                     rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Load Sample 1
          </button>

          <button
            type="button"
            onClick={() => handleLoadSample(2)}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                     rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Load Sample 2
          </button>

          <button
            type="button"
            onClick={() => setLogText('')}
            disabled={isLoading || !logText}
            className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 
                     rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-800
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      </form>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          <strong>Tip:</strong> You can paste combat logs from Backpack Brawl or use the sample logs to see the analysis.
        </p>
      </div>
    </div>
  );
}

