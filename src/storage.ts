/**
 * Storage utility for managing user profiles and progress with localStorage
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import type { UserProfile, ProfilesData, Session, ProblemSettings, Problem, Badge, BadgeId, HangmanSession, HangmanSettings } from './types';
import { compress, decompress } from 'lz-string';

const STORAGE_KEY = 'mathplay_profiles';

/**
 * Initialize all available badges (unearned)
 */
function initializeBadges(): Badge[] {
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
 * Get all profiles from localStorage
 */
export function getAllProfiles(): ProfilesData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { profiles: {}, lastActiveProfile: null };
    }
    return JSON.parse(data) as ProfilesData;
  } catch (error) {
    console.error('Error reading profiles:', error);
    return { profiles: {}, lastActiveProfile: null };
  }
}

/**
 * Save all profiles to localStorage
 */
export function saveAllProfiles(data: ProfilesData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving profiles:', error);
  }
}

/**
 * Get a specific profile by name
 */
export function getProfile(name: string): UserProfile | null {
  const data = getAllProfiles();
  return data.profiles[name] || null;
}

/**
 * Default avatar options for profiles
 */
const DEFAULT_AVATARS = ['😊', '🚀', '🌟', '🐶', '🐱', '🦁', '🐼', '🦊', '🐸', '🦄', '🐙', '🦉', '🐢', '🦋', '🌈', '⚡'];

/**
 * Get a random avatar
 */
function getRandomAvatar(): string {
  return DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
}

/**
 * Create a new user profile
 */
export function createProfile(name: string, avatar?: string): UserProfile {
  const data = getAllProfiles();

  const newProfile: UserProfile = {
    name,
    avatar: avatar || getRandomAvatar(),
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    stats: {
      // Worksheet stats
      totalSessions: 0,
      totalProblems: 0,
      totalCorrect: 0,
      totalWrong: 0,
      bestStreak: 0,
      averagePercentage: 0,
      timeSpent: 0,
      // Hangman stats
      hangmanSessions: 0,
      hangmanProblems: 0,
      hangmanCorrect: 0,
      hangmanWrong: 0,
      hangmanBestStreak: 0,
      hangmanHighScore: 0,
      hangmanTimeSpent: 0
    },
    history: [],
    hangmanHistory: [],
    currentSession: null,
    currentHangmanSession: null,
    badges: initializeBadges()
  };

  data.profiles[name] = newProfile;
  data.lastActiveProfile = name;
  saveAllProfiles(data);

  return newProfile;
}

/**
 * Update profile information (name or avatar)
 */
export function updateProfile(oldName: string, newName?: string, newAvatar?: string): UserProfile | null {
  const data = getAllProfiles();
  const profile = data.profiles[oldName];

  if (!profile) {
    return null;
  }

  // Update avatar if provided
  if (newAvatar) {
    profile.avatar = newAvatar;
  }

  // Update name if provided and different
  if (newName && newName !== oldName) {
    // Check if new name already exists
    if (data.profiles[newName]) {
      throw new Error(`Profile "${newName}" already exists`);
    }

    // Update name and move to new key
    profile.name = newName;
    data.profiles[newName] = profile;
    delete data.profiles[oldName];

    // Update lastActiveProfile if this was the active one
    if (data.lastActiveProfile === oldName) {
      data.lastActiveProfile = newName;
    }
  }

  saveAllProfiles(data);
  return profile;
}

/**
 * Get all available avatar options
 */
export function getAvatarOptions(): string[] {
  return DEFAULT_AVATARS;
}

/**
 * Update profile's last active timestamp
 */
export function updateLastActive(name: string): void {
  const data = getAllProfiles();
  if (data.profiles[name]) {
    data.profiles[name].lastActive = new Date().toISOString();
    data.lastActiveProfile = name;
    saveAllProfiles(data);
  }
}

/**
 * Create a new session for a profile
 */
export function createSession(
  name: string,
  settings: ProblemSettings,
  problems: Problem[]
): Session {
  const session: Session = {
    date: new Date().toISOString(),
    settings,
    problems,
    answers: new Array(problems.length).fill(null),
    timeSpent: 0,
    completed: false,
    correctCount: 0,
    wrongCount: 0,
    percentage: 0
  };

  const data = getAllProfiles();
  if (data.profiles[name]) {
    data.profiles[name].currentSession = session;
    updateLastActive(name);
    saveAllProfiles(data);
  }

  return session;
}

/**
 * Save current session progress (answers)
 */
export function saveSessionProgress(
  name: string,
  answers: (number | null)[],
  correctCount: number,
  wrongCount: number,
  percentage: number,
  currentStreak?: number
): void {
  const data = getAllProfiles();
  const profile = data.profiles[name];

  if (profile && profile.currentSession) {
    profile.currentSession.answers = answers;
    profile.currentSession.correctCount = correctCount;
    profile.currentSession.wrongCount = wrongCount;
    profile.currentSession.percentage = percentage;
    profile.currentSession.currentStreak = currentStreak;
    updateLastActive(name);
    saveAllProfiles(data);
  }
}

/**
 * Complete current session and save to history
 */
export function completeSession(
  name: string,
  timeSpent: number
): void {
  const data = getAllProfiles();
  const profile = data.profiles[name];

  if (profile && profile.currentSession) {
    const session = profile.currentSession;
    session.completed = true;
    session.timeSpent = timeSpent;

    // Add to history
    profile.history.push(session);

    // Update stats
    profile.stats.totalSessions++;
    profile.stats.totalProblems += session.problems.length;
    profile.stats.totalCorrect += session.correctCount;
    profile.stats.totalWrong += session.wrongCount;
    profile.stats.timeSpent += timeSpent;

    // Calculate average percentage
    const totalAnswered = profile.stats.totalCorrect + profile.stats.totalWrong;
    if (totalAnswered > 0) {
      profile.stats.averagePercentage = Math.round(
        (profile.stats.totalCorrect / totalAnswered) * 100
      );
    }

    // Clear current session
    profile.currentSession = null;

    updateLastActive(name);
    saveAllProfiles(data);
  }
}

/**
 * Update best streak if current streak is higher
 */
export function updateBestStreak(name: string, streak: number): void {
  const data = getAllProfiles();
  const profile = data.profiles[name];

  if (profile && streak > profile.stats.bestStreak) {
    profile.stats.bestStreak = streak;
    saveAllProfiles(data);
  }
}

/**
 * Create a new Hangman session
 */
export function createHangmanSession(
  name: string,
  difficulty: string,
  settings: HangmanSettings,
  problems: Problem[]
): void {
  const data = getAllProfiles();
  const profile = data.profiles[name];

  if (profile) {
    const session: HangmanSession = {
      date: new Date().toISOString(),
      difficulty: difficulty as any,
      settings,
      problems,
      answers: new Array(problems.length).fill(null),
      score: 0,
      livesUsed: 0,
      totalLives: settings.livesCount,
      maxStreak: 0,
      timeSpent: 0,
      completed: false
    };

    profile.currentHangmanSession = session;
    updateLastActive(name);
    saveAllProfiles(data);
  }
}

/**
 * Save Hangman session progress
 */
export function saveHangmanProgress(
  name: string,
  score: number,
  livesUsed: number,
  maxStreak: number
): void {
  const data = getAllProfiles();
  const profile = data.profiles[name];

  if (profile && profile.currentHangmanSession) {
    profile.currentHangmanSession.score = score;
    profile.currentHangmanSession.livesUsed = livesUsed;
    profile.currentHangmanSession.maxStreak = maxStreak;
    updateLastActive(name);
    saveAllProfiles(data);
  }
}

/**
 * Complete current Hangman session and save to history
 */
export function completeHangmanSession(
  name: string,
  timeSpent: number
): void {
  const data = getAllProfiles();
  const profile = data.profiles[name];

  if (profile && profile.currentHangmanSession) {
    const session = profile.currentHangmanSession;
    session.completed = true;
    session.timeSpent = timeSpent;

    // Add to history
    profile.hangmanHistory.push(session);

    // Update stats
    profile.stats.hangmanSessions++;
    profile.stats.hangmanProblems += session.problems.length;

    // Count correct/wrong from answers
    let correct = 0;
    let wrong = 0;
    session.problems.forEach((problem, index) => {
      const answer = session.answers[index];
      if (answer !== null) {
        if (answer === problem.correct) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    profile.stats.hangmanCorrect += correct;
    profile.stats.hangmanWrong += wrong;
    profile.stats.hangmanTimeSpent += timeSpent;

    // Update best streak
    if (session.maxStreak > profile.stats.hangmanBestStreak) {
      profile.stats.hangmanBestStreak = session.maxStreak;
    }

    // Update high score
    if (session.score > profile.stats.hangmanHighScore) {
      profile.stats.hangmanHighScore = session.score;
    }

    // Clear current session
    profile.currentHangmanSession = null;

    updateLastActive(name);
    saveAllProfiles(data);
  }
}

/**
 * Delete a profile
 */
export function deleteProfile(name: string): void {
  const data = getAllProfiles();
  delete data.profiles[name];

  if (data.lastActiveProfile === name) {
    data.lastActiveProfile = null;
  }

  saveAllProfiles(data);
}

/**
 * Get last active profile
 */
export function getLastActiveProfile(): UserProfile | null {
  const data = getAllProfiles();
  if (data.lastActiveProfile) {
    return data.profiles[data.lastActiveProfile] || null;
  }
  return null;
}

/**
 * Check if profile exists
 */
export function profileExists(name: string): boolean {
  const data = getAllProfiles();
  return !!data.profiles[name];
}

/**
 * Get profile names list
 */
export function getProfileNames(): string[] {
  const data = getAllProfiles();
  return Object.keys(data.profiles);
}

/**
 * Clear all data (for testing/reset)
 */
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check and award badges based on profile stats and latest session
 */
export function checkAndAwardBadges(name: string): Badge[] {
  const data = getAllProfiles();
  const profile = data.profiles[name];

  if (!profile) return [];

  // Ensure badges array exists (migration for old profiles)
  if (!profile.badges) {
    profile.badges = initializeBadges();
  }

  const newlyEarned: Badge[] = [];
  const latestSession = profile.history[profile.history.length - 1];

  // Check each badge criteria
  profile.badges.forEach(badge => {
    if (badge.earned) return; // Already earned

    let shouldEarn = false;

    switch (badge.id) {
      case 'first-steps':
        shouldEarn = profile.stats.totalSessions >= 1;
        break;

      case 'perfect-score':
        shouldEarn = latestSession?.percentage === 100;
        break;

      case 'speed-demon':
        shouldEarn = latestSession &&
                     latestSession.problems.length >= 10 &&
                     latestSession.timeSpent <= 120;
        break;

      case 'marathon':
        shouldEarn = latestSession && latestSession.problems.length >= 20;
        break;

      case 'streak-master':
        shouldEarn = profile.stats.bestStreak >= 10;
        break;

      case 'division-expert':
        const divisionProblems = profile.history.reduce((count, session) => {
          return count + session.problems.filter(p => p.operation === '÷').length;
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
        shouldEarn = latestSession?.settings.timedMode === true;
        break;

      case 'accuracy-master':
        // Check last 5 sessions for 90%+ average
        const recentSessions = profile.history.slice(-5);
        if (recentSessions.length >= 5) {
          const avgAccuracy = recentSessions.reduce((sum, s) => sum + s.percentage, 0) / 5;
          shouldEarn = avgAccuracy >= 90;
        }
        break;

      // Hangman badges
      case 'hangman-survivor':
        const latestHangman = profile.hangmanHistory[profile.hangmanHistory.length - 1];
        shouldEarn = latestHangman && latestHangman.completed && latestHangman.livesUsed < latestHangman.totalLives;
        break;

      case 'hangman-perfect':
        const latestHangmanPerfect = profile.hangmanHistory[profile.hangmanHistory.length - 1];
        shouldEarn = latestHangmanPerfect && latestHangmanPerfect.completed && latestHangmanPerfect.livesUsed === 0;
        break;

      case 'hangman-speedster':
        const latestHangmanSpeed = profile.hangmanHistory[profile.hangmanHistory.length - 1];
        shouldEarn = latestHangmanSpeed && latestHangmanSpeed.score >= 100;
        break;

      case 'hangman-champion':
        shouldEarn = profile.stats.hangmanSessions >= 10;
        break;
    }

    if (shouldEarn) {
      badge.earned = true;
      badge.earnedAt = new Date().toISOString();
      newlyEarned.push(badge);
    }
  });

  if (newlyEarned.length > 0) {
    saveAllProfiles(data);
  }

  return newlyEarned;
}

/**
 * Get all earned badges for a profile
 */
export function getEarnedBadges(name: string): Badge[] {
  const profile = getProfile(name);
  if (!profile || !profile.badges) return [];
  return profile.badges.filter(b => b.earned);
}

/**
 * Get badge progress percentage for a specific badge
 */
export function getBadgeProgress(name: string, badgeId: BadgeId): number {
  const profile = getProfile(name);
  if (!profile) return 0;

  const latestSession = profile.history[profile.history.length - 1];

  switch (badgeId) {
    case 'first-steps':
      return Math.min(100, (profile.stats.totalSessions / 1) * 100);

    case 'perfect-score':
      return latestSession?.percentage || 0;

    case 'speed-demon':
      if (!latestSession || latestSession.problems.length < 10) return 0;
      return Math.min(100, (120 / latestSession.timeSpent) * 100);

    case 'marathon':
      return Math.min(100, (latestSession?.problems.length || 0) / 20 * 100);

    case 'streak-master':
      return Math.min(100, (profile.stats.bestStreak / 10) * 100);

    case 'division-expert':
      const divisionProblems = profile.history.reduce((count, session) => {
        return count + session.problems.filter(p => p.operation === '÷').length;
      }, 0);
      return Math.min(100, (divisionProblems / 50) * 100);

    case 'math-wizard':
      return Math.min(100, (profile.stats.totalProblems / 100) * 100);

    case 'persistent':
      return Math.min(100, (profile.stats.totalSessions / 10) * 100);

    case 'time-master':
      return profile.history.some(s => s.settings.timedMode) ? 100 : 0;

    case 'accuracy-master':
      const recentSessions = profile.history.slice(-5);
      if (recentSessions.length < 5) return (recentSessions.length / 5) * 100;
      const avgAccuracy = recentSessions.reduce((sum, s) => sum + s.percentage, 0) / 5;
      return Math.min(100, (avgAccuracy / 90) * 100);

    default:
      return 0;
  }
}

/**
 * Export all profiles as a compressed share code
 */
export function exportProfiles(): string {
  const data = getAllProfiles();
  const jsonString = JSON.stringify(data);
  const compressed = compress(jsonString);
  return compressed;
}

/**
 * Import profiles from a share code
 * Merges imported profiles with existing ones
 * Returns array of imported profile names
 */
export function importProfiles(shareCode: string): string[] {
  try {
    const decompressed = decompress(shareCode);
    if (!decompressed) {
      throw new Error('Invalid share code - decompression failed');
    }

    const importedData = JSON.parse(decompressed) as ProfilesData;
    if (!importedData.profiles) {
      throw new Error('Invalid share code - no profiles found');
    }

    const currentData = getAllProfiles();
    const importedNames: string[] = [];

    // Merge profiles - handle name conflicts
    Object.entries(importedData.profiles).forEach(([name, profile]) => {
      let finalName = name;
      let counter = 1;

      // If profile name exists, append number
      while (currentData.profiles[finalName]) {
        finalName = `${name} (${counter})`;
        counter++;
      }

      // Update profile name if it was changed
      if (finalName !== name) {
        profile.name = finalName;
      }

      // Ensure badges exist (migration)
      if (!profile.badges) {
        profile.badges = initializeBadges();
      }

      currentData.profiles[finalName] = profile;
      importedNames.push(finalName);
    });

    saveAllProfiles(currentData);
    return importedNames;
  } catch (error) {
    console.error('Error importing profiles:', error);
    throw new Error('Failed to import profiles. Please check the share code and try again.');
  }
}
