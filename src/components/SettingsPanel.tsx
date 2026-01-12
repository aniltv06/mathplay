/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Settings as SettingsIcon } from 'lucide-react';
import type { GameSettings, ProblemType } from '../types';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { GradientButton } from './GradientButton';

interface Props {
  settings: GameSettings;
  onSave: (settings: GameSettings) => void;
  onClose: () => void;
}

export function SettingsPanel({ settings, onSave, onClose }: Props) {
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);
  const { enabled: voiceEnabled, setEnabled: setVoiceEnabled } = useVoiceFeedback();

  const problemTypeOptions: { type: ProblemType; label: string; emoji: string }[] = [
    { type: 'addition', label: 'Addition', emoji: '➕' },
    { type: 'subtraction', label: 'Subtraction', emoji: '➖' },
    { type: 'multiplication', label: 'Multiplication', emoji: '✖️' },
    { type: 'division', label: 'Division', emoji: '➗' },
  ];

  const toggleProblemType = (type: ProblemType) => {
    const current = localSettings.problemTypes;
    if (current.includes(type)) {
      // Don't allow removing all types
      if (current.length > 1) {
        setLocalSettings({
          ...localSettings,
          problemTypes: current.filter((t) => t !== type),
        });
      }
    } else {
      setLocalSettings({
        ...localSettings,
        problemTypes: [...current, type],
      });
    }
  };

  const handleSave = () => {
    onSave(localSettings);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SettingsIcon className="w-8 h-8 text-white" />
                <h2 className="text-3xl text-white">Parent Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Problem Types */}
            <div>
              <h3 className="text-xl text-gray-700 mb-4">
                Problem Types
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {problemTypeOptions.map((option) => {
                  const isSelected = localSettings.problemTypes.includes(option.type);
                  return (
                    <button
                      key={option.type}
                      onClick={() => toggleProblemType(option.type)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{option.emoji}</div>
                      <div className={`${isSelected ? 'text-purple-700' : 'text-gray-700'}`}>
                        {option.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lives Count */}
            <div>
              <h3 className="text-xl text-gray-700 mb-4">
                Number of Lives
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={localSettings.livesCount}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      livesCount: parseInt(e.target.value),
                    })
                  }
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="text-3xl text-purple-600 w-16 text-center">
                  {localSettings.livesCount}
                </div>
              </div>
            </div>

            {/* Bonus Features */}
            <div>
              <h3 className="text-xl text-gray-700 mb-4">
                Bonus Features
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <div>
                    <div className="text-gray-700">Time Bonus ⏱️</div>
                    <div className="text-sm text-gray-500">
                      Extra points for quick answers
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.timeBonus}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        timeBonus: e.target.checked,
                      })
                    }
                    className="w-6 h-6 accent-purple-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <div>
                    <div className="text-gray-700">Streak Bonus 🔥</div>
                    <div className="text-sm text-gray-500">
                      Extra points for consecutive correct answers
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.streakBonus}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        streakBonus: e.target.checked,
                      })
                    }
                    className="w-6 h-6 accent-purple-500 cursor-pointer"
                  />
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
                    className="w-6 h-6 accent-purple-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-3xl border-t border-gray-200">
            <GradientButton
              onClick={handleSave}
              fromColor="#a855f7"
              toColor="#ec4899"
              hoverFromColor="#9333ea"
              hoverToColor="#db2777"
              className="w-full py-4 rounded-2xl text-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Save className="w-6 h-6" />
              Save Settings
            </GradientButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}