/**
 * Kid-Friendly Hangman Visual Themes - Classic Hangman Theme
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';

export function HangmanTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
  return (
    <motion.svg
      width="200"
      height="300"
      viewBox="0 0 200 300"
      className="drop-shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {/* Background */}
      <rect width="200" height="300" fill="#f0f9ff" />

      {/* Clouds */}
      <ellipse cx="40" cy="30" rx="25" ry="12" fill="white" opacity="0.6" />
      <ellipse cx="160" cy="50" rx="30" ry="15" fill="white" opacity="0.5" />

      {/* Ground grass */}
      <rect y="265" width="200" height="35" fill="#84cc16" />
      <ellipse cx="100" cy="265" rx="90" ry="8" fill="#65a30d" opacity="0.3" />

      {/* Wood texture effect on gallows */}
      <defs>
        <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="50%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>

      {/* Ground base */}
      <motion.line
        x1="20"
        y1="270"
        x2="180"
        y2="270"
        stroke="url(#woodGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Vertical pole */}
      <motion.line
        x1="60"
        y1="270"
        x2="60"
        y2="40"
        stroke="url(#woodGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />

      {/* Top horizontal pole */}
      <motion.line
        x1="60"
        y1="40"
        x2="140"
        y2="40"
        stroke="url(#woodGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />

      {/* Diagonal support brace - creates triangular support */}
      <motion.line
        x1="60"
        y1="100"
        x2="90"
        y2="40"
        stroke="url(#woodGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />

      {/* Rope with gradient */}
      <defs>
        <linearGradient id="ropeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a8a29e" />
          <stop offset="100%" stopColor="#78716c" />
        </linearGradient>
      </defs>
      <motion.line
        x1="140"
        y1="40"
        x2="140"
        y2="85"
        stroke="url(#ropeGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      />

      {/* Head with gradient - appears at 1 mistake */}
      {mistakes >= 1 && (
        <motion.g
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          <defs>
            <radialGradient id="headGradient">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fbbf24" />
            </radialGradient>
          </defs>
          <circle
            cx="140"
            cy="105"
            r="20"
            fill="url(#headGradient)"
            stroke="#f59e0b"
            strokeWidth="3"
          />
          {/* Happy eyes initially */}
          {mistakes < maxMistakes && (
            <>
              <circle cx="133" cy="100" r="3" fill="#1f2937" />
              <circle cx="147" cy="100" r="3" fill="#1f2937" />
              <path
                d="M 133 112 Q 140 115, 147 112"
                stroke="#1f2937"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}
        </motion.g>
      )}

      {/* Body - appears at 2 mistakes */}
      {mistakes >= 2 && (
        <motion.line
          x1="140"
          y1="125"
          x2="140"
          y2="185"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Left arm - appears at 3 mistakes */}
      {mistakes >= 3 && (
        <motion.line
          x1="140"
          y1="145"
          x2="110"
          y2="165"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Right arm - appears at 4 mistakes */}
      {mistakes >= 4 && (
        <motion.line
          x1="140"
          y1="145"
          x2="170"
          y2="165"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Left leg - appears at 5 mistakes */}
      {mistakes >= 5 && (
        <motion.line
          x1="140"
          y1="185"
          x2="115"
          y2="225"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Right leg - appears at 6 mistakes */}
      {mistakes >= 6 && (
        <motion.line
          x1="140"
          y1="185"
          x2="165"
          y2="225"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Sad face appears at max mistakes */}
      {mistakes >= maxMistakes && mistakes >= 1 && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* X eyes */}
          <line x1="130" y1="98" x2="136" y2="102" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="136" y1="98" x2="130" y2="102" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="144" y1="98" x2="150" y2="102" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="150" y1="98" x2="144" y2="102" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          {/* Sad mouth */}
          <path
            d="M 132 114 Q 140 110, 148 114"
            stroke="#ef4444"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Tears */}
          <motion.ellipse
            cx="130"
            cy="108"
            rx="2"
            ry="4"
            fill="#3b82f6"
            initial={{ cy: 108, opacity: 1 }}
            animate={{ cy: [108, 118], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.ellipse
            cx="150"
            cy="108"
            rx="2"
            ry="4"
            fill="#3b82f6"
            initial={{ cy: 108, opacity: 1 }}
            animate={{ cy: [108, 118], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
        </motion.g>
      )}

      {/* Birds decoration */}
      <motion.g
        animate={{
          x: [0, 50, 100],
          y: [0, -10, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <path d="M 30 60 Q 35 55, 40 60" stroke="#1f2937" strokeWidth="1.5" fill="none" />
        <path d="M 45 58 Q 50 53, 55 58" stroke="#1f2937" strokeWidth="1.5" fill="none" />
      </motion.g>

      {/* Sun in corner */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '170px 30px' }}
      >
        <circle cx="170" cy="30" r="12" fill="#fbbf24" opacity="0.8" />
        {[...Array(8)].map((_, i) => (
          <line
            key={i}
            x1="170"
            y1="30"
            x2={170 + Math.cos((i * Math.PI) / 4) * 20}
            y2={30 + Math.sin((i * Math.PI) / 4) * 20}
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        ))}
      </motion.g>
    </motion.svg>
  );
}
