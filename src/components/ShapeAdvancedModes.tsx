/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Advanced Shapes Learning Components
 * Pattern & Symmetry and Advanced Challenges
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, XCircle, Sparkles, Brain } from 'lucide-react';
import { SHAPES, Shape } from '../utils/shapes';
import * as transforms from '../utils/shapeTransformations';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { soundEffects } from '../utils/soundEffects';

interface Props {
  onBack: () => void;
  profileId: string;
}

// ==================== PATTERN & SYMMETRY MODE ====================
export function PatternSymmetryMode({ onBack, profileId }: Props) {
  const [selectedShape, setSelectedShape] = useState<Shape>(SHAPES[1]); // square
  const [symmetries, setSymmetries] = useState<{
    vertical: boolean;
    horizontal: boolean;
    rotational: number[];
  } | null>(null);
  const { speak } = useVoiceFeedback();

  const analyzeSymmetry = (shape: Shape) => {
    const result = transforms.getSymmetries(shape.svgPath);
    setSymmetries(result);

    let message = `${shape.name} has `;
    const parts: string[] = [];
    if (result.vertical) parts.push('vertical symmetry');
    if (result.horizontal) parts.push('horizontal symmetry');
    if (result.rotational.length > 0) {
      parts.push(`rotational symmetry of order ${result.rotational.join(' and ')}`);
    }
    if (parts.length === 0) parts.push('no line symmetry');
    message += parts.join(', ');
    speak(message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-400 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            Pattern & Symmetry
          </h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Shape Selection */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">Select a Shape to Analyze:</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-8">
              {SHAPES.slice(0, 10).map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => {
                    setSelectedShape(shape);
                    analyzeSymmetry(shape);
                  }}
                  className={`p-4 rounded-xl transition-all ${
                    selectedShape.id === shape.id
                      ? 'ring-4 ring-teal-500 bg-teal-50'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <svg width="60" height="60" viewBox="0 0 100 100" className="mx-auto">
                    <path d={shape.svgPath} fill={shape.color} />
                  </svg>
                  <p className="text-xs mt-2 text-center font-medium">{shape.name}</p>
                </button>
              ))}
            </div>

            {/* Visualization */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-6">
              <svg width="100%" height="300" viewBox="0 0 100 100" style={{ background: 'white' }}>
                {/* Vertical axis */}
                <line x1="50" y1="0" x2="50" y2="100" stroke="#9ca3af" strokeWidth="0.5" strokeDasharray="2,2" />
                {/* Horizontal axis */}
                <line x1="0" y1="50" x2="100" y2="50" stroke="#9ca3af" strokeWidth="0.5" strokeDasharray="2,2" />
                {/* Diagonal axis */}
                <line x1="0" y1="0" x2="100" y2="100" stroke="#9ca3af" strokeWidth="0.5" strokeDasharray="2,2" />

                {/* Shape */}
                <motion.path
                  d={selectedShape.svgPath}
                  fill={selectedShape.color}
                  fillOpacity="0.7"
                  stroke={selectedShape.color}
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                />
              </svg>
            </div>

            {/* Symmetry Results */}
            <AnimatePresence>
              {symmetries && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className={`p-6 rounded-2xl ${symmetries.vertical ? 'bg-green-100' : 'bg-red-100'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {symmetries.vertical ? <CheckCircle className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
                        <span className="text-lg font-bold text-gray-800">Vertical Line Symmetry</span>
                      </div>
                      <span className="text-2xl">{symmetries.vertical ? '✓' : '✗'}</span>
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl ${symmetries.horizontal ? 'bg-green-100' : 'bg-red-100'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {symmetries.horizontal ? <CheckCircle className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
                        <span className="text-lg font-bold text-gray-800">Horizontal Line Symmetry</span>
                      </div>
                      <span className="text-2xl">{symmetries.horizontal ? '✓' : '✗'}</span>
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl ${symmetries.rotational.length > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {symmetries.rotational.length > 0 ? <CheckCircle className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
                        <div>
                          <span className="text-lg font-bold text-gray-800 block">Rotational Symmetry</span>
                          {symmetries.rotational.length > 0 && (
                            <span className="text-sm text-gray-600">Order: {symmetries.rotational.join(', ')}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-2xl">{symmetries.rotational.length > 0 ? '✓' : '✗'}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== ADVANCED CHALLENGES MODE ====================
interface Challenge {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const CHALLENGES: Challenge[] = [
  {
    question: 'How many sides does a hexagon have?',
    options: ['4', '5', '6', '8'],
    correctAnswer: '6',
    explanation: 'Hexagon comes from Greek: "hexa" means six and "gon" means angle!',
  },
  {
    question: 'Which shape has all equal sides and angles?',
    options: ['Rectangle', 'Square', 'Triangle', 'Oval'],
    correctAnswer: 'Square',
    explanation: 'A square has 4 equal sides and 4 equal angles of 90 degrees!',
  },
  {
    question: 'What is the name of a 3D shape with 6 square faces?',
    options: ['Cube', 'Sphere', 'Pyramid', 'Cylinder'],
    correctAnswer: 'Cube',
    explanation: 'A cube has 6 square faces, 12 edges, and 8 vertices!',
  },
  {
    question: 'How many corners does a circle have?',
    options: ['0', '1', '2', '4'],
    correctAnswer: '0',
    explanation: 'A circle is perfectly round and has no corners or edges!',
  },
  {
    question: 'Which shape has exactly one curved surface and two circular faces?',
    options: ['Cone', 'Cylinder', 'Sphere', 'Cube'],
    correctAnswer: 'Cylinder',
    explanation: 'A cylinder has two circular faces on top and bottom, and one curved surface!',
  },
  {
    question: 'What do we call a triangle with all sides of different lengths?',
    options: ['Equilateral', 'Isosceles', 'Scalene', 'Right'],
    correctAnswer: 'Scalene',
    explanation: 'A scalene triangle has all three sides of different lengths!',
  },
  {
    question: 'How many edges does a cube have?',
    options: ['6', '8', '10', '12'],
    correctAnswer: '12',
    explanation: 'A cube has 12 edges where the faces meet!',
  },
  {
    question: 'Which 2D shape do bees use for their honeycomb?',
    options: ['Pentagon', 'Hexagon', 'Square', 'Circle'],
    correctAnswer: 'Hexagon',
    explanation: 'Bees use hexagons because they fit together perfectly with no gaps!',
  },
];

export function AdvancedChallengesMode({ onBack, profileId }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { speak } = useVoiceFeedback();

  const current = CHALLENGES[currentQuestion];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === current.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
      soundEffects.play('correct');
      speak('Correct! ' + current.explanation);
    } else {
      soundEffects.play('wrong');
      speak('Wrong! The correct answer is ' + current.correctAnswer + '. ' + current.explanation);
    }

    setTimeout(() => {
      if (currentQuestion < CHALLENGES.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setCompleted(true);
      }
    }, 3000);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCompleted(false);
  };

  if (completed) {
    const percentage = (score / CHALLENGES.length) * 100;
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-12 text-center max-w-md shadow-2xl"
        >
          <div className="text-8xl mb-6">{percentage >= 80 ? '🏆' : percentage >= 60 ? '⭐' : '📚'}</div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Challenge Complete!</h2>
          <div className="text-5xl font-bold text-purple-600 mb-4">{score} / {CHALLENGES.length}</div>
          <div className="text-2xl text-gray-600 mb-8">{percentage.toFixed(0)}% correct</div>
          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl text-xl font-bold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl text-xl font-bold hover:bg-gray-300 transition-all"
            >
              Menu
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-bold text-xl">
            Question {currentQuestion + 1} / {CHALLENGES.length}
          </div>

          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-bold text-xl">
            <Brain className="w-5 h-5 inline mr-2" />
            {score}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="max-w-3xl w-full">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            {/* Question */}
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{current.question}</h2>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {current.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === current.correctAnswer;
                const showFeedback = showResult && isSelected;

                return (
                  <motion.button
                    key={option}
                    whileHover={!showResult ? { scale: 1.05 } : {}}
                    whileTap={!showResult ? { scale: 0.95 } : {}}
                    onClick={() => !showResult && handleAnswer(option)}
                    disabled={showResult}
                    className={`p-6 rounded-2xl text-2xl font-bold transition-all ${
                      showFeedback && isCorrect
                        ? 'bg-green-500 text-white'
                        : showFeedback && !isCorrect
                        ? 'bg-red-500 text-white'
                        : showResult && isCorrect
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200'
                    }`}
                  >
                    {option}
                    {showFeedback && (
                      <span className="ml-2">
                        {isCorrect ? <CheckCircle className="inline w-6 h-6" /> : <XCircle className="inline w-6 h-6" />}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-2xl"
                >
                  <p className="text-gray-700 text-lg">{current.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
