/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, CheckCircle, Play, RotateCcw } from 'lucide-react';

interface Props {
  onBack: () => void;
  profileId: string;
}

type LearningMode = 'select' | 'visualize' | 'practice' | 'quiz';

export function MultiplicationLearningPage({ onBack }: Props) {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [mode, setMode] = useState<LearningMode>('select');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  const handleTableSelect = (table: number) => {
    setSelectedTable(table);
    setMode('visualize');
    setCurrentQuestion(1);
    setScore(0);
    setCompleted([]);
  };

  const handleModeChange = (newMode: LearningMode) => {
    setMode(newMode);
    setCurrentQuestion(1);
    setUserAnswer('');
    setShowFeedback(null);
  };

  const handleAnswer = (answer: number) => {
    if (!selectedTable) return;

    const correctAnswer = selectedTable * currentQuestion;
    if (answer === correctAnswer) {
      setShowFeedback('correct');
      setScore((prev) => prev + 1);
      if (!completed.includes(currentQuestion)) {
        setCompleted((prev) => [...prev, currentQuestion]);
      }
      
      setTimeout(() => {
        if (currentQuestion < 12) {
          setCurrentQuestion((prev) => prev + 1);
          setUserAnswer('');
          setShowFeedback(null);
        }
      }, 1000);
    } else {
      setShowFeedback('wrong');
      setTimeout(() => {
        setShowFeedback(null);
      }, 1500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = parseInt(userAnswer);
    if (!isNaN(answer)) {
      handleAnswer(answer);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-50 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        Home
      </button>

      <div className="relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Table Selection */}
          {mode === 'select' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h1 className="text-5xl text-center text-white mb-4 drop-shadow-lg">
                Learn Multiplication! 🎯
              </h1>
              <p className="text-xl text-center text-white/90 mb-12">
                Choose a times table to master
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => {
                  const table = i + 1;
                  return (
                    <motion.button
                      key={table}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTableSelect(table)}
                      className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
                    >
                      <div className="text-5xl text-purple-600 mb-2">{table}</div>
                      <div className="text-gray-600">Times Table</div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Visualization Mode */}
          {mode === 'visualize' && selectedTable && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <button
                    onClick={() => setMode('select')}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ← Back to tables
                  </button>
                  <h2 className="text-3xl text-gray-800">
                    {selectedTable} Times Table
                  </h2>
                  <div className="w-20"></div>
                </div>

                {/* Visual representation */}
                <div className="space-y-6 mb-8">
                  {[...Array(12)].map((_, i) => {
                    const multiplier = i + 1;
                    const result = selectedTable * multiplier;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-2xl text-gray-800">
                            {selectedTable} × {multiplier} = {result}
                          </div>
                          <div className="flex gap-1">
                            {[...Array(Math.min(multiplier, 10))].map((_, j) => (
                              <div
                                key={j}
                                className="w-8 h-8 bg-purple-400 rounded-lg flex items-center justify-center text-white text-sm"
                              >
                                {selectedTable}
                              </div>
                            ))}
                            {multiplier > 10 && (
                              <div className="text-2xl text-gray-600">...</div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleModeChange('practice')}
                    className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white py-4 rounded-xl text-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Play className="w-6 h-6" />
                    Practice Mode
                  </button>
                  <button
                    onClick={() => handleModeChange('quiz')}
                    className="flex-1 bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white py-4 rounded-xl text-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Star className="w-6 h-6" />
                    Quiz Mode
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Practice Mode */}
          {(mode === 'practice' || mode === 'quiz') && selectedTable && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <button
                    onClick={() => handleModeChange('visualize')}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ← Back
                  </button>
                  <h2 className="text-2xl text-gray-800">
                    {mode === 'practice' ? 'Practice' : 'Quiz'}: {selectedTable}× Table
                  </h2>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>{score}/12</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex gap-1 mb-2">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded-full transition-all ${
                          completed.includes(i + 1)
                            ? 'bg-green-500'
                            : i + 1 === currentQuestion
                            ? 'bg-yellow-500'
                            : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    Question {currentQuestion} of 12
                  </div>
                </div>

                {currentQuestion <= 12 ? (
                  <>
                    {/* Question */}
                    <div className="text-center mb-8">
                      <motion.div
                        key={currentQuestion}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-6xl text-gray-800 mb-4"
                      >
                        {selectedTable} × {currentQuestion} = ?
                      </motion.div>

                      {mode === 'practice' && (
                        <div className="text-gray-600">
                          Hint: {currentQuestion} groups of {selectedTable}
                        </div>
                      )}
                    </div>

                    {/* Visual dots for practice mode */}
                    {mode === 'practice' && currentQuestion <= 10 && (
                      <div className="mb-8 flex flex-wrap gap-4 justify-center">
                        {[...Array(currentQuestion)].map((_, groupIndex) => (
                          <div key={groupIndex} className="flex gap-1">
                            {[...Array(selectedTable)].map((_, dotIndex) => (
                              <div
                                key={dotIndex}
                                className="w-6 h-6 bg-purple-400 rounded-full"
                              ></div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Answer input */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-full text-4xl text-center p-4 rounded-2xl border-4 border-purple-300 focus:border-purple-500 outline-none transition-colors"
                        placeholder="?"
                        autoFocus
                        disabled={showFeedback !== null}
                      />
                      <button
                        type="submit"
                        disabled={showFeedback !== null || userAnswer === ''}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-2xl text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      >
                        Check Answer
                      </button>
                    </form>

                    {/* Feedback */}
                    <AnimatePresence>
                      {showFeedback && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className={`mt-6 p-6 rounded-2xl text-center text-2xl ${
                            showFeedback === 'correct'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {showFeedback === 'correct' ? (
                            <>🎉 Correct! {selectedTable} × {currentQuestion} = {selectedTable * currentQuestion}</>
                          ) : (
                            <>❌ Try again! Think about {currentQuestion} groups of {selectedTable}</>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  // Completion screen
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-6xl mb-4">🎊</div>
                    <h3 className="text-3xl text-gray-800 mb-4">
                      Congratulations!
                    </h3>
                    <p className="text-xl text-gray-600 mb-8">
                      You completed the {selectedTable} times table!
                      <br />
                      Score: {score}/12
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setCurrentQuestion(1);
                          setScore(0);
                          setCompleted([]);
                          setUserAnswer('');
                        }}
                        className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white py-4 rounded-xl text-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-6 h-6" />
                        Try Again
                      </button>
                      <button
                        onClick={() => setMode('select')}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-xl text-xl transition-all shadow-lg hover:shadow-xl"
                      >
                        Choose New Table
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
