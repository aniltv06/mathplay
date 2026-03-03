/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, lazy, Suspense } from 'react';
import { ProfileProvider } from './context/ProfileContext';
import { I18nProvider } from './i18n/I18nContext';
import { VoiceFeedbackProvider } from './hooks/useVoiceFeedback';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProfileSelector } from './components/ProfileSelector';
import { TimerMusicWidget } from './components/TimerMusicWidget';
import type { Language } from './i18n/translations';

// Lazy-load all pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const MathChallengePage = lazy(() => import('./pages/MathChallengePage').then(m => ({ default: m.MathChallengePage })));
const MathWorksheetPageEnhanced = lazy(() => import('./pages/MathWorksheetPageEnhanced').then(m => ({ default: m.MathWorksheetPageEnhanced })));
const MultiplicationLearningPageEnhanced = lazy(() => import('./pages/MultiplicationLearningPageEnhanced').then(m => ({ default: m.MultiplicationLearningPageEnhanced })));
const ParentDashboardPage = lazy(() => import('./pages/ParentDashboardPage').then(m => ({ default: m.ParentDashboardPage })));
const PrintWorksheetPage = lazy(() => import('./pages/PrintWorksheetPage').then(m => ({ default: m.PrintWorksheetPage })));
const ShapesLearningPage = lazy(() => import('./pages/ShapesLearningPage').then(m => ({ default: m.ShapesLearningPage })));
const DivisionLearningPageEnhanced = lazy(() => import('./pages/DivisionLearningPageEnhanced').then(m => ({ default: m.DivisionLearningPageEnhanced })));
const FactorialLearningPage = lazy(() => import('./pages/FactorialLearningPage').then(m => ({ default: m.FactorialLearningPage })));
const FibonacciLearningPage = lazy(() => import('./pages/FibonacciLearningPage').then(m => ({ default: m.FibonacciLearningPage })));
const FractionsDecimalsPage = lazy(() => import('./pages/FractionsDecimalsPage').then(m => ({ default: m.FractionsDecimalsPage })));
const TimeCalendarPage = lazy(() => import('./pages/TimeCalendarPage').then(m => ({ default: m.TimeCalendarPage })));
const MoneyShoppingPage = lazy(() => import('./pages/MoneyShoppingPage').then(m => ({ default: m.MoneyShoppingPage })));
const EstimationRoundingPage = lazy(() => import('./pages/EstimationRoundingPage').then(m => ({ default: m.EstimationRoundingPage })));
const GraphCalculatorPage = lazy(() => import('./pages/GraphCalculatorPage').then(m => ({ default: m.GraphCalculatorPage })));

export type Page =
  | 'home'
  | 'math-challenge'
  | 'math-worksheet'
  | 'multiplication-learning'
  | 'parent-dashboard'
  | 'print-worksheet'
  | 'shapes-learning'
  | 'division-learning'
  | 'factorial-learning'
  | 'fibonacci-learning'
  | 'fractions-decimals'
  | 'time-calendar'
  | 'money-shopping'
  | 'estimation-rounding'
  | 'graph-calculator';

function PageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center">
      <div className="bg-white/90 rounded-3xl p-8 shadow-2xl text-center">
        <div className="text-5xl mb-4 animate-bounce">📚</div>
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function AppContent({ language }: { language: Language }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfile(profileId);
    setCurrentPage('home');
    setShowDashboard(false);
  };

  const handleLogout = () => {
    setSelectedProfile(null);
    setCurrentPage('home');
    setShowDashboard(false);
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const goHome = () => navigateTo('home');

  const renderPage = () => {
    if (showDashboard) {
      return <ParentDashboardPage onBack={() => setShowDashboard(false)} />;
    }

    if (!selectedProfile) {
      return (
        <ProfileSelector
          onSelectProfile={handleProfileSelect}
          onNavigateToDashboard={() => setShowDashboard(true)}
        />
      );
    }

    const sharedProps = { profileId: selectedProfile, onBack: goHome };

    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={navigateTo}
            onLogout={handleLogout}
            profileId={selectedProfile}
          />
        );
      case 'math-worksheet':
        return <MathWorksheetPageEnhanced {...sharedProps} />;
      case 'math-challenge':
        return <MathChallengePage {...sharedProps} />;
      case 'multiplication-learning':
        return <MultiplicationLearningPageEnhanced {...sharedProps} />;
      case 'print-worksheet':
        return <PrintWorksheetPage {...sharedProps} />;
      case 'shapes-learning':
        return <ShapesLearningPage {...sharedProps} />;
      case 'division-learning':
        return <DivisionLearningPageEnhanced {...sharedProps} />;
      case 'factorial-learning':
        return <FactorialLearningPage {...sharedProps} />;
      case 'fibonacci-learning':
        return <FibonacciLearningPage {...sharedProps} />;
      case 'fractions-decimals':
        return <FractionsDecimalsPage {...sharedProps} />;
      case 'time-calendar':
        return <TimeCalendarPage {...sharedProps} />;
      case 'money-shopping':
        return <MoneyShoppingPage {...sharedProps} />;
      case 'estimation-rounding':
        return <EstimationRoundingPage {...sharedProps} />;
      case 'graph-calculator':
        return <GraphCalculatorPage {...sharedProps} />;
      default:
        return (
          <HomePage
            onNavigate={navigateTo}
            onLogout={handleLogout}
            profileId={selectedProfile}
          />
        );
    }
  };

  return (
    <VoiceFeedbackProvider language={language}>
      <Suspense fallback={<PageFallback />}>
        {renderPage()}
      </Suspense>
      {selectedProfile && <TimerMusicWidget />}
    </VoiceFeedbackProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <ProgressProvider>
          <I18nProvider>
            {({ language }) => <AppContent language={language} />}
          </I18nProvider>
        </ProgressProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
