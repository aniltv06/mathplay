/**
 * Worksheet Types and Interfaces
 * Shared types for the enhanced worksheet generator
 */

import type { Operation } from '../../types';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'custom';
export type ThemeType = 'standard' | 'space' | 'ocean' | 'holiday' | 'animal' | 'sports';
export type LayoutType = 'horizontal' | 'vertical' | '3-column' | 'flash-cards' | 'large-print';
export type SpacingType = 'compact' | 'normal' | 'large' | 'extra-large';
export type AnswerKeyPosition = 'separate' | 'side-by-side' | 'upside-down' | 'none';

export interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  type: 'standard' | 'fill-blank' | 'compare' | 'missing-op';
  blankPosition?: 'num1' | 'num2' | 'answer';
}

export interface WorksheetSettings {
  numProblems: number;
  minNumber: number;
  maxNumber: number;
  includeAddition: boolean;
  includeSubtraction: boolean;
  includeMultiplication: boolean;
  includeDivision: boolean;
  difficulty: DifficultyLevel;
  theme: ThemeType;
  layout: LayoutType;
  spacing: SpacingType;
  worksheetTitle: string;
  showAnswers: boolean;
  includeWorkspace: boolean;
  answerKeyPosition: AnswerKeyPosition;
  // Advanced features
  requireCarrying: boolean;
  requireBorrowing: boolean;
  multiDigit: boolean;
  multiplicationTables: number[];
  problemTypes: {
    standard: boolean;
    fillBlank: boolean;
    compare: boolean;
    missingOperator: boolean;
  };
  timedPractice: boolean;
  timeLimit: number;
  progressiveDifficulty: boolean;
  skillFocus: {
    numberBonds: boolean;
    doubles: boolean;
    friendlyNumbers: boolean;
  };
  numWorksheets: number;
  addDecorations: boolean;
  includeStickers: boolean;
  includeCertificate: boolean;
  accessibilityMode: boolean;
  highContrast: boolean;
  extraLargeFont: boolean;
}

export interface ThemeStyles {
  headerBg: string;
  decoration: string;
  border: string;
}

export interface SavedTemplate {
  name: string;
  settings: WorksheetSettings;
}

export interface ValidationError {
  field: string;
  message: string;
}
