/**
 * Settings Panel Component
 * Enhanced with keyboard navigation, ARIA labels, and accessibility
 */

import { useState } from 'react';
import { Settings, Clock, Book, FolderOpen, Save } from 'lucide-react';
import { WorksheetSettings, DifficultyLevel, LayoutType, ThemeType, AnswerKeyPosition, SavedTemplate, ValidationError } from './types';

interface SettingsPanelProps {
  settings: WorksheetSettings;
  onSettingsChange: (settings: Partial<WorksheetSettings>) => void;
  savedTemplates: SavedTemplate[];
  onSaveTemplate: () => void;
  onLoadTemplate: (template: SavedTemplate) => void;
  onDeleteTemplate: (index: number) => void;
  validationErrors: ValidationError[];
  isGenerating: boolean;
}

export function WorksheetSettingsPanel({
  settings,
  onSettingsChange,
  savedTemplates,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  validationErrors,
  isGenerating,
}: SettingsPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getValidationError = (field: string) => {
    return validationErrors.find(err => err.field === field)?.message;
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const applyDifficultyPreset = (level: DifficultyLevel) => {
    let preset: Partial<WorksheetSettings> = { difficulty: level };

    switch (level) {
      case 'beginner':
        preset = {
          ...preset,
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
          ...preset,
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
          ...preset,
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

    onSettingsChange(preset);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Difficulty Presets */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <Book className="w-4 h-4" aria-hidden="true" />
          <span id="difficulty-label">Difficulty Level</span>
        </h3>
        <div className="flex gap-2" role="group" aria-labelledby="difficulty-label">
          {(['beginner', 'intermediate', 'advanced', 'custom'] as DifficultyLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => level !== 'custom' && applyDifficultyPreset(level)}
              onKeyPress={(e) => handleKeyPress(e, () => level !== 'custom' && applyDifficultyPreset(level))}
              disabled={isGenerating || level === 'custom'}
              aria-label={`${level} difficulty`}
              aria-pressed={settings.difficulty === level}
              className={`px-4 py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                settings.difficulty === level
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300'
              } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {level === 'beginner' && '🌟 Beginner'}
              {level === 'intermediate' && '⭐ Intermediate'}
              {level === 'advanced' && '🏆 Advanced'}
              {level === 'custom' && '⚙️ Custom'}
            </button>
          ))}
        </div>
      </div>

      {/* Basic Settings */}
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="numProblems" className="text-sm font-semibold text-gray-700">
            Problems:
          </label>
          <select
            id="numProblems"
            value={settings.numProblems}
            onChange={(e) => onSettingsChange({ numProblems: Number(e.target.value) })}
            disabled={isGenerating}
            aria-label="Number of problems per worksheet"
            className={`px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {[10, 15, 20, 25, 30, 35, 40, 50, 100].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="minNumber" className="text-sm font-semibold text-gray-700">
            Range:
          </label>
          <div className="flex items-center gap-2">
            <input
              id="minNumber"
              type="number"
              min="0"
              max="999"
              value={settings.minNumber}
              onChange={(e) => onSettingsChange({ minNumber: Number(e.target.value), difficulty: 'custom' })}
              disabled={isGenerating}
              aria-label="Minimum number"
              aria-invalid={!!getValidationError('minNumber')}
              aria-describedby={getValidationError('minNumber') ? 'minNumber-error' : undefined}
              className={`w-20 px-3 py-2 border-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getValidationError('minNumber') ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <span aria-hidden="true">to</span>
            <input
              id="maxNumber"
              type="number"
              min="1"
              max="999"
              value={settings.maxNumber}
              onChange={(e) => onSettingsChange({ maxNumber: Number(e.target.value), difficulty: 'custom' })}
              disabled={isGenerating}
              aria-label="Maximum number"
              aria-invalid={!!getValidationError('maxNumber')}
              aria-describedby={getValidationError('maxNumber') ? 'maxNumber-error' : undefined}
              className={`w-20 px-3 py-2 border-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getValidationError('maxNumber') ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
          {(getValidationError('minNumber') || getValidationError('maxNumber')) && (
            <span id="minNumber-error" className="text-xs text-red-600" role="alert">
              {getValidationError('minNumber') || getValidationError('maxNumber')}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="numWorksheets" className="text-sm font-semibold text-gray-700">
            Worksheets:
          </label>
          <select
            id="numWorksheets"
            value={settings.numWorksheets}
            onChange={(e) => onSettingsChange({ numWorksheets: Number(e.target.value) })}
            disabled={isGenerating}
            aria-label="Number of worksheets to generate"
            className={`px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {[1, 5, 10, 20, 30].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'worksheet' : 'worksheets'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Operations */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block" id="operations-label">
          Operations:
        </label>
        <div className="flex gap-2" role="group" aria-labelledby="operations-label">
          {[
            { key: 'includeAddition', symbol: '+', label: 'Addition', color: 'green' },
            { key: 'includeSubtraction', symbol: '−', label: 'Subtraction', color: 'blue' },
            { key: 'includeMultiplication', symbol: '×', label: 'Multiplication', color: 'purple' },
            { key: 'includeDivision', symbol: '÷', label: 'Division', color: 'orange' },
          ].map(({ key, symbol, label, color }) => (
            <button
              key={key}
              onClick={() => onSettingsChange({ [key]: !settings[key as keyof WorksheetSettings] })}
              onKeyPress={(e) => handleKeyPress(e, () => onSettingsChange({ [key]: !settings[key as keyof WorksheetSettings] }))}
              disabled={isGenerating}
              aria-label={`${label}: ${settings[key as keyof WorksheetSettings] ? 'enabled' : 'disabled'}`}
              aria-pressed={!!settings[key as keyof WorksheetSettings]}
              className={`w-12 h-12 rounded-lg font-bold text-2xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 ${
                settings[key as keyof WorksheetSettings]
                  ? `bg-${color}-500 text-white shadow-lg`
                  : 'bg-gray-200 text-gray-500'
              } ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Multiplication Tables */}
      {settings.includeMultiplication && (
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block" id="mult-tables-label">
            Multiplication Tables:
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby="mult-tables-label">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(table => (
              <button
                key={table}
                onClick={() => {
                  const tables = settings.multiplicationTables.includes(table)
                    ? settings.multiplicationTables.filter(t => t !== table)
                    : [...settings.multiplicationTables, table];
                  onSettingsChange({ multiplicationTables: tables });
                }}
                onKeyPress={(e) => handleKeyPress(e, () => {
                  const tables = settings.multiplicationTables.includes(table)
                    ? settings.multiplicationTables.filter(t => t !== table)
                    : [...settings.multiplicationTables, table];
                  onSettingsChange({ multiplicationTables: tables });
                })}
                disabled={isGenerating}
                aria-label={`${table} times table: ${settings.multiplicationTables.includes(table) ? 'selected' : 'not selected'}`}
                aria-pressed={settings.multiplicationTables.includes(table)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  settings.multiplicationTables.includes(table)
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
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
        onKeyPress={(e) => handleKeyPress(e, () => setShowAdvanced(!showAdvanced))}
        aria-expanded={showAdvanced}
        aria-controls="advanced-settings"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
      >
        <Settings className="w-4 h-4" aria-hidden="true" />
        {showAdvanced ? 'Hide' : 'Show'} Advanced Options
      </button>

      {/* Advanced Options */}
      {showAdvanced && (
        <div id="advanced-settings" className="space-y-4 border-t pt-4">
          {/* Problem Types */}
          <fieldset>
            <legend className="text-sm font-semibold text-gray-700 mb-2">Problem Types:</legend>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'standard', label: 'Standard (5 + 3 = __)' },
                { key: 'fillBlank', label: 'Fill Blank (__ + 3 = 8)' },
                { key: 'compare', label: 'Compare (7 __ 9)' },
                { key: 'missingOperator', label: 'Missing Op (5 __ 3 = 8)' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.problemTypes[key as keyof typeof settings.problemTypes]}
                    onChange={(e) => onSettingsChange({
                      problemTypes: { ...settings.problemTypes, [key]: e.target.checked }
                    })}
                    disabled={isGenerating}
                    aria-label={label}
                    className="w-4 h-4 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Layout & Theme */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="layout" className="text-sm font-semibold text-gray-700 mb-2 block">
                Layout:
              </label>
              <select
                id="layout"
                value={settings.layout}
                onChange={(e) => onSettingsChange({ layout: e.target.value as LayoutType })}
                disabled={isGenerating}
                aria-label="Worksheet layout"
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <option value="horizontal">Horizontal (2 cols)</option>
                <option value="vertical">Vertical (4 cols)</option>
                <option value="3-column">3 Columns</option>
                <option value="flash-cards">Flash Cards</option>
                <option value="large-print">Large Print</option>
              </select>
            </div>
            <div>
              <label htmlFor="theme" className="text-sm font-semibold text-gray-700 mb-2 block">
                Theme:
              </label>
              <select
                id="theme"
                value={settings.theme}
                onChange={(e) => onSettingsChange({ theme: e.target.value as ThemeType })}
                disabled={isGenerating}
                aria-label="Worksheet theme"
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
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

          {/* Additional Options */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'requireCarrying', label: 'Require Carrying' },
              { key: 'requireBorrowing', label: 'Require Borrowing' },
              { key: 'progressiveDifficulty', label: 'Progressive Difficulty' },
              { key: 'includeWorkspace', label: 'Include Workspace' },
              { key: 'addDecorations', label: 'Add Decorations' },
              { key: 'timedPractice', label: 'Timed Practice' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key as keyof WorksheetSettings] as boolean}
                  onChange={(e) => onSettingsChange({ [key]: e.target.checked })}
                  disabled={isGenerating}
                  aria-label={label}
                  className="w-4 h-4 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>

          {/* Timed Practice Settings */}
          {settings.timedPractice && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <label htmlFor="timeLimit" className="text-sm font-semibold text-gray-700">
                Time Limit:
              </label>
              <input
                id="timeLimit"
                type="number"
                min="1"
                max="60"
                value={settings.timeLimit}
                onChange={(e) => onSettingsChange({ timeLimit: Number(e.target.value) })}
                disabled={isGenerating}
                aria-label="Time limit in minutes"
                className={`w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              <span className="text-sm text-gray-600">minutes</span>
            </div>
          )}

          {/* Answer Key */}
          <div>
            <label htmlFor="answerKey" className="text-sm font-semibold text-gray-700 mb-2 block">
              Answer Key:
            </label>
            <select
              id="answerKey"
              value={settings.answerKeyPosition}
              onChange={(e) => onSettingsChange({ answerKeyPosition: e.target.value as AnswerKeyPosition })}
              disabled={isGenerating}
              aria-label="Answer key position"
              className={`px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isGenerating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <option value="none">No Answer Key</option>
              <option value="separate">Separate Page</option>
              <option value="side-by-side">Side-by-Side</option>
              <option value="upside-down">Upside Down (bottom)</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="worksheetTitle" className="text-sm font-semibold text-gray-700 mb-2 block">
              Worksheet Title:
            </label>
            <input
              id="worksheetTitle"
              type="text"
              value={settings.worksheetTitle}
              onChange={(e) => onSettingsChange({ worksheetTitle: e.target.value })}
              disabled={isGenerating}
              aria-label="Worksheet title"
              className={`w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isGenerating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>
        </div>
      )}

      {/* Saved Templates */}
      {savedTemplates.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <FolderOpen className="w-4 h-4" aria-hidden="true" />
            <span id="templates-label">Saved Templates</span>
          </h3>
          <div className="flex flex-wrap gap-2" role="list" aria-labelledby="templates-label">
            {savedTemplates.map((template, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-200 rounded-lg px-3 py-2" role="listitem">
                <button
                  onClick={() => onLoadTemplate(template)}
                  onKeyPress={(e) => handleKeyPress(e, () => onLoadTemplate(template))}
                  disabled={isGenerating}
                  aria-label={`Load template: ${template.name}`}
                  className={`text-sm font-semibold text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 ${
                    isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {template.name}
                </button>
                <button
                  onClick={() => onDeleteTemplate(index)}
                  onKeyPress={(e) => handleKeyPress(e, () => onDeleteTemplate(index))}
                  disabled={isGenerating}
                  aria-label={`Delete template: ${template.name}`}
                  className={`text-red-500 hover:text-red-600 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1 ${
                    isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Template Button */}
      <button
        onClick={onSaveTemplate}
        onKeyPress={(e) => handleKeyPress(e, onSaveTemplate)}
        disabled={isGenerating}
        aria-label="Save current settings as template"
        className={`w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
          isGenerating ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Save className="w-4 h-4" aria-hidden="true" />
        Save Template
      </button>
    </div>
  );
}
