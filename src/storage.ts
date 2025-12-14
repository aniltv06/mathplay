/**
 * Storage utility for managing user profiles and progress with localStorage
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import type { UserProfile, ProfilesData, Session, ProblemSettings, Problem } from './types';

const STORAGE_KEY = 'mathplay_profiles';

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
 * Create a new user profile
 */
export function createProfile(name: string): UserProfile {
  const data = getAllProfiles();

  const newProfile: UserProfile = {
    name,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    stats: {
      totalSessions: 0,
      totalProblems: 0,
      totalCorrect: 0,
      totalWrong: 0,
      bestStreak: 0,
      averagePercentage: 0,
      timeSpent: 0
    },
    history: [],
    currentSession: null
  };

  data.profiles[name] = newProfile;
  data.lastActiveProfile = name;
  saveAllProfiles(data);

  return newProfile;
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
  percentage: number
): void {
  const data = getAllProfiles();
  const profile = data.profiles[name];

  if (profile && profile.currentSession) {
    profile.currentSession.answers = answers;
    profile.currentSession.correctCount = correctCount;
    profile.currentSession.wrongCount = wrongCount;
    profile.currentSession.percentage = percentage;
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
