import React from 'react';

export default function Scoreboard({ scores, currentPlayer }) {
  const badge = (label, score, active) => (
    <div
      className={`flex-1 rounded-xl border px-4 py-3 text-center transition ${
        active
          ? 'bg-indigo-600 text-white border-indigo-600 shadow'
          : 'bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100'
      }`}
    >
      <div className="text-xs uppercase tracking-wide opacity-80">{label}</div>
      <div className="text-2xl font-semibold mt-1">{score}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-3 gap-3 items-stretch">
      {badge('Player X', scores.X, currentPlayer === 'X')}
      <div className="flex items-center justify-center">
        <span className="text-sm text-gray-600 dark:text-gray-300">Turn</span>
      </div>
      {badge('Player O', scores.O, currentPlayer === 'O')}
    </div>
  );
}
