/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Badge display component
 * Shows earned and unearned badges with progress indicators
 */

import { motion } from 'motion/react';
import type { Badge } from '../types';
import { getBadgeProgress } from '../utils/badges';
import type { Profile } from '../context/ProfileContext';

interface BadgeCardProps {
  badge: Badge;
  profile?: Profile;
  showProgress?: boolean;
}

export function BadgeCard({ badge, profile, showProgress = false }: BadgeCardProps) {
  const progress = profile && showProgress ? getBadgeProgress(profile, badge.id) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative p-4 rounded-xl border-2 transition-all ${
        badge.earned
          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-lg'
          : 'bg-gray-50 border-gray-200 opacity-60'
      }`}
    >
      {/* Badge Icon */}
      <div className="text-center mb-2">
        <span className="text-5xl">{badge.icon}</span>
      </div>

      {/* Badge Name */}
      <h3 className={`text-lg font-bold text-center mb-1 ${
        badge.earned ? 'text-gray-800' : 'text-gray-500'
      }`}>
        {badge.name}
      </h3>

      {/* Badge Description */}
      <p className={`text-sm text-center ${
        badge.earned ? 'text-gray-600' : 'text-gray-400'
      }`}>
        {badge.description}
      </p>

      {/* Earned Date */}
      {badge.earned && badge.earnedAt && (
        <p className="text-xs text-center text-gray-500 mt-2">
          Earned {new Date(badge.earnedAt).toLocaleDateString()}
        </p>
      )}

      {/* Progress Bar */}
      {!badge.earned && showProgress && progress > 0 && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-center text-gray-500 mt-1">{Math.round(progress)}%</p>
        </div>
      )}

      {/* Locked Overlay */}
      {!badge.earned && (
        <div className="absolute top-2 right-2 bg-gray-300 text-gray-600 text-xs px-2 py-1 rounded-full">
          🔒 Locked
        </div>
      )}

      {/* Earned Badge */}
      {badge.earned && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
          ✓ Earned
        </div>
      )}
    </motion.div>
  );
}

interface BadgeGridProps {
  badges: Badge[];
  profile?: Profile;
  showProgress?: boolean;
}

export function BadgeGrid({ badges, profile, showProgress = false }: BadgeGridProps) {
  const earnedBadges = badges.filter(b => b.earned);
  const unearnedBadges = badges.filter(b => !b.earned);

  return (
    <div className="space-y-6">
      {/* Earned Badges Section */}
      {earnedBadges.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Earned Badges ({earnedBadges.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BadgeCard badge={badge} profile={profile} showProgress={showProgress} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Unearned Badges Section */}
      {unearnedBadges.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Available Badges ({unearnedBadges.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {unearnedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BadgeCard badge={badge} profile={profile} showProgress={showProgress} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No Badges Message */}
      {badges.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No badges yet. Start playing to earn badges!</p>
        </div>
      )}
    </div>
  );
}

interface BadgeNotificationProps {
  badge: Badge;
  onClose: () => void;
}

export function BadgeNotification({ badge, onClose }: BadgeNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -50 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti Effect */}
        <div className="text-6xl mb-4 animate-bounce">🎉</div>

        {/* Badge Icon */}
        <div className="text-8xl mb-4">{badge.icon}</div>

        {/* Badge Earned Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Badge Earned!</h2>

        {/* Badge Name */}
        <h3 className="text-2xl font-bold text-yellow-600 mb-3">{badge.name}</h3>

        {/* Badge Description */}
        <p className="text-gray-600 mb-6">{badge.description}</p>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 px-8 rounded-full shadow-lg"
        >
          Awesome! ✨
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
