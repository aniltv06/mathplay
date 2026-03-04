/**
 * Reusable feedback animation overlay for learning pages.
 * Shows correct/incorrect result with animated entry and exit.
 */

import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
  feedback: 'correct' | 'incorrect' | null;
  correctAnswer?: string | number;
}

export function FeedbackAnimation({ feedback, correctAnswer }: Props) {
  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className={`mt-6 p-4 rounded-xl flex items-center justify-center gap-2 ${
            feedback === 'correct'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {feedback === 'correct' ? (
            <>
              <CheckCircle className="w-6 h-6" />
              <span className="text-xl font-bold">Correct! Great job!</span>
            </>
          ) : (
            <>
              <XCircle className="w-6 h-6" />
              <span className="text-xl font-bold">
                {correctAnswer !== undefined
                  ? `Try again! The answer is ${correctAnswer}`
                  : 'Try again!'}
              </span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
