/**
 * Time & Calendar Learning Page
 * Interactive learning for time telling and calendar skills
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { useI18n } from '../i18n/I18nContext';

interface Props {
  onBack: () => void;
  profileId: string;
}

type Mode = 'learn' | 'practice' | 'challenge';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface TimeProblem {
  hours: number;
  minutes: number;
  answer: string;
  displayQuestion: string;
}

export function TimeCalendarPage({ onBack, profileId }: Props) {
  const { getProfile, updateProfile } = useProfiles();
  const { speak } = useVoiceFeedback();
  const { t } = useI18n();
  const profile = getProfile(profileId);

  const [mode, setMode] = useState<Mode>('learn');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [currentProblem, setCurrentProblem] = useState<TimeProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showClock, setShowClock] = useState(true);
  const [streak, setStreak] = useState(0);

  const generateProblem = (): TimeProblem => {
    let hours: number, minutes: number;

    if (difficulty === 'beginner') {
      hours = Math.floor(Math.random() * 12) + 1;
      minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    } else if (difficulty === 'intermediate') {
      hours = Math.floor(Math.random() * 12) + 1;
      minutes = Math.floor(Math.random() * 12) * 5;
    } else {
      hours = Math.floor(Math.random() * 12) + 1;
      minutes = Math.floor(Math.random() * 60);
    }

    const answer = `${hours}:${minutes.toString().padStart(2, '0')}`;

    return {
      hours,
      minutes,
      answer,
      displayQuestion: `What time is shown on the clock?`,
    };
  };

  useEffect(() => {
    if (mode !== 'learn') {
      setCurrentProblem(generateProblem());
    }
  }, [mode, difficulty]);

  const handleSubmit = () => {
    if (!currentProblem || userAnswer === '') return;

    const isCorrect = userAnswer.trim() === currentProblem.answer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setAttempts(prev => prev + 1);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      speak(`Correct! The time is ${currentProblem.answer}`);

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
      speak(`Not quite. The time is ${currentProblem.answer}`);

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

  const renderClock = () => {
    if (!currentProblem || !showClock) return null;

    const { hours, minutes } = currentProblem;
    const hourAngle = ((hours % 12) * 30) + (minutes * 0.5);
    const minuteAngle = minutes * 6;

    return (
      <div className="bg-orange-50 rounded-xl p-6 mb-6">
        <div className="relative w-64 h-64 mx-auto">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="90" fill="white" stroke="#f97316" strokeWidth="4"/>
            {[...Array(12)].map((_, i) => (
              <text
                key={i}
                x={100 + 70 * Math.sin((i * 30) * Math.PI / 180)}
                y={100 - 70 * Math.cos((i * 30) * Math.PI / 180)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-lg font-bold fill-gray-700"
              >
                {i === 0 ? 12 : i}
              </text>
            ))}
            <line
              x1="100"
              y1="100"
              x2={100 + 40 * Math.sin(hourAngle * Math.PI / 180)}
              y2={100 - 40 * Math.cos(hourAngle * Math.PI / 180)}
              stroke="#1e40af"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              x1="100"
              y1="100"
              x2={100 + 60 * Math.sin(minuteAngle * Math.PI / 180)}
              y2={100 - 60 * Math.cos(minuteAngle * Math.PI / 180)}
              stroke="#dc2626"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="5" fill="#374151"/>
          </svg>
        </div>
      </div>
    );
  };

  if (!profile) return null;

  if (mode === 'learn') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 relative overflow-hidden">
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-orange-600 mb-2">Learn Time & Calendar</h1>
              <p className="text-gray-600">Master telling time and understanding calendars</p>
            </div>

            <div className="space-y-6">
              <div className="bg-orange-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-orange-700 mb-3">Reading a Clock</h2>
                <p className="text-gray-700 mb-3">
                  A clock has two hands: the short hand shows hours, and the long hand shows minutes.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-center mb-2">🕐 Hour hand (short) → Points to the hour</p>
                  <p className="text-center">🕐 Minute hand (long) → Points to the minutes</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-red-700 mb-3">Minutes on the Clock</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="font-bold">12 → 0 minutes</p>
                    <p className="text-sm text-gray-600">Top of the hour</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="font-bold">3 → 15 minutes</p>
                    <p className="text-sm text-gray-600">Quarter past</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="font-bold">6 → 30 minutes</p>
                    <p className="text-sm text-gray-600">Half past</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="font-bold">9 → 45 minutes</p>
                    <p className="text-sm text-gray-600">Quarter to</p>
                  </div>
                </div>
              </div>

              <div className="bg-pink-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-pink-700 mb-3">Time Format</h2>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-3xl font-mono mb-2">3:45</p>
                  <p className="text-gray-700">3 hours and 45 minutes</p>
                  <p className="text-sm text-gray-600 mt-2">Read as "three forty-five"</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <button
                  onClick={() => setMode('practice')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all"
                >
                  Start Practice
                </button>
                <button
                  onClick={() => setMode('challenge')}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white hover:text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 relative overflow-hidden">
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
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="text-2xl font-bold text-orange-600">{score}/{attempts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-red-600">🔥 {streak}</p>
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
                  onClick={() => setShowClock(!showClock)}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg transition-all"
                >
                  {showClock ? '👁️ Hide Clock' : '👁️ Show Clock'}
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

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-orange-600 mb-2">
                {mode === 'practice' ? 'Practice Mode' : 'Challenge Mode'}
              </h2>
              <div className="flex gap-2 justify-center">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level as DifficultyLevel)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      difficulty === level
                        ? 'bg-orange-500 text-white'
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
                {renderClock()}

                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-gray-800 mb-6">
                    {currentProblem.displayQuestion}
                  </div>

                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    className="text-4xl text-center font-mono font-bold border-4 border-orange-300 rounded-xl px-6 py-4 w-64 focus:border-orange-500 focus:outline-none"
                    placeholder="0:00"
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
                              Try again! The time is {currentProblem.answer}
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
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Check Answer
                    </button>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-amber-700 text-sm">
                    💡 Tip: Enter time in format "H:MM" (e.g., "3:45" or "12:00")
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
