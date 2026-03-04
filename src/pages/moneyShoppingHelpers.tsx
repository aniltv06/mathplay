/**
 * Money & Shopping Page — helper data, generator functions, and coin renderer
 * Extracted from MoneyShoppingPage.tsx for maintainability.
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import React from 'react';

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ProblemType = 'count-coins' | 'make-amount' | 'make-change' | 'shopping';

export interface Coin {
  name: string;
  value: number;
  count: number;
  emoji: string;
}

export interface MoneyProblem {
  type: ProblemType;
  coins?: Coin[];
  totalAmount?: number;
  itemPrice?: number;
  amountPaid?: number;
  answer: number;
  displayQuestion: string;
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

export const COIN_TYPES = [
  { name: 'Penny',   value: 1,  emoji: '🪙' },
  { name: 'Nickel',  value: 5,  emoji: '🪙' },
  { name: 'Dime',    value: 10, emoji: '🪙' },
  { name: 'Quarter', value: 25, emoji: '🪙' },
] as const;

// ---------------------------------------------------------------------------
// Pure generator functions
// ---------------------------------------------------------------------------

export function generateCountCoins(difficulty: DifficultyLevel): MoneyProblem {
  const coins: Coin[] = [];
  let totalAmount = 0;

  if (difficulty === 'beginner') {
    // Single coin type
    const coinType = COIN_TYPES[Math.floor(Math.random() * COIN_TYPES.length)];
    const count = Math.floor(Math.random() * 8) + 2; // 2-9 coins
    totalAmount = coinType.value * count;
    coins.push({ name: coinType.name, value: coinType.value, count, emoji: coinType.emoji });
  } else if (difficulty === 'intermediate') {
    // 2-3 coin types
    const numTypes = Math.floor(Math.random() * 2) + 2;
    const selectedTypes = [...COIN_TYPES].sort(() => Math.random() - 0.5).slice(0, numTypes);
    selectedTypes.forEach(coinType => {
      const count = Math.floor(Math.random() * 5) + 1; // 1-5 of each
      totalAmount += coinType.value * count;
      coins.push({ name: coinType.name, value: coinType.value, count, emoji: coinType.emoji });
    });
  } else {
    // All coin types
    COIN_TYPES.forEach(coinType => {
      const count = Math.floor(Math.random() * 4) + 1; // 1-4 of each
      totalAmount += coinType.value * count;
      coins.push({ name: coinType.name, value: coinType.value, count, emoji: coinType.emoji });
    });
  }

  return {
    type: 'count-coins',
    coins,
    answer: totalAmount,
    displayQuestion: 'How much money is shown?',
  };
}

export function generateMakeAmount(difficulty: DifficultyLevel): MoneyProblem {
  let targetAmount: number;

  if (difficulty === 'beginner') {
    targetAmount = [5, 10, 25, 50][Math.floor(Math.random() * 4)];
  } else if (difficulty === 'intermediate') {
    targetAmount = Math.floor(Math.random() * 10) * 5 + 10; // 10-50 in 5¢ increments
  } else {
    targetAmount = Math.floor(Math.random() * 20) * 5 + 25; // 25-100 in 5¢ increments
  }

  return {
    type: 'make-amount',
    totalAmount: targetAmount,
    answer: targetAmount,
    displayQuestion: `Make ${targetAmount}¢ using coins`,
  };
}

export function generateMakeChange(difficulty: DifficultyLevel): MoneyProblem {
  let itemPrice: number, amountPaid: number;

  if (difficulty === 'beginner') {
    itemPrice = Math.floor(Math.random() * 40) + 10; // 10-49¢
    amountPaid = 50;
  } else if (difficulty === 'intermediate') {
    itemPrice = Math.floor(Math.random() * 70) + 10; // 10-79¢
    amountPaid = [50, 100][Math.floor(Math.random() * 2)];
  } else {
    itemPrice = Math.floor(Math.random() * 150) + 50; // 50-199¢
    amountPaid = 200;
  }

  const change = amountPaid - itemPrice;

  return {
    type: 'make-change',
    itemPrice,
    amountPaid,
    answer: change,
    displayQuestion: `Item costs ${itemPrice}¢, you pay ${amountPaid}¢. What's the change?`,
  };
}

export function generateShopping(difficulty: DifficultyLevel): MoneyProblem {
  const items = [
    { name: 'Apple',  price: 25 },
    { name: 'Banana', price: 15 },
    { name: 'Cookie', price: 50 },
    { name: 'Juice',  price: 75 },
    { name: 'Candy',  price: 10 },
    { name: 'Chips',  price: 60 },
  ];

  const numItems = difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4;
  let total = 0;
  const selectedItems: typeof items = [];

  for (let i = 0; i < numItems; i++) {
    const item = items[Math.floor(Math.random() * items.length)];
    selectedItems.push(item);
    total += item.price;
  }

  const itemNames = selectedItems.map(item => item.name).join(', ');

  return {
    type: 'shopping',
    totalAmount: total,
    answer: total,
    displayQuestion: `Shopping: ${itemNames}. Total cost?`,
  };
}

/** Top-level dispatcher — picks a problem type based on difficulty. */
export function generateProblem(difficulty: DifficultyLevel): MoneyProblem {
  const rand = Math.random();

  if (difficulty === 'beginner') {
    return rand < 0.7 ? generateCountCoins(difficulty) : generateMakeAmount(difficulty);
  } else if (difficulty === 'intermediate') {
    if (rand < 0.4) return generateCountCoins(difficulty);
    if (rand < 0.7) return generateMakeChange(difficulty);
    return generateShopping(difficulty);
  } else {
    if (rand < 0.3) return generateCountCoins(difficulty);
    if (rand < 0.5) return generateMakeChange(difficulty);
    return generateShopping(difficulty);
  }
}

// ---------------------------------------------------------------------------
// Coin visual renderer component
// ---------------------------------------------------------------------------

function getCoinStyle(value: number): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  switch (value) {
    case 1:  // Penny (copper)
      return { ...baseStyle, background: 'linear-gradient(to bottom right, #f97316, #b45309)' };
    case 5:  // Nickel (silver)
      return { ...baseStyle, background: 'linear-gradient(to bottom right, #64748b, #334155)' };
    case 10: // Dime (light silver)
      return { ...baseStyle, background: 'linear-gradient(to bottom right, #9ca3af, #4b5563)' };
    case 25: // Quarter (dark silver)
      return { ...baseStyle, background: 'linear-gradient(to bottom right, #475569, #1e293b)' };
    default:
      return { ...baseStyle, background: 'linear-gradient(to bottom right, #fbbf24, #ca8a04)' };
  }
}

interface CoinVisualsProps {
  problem: MoneyProblem;
}

export function CoinVisuals({ problem }: CoinVisualsProps) {
  if (!problem.coins) return null;

  return (
    <div className="bg-green-50 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-bold text-green-800 mb-4 text-center">
        Count the Coins
      </h3>
      <div className="space-y-4">
        {problem.coins.map((coin, idx) => (
          <div key={idx} className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-800">{coin.name}s</span>
              <span className="text-sm text-gray-600">{coin.value}¢ each</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: coin.count }).map((_, i) => (
                <div key={i} style={getCoinStyle(coin.value)}>
                  {coin.value}
                </div>
              ))}
            </div>
            <div className="mt-2 text-right text-sm text-gray-600">
              {coin.count} × {coin.value}¢ = {coin.count * coin.value}¢
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
