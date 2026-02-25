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
  workedExample: {
    problem: string;
    steps: string[];
    answer: string;
  };
  commonMistakes: string[];
  realWorldExample: string;
}

export const multiplicationLessons: Record<number, MultiplicationLesson> = {
  1: {
    table: 1,
    title: "The Identity Rule",
    description: "Any number multiplied by 1 stays the same! This is called the Identity Property.",
    tricks: [
      "1 is the identity — it never changes the value",
      "Think of it as '1 group of that number': 1 × 7 means just 1 group of 7",
      "You already know every × 1 fact — the answer is always the other number!"
    ],
    examples: ["1 × 5 = 5", "1 × 100 = 100", "1 × 37 = 37"],
    visualTip: "Imagine 1 basket with 8 apples. You still have 8 apples — 1 basket of 8 is still 8!",
    funFact: "1 is called the 'multiplicative identity' because multiplying by it leaves the number unchanged",
    workedExample: {
      problem: "1 × 9 = ?",
      steps: [
        "Step 1: Think — 1 × 9 means '1 group of 9'",
        "Step 2: 1 group of 9 objects = 9 objects",
        "Step 3: The answer is always the other number"
      ],
      answer: "1 × 9 = 9"
    },
    commonMistakes: [
      "Students sometimes think 1 × anything = 1. Remember: 1 × 7 = 7, NOT 1",
      "Don't confuse multiplication by 1 with addition of 1: 1 × 5 = 5, but 1 + 5 = 6"
    ],
    realWorldExample: "If you have 1 bag with 12 oranges, you have 12 oranges total. 1 × 12 = 12"
  },
  2: {
    table: 2,
    title: "Doubles — Easy as Counting by 2s!",
    description: "Multiplying by 2 is just doubling — adding the number to itself. It's one of the most useful skills in math!",
    tricks: [
      "Just add the number to itself: 2 × 7 = 7 + 7 = 14",
      "Count by 2s: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20...",
      "ALL answers in the 2 times table are even numbers",
      "Quick check: if your answer is odd, you made a mistake!"
    ],
    examples: ["2 × 3 = 3 + 3 = 6", "2 × 8 = 8 + 8 = 16", "2 × 11 = 11 + 11 = 22"],
    visualTip: "Think of pairs: 2 shoes in a pair, 2 wings on a bird, 2 eyes on a face!",
    funFact: "Every number in the 2 times table ends in 0, 2, 4, 6, or 8 — these are called even numbers",
    workedExample: {
      problem: "2 × 7 = ?",
      steps: [
        "Step 1: 2 × 7 means '2 groups of 7'",
        "Step 2: Draw two rows of 7 dots: ●●●●●●● and ●●●●●●●",
        "Step 3: Count all dots: 7 + 7 = 14",
        "Step 4: OR just double 7: 7 doubled is 14"
      ],
      answer: "2 × 7 = 14"
    },
    commonMistakes: [
      "Don't count just to the number: 2 × 6 is NOT 6, it's 12",
      "Doubling means adding to itself, not adding 2: 2 × 9 = 18, not 11"
    ],
    realWorldExample: "A bicycle has 2 wheels. If there are 6 bikes, how many wheels? 2 × 6 = 12 wheels!"
  },
  3: {
    table: 3,
    title: "The Triangle Number",
    description: "Add the number three times, or use the amazing digit-sum trick to check your answers!",
    tricks: [
      "Add the number three times: 3 × 4 = 4 + 4 + 4 = 12",
      "DIGIT SUM TRICK: The digits of every multiple of 3 add up to 3, 6, or 9",
      "Example check: 3 × 8 = 24 → 2 + 4 = 6 ✓ (divisible by 3!)",
      "Count by 3s: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30..."
    ],
    examples: [
      "3 × 5 = 5 + 5 + 5 = 15 → check: 1 + 5 = 6 ✓",
      "3 × 7 = 21 → check: 2 + 1 = 3 ✓",
      "3 × 9 = 27 → check: 2 + 7 = 9 ✓"
    ],
    visualTip: "Think of three-legged stools, triangles (3 sides), or traffic lights (3 colours)!",
    funFact: "3 is the first odd prime number. The digit sum trick works for ALL multiples of 3 — even huge ones!",
    workedExample: {
      problem: "3 × 6 = ?",
      steps: [
        "Step 1: Think of 3 groups of 6 stars",
        "Step 2: Count the groups: ★★★★★★  ★★★★★★  ★★★★★★",
        "Step 3: Add: 6 + 6 + 6 = 18",
        "Step 4: Check with digit sum: 1 + 8 = 9 ✓ (9 is divisible by 3)"
      ],
      answer: "3 × 6 = 18"
    },
    commonMistakes: [
      "Don't stop at the wrong skip-count step: 3, 6, 9, 12 — that's four 3s, not three 4s. Be careful about WHICH number you are multiplying",
      "3 × 7 = 21, NOT 24. Count carefully: 7, 14, 21"
    ],
    realWorldExample: "A tricycle has 3 wheels. If 8 children each have a tricycle, there are 3 × 8 = 24 wheels!"
  },
  4: {
    table: 4,
    title: "Double the Doubles!",
    description: "Multiply by 4 by doubling twice. Since 4 = 2 × 2, you can use your strong 'doubles' skill twice!",
    tricks: [
      "DOUBLE IT, THEN DOUBLE AGAIN!",
      "Step 1: Multiply by 2. Step 2: Multiply that result by 2",
      "Pattern in last digits: 4, 8, 12, 16, 20 — the last digits go 4, 8, 2, 6, 0 and repeat",
      "All answers are even — if you get an odd answer, check again!"
    ],
    examples: [
      "4 × 6: Double 6 = 12, double 12 = 24",
      "4 × 7: Double 7 = 14, double 14 = 28",
      "4 × 9: Double 9 = 18, double 18 = 36"
    ],
    visualTip: "Think of tables with 4 legs, cars with 4 wheels, or a 2×2 square of tiles!",
    funFact: "4 is the smallest composite number (not prime). 4 = 2 × 2, so every ×4 fact is just doubling twice!",
    workedExample: {
      problem: "4 × 8 = ?",
      steps: [
        "Step 1: Start with 8",
        "Step 2: Double it once → 8 × 2 = 16",
        "Step 3: Double it again → 16 × 2 = 32",
        "Step 4: Check — last digit of 4 × 8: the pattern is 4,8,2,6,0,4,8,2,6,0... The 8th value is 2, so 32 ends in 2 ✓"
      ],
      answer: "4 × 8 = 32"
    },
    commonMistakes: [
      "Students often lose track after the first double. Write the intermediate step down: 4 × 7 → first 14, then 28",
      "Don't skip a doubling step: 4 × 6 = 24, not 12 (which would be only one doubling)"
    ],
    realWorldExample: "A box holds 4 rows of apples with 9 apples per row. Total: 4 × 9 = 36 apples!"
  },
  5: {
    table: 5,
    title: "The Hand Five Trick",
    description: "The easiest table to spot-check — answers always end in 0 or 5! There are two brilliant shortcuts.",
    tricks: [
      "Every answer ends in 0 (for even numbers) or 5 (for odd numbers)",
      "EVEN × 5: Halve the number, then add a 0",
      "Example: 8 × 5 → half of 8 = 4 → add 0 → 40",
      "ODD × 5: Halve the number (round down), then add 5",
      "Example: 7 × 5 → half of 7 ≈ 3 → add 5 → 35",
      "Count by 5s: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50..."
    ],
    examples: [
      "5 × 8 = 40 (8 ÷ 2 = 4, add 0)",
      "5 × 9 = 45 (9 is odd → 4 then 5)",
      "5 × 6 = 30 (6 ÷ 2 = 3, add 0)"
    ],
    visualTip: "Use your hand — each hand has 5 fingers. 2 hands = 10, 3 hands = 15... count in fives!",
    funFact: "5 is the only prime number that ends in 5. All other numbers ending in 5 are divisible by 5!",
    workedExample: {
      problem: "5 × 7 = ?",
      steps: [
        "Step 1: Is 7 even or odd? It's odd",
        "Step 2: Halve it and round down: 7 ÷ 2 = 3 (ignore the remainder)",
        "Step 3: The tens digit is 3, and since 7 is odd, the units digit is 5",
        "Step 4: Answer is 35"
      ],
      answer: "5 × 7 = 35"
    },
    commonMistakes: [
      "5 × 7 = 35, NOT 30. Odd numbers give answers ending in 5, not 0",
      "5 × 4 = 20, NOT 25. Even numbers give answers ending in 0",
      "Remember: 5 × 5 = 25 (odd × 5 ends in 5)"
    ],
    realWorldExample: "A pack of stickers has 5 stickers. If you buy 9 packs, you have 5 × 9 = 45 stickers!"
  },
  6: {
    table: 6,
    title: "The 5+1 Trick",
    description: "Since 6 = 5 + 1, multiply by 5 (easy!) then add the number once more. Two easy steps!",
    tricks: [
      "6 × n = (5 × n) + n (multiply by 5, then add n one more time)",
      "Example: 6 × 7 = (5 × 7) + 7 = 35 + 7 = 42",
      "OR: Double the 3 times table: 6 × 4 = 2 × (3 × 4) = 2 × 12 = 24",
      "When multiplying an even number by 6, the answer always ends in that even number",
      "6 × 2 = 12, 6 × 4 = 24, 6 × 6 = 36, 6 × 8 = 48"
    ],
    examples: [
      "6 × 8 = (5 × 8) + 8 = 40 + 8 = 48",
      "6 × 9 = (5 × 9) + 9 = 45 + 9 = 54",
      "6 × 7 = (5 × 7) + 7 = 35 + 7 = 42"
    ],
    visualTip: "Think of egg cartons (6 eggs), dice (6 faces), or insects (6 legs)!",
    funFact: "6 is the first PERFECT number — its factors (1, 2, 3) add up to exactly 6: 1 + 2 + 3 = 6",
    workedExample: {
      problem: "6 × 8 = ?",
      steps: [
        "Step 1: Split 6 into 5 + 1",
        "Step 2: Multiply 5 × 8 = 40 (easy with the 5s trick!)",
        "Step 3: Now add one more group of 8: 40 + 8 = 48",
        "Step 4: Check — 6 × 8, even × 6, the answer ends in 8 ✓ (same as the even number being multiplied)"
      ],
      answer: "6 × 8 = 48"
    },
    commonMistakes: [
      "6 × 7 = 42 (not 48). Don't mix up 6 × 7 and 6 × 8",
      "When using the 5+1 trick, remember to add the WHOLE number, not just 1: 6 × 9 = 45 + 9 = 54, not 45 + 1"
    ],
    realWorldExample: "An insect has 6 legs. If you see 7 insects, how many legs? 6 × 7 = 42 legs!"
  },
  7: {
    table: 7,
    title: "The Tricky Seven",
    description: "The hardest table for most students — but these strategies break it into manageable steps using facts you already know!",
    tricks: [
      "7 = 5 + 2: Multiply by 5, then add (2 × number)",
      "Example: 7 × 6 = (5 × 6) + (2 × 6) = 30 + 12 = 42",
      "RHYME TRICK: '5 6 7 8 — 56 is 7 × 8!' (Say it out loud!)",
      "Near-10 trick: 7 × 9 = (7 × 10) - 7 = 70 - 7 = 63",
      "Pattern: 7, 14, 21, 28, 35, 42, 49, 56, 63, 70..."
    ],
    examples: [
      "7 × 8 = 56 (remember: 5-6-7-8!)",
      "7 × 9 = 63 (10 × 7 = 70, minus 7 = 63)",
      "7 × 6 = 42 (5 × 6 = 30, plus 2 × 6 = 12, total 42)"
    ],
    visualTip: "Think of weeks — 7 days! 4 weeks = 4 × 7 = 28 days. A calendar helps you practice 7s!",
    funFact: "7 is the most commonly chosen 'lucky number' worldwide! The 7 × 8 = 56 rhyme has helped generations of students",
    workedExample: {
      problem: "7 × 6 = ?",
      steps: [
        "Step 1: Split 7 into 5 + 2",
        "Step 2: Calculate 5 × 6 = 30 (use the 5s trick: 6 is even, so 60 ÷ 2 = 30)",
        "Step 3: Calculate 2 × 6 = 12 (doubling)",
        "Step 4: Add together: 30 + 12 = 42"
      ],
      answer: "7 × 6 = 42"
    },
    commonMistakes: [
      "7 × 8 = 56, NOT 54 or 48. Memorise the rhyme: 5-6-7-8!",
      "7 × 7 = 49. Students often say 42 — that's 7 × 6. Count one more 7: 42 + 7 = 49",
      "7 × 9 = 63, not 62 or 56. Use the near-10 trick: 70 - 7 = 63"
    ],
    realWorldExample: "There are 7 days in a week. How many days in 8 weeks? 7 × 8 = 56 days!"
  },
  8: {
    table: 8,
    title: "Triple Doubling!",
    description: "Since 8 = 2 × 2 × 2, you can double three times to get any ×8 answer. Structured and reliable!",
    tricks: [
      "Double THREE times: 8 = 2 × 2 × 2",
      "Start with the number → double → double → double",
      "Example: 8 × 6 → 6 → 12 → 24 → 48",
      "Pattern in last digits: 8, 6, 4, 2, 0, 8, 6, 4, 2, 0 (repeating)",
      "All answers are EVEN"
    ],
    examples: [
      "8 × 5: 5 → 10 → 20 → 40",
      "8 × 7: 7 → 14 → 28 → 56",
      "8 × 9: 9 → 18 → 36 → 72"
    ],
    visualTip: "An octopus has 8 legs! Picture 3 octopuses — that's 3 × 8 = 24 legs. A spider also has 8 legs!",
    funFact: "8 is a cube number: 2³ = 2 × 2 × 2 = 8. This is why the triple-doubling trick works perfectly!",
    workedExample: {
      problem: "8 × 7 = ?",
      steps: [
        "Step 1: Start with 7",
        "Step 2: First double → 7 × 2 = 14",
        "Step 3: Second double → 14 × 2 = 28",
        "Step 4: Third double → 28 × 2 = 56",
        "Step 5: Check — the last digit of 8 × 7 should be 6 (from the pattern 8,6,4,2,0). 56 ends in 6 ✓"
      ],
      answer: "8 × 7 = 56"
    },
    commonMistakes: [
      "Students sometimes only double TWICE and forget the third doubling. Write each step down!",
      "8 × 7 = 56, not 48 (that's 8 × 6). Count carefully when skip-counting by 8",
      "8 × 8 = 64, not 56. One easy way to remember: 8 × 8 = 64 — 'I ate and ate until I was sick on the floor' (8 × 8 = 64)"
    ],
    realWorldExample: "A spider has 8 legs. If you find 9 spiders, how many legs total? 8 × 9 = 72 legs!"
  },
  9: {
    table: 9,
    title: "The Finger Magic & Digit Sum",
    description: "The 9 times table has the most amazing patterns — once you see them, you'll never forget!",
    tricks: [
      "FINGER TRICK: Hold up 10 fingers. For 9 × n, fold down finger number n. Fingers left of it = tens digit, fingers right = ones digit",
      "Example: 9 × 4 → fold down 4th finger → 3 fingers left, 6 fingers right → 36",
      "DIGIT SUM: The digits of every answer always add up to 9!",
      "9 × 3 = 27 → 2+7=9 ✓   9 × 7 = 63 → 6+3=9 ✓",
      "NEAR-10 TRICK: 9 × n = (10 × n) - n",
      "PATTERN: First digits go UP (0,1,2,3,4...), last digits go DOWN (9,8,7,6,5...)"
    ],
    examples: [
      "9 × 4 = 36 (finger trick: 3 | 6 = 36)",
      "9 × 6 = 54 (60 - 6 = 54, check: 5+4=9 ✓)",
      "9 × 8 = 72 (80 - 8 = 72, check: 7+2=9 ✓)"
    ],
    visualTip: "Use the finger trick every time until you know it by heart — it is 100% reliable for 9 × 1 through 9 × 10!",
    funFact: "9 is the largest single-digit number. The digit-sum trick works because 9 = 10 - 1, so multiplying by 9 always 'borrows' 1 from the tens",
    workedExample: {
      problem: "9 × 7 = ?",
      steps: [
        "Step 1: FINGER TRICK — hold up 10 fingers",
        "Step 2: Fold down finger number 7",
        "Step 3: Count fingers to the LEFT of folded finger: 6 fingers",
        "Step 4: Count fingers to the RIGHT of folded finger: 3 fingers",
        "Step 5: Tens digit = 6, Units digit = 3, so answer = 63",
        "Step 6: Check: 6 + 3 = 9 ✓"
      ],
      answer: "9 × 7 = 63"
    },
    commonMistakes: [
      "9 × 6 = 54 NOT 56. Remember: 9 × 6 = 54 and 9 × 7 = 63. The tens digit is always one less than the number you're multiplying",
      "When using the near-10 trick, subtract the number from the 10× answer: 9 × 8 = 80 - 8 = 72, not 80 - 9"
    ],
    realWorldExample: "A baseball team has 9 players. How many players in 6 teams? 9 × 6 = 54 players!"
  },
  10: {
    table: 10,
    title: "The Easiest — Just Shift a Place!",
    description: "Multiplying by 10 shifts every digit one place to the left in our number system. Just add a zero at the end!",
    tricks: [
      "ADD A ZERO to the end of the number",
      "10 × 7 = 70, 10 × 35 = 350",
      "WHY does it work? Our number system is base-10. ×10 moves every digit one place value higher",
      "The Units digit becomes the Tens digit, Tens becomes Hundreds, etc.",
      "Count by 10s: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100..."
    ],
    examples: [
      "10 × 3 = 30 (3 in units → moves to tens)",
      "10 × 12 = 120",
      "10 × 47 = 470"
    ],
    visualTip: "Think of our 10 fingers — that's why we use base-10! A dime = 10 cents: 10 × 3 dimes = 30 cents",
    funFact: "We use base-10 (decimal system) because humans have 10 fingers! Ancient Mayans used base-20 (fingers and toes!)",
    workedExample: {
      problem: "10 × 43 = ?",
      steps: [
        "Step 1: Write the number 43",
        "Step 2: Multiplying by 10 moves each digit one place to the LEFT",
        "Step 3: The 4 (in the tens place) moves to the hundreds place",
        "Step 4: The 3 (in the units place) moves to the tens place",
        "Step 5: The units place becomes 0",
        "Step 6: Result: 430"
      ],
      answer: "10 × 43 = 430"
    },
    commonMistakes: [
      "10 × 10 = 100, NOT 20. You add a zero, you don't add 10",
      "10 × 0 = 0, not 10. Remember: ANY number times 0 is 0",
      "Be careful with decimals: 10 × 2.5 = 25 (the decimal point moves right, same idea)"
    ],
    realWorldExample: "A box holds 10 crayons. If the classroom needs 28 boxes, that's 10 × 28 = 280 crayons!"
  },
  11: {
    table: 11,
    title: "The Mirror Number Trick",
    description: "For 1–9, just repeat the digit! For larger numbers, there's a beautiful pattern using digit addition.",
    tricks: [
      "For 1–9: REPEAT the digit: 11 × 3 = 33, 11 × 7 = 77, 11 × 9 = 99",
      "For two-digit numbers (10–18): Add the digits and put the sum in the middle",
      "11 × 13: digits are 1 and 3, sum = 4, put in middle → 143",
      "11 × 25: digits are 2 and 5, sum = 7, put in middle → 275",
      "For sums > 9: carry the 1 to the first digit (e.g. 11 × 19: 1+9=10, carry → 209)"
    ],
    examples: [
      "11 × 4 = 44 (repeat the 4)",
      "11 × 15 = 165 (1+5=6, put in middle: 1_6_5)",
      "11 × 12 = 132 (1+2=3, put in middle)"
    ],
    visualTip: "11 looks like two ones standing side by side — that's why it repeats digits! For 11 × 3: the 3 appears in BOTH places.",
    funFact: "11 is the smallest two-digit prime number. The 'repeat the digit' trick works because 11 = 10 + 1, so 11 × n = 10n + n",
    workedExample: {
      problem: "11 × 7 = ?",
      steps: [
        "Step 1: Is 7 a single digit? Yes",
        "Step 2: Simply repeat the digit: 7 becomes 77",
        "Step 3: WHY it works: 11 × 7 = (10 × 7) + (1 × 7) = 70 + 7 = 77"
      ],
      answer: "11 × 7 = 77"
    },
    commonMistakes: [
      "11 × 11 = 121, NOT 1111. The trick changes for two-digit numbers",
      "11 × 19 = 209 (not 1919!). When digits sum to 10+, carry the 1: 1+9=10, so answer is 1(10)9 → carry → 209",
      "Don't confuse 11 × 6 = 66 with 11 + 6 = 17"
    ],
    realWorldExample: "A football team has 11 players. How many players in 7 teams? 11 × 7 = 77 players!"
  },
  12: {
    table: 12,
    title: "The Dozen — Split into 10+2",
    description: "A dozen = 12. Use the 10+2 split strategy: multiply by 10 (easy!), multiply by 2 (doubling!), then add them.",
    tricks: [
      "12 = 10 + 2: Split into two easier multiplications",
      "12 × n = (10 × n) + (2 × n)",
      "Step 1: Multiply by 10 (just add a zero)",
      "Step 2: Double the number (multiply by 2)",
      "Step 3: Add those two results together"
    ],
    examples: [
      "12 × 7 = (10×7) + (2×7) = 70 + 14 = 84",
      "12 × 5 = (10×5) + (2×5) = 50 + 10 = 60",
      "12 × 8 = (10×8) + (2×8) = 80 + 16 = 96"
    ],
    visualTip: "12 eggs in a dozen, 12 months in a year, 12 hours on a clock — 12 is everywhere in daily life!",
    funFact: "12 has MORE divisors (1,2,3,4,6,12) than any other number under 20. That's why we use dozens — it divides evenly by 2, 3, 4, and 6!",
    workedExample: {
      problem: "12 × 9 = ?",
      steps: [
        "Step 1: Split 12 into 10 + 2",
        "Step 2: Multiply first part: 10 × 9 = 90",
        "Step 3: Multiply second part: 2 × 9 = 18",
        "Step 4: Add results: 90 + 18 = 108"
      ],
      answer: "12 × 9 = 108"
    },
    commonMistakes: [
      "12 × 8 = 96, NOT 88. Don't forget to add BOTH parts: 80 + 16 = 96",
      "12 × 7 = 84, NOT 82. Check your addition: 70 + 14 = 84",
      "The 12 times table goes beyond 120 — 12 × 11 = 132, 12 × 12 = 144 (know these!)"
    ],
    realWorldExample: "Eggs come in dozens (12). If you buy 8 dozen eggs for a bakery, that's 12 × 8 = 96 eggs!"
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
    description: "Order doesn't matter: 3 × 4 = 4 × 3 = 12. This HALVES the number of facts you need to learn! If you know 7 × 9, you already know 9 × 7.",
    icon: "🔄"
  },
  {
    title: "Zero Rule",
    description: "Any number × 0 = 0. Zero groups of anything is nothing! 1000 × 0 = 0. No exceptions.",
    icon: "⭕"
  },
  {
    title: "Identity Rule (×1)",
    description: "Any number × 1 = that same number. 1 × 999 = 999. One group of anything is just that thing.",
    icon: "1️⃣"
  },
  {
    title: "Skip Counting",
    description: "Count forward by the multiplier: For 4 × 5, count: 5, 10, 15, 20. You just counted to the answer! This builds number sense.",
    icon: "🦘"
  },
  {
    title: "Build on Known Facts",
    description: "If you know 7 × 8 = 56, then 7 × 9 = 56 + 7 = 63. Each unknown fact is just one step from a known one!",
    icon: "🧱"
  },
  {
    title: "Break It Down (Distributive Law)",
    description: "Hard fact: 7 × 8. Split 8 into 5+3: 7 × 5 = 35, 7 × 3 = 21. Add: 35 + 21 = 56. Any fact can be broken into easier pieces.",
    icon: "✂️"
  },
  {
    title: "Arrays — See It Visually",
    description: "Draw dots in rows and columns. 3 × 4 = 3 rows of 4 dots = 12 total. This connects multiplication to area and geometry!",
    icon: "⬛"
  },
  {
    title: "Check With the Reverse",
    description: "Use division to check: If 6 × 7 = 42, then 42 ÷ 7 should equal 6. Multiplication and division are fact families — they always go together.",
    icon: "🔁"
  },
  {
    title: "Consistent Daily Practice",
    description: "5 focused minutes every day beats 35 minutes once a week. Your brain builds memory through repetition. A little every day makes a huge difference!",
    icon: "📅"
  },
  {
    title: "Say It Out Loud",
    description: "Saying '7 times 8 equals 56' out loud activates more of your brain than just reading it. Make up songs or rhymes — '5 6 7 8, fifty-six is 7 times 8!'",
    icon: "🎵"
  }
];

export const multiplicationStrategies = [
  {
    name: "Repeated Addition",
    description: "3 × 4 means 'add 3, four times': 3 + 3 + 3 + 3 = 12. This is the DEFINITION of multiplication — best for beginners to build understanding.",
    difficulty: "beginner",
    icon: "➕"
  },
  {
    name: "Skip Counting",
    description: "Count forward by the multiplier: For 5 × 4, count: 5, 10, 15, 20. Count how many jumps — that's your answer!",
    difficulty: "beginner",
    icon: "🔢"
  },
  {
    name: "Arrays & Area Models",
    description: "Draw rows and columns: 4 × 3 is 4 rows of 3 objects = 12. This connects to area — a 4cm × 3cm rectangle has 12 square centimetres!",
    difficulty: "beginner",
    icon: "📊"
  },
  {
    name: "Doubling Strategy",
    description: "×4 = double twice. ×8 = double three times. ×16 = double four times. Master doubling and you can handle any power of 2!",
    difficulty: "intermediate",
    icon: "✖️"
  },
  {
    name: "Distributive Property",
    description: "Break apart one factor: 7 × 8 = (7 × 5) + (7 × 3) = 35 + 21 = 56. This is the basis of all long multiplication and algebra!",
    difficulty: "intermediate",
    icon: "🧩"
  },
  {
    name: "Near-10 Strategy",
    description: "For ×9: use ×10 then subtract. 9 × 6 = (10 × 6) - 6 = 60 - 6 = 54. For ×11: use ×10 then add. 11 × 6 = (10 × 6) + 6 = 66.",
    difficulty: "intermediate",
    icon: "🎯"
  },
  {
    name: "Halving & Doubling",
    description: "If one factor is even, halve it and double the other: 4 × 18 = 8 × 9 = 72. Keep halving and doubling until easier: 16 × 5 = 8 × 10 = 80!",
    difficulty: "advanced",
    icon: "⚖️"
  },
  {
    name: "Factor Pairs",
    description: "Regroup factors for easy computation: 12 × 5 = (6 × 2) × 5 = 6 × (2 × 5) = 6 × 10 = 60. Look for pairs that make 10!",
    difficulty: "advanced",
    icon: "🔗"
  }
];
