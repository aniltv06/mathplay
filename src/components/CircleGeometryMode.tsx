/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Circle Geometry Mode - Enhanced
 * Interactive learning for all parts of a circle with rich animations
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2, Sparkles, Grid3x3, Gamepad2 } from 'lucide-react';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { CirclePartsReference } from './CirclePartsReference';
import { InteractiveCirclePlayground } from './InteractiveCirclePlayground';
import { CIRCLE_PARTS, CIRCLE_CATEGORIES as CATEGORIES, type CirclePart } from '../utils/circleData';
import { CircleVisualization } from './shapes/CircleVisualization';

interface Props {
  onBack: () => void;
  profileId: string;
}

// Re-export the type so downstream consumers that import it from here still work.
export type { CirclePart };

export function CircleGeometryMode({ onBack, profileId }: Props) {
  const [viewMode, setViewMode] = useState<'menu' | 'learning' | 'reference' | 'interactive'>('menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { speak } = useVoiceFeedback();

  const currentPart = CIRCLE_PARTS[currentIndex];

  // If showing interactive playground, render that instead
  if (viewMode === 'interactive') {
    return <InteractiveCirclePlayground onBack={() => setViewMode('menu')} profileId={profileId} />;
  }

  // If showing reference view, render that instead
  if (viewMode === 'reference') {
    return <CirclePartsReference onBack={() => setViewMode('menu')} />;
  }

  // If showing menu, render category selection
  if (viewMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -20, 0],
              y: [0, 15, 0]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        {/* Header */}
        <div className="relative z-10 px-4 py-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <motion.button
              onClick={onBack}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </motion.button>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  ⭕
                </motion.span>
                Circle Geometry
              </h1>
              <p className="text-white/90 text-sm md:text-base">
                Choose a category to explore
              </p>
            </motion.div>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setViewMode('interactive')}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-3 rounded-full shadow-lg text-white"
                title="Interactive Playground"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Gamepad2 className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('reference')}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-3 rounded-full shadow-lg text-white"
                title="View all parts"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Grid3x3 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <div className="relative z-10 px-4 py-8 min-h-[calc(100vh-120px)] flex items-center justify-center">
          <div className="max-w-5xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CATEGORIES.map((category, index) => {
                const categoryParts = CIRCLE_PARTS.filter(part => category.parts.includes(part.id));
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all"
                  >
                    <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <span className="text-3xl">{category.icon}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {category.description}
                    </p>

                    <div className="space-y-2">
                      {categoryParts.map((part) => (
                        <motion.button
                          key={part.id}
                          onClick={() => {
                            const partIndex = CIRCLE_PARTS.findIndex(p => p.id === part.id);
                            setCurrentIndex(partIndex);
                            setViewMode('learning');
                          }}
                          className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all flex items-center justify-between group"
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-gray-800 font-medium">{part.name}</span>
                          <motion.span
                            className="text-gray-400 group-hover:text-gray-600"
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                          >
                            →
                          </motion.span>
                        </motion.button>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        {categoryParts.length} part{categoryParts.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < CIRCLE_PARTS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSpeak = () => {
    const text = `${currentPart.name}. ${currentPart.description} ${currentPart.funFact}`;
    speak(text);
  };

  // Learning Mode - Individual Circle Part View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 15, 0]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-36 h-36 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={() => setViewMode('menu')}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Menu</span>
          </motion.button>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                ⭕
              </motion.span>
              Circle Geometry
            </h1>
            <p className="text-white/90 text-sm md:text-base">
              Discover the magic of circles!
            </p>
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setViewMode('interactive')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-3 rounded-full shadow-lg text-white"
              title="Interactive Playground"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Gamepad2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => setViewMode('reference')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-3 rounded-full shadow-lg text-white"
              title="View all parts"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Grid3x3 className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={handleSpeak}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-3 rounded-full shadow-lg text-white"
              title="Speak info"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Volume2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="max-w-5xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-3xl p-6 md:p-12 shadow-2xl"
            >
              {/* Circle Part Display */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Left: Visualization */}
                <div className="flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative"
                  >
                    <CircleVisualization currentPart={currentPart} />
                  </motion.div>
                  <motion.h2
                    className="text-4xl md:text-5xl font-bold mt-6 flex items-center gap-2"
                    style={{ color: currentPart.color }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                  >
                    {currentPart.name}
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-8 h-8" />
                    </motion.span>
                  </motion.h2>
                  {currentPart.formula && (
                    <motion.div
                      className="mt-3 bg-gray-100 px-4 py-2 rounded-lg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15, duration: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <code className="text-lg font-mono text-gray-800">{currentPart.formula}</code>
                    </motion.div>
                  )}
                </div>

                {/* Right: Information */}
                <div className="flex flex-col justify-center">
                  {/* Description */}
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05, duration: 0.2 }}
                  >
                    <p className="text-gray-700 text-lg leading-relaxed font-medium mb-3">
                      {currentPart.description}
                    </p>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {currentPart.detailedDescription}
                    </p>
                  </motion.div>

                  {/* Properties */}
                  <div className="mb-6">
                    <motion.h3
                      className="text-xl font-bold text-gray-800 mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                    >
                      Key Properties:
                    </motion.h3>
                    <ul className="space-y-2">
                      {currentPart.properties.map((prop, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.03, duration: 0.2 }}
                          whileHover={{ x: 5, scale: 1.02 }}
                          className="flex items-center gap-2 text-gray-700 bg-gray-50 p-2 rounded-lg"
                        >
                          <motion.span
                            className="text-xl"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ delay: 0.2 + i * 0.03, duration: 0.3 }}
                          >
                            ✓
                          </motion.span>
                          <span>{prop}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Math Insight - New Section */}
              <motion.div
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl mb-6 border-2 border-blue-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <motion.span
                    className="text-2xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    🧮
                  </motion.span>
                  Math Insight:
                </h3>
                <p className="text-blue-900 text-base leading-relaxed">
                  {currentPart.mathInsight}
                </p>
              </motion.div>

              {/* Fun Fact */}
              <motion.div
                className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl mb-6 border-2 border-yellow-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <motion.span
                    className="text-2xl"
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💡
                  </motion.span>
                  Fun Fact:
                </h3>
                <p className="text-gray-700 text-lg">{currentPart.funFact}</p>
              </motion.div>

              {/* Real World Examples */}
              <div className="mb-6">
                <motion.h3
                  className="text-xl font-bold text-gray-800 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                >
                  Real World Examples:
                </motion.h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentPart.realWorldExamples.map((example, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.02, duration: 0.2 }}
                      whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
                      className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-xl text-center shadow-md cursor-pointer"
                    >
                      <span className="text-gray-700 font-medium">{example}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.2 }}
              >
                <motion.button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    currentIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                  }`}
                  whileHover={currentIndex === 0 ? {} : { scale: 1.05, x: -5 }}
                  whileTap={currentIndex === 0 ? {} : { scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </motion.button>

                <motion.div
                  className="text-gray-600 font-medium"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentIndex + 1} / {CIRCLE_PARTS.length}
                </motion.div>

                <motion.button
                  onClick={handleNext}
                  disabled={currentIndex === CIRCLE_PARTS.length - 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    currentIndex === CIRCLE_PARTS.length - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                  }`}
                  whileHover={currentIndex === CIRCLE_PARTS.length - 1 ? {} : { scale: 1.05, x: 5 }}
                  whileTap={currentIndex === CIRCLE_PARTS.length - 1 ? {} : { scale: 0.95 }}
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
