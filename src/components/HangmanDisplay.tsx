/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion } from 'motion/react';

interface Props {
  wrongCount: number;
  maxWrong: number;
}

export function HangmanDisplay({ wrongCount, maxWrong }: Props) {
  const parts = [
    // Base
    <line key="base" x1="20" y1="280" x2="180" y2="280" stroke="#4B5563" strokeWidth="4" />,
    // Pole
    <line key="pole" x1="60" y1="280" x2="60" y2="40" stroke="#4B5563" strokeWidth="4" />,
    // Top
    <line key="top" x1="60" y1="40" x2="140" y2="40" stroke="#4B5563" strokeWidth="4" />,
    // Rope
    <line key="rope" x1="140" y1="40" x2="140" y2="80" stroke="#4B5563" strokeWidth="3" />,
    // Head
    <circle key="head" cx="140" cy="100" r="20" stroke="#EF4444" strokeWidth="3" fill="none" />,
    // Body
    <line key="body" x1="140" y1="120" x2="140" y2="180" stroke="#EF4444" strokeWidth="3" />,
    // Left arm
    <line key="leftarm" x1="140" y1="140" x2="110" y2="160" stroke="#EF4444" strokeWidth="3" />,
    // Right arm
    <line key="rightarm" x1="140" y1="140" x2="170" y2="160" stroke="#EF4444" strokeWidth="3" />,
    // Left leg
    <line key="leftleg" x1="140" y1="180" x2="110" y2="220" stroke="#EF4444" strokeWidth="3" />,
    // Right leg
    <line key="rightleg" x1="140" y1="180" x2="170" y2="220" stroke="#EF4444" strokeWidth="3" />,
  ];

  // Calculate how many parts to show based on wrong count and max wrong
  // We have 10 total parts, but we want to scale to maxWrong
  const totalParts = 10;
  const partsToShow = Math.min(Math.floor((wrongCount / maxWrong) * totalParts), totalParts);

  return (
    <div className="flex items-center justify-center">
      <svg width="200" height="300" viewBox="0 0 200 300" className="drop-shadow-lg">
        {/* Always show the gallows structure (first 4 parts) */}
        {parts.slice(0, 4).map((part) => part)}
        
        {/* Animate in the hangman parts based on wrong answers */}
        {parts.slice(4, 4 + Math.max(0, partsToShow - 4)).map((part, index) => (
          <motion.g
            key={`animated-${index}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {part}
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
