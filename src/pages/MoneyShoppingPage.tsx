/**
 * Money & Shopping Learning Page
 * Interactive money and shopping learning
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion } from 'motion/react';
import { ArrowLeft, DollarSign } from 'lucide-react';

interface Props {
  onBack: () => void;
  profileId: string;
}

export function MoneyShoppingPage({ onBack, profileId }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-50 bg-white hover:bg-gray-100 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-gray-800"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Back to Home</span>
      </button>

      {/* Content */}
      <div className="relative z-10 px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
          >
            <DollarSign className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-5xl mb-6 text-green-600">
            Money & Shopping
          </h1>

          <div className="text-6xl mb-6">💰</div>

          <h2 className="text-3xl text-gray-800 mb-4">Coming Soon!</h2>

          <p className="text-xl text-gray-600 mb-8">
            Learn about money, counting coins, making change, and smart shopping with real-world scenarios.
          </p>

          <div className="bg-green-50 rounded-2xl p-6 text-left">
            <h3 className="text-lg font-bold text-green-700 mb-3">What's Coming:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Coin identification and values</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Counting money and combinations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Making change from purchases</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Virtual store shopping games</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Budget planning and saving</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Price comparison and smart shopping</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
