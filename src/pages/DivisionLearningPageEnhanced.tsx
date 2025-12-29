/**
 * Division Learning Page - Enhanced
 * Interactive division learning with visual grouping
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Divide, CheckCircle, XCircle, Trophy, Volume2, VolumeX } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { useI18n } from '../i18n/I18nContext';

interface Props {
  onBack: () => void;
  profileId: string;
}

type Mode = 'learn' | 'practice' | 'challenge';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface DivisionProblem {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
}

export function DivisionLearningPageEnhanced({ onBack, profileId }: Props) {
  const { getProfile, updateProfile } = useProfiles();
  const { speak } = useVoiceFeedback();
  const { t } = useI18n();
  const profile = getProfile(profileId);

  const [mode, setMode] = useState<Mode>('learn');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [currentProblem, setCurrentProblem] = useState<DivisionProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showVisual, setShowVisual] = useState(true);
  const [streak, setStreak] = useState(0);

  // Generate division problem based on difficulty
  const generateProblem = (): DivisionProblem => {
    let dividend: number, divisor: number, quotient: number, remainder: number;

    switch (difficulty) {
      case 'beginner':
        divisor = Math.floor(Math.random() * 9) + 2; // 2-10
        quotient = Math.floor(Math.random() * 5) + 1; // 1-5
        dividend = divisor * quotient;
        remainder = 0;
        return { dividend, divisor, quotient, remainder };

      case 'intermediate':
        divisor = Math.floor(Math.random() * 9) + 2; // 2-10
        quotient = Math.floor(Math.random() * 10) + 1; // 1-10
        remainder = Math.floor(Math.random() * (divisor - 1)); // 0 to divisor-1
        dividend = (divisor * quotient) + remainder;
        return { dividend, divisor, quotient, remainder };

      case 'advanced':
        divisor = Math.floor(Math.random() * 10) + 5; // 5-14
        quotient = Math.floor(Math.random() * 15) + 5; // 5-19
        remainder = Math.floor(Math.random() * divisor);
        dividend = (divisor * quotient) + remainder;
        return { dividend, divisor, quotient, remainder };

      default:
        return { dividend: 10, divisor: 2, quotient: 5, remainder: 0 };
    }
  };

  // Initialize first problem
  useEffect(() => {
    if (mode !== 'learn') {
      setCurrentProblem(generateProblem());
    }
  }, [mode, difficulty]);

  const handleSubmit = () => {
    if (!currentProblem || userAnswer === '') return;

    const answer = parseInt(userAnswer);
    const isCorrect = answer === currentProblem.quotient;

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setAttempts(prev => prev + 1);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      speak(`Correct! ${currentProblem.dividend} divided by ${currentProblem.divisor} equals ${currentProblem.quotient}`);

      // Update profile stats
      if (profile) {
        updateProfile(profileId, {
          stats: {
            ...profile.stats,
            totalCorrect: profile.stats.totalCorrect + 1,
            totalSessions: profile.stats.totalSessions,
          },
        });
      }

      // Next problem after delay
      setTimeout(() => {
        setCurrentProblem(generateProblem());
        setUserAnswer('');
        setFeedback(null);
      }, 1500);
    } else {
      setStreak(0);
      speak(`Not quite. ${currentProblem.dividend} divided by ${currentProblem.divisor} equals ${currentProblem.quotient}`);

      if (profile) {
        updateProfile(profileId, {
          stats: {
            ...profile.stats,
            totalWrong: profile.stats.totalWrong + 1,
            totalSessions: profile.stats.totalSessions,
          },
        });
      }

      setTimeout(() => {
        setFeedback(null);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Render visual representation of division (grouping)
  const renderVisualDivision = () => {
    if (!currentProblem || !showVisual) return null;

    const { dividend, divisor, quotient } = currentProblem;
    const groups = [];

    // Create groups of objects
    for (let i = 0; i < divisor && i < 10; i++) {
      const items = [];
      for (let j = 0; j < quotient && j < 10; j++) {
        items.push(
          <div
            key={`${i}-${j}`}
            className="w-6 h-6 bg-blue-500 rounded-full"
          />
        );
      }
      groups.push(
        <div key={i} className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
            {items}
          </div>
          <div className="text-xs text-gray-600">Group {i + 1}</div>
        </div>
      );
    }

    return (
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4 text-center">
          Visual Representation
        </h3>
        <p className="text-center text-gray-700 mb-4">
          {dividend} objects divided into {divisor} equal groups
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {groups}
        </div>
        {quotient <= 10 && divisor <= 10 && (
          <p className="text-center text-blue-700 mt-4 font-semibold">
            Each group has {quotient} object{quotient !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    );
  };

  if (!profile) return null;

  // Learn Mode
  if (mode === 'learn') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-400 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-50 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Home</span>
        </button>

        <div className="relative z-10 px-4 py-8 min-h-screen flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl w-full bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                <Divide className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-teal-600 mb-2">Learn Division</h1>
              <p className="text-gray-600">Master division with interactive lessons</p>
            </div>

            <div className="space-y-6">
              {/* What is Division */}
              <div className="bg-teal-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-teal-700 mb-3">What is Division?</h2>
                <p className="text-gray-700 leading-relaxed">
                  Division is splitting a number into equal groups. It's the opposite of multiplication!
                  When we divide 12 ÷ 3, we're asking: "If we split 12 objects into 3 equal groups,
                  how many are in each group?"
                </p>
              </div>

              {/* Example */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-4">Example: 15 ÷ 3</h2>
                <div className="flex flex-wrap gap-4 justify-center mb-4">
                  {[1, 2, 3].map(group => (
                    <div key={group} className="flex flex-col items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(item => (
                          <div key={item} className="w-8 h-8 bg-blue-500 rounded-full" />
                        ))}
                      </div>
                      <p className="text-sm text-blue-700 font-semibold">Group {group}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-blue-800 font-bold text-xl">
                  15 ÷ 3 = 5 (Each group has 5 objects)
                </p>
              </div>

              {/* Division & Multiplication Relationship */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-purple-700 mb-3">
                  Division & Multiplication Connection
                </h2>
                <p className="text-gray-700 mb-3">
                  Division and multiplication are opposites:
                </p>
                <div className="flex items-center justify-center gap-4 text-lg">
                  <span className="bg-white px-4 py-2 rounded-lg font-mono">3 × 5 = 15</span>
                  <span className="text-purple-600">↔️</span>
                  <span className="bg-white px-4 py-2 rounded-lg font-mono">15 ÷ 3 = 5</span>
                </div>
              </div>

              {/* Division Terms */}
              <div className="bg-amber-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-amber-700 mb-3">Division Terms</h2>
                <div className="flex items-center justify-center gap-4 text-xl mb-4">
                  <span className="text-gray-700">20</span>
                  <span className="text-amber-600 font-bold">÷</span>
                  <span className="text-gray-700">4</span>
                  <span className="text-amber-600 font-bold">=</span>
                  <span className="text-gray-700">5</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-bold text-amber-700">Dividend</p>
                    <p className="text-gray-600 text-sm">Number being divided</p>
                    <p className="text-2xl">20</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-bold text-amber-700">Divisor</p>
                    <p className="text-gray-600 text-sm">Number of groups</p>
                    <p className="text-2xl">4</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-bold text-amber-700">Quotient</p>
                    <p className="text-gray-600 text-sm">Answer (per group)</p>
                    <p className="text-2xl">5</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <button
                  onClick={() => setMode('practice')}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all"
                >
                  Start Practice
                </button>
                <button
                  onClick={() => setMode('challenge')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all"
                >
                  Challenge Mode
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Practice/Challenge Mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-400 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-50 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="relative z-10 px-4 py-8">
        {/* Header Stats */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="text-2xl font-bold text-teal-600">{score}/{attempts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-orange-600">🔥 {streak}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowVisual(!showVisual)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-all"
                >
                  {showVisual ? '👁️ Hide Visual' : '👁️ Show Visual'}
                </button>
                <button
                  onClick={() => setMode('learn')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all"
                >
                  📚 Learn
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Practice Area */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-teal-600 mb-2">
                {mode === 'practice' ? 'Practice Mode' : 'Challenge Mode'}
              </h2>
              <div className="flex gap-2 justify-center">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level as DifficultyLevel)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      difficulty === level
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {currentProblem && (
              <>
                {renderVisualDivision()}

                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-gray-800 mb-6">
                    {currentProblem.dividend} ÷ {currentProblem.divisor} = ?
                  </div>

                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-4xl text-center font-bold border-4 border-teal-300 rounded-xl px-6 py-4 w-64 focus:border-teal-500 focus:outline-none"
                    placeholder="?"
                    autoFocus
                  />

                  <AnimatePresence>
                    {feedback && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className={`mt-6 p-4 rounded-xl flex items-center justify-center gap-2 ${
                          feedback === 'correct'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {feedback === 'correct' ? (
                          <>
                            <CheckCircle className="w-6 h-6" />
                            <span className="text-xl font-bold">Correct! Great job!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-6 h-6" />
                            <span className="text-xl font-bold">
                              Try again! The answer is {currentProblem.quotient}
                            </span>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-6">
                    <button
                      onClick={handleSubmit}
                      disabled={userAnswer === ''}
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Check Answer
                    </button>
                  </div>
                </div>

                {/* Hint Section */}
                {difficulty !== 'beginner' && currentProblem.remainder > 0 && (
                  <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <p className="text-amber-700">
                      💡 Hint: This division has a remainder of {currentProblem.remainder}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
