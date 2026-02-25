/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Math Worksheet Page
 * Interactive worksheet for practicing math problems
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import type { Difficulty, Problem, ProblemSettings, WorksheetSession } from '../types';
import { DifficultySelector, OperationSelection } from '../components/DifficultySelector';
import { WorksheetSettingsPanel } from '../components/WorksheetSettingsPanel';
import { WorksheetView } from '../components/WorksheetView';
import { WorksheetResults } from '../components/WorksheetResults';
import { useProfiles } from '../context/ProfileContext';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { checkAndAwardBadges } from '../utils/badges';
import { BadgeNotification } from '../components/BadgeComponents';

interface Props {
  onBack: () => void;
  profileId: string;
}

type PageState = 'difficulty' | 'worksheet' | 'results';

// Difficulty presets
const DIFFICULTY_PRESETS: Record<Difficulty, ProblemSettings> = {
  easy: {
    numProblems: 5,
    maxNum: 10,
    minNum: 1,
    includeAddition: true,
    includeSubtraction: true,
    includeMultiplication: false,
    includeDivision: false,
    difficulty: 'easy',
  },
  medium: {
    numProblems: 10,
    maxNum: 20,
    minNum: 1,
    includeAddition: true,
    includeSubtraction: true,
    includeMultiplication: true,
    includeDivision: true,
    difficulty: 'medium',
  },
  hard: {
    numProblems: 15,
    maxNum: 100,
    minNum: 1,
    includeAddition: true,
    includeSubtraction: true,
    includeMultiplication: true,
    includeDivision: true,
    difficulty: 'hard',
  },
  custom: {
    numProblems: 10,
    maxNum: 20,
    minNum: 1,
    includeAddition: true,
    includeSubtraction: true,
    includeMultiplication: true,
    includeDivision: true,
    difficulty: 'custom',
  },
};

export function MathWorksheetPage({ onBack, profileId }: Props) {
  const { saveWorksheetSession, getProfile, awardBadge } = useProfiles();
  const { speak } = useVoiceFeedback();
  const [pageState, setPageState] = useState<PageState>('difficulty');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [showSettings, setShowSettings] = useState(false);

  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState<ProblemSettings>(() => {
    const saved = localStorage.getItem('practiceSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DIFFICULTY_PRESETS.easy;
      }
    }
    return DIFFICULTY_PRESETS.easy;
  });

  const [hasCustomSettings, setHasCustomSettings] = useState(false);
  const [session, setSession] = useState<WorksheetSession | null>(null);
  const [newBadge, setNewBadge] = useState<any>(null);

  const handleDifficultySelect = (diff: Difficulty, operations: OperationSelection) => {
    setDifficulty(diff);

    // Always apply the difficulty preset when user selects a difficulty
    // This ensures the preset is properly honored
    const newSettings = {
      ...DIFFICULTY_PRESETS[diff],
      // Override operations based on user selection
      includeAddition: operations.addition,
      includeSubtraction: operations.subtraction,
      includeMultiplication: operations.multiplication,
      includeDivision: operations.division,
    };
    setSettings(newSettings);

    // Save to localStorage
    try {
      localStorage.setItem('practiceSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save practice settings:', error);
    }

    setHasCustomSettings(false);
    setPageState('worksheet');
  };

  const handleSettingsSave = (newSettings: ProblemSettings) => {
    // Save to localStorage for persistence
    try {
      localStorage.setItem('practiceSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save practice settings:', error);
    }

    setSettings(newSettings);
    setHasCustomSettings(true);
    setShowSettings(false);

    // DO NOT auto-start worksheet - let user manually start when ready
    // User can close settings and then select difficulty to start
  };

  const handleWorksheetComplete = (completedSession: WorksheetSession) => {
    setSession(completedSession);

    // Save to profile
    saveWorksheetSession(profileId, completedSession);

    // Check for new badges
    const profile = getProfile(profileId);
    if (profile) {
      const newBadges = checkAndAwardBadges(profile);
      newBadges.forEach(id => awardBadge(profileId, id));
      if (newBadges.length > 0) {
        const badgeToShow = profile.badges.find(b => b.id === newBadges[0]);
        if (badgeToShow) {
          setNewBadge(badgeToShow);
        }
      }
    }

    speak('Worksheet complete!');
    setPageState('results');
  };

  const handleTryAgain = () => {
    setSession(null);
    setHasCustomSettings(false); // Reset custom settings flag
    setPageState('difficulty');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-50 bg-white hover:bg-gray-100 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-gray-800"
      >
        <ArrowLeft className="w-5 h-5" />
        Home
      </button>

      {/* Settings button */}
      {(pageState === 'difficulty' || pageState === 'results') && (
        <button
          onClick={() => setShowSettings(true)}
          className="absolute top-6 right-6 z-10 bg-white hover:bg-gray-100 transition-all p-3 rounded-full shadow-lg"
        >
          <Settings className="w-6 h-6 text-gray-800" />
        </button>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <WorksheetSettingsPanel
          settings={settings}
          onSave={handleSettingsSave}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Page States */}
      <div className="relative z-1">
        {pageState === 'difficulty' && (
          <DifficultySelector
            onSelect={handleDifficultySelect}
            hasCustomSettings={hasCustomSettings}
            initialOperations={{
              addition: settings.includeAddition,
              subtraction: settings.includeSubtraction,
              multiplication: settings.includeMultiplication,
              division: settings.includeDivision,
            }}
          />
        )}

        {pageState === 'worksheet' && (
          <WorksheetView
            settings={settings}
            profileId={profileId}
            onComplete={handleWorksheetComplete}
          />
        )}

        {pageState === 'results' && session && (
          <WorksheetResults
            session={session}
            onTryAgain={handleTryAgain}
            onBack={onBack}
            profileId={profileId}
          />
        )}
      </div>

      {/* Badge Notification */}
      {newBadge && (
        <BadgeNotification
          badge={newBadge}
          onClose={() => setNewBadge(null)}
        />
      )}
    </div>
  );
}
