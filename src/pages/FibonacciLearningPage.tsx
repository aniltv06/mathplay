/**
 * Fibonacci Learning Page - Enhanced
 * Interactive Fibonacci series learning with nature connections
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, TrendingUp, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { useGameState } from '../hooks/useGameState';
import { useI18n } from '../i18n/I18nContext';
import { GradientButton } from '../components/GradientButton';

interface Props {
  onBack: () => void;
  profileId: string;
}

type Mode = 'learn' | 'practice' | 'challenge';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface FibonacciProblem {
  position: number;
  answer: number;
  sequence: number[];
}

export function FibonacciLearningPage({ onBack, profileId }: Props) {
  const { getProfile, updateProfile } = useProfiles();
  const { speak } = useVoiceFeedback();
  const { t } = useI18n();
  const profile = getProfile(profileId);

  const [mode, setMode] = useState<Mode>('learn');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [currentProblem, setCurrentProblem] = useState<FibonacciProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const { score, streak, attempts, addCorrect, addWrong } = useGameState();
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showSequence, setShowSequence] = useState(true);

  // Generate Fibonacci sequence up to n terms
  const generateFibonacci = (n: number): number[] => {
    if (n <= 0) return [];
    if (n === 1) return [1];
    if (n === 2) return [1, 1];

    const sequence = [1, 1];
    for (let i = 2; i < n; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
  };

  // Generate Fibonacci problem based on difficulty
  const generateProblem = (): FibonacciProblem => {
    let position: number;

    switch (difficulty) {
      case 'beginner':
        position = Math.floor(Math.random() * 6) + 3; // 3-8
        break;
      case 'intermediate':
        position = Math.floor(Math.random() * 7) + 7; // 7-13
        break;
      case 'advanced':
        position = Math.floor(Math.random() * 7) + 12; // 12-18
        break;
      default:
        position = 5;
    }

    const sequence = generateFibonacci(position);
    const answer = sequence[position - 1];

    return { position, answer, sequence };
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
      speak(`Correct! The ${currentProblem.position}th Fibonacci number is ${currentProblem.answer}`);

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
      speak(`Not quite. The ${currentProblem.position}th Fibonacci number is ${currentProblem.answer}`);

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

  // Render Fibonacci sequence visualization
  const renderSequence = () => {
    if (!currentProblem || !showSequence) return null;

    return (
      <div className="bg-pink-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-pink-800 mb-4 text-center">
          Fibonacci Sequence (positions 1-{currentProblem.position})
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {currentProblem.sequence.map((num, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-lg p-3 text-center font-mono min-w-[60px] ${
                index === currentProblem.position - 1
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xl'
                  : 'bg-white text-gray-800'
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">#{index + 1}</div>
              <div className={index === currentProblem.position - 1 ? 'text-2xl' : 'text-lg'}>
                {num}
              </div>
            </motion.div>
          ))}
        </div>
        {currentProblem.position > 2 && (
          <p className="text-center text-pink-700 mt-4 text-sm">
            Each number = sum of previous two numbers
          </p>
        )}
      </div>
    );
  };

  // Render golden spiral visualization
  const renderGoldenSpiral = () => {
    return (
      <div
        className="relative w-full max-w-md mx-auto h-80 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-200"
        style={{
          background: 'linear-gradient(to bottom right, rgb(254, 243, 199), rgb(254, 215, 170), rgb(253, 186, 116))'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        <svg viewBox="0 0 400 300" className="w-full h-full p-4">
          {/* Golden spiral squares with Fibonacci numbers */}
          <g>
            {/* Largest square - 89 */}
            <rect x="10" y="130" width="89" height="89" fill="#fbbf24" opacity="0.4" stroke="#f59e0b" strokeWidth="3" rx="4" />
            <text x="55" y="180" textAnchor="middle" fill="#92400e" fontSize="24" fontWeight="bold">89</text>

            {/* 55 square */}
            <rect x="99" y="130" width="55" height="55" fill="#fb923c" opacity="0.4" stroke="#f97316" strokeWidth="3" rx="3" />
            <text x="126.5" y="162" textAnchor="middle" fill="#9a3412" fontSize="20" fontWeight="bold">55</text>

            {/* 34 square */}
            <rect x="99" y="75" width="34" height="34" fill="#f87171" opacity="0.4" stroke="#ef4444" strokeWidth="3" rx="2" />
            <text x="116" y="96" textAnchor="middle" fill="#991b1b" fontSize="16" fontWeight="bold">34</text>

            {/* 21 square */}
            <rect x="133" y="75" width="21" height="21" fill="#fb7185" opacity="0.4" stroke="#ec4899" strokeWidth="2" rx="2" />
            <text x="143.5" y="88" textAnchor="middle" fill="#831843" fontSize="14" fontWeight="bold">21</text>

            {/* 13 square */}
            <rect x="133" y="96" width="13" height="13" fill="#e879f9" opacity="0.4" stroke="#d946ef" strokeWidth="2" rx="1" />
            <text x="139.5" y="104" textAnchor="middle" fill="#701a75" fontSize="11" fontWeight="bold">13</text>

            {/* 8 square */}
            <rect x="146" y="96" width="8" height="8" fill="#c084fc" opacity="0.5" stroke="#a855f7" strokeWidth="2" rx="1" />
            <text x="150" y="101.5" textAnchor="middle" fill="#581c87" fontSize="8" fontWeight="bold">8</text>
          </g>

          {/* Enhanced spiral curve with glow effect */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <path
            d="M 10 219 Q 10 130, 99 130 Q 154 130, 154 75 Q 154 54, 133 54 Q 120 54, 120 75 Q 120 96, 133 96 Q 146 96, 146 104 Q 150 104, 154 104"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="4"
            opacity="0.9"
            filter="url(#glow)"
          />

          {/* Small decorative dots at key points */}
          <circle cx="10" cy="219" r="4" fill="#7c3aed" opacity="0.8" />
          <circle cx="99" cy="130" r="3" fill="#7c3aed" opacity="0.8" />
          <circle cx="154" cy="75" r="3" fill="#7c3aed" opacity="0.8" />
        </svg>

        <div className="absolute bottom-4 left-0 right-0 text-center">
          <div className="inline-block bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <p className="text-sm font-semibold text-amber-900">Fibonacci Spiral in Nature 🌻</p>
          </div>
        </div>
      </div>
    );
  };

  if (!profile) return null;

  // Learn Mode
  if (mode === 'learn') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400 relative overflow-hidden">
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-rose-600 mb-2">Learn Fibonacci</h1>
              <p className="text-gray-600">Discover nature's magical number sequence</p>
            </div>

            <div className="space-y-6">
              {/* What is Fibonacci */}
              <div className="bg-rose-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-rose-700 mb-3">What is the Fibonacci Sequence?</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  The Fibonacci sequence is a special pattern where each number is the sum of the two numbers before it.
                  It starts with 1, 1, and then each new number is found by adding the previous two!
                </p>
                <div className="bg-white rounded-lg p-4 font-mono text-lg text-center">
                  1, 1, 2, 3, 5, 8, 13, 21, 34, 55...
                </div>
              </div>

              {/* How it Works */}
              <div className="bg-pink-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-pink-700 mb-4">How It Works</h2>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 font-mono text-center">
                    Start: 1, 1
                  </div>
                  <div className="bg-white rounded-lg p-3 font-mono text-center">
                    1 + 1 = <span className="text-pink-600 font-bold">2</span> → 1, 1, 2
                  </div>
                  <div className="bg-white rounded-lg p-3 font-mono text-center">
                    1 + 2 = <span className="text-pink-600 font-bold">3</span> → 1, 1, 2, 3
                  </div>
                  <div className="bg-white rounded-lg p-3 font-mono text-center">
                    2 + 3 = <span className="text-pink-600 font-bold">5</span> → 1, 1, 2, 3, 5
                  </div>
                  <div className="bg-white rounded-lg p-3 font-mono text-center">
                    3 + 5 = <span className="text-pink-600 font-bold">8</span> → 1, 1, 2, 3, 5, 8
                  </div>
                </div>
              </div>

              {/* Fibonacci in Nature */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-purple-700 mb-3">Fibonacci in Nature 🌻</h2>
                <p className="text-gray-700 mb-4">
                  The Fibonacci sequence appears everywhere in nature! Look for these patterns:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-3xl mb-2">🌻</div>
                    <p className="text-sm">Sunflower petals</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-3xl mb-2">🐚</div>
                    <p className="text-sm">Nautilus shells</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-3xl mb-2">🌀</div>
                    <p className="text-sm">Hurricane spirals</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-3xl mb-2">🌲</div>
                    <p className="text-sm">Pine cone patterns</p>
                  </div>
                </div>
              </div>

              {/* Golden Spiral */}
              <div className="bg-amber-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-amber-700 mb-3">The Golden Spiral</h2>
                <p className="text-gray-700 mb-4">
                  When you draw squares with Fibonacci numbers as sides and connect them with curves,
                  you get a beautiful spiral found in nature!
                </p>
                {renderGoldenSpiral()}
              </div>

              {/* Fibonacci Sequence Table */}
              <div className="bg-indigo-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-indigo-700 mb-3">First 12 Fibonacci Numbers</h2>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {generateFibonacci(12).map((num, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">#{index + 1}</p>
                      <p className="text-lg font-bold text-indigo-600">{num}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fun Facts */}
              <div className="bg-green-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-green-700 mb-3">Fun Facts! 🌟</h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Named after Leonardo Fibonacci, an Italian mathematician from the 1200s</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>The ratio between consecutive Fibonacci numbers approaches the Golden Ratio (1.618...)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Used in computer algorithms, art, music, and architecture!</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <GradientButton
                  onClick={() => setMode('practice')}
                  fromColor="#f43f5e"
                  toColor="#ec4899"
                  hoverFromColor="#e11d48"
                  hoverToColor="#db2777"
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
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400 relative overflow-hidden">
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
                  <p className="text-2xl font-bold text-rose-600">{score}/{attempts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-orange-600">🔥 {streak}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold text-pink-600">
                    {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSequence(!showSequence)}
                  className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-lg transition-all"
                >
                  {showSequence ? '👁️ Hide Sequence' : '👁️ Show Sequence'}
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
              <h2 className="text-3xl font-bold text-rose-600 mb-2">
                {mode === 'practice' ? 'Practice Mode' : 'Challenge Mode'}
              </h2>
              <div className="flex gap-2 justify-center">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level as DifficultyLevel)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      difficulty === level
                        ? 'bg-rose-500 text-white'
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
                {renderSequence()}

                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-gray-800 mb-6">
                    What is the {currentProblem.position}
                    {currentProblem.position === 1 ? 'st' :
                     currentProblem.position === 2 ? 'nd' :
                     currentProblem.position === 3 ? 'rd' : 'th'} Fibonacci number?
                  </div>

                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-4xl text-center font-bold border-4 border-pink-300 rounded-xl px-6 py-4 w-64 focus:border-pink-500 focus:outline-none"
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
                      className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Check Answer
                    </button>
                  </div>
                </div>

                {/* Fun Fact */}
                {currentProblem.answer > 100 && (
                  <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <p className="text-amber-700">
                      🌟 Amazing! The {currentProblem.position}th Fibonacci number is {currentProblem.answer.toLocaleString()}
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
