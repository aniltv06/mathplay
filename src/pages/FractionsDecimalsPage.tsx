/**
 * Fractions & Decimals Learning Page
 * Interactive learning for fractions, decimals, and percentages
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Percent } from 'lucide-react';
import { FeedbackAnimation } from '../components/shared/FeedbackAnimation';
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
type ProblemType = 'fraction-to-decimal' | 'decimal-to-fraction' | 'fraction-to-percent' | 'percent-to-fraction';

interface Problem {
  type: ProblemType;
  numerator?: number;
  denominator?: number;
  decimal?: number;
  percent?: number;
  answer: string;
  displayQuestion: string;
}

export function FractionsDecimalsPage({ onBack, profileId }: Props) {
  const { getProfile, updateProfile } = useProfiles();
  const { speak } = useVoiceFeedback();
  const { t } = useI18n();
  const profile = getProfile(profileId);

  const [mode, setMode] = useState<Mode>('learn');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const { score, streak, attempts, addCorrect, addWrong } = useGameState();
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showVisual, setShowVisual] = useState(true);
  const [previousProblems, setPreviousProblems] = useState<Problem[]>([]);

  // Generate fraction to decimal problem
  const generateFractionToDecimal = (): Problem => {
    const commonFractions = [
      { num: 1, den: 2, dec: 0.5 },
      { num: 1, den: 4, dec: 0.25 },
      { num: 3, den: 4, dec: 0.75 },
      { num: 1, den: 5, dec: 0.2 },
      { num: 2, den: 5, dec: 0.4 },
      { num: 3, den: 5, dec: 0.6 },
      { num: 1, den: 10, dec: 0.1 },
      { num: 3, den: 10, dec: 0.3 },
    ];

    let fraction;

    if (difficulty === 'beginner') {
      fraction = commonFractions[Math.floor(Math.random() * 4)]; // halves, quarters
    } else if (difficulty === 'intermediate') {
      fraction = commonFractions[Math.floor(Math.random() * commonFractions.length)];
    } else {
      // Advanced: random fractions
      const den = Math.floor(Math.random() * 8) + 3; // 3-10
      const num = Math.floor(Math.random() * den) + 1; // 1 to den-1
      const dec = Number((num / den).toFixed(3));
      fraction = { num, den, dec };
    }

    return {
      type: 'fraction-to-decimal',
      numerator: fraction.num,
      denominator: fraction.den,
      answer: fraction.dec.toString(),
      displayQuestion: `${fraction.num}/${fraction.den} = ?`,
    };
  };

  // Generate decimal to fraction problem
  const generateDecimalToFraction = (): Problem => {
    const commonDecimals = [
      { dec: 0.5, num: 1, den: 2 },
      { dec: 0.25, num: 1, den: 4 },
      { dec: 0.75, num: 3, den: 4 },
      { dec: 0.2, num: 1, den: 5 },
      { dec: 0.4, num: 2, den: 5 },
    ];

    const decimal = commonDecimals[Math.floor(Math.random() * commonDecimals.length)];

    return {
      type: 'decimal-to-fraction',
      decimal: decimal.dec,
      answer: `${decimal.num}/${decimal.den}`,
      displayQuestion: `${decimal.dec} = ? (as fraction)`,
    };
  };

  // Generate fraction to percent problem
  const generateFractionToPercent = (): Problem => {
    const commonFractions = [
      { num: 1, den: 2, pct: 50 },
      { num: 1, den: 4, pct: 25 },
      { num: 3, den: 4, pct: 75 },
      { num: 1, den: 5, pct: 20 },
      { num: 2, den: 5, pct: 40 },
      { num: 1, den: 10, pct: 10 },
    ];

    const fraction = commonFractions[Math.floor(Math.random() * commonFractions.length)];

    return {
      type: 'fraction-to-percent',
      numerator: fraction.num,
      denominator: fraction.den,
      percent: fraction.pct,
      answer: fraction.pct.toString(),
      displayQuestion: `${fraction.num}/${fraction.den} = ?%`,
    };
  };

  // Generate percent to fraction problem
  const generatePercentToFraction = (): Problem => {
    const commonPercents = [
      { pct: 50, num: 1, den: 2 },
      { pct: 25, num: 1, den: 4 },
      { pct: 75, num: 3, den: 4 },
      { pct: 20, num: 1, den: 5 },
      { pct: 10, num: 1, den: 10 },
    ];

    const percent = commonPercents[Math.floor(Math.random() * commonPercents.length)];

    return {
      type: 'percent-to-fraction',
      percent: percent.pct,
      answer: `${percent.num}/${percent.den}`,
      displayQuestion: `${percent.pct}% = ? (as fraction)`,
    };
  };

  // Generate problem based on difficulty and mode
  const generateProblem = (): Problem => {
    const problemTypes: ProblemType[] = ['fraction-to-decimal', 'decimal-to-fraction', 'fraction-to-percent', 'percent-to-fraction'];

    // Helper to check if problem is duplicate
    const isProblemDuplicate = (newProblem: Problem): boolean => {
      return previousProblems.some(
        (p) =>
          p.displayQuestion === newProblem.displayQuestion &&
          p.answer === newProblem.answer
      );
    };

    // Generate unique problem (max 100 attempts)
    let problem: Problem;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      const randomType = problemTypes[Math.floor(Math.random() * problemTypes.length)];

      switch (randomType) {
        case 'fraction-to-decimal':
          problem = generateFractionToDecimal();
          break;
        case 'decimal-to-fraction':
          problem = generateDecimalToFraction();
          break;
        case 'fraction-to-percent':
          problem = generateFractionToPercent();
          break;
        case 'percent-to-fraction':
          problem = generatePercentToFraction();
          break;
        default:
          problem = generateFractionToDecimal();
      }

      attempts++;
    } while (isProblemDuplicate(problem) && attempts < maxAttempts);

    // Track this problem
    setPreviousProblems(prev => [...prev, problem]);

    return problem;
  };

  // Initialize first problem when mode or difficulty changes
  useEffect(() => {
    if (mode !== 'learn') {
      setPreviousProblems([]); // Reset previous problems on mode/difficulty change
      setCurrentProblem(generateProblem());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, difficulty]);

  const handleSubmit = () => {
    if (!currentProblem || userAnswer === '') return;

    const answer = userAnswer.trim();
    const isCorrect = answer === currentProblem.answer ||
                     (currentProblem.type === 'decimal-to-fraction' && answer === currentProblem.answer) ||
                     (currentProblem.type === 'percent-to-fraction' && answer === currentProblem.answer);

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      addCorrect('');
      speak(`Correct! ${currentProblem.displayQuestion.replace('?', currentProblem.answer)}`);

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

  // Render visual fraction representation
  const renderFractionVisual = () => {
    if (!currentProblem || !showVisual || !currentProblem.numerator || !currentProblem.denominator) return null;

    const { numerator, denominator } = currentProblem;
    const segments = [];

    for (let i = 0; i < denominator && i < 10; i++) {
      segments.push(
        <div
          key={i}
          className={`h-12 flex items-center justify-center border-2 border-blue-400 ${
            i < numerator ? 'bg-blue-500 text-white' : 'bg-white text-gray-400'
          }`}
        >
          {i + 1}
        </div>
      );
    }

    return (
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4 text-center">
          Visual Representation
        </h3>
        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
          {segments}
        </div>
        <p className="text-center text-blue-700 mt-4">
          {numerator} out of {denominator} parts shaded
        </p>
      </div>
    );
  };

  if (!profile) return null;

  // Learn Mode
  if (mode === 'learn') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 relative overflow-hidden">
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <Percent className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-blue-600 mb-2">Learn Fractions & Decimals</h1>
              <p className="text-gray-600">Master fractions, decimals, and percentages</p>
            </div>

            <div className="space-y-6">
              {/* What are Fractions */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-3">What are Fractions?</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  A fraction represents a part of a whole. It has two numbers: the numerator (top)
                  shows how many parts you have, and the denominator (bottom) shows how many equal
                  parts the whole is divided into.
                </p>
                <div className="bg-white rounded-lg p-4 font-mono text-2xl text-center">
                  <span className="text-blue-600">3</span> / <span className="text-indigo-600">4</span>
                  <p className="text-sm text-gray-600 mt-2">3 parts out of 4 total parts</p>
                </div>
              </div>

              {/* Visual Example */}
              <div className="bg-indigo-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">Visual Example: 3/4</h2>
                <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-4">
                  <div className="h-20 bg-indigo-500 rounded-lg"></div>
                  <div className="h-20 bg-indigo-500 rounded-lg"></div>
                  <div className="h-20 bg-indigo-500 rounded-lg"></div>
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
                <p className="text-center text-indigo-700 font-semibold">
                  3 out of 4 parts are shaded = 3/4 = 0.75 = 75%
                </p>
              </div>

              {/* Decimals */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-purple-700 mb-3">Decimals</h2>
                <p className="text-gray-700 mb-3">
                  Decimals are another way to write fractions. The decimal point separates
                  the whole number from the fractional part.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="font-bold text-purple-700">1/2</p>
                    <p className="text-gray-600">↓</p>
                    <p className="text-2xl">0.5</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="font-bold text-purple-700">1/4</p>
                    <p className="text-gray-600">↓</p>
                    <p className="text-2xl">0.25</p>
                  </div>
                </div>
              </div>

              {/* Percentages */}
              <div className="bg-pink-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-pink-700 mb-3">Percentages</h2>
                <p className="text-gray-700 mb-3">
                  Percent means "out of 100". The % symbol represents percent.
                  To convert a fraction to a percent, divide and multiply by 100.
                </p>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-xl mb-2">1/2 = 0.5 = <span className="text-pink-600 font-bold">50%</span></p>
                  <p className="text-sm text-gray-600">50 out of 100 parts</p>
                </div>
              </div>

              {/* Common Conversions */}
              <div className="bg-amber-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-amber-700 mb-3">Common Conversions</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { frac: '1/2', dec: '0.5', pct: '50%' },
                    { frac: '1/4', dec: '0.25', pct: '25%' },
                    { frac: '3/4', dec: '0.75', pct: '75%' },
                    { frac: '1/5', dec: '0.2', pct: '20%' },
                    { frac: '1/10', dec: '0.1', pct: '10%' },
                    { frac: '1/3', dec: '0.33', pct: '33%' },
                  ].map(({ frac, dec, pct }) => (
                    <div key={frac} className="bg-white rounded-lg p-3 text-center text-sm">
                      <p className="font-bold text-amber-700">{frac}</p>
                      <p className="text-gray-600">{dec}</p>
                      <p className="text-amber-600">{pct}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <GradientButton
                  onClick={() => setMode('practice')}
                  fromColor="#3b82f6"
                  toColor="#6366f1"
                  hoverFromColor="#2563eb"
                  hoverToColor="#4f46e5"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 relative overflow-hidden">
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
                  <p className="text-2xl font-bold text-blue-600">{score}/{attempts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-orange-600">🔥 {streak}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowVisual(!showVisual)}
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg transition-all"
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
              <h2 className="text-3xl font-bold text-blue-600 mb-2">
                {mode === 'practice' ? 'Practice Mode' : 'Challenge Mode'}
              </h2>
              <div className="flex gap-2 justify-center">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level as DifficultyLevel)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      difficulty === level
                        ? 'bg-blue-500 text-white'
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
                {renderFractionVisual()}

                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-gray-800 mb-6">
                    {currentProblem.displayQuestion}
                  </div>

                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-4xl text-center font-bold border-4 border-blue-300 rounded-xl px-6 py-4 w-64 focus:border-blue-500 focus:outline-none"
                    placeholder="?"
                    autoFocus
                  />

                  <FeedbackAnimation feedback={feedback} correctAnswer={currentProblem.answer} />

                  <div className="mt-6">
                    <button
                      onClick={handleSubmit}
                      disabled={userAnswer === ''}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Check Answer
                    </button>
                  </div>
                </div>

                {/* Hint Section */}
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-amber-700 text-sm">
                    💡 Tip: For fractions, use format "1/2". For decimals, use "0.5". For percents, just use the number like "50".
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
