/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Shape Game Modes
 * Adventure Mode, Quiz Mode, and Match Game components
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, Star, Trophy, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { SHAPES, Shape, getRandomShapes, getShapeById } from '../utils/shapes';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { soundEffects } from '../utils/soundEffects';

interface GameProps {
  onBack: () => void;
  profileId: string;
}

// ================== ADVENTURE MODE ==================
export function AdventureMode({ onBack, profileId }: GameProps) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [shapesCollected, setShapesCollected] = useState<string[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [options, setOptions] = useState<Shape[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const { speak } = useVoiceFeedback();

  useEffect(() => {
    loadNextShape();
  }, []);

  const loadNextShape = () => {
    const difficulty = currentLevel <= 4 ? 'easy' : currentLevel <= 8 ? 'medium' : 'hard';
    const availableShapes = SHAPES.filter(s => s.difficulty === difficulty && !shapesCollected.includes(s.id));

    if (availableShapes.length === 0) {
      setVictory(true);
      speak('Congratulations! You collected all the shapes!');
      return;
    }

    const shape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    setCurrentShape(shape);

    // Generate 3 wrong options + 1 correct
    const wrongShapes = SHAPES.filter(s => s.id !== shape.id);
    const shuffled = [...wrongShapes].sort(() => 0.5 - Math.random()).slice(0, 3);
    const allOptions = [...shuffled, shape].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setShowResult(null);
  };

  const handleAnswer = (selectedShape: Shape) => {
    if (selectedShape.id === currentShape?.id) {
      setShowResult('correct');
      setScore(score + 10);
      setShapesCollected([...shapesCollected, currentShape.id]);
      soundEffects.play('correct');
      speak('Correct!');

      setTimeout(() => {
        setCurrentLevel(currentLevel + 1);
        loadNextShape();
      }, 1500);
    } else {
      setShowResult('wrong');
      setLives(lives - 1);
      soundEffects.play('wrong');
      speak('Try again!');

      if (lives - 1 <= 0) {
        setGameOver(true);
        speak('Game over!');
      } else {
        setTimeout(() => setShowResult(null), 1500);
      }
    }
  };

  const handleRestart = () => {
    setCurrentLevel(1);
    setLives(3);
    setShapesCollected([]);
    setScore(0);
    setGameOver(false);
    setVictory(false);
    loadNextShape();
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-12 text-center max-w-md shadow-2xl"
        >
          <div className="text-8xl mb-6">😢</div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Game Over!</h2>
          <p className="text-xl text-gray-600 mb-6">
            You collected {shapesCollected.length} shapes!
          </p>
          <div className="text-3xl font-bold text-purple-600 mb-8">
            Score: {score}
          </div>
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

  if (victory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="bg-white rounded-3xl p-12 text-center max-w-md shadow-2xl"
        >
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Victory!</h2>
          <p className="text-xl text-gray-600 mb-6">
            You're a Shape Master!
          </p>
          <div className="text-5xl font-bold text-yellow-600 mb-8">
            {score} points!
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl text-xl font-bold hover:shadow-lg transition-all"
            >
              Play Again
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Menu
          </button>

          <div className="flex items-center gap-4">
            {/* Lives */}
            <div className="flex gap-2">
              {Array.from({ length: lives }).map((_, i) => (
                <Heart key={i} className="w-8 h-8 fill-red-500 text-red-500" />
              ))}
            </div>

            {/* Score */}
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-bold text-xl">
              <Star className="w-5 h-5 inline mr-2" />
              {score}
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="relative z-10 px-4 py-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="max-w-4xl w-full">
          {currentShape && (
            <motion.div
              key={currentLevel}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-2xl"
            >
              {/* Level Info */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Level {currentLevel}
                </h2>
                <p className="text-xl text-gray-600">
                  Tap the correct shape name!
                </p>
              </div>

              {/* Shape Display */}
              <div className="flex justify-center mb-8">
                <svg width="200" height="200" viewBox="0 0 100 100">
                  <path d={currentShape.svgPath} fill={currentShape.color} />
                </svg>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4">
                {options.map((shape) => (
                  <motion.button
                    key={shape.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(shape)}
                    disabled={showResult !== null}
                    className={`p-6 rounded-2xl text-2xl font-bold transition-all ${
                      showResult === 'correct' && shape.id === currentShape.id
                        ? 'bg-green-500 text-white'
                        : showResult === 'wrong' && shape.id === currentShape.id
                        ? 'bg-green-500 text-white'
                        : showResult === 'wrong' && shape.id !== currentShape.id
                        ? 'bg-red-500 text-white'
                        : 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200'
                    }`}
                  >
                    {shape.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ================== QUIZ MODE ==================
export function QuizMode({ onBack, profileId }: GameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [questions] = useState(() => generateQuizQuestions());
  const { speak } = useVoiceFeedback();

  function generateQuizQuestions() {
    const selectedShapes = getRandomShapes(10);
    return selectedShapes.map(shape => {
      const questionTypes = [
        { q: `How many sides does a ${shape.name} have?`, a: shape.sides.toString() },
        { q: `How many corners does a ${shape.name} have?`, a: shape.corners.toString() },
        { q: `Which shape is this?`, a: shape.name, showShape: true },
      ];
      const selected = questionTypes[Math.floor(Math.random() * questionTypes.length)];

      let options: string[];
      if (selected.showShape) {
        options = getRandomShapes(4).map(s => s.name);
        if (!options.includes(shape.name)) {
          options[Math.floor(Math.random() * options.length)] = shape.name;
        }
      } else {
        const nums = [shape.sides, shape.corners];
        options = Array.from(new Set([...nums, nums[0] + 1, nums[0] - 1, nums[0] + 2])).map(String).slice(0, 4);
        if (!options.includes(selected.a)) {
          options[0] = selected.a;
        }
      }

      return {
        ...selected,
        shape,
        options: options.sort(() => 0.5 - Math.random()),
      };
    });
  }

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === questions[currentQuestion].a;
    if (isCorrect) {
      setScore(score + 10);
      soundEffects.play('correct');
      speak('Correct!');
    } else {
      soundEffects.play('wrong');
      speak('Wrong! The correct answer is ' + questions[currentQuestion].a);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizComplete(true);
      }
    }, 2000);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
  };

  if (quizComplete) {
    const percentage = (score / (questions.length * 10)) * 100;
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-12 text-center max-w-md shadow-2xl"
        >
          <div className="text-8xl mb-6">
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '😊' : '📚'}
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Quiz Complete!</h2>
          <div className="text-5xl font-bold text-green-600 mb-4">{score} points</div>
          <div className="text-2xl text-gray-600 mb-8">{percentage.toFixed(0)}% correct</div>
          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl text-xl font-bold hover:shadow-lg transition-all"
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

  const current = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Menu
          </button>

          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-bold text-xl">
            Question {currentQuestion + 1} / {questions.length}
          </div>

          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-bold text-xl">
            <Trophy className="w-5 h-5 inline mr-2" />
            {score}
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="relative z-10 px-4 py-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="max-w-3xl w-full">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            {/* Question */}
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {current.q}
            </h2>

            {/* Shape Display */}
            {current.showShape && (
              <div className="flex justify-center mb-8">
                <svg width="200" height="200" viewBox="0 0 100 100">
                  <path d={current.shape.svgPath} fill={current.shape.color} />
                </svg>
              </div>
            )}

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {current.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === current.a;
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
                        : 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200'
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ================== MATCH GAME ==================
export function MatchGame({ onBack, profileId }: GameProps) {
  const [shapes] = useState(() => getRandomShapes(6));
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const { speak } = useVoiceFeedback();

  const examples = shapes.map(s => s.realWorldExamples[0]);

  useEffect(() => {
    if (selectedShape && selectedExample) {
      const isMatch = selectedShape.realWorldExamples[0] === selectedExample;

      if (isMatch) {
        soundEffects.play('correct');
        speak('Perfect match!');
        setMatchedPairs([...matchedPairs, selectedShape.id]);
        setScore(score + 10);

        if (matchedPairs.length + 1 === shapes.length) {
          setGameComplete(true);
          speak('Congratulations! You matched all shapes!');
        }
      } else {
        soundEffects.play('wrong');
        speak('Try again!');
      }

      setTimeout(() => {
        setSelectedShape(null);
        setSelectedExample(null);
      }, 1000);
    }
  }, [selectedShape, selectedExample]);

  const handleRestart = () => {
    setMatchedPairs([]);
    setScore(0);
    setGameComplete(false);
    setSelectedShape(null);
    setSelectedExample(null);
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="bg-white rounded-3xl p-12 text-center max-w-md shadow-2xl"
        >
          <div className="text-8xl mb-6">🎯</div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Perfect!</h2>
          <div className="text-5xl font-bold text-yellow-600 mb-8">{score} points!</div>
          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white py-4 rounded-xl text-xl font-bold hover:shadow-lg transition-all"
            >
              Play Again
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Menu
          </button>

          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-bold text-xl">
            <Sparkles className="w-5 h-5 inline mr-2" />
            {score} points
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="relative z-10 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
            Match shapes with real-world objects!
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Shapes Column */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-4">Shapes</h3>
              {shapes.map((shape) => {
                const isMatched = matchedPairs.includes(shape.id);
                const isSelected = selectedShape?.id === shape.id;

                return (
                  <motion.button
                    key={shape.id}
                    onClick={() => !isMatched && setSelectedShape(shape)}
                    disabled={isMatched}
                    whileHover={!isMatched ? { scale: 1.05 } : {}}
                    whileTap={!isMatched ? { scale: 0.95 } : {}}
                    className={`w-full p-6 rounded-2xl transition-all flex items-center gap-4 ${
                      isMatched
                        ? 'bg-green-200 opacity-50'
                        : isSelected
                        ? 'bg-white ring-4 ring-yellow-500 shadow-2xl'
                        : 'bg-white hover:shadow-xl'
                    }`}
                  >
                    <svg width="80" height="80" viewBox="0 0 100 100">
                      <path d={shape.svgPath} fill={shape.color} />
                    </svg>
                    <span className="text-2xl font-bold text-gray-800">{shape.name}</span>
                    {isMatched && <CheckCircle className="ml-auto w-8 h-8 text-green-600" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Examples Column */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-4">Real World</h3>
              {examples.map((example, index) => {
                const shape = shapes[index];
                const isMatched = matchedPairs.includes(shape.id);
                const isSelected = selectedExample === example;

                return (
                  <motion.button
                    key={example}
                    onClick={() => !isMatched && setSelectedExample(example)}
                    disabled={isMatched}
                    whileHover={!isMatched ? { scale: 1.05 } : {}}
                    whileTap={!isMatched ? { scale: 0.95 } : {}}
                    className={`w-full p-6 rounded-2xl transition-all flex items-center gap-4 ${
                      isMatched
                        ? 'bg-green-200 opacity-50'
                        : isSelected
                        ? 'bg-white ring-4 ring-yellow-500 shadow-2xl'
                        : 'bg-white hover:shadow-xl'
                    }`}
                  >
                    <span className="text-4xl">{getEmojiForExample(example)}</span>
                    <span className="text-2xl font-bold text-gray-800">{example}</span>
                    {isMatched && <CheckCircle className="ml-auto w-8 h-8 text-green-600" />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for emojis (same as in ExploreMode)
function getEmojiForExample(example: string): string {
  const emojiMap: Record<string, string> = {
    'Sun': '☀️', 'Ball': '⚽', 'Pizza': '🍕', 'Wheel': '🎡', 'Clock': '🕐', 'Cookie': '🍪',
    'Window': '🪟', 'Dice': '🎲', 'Chocolate': '🍫', 'Chess board': '♟️', 'Cracker': '🍘',
    'Picture frame': '🖼️', 'Pizza slice': '🍕', 'Mountain': '⛰️', 'Roof': '🏠',
    'Traffic sign': '🚸', 'Sandwich': '🥪', 'Pyramid': '🔺', 'Door': '🚪', 'Book': '📚',
    'Phone': '📱', 'TV': '📺', 'Envelope': '✉️', 'Ruler': '📏', 'Egg': '🥚',
    'Rugby ball': '🏈', 'Watermelon': '🍉', 'Mirror': '🪞', 'Track': '🏃', 'Face': '😊',
  };
  return emojiMap[example] || '📦';
}
