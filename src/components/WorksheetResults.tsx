/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Worksheet Results Component
 * Display results and statistics after completing a worksheet
 */

import { motion } from 'motion/react';
import { Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import type { WorksheetSession } from '../types';
import { formatName } from '../utils/formatters';

interface Props {
  session: WorksheetSession;
  onTryAgain: () => void;
  onBack: () => void;
  profileId: string;
}

export function WorksheetResults({ session, onTryAgain, onBack, profileId }: Props) {
  const { getProfile } = useProfiles();
  const profile = getProfile(profileId);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceMessage = (): string => {
    if (session.percentage >= 90) return 'Excellent work! 🌟';
    if (session.percentage >= 75) return 'Great job! 👏';
    if (session.percentage >= 60) return 'Good effort! 💪';
    return 'Keep practicing! 📚';
  };

  const getPerformanceColor = (): string => {
    if (session.percentage >= 90) return 'from-green-500 to-emerald-500';
    if (session.percentage >= 75) return 'from-blue-500 to-cyan-500';
    if (session.percentage >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-8xl mb-4"
          >
            {session.percentage >= 90 ? '🏆' : session.percentage >= 75 ? '🌟' : session.percentage >= 60 ? '👍' : '📖'}
          </motion.div>
          <h2 className="text-4xl text-gray-800 mb-2">
            Worksheet Complete!
          </h2>
          <p className="text-xl text-gray-600">{getPerformanceMessage()}</p>
        </div>

        {/* Score Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className={`bg-gradient-to-r ${getPerformanceColor()} text-white rounded-2xl p-8 text-center`}>
            <div className="text-6xl mb-2">{session.percentage}%</div>
            <div className="text-xl">
              {session.correctCount} / {session.problems.length} correct
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700">Correct</span>
            </div>
            <div className="text-3xl text-green-600">{session.correctCount}</div>
          </div>

          <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-700">Wrong</span>
            </div>
            <div className="text-3xl text-red-600">{session.wrongCount}</div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-700">Time</span>
            </div>
            <div className="text-3xl text-blue-600">{formatTime(session.timeSpent)}</div>
          </div>

          {session.currentStreak !== undefined && (
            <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-orange-700">Best Streak</span>
              </div>
              <div className="text-3xl text-orange-600">{session.currentStreak} 🔥</div>
            </div>
          )}
        </motion.div>

        {/* Problem Breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-xl p-4 mb-8 max-h-64 overflow-y-auto"
        >
          <h3 className="text-lg text-gray-800 mb-3">Review Answers</h3>
          <div className="space-y-2">
            {session.problems.map((problem, index) => {
              const userAnswer = session.answers[index];
              const isCorrect = userAnswer === problem.correct;

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    isCorrect ? 'bg-green-100' : userAnswer === null ? 'bg-gray-200' : 'bg-red-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">
                      {problem.num1} {problem.operation} {problem.num2} = {problem.correct}
                    </span>
                    <span className={`${isCorrect ? 'text-green-600' : userAnswer === null ? 'text-gray-500' : 'text-red-600'}`}>
                      {userAnswer === null ? 'Not answered' : isCorrect ? '✓ Correct' : `✗ Your answer: ${userAnswer}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onTryAgain}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-2xl text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
          <button
            onClick={onBack}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-2xl text-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
