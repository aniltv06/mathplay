/**
 * Multiplication Learning Content - Tricks, Tips, and Lessons
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

export interface MultiplicationLesson {
  table: number;
  title: string;
  description: string;
  tricks: string[];
  examples: string[];
  visualTip: string;
  funFact?: string;
}

export const multiplicationLessons: Record<number, MultiplicationLesson> = {
  1: {
    table: 1,
    title: "The Identity Rule",
    description: "Any number multiplied by 1 stays the same!",
    tricks: [
      "1 is the identity - it doesn't change anything",
      "Think of it as '1 group of' that number"
    ],
    examples: ["1 × 5 = 5", "1 × 100 = 100"],
    visualTip: "Imagine 1 basket with apples - you still have the same number of apples!",
    funFact: "1 is called the 'multiplicative identity'"
  },
  2: {
    table: 2,
    title: "Doubles - Easy as Counting by 2s!",
    description: "Multiplying by 2 is just doubling or adding the number to itself",
    tricks: [
      "Just add the number to itself: 2 × 7 = 7 + 7",
      "Count by 2s: 2, 4, 6, 8, 10, 12...",
      "All answers are even numbers",
      "Double means 'two times'"
    ],
    examples: ["2 × 3 = 3 + 3 = 6", "2 × 8 = 8 + 8 = 16"],
    visualTip: "Think of pairs: 2 shoes, 2 gloves, 2 socks!",
    funFact: "Every number in the 2 times table ends in 0, 2, 4, 6, or 8"
  },
  3: {
    table: 3,
    title: "The Triangle Number",
    description: "Add the number three times or use the digit sum trick",
    tricks: [
      "Add the number three times: 3 × 4 = 4 + 4 + 4",
      "Digital root trick: All multiples of 3 have digits that add up to 3, 6, or 9",
      "Count by 3s: 3, 6, 9, 12, 15, 18...",
      "Think of triangles - they have 3 sides!"
    ],
    examples: [
      "3 × 5 = 5 + 5 + 5 = 15",
      "Check: 1 + 5 = 6 (divisible by 3) ✓"
    ],
    visualTip: "Think of triplets or groups of three!",
    funFact: "3 is the first odd prime number"
  },
  4: {
    table: 4,
    title: "Double the Doubles!",
    description: "Multiply by 4 by doubling twice",
    tricks: [
      "Double it, then double again!",
      "4 × 7: First 7 × 2 = 14, then 14 × 2 = 28",
      "Think of it as 2 × 2 × number",
      "All answers are even",
      "Pattern: 4, 8, 12, 16, 20... (last digits go 4, 8, 2, 6, 0)"
    ],
    examples: ["4 × 6 = (6 × 2) × 2 = 12 × 2 = 24"],
    visualTip: "Think of squares with 4 corners, or cars with 4 wheels!",
    funFact: "4 is the smallest composite number"
  },
  5: {
    table: 5,
    title: "Hand Five Trick",
    description: "The easiest table - always ends in 0 or 5!",
    tricks: [
      "All answers end in either 0 or 5",
      "For even numbers × 5: Half the number, add a 0",
      "Example: 6 × 5 = (6 ÷ 2) with 0 = 30",
      "For odd numbers: Half (round down), add 5",
      "Example: 7 × 5 = 3 with 5 = 35",
      "Count by 5s using your fingers!"
    ],
    examples: ["5 × 8 = 40 (8 ÷ 2 = 4, add 0)", "5 × 9 = 45 (9 ÷ 2 = 4.5 → 45)"],
    visualTip: "Use your fingers - each hand has 5 fingers!",
    funFact: "5 is the only prime number that ends in 5"
  },
  6: {
    table: 6,
    title: "The 6 Times Trick",
    description: "Use your knowledge of 3s and 5s",
    tricks: [
      "6 = 5 + 1: Multiply by 5, then add the number once",
      "Example: 6 × 7 = (5 × 7) + 7 = 35 + 7 = 42",
      "Or double the 3 times table: 6 × 4 = 2 × (3 × 4)",
      "For even numbers: multiply by 3, then double it"
    ],
    examples: ["6 × 8 = (5 × 8) + 8 = 40 + 8 = 48"],
    visualTip: "Think of egg cartons or dice (6 sides)!",
    funFact: "6 is the first perfect number (1 + 2 + 3 = 6)"
  },
  7: {
    table: 7,
    title: "The Tricky Seven",
    description: "Use patterns and relationships with other tables",
    tricks: [
      "7 is 5 + 2: Multiply by 5, then add number × 2",
      "Example: 7 × 6 = (5 × 6) + (2 × 6) = 30 + 12 = 42",
      "Rhyme trick: '5, 6, 7, 8, 56 = 7 × 8'",
      "Double and add pattern for 7 × odd numbers",
      "Pattern: 7, 14, 21, 28, 35, 42, 49..."
    ],
    examples: ["7 × 8 = 56 (remember the rhyme!)", "7 × 9 = (7 × 10) - 7 = 70 - 7 = 63"],
    visualTip: "Think of weeks - 7 days in a week!",
    funFact: "7 is considered lucky in many cultures"
  },
  8: {
    table: 8,
    title: "Triple Doubling!",
    description: "Double three times to multiply by 8",
    tricks: [
      "Double, double, double! (2 × 2 × 2 = 8)",
      "8 × 7: Start with 7 → 14 → 28 → 56",
      "All even numbers",
      "Pattern in last digits: 8, 6, 4, 2, 0",
      "Half of 16: First multiply by 16, then divide by 2"
    ],
    examples: ["8 × 5 = 5 → 10 → 20 → 40"],
    visualTip: "Think of octopus legs (8 legs) or spiders (8 legs)!",
    funFact: "8 is a cube number (2 × 2 × 2 = 8)"
  },
  9: {
    table: 9,
    title: "The Finger Magic & Digit Sum",
    description: "Amazing tricks for the 9 times table!",
    tricks: [
      "Finger trick: Hold up 10 fingers. For 9 × n, put down finger n",
      "Fingers left of it = tens, fingers right = ones",
      "Digit sum always equals 9: 9 × 7 = 63 → 6 + 3 = 9",
      "Pattern trick: First digit goes up (0,1,2,3...), second goes down (9,8,7,6...)",
      "9 × n = (10 × n) - n: Example: 9 × 6 = 60 - 6 = 54",
      "The digits always add to 9!"
    ],
    examples: [
      "9 × 4: Put down 4th finger → 3 fingers | 6 fingers = 36",
      "9 × 8 = 72 (7 + 2 = 9) ✓"
    ],
    visualTip: "Use the finger trick - it works every time!",
    funFact: "9 is the highest single-digit number"
  },
  10: {
    table: 10,
    title: "The Easiest - Just Add Zero!",
    description: "Simply add a zero to the number",
    tricks: [
      "Just add 0 to the end of the number!",
      "10 × 7 = 70 (add zero to 7)",
      "10 moves numbers one place left in place value",
      "Count by 10s: 10, 20, 30, 40, 50..."
    ],
    examples: ["10 × 3 = 30", "10 × 12 = 120"],
    visualTip: "Think of our 10 fingers or 10 toes!",
    funFact: "We use base-10 because we have 10 fingers"
  },
  11: {
    table: 11,
    title: "The Mirror Number Trick",
    description: "For numbers 1-9, just repeat the digit!",
    tricks: [
      "For 1-9: Just repeat the digit twice!",
      "11 × 3 = 33, 11 × 7 = 77, 11 × 9 = 99",
      "For 10+: Add the digits and put the sum in the middle",
      "11 × 12: 1_2 → 1 + 2 = 3 → 132",
      "For two-digit: ab × 11 = a(a+b)b",
      "Quick mental math: 11 × 25 = 2(2+5)5 = 275"
    ],
    examples: [
      "11 × 4 = 44 (repeat 4)",
      "11 × 15 = 165 (1+5=6, put in middle)"
    ],
    visualTip: "11 looks like two ones standing together!",
    funFact: "11 is the smallest two-digit prime number"
  },
  12: {
    table: 12,
    title: "The Dozen Dozen",
    description: "Use 10 + 2 to make it easier",
    tricks: [
      "12 = 10 + 2: Multiply by 10, then add number × 2",
      "Example: 12 × 7 = (10 × 7) + (2 × 7) = 70 + 14 = 84",
      "Think of it as a dozen (12 eggs in a carton)",
      "12 × even numbers: Easy because 12 = 6 × 2",
      "Clock trick: 12 hours on a clock"
    ],
    examples: ["12 × 5 = 50 + 10 = 60", "12 × 8 = 80 + 16 = 96"],
    visualTip: "Think of a dozen eggs, months in a year, or clock hours!",
    funFact: "12 has the most divisors of any number under 20"
  }
};

export interface GeneralTip {
  title: string;
  description: string;
  icon: string;
}

export const generalMultiplicationTips: GeneralTip[] = [
  {
    title: "Commutative Property",
    description: "3 × 4 is the same as 4 × 3! The order doesn't matter. If you know one, you know both!",
    icon: "🔄"
  },
  {
    title: "Zero Rule",
    description: "Any number multiplied by 0 equals 0. Zero groups of anything is nothing!",
    icon: "⭕"
  },
  {
    title: "Skip Counting",
    description: "Count by the number you're multiplying: For 4 × 5, count: 5, 10, 15, 20!",
    icon: "🦘"
  },
  {
    title: "Use What You Know",
    description: "If you know 7 × 8 = 56, then 7 × 9 = 56 + 7 = 63. Build on facts you already know!",
    icon: "🧱"
  },
  {
    title: "Break It Down",
    description: "Break hard problems into easier ones: 7 × 8 = (7 × 5) + (7 × 3) = 35 + 21 = 56",
    icon: "✂️"
  },
  {
    title: "Arrays Help Visualize",
    description: "Draw dots in rows and columns. 3 × 4 looks like 3 rows of 4 dots = 12 total dots",
    icon: "⬛"
  },
  {
    title: "Practice Daily",
    description: "Just 5 minutes a day makes you a multiplication master! Consistency is key.",
    icon: "📅"
  },
  {
    title: "Times Table Songs",
    description: "Make up silly songs or rhymes to remember tricky facts. Music helps memory!",
    icon: "🎵"
  }
];

export const multiplicationStrategies = [
  {
    name: "Repeated Addition",
    description: "3 × 4 means 'add 3, four times': 3 + 3 + 3 + 3 = 12",
    difficulty: "beginner",
    icon: "➕"
  },
  {
    name: "Skip Counting",
    description: "Count forward by the multiplier: 5, 10, 15, 20... (for 5s)",
    difficulty: "beginner",
    icon: "🔢"
  },
  {
    name: "Arrays & Groups",
    description: "Visualize rows and columns: 4 × 3 is 4 rows of 3 objects",
    difficulty: "beginner",
    icon: "📊"
  },
  {
    name: "Doubling Strategy",
    description: "For 4×: double once (×2), then double again",
    difficulty: "intermediate",
    icon: "✖️"
  },
  {
    name: "Break Apart (Distributive)",
    description: "7 × 8 = (7 × 5) + (7 × 3) = 35 + 21 = 56",
    difficulty: "intermediate",
    icon: "🧩"
  },
  {
    name: "Use Nearby Facts",
    description: "For 7 × 9, think: (7 × 10) - 7 = 70 - 7 = 63",
    difficulty: "intermediate",
    icon: "🎯"
  },
  {
    name: "Factor Pairs",
    description: "12 × 5 = (6 × 2) × 5 = 6 × (2 × 5) = 6 × 10 = 60",
    difficulty: "advanced",
    icon: "🔗"
  }
];
