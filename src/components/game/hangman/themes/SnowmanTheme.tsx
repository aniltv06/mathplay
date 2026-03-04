/**
 * Kid-Friendly Hangman Visual Themes - Snowman Theme
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';

export function SnowmanTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
  return (
    <motion.svg
      width="200"
      height="250"
      viewBox="0 0 200 250"
      className="drop-shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {/* Sky background */}
      <rect width="200" height="250" fill="#bae6fd" />

      {/* Ground */}
      <rect y="230" width="200" height="20" fill="#d1fae5" />

      {/* Sun - gets bigger/brighter with mistakes */}
      <motion.g
        animate={{
          scale: 1 + mistakes * 0.15,
          opacity: 0.4 + mistakes * 0.1,
        }}
        transition={{ duration: 0.5 }}
      >
        <circle cx="170" cy="30" r="20" fill="#fbbf24" />
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={i}
            x1="170"
            y1="30"
            x2={170 + Math.cos((i * Math.PI) / 4) * 35}
            y2={30 + Math.sin((i * Math.PI) / 4) * 35}
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '170px 30px' }}
          />
        ))}
      </motion.g>

      {/* Bottom snowball - melts and flattens */}
      {mistakes < maxMistakes && (
        <motion.ellipse
          cx="100"
          cy="200"
          rx="35"
          ry="35"
          fill="#ffffff"
          stroke="#93c5fd"
          strokeWidth="2"
          animate={{
            cy: 200 + mistakes * 4,
            rx: 35 + mistakes * 4,
            ry: Math.max(35 - mistakes * 5, 10),
            opacity: Math.max(1 - mistakes * 0.15, 0.3),
          }}
        />
      )}

      {/* Middle snowball */}
      {mistakes < 4 && (
        <motion.ellipse
          cx="100"
          cy="150"
          rx="28"
          ry="28"
          fill="#ffffff"
          stroke="#93c5fd"
          strokeWidth="2"
          animate={{
            cy: 150 + mistakes * 3,
            opacity: Math.max(1 - mistakes * 0.2, 0.2),
            ry: Math.max(28 - mistakes * 3, 15),
          }}
        />
      )}

      {/* Head */}
      {mistakes < 2 && (
        <motion.g
          animate={{
            y: mistakes * 3,
            opacity: Math.max(1 - mistakes * 0.25, 0.3),
          }}
        >
          <circle cx="100" cy="110" r="22" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
          {/* Eyes */}
          <circle cx="92" cy="105" r="2.5" fill="#1f2937" />
          <circle cx="108" cy="105" r="2.5" fill="#1f2937" />
          {/* Carrot nose */}
          <polygon points="100,110 105,115 100,113" fill="#f97316" />
          {/* Smile/Frown based on mistakes */}
          <motion.path
            d={mistakes === 0 ? 'M 90 120 Q 100 125, 110 120' : 'M 90 122 Q 100 118, 110 122'}
            stroke="#1f2937"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Hat */}
          {mistakes === 0 && (
            <>
              <rect x="85" y="90" width="30" height="8" fill="#1f2937" rx="2" />
              <rect x="90" y="78" width="20" height="12" fill="#1f2937" rx="1" />
            </>
          )}
        </motion.g>
      )}

      {/* Buttons */}
      {mistakes < 3 && (
        <>
          <circle cx="100" cy="145" r="3" fill="#1f2937" />
          <circle cx="100" cy="158" r="3" fill="#1f2937" />
        </>
      )}

      {/* Puddle appears as snowman melts */}
      {mistakes > 3 && (
        <motion.ellipse
          cx="100"
          cy="232"
          rx={20 + mistakes * 10}
          ry="5"
          fill="#3b82f6"
          opacity="0.3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}
    </motion.svg>
  );
}
