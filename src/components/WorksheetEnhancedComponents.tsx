/**
 * Enhanced Worksheet Components
 * Visual aids, hints, mode selection, and enhanced features
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Lightbulb, Eye, EyeOff, Book, Zap,
  Clock, Target, Shuffle, Brain, TrendingUp, Award,
  Star, Coins as CoinsIcon, ChevronRight, Play,
  RotateCcw, CheckCircle, XCircle, Trophy, Timer
} from 'lucide-react';
import type { Problem } from '../types';
import { generateHint, generateStepByStep, numberToWord, getOperationWord } from '../utils/problemVariants';
import { mathTips, getTipsForOperation, getRandomTip, type MathTip } from '../utils/mathTips';

// ============================================================================
// VISUAL LEARNING AIDS
// ============================================================================

export function VisualAids({ problem, show }: { problem: Problem; show: boolean }) {
  if (!show) return null;

  const { num1, num2, operation } = problem;

  // Only show for smaller numbers
  if (num1 > 20 || num2 > 20) {
    return (
      <div className="text-sm text-gray-600 italic text-center mt-4">
        Visual aids available for smaller numbers
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-6 p-4 bg-purple-50 rounded-xl"
    >
      {operation === '+' && <AdditionVisual num1={num1} num2={num2} />}
      {operation === '-' && <SubtractionVisual num1={num1} num2={num2} />}
      {operation === '×' && <MultiplicationVisual num1={num1} num2={num2} />}
      {operation === '÷' && <DivisionVisual num1={num1} num2={num2} />}
    </motion.div>
  );
}

function AdditionVisual({ num1, num2 }: { num1: number; num2: number }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 text-center">
        {num1} + {num2} = ?
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {/* First group */}
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {[...Array(num1)].map((_, i) => (
            <div key={`a-${i}`} className="w-6 h-6 bg-blue-400 rounded-full" />
          ))}
        </div>

        <span className="text-2xl font-bold text-gray-600">+</span>

        {/* Second group */}
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {[...Array(num2)].map((_, i) => (
            <div key={`b-${i}`} className="w-6 h-6 bg-green-400 rounded-full" />
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-600 text-center">
        Count all the dots together!
      </p>
    </div>
  );
}

function SubtractionVisual({ num1, num2 }: { num1: number; num2: number }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 text-center">
        {num1} - {num2} = ?
      </p>
      <div className="flex flex-wrap gap-1 justify-center max-w-[300px] mx-auto">
        {[...Array(num1)].map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full ${
              i < num2 ? 'bg-red-400 opacity-30 line-through' : 'bg-blue-400'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600 text-center">
        Cross out {num2} dots, count what's left!
      </p>
    </div>
  );
}

function MultiplicationVisual({ num1, num2 }: { num1: number; num2: number }) {
  if (num1 > 10 || num2 > 10) {
    return (
      <div className="text-sm text-gray-600 text-center">
        Think: {num1} groups of {num2}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 text-center">
        {num1} × {num2} = {num1} groups of {num2}
      </p>
      <div className="space-y-2">
        {[...Array(num1)].map((_, groupIdx) => (
          <div key={groupIdx} className="flex gap-1 justify-center">
            {[...Array(num2)].map((_, dotIdx) => (
              <div key={dotIdx} className="w-6 h-6 bg-purple-400 rounded-full" />
            ))}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-600 text-center">
        {num1} rows × {num2} dots per row
      </p>
    </div>
  );
}

function DivisionVisual({ num1, num2 }: { num1: number; num2: number }) {
  const result = num1 / num2;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 text-center">
        {num1} ÷ {num2} = ? (Share {num1} dots into {num2} equal groups)
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        {[...Array(num2)].map((_, groupIdx) => (
          <div key={groupIdx} className="flex flex-col items-center">
            <div className="text-xs text-gray-600 mb-1">Group {groupIdx + 1}</div>
            <div className="flex flex-wrap gap-1 p-2 border-2 border-orange-300 rounded-lg bg-orange-50">
              {[...Array(result)].map((_, dotIdx) => (
                <div key={dotIdx} className="w-5 h-5 bg-orange-400 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-600 text-center">
        Each group gets {result} dots
      </p>
    </div>
  );
}

// ============================================================================
// HINTS PANEL
// ============================================================================

export function HintsPanel({ problem, hintLevel, onRequestHint, onShowSolution }: {
  problem: Problem;
  hintLevel: number;
  onRequestHint: () => void;
  onShowSolution: () => void;
}) {
  return (
    <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-yellow-600" />
        <h3 className="font-bold text-gray-800">Need Help?</h3>
      </div>

      {hintLevel === 0 && (
        <div className="space-y-2">
          <button
            onClick={onRequestHint}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-2 px-4 rounded-lg font-medium transition-all"
          >
            💡 Get a Hint
          </button>
          <button
            onClick={onShowSolution}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-all text-sm"
          >
            📖 Show Step-by-Step Solution
          </button>
        </div>
      )}

      {hintLevel > 0 && hintLevel <= 3 && (
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg border border-yellow-300">
            <p className="text-sm text-gray-700">{generateHint(problem, hintLevel as 1 | 2 | 3)}</p>
          </div>

          {hintLevel < 3 ? (
            <button
              onClick={onRequestHint}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-2 px-4 rounded-lg font-medium transition-all"
            >
              💡 Get Another Hint
            </button>
          ) : (
            <button
              onClick={onShowSolution}
              className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-lg font-medium transition-all"
            >
              📖 Show Full Solution
            </button>
          )}
        </div>
      )}

      {hintLevel > 3 && (
        <div className="bg-white p-4 rounded-lg border border-yellow-300 space-y-2">
          <h4 className="font-bold text-gray-800 mb-2">Step-by-Step Solution:</h4>
          {generateStepByStep(problem).map((step, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-purple-600 font-bold">{idx + 1}.</span>
              <p className="text-sm text-gray-700">{step}</p>
            </div>
          ))}
          <div className="mt-3 p-2 bg-green-100 rounded-lg">
            <p className="text-center font-bold text-green-800">
              Answer: {problem.correct}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MATH TIP DISPLAY
// ============================================================================

export function MathTipCard({ tip }: { tip: MathTip }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200"
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{tip.icon}</span>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 mb-1">{tip.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
          <div className="bg-white p-2 rounded-lg border border-blue-200">
            <p className="text-sm font-mono text-gray-800">{tip.example}</p>
          </div>
          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              tip.difficulty === 'beginner' ? 'bg-green-200 text-green-800' :
              tip.difficulty === 'intermediate' ? 'bg-yellow-200 text-yellow-800' :
              'bg-red-200 text-red-800'
            }`}>
              {tip.difficulty}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MODE SELECTION MENU
// ============================================================================

export function ModeSelectionMenu({ onSelectMode, onBack }: {
  onSelectMode: (mode: string) => void;
  onBack: () => void;
}) {
  const modes = [
    {
      id: 'quick',
      title: 'Quick Practice',
      description: '5 problems - Fast warm-up',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      badge: '5 min'
    },
    {
      id: 'standard',
      title: 'Standard Practice',
      description: '10-15 problems - Regular session',
      icon: Book,
      color: 'from-blue-400 to-cyan-500',
      badge: '10 min'
    },
    {
      id: 'timed',
      title: 'Timed Challenge',
      description: 'Race against the clock!',
      icon: Timer,
      color: 'from-red-400 to-pink-500',
      badge: 'Timed'
    },
    {
      id: 'endless',
      title: 'Endless Mode',
      description: 'Keep going as long as you can',
      icon: Shuffle,
      color: 'from-purple-400 to-pink-500',
      badge: '∞'
    },
    {
      id: 'topic-add',
      title: 'Addition Focus',
      description: 'Practice addition only',
      icon: Target,
      color: 'from-green-400 to-emerald-500',
      badge: '+'
    },
    {
      id: 'topic-sub',
      title: 'Subtraction Focus',
      description: 'Practice subtraction only',
      icon: Target,
      color: 'from-teal-400 to-cyan-500',
      badge: '-'
    },
    {
      id: 'topic-mul',
      title: 'Multiplication Focus',
      description: 'Practice multiplication only',
      icon: Target,
      color: 'from-indigo-400 to-purple-500',
      badge: '×'
    },
    {
      id: 'topic-div',
      title: 'Division Focus',
      description: 'Practice division only',
      icon: Target,
      color: 'from-pink-400 to-rose-500',
      badge: '÷'
    },
    {
      id: 'adaptive',
      title: 'Adaptive Practice',
      description: 'Difficulty adjusts to your level',
      icon: Brain,
      color: 'from-violet-400 to-purple-500',
      badge: 'Smart'
    }
  ];

  return (
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
          Back
        </button>
        <h1 className="text-5xl text-white mb-4 drop-shadow-lg font-bold">
          Choose Practice Mode 🎯
        </h1>
        <p className="text-xl text-white/90">
          Select how you'd like to practice today
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl w-full">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          return (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectMode(mode.id)}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all text-left group relative overflow-hidden"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                {mode.badge}
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 mb-4 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-2 text-gray-800">{mode.title}</h3>
              <p className="text-sm text-gray-600">{mode.description}</p>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-gray-400 absolute bottom-4 right-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// REWARDS DISPLAY
// ============================================================================

export function RewardsDisplay({ coins, stars, showAnimation }: {
  coins: number;
  stars: number;
  showAnimation?: boolean;
}) {
  return (
    <motion.div
      initial={showAnimation ? { scale: 0, opacity: 0 } : undefined}
      animate={showAnimation ? { scale: 1, opacity: 1 } : undefined}
      className="flex items-center gap-4"
    >
      {/* Coins */}
      <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
        <CoinsIcon className="w-5 h-5 text-yellow-600" />
        <span className="font-bold text-yellow-800">+{coins}</span>
      </div>

      {/* Stars */}
      {stars > 0 && (
        <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
          <Star className="w-5 h-5 text-purple-600 fill-purple-600" />
          <span className="font-bold text-purple-800">+{stars}</span>
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// DAILY CHALLENGES PANEL
// ============================================================================

export function DailyChallengesPanel({ challenges }: { challenges: any[] }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-600" />
        <h3 className="text-xl font-bold text-gray-800">Daily Challenges</h3>
      </div>

      <div className="space-y-3">
        {challenges.map((challenge, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border-2 ${
              challenge.completed
                ? 'bg-green-50 border-green-300'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800">{challenge.description}</span>
              {challenge.completed && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  challenge.completed ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(100, (challenge.current / challenge.target) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {challenge.current} / {challenge.target}
              </span>
              <span className="text-yellow-600 font-bold flex items-center gap-1">
                <CoinsIcon className="w-4 h-4" />
                {challenge.reward}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
