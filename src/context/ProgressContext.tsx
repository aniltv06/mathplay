/**
 * Progress Tracking Context
 * Tracks user progress across all learning activities
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ActivityProgress {
  activityId: string;
  lastAccessed: number; // timestamp
  timeSpent: number; // seconds
  sessionsCount: number;
  completionPercentage: number;
  bestScore: number;
  totalProblems: number;
  correctProblems: number;
}

export interface ProgressData {
  [profileId: string]: {
    activities: {
      [activityId: string]: ActivityProgress;
    };
    overallProgress: number;
    totalTimeSpent: number;
    activitiesStarted: number;
    activitiesCompleted: number;
    lastActive: number;
  };
}

interface ProgressContextType {
  progressData: ProgressData;
  startActivity: (profileId: string, activityId: string) => void;
  getActivityProgress: (profileId: string, activityId: string) => ActivityProgress | null;
  getProfileProgress: (profileId: string) => ProgressData[string] | null;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = 'mathfun_progress';

const defaultActivityProgress: ActivityProgress = {
  activityId: '',
  lastAccessed: Date.now(),
  timeSpent: 0,
  sessionsCount: 0,
  completionPercentage: 0,
  bestScore: 0,
  totalProblems: 0,
  correctProblems: 0,
};

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progressData, setProgressData] = useState<ProgressData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return {};
      const parsed: unknown = JSON.parse(stored);
      // Basic validation: must be a plain object
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as ProgressData;
      }
      return {};
    } catch {
      console.warn('Failed to parse progress data, resetting');
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }
  });

  // Save to localStorage whenever progressData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
  }, [progressData]);

  const startActivity = (profileId: string, activityId: string) => {
    setProgressData(prev => {
      const profile = prev[profileId] || {
        activities: {},
        overallProgress: 0,
        totalTimeSpent: 0,
        activitiesStarted: 0,
        activitiesCompleted: 0,
        lastActive: Date.now(),
      };

      const activity = profile.activities[activityId] || {
        ...defaultActivityProgress,
        activityId,
      };

      return {
        ...prev,
        [profileId]: {
          ...profile,
          activities: {
            ...profile.activities,
            [activityId]: {
              ...activity,
              lastAccessed: Date.now(),
              sessionsCount: activity.sessionsCount + 1,
            },
          },
          activitiesStarted: Object.keys({
            ...profile.activities,
            [activityId]: true,
          }).length,
          lastActive: Date.now(),
        },
      };
    });
  };

  const getActivityProgress = (profileId: string, activityId: string): ActivityProgress | null => {
    return progressData[profileId]?.activities[activityId] || null;
  };

  const getProfileProgress = (profileId: string): ProgressData[string] | null => {
    return progressData[profileId] || null;
  };

  return (
    <ProgressContext.Provider
      value={{
        progressData,
        startActivity,
        getActivityProgress,
        getProfileProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
