/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 *
 * Centralised game-score / streak / feedback state.
 * Replaces the ~40 lines of duplicate useState boilerplate in 7+ learning pages.
 */

import { useState, useCallback } from 'react';

export interface GameStateResult {
  score: number;
  streak: number;
  attempts: number;
  addCorrect: () => void;
  addWrong: () => void;
  reset: () => void;
}

export function useGameState(): GameStateResult {
  const [score, setScore]     = useState(0);
  const [streak, setStreak]   = useState(0);
  const [attempts, setAttempts] = useState(0);

  const addCorrect = useCallback(() => {
    setScore((s) => s + 1);
    setStreak((s) => s + 1);
    setAttempts((a) => a + 1);
  }, []);

  const addWrong = useCallback(() => {
    setStreak(0);
    setAttempts((a) => a + 1);
  }, []);

  const reset = useCallback(() => {
    setScore(0);
    setStreak(0);
    setAttempts(0);
  }, []);

  return { score, streak, attempts, addCorrect, addWrong, reset };
}
