/**
 * Multiplication Grid Component - Interactive times table chart
 *
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import type { DifficultyLevel, LearningMode, MultiplicationProgress } from './multiplicationTypes';

interface MultiplicationGridProps {
  onBack: () => void;
  onSelectTable: (table: number, mode?: LearningMode) => void;
  progress: MultiplicationProgress;
  difficulty: DifficultyLevel;
  speak: (text: string) => void;
  voiceEnabled: boolean;
}

export function MultiplicationGrid({ onBack, onSelectTable, progress, difficulty, speak, voiceEnabled }: MultiplicationGridProps) {
  const range = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 12;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to menu
        </button>
        <h1 className="text-5xl text-white mb-4 drop-shadow-lg font-bold">
          Multiplication Grid ⬜
        </h1>
        <p className="text-xl text-white/90">
          Click any cell to practice that multiplication fact
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl max-w-6xl mx-auto overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-lg border-2 border-white">
                ×
              </th>
              {[...Array(range)].map((_, i) => (
                <th
                  key={i}
                  className="p-3 bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold text-lg border-2 border-white min-w-[60px]"
                >
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(range)].map((_, row) => {
              const rowNum = row + 1;
              const isMastered = progress[rowNum]?.mastered;

              return (
                <tr key={row}>
                  <td className="p-3 bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold text-lg border-2 border-white text-center">
                    {rowNum}
                  </td>
                  {[...Array(range)].map((_, col) => {
                    const colNum = col + 1;
                    const product = rowNum * colNum;

                    return (
                      <motion.td
                        key={col}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          onSelectTable(rowNum, 'practice');
                          if (voiceEnabled) {
                            speak(`${rowNum} times ${colNum} equals ${product}`);
                          }
                        }}
                        className={`p-3 text-center font-bold text-lg border-2 border-gray-200 cursor-pointer transition-colors ${
                          isMastered
                            ? 'bg-green-100 hover:bg-green-200 text-green-800'
                            : 'bg-gray-50 hover:bg-purple-100 text-gray-800'
                        }`}
                      >
                        {product}
                      </motion.td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 border-2 border-gray-200 rounded"></div>
            <span className="text-gray-700">Mastered Tables</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-50 border-2 border-gray-200 rounded"></div>
            <span className="text-gray-700">Practice Needed</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
