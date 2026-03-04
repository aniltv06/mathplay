/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, User, Trash2, Database, Edit, Download, Upload, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import { EditProfileModal } from './EditProfileModal';
import { formatName } from '../utils/formatters';
import { GradientButton } from './GradientButton';
import { AVATAR_OPTIONS } from '../utils/constants';

interface Props {
  onSelectProfile: (profileId: string) => void;
  onNavigateToDashboard?: () => void;
}

export function ProfileSelector({ onSelectProfile, onNavigateToDashboard }: Props) {
  const { profiles, addProfile, deleteProfile } = useProfiles();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSyncBackup, setShowSyncBackup] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  // Safety check: ensure profiles is always an array
  const safeProfiles = Array.isArray(profiles) ? profiles : [];

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim().slice(0, 30); // enforce max length
    if (!trimmed) return;
    const profile = addProfile(trimmed, selectedAvatar);
    setNewName('');
    setShowCreateForm(false);
    onSelectProfile(profile.id); // safe – profile is already in state before this call
  };

  const handleDeleteProfile = (id: string) => {
    if (deleteConfirm === id) {
      deleteProfile(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleExport = () => {
    // Export all localStorage data
    try {
      const data = {
        profiles: localStorage.getItem('mathplay_profiles'),
        currentProfileId: localStorage.getItem('mathplay_currentProfileId'),
        hangmanSettings: localStorage.getItem('hangmanSettings'),
        practiceSettings: localStorage.getItem('practiceSettings'),
        worksheetSettings: localStorage.getItem('worksheetSettings'),
        timestamp: new Date().toISOString(),
      };

      const jsonString = JSON.stringify(data, null, 2);

      // Create download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mathplay-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSyncStatus({
        type: 'success',
        message: 'Data exported successfully!',
      });
    } catch (error) {
      setSyncStatus({
        type: 'error',
        message: 'Failed to export data',
      });
    }

    setTimeout(() => {
      setSyncStatus({ type: 'idle', message: '' });
    }, 3000);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Restore localStorage data
        if (data.profiles) {
          localStorage.setItem('mathplay_profiles', data.profiles);
        }
        if (data.currentProfileId) {
          localStorage.setItem('mathplay_currentProfileId', data.currentProfileId);
        }
        if (data.hangmanSettings) {
          localStorage.setItem('hangmanSettings', data.hangmanSettings);
        }
        if (data.practiceSettings) {
          localStorage.setItem('practiceSettings', data.practiceSettings);
        }
        if (data.worksheetSettings) {
          localStorage.setItem('worksheetSettings', data.worksheetSettings);
        }

        setSyncStatus({
          type: 'success',
          message: 'Data imported successfully! Page will reload...',
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        setSyncStatus({
          type: 'error',
          message: 'Error reading file. Please check the file format.',
        });
      }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center px-4 py-8">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl mb-4 text-white drop-shadow-lg">
            Math Learning Hub 🎓
          </h1>
          <p className="text-2xl text-white/90">
            {safeProfiles.length === 0 ? 'Create a profile to get started!' : 'Select your profile'}
          </p>
        </motion.div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <AnimatePresence>
            {safeProfiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectProfile(profile.id)}
                className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all relative group cursor-pointer"
              >
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingProfile(profile.id);
                    }}
                    className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full"
                    title="Edit Profile"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProfile(profile.id);
                    }}
                    className="bg-red-100 hover:bg-red-200 p-2 rounded-full"
                    title="Delete Profile"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                {deleteConfirm === profile.id && (
                  <div className="absolute inset-0 bg-red-500/90 rounded-3xl flex items-center justify-center">
                    <p className="text-white">Click again to delete</p>
                  </div>
                )}

                <div className="text-6xl mb-4">{profile.avatar}</div>
                <h3 className="text-2xl text-gray-800 mb-2">{formatName(profile.name)}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>📝 Sessions: {profile.stats.totalSessions + profile.stats.hangmanSessions}</p>
                  <p>🏆 High Score: {profile.stats.hangmanHighScore}</p>
                  <p>
                    ✅ Accuracy:{' '}
                    {(profile.stats.totalCorrect + profile.stats.hangmanCorrect) > 0
                      ? Math.round(
                          ((profile.stats.totalCorrect + profile.stats.hangmanCorrect) /
                          (profile.stats.totalCorrect + profile.stats.totalWrong +
                           profile.stats.hangmanCorrect + profile.stats.hangmanWrong)) * 100
                        )
                      : 0}
                    %
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Profile Button */}
          {!showCreateForm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(true)}
              className="bg-white/50 backdrop-blur-sm border-4 border-dashed border-white/70 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center min-h-[240px]"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <p className="text-xl text-white">Create Profile</p>
            </motion.button>
          )}
        </div>

        {/* Parent Dashboard Button */}
        {!showCreateForm && onNavigateToDashboard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <GradientButton
              onClick={onNavigateToDashboard}
              fromColor="#6366f1"
              toColor="#a855f7"
              hoverFromColor="#4f46e5"
              hoverToColor="#9333ea"
              className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
            >
              <BarChart3 className="w-5 h-5" />
              Parent Dashboard
            </GradientButton>
            <p className="text-white/90 text-sm mt-2">
              View progress and analytics for all profiles
            </p>
          </motion.div>
        )}

        {/* Sync & Backup Button */}
        {!showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <GradientButton
              onClick={() => setShowSyncBackup(true)}
              fromColor="#3b82f6"
              toColor="#06b6d4"
              hoverFromColor="#2563eb"
              hoverToColor="#0891b2"
              className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
            >
              <Database className="w-5 h-5" />
              Backup & Restore
            </GradientButton>
            <p className="text-white/90 text-sm mt-2">
              Export or import your progress data
            </p>
          </motion.div>
        )}

        {/* Create Profile Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-3xl text-gray-800 mb-6">Create New Profile</h2>
              <form onSubmit={handleCreateProfile} className="space-y-6">
                <div>
                  <label htmlFor="profile-name" className="block text-gray-700 mb-2">Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value.slice(0, 30))}
                    placeholder="Enter your name"
                    maxLength={30}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 outline-none transition-colors"
                    autoFocus
                    aria-describedby="name-hint"
                  />
                  <p id="name-hint" className="text-xs text-gray-500 mt-1 text-right">
                    {newName.trim().length}/30
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Choose Avatar</label>
                  <div className="grid grid-cols-6 gap-3">
                    {AVATAR_OPTIONS.map((avatar) => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`text-4xl p-3 rounded-xl transition-all ${
                          selectedAvatar === avatar
                            ? 'bg-purple-100 ring-4 ring-purple-500 scale-110'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <GradientButton
                    type="submit"
                    disabled={!newName.trim()}
                    fromColor="#a855f7"
                    toColor="#ec4899"
                    hoverFromColor="#9333ea"
                    hoverToColor="#db2777"
                    className="flex-1 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Profile
                  </GradientButton>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewName('');
                    }}
                    className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Profile Modal */}
        {editingProfile && safeProfiles.find(p => p.id === editingProfile) && (
          <EditProfileModal
            profile={safeProfiles.find(p => p.id === editingProfile)!}
            isOpen={true}
            onClose={() => setEditingProfile(null)}
          />
        )}

        {/* Sync & Backup Modal */}
        {showSyncBackup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl text-gray-800 mb-2">Backup & Restore</h2>
                <p className="text-gray-600">
                  Export or import your progress data
                </p>
              </div>

              {/* Status Message */}
              <AnimatePresence>
                {syncStatus.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                      syncStatus.type === 'success'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {syncStatus.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <p>{syncStatus.message}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="space-y-3 mb-6">
                {/* Export Button */}
                <GradientButton
                  onClick={handleExport}
                  fromColor="#22c55e"
                  toColor="#10b981"
                  hoverFromColor="#16a34a"
                  hoverToColor="#059669"
                  className="w-full p-4 rounded-xl shadow-lg hover:shadow-xl flex items-center gap-3"
                >
                  <Download className="w-5 h-5 text-white" />
                  <div className="text-left flex-1 text-white">
                    <div className="font-bold text-white">Export Data</div>
                    <div className="text-sm opacity-90 text-white">Download backup as JSON file</div>
                  </div>
                </GradientButton>

                {/* Import Button */}
                <label className="w-full block cursor-pointer">
                  <div
                    className="w-full p-4 rounded-xl shadow-lg flex items-center gap-3 text-white"
                    style={{ background: 'linear-gradient(to right,rgb(59,130,246),rgb(6,182,212))' }}
                  >
                    <Upload className="w-5 h-5 text-white flex-shrink-0" aria-hidden="true" />
                    <div className="text-left flex-1 text-white">
                      <div className="font-bold text-white">Import Data</div>
                      <div className="text-sm opacity-90 text-white">Restore from JSON backup file</div>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    aria-label="Import backup file"
                  />
                </label>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-blue-900 mb-2 text-sm">Important Notes</h3>
                <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                  <li>Export creates a backup of all your profiles and progress</li>
                  <li>Import will replace all current data with the backup</li>
                  <li>Keep your backup files in a safe place</li>
                  <li>Regular backups help prevent data loss</li>
                </ul>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowSyncBackup(false);
                  setSyncStatus({ type: 'idle', message: '' });
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
