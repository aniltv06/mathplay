/**
 * Problem Type Variants and Advanced Generators
 * Story problems, missing number problems, and more
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import type { Problem } from '../types';

export type ProblemVariant = 'standard' | 'story' | 'missing-number' | 'true-false' | 'word';

export interface ExtendedProblem extends Problem {
  variant?: ProblemVariant;
  storyText?: string;
  missingPosition?: 'num1' | 'num2' | 'answer';
  trueOrFalse?: boolean;
  proposedAnswer?: number;
}

// Story problem templates
const storyTemplates = {
  '+': [
    (n1: number, n2: number) => `You have ${n1} apples. Your friend gives you ${n2} more apples. How many apples do you have now?`,
    (n1: number, n2: number) => `There are ${n1} birds on a tree. ${n2} more birds join them. How many birds are there in total?`,
    (n1: number, n2: number) => `You collect ${n1} coins on Monday and ${n2} coins on Tuesday. How many coins did you collect altogether?`,
    (n1: number, n2: number) => `A baker makes ${n1} cookies in the morning and ${n2} cookies in the afternoon. How many cookies in total?`,
    (n1: number, n2: number) => `You read ${n1} pages today and ${n2} pages yesterday. How many pages total?`
  ],
  '-': [
    (n1: number, n2: number) => `You have ${n1} candies. You give ${n2} candies to your friend. How many candies do you have left?`,
    (n1: number, n2: number) => `There are ${n1} students in class. ${n2} students go home early. How many students remain?`,
    (n1: number, n2: number) => `You have ${n1} dollars. You spend ${n2} dollars on a toy. How much money do you have left?`,
    (n1: number, n2: number) => `A tree has ${n1} leaves. ${n2} leaves fall off. How many leaves are still on the tree?`,
    (n1: number, n2: number) => `There are ${n1} cars in a parking lot. ${n2} cars drive away. How many cars remain?`
  ],
  '×': [
    (n1: number, n2: number) => `There are ${n1} boxes. Each box has ${n2} toys. How many toys are there in total?`,
    (n1: number, n2: number) => `You buy ${n1} packs of stickers. Each pack has ${n2} stickers. How many stickers do you have?`,
    (n1: number, n2: number) => `A garden has ${n1} rows of flowers. Each row has ${n2} flowers. How many flowers in total?`,
    (n1: number, n2: number) => `${n1} friends each have ${n2} pencils. How many pencils do they have altogether?`,
    (n1: number, n2: number) => `You run ${n1} laps. Each lap is ${n2} meters. How many meters did you run in total?`
  ],
  '÷': [
    (n1: number, n2: number) => `You have ${n1} cookies to share equally among ${n2} friends. How many cookies does each friend get?`,
    (n1: number, n2: number) => `A teacher has ${n1} pencils to divide equally into ${n2} groups. How many pencils per group?`,
    (n1: number, n2: number) => `${n1} apples are put into ${n2} baskets equally. How many apples in each basket?`,
    (n1: number, n2: number) => `You have ${n1} stickers to share with ${n2} people. How many stickers does each person get?`,
    (n1: number, n2: number) => `A pizza is cut into ${n1} slices for ${n2} people to share equally. How many slices per person?`
  ]
};

/**
 * Generate a story problem
 */
export function generateStoryProblem(problem: Problem): ExtendedProblem {
  const templates = storyTemplates[problem.operation];
  const template = templates[Math.floor(Math.random() * templates.length)];
  const storyText = template(problem.num1, problem.num2);

  return {
    ...problem,
    variant: 'story',
    storyText
  };
}

/**
 * Generate a missing number problem (find the missing operand)
 */
export function generateMissingNumberProblem(problem: Problem): ExtendedProblem {
  const positions: ('num1' | 'num2' | 'answer')[] = ['num1', 'num2', 'answer'];
  const missingPosition = positions[Math.floor(Math.random() * positions.length)];

  return {
    ...problem,
    variant: 'missing-number',
    missingPosition
  };
}

/**
 * Generate a true/false problem (verify if equation is correct)
 */
export function generateTrueFalseProblem(problem: Problem): ExtendedProblem {
  const isTrue = Math.random() < 0.5;
  let proposedAnswer: number;

  if (isTrue) {
    proposedAnswer = problem.correct;
  } else {
    // Generate a plausible wrong answer
    const offset = Math.floor(Math.random() * 10) + 1;
    const direction = Math.random() < 0.5 ? 1 : -1;
    proposedAnswer = Math.max(0, problem.correct + (offset * direction));

    // Make sure it's actually wrong
    if (proposedAnswer === problem.correct) {
      proposedAnswer = problem.correct + 1;
    }
  }

  return {
    ...problem,
    variant: 'true-false',
    trueOrFalse: isTrue,
    proposedAnswer,
    correct: isTrue ? 1 : 0 // 1 for true, 0 for false
  };
}

/**
 * Generate word number problem (numbers written as words)
 */
export function generateWordProblem(problem: Problem): ExtendedProblem {
  return {
    ...problem,
    variant: 'word'
  };
}

/**
 * Convert number to word (up to 100)
 */
export function numberToWord(num: number): string {
  const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

  if (num < 10) return ones[num];
  if (num >= 10 && num < 20) return teens[num - 10];
  if (num >= 20 && num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return one === 0 ? tens[ten] : `${tens[ten]}-${ones[one]}`;
  }
  if (num === 100) return 'one hundred';

  return num.toString(); // Fallback
}

/**
 * Get operation word
 */
export function getOperationWord(operation: '+' | '-' | '×' | '÷'): string {
  const words = {
    '+': 'plus',
    '-': 'minus',
    '×': 'times',
    '÷': 'divided by'
  };
  return words[operation];
}

/**
 * Generate hint for a problem
 */
export function generateHint(problem: Problem, level: 1 | 2 | 3 = 1): string {
  const { num1, num2, operation, correct } = problem;

  switch (operation) {
    case '+':
      if (level === 1) return `Try adding ${num1} and ${num2} together.`;
      if (level === 2) return `Think: ${num1} + ${num2}. Count up from ${num1}: ${num1 + 1}, ${num1 + 2}...`;
      return `Break it down: ${num1} + ${num2} = ${correct}`;

    case '-':
      if (level === 1) return `Try subtracting ${num2} from ${num1}.`;
      if (level === 2) return `Count down from ${num1}: ${num1 - 1}, ${num1 - 2}, ${num1 - 3}...`;
      return `Think: ${num1} - ${num2} = ${correct}`;

    case '×':
      if (level === 1) return `Try multiplying ${num1} × ${num2}.`;
      if (level === 2) return `Think: ${num1} groups of ${num2}, or add ${num2} to itself ${num1} times.`;
      return `Remember: ${num1} × ${num2} = ${correct}`;

    case '÷':
      if (level === 1) return `Try dividing ${num1} by ${num2}.`;
      if (level === 2) return `Think: ${num2} times what number equals ${num1}?`;
      return `${num1} ÷ ${num2} = ${correct} because ${num2} × ${correct} = ${num1}`;

    default:
      return 'Try your best!';
  }
}

/**
 * Generate step-by-step solution
 */
export function generateStepByStep(problem: Problem): string[] {
  const { num1, num2, operation, correct } = problem;

  switch (operation) {
    case '+':
      if (num2 <= 10) {
        const steps: string[] = [`Start with ${num1}`];
        for (let i = 1; i <= num2; i++) {
          steps.push(`Add ${i}: ${num1} + ${i} = ${num1 + i}`);
        }
        return steps;
      }
      return [
        `Break ${num2} into ${Math.floor(num2 / 10) * 10} and ${num2 % 10}`,
        `${num1} + ${Math.floor(num2 / 10) * 10} = ${num1 + Math.floor(num2 / 10) * 10}`,
        `${num1 + Math.floor(num2 / 10) * 10} + ${num2 % 10} = ${correct}`
      ];

    case '-':
      return [
        `Start with ${num1}`,
        `Count down ${num2} numbers`,
        `${num1} - ${num2} = ${correct}`
      ];

    case '×':
      return [
        `${num1} × ${num2} means "${num1} groups of ${num2}"`,
        `Add ${num2} to itself ${num1} times`,
        `Or use the ${num1} times table: ${num1} × ${num2} = ${correct}`
      ];

    case '÷':
      return [
        `${num1} ÷ ${num2} asks: "How many ${num2}s fit in ${num1}?"`,
        `Think backwards: ${num2} × ? = ${num1}`,
        `Answer: ${num2} × ${correct} = ${num1}`,
        `So ${num1} ÷ ${num2} = ${correct}`
      ];

    default:
      return [`${num1} ${operation} ${num2} = ${correct}`];
  }
}
