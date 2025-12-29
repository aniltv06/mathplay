/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Shapes Learning Page
 * Main page for shape learning with multiple modes
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, Gamepad2, HelpCircle, Grid3x3, Box, Calculator, RotateCw, Sparkles, Brain } from 'lucide-react';
import { ExploreMode } from '../components/ShapeExploreMode';
import { AdventureMode, QuizMode, MatchGame } from '../components/ShapeGameModes';
import { Shape3DLearningMode } from '../components/Shape3DLearningMode';
import { ShapeMathCalculator } from '../components/ShapeMathCalculator';
import { ShapeTransformationsPlayground } from '../components/ShapeTransformationsPlayground';
import { PatternSymmetryMode, AdvancedChallengesMode } from '../components/ShapeAdvancedModes';

interface Props {
  onBack: () => void;
  profileId: string;
}

type MenuLevel = 'main' | 'basic' | 'advanced';
type ShapesMode = 'menu' | 'explore' | 'adventure' | 'quiz' | 'match' | '3d' | 'calculator' | 'transformations' | 'symmetry' | 'challenges';

export function ShapesLearningPage({ onBack, profileId }: Props) {
  const [currentMode, setCurrentMode] = useState<ShapesMode>('menu');
  const [menuLevel, setMenuLevel] = useState<MenuLevel>('main');

  const basicModes = [
    {
      id: 'explore' as ShapesMode,
      title: 'Explore Shapes',
      description: 'Learn about all shapes with fun facts and examples',
      icon: Eye,
      color: 'from-blue-400 to-cyan-500',
      emoji: '🔍',
    },
    {
      id: 'adventure' as ShapesMode,
      title: 'Shape Adventure',
      description: 'Go on an adventure to collect and learn shapes',
      icon: Gamepad2,
      color: 'from-purple-400 to-pink-500',
      emoji: '🎮',
    },
    {
      id: 'quiz' as ShapesMode,
      title: 'Shape Quiz',
      description: 'Test your knowledge with fun quizzes',
      icon: HelpCircle,
      color: 'from-green-400 to-emerald-500',
      emoji: '❓',
    },
    {
      id: 'match' as ShapesMode,
      title: 'Match Game',
      description: 'Match shapes with their real-world examples',
      icon: Grid3x3,
      color: 'from-yellow-400 to-amber-500',
      emoji: '🎯',
    },
  ];

  const advancedModes = [
    {
      id: '3d' as ShapesMode,
      title: '3D Shapes',
      description: 'Explore 3D shapes with nets and properties',
      icon: Box,
      color: 'from-indigo-400 to-purple-500',
      emoji: '🧊',
    },
    {
      id: 'calculator' as ShapesMode,
      title: 'Math Calculator',
      description: 'Calculate area, perimeter, volume & surface area',
      icon: Calculator,
      color: 'from-cyan-400 to-blue-500',
      emoji: '🔢',
    },
    {
      id: 'transformations' as ShapesMode,
      title: 'Transformations',
      description: 'Rotate, reflect, translate and scale shapes',
      icon: RotateCw,
      color: 'from-orange-400 to-red-500',
      emoji: '🔄',
    },
    {
      id: 'symmetry' as ShapesMode,
      title: 'Pattern & Symmetry',
      description: 'Discover symmetry in shapes and patterns',
      icon: Sparkles,
      color: 'from-teal-400 to-cyan-500',
      emoji: '✨',
    },
    {
      id: 'challenges' as ShapesMode,
      title: 'Advanced Challenges',
      description: 'Test your advanced geometry knowledge',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      emoji: '🧠',
    },
  ];

  // Render specific modes
  if (currentMode === 'explore') {
    return <ExploreMode onBack={() => setCurrentMode('menu')} profileId={profileId} />;
  }
  if (currentMode === 'adventure') {
    return <AdventureMode onBack={() => setCurrentMode('menu')} profileId={profileId} />;
  }
  if (currentMode === 'quiz') {
    return <QuizMode onBack={() => setCurrentMode('menu')} profileId={profileId} />;
  }
  if (currentMode === 'match') {
    return <MatchGame onBack={() => setCurrentMode('menu')} profileId={profileId} />;
  }
  if (currentMode === '3d') {
    return <Shape3DLearningMode onBack={() => setCurrentMode('menu')} profileId={profileId} />;
  }
  if (currentMode === 'calculator') {
    return <ShapeMathCalculator onBack={() => setCurrentMode('menu')} profileId={profileId} />;
  }
  if (currentMode === 'transformations') {
    return <ShapeTransformationsPlayground onBack={() => setCurrentMode('menu')} profileId={profileId} />;
  }
  if (currentMode === 'symmetry') {
    return <PatternSymmetryMode onBack={() => setCurrentMode('menu')} profileId={profileId} />;
  }
  if (currentMode === 'challenges') {
    return <AdvancedChallengesMode onBack={() => setCurrentMode('menu')} profileId={profileId} />;
  }

  // Menu rendering
  const currentModes = menuLevel === 'basic' ? basicModes : menuLevel === 'advanced' ? advancedModes : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Back button */}
      <button
        onClick={menuLevel === 'main' ? onBack : () => setMenuLevel('main')}
        className="absolute top-6 left-6 z-50 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">{menuLevel === 'main' ? 'Home' : 'Back'}</span>
      </button>

      {/* Content */}
      <div className="relative z-10 px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl mb-4">🔶 Shapes Learning 🔷</h1>
          <p className="text-2xl text-white drop-shadow-lg">
            {menuLevel === 'main' ? 'Choose your level!' : menuLevel === 'basic' ? 'Basic Learning Modes' : 'Advanced Learning Modes'}
          </p>
        </motion.div>

        {/* Mode Selection Cards */}
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuLevel === 'main' ? (
            <>
              {/* Basic Learning Option */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMenuLevel('basic')}
                className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all text-left group"
              >
                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🌟</span>
                </div>
                <h3 className="text-3xl mb-3 text-gray-800">
                  Basic Learning
                </h3>
                <p className="text-gray-600 text-lg">Fun games and activities for beginners</p>
              </motion.button>

              {/* Advanced Learning Option */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMenuLevel('advanced')}
                className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all text-left group"
              >
                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🚀</span>
                </div>
                <h3 className="text-3xl mb-3 text-gray-800">
                  Advanced Learning
                </h3>
                <p className="text-gray-600 text-lg">3D shapes, math, transformations & more</p>
              </motion.button>
            </>
          ) : (
            currentModes?.map((mode, index) => (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentMode(mode.id)}
                className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all text-left group"
              >
                <div className={`w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span className="text-4xl">{mode.emoji}</span>
                </div>
                <h3 className="text-3xl mb-3 text-gray-800">
                  {mode.title}
                </h3>
                <p className="text-gray-600 text-lg">{mode.description}</p>
              </motion.button>
            ))
          )}
        </div>

        {/* Fun floating shapes decoration */}
        <div className="absolute top-20 right-20 text-6xl opacity-20 animate-bounce">
          🔺
        </div>
        <div className="absolute bottom-32 left-20 text-5xl opacity-20 animate-bounce delay-300">
          🟦
        </div>
        <div className="absolute top-1/3 right-1/4 text-7xl opacity-20 animate-bounce delay-700">
          ⭐
        </div>
      </div>
    </div>
  );
}
