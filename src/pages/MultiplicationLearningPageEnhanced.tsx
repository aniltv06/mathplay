/**
 * Enhanced Multiplication Learning Page - Page Coordinator
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
import { motion } from 'motion/react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { checkAndAwardBadges } from '../utils/badges';
import {
  MultiplicationGrid,
  ProgressDashboard,
  PracticeView
} from '../components/MultiplicationComponents';
import { MultiplicationMainMenu } from '../components/MultiplicationMainMenu';
import { MultiplicationLessonsView } from '../components/MultiplicationLessonsView';
import type {
  MainMode,
  LearningMode,
  DifficultyLevel,
  QuestionResult,
  MultiplicationProgress
} from '../components/multiplicationTypes';

interface Props {
  onBack: () => void;
  profileId: string;
}

export function MultiplicationLearningPageEnhanced({ onBack, profileId }: Props) {
  const { getProfile, updateProfile, awardBadge } = useProfiles();
  const profile = getProfile(profileId);
  const { speak, enabled: voiceEnabled, setEnabled: setVoiceEnabled } = useVoiceFeedback();

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
  const [showNumberPad] = useState(true);

  // Progress tracking
  const [progress, setProgress] = useState<MultiplicationProgress>(() => {
    const saved = (profile?.multiplicationProgress ?? {}) as MultiplicationProgress;
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
      case 'easy':   return [1, 2, 3, 4, 5];
      case 'medium': return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      case 'hard':   return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }
  };

  const getMaxMultiplier = (level: DifficultyLevel): number => {
    switch (level) {
      case 'easy':   return 5;
      case 'medium': return 10;
      case 'hard':   return 12;
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

      if (voiceEnabled) {
        const encouragement = ['Excellent!', 'Great job!', 'Perfect!', 'Amazing!', 'Wonderful!', 'Fantastic!', 'Brilliant!'];
        speak(encouragement[Math.floor(Math.random() * encouragement.length)]);
      }

      setTimeout(() => {
        const maxMultiplier = getMaxMultiplier(difficulty);

        if (learningMode === 'mixed') {
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

    const newProgress = { ...progress };
    const tableProgress = newProgress[selectedTable];

    tableProgress.practiced += 1;
    tableProgress.lastScore = score;

    const totalTime = Date.now() - startTime;
    if (totalTime < tableProgress.bestTime) {
      tableProgress.bestTime = totalTime;
    }

    const maxQuestions = learningMode === 'mixed' ? 20 : getMaxMultiplier(difficulty);
    const accuracy = tableProgress.totalAttempts > 0
      ? (tableProgress.correctAnswers / tableProgress.totalAttempts) * 100
      : 0;

    if (accuracy >= 90 && tableProgress.practiced >= 3) {
      tableProgress.mastered = true;
    }

    setProgress(newProgress);

    updateProfile(profileId, {
      multiplicationProgress: newProgress as Record<string, unknown>
    });

    if (profile) {
      const newBadgeIds = checkAndAwardBadges(profile);
      newBadgeIds.forEach(id => awardBadge(profileId, id));
    }

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
        aria-label="Go back to Home"
        className="absolute top-6 left-6 z-50 bg-white hover:bg-gray-100 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-gray-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        <span className="hidden sm:inline">Home</span>
      </button>

      {/* Voice toggle */}
      <button
        onClick={() => setVoiceEnabled(!voiceEnabled)}
        aria-label={voiceEnabled ? 'Turn voice off' : 'Turn voice on'}
        aria-pressed={voiceEnabled}
        className={`absolute top-6 right-6 z-50 backdrop-blur-sm px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 ${voiceEnabled ? 'bg-green-500/90 hover:bg-green-600/90' : 'bg-gray-500/90 hover:bg-gray-600/90'}`}
      >
        <Volume2 className={`w-5 h-5 ${voiceEnabled ? 'animate-pulse' : ''}`} aria-hidden="true" />
        <span className="text-sm font-medium">{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
      </button>

      <div className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Main Menu */}
          {mainMode === 'menu' && (
            <MultiplicationMainMenu
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
            <MultiplicationLessonsView
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
