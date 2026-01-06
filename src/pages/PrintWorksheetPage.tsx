/**
 * Print Worksheet Page - Complete Rewrite
 * Simple, clean interface with all controls in sticky header
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Printer } from 'lucide-react';
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
}

export function PrintWorksheetPage({ onBack, profileId }: Props) {
  const { getProfile } = useProfiles();
  const profile = getProfile(profileId);

  // Configuration State
  const [numProblems, setNumProblems] = useState(20);
  const [minNumber, setMinNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(20);
  const [includeAddition, setIncludeAddition] = useState(true);
  const [includeSubtraction, setIncludeSubtraction] = useState(true);
  const [includeMultiplication, setIncludeMultiplication] = useState(true);
  const [includeDivision, setIncludeDivision] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [includeWorkspace, setIncludeWorkspace] = useState(false);
  const [worksheetTitle, setWorksheetTitle] = useState('Math Worksheet');
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [problems, setProblems] = useState<Problem[]>([]);

  // Generate problems
  const generateProblems = () => {
    const operations: Operation[] = [];
    if (includeAddition) operations.push('+');
    if (includeSubtraction) operations.push('-');
    if (includeMultiplication) operations.push('×');
    if (includeDivision) operations.push('÷');

    if (operations.length === 0) {
      alert('Please select at least one operation type');
      return;
    }

    const newProblems: Problem[] = [];
    const usedProblems = new Set<string>();

    let attempts = 0;
    const maxAttempts = numProblems * 20;

    while (newProblems.length < numProblems && attempts < maxAttempts) {
      attempts++;

      const operation = operations[Math.floor(Math.random() * operations.length)];
      let num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      let num2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      let answer: number;

      switch (operation) {
        case '+':
          answer = num1 + num2;
          break;
        case '-':
          // Ensure positive result
          if (num1 < num2) [num1, num2] = [num2, num1];
          answer = num1 - num2;
          break;
        case '×':
          answer = num1 * num2;
          break;
        case '÷':
          // Ensure whole number division
          const divisor = num2 === 0 ? 1 : num2;
          const quotient = num1;
          num1 = quotient * divisor;
          num2 = divisor;
          answer = quotient;
          break;
        default:
          continue;
      }

      // Check for duplicates using a unique key with delimiters
      // This ensures no false matches (e.g., "12+3" vs "1+23")
      const problemKey = `${num1}|${operation}|${num2}`;
      if (!usedProblems.has(problemKey)) {
        usedProblems.add(problemKey);
        newProblems.push({ num1, num2, operation, answer });
      }
    }

    // Final verification: Remove any duplicates that might have slipped through
    const finalProblems: Problem[] = [];
    const finalKeys = new Set<string>();

    for (const problem of newProblems) {
      const key = `${problem.num1}|${problem.operation}|${problem.num2}`;
      if (!finalKeys.has(key)) {
        finalKeys.add(key);
        finalProblems.push(problem);
      }
    }

    setProblems(finalProblems);
  };

  // Generate initial problems
  useEffect(() => {
    generateProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const toggleOperation = (operation: 'addition' | 'subtraction' | 'multiplication' | 'division') => {
    // Prevent disabling if it's the only operation selected
    const totalSelected = [includeAddition, includeSubtraction, includeMultiplication, includeDivision].filter(Boolean).length;

    if (operation === 'addition' && totalSelected === 1 && includeAddition) return;
    if (operation === 'subtraction' && totalSelected === 1 && includeSubtraction) return;
    if (operation === 'multiplication' && totalSelected === 1 && includeMultiplication) return;
    if (operation === 'division' && totalSelected === 1 && includeDivision) return;

    switch (operation) {
      case 'addition':
        setIncludeAddition(!includeAddition);
        break;
      case 'subtraction':
        setIncludeSubtraction(!includeSubtraction);
        break;
      case 'multiplication':
        setIncludeMultiplication(!includeMultiplication);
        break;
      case 'division':
        setIncludeDivision(!includeDivision);
        break;
    }
  };

  // Split problems into pages based on layout
  const problemsPerPage = layout === 'vertical' ? 36 : 18; // Vertical: 4x9, Horizontal: 2x9
  const columnsPerPage = layout === 'vertical' ? 4 : 2;
  const pages: Problem[][] = [];
  for (let i = 0; i < problems.length; i += problemsPerPage) {
    pages.push(problems.slice(i, i + problemsPerPage));
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Controls Header - Hidden in Print */}
      <div className="no-print sticky top-0 z-50 bg-white border-b-2 border-gray-300 shadow-lg">
        <div className="max-w-7xl mx-auto p-4">
          {/* Top Row: Title and Action Buttons */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Print Worksheets</h1>
                <p className="text-sm text-gray-600">
                  {problems.length} problems • {pages.length} page{pages.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generateProblems}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                New Problems
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

          {/* Configuration Controls */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            {/* Row 1: Number of Problems and Range */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Problems:</label>
                <select
                  value={numProblems}
                  onChange={(e) => setNumProblems(Number(e.target.value))}
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={150}>150</option>
                  <option value={200}>200</option>
                  <option value={250}>250</option>
                  <option value={300}>300</option>
                  <option value={400}>400</option>
                  <option value={500}>500</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Number Range:</label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={minNumber}
                  onChange={(e) => setMinNumber(Number(e.target.value))}
                  className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-center focus:border-blue-500 focus:outline-none"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={maxNumber}
                  onChange={(e) => setMaxNumber(Number(e.target.value))}
                  className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-center focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Title:</label>
                <input
                  type="text"
                  value={worksheetTitle}
                  onChange={(e) => setWorksheetTitle(e.target.value)}
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:outline-none"
                  placeholder="Worksheet title"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Layout:</label>
                <select
                  value={layout}
                  onChange={(e) => setLayout(e.target.value as 'horizontal' | 'vertical')}
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>
            </div>

            {/* Row 2: Operations */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700">Operations:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleOperation('addition')}
                  className={`w-12 h-12 rounded-lg font-bold text-2xl transition-all ${
                    includeAddition
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                  title="Addition"
                >
                  +
                </button>
                <button
                  onClick={() => toggleOperation('subtraction')}
                  className={`w-12 h-12 rounded-lg font-bold text-2xl transition-all ${
                    includeSubtraction
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                  title="Subtraction"
                >
                  −
                </button>
                <button
                  onClick={() => toggleOperation('multiplication')}
                  className={`w-12 h-12 rounded-lg font-bold text-2xl transition-all ${
                    includeMultiplication
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                  title="Multiplication"
                >
                  ×
                </button>
                <button
                  onClick={() => toggleOperation('division')}
                  className={`w-12 h-12 rounded-lg font-bold text-2xl transition-all ${
                    includeDivision
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                  title="Division"
                >
                  ÷
                </button>
              </div>
            </div>

            {/* Row 3: Display Options */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAnswers}
                  onChange={(e) => setShowAnswers(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                Show Answer Key
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeWorkspace}
                  onChange={(e) => setIncludeWorkspace(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                Include Workspace
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Worksheet Pages */}
      <div className="print-content">
        {pages.map((pageProblems, pageIndex) => (
          <div key={pageIndex} className="print-page">
            <div className="page-container">
              {/* Page Header */}
              <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {worksheetTitle}
                </h1>
                <div className="text-sm text-gray-600 space-x-6">
                  <span>Name: {formatName(profile.name)}</span>
                  <span>Date: __________</span>
                  <span>Score: _____ / {problems.length}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Page {pageIndex + 1} of {pages.length}
                </div>
              </div>

              {/* Problems Grid - Dynamic columns based on layout */}
              <div className={`grid ${layout === 'vertical' ? 'grid-cols-4' : 'grid-cols-2'} gap-6`}>
                {pageProblems.map((problem, index) => {
                  const globalIndex = pageIndex * problemsPerPage + index;
                  return (
                    <div key={globalIndex} className="problem-box">
                      {layout === 'horizontal' ? (
                        // Horizontal Layout
                        <div className="flex items-start gap-3">
                          <span className="problem-number">{globalIndex + 1}.</span>
                          <div className="flex-1">
                            <div className="problem-text">
                              {problem.num1} {problem.operation} {problem.num2} = _______
                            </div>
                            {includeWorkspace && (
                              <div className="workspace">
                                <p className="text-xs text-gray-400 mb-1">Show your work:</p>
                                <div className="workspace-lines"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        // Vertical Layout
                        <div className="text-center">
                          <div className="text-xs text-gray-600 mb-2">#{globalIndex + 1}</div>
                          <div className="vertical-problem">
                            <div className="problem-num">{problem.num1}</div>
                            <div className="problem-op-line">
                              <span className="problem-op">{problem.operation}</span>
                              <span className="problem-num">{problem.num2}</span>
                            </div>
                            <div className="problem-line"></div>
                            {showAnswers ? (
                              <div className="problem-answer">{problem.answer}</div>
                            ) : (
                              <div className="problem-blank"></div>
                            )}
                          </div>
                          {includeWorkspace && !showAnswers && (
                            <div className="workspace-vertical">
                              <p className="text-xs text-gray-400">Work</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Answer Key Page (if enabled) */}
        {showAnswers && (
          <div className="print-page">
            <div className="page-container">
              <div className="text-center mb-8 pb-6 border-b-4 border-green-600">
                <h1 className="text-4xl font-bold text-green-700">Answer Key</h1>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {problems.map((problem, index) => (
                  <div key={index} className="answer-box">
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
      </div>

      {/* Styles */}
      <style>{`
        /* Screen Styles */
        @media screen {
          .print-content {
            background: #e5e7eb;
            padding: 20px;
            min-height: calc(100vh - 200px);
          }

          .print-page {
            background: white;
            margin: 0 auto 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 21cm;
            min-height: 29.7cm;
          }

          .page-container {
            padding: 2cm 1.5cm;
          }

          .problem-box {
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            background: #f9fafb;
            page-break-inside: avoid;
          }

          .problem-number {
            font-size: 1.125rem;
            font-weight: 700;
            color: #4b5563;
            min-width: 2rem;
          }

          .problem-text {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
          }

          .workspace {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px dashed #d1d5db;
          }

          .workspace-lines {
            min-height: 60px;
            background-image: repeating-linear-gradient(
              transparent,
              transparent 24px,
              #e5e7eb 24px,
              #e5e7eb 25px
            );
          }

          .answer-box {
            border: 2px solid #d1fae5;
            border-radius: 8px;
            padding: 12px;
            background: #f0fdf4;
            text-align: center;
          }

          /* Vertical Problem Styles */
          .vertical-problem {
            font-family: monospace;
            font-size: 1.5rem;
            font-weight: 600;
            color: #1f2937;
            margin: 0 auto;
            max-width: 120px;
          }

          .problem-num {
            text-align: right;
            padding: 4px 8px;
          }

          .problem-op-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 8px;
          }

          .problem-op {
            font-size: 1.25rem;
            font-weight: 700;
            color: #7c3aed;
          }

          .problem-line {
            border-bottom: 3px solid #1f2937;
            margin: 8px 0;
          }

          .problem-answer {
            text-align: right;
            color: #16a34a;
            font-weight: 700;
            padding: 4px 8px;
          }

          .problem-blank {
            min-height: 36px;
          }

          .workspace-vertical {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed #d1d5db;
            min-height: 40px;
          }
        }

        /* Print Styles */
        @media print {
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
          }

          .no-print {
            display: none !important;
          }

          @page {
            size: A4 portrait;
            margin: 1.5cm 1cm;
          }

          @page :first {
            margin-top: 1cm;
          }

          .print-content {
            background: white;
            padding: 0 !important;
            margin: 0 !important;
          }

          .print-page {
            page-break-after: always;
            page-break-inside: avoid;
            background: white;
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            display: block;
          }

          .print-page:first-child {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }

          .print-page:last-child {
            page-break-after: auto;
          }

          .page-container {
            padding: 0 !important;
            margin: 0 !important;
            width: 100%;
          }

          .problem-box {
            border: 1px solid #333;
            border-radius: 4px;
            padding: 12px;
            background: white;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .problem-number {
            font-size: 1rem;
            font-weight: 700;
            color: #000;
            min-width: 1.5rem;
          }

          .problem-text {
            font-size: 1.25rem;
            font-weight: 600;
            color: #000;
            margin-bottom: 8px;
          }

          .workspace {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px dashed #666;
          }

          .workspace-lines {
            min-height: 50px;
            background-image: repeating-linear-gradient(
              transparent,
              transparent 20px,
              #999 20px,
              #999 21px
            );
          }

          .answer-box {
            border: 1px solid #22c55e;
            border-radius: 4px;
            padding: 8px;
            background: white;
            text-align: center;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Vertical Problem Styles for Print */
          .vertical-problem {
            font-family: monospace;
            font-size: 1.25rem;
            font-weight: 600;
            color: #000;
            margin: 0 auto;
            max-width: 100px;
          }

          .problem-num {
            text-align: right;
            padding: 2px 6px;
          }

          .problem-op-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2px 6px;
          }

          .problem-op {
            font-size: 1rem;
            font-weight: 700;
            color: #000;
          }

          .problem-line {
            border-bottom: 2px solid #000;
            margin: 6px 0;
          }

          .problem-answer {
            text-align: right;
            color: #000;
            font-weight: 700;
            padding: 2px 6px;
          }

          .problem-blank {
            min-height: 30px;
          }

          .workspace-vertical {
            margin-top: 6px;
            padding-top: 6px;
            border-top: 1px dashed #666;
            min-height: 30px;
          }

          /* Ensure grid stays intact */
          .grid {
            display: grid !important;
          }

          /* Prevent orphaned problems */
          .grid > div {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
