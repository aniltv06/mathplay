/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Edit Profile Modal Component
 * Allows users to update profile name and avatar
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save } from 'lucide-react';
import type { Profile } from '../context/ProfileContext';
import { useProfiles } from '../context/ProfileContext';

interface Props {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_OPTIONS = [
  '👦', '👧', '🧒', '👶',
  '🐶', '🐱', '🐼', '🦊', '🐸', '🦁', '🐯', '🐻',
  '🐨', '🐰', '🦄', '🐙', '🦖', '🦕', '🐢', '🐝',
  '🦋', '🐵', '🐷', '🐮', '🐹', '🦉', '🦜', '🐧',
  '🦈', '🐳', '🦒', '🦏', '🦘', '🦥'
];

export function EditProfileModal({ profile, isOpen, onClose }: Props) {
  const { updateProfile } = useProfiles();
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateProfile(profile.id, {
        name: name.trim(),
        avatar,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

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
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl text-white">Edit Profile</h2>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSave} className="p-8 space-y-6">
            {/* Current Avatar Preview */}
            <div className="text-center">
              <div className="text-7xl mb-2">{avatar}</div>
              <p className="text-gray-600">Current Avatar</p>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 outline-none transition-colors"
                autoFocus
              />
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Choose Avatar</label>
              <div className="grid grid-cols-6 gap-3">
                {AVATAR_OPTIONS.map((emojiAvatar) => (
                  <button
                    key={emojiAvatar}
                    type="button"
                    onClick={() => setAvatar(emojiAvatar)}
                    className={`text-4xl p-3 rounded-xl transition-all ${
                      avatar === emojiAvatar
                        ? 'bg-purple-100 ring-4 ring-purple-500 scale-110'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {emojiAvatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
