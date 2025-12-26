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
 * Difficulty levels
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'custom';

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
  difficulty?: DifficultyLevel;
  timedMode?: boolean;
  timeLimit?: number; // in seconds
}

/**
 * Difficulty preset configuration
 */
export interface DifficultyPreset {
  level: DifficultyLevel;
  name: string;
  description: string;
  icon: string;
  settings: {
    numProblems: number;
    maxNum: number;
    minNum: number;
    includeAddition: boolean;
    includeSubtraction: boolean;
    includeMultiplication: boolean;
    includeDivision: boolean;
  };
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
  currentStreak?: number; // Track streak during session
}

/**
 * Statistics for a user profile
 */
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

/**
 * Hangman game session
 */
export interface HangmanSession {
  date: string;
  difficulty: DifficultyLevel;
  settings: HangmanSettings;
  problems: Problem[];
  answers: (number | null)[];
  score: number;
  livesUsed: number;
  totalLives: number;
  maxStreak: number;
  timeSpent: number;
  completed: boolean;
}

/**
 * Hangman game settings
 */
export interface HangmanSettings {
  problemTypes: ('addition' | 'subtraction' | 'multiplication' | 'division')[];
  livesCount: number;
  timeBonus: boolean;
  streakBonus: boolean;
}

/**
 * User profile with progress tracking
 */
export interface UserProfile {
  name: string;
  avatar: string; // Character emoji for the profile
  createdAt: string;
  lastActive: string;
  stats: ProfileStats;
  history: Session[];
  hangmanHistory: HangmanSession[];
  currentSession: Session | null;
  currentHangmanSession: HangmanSession | null;
  badges: Badge[];
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

/**
 * Badge types for achievements
 */
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

/**
 * Achievement badge
 */
export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

/**
 * Badge criteria checker function
 */
export type BadgeCriteria = (profile: UserProfile, session?: Session) => boolean;

/**
 * Supported languages for i18n
 */
export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'kn' | 'te';

/**
 * Translation keys for all UI text
 */
export interface Translations {
  // Header
  appTitle: string;
  greeting: string;

  // Profile Management
  selectProfile: string;
  createNewProfile: string;
  createButton: string;
  noProfiles: string;
  parentDashboard: string;

  // Settings
  settings: string;
  customizeTitle: string;
  chooseDifficulty: string;
  easy: string;
  medium: string;
  hard: string;
  easyDesc: string;
  mediumDesc: string;
  hardDesc: string;
  customizeBelow: string;
  numProblems: string;
  maxNumber: string;
  minNumber: string;
  includeAddition: string;
  includeSubtraction: string;
  includeMultiplication: string;
  includeDivision: string;
  timedChallenge: string;
  timeLimit: string;
  voiceFeedback: string;
  voiceFeedbackDesc: string;
  language: string;
  generateNew: string;
  changeName: string;

  // Instructions
  instructionsText: string;

  // Buttons
  clearAll: string;
  printWorksheet: string;
  showAnswerKey: string;
  hideAnswerKey: string;
  checkAnswers: string;
  select: string;
  stats: string;
  delete: string;

  // Stats
  resultsTitle: string;
  correct: string;
  wrong: string;
  score: string;
  totalSessions: string;
  totalProblems: string;
  accuracy: string;
  bestStreak: string;
  timeSpent: string;

  // Messages
  greatJob: string;
  tryAgain: string;
  fillRemaining: string;
  timeUp: string;
  badgeEarned: string;
  congratulations: string;
  streakBonus: string;

  // Dashboard
  allProfiles: string;
  profileComparison: string;
  recentActivity: string;
  badgeLeaderboard: string;
  sessions: string;
  problems: string;
  badges: string;

  // Sections
  additionProblems: string;
  subtractionProblems: string;
  multiplicationProblems: string;
  divisionProblems: string;

  // Number pad
  question: string;
  of: string;
  skip: string;
  next: string;
  back: string;

  // Operations (spoken)
  plus: string;
  minus: string;
  times: string;
  dividedBy: string;
}
