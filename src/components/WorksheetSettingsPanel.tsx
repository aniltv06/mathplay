/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Worksheet Settings Panel
 * Configure problem settings for worksheet mode
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import type { ProblemSettings } from '../types';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';

interface Props {
  settings: ProblemSettings;
  onSave: (settings: ProblemSettings) => void;
  onClose: () => void;
}

export function WorksheetSettingsPanel({ settings, onSave, onClose }: Props) {
  const [localSettings, setLocalSettings] = useState<ProblemSettings>(settings);
  const { enabled: voiceEnabled, setEnabled: setVoiceEnabled } = useVoiceFeedback();

  const handleSave = () => {
    // Validate at least one operation is selected
    if (
      !localSettings.includeAddition &&
      !localSettings.includeSubtraction &&
      !localSettings.includeMultiplication &&
      !localSettings.includeDivision
    ) {
      alert('Please select at least one operation type!');
      return;
    }

    onSave(localSettings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl text-gray-800">Worksheet Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Number of Problems */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Number of Problems: {localSettings.numProblems}
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={localSettings.numProblems}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  numProblems: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5</span>
              <span>30</span>
            </div>
          </div>

          {/* Number Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Minimum Number
              </label>
              <input
                type="number"
                min="0"
                max={localSettings.maxNum - 1}
                value={localSettings.minNum}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    minNum: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Maximum Number
              </label>
              <input
                type="number"
                min={localSettings.minNum + 1}
                max="1000"
                value={localSettings.maxNum}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    maxNum: parseInt(e.target.value) || 10,
                  })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Operation Types */}
          <div>
            <label className="block text-sm text-gray-700 mb-3">
              Operation Types
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.includeAddition}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      includeAddition: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded"
                />
                <span className="text-lg">+ Addition</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.includeSubtraction}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      includeSubtraction: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded"
                />
                <span className="text-lg">- Subtraction</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.includeMultiplication}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      includeMultiplication: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded"
                />
                <span className="text-lg">× Multiplication</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.includeDivision}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      includeDivision: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded"
                />
                <span className="text-lg">÷ Division</span>
              </label>
            </div>
          </div>

          {/* Timed Mode */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.timedMode || false}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    timedMode: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
              <span className="text-lg">Timed Mode</span>
            </label>

            {localSettings.timedMode && (
              <div className="mt-3 ml-8">
                <label className="block text-sm text-gray-700 mb-2">
                  Time Limit (minutes): {Math.floor((localSettings.timeLimit || 300) / 60)}
                </label>
                <input
                  type="range"
                  min="60"
                  max="1800"
                  step="60"
                  value={localSettings.timeLimit || 300}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      timeLimit: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 min</span>
                  <span>30 min</span>
                </div>
              </div>
            )}
          </div>

          {/* Voice Feedback */}
          <div>
            <label className="block text-sm text-gray-700 mb-3">
              App Settings
            </label>
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <div className="text-gray-700">Voice Feedback 🔊</div>
                <div className="text-sm text-gray-500">
                  Read problems and feedback aloud
                </div>
              </div>
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-2xl text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Save Settings
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-2xl text-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
