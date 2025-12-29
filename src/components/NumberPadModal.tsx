/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Number Pad Modal Component
 * Interactive number pad for entering answers on mobile and desktop
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Problem } from '../types';

interface Props {
  isOpen: boolean;
  problem: Problem;
  currentQuestion: number;
  totalQuestions: number;
  onSubmit: (answer: number) => void;
  onSkip?: () => void;
  onClose: () => void;
  showSkip?: boolean;
  showNavigation?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  initialAnswer?: number | null;
  questionText?: string; // Optional word problem text
}

export function NumberPadModal({
  isOpen,
  problem,
  currentQuestion,
  totalQuestions,
  onSubmit,
  onSkip,
  onClose,
  showSkip = false,
  showNavigation = false,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  initialAnswer = null,
  questionText,
}: Props) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Reset answer when problem changes or when initialAnswer is provided
  useEffect(() => {
    if (isOpen) {
      setAnswer(initialAnswer !== null ? String(initialAnswer) : '');
      setFeedback(null);
    }
  }, [isOpen, problem, initialAnswer]);

  // Keyboard event handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleNumberClick(e.key);
      }
      // Backspace
      else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      }
      // Clear
      else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleClear();
      }
      // Enter
      else if (e.key === 'Enter' && answer !== '') {
        e.preventDefault();
        handleSubmit();
      }
      // Escape
      else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      // Arrow keys for navigation
      else if (showNavigation) {
        if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) {
          e.preventDefault();
          onPrevious();
        } else if (e.key === 'ArrowRight' && hasNext && onNext) {
          e.preventDefault();
          onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, answer, showNavigation, hasPrevious, hasNext, onPrevious, onNext]);

  const handleNumberClick = (num: string) => {
    if (answer.length < 6) {
      setAnswer(prev => prev + num);
      setFeedback(null);
    }
  };

  const handleBackspace = () => {
    setAnswer(prev => prev.slice(0, -1));
    setFeedback(null);
  };

  const handleClear = () => {
    setAnswer('');
    setFeedback(null);
  };

  const handleSubmit = useCallback(() => {
    if (answer === '') return;

    const userAnswer = parseInt(answer);
    if (isNaN(userAnswer)) return;

    const isCorrect = userAnswer === problem.correct;

    if (isCorrect) {
      setFeedback('correct');
      // Auto-advance to next problem after brief delay
      setTimeout(() => {
        onSubmit(userAnswer);
        setAnswer('');
        setFeedback(null);
      }, 500);
    } else {
      // Show wrong feedback, stay open for correction
      setFeedback('wrong');
    }
  }, [answer, problem.correct, onSubmit]);

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
      setAnswer('');
      setFeedback(null);
    }
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && onPrevious) {
      onPrevious();
    } else if (direction === 'next' && onNext) {
      onNext();
    }
    setFeedback(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-white text-lg font-medium">
              🔢 Question {currentQuestion} of {totalQuestions}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Problem Display */}
          {questionText ? (
            /* Word Problem Display */
            <div className="bg-white rounded-2xl p-6 mb-4">
              <p className="text-lg font-medium text-gray-800 leading-relaxed text-left mb-4">
                {questionText}
              </p>
              <div className="flex justify-center items-center gap-2 text-sm text-gray-600 border-t pt-4">
                <span className="font-mono">{problem.num1} {problem.operation} {problem.num2} = ?</span>
              </div>
            </div>
          ) : (
            /* Standard Math Display */
            <div className="bg-white rounded-2xl p-4 mb-4 flex justify-center items-center gap-3">
              <div className="text-4xl font-bold text-purple-600">{problem.num1}</div>
              <div className="text-4xl font-bold text-purple-700">{problem.operation}</div>
              <div className="text-4xl font-bold text-purple-600">{problem.num2}</div>
              <div className="text-4xl font-bold text-gray-800">= ?</div>
            </div>
          )}

          {/* Answer Display */}
          <div
            className={`bg-white/90 rounded-2xl p-4 mb-4 text-center transition-all ${
              feedback === 'correct'
                ? 'ring-4 ring-green-500 bg-green-100'
                : feedback === 'wrong'
                ? 'ring-4 ring-red-500 bg-red-100 animate-pulse'
                : ''
            }`}
          >
            <div
              className={`text-3xl font-bold min-h-[48px] flex items-center justify-center ${
                answer === ''
                  ? 'text-gray-400 opacity-50'
                  : feedback === 'correct'
                  ? 'text-green-600'
                  : feedback === 'wrong'
                  ? 'text-red-600'
                  : 'text-purple-700'
              }`}
            >
              {answer === '' ? 'Tap numbers' : answer}
            </div>
            {feedback === 'wrong' && (
              <div className="text-red-600 text-sm mt-2">
                ❌ Try again! The answer is incorrect.
              </div>
            )}
            {feedback === 'correct' && (
              <div className="text-green-600 text-sm mt-2">
                ✅ Correct! Moving to next problem...
              </div>
            )}
          </div>

          {/* Number Pad Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNumberClick(String(num))}
                className="bg-white hover:bg-purple-100 text-purple-700 text-2xl font-bold py-4 rounded-xl shadow-md transition-colors active:shadow-lg"
              >
                {num}
              </motion.button>
            ))}
            {/* Clear Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleClear}
              className="bg-orange-200 hover:bg-orange-300 text-orange-700 text-xl font-bold py-4 rounded-xl shadow-md transition-colors"
            >
              C
            </motion.button>
            {/* Zero Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberClick('0')}
              className="bg-white hover:bg-purple-100 text-purple-700 text-2xl font-bold py-4 rounded-xl shadow-md transition-colors active:shadow-lg"
            >
              0
            </motion.button>
            {/* Backspace Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBackspace}
              className="bg-yellow-200 hover:bg-yellow-300 text-yellow-700 text-xl font-bold py-4 rounded-xl shadow-md transition-colors"
            >
              ←
            </motion.button>
          </div>

          {/* Navigation Buttons (Worksheet Mode) */}
          {showNavigation && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => handleNavigation('prev')}
                disabled={!hasPrevious}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  hasPrevious
                    ? 'bg-white/20 hover:bg-white/30 text-white'
                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              <button
                onClick={() => handleNavigation('next')}
                disabled={!hasNext}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  hasNext
                    ? 'bg-white/20 hover:bg-white/30 text-white'
                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mb-3">
            {showSkip && onSkip && (
              <button
                onClick={handleSkip}
                className="flex-1 bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl font-medium transition-all shadow-md"
              >
                Skip ⏭️
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={answer === ''}
              className={`flex-1 py-3 rounded-xl font-medium transition-all shadow-md ${
                answer === ''
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              Check Answer ✓
            </button>
          </div>

          {/* Keyboard Hint */}
          <div className="text-center text-white/70 text-sm">
            💡 Use keyboard: 0-9, Backspace, Enter
            {showNavigation && ', Arrow keys'}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
