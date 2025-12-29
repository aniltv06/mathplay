/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion } from 'motion/react';
import { Brain, Zap, Flame } from 'lucide-react';
import type { Difficulty } from '../types';

interface Props {
  onSelect: (difficulty: Difficulty) => void;
  hasCustomSettings?: boolean;
  title?: string;
  description?: string;
}

export function DifficultySelector({ onSelect, hasCustomSettings, title = 'Math Hangman! 🎯', description = 'Choose your difficulty level to begin' }: Props) {
  const difficulties = [
    {
      level: 'easy' as Difficulty,
      title: 'Easy',
      description: 'Numbers 1-10',
      icon: Brain,
      color: 'from-green-400 to-emerald-500',
      textColor: 'text-green-600',
    },
    {
      level: 'medium' as Difficulty,
      title: 'Medium',
      description: 'Numbers 1-20',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      textColor: 'text-orange-600',
    },
    {
      level: 'hard' as Difficulty,
      title: 'Hard',
      description: 'Numbers 1-100',
      icon: Flame,
      color: 'from-red-400 to-pink-500',
      textColor: 'text-red-600',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl mb-4 text-white drop-shadow-lg">
          {title}
        </h1>
        <p className="text-xl text-white/90">
          {description}
        </p>
        {hasCustomSettings && (
          <div className="mt-4 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl inline-flex items-center gap-2">
            ⚙️ Custom Settings Active - Click any difficulty to start
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {difficulties.map((diff, index) => {
          const Icon = diff.icon;
          return (
            <motion.button
              key={diff.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(diff.level)}
              className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all group"
            >
              <div
                className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${diff.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h2 className={`text-3xl mb-2 ${diff.textColor}`}>
                {diff.title}
              </h2>
              <p className="text-gray-600">{diff.description}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}