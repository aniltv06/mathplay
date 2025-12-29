/**
 * Enhanced Printable Worksheet Component
 * Professional print layouts with customization options
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState } from 'react';
import { X, Printer, Download, Settings, Eye, EyeOff } from 'lucide-react';
import type { Problem, ProblemSettings } from '../types';
import { numberToWord, getOperationWord } from '../utils/problemVariants';

interface Props {
  problems: Problem[];
  settings: ProblemSettings;
  profileName: string;
  onClose: () => void;
  onSettingsChange?: (newSettings: ProblemSettings) => void;
}

type LayoutType = 'standard' | 'vertical' | 'two-column' | 'flashcards' | 'word-problems';
type ThemeType = 'clean' | 'colorful' | 'minimal' | 'kid-friendly';

export function PrintableWorksheetEnhanced({ problems, settings, profileName, onClose, onSettingsChange }: Props) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [layout, setLayout] = useState<LayoutType>('standard');
  const [theme, setTheme] = useState<ThemeType>('clean');
  const [showSettings, setShowSettings] = useState(false);
  const [includeWorkSpace, setIncludeWorkSpace] = useState(false);
  const [includeScoreSection, setIncludeScoreSection] = useState(true);
  const [customTitle, setCustomTitle] = useState('Math Worksheet');
  const [schoolName, setSchoolName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');

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

  const getThemeClasses = () => {
    switch (theme) {
      case 'colorful':
        return 'bg-gradient-to-br from-blue-50 to-purple-50';
      case 'minimal':
        return 'bg-white';
      case 'kid-friendly':
        return 'bg-yellow-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return 'text-xl'; // for problems
      case 'large':
        return 'text-3xl'; // for problems
      default:
        return 'text-2xl'; // medium
    }
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      default:
        return 'font-sans';
    }
  };

  const renderStandardLayout = () => {
    const problemsPerRow = 2;
    const rowsPerPage = 9; // Increased from 3 to fit more on a page
    const problemsPerPage = problemsPerRow * rowsPerPage;

    const rows = [];
    for (let i = 0; i < problems.length; i += problemsPerRow) {
      const rowProblems = problems.slice(i, i + problemsPerRow);
      const rowIndex = Math.floor(i / problemsPerRow);
      const shouldBreakAfter = (rowIndex + 1) % rowsPerPage === 0 && i + problemsPerRow < problems.length;

      rows.push(
        <tr key={`row-${i}`} className={shouldBreakAfter ? 'page-break-after-row' : ''}>
          {rowProblems.map((problem, colIndex) => {
            const globalIndex = i + colIndex;
            return (
              <td key={globalIndex} style={{ width: '50%', padding: '8px', verticalAlign: 'top' }}>
                <div
                  className={`border-2 rounded-lg p-4 ${
                    theme === 'colorful' ? 'border-purple-300 bg-white' :
                    theme === 'kid-friendly' ? 'border-yellow-400 bg-white' :
                    'border-gray-300 bg-gray-50'
                  }`}
                  style={{ pageBreakInside: 'avoid' }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg font-bold text-gray-600" style={{ minWidth: '2rem' }}>
                      {globalIndex + 1}.
                    </span>
                    <div style={{ flex: 1 }}>
                      <div className={`${getFontSizeClass()} ${getFontFamilyClass()} text-gray-800 mb-2`}>
                        {problem.num1} {problem.operation} {problem.num2} = _____
                      </div>
                      {includeWorkSpace && !showAnswers && (
                        <div className="mt-3 border-t border-dashed border-gray-300 pt-3" style={{ minHeight: '40px' }}>
                          <p className="text-xs text-gray-400">Show your work:</p>
                        </div>
                      )}
                      {showAnswers && (
                        <div className="text-lg text-green-600 font-bold">
                          Answer: {problem.correct}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </td>
            );
          })}
          {/* Fill empty cells if odd number of problems in last row */}
          {rowProblems.length < problemsPerRow && (
            <td style={{ width: '50%', padding: '8px' }}></td>
          )}
        </tr>
      );
    }

    return (
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  const renderVerticalLayout = () => {
    const problemsPerRow = 4;
    const rowsPerPage = 9; // 4 columns x 9 rows = 36 per page

    const rows = [];
    for (let i = 0; i < problems.length; i += problemsPerRow) {
      const rowProblems = problems.slice(i, i + problemsPerRow);
      const rowIndex = Math.floor(i / problemsPerRow);
      const shouldBreakAfter = (rowIndex + 1) % rowsPerPage === 0 && i + problemsPerRow < problems.length;

      rows.push(
        <tr key={`row-${i}`} className={shouldBreakAfter ? 'page-break-after-row' : ''}>
          {rowProblems.map((problem, colIndex) => {
            const globalIndex = i + colIndex;
            return (
              <td key={globalIndex} style={{ width: '25%', padding: '8px', verticalAlign: 'top' }}>
                <div
                  className={`border-2 rounded-lg p-4 ${
                    theme === 'colorful' ? 'border-blue-300 bg-white' :
                    theme === 'kid-friendly' ? 'border-orange-400 bg-white' :
                    'border-gray-300 bg-white'
                  }`}
                  style={{ pageBreakInside: 'avoid' }}
                >
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-600 mb-3">#{globalIndex + 1}</div>
                    <div className="text-right space-y-1 font-mono text-xl mb-3">
                      <div className="text-gray-800">{problem.num1}</div>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-purple-600 font-bold">{problem.operation}</span>
                        <span className="text-gray-800">{problem.num2}</span>
                      </div>
                      <div className="border-t-2 border-gray-800 pt-1">
                        {showAnswers ? (
                          <span className="text-green-600 font-bold">{problem.correct}</span>
                        ) : (
                          <span className="text-transparent">___</span>
                        )}
                      </div>
                    </div>
                    {includeWorkSpace && !showAnswers && (
                      <div className="border-t border-dashed border-gray-300 pt-2" style={{ minHeight: '30px' }}>
                        <p className="text-xs text-gray-400">Work</p>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            );
          })}
          {/* Fill empty cells */}
          {Array.from({ length: problemsPerRow - rowProblems.length }).map((_, idx) => (
            <td key={`empty-${idx}`} style={{ width: '25%', padding: '8px' }}></td>
          ))}
        </tr>
      );
    }

    return (
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  const renderTwoColumnLayout = () => {
    const problemsPerRow = 2;
    const rowsPerPage = 20; // Compact layout: 2 columns x 20 rows = 40 per page

    const rows = [];
    for (let i = 0; i < problems.length; i += problemsPerRow) {
      const rowProblems = problems.slice(i, i + problemsPerRow);
      const rowIndex = Math.floor(i / problemsPerRow);
      const shouldBreakAfter = (rowIndex + 1) % rowsPerPage === 0 && i + problemsPerRow < problems.length;

      rows.push(
        <tr key={`row-${i}`} className={shouldBreakAfter ? 'page-break-after-row' : ''}>
          {rowProblems.map((problem, colIndex) => {
            const globalIndex = i + colIndex;
            return (
              <td key={globalIndex} style={{ width: '50%', padding: '4px 12px', verticalAlign: 'top' }}>
                <div className="flex items-start gap-3 py-2 border-b border-gray-300" style={{ pageBreakInside: 'avoid' }}>
                  <span className="text-lg font-bold text-gray-600" style={{ minWidth: '2.5rem' }}>
                    {globalIndex + 1}.
                  </span>
                  <div style={{ flex: 1 }}>
                    <div className="text-xl font-mono">
                      {problem.num1} {problem.operation} {problem.num2} = {
                        showAnswers ? (
                          <span className="text-green-600 font-bold">{problem.correct}</span>
                        ) : (
                          <span className="inline-block border-b-2 border-gray-800" style={{ minWidth: '60px', marginLeft: '8px' }}></span>
                        )
                      }
                    </div>
                  </div>
                </div>
              </td>
            );
          })}
          {/* Fill empty cells */}
          {rowProblems.length < problemsPerRow && (
            <td style={{ width: '50%', padding: '4px 12px' }}></td>
          )}
        </tr>
      );
    }

    return (
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  const renderFlashcardsLayout = () => {
    const problemsPerRow = 4;
    const rowsPerPage = 9; // 4 columns x 9 rows = 36 per page

    const rows = [];
    for (let i = 0; i < problems.length; i += problemsPerRow) {
      const rowProblems = problems.slice(i, i + problemsPerRow);
      const rowIndex = Math.floor(i / problemsPerRow);
      const shouldBreakAfter = (rowIndex + 1) % rowsPerPage === 0 && i + problemsPerRow < problems.length;

      rows.push(
        <tr key={`row-${i}`} className={shouldBreakAfter ? 'page-break-after-row' : ''}>
          {rowProblems.map((problem, colIndex) => {
            const globalIndex = i + colIndex;
            return (
              <td key={globalIndex} style={{ width: '25%', padding: '8px', verticalAlign: 'top' }}>
                <div
                  className={`border-4 rounded-2xl p-4 text-center ${
                    theme === 'colorful' ? 'border-purple-400 bg-gradient-to-br from-purple-100 to-pink-100' :
                    theme === 'kid-friendly' ? 'border-yellow-500 bg-yellow-100' :
                    'border-gray-400 bg-white'
                  }`}
                  style={{ pageBreakInside: 'avoid' }}
                >
                  <div className="text-xs font-bold text-gray-500 mb-2">#{globalIndex + 1}</div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {problem.num1}
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {problem.operation}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-3">
                    {problem.num2}
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {showAnswers ? (
                      <span className="text-green-600">{problem.correct}</span>
                    ) : (
                      '?'
                    )}
                  </div>
                </div>
              </td>
            );
          })}
          {/* Fill empty cells */}
          {Array.from({ length: problemsPerRow - rowProblems.length }).map((_, idx) => (
            <td key={`empty-${idx}`} style={{ width: '25%', padding: '8px' }}></td>
          ))}
        </tr>
      );
    }

    return (
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  const renderWordProblemsLayout = () => {
    const problemsPerPage = 6; // 6 word problems per page

    const storyTemplates: Record<string, (n1: number, n2: number) => string> = {
      '+': (n1, n2) => `You have ${n1} apples. Your friend gives you ${n2} more apples. How many apples do you have now?`,
      '-': (n1, n2) => `You have ${n1} candies. You give ${n2} candies to your friend. How many candies do you have left?`,
      '×': (n1, n2) => `There are ${n1} boxes. Each box has ${n2} toys. How many toys are there in total?`,
      '÷': (n1, n2) => `You have ${n1} cookies to share equally among ${n2} friends. How many cookies does each friend get?`
    };

    const rows = [];
    for (let i = 0; i < problems.length; i++) {
      const problem = problems[i];
      const story = storyTemplates[problem.operation](problem.num1, problem.num2);
      const shouldBreakAfter = (i + 1) % problemsPerPage === 0 && i + 1 < problems.length;

      rows.push(
        <tr key={`row-${i}`} className={shouldBreakAfter ? 'page-break-after-row' : ''}>
          <td style={{ padding: '12px 0', verticalAlign: 'top' }}>
            <div
              className={`border-2 rounded-lg p-6 ${
                theme === 'colorful' ? 'border-blue-300 bg-blue-50' :
                theme === 'kid-friendly' ? 'border-green-400 bg-green-50' :
                'border-gray-300 bg-white'
              }`}
              style={{ pageBreakInside: 'avoid' }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl font-bold text-gray-600" style={{ minWidth: '2.5rem' }}>
                  {i + 1}.
                </span>
                <div style={{ flex: 1 }}>
                  <p className="text-lg text-gray-800 mb-4 leading-relaxed">{story}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-gray-700">Answer:</span>
                    {showAnswers ? (
                      <span className="text-xl font-bold text-green-600">{problem.correct}</span>
                    ) : (
                      <span className="inline-block border-b-2 border-gray-800" style={{ minWidth: '80px' }}></span>
                    )}
                  </div>
                  {includeWorkSpace && !showAnswers && (
                    <div className="mt-4 border-t border-dashed border-gray-300 pt-3">
                      <p className="text-sm text-gray-500 mb-2">Show your work:</p>
                      <div style={{ minHeight: '60px' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  const renderLayout = () => {
    switch (layout) {
      case 'vertical':
        return renderVerticalLayout();
      case 'two-column':
        return renderTwoColumnLayout();
      case 'flashcards':
        return renderFlashcardsLayout();
      case 'word-problems':
        return renderWordProblemsLayout();
      default:
        return renderStandardLayout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Print Controls */}
      <div className="no-print sticky top-0 z-10 bg-white border-b-2 border-gray-200 p-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-gray-800">Print Worksheet</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
              >
                <Settings className="w-5 h-5" />
                Options
              </button>
              <button
                onClick={handlePrint}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Layout */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Layout</label>
                  <select
                    value={layout}
                    onChange={(e) => setLayout(e.target.value as LayoutType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="standard">Standard</option>
                    <option value="vertical">Vertical</option>
                    <option value="two-column">Two Column</option>
                    <option value="flashcards">Flashcards</option>
                    <option value="word-problems">Word Problems</option>
                  </select>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as ThemeType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="clean">Clean</option>
                    <option value="colorful">Colorful</option>
                    <option value="minimal">Minimal</option>
                    <option value="kid-friendly">Kid Friendly</option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Font Size</label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                {/* Font Family */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Font Style</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value as 'sans' | 'serif' | 'mono')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="sans">Sans Serif</option>
                    <option value="serif">Serif</option>
                    <option value="mono">Monospace</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {/* Custom Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* School Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">School (optional)</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="School name"
                  />
                </div>
              </div>

              {/* Problem Settings */}
              {onSettingsChange && (
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Problem Settings:</h3>

                  {/* Number of Problems */}
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold text-gray-700 min-w-[120px]">Problems:</label>
                    <select
                      value={settings.numProblems}
                      onChange={(e) => {
                        const newSettings = { ...settings, numProblems: Number(e.target.value) };
                        onSettingsChange(newSettings);
                      }}
                      className="px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-white"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={25}>25</option>
                      <option value={30}>30</option>
                      <option value={40}>40</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  {/* Operations */}
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold text-gray-700 min-w-[120px]">Operations:</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // Prevent disabling if it's the only operation selected
                          const totalSelected = [settings.includeAddition, settings.includeSubtraction, settings.includeMultiplication, settings.includeDivision].filter(Boolean).length;
                          if (totalSelected === 1 && settings.includeAddition) return;

                          const newSettings = { ...settings, includeAddition: !settings.includeAddition };
                          onSettingsChange(newSettings);
                        }}
                        className={`w-10 h-10 rounded-lg font-bold text-xl transition-all ${
                          settings.includeAddition
                            ? 'bg-green-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                        }`}
                        title="Addition"
                      >
                        +
                      </button>
                      <button
                        onClick={() => {
                          // Prevent disabling if it's the only operation selected
                          const totalSelected = [settings.includeAddition, settings.includeSubtraction, settings.includeMultiplication, settings.includeDivision].filter(Boolean).length;
                          if (totalSelected === 1 && settings.includeSubtraction) return;

                          const newSettings = { ...settings, includeSubtraction: !settings.includeSubtraction };
                          onSettingsChange(newSettings);
                        }}
                        className={`w-10 h-10 rounded-lg font-bold text-xl transition-all ${
                          settings.includeSubtraction
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                        }`}
                        title="Subtraction"
                      >
                        −
                      </button>
                      <button
                        onClick={() => {
                          // Prevent disabling if it's the only operation selected
                          const totalSelected = [settings.includeAddition, settings.includeSubtraction, settings.includeMultiplication, settings.includeDivision].filter(Boolean).length;
                          if (totalSelected === 1 && settings.includeMultiplication) return;

                          const newSettings = { ...settings, includeMultiplication: !settings.includeMultiplication };
                          onSettingsChange(newSettings);
                        }}
                        className={`w-10 h-10 rounded-lg font-bold text-xl transition-all ${
                          settings.includeMultiplication
                            ? 'bg-purple-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                        }`}
                        title="Multiplication"
                      >
                        ×
                      </button>
                      <button
                        onClick={() => {
                          // Prevent disabling if it's the only operation selected
                          const totalSelected = [settings.includeAddition, settings.includeSubtraction, settings.includeMultiplication, settings.includeDivision].filter(Boolean).length;
                          if (totalSelected === 1 && settings.includeDivision) return;

                          const newSettings = { ...settings, includeDivision: !settings.includeDivision };
                          onSettingsChange(newSettings);
                        }}
                        className={`w-10 h-10 rounded-lg font-bold text-xl transition-all ${
                          settings.includeDivision
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                        }`}
                        title="Division"
                      >
                        ÷
                      </button>
                    </div>
                  </div>

                  {/* Number Range */}
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold text-gray-700 min-w-[120px]">Range:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="999"
                        value={settings.minNum}
                        onChange={(e) => {
                          const newSettings = { ...settings, minNum: Number(e.target.value) };
                          onSettingsChange(newSettings);
                        }}
                        className="w-20 px-2 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-white text-center"
                        placeholder="Min"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="number"
                        min="1"
                        max="999"
                        value={settings.maxNum}
                        onChange={(e) => {
                          const newSettings = { ...settings, maxNum: Number(e.target.value) };
                          onSettingsChange(newSettings);
                        }}
                        className="w-20 px-2 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-white text-center"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Checkboxes */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAnswers}
                    onChange={(e) => setShowAnswers(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  Show Answers
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeWorkSpace}
                    onChange={(e) => setIncludeWorkSpace(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  Work Space
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeScoreSection}
                    onChange={(e) => setIncludeScoreSection(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  Score Section
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Printable Content */}
      <div className={`print-content max-w-6xl mx-auto p-8 ${getThemeClasses()}`}>
        {/* Header */}
        <div className={`text-center mb-8 pb-6 ${
          theme === 'colorful' ? 'border-b-4 border-purple-400' :
          theme === 'kid-friendly' ? 'border-b-4 border-yellow-500' :
          'border-b-2 border-gray-300'
        }`}>
          {schoolName && (
            <div className="text-sm font-semibold text-gray-600 mb-2">{schoolName}</div>
          )}
          <h1 className={`text-4xl font-bold ${
            theme === 'colorful' ? 'text-purple-600' :
            theme === 'kid-friendly' ? 'text-yellow-700' :
            'text-gray-800'
          }`}>
            {customTitle}
          </h1>
          {includeScoreSection && (
            <div className="mt-4 flex justify-center gap-8 text-sm">
              <span>Score: _____ / {problems.length}</span>
              <span>Time: _____ minutes</span>
              <span>Grade: _____</span>
            </div>
          )}
        </div>

        {/* Problems */}
        {renderLayout()}

        {/* Answer Key (separate page) */}
        {showAnswers && (
          <div className="page-break mt-12 pt-12 border-t-4 border-gray-400">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Answer Key
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className="border-2 border-green-300 rounded-lg p-3 bg-green-50 text-center"
                >
                  <div className="text-xs text-gray-600 mb-1">#{index + 1}</div>
                  <div className="text-sm font-mono">
                    {problem.num1} {problem.operation} {problem.num2}
                  </div>
                  <div className="text-xl font-bold text-green-600 mt-1">
                    {problem.correct}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }

          /* Table row page breaks */
          .page-break-after-row {
            page-break-after: always !important;
            break-after: page !important;
          }

          /* Prevent breaks inside table cells and problem containers */
          td {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          table {
            page-break-inside: auto !important;
          }

          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Legacy page break class for answer key */
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          @page {
            margin: 1cm;
            size: auto;
          }

          /* Ensure the main container doesn't constrain pagination */
          .print-content {
            max-width: 100% !important;
            padding: 0.5cm !important;
          }
        }
      `}</style>
    </div>
  );
}
