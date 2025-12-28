/**
 * Math Tips, Tricks, and Mental Math Strategies
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

export interface MathTip {
  operation: '+' | '-' | '×' | '÷';
  title: string;
  description: string;
  example: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const mathTips: MathTip[] = [
  // Addition Tips
  {
    operation: '+',
    title: 'Make 10 First',
    description: 'When adding, look for numbers that make 10. This makes mental math easier!',
    example: '8 + 7 = 8 + 2 + 5 = 10 + 5 = 15',
    icon: '🔟',
    difficulty: 'beginner'
  },
  {
    operation: '+',
    title: 'Add in Chunks',
    description: 'Break larger numbers into tens and ones, add separately.',
    example: '25 + 17 = (20 + 10) + (5 + 7) = 30 + 12 = 42',
    icon: '🧱',
    difficulty: 'intermediate'
  },
  {
    operation: '+',
    title: 'Round and Adjust',
    description: 'Round one number to make it easy, then adjust the answer.',
    example: '38 + 26 = 40 + 26 - 2 = 66 - 2 = 64',
    icon: '🎯',
    difficulty: 'intermediate'
  },
  {
    operation: '+',
    title: 'Compensation Method',
    description: 'Give and take from numbers to create easier calculations.',
    example: '49 + 35 = 50 + 34 = 84',
    icon: '⚖️',
    difficulty: 'advanced'
  },

  // Subtraction Tips
  {
    operation: '-',
    title: 'Count Up Method',
    description: 'Instead of subtracting, count up from the smaller number.',
    example: '15 - 8: Count up from 8... 9, 10, 11, 12, 13, 14, 15 = 7 steps',
    icon: '⬆️',
    difficulty: 'beginner'
  },
  {
    operation: '-',
    title: 'Add the Same Amount',
    description: 'Add the same number to both to make subtraction easier.',
    example: '52 - 28 = 54 - 30 = 24',
    icon: '➕',
    difficulty: 'intermediate'
  },
  {
    operation: '-',
    title: 'Break Into Parts',
    description: 'Subtract in easier chunks: tens first, then ones.',
    example: '63 - 27 = 63 - 20 - 7 = 43 - 7 = 36',
    icon: '✂️',
    difficulty: 'intermediate'
  },
  {
    operation: '-',
    title: 'Think of Distance',
    description: 'Think of subtraction as the distance between numbers on a number line.',
    example: '100 - 73: How far from 73 to 100? 27 steps',
    icon: '📏',
    difficulty: 'beginner'
  },

  // Multiplication Tips
  {
    operation: '×',
    title: 'Doubles Are Easy',
    description: 'Multiplying by 2 is just doubling. Add the number to itself!',
    example: '14 × 2 = 14 + 14 = 28',
    icon: '✖️',
    difficulty: 'beginner'
  },
  {
    operation: '×',
    title: 'Multiply by 5 Trick',
    description: 'Multiply by 10 and divide by 2, or use the hand trick!',
    example: '16 × 5 = (16 × 10) ÷ 2 = 160 ÷ 2 = 80',
    icon: '✋',
    difficulty: 'intermediate'
  },
  {
    operation: '×',
    title: 'Multiply by 9 Finger Trick',
    description: 'Hold up 10 fingers, put down the finger for the number. Left = tens, right = ones!',
    example: '9 × 7: Put down 7th finger → 6 fingers left, 3 right = 63',
    icon: '🖐️',
    difficulty: 'beginner'
  },
  {
    operation: '×',
    title: 'Break Apart Strategy',
    description: 'Break one number into easier parts, multiply separately, then add.',
    example: '7 × 8 = (7 × 5) + (7 × 3) = 35 + 21 = 56',
    icon: '🧩',
    difficulty: 'intermediate'
  },
  {
    operation: '×',
    title: 'Double and Halve',
    description: 'Double one number and halve the other for easier calculation.',
    example: '16 × 5 = 8 × 10 = 80',
    icon: '🔄',
    difficulty: 'advanced'
  },

  // Division Tips
  {
    operation: '÷',
    title: 'Think Multiplication',
    description: 'Division is the opposite of multiplication. Ask: what times this equals that?',
    example: '42 ÷ 6 = ? Think: 6 × ? = 42... Answer: 7',
    icon: '🔃',
    difficulty: 'beginner'
  },
  {
    operation: '÷',
    title: 'Divide by 2 (Halving)',
    description: 'Dividing by 2 is just finding half!',
    example: '48 ÷ 2 = half of 48 = 24',
    icon: '½',
    difficulty: 'beginner'
  },
  {
    operation: '÷',
    title: 'Divide by 5 Trick',
    description: 'Divide by 10 and multiply by 2.',
    example: '85 ÷ 5 = (85 ÷ 10) × 2 = 8.5 × 2 = 17',
    icon: '🎯',
    difficulty: 'intermediate'
  },
  {
    operation: '÷',
    title: 'Break Into Smaller Parts',
    description: 'Break the dividend into parts that divide evenly.',
    example: '96 ÷ 8 = (80 ÷ 8) + (16 ÷ 8) = 10 + 2 = 12',
    icon: '✂️',
    difficulty: 'advanced'
  }
];

// Get tips for specific operation
export function getTipsForOperation(operation: '+' | '-' | '×' | '÷'): MathTip[] {
  return mathTips.filter(tip => tip.operation === operation);
}

// Get tips by difficulty
export function getTipsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): MathTip[] {
  return mathTips.filter(tip => tip.difficulty === difficulty);
}

// Get random tip for operation
export function getRandomTip(operation?: '+' | '-' | '×' | '÷'): MathTip {
  const filtered = operation ? getTipsForOperation(operation) : mathTips;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// Quick reference tips
export const quickTips = {
  addition: [
    'Look for numbers that make 10',
    'Add the bigger number first',
    'Round one number, then adjust',
    'Break into tens and ones'
  ],
  subtraction: [
    'Count up from the smaller number',
    'Add the same to both numbers',
    'Think of the distance between numbers',
    'Subtract in chunks: tens, then ones'
  ],
  multiplication: [
    'Use the times tables you know',
    'Break into easier parts',
    'Remember: order doesn\'t matter (3×4 = 4×3)',
    'Multiply by 10 first, then adjust'
  ],
  division: [
    'Think: what times this equals that?',
    'Dividing by 2 is halving',
    'Use multiplication facts backward',
    'Look for patterns in the times table'
  ]
};
