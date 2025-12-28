/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion } from 'motion/react';
import { Grid3x3, LogOut, User, Trophy, Edit } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { useI18n } from '../i18n/I18nContext';
import { EditProfileModal } from '../components/EditProfileModal';
import { useState } from 'react';
import type { Page } from '../App';
import { formatName } from '../utils/formatters';

// Custom emoji icon components
const GamepadIcon = ({ className }: { className?: string }) => (
  <span className="text-3xl leading-none" role="img" aria-label="gamepad">🎮</span>
);

const WorksheetIcon = ({ className }: { className?: string }) => (
  <span className="text-3xl leading-none" role="img" aria-label="worksheet">📚</span>
);

interface Props {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  profileId: string;
}

interface Tile {
  id: Page;
  title: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
}

export function HomePage({ onNavigate, onLogout, profileId }: Props) {
  const { getProfile } = useProfiles();
  const { t } = useI18n();
  const profile = getProfile(profileId);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const tiles: Tile[] = [
    {
      id: 'math-worksheet',
      title: t.mathWorksheet,
      description: t.mathWorksheetDesc,
      icon: WorksheetIcon,
      color: 'text-cyan-600',
      gradient: 'from-sky-400 to-blue-500',
    },
    {
      id: 'math-challenge',
      title: t.mathChallenge,
      description: t.mathChallengeDesc,
      icon: GamepadIcon,
      color: 'text-purple-600',
      gradient: 'from-purple-400 to-pink-500',
    },
    {
      id: 'multiplication-learning',
      title: t.multiplicationLearning,
      description: t.multiplicationLearningDesc,
      icon: Grid3x3,
      color: 'text-green-600',
      gradient: 'from-green-400 to-emerald-500',
    },
  ];

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-8 relative z-20"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="text-5xl">{profile.avatar}</div>
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="absolute -top-1 -right-1 bg-blue-500 hover:bg-blue-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="Edit Profile"
                  >
                    <Edit className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div>
                  <h1 className="text-3xl text-gray-800">
                    {t.welcomeBack}, {formatName(profile.name)}! 👋
                  </h1>
                  <p className="text-gray-600">{t.chooseActivity}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LanguageSelector />
                <button
                  onClick={onLogout}
                  className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-6xl mx-auto mb-8 relative z-10"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Your Progress
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">{t.gamesPlayed}</div>
                <div className="text-3xl text-purple-600">{profile.stats.totalSessions + profile.stats.hangmanSessions}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-4 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">{t.totalScore}</div>
                <div className="text-3xl text-blue-600">{profile.stats.totalCorrect + profile.stats.hangmanCorrect}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-4 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">{t.highScore}</div>
                <div className="text-3xl text-yellow-600">{profile.stats.hangmanHighScore}</div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">{t.accuracy}</div>
                <div className="text-3xl text-green-600">
                  {(profile.stats.totalCorrect + profile.stats.hangmanCorrect + profile.stats.totalWrong + profile.stats.hangmanWrong) > 0
                    ? Math.round(((profile.stats.totalCorrect + profile.stats.hangmanCorrect) / (profile.stats.totalCorrect + profile.stats.hangmanCorrect + profile.stats.totalWrong + profile.stats.hangmanWrong)) * 100)
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity Tiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl text-white mb-6 drop-shadow-lg">Learning Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Math Worksheet Card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('math-worksheet')}
              className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all text-left group"
            >
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <WorksheetIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-2 text-cyan-600">
                {t.mathWorksheet}
              </h3>
              <p className="text-gray-600">{t.mathWorksheetDesc}</p>
            </motion.button>

            {/* Math Hangman Card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('math-challenge')}
              className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all text-left group"
            >
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GamepadIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-2 text-purple-600">
                {t.mathChallenge}
              </h3>
              <p className="text-gray-600">{t.mathChallengeDesc}</p>
            </motion.button>

            {/* Multiplication Learning Card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('multiplication-learning')}
              className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all text-left group"
            >
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Grid3x3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-2 text-green-600">
                {t.multiplicationLearning}
              </h3>
              <p className="text-gray-600">{t.multiplicationLearningDesc}</p>
            </motion.button>

            {/* Coming Soon Tile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/50 backdrop-blur-sm border-4 border-dashed border-white/70 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center"
            >
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl text-white mb-2">More Coming Soon!</h3>
              <p className="text-white/80 text-center">
                New learning activities are on the way
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && profile && (
        <EditProfileModal
          profile={profile}
          isOpen={true}
          onClose={() => setShowEditProfile(false)}
        />
      )}
    </div>
  );
}
