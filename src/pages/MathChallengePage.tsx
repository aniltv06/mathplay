/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { DifficultySelector } from '../components/DifficultySelector';
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
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    problemTypes: ['addition', 'subtraction', 'multiplication', 'division'],
    livesCount: 6,
    timeBonus: true,
    streakBonus: true,
  });
  const [finalStats, setFinalStats] = useState<GameStats | null>(null);

  const handleDifficultySelect = (diff: Difficulty) => {
    setDifficulty(diff);
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
        className="absolute top-6 left-6 z-50 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        Home
      </button>

      {/* Settings button */}
      {(gameState === 'difficulty' || gameState === 'finished') && (
        <button
          onClick={() => setShowSettings(true)}
          className="absolute top-6 right-6 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-3 rounded-full shadow-lg"
        >
          <Settings className="w-6 h-6 text-white" />
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
          <DifficultySelector onSelect={handleDifficultySelect} />
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
