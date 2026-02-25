/**
 * Enhanced Profile Context with complete stats tracking
 * Supports both Worksheet and Hangman games with badges
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ProfileStats, Badge, BadgeId, WorksheetSession, HangmanSession } from '../types';
import { getBadgeById, initializeBadges } from '../utils/badges';
import type { DailyChallenge } from '../utils/rewards';

export interface WorksheetMastery {
  '+': { practiced: number; mastered: boolean; accuracy: number; bestTime: number };
  '-': { practiced: number; mastered: boolean; accuracy: number; bestTime: number };
  '×': { practiced: number; mastered: boolean; accuracy: number; bestTime: number };
  '÷': { practiced: number; mastered: boolean; accuracy: number; bestTime: number };
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
  lastActive: number;
  stats: ProfileStats;
  worksheetHistory: WorksheetSession[];
  hangmanHistory: HangmanSession[];
  currentWorksheetSession: WorksheetSession | null;
  currentHangmanSession: HangmanSession | null;
  badges: Badge[];
  multiplicationProgress?: Record<string, unknown>; // Track multiplication table mastery
  worksheetMastery?: WorksheetMastery; // Track mastery per operation
  coins?: number; // Reward coins
  stars?: number; // Star rating
  dailyChallenges?: DailyChallenge[]; // Daily challenge progress
  unlockedItems?: string[]; // Purchased items
}

interface ProfileContextType {
  profiles: Profile[];
  addProfile: (name: string, avatar: string) => Profile;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  getProfile: (id: string) => Profile | undefined;
  updateStats: (id: string, stats: Partial<ProfileStats>) => void;
  saveWorksheetSession: (id: string, session: WorksheetSession) => void;
  saveHangmanSession: (id: string, session: HangmanSession) => void;
  awardBadge: (id: string, badgeId: string) => void;
  updateLastActive: (id: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const STORAGE_KEY = 'mathplay_profiles';

// Initialize empty stats
function createEmptyStats(): ProfileStats {
  return {
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
    hangmanTimeSpent: 0,
  };
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  // Load profiles from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        // Validate that parsed data is an array of profile-shaped objects
        if (Array.isArray(parsed) && parsed.every(
          (p) => p && typeof p === 'object' && typeof (p as Record<string, unknown>).id === 'string'
        )) {
          setProfiles(parsed as Profile[]);
        } else {
          console.warn('Invalid profiles data format, clearing storage');
          localStorage.removeItem(STORAGE_KEY);
          setProfiles([]);
        }
      } catch (error) {
        console.error('Failed to parse profiles:', error);
        localStorage.removeItem(STORAGE_KEY);
        setProfiles([]);
      }
    }
  }, []);

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  const addProfile = (name: string, avatar: string): Profile => {
    const newProfile: Profile = {
      id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      avatar,
      createdAt: Date.now(),
      lastActive: Date.now(),
      stats: createEmptyStats(),
      worksheetHistory: [],
      hangmanHistory: [],
      currentWorksheetSession: null,
      currentHangmanSession: null,
      badges: initializeBadges(),
      worksheetMastery: {
        '+': { practiced: 0, mastered: false, accuracy: 0, bestTime: Number.MAX_SAFE_INTEGER },
        '-': { practiced: 0, mastered: false, accuracy: 0, bestTime: Number.MAX_SAFE_INTEGER },
        '×': { practiced: 0, mastered: false, accuracy: 0, bestTime: Number.MAX_SAFE_INTEGER },
        '÷': { practiced: 0, mastered: false, accuracy: 0, bestTime: Number.MAX_SAFE_INTEGER }
      },
      coins: 0,
      stars: 0,
      dailyChallenges: [],
      unlockedItems: []
    };
    setProfiles((prev) => [...prev, newProfile]);
    return newProfile;
  };

  const updateProfile = (id: string, updates: Partial<Profile>) => {
    setProfiles((prev) =>
      prev.map((profile) =>
        profile.id === id ? { ...profile, ...updates } : profile
      )
    );
  };

  const deleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((profile) => profile.id !== id));
  };

  const getProfile = (id: string) => {
    return profiles.find((profile) => profile.id === id);
  };

  const updateStats = (id: string, statsUpdate: Partial<ProfileStats>) => {
    setProfiles((prev) =>
      prev.map((profile) =>
        profile.id === id
          ? {
              ...profile,
              stats: {
                ...profile.stats,
                ...statsUpdate,
              },
            }
          : profile
      )
    );
  };

  const saveWorksheetSession = (id: string, session: WorksheetSession) => {
    setProfiles((prev) =>
      prev.map((profile) => {
        if (profile.id !== id) return profile;

        const updatedHistory = [...profile.worksheetHistory, session];

        // Update worksheet stats
        const newStats = { ...profile.stats };
        newStats.totalSessions++;
        newStats.totalProblems += session.problems.length;
        newStats.totalCorrect += session.correctCount;
        newStats.totalWrong += session.wrongCount;
        newStats.timeSpent += session.timeSpent;

        if (session.currentStreak && session.currentStreak > newStats.bestStreak) {
          newStats.bestStreak = session.currentStreak;
        }

        // Calculate average percentage
        const totalAttempted = newStats.totalCorrect + newStats.totalWrong;
        newStats.averagePercentage = totalAttempted > 0
          ? Math.round((newStats.totalCorrect / totalAttempted) * 100)
          : 0;

        return {
          ...profile,
          worksheetHistory: updatedHistory,
          currentWorksheetSession: null,
          stats: newStats,
          lastActive: Date.now(),
        };
      })
    );
  };

  const saveHangmanSession = (id: string, session: HangmanSession) => {
    setProfiles((prev) =>
      prev.map((profile) => {
        if (profile.id !== id) return profile;

        const updatedHistory = [...profile.hangmanHistory, session];

        // Update hangman stats
        const newStats = { ...profile.stats };
        newStats.hangmanSessions++;
        newStats.hangmanProblems += session.problems.length;

        // Count correct/wrong from answers
        const correct = session.answers.filter((ans, idx) => ans === session.problems[idx]?.correct).length;
        const wrong = session.answers.filter((ans, idx) => ans !== null && ans !== session.problems[idx]?.correct).length;

        newStats.hangmanCorrect += correct;
        newStats.hangmanWrong += wrong;
        newStats.hangmanTimeSpent += session.timeSpent;

        if (session.maxStreak > newStats.hangmanBestStreak) {
          newStats.hangmanBestStreak = session.maxStreak;
        }

        if (session.score > newStats.hangmanHighScore) {
          newStats.hangmanHighScore = session.score;
        }

        return {
          ...profile,
          hangmanHistory: updatedHistory,
          currentHangmanSession: null,
          stats: newStats,
          lastActive: Date.now(),
        };
      })
    );
  };

  const awardBadge = (id: string, badgeId: string) => {
    setProfiles((prev) =>
      prev.map((profile) => {
        if (profile.id !== id) return profile;

        // Check if badge already earned
        const alreadyEarned = profile.badges.some(b => b.id === badgeId);
        if (alreadyEarned) return profile;

        // Look up badge definition; fall back to minimal badge if unknown
        const definition = getBadgeById(badgeId as BadgeId);
        const newBadge: Badge = definition
          ? { ...definition, earned: true, earnedAt: new Date().toISOString() }
          : {
              id: badgeId as BadgeId,
              name: badgeId,
              description: '',
              icon: '🏆',
              earned: true,
              earnedAt: new Date().toISOString(),
            };

        return {
          ...profile,
          badges: [...profile.badges, newBadge],
        };
      })
    );
  };

  const updateLastActive = (id: string) => {
    setProfiles((prev) =>
      prev.map((profile) =>
        profile.id === id ? { ...profile, lastActive: Date.now() } : profile
      )
    );
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        addProfile,
        updateProfile,
        deleteProfile,
        getProfile,
        updateStats,
        saveWorksheetSession,
        saveHangmanSession,
        awardBadge,
        updateLastActive,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfiles() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfiles must be used within ProfileProvider');
  }
  return context;
}
