/**
 * Enhanced Math Worksheet Page
 * Comprehensive worksheet system with modes, hints, visual aids, and rewards
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import type { Difficulty, Problem, ProblemSettings, WorksheetSession } from '../types';
import { DifficultySelector } from '../components/DifficultySelector';
import { WorksheetSettingsPanel } from '../components/WorksheetSettingsPanel';
import { WorksheetView } from '../components/WorksheetView';
import { WorksheetResultsEnhanced } from '../components/WorksheetResultsEnhanced';
import { ModeSelectionMenu } from '../components/WorksheetEnhancedComponents';
import { useProfiles } from '../context/ProfileContext';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { checkAndAwardBadges } from '../utils/badges';
import { BadgeNotification } from '../components/BadgeComponents';
import { calculateRewards, getTodaysChallenges, updateDailyChallenges } from '../utils/rewards';
import { soundEffects } from '../utils/soundEffects';
import { PrintableWorksheetEnhanced } from '../components/PrintableWorksheetEnhanced';
import { formatName } from '../utils/formatters';

interface Props {
  onBack: () => void;
  profileId: string;
}

type PageState = 'mode-select' | 'difficulty' | 'worksheet' | 'results';
type PracticeMode = 'quick' | 'standard' | 'timed' | 'endless' | 'topic-add' | 'topic-sub' | 'topic-mul' | 'topic-div' | 'adaptive' | 'word-problems';

// Mode-specific settings
const MODE_SETTINGS: Record<PracticeMode, Partial<ProblemSettings>> = {
  'quick': {
    numProblems: 5,
    includeAddition: true,
    includeSubtraction: true,
    includeMultiplication: false,
    includeDivision: false
  },
  'standard': {
    numProblems: 10,
    includeAddition: true,
    includeSubtraction: true,
    includeMultiplication: true,
    includeDivision: true
  },
  'timed': {
    numProblems: 15,
    timedMode: true,
    timeLimit: 180, // 3 minutes
    includeAddition: true,
    includeSubtraction: true,
    includeMultiplication: true,
    includeDivision: true
  },
  'endless': {
    numProblems: 50, // Large number for endless mode
    includeAddition: true,
    includeSubtraction: true,
    includeMultiplication: true,
    includeDivision: true
  },
  'topic-add': {
    numProblems: 10,
    includeAddition: true,
    includeSubtraction: false,
    includeMultiplication: false,
    includeDivision: false
  },
  'topic-sub': {
    numProblems: 10,
    includeAddition: false,
    includeSubtraction: true,
    includeMultiplication: false,
    includeDivision: false
  },
  'topic-mul': {
    numProblems: 10,
    includeAddition: false,
    includeSubtraction: false,
    includeMultiplication: true,
    includeDivision: false
  },
  'topic-div': {
    numProblems: 10,
    includeAddition: false,
    includeSubtraction: false,
    includeMultiplication: false,
    includeDivision: true
  },
  'adaptive': {
    numProblems: 12,
    includeAddition: true,
    includeSubtraction: true,
    includeMultiplication: true,
    includeDivision: true
  },
  'word-problems': {
    numProblems: 8,
    includeAddition: true,
    includeSubtraction: true,
    includeMultiplication: true,
    includeDivision: true,
    displayAsWordProblems: true
  }
};

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

export function MathWorksheetPageEnhanced({ onBack, profileId }: Props) {
  const { saveWorksheetSession, getProfile, updateProfile } = useProfiles();
  const profile = getProfile(profileId);
  const { speak, enabled: voiceEnabled, setEnabled: setVoiceEnabled } = useVoiceFeedback();

  const [pageState, setPageState] = useState<PageState>('mode-select');
  const [selectedMode, setSelectedMode] = useState<PracticeMode>('standard');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ProblemSettings>(DIFFICULTY_PRESETS.easy);
  const [hasCustomSettings, setHasCustomSettings] = useState(false);
  const [session, setSession] = useState<WorksheetSession | null>(null);
  const [newBadge, setNewBadge] = useState<any>(null);
  const [rewards, setRewards] = useState<any>(null);
  const [soundEnabled, setSoundEnabled] = useState(soundEffects.isEnabled());
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [printProblems, setPrintProblems] = useState<Problem[]>([]);

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode as PracticeMode);
    setPageState('difficulty');
  };

  const handleDifficultySelect = (diff: Difficulty) => {
    setDifficulty(diff);

    // Merge mode settings with difficulty preset
    const modeSettings = MODE_SETTINGS[selectedMode];
    const difficultyPreset = DIFFICULTY_PRESETS[diff];

    const mergedSettings: ProblemSettings = {
      ...difficultyPreset,
      ...modeSettings,
      difficulty: diff
    };

    setSettings(mergedSettings);
    setPageState('worksheet');

    if (voiceEnabled) {
      speak('Starting worksheet!');
    }
  };

  const handleSettingsSave = (newSettings: ProblemSettings) => {
    setSettings(newSettings);
    setHasCustomSettings(true);
    setShowSettings(false);
    setPageState('worksheet');
  };

  const handleWorksheetComplete = (completedSession: WorksheetSession) => {
    setSession(completedSession);

    // Calculate rewards
    const earnedRewards = calculateRewards(
      completedSession.correctCount,
      completedSession.problems.length,
      completedSession.timeSpent,
      completedSession.currentStreak || 0,
      completedSession.settings.difficulty === 'custom' ? 'medium' : completedSession.settings.difficulty as 'easy' | 'medium' | 'hard'
    );
    setRewards(earnedRewards);

    // Update profile coins and stars
    if (profile) {
      const newCoins = (profile.coins || 0) + earnedRewards.coins;
      const newStars = (profile.stars || 0) + earnedRewards.stars;

      // Update daily challenges
      const challenges = profile.dailyChallenges || getTodaysChallenges();
      const { challenges: updatedChallenges, coinsEarned } = updateDailyChallenges(
        challenges,
        completedSession.problems.length,
        completedSession.percentage,
        completedSession.currentStreak || 0
      );

      updateProfile(profileId, {
        coins: newCoins + coinsEarned,
        stars: newStars,
        dailyChallenges: updatedChallenges
      });
    }

    // Save to profile
    saveWorksheetSession(profileId, completedSession);

    // Play completion sound
    if (soundEnabled) {
      if (completedSession.percentage >= 90) {
        soundEffects.play('achievement');
      } else {
        soundEffects.play('complete');
      }
    }

    // Check for new badges
    const updatedProfile = getProfile(profileId);
    if (updatedProfile) {
      const newBadges = checkAndAwardBadges(updatedProfile);
      if (newBadges.length > 0) {
        const badgeToShow = updatedProfile.badges.find(b => b.id === newBadges[0]);
        if (badgeToShow) {
          setNewBadge(badgeToShow);
          if (soundEnabled) {
            soundEffects.play('achievement');
          }
        }
      }
    }

    speak('Worksheet complete!');
    setPageState('results');
  };

  const handleTryAgain = () => {
    setSession(null);
    setRewards(null);
    setHasCustomSettings(false);
    setPageState('mode-select');
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundEffects.setEnabled(newState);
    if (newState) {
      soundEffects.play('click');
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  const handlePrintPreview = (previewSettings: ProblemSettings) => {
    // Generate problems for printing
    const problems = generateProblems(previewSettings);
    setPrintProblems(problems);
    setSettings(previewSettings);
    setShowSettings(false);
    setShowPrintPreview(true);
  };

  const generateProblems = (config: ProblemSettings): Problem[] => {
    const problems: Problem[] = [];
    const problemSet = new Set<string>();
    const operations: Array<'+' | '-' | '×' | '÷'> = [];

    if (config.includeAddition) operations.push('+');
    if (config.includeSubtraction) operations.push('-');
    if (config.includeMultiplication) operations.push('×');
    if (config.includeDivision) operations.push('÷');

    let attempts = 0;
    const maxAttempts = config.numProblems * 10;

    while (problems.length < config.numProblems && attempts < maxAttempts) {
      attempts++;

      const operation = operations[Math.floor(Math.random() * operations.length)];
      let num1 = Math.floor(Math.random() * (config.maxNum - config.minNum + 1)) + config.minNum;
      let num2 = Math.floor(Math.random() * (config.maxNum - config.minNum + 1)) + config.minNum;
      let problem: Problem | null = null;

      switch (operation) {
        case '+':
          problem = { num1, num2, operation, correct: num1 + num2 };
          break;
        case '-':
          if (num1 < num2) [num1, num2] = [num2, num1];
          problem = { num1, num2, operation, correct: num1 - num2 };
          break;
        case '×':
          problem = { num1, num2, operation, correct: num1 * num2 };
          break;
        case '÷':
          const quotient = num2;
          const dividend = num1 * num2;
          problem = { num1: dividend, num2: num1, operation, correct: quotient };
          break;
      }

      if (problem) {
        const problemKey = `${problem.num1}${problem.operation}${problem.num2}`;
        if (!problemSet.has(problemKey)) {
          problemSet.add(problemKey);
          problems.push(problem);
        }
      }
    }

    return problems;
  };

  const closePrintPreview = () => {
    setShowPrintPreview(false);
    setPrintProblems([]);
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
        <span className="hidden sm:inline">Home</span>
      </button>

      {/* Controls */}
      <div className="absolute top-6 right-6 z-50 flex gap-3">
        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="bg-white hover:bg-gray-100 transition-all p-3 rounded-full shadow-lg"
          title={soundEnabled ? 'Disable Sounds' : 'Enable Sounds'}
        >
          {soundEnabled ? (
            <Volume2 className="w-6 h-6 text-gray-800" />
          ) : (
            <VolumeX className="w-6 h-6 text-gray-800" />
          )}
        </button>

        {/* Settings */}
        {(pageState === 'mode-select' || pageState === 'difficulty' || pageState === 'results') && (
          <button
            onClick={() => setShowSettings(true)}
            className="bg-white hover:bg-gray-100 transition-all p-3 rounded-full shadow-lg"
          >
            <Settings className="w-6 h-6 text-gray-800" />
          </button>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <WorksheetSettingsPanel
          settings={settings}
          onSave={handleSettingsSave}
          onClose={() => setShowSettings(false)}
          onPrintPreview={handlePrintPreview}
        />
      )}

      {/* Print Preview */}
      {showPrintPreview && profile && printProblems.length > 0 && (
        <PrintableWorksheetEnhanced
          problems={printProblems}
          settings={settings}
          profileName={formatName(profile.name)}
          onClose={closePrintPreview}
        />
      )}

      {/* Page States */}
      <div className="relative z-1">
        {pageState === 'mode-select' && (
          <ModeSelectionMenu
            onSelectMode={handleModeSelect}
            onBack={onBack}
          />
        )}

        {pageState === 'difficulty' && (
          <DifficultySelector
            onSelect={handleDifficultySelect}
            hasCustomSettings={hasCustomSettings}
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
          <WorksheetResultsEnhanced
            session={session}
            onTryAgain={handleTryAgain}
            onBack={onBack}
            profileId={profileId}
            rewards={rewards}
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
