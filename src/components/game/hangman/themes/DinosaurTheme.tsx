/**
 * Kid-Friendly Hangman Visual Themes - Dinosaur Theme
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';

export function DinosaurTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
  return (
    <motion.svg
      width="200"
      height="280"
      viewBox="0 0 200 280"
      className="drop-shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {/* Jungle background */}
      <rect width="200" height="280" fill="#a7f3d0" />

      {/* Ground */}
      <rect y="240" width="200" height="40" fill="#65a30d" />

      {/* Plants */}
      <ellipse cx="30" cy="250" rx="20" ry="30" fill="#15803d" opacity="0.6" />
      <ellipse cx="170" cy="255" rx="25" ry="35" fill="#15803d" opacity="0.6" />

      {/* Body - always visible */}
      <motion.ellipse
        cx="100"
        cy="180"
        rx="40"
        ry="35"
        fill="#84cc16"
        stroke="#65a30d"
        strokeWidth="2"
        animate={mistakes > 0 ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 0.8, repeat: Infinity }}
      />

      {/* Head - disappears at 6 mistakes */}
      {mistakes < maxMistakes && (
        <motion.g
          initial={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0, rotate: 90 }}
        >
          <ellipse cx="130" cy="150" rx="25" ry="20" fill="#84cc16" stroke="#65a30d" strokeWidth="2" />
          {/* Eye */}
          <circle cx="140" cy="145" r="4" fill="#1f2937" />
          {/* Mouth */}
          {mistakes < 4 ? (
            <path d="M 135 155 Q 140 158, 145 155" stroke="#1f2937" strokeWidth="2" fill="none" />
          ) : (
            <path d="M 135 157 Q 140 154, 145 157" stroke="#1f2937" strokeWidth="2" fill="none" />
          )}
        </motion.g>
      )}

      {/* Tail - disappears at 0 mistakes */}
      {mistakes < 1 && (
        <motion.path
          d="M 65 190 Q 30 200, 20 220"
          stroke="#84cc16"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          initial={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50, rotate: -90 }}
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Back Leg - disappears at 1 mistake */}
      {mistakes < 2 && (
        <motion.g
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <rect x="75" y="215" width="14" height="30" fill="#84cc16" rx="7" stroke="#65a30d" strokeWidth="2" />
          <ellipse cx="82" cy="245" rx="10" ry="6" fill="#84cc16" />
        </motion.g>
      )}

      {/* Front Leg - disappears at 2 mistakes */}
      {mistakes < 3 && (
        <motion.g
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <rect x="105" y="215" width="14" height="30" fill="#84cc16" rx="7" stroke="#65a30d" strokeWidth="2" />
          <ellipse cx="112" cy="245" rx="10" ry="6" fill="#84cc16" />
        </motion.g>
      )}

      {/* Left Arm - disappears at 3 mistakes */}
      {mistakes < 4 && (
        <motion.g
          initial={{ x: 0, opacity: 1 }}
          exit={{ x: -50, y: 30, opacity: 0, rotate: -45 }}
        >
          <rect x="68" y="175" width="10" height="25" fill="#84cc16" rx="5" stroke="#65a30d" strokeWidth="2" />
        </motion.g>
      )}

      {/* Right Arm - disappears at 4 mistakes */}
      {mistakes < 5 && (
        <motion.g
          initial={{ x: 0, opacity: 1 }}
          exit={{ x: 50, y: 30, opacity: 0, rotate: 45 }}
        >
          <rect x="122" y="175" width="10" height="25" fill="#84cc16" rx="5" stroke="#65a30d" strokeWidth="2" />
        </motion.g>
      )}

      {/* Spikes - disappear at 5 mistakes */}
      {mistakes < 6 && (
        <motion.g
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          {[70, 85, 100, 115, 130].map((x, i) => (
            <polygon
              key={i}
              points={`${x},165 ${x - 5},175 ${x + 5},175`}
              fill="#65a30d"
            />
          ))}
        </motion.g>
      )}

      {/* Volcano decoration */}
      <motion.g
        animate={{
          y: [0, -2, 0],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <path d="M 160 240 L 175 210 L 180 240 Z" fill="#78350f" />
        <circle cx="175" cy="210" r="3" fill="#ef4444" />
      </motion.g>
    </motion.svg>
  );
}
