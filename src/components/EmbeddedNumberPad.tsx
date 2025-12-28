/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Embedded Number Pad Component
 * Built-in number pad for Math Challenge mode (no modal)
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface Props {
  onSubmit: (answer: number) => void;
  onSkip: () => void;
  disabled?: boolean;
  shouldShake?: boolean;
  onShakeComplete?: () => void;
}

export function EmbeddedNumberPad({ onSubmit, onSkip, disabled = false, shouldShake = false, onShakeComplete }: Props) {
  const [answer, setAnswer] = useState('');

  // Reset answer when disabled changes (new problem)
  useEffect(() => {
    if (!disabled) {
      setAnswer('');
    }
  }, [disabled]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answer, disabled]);

  const handleNumberClick = (num: string) => {
    if (answer.length < 6 && !disabled) {
      setAnswer(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    if (!disabled) {
      setAnswer(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (!disabled) {
      setAnswer('');
    }
  };

  const handleSubmit = () => {
    if (answer !== '' && !disabled) {
      const parsedAnswer = parseInt(answer);
      if (!isNaN(parsedAnswer)) {
        onSubmit(parsedAnswer);
      }
    }
  };

  const handleSkipClick = () => {
    if (!disabled) {
      onSkip();
    }
  };

  return (
    <motion.div
      animate={shouldShake ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onShakeComplete}
      className="w-full"
    >
      {/* Answer Display */}
      <div className="bg-white rounded-2xl p-4 mb-4 border-4 border-purple-300">
        <div
          className={`text-4xl font-bold text-center min-h-[60px] flex items-center justify-center ${
            answer === '' ? 'text-gray-400 opacity-50' : 'text-purple-700'
          }`}
        >
          {answer === '' ? 'Tap numbers' : answer}
        </div>
      </div>

      {/* Number Pad Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <motion.button
            key={num}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNumberClick(String(num))}
            disabled={disabled}
            className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-3xl font-bold py-6 rounded-xl shadow-lg transition-all active:shadow-xl"
          >
            {num}
          </motion.button>
        ))}
        {/* Clear Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleClear}
          disabled={disabled}
          className="bg-orange-400 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold py-6 rounded-xl shadow-lg transition-all"
        >
          C
        </motion.button>
        {/* Zero Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNumberClick('0')}
          disabled={disabled}
          className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-3xl font-bold py-6 rounded-xl shadow-lg transition-all active:shadow-xl"
        >
          0
        </motion.button>
        {/* Backspace Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleBackspace}
          disabled={disabled}
          className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold py-6 rounded-xl shadow-lg transition-all"
        >
          ←
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSkipClick}
          disabled={disabled}
          className="bg-gray-400 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl text-lg font-medium transition-all shadow-md"
        >
          Skip ⏭️
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={disabled || answer === ''}
          className={`py-4 rounded-xl text-lg font-medium transition-all shadow-md ${
            answer === '' || disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
          }`}
        >
          Submit Answer ✓
        </motion.button>
      </div>

      {/* Keyboard Hint */}
      <div className="text-center text-gray-500 text-sm mt-3">
        💡 Use keyboard: 0-9, Backspace, Enter
      </div>
    </motion.div>
  );
}
