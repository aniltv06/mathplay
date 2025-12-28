/**
 * Enhanced Worksheet Results Page
 * Detailed analytics, rewards, and performance breakdown
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion } from 'motion/react';
import {
  ArrowLeft, CheckCircle, XCircle, Clock, Zap, Trophy,
  TrendingUp, Target, Award, Star, Coins as CoinsIcon,
  RotateCcw, Home, ChevronRight, Brain, Flame
} from 'lucide-react';
import type { WorksheetSession, Problem } from '../types';
import { RewardsDisplay } from './WorksheetEnhancedComponents';
import { calculateRewards } from '../utils/rewards';
import { useProfiles } from '../context/ProfileContext';

interface Props {
  session: WorksheetSession;
  onTryAgain: () => void;
  onBack: () => void;
  profileId: string;
  rewards?: { coins: number; stars: number; reason: string };
}

export function WorksheetResultsEnhanced({ session, onTryAgain, onBack, profileId, rewards }: Props) {
  const { getProfile } = useProfiles();
  const profile = getProfile(profileId);

  const { problems, answers, correctCount, wrongCount, timeSpent, percentage, currentStreak } = session;
  const totalProblems = problems.length;

  // Calculate rewards if not provided
  const difficulty = session.settings.difficulty === 'custom' ? 'medium' : session.settings.difficulty;
  const finalRewards = rewards || calculateRewards(
    correctCount,
    totalProblems,
    timeSpent,
    currentStreak || 0,
    difficulty as 'easy' | 'medium' | 'hard'
  );

  // Calculate time per problem
  const avgTimePerProblem = timeSpent / totalProblems;

  // Performance rating
  const getRating = () => {
    if (percentage >= 95) return { text: 'Outstanding!', emoji: '🌟', color: 'text-yellow-600' };
    if (percentage >= 85) return { text: 'Excellent!', emoji: '⭐', color: 'text-green-600' };
    if (percentage >= 75) return { text: 'Great Job!', emoji: '👍', color: 'text-blue-600' };
    if (percentage >= 60) return { text: 'Good Effort!', emoji: '💪', color: 'text-purple-600' };
    return { text: 'Keep Practicing!', emoji: '📚', color: 'text-gray-600' };
  };

  const rating = getRating();

  // Categorize problems by operation
  const byOperation = problems.reduce((acc, problem, idx) => {
    const op = problem.operation;
    if (!acc[op]) acc[op] = { correct: 0, wrong: 0, total: 0 };
    acc[op].total++;
    if (answers[idx] === problem.correct) {
      acc[op].correct++;
    } else if (answers[idx] !== null) {
      acc[op].wrong++;
    }
    return acc;
  }, {} as Record<string, { correct: number; wrong: number; total: number }>);

  // Find strengths and areas for improvement
  const operationStats = Object.entries(byOperation).map(([op, stats]) => ({
    operation: op,
    accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    ...stats
  })).sort((a, b) => b.accuracy - a.accuracy);

  const strengths = operationStats.filter(s => s.accuracy >= 80);
  const needsWork = operationStats.filter(s => s.accuracy < 80 && s.total > 0);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-8xl mb-4"
          >
            {rating.emoji}
          </motion.div>
          <h1 className={`text-5xl font-bold mb-2 ${rating.color}`}>
            {rating.text}
          </h1>
          <p className="text-xl text-white/90">
            You scored {percentage}%
          </p>
        </motion.div>

        {/* Main Stats Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-6"
        >
          {/* Score Overview */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 text-center">
              <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <div className="text-4xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>

            <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl p-6 text-center">
              <XCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
              <div className="text-4xl font-bold text-red-600">{wrongCount}</div>
              <div className="text-sm text-gray-600">Wrong</div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-6 text-center">
              <Clock className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <div className="text-4xl font-bold text-blue-600">
                {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
          </div>

          {/* Accuracy Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-800">Accuracy</span>
              <span className="font-bold text-purple-600">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  percentage >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                  percentage >= 75 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                  percentage >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  'bg-gradient-to-r from-red-400 to-pink-500'
                }`}
              />
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentStreak && currentStreak > 0 && (
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <Flame className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
                <div className="text-xs text-gray-600">Best Streak</div>
              </div>
            )}

            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <Zap className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-purple-600">{avgTimePerProblem.toFixed(1)}s</div>
              <div className="text-xs text-gray-600">Per Problem</div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <Target className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-yellow-600">{totalProblems}</div>
              <div className="text-xs text-gray-600">Problems</div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-green-600">{session.settings.difficulty}</div>
              <div className="text-xs text-gray-600">Difficulty</div>
            </div>
          </div>
        </motion.div>

        {/* Rewards */}
        {finalRewards && (finalRewards.coins > 0 || finalRewards.stars > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-6 shadow-2xl mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">🎉 Rewards Earned!</h3>
                <p className="text-white/90 text-sm">{finalRewards.reason}</p>
              </div>
              <div className="flex gap-4">
                {finalRewards.coins > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.7 }}
                    className="bg-white rounded-2xl px-6 py-3 flex items-center gap-2"
                  >
                    <CoinsIcon className="w-6 h-6 text-yellow-600" />
                    <span className="text-2xl font-bold text-yellow-800">+{finalRewards.coins}</span>
                  </motion.div>
                )}
                {finalRewards.stars > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.8 }}
                    className="bg-white rounded-2xl px-6 py-3 flex items-center gap-2"
                  >
                    <Star className="w-6 h-6 text-purple-600 fill-purple-600" />
                    <span className="text-2xl font-bold text-purple-800">+{finalRewards.stars}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Performance by Operation */}
        {operationStats.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-6"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Brain className="w-7 h-7 text-purple-600" />
              Performance by Operation
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {operationStats.map((stat) => (
                <div
                  key={stat.operation}
                  className={`p-4 rounded-xl border-2 ${
                    stat.accuracy >= 80
                      ? 'bg-green-50 border-green-300'
                      : stat.accuracy >= 60
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-red-50 border-red-300'
                  }`}
                >
                  <div className="text-3xl font-bold text-center mb-2">{stat.operation}</div>
                  <div className="text-2xl font-bold text-center mb-1">
                    {stat.accuracy}%
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    {stat.correct}/{stat.total} correct
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Strengths and Areas for Improvement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {strengths.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                Your Strengths
              </h3>
              <div className="space-y-2">
                {strengths.map((stat) => (
                  <div key={stat.operation} className="flex items-center justify-between">
                    <span className="text-2xl">{stat.operation}</span>
                    <span className="font-bold text-green-600">{stat.accuracy}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {needsWork.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Practice More
              </h3>
              <div className="space-y-2">
                {needsWork.map((stat) => (
                  <div key={stat.operation} className="flex items-center justify-between">
                    <span className="text-2xl">{stat.operation}</span>
                    <span className="font-bold text-orange-600">{stat.accuracy}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={onTryAgain}
            className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white py-4 rounded-2xl text-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-6 h-6" />
            Try Again
          </button>

          <button
            onClick={onBack}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-2xl text-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Home className="w-6 h-6" />
            Back to Menu
          </button>
        </motion.div>
      </div>
    </div>
  );
}
