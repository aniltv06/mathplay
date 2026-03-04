/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 *
 * Combined sound + voice feedback hook.
 * Replaces the 8+ files that manually pair soundEffects.play() + speak() calls.
 */

import { useCallback } from 'react';
import { useVoiceFeedback } from './useVoiceFeedback';
import { soundEffects } from '../utils/soundEffects';

export interface FeedbackResult {
  /** Play correct-answer sound and speak the congratulatory label. */
  celebrateCorrect: (label: string) => void;
  /** Play wrong-answer sound and speak the hint label. */
  announceWrong: (label: string) => void;
}

export function useFeedback(): FeedbackResult {
  const { speak } = useVoiceFeedback();

  const celebrateCorrect = useCallback(
    (label: string) => {
      soundEffects.play('correct');
      speak(label);
    },
    [speak],
  );

  const announceWrong = useCallback(
    (label: string) => {
      soundEffects.play('wrong');
      speak(label);
    },
    [speak],
  );

  return { celebrateCorrect, announceWrong };
}
