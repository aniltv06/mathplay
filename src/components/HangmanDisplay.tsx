/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { HangmanVisual } from './HangmanVisual';

interface Props {
  wrongCount: number;
  maxWrong: number;
}

export function HangmanDisplay({ wrongCount, maxWrong }: Props) {
  return (
    <div className="flex items-center justify-center">
      <HangmanVisual mistakes={wrongCount} maxMistakes={maxWrong} />
    </div>
  );
}
