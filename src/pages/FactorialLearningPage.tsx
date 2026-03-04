/**
 * Factorial Learning Page - Enhanced
 * Interactive factorial number learning with visual multiplication
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Hash, Trophy } from 'lucide-react';
import { FeedbackAnimation } from '../components/shared/FeedbackAnimation';
import { useProfiles } from '../context/ProfileContext';
import { useFeedback } from '../hooks/useFeedback';
import { useGameState } from '../hooks/useGameState';
import { GradientButton } from '../components/GradientButton';

interface Props {
  onBack: () => void;
  profileId: string;
}

type Mode = 'learn' | 'practice' | 'challenge';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface FactorialProblem {
  number: number;
  answer: number;
  steps: string[];
}

export function FactorialLearningPage({ onBack, profileId }: Props) {
  const { getProfile, updateProfile } = useProfiles();
  const { celebrateCorrect, announceWrong } = useFeedback();
  const profile = getProfile(profileId);

  const [mode, setMode] = useState<Mode>('learn');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [currentProblem, setCurrentProblem] = useState<FactorialProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const { score, streak, attempts, addCorrect, addWrong } = useGameState();
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showSteps, setShowSteps] = useState(true);

  // Calculate factorial
  const calculateFactorial = (n: number): { answer: number; steps: string[] } => {
    if (n === 0 || n === 1) {
      return { answer: 1, steps: [`${n}! = 1`] };
    }

    const steps: string[] = [];
    let result = 1;
    const factors: number[] = [];

    for (let i = n; i >= 1; i--) {
      factors.push(i);
      result *= i;
    }

    steps.push(`${n}! = ${factors.join(' × ')}`);

    // Show intermediate calculations for smaller numbers
    if (n <= 6) {
      let intermediate = factors[0];
      for (let i = 1; i < factors.length; i++) {
        intermediate *= factors[i];
        steps.push(`${factors.slice(0, i + 1).join(' × ')} = ${intermediate}`);
      }
    } else {
      steps.push(`${n}! = ${result}`);
    }

    return { answer: result, steps };
  };

  // Generate factorial problem based on difficulty
  const generateProblem = (): FactorialProblem => {
    let number: number;

    switch (difficulty) {
      case 'beginner':
        number = Math.floor(Math.random() * 5) + 1; // 1-5
        break;
      case 'intermediate':
        number = Math.floor(Math.random() * 5) + 4; // 4-8
        break;
      case 'advanced':
        number = Math.floor(Math.random() * 5) + 7; // 7-11
        break;
      default:
        number = 3;
    }

    const { answer, steps } = calculateFactorial(number);
    return { number, answer, steps };
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
    const isCorrect = answer === currentProblem.answer;

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      addCorrect('');
      celebrateCorrect(`Correct! ${currentProblem.number} factorial equals ${currentProblem.answer}`);

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
      addWrong('');
      announceWrong(`Not quite. ${currentProblem.number} factorial equals ${currentProblem.answer}`);

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

  // Render visual steps
  const renderSteps = () => {
    if (!currentProblem || !showSteps) return null;

    return (
      <div className="bg-purple-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4 text-center">
          Step-by-Step Calculation
        </h3>
        <div className="space-y-2">
          {currentProblem.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-3 text-center font-mono text-lg text-gray-800"
            >
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  if (!profile) return null;

  // Learn Mode
  if (mode === 'learn') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 relative overflow-hidden">
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <Hash className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-indigo-600 mb-2">Learn Factorials</h1>
              <p className="text-gray-600">Discover the power of factorial numbers</p>
            </div>

            <div className="space-y-6">
              {/* What is a Factorial */}
              <div className="bg-indigo-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-indigo-700 mb-3">What is a Factorial?</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  A factorial (written as n!) is the product of all positive integers from 1 to n.
                  It's a way to count how many different ways you can arrange things!
                </p>
                <div className="bg-white rounded-lg p-4 font-mono text-lg text-center">
                  5! = 5 × 4 × 3 × 2 × 1 = 120
                </div>
              </div>

              {/* Example */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-purple-700 mb-4">Example: 4!</h2>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 font-mono text-center">
                    4! = 4 × 3 × 2 × 1
                  </div>
                  <div className="bg-white rounded-lg p-3 font-mono text-center">
                    = 12 × 2 × 1
                  </div>
                  <div className="bg-white rounded-lg p-3 font-mono text-center">
                    = 24 × 1
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-3 font-bold text-xl text-center">
                    4! = 24
                  </div>
                </div>
              </div>

              {/* Special Cases */}
              <div className="bg-pink-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-pink-700 mb-3">Special Cases</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="font-bold text-pink-700 mb-2">0!</p>
                    <p className="text-3xl">= 1</p>
                    <p className="text-sm text-gray-600 mt-2">By definition</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="font-bold text-pink-700 mb-2">1!</p>
                    <p className="text-3xl">= 1</p>
                    <p className="text-sm text-gray-600 mt-2">Only one way to arrange 1 item</p>
                  </div>
                </div>
              </div>

              {/* Real World Example */}
              <div className="bg-amber-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-amber-700 mb-3">Real-World Application</h2>
                <p className="text-gray-700 mb-3">
                  Imagine you have 3 books. How many different ways can you arrange them on a shelf?
                </p>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <p className="text-center font-mono text-lg">
                    3! = 3 × 2 × 1 = <span className="font-bold text-amber-600">6 ways</span>
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  The first position has 3 choices, the second has 2 remaining choices, and the last has 1 choice.
                </p>
              </div>

              {/* Factorial Growth */}
              <div className="bg-indigo-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-indigo-700 mb-3">Factorial Growth</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { n: 1, fact: 1 },
                    { n: 2, fact: 2 },
                    { n: 3, fact: 6 },
                    { n: 4, fact: 24 },
                    { n: 5, fact: 120 },
                    { n: 6, fact: 720 },
                    { n: 7, fact: 5040 },
                    { n: 8, fact: 40320 },
                  ].map(({ n, fact }) => (
                    <div key={n} className="bg-white rounded-lg p-3 text-center">
                      <p className="font-bold text-indigo-600">{n}!</p>
                      <p className="text-lg">{fact.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-3 text-center">
                  Notice how quickly factorials grow!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <GradientButton
                  onClick={() => setMode('practice')}
                  fromColor="#6366f1"
                  toColor="#a855f7"
                  hoverFromColor="#4f46e5"
                  hoverToColor="#9333ea"
                  className="px-8 py-4 rounded-xl text-lg font-bold shadow-lg"
                >
                  Start Practice
                </GradientButton>
                <GradientButton
                  onClick={() => setMode('challenge')}
                  fromColor="#a855f7"
                  toColor="#ec4899"
                  hoverFromColor="#9333ea"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 relative overflow-hidden">
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
                  <p className="text-2xl font-bold text-indigo-600">{score}/{attempts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-orange-600">🔥 {streak}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition-all"
                >
                  {showSteps ? '👁️ Hide Steps' : '👁️ Show Steps'}
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
              <h2 className="text-3xl font-bold text-indigo-600 mb-2">
                {mode === 'practice' ? 'Practice Mode' : 'Challenge Mode'}
              </h2>
              <div className="flex gap-2 justify-center">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level as DifficultyLevel)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      difficulty === level
                        ? 'bg-indigo-500 text-white'
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
                {renderSteps()}

                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-gray-800 mb-6">
                    {currentProblem.number}! = ?
                  </div>

                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-4xl text-center font-bold border-4 border-indigo-300 rounded-xl px-6 py-4 w-64 focus:border-indigo-500 focus:outline-none"
                    placeholder="?"
                    autoFocus
                  />

                  <FeedbackAnimation feedback={feedback} correctAnswer={currentProblem.answer} />

                  <div className="mt-6">
                    <button
                      onClick={handleSubmit}
                      disabled={userAnswer === ''}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Check Answer
                    </button>
                  </div>
                </div>

                {/* Fun Fact */}
                {difficulty !== 'beginner' && currentProblem.answer > 1000 && (
                  <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <p className="text-amber-700">
                      💡 Fun Fact: {currentProblem.number}! = {currentProblem.answer.toLocaleString()}
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
