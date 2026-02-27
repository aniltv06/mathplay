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
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);

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

  // Get gradient style for number buttons
  const getNumberButtonStyle = (num: number) => {
    const isHovered = hoveredButton === num;
    return {
      background: isHovered
        ? 'linear-gradient(to bottom right, #9333ea, #db2777)' // purple-600 to pink-600
        : 'linear-gradient(to bottom right, #a855f7, #ec4899)', // purple-500 to pink-500
      color: 'white',
    };
  };

  // Get gradient style for submit button
  const getSubmitButtonStyle = () => {
    const isHovered = hoveredButton === -1; // Use -1 for submit button
    return {
      background: isHovered
        ? 'linear-gradient(to right, #16a34a, #059669)' // green-600 to emerald-600
        : 'linear-gradient(to right, #22c55e, #10b981)', // green-500 to emerald-500
      color: 'white',
    };
  };

  return (
    <motion.div
      animate={shouldShake ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onShakeComplete}
      className="w-full"
    >
      {/* Answer Display */}
      <div
        className="bg-white rounded-2xl p-4 mb-4 border-4 border-purple-300"
        role="status"
        aria-live="polite"
        aria-label={answer === '' ? 'No answer entered' : `Current answer: ${answer}`}
      >
        <div
          className={`text-4xl font-bold text-center min-h-[60px] flex items-center justify-center ${
            answer === '' ? 'text-gray-400 opacity-50' : 'text-purple-700'
          }`}
          aria-hidden="true"
        >
          {answer === '' ? 'Tap numbers' : answer}
        </div>
      </div>

      {/* Number Pad Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4" role="group" aria-label="Number pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <motion.button
            key={num}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNumberClick(String(num))}
            onMouseEnter={() => setHoveredButton(num)}
            onMouseLeave={() => setHoveredButton(null)}
            disabled={disabled}
            style={getNumberButtonStyle(num)}
            aria-label={`${num}`}
            className="disabled:opacity-50 disabled:cursor-not-allowed text-white text-3xl font-bold py-4 min-h-[56px] rounded-xl shadow-lg transition-all active:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 focus-visible:ring-offset-2"
          >
            {num}
          </motion.button>
        ))}
        {/* Clear Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleClear}
          disabled={disabled}
          style={{ backgroundColor: '#fb923c', color: 'white' }} // orange-400
          aria-label="Clear answer"
          className="hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold py-4 min-h-[56px] rounded-xl shadow-lg transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 focus-visible:ring-offset-2"
        >
          C
        </motion.button>
        {/* Zero Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNumberClick('0')}
          onMouseEnter={() => setHoveredButton(0)}
          onMouseLeave={() => setHoveredButton(null)}
          disabled={disabled}
          style={getNumberButtonStyle(0)}
          aria-label="0"
          className="disabled:opacity-50 disabled:cursor-not-allowed text-white text-3xl font-bold py-4 min-h-[56px] rounded-xl shadow-lg transition-all active:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 focus-visible:ring-offset-2"
        >
          0
        </motion.button>
        {/* Backspace Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleBackspace}
          disabled={disabled}
          style={{ backgroundColor: '#facc15', color: 'white' }} // yellow-400
          aria-label="Backspace"
          className="hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold py-4 min-h-[56px] rounded-xl shadow-lg transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 focus-visible:ring-offset-2"
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
          style={{ backgroundColor: '#9ca3af', color: 'white' }} // gray-400
          aria-label="Skip this question"
          className="hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 min-h-[56px] rounded-xl text-lg font-medium transition-all shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-300 focus-visible:ring-offset-2"
        >
          Skip ⏭️
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          onMouseEnter={() => answer !== '' && !disabled && setHoveredButton(-1)}
          onMouseLeave={() => setHoveredButton(null)}
          disabled={disabled || answer === ''}
          style={answer === '' || disabled ? undefined : getSubmitButtonStyle()}
          aria-label={answer === '' ? 'Submit answer (enter a number first)' : `Submit answer ${answer}`}
          className={`py-4 min-h-[56px] rounded-xl text-lg font-medium transition-all shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-300 focus-visible:ring-offset-2 ${
            answer === '' || disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : ''
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
