/**
 * Worksheet Utilities
 * Problem generation, validation, and helper functions
 */

import type { Operation } from '../../types';
import { Problem, WorksheetSettings, ValidationError } from './types';

/**
 * Validate worksheet settings
 */
export function validateSettings(settings: WorksheetSettings): ValidationError[] {
  const errors: ValidationError[] = [];

  if (settings.minNumber < 0) {
    errors.push({ field: 'minNumber', message: 'Minimum must be 0 or greater' });
  }

  if (settings.maxNumber > 999) {
    errors.push({ field: 'maxNumber', message: 'Maximum must be 999 or less' });
  }

  if (settings.minNumber >= settings.maxNumber) {
    errors.push({ field: 'minNumber', message: 'Minimum must be less than maximum' });
  }

  if (settings.numProblems < 1 || settings.numProblems > 100) {
    errors.push({ field: 'numProblems', message: 'Number of problems must be between 1 and 100' });
  }

  const hasOperations = settings.includeAddition || settings.includeSubtraction ||
                       settings.includeMultiplication || settings.includeDivision;
  if (!hasOperations) {
    errors.push({ field: 'operations', message: 'At least one operation must be selected' });
  }

  const hasProblemTypes = Object.values(settings.problemTypes).some(v => v);
  if (!hasProblemTypes) {
    errors.push({ field: 'problemTypes', message: 'At least one problem type must be selected' });
  }

  return errors;
}

/**
 * Check if addition requires carrying
 */
function hasCarrying(num1: number, num2: number): boolean {
  const str1 = num1.toString();
  const str2 = num2.toString();
  let carry = 0;

  for (let i = 0; i < Math.max(str1.length, str2.length); i++) {
    const digit1 = parseInt(str1[str1.length - 1 - i] || '0');
    const digit2 = parseInt(str2[str2.length - 1 - i] || '0');
    if (digit1 + digit2 + carry >= 10) return true;
    carry = digit1 + digit2 + carry >= 10 ? 1 : 0;
  }
  return false;
}

/**
 * Check if subtraction requires borrowing
 */
function hasBorrowing(num1: number, num2: number): boolean {
  const str1 = num1.toString();
  const str2 = num2.toString();

  for (let i = 0; i < str1.length; i++) {
    const digit1 = parseInt(str1[str1.length - 1 - i]);
    const digit2 = parseInt(str2[str2.length - 1 - i] || '0');
    if (digit1 < digit2) return true;
  }
  return false;
}

/**
 * Generate number bonds problem
 */
function generateNumberBondProblem(): Problem {
  const target = 10;
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = target - num1;
  return {
    num1,
    num2,
    operation: '+',
    answer: target,
    type: 'standard',
  };
}

/**
 * Generate doubles problem
 */
function generateDoublesProblem(): Problem {
  const num = Math.floor(Math.random() * 10) + 1;
  return {
    num1: num,
    num2: num,
    operation: '+',
    answer: num * 2,
    type: 'standard',
  };
}

/**
 * Generate friendly numbers problem
 */
function generateFriendlyNumbersProblem(operation: Operation): Problem {
  const friendlyNumbers = [10, 20, 25, 50, 100];
  const base = friendlyNumbers[Math.floor(Math.random() * friendlyNumbers.length)];
  const offset = Math.floor(Math.random() * 10) + 1;

  if (operation === '+') {
    return {
      num1: base,
      num2: offset,
      operation: '+',
      answer: base + offset,
      type: 'standard',
    };
  }

  return {
    num1: base + offset,
    num2: offset,
    operation: '-',
    answer: base,
    type: 'standard',
  };
}

/**
 * Generate a single problem based on settings
 */
export function generateSingleProblem(
  operations: Operation[],
  settings: WorksheetSettings
): Problem {
  const operation = operations[Math.floor(Math.random() * operations.length)];

  // Select problem type
  const enabledTypes = Object.entries(settings.problemTypes)
    .filter(([_, enabled]) => enabled)
    .map(([type]) => type);
  const selectedType = enabledTypes[Math.floor(Math.random() * enabledTypes.length)];

  // Map settings keys to Problem type values
  const typeMap: Record<string, 'standard' | 'fill-blank' | 'compare' | 'missing-op'> = {
    'standard': 'standard',
    'fillBlank': 'fill-blank',
    'compare': 'compare',
    'missingOperator': 'missing-op'
  };
  const problemType = typeMap[selectedType] || 'standard';

  let num1: number, num2: number, answer: number;

  // Apply skill focus if enabled
  if (settings.skillFocus.numberBonds && operation === '+') {
    return generateNumberBondProblem();
  }
  if (settings.skillFocus.doubles && operation === '+') {
    return generateDoublesProblem();
  }
  if (settings.skillFocus.friendlyNumbers) {
    return generateFriendlyNumbersProblem(operation);
  }

  // Multiplication tables mode
  if (operation === '×' && settings.multiplicationTables.length > 0) {
    const table = settings.multiplicationTables[Math.floor(Math.random() * settings.multiplicationTables.length)];
    num1 = table;
    num2 = Math.floor(Math.random() * 12) + 1;
    answer = num1 * num2;
  } else {
    // Standard random generation
    const min = settings.minNumber;
    const max = settings.maxNumber;

    num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    num2 = Math.floor(Math.random() * (max - min + 1)) + min;

    switch (operation) {
      case '+':
        answer = num1 + num2;
        // Check carrying requirement
        if (settings.requireCarrying && !hasCarrying(num1, num2)) {
          return generateSingleProblem(operations, settings); // Retry
        }
        break;
      case '-':
        if (num1 < num2) [num1, num2] = [num2, num1];
        answer = num1 - num2;
        // Check borrowing requirement
        if (settings.requireBorrowing && !hasBorrowing(num1, num2)) {
          return generateSingleProblem(operations, settings); // Retry
        }
        break;
      case '×':
        answer = num1 * num2;
        break;
      case '÷':
        const divisor = num2 === 0 ? 1 : num2;
        const quotient = num1;
        num1 = quotient * divisor;
        num2 = divisor;
        answer = quotient;
        break;
      default:
        answer = 0;
    }
  }

  // Create problem based on type
  const problem: Problem = {
    num1,
    num2,
    operation,
    answer,
    type: problemType,
  };

  if (problemType === 'fill-blank') {
    const positions = ['num1', 'num2', 'answer'] as const;
    problem.blankPosition = positions[Math.floor(Math.random() * positions.length)];
  }

  return problem;
}

/**
 * Apply progressive difficulty sorting
 */
function applyProgressiveDifficulty(problems: Problem[]): Problem[] {
  return problems.sort((a, b) => {
    const diffA = Math.abs(a.answer);
    const diffB = Math.abs(b.answer);
    return diffA - diffB;
  });
}

/**
 * Generate a worksheet of problems
 */
export function generateWorksheetProblems(
  operations: Operation[],
  count: number,
  settings: WorksheetSettings
): Problem[] {
  const newProblems: Problem[] = [];
  const usedProblems = new Set<string>();
  let attempts = 0;
  const maxAttempts = count * 50;

  while (newProblems.length < count && attempts < maxAttempts) {
    attempts++;

    const problem = generateSingleProblem(operations, settings);
    const problemKey = `${problem.num1}|${problem.operation}|${problem.num2}|${problem.type}`;

    if (!usedProblems.has(problemKey)) {
      usedProblems.add(problemKey);
      newProblems.push(problem);
    }
  }

  // Apply progressive difficulty if enabled
  if (settings.progressiveDifficulty) {
    return applyProgressiveDifficulty(newProblems);
  }

  return newProblems;
}

/**
 * Generate multiple worksheets
 */
export function generateAllWorksheetProblems(
  settings: WorksheetSettings
): Problem[] {
  const operations: Operation[] = [];
  if (settings.includeAddition) operations.push('+');
  if (settings.includeSubtraction) operations.push('-');
  if (settings.includeMultiplication) operations.push('×');
  if (settings.includeDivision) operations.push('÷');

  if (operations.length === 0) {
    throw new Error('Please select at least one operation type');
  }

  const allProblems: Problem[] = [];
  const problemsPerWorksheet = settings.numProblems;

  for (let w = 0; w < settings.numWorksheets; w++) {
    const worksheetProblems = generateWorksheetProblems(operations, problemsPerWorksheet, settings);
    allProblems.push(...worksheetProblems);
  }

  return allProblems;
}

/**
 * Get theme styles
 */
export function getThemeStyles(theme: string) {
  switch (theme) {
    case 'space':
      return {
        headerBg: 'bg-gradient-to-r from-indigo-600 to-purple-600',
        decoration: '🚀 ⭐ 🌙 🛸',
        border: 'border-purple-400',
      };
    case 'ocean':
      return {
        headerBg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        decoration: '🌊 🐠 🐚 🦈',
        border: 'border-cyan-400',
      };
    case 'holiday':
      return {
        headerBg: 'bg-gradient-to-r from-red-500 to-green-500',
        decoration: '🎄 ⛄ 🎁 ❄️',
        border: 'border-red-400',
      };
    case 'animal':
      return {
        headerBg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        decoration: '🦁 🐯 🐘 🦒',
        border: 'border-orange-400',
      };
    case 'sports':
      return {
        headerBg: 'bg-gradient-to-r from-green-500 to-blue-500',
        decoration: '⚽ 🏀 ⚾ 🏈',
        border: 'border-green-400',
      };
    default:
      return {
        headerBg: 'bg-gradient-to-r from-gray-700 to-gray-800',
        decoration: '',
        border: 'border-gray-800',
      };
  }
}

/**
 * Get layout columns class
 */
export function getLayoutColumns(layout: string): string {
  switch (layout) {
    case 'horizontal': return 'grid-cols-2';
    case 'vertical': return 'grid-cols-4';
    case '3-column': return 'grid-cols-3';
    case 'flash-cards': return 'grid-cols-2';
    case 'large-print': return 'grid-cols-1';
    default: return 'grid-cols-2';
  }
}

/**
 * Get grid template columns CSS value
 */
export function getGridColumns(layout: string): string {
  switch (layout) {
    case 'horizontal': return 'repeat(2, 1fr)';
    case 'vertical': return 'repeat(4, 1fr)';
    case '3-column': return 'repeat(3, 1fr)';
    case 'flash-cards': return 'repeat(2, 1fr)';
    case 'large-print': return 'repeat(1, 1fr)';
    default: return 'repeat(2, 1fr)';
  }
}

/**
 * Get the correct answer display for a problem based on its type
 */
export function getAnswerForProblem(problem: Problem): string {
  switch (problem.type) {
    case 'compare': {
      // For compare problems, answer is the comparison operator
      const value1 = problem.num1;
      const value2 = problem.num2;
      return value1 > value2 ? '>' : value1 < value2 ? '<' : '=';
    }
    case 'missing-op': {
      // For missing operator problems, answer is the operation
      return problem.operation;
    }
    case 'fill-blank': {
      // For fill-blank problems, show which value was blank
      if (problem.blankPosition === 'num1') return String(problem.num1);
      if (problem.blankPosition === 'num2') return String(problem.num2);
      return String(problem.answer);
    }
    case 'standard':
    default: {
      // For standard problems, show the numeric answer
      return String(problem.answer);
    }
  }
}

/**
 * Get the problem text for answer key display
 */
export function getProblemTextForAnswerKey(problem: Problem): string {
  switch (problem.type) {
    case 'compare':
      return `${problem.num1} ___ ${problem.num2}`;
    case 'missing-op':
      return `${problem.num1} ___ ${problem.num2} = ${problem.answer}`;
    case 'fill-blank': {
      const blank = '___';
      const num1Str = problem.blankPosition === 'num1' ? blank : problem.num1;
      const num2Str = problem.blankPosition === 'num2' ? blank : problem.num2;
      const answerStr = problem.blankPosition === 'answer' ? blank : problem.answer;
      return `${num1Str} ${problem.operation} ${num2Str} = ${answerStr}`;
    }
    case 'standard':
    default:
      return `${problem.num1} ${problem.operation} ${problem.num2}`;
  }
}
