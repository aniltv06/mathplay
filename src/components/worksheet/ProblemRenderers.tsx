/**
 * Problem Renderers Component
 * Handles rendering different problem types (horizontal, vertical, flash cards)
 */

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
}

export function renderVerticalProblem({ problem, index, settings }: ProblemRenderProps) {
  return (
    <div key={index} className="text-center problem-box-vertical">
      <div className="text-xs text-gray-600 mb-2" aria-label={`Problem ${index + 1}`}>
        #{index + 1}
      </div>
      <div className="vertical-problem" aria-label={`${problem.num1} ${problem.operation} ${problem.num2}`}>
        <div className="problem-num">{problem.num1}</div>
        <div className="problem-op-line">
          <span className="problem-op">{problem.operation}</span>
          <span className="problem-num">{problem.num2}</span>
        </div>
        <div className="problem-line"></div>
        {settings.answerKeyPosition === 'side-by-side' ? (
          <div className="problem-answer" aria-label={`Answer: ${problem.answer}`}>
            {problem.answer}
          </div>
        ) : (
          <div className="problem-blank"></div>
        )}
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
