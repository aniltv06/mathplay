/**
 * Kid-Friendly Hangman Visual Themes - Flower Theme
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';

export function FlowerTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
  const petals = [
    { angle: 0, color: '#ec4899' },
    { angle: 60, color: '#3b82f6' },
    { angle: 120, color: '#8b5cf6' },
    { angle: 180, color: '#ef4444' },
    { angle: 240, color: '#fbbf24' },
    { angle: 300, color: '#10b981' },
  ];

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
      {/* Sky */}
      <rect width="200" height="280" fill="#e0f2fe" />

      {/* Grass */}
      <rect y="240" width="200" height="40" fill="#86efac" />

      {/* Decorative grass blades */}
      {[...Array(10)].map((_, i) => (
        <motion.path
          key={i}
          d={`M ${i * 25 + 10} 240 Q ${i * 25 + 10} 230, ${i * 25 + 15} 225`}
          stroke="#22c55e"
          strokeWidth="2"
          fill="none"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
          style={{ transformOrigin: `${i * 25 + 10}px 240px` }}
        />
      ))}

      {/* Pot */}
      <path d="M 70 240 L 75 260 L 125 260 L 130 240 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
      <rect x="75" y="260" width="50" height="3" fill="#7f1d1d" />

      {/* Stem - droops with mistakes */}
      <motion.path
        d={mistakes > 4 ? 'M 100 240 Q 95 210, 90 180 Q 88 150, 100 130' : 'M 100 240 L 100 130'}
        stroke="#059669"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        animate={mistakes > 4 ? {} : { y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Leaves */}
      <motion.ellipse
        cx="85"
        cy="190"
        rx="15"
        ry="8"
        fill="#22c55e"
        stroke="#16a34a"
        strokeWidth="1.5"
        transform="rotate(-30 85 190)"
        animate={{ rotate: [-35, -25, -35] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: '85px 190px' }}
      />
      <motion.ellipse
        cx="115"
        cy="170"
        rx="15"
        ry="8"
        fill="#22c55e"
        stroke="#16a34a"
        strokeWidth="1.5"
        transform="rotate(30 115 170)"
        animate={{ rotate: [25, 35, 25] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        style={{ transformOrigin: '115px 170px' }}
      />

      {/* Center of flower */}
      <motion.circle
        cx="100"
        cy="100"
        r="20"
        fill="#fbbf24"
        stroke="#f59e0b"
        strokeWidth="3"
        animate={mistakes > 0 ? { scale: [1, 0.95, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ transformOrigin: '100px 100px' }}
      />
      {/* Seed pattern */}
      {[...Array(12)].map((_, i) => (
        <circle
          key={i}
          cx={100 + Math.cos((i * Math.PI) / 6) * 8}
          cy={100 + Math.sin((i * Math.PI) / 6) * 8}
          r="2"
          fill="#f97316"
        />
      ))}

      {/* Petals - fall off with mistakes */}
      {petals.slice(0, maxMistakes).map((petal, i) => {
        const shouldFall = i < mistakes;
        const rad = (petal.angle * Math.PI) / 180;
        const distance = 35;
        const x = 100 + Math.cos(rad) * distance;
        const y = 100 + Math.sin(rad) * distance;

        return (
          <motion.g
            key={i}
            initial={{ opacity: 1, scale: 1 }}
            animate={
              shouldFall
                ? {
                    y: 200,
                    x: Math.random() * 50 - 25,
                    rotate: Math.random() * 360,
                    opacity: 0,
                    scale: 0.5,
                  }
                : {
                    scale: [1, 1.05, 1],
                  }
            }
            transition={
              shouldFall
                ? { duration: 1.5, ease: 'easeIn' }
                : { duration: 2, repeat: Infinity, delay: i * 0.1 }
            }
          >
            <ellipse
              cx={x}
              cy={y}
              rx="16"
              ry="22"
              fill={petal.color}
              stroke={petal.color}
              strokeWidth="2"
              transform={`rotate(${petal.angle} ${x} ${y})`}
              filter="drop-shadow(0 2px 3px rgba(0,0,0,0.2))"
            />
            {/* Petal highlight */}
            <ellipse
              cx={x - 3}
              cy={y - 5}
              rx="5"
              ry="8"
              fill="white"
              opacity="0.4"
              transform={`rotate(${petal.angle} ${x} ${y})`}
            />
          </motion.g>
        );
      })}

      {/* Butterfly decoration */}
      <motion.g
        animate={{
          x: [0, 30, 0, -30, 0],
          y: [0, -20, -10, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <ellipse cx="160" cy="60" rx="8" ry="12" fill="#ec4899" opacity="0.7" />
        <ellipse cx="175" cy="60" rx="8" ry="12" fill="#ec4899" opacity="0.7" />
        <circle cx="167.5" cy="60" r="3" fill="#1f2937" />
      </motion.g>
    </motion.svg>
  );
}
