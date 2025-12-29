/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Worksheet View Component
 * Main worksheet interface for answering math problems
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle, Calculator } from 'lucide-react';
import type { Problem, ProblemSettings, WorksheetSession } from '../types';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { NumberPadModal } from './NumberPadModal';

// Word problem templates
const wordProblemTemplates: Record<'+' | '-' | '×' | '÷', (n1: number, n2: number) => string[]> = {
  '+': (n1: number, n2: number) => [
    `You have ${n1} apples. Your friend gives you ${n2} more apples. How many apples do you have now?`,
    `There are ${n1} birds on a tree. ${n2} more birds join them. How many birds are there in total?`,
    `You collect ${n1} coins on Monday and ${n2} coins on Tuesday. How many coins did you collect altogether?`,
    `A baker makes ${n1} cookies in the morning and ${n2} cookies in the afternoon. How many cookies in total?`,
    `You read ${n1} pages today and ${n2} pages yesterday. How many pages total?`
  ],
  '-': (n1: number, n2: number) => [
    `You have ${n1} candies. You give ${n2} candies to your friend. How many candies do you have left?`,
    `There are ${n1} students in class. ${n2} students go home early. How many students remain?`,
    `You have ${n1} dollars. You spend ${n2} dollars on a toy. How much money do you have left?`,
    `A tree has ${n1} leaves. ${n2} leaves fall off. How many leaves are still on the tree?`,
    `There are ${n1} cars in a parking lot. ${n2} cars drive away. How many cars remain?`
  ],
  '×': (n1: number, n2: number) => [
    `There are ${n1} boxes. Each box has ${n2} toys. How many toys are there in total?`,
    `You buy ${n1} packs of stickers. Each pack has ${n2} stickers. How many stickers do you have?`,
    `A garden has ${n1} rows of flowers. Each row has ${n2} flowers. How many flowers in total?`,
    `${n1} friends each have ${n2} pencils. How many pencils do they have altogether?`,
    `You run ${n1} laps. Each lap is ${n2} meters. How many meters did you run in total?`
  ],
  '÷': (n1: number, n2: number) => [
    `You have ${n1} cookies to share equally among ${n2} friends. How many cookies does each friend get?`,
    `A teacher has ${n1} pencils to divide equally into ${n2} groups. How many pencils per group?`,
    `${n1} apples are packed into ${n2} bags equally. How many apples in each bag?`,
    `You have ${n1} stickers to share with ${n2} people. How many stickers does each person get?`,
    `A pizza is cut into ${n1} slices. ${n2} people share it equally. How many slices per person?`
  ]
};

const getWordProblem = (problem: Problem): string => {
  const templates = wordProblemTemplates[problem.operation];
  if (templates) {
    const stories = templates(problem.num1, problem.num2);
    return stories[Math.floor(Math.random() * stories.length)];
  }
  return `${problem.num1} ${problem.operation} ${problem.num2} = ?`;
};

interface Props {
  settings: ProblemSettings;
  profileId: string;
  onComplete: (session: WorksheetSession) => void;
}

export function WorksheetView({ settings, profileId, onComplete }: Props) {
  const { speakProblem, speak } = useVoiceFeedback();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [validationStatus, setValidationStatus] = useState<('correct' | 'wrong' | null)[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(settings.timeLimit || 300);
  const [timerActive, setTimerActive] = useState(settings.timedMode || false);

  // Number pad modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

  // Generate problems on mount
  useEffect(() => {
    const generated = generateProblems(settings);
    setProblems(generated);
    setAnswers(new Array(generated.length).fill(null));
    setValidationStatus(new Array(generated.length).fill(null));
  }, [settings]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || !settings.timedMode) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, settings.timedMode]);

  const generateProblems = useCallback((settings: ProblemSettings): Problem[] => {
    const problems: Problem[] = [];
    const problemSet = new Set<string>(); // Track unique problems
    const operations: Array<'+' | '-' | '×' | '÷'> = [];

    if (settings.includeAddition) operations.push('+');
    if (settings.includeSubtraction) operations.push('-');
    if (settings.includeMultiplication) operations.push('×');
    if (settings.includeDivision) operations.push('÷');

    let attempts = 0;
    const maxAttempts = settings.numProblems * 10; // Prevent infinite loops

    while (problems.length < settings.numProblems && attempts < maxAttempts) {
      attempts++;

      const operation = operations[Math.floor(Math.random() * operations.length)];
      let num1 = Math.floor(Math.random() * (settings.maxNum - settings.minNum + 1)) + settings.minNum;
      let num2 = Math.floor(Math.random() * (settings.maxNum - settings.minNum + 1)) + settings.minNum;
      let problem: Problem | null = null;

      switch (operation) {
        case '+':
          problem = { num1, num2, operation, correct: num1 + num2 };
          break;
        case '-':
          // Ensure positive result
          if (num1 < num2) [num1, num2] = [num2, num1];
          problem = { num1, num2, operation, correct: num1 - num2 };
          break;
        case '×':
          problem = { num1, num2, operation, correct: num1 * num2 };
          break;
        case '÷':
          // Ensure even division
          const quotient = num2;
          const dividend = num1 * num2;
          problem = { num1: dividend, num2: num1, operation, correct: quotient };
          break;
      }

      if (problem) {
        // Create unique key for this problem
        const problemKey = `${problem.num1}${problem.operation}${problem.num2}`;

        // Only add if not duplicate
        if (!problemSet.has(problemKey)) {
          problemSet.add(problemKey);
          problems.push(problem);
        }
      }
    }

    return problems;
  }, []);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    const parsedValue = parseInt(value);
    newAnswers[index] = value === '' || isNaN(parsedValue) ? null : parsedValue;
    setAnswers(newAnswers);

    // Clear validation status when user changes answer
    const newValidation = [...validationStatus];
    newValidation[index] = null;
    setValidationStatus(newValidation);
  };

  const handleCheck = (index: number) => {
    const userAnswer = answers[index];
    const problem = problems[index];

    if (userAnswer === null || isNaN(userAnswer)) return;

    // Don't allow re-checking already correct answers
    if (validationStatus[index] === 'correct') return;

    const isCorrect = userAnswer === problem.correct;
    const newValidation = [...validationStatus];
    newValidation[index] = isCorrect ? 'correct' : 'wrong';
    setValidationStatus(newValidation);

    if (isCorrect) {
      speak(`${problem.correct}! Correct!`);
      // Only increment streak if this is a new correct answer
      setCurrentStreak(prev => prev + 1);
    } else {
      speak('Wrong! Try again!');
      setCurrentStreak(0);
    }
  };

  // Open number pad modal for specific problem
  const handleOpenModal = (index: number) => {
    setCurrentProblemIndex(index);
    setIsModalOpen(true);

    // Speak the problem when opening
    const problem = problems[index];
    if (problem) {
      speakProblem(problem.num1, problem.operation, problem.num2);
    }
  };

  // Handle answer submission from modal
  const handleModalSubmit = (answer: number) => {
    if (isNaN(answer)) return;

    // Check if this problem was already answered correctly
    const wasAlreadyCorrect = validationStatus[currentProblemIndex] === 'correct';

    const newAnswers = [...answers];
    newAnswers[currentProblemIndex] = answer;
    setAnswers(newAnswers);

    const problem = problems[currentProblemIndex];
    const isCorrect = answer === problem.correct;

    const newValidation = [...validationStatus];
    newValidation[currentProblemIndex] = isCorrect ? 'correct' : 'wrong';
    setValidationStatus(newValidation);

    if (isCorrect) {
      speak(`${problem.correct}! Correct!`);
      // Only increment streak if this is a NEW correct answer (not already correct)
      if (!wasAlreadyCorrect) {
        setCurrentStreak(prev => prev + 1);
      }

      // Auto-advance to next unanswered problem or close if all answered
      const nextIndex = currentProblemIndex + 1;
      if (nextIndex < problems.length) {
        setCurrentProblemIndex(nextIndex);
        // Speak next problem
        const nextProblem = problems[nextIndex];
        if (nextProblem) {
          speakProblem(nextProblem.num1, nextProblem.operation, nextProblem.num2);
        }
      } else {
        // All problems answered, close modal
        setIsModalOpen(false);
      }
    } else {
      speak('Wrong! Try again!');
      // Only reset streak if this problem was NOT already correct
      if (!wasAlreadyCorrect) {
        setCurrentStreak(0);
      }
      // Stay on current problem for correction
    }
  };

  // Navigate to previous problem
  const handlePrevious = () => {
    if (currentProblemIndex > 0) {
      const newIndex = currentProblemIndex - 1;
      setCurrentProblemIndex(newIndex);

      // Speak the problem
      const problem = problems[newIndex];
      if (problem) {
        speakProblem(problem.num1, problem.operation, problem.num2);
      }
    }
  };

  // Navigate to next problem
  const handleNext = () => {
    if (currentProblemIndex < problems.length - 1) {
      const newIndex = currentProblemIndex + 1;
      setCurrentProblemIndex(newIndex);

      // Speak the problem
      const problem = problems[newIndex];
      if (problem) {
        speakProblem(problem.num1, problem.operation, problem.num2);
      }
    }
  };

  const handleComplete = () => {
    const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);

    let correctCount = 0;
    let wrongCount = 0;

    problems.forEach((problem, index) => {
      const answer = answers[index];
      if (answer !== null) {
        if (answer === problem.correct) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    });

    const percentage = problems.length > 0 ? Math.round((correctCount / problems.length) * 100) : 0;

    const session: WorksheetSession = {
      date: new Date().toISOString(),
      settings,
      problems,
      answers,
      timeSpent,
      completed: true,
      correctCount,
      wrongCount,
      percentage,
      currentStreak,
    };

    onComplete(session);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const progress = (answeredCount / problems.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl text-gray-800 mb-1">Math Worksheet</h2>
              <p className="text-gray-600">Answer: {answeredCount} / {problems.length}</p>
            </div>
            {settings.timedMode && (
              <div className="flex items-center gap-2">
                <Clock className={`w-6 h-6 ${timeRemaining <= 60 ? 'text-red-500' : 'text-blue-500'}`} />
                <span className={`text-2xl ${timeRemaining <= 60 ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Streak */}
          {currentStreak > 0 && (
            <div className="mt-3 text-center text-lg text-orange-600">
              🔥 Streak: {currentStreak}
            </div>
          )}
        </motion.div>

        {/* Problems Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleOpenModal(index)}
                className={`relative p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                  validationStatus[index] === 'correct'
                    ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 border-2 border-green-300'
                    : validationStatus[index] === 'wrong'
                    ? 'bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 border-2 border-red-300'
                    : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 hover:scale-[1.02]'
                }`}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -ml-12 -mb-12"></div>

                {/* Problem Number Badge */}
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                  <span className="text-xs font-semibold text-purple-600">#{index + 1}</span>
                </div>

                {/* Check Button (Top Right) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCheck(index);
                  }}
                  disabled={answers[index] === null}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white disabled:bg-gray-100/80 disabled:cursor-not-allowed p-2 rounded-full shadow-sm transition-all"
                  title="Check Answer"
                >
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </button>

                {/* Centered Vertical Math Layout or Word Problem */}
                <div className="relative flex flex-col items-center pt-8">
                  {settings.displayAsWordProblems ? (
                    /* Word Problem Layout */
                    <div className="text-center max-w-md">
                      <p className="text-lg font-medium text-gray-800 leading-relaxed mb-6 text-left">
                        {getWordProblem(problem)}
                      </p>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-xl font-semibold text-gray-700">Answer:</span>
                      </div>
                    </div>
                  ) : (
                    /* Math Problem Container - Centered with right-aligned digits */
                    <div className="inline-block">
                      {/* First Number - Right aligned */}
                      <div className="text-6xl font-bold text-gray-800 mb-2 text-right">
                        {problem.num1}
                      </div>

                      {/* Operation + Second Number Row - Right aligned */}
                      <div className="flex items-center justify-end mb-3">
                        <div className="text-5xl font-bold text-purple-600 mr-2">
                          {problem.operation}
                        </div>
                        <div className="text-6xl font-bold text-gray-800">
                          {problem.num2}
                        </div>
                      </div>

                      {/* Divider Line with gradient */}
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-4"></div>
                    </div>
                  )}

                  {/* Answer Input - Centered */}
                  <input
                    type="number"
                    value={answers[index] === null ? '' : answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCheck(index);
                    }}
                    className="w-48 px-6 py-4 text-5xl font-bold text-center text-gray-800 bg-white/60 backdrop-blur-sm border-2 border-purple-300 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200/50 outline-none transition-all shadow-inner"
                    placeholder="?"
                    style={{ cursor: 'pointer' }}
                  />
                </div>

                {/* Calculator hint with icon */}
                <div className="flex items-center justify-center gap-2 mt-6 text-xs text-purple-600/70 font-medium">
                  <Calculator className="w-3 h-3" />
                  <span>Tap to open calculator</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            className="w-full mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-2xl text-xl transition-all shadow-lg hover:shadow-xl"
          >
            Complete Worksheet
          </button>
        </motion.div>

        {/* Number Pad Modal */}
        {problems.length > 0 && (
          <NumberPadModal
            isOpen={isModalOpen}
            problem={problems[currentProblemIndex]}
            currentQuestion={currentProblemIndex + 1}
            totalQuestions={problems.length}
            onSubmit={handleModalSubmit}
            onClose={() => setIsModalOpen(false)}
            showNavigation={true}
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasPrevious={currentProblemIndex > 0}
            hasNext={currentProblemIndex < problems.length - 1}
            initialAnswer={answers[currentProblemIndex]}
          />
        )}
      </div>
    </div>
  );
}
