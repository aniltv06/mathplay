/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * 3D Shapes Learning Component
 * Explore 3D shapes with interactive net diagrams and properties
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2, Box, Layers } from 'lucide-react';
import { SHAPES_3D, Shape3D } from '../utils/shapes3d';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';

interface Props {
  onBack: () => void;
  profileId: string;
}

type ViewMode = '3d' | 'net';

export function Shape3DLearningMode({ onBack, profileId }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const { speak } = useVoiceFeedback();

  const filteredShapes = filter === 'all'
    ? SHAPES_3D
    : SHAPES_3D.filter(s => s.difficulty === filter);

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
    speak(`This is a ${currentShape.name}. It has ${currentShape.faces} faces, ${currentShape.edges} edges, and ${currentShape.vertices} vertices. ${currentShape.funFact}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 relative overflow-hidden">
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
                    ? 'bg-white text-purple-600 shadow-lg'
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
              {/* View Mode Toggle */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                      viewMode === '3d'
                        ? 'bg-white shadow-md text-purple-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Box className="w-5 h-5" />
                    3D View
                  </button>
                  <button
                    onClick={() => setViewMode('net')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                      viewMode === 'net'
                        ? 'bg-white shadow-md text-purple-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Layers className="w-5 h-5" />
                    Net Diagram
                  </button>
                </div>
              </div>

              {/* Shape Display */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Left: Shape Visual */}
                <div className="flex flex-col items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={viewMode}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="relative"
                    >
                      <svg
                        width="300"
                        height="300"
                        viewBox="0 0 100 100"
                        className="drop-shadow-2xl"
                      >
                        {viewMode === '3d' ? (
                          <motion.path
                            d={currentShape.svgIsometric}
                            fill={currentShape.color}
                            stroke={currentShape.color}
                            strokeWidth="1"
                            fillOpacity="0.7"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                          />
                        ) : (
                          currentShape.netDiagram.map((part, i) => (
                            <motion.g
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              {part.shape === 'square' || part.shape === 'rectangle' ? (
                                <rect
                                  x={part.position.x}
                                  y={part.position.y}
                                  width={part.size.width}
                                  height={part.size.height}
                                  fill={currentShape.color}
                                  fillOpacity="0.7"
                                  stroke={currentShape.color}
                                  strokeWidth="1"
                                />
                              ) : part.shape === 'circle' ? (
                                <circle
                                  cx={part.position.x + part.size.width / 2}
                                  cy={part.position.y + part.size.height / 2}
                                  r={part.size.width / 2}
                                  fill={currentShape.color}
                                  fillOpacity="0.7"
                                  stroke={currentShape.color}
                                  strokeWidth="1"
                                />
                              ) : (
                                <polygon
                                  points={`${part.position.x + part.size.width / 2},${part.position.y} ${part.position.x},${part.position.y + part.size.height} ${part.position.x + part.size.width},${part.position.y + part.size.height}`}
                                  fill={currentShape.color}
                                  fillOpacity="0.7"
                                  stroke={currentShape.color}
                                  strokeWidth="1"
                                />
                              )}
                            </motion.g>
                          ))
                        )}
                      </svg>
                    </motion.div>
                  </AnimatePresence>
                  <h2 className="text-5xl font-bold mt-6" style={{ color: currentShape.color }}>
                    {currentShape.name}
                  </h2>
                  {viewMode === 'net' && (
                    <p className="text-gray-500 text-sm mt-2 text-center">
                      This is how the shape looks when unfolded
                    </p>
                  )}
                </div>

                {/* Right: Shape Info */}
                <div className="flex flex-col justify-center">
                  {/* Basic Info */}
                  <div className="mb-6">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-xl">
                        <div className="text-xs text-gray-600 mb-1">Faces</div>
                        <div className="text-3xl font-bold text-purple-600">
                          {currentShape.faces}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-4 rounded-xl">
                        <div className="text-xs text-gray-600 mb-1">Edges</div>
                        <div className="text-3xl font-bold text-blue-600">
                          {currentShape.edges}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-xl">
                        <div className="text-xs text-gray-600 mb-1">Vertices</div>
                        <div className="text-3xl font-bold text-green-600">
                          {currentShape.vertices}
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

                  {/* Formulas */}
                  <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-4 rounded-xl mb-4">
                    <h4 className="font-bold text-gray-800 mb-2">Volume Formula:</h4>
                    <p className="text-gray-700 font-mono text-sm">{currentShape.volumeFormula}</p>
                  </div>
                  <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-4 rounded-xl">
                    <h4 className="font-bold text-gray-800 mb-2">Surface Area Formula:</h4>
                    <p className="text-gray-700 font-mono text-sm">{currentShape.surfaceAreaFormula}</p>
                  </div>
                </div>
              </div>

              {/* Fun Fact */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl mb-6">
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
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
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
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
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
    'Dice': '🎲',
    'Rubik\'s Cube': '🧊',
    'Ice cube': '🧊',
    'Gift box': '🎁',
    'Building block': '🧱',
    'Sugar cube': '🍬',
    'Basketball': '🏀',
    'Globe': '🌍',
    'Orange': '🍊',
    'Marble': '⚪',
    'Bubble': '🫧',
    'Earth': '🌎',
    'Soda can': '🥫',
    'Toilet paper roll': '🧻',
    'Drum': '🥁',
    'Pipe': '🚰',
    'Battery': '🔋',
    'Coin stack': '🪙',
    'Ice cream cone': '🍦',
    'Party hat': '🎉',
    'Traffic cone': '🚧',
    'Funnel': '🔉',
    'Megaphone': '📣',
    'Volcano': '🌋',
    'Book': '📚',
    'Shoebox': '👟',
    'Brick': '🧱',
    'Cereal box': '📦',
    'Smartphone': '📱',
    'Building': '🏢',
    'Egyptian pyramids': '🔺',
    'Roof': '🏠',
    'Tent': '⛺',
    'Mountain peak': '⛰️',
    'Pyramid toy': '🔺',
    'Toblerone box': '🍫',
    'Camping shelter': '⛺',
    'Prism toy': '🔷',
    'Donut': '🍩',
    'Life preserver': '🛟',
    'Ring': '💍',
    'Tire': '🚗',
    'Bagel': '🥯',
    'Hula hoop': '⭕',
  };
  return emojiMap[example] || '📦';
}
