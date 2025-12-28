/**
 * Badge definitions and criteria checking system
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import type { Badge, BadgeId, WorksheetSession, HangmanSession, Problem } from '../types';
import type { Profile } from '../context/ProfileContext';

/**
 * Initialize all available badges (unearned)
 */
export function initializeBadges(): Badge[] {
  return [
    // Worksheet badges
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first practice session',
      icon: '🎯',
      earned: false
    },
    {
      id: 'perfect-score',
      name: 'Perfect Score',
      description: 'Get 100% on a session',
      icon: '🌟',
      earned: false
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Complete 10 problems in under 2 minutes',
      icon: '⚡',
      earned: false
    },
    {
      id: 'marathon',
      name: 'Marathon',
      description: 'Complete 20+ problems in one session',
      icon: '🏃',
      earned: false
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Get 10 correct answers in a row',
      icon: '🔥',
      earned: false
    },
    {
      id: 'division-expert',
      name: 'Division Expert',
      description: 'Solve 50 division problems',
      icon: '➗',
      earned: false
    },
    {
      id: 'math-wizard',
      name: 'Math Wizard',
      description: 'Solve 100 total problems',
      icon: '🧙',
      earned: false
    },
    {
      id: 'persistent',
      name: 'Persistent Learner',
      description: 'Complete 10 practice sessions',
      icon: '💪',
      earned: false
    },
    {
      id: 'time-master',
      name: 'Time Master',
      description: 'Complete a timed challenge',
      icon: '⏱️',
      earned: false
    },
    {
      id: 'accuracy-master',
      name: 'Accuracy Master',
      description: 'Maintain 90%+ accuracy over 5 sessions',
      icon: '🎖️',
      earned: false
    },
    // Hangman badges
    {
      id: 'hangman-survivor',
      name: 'Hangman Survivor',
      description: 'Complete a Hangman game without losing all lives',
      icon: '💚',
      earned: false
    },
    {
      id: 'hangman-perfect',
      name: 'Hangman Perfect',
      description: 'Complete Hangman without losing a single life',
      icon: '👑',
      earned: false
    },
    {
      id: 'hangman-speedster',
      name: 'Quick Thinker',
      description: 'Score 100+ points in a Hangman game',
      icon: '⚡',
      earned: false
    },
    {
      id: 'hangman-champion',
      name: 'Hangman Champion',
      description: 'Complete 10 Hangman games',
      icon: '🏆',
      earned: false
    }
  ];
}

/**
 * Check and award badges based on profile stats and latest session
 */
export function checkAndAwardBadges(profile: Profile): BadgeId[] {
  if (!profile.badges || profile.badges.length === 0) {
    profile.badges = initializeBadges();
  }

  const newlyEarned: BadgeId[] = [];
  const latestWorksheetSession = profile.worksheetHistory[profile.worksheetHistory.length - 1];
  const latestHangmanSession = profile.hangmanHistory[profile.hangmanHistory.length - 1];

  profile.badges.forEach(badge => {
    if (badge.earned) return; // Already earned

    let shouldEarn = false;

    switch (badge.id) {
      // Worksheet badges
      case 'first-steps':
        shouldEarn = profile.stats.totalSessions >= 1;
        break;

      case 'perfect-score':
        shouldEarn = latestWorksheetSession?.percentage === 100;
        break;

      case 'speed-demon':
        shouldEarn = latestWorksheetSession &&
                     latestWorksheetSession.problems.length >= 10 &&
                     latestWorksheetSession.timeSpent <= 120;
        break;

      case 'marathon':
        shouldEarn = latestWorksheetSession && latestWorksheetSession.problems.length >= 20;
        break;

      case 'streak-master':
        shouldEarn = profile.stats.bestStreak >= 10;
        break;

      case 'division-expert':
        const divisionProblems = profile.worksheetHistory.reduce((count, session) => {
          return count + session.problems.filter((p: Problem) => p.operation === '÷').length;
        }, 0);
        shouldEarn = divisionProblems >= 50;
        break;

      case 'math-wizard':
        shouldEarn = profile.stats.totalProblems >= 100;
        break;

      case 'persistent':
        shouldEarn = profile.stats.totalSessions >= 10;
        break;

      case 'time-master':
        shouldEarn = profile.worksheetHistory.some(s => s.settings.timedMode === true);
        break;

      case 'accuracy-master':
        const recentSessions = profile.worksheetHistory.slice(-5);
        if (recentSessions.length >= 5) {
          const avgAccuracy = recentSessions.reduce((sum, s) => sum + s.percentage, 0) / 5;
          shouldEarn = avgAccuracy >= 90;
        }
        break;

      // Hangman badges
      case 'hangman-survivor':
        shouldEarn = latestHangmanSession &&
                     latestHangmanSession.completed &&
                     latestHangmanSession.livesUsed < latestHangmanSession.totalLives;
        break;

      case 'hangman-perfect':
        shouldEarn = latestHangmanSession &&
                     latestHangmanSession.completed &&
                     latestHangmanSession.livesUsed === 0;
        break;

      case 'hangman-speedster':
        shouldEarn = latestHangmanSession && latestHangmanSession.score >= 100;
        break;

      case 'hangman-champion':
        shouldEarn = profile.stats.hangmanSessions >= 10;
        break;
    }

    if (shouldEarn) {
      badge.earned = true;
      badge.earnedAt = new Date().toISOString();
      newlyEarned.push(badge.id);
    }
  });

  return newlyEarned;
}

/**
 * Get all earned badges for a profile
 */
export function getEarnedBadges(profile: Profile): Badge[] {
  if (!profile.badges) return [];
  return profile.badges.filter(b => b.earned);
}

/**
 * Get badge progress percentage for a specific badge
 */
export function getBadgeProgress(profile: Profile, badgeId: BadgeId): number {
  const latestWorksheetSession = profile.worksheetHistory[profile.worksheetHistory.length - 1];

  switch (badgeId) {
    case 'first-steps':
      return Math.min(100, (profile.stats.totalSessions / 1) * 100);

    case 'perfect-score':
      return latestWorksheetSession?.percentage || 0;

    case 'speed-demon':
      if (!latestWorksheetSession || latestWorksheetSession.problems.length < 10) return 0;
      return Math.min(100, (120 / latestWorksheetSession.timeSpent) * 100);

    case 'marathon':
      return Math.min(100, (latestWorksheetSession?.problems.length || 0) / 20 * 100);

    case 'streak-master':
      return Math.min(100, (profile.stats.bestStreak / 10) * 100);

    case 'division-expert':
      const divisionProblems = profile.worksheetHistory.reduce((count, session) => {
        return count + session.problems.filter(p => p.operation === '÷').length;
      }, 0);
      return Math.min(100, (divisionProblems / 50) * 100);

    case 'math-wizard':
      return Math.min(100, (profile.stats.totalProblems / 100) * 100);

    case 'persistent':
      return Math.min(100, (profile.stats.totalSessions / 10) * 100);

    case 'time-master':
      return profile.worksheetHistory.some(s => s.settings.timedMode) ? 100 : 0;

    case 'accuracy-master':
      const recentSessions = profile.worksheetHistory.slice(-5);
      if (recentSessions.length < 5) return (recentSessions.length / 5) * 100;
      const avgAccuracy = recentSessions.reduce((sum, s) => sum + s.percentage, 0) / 5;
      return Math.min(100, (avgAccuracy / 90) * 100);

    // Hangman badges
    case 'hangman-survivor':
    case 'hangman-perfect':
    case 'hangman-speedster':
      return profile.badges?.find(b => b.id === badgeId)?.earned ? 100 : 0;

    case 'hangman-champion':
      return Math.min(100, (profile.stats.hangmanSessions / 10) * 100);

    default:
      return 0;
  }
}

/**
 * Get badge by ID
 */
export function getBadgeById(badgeId: BadgeId): Badge | null {
  const allBadges = initializeBadges();
  return allBadges.find(b => b.id === badgeId) || null;
}

/**
 * Get all badges (for display purposes)
 */
export function getAllBadges(): Badge[] {
  return initializeBadges();
}
