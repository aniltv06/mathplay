/**
 * Kid-Friendly Hangman Visual Themes - Blocks Theme
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';

export function BlocksTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
  const blocks = [
    { color: '#ef4444', pattern: 'circle', y: 200 },
    { color: '#3b82f6', pattern: 'square', y: 160 },
    { color: '#10b981', pattern: 'triangle', y: 120 },
    { color: '#fbbf24', pattern: 'star', y: 80 },
    { color: '#ec4899', pattern: 'dots', y: 40 },
    { color: '#8b5cf6', pattern: 'heart', y: 0 },
  ];

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
      {/* Base platform */}
      <rect x="50" y="235" width="100" height="12" fill="#8b5cf6" rx="6" />
      <rect x="55" y="240" width="90" height="5" fill="#7c3aed" rx="3" opacity="0.5" />

      {blocks.slice(0, maxMistakes).map((block, i) => {
        const shouldFall = i < mistakes;
        const isUnstable = i === mistakes && mistakes > 0;

        return (
          <motion.g
            key={i}
            initial={{ y: 0, rotate: 0, opacity: 1 }}
            animate={
              shouldFall
                ? {
                    y: 300,
                    x: Math.random() > 0.5 ? 50 : -50,
                    rotate: Math.random() > 0.5 ? 180 : -180,
                    opacity: 0,
                  }
                : isUnstable
                ? {
                    rotate: [-2, 2, -2, 2, 0],
                    x: [-2, 2, -2, 2, 0],
                  }
                : {}
            }
            transition={
              shouldFall
                ? { duration: 0.8, ease: 'easeIn' }
                : isUnstable
                ? { duration: 0.5 }
                : {}
            }
          >
            {/* Block */}
            <rect
              x="60"
              y={block.y + 35}
              width="80"
              height="32"
              fill={block.color}
              rx="6"
              stroke={block.color}
              strokeWidth="2"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            />

            {/* Pattern decorations */}
            {block.pattern === 'circle' && (
              <circle cx="100" cy={block.y + 51} r="8" fill="white" opacity="0.4" />
            )}
            {block.pattern === 'square' && (
              <rect x="92" y={block.y + 43} width="16" height="16" fill="white" opacity="0.4" rx="2" />
            )}
            {block.pattern === 'triangle' && (
              <polygon points={`100,${block.y + 43} 110,${block.y + 59} 90,${block.y + 59}`} fill="white" opacity="0.4" />
            )}
            {block.pattern === 'star' && (
              <text x="100" y={block.y + 56} textAnchor="middle" fontSize="18" fill="white" opacity="0.6">
                ⭐
              </text>
            )}
            {block.pattern === 'dots' && (
              <>
                <circle cx="85" cy={block.y + 48} r="4" fill="white" opacity="0.5" />
                <circle cx="100" cy={block.y + 48} r="4" fill="white" opacity="0.5" />
                <circle cx="115" cy={block.y + 48} r="4" fill="white" opacity="0.5" />
              </>
            )}
            {block.pattern === 'heart' && (
              <text x="100" y={block.y + 56} textAnchor="middle" fontSize="18" fill="white" opacity="0.6">
                ❤️
              </text>
            )}
          </motion.g>
        );
      })}
    </motion.svg>
  );
}
