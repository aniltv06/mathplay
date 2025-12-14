/**
 * Type definitions for Math Fun Worksheet
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Mathematical operation types
 */
export type Operation = '+' | '-' | '×' | '÷';

/**
 * Represents a single math problem
 */
export interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  correct: number;
}

/**
 * Settings for problem generation
 */
export interface ProblemSettings {
  numProblems: number;
  maxNum: number;
  minNum: number;
  includeAddition: boolean;
  includeSubtraction: boolean;
  includeMultiplication: boolean;
  includeDivision: boolean;
}

/**
 * Represents a single practice session
 */
export interface Session {
  date: string;
  settings: ProblemSettings;
  problems: Problem[];
  answers: (number | null)[];
  timeSpent: number;
  completed: boolean;
  correctCount: number;
  wrongCount: number;
  percentage: number;
}

/**
 * Statistics for a user profile
 */
export interface ProfileStats {
  totalSessions: number;
  totalProblems: number;
  totalCorrect: number;
  totalWrong: number;
  bestStreak: number;
  averagePercentage: number;
  timeSpent: number;
}

/**
 * User profile with progress tracking
 */
export interface UserProfile {
  name: string;
  createdAt: string;
  lastActive: string;
  stats: ProfileStats;
  history: Session[];
  currentSession: Session | null;
}

/**
 * Collection of all user profiles
 */
export interface ProfilesData {
  profiles: Record<string, UserProfile>;
  lastActiveProfile: string | null;
}

/**
 * Sound effect types
 */
export type SoundType = 'correct' | 'wrong';

/**
 * Answer validation result
 */
export type ValidationResult = boolean | null;
