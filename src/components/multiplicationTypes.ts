/**
 * Shared types for Multiplication feature components
 *
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

export type MainMode = 'menu' | 'lessons' | 'grid' | 'practice' | 'dashboard';
export type LearningMode = 'select' | 'learn' | 'visualize' | 'practice' | 'quiz' | 'timed' | 'mixed' | 'review';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface QuestionResult {
  question: string;
  userAnswer: number;
  correctAnswer: number;
  correct: boolean;
  timeSpent: number;
  table: number;
  multiplier: number;
}

export interface TableProgress {
  practiced: number;
  mastered: boolean;
  lastScore: number;
  bestTime: number;
  correctAnswers: number;
  totalAttempts: number;
}

export interface MultiplicationProgress {
  [table: number]: TableProgress;
}
