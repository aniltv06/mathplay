/**
 * Kid-Friendly Hangman Visual Themes - Balloons Theme
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';

export function BalloonsTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
  const balloons = [
    { x: 40, y: 120, color: '#ef4444', highlight: '#fee2e2' },
    { x: 80, y: 80, color: '#3b82f6', highlight: '#dbeafe' },
    { x: 120, y: 100, color: '#fbbf24', highlight: '#fef3c7' },
    { x: 160, y: 90, color: '#10b981', highlight: '#d1fae5' },
    { x: 50, y: 60, color: '#ec4899', highlight: '#fce7f3' },
    { x: 150, y: 130, color: '#8b5cf6', highlight: '#ede9fe' },
  ];

  return (
    <motion.svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      className="drop-shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {/* Background clouds */}
      <motion.ellipse
        cx="40" cy="30" rx="25" ry="15"
        fill="white"
        opacity="0.6"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.ellipse
        cx="160" cy="40" rx="30" ry="18"
        fill="white"
        opacity="0.5"
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {balloons.slice(0, maxMistakes).map((balloon, i) => (
        <motion.g
          key={i}
          initial={{ y: 0, opacity: 1 }}
          animate={
            i < mistakes
              ? {
                  y: -250,
                  opacity: 0,
                  rotate: Math.random() > 0.5 ? 30 : -30,
                }
              : {
                  y: [0, -5, 0],
                }
          }
          transition={
            i < mistakes
              ? { duration: 1.5, ease: 'easeOut' }
              : { duration: 2, repeat: Infinity, delay: i * 0.2 }
          }
        >
          {/* Balloon */}
          <ellipse
            cx={balloon.x}
            cy={balloon.y}
            rx="18"
            ry="24"
            fill={balloon.color}
            stroke={balloon.color}
            strokeWidth="2"
            filter="url(#shadow)"
          />
          {/* Highlight */}
          <ellipse
            cx={balloon.x - 5}
            cy={balloon.y - 8}
            rx="6"
            ry="8"
            fill={balloon.highlight}
            opacity="0.6"
          />
          {/* String */}
          <path
            d={`M ${balloon.x} ${balloon.y + 24} Q ${balloon.x - 5} ${balloon.y + 35}, ${balloon.x - 3} ${balloon.y + 45}`}
            stroke={balloon.color}
            strokeWidth="1.5"
            fill="none"
          />
        </motion.g>
      ))}

      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>
    </motion.svg>
  );
}
