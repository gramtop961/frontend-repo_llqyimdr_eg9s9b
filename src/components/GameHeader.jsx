import React from 'react';

export default function GameHeader() {
  return (
    <header className="w-full text-center py-8">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
        Tic Tac Toe
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Two players. One board. Take turns to get three in a row.
      </p>
    </header>
  );
}
