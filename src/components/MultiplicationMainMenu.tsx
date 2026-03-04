/**
 * Multiplication Main Menu Component
 *
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion } from 'motion/react';
import {
  BookOpen,
  Play,
  Grid3x3,
  TrendingUp,
  Trophy,
  Target,
  Shuffle,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import type {
  MainMode,
  LearningMode,
  DifficultyLevel,
  MultiplicationProgress
} from './multiplicationTypes';

interface MainMenuProps {
  onSelectMode: (mode: MainMode) => void;
  onSelectTable: (table: number, mode?: LearningMode) => void;
  onMixedPractice: () => void;
  onReviewMode: () => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (d: DifficultyLevel) => void;
  progress: MultiplicationProgress;
  wrongAnswersCount: number;
  voiceEnabled: boolean;
}

export function MultiplicationMainMenu({
  onSelectMode,
  onMixedPractice,
  onReviewMode,
  difficulty,
  onDifficultyChange,
  progress,
  wrongAnswersCount
}: MainMenuProps) {
  const menuOptions = [
    {
      id: 'lessons',
      title: 'Learn with Tricks',
      description: 'Discover multiplication shortcuts and memory tricks',
      icon: BookOpen,
      color: 'from-blue-400 to-cyan-500',
      onClick: () => onSelectMode('lessons')
    },
    {
      id: 'grid',
      title: 'Times Table Chart',
      description: 'Interactive multiplication grid 1-12',
      icon: Grid3x3,
      color: 'from-green-400 to-emerald-500',
      onClick: () => onSelectMode('grid')
    },
    {
      id: 'practice',
      title: 'Practice Tables',
      description: 'Master individual times tables step by step',
      icon: Play,
      color: 'from-purple-400 to-pink-500',
      onClick: () => onSelectMode('practice')
    },
    {
      id: 'dashboard',
      title: 'Your Progress',
      description: 'Track mastery and view detailed statistics',
      icon: TrendingUp,
      color: 'from-yellow-400 to-orange-500',
      onClick: () => onSelectMode('dashboard')
    }
  ];

  // Count mastered tables
  const masteredCount = Object.values(progress).filter(p => p.mastered).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-5xl sm:text-6xl text-white mb-4 drop-shadow-lg font-bold"
        >
          Master Multiplication! ✖️
        </motion.h1>
        <motion.p
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          className="text-xl sm:text-2xl text-white/90"
        >
          Learn, practice, and master your times tables
        </motion.p>
        {masteredCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4 inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full font-bold shadow-lg"
          >
            <Trophy className="w-5 h-5" />
            {masteredCount} Table{masteredCount !== 1 ? 's' : ''} Mastered!
          </motion.div>
        )}
      </div>

      {/* Difficulty Selector */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl max-w-3xl mx-auto"
      >
        <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2 font-bold">
          <Target className="w-6 h-6 text-purple-600" />
          Choose Your Challenge Level
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {(['easy', 'medium', 'hard'] as const).map((level) => (
            <motion.button
              key={level}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDifficultyChange(level)}
              className={`p-4 rounded-xl transition-all ${
                difficulty === level
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-lg font-bold capitalize">{level}</div>
              <div className="text-sm opacity-90">
                {level === 'easy' ? 'Tables 1-5' : level === 'medium' ? 'Tables 1-10' : 'Tables 1-12'}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onMixedPractice}
          className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <Shuffle className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold">Mixed Practice</div>
              <div className="text-sm opacity-90">Random questions</div>
            </div>
          </div>
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        {wrongAnswersCount > 0 && (
          <motion.button
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReviewMode}
            className="bg-gradient-to-r from-red-400 to-pink-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">Review Mistakes</div>
                <div className="text-sm opacity-90">{wrongAnswersCount} to practice</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        )}
      </div>

      {/* Main Menu Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuOptions.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={option.onClick}
            className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all text-left group"
          >
            <div className={`w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <option.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">{option.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{option.description}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
