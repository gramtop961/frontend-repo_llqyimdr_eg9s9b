import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GameHeader from './components/GameHeader';
import Scoreboard from './components/Scoreboard';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import Lobby from './components/Lobby';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

export default function App() {
  const [joined, setJoined] = useState(false);
  const [game, setGame] = useState(null); // server game object
  const [role, setRole] = useState(null); // 'X' or 'O'
  const [gameId, setGameId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const pollRef = useRef(null);

  const status = useMemo(() => {
    if (!game) return '';
    if (game.winner) return `Winner: ${game.winner}`;
    if (game.draw) return "It's a draw!";
    return `Turn: ${game.x_is_next ? 'X' : 'O'}`;
  }, [game]);

  const scores = useMemo(() => ({ X: game?.score_x || 0, O: game?.score_o || 0 }), [game]);
  const currentPlayer = useMemo(() => (game?.x_is_next ? 'X' : 'O'), [game]);

  const fetchGame = useCallback(async (id) => {
    const res = await fetch(`${API_BASE}/api/game/${id}`);
    if (res.ok) {
      const data = await res.json();
      setGame(data);
    }
  }, []);

  const startPolling = useCallback((id) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => fetchGame(id), 1000);
  }, [fetchGame]);

  useEffect(() => {
    return () => pollRef.current && clearInterval(pollRef.current);
  }, []);

  async function handleJoin(code, name) {
    const storedId = localStorage.getItem('ttt_player_id') || `${name}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem('ttt_player_id', storedId);
    setPlayerId(storedId);

    const res = await fetch(`${API_BASE}/api/game/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_id: code, player_id: storedId }),
    });
    if (res.ok) {
      const data = await res.json();
      setRole(data.role);
      setGame(data.game);
      setGameId(code);
      setJoined(true);
      startPolling(code);
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.detail || 'Failed to join game');
    }
  }

  async function handleSquareClick(index) {
    if (!game || game.winner || game.draw) return;
    // only allow move if it's your turn
    const isYourTurn = (role === 'X' && game.x_is_next) || (role === 'O' && !game.x_is_next);
    if (!isYourTurn) return;
    if (game.board[index] !== null) return;

    const res = await fetch(`${API_BASE}/api/game/${gameId}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index, role, player_id: playerId }),
    });
    if (res.ok) {
      const updated = await res.json();
      setGame(updated);
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.detail || 'Move failed');
    }
  }

  async function resetRound() {
    if (!gameId) return;
    const res = await fetch(`${API_BASE}/api/game/${gameId}/reset-round`, { method: 'POST' });
    if (res.ok) setGame(await res.json());
  }

  async function resetScores() {
    if (!gameId) return;
    const res = await fetch(`${API_BASE}/api/game/${gameId}/reset-scores`, { method: 'POST' });
    if (res.ok) setGame(await res.json());
  }

  const canResetRound = Boolean(game && (game.winner || game.draw || game.board.some((v) => v !== null)));
  const board = game?.board || Array(9).fill(null);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-50">
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <GameHeader />

        {!joined ? (
          <div className="mt-4">
            <Lobby onJoin={handleJoin} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-zinc-600 dark:text-zinc-300">Game ID: <span className="font-semibold">{gameId}</span></div>
              <div className="text-sm text-zinc-600 dark:text-zinc-300">You are: <span className={`font-semibold ${role === 'X' ? 'text-indigo-600' : 'text-rose-600'}`}>{role}</span></div>
            </div>

            <Scoreboard scores={scores} currentPlayer={currentPlayer} />

            <GameBoard board={board} onSquareClick={handleSquareClick} disabled={Boolean(game?.winner || game?.draw)} />

            <GameControls
              status={status}
              onResetRound={resetRound}
              onResetScores={resetScores}
              canResetRound={canResetRound}
            />

            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              Starting player alternates each round for fairness. Your moves are synced online.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
