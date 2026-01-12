/**
 * Enhanced Multiplication Learning Page - Complete Implementation
 * Features:
 * - Profile integration & stats tracking
 * - Learning lessons with tricks and shortcuts
 * - Voice feedback throughout
 * - Touch-friendly number pad for mobile
 * - Timed challenges with countdown
 * - Mixed practice mode (random tables)
 * - Interactive multiplication grid
 * - Achievement badges system
 * - Review mode for wrong answers
 * - Progress dashboard with mastery tracking
 * - Difficulty levels (Easy/Medium/Hard)
 * - Enhanced animations and visual feedback
 * - Internationalization support
 *
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Star,
  CheckCircle,
  Play,
  RotateCcw,
  BookOpen,
  Zap,
  Grid3x3,
  Trophy,
  Clock,
  Shuffle,
  Target,
  TrendingUp,
  Lightbulb,
  Volume2,
  Award,
  XCircle,
  Home,
  ChevronRight,
  Brain,
  Sparkles,
  Timer
} from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { GradientButton } from '../components/GradientButton';
import { EmbeddedNumberPad } from '../components/EmbeddedNumberPad';
import {
  multiplicationLessons,
  generalMultiplicationTips,
  multiplicationStrategies,
  type MultiplicationLesson
} from '../utils/multiplicationLessons';
import { checkAndAwardBadges } from '../utils/badges';
import {
  MultiplicationGrid,
  ProgressDashboard,
  PracticeView
} from '../components/MultiplicationComponents';

interface Props {
  onBack: () => void;
  profileId: string;
}

type MainMode = 'menu' | 'lessons' | 'grid' | 'practice' | 'dashboard';
type LearningMode = 'select' | 'learn' | 'visualize' | 'practice' | 'quiz' | 'timed' | 'mixed' | 'review';
type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface QuestionResult {
  question: string;
  userAnswer: number;
  correctAnswer: number;
  correct: boolean;
  timeSpent: number;
  table: number;
  multiplier: number;
}

interface MultiplicationProgress {
  [table: number]: {
    practiced: number;
    mastered: boolean;
    lastScore: number;
    bestTime: number;
    correctAnswers: number;
    totalAttempts: number;
  };
}

export function MultiplicationLearningPageEnhanced({ onBack, profileId }: Props) {
  const { getProfile, updateProfile } = useProfiles();
  const profile = getProfile(profileId);
  const { speak, enabled: voiceEnabled } = useVoiceFeedback();

  // Main navigation
  const [mainMode, setMainMode] = useState<MainMode>('menu');
  const [learningMode, setLearningMode] = useState<LearningMode>('select');

  // Table and question management
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Scoring and progress
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<Array<{table: number; multiplier: number}>>([]);

  // Timing
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [timedMode, setTimedMode] = useState(false);

  // Difficulty and settings
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [showNumberPad, setShowNumberPad] = useState(true);

  // Progress tracking
  const [progress, setProgress] = useState<MultiplicationProgress>(() => {
    const saved = (profile as any)?.multiplicationProgress as MultiplicationProgress || {};
    // Initialize empty progress for all tables
    const fullProgress: MultiplicationProgress = {};
    for (let i = 1; i <= 12; i++) {
      fullProgress[i] = saved[i] || {
        practiced: 0,
        mastered: false,
        lastScore: 0,
        bestTime: Infinity,
        correctAnswers: 0,
        totalAttempts: 0
      };
    }
    return fullProgress;
  });

  // Timer countdown for timed challenges
  useEffect(() => {
    if (timedMode && learningMode === 'timed' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timedMode, learningMode, timeRemaining]);

  // Voice announcements for new questions
  useEffect(() => {
    if (voiceEnabled && selectedTable && currentMultiplier &&
        (learningMode === 'practice' || learningMode === 'quiz' || learningMode === 'timed' || learningMode === 'mixed') &&
        showFeedback === null) {
      speak(`${selectedTable} times ${currentMultiplier}`);
    }
  }, [currentMultiplier, selectedTable, learningMode, showFeedback]);

  const getDifficultyRange = (level: DifficultyLevel): number[] => {
    switch (level) {
      case 'easy':
        return [1, 2, 3, 4, 5];
      case 'medium':
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      case 'hard':
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }
  };

  const getMaxMultiplier = (level: DifficultyLevel): number => {
    switch (level) {
      case 'easy': return 5;
      case 'medium': return 10;
      case 'hard': return 12;
    }
  };

  const handleTableSelect = (table: number, mode: LearningMode = 'learn') => {
    setSelectedTable(table);
    setMainMode('practice');
    setLearningMode(mode);
    setCurrentQuestion(1);
    setCurrentMultiplier(1);
    setScore(0);
    setCompleted([]);
    setQuestionResults([]);
    setWrongAnswers([]);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setUserAnswer('');
    setShowFeedback(null);

    if (mode === 'timed') {
      setTimedMode(true);
      setTimeRemaining(60);
    }

    if (voiceEnabled) {
      speak(`Let's learn the ${table} times table!`);
    }
  };

  const handleModeChange = (newMode: LearningMode) => {
    setLearningMode(newMode);
    setCurrentQuestion(1);
    setCurrentMultiplier(1);
    setUserAnswer('');
    setShowFeedback(null);
    setQuestionStartTime(Date.now());
    setQuestionResults([]);
    setScore(0);
    setCompleted([]);

    if (newMode === 'timed') {
      setTimedMode(true);
      setTimeRemaining(60);
      setStartTime(Date.now());
    } else {
      setTimedMode(false);
    }
  };

  const handleAnswer = (answer: number) => {
    if (!selectedTable) return;

    const correctAnswer = selectedTable * currentMultiplier;
    const isCorrect = answer === correctAnswer;
    const timeSpent = Date.now() - questionStartTime;

    // Record result
    const result: QuestionResult = {
      question: `${selectedTable} × ${currentMultiplier}`,
      userAnswer: answer,
      correctAnswer,
      correct: isCorrect,
      timeSpent,
      table: selectedTable,
      multiplier: currentMultiplier
    };
    setQuestionResults((prev) => [...prev, result]);

    // Update progress
    const newProgress = { ...progress };
    if (!newProgress[selectedTable]) {
      newProgress[selectedTable] = {
        practiced: 0,
        mastered: false,
        lastScore: 0,
        bestTime: Infinity,
        correctAnswers: 0,
        totalAttempts: 0
      };
    }
    newProgress[selectedTable].totalAttempts += 1;
    if (isCorrect) {
      newProgress[selectedTable].correctAnswers += 1;
    }
    setProgress(newProgress);

    if (isCorrect) {
      setShowFeedback('correct');
      setScore((prev) => prev + 1);

      if (!completed.includes(currentMultiplier)) {
        setCompleted((prev) => [...prev, currentMultiplier]);
      }

      // Voice feedback
      if (voiceEnabled) {
        const encouragement = ['Excellent!', 'Great job!', 'Perfect!', 'Amazing!', 'Wonderful!', 'Fantastic!', 'Brilliant!'];
        speak(encouragement[Math.floor(Math.random() * encouragement.length)]);
      }

      setTimeout(() => {
        const maxMultiplier = getMaxMultiplier(difficulty);

        if (learningMode === 'mixed') {
          // In mixed mode, generate new random question
          if (currentQuestion < 20) {
            generateRandomQuestion(selectedTables);
            setCurrentQuestion((prev) => prev + 1);
            setUserAnswer('');
            setShowFeedback(null);
            setQuestionStartTime(Date.now());
          } else {
            handleCompletion();
          }
        } else if (learningMode === 'review') {
          // In review mode, move to next wrong answer
          const nextWrongIndex = wrongAnswers.findIndex(
            w => w.table === selectedTable && w.multiplier === currentMultiplier
          );
          if (nextWrongIndex < wrongAnswers.length - 1) {
            const nextWrong = wrongAnswers[nextWrongIndex + 1];
            setSelectedTable(nextWrong.table);
            setCurrentMultiplier(nextWrong.multiplier);
            setCurrentQuestion((prev) => prev + 1);
            setUserAnswer('');
            setShowFeedback(null);
            setQuestionStartTime(Date.now());
          } else {
            handleCompletion();
          }
        } else {
          // Regular progression through table
          if (currentMultiplier < maxMultiplier) {
            setCurrentMultiplier((prev) => prev + 1);
            setCurrentQuestion((prev) => prev + 1);
            setUserAnswer('');
            setShowFeedback(null);
            setQuestionStartTime(Date.now());
          } else {
            handleCompletion();
          }
        }
      }, 1500);
    } else {
      setShowFeedback('wrong');

      // Track wrong answer for review mode
      if (!wrongAnswers.find(w => w.table === selectedTable && w.multiplier === currentMultiplier)) {
        setWrongAnswers((prev) => [...prev, { table: selectedTable, multiplier: currentMultiplier }]);
      }

      if (voiceEnabled) {
        speak(`Not quite. The answer is ${correctAnswer}. Try to remember: ${selectedTable} times ${currentMultiplier} equals ${correctAnswer}`);
      }

      setTimeout(() => {
        setShowFeedback(null);
        setUserAnswer('');
      }, 2500);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const answer = parseInt(userAnswer);
    if (!isNaN(answer) && showFeedback === null) {
      handleAnswer(answer);
    }
  };

  const handleTimeUp = () => {
    setTimedMode(false);
    if (voiceEnabled) {
      speak("Time's up! Let's see how you did.");
    }
    handleCompletion();
  };

  const handleCompletion = () => {
    if (!selectedTable || !profile) return;

    // Update progress for this table
    const newProgress = { ...progress };
    const tableProgress = newProgress[selectedTable];

    tableProgress.practiced += 1;
    tableProgress.lastScore = score;

    const totalTime = Date.now() - startTime;
    if (totalTime < tableProgress.bestTime) {
      tableProgress.bestTime = totalTime;
    }

    // Calculate mastery
    const maxQuestions = learningMode === 'mixed' ? 20 : getMaxMultiplier(difficulty);
    const accuracy = tableProgress.totalAttempts > 0
      ? (tableProgress.correctAnswers / tableProgress.totalAttempts) * 100
      : 0;

    // Consider mastered if accuracy >= 90% and practiced at least 3 times
    if (accuracy >= 90 && tableProgress.practiced >= 3) {
      tableProgress.mastered = true;
    }

    setProgress(newProgress);

    // Save to profile
    updateProfile(profileId, {
      multiplicationProgress: newProgress as any
    });

    // Check for new badges
    if (profile) {
      checkAndAwardBadges(profile);
    }

    // Voice feedback for completion
    if (voiceEnabled) {
      const percentage = Math.round((score / maxQuestions) * 100);
      if (percentage >= 90) {
        speak(`Outstanding! You scored ${score} out of ${maxQuestions}. That's ${percentage} percent!`);
      } else if (percentage >= 70) {
        speak(`Good job! You scored ${score} out of ${maxQuestions}. Keep practicing!`);
      } else {
        speak(`You scored ${score} out of ${maxQuestions}. Don't give up! Practice makes perfect!`);
      }
    }
  };

  const handleMixedPractice = () => {
    const tables = getDifficultyRange(difficulty);
    setSelectedTables(tables);
    setMainMode('practice');
    setLearningMode('mixed');
    setScore(0);
    setQuestionResults([]);
    setWrongAnswers([]);
    setCurrentQuestion(1);
    setStartTime(Date.now());
    setTimedMode(false);

    // Generate first random question
    generateRandomQuestion(tables);

    if (voiceEnabled) {
      speak('Mixed practice mode! Get ready for random multiplication questions.');
    }
  };

  const generateRandomQuestion = (tables: number[]) => {
    const randomTable = tables[Math.floor(Math.random() * tables.length)];
    const maxMultiplier = getMaxMultiplier(difficulty);
    const randomMultiplier = Math.floor(Math.random() * maxMultiplier) + 1;

    setSelectedTable(randomTable);
    setCurrentMultiplier(randomMultiplier);
    setUserAnswer('');
    setShowFeedback(null);
    setQuestionStartTime(Date.now());
  };

  const handleReviewMode = () => {
    if (wrongAnswers.length === 0) {
      if (voiceEnabled) {
        speak("Great! You don't have any wrong answers to review.");
      }
      return;
    }

    setMainMode('practice');
    setLearningMode('review');
    const firstWrong = wrongAnswers[0];
    setSelectedTable(firstWrong.table);
    setCurrentMultiplier(firstWrong.multiplier);
    setQuestionResults([]);
    setScore(0);
    setCurrentQuestion(1);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());

    if (voiceEnabled) {
      speak(`Review mode. Let's practice the ${wrongAnswers.length} questions you got wrong.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-50 bg-white hover:bg-gray-100 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-gray-800"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Home</span>
      </button>

      {/* Voice indicator */}
      {voiceEnabled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-6 right-6 z-50 bg-green-500/90 backdrop-blur-sm px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
        >
          <Volume2 className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium">Voice On</span>
        </motion.div>
      )}

      <div className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Main Menu */}
          {mainMode === 'menu' && (
            <MainMenu
              onSelectMode={setMainMode}
              onSelectTable={handleTableSelect}
              onMixedPractice={handleMixedPractice}
              onReviewMode={handleReviewMode}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              progress={progress}
              wrongAnswersCount={wrongAnswers.length}
              voiceEnabled={voiceEnabled}
            />
          )}

          {/* Lessons Mode */}
          {mainMode === 'lessons' && (
            <LessonsView
              onBack={() => setMainMode('menu')}
              onSelectTable={handleTableSelect}
              speak={speak}
              voiceEnabled={voiceEnabled}
            />
          )}

          {/* Multiplication Grid */}
          {mainMode === 'grid' && (
            <MultiplicationGrid
              onBack={() => setMainMode('menu')}
              onSelectTable={handleTableSelect}
              progress={progress}
              difficulty={difficulty}
              speak={speak}
              voiceEnabled={voiceEnabled}
            />
          )}

          {/* Progress Dashboard */}
          {mainMode === 'dashboard' && (
            <ProgressDashboard
              onBack={() => setMainMode('menu')}
              progress={progress}
              profile={profile!}
              difficulty={difficulty}
            />
          )}

          {/* Practice Modes */}
          {mainMode === 'practice' && selectedTable && (
            <PracticeView
              selectedTable={selectedTable}
              currentMultiplier={currentMultiplier}
              learningMode={learningMode}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              showFeedback={showFeedback}
              score={score}
              completed={completed}
              difficulty={difficulty}
              handleSubmit={handleSubmit}
              handleModeChange={handleModeChange}
              onBack={() => setMainMode('menu')}
              showNumberPad={showNumberPad}
              timedMode={timedMode}
              timeRemaining={timeRemaining}
              questionResults={questionResults}
              wrongAnswers={wrongAnswers}
              currentQuestion={currentQuestion}
              startTime={startTime}
              questionStartTime={questionStartTime}
              progress={progress}
              voiceEnabled={voiceEnabled}
              onRestart={() => {
                handleTableSelect(selectedTable, learningMode);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN MENU COMPONENT
// ============================================================================
function MainMenu({
  onSelectMode,
  onSelectTable,
  onMixedPractice,
  onReviewMode,
  difficulty,
  onDifficultyChange,
  progress,
  wrongAnswersCount,
  voiceEnabled
}: any) {
  const menuOptions = [
    {
      id: 'lessons',
      title: 'Learn with Tricks',
      description: 'Discover multiplication shortcuts and memory tricks',
      icon: BookOpen,
      color: 'from-blue-400 to-cyan-500',
      onClick: () => onSelectMode('lessons')
    },
    {
      id: 'grid',
      title: 'Times Table Chart',
      description: 'Interactive multiplication grid 1-12',
      icon: Grid3x3,
      color: 'from-green-400 to-emerald-500',
      onClick: () => onSelectMode('grid')
    },
    {
      id: 'practice',
      title: 'Practice Tables',
      description: 'Master individual times tables step by step',
      icon: Play,
      color: 'from-purple-400 to-pink-500',
      onClick: () => onSelectMode('practice')
    },
    {
      id: 'dashboard',
      title: 'Your Progress',
      description: 'Track mastery and view detailed statistics',
      icon: TrendingUp,
      color: 'from-yellow-400 to-orange-500',
      onClick: () => onSelectMode('dashboard')
    }
  ];

  // Count mastered tables
  const masteredCount = Object.values(progress).filter((p: any) => p.mastered).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-5xl sm:text-6xl text-white mb-4 drop-shadow-lg font-bold"
        >
          Master Multiplication! ✖️
        </motion.h1>
        <motion.p
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          className="text-xl sm:text-2xl text-white/90"
        >
          Learn, practice, and master your times tables
        </motion.p>
        {masteredCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4 inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full font-bold shadow-lg"
          >
            <Trophy className="w-5 h-5" />
            {masteredCount} Table{masteredCount !== 1 ? 's' : ''} Mastered!
          </motion.div>
        )}
      </div>

      {/* Difficulty Selector */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl max-w-3xl mx-auto"
      >
        <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2 font-bold">
          <Target className="w-6 h-6 text-purple-600" />
          Choose Your Challenge Level
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {(['easy', 'medium', 'hard'] as const).map((level) => (
            <motion.button
              key={level}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDifficultyChange(level)}
              className={`p-4 rounded-xl transition-all ${
                difficulty === level
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-lg font-bold capitalize">{level}</div>
              <div className="text-sm opacity-90">
                {level === 'easy' ? 'Tables 1-5' : level === 'medium' ? 'Tables 1-10' : 'Tables 1-12'}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onMixedPractice}
          className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <Shuffle className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold">Mixed Practice</div>
              <div className="text-sm opacity-90">Random questions</div>
            </div>
          </div>
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        {wrongAnswersCount > 0 && (
          <motion.button
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReviewMode}
            className="bg-gradient-to-r from-red-400 to-pink-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">Review Mistakes</div>
                <div className="text-sm opacity-90">{wrongAnswersCount} to practice</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        )}
      </div>

      {/* Main Menu Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuOptions.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={option.onClick}
            className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all text-left group"
          >
            <div className={`w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <option.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">{option.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{option.description}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// LESSONS VIEW COMPONENT - Learning tricks and tips
// ============================================================================
function LessonsView({ onBack, onSelectTable, speak, voiceEnabled }: any) {
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
