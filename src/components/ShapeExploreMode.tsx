/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Explore Mode Component
 * Browse and learn about all shapes with animations and voice feedback
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { SHAPES, Shape } from '../utils/shapes';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';

interface Props {
  onBack: () => void;
  profileId: string;
}

export function ExploreMode({ onBack, profileId }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const { speak } = useVoiceFeedback();

  const filteredShapes = filter === 'all'
    ? SHAPES
    : SHAPES.filter(s => s.difficulty === filter);

  const currentShape = filteredShapes[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredShapes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSpeak = () => {
    speak(`This is a ${currentShape.name}. It has ${currentShape.sides} sides and ${currentShape.corners} corners. ${currentShape.funFact}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Difficulty Filter */}
          <div className="flex gap-2">
            {(['all', 'easy', 'medium', 'hard'] as const).map((level) => (
              <button
                key={level}
                onClick={() => {
                  setFilter(level);
                  setCurrentIndex(0);
                }}
                className={`px-4 py-2 rounded-xl transition-all ${
                  filter === level
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={handleSpeak}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-3 rounded-full shadow-lg text-white"
            title="Speak shape info"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="max-w-5xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
            >
              {/* Shape Display */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Left: Shape SVG */}
                <div className="flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="relative"
                  >
                    <svg
                      width="300"
                      height="300"
                      viewBox="0 0 100 100"
                      className="drop-shadow-2xl"
                    >
                      <motion.path
                        d={currentShape.svgPath}
                        fill={currentShape.color}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                      />
                    </svg>
                  </motion.div>
                  <h2 className="text-5xl font-bold mt-6" style={{ color: currentShape.color }}>
                    {currentShape.name}
                  </h2>
                </div>

                {/* Right: Shape Info */}
                <div className="flex flex-col justify-center">
                  {/* Basic Info */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">Sides</div>
                        <div className="text-4xl font-bold text-purple-600">
                          {currentShape.sides}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-4 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">Corners</div>
                        <div className="text-4xl font-bold text-blue-600">
                          {currentShape.corners}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Properties */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Properties:</h3>
                    <ul className="space-y-2">
                      {currentShape.properties.map((prop, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <span className="text-2xl">✓</span>
                          <span>{prop}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Fun Fact */}
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Fun Fact:
                </h3>
                <p className="text-gray-700 text-lg">{currentShape.funFact}</p>
              </div>

              {/* Real World Examples */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Find {currentShape.name}s in real life:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentShape.realWorldExamples.map((example, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-xl text-center"
                    >
                      <span className="text-2xl mb-2 block">
                        {getEmojiForExample(example)}
                      </span>
                      <span className="text-gray-700 font-medium">{example}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    currentIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="text-gray-600 font-medium">
                  {currentIndex + 1} / {filteredShapes.length}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === filteredShapes.length - 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    currentIndex === filteredShapes.length - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                  }`}
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Helper function to get emojis for examples
function getEmojiForExample(example: string): string {
  const emojiMap: Record<string, string> = {
    'Sun': '☀️',
    'Ball': '⚽',
    'Pizza': '🍕',
    'Wheel': '🎡',
    'Clock': '🕐',
    'Cookie': '🍪',
    'Window': '🪟',
    'Dice': '🎲',
    'Chocolate': '🍫',
    'Chess board': '♟️',
    'Cracker': '🍘',
    'Picture frame': '🖼️',
    'Pizza slice': '🍕',
    'Mountain': '⛰️',
    'Roof': '🏠',
    'Traffic sign': '🚸',
    'Sandwich': '🥪',
    'Pyramid': '🔺',
    'Door': '🚪',
    'Book': '📚',
    'Phone': '📱',
    'TV': '📺',
    'Envelope': '✉️',
    'Ruler': '📏',
    'Egg': '🥚',
    'Rugby ball': '🏈',
    'Watermelon': '🍉',
    'Mirror': '🪞',
    'Track': '🏃',
    'Face': '😊',
    'Valentine card': '💌',
    'Love emoji': '❤️',
    'Cookie cutter': '🍪',
    'Balloon': '🎈',
    'Jewelry': '💎',
    'Night sky': '🌃',
    'Flag': '🚩',
    'Award': '🏆',
    'Sticker': '⭐',
    'Christmas tree top': '🎄',
    'Sheriff badge': '🤠',
    'Home plate': '⚾',
    'Pentagon building': '🏛️',
    'Flower petals': '🌸',
    'Starfish': '⭐',
    'Honeycomb': '🍯',
    'Turtle shell': '🐢',
    'Snowflake': '❄️',
    'Nut': '🔩',
    'Soccer ball patch': '⚽',
    'Stop sign': '🛑',
    'Umbrella': '☂️',
    'Gazebo roof': '🏛️',
    'Table': '🪑',
    'Clock frame': '🕐',
    'Playing cards': '🃏',
    'Kite': '🪁',
    'Baseball field': '⚾',
    'Road sign': '🚧',
    'Bucket': '🪣',
    'Boat': '⛵',
    'Popcorn box': '🍿',
    'Lamp shade': '💡',
  };
  return emojiMap[example] || '📦';
}
