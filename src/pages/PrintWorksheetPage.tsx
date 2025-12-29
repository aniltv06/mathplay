/**
 * Print Worksheet Page
 * Dedicated interface for generating and printing worksheets
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Printer, Shuffle } from 'lucide-react';
import type { Difficulty, ProblemSettings } from '../types';
import { DifficultySelector } from '../components/DifficultySelector';
import { WorksheetSettingsPanel } from '../components/WorksheetSettingsPanel';
import { PrintableWorksheetEnhanced } from '../components/PrintableWorksheetEnhanced';
import { useProfiles } from '../context/ProfileContext';
import { formatName } from '../utils/formatters';

interface Props {
  onBack: () => void;
  profileId: string;
}

type ViewState = 'difficulty' | 'settings' | 'preview';

// Difficulty presets
const DIFFICULTY_PRESETS: Record<Difficulty, ProblemSettings> = {
  easy: {
    numProblems: 10,
    maxNum: 10,
    minNum: 1,
    includeAddition: true,
    includeSubtraction: true,
    includeMultiplication: false,
    includeDivision: false,
    difficulty: 'easy',
  },
  medium: {
    numProblems: 15,
    maxNum: 20,
    minNum: 1,
    includeAddition: true,
    includeSubtraction: true,
    includeMultiplication: true,
    includeDivision: true,
    difficulty: 'medium',
  },
  hard: {
    numProblems: 20,
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

export function PrintWorksheetPage({ onBack, profileId }: Props) {
  const { getProfile } = useProfiles();
  const profile = getProfile(profileId);

  const [viewState, setViewState] = useState<ViewState>('difficulty');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [settings, setSettings] = useState<ProblemSettings>(DIFFICULTY_PRESETS.easy);
  const [showSettings, setShowSettings] = useState(false);
  const [problems, setProblems] = useState<any[]>([]);

  const handleDifficultySelect = (diff: Difficulty) => {
    setDifficulty(diff);
    const preset = DIFFICULTY_PRESETS[diff];
    setSettings(preset);

    // Generate problems immediately
    const generatedProblems = generateProblems(preset);
    setProblems(generatedProblems);

    setViewState('preview');
  };

  const handleSettingsSave = (newSettings: ProblemSettings) => {
    setSettings(newSettings);

    // Regenerate problems with new settings
    const generatedProblems = generateProblems(newSettings);
    setProblems(generatedProblems);

    setShowSettings(false);
    setViewState('preview');
  };

  const handleRegenerateProblems = () => {
    const generatedProblems = generateProblems(settings);
    setProblems(generatedProblems);
  };

  const generateProblems = (config: ProblemSettings) => {
    const problems: any[] = [];
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
      let problem: any = null;

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

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <WorksheetSettingsPanel
          settings={settings}
          onSave={handleSettingsSave}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {viewState === 'difficulty' && (
          <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </button>
              <h1 className="text-5xl text-white mb-4 drop-shadow-lg font-bold">
                Print Worksheets 🖨️
              </h1>
              <p className="text-xl text-white/90">
                Generate printable math worksheets for practice
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-2xl"
            >
              <DifficultySelector
                onSelect={handleDifficultySelect}
                hasCustomSettings={false}
              />
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setShowSettings(true)}
              className="mt-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all"
            >
              Customize Settings
            </motion.button>
          </div>
        )}

        {viewState === 'preview' && problems.length > 0 && (
          <div className="relative">
            {/* Preview Controls */}
            <div className="no-print sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-2 border-gray-200 p-4 shadow-lg">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <button
                  onClick={onBack}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Home
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-all"
                  >
                    Change Settings
                  </button>
                  <button
                    onClick={handleRegenerateProblems}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                  >
                    <Shuffle className="w-5 h-5" />
                    New Problems
                  </button>
                </div>
              </div>
            </div>

            {/* Worksheet Preview */}
            <PrintableWorksheetEnhanced
              problems={problems}
              settings={settings}
              profileName={formatName(profile.name)}
              onClose={onBack}
            />
          </div>
        )}
      </div>
    </div>
  );
}
