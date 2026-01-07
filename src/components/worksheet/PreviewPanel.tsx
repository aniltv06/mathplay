/**
 * Preview Panel Component
 * Renders worksheet preview with print styles
 */

import { Fragment } from 'react';
import { formatName } from '../../utils/formatters';
import { Problem, WorksheetSettings, ThemeStyles } from './types';
import { renderProblem } from './ProblemRenderers';
import { getGridColumns, getAnswerForProblem, getProblemTextForAnswerKey } from './utils';

interface PreviewPanelProps {
  worksheets: Problem[][];
  settings: WorksheetSettings;
  theme: ThemeStyles;
  profileName: string;
  isGenerating: boolean;
}

export function PreviewPanel({
  worksheets,
  settings,
  theme,
  profileName,
  isGenerating,
}: PreviewPanelProps) {
  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center" role="status" aria-live="polite">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Generating problems...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
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
                      <span className="ml-3 text-2xl" aria-hidden="true">{theme.decoration}</span>
                    )}
                  </h1>
                </div>
                <div className="worksheet-info-row">
                  <span>Name: {formatName(profileName)}</span>
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
              </div>

              {/* Problems Grid */}
              <div
                className="worksheet-grid"
                style={{
                  '--grid-columns': getGridColumns(settings.layout)
                } as React.CSSProperties & { '--grid-columns'?: string }}
                role="list"
                aria-label={`Worksheet ${worksheetIndex + 1} problems`}
              >
                {worksheet.map((problem, problemIndex) => {
                  const globalIndex = worksheetIndex * settings.numProblems + problemIndex;
                  return (
                    <div key={globalIndex} role="listitem">
                      {renderProblem({ problem, index: globalIndex, settings })}
                    </div>
                  );
                })}
              </div>

              {/* Upside Down Answer Key */}
              {settings.answerKeyPosition === 'upside-down' && (
                <div className="answer-key-upside-down border-t-2 border-dashed border-gray-400 mt-8 pt-4">
                  <p className="text-center text-xs text-gray-500 mb-2">✂️ Cut here for answers ✂️</p>
                  <div className="transform rotate-180" aria-label="Answer key (upside down)">
                    <h3 className="text-center font-bold mb-2">Answer Key</h3>
                    <div
                      className="worksheet-grid"
                      style={{
                        '--grid-columns': 'repeat(10, 1fr)',
                        fontSize: '0.75rem',
                        lineHeight: '1rem',
                        gap: '1rem',
                        rowGap: '0.75rem'
                      } as React.CSSProperties & { '--grid-columns'?: string }}
                    >
                      {worksheet.map((problem, index) => (
                        <span key={index}>
                          {index + 1}. {getAnswerForProblem(problem)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Separate Answer Key Page */}
          {settings.answerKeyPosition === 'separate' && (
            <div className="print-page">
              <div className="page-container">
                <div className="text-center mb-6 pb-4 border-b-4 border-green-600">
                  <h1 className="text-3xl font-bold text-green-700">
                    ✅ Answer Key
                    {settings.numWorksheets > 1 && ` - Worksheet ${worksheetIndex + 1}`}
                  </h1>
                </div>
                <div
                  className="worksheet-grid"
                  style={{
                    '--grid-columns': 'repeat(5, 1fr)',
                    gap: '0.75rem'
                  } as React.CSSProperties & { '--grid-columns'?: string }}
                  role="list"
                  aria-label="Answer key"
                >
                  {worksheet.map((problem, index) => (
                    <div key={index} className="answer-key-box" role="listitem">
                      <div className="text-xs text-gray-600 mb-1">#{index + 1}</div>
                      <div className="text-sm font-mono text-gray-700">
                        {getProblemTextForAnswerKey(problem)}
                      </div>
                      <div className="text-xl font-bold text-green-600 mt-1">
                        = {getAnswerForProblem(problem)}
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
              <p className="text-4xl font-bold text-blue-600 mb-4">{formatName(profileName)}</p>
              <p className="text-2xl mb-6">has successfully completed</p>
              <p className="text-3xl font-bold text-purple-600 mb-6">{settings.worksheetTitle}</p>
              <p className="text-xl text-gray-600 mb-8">
                {worksheets.reduce((sum, ws) => sum + ws.length, 0)} problems solved with dedication!
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
  );
}
