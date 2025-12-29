/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

export type Difficulty = 'easy' | 'medium' | 'hard' | 'custom';
export type ProblemType = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';
export type Operation = '+' | '-' | '×' | '÷';

export interface GameSettings {
  problemTypes: ProblemType[];
  livesCount: number;
  timeBonus: boolean;
  streakBonus: boolean;
}

export interface GameStats {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  streak: number;
  maxStreak: number;
}

// Worksheet-specific types
export interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  correct: number;
  wordProblem?: string; // Pre-generated word problem text for consistency
}

export interface ProblemSettings {
  numProblems: number;
  maxNum: number;
  minNum: number;
  includeAddition: boolean;
  includeSubtraction: boolean;
  includeMultiplication: boolean;
  includeDivision: boolean;
  difficulty?: Difficulty;
  timedMode?: boolean;
  timeLimit?: number; // in seconds
  displayAsWordProblems?: boolean; // Display problems as word stories
}

export interface WorksheetSession {
  date: string;
  settings: ProblemSettings;
  problems: Problem[];
  answers: (number | null)[];
  timeSpent: number;
  completed: boolean;
  correctCount: number;
  wrongCount: number;
  percentage: number;
  currentStreak?: number;
}

export interface HangmanSession {
  date: string;
  difficulty: Difficulty;
  settings: GameSettings;
  problems: Problem[];
  answers: (number | null)[];
  score: number;
  livesUsed: number;
  totalLives: number;
  maxStreak: number;
  timeSpent: number;
  completed: boolean;
}

// Badge types
export type BadgeId =
  | 'first-steps'
  | 'perfect-score'
  | 'speed-demon'
  | 'marathon'
  | 'streak-master'
  | 'division-expert'
  | 'math-wizard'
  | 'persistent'
  | 'time-master'
  | 'accuracy-master'
  | 'hangman-survivor'
  | 'hangman-perfect'
  | 'hangman-speedster'
  | 'hangman-champion';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

// Enhanced Profile Stats
export interface ProfileStats {
  // Worksheet stats
  totalSessions: number;
  totalProblems: number;
  totalCorrect: number;
  totalWrong: number;
  bestStreak: number;
  averagePercentage: number;
  timeSpent: number;

  // Hangman stats
  hangmanSessions: number;
  hangmanProblems: number;
  hangmanCorrect: number;
  hangmanWrong: number;
  hangmanBestStreak: number;
  hangmanHighScore: number;
  hangmanTimeSpent: number;
}
