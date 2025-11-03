import React, { useMemo, useState } from 'react';
import GameHeader from './components/GameHeader';
import Scoreboard from './components/Scoreboard';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xStarts, setXStarts] = useState(true); // alternate who starts each round
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const winner = useMemo(() => calculateWinner(board), [board]);
  const isDraw = useMemo(() => !winner && board.every(Boolean), [board, winner]);

  const currentPlayer = xIsNext ? 'X' : 'O';

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "It's a draw!"
    : `Your turn: ${currentPlayer}`;

  function handleSquareClick(index) {
    if (winner || board[index]) return;

    const next = board.slice();
    next[index] = currentPlayer;
    setBoard(next);

    const w = calculateWinner(next);
    if (w) {
      setScores((prev) => ({ ...prev, [w]: prev[w] + 1 }));
    } else if (!next.includes(null)) {
      // draw; no score update
    } else {
      setXIsNext((prev) => !prev);
    }
  }

  function resetRound() {
    const nextStarterIsX = !xStarts; // alternate who starts
    setXStarts(nextStarterIsX);
    setBoard(Array(9).fill(null));
    setXIsNext(nextStarterIsX);
  }

  function resetScores() {
    setScores({ X: 0, O: 0 });
    // keep starter alternation but also reset current round
    setBoard(Array(9).fill(null));
    setXIsNext(xStarts);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-50">
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <GameHeader />

        <div className="space-y-6">
          <Scoreboard scores={scores} currentPlayer={currentPlayer} />

          <GameBoard board={board} onSquareClick={handleSquareClick} disabled={Boolean(winner || isDraw)} />

          <GameControls
            status={status}
            onResetRound={resetRound}
            onResetScores={resetScores}
            canResetRound={Boolean(winner || isDraw || board.some(Boolean))}
          />

          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            Starting player alternates each round for fairness.
          </div>
        </div>
      </div>
    </div>
  );
}
