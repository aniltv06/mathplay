/**
 * Kid-Friendly Hangman Visual Themes
 * Multiple animated themes for math hangman game
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { soundEffects, SoundType } from '../../../utils/soundEffects';

import { HangmanTheme as HangmanThemeComponent } from './themes/HangmanTheme';
import { BalloonsTheme } from './themes/BalloonsTheme';
import { SnowmanTheme } from './themes/SnowmanTheme';
import { BlocksTheme } from './themes/BlocksTheme';
import { FlowerTheme } from './themes/FlowerTheme';
import { RobotTheme } from './themes/RobotTheme';
import { DinosaurTheme } from './themes/DinosaurTheme';
import { RocketTheme } from './themes/RocketTheme';
import { CastleTheme } from './themes/CastleTheme';
import { OceanTheme } from './themes/OceanTheme';

export type HangmanTheme = 'hangman' | 'balloons' | 'snowman' | 'blocks' | 'flower' | 'robot' | 'dinosaur' | 'rocket' | 'castle' | 'ocean';

interface Props {
  mistakes: number;
  maxMistakes?: number;
  theme?: HangmanTheme;
  onThemeChange?: (theme: HangmanTheme) => void;
}

export function HangmanGame({
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
            <HangmanThemeComponent key="hangman" mistakes={mistakes} maxMistakes={maxMistakes} />
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
