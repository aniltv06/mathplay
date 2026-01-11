/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { DifficultySelector, OperationSelection } from '../components/DifficultySelector';
import { GameBoard } from '../components/GameBoard';
import { FinalScore } from '../components/FinalScore';
import { SettingsPanel } from '../components/SettingsPanel';
import { Settings } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import type { Difficulty, ProblemType, GameSettings, GameStats } from '../types';

interface Props {
  onBack: () => void;
  profileId: string;
}

type GameState = 'difficulty' | 'playing' | 'finished';

export function MathChallengePage({ onBack, profileId }: Props) {
  const { updateStats, getProfile } = useProfiles();
  const [gameState, setGameState] = useState<GameState>('difficulty');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [showSettings, setShowSettings] = useState(false);

  // Load settings from localStorage or use defaults
  const [gameSettings, setGameSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('hangmanSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          problemTypes: ['addition', 'subtraction', 'multiplication', 'division'],
          livesCount: 6,
          timeBonus: true,
          streakBonus: true,
        };
      }
    }
    return {
      problemTypes: ['addition', 'subtraction', 'multiplication', 'division'],
      livesCount: 6,
      timeBonus: true,
      streakBonus: true,
    };
  });

  const [finalStats, setFinalStats] = useState<GameStats | null>(null);

  // Helper to convert OperationSelection to ProblemType[]
  const operationsToProblemTypes = (operations: OperationSelection): ProblemType[] => {
    const types: ProblemType[] = [];
    if (operations.addition) types.push('addition');
    if (operations.subtraction) types.push('subtraction');
    if (operations.multiplication) types.push('multiplication');
    if (operations.division) types.push('division');
    return types;
  };

  // Helper to convert ProblemType[] to OperationSelection
  const problemTypesToOperations = (types: ProblemType[]): OperationSelection => {
    return {
      addition: types.includes('addition'),
      subtraction: types.includes('subtraction'),
      multiplication: types.includes('multiplication'),
      division: types.includes('division'),
    };
  };

  const handleDifficultySelect = (diff: Difficulty, operations: OperationSelection) => {
    setDifficulty(diff);

    // Apply selected operations to game settings
    const newProblemTypes = operationsToProblemTypes(operations);
    const updatedSettings = {
      ...gameSettings,
      problemTypes: newProblemTypes,
    };

    // Save to localStorage
    try {
      localStorage.setItem('hangmanSettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to save hangman settings:', error);
    }

    setGameSettings(updatedSettings);
    setGameState('playing');
  };

  const handleGameOver = (stats: GameStats) => {
    setFinalStats(stats);
    setGameState('finished');

    // TODO: Update to use saveHangmanSession with proper HangmanSession structure
    // For now, stats are tracked within the game but not persisted to profile
    // const profile = getProfile(profileId);
    // if (profile) {
    //   updateStats(profileId, {
    //     ...stats tracking...
    //   });
    // }
  };

  const handlePlayAgain = () => {
    setFinalStats(null);
    setGameState('difficulty');
  };

  const handleSettingsSave = (settings: GameSettings) => {
    // Save to localStorage for persistence
    try {
      localStorage.setItem('hangmanSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save hangman settings:', error);
    }
    setGameSettings(settings);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 relative overflow-hidden">
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
      {(gameState === 'difficulty' || gameState === 'finished') && (
        <button
          onClick={() => setShowSettings(true)}
          className="absolute top-6 right-6 z-10 bg-white hover:bg-gray-100 transition-all p-3 rounded-full shadow-lg"
        >
          <Settings className="w-6 h-6 text-gray-800" />
        </button>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={gameSettings}
          onSave={handleSettingsSave}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Game States */}
      <div className="relative z-1">
        {gameState === 'difficulty' && (
          <DifficultySelector
            onSelect={handleDifficultySelect}
            initialOperations={problemTypesToOperations(gameSettings.problemTypes)}
          />
        )}

        {gameState === 'playing' && (
          <GameBoard
            difficulty={difficulty}
            settings={gameSettings}
            onGameOver={handleGameOver}
            profileId={profileId}
          />
        )}

        {gameState === 'finished' && finalStats && (
          <FinalScore
            stats={finalStats}
            difficulty={difficulty}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  );
}
