/**
 * Reusable feedback animation overlay for learning pages.
 * Shows correct/incorrect result with animated entry and exit.
 * On the first wrong attempt shows "Try again!" without revealing the answer.
 * On subsequent wrong attempts reveals the correct answer.
 */

import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
  feedback: 'correct' | 'incorrect' | null;
  correctAnswer?: string | number;
  /** How many wrong attempts have been made on this question (1 = first try wrong). */
  wrongAttemptCount?: number;
}

export function FeedbackAnimation({ feedback, correctAnswer, wrongAttemptCount = 1 }: Props) {
  const revealAnswer = wrongAttemptCount > 1 && correctAnswer !== undefined;

  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          role="alert"
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
                {revealAnswer
                  ? `The answer is ${correctAnswer}`
                  : 'Not quite, try again!'}
              </span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
