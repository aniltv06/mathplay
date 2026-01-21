/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion } from 'motion/react';
import { Grid3x3, LogOut, User, Trophy, Edit, Printer, Shapes, Divide, Hash, TrendingUp, Percent, Clock, DollarSign, Target, LineChart } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import { useProgress } from '../context/ProgressContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { useI18n } from '../i18n/I18nContext';
import { EditProfileModal } from '../components/EditProfileModal';
import { useState } from 'react';
import type { Page } from '../App';
import { formatName } from '../utils/formatters';

// Custom emoji icon components
const GamepadIcon = ({ className }: { className?: string }) => (
  <span className="text-4xl" role="img" aria-label="gamepad">🎮</span>
);

const WorksheetIcon = ({ className }: { className?: string }) => (
  <span className="text-4xl" role="img" aria-label="worksheet">📚</span>
);

interface Props {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  profileId: string;
}

export function HomePage({ onNavigate, onLogout, profileId }: Props) {
  const { getProfile } = useProfiles();
  const { getProfileProgress, startActivity } = useProgress();
  const { t } = useI18n();
  const profile = getProfile(profileId);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const profileProgress = getProfileProgress(profileId);

  const handleNavigation = (page: Page) => {
    startActivity(profileId, page);
    onNavigate(page);
  };

  const getActivityCompletion = (activityId: string): number => {
    return profileProgress?.activities[activityId]?.completionPercentage || 0;
  };

  const isActivityStarted = (activityId: string): boolean => {
    return !!profileProgress?.activities[activityId];
  };

  // Category section component
  const CategorySection = ({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) => (
    <div className="mb-12">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-white mb-6 drop-shadow-lg flex items-center gap-3"
      >
        <span className="text-4xl">{emoji}</span>
        {title}
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );

  // Activity card component with progress
  const ActivityCard = ({
    page,
    title,
    description,
    icon: Icon,
    gradient,
    color,
    delay,
    isComingSoon = false
  }: {
    page: Page;
    title: string;
    description: string;
    icon: any;
    gradient: string;
    color: string;
    delay: number;
    isComingSoon?: boolean;
  }) => {
    const completion = getActivityCompletion(page);
    const started = isActivityStarted(page);

    // Map gradient strings to CSS gradient styles for guaranteed rendering
    const gradientStyles: Record<string, string> = {
      'from-blue-400 to-cyan-500': 'linear-gradient(to bottom right, rgb(96, 165, 250), rgb(6, 182, 212))',
      'from-green-400 to-emerald-500': 'linear-gradient(to bottom right, rgb(74, 222, 128), rgb(16, 185, 129))',
      'from-purple-400 to-pink-500': 'linear-gradient(to bottom right, rgb(192, 132, 252), rgb(236, 72, 153))',
      'from-orange-400 to-red-500': 'linear-gradient(to bottom right, rgb(251, 146, 60), rgb(239, 68, 68))',
      'from-yellow-400 to-amber-500': 'linear-gradient(to bottom right, rgb(250, 204, 21), rgb(245, 158, 11))',
      'from-red-400 to-pink-500': 'linear-gradient(to bottom right, rgb(248, 113, 113), rgb(236, 72, 153))',
      'from-cyan-400 to-blue-500': 'linear-gradient(to bottom right, rgb(34, 211, 238), rgb(59, 130, 246))',
      'from-indigo-400 to-purple-500': 'linear-gradient(to bottom right, rgb(129, 140, 248), rgb(168, 85, 247))',
      'from-teal-400 to-green-500': 'linear-gradient(to bottom right, rgb(45, 212, 191), rgb(34, 197, 94))',
      'from-teal-400 to-cyan-500': 'linear-gradient(to bottom right, rgb(45, 212, 191), rgb(6, 182, 212))',
      'from-blue-400 to-indigo-500': 'linear-gradient(to bottom right, rgb(96, 165, 250), rgb(99, 102, 241))',
      'from-amber-400 to-orange-500': 'linear-gradient(to bottom right, rgb(251, 191, 36), rgb(249, 115, 22))',
      'from-rose-400 to-pink-500': 'linear-gradient(to bottom right, rgb(251, 113, 133), rgb(236, 72, 153))',
    };

    const gradientStyle = gradientStyles[gradient];

    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleNavigation(page)}
        className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all text-left group relative overflow-hidden"
      >
        {/* Progress Bar */}
        {started && completion > 0 && (
          <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        )}

        {/* Coming Soon Badge */}
        {isComingSoon && (
          <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            SOON
          </div>
        )}

        <div
          className="w-16 h-16 mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
          style={{ background: gradientStyle }}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-2xl mb-2 ${color} font-bold`}>
          {title}
        </h3>
        <p className="text-gray-600">{description}</p>

        {/* Status indicator */}
        {started && completion === 100 && (
          <div className="mt-4 flex items-center gap-2 text-green-600">
            <Trophy className="w-5 h-5" />
            <span className="text-sm font-semibold">Completed!</span>
          </div>
        )}
        {started && completion > 0 && completion < 100 && (
          <div className="mt-4 text-blue-600 text-sm font-semibold">
            {completion}% Complete
          </div>
        )}
      </motion.button>
    );
  };

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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-4 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Activities Started</div>
                <div className="text-3xl text-indigo-600">{profileProgress?.activitiesStarted || 0}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity Tiles - Organized by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          {/* Category: Core Math Skills */}
          <CategorySection title="Core Math Skills" emoji="🔢">
            <ActivityCard
              page="math-worksheet"
              title={t.mathWorksheet}
              description={t.mathWorksheetDesc}
              icon={WorksheetIcon}
              gradient="from-blue-400 to-cyan-500"
              color="text-cyan-600"
              delay={0.3}
            />
            <ActivityCard
              page="math-challenge"
              title={t.mathChallenge}
              description={t.mathChallengeDesc}
              icon={GamepadIcon}
              gradient="from-purple-400 to-pink-500"
              color="text-purple-600"
              delay={0.4}
            />
            <ActivityCard
              page="multiplication-learning"
              title={t.multiplicationLearning}
              description={t.multiplicationLearningDesc}
              icon={Grid3x3}
              gradient="from-green-400 to-emerald-500"
              color="text-green-600"
              delay={0.5}
            />
            <ActivityCard
              page="division-learning"
              title="Learn Division"
              description="Master division with interactive lessons and games"
              icon={Divide}
              gradient="from-teal-400 to-cyan-500"
              color="text-teal-600"
              delay={0.6}
            />
            <ActivityCard
              page="fractions-decimals"
              title="Fractions & Decimals"
              description="Learn fractions, decimals, and percentages"
              icon={Percent}
              gradient="from-blue-400 to-indigo-500"
              color="text-blue-600"
              delay={0.7}
            />
            <ActivityCard
              page="estimation-rounding"
              title="Estimation & Rounding"
              description="Develop number sense with estimation"
              icon={Target}
              gradient="from-amber-400 to-orange-500"
              color="text-amber-600"
              delay={0.8}
            />
          </CategorySection>

          {/* Category: Real-World Math */}
          <CategorySection title="Real-World Math" emoji="🌍">
            <ActivityCard
              page="time-calendar"
              title="Time & Calendar"
              description="Master telling time and reading calendars"
              icon={Clock}
              gradient="from-orange-400 to-red-500"
              color="text-orange-600"
              delay={0.9}
            />
            <ActivityCard
              page="money-shopping"
              title="Money & Shopping"
              description="Learn money, counting, and smart shopping"
              icon={DollarSign}
              gradient="from-green-400 to-emerald-500"
              color="text-green-600"
              delay={1.0}
            />
          </CategorySection>

          {/* Category: Geometry & Patterns */}
          <CategorySection title="Geometry & Patterns" emoji="🎨">
            <ActivityCard
              page="shapes-learning"
              title="Shapes Learning"
              description="Explore shapes through games and adventures"
              icon={Shapes}
              gradient="from-yellow-400 to-amber-500"
              color="text-yellow-600"
              delay={1.1}
            />
          </CategorySection>

          {/* Category: Advanced Concepts */}
          <CategorySection title="Advanced Concepts" emoji="🚀">
            <ActivityCard
              page="factorial-learning"
              title="Factorial Numbers"
              description="Explore factorials and number patterns"
              icon={Hash}
              gradient="from-indigo-400 to-purple-500"
              color="text-indigo-600"
              delay={1.2}
            />
            <ActivityCard
              page="fibonacci-learning"
              title="Fibonacci Series"
              description="Discover the magical Fibonacci sequence"
              icon={TrendingUp}
              gradient="from-rose-400 to-pink-500"
              color="text-rose-600"
              delay={1.3}
            />
          </CategorySection>

          {/* Category: Tools */}
          <CategorySection title="Tools & Resources" emoji="🛠️">
            <ActivityCard
              page="print-worksheet"
              title="Print Worksheets"
              description="Generate and print custom math worksheets"
              icon={Printer}
              gradient="from-orange-400 to-red-500"
              color="text-orange-600"
              delay={1.4}
            />
            <ActivityCard
              page="graph-calculator"
              title="Graph Calculator"
              description="Interactive graphing calculator for visualizing functions"
              icon={LineChart}
              gradient="from-cyan-400 to-blue-500"
              color="text-cyan-600"
              delay={1.5}
            />
            {/* Coming Soon Tile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 }}
              className="bg-white/50 backdrop-blur-sm border-4 border-dashed border-white/70 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center"
            >
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl text-white mb-2 drop-shadow">More Coming Soon!</h3>
              <p className="text-white/80 text-center">
                New learning activities are on the way
              </p>
            </motion.div>
          </CategorySection>
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
