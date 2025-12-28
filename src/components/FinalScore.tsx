/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion } from 'motion/react';
import { Trophy, Target, Flame, TrendingUp, RotateCcw } from 'lucide-react';
import type { GameStats, Difficulty } from '../types';

interface Props {
  stats: GameStats;
  difficulty: Difficulty;
  onPlayAgain: () => void;
}

export function FinalScore({ stats, difficulty, onPlayAgain }: Props) {
  const accuracy = stats.totalQuestions > 0 
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
    : 0;

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return "🏆 Outstanding Performance!";
    if (accuracy >= 75) return "⭐ Great Job!";
    if (accuracy >= 60) return "👍 Good Effort!";
    return "💪 Keep Practicing!";
  };

  const statCards = [
    {
      icon: Trophy,
      label: 'Final Score',
      value: stats.score,
      color: 'from-yellow-400 to-orange-500',
      textColor: 'text-yellow-600',
    },
    {
      icon: Target,
      label: 'Accuracy',
      value: `${accuracy}%`,
      color: 'from-green-400 to-emerald-500',
      textColor: 'text-green-600',
    },
    {
      icon: Flame,
      label: 'Max Streak',
      value: stats.maxStreak,
      color: 'from-red-400 to-pink-500',
      textColor: 'text-red-600',
    },
    {
      icon: TrendingUp,
      label: 'Correct Answers',
      value: `${stats.correctAnswers}/${stats.totalQuestions}`,
      color: 'from-blue-400 to-purple-500',
      textColor: 'text-blue-600',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl mb-4 text-white drop-shadow-lg">
            Game Over!
          </h1>
          <p className="text-2xl text-white/90 mb-2">
            {getPerformanceMessage()}
          </p>
          <p className="text-xl text-white/80 capitalize">
            Difficulty: {difficulty}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">{stat.label}</div>
                    <div className={`text-4xl ${stat.textColor}`}>
                      {stat.value}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8"
        >
          <h2 className="text-2xl mb-4 text-gray-700 text-center">
            Performance Breakdown
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl text-green-600 mb-1">
                {stats.correctAnswers}
              </div>
              <div className="text-gray-600">Correct</div>
            </div>
            <div>
              <div className="text-3xl text-red-600 mb-1">
                {stats.wrongAnswers}
              </div>
              <div className="text-gray-600">Wrong</div>
            </div>
            <div>
              <div className="text-3xl text-blue-600 mb-1">
                {stats.totalQuestions}
              </div>
              <div className="text-gray-600">Total</div>
            </div>
          </div>
        </motion.div>

        {/* Play Again Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAgain}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 rounded-3xl text-2xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-3"
        >
          <RotateCcw className="w-8 h-8" />
          Play Again
        </motion.button>
      </motion.div>
    </div>
  );
}