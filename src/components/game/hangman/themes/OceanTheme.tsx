/**
 * Kid-Friendly Hangman Visual Themes - Ocean Theme
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';

export function OceanTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
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
      {/* Ocean gradient background */}
      <defs>
        <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>
      <rect width="200" height="280" fill="url(#oceanGradient)" />

      {/* Bubbles */}
      {[...Array(10)].map((_, i) => (
        <motion.circle
          key={i}
          cx={20 + i * 20}
          cy={250}
          r="3"
          fill="white"
          opacity="0.4"
          animate={{
            cy: [250, -20],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Seaweed */}
      {[40, 160].map((x, i) => (
        <motion.path
          key={i}
          d={`M ${x} 280 Q ${x - 10} 250, ${x} 220 Q ${x + 10} 190, ${x} 160`}
          stroke="#15803d"
          strokeWidth="4"
          fill="none"
          initial={{ d: `M ${x} 280 Q ${x - 10} 250, ${x} 220 Q ${x + 10} 190, ${x} 160` }}
          animate={{ d: [
            `M ${x} 280 Q ${x - 10} 250, ${x} 220 Q ${x + 10} 190, ${x} 160`,
            `M ${x} 280 Q ${x + 10} 250, ${x} 220 Q ${x - 10} 190, ${x} 160`,
            `M ${x} 280 Q ${x - 10} 250, ${x} 220 Q ${x + 10} 190, ${x} 160`,
          ]}}
          transition={{ duration: 3, repeat: Infinity }}
        />
      ))}

      {/* Fish 1 - Orange fish - disappears at 0 mistakes */}
      {mistakes < 1 && (
        <motion.g
          initial={{ x: 0, opacity: 1 }}
          exit={{ x: -150, opacity: 0 }}
          animate={{ y: [0, -5, 0] }}
          transition={{
            x: { duration: 1.5, ease: 'easeIn' },
            y: { duration: 2, repeat: Infinity },
          }}
        >
          <ellipse cx="80" cy="100" rx="20" ry="12" fill="#fb923c" stroke="#ea580c" strokeWidth="2" />
          <polygon points="60,100 50,95 50,105" fill="#fb923c" stroke="#ea580c" strokeWidth="1" />
          <circle cx="90" cy="97" r="3" fill="#1f2937" />
        </motion.g>
      )}

      {/* Fish 2 - Yellow fish - disappears at 1 mistake */}
      {mistakes < 2 && (
        <motion.g
          initial={{ x: 0, opacity: 1 }}
          exit={{ x: 150, opacity: 0 }}
          animate={{ y: [0, -8, 0] }}
          transition={{
            x: { duration: 1.5, ease: 'easeIn' },
            y: { duration: 2.5, repeat: Infinity },
          }}
        >
          <ellipse cx="130" cy="140" rx="18" ry="10" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
          <polygon points="148,140 158,135 158,145" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
          <circle cx="122" cy="137" r="3" fill="#1f2937" />
        </motion.g>
      )}

      {/* Starfish - disappears at 2 mistakes */}
      {mistakes < 3 && (
        <motion.g
          initial={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <motion.g
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ transformOrigin: '50px 200px' }}
          >
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <ellipse
                key={i}
                cx={50 + Math.cos((angle * Math.PI) / 180) * 15}
                cy={200 + Math.sin((angle * Math.PI) / 180) * 15}
                rx="6"
                ry="12"
                fill="#ec4899"
                stroke="#be185d"
                strokeWidth="1"
                transform={`rotate(${angle} 50 200)`}
              />
            ))}
            <circle cx="50" cy="200" r="8" fill="#ec4899" stroke="#be185d" strokeWidth="1" />
          </motion.g>
        </motion.g>
      )}

      {/* Sea turtle - disappears at 3 mistakes */}
      {mistakes < 4 && (
        <motion.g
          initial={{ x: 0, y: 0, opacity: 1 }}
          exit={{ y: -200, opacity: 0 }}
          animate={{ x: [0, 10, 0] }}
          transition={{
            y: { duration: 2, ease: 'easeIn' },
            x: { duration: 3, repeat: Infinity },
          }}
        >
          <ellipse cx="100" cy="180" rx="25" ry="20" fill="#15803d" stroke="#14532d" strokeWidth="2" />
          {/* Shell pattern */}
          <ellipse cx="100" cy="180" rx="18" ry="14" fill="#16a34a" />
          <line x1="100" y1="166" x2="100" y2="194" stroke="#14532d" strokeWidth="1" />
          <line x1="85" y1="180" x2="115" y2="180" stroke="#14532d" strokeWidth="1" />
          {/* Head */}
          <ellipse cx="120" cy="175" rx="8" ry="6" fill="#15803d" stroke="#14532d" strokeWidth="1" />
          <circle cx="123" cy="173" r="1.5" fill="#1f2937" />
          {/* Flippers */}
          <ellipse cx="80" cy="190" rx="10" ry="5" fill="#15803d" stroke="#14532d" strokeWidth="1" />
          <ellipse cx="120" cy="190" rx="10" ry="5" fill="#15803d" stroke="#14532d" strokeWidth="1" />
        </motion.g>
      )}

      {/* Jellyfish - disappears at 4 mistakes */}
      {mistakes < 5 && (
        <motion.g
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: -200, opacity: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={{
            exit: { duration: 2, ease: 'easeIn' },
            y: { duration: 2.5, repeat: Infinity },
          }}
        >
          <ellipse cx="150" cy="80" rx="15" ry="12" fill="#c084fc" opacity="0.7" stroke="#9333ea" strokeWidth="1" />
          {[0, 5, 10].map((offset, i) => (
            <motion.path
              key={i}
              d={`M ${145 + offset} 92 Q ${145 + offset} 105, ${143 + offset} 115`}
              stroke="#9333ea"
              strokeWidth="2"
              fill="none"
              initial={{ d: `M ${145 + offset} 92 Q ${145 + offset} 105, ${143 + offset} 115` }}
              animate={{ d: [
                `M ${145 + offset} 92 Q ${145 + offset} 105, ${143 + offset} 115`,
                `M ${145 + offset} 92 Q ${145 + offset} 105, ${147 + offset} 115`,
                `M ${145 + offset} 92 Q ${145 + offset} 105, ${143 + offset} 115`,
              ]}}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.g>
      )}

      {/* Seahorse - disappears at 5 mistakes */}
      {mistakes < 6 && (
        <motion.g
          initial={{ x: 0, opacity: 1 }}
          exit={{ x: 150, opacity: 0 }}
          animate={{ rotate: [0, -5, 0] }}
          transition={{
            x: { duration: 1.5, ease: 'easeIn' },
            rotate: { duration: 2, repeat: Infinity },
          }}
          style={{ transformOrigin: '60px 230px' }}
        >
          <path
            d="M 60 240 Q 55 235, 55 230 Q 55 220, 60 215 Q 63 210, 63 205 L 65 200"
            stroke="#fbbf24"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="65" cy="198" r="5" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
          <circle cx="67" cy="197" r="1.5" fill="#1f2937" />
          <path d="M 63 200 Q 60 202, 58 205" stroke="#fbbf24" strokeWidth="4" fill="none" />
        </motion.g>
      )}

      {/* Coral decoration */}
      <motion.path
        d="M 180 280 L 185 260 M 180 280 L 175 265 M 180 280 L 190 270"
        stroke="#ec4899"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ strokeWidth: [3, 4, 3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.svg>
  );
}
