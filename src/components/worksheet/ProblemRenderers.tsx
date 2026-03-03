/**
 * Problem Renderers Component
 * Handles rendering different problem types (horizontal, vertical, flash cards)
 */

import React from 'react';
import { Problem, WorksheetSettings } from './types';

interface ProblemRenderProps {
  problem: Problem;
  index: number;
  settings: WorksheetSettings;
}

export function renderHorizontalProblem({ problem, index, settings }: ProblemRenderProps) {
  const showAnswer = settings.answerKeyPosition === 'side-by-side';

  if (problem.type === 'fill-blank') {
    const blank = '____';
    const num1Str = problem.blankPosition === 'num1' ? blank : problem.num1;
    const num2Str = problem.blankPosition === 'num2' ? blank : problem.num2;
    const answerStr = problem.blankPosition === 'answer' ? blank : problem.answer;

    return (
      <div key={index} className="problem-box">
        <div className="flex items-start gap-3" style={{ minWidth: 0 }}>
          <span className="problem-number">{index + 1}.</span>
          <div className="problem-text-wrapper">
            <div className="problem-text" aria-label={`Problem ${index + 1}: Fill in the blank`}>
              {num1Str} {problem.operation} {num2Str} = {answerStr}
            </div>
            {showAnswer && (
              <div className="answer-text" aria-label={`Answer: ${problem.answer}`}>
                Answer: {problem.answer}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (problem.type === 'compare') {
    const value1 = problem.num1;
    const value2 = problem.num2;
    const correctAnswer = value1 > value2 ? '>' : value1 < value2 ? '<' : '=';

    return (
      <div key={index} className="problem-box">
        <div className="flex items-start gap-3" style={{ minWidth: 0 }}>
          <span className="problem-number">{index + 1}.</span>
          <div className="problem-text-wrapper">
            <div className="problem-text" aria-label={`Problem ${index + 1}: Compare ${value1} and ${value2}`}>
              {value1} ____ {value2} {'(<, >, =)'}
            </div>
            {showAnswer && (
              <div className="answer-text" aria-label={`Answer: ${correctAnswer}`}>
                Answer: {correctAnswer}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (problem.type === 'missing-op') {
    return (
      <div key={index} className="problem-box">
        <div className="flex items-start gap-3" style={{ minWidth: 0 }}>
          <span className="problem-number">{index + 1}.</span>
          <div className="problem-text-wrapper">
            <div className="problem-text" aria-label={`Problem ${index + 1}: Find the missing operator`}>
              {problem.num1} ____ {problem.num2} = {problem.answer}
            </div>
            {showAnswer && (
              <div className="answer-text" aria-label={`Answer: ${problem.operation}`}>
                Answer: {problem.operation}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={index} className="problem-box">
      <div className="flex items-start gap-3" style={{ minWidth: 0, width: '100%' }}>
        <span className="problem-number">{index + 1}.</span>
        <div className="problem-text-wrapper">
          <div className="problem-text" aria-label={`Problem ${index + 1}: ${problem.num1} ${problem.operation} ${problem.num2}`}>
            {problem.num1} {problem.operation} {problem.num2} ={' '}
            {showAnswer ? problem.answer : <span className="answer-blank" aria-label="answer line" />}
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
}

export function renderVerticalProblem({ problem, index, settings }: ProblemRenderProps) {
  const showAnswer = settings.answerKeyPosition === 'side-by-side';
  const n1  = String(problem.num1);
  const n2  = String(problem.num2);
  const ans = String(problem.answer);
  // Width of widest number determines column size; +2ch for operator area
  const maxDigits = Math.max(n1.length, n2.length);
  const boxWidth  = `${maxDigits + 2}ch`;

  // Shared row layout: [2ch op slot][flex-1 right-aligned number]
  const row = (op: React.ReactNode, num: string, numColor?: string) => (
    <div style={{ display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap' }}>
      <span style={{ width: '2ch', flexShrink: 0, textAlign: 'center',
                     fontWeight: 700, color: op ? '#7c3aed' : 'transparent' }}>
        {op || '+'}
      </span>
      <span style={{ flex: 1, textAlign: 'right',
                     color: numColor, fontWeight: numColor ? 700 : undefined }}>
        {num}
      </span>
    </div>
  );

  return (
    <div key={index} className="problem-box-vertical">
      <span className="vertical-problem-number" aria-hidden="true">#{index + 1}</span>
      <div
        className="vertical-problem"
        role="math"
        aria-label={`${n1} ${problem.operation} ${n2}`}
        style={{ width: boxWidth }}
      >
        {row(null,             n1)}
        {row(problem.operation, n2)}
        <div className="problem-line" />
        {showAnswer
          ? row(null, ans, '#16a34a')
          : <div className="problem-blank" />
        }
      </div>
    </div>
  );
}

export function renderFlashCard({ problem, index }: ProblemRenderProps) {
  return (
    <div key={index} className="flash-card">
      <div className="flash-card-front" aria-label={`Flash card ${index + 1}: ${problem.num1} ${problem.operation} ${problem.num2}`}>
        <div className="text-4xl font-bold text-center">
          {problem.num1} {problem.operation} {problem.num2}
        </div>
      </div>
      <div className="flash-card-back" aria-hidden="true">
        <div className="text-5xl font-bold text-center text-green-600">
          {problem.answer}
        </div>
      </div>
    </div>
  );
}

export function renderProblem({ problem, index, settings }: ProblemRenderProps) {
  if (settings.layout === 'flash-cards') {
    return renderFlashCard({ problem, index, settings });
  }

  if (settings.layout === 'vertical' || settings.layout === '3-column') {
    return renderVerticalProblem({ problem, index, settings });
  }

  return renderHorizontalProblem({ problem, index, settings });
}
