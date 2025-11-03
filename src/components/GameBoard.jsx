import React from 'react';

export default function GameBoard({ board, onSquareClick, disabled }) {
  const renderSquare = (index) => {
    const value = board[index];
    const isFilled = value !== null;

    return (
      <button
        key={index}
        onClick={() => onSquareClick(index)}
        disabled={disabled || isFilled}
        aria-label={`Square ${index + 1}${value ? `: ${value}` : ''}`}
        className={`aspect-square rounded-xl border text-4xl font-bold flex items-center justify-center select-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
          isFilled
            ? 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
            : 'bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
        }`}
      >
        <span className={`${value === 'X' ? 'text-indigo-600' : 'text-rose-500'}`}>
          {value}
        </span>
      </button>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-sm mx-auto">
      {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
    </div>
  );
}
