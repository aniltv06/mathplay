/**
 * Kid-Friendly Hangman Visual Themes - Castle Theme
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';

export function CastleTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
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
      {/* Sky background */}
      <rect width="200" height="280" fill="#93c5fd" />

      {/* Clouds */}
      <motion.ellipse
        cx="50" cy="40" rx="30" ry="15"
        fill="white"
        opacity="0.8"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.ellipse
        cx="150" cy="60" rx="35" ry="18"
        fill="white"
        opacity="0.7"
        animate={{ x: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Ground */}
      <rect y="240" width="200" height="40" fill="#84cc16" />

      {/* Castle base - always visible */}
      <rect x="60" y="160" width="80" height="80" fill="#9ca3af" stroke="#6b7280" strokeWidth="2" />

      {/* Main door */}
      <rect x="85" y="200" width="30" height="40" fill="#78350f" rx="15" stroke="#451a03" strokeWidth="2" />
      <circle cx="105" cy="220" r="2" fill="#fbbf24" />

      {/* Windows */}
      <rect x="75" y="180" width="12" height="15" fill="#1e40af" rx="2" />
      <rect x="113" y="180" width="12" height="15" fill="#1e40af" rx="2" />

      {/* Left tower - disappears at 0 mistakes */}
      {mistakes < 1 && (
        <motion.g
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0, rotate: -15 }}
          transition={{ duration: 1, ease: 'easeIn' }}
        >
          <rect x="40" y="120" width="25" height="120" fill="#9ca3af" stroke="#6b7280" strokeWidth="2" />
          <rect x="35" y="110" width="35" height="15" fill="#6b7280" />
          {[40, 48, 56, 64].map((x, i) => (
            <rect key={i} x={x} y="105" width="6" height="10" fill="#6b7280" />
          ))}
          <polygon points="52.5,90 42,110 63,110" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
        </motion.g>
      )}

      {/* Right tower - disappears at 1 mistake */}
      {mistakes < 2 && (
        <motion.g
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0, rotate: 15 }}
          transition={{ duration: 1, ease: 'easeIn' }}
        >
          <rect x="135" y="120" width="25" height="120" fill="#9ca3af" stroke="#6b7280" strokeWidth="2" />
          <rect x="130" y="110" width="35" height="15" fill="#6b7280" />
          {[130, 138, 146, 154].map((x, i) => (
            <rect key={i} x={x} y="105" width="6" height="10" fill="#6b7280" />
          ))}
          <polygon points="147.5,90 137,110 158,110" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
        </motion.g>
      )}

      {/* Battlements - disappear at 2, 3, 4, 5 mistakes */}
      {mistakes < 3 && (
        <motion.g
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
        >
          <rect x="60" y="150" width="12" height="15" fill="#6b7280" />
        </motion.g>
      )}

      {mistakes < 4 && (
        <motion.g
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
        >
          <rect x="78" y="150" width="12" height="15" fill="#6b7280" />
        </motion.g>
      )}

      {mistakes < 5 && (
        <motion.g
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
        >
          <rect x="110" y="150" width="12" height="15" fill="#6b7280" />
        </motion.g>
      )}

      {mistakes < 6 && (
        <motion.g
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
        >
          <rect x="128" y="150" width="12" height="15" fill="#6b7280" />
        </motion.g>
      )}

      {/* Flag on main castle */}
      {mistakes === 0 && (
        <motion.g
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '100px 140px' }}
        >
          <line x1="100" y1="160" x2="100" y2="120" stroke="#78350f" strokeWidth="2" />
          <path d="M 100 120 L 120 130 L 100 140 Z" fill="#ef4444" />
        </motion.g>
      )}

      {/* Knight decoration */}
      <motion.g
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <rect x="20" y="220" width="15" height="20" fill="#6b7280" rx="2" />
        <circle cx="27.5" cy="215" r="5" fill="#9ca3af" />
        <rect x="24" y="213" width="7" height="3" fill="#1f2937" />
      </motion.g>

      {/* Dust clouds when parts fall */}
      {mistakes > 0 && (
        <motion.g
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          <circle cx="100" cy="230" r="20" fill="#d1d5db" />
        </motion.g>
      )}
    </motion.svg>
  );
}
