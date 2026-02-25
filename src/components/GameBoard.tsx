/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Trophy, Clock } from 'lucide-react';
import type { Difficulty, GameSettings, GameStats, Problem, HangmanSession, Badge } from '../types';
import { HangmanDisplay } from './HangmanDisplay';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { useProfiles } from '../context/ProfileContext';
import { checkAndAwardBadges } from '../utils/badges';
import { BadgeNotification } from './BadgeComponents';
import { EmbeddedNumberPad } from './EmbeddedNumberPad';

interface Props {
  difficulty: Difficulty;
  settings: GameSettings;
  onGameOver: (stats: GameStats) => void;
  profileId: string;
}

export function GameBoard({ difficulty, settings, onGameOver, profileId }: Props) {
  const { speakProblem, speak } = useVoiceFeedback();
  const { saveHangmanSession, getProfile, awardBadge } = useProfiles();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [lives, setLives] = useState(settings.livesCount);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [gameStartTime] = useState(Date.now());
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [problemAnswers, setProblemAnswers] = useState<(number | null)[]>([]);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  // Shake animation for wrong answers
  const [shouldShake, setShouldShake] = useState(false);

  const generateProblem = useCallback((): Problem => {
    const types = settings.problemTypes;
    const type = types[Math.floor(Math.random() * types.length)];

    let max = 10;
    if (difficulty === 'medium') max = 20;
    if (difficulty === 'hard') max = 100;

    // Helper function to check if problem is duplicate
    const isProblemDuplicate = (newProblem: Problem): boolean => {
      return allProblems.some(
        (p) =>
          p.num1 === newProblem.num1 &&
          p.num2 === newProblem.num2 &&
          p.operation === newProblem.operation
      );
    };

    // Generate unique problem (max 100 attempts to avoid infinite loop)
    let problem: Problem;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      const a = Math.floor(Math.random() * max) + 1;
      const b = Math.floor(Math.random() * max) + 1;

      switch (type) {
        case 'addition':
          problem = { num1: a, num2: b, operation: '+', correct: a + b };
          break;
        case 'subtraction':
          const larger = Math.max(a, b);
          const smaller = Math.min(a, b);
          problem = { num1: larger, num2: smaller, operation: '-', correct: larger - smaller };
          break;
        case 'multiplication':
          const ma = Math.floor(Math.random() * (max / 2)) + 1;
          const mb = Math.floor(Math.random() * (max / 2)) + 1;
          problem = { num1: ma, num2: mb, operation: '×', correct: ma * mb };
          break;
        case 'division':
          const divisor = Math.floor(Math.random() * 10) + 1;
          const result = Math.floor(Math.random() * 10) + 1;
          problem = { num1: divisor * result, num2: divisor, operation: '÷', correct: result };
          break;
        default:
          problem = { num1: a, num2: b, operation: '+', correct: a + b };
      }

      attempts++;
    } while (isProblemDuplicate(problem) && attempts < maxAttempts);

    return problem;
  }, [difficulty, settings.problemTypes, allProblems]);

  // Initialize first problem on mount - intentionally runs only once
  useEffect(() => {
    if (!problem && !isGameOver) {
      const newProblem = generateProblem();
      setProblem(newProblem);
      setAllProblems([newProblem]);
      setProblemAnswers([null]);

      // Speak the problem
      if (newProblem) {
        speakProblem(newProblem.num1, newProblem.operation, newProblem.num2);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save session function
  const saveSession = useCallback(() => {
    const timeSpent = Math.floor((Date.now() - gameStartTime) / 1000);
    const livesUsed = settings.livesCount - lives;

    const session: HangmanSession = {
      date: new Date().toISOString(),
      difficulty,
      settings,
      problems: allProblems,
      answers: problemAnswers,
      score,
      livesUsed,
      totalLives: settings.livesCount,
      maxStreak,
      timeSpent,
      completed: lives > 0,
    };

    // Save to profile
    saveHangmanSession(profileId, session);

    // Check for new badges — saveHangmanSession is async state update, so we
    // re-read the profile after a tick to get the updated stats.
    setTimeout(() => {
      const updatedProfile = getProfile(profileId);
      if (updatedProfile) {
        const newBadgeIds = checkAndAwardBadges(updatedProfile);
        newBadgeIds.forEach(id => awardBadge(profileId, id));
        if (newBadgeIds.length > 0) {
          const badgeToShow = updatedProfile.badges.find(b => b.id === newBadgeIds[0])
            ?? { id: newBadgeIds[0], name: newBadgeIds[0], description: '', icon: '🏆', earned: false };
          setNewBadge({ ...badgeToShow, earned: true });
        }
      }
    }, 0);
  }, [gameStartTime, settings, lives, difficulty, allProblems, problemAnswers, score, maxStreak, profileId, saveHangmanSession, getProfile, awardBadge]);

  const handleWrongAnswer = useCallback(() => {
    if (isGameOver) return;

    speak('Wrong!');
    setWrongAnswers((prev) => prev + 1);
    setLives((prev) => prev - 1);
    setStreak(0);
    setFeedback('wrong');
    setShouldShake(true);
    setIsTimerActive(false);

    // Update answer tracking
    const currentIndex = allProblems.length - 1;
    setProblemAnswers(prev => {
      const updated = [...prev];
      updated[currentIndex] = -1; // Mark as wrong
      return updated;
    });

    setTimeout(() => {
      if (lives - 1 <= 0) {
        // Game over - save session and end game
        setIsGameOver(true);
        saveSession();
        onGameOver({
          score,
          correctAnswers,
          wrongAnswers: wrongAnswers + 1,
          totalQuestions: totalQuestions + 1,
          streak,
          maxStreak,
        });
      } else {
        setFeedback(null);
        setShouldShake(false);
        const newProblem = generateProblem();
        setProblem(newProblem);
        setAllProblems(prev => [...prev, newProblem]);
        setProblemAnswers(prev => [...prev, null]);
        setTotalQuestions((prev) => prev + 1);
        setTimeLeft(30);
        setIsTimerActive(true);

        // Speak new problem
        if (newProblem) {
          speakProblem(newProblem.num1, newProblem.operation, newProblem.num2);
        }
      }
    }, 1500);
  }, [isGameOver, speak, allProblems.length, lives, score, correctAnswers, wrongAnswers, totalQuestions, streak, maxStreak, onGameOver, generateProblem, speakProblem, saveSession]);

  // Timer
  useEffect(() => {
    if (!isTimerActive || !settings.timeBonus || isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleWrongAnswer();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, settings.timeBonus, isGameOver, handleWrongAnswer]);

  const handleSubmit = (answer: number) => {
    if (!problem || isNaN(answer) || isGameOver) return;

    setIsTimerActive(false);

    if (answer === problem.correct) {
      // Correct answer
      speak(`${problem.correct}! Correct!`);

      let points = 10;

      // Time bonus
      if (settings.timeBonus && timeLeft > 20) {
        points += 5;
      }

      // Streak bonus
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(Math.max(maxStreak, newStreak));

      if (settings.streakBonus && newStreak >= 3) {
        points += newStreak * 2;
      }

      setScore((prev) => prev + points);
      setCorrectAnswers((prev) => prev + 1);
      setFeedback('correct');

      // Update answer tracking
      const currentIndex = allProblems.length - 1;
      setProblemAnswers(prev => {
        const updated = [...prev];
        updated[currentIndex] = answer;
        return updated;
      });

      setTimeout(() => {
        setFeedback(null);
        const newProblem = generateProblem();
        setProblem(newProblem);
        setAllProblems(prev => [...prev, newProblem]);
        setProblemAnswers(prev => [...prev, null]);
        setTotalQuestions((prev) => prev + 1);
        setTimeLeft(30);
        setIsTimerActive(true);

        // Speak new problem
        if (newProblem) {
          speakProblem(newProblem.num1, newProblem.operation, newProblem.num2);
        }
      }, 1000);
    } else {
      handleWrongAnswer();
    }
  };

  // Handle skip - same as wrong answer
  const handleSkip = () => {
    handleWrongAnswer();
  };

  if (!problem) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Lives</div>
                <div className="text-2xl text-red-600">{lives}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl text-yellow-600">{score}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <Trophy className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Streak</div>
                <div className="text-2xl text-green-600">{streak}</div>
              </div>
            </div>
            {settings.timeBonus && (
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Time</div>
                  <div className={`text-2xl ${timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'}`}>
                    {timeLeft}s
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Hangman Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          >
            <h2 className="text-2xl mb-6 text-center text-gray-700">Wrong Answers</h2>
            <HangmanDisplay wrongCount={wrongAnswers} maxWrong={settings.livesCount} />
          </motion.div>

          {/* Problem Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          >
            <div className="text-center mb-4">
              <span className="inline-block bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-sm">
                {problem.operation === '+' ? 'Addition' :
                 problem.operation === '-' ? 'Subtraction' :
                 problem.operation === '×' ? 'Multiplication' : 'Division'}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${problem.num1}-${problem.operation}-${problem.num2}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mb-6"
              >
                <div className="text-6xl text-center text-gray-800 mb-6">
                  {problem.num1} {problem.operation} {problem.num2} = ?
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Embedded Number Pad */}
            <EmbeddedNumberPad
              onSubmit={handleSubmit}
              onSkip={handleSkip}
              disabled={feedback !== null}
              shouldShake={shouldShake}
              onShakeComplete={() => setShouldShake(false)}
            />

            {/* Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className={`mt-6 p-6 rounded-2xl text-center text-2xl ${
                    feedback === 'correct'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {feedback === 'correct' ? '🎉 Correct! Great job!' : '❌ Wrong! Try again!'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Badge Notification */}
      {newBadge && (
        <BadgeNotification
          badge={newBadge}
          onClose={() => setNewBadge(null)}
        />
      )}
    </div>
  );
}