/**
 * Rewards and Coins System for Worksheet Practice
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

export interface RewardCriteria {
  coins: number;
  stars: number;
  reason: string;
}

/**
 * Calculate rewards based on worksheet performance
 */
export function calculateRewards(
  correctCount: number,
  totalProblems: number,
  timeSpent: number,
  streak: number,
  difficulty: 'easy' | 'medium' | 'hard'
): RewardCriteria {
  let coins = 0;
  let stars = 0;
  const reasons: string[] = [];

  // Base coins for each correct answer
  const coinsPerCorrect = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
  coins += correctCount * coinsPerCorrect;
  reasons.push(`${correctCount} correct × ${coinsPerCorrect} coins`);

  // Percentage bonus
  const percentage = totalProblems > 0 ? (correctCount / totalProblems) * 100 : 0;
  if (percentage === 100) {
    coins += 50;
    stars += 3;
    reasons.push('Perfect score: +50 coins, +3 stars!');
  } else if (percentage >= 90) {
    coins += 30;
    stars += 2;
    reasons.push('Excellent (90%+): +30 coins, +2 stars');
  } else if (percentage >= 75) {
    coins += 15;
    stars += 1;
    reasons.push('Great (75%+): +15 coins, +1 star');
  }

  // Speed bonus (for timed mode)
  const avgTimePerProblem = timeSpent / totalProblems;
  if (avgTimePerProblem < 10 && percentage >= 80) {
    coins += 25;
    reasons.push('Speed bonus: +25 coins (fast & accurate!)');
  }

  // Streak bonus
  if (streak >= 10) {
    const streakBonus = Math.floor(streak / 5) * 10;
    coins += streakBonus;
    reasons.push(`Streak bonus: +${streakBonus} coins (${streak} in a row!)`);
  }

  // Difficulty multiplier for stars
  const difficultyMultiplier = difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1.5 : 1;
  stars = Math.floor(stars * difficultyMultiplier);

  return {
    coins,
    stars,
    reason: reasons.join(', ')
  };
}

/**
 * Daily challenge system
 */
export interface DailyChallenge {
  date: string;
  type: 'streak' | 'accuracy' | 'speed' | 'problems';
  target: number;
  current: number;
  completed: boolean;
  reward: number;
  description: string;
}

export function getTodaysChallenges(): DailyChallenge[] {
  const today = new Date().toISOString().split('T')[0];

  return [
    {
      date: today,
      type: 'problems',
      target: 20,
      current: 0,
      completed: false,
      reward: 100,
      description: 'Solve 20 problems today'
    },
    {
      date: today,
      type: 'accuracy',
      target: 90,
      current: 0,
      completed: false,
      reward: 75,
      description: 'Achieve 90% accuracy or higher'
    },
    {
      date: today,
      type: 'streak',
      target: 10,
      current: 0,
      completed: false,
      reward: 50,
      description: 'Get a 10-problem streak'
    }
  ];
}

/**
 * Check and update daily challenges
 */
export function updateDailyChallenges(
  challenges: DailyChallenge[],
  problemsSolved: number,
  accuracy: number,
  streak: number
): { challenges: DailyChallenge[]; coinsEarned: number } {
  let coinsEarned = 0;
  const today = new Date().toISOString().split('T')[0];

  const updated = challenges.map(challenge => {
    // Reset if not today
    if (challenge.date !== today) {
      return { ...challenge, date: today, current: 0, completed: false };
    }

    // Already completed
    if (challenge.completed) return challenge;

    const newChallenge = { ...challenge };

    switch (challenge.type) {
      case 'problems':
        newChallenge.current = Math.min(problemsSolved, challenge.target);
        break;
      case 'accuracy':
        newChallenge.current = Math.floor(accuracy);
        break;
      case 'streak':
        newChallenge.current = Math.max(streak, challenge.current);
        break;
    }

    // Check if completed
    if (newChallenge.current >= newChallenge.target && !newChallenge.completed) {
      newChallenge.completed = true;
      coinsEarned += challenge.reward;
    }

    return newChallenge;
  });

  return { challenges: updated, coinsEarned };
}

/**
 * Star tier system
 */
export function getStarTier(totalStars: number): {
  tier: string;
  icon: string;
  nextTier: string;
  starsToNext: number;
} {
  if (totalStars >= 1000) {
    return {
      tier: 'Math Legend',
      icon: '👑',
      nextTier: 'You\'re at the top!',
      starsToNext: 0
    };
  } else if (totalStars >= 500) {
    return {
      tier: 'Math Master',
      icon: '🌟',
      nextTier: 'Math Legend',
      starsToNext: 1000 - totalStars
    };
  } else if (totalStars >= 250) {
    return {
      tier: 'Math Expert',
      icon: '⭐',
      nextTier: 'Math Master',
      starsToNext: 500 - totalStars
    };
  } else if (totalStars >= 100) {
    return {
      tier: 'Math Pro',
      icon: '✨',
      nextTier: 'Math Expert',
      starsToNext: 250 - totalStars
    };
  } else if (totalStars >= 50) {
    return {
      tier: 'Math Learner',
      icon: '🌠',
      nextTier: 'Math Pro',
      starsToNext: 100 - totalStars
    };
  } else {
    return {
      tier: 'Beginner',
      icon: '⭐',
      nextTier: 'Math Learner',
      starsToNext: 50 - totalStars
    };
  }
}

/**
 * Unlockable items/themes based on coins
 */
export interface UnlockableItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'theme' | 'avatar' | 'badge' | 'powerup';
  icon: string;
}

export const unlockableItems: UnlockableItem[] = [
  {
    id: 'theme-ocean',
    name: 'Ocean Theme',
    description: 'Cool blue ocean colors',
    cost: 200,
    type: 'theme',
    icon: '🌊'
  },
  {
    id: 'theme-forest',
    name: 'Forest Theme',
    description: 'Peaceful green forest',
    cost: 200,
    type: 'theme',
    icon: '🌲'
  },
  {
    id: 'theme-sunset',
    name: 'Sunset Theme',
    description: 'Warm sunset colors',
    cost: 250,
    type: 'theme',
    icon: '🌅'
  },
  {
    id: 'theme-space',
    name: 'Space Theme',
    description: 'Cosmic space adventure',
    cost: 300,
    type: 'theme',
    icon: '🚀'
  },
  {
    id: 'powerup-hint',
    name: 'Hint Pack',
    description: '10 hints for tough problems',
    cost: 150,
    type: 'powerup',
    icon: '💡'
  },
  {
    id: 'powerup-time',
    name: 'Time Freeze',
    description: 'Pause timer for 30 seconds',
    cost: 100,
    type: 'powerup',
    icon: '⏸️'
  }
];
