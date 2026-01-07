/**
 * Print Worksheet Page - Enhanced with All Features
 * Comprehensive worksheet generator with difficulty presets, themes, and advanced options
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect, Fragment } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Printer, Save, FolderOpen, Download, Settings, Sparkles, Clock, Book } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import { formatName } from '../utils/formatters';
import type { Operation } from '../types';

interface Props {
  onBack: () => void;
  profileId: string;
}

interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  type: 'standard' | 'fill-blank' | 'compare' | 'missing-op';
  blankPosition?: 'num1' | 'num2' | 'answer';
}

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'custom';
type ThemeType = 'standard' | 'space' | 'ocean' | 'holiday' | 'animal' | 'sports';
type LayoutType = 'horizontal' | 'vertical' | '3-column' | 'flash-cards' | 'large-print';
type SpacingType = 'compact' | 'normal' | 'large' | 'extra-large';
type AnswerKeyPosition = 'separate' | 'side-by-side' | 'upside-down' | 'none';

interface WorksheetSettings {
  numProblems: number;
  minNumber: number;
  maxNumber: number;
  includeAddition: boolean;
  includeSubtraction: boolean;
  includeMultiplication: boolean;
  includeDivision: boolean;
  difficulty: DifficultyLevel;
  theme: ThemeType;
  layout: LayoutType;
  spacing: SpacingType;
  worksheetTitle: string;
  showAnswers: boolean;
  includeWorkspace: boolean;
  answerKeyPosition: AnswerKeyPosition;
  // New features
  requireCarrying: boolean;
  requireBorrowing: boolean;
  multiDigit: boolean;
  multiplicationTables: number[];
  problemTypes: {
    standard: boolean;
    fillBlank: boolean;
    compare: boolean;
    missingOperator: boolean;
  };
  timedPractice: boolean;
  timeLimit: number;
  progressiveDifficulty: boolean;
  skillFocus: {
    numberBonds: boolean;
    doubles: boolean;
    friendlyNumbers: boolean;
  };
  numWorksheets: number;
  addDecorations: boolean;
  includeStickers: boolean;
  includeCertificate: boolean;
  accessibilityMode: boolean;
  highContrast: boolean;
  extraLargeFont: boolean;
}

const DEFAULT_SETTINGS: WorksheetSettings = {
  numProblems: 20,
  minNumber: 1,
  maxNumber: 20,
  includeAddition: true,
  includeSubtraction: true,
  includeMultiplication: true,
  includeDivision: false,
  difficulty: 'beginner',
  theme: 'standard',
  layout: 'horizontal',
  spacing: 'normal',
  worksheetTitle: 'Math Worksheet',
  showAnswers: false,
  includeWorkspace: false,
  answerKeyPosition: 'none',
  requireCarrying: false,
  requireBorrowing: false,
  multiDigit: false,
  multiplicationTables: [2, 3, 4, 5],
  problemTypes: {
    standard: true,
    fillBlank: false,
    compare: false,
    missingOperator: false,
  },
  timedPractice: false,
  timeLimit: 5,
  progressiveDifficulty: false,
  skillFocus: {
    numberBonds: false,
    doubles: false,
    friendlyNumbers: false,
  },
  numWorksheets: 1,
  addDecorations: false,
  includeStickers: false,
  includeCertificate: false,
  accessibilityMode: false,
  highContrast: false,
  extraLargeFont: false,
};

export function PrintWorksheetPage({ onBack, profileId }: Props) {
  const { getProfile } = useProfiles();
  const profile = getProfile(profileId);

  const [settings, setSettings] = useState<WorksheetSettings>(DEFAULT_SETTINGS);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<{ name: string; settings: WorksheetSettings }[]>([]);
  const [panelWidth, setPanelWidth] = useState(500);
  const [isResizing, setIsResizing] = useState(false);

  // Load saved templates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('worksheetTemplates');
    if (saved) {
      setSavedTemplates(JSON.parse(saved));
    }
  }, []);

  // Handle panel resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth >= 350 && newWidth <= 800) {
          setPanelWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Apply difficulty preset
  const applyDifficultyPreset = (level: DifficultyLevel) => {
    let preset: Partial<WorksheetSettings> = {};

    switch (level) {
      case 'beginner':
        preset = {
          minNumber: 1,
          maxNumber: 10,
          includeAddition: true,
          includeSubtraction: true,
          includeMultiplication: false,
          includeDivision: false,
          requireCarrying: false,
          requireBorrowing: false,
          multiDigit: false,
        };
        break;
      case 'intermediate':
        preset = {
          minNumber: 1,
          maxNumber: 50,
          includeAddition: true,
          includeSubtraction: true,
          includeMultiplication: true,
          includeDivision: false,
          requireCarrying: false,
          requireBorrowing: false,
          multiDigit: false,
        };
        break;
      case 'advanced':
        preset = {
          minNumber: 1,
          maxNumber: 100,
          includeAddition: true,
          includeSubtraction: true,
          includeMultiplication: true,
          includeDivision: true,
          requireCarrying: true,
          requireBorrowing: true,
          multiDigit: true,
        };
        break;
    }

    setSettings(prev => ({ ...prev, ...preset, difficulty: level }));
  };

  // Generate problems with all enhancements
  const generateProblems = () => {
    const operations: Operation[] = [];
    if (settings.includeAddition) operations.push('+');
    if (settings.includeSubtraction) operations.push('-');
    if (settings.includeMultiplication) operations.push('×');
    if (settings.includeDivision) operations.push('÷');

    if (operations.length === 0) {
      alert('Please select at least one operation type');
      return;
    }

    const allProblems: Problem[] = [];
    const problemsPerWorksheet = settings.numProblems;

    for (let w = 0; w < settings.numWorksheets; w++) {
      const worksheetProblems = generateWorksheetProblems(operations, problemsPerWorksheet);
      allProblems.push(...worksheetProblems);
    }

    setProblems(allProblems);
  };

  const generateWorksheetProblems = (operations: Operation[], count: number): Problem[] => {
    const newProblems: Problem[] = [];
    const usedProblems = new Set<string>();
    let attempts = 0;
    const maxAttempts = count * 50;

    while (newProblems.length < count && attempts < maxAttempts) {
      attempts++;

      const problem = generateSingleProblem(operations);
      const problemKey = `${problem.num1}|${problem.operation}|${problem.num2}|${problem.type}`;

      if (!usedProblems.has(problemKey)) {
        usedProblems.add(problemKey);
        newProblems.push(problem);
      }
    }

    // Apply progressive difficulty if enabled
    if (settings.progressiveDifficulty) {
      return applyProgressiveDifficulty(newProblems);
    }

    return newProblems;
  };

  const generateSingleProblem = (operations: Operation[]): Problem => {
    const operation = operations[Math.floor(Math.random() * operations.length)];

    // Select problem type
    const enabledTypes = Object.entries(settings.problemTypes)
      .filter(([_, enabled]) => enabled)
      .map(([type]) => type);
    const selectedType = enabledTypes[Math.floor(Math.random() * enabledTypes.length)];

    // Map settings keys to Problem type values
    const typeMap: Record<string, 'standard' | 'fill-blank' | 'compare' | 'missing-op'> = {
      'standard': 'standard',
      'fillBlank': 'fill-blank',
      'compare': 'compare',
      'missingOperator': 'missing-op'
    };
    const problemType = typeMap[selectedType] || 'standard';

    let num1: number, num2: number, answer: number;

    // Apply skill focus if enabled
    if (settings.skillFocus.numberBonds && operation === '+') {
      return generateNumberBondProblem();
    }
    if (settings.skillFocus.doubles && operation === '+') {
      return generateDoublesProblem();
    }
    if (settings.skillFocus.friendlyNumbers) {
      return generateFriendlyNumbersProblem(operation);
    }

    // Multiplication tables mode
    if (operation === '×' && settings.multiplicationTables.length > 0) {
      const table = settings.multiplicationTables[Math.floor(Math.random() * settings.multiplicationTables.length)];
      num1 = table;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 * num2;
    } else {
      // Standard random generation
      const min = settings.minNumber;
      const max = settings.maxNumber;

      num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      num2 = Math.floor(Math.random() * (max - min + 1)) + min;

      switch (operation) {
        case '+':
          answer = num1 + num2;
          // Check carrying requirement
          if (settings.requireCarrying && !hasCarrying(num1, num2)) {
            return generateSingleProblem(operations); // Retry
          }
          break;
        case '-':
          if (num1 < num2) [num1, num2] = [num2, num1];
          answer = num1 - num2;
          // Check borrowing requirement
          if (settings.requireBorrowing && !hasBorrowing(num1, num2)) {
            return generateSingleProblem(operations); // Retry
          }
          break;
        case '×':
          answer = num1 * num2;
          break;
        case '÷':
          const divisor = num2 === 0 ? 1 : num2;
          const quotient = num1;
          num1 = quotient * divisor;
          num2 = divisor;
          answer = quotient;
          break;
        default:
          answer = 0;
      }
    }

    // Create problem based on type
    const problem: Problem = {
      num1,
      num2,
      operation,
      answer,
      type: problemType,
    };

    if (problemType === 'fill-blank') {
      const positions = ['num1', 'num2', 'answer'] as const;
      problem.blankPosition = positions[Math.floor(Math.random() * positions.length)];
    }

    return problem;
  };

  const hasCarrying = (num1: number, num2: number): boolean => {
    const str1 = num1.toString();
    const str2 = num2.toString();
    let carry = 0;

    for (let i = 0; i < Math.max(str1.length, str2.length); i++) {
      const digit1 = parseInt(str1[str1.length - 1 - i] || '0');
      const digit2 = parseInt(str2[str2.length - 1 - i] || '0');
      if (digit1 + digit2 + carry >= 10) return true;
      carry = digit1 + digit2 + carry >= 10 ? 1 : 0;
    }
    return false;
  };

  const hasBorrowing = (num1: number, num2: number): boolean => {
    const str1 = num1.toString();
    const str2 = num2.toString();

    for (let i = 0; i < str1.length; i++) {
      const digit1 = parseInt(str1[str1.length - 1 - i]);
      const digit2 = parseInt(str2[str2.length - 1 - i] || '0');
      if (digit1 < digit2) return true;
    }
    return false;
  };

  const generateNumberBondProblem = (): Problem => {
    const target = 10;
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = target - num1;
    return {
      num1,
      num2,
      operation: '+',
      answer: target,
      type: 'standard',
    };
  };

  const generateDoublesProblem = (): Problem => {
    const num = Math.floor(Math.random() * 10) + 1;
    return {
      num1: num,
      num2: num,
      operation: '+',
      answer: num * 2,
      type: 'standard',
    };
  };

  const generateFriendlyNumbersProblem = (operation: Operation): Problem => {
    const friendlyNumbers = [10, 20, 25, 50, 100];
    const base = friendlyNumbers[Math.floor(Math.random() * friendlyNumbers.length)];
    const offset = Math.floor(Math.random() * 10) + 1;

    if (operation === '+') {
      return {
        num1: base,
        num2: offset,
        operation: '+',
        answer: base + offset,
        type: 'standard',
      };
    }

    return {
      num1: base + offset,
      num2: offset,
      operation: '-',
      answer: base,
      type: 'standard',
    };
  };

  const applyProgressiveDifficulty = (problems: Problem[]): Problem[] => {
    return problems.sort((a, b) => {
      const diffA = Math.abs(a.answer);
      const diffB = Math.abs(b.answer);
      return diffA - diffB;
    });
  };

  // Save template
  const saveTemplate = () => {
    const name = prompt('Enter template name:');
    if (!name) return;

    const newTemplates = [...savedTemplates, { name, settings }];
    setSavedTemplates(newTemplates);
    localStorage.setItem('worksheetTemplates', JSON.stringify(newTemplates));
    alert('Template saved!');
  };

  // Load template
  const loadTemplate = (template: { name: string; settings: WorksheetSettings }) => {
    setSettings(template.settings);
    alert(`Loaded template: ${template.name}`);
  };

  // Delete template
  const deleteTemplate = (index: number) => {
    const newTemplates = savedTemplates.filter((_, i) => i !== index);
    setSavedTemplates(newTemplates);
    localStorage.setItem('worksheetTemplates', JSON.stringify(newTemplates));
  };

  // Generate initial problems
  useEffect(() => {
    generateProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const totalWorksheets = settings.numWorksheets;
  const problemsPerWorksheet = settings.numProblems;

  // Split problems into worksheets (no artificial page breaks)
  const worksheets: Problem[][] = [];
  for (let w = 0; w < totalWorksheets; w++) {
    const worksheetStart = w * problemsPerWorksheet;
    const worksheetProblems = problems.slice(worksheetStart, worksheetStart + problemsPerWorksheet);
    worksheets.push(worksheetProblems);
  }

  if (!profile) return null;

  const renderProblem = (problem: Problem, index: number) => {
    if (settings.layout === 'flash-cards') {
      return renderFlashCard(problem, index);
    }

    if (settings.layout === 'vertical' || settings.layout === '3-column') {
      return renderVerticalProblem(problem, index);
    }

    return renderHorizontalProblem(problem, index);
  };

  const renderHorizontalProblem = (problem: Problem, index: number) => {
    const showAnswer = settings.answerKeyPosition === 'side-by-side';

    if (problem.type === 'fill-blank') {
      const blank = '____';
      const num1Str = problem.blankPosition === 'num1' ? blank : problem.num1;
      const num2Str = problem.blankPosition === 'num2' ? blank : problem.num2;
      const answerStr = problem.blankPosition === 'answer' ? blank : problem.answer;

      return (
        <div key={index} className="problem-box">
          <div className="flex items-start gap-3">
            <span className="problem-number">{index + 1}.</span>
            <div className="flex-1">
              <div className="problem-text">
                {num1Str} {problem.operation} {num2Str} = {answerStr}
              </div>
              {showAnswer && (
                <div className="answer-text">Answer: {problem.answer}</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (problem.type === 'compare') {
      const value1 = problem.num1;
      const value2 = problem.num2;
      return (
        <div key={index} className="problem-box">
          <div className="flex items-start gap-3">
            <span className="problem-number">{index + 1}.</span>
            <div className="flex-1">
              <div className="problem-text">
                {value1} ____ {value2} {'(<, >, =)'}
              </div>
              {showAnswer && (
                <div className="answer-text">Answer: {value1 > value2 ? '>' : value1 < value2 ? '<' : '='}</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (problem.type === 'missing-op') {
      return (
        <div key={index} className="problem-box">
          <div className="flex items-start gap-3">
            <span className="problem-number">{index + 1}.</span>
            <div className="flex-1">
              <div className="problem-text">
                {problem.num1} ____ {problem.num2} = {problem.answer}
              </div>
              {showAnswer && (
                <div className="answer-text">Answer: {problem.operation}</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="problem-box">
        <div className="flex items-start gap-3">
          <span className="problem-number">{index + 1}.</span>
          <div className="flex-1">
            <div className="problem-text">
              {problem.num1} {problem.operation} {problem.num2} = {showAnswer ? problem.answer : '_______'}
            </div>
            {settings.includeWorkspace && !showAnswer && (
              <div className="workspace">
                <p className="text-xs text-gray-400 mb-1">Show your work:</p>
                <div className="workspace-lines"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderVerticalProblem = (problem: Problem, index: number) => {
    return (
      <div key={index} className="text-center problem-box-vertical">
        <div className="text-xs text-gray-600 mb-2">#{index + 1}</div>
        <div className="vertical-problem">
          <div className="problem-num">{problem.num1}</div>
          <div className="problem-op-line">
            <span className="problem-op">{problem.operation}</span>
            <span className="problem-num">{problem.num2}</span>
          </div>
          <div className="problem-line"></div>
          {settings.answerKeyPosition === 'side-by-side' ? (
            <div className="problem-answer">{problem.answer}</div>
          ) : (
            <div className="problem-blank"></div>
          )}
        </div>
      </div>
    );
  };

  const renderFlashCard = (problem: Problem, index: number) => {
    return (
      <div key={index} className="flash-card">
        <div className="flash-card-front">
          <div className="text-4xl font-bold text-center">
            {problem.num1} {problem.operation} {problem.num2}
          </div>
        </div>
        <div className="flash-card-back">
          <div className="text-5xl font-bold text-center text-green-600">
            {problem.answer}
          </div>
        </div>
      </div>
    );
  };

  const getThemeStyles = () => {
    switch (settings.theme) {
      case 'space':
        return {
          headerBg: 'bg-gradient-to-r from-indigo-600 to-purple-600',
          decoration: '🚀 ⭐ 🌙 🛸',
          border: 'border-purple-400',
        };
      case 'ocean':
        return {
          headerBg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          decoration: '🌊 🐠 🐚 🦈',
          border: 'border-cyan-400',
        };
      case 'holiday':
        return {
          headerBg: 'bg-gradient-to-r from-red-500 to-green-500',
          decoration: '🎄 ⛄ 🎁 ❄️',
          border: 'border-red-400',
        };
      case 'animal':
        return {
          headerBg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          decoration: '🦁 🐯 🐘 🦒',
          border: 'border-orange-400',
        };
      case 'sports':
        return {
          headerBg: 'bg-gradient-to-r from-green-500 to-blue-500',
          decoration: '⚽ 🏀 ⚾ 🏈',
          border: 'border-green-400',
        };
      default:
        return {
          headerBg: 'bg-gradient-to-r from-gray-700 to-gray-800',
          decoration: '',
          border: 'border-gray-800',
        };
    }
  };

  const theme = getThemeStyles();

  const getLayoutColumns = () => {
    switch (settings.layout) {
      case 'horizontal': return 'grid-cols-2';
      case 'vertical': return 'grid-cols-4';
      case '3-column': return 'grid-cols-3';
      case 'flash-cards': return 'grid-cols-2';
      case 'large-print': return 'grid-cols-1';
      default: return 'grid-cols-2';
    }
  };

  return (
    <div className="bg-gray-100">
      {/* Enhanced Controls Header */}
      <div className="no-print sticky top-0 z-50 bg-white border-b-2 border-gray-300 shadow-lg">
        <div className="px-4 py-3">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">📝 Enhanced Worksheet Generator</h1>
                <p className="text-sm text-gray-600">
                  {problems.length} problems • {worksheets.length} worksheet{worksheets.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveTemplate}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                title="Save Template"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={generateProblems}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🔄 Regenerate
              </button>
              <button
                onClick={handlePrint}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-semibold"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Layout */}
      <div className="flex">
        {/* Left Settings Panel */}
        <div
          className="no-print bg-white border-r-2 border-gray-300 overflow-y-auto"
          style={{ width: `${panelWidth}px`, maxHeight: 'calc(100vh - 80px)' }}
        >
          <div className="p-4 space-y-4">
            {/* Difficulty Presets */}
            <div className="border-b pb-4">
              <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Book className="w-4 h-4" />
                Difficulty Level
              </h3>
              <div className="flex gap-2">
                {(['beginner', 'intermediate', 'advanced', 'custom'] as DifficultyLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => level !== 'custom' && applyDifficultyPreset(level)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      settings.difficulty === level
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300'
                    }`}
                  >
                    {level === 'beginner' && '🌟 Beginner'}
                    {level === 'intermediate' && '⭐ Intermediate'}
                    {level === 'advanced' && '🏆 Advanced'}
                    {level === 'custom' && '⚙️ Custom'}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Settings Row */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700">Problems:</label>
                <select
                  value={settings.numProblems}
                  onChange={(e) => setSettings(prev => ({ ...prev, numProblems: Number(e.target.value) }))}
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-500"
                >
                  {[10, 15, 20, 25, 30, 35, 40, 50, 100].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700">Range:</label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={settings.minNumber}
                  onChange={(e) => setSettings(prev => ({ ...prev, minNumber: Number(e.target.value), difficulty: 'custom' }))}
                  className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center focus:border-blue-500"
                />
                <span>to</span>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={settings.maxNumber}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxNumber: Number(e.target.value), difficulty: 'custom' }))}
                  className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700">Worksheets:</label>
                <select
                  value={settings.numWorksheets}
                  onChange={(e) => setSettings(prev => ({ ...prev, numWorksheets: Number(e.target.value) }))}
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-500"
                >
                  {[1, 5, 10, 20, 30].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'worksheet' : 'worksheets'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Operations */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Operations:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSettings(prev => ({ ...prev, includeAddition: !prev.includeAddition }))}
                  className={`w-12 h-12 rounded-lg font-bold text-2xl transition-all ${
                    settings.includeAddition ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  +
                </button>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, includeSubtraction: !prev.includeSubtraction }))}
                  className={`w-12 h-12 rounded-lg font-bold text-2xl transition-all ${
                    settings.includeSubtraction ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  −
                </button>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, includeMultiplication: !prev.includeMultiplication }))}
                  className={`w-12 h-12 rounded-lg font-bold text-2xl transition-all ${
                    settings.includeMultiplication ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  ×
                </button>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, includeDivision: !prev.includeDivision }))}
                  className={`w-12 h-12 rounded-lg font-bold text-2xl transition-all ${
                    settings.includeDivision ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  ÷
                </button>
              </div>
            </div>

            {/* Multiplication Tables (when × is selected) */}
            {settings.includeMultiplication && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Multiplication Tables:</label>
                <div className="flex flex-wrap gap-2">
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(table => (
                    <button
                      key={table}
                      onClick={() => {
                        const tables = settings.multiplicationTables.includes(table)
                          ? settings.multiplicationTables.filter(t => t !== table)
                          : [...settings.multiplicationTables, table];
                        setSettings(prev => ({ ...prev, multiplicationTables: tables }));
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                        settings.multiplicationTables.includes(table)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {table}x
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Settings Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <Settings className="w-4 h-4" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="space-y-4 border-t pt-4">
                {/* Problem Types */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Problem Types:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.problemTypes.standard}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          problemTypes: { ...prev.problemTypes, standard: e.target.checked }
                        }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Standard (5 + 3 = __)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.problemTypes.fillBlank}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          problemTypes: { ...prev.problemTypes, fillBlank: e.target.checked }
                        }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Fill Blank (__ + 3 = 8)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.problemTypes.compare}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          problemTypes: { ...prev.problemTypes, compare: e.target.checked }
                        }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Compare (7 __ 9)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.problemTypes.missingOperator}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          problemTypes: { ...prev.problemTypes, missingOperator: e.target.checked }
                        }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Missing Op (5 __ 3 = 8)</span>
                    </label>
                  </div>
                </div>

                {/* Layout & Theme */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Layout:</label>
                    <select
                      value={settings.layout}
                      onChange={(e) => setSettings(prev => ({ ...prev, layout: e.target.value as LayoutType }))}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                    >
                      <option value="horizontal">Horizontal (2 cols)</option>
                      <option value="vertical">Vertical (4 cols)</option>
                      <option value="3-column">3 Columns</option>
                      <option value="flash-cards">Flash Cards</option>
                      <option value="large-print">Large Print</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Theme:</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value as ThemeType }))}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                    >
                      <option value="standard">Standard</option>
                      <option value="space">🚀 Space</option>
                      <option value="ocean">🌊 Ocean</option>
                      <option value="holiday">🎄 Holiday</option>
                      <option value="animal">🦁 Animal</option>
                      <option value="sports">⚽ Sports</option>
                    </select>
                  </div>
                </div>

                {/* Skill Focus */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Skill Focus:</label>
                  <div className="flex flex-wrap gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.skillFocus.numberBonds}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          skillFocus: { ...prev.skillFocus, numberBonds: e.target.checked }
                        }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Number Bonds to 10</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.skillFocus.doubles}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          skillFocus: { ...prev.skillFocus, doubles: e.target.checked }
                        }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Doubles (2+2, 3+3)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.skillFocus.friendlyNumbers}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          skillFocus: { ...prev.skillFocus, friendlyNumbers: e.target.checked }
                        }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Friendly Numbers (10, 20, 100)</span>
                    </label>
                  </div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.requireCarrying}
                      onChange={(e) => setSettings(prev => ({ ...prev, requireCarrying: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Require Carrying</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.requireBorrowing}
                      onChange={(e) => setSettings(prev => ({ ...prev, requireBorrowing: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Require Borrowing</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.progressiveDifficulty}
                      onChange={(e) => setSettings(prev => ({ ...prev, progressiveDifficulty: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Progressive Difficulty</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.includeWorkspace}
                      onChange={(e) => setSettings(prev => ({ ...prev, includeWorkspace: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Include Workspace</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.addDecorations}
                      onChange={(e) => setSettings(prev => ({ ...prev, addDecorations: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Add Decorations</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.timedPractice}
                      onChange={(e) => setSettings(prev => ({ ...prev, timedPractice: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Timed Practice</span>
                  </label>
                </div>

                {/* Timed Practice Settings */}
                {settings.timedPractice && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <label className="text-sm font-semibold text-gray-700">Time Limit:</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={settings.timeLimit}
                      onChange={(e) => setSettings(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
                      className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center"
                    />
                    <span className="text-sm text-gray-600">minutes</span>
                  </div>
                )}

                {/* Answer Key */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Answer Key:</label>
                  <select
                    value={settings.answerKeyPosition}
                    onChange={(e) => setSettings(prev => ({ ...prev, answerKeyPosition: e.target.value as AnswerKeyPosition }))}
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                  >
                    <option value="none">No Answer Key</option>
                    <option value="separate">Separate Page</option>
                    <option value="side-by-side">Side-by-Side</option>
                    <option value="upside-down">Upside Down (bottom)</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Worksheet Title:</label>
                  <input
                    type="text"
                    value={settings.worksheetTitle}
                    onChange={(e) => setSettings(prev => ({ ...prev, worksheetTitle: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Saved Templates */}
            {savedTemplates.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Saved Templates
                </h3>
                <div className="flex flex-wrap gap-2">
                  {savedTemplates.map((template, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-200 rounded-lg px-3 py-2">
                      <button
                        onClick={() => loadTemplate(template)}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {template.name}
                      </button>
                      <button
                        onClick={() => deleteTemplate(index)}
                        className="text-red-500 hover:text-red-600 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className="no-print w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors relative group"
          onMouseDown={() => setIsResizing(true)}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-400 group-hover:bg-blue-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-1 h-8 bg-white rounded-full" />
          </div>
        </div>

        {/* Right Preview Panel */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          {/* Printable Worksheets */}
          <div className="print-content">
        {worksheets.map((worksheet, worksheetIndex) => (
          <Fragment key={worksheetIndex}>
            <div className="print-page">
              <div className="page-container">
                {/* Worksheet Header */}
                <div className={`text-center mb-6 pb-4 border-b-2 ${theme.border}`}>
                  <div
                    className={`worksheet-header ${theme.headerBg} text-white py-3 px-4 rounded-lg mb-3`}
                    style={{
                      backgroundColor: '#1f2937',
                      backgroundImage: 'linear-gradient(to right, #374151, #1f2937)',
                      color: 'white'
                    }}
                  >
                    <h1 className="text-3xl font-bold" style={{ color: 'white' }}>
                      {settings.worksheetTitle}
                      {settings.addDecorations && settings.theme !== 'standard' && (
                        <span className="ml-3 text-2xl">{theme.decoration}</span>
                      )}
                    </h1>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-700">
                    <span>Name: {formatName(profile.name)}</span>
                    <span>Date: __________</span>
                    {settings.timedPractice && (
                      <>
                        <span>Start: ______</span>
                        <span>End: ______</span>
                        <span>Time: {settings.timeLimit} min</span>
                      </>
                    )}
                    <span>Score: _____ / {settings.numProblems}</span>
                  </div>
                  {settings.numWorksheets > 1 && (
                    <div className="text-xs text-gray-500 mt-2">
                      Worksheet {worksheetIndex + 1} of {settings.numWorksheets}
                    </div>
                  )}
                </div>

                {/* Problems Grid */}
                <div className={`grid ${getLayoutColumns()} content-start`} style={{ gap: '0.12in' }}>
                  {worksheet.map((problem, problemIndex) => {
                    const globalIndex = worksheetIndex * problemsPerWorksheet + problemIndex;
                    return renderProblem(problem, globalIndex);
                  })}
                </div>

                {/* Motivational Footer */}
                {settings.addDecorations && (
                  <div className="mt-6 text-center text-gray-500 text-sm border-t pt-3">
                    <p className="font-semibold">🌟 You're doing great! Keep up the excellent work! 🌟</p>
                  </div>
                )}

                {/* Upside Down Answer Key */}
                {settings.answerKeyPosition === 'upside-down' && (
                  <div className="border-t-2 border-dashed border-gray-400 mt-8 pt-4">
                    <p className="text-center text-xs text-gray-500 mb-2">✂️ Cut here for answers ✂️</p>
                    <div className="transform rotate-180">
                      <h3 className="text-center font-bold mb-2">Answer Key</h3>
                      <div className="grid grid-cols-10 gap-2 text-xs">
                        {worksheet.map((problem, index) => (
                          <span key={index}>
                            {index + 1}. {problem.answer}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Answer Key for this worksheet */}
            {settings.answerKeyPosition === 'separate' && (
              <div className="print-page">
                <div className="page-container">
                  <div className="text-center mb-6 pb-4 border-b-4 border-green-600">
                    <h1 className="text-3xl font-bold text-green-700">
                      ✅ Answer Key
                      {settings.numWorksheets > 1 && ` - Worksheet ${worksheetIndex + 1}`}
                    </h1>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {worksheet.map((problem, index) => (
                      <div key={index} className="answer-key-box">
                        <div className="text-xs text-gray-600 mb-1">#{index + 1}</div>
                        <div className="text-sm font-mono text-gray-700">
                          {problem.num1} {problem.operation} {problem.num2}
                        </div>
                        <div className="text-xl font-bold text-green-600 mt-1">
                          = {problem.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Fragment>
        ))}

        {/* Certificate Page */}
        {settings.includeCertificate && (
          <div className="print-page certificate-page">
            <div className="page-container flex items-center justify-center">
              <div className="border-8 border-double border-yellow-500 p-12 text-center bg-gradient-to-br from-yellow-50 to-orange-50">
                <h1 className="text-5xl font-bold text-yellow-700 mb-6">
                  🏆 Certificate of Achievement 🏆
                </h1>
                <p className="text-2xl mb-4">This certifies that</p>
                <p className="text-4xl font-bold text-blue-600 mb-4">{formatName(profile.name)}</p>
                <p className="text-2xl mb-6">has successfully completed</p>
                <p className="text-3xl font-bold text-purple-600 mb-6">{settings.worksheetTitle}</p>
                <p className="text-xl text-gray-600 mb-8">
                  {problems.length} problems solved with dedication!
                </p>
                <div className="flex justify-around mt-12">
                  <div>
                    <div className="border-t-2 border-gray-400 pt-2">Date: __________</div>
                  </div>
                  <div>
                    <div className="border-t-2 border-gray-400 pt-2">Parent/Teacher Signature</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-8">⭐ Outstanding Effort! ⭐</p>
              </div>
            </div>
          </div>
        )}
      </div>
        </div>
      </div>

      {/* Enhanced Print Styles */}
      <style>{`
  body {
    user-select: ${isResizing ? 'none' : 'auto'};
    cursor: ${isResizing ? 'col-resize' : 'auto'};
  }

        @media screen {
          .print-content {
            background: transparent;
            padding: 0;
            overflow: visible;
          }

          .print-page {
            background: white;
            margin: 0 auto 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 8.5in;
            min-height: auto;
            height: auto;
            position: relative;
            overflow: hidden;
          }

          .page-container {
            width: 8.5in;
            padding: 0.5in;
            box-sizing: border-box;
            display: block;
            overflow: hidden;
          }

          .page-container > * {
            max-width: 100%;
            box-sizing: border-box;
          }

          /* Ensure grid stays within bounds */
          .grid {
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
          }

          /* Ensure worksheet header stays within bounds */
          .worksheet-header {
            position: relative;
            max-width: 100%;
            box-sizing: border-box;
            /* Fallback background in case Tailwind gradients don't render */
            background: linear-gradient(to right, #374151, #1f2937) !important;
          }

          .worksheet-header h1 {
            color: white !important;
            position: relative;
            z-index: 1;
          }

          /* Constrain header info flex containers */
          .page-container .flex.justify-between {
            max-width: 100%;
            box-sizing: border-box;
            flex-wrap: wrap;
            gap: 0.25rem;
          }

          /* Ensure Tailwind gradient classes work */
          .bg-gradient-to-r {
            background-image: linear-gradient(to right, var(--tw-gradient-stops)) !important;
          }

          .problem-box, .problem-box-vertical {
            border: 2px solid #e5e7eb;
            border-radius: 0.1in;
            padding: 0.1in;
            background: #f9fafb;
            page-break-inside: avoid;
            min-height: 0.65in;
            display: flex;
            align-items: center;
            max-width: 100%;
            overflow: hidden;
            box-sizing: border-box;
          }

          .problem-number {
            font-size: 12pt;
            font-weight: 700;
            color: #4b5563;
            min-width: 0.25in;
          }

          .problem-text {
            font-size: 14pt;
            font-weight: 600;
            color: #1f2937;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          .answer-text {
            font-size: 1rem;
            color: #059669;
            font-weight: 600;
            margin-top: 4px;
          }

          .vertical-problem {
            font-family: monospace;
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0 auto;
            max-width: 100px;
          }

          .problem-num {
            text-align: right;
            padding: 2px 4px;
          }

          .problem-op-line {
            display: flex;
            justify-content: space-between;
            padding: 2px 4px;
          }

          .problem-op {
            font-size: 1rem;
            font-weight: 700;
            color: #7c3aed;
          }

          .problem-line {
            border-bottom: 3px solid #1f2937;
            margin: 4px 0;
          }

          .problem-answer {
            text-align: right;
            color: #16a34a;
            font-weight: 700;
            padding: 2px 4px;
          }

          .problem-blank {
            min-height: 30px;
          }

          .flash-card {
            border: 2px dashed #9ca3af;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            background: #fef3c7;
            min-height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .answer-key-box {
            border: 2px solid #d1fae5;
            border-radius: 8px;
            padding: 8px;
            background: #f0fdf4;
            text-align: center;
          }

          .workspace {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed #d1d5db;
          }

          .workspace-lines {
            min-height: 40px;
            background-image: repeating-linear-gradient(
              transparent,
              transparent 18px,
              #e5e7eb 18px,
              #e5e7eb 19px
            );
          }
        }

        @media print {
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          /* Hide non-printable elements */
          nav, footer, .no-print {
            display: none !important;
          }

          body {
            height: auto !important;
            width: 100% !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: Georgia, 'Times New Roman', Times, serif !important;
            font-size: 12pt !important;
            line-height: 1.6 !important;
            color: #000 !important;
            background: white !important;
          }

          @page {
            size: letter;
            margin: 0.5in;
          }

          html, body {
            margin: 0;
            padding: 0;
          }

          /* Prevent awkward line breaks */
          p {
            orphans: 3;
            widows: 3;
          }

          /* Prevent headings from being orphaned */
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            break-after: avoid;
            orphans: 3;
            widows: 3;
          }

          /* Prevent tables and images from splitting */
          table, img, figure {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Clean link printing */
          a {
            text-decoration: underline;
            color: #000 !important;
          }

          a[href]:after {
            content: "";
          }

          .print-content {
            background: white;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }

          .print-page {
            page-break-after: always !important;
            page-break-inside: auto !important;
            break-after: page !important;
            break-inside: auto !important;
            background: white;
            margin: 0 !important;
            padding: 0 !important;
            width: 8.5in;
            min-height: auto !important;
            height: auto !important;
            display: block;
            position: relative;
            overflow: visible !important;
          }

          .print-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }

          .page-container {
            padding: 0.5in !important;
            margin: 0 !important;
            width: 8.5in;
            box-sizing: border-box;
            display: block !important;
            height: auto !important;
            overflow: visible !important;
          }

          /* Problem boxes with serif fonts and better spacing */
          .problem-box, .problem-box-vertical {
            border: 1.5pt solid #000 !important;
            border-radius: 0.05in;
            padding: 0.12in 0.1in !important;
            background: white !important;
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 0.1in;
            min-height: 0.7in;
            font-family: Georgia, 'Times New Roman', Times, serif !important;
            orphans: 3;
            widows: 3;
          }

          /* Use absolute grid spacing */
          .grid {
            gap: 0.12in !important;
            overflow: visible !important;
            page-break-inside: auto !important;
            break-inside: auto !important;
          }

          /* Print-specific header styling with high contrast */
          .worksheet-header {
            background: #000 !important;
            background-image: none !important;
            color: white !important;
            border: 2pt solid #000 !important;
            padding: 0.15in !important;
            margin-bottom: 0.15in !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
            overflow: visible !important;
          }

          .worksheet-header h1 {
            color: white !important;
            font-size: 22pt !important;
            font-weight: 700 !important;
            margin: 0 !important;
            font-family: Georgia, 'Times New Roman', Times, serif !important;
            line-height: 1.4 !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          /* Compact header info with better readability */
          .text-center.mb-6 {
            margin-bottom: 0.2in !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          .text-center.mb-6 .pb-4 {
            padding-bottom: 0.12in !important;
          }

          /* Text in header area - high contrast */
          .text-sm {
            font-size: 11pt !important;
            line-height: 1.5 !important;
            color: #000 !important;
            font-weight: 500 !important;
            orphans: 2;
            widows: 2;
          }

          /* Problem text with serif fonts and optimal sizing */
          .problem-text {
            font-size: 14pt !important;
            font-weight: 600 !important;
            line-height: 1.6 !important;
            color: #000 !important;
            font-family: Georgia, 'Times New Roman', Times, serif !important;
            orphans: 2;
            widows: 2;
          }

          .problem-number {
            font-size: 13pt !important;
            font-weight: 700 !important;
            color: #000 !important;
            line-height: 1.5 !important;
            font-family: Georgia, 'Times New Roman', Times, serif !important;
          }

          /* Answer text with good contrast */
          .answer-text {
            font-size: 13pt !important;
            font-weight: 600 !important;
            color: #000 !important;
            line-height: 1.6 !important;
            orphans: 2;
            widows: 2;
          }

          /* Vertical problem formatting */
          .vertical-problem {
            font-family: 'Courier New', Courier, monospace !important;
            font-size: 14pt !important;
            font-weight: 600 !important;
            line-height: 1.5 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .problem-op {
            font-size: 14pt !important;
            font-weight: 700 !important;
            color: #000 !important;
          }

          .problem-line {
            border-bottom: 2pt solid #000 !important;
          }

          /* Flash cards with clear borders */
          .flash-card {
            border: 2pt dashed #000 !important;
            page-break-inside: avoid;
            break-inside: avoid;
            padding: 0.2in !important;
          }

          .flash-card-front {
            font-size: 18pt !important;
            font-weight: 700 !important;
            line-height: 1.5 !important;
          }

          /* Certificate page */
          .certificate-page {
            page-break-before: always;
            break-before: always;
          }

          /* Answer key styling */
          .answer-key-box {
            border: 1.5pt solid #000 !important;
            background: white !important;
            padding: 0.08in !important;
            font-size: 12pt !important;
            line-height: 1.5 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .answer-key-upside-down {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Remove decorative elements that don't print well */
          .shadow-lg, .shadow-md, .shadow {
            box-shadow: none !important;
          }

          /* Ensure all borders are solid and visible */
          .border-b-2, .border-t-2, .border {
            border-color: #000 !important;
          }

          /* Remove background colors that waste ink */
          .bg-gray-50, .bg-gray-100, .bg-blue-50, .bg-green-50 {
            background: white !important;
          }

          /* Keep only essential decorations visible */
          .text-gray-500, .text-gray-600, .text-gray-700 {
            color: #000 !important;
          }

          /* Workspace lines - clear and visible */
          .workspace {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .workspace-lines {
            background-image: repeating-linear-gradient(
              transparent,
              transparent 0.18in,
              #000 0.18in,
              #000 0.19in
            ) !important;
          }

          /* Score/date fields - high contrast */
          span {
            font-family: Georgia, 'Times New Roman', Times, serif !important;
          }

          /* Motivational footer */
          .mt-6 {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}
