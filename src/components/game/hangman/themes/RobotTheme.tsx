/**
 * Kid-Friendly Hangman Visual Themes - Robot Theme
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';

export function RobotTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
  const parts = [
    { id: 'leftArm', name: 'Left Arm' },
    { id: 'rightArm', name: 'Right Arm' },
    { id: 'leftLeg', name: 'Left Leg' },
    { id: 'rightLeg', name: 'Right Leg' },
    { id: 'antenna', name: 'Antenna' },
    { id: 'eyes', name: 'Eyes' },
  ];

  const Sparkle = ({ x, y, delay }: { x: number; y: number; delay: number }) => (
    <motion.circle
      cx={x}
      cy={y}
      r="2"
      fill="#fbbf24"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        delay,
      }}
    />
  );

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
      {/* Tech background */}
      <rect width="200" height="280" fill="#1e293b" />
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="200" height="280" fill="url(#grid)" opacity="0.5" />

      {/* Sparkles */}
      {[...Array(8)].map((_, i) => (
        <Sparkle
          key={i}
          x={Math.random() * 200}
          y={Math.random() * 280}
          delay={Math.random() * 2}
        />
      ))}

      {/* Platform */}
      <rect x="50" y="240" width="100" height="8" fill="#475569" rx="4" />

      {/* Body - always visible */}
      <motion.g
        animate={mistakes > 0 ? { y: [0, -2, 0] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <rect x="75" y="140" width="50" height="60" fill="#3b82f6" rx="8" stroke="#2563eb" strokeWidth="2" />
        {/* Chest panel */}
        <rect x="85" y="155" width="30" height="35" fill="#1e40af" rx="4" />
        <circle cx="100" cy="165" r="3" fill="#60a5fa" />
        <rect x="92" y="175" width="16" height="2" fill="#60a5fa" rx="1" />
        <rect x="92" y="180" width="16" height="2" fill="#60a5fa" rx="1" />
      </motion.g>

      {/* Head - disappears at 6 mistakes */}
      {mistakes < maxMistakes && (
        <motion.g
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
        >
          <rect x="80" y="100" width="40" height="35" fill="#3b82f6" rx="6" stroke="#2563eb" strokeWidth="2" />
          {/* Eyes - disappear at 5 mistakes */}
          {mistakes < 5 && (
            <>
              <motion.circle
                cx="90"
                cy="115"
                r="5"
                fill={mistakes > 3 ? '#ef4444' : '#fbbf24'}
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.circle
                cx="110"
                cy="115"
                r="5"
                fill={mistakes > 3 ? '#ef4444' : '#fbbf24'}
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}
          {/* Mouth */}
          <rect x="92" y="125" width="16" height="4" fill="#1e40af" rx="2" />
        </motion.g>
      )}

      {/* Antenna - disappears at 4 mistakes */}
      {mistakes < 4 && (
        <motion.g
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, rotate: 45, opacity: 0 }}
        >
          <line x1="100" y1="100" x2="100" y2="85" stroke="#475569" strokeWidth="3" />
          <motion.circle
            cx="100"
            cy="82"
            r="5"
            fill="#ef4444"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </motion.g>
      )}

      {/* Left Arm - disappears at 0 mistakes */}
      {mistakes < 1 && (
        <motion.g
          initial={{ x: -30, opacity: 0, rotate: -45 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          exit={{ x: -80, y: 50, rotate: -90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{ transformOrigin: '75px 160px' }}
        >
          <rect x="55" y="145" width="20" height="35" fill="#3b82f6" rx="4" stroke="#2563eb" strokeWidth="2" />
          <circle cx="65" cy="152" r="3" fill="#60a5fa" />
          {/* Hand */}
          <rect x="55" y="180" width="20" height="12" fill="#2563eb" rx="4" />
        </motion.g>
      )}

      {/* Right Arm - disappears at 1 mistake */}
      {mistakes < 2 && (
        <motion.g
          initial={{ x: 30, opacity: 0, rotate: 45 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          exit={{ x: 80, y: 50, rotate: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{ transformOrigin: '125px 160px' }}
        >
          <rect x="125" y="145" width="20" height="35" fill="#3b82f6" rx="4" stroke="#2563eb" strokeWidth="2" />
          <circle cx="135" cy="152" r="3" fill="#60a5fa" />
          {/* Hand */}
          <rect x="125" y="180" width="20" height="12" fill="#2563eb" rx="4" />
        </motion.g>
      )}

      {/* Left Leg - disappears at 2 mistakes */}
      {mistakes < 3 && (
        <motion.g
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, x: -30, rotate: -30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 150 }}
        >
          <rect x="80" y="200" width="16" height="35" fill="#3b82f6" rx="4" stroke="#2563eb" strokeWidth="2" />
          {/* Foot */}
          <rect x="75" y="235" width="22" height="10" fill="#2563eb" rx="3" />
        </motion.g>
      )}

      {/* Right Leg - disappears at 3 mistakes */}
      {mistakes < 4 && (
        <motion.g
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, x: 30, rotate: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 150 }}
        >
          <rect x="104" y="200" width="16" height="35" fill="#3b82f6" rx="4" stroke="#2563eb" strokeWidth="2" />
          {/* Foot */}
          <rect x="103" y="235" width="22" height="10" fill="#2563eb" rx="3" />
        </motion.g>
      )}

      {/* Assembly sparkles */}
      {mistakes < maxMistakes &&
        [...Array(4)].map((_, i) => (
          <motion.circle
            key={`spark-${i}`}
            cx={100 + (Math.random() - 0.5) * 80}
            cy={180 + (Math.random() - 0.5) * 80}
            r="2"
            fill="#fbbf24"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
    </motion.svg>
  );
}
