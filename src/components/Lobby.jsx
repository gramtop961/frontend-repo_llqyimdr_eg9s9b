import React, { useEffect, useState } from 'react';

export default function Lobby({ onJoin }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('ttt_name');
    if (savedName) setName(savedName);
  }, []);

  function handleJoin(e) {
    e.preventDefault();
    setError('');
    const trimmed = code.trim();
    if (!/^\d{4}$/.test(trimmed)) {
      setError('Enter a 4‑digit game ID');
      return;
    }
    const playerName = name.trim() || 'Player';
    localStorage.setItem('ttt_name', playerName);
    onJoin(trimmed, playerName);
  }

  return (
    <div className="max-w-md mx-auto bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-center">Join a Game</h2>
      <p className="text-sm text-center text-zinc-600 dark:text-zinc-300 mt-1">Both players enter the same 4‑digit code.</p>
      <form onSubmit={handleJoin} className="mt-5 space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-zinc-600 dark:text-zinc-300">Your Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-zinc-600 dark:text-zinc-300">Game ID</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
            placeholder="1234"
            inputMode="numeric"
            maxLength={4}
            className="w-full text-center tracking-widest text-2xl font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {error && <div className="text-sm text-rose-600">{error}</div>}
        <button type="submit" className="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
          Join / Create Game
        </button>
      </form>
    </div>
  );
}
