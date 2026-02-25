import { describe, it, expect } from 'vitest';
import {
  initializeBadges,
  checkAndAwardBadges,
  getBadgeProgress,
  getBadgeById,
  getEarnedBadges,
} from '../utils/badges';
import type { Profile } from '../context/ProfileContext';
import type { WorksheetSession, HangmanSession, ProfileStats } from '../types';

function makeStats(overrides: Partial<ProfileStats> = {}): ProfileStats {
  return {
    totalSessions: 0,
    totalProblems: 0,
    totalCorrect: 0,
    totalWrong: 0,
    bestStreak: 0,
    averagePercentage: 0,
    timeSpent: 0,
    hangmanSessions: 0,
    hangmanProblems: 0,
    hangmanCorrect: 0,
    hangmanWrong: 0,
    hangmanBestStreak: 0,
    hangmanHighScore: 0,
    hangmanTimeSpent: 0,
    ...overrides,
  };
}

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: 'test-profile',
    name: 'Tester',
    avatar: '🧑',
    createdAt: Date.now(),
    lastActive: Date.now(),
    stats: makeStats(),
    worksheetHistory: [],
    hangmanHistory: [],
    currentWorksheetSession: null,
    currentHangmanSession: null,
    badges: initializeBadges(),
    ...overrides,
  };
}

function makeWorksheetSession(overrides: Partial<WorksheetSession> = {}): WorksheetSession {
  return {
    date: new Date().toISOString(),
    settings: {
      numProblems: 10,
      maxNum: 20,
      minNum: 1,
      includeAddition: true,
      includeSubtraction: true,
      includeMultiplication: false,
      includeDivision: false,
    },
    problems: [],
    answers: [],
    timeSpent: 60,
    completed: true,
    correctCount: 10,
    wrongCount: 0,
    percentage: 100,
    ...overrides,
  };
}

function makeHangmanSession(overrides: Partial<HangmanSession> = {}): HangmanSession {
  return {
    date: new Date().toISOString(),
    difficulty: 'easy',
    settings: { problemTypes: ['addition'], livesCount: 6, timeBonus: true, streakBonus: true },
    problems: [],
    answers: [],
    score: 50,
    livesUsed: 2,
    totalLives: 6,
    maxStreak: 3,
    timeSpent: 120,
    completed: true,
    ...overrides,
  };
}

describe('initializeBadges', () => {
  it('returns 14 badges', () => {
    expect(initializeBadges()).toHaveLength(14);
  });

  it('all badges start as unearned', () => {
    initializeBadges().forEach(b => expect(b.earned).toBe(false));
  });
});

describe('getBadgeById', () => {
  it('finds a badge by id', () => {
    const badge = getBadgeById('first-steps');
    expect(badge).not.toBeNull();
    expect(badge?.id).toBe('first-steps');
  });

  it('returns null for unknown id', () => {
    // @ts-expect-error intentional bad id
    expect(getBadgeById('nonexistent')).toBeNull();
  });
});

describe('getEarnedBadges', () => {
  it('returns empty when no badges earned', () => {
    const profile = makeProfile();
    expect(getEarnedBadges(profile)).toHaveLength(0);
  });

  it('returns only earned badges', () => {
    const badges = initializeBadges();
    badges[0] = { ...badges[0], earned: true };
    const profile = makeProfile({ badges });
    expect(getEarnedBadges(profile)).toHaveLength(1);
    expect(getEarnedBadges(profile)[0].id).toBe('first-steps');
  });
});

describe('checkAndAwardBadges', () => {
  it('returns empty array when no criteria met', () => {
    const profile = makeProfile();
    expect(checkAndAwardBadges(profile)).toHaveLength(0);
  });

  it('awards first-steps when totalSessions >= 1', () => {
    const profile = makeProfile({ stats: makeStats({ totalSessions: 1 }) });
    const earned = checkAndAwardBadges(profile);
    expect(earned).toContain('first-steps');
  });

  it('awards perfect-score on 100% worksheet session', () => {
    const session = makeWorksheetSession({ percentage: 100 });
    const profile = makeProfile({
      stats: makeStats({ totalSessions: 1 }),
      worksheetHistory: [session],
    });
    const earned = checkAndAwardBadges(profile);
    expect(earned).toContain('perfect-score');
  });

  it('does NOT award perfect-score when session < 100%', () => {
    const session = makeWorksheetSession({ percentage: 90 });
    const profile = makeProfile({
      stats: makeStats({ totalSessions: 1 }),
      worksheetHistory: [session],
    });
    expect(checkAndAwardBadges(profile)).not.toContain('perfect-score');
  });

  it('awards speed-demon for 10+ problems in under 2 minutes', () => {
    const problems = Array.from({ length: 10 }, (_, i) => ({
      num1: i + 1, num2: 2, operation: '+' as const, correct: i + 3,
    }));
    const session = makeWorksheetSession({ problems, timeSpent: 100 });
    const profile = makeProfile({
      stats: makeStats({ totalSessions: 1 }),
      worksheetHistory: [session],
    });
    expect(checkAndAwardBadges(profile)).toContain('speed-demon');
  });

  it('does NOT award speed-demon when timeSpent > 120', () => {
    const problems = Array.from({ length: 10 }, (_, i) => ({
      num1: i + 1, num2: 2, operation: '+' as const, correct: i + 3,
    }));
    const session = makeWorksheetSession({ problems, timeSpent: 130 });
    const profile = makeProfile({
      stats: makeStats({ totalSessions: 1 }),
      worksheetHistory: [session],
    });
    expect(checkAndAwardBadges(profile)).not.toContain('speed-demon');
  });

  it('awards marathon for 20+ problems in a session', () => {
    const problems = Array.from({ length: 20 }, (_, i) => ({
      num1: i + 1, num2: 2, operation: '+' as const, correct: i + 3,
    }));
    const session = makeWorksheetSession({ problems });
    const profile = makeProfile({
      stats: makeStats({ totalSessions: 1 }),
      worksheetHistory: [session],
    });
    expect(checkAndAwardBadges(profile)).toContain('marathon');
  });

  it('awards streak-master for bestStreak >= 10', () => {
    const profile = makeProfile({ stats: makeStats({ bestStreak: 10, totalSessions: 1 }) });
    expect(checkAndAwardBadges(profile)).toContain('streak-master');
  });

  it('awards math-wizard for 100+ total problems', () => {
    const profile = makeProfile({
      stats: makeStats({ totalProblems: 100, totalSessions: 1 }),
    });
    expect(checkAndAwardBadges(profile)).toContain('math-wizard');
  });

  it('awards persistent for 10+ sessions', () => {
    const profile = makeProfile({ stats: makeStats({ totalSessions: 10 }) });
    expect(checkAndAwardBadges(profile)).toContain('persistent');
  });

  it('awards hangman-survivor for completing a game without losing all lives', () => {
    const session = makeHangmanSession({ completed: true, livesUsed: 3, totalLives: 6 });
    const profile = makeProfile({ hangmanHistory: [session] });
    expect(checkAndAwardBadges(profile)).toContain('hangman-survivor');
  });

  it('awards hangman-perfect for zero lives lost', () => {
    const session = makeHangmanSession({ completed: true, livesUsed: 0, totalLives: 6 });
    const profile = makeProfile({ hangmanHistory: [session] });
    const earned = checkAndAwardBadges(profile);
    expect(earned).toContain('hangman-perfect');
    expect(earned).toContain('hangman-survivor');
  });

  it('awards hangman-speedster for score >= 100', () => {
    const session = makeHangmanSession({ score: 150 });
    const profile = makeProfile({ hangmanHistory: [session] });
    expect(checkAndAwardBadges(profile)).toContain('hangman-speedster');
  });

  it('awards hangman-champion for 10+ hangman sessions', () => {
    const profile = makeProfile({ stats: makeStats({ hangmanSessions: 10 }) });
    expect(checkAndAwardBadges(profile)).toContain('hangman-champion');
  });

  it('does not re-award already earned badges', () => {
    const badges = initializeBadges().map(b =>
      b.id === 'first-steps' ? { ...b, earned: true } : b
    );
    const profile = makeProfile({
      stats: makeStats({ totalSessions: 5 }),
      badges,
    });
    expect(checkAndAwardBadges(profile)).not.toContain('first-steps');
  });

  it('does not mutate the input profile', () => {
    const profile = makeProfile({ stats: makeStats({ totalSessions: 1 }) });
    const originalBadges = profile.badges.map(b => ({ ...b }));
    checkAndAwardBadges(profile);
    profile.badges.forEach((b, i) => {
      expect(b.earned).toBe(originalBadges[i].earned);
    });
  });
});

describe('getBadgeProgress', () => {
  it('returns 0 for first-steps with 0 sessions', () => {
    const profile = makeProfile();
    expect(getBadgeProgress(profile, 'first-steps')).toBe(0);
  });

  it('returns 100 for first-steps with 1+ sessions', () => {
    const profile = makeProfile({ stats: makeStats({ totalSessions: 1 }) });
    expect(getBadgeProgress(profile, 'first-steps')).toBe(100);
  });

  it('returns correct progress for math-wizard', () => {
    const profile = makeProfile({ stats: makeStats({ totalProblems: 50 }) });
    expect(getBadgeProgress(profile, 'math-wizard')).toBe(50);
  });

  it('caps math-wizard progress at 100', () => {
    const profile = makeProfile({ stats: makeStats({ totalProblems: 200 }) });
    expect(getBadgeProgress(profile, 'math-wizard')).toBe(100);
  });

  it('returns 50 for persistent with 5/10 sessions', () => {
    const profile = makeProfile({ stats: makeStats({ totalSessions: 5 }) });
    expect(getBadgeProgress(profile, 'persistent')).toBe(50);
  });
});
