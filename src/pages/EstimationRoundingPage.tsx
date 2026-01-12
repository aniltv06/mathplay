/**
 * Estimation & Rounding Learning Page
 * Interactive learning for estimation and rounding skills
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Target, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { useI18n } from '../i18n/I18nContext';
import { GradientButton } from '../components/GradientButton';

interface Props {
  onBack: () => void;
  profileId: string;
}

type Mode = 'learn' | 'practice' | 'challenge';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type ProblemType = 'round-to-10' | 'round-to-100' | 'round-to-1000' | 'estimate-sum' | 'estimate-product';

interface Problem {
  type: ProblemType;
  number?: number;
  roundTo?: number;
  num1?: number;
  num2?: number;
  answer: number;
  displayQuestion: string;
  acceptableRange?: { min: number; max: number };
}

export function EstimationRoundingPage({ onBack, profileId }: Props) {
  const { getProfile, updateProfile } = useProfiles();
  const { speak } = useVoiceFeedback();
  const { t } = useI18n();
  const profile = getProfile(profileId);

  const [mode, setMode] = useState<Mode>('learn');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showVisual, setShowVisual] = useState(true);
  const [streak, setStreak] = useState(0);

  // Round number to nearest place value
  const roundToNearest = (num: number, roundTo: number): number => {
    return Math.round(num / roundTo) * roundTo;
  };

  // Generate rounding problem
  const generateRoundingProblem = (): Problem => {
    let number: number;
    let roundTo: number;
    let type: ProblemType;

    if (difficulty === 'beginner') {
      roundTo = 10;
      number = Math.floor(Math.random() * 90) + 10; // 10-99
      type = 'round-to-10';
    } else if (difficulty === 'intermediate') {
      roundTo = Math.random() < 0.5 ? 10 : 100;
      number = roundTo === 10
        ? Math.floor(Math.random() * 90) + 10
        : Math.floor(Math.random() * 900) + 100;
      type = roundTo === 10 ? 'round-to-10' : 'round-to-100';
    } else {
      const options = [10, 100, 1000];
      roundTo = options[Math.floor(Math.random() * options.length)];
      if (roundTo === 1000) {
        number = Math.floor(Math.random() * 9000) + 1000;
        type = 'round-to-1000';
      } else if (roundTo === 100) {
        number = Math.floor(Math.random() * 900) + 100;
        type = 'round-to-100';
      } else {
        number = Math.floor(Math.random() * 90) + 10;
        type = 'round-to-10';
      }
    }

    const answer = roundToNearest(number, roundTo);

    return {
      type,
      number,
      roundTo,
      answer,
      displayQuestion: `Round ${number} to the nearest ${roundTo}`,
    };
  };

  // Generate estimation problem
  const generateEstimationProblem = (): Problem => {
    let num1: number, num2: number;
    let type: ProblemType;

    if (difficulty === 'beginner') {
      num1 = Math.floor(Math.random() * 50) + 10; // 10-59
      num2 = Math.floor(Math.random() * 50) + 10;
      type = 'estimate-sum';
    } else if (difficulty === 'intermediate') {
      num1 = Math.floor(Math.random() * 90) + 10; // 10-99
      num2 = Math.floor(Math.random() * 90) + 10;
      type = Math.random() < 0.5 ? 'estimate-sum' : 'estimate-product';
    } else {
      num1 = Math.floor(Math.random() * 900) + 100; // 100-999
      num2 = Math.floor(Math.random() * 900) + 100;
      type = Math.random() < 0.5 ? 'estimate-sum' : 'estimate-product';
    }

    const roundTo = difficulty === 'beginner' ? 10 : difficulty === 'intermediate' ? 10 : 100;
    const rounded1 = roundToNearest(num1, roundTo);
    const rounded2 = roundToNearest(num2, roundTo);

    let answer: number;
    let displayQuestion: string;
    let acceptableRange: { min: number; max: number };

    if (type === 'estimate-sum') {
      answer = rounded1 + rounded2;
      displayQuestion = `Estimate: ${num1} + ${num2}`;
      acceptableRange = {
        min: answer - roundTo,
        max: answer + roundTo,
      };
    } else {
      answer = rounded1 * rounded2;
      displayQuestion = `Estimate: ${num1} × ${num2}`;
      acceptableRange = {
        min: Math.floor(answer * 0.8),
        max: Math.ceil(answer * 1.2),
      };
    }

    return {
      type,
      num1,
      num2,
      answer,
      displayQuestion,
      acceptableRange,
    };
  };

  // Generate problem based on mode
  const generateProblem = (): Problem => {
    if (Math.random() < 0.6) {
      return generateRoundingProblem();
    } else {
      return generateEstimationProblem();
    }
  };

  // Initialize first problem when mode or difficulty changes
  useEffect(() => {
    if (mode !== 'learn') {
      setCurrentProblem(generateProblem());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, difficulty]);

  const handleSubmit = () => {
    if (!currentProblem || userAnswer === '') return;

    const answer = parseInt(userAnswer);
    let isCorrect = false;

    if (currentProblem.acceptableRange) {
      isCorrect = answer >= currentProblem.acceptableRange.min && answer <= currentProblem.acceptableRange.max;
    } else {
      isCorrect = answer === currentProblem.answer;
    }

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setAttempts(prev => prev + 1);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      speak(`Correct! The answer is ${currentProblem.answer}`);

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
        setCurrentProblem(generateProblem());
        setUserAnswer('');
        setFeedback(null);
      }, 1500);
    } else {
      setStreak(0);
      speak(`Not quite. The answer is ${currentProblem.answer}`);

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

  // Render number line visualization
  const renderNumberLine = () => {
    if (!currentProblem || !showVisual || !currentProblem.number || !currentProblem.roundTo) return null;

    const { number, roundTo, answer } = currentProblem;
    const lowerBound = Math.floor(number / roundTo) * roundTo;
    const upperBound = lowerBound + roundTo;

    return (
      <div className="bg-amber-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-amber-800 mb-4 text-center">
          Number Line Visualization
        </h3>
        <div className="relative h-20">
          <div className="absolute top-8 left-0 right-0 h-2 bg-amber-300 rounded"></div>

          {/* Markers */}
          <div className="absolute top-0 left-0 flex flex-col items-center">
            <div className="w-1 h-4 bg-amber-600"></div>
            <span className="text-sm font-bold text-amber-800 mt-1">{lowerBound}</span>
          </div>

          <div className="absolute top-0 right-0 flex flex-col items-center">
            <div className="w-1 h-4 bg-amber-600"></div>
            <span className="text-sm font-bold text-amber-800 mt-1">{upperBound}</span>
          </div>

          {/* Current number */}
          <div
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${((number - lowerBound) / roundTo) * 100}%` }}
          >
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-xs font-bold text-blue-800 mt-1">{number}</span>
          </div>

          {/* Answer */}
          {answer === lowerBound && (
            <div className="absolute -bottom-6 left-0 text-green-600 font-bold text-sm">
              ← Rounds to {answer}
            </div>
          )}
          {answer === upperBound && (
            <div className="absolute -bottom-6 right-0 text-green-600 font-bold text-sm">
              Rounds to {answer} →
            </div>
          )}
        </div>
        <p className="text-center text-amber-700 mt-8 text-sm">
          {number} is closer to {answer}
        </p>
      </div>
    );
  };

  if (!profile) return null;

  // Learn Mode
  if (mode === 'learn') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-50 bg-white hover:bg-gray-100 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-gray-800"
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-amber-600 mb-2">Learn Estimation & Rounding</h1>
              <p className="text-gray-600">Develop number sense and quick mental math</p>
            </div>

            <div className="space-y-6">
              {/* What is Rounding */}
              <div className="bg-amber-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-amber-700 mb-3">What is Rounding?</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Rounding means finding a number that is close to the original number but easier to work with.
                  We round to the nearest 10, 100, or 1000 to make calculations simpler!
                </p>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xl text-center mb-2">
                    <span className="text-gray-700">47</span> rounds to{' '}
                    <span className="text-amber-600 font-bold">50</span> (nearest 10)
                  </p>
                  <p className="text-sm text-gray-600 text-center">47 is closer to 50 than to 40</p>
                </div>
              </div>

              {/* Rounding Rules */}
              <div className="bg-orange-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-orange-700 mb-4">Rounding Rules</h2>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-bold text-orange-700 mb-2">Rule 1: Look at the digit to the right</p>
                    <p className="text-gray-700">To round to tens, look at the ones digit</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-bold text-orange-700 mb-2">Rule 2: If digit is 5 or more → Round UP</p>
                    <p className="text-gray-700">Example: 67 → 70 (7 ≥ 5, so round up)</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-bold text-orange-700 mb-2">Rule 3: If digit is less than 5 → Round DOWN</p>
                    <p className="text-gray-700">Example: 43 → 40 (3 &lt; 5, so round down)</p>
                  </div>
                </div>
              </div>

              {/* Examples */}
              <div className="bg-red-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-red-700 mb-4">Examples</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg mb-2"><span className="font-bold">Round 34 to nearest 10:</span></p>
                    <p className="text-gray-700">Look at ones digit: 4</p>
                    <p className="text-gray-700">4 &lt; 5, so round DOWN</p>
                    <p className="text-2xl text-red-600 font-bold mt-2">34 → 30</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-lg mb-2"><span className="font-bold">Round 78 to nearest 10:</span></p>
                    <p className="text-gray-700">Look at ones digit: 8</p>
                    <p className="text-gray-700">8 ≥ 5, so round UP</p>
                    <p className="text-2xl text-red-600 font-bold mt-2">78 → 80</p>
                  </div>
                </div>
              </div>

              {/* Estimation */}
              <div className="bg-yellow-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-yellow-700 mb-3">What is Estimation?</h2>
                <p className="text-gray-700 mb-3">
                  Estimation means finding an approximate answer that's close to the exact answer.
                  It's useful for checking if your answer makes sense!
                </p>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-lg text-center mb-2">Estimate: 38 + 52</p>
                  <p className="text-gray-600 text-center">Round: 40 + 50 = 90</p>
                  <p className="text-sm text-gray-500 text-center mt-2">(Exact answer is 90)</p>
                </div>
              </div>

              {/* Real-World Uses */}
              <div className="bg-green-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-green-700 mb-3">Real-World Uses</h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Shopping: Estimate total cost before checkout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Time: Round times to plan your day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Distance: Estimate travel distances</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Checking: Verify if calculator answers are reasonable</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <GradientButton
                  onClick={() => setMode('practice')}
                  fromColor="#f59e0b"
                  toColor="#f97316"
                  hoverFromColor="#d97706"
                  hoverToColor="#ea580c"
                  className="px-8 py-4 rounded-xl text-lg font-bold shadow-lg"
                >
                  Start Practice
                </GradientButton>
                <GradientButton
                  onClick={() => setMode('challenge')}
                  fromColor="#ef4444"
                  toColor="#ec4899"
                  hoverFromColor="#dc2626"
                  hoverToColor="#db2777"
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
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-50 bg-white hover:bg-gray-100 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-gray-800"
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
                  <p className="text-2xl font-bold text-amber-600">{score}/{attempts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-orange-600">🔥 {streak}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold text-red-600">
                    {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowVisual(!showVisual)}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg transition-all"
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
              <h2 className="text-3xl font-bold text-amber-600 mb-2">
                {mode === 'practice' ? 'Practice Mode' : 'Challenge Mode'}
              </h2>
              <div className="flex gap-2 justify-center">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level as DifficultyLevel)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      difficulty === level
                        ? 'bg-amber-500 text-white'
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
                {renderNumberLine()}

                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-gray-800 mb-6">
                    {currentProblem.displayQuestion}
                  </div>

                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-4xl text-center font-bold border-4 border-amber-300 rounded-xl px-6 py-4 w-64 focus:border-amber-500 focus:outline-none"
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
                              Try again! The answer is {currentProblem.answer}
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
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Check Answer
                    </button>
                  </div>
                </div>

                {/* Hint Section */}
                {currentProblem.acceptableRange && (
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-blue-700 text-sm">
                      💡 Tip: For estimation, answers within a reasonable range are accepted!
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
