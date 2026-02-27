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
import { GradientButton } from '../components/GradientButton';

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
  const [previousProblems, setPreviousProblems] = useState<DivisionProblem[]>([]);

  // Generate division problem based on difficulty
  const generateProblem = (): DivisionProblem => {
    // Helper to check if problem is duplicate
    const isProblemDuplicate = (newProblem: DivisionProblem): boolean => {
      return previousProblems.some(
        (p) =>
          p.dividend === newProblem.dividend &&
          p.divisor === newProblem.divisor
      );
    };

    // Generate unique problem (max 100 attempts)
    let problem: DivisionProblem;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      let dividend: number, divisor: number, quotient: number, remainder: number;

      switch (difficulty) {
        case 'beginner':
          divisor = Math.floor(Math.random() * 9) + 2; // 2-10
          quotient = Math.floor(Math.random() * 5) + 1; // 1-5
          dividend = divisor * quotient;
          remainder = 0;
          problem = { dividend, divisor, quotient, remainder };
          break;

        case 'intermediate':
          divisor = Math.floor(Math.random() * 9) + 2; // 2-10
          quotient = Math.floor(Math.random() * 10) + 1; // 1-10
          remainder = Math.floor(Math.random() * (divisor - 1)); // 0 to divisor-1
          dividend = (divisor * quotient) + remainder;
          problem = { dividend, divisor, quotient, remainder };
          break;

        case 'advanced':
          divisor = Math.floor(Math.random() * 10) + 5; // 5-14
          quotient = Math.floor(Math.random() * 15) + 5; // 5-19
          remainder = Math.floor(Math.random() * divisor);
          dividend = (divisor * quotient) + remainder;
          problem = { dividend, divisor, quotient, remainder };
          break;

        default:
          problem = { dividend: 10, divisor: 2, quotient: 5, remainder: 0 };
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
          aria-label="Go back to Home"
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
                <p className="text-gray-700 leading-relaxed mb-3">
                  Division is <strong>splitting a number into equal groups</strong>. It is the opposite of multiplication!
                  When we write <strong>12 ÷ 3</strong>, we are asking one of two questions:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold mt-0.5">•</span>
                    <span className="text-gray-700"><strong>Sharing:</strong> "If 12 biscuits are shared equally among 3 children, how many does each child get?" → 4 each</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold mt-0.5">•</span>
                    <span className="text-gray-700"><strong>Grouping:</strong> "How many groups of 3 can I make from 12?" → 4 groups</span>
                  </li>
                </ul>
                <p className="text-teal-700 font-semibold mt-3 text-sm">Both give the same answer — 4. These are the two ways to think about division!</p>
              </div>

              {/* Example with visual */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-4">Example: 15 ÷ 3</h2>
                <p className="text-gray-700 mb-4">Imagine 15 apples shared equally into 3 groups:</p>
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
                  15 ÷ 3 = 5 ✓ Each group has exactly 5
                </p>
                <p className="text-center text-blue-600 text-sm mt-2">
                  Check: 3 groups × 5 each = 15 total ✓
                </p>
              </div>

              {/* Division Terms */}
              <div className="bg-amber-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-amber-700 mb-4">Key Vocabulary</h2>
                <div className="flex items-center justify-center gap-2 text-2xl font-mono mb-5 flex-wrap">
                  <span className="bg-amber-200 px-3 py-1 rounded-lg text-amber-800 font-bold">20</span>
                  <span className="text-amber-600 font-bold">÷</span>
                  <span className="bg-blue-200 px-3 py-1 rounded-lg text-blue-800 font-bold">4</span>
                  <span className="text-gray-600 font-bold">=</span>
                  <span className="bg-green-200 px-3 py-1 rounded-lg text-green-800 font-bold">5</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-amber-100 rounded-lg p-3 border-2 border-amber-300">
                    <p className="font-bold text-amber-800 text-lg">Dividend</p>
                    <p className="text-amber-600 text-xs mb-1">The number being divided up</p>
                    <p className="text-3xl font-bold text-amber-700">20</p>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-3 border-2 border-blue-300">
                    <p className="font-bold text-blue-800 text-lg">Divisor</p>
                    <p className="text-blue-600 text-xs mb-1">How many groups (or group size)</p>
                    <p className="text-3xl font-bold text-blue-700">4</p>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3 border-2 border-green-300">
                    <p className="font-bold text-green-800 text-lg">Quotient</p>
                    <p className="text-green-600 text-xs mb-1">The answer</p>
                    <p className="text-3xl font-bold text-green-700">5</p>
                  </div>
                </div>
                <p className="text-center text-gray-600 text-sm mt-3">Memory tip: <strong>Dividend ÷ Divisor = Quotient</strong></p>
              </div>

              {/* Division & Multiplication Fact Families */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-purple-700 mb-3">
                  Fact Families — Your Secret Weapon!
                </h2>
                <p className="text-gray-700 mb-4">
                  Every multiplication fact creates a <strong>fact family</strong> — two multiplication and two division sentences that all belong together.
                </p>
                <div className="bg-white rounded-xl p-4 border-2 border-purple-200 mb-3">
                  <p className="text-center font-bold text-purple-700 mb-3">Fact Family for 3, 5, and 15:</p>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-purple-100 rounded-lg p-2 font-mono text-lg">3 × 5 = 15</div>
                    <div className="bg-purple-100 rounded-lg p-2 font-mono text-lg">5 × 3 = 15</div>
                    <div className="bg-teal-100 rounded-lg p-2 font-mono text-lg">15 ÷ 3 = 5</div>
                    <div className="bg-teal-100 rounded-lg p-2 font-mono text-lg">15 ÷ 5 = 3</div>
                  </div>
                </div>
                <p className="text-purple-700 font-semibold text-sm">
                  Tip: If you know your multiplication tables, you already know your division facts! If 7 × 8 = 56, then 56 ÷ 7 = 8 and 56 ÷ 8 = 7.
                </p>
              </div>

              {/* Remainders */}
              <div className="bg-orange-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-orange-700 mb-3">Remainders — When It Doesn't Divide Evenly</h2>
                <p className="text-gray-700 mb-4">
                  Sometimes a number cannot be split into perfectly equal groups. The amount left over is called the <strong>remainder</strong>.
                </p>
                <div className="bg-white rounded-xl p-4 border-2 border-orange-200 mb-4">
                  <p className="text-center font-bold text-orange-700 mb-2">Example: 17 ÷ 5</p>
                  <div className="flex flex-wrap gap-2 justify-center mb-3">
                    {[1,2,3].map(g => (
                      <div key={g} className="bg-orange-100 rounded-lg p-2 text-center">
                        <div className="flex gap-1 mb-1">
                          {[1,2,3,4,5].map(i => <div key={i} className="w-5 h-5 bg-orange-500 rounded-full" />)}
                        </div>
                        <span className="text-xs text-orange-700">Group {g}</span>
                      </div>
                    ))}
                    <div className="bg-red-100 rounded-lg p-2 text-center border-2 border-dashed border-red-400">
                      <div className="flex gap-1 mb-1">
                        {[1,2].map(i => <div key={i} className="w-5 h-5 bg-red-400 rounded-full" />)}
                      </div>
                      <span className="text-xs text-red-700">Left over</span>
                    </div>
                  </div>
                  <p className="text-center font-bold text-orange-800">17 ÷ 5 = 3 remainder 2</p>
                  <p className="text-center text-gray-600 text-sm mt-1">Written as: 17 ÷ 5 = 3 R 2</p>
                </div>
                <p className="text-orange-700 text-sm">
                  <strong>Check your answer:</strong> (Quotient × Divisor) + Remainder = Dividend<br/>
                  (3 × 5) + 2 = 15 + 2 = 17 ✓
                </p>
              </div>

              {/* Divisibility Rules */}
              <div className="bg-indigo-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-indigo-700 mb-3">Divisibility Rules — Instant Mental Checks!</h2>
                <p className="text-gray-700 mb-4">
                  You can tell if a number divides evenly WITHOUT doing the calculation. These rules save lots of time!
                </p>
                <div className="space-y-2">
                  {[
                    { n: 2, rule: "Last digit is even (0, 2, 4, 6, 8)", ex: "48 is divisible by 2 ✓ (ends in 8)" },
                    { n: 3, rule: "Sum of all digits is divisible by 3", ex: "57: 5+7=12, 12÷3=4 ✓" },
                    { n: 4, rule: "Last two digits form a number divisible by 4", ex: "312: last two digits = 12, 12÷4=3 ✓" },
                    { n: 5, rule: "Last digit is 0 or 5", ex: "85 is divisible by 5 ✓ (ends in 5)" },
                    { n: 9, rule: "Sum of all digits is divisible by 9", ex: "729: 7+2+9=18, 18÷9=2 ✓" },
                    { n: 10, rule: "Last digit is 0", ex: "340 is divisible by 10 ✓ (ends in 0)" },
                  ].map(({ n, rule, ex }) => (
                    <div key={n} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-indigo-100">
                      <div className="flex-shrink-0 w-9 h-9 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                        ÷{n}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{rule}</p>
                        <p className="text-sm text-indigo-600">{ex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Division */}
              <div className="bg-cyan-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-cyan-700 mb-3">Step-by-Step: How to Divide</h2>
                <p className="text-gray-700 mb-4">Use this reliable method for any division problem:</p>
                <div className="bg-white rounded-xl p-4 border-2 border-cyan-200 mb-4">
                  <p className="text-center font-bold text-cyan-700 mb-3 text-lg">Example: 84 ÷ 6</p>
                  <ol className="space-y-2">
                    {[
                      ["Ask:", "How many times does 6 go into 8? → 1 time (since 6 × 1 = 6)"],
                      ["Multiply:", "1 × 6 = 6. Write 6 below the 8"],
                      ["Subtract:", "8 − 6 = 2. Write down 2"],
                      ["Bring down:", "Bring the 4 down next to the 2 → now we have 24"],
                      ["Ask again:", "How many times does 6 go into 24? → 4 times (since 6 × 4 = 24)"],
                      ["Multiply:", "4 × 6 = 24. Write 24 below. Subtract: 24 − 24 = 0"],
                      ["Answer:", "84 ÷ 6 = 14. Check: 14 × 6 = 84 ✓"],
                    ].map(([label, text], i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="flex-shrink-0 font-bold text-cyan-700 w-20">{label}</span>
                        <span className="text-gray-700">{text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="text-cyan-700 text-sm font-semibold">The pattern: Divide → Multiply → Subtract → Bring down → Repeat</p>
              </div>

              {/* Word Problem Strategies */}
              <div className="bg-green-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-green-700 mb-3">Word Problems — How to Spot Division</h2>
                <p className="text-gray-700 mb-4">
                  These words and phrases are clues that you need to divide:
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {["shared equally", "split into groups", "each person gets", "distributed", "cut into equal pieces", "how many groups of"].map((phrase) => (
                    <div key={phrase} className="bg-green-100 rounded-lg px-3 py-2 text-green-800 font-medium text-sm">
                      "{phrase}"
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                  <p className="font-bold text-green-700 mb-2">Example word problem:</p>
                  <p className="text-gray-700 mb-2 italic">"36 children are split into equal teams of 9. How many teams are there?"</p>
                  <p className="text-gray-700 text-sm"><strong>Think:</strong> Total ÷ group size = number of groups</p>
                  <p className="text-gray-700 text-sm"><strong>Calculate:</strong> 36 ÷ 9 = 4 teams</p>
                  <p className="text-gray-700 text-sm"><strong>Check:</strong> 4 × 9 = 36 ✓</p>
                </div>
              </div>

              {/* Common Mistakes */}
              <div className="bg-red-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-red-700 mb-3">⚠️ Watch Out — Common Mistakes</h2>
                <ul className="space-y-3">
                  {[
                    ["Division is NOT commutative:", "12 ÷ 4 = 3, but 4 ÷ 12 ≠ 3. Unlike multiplication, order matters!"],
                    ["Dividing by 1:", "Any number ÷ 1 = that number. 15 ÷ 1 = 15 (not 1)."],
                    ["Zero as dividend:", "0 ÷ 5 = 0 (zero shared among any number is zero)."],
                    ["Dividing by zero:", "You CANNOT divide by zero. 5 ÷ 0 is undefined — it has no answer."],
                    ["Forgetting remainders:", "Check if division is exact or has a remainder. 17 ÷ 5 = 3 R 2, not just 3."],
                    ["Skipping the check:", "Always verify: Quotient × Divisor + Remainder = Dividend."],
                  ].map(([label, text], i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 text-red-500 text-xl mt-0.5">✗</span>
                      <span className="text-gray-700"><strong>{label}</strong> {text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <GradientButton
                  onClick={() => setMode('practice')}
                  fromColor="#14b8a6"
                  toColor="#06b6d4"
                  hoverFromColor="#0d9488"
                  hoverToColor="#0891b2"
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
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-400 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <button
        onClick={onBack}
        aria-label="Go back to Home"
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
                  aria-label={showVisual ? 'Hide visual representation' : 'Show visual representation'}
                  aria-pressed={showVisual}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
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
