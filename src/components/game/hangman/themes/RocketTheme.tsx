/**
 * Kid-Friendly Hangman Visual Themes - Rocket Theme
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';

export function RocketTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
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
      {/* Space background */}
      <rect width="200" height="280" fill="#0f172a" />

      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <motion.circle
          key={i}
          cx={Math.random() * 200}
          cy={Math.random() * 280}
          r="1"
          fill="#fbbf24"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      {/* Launch pad */}
      <rect x="60" y="240" width="80" height="10" fill="#475569" rx="5" />
      <rect x="70" y="235" width="4" height="15" fill="#475569" />
      <rect x="126" y="235" width="4" height="15" fill="#475569" />

      {/* Rocket body - always visible */}
      <motion.g
        initial={{ y: 0 }}
        animate={mistakes === 0 ? { y: [0, -3, 0] } : { y: 0 }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <rect x="85" y="160" width="30" height="60" fill="#ef4444" rx="5" stroke="#991b1b" strokeWidth="2" />
        {/* Window */}
        <circle cx="100" cy="175" r="8" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" />
      </motion.g>

      {/* Nose cone - disappears at 5 mistakes */}
      {mistakes < 6 && (
        <motion.g
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0, rotate: 180 }}
        >
          <polygon points="100,120 85,160 115,160" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />
        </motion.g>
      )}

      {/* Left fin - disappears at 0 mistakes */}
      {mistakes < 1 && (
        <motion.g
          initial={{ x: 0, opacity: 1 }}
          exit={{ x: -80, y: 50, opacity: 0, rotate: -90 }}
          transition={{ duration: 1, ease: 'easeIn' }}
        >
          <polygon points="85,200 70,230 85,220" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
        </motion.g>
      )}

      {/* Right fin - disappears at 1 mistake */}
      {mistakes < 2 && (
        <motion.g
          initial={{ x: 0, opacity: 1 }}
          exit={{ x: 80, y: 50, opacity: 0, rotate: 90 }}
          transition={{ duration: 1, ease: 'easeIn' }}
        >
          <polygon points="115,200 130,230 115,220" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
        </motion.g>
      )}

      {/* Flame/exhaust - disappears gradually */}
      {mistakes < 3 && (
        <motion.g
          initial={{ scaleY: 1, opacity: 0.8 }}
          animate={{
            scaleY: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8],
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3, repeat: Infinity }}
          style={{ transformOrigin: '100px 225px' }}
        >
          <ellipse cx="100" cy="225" rx="12" ry="15" fill="#fbbf24" />
          <ellipse cx="100" cy="230" rx="10" ry="12" fill="#f97316" />
          <ellipse cx="100" cy="233" rx="8" ry="10" fill="#ef4444" />
        </motion.g>
      )}

      {/* Side boosters - disappear at 3 and 4 mistakes */}
      {mistakes < 4 && (
        <motion.g
          initial={{ x: 0, opacity: 1 }}
          exit={{ x: -30, y: 80, opacity: 0, rotate: -45 }}
        >
          <rect x="75" y="180" width="8" height="40" fill="#94a3b8" rx="4" stroke="#64748b" strokeWidth="1" />
          <ellipse cx="79" cy="222" rx="4" ry="6" fill="#f97316" />
        </motion.g>
      )}

      {mistakes < 5 && (
        <motion.g
          initial={{ x: 0, opacity: 1 }}
          exit={{ x: 30, y: 80, opacity: 0, rotate: 45 }}
        >
          <rect x="117" y="180" width="8" height="40" fill="#94a3b8" rx="4" stroke="#64748b" strokeWidth="1" />
          <ellipse cx="121" cy="222" rx="4" ry="6" fill="#f97316" />
        </motion.g>
      )}

      {/* Explosion clouds when parts fall off */}
      {mistakes > 0 && mistakes <= 5 && (
        <motion.g
          key={`explosion-${mistakes}`}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ transformOrigin: '100px 200px' }}
        >
          <circle cx="100" cy="200" r="20" fill="#fbbf24" opacity="0.5" />
          <circle cx="90" cy="205" r="15" fill="#f97316" opacity="0.5" />
          <circle cx="110" cy="205" r="15" fill="#ef4444" opacity="0.5" />
        </motion.g>
      )}

      {/* Planet decoration */}
      <motion.g
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '170px 60px' }}
      >
        <circle cx="170" cy="60" r="15" fill="#8b5cf6" opacity="0.7" />
        <ellipse cx="170" cy="60" rx="25" ry="3" fill="#8b5cf6" opacity="0.3" />
      </motion.g>
    </motion.svg>
  );
}
