/**
 * Multiplication Progress Dashboard Component - Track mastery and statistics
 *
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion } from 'motion/react';
import {
  ArrowLeft, CheckCircle, Trophy, Target, TrendingUp, Zap, Award
} from 'lucide-react';
import type { Profile } from '../context/ProfileContext';
import type { DifficultyLevel, MultiplicationProgress } from './multiplicationTypes';

interface ProgressDashboardProps {
  onBack: () => void;
  progress: MultiplicationProgress;
  profile: Profile;
  difficulty: DifficultyLevel;
}

export function ProgressDashboard({ onBack, progress, profile: _profile, difficulty }: ProgressDashboardProps) {
  const range = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 12;
  const tables = [...Array(range)].map((_, i) => i + 1);

  // Calculate overall statistics
  const masteredCount = tables.filter(t => progress[t]?.mastered).length;
  const totalPracticed = tables.reduce((sum, t) => sum + (progress[t]?.practiced || 0), 0);
  const totalCorrect = tables.reduce((sum, t) => sum + (progress[t]?.correctAnswers || 0), 0);
  const totalAttempts = tables.reduce((sum, t) => sum + (progress[t]?.totalAttempts || 0), 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to menu
        </button>
        <h1 className="text-5xl text-white mb-4 drop-shadow-lg font-bold">
          Your Progress 📊
        </h1>
        <p className="text-xl text-white/90">
          Track your multiplication mastery
        </p>
      </div>

      {/* Overall Stats */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-purple-600" />
          Overall Statistics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 text-center">
            <Trophy className="w-10 h-10 text-purple-600 mx-auto mb-2" />
            <div className="text-4xl font-bold text-purple-600">{masteredCount}</div>
            <div className="text-sm text-gray-600 mt-1">Tables Mastered</div>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-6 text-center">
            <Target className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <div className="text-4xl font-bold text-blue-600">{totalPracticed}</div>
            <div className="text-sm text-gray-600 mt-1">Practice Sessions</div>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 text-center">
            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
            <div className="text-4xl font-bold text-green-600">{overallAccuracy}%</div>
            <div className="text-sm text-gray-600 mt-1">Overall Accuracy</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6 text-center">
            <Zap className="w-10 h-10 text-yellow-600 mx-auto mb-2" />
            <div className="text-4xl font-bold text-yellow-600">{totalCorrect}</div>
            <div className="text-sm text-gray-600 mt-1">Correct Answers</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-800">Mastery Progress</span>
            <span className="font-bold text-purple-600">{Math.round((masteredCount / range) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(masteredCount / range) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </div>

        {/* Individual Table Progress */}
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Individual Tables</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tables.map((table) => {
            const tableProgress = progress[table] || {
              practiced: 0,
              mastered: false,
              correctAnswers: 0,
              totalAttempts: 0
            };

            const accuracy = tableProgress.totalAttempts > 0
              ? Math.round((tableProgress.correctAnswers / tableProgress.totalAttempts) * 100)
              : 0;

            return (
              <motion.div
                key={table}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: table * 0.05 }}
                className={`rounded-xl p-4 text-center ${
                  tableProgress.mastered
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                    : tableProgress.practiced > 0
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-br from-gray-300 to-gray-400'
                }`}
              >
                <div className="text-3xl font-bold text-white mb-1">{table}×</div>
                {tableProgress.mastered && (
                  <Trophy className="w-5 h-5 text-white mx-auto mb-1" />
                )}
                <div className="text-sm text-white font-medium">
                  {tableProgress.mastered ? 'Mastered!' : `${accuracy}% Accuracy`}
                </div>
                <div className="text-xs text-white/80 mt-1">
                  {tableProgress.practiced} session{tableProgress.practiced !== 1 ? 's' : ''}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges */}
      {masteredCount >= 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 shadow-2xl max-w-5xl mx-auto text-center"
        >
          <Award className="w-16 h-16 text-white mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-white mb-2">Achievement Unlocked!</h3>
          <p className="text-xl text-white/90">
            {masteredCount >= range
              ? "🎉 Multiplication Master! You've mastered all tables!"
              : masteredCount >= 10
              ? "🌟 Multiplication Expert! Keep going!"
              : masteredCount >= 5
              ? "⭐ Multiplication Star! You're making great progress!"
              : ""}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
