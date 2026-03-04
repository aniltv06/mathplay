/**
 * Multiplication Practice View Component - All practice modes
 *
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, CheckCircle, XCircle, Clock, Star, RotateCcw, Timer
} from 'lucide-react';
import type {
  DifficultyLevel,
  LearningMode,
  MultiplicationProgress,
  QuestionResult
} from './multiplicationTypes';

interface PracticeViewProps {
  selectedTable: number;
  currentMultiplier: number;
  learningMode: LearningMode;
  userAnswer: string;
  setUserAnswer: (val: string) => void;
  showFeedback: 'correct' | 'wrong' | null;
  score: number;
  completed: number[];
  difficulty: DifficultyLevel;
  handleSubmit: (e?: React.FormEvent) => void;
  handleModeChange: (mode: LearningMode) => void;
  onBack: () => void;
  showNumberPad: boolean;
  timedMode: boolean;
  timeRemaining: number;
  questionResults: QuestionResult[];
  wrongAnswers: Array<{ table: number; multiplier: number }>;
  currentQuestion: number;
  startTime: number;
  questionStartTime: number;
  progress: MultiplicationProgress;
  voiceEnabled: boolean;
  onRestart: () => void;
}

export function PracticeView({
  selectedTable,
  currentMultiplier,
  learningMode,
  userAnswer,
  setUserAnswer,
  showFeedback,
  score,
  completed,
  difficulty,
  handleSubmit,
  onBack,
  showNumberPad,
  timedMode,
  timeRemaining,
  currentQuestion,
  startTime,
  onRestart
}: PracticeViewProps) {
  const maxMultiplier = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 12;
  const totalQuestions = learningMode === 'mixed' ? 20 : maxMultiplier;
  const isCompleted = currentQuestion > totalQuestions;

  // Render completion screen
  if (isCompleted) {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-8xl mb-4"
          >
            {percentage >= 90 ? '🎉' : percentage >= 70 ? '⭐' : '💪'}
          </motion.div>

          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {percentage >= 90 ? 'Outstanding!' : percentage >= 70 ? 'Great Job!' : 'Keep Practicing!'}
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-4">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>

            <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-xl p-4">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-red-600">{totalQuestions - score}</div>
              <div className="text-sm text-gray-600">Wrong</div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-4">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-600">{minutes}:{seconds.toString().padStart(2, '0')}</div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className={`h-full rounded-full ${
                  percentage >= 90
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                    : percentage >= 70
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-r from-red-400 to-pink-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-2xl font-bold text-gray-800">{percentage}% Accuracy</div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onRestart}
              className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white py-4 rounded-xl text-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-6 h-6" />
              Try Again
            </button>

            <button
              onClick={onBack}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-xl text-xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Render active practice
  const correctAnswer = selectedTable * currentMultiplier;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-4">
            {/* Timer for timed mode */}
            {timedMode && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${
                timeRemaining <= 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'
              }`}>
                <Timer className="w-5 h-5" />
                <span className="text-xl">{timeRemaining}s</span>
              </div>
            )}

            {/* Score */}
            <div className="flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-xl font-bold">
              <Star className="w-5 h-5" />
              <span className="text-xl">{score}/{totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Mode Badge */}
        <div className="text-center mb-4">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
            learningMode === 'timed'
              ? 'bg-red-100 text-red-600'
              : learningMode === 'quiz'
              ? 'bg-purple-100 text-purple-600'
              : learningMode === 'mixed'
              ? 'bg-orange-100 text-orange-600'
              : learningMode === 'review'
              ? 'bg-pink-100 text-pink-600'
              : 'bg-blue-100 text-blue-600'
          }`}>
            {learningMode === 'timed' && '⚡ Speed Challenge'}
            {learningMode === 'quiz' && '🎯 Quiz Mode'}
            {learningMode === 'mixed' && '🔀 Mixed Practice'}
            {learningMode === 'review' && '🔄 Review Mode'}
            {learningMode === 'practice' && '📚 Practice Mode'}
            {learningMode === 'learn' && '📖 Learning Mode'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex gap-1 mb-2">
            {[...Array(totalQuestions)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all ${
                  completed.includes(i + 1)
                    ? 'bg-green-500'
                    : i + 1 === currentQuestion
                    ? 'bg-yellow-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600 text-center">
            Question {currentQuestion} of {totalQuestions}
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <motion.div
            key={`${selectedTable}-${currentMultiplier}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl font-bold text-gray-800 mb-4"
          >
            {selectedTable} × {currentMultiplier} = ?
          </motion.div>

          {(learningMode === 'practice' || learningMode === 'learn') && (
            <p className="text-lg text-gray-600">
              Think: {currentMultiplier} groups of {selectedTable}
            </p>
          )}
        </div>

        {/* Visual Helper for smaller numbers */}
        {learningMode === 'practice' && currentMultiplier <= 5 && selectedTable <= 5 && (
          <div className="mb-8 flex flex-wrap gap-4 justify-center">
            {[...Array(currentMultiplier)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex gap-1">
                {[...Array(selectedTable)].map((_, dotIndex) => (
                  <div
                    key={dotIndex}
                    className="w-8 h-8 bg-purple-400 rounded-full"
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Answer Input */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {showNumberPad ? (
            <div className="space-y-4">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full text-5xl text-center p-6 rounded-2xl border-4 border-purple-300 focus:border-purple-500 outline-none transition-colors"
                placeholder="?"
                autoFocus
                disabled={showFeedback !== null}
              />
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, '✓'].map((btn) => (
                  <motion.button
                    key={btn}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (btn === '←') {
                        setUserAnswer(userAnswer.slice(0, -1));
                      } else if (btn === '✓') {
                        handleSubmit();
                      } else {
                        setUserAnswer(userAnswer + btn);
                      }
                    }}
                    disabled={showFeedback !== null}
                    className={`p-6 text-2xl font-bold rounded-xl transition-all ${
                      btn === '✓'
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white col-span-1'
                        : btn === '←'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    } disabled:opacity-50`}
                  >
                    {btn}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full text-5xl text-center p-6 rounded-2xl border-4 border-purple-300 focus:border-purple-500 outline-none transition-colors"
                placeholder="?"
                autoFocus
                disabled={showFeedback !== null}
              />
              <button
                type="submit"
                disabled={showFeedback !== null || userAnswer === ''}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-5 rounded-2xl text-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                Check Answer
              </button>
            </>
          )}
        </form>

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className={`mt-6 p-6 rounded-2xl text-center text-2xl font-bold ${
                showFeedback === 'correct'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {showFeedback === 'correct' ? (
                <>
                  <div className="text-5xl mb-2">🎉</div>
                  <div>Correct! {selectedTable} × {currentMultiplier} = {correctAnswer}</div>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-2">💭</div>
                  <div>Not quite! The answer is {correctAnswer}</div>
                  <div className="text-lg mt-2 opacity-80">
                    Remember: {selectedTable} × {currentMultiplier} = {correctAnswer}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
