/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Zap, Flame } from 'lucide-react';
import type { Difficulty } from '../types';

export interface OperationSelection {
  addition: boolean;
  subtraction: boolean;
  multiplication: boolean;
  division: boolean;
}

interface Props {
  onSelect: (difficulty: Difficulty, operations: OperationSelection) => void;
  hasCustomSettings?: boolean;
  title?: string;
  description?: string;
  initialOperations?: OperationSelection;
}

export function DifficultySelector({
  onSelect,
  hasCustomSettings,
  title = 'Math Hangman! 🎯',
  description = 'Choose your difficulty level to begin',
  initialOperations
}: Props) {
  // Initialize operations state
  const [operations, setOperations] = useState<OperationSelection>(
    initialOperations || {
      addition: true,
      subtraction: true,
      multiplication: true,
      division: true,
    }
  );

  // Toggle operation selection
  const toggleOperation = (op: keyof OperationSelection) => {
    // Count how many operations are currently selected
    const selectedCount = Object.values(operations).filter(Boolean).length;

    // Don't allow deselecting if it's the last selected operation
    if (selectedCount === 1 && operations[op]) {
      return;
    }

    setOperations(prev => ({
      ...prev,
      [op]: !prev[op]
    }));
  };

  // Operation buttons config
  const operationButtons = [
    { key: 'addition' as keyof OperationSelection, symbol: '+', label: 'Addition', color: 'green', bgColor: '#22c55e' },
    { key: 'subtraction' as keyof OperationSelection, symbol: '−', label: 'Subtraction', color: 'blue', bgColor: '#3b82f6' },
    { key: 'multiplication' as keyof OperationSelection, symbol: '×', label: 'Multiplication', color: 'purple', bgColor: '#a855f7' },
    { key: 'division' as keyof OperationSelection, symbol: '÷', label: 'Division', color: 'orange', bgColor: '#f97316' },
  ];

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
        className="text-center mb-8"
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

      {/* Operation Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Select Operations
          </h3>
          <div className="flex gap-3 justify-center">
            {operationButtons.map(({ key, symbol, label, color, bgColor }) => (
              <button
                key={key}
                onClick={() => toggleOperation(key)}
                style={operations[key] ? {
                  backgroundColor: bgColor,
                  color: 'white'
                } : undefined}
                className={`w-16 h-16 rounded-2xl font-bold text-3xl transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                  operations[key]
                    ? `bg-${color}-500 text-white shadow-lg ring-${color}-300`
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                }`}
                title={label}
                aria-label={`${label}: ${operations[key] ? 'selected' : 'not selected'}`}
                aria-pressed={operations[key]}
              >
                {symbol}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 text-center mt-3">
            Select at least one operation type
          </p>
        </div>
      </motion.div>

      {/* Difficulty Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {difficulties.map((diff, index) => {
          const Icon = diff.icon;
          return (
            <motion.button
              key={diff.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(diff.level, operations)}
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