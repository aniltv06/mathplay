/**
 * Multiplication Lessons View Component - Learning tricks and tips
 *
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Star,
  Play,
  BookOpen,
  Lightbulb,
  ChevronRight,
  Brain,
  Sparkles
} from 'lucide-react';
import { GradientButton } from './GradientButton';
import {
  multiplicationLessons,
  generalMultiplicationTips,
  multiplicationStrategies
} from '../utils/multiplicationLessons';
import type { LearningMode } from './multiplicationTypes';

interface LessonsViewProps {
  onBack: () => void;
  onSelectTable: (table: number, mode?: LearningMode) => void;
  speak: (text: string) => void;
  voiceEnabled: boolean;
}

export function MultiplicationLessonsView({ onBack, onSelectTable, speak, voiceEnabled }: LessonsViewProps) {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [showStrategies, setShowStrategies] = useState(false);

  if (selectedLesson !== null) {
    const lesson = multiplicationLessons[selectedLesson];
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedLesson(null)}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to lessons
            </button>
            <GradientButton
              onClick={() => {
                onSelectTable(selectedLesson, 'practice');
                if (voiceEnabled) {
                  speak(`Let's practice the ${selectedLesson} times table!`);
                }
              }}
              fromColor="#4ade80"
              toColor="#10b981"
              hoverFromColor="#22c55e"
              hoverToColor="#059669"
              className="px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Practice This Table
            </GradientButton>
          </div>

          {/* Lesson Content */}
          <div className="space-y-6">
            {/* Title */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full text-white text-4xl font-bold mb-4 shadow-lg">
                {selectedLesson}
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">{lesson.title}</h2>
              <p className="text-xl text-gray-600">{lesson.description}</p>
            </div>

            {/* Tricks Section */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Tricks & Tips
              </h3>
              <ul className="space-y-3">
                {lesson.tricks.map((trick, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 text-lg pt-1">{trick}</p>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Examples Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-green-500" />
                Examples
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lesson.examples.map((example, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-md"
                  >
                    <code className="text-xl font-mono text-gray-800">{example}</code>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Visual Tip */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Brain className="w-6 h-6 text-orange-500" />
                Visual Tip
              </h3>
              <p className="text-lg text-gray-700">{lesson.visualTip}</p>
            </div>

            {/* Fun Fact */}
            {lesson.funFact && (
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Star className="w-6 h-6 text-pink-500" />
                  Fun Fact
                </h3>
                <p className="text-lg text-gray-700">{lesson.funFact}</p>
              </div>
            )}

            {/* Worked Example */}
            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-teal-500" />
                Step-by-Step Worked Example
              </h3>
              <div className="bg-white rounded-xl p-4 shadow-md mb-4">
                <p className="text-2xl font-bold text-center text-teal-700 font-mono">{lesson.workedExample.problem}</p>
              </div>
              <ol className="space-y-3">
                {lesson.workedExample.steps.map((step, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 text-lg pt-1">{step}</p>
                  </motion.li>
                ))}
              </ol>
              <div className="mt-4 bg-teal-100 rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-teal-800 font-mono">{lesson.workedExample.answer}</p>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Watch Out — Common Mistakes
              </h3>
              <ul className="space-y-3">
                {lesson.commonMistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-red-500 text-xl mt-0.5">✗</span>
                    <p className="text-gray-700 text-lg">{mistake}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Real-World Connection */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                Real-World Connection
              </h3>
              <p className="text-lg text-gray-700">{lesson.realWorldExample}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to menu
        </button>
        <h1 className="text-5xl text-white mb-4 drop-shadow-lg font-bold">
          Learning Center 📚
        </h1>
        <p className="text-xl text-white/90">
          Discover tricks and shortcuts to master multiplication
        </p>
      </div>

      {/* General Tips Toggle */}
      <div className="max-w-5xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowTips(!showTips)}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Lightbulb className="w-8 h-8" />
            <div className="text-left">
              <div className="text-2xl font-bold">General Tips & Strategies</div>
              <div className="text-sm opacity-90">Universal multiplication tricks</div>
            </div>
          </div>
          <ChevronRight className={`w-6 h-6 transition-transform ${showTips ? 'rotate-90' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {showTips && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mt-4 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generalMultiplicationTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{tip.icon}</span>
                        <div>
                          <h4 className="font-bold text-gray-800 mb-1">{tip.title}</h4>
                          <p className="text-sm text-gray-600">{tip.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Learning Strategies Toggle */}
      <div className="max-w-5xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowStrategies(!showStrategies)}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8" />
            <div className="text-left">
              <div className="text-2xl font-bold">Learning Strategies</div>
              <div className="text-sm opacity-90">Different ways to approach multiplication</div>
            </div>
          </div>
          <ChevronRight className={`w-6 h-6 transition-transform ${showStrategies ? 'rotate-90' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {showStrategies && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mt-4 shadow-xl">
                <div className="space-y-4">
                  {multiplicationStrategies.map((strategy, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border-2 ${
                        strategy.difficulty === 'beginner'
                          ? 'border-green-200 bg-green-50'
                          : strategy.difficulty === 'intermediate'
                          ? 'border-yellow-200 bg-yellow-50'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{strategy.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-gray-800">{strategy.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              strategy.difficulty === 'beginner'
                                ? 'bg-green-200 text-green-800'
                                : strategy.difficulty === 'intermediate'
                                ? 'bg-yellow-200 text-yellow-800'
                                : 'bg-red-200 text-red-800'
                            }`}>
                              {strategy.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{strategy.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Times Table Lessons Grid */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl text-white font-bold mb-6 text-center">
          Times Table Lessons (1-12)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((table, index) => (
            <motion.button
              key={table}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedLesson(table);
                if (voiceEnabled) {
                  speak(`Learning the ${table} times table`);
                }
              }}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all text-center group"
            >
              <div className="text-5xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                {table}
              </div>
              <div className="text-sm text-gray-600 font-medium">× Table</div>
              <div className="mt-2">
                <BookOpen className="w-5 h-5 text-gray-400 mx-auto group-hover:text-purple-600 transition-colors" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
