/**
 * Money & Shopping Learning Page
 * Interactive learning for money counting and shopping
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, DollarSign, CheckCircle, XCircle, ShoppingCart } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { useI18n } from '../i18n/I18nContext';

interface Props {
  onBack: () => void;
  profileId: string;
}

type Mode = 'learn' | 'practice' | 'challenge';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type ProblemType = 'count-coins' | 'make-amount' | 'make-change' | 'shopping';

interface Coin {
  name: string;
  value: number;
  count: number;
  emoji: string;
}

interface MoneyProblem {
  type: ProblemType;
  coins?: Coin[];
  totalAmount?: number;
  itemPrice?: number;
  amountPaid?: number;
  answer: number;
  displayQuestion: string;
}

export function MoneyShoppingPage({ onBack, profileId }: Props) {
  const { getProfile, updateProfile } = useProfiles();
  const { speak } = useVoiceFeedback();
  const { t } = useI18n();
  const profile = getProfile(profileId);

  const [mode, setMode] = useState<Mode>('learn');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [currentProblem, setCurrentProblem] = useState<MoneyProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showVisual, setShowVisual] = useState(true);
  const [streak, setStreak] = useState(0);

  // US coin definitions
  const coinTypes = [
    { name: 'Penny', value: 1, emoji: '🪙' },
    { name: 'Nickel', value: 5, emoji: '🪙' },
    { name: 'Dime', value: 10, emoji: '🪙' },
    { name: 'Quarter', value: 25, emoji: '🪙' },
  ];

  // Generate coin counting problem
  const generateCountCoins = (): MoneyProblem => {
    const coins: Coin[] = [];
    let totalAmount = 0;

    if (difficulty === 'beginner') {
      // Single coin type
      const coinType = coinTypes[Math.floor(Math.random() * coinTypes.length)];
      const count = Math.floor(Math.random() * 8) + 2; // 2-9 coins
      totalAmount = coinType.value * count;
      coins.push({
        name: coinType.name,
        value: coinType.value,
        count,
        emoji: coinType.emoji,
      });
    } else if (difficulty === 'intermediate') {
      // 2-3 coin types
      const numTypes = Math.floor(Math.random() * 2) + 2; // 2 or 3 types
      const selectedTypes = [...coinTypes].sort(() => Math.random() - 0.5).slice(0, numTypes);

      selectedTypes.forEach(coinType => {
        const count = Math.floor(Math.random() * 5) + 1; // 1-5 of each
        totalAmount += coinType.value * count;
        coins.push({
          name: coinType.name,
          value: coinType.value,
          count,
          emoji: coinType.emoji,
        });
      });
    } else {
      // All coin types
      coinTypes.forEach(coinType => {
        const count = Math.floor(Math.random() * 4) + 1; // 1-4 of each
        totalAmount += coinType.value * count;
        coins.push({
          name: coinType.name,
          value: coinType.value,
          count,
          emoji: coinType.emoji,
        });
      });
    }

    return {
      type: 'count-coins',
      coins,
      answer: totalAmount,
      displayQuestion: 'How much money is shown?',
    };
  };

  // Generate make amount problem
  const generateMakeAmount = (): MoneyProblem => {
    let targetAmount: number;

    if (difficulty === 'beginner') {
      targetAmount = [5, 10, 25, 50][Math.floor(Math.random() * 4)];
    } else if (difficulty === 'intermediate') {
      targetAmount = Math.floor(Math.random() * 10) * 5 + 10; // 10-50 in 5¢ increments
    } else {
      targetAmount = Math.floor(Math.random() * 20) * 5 + 25; // 25-100 in 5¢ increments
    }

    return {
      type: 'make-amount',
      totalAmount: targetAmount,
      answer: targetAmount,
      displayQuestion: `Make ${targetAmount}¢ using coins`,
    };
  };

  // Generate make change problem
  const generateMakeChange = (): MoneyProblem => {
    let itemPrice: number, amountPaid: number;

    if (difficulty === 'beginner') {
      itemPrice = Math.floor(Math.random() * 40) + 10; // 10-49¢
      amountPaid = 50;
    } else if (difficulty === 'intermediate') {
      itemPrice = Math.floor(Math.random() * 70) + 10; // 10-79¢
      amountPaid = [50, 100][Math.floor(Math.random() * 2)];
    } else {
      itemPrice = Math.floor(Math.random() * 150) + 50; // 50-199¢
      amountPaid = 200;
    }

    const change = amountPaid - itemPrice;

    return {
      type: 'make-change',
      itemPrice,
      amountPaid,
      answer: change,
      displayQuestion: `Item costs ${itemPrice}¢, you pay ${amountPaid}¢. What's the change?`,
    };
  };

  // Generate shopping problem
  const generateShopping = (): MoneyProblem => {
    const items = [
      { name: 'Apple', price: 25 },
      { name: 'Banana', price: 15 },
      { name: 'Cookie', price: 50 },
      { name: 'Juice', price: 75 },
      { name: 'Candy', price: 10 },
      { name: 'Chips', price: 60 },
    ];

    let numItems: number, total = 0;
    const selectedItems: typeof items = [];

    if (difficulty === 'beginner') {
      numItems = 2;
    } else if (difficulty === 'intermediate') {
      numItems = 3;
    } else {
      numItems = 4;
    }

    for (let i = 0; i < numItems; i++) {
      const item = items[Math.floor(Math.random() * items.length)];
      selectedItems.push(item);
      total += item.price;
    }

    const itemNames = selectedItems.map(item => item.name).join(', ');
    const itemPrices = selectedItems.map(item => `${item.price}¢`).join(' + ');

    return {
      type: 'shopping',
      totalAmount: total,
      answer: total,
      displayQuestion: `Shopping: ${itemNames}. Total cost?`,
    };
  };

  // Generate problem based on difficulty and mode
  const generateProblem = (): MoneyProblem => {
    const rand = Math.random();

    if (difficulty === 'beginner') {
      return rand < 0.7 ? generateCountCoins() : generateMakeAmount();
    } else if (difficulty === 'intermediate') {
      if (rand < 0.4) return generateCountCoins();
      if (rand < 0.7) return generateMakeChange();
      return generateShopping();
    } else {
      if (rand < 0.3) return generateCountCoins();
      if (rand < 0.5) return generateMakeChange();
      return generateShopping();
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
    const isCorrect = answer === currentProblem.answer;

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setAttempts(prev => prev + 1);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      speak(`Correct! The answer is ${currentProblem.answer} cents`);

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
      speak(`Not quite. The answer is ${currentProblem.answer} cents`);

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

  // Render coin visualization
  const renderCoins = () => {
    if (!currentProblem || !showVisual || !currentProblem.coins) return null;

    const getCoinStyle = (value: number): React.CSSProperties => {
      const baseStyle: React.CSSProperties = {
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      };

      switch (value) {
        case 1: // Penny (copper)
          return {
            ...baseStyle,
            background: 'linear-gradient(to bottom right, #f97316, #b45309)',
          };
        case 5: // Nickel (silver)
          return {
            ...baseStyle,
            background: 'linear-gradient(to bottom right, #64748b, #334155)',
          };
        case 10: // Dime (light silver)
          return {
            ...baseStyle,
            background: 'linear-gradient(to bottom right, #9ca3af, #4b5563)',
          };
        case 25: // Quarter (dark silver)
          return {
            ...baseStyle,
            background: 'linear-gradient(to bottom right, #475569, #1e293b)',
          };
        default:
          return {
            ...baseStyle,
            background: 'linear-gradient(to bottom right, #fbbf24, #ca8a04)',
          };
      }
    };

    return (
      <div className="bg-green-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-green-800 mb-4 text-center">
          Count the Coins
        </h3>
        <div className="space-y-4">
          {currentProblem.coins.map((coin, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800">{coin.name}s</span>
                <span className="text-sm text-gray-600">{coin.value}¢ each</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: coin.count }).map((_, i) => (
                  <div
                    key={i}
                    style={getCoinStyle(coin.value)}
                  >
                    {coin.value}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-right text-sm text-gray-600">
                {coin.count} × {coin.value}¢ = {coin.count * coin.value}¢
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
                <button
                  onClick={() => setMode('practice')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all"
                >
                  Start Practice
                </button>
                <button
                  onClick={() => setMode('challenge')}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white hover:text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all"
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
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 relative overflow-hidden">
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
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level as DifficultyLevel)}
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
                {renderCoins()}

                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-gray-800 mb-6">
                    {currentProblem.displayQuestion}
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="text-4xl text-center font-bold border-4 border-green-300 rounded-xl px-6 py-4 w-48 focus:border-green-500 focus:outline-none"
                      placeholder="?"
                      autoFocus
                    />
                    <span className="text-3xl text-gray-600">¢</span>
                  </div>

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
                              Try again! The answer is {currentProblem.answer}¢
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
