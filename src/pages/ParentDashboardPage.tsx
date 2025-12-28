/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Users, TrendingUp, Clock, Target, Award, Calendar, BarChart3 } from 'lucide-react';
import { useProfiles, type Profile } from '../context/ProfileContext';
import { useI18n } from '../i18n/I18nContext';
import type { WorksheetSession, HangmanSession } from '../types';
import { formatName } from '../utils/formatters';

interface Props {
  onBack: () => void;
}

export function ParentDashboardPage({ onBack }: Props) {
  const { profiles } = useProfiles();
  const { t } = useI18n();
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  // Calculate aggregate stats across all profiles
  const aggregateStats = profiles.reduce((acc, profile) => {
    return {
      totalProfiles: acc.totalProfiles + 1,
      totalSessions: acc.totalSessions + profile.stats.totalSessions + profile.stats.hangmanSessions,
      totalProblems: acc.totalProblems + profile.stats.totalProblems + profile.stats.hangmanProblems,
      totalCorrect: acc.totalCorrect + profile.stats.totalCorrect + profile.stats.hangmanCorrect,
      totalWrong: acc.totalWrong + profile.stats.totalWrong + profile.stats.hangmanWrong,
      totalTimeSpent: acc.totalTimeSpent + profile.stats.timeSpent + profile.stats.hangmanTimeSpent,
    };
  }, {
    totalProfiles: 0,
    totalSessions: 0,
    totalProblems: 0,
    totalCorrect: 0,
    totalWrong: 0,
    totalTimeSpent: 0,
  });

  const overallAccuracy = aggregateStats.totalProblems > 0
    ? Math.round((aggregateStats.totalCorrect / (aggregateStats.totalCorrect + aggregateStats.totalWrong)) * 100)
    : 0;

  // Get recent sessions across all profiles
  const recentSessions: Array<{ profile: Profile; session: WorksheetSession | HangmanSession; type: 'worksheet' | 'hangman' }> = [];

  profiles.forEach(profile => {
    profile.worksheetHistory.forEach(session => {
      recentSessions.push({ profile, session, type: 'worksheet' });
    });
    profile.hangmanHistory.forEach(session => {
      recentSessions.push({ profile, session, type: 'hangman' });
    });
  });

  recentSessions.sort((a, b) => new Date(b.session.date).getTime() - new Date(a.session.date).getTime());
  const latestSessions = recentSessions.slice(0, 10);

  // Format time helper
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredProfile = selectedProfile ? profiles.find(p => p.id === selectedProfile) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-indigo-600" />
                {t.parentDashboard}
              </h1>
              <p className="text-gray-600 text-sm">Track learning progress across all profiles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overall Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Total Profiles */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Profiles</div>
                <div className="text-3xl font-bold text-purple-600">{aggregateStats.totalProfiles}</div>
              </div>
            </div>
          </div>

          {/* Total Sessions */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Sessions</div>
                <div className="text-3xl font-bold text-blue-600">{aggregateStats.totalSessions}</div>
              </div>
            </div>
          </div>

          {/* Overall Accuracy */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 rounded-xl">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Overall Accuracy</div>
                <div className="text-3xl font-bold text-green-600">{overallAccuracy}%</div>
              </div>
            </div>
          </div>

          {/* Total Time */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Time</div>
                <div className="text-3xl font-bold text-orange-600">{formatTime(aggregateStats.totalTimeSpent)}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-xl mb-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Filter by Profile</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedProfile(null)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedProfile === null
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Profiles
            </button>
            {profiles.map(profile => (
              <button
                key={profile.id}
                onClick={() => setSelectedProfile(profile.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  selectedProfile === profile.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{profile.avatar}</span>
                {formatName(profile.name)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Individual Profile Stats or All Profiles */}
        {filteredProfile ? (
          <ProfileDetailView profile={filteredProfile} formatTime={formatTime} formatDate={formatDate} />
        ) : (
          <AllProfilesView profiles={profiles} formatTime={formatTime} />
        )}

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Recent Activity
          </h2>
          {latestSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">No activity yet</p>
              <p className="text-gray-400 text-sm">Start practicing to see activity here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {latestSessions.map((item, index) => {
                const accuracy = item.type === 'worksheet'
                  ? (item.session as WorksheetSession).percentage
                  : Math.round(((item.session as any).score / (item.session.problems.length * 10)) * 100);

                return (
                  <motion.div
                    key={`${item.profile.id}-${item.session.date}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{item.profile.avatar}</div>
                      <div>
                        <div className="font-semibold text-gray-800">{formatName(item.profile.name)}</div>
                        <div className="text-sm text-gray-600">
                          {item.type === 'worksheet' ? '📝 Worksheet' : '🎮 Math Challenge'} • {formatDate(item.session.date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Accuracy</div>
                        <div className="text-xl font-bold text-indigo-600">{accuracy}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Problems</div>
                        <div className="text-xl font-bold text-purple-600">{item.session.problems.length}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Component for showing all profiles overview
function AllProfilesView({ profiles, formatTime }: { profiles: Profile[]; formatTime: (s: number) => string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
    >
      {profiles.map((profile, index) => {
        const totalSessions = profile.stats.totalSessions + profile.stats.hangmanSessions;
        const totalCorrect = profile.stats.totalCorrect + profile.stats.hangmanCorrect;
        const totalWrong = profile.stats.totalWrong + profile.stats.hangmanWrong;
        const accuracy = (totalCorrect + totalWrong) > 0
          ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
          : 0;

        return (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">{profile.avatar}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{formatName(profile.name)}</h3>
                <p className="text-sm text-gray-500">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sessions</span>
                <span className="font-bold text-indigo-600">{totalSessions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className="font-bold text-green-600">{accuracy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Best Streak</span>
                <span className="font-bold text-orange-600">{Math.max(profile.stats.bestStreak, profile.stats.hangmanBestStreak)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Time Spent</span>
                <span className="font-bold text-purple-600">{formatTime(profile.stats.timeSpent + profile.stats.hangmanTimeSpent)}</span>
              </div>
            </div>

            {/* Progress bars */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Worksheet Progress</span>
                  <span>{profile.stats.totalSessions} sessions</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${Math.min(profile.stats.totalSessions * 10, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Challenge Progress</span>
                  <span>{profile.stats.hangmanSessions} sessions</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${Math.min(profile.stats.hangmanSessions * 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// Component for showing detailed stats for a single profile
function ProfileDetailView({ profile, formatTime, formatDate }: { profile: Profile; formatTime: (s: number) => string; formatDate: (d: string) => string }) {
  const totalSessions = profile.stats.totalSessions + profile.stats.hangmanSessions;
  const totalCorrect = profile.stats.totalCorrect + profile.stats.hangmanCorrect;
  const totalWrong = profile.stats.totalWrong + profile.stats.hangmanWrong;
  const accuracy = (totalCorrect + totalWrong) > 0
    ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6 mb-8"
    >
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-6 mb-6">
          <div className="text-7xl">{profile.avatar}</div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{formatName(profile.name)}</h2>
            <p className="text-gray-600">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">Last active: {new Date(profile.lastActive).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Total Sessions</div>
            <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Accuracy</div>
            <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Best Streak</div>
            <div className="text-2xl font-bold text-orange-600">{Math.max(profile.stats.bestStreak, profile.stats.hangmanBestStreak)}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Time Spent</div>
            <div className="text-2xl font-bold text-purple-600">{formatTime(profile.stats.timeSpent + profile.stats.hangmanTimeSpent)}</div>
          </div>
        </div>
      </div>

      {/* Worksheet vs Challenge Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Worksheet Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📝 Worksheet Practice
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Sessions</span>
              <span className="font-bold text-blue-600">{profile.stats.totalSessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Problems</span>
              <span className="font-bold text-blue-600">{profile.stats.totalProblems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Correct</span>
              <span className="font-bold text-green-600">{profile.stats.totalCorrect}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wrong</span>
              <span className="font-bold text-red-600">{profile.stats.totalWrong}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Best Streak</span>
              <span className="font-bold text-orange-600">{profile.stats.bestStreak}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time Spent</span>
              <span className="font-bold text-purple-600">{formatTime(profile.stats.timeSpent)}</span>
            </div>
          </div>
        </div>

        {/* Challenge Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🎮 Math Challenge
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Sessions</span>
              <span className="font-bold text-blue-600">{profile.stats.hangmanSessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Problems</span>
              <span className="font-bold text-blue-600">{profile.stats.hangmanProblems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Correct</span>
              <span className="font-bold text-green-600">{profile.stats.hangmanCorrect}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wrong</span>
              <span className="font-bold text-red-600">{profile.stats.hangmanWrong}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Best Streak</span>
              <span className="font-bold text-orange-600">{profile.stats.hangmanBestStreak}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">High Score</span>
              <span className="font-bold text-yellow-600">{profile.stats.hangmanHighScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session History */}
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-indigo-600" />
          Session History
        </h3>
        <div className="space-y-2">
          {[...profile.worksheetHistory, ...profile.hangmanHistory]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10)
            .map((session, index) => {
              const isWorksheet = 'correctCount' in session;
              const accuracy = isWorksheet
                ? (session as WorksheetSession).percentage
                : Math.round(((session as HangmanSession).score / (session.problems.length * 10)) * 100);

              return (
                <div
                  key={`${session.date}-${index}`}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{isWorksheet ? '📝' : '🎮'}</div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {isWorksheet ? 'Worksheet Practice' : 'Math Challenge'}
                      </div>
                      <div className="text-sm text-gray-600">{formatDate(session.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Accuracy</div>
                      <div className="font-bold text-green-600">{accuracy}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Problems</div>
                      <div className="font-bold text-indigo-600">{session.problems.length}</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
}
