/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Printable Worksheet Component
 * Print-friendly worksheet view with optional answer key
 */

import { useState } from 'react';
import { X, Printer } from 'lucide-react';
import type { Problem, ProblemSettings } from '../types';

interface Props {
  problems: Problem[];
  settings: ProblemSettings;
  profileName: string;
  onClose: () => void;
}

export function PrintableWorksheet({ problems, settings, profileName, onClose }: Props) {
  const [showAnswers, setShowAnswers] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const getDifficultyLabel = () => {
    if (settings.difficulty === 'easy') return 'Easy (1-10)';
    if (settings.difficulty === 'medium') return 'Medium (1-20)';
    if (settings.difficulty === 'hard') return 'Hard (1-100)';
    return 'Custom';
  };

  const getOperationLabels = () => {
    const ops = [];
    if (settings.includeAddition) ops.push('Addition');
    if (settings.includeSubtraction) ops.push('Subtraction');
    if (settings.includeMultiplication) ops.push('Multiplication');
    if (settings.includeDivision) ops.push('Division');
    return ops.join(', ');
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Print Controls (hidden when printing) */}
      <div className="no-print sticky top-0 z-10 bg-white border-b-2 border-gray-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-800 mb-2">Print Worksheet</h2>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showAnswers}
                onChange={(e) => setShowAnswers(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              Include Answer Key
            </label>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Printable Content */}
      <div className="print-content max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8 pb-4 border-b-2 border-gray-300">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Math Worksheet</h1>
          <div className="text-lg text-gray-600 space-y-1">
            <div>Name: {profileName}</div>
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Difficulty: {getDifficultyLabel()}</div>
            <div>Operations: {getOperationLabels()}</div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-600 min-w-[2rem]">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <div className="text-2xl font-mono text-gray-800 mb-2">
                    {problem.num1} {problem.operation} {problem.num2} = _____
                  </div>
                  {showAnswers && (
                    <div className="text-lg text-green-600 font-bold">
                      Answer: {problem.correct}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Answer Key (separate page) */}
        {showAnswers && (
          <div className="page-break mt-12 pt-12 border-t-4 border-gray-400">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Answer Key
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded p-3 bg-green-50"
                >
                  <div className="text-sm text-gray-600 mb-1">#{index + 1}</div>
                  <div className="text-lg font-mono">
                    {problem.num1} {problem.operation} {problem.num2} = <span className="font-bold text-green-600">{problem.correct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-4 border-t-2 border-gray-300 text-center text-sm text-gray-500">
          <p>Math Fun Worksheet - Generated on {new Date().toLocaleString()}</p>
          <p className="mt-1">Keep practicing! You're doing great! 🌟</p>
        </div>
      </div>
    </div>
  );
}
