/**
 * Data Migration Utility
 * Migrates user data from vanilla TypeScript app to React app
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import type { ProfileStats, WorksheetSession, HangmanSession, Badge } from '../types';
import type { Profile } from '../context/ProfileContext';

// Old vanilla app data structures
interface OldProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
  lastActive: number;
  stats: {
    totalGamesPlayed: number;
    totalScore: number;
    highestScore: number;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    bestStreak: number;
    totalTimeSpent: number;
  };
  history?: any[];
  badges?: any[];
}

/**
 * Migrate old profile data to new format
 */
export function migrateProfile(oldProfile: OldProfile): Profile {
  // Create new stats structure
  const newStats: ProfileStats = {
    // Worksheet stats (initialize from old data)
    totalSessions: oldProfile.stats.totalGamesPlayed || 0,
    totalProblems: oldProfile.stats.totalQuestions || 0,
    totalCorrect: oldProfile.stats.correctAnswers || 0,
    totalWrong: oldProfile.stats.wrongAnswers || 0,
    bestStreak: oldProfile.stats.bestStreak || 0,
    averagePercentage: oldProfile.stats.totalQuestions > 0
      ? Math.round((oldProfile.stats.correctAnswers / oldProfile.stats.totalQuestions) * 100)
      : 0,
    timeSpent: oldProfile.stats.totalTimeSpent || 0,

    // Hangman stats (initialize to 0)
    hangmanSessions: 0,
    hangmanProblems: 0,
    hangmanCorrect: 0,
    hangmanWrong: 0,
    hangmanBestStreak: 0,
    hangmanHighScore: oldProfile.stats.highestScore || 0,
    hangmanTimeSpent: 0,
  };

  // Migrate badges if they exist
  const badges: Badge[] = oldProfile.badges
    ? oldProfile.badges.map((oldBadge: any) => ({
        id: oldBadge.id,
        name: oldBadge.name,
        description: oldBadge.description,
        icon: oldBadge.icon,
        earned: oldBadge.earned,
        earnedAt: oldBadge.earnedAt,
      }))
    : [];

  // Create migrated profile
  const newProfile: Profile = {
    id: oldProfile.id,
    name: oldProfile.name,
    avatar: oldProfile.avatar,
    createdAt: oldProfile.createdAt,
    lastActive: oldProfile.lastActive || Date.now(),
    stats: newStats,
    worksheetHistory: [], // Old history will need manual migration
    hangmanHistory: [],
    currentWorksheetSession: null,
    currentHangmanSession: null,
    badges,
  };

  return newProfile;
}

/**
 * Migrate all profiles from localStorage
 */
export function migrateAllProfiles(): Profile[] {
  try {
    // Try to load old profiles from vanilla app
    const oldProfilesJson = localStorage.getItem('mathplay_profiles');
    if (!oldProfilesJson) {
      console.log('No old profiles found to migrate');
      return [];
    }

    const oldProfiles: OldProfile[] = JSON.parse(oldProfilesJson);
    const migratedProfiles = oldProfiles.map(migrateProfile);

    console.log(`Successfully migrated ${migratedProfiles.length} profiles`);
    return migratedProfiles;
  } catch (error) {
    console.error('Error migrating profiles:', error);
    return [];
  }
}

/**
 * Save migrated profiles to new localStorage key
 */
export function saveMigratedProfiles(profiles: Profile[]): void {
  try {
    localStorage.setItem('mathplay_react_profiles', JSON.stringify(profiles));
    console.log('Migrated profiles saved successfully');
  } catch (error) {
    console.error('Error saving migrated profiles:', error);
  }
}

/**
 * Check if migration is needed
 */
export function needsMigration(): boolean {
  const oldProfiles = localStorage.getItem('mathplay_profiles');
  const newProfiles = localStorage.getItem('mathplay_react_profiles');

  // Migration needed if old profiles exist and new profiles don't
  return !!oldProfiles && !newProfiles;
}

/**
 * Perform full migration
 */
export function performMigration(): { success: boolean; profileCount: number; error?: string } {
  try {
    if (!needsMigration()) {
      return {
        success: false,
        profileCount: 0,
        error: 'Migration not needed or already completed',
      };
    }

    const migratedProfiles = migrateAllProfiles();

    if (migratedProfiles.length === 0) {
      return {
        success: false,
        profileCount: 0,
        error: 'No profiles found to migrate',
      };
    }

    saveMigratedProfiles(migratedProfiles);

    return {
      success: true,
      profileCount: migratedProfiles.length,
    };
  } catch (error) {
    return {
      success: false,
      profileCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Backup old data before migration
 */
export function backupOldData(): boolean {
  try {
    const oldProfiles = localStorage.getItem('mathplay_profiles');
    if (oldProfiles) {
      localStorage.setItem('mathplay_profiles_backup', oldProfiles);
      console.log('Old data backed up successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error backing up old data:', error);
    return false;
  }
}

/**
 * Restore from backup
 */
export function restoreFromBackup(): boolean {
  try {
    const backup = localStorage.getItem('mathplay_profiles_backup');
    if (backup) {
      localStorage.setItem('mathplay_profiles', backup);
      console.log('Old data restored from backup');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error restoring from backup:', error);
    return false;
  }
}

/**
 * Export data as JSON for manual migration or backup
 */
export function exportData(): string | null {
  try {
    const profiles = localStorage.getItem('mathplay_react_profiles') ||
                    localStorage.getItem('mathplay_profiles');

    if (!profiles) {
      return null;
    }

    return profiles;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
}

/**
 * Import data from JSON string
 */
export function importData(jsonString: string): boolean {
  try {
    const profiles = JSON.parse(jsonString);
    localStorage.setItem('mathplay_react_profiles', JSON.stringify(profiles));
    console.log('Data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}
