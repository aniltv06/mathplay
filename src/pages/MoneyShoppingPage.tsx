/**
 * Money & Shopping Learning Page
 * Interactive learning for money counting and shopping
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import { useGameState } from '../hooks/useGameState';
import { useFeedback } from '../hooks/useFeedback';
import { GradientButton } from '../components/GradientButton';
import { FeedbackAnimation } from '../components/shared/FeedbackAnimation';
import {
  type DifficultyLevel,
  type MoneyProblem,
  generateProblem,
  CoinVisuals,
} from './moneyShoppingHelpers';

interface Props {
  onBack: () => void;
  profileId: string;
}

type Mode = 'learn' | 'practice' | 'challenge';

export function MoneyShoppingPage({ onBack, profileId }: Props) {
  const { getProfile, updateProfile } = useProfiles();
  const { score, streak, attempts, addCorrect, addWrong } = useGameState();
  const { celebrateCorrect, announceWrong } = useFeedback();
  const profile = getProfile(profileId);

  const [mode, setMode] = useState<Mode>('learn');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [currentProblem, setCurrentProblem] = useState<MoneyProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showVisual, setShowVisual] = useState(true);

  // Initialize first problem when mode or difficulty changes
  useEffect(() => {
    if (mode !== 'learn') {
      setCurrentProblem(generateProblem(difficulty));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, difficulty]);

  const handleSubmit = () => {
    if (!currentProblem || userAnswer === '') return;

    const answer = parseInt(userAnswer);
    const isCorrect = answer === currentProblem.answer;

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      addCorrect('');
      celebrateCorrect(`Correct! The answer is ${currentProblem.answer} cents`);

      if (profile) {
        updateProfile(profileId, {
          stats: {
            ...profile.stats,
            totalCorrect: profile.stats.totalCorrect + 1,
            totalSessions: profile.stats.totalSessions,
          },
        });
      }

      setTimeout(() => {
        setCurrentProblem(generateProblem(difficulty));
        setUserAnswer('');
        setFeedback(null);
      }, 1500);
    } else {
      addWrong('');
      announceWrong(`Not quite. The answer is ${currentProblem.answer} cents`);

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

  if (!profile) return null;

  // Learn Mode
  if (mode === 'learn') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-50 bg-white hover:bg-gray-100 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-gray-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          <span className="hidden sm:inline">Back to Home</span>
        </button>

        <div className="relative z-10 px-4 py-8 min-h-screen flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl w-full bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-green-600 mb-2">Learn Money & Shopping</h1>
              <p className="text-gray-600">Master counting money and making smart purchases</p>
            </div>

            <div className="space-y-6">
              {/* US Coins */}
              <div className="bg-green-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-green-700 mb-3">US Coins</h2>
                <p className="text-gray-700 mb-4">
                  Learn the value of each coin and how to count money.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div
                      className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md"
                      style={{ background: 'linear-gradient(to bottom right, #f97316, #b45309)' }}
                    >
                      1¢
                    </div>
                    <p className="font-bold text-green-700">Penny</p>
                    <p className="text-sm text-gray-600">1 cent</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div
                      className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md"
                      style={{ background: 'linear-gradient(to bottom right, #64748b, #334155)' }}
                    >
                      5¢
                    </div>
                    <p className="font-bold text-green-700">Nickel</p>
                    <p className="text-sm text-gray-600">5 cents</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div
                      className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                      style={{ background: 'linear-gradient(to bottom right, #9ca3af, #4b5563)' }}
                    >
                      10¢
                    </div>
                    <p className="font-bold text-green-700">Dime</p>
                    <p className="text-sm text-gray-600">10 cents</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div
                      className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                      style={{ background: 'linear-gradient(to bottom right, #475569, #1e293b)' }}
                    >
                      25¢
                    </div>
                    <p className="font-bold text-green-700">Quarter</p>
                    <p className="text-sm text-gray-600">25 cents</p>
                  </div>
                </div>
              </div>

              {/* Counting Money */}
              <div className="bg-emerald-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-emerald-700 mb-3">Counting Money</h2>
                <p className="text-gray-700 mb-3">
                  To count money, add up the value of all coins together.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-center mb-2 font-bold text-gray-800">Example:</p>
                  <p className="text-center text-gray-700">
                    2 Quarters (25¢ + 25¢) + 1 Dime (10¢) = 60¢
                  </p>
                </div>
              </div>

              {/* Making Change */}
              <div className="bg-teal-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-teal-700 mb-3">Making Change</h2>
                <p className="text-gray-700 mb-3">
                  Change is the money you get back when you pay more than the item costs.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-center mb-2 font-bold text-gray-800">Example:</p>
                  <p className="text-center text-gray-700">
                    Item costs 35¢, you pay 50¢
                  </p>
                  <p className="text-center text-teal-600 font-bold text-xl mt-2">
                    Change = 50¢ - 35¢ = 15¢
                  </p>
                </div>
              </div>

              {/* Shopping Tips */}
              <div className="bg-yellow-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-yellow-700 mb-3">Smart Shopping</h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Always count your money before shopping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Add up item prices to know the total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Check your change when buying something</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Compare prices to find the best deals</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <GradientButton
                  onClick={() => setMode('practice')}
                  fromColor="#22c55e"
                  toColor="#10b981"
                  hoverFromColor="#16a34a"
                  hoverToColor="#059669"
                  className="px-8 py-4 rounded-xl text-lg font-bold shadow-lg"
                >
                  Start Practice
                </GradientButton>
                <GradientButton
                  onClick={() => setMode('challenge')}
                  fromColor="#14b8a6"
                  toColor="#06b6d4"
                  hoverFromColor="#0d9488"
                  hoverToColor="#0891b2"
                  className="px-8 py-4 rounded-xl text-lg font-bold shadow-lg"
                >
                  Challenge Mode
                </GradientButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Practice/Challenge Mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-50 bg-white hover:bg-gray-100 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-gray-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
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
                  <p className="text-2xl font-bold text-green-600">{score}/{attempts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-emerald-600">🔥 {streak}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowVisual(!showVisual)}
                  className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition-all"
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
              <h2 className="text-3xl font-bold text-green-600 mb-2">
                {mode === 'practice' ? 'Practice Mode' : 'Challenge Mode'}
              </h2>
              <div className="flex gap-2 justify-center">
                {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      difficulty === level
                        ? 'bg-green-500 text-white'
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
                {showVisual && <CoinVisuals problem={currentProblem} />}

                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-gray-800 mb-6">
                    {currentProblem.displayQuestion}
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="text-4xl text-center font-bold border-4 border-green-300 rounded-xl px-6 py-4 w-48 focus:border-green-500 focus:outline-none"
                      placeholder="?"
                      autoFocus
                    />
                    <span className="text-3xl text-gray-600">¢</span>
                  </div>

                  <FeedbackAnimation feedback={feedback} correctAnswer={`${currentProblem.answer}¢`} />

                  <div className="mt-6">
                    <button
                      onClick={handleSubmit}
                      disabled={userAnswer === ''}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Check Answer
                    </button>
                  </div>
                </div>

                {/* Hint Section */}
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-amber-700 text-sm">
                    💡 Tip: Count the value of each coin and add them together to get the total!
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
