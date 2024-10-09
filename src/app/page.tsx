'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { X, Circle, RotateCcw, RefreshCw } from 'lucide-react';
import { Button } from './_components/button';

type Player = 'X' | 'O';
type Board = (Player | null)[];

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [winningCombo, setWinningCombo] = useState<number[] | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, Draw: 0 });

  useEffect(() => {
    checkWinner();
  }, [board]);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const checkWinner = () => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setWinningCombo(combo);
        setScores((prev) => ({
          ...prev,
          [board[a] as Player]: prev[board[a] as Player] + 1,
        }));
        return;
      }
    }

    if (board.every((cell) => cell !== null)) {
      setWinner('Draw');
      setScores((prev) => ({ ...prev, Draw: prev.Draw + 1 }));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningCombo(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, Draw: 0 });
    resetGame();
  };

  const PlayerIcon = ({ player }: { player: Player }) =>
    player === 'X' ? <X className="w-8 h-8" /> : <Circle className="w-8 h-8" />;

  const WinningLine = () => {
    if (!winningCombo) return null;

    const [start, end] = [winningCombo[0], winningCombo[2]];
    const isHorizontal = Math.abs(start - end) === 2;
    const isVertical = Math.abs(start - end) === 6;
    const isDiagonal =
      Math.abs(start - end) === 8 || (start === 2 && end === 6);

    let x1, y1, x2, y2;

    if (isHorizontal) {
      const row = Math.floor(start / 3);
      y1 = y2 = (row + 0.5) * 33.33;
      x1 = 0;
      x2 = 100;
    } else if (isVertical) {
      const col = start % 3;
      x1 = x2 = (col + 0.5) * 33.33;
      y1 = 0;
      y2 = 100;
    } else if (isDiagonal) {
      if (start === 0) {
        x1 = y1 = 0;
        x2 = y2 = 100;
      } else {
        x1 = 100;
        y1 = 0;
        x2 = 0;
        y2 = 100;
      }
    }

    return (
      <motion.line
        x1={`${x1}%`}
        y1={`${y1}%`}
        x2={`${x2}%`}
        y2={`${y2}%`}
        stroke={winner === 'X' ? '#3B82F6' : '#EF4444'}
        strokeWidth="4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
    );
  };

  return (
    <div className="text-slate-700 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Tic-Tac-Toe</h1>

      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-center">Score Board</h2>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-2">
              <PlayerIcon player="X" />
            </div>
            <p className="font-bold text-blue-600">{scores.X}</p>
          </div>
          <div className="text-center mx-4">
            <div className="bg-gray-100 rounded-full p-2 w-12 h-12 flex items-center justify-center">
              <span className="text-2xl">=</span>
            </div>
            <p className="font-bold text-gray-600">{scores.Draw}</p>
          </div>
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-2">
              <PlayerIcon player="O" />
            </div>
            <p className="font-bold text-red-600">{scores.O}</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {board.map((cell, index) => (
            <motion.button
              key={index}
              className="w-20 h-20 bg-white rounded-lg shadow-md flex items-center justify-center text-4xl font-bold"
              onClick={() => handleClick(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ rotateY: cell ? 360 : 0 }}
            >
              {cell && <PlayerIcon player={cell} />}
            </motion.button>
          ))}
        </div>
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <WinningLine />
        </svg>
      </div>

      <div className="mb-4 h-12">
        <AnimatePresence mode="wait">
          {winner ? (
            <motion.div
              key="winner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-2xl font-bold text-center"
            >
              <TypeAnimation
                sequence={[
                  winner === 'Draw' ? "It's a draw!" : `Player ${winner} wins!`,
                  1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={1}
              />
            </motion.div>
          ) : (
            <motion.div
              key="current-player"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex items-center justify-center space-x-2"
            >
              <span className="text-xl">Current player:</span>
              <div
                className={`p-1 rounded-full ${
                  currentPlayer === 'X' ? 'bg-blue-100' : 'bg-red-100'
                }`}
              >
                <PlayerIcon player={currentPlayer} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex space-x-4">
        <Button onClick={resetGame} className="flex items-center">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset Game
        </Button>
        <Button
          onClick={resetScores}
          variant="outline"
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Reset Scores
        </Button>
      </div>
    </div>
  );
}
