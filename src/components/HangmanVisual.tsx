/**
 * Kid-Friendly Hangman Visual Themes
 * Multiple animated themes for math hangman game
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { soundEffects, SoundType } from '../utils/soundEffects';

export type HangmanTheme = 'hangman' | 'balloons' | 'snowman' | 'blocks' | 'flower' | 'robot' | 'dinosaur' | 'rocket' | 'castle' | 'ocean';

interface Props {
  mistakes: number;
  maxMistakes?: number;
  theme?: HangmanTheme;
  onThemeChange?: (theme: HangmanTheme) => void;
}

export function HangmanVisual({
  mistakes,
  maxMistakes = 6,
  theme: controlledTheme,
  onThemeChange
}: Props) {
  const [localTheme, setLocalTheme] = useState<HangmanTheme>(() => {
    const saved = localStorage.getItem('hangman_theme');
    return (saved as HangmanTheme) || 'blocks';
  });

  const theme = controlledTheme || localTheme;

  const handleThemeChange = (newTheme: HangmanTheme) => {
    setLocalTheme(newTheme);
    localStorage.setItem('hangman_theme', newTheme);
    onThemeChange?.(newTheme);
  };

  // Play sound effects when mistakes change
  useEffect(() => {
    if (mistakes === 0) return; // Don't play sound on initial render

    const soundMap: Record<HangmanTheme, SoundType> = {
      hangman: 'wrong',
      balloons: 'pop',
      snowman: 'melt',
      blocks: 'crash',
      flower: 'fall',
      robot: 'beep',
      dinosaur: 'roar',
      rocket: 'blast',
      castle: 'crumble',
      ocean: 'splash',
    };

    soundEffects.play(soundMap[theme]);
  }, [mistakes, theme]);

  const themes = [
    { id: 'hangman' as HangmanTheme, name: 'Classic', emoji: '🎯' },
    { id: 'balloons' as HangmanTheme, name: 'Balloons', emoji: '🎈' },
    { id: 'snowman' as HangmanTheme, name: 'Snowman', emoji: '⛄' },
    { id: 'blocks' as HangmanTheme, name: 'Blocks', emoji: '🧱' },
    { id: 'flower' as HangmanTheme, name: 'Flower', emoji: '🌸' },
    { id: 'robot' as HangmanTheme, name: 'Robot', emoji: '🤖' },
    { id: 'dinosaur' as HangmanTheme, name: 'Dinosaur', emoji: '🦕' },
    { id: 'rocket' as HangmanTheme, name: 'Rocket', emoji: '🚀' },
    { id: 'castle' as HangmanTheme, name: 'Castle', emoji: '🏰' },
    { id: 'ocean' as HangmanTheme, name: 'Ocean', emoji: '🌊' },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Theme Selector - Picker */}
      <div className="flex items-center gap-3">
        <label htmlFor="hangman-theme" className="text-sm font-medium text-gray-700">
          Theme:
        </label>
        <select
          id="hangman-theme"
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value as HangmanTheme)}
          className="px-4 py-2 rounded-lg border-2 border-purple-300 bg-white text-gray-700 font-medium shadow-sm hover:border-purple-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer"
        >
          {themes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.emoji} {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Visual Display */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {theme === 'hangman' && (
            <HangmanTheme key="hangman" mistakes={mistakes} maxMistakes={maxMistakes} />
          )}
          {theme === 'balloons' && (
            <BalloonsTheme key="balloons" mistakes={mistakes} maxMistakes={maxMistakes} />
          )}
          {theme === 'snowman' && (
            <SnowmanTheme key="snowman" mistakes={mistakes} maxMistakes={maxMistakes} />
          )}
          {theme === 'blocks' && (
            <BlocksTheme key="blocks" mistakes={mistakes} maxMistakes={maxMistakes} />
          )}
          {theme === 'flower' && (
            <FlowerTheme key="flower" mistakes={mistakes} maxMistakes={maxMistakes} />
          )}
          {theme === 'robot' && (
            <RobotTheme key="robot" mistakes={mistakes} maxMistakes={maxMistakes} />
          )}
          {theme === 'dinosaur' && (
            <DinosaurTheme key="dinosaur" mistakes={mistakes} maxMistakes={maxMistakes} />
          )}
          {theme === 'rocket' && (
            <RocketTheme key="rocket" mistakes={mistakes} maxMistakes={maxMistakes} />
          )}
          {theme === 'castle' && (
            <CastleTheme key="castle" mistakes={mistakes} maxMistakes={maxMistakes} />
          )}
          {theme === 'ocean' && (
            <OceanTheme key="ocean" mistakes={mistakes} maxMistakes={maxMistakes} />
          )}
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="flex gap-2">
        {[...Array(maxMistakes)].map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i < mistakes ? 'bg-red-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// CLASSIC HANGMAN THEME - Traditional gallows design (Enhanced)
// ============================================================================
function HangmanTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
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

// ============================================================================
// BALLOONS THEME - Balloons float away
// ============================================================================
function BalloonsTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
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

// ============================================================================
// SNOWMAN THEME - Snowman melts in the sun
// ============================================================================
function SnowmanTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
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

// ============================================================================
// BLOCKS THEME - Building blocks fall off tower
// ============================================================================
function BlocksTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
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

// ============================================================================
// FLOWER THEME - Flower loses petals
// ============================================================================
function FlowerTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
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

// ============================================================================
// ROBOT THEME - Robot disassembles/assembles
// ============================================================================
function RobotTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
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

// ============================================================================
// DINOSAUR THEME - Dinosaur loses body parts
// ============================================================================
function DinosaurTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
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

// ============================================================================
// ROCKET THEME - Rocket disassembles/launches
// ============================================================================
function RocketTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
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

// ============================================================================
// CASTLE THEME - Castle walls crumble
// ============================================================================
function CastleTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
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

// ============================================================================
// OCEAN THEME - Sea creatures swim away
// ============================================================================
function OceanTheme({ mistakes, maxMistakes }: { mistakes: number; maxMistakes: number }) {
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
