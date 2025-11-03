import React from 'react';

export default function GameControls({ status, onResetRound, onResetScores, canResetRound }) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div
        className={`text-center sm:text-left text-sm sm:text-base font-medium ${
          status.includes('X')
            ? 'text-indigo-600'
            : status.includes('O')
            ? 'text-rose-600'
            : 'text-gray-800 dark:text-gray-200'
        }`}
        aria-live="polite"
      >
        {status}
      </div>
      <div className="flex gap-2 justify-center">
        <button
          onClick={onResetRound}
          disabled={!canResetRound}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
        >
          New Round
        </button>
        <button
          onClick={onResetScores}
          className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
        >
          Reset Scores
        </button>
      </div>
    </div>
  );
}
