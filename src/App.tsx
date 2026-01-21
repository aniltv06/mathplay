/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect } from 'react';
import { ProfileProvider } from './context/ProfileContext';
import { I18nProvider } from './i18n/I18nContext';
import { VoiceFeedbackProvider } from './hooks/useVoiceFeedback';
import { ProgressProvider } from './context/ProgressContext';
import { ProfileSelector } from './components/ProfileSelector';
import { HomePage } from './pages/HomePage';
import { MathChallengePage } from './pages/MathChallengePage';
import { MathWorksheetPageEnhanced } from './pages/MathWorksheetPageEnhanced';
import { MultiplicationLearningPageEnhanced } from './pages/MultiplicationLearningPageEnhanced';
import { ParentDashboardPage } from './pages/ParentDashboardPage';
import { PrintWorksheetPage } from './pages/PrintWorksheetPage';
import { ShapesLearningPage } from './pages/ShapesLearningPage';
import { DivisionLearningPageEnhanced } from './pages/DivisionLearningPageEnhanced';
import { FactorialLearningPage } from './pages/FactorialLearningPage';
import { FibonacciLearningPage } from './pages/FibonacciLearningPage';
import { FractionsDecimalsPage } from './pages/FractionsDecimalsPage';
import { TimeCalendarPage } from './pages/TimeCalendarPage';
import { MoneyShoppingPage } from './pages/MoneyShoppingPage';
import { EstimationRoundingPage } from './pages/EstimationRoundingPage';
import { GraphCalculatorPage } from './pages/GraphCalculatorPage';

export type Page = 'home' | 'math-challenge' | 'math-worksheet' | 'multiplication-learning' | 'parent-dashboard' | 'print-worksheet' | 'shapes-learning' | 'division-learning' | 'factorial-learning' | 'fibonacci-learning' | 'fractions-decimals' | 'time-calendar' | 'money-shopping' | 'estimation-rounding' | 'graph-calculator';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfile(profileId);
    setCurrentPage('home'); // Reset to home page when profile is selected
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

  const handleNavigateToDashboard = () => {
    setShowDashboard(true);
  };

  const handleBackFromDashboard = () => {
    setShowDashboard(false);
  };

  return (
    <ProfileProvider>
      <ProgressProvider>
        <I18nProvider>
          {({ language }) => (
            <VoiceFeedbackProvider language={language}>
              {showDashboard ? (
                <ParentDashboardPage onBack={handleBackFromDashboard} />
              ) : !selectedProfile ? (
                <ProfileSelector
                  onSelectProfile={handleProfileSelect}
                  onNavigateToDashboard={handleNavigateToDashboard}
                />
              ) : (
                <>
                  {currentPage === 'home' && (
                    <HomePage
                      onNavigate={navigateTo}
                      onLogout={handleLogout}
                      profileId={selectedProfile}
                    />
                  )}
                {currentPage === 'math-worksheet' && (
                  <MathWorksheetPageEnhanced
                    onBack={() => navigateTo('home')}
                    profileId={selectedProfile}
                  />
                )}
                {currentPage === 'math-challenge' && (
                  <MathChallengePage
                    onBack={() => navigateTo('home')}
                    profileId={selectedProfile}
                  />
                )}
                {currentPage === 'multiplication-learning' && (
                  <MultiplicationLearningPageEnhanced
                    onBack={() => navigateTo('home')}
                    profileId={selectedProfile}
                  />
                )}
                {currentPage === 'print-worksheet' && (
                  <PrintWorksheetPage
                    onBack={() => navigateTo('home')}
                    profileId={selectedProfile}
                  />
                )}
                {currentPage === 'shapes-learning' && (
                  <ShapesLearningPage
                    onBack={() => navigateTo('home')}
                    profileId={selectedProfile}
                  />
                )}
                {currentPage === 'division-learning' && (
                  <DivisionLearningPageEnhanced
                    onBack={() => navigateTo('home')}
                    profileId={selectedProfile}
                  />
                )}
                {currentPage === 'factorial-learning' && (
                  <FactorialLearningPage
                    onBack={() => navigateTo('home')}
                    profileId={selectedProfile}
                  />
                )}
                {currentPage === 'fibonacci-learning' && (
                  <FibonacciLearningPage
                    onBack={() => navigateTo('home')}
                    profileId={selectedProfile}
                  />
                )}
                {currentPage === 'fractions-decimals' && (
                  <FractionsDecimalsPage
                    onBack={() => navigateTo('home')}
                    profileId={selectedProfile}
                  />
                )}
                {currentPage === 'time-calendar' && (
                  <TimeCalendarPage
                    onBack={() => navigateTo('home')}
                    profileId={selectedProfile}
                  />
                )}
                {currentPage === 'money-shopping' && (
                  <MoneyShoppingPage
                    onBack={() => navigateTo('home')}
                    profileId={selectedProfile}
                  />
                )}
                {currentPage === 'estimation-rounding' && (
                  <EstimationRoundingPage
                    onBack={() => navigateTo('home')}
                    profileId={selectedProfile}
                  />
                )}
                {currentPage === 'graph-calculator' && (
                  <GraphCalculatorPage
                    onBack={() => navigateTo('home')}
                    profileId={selectedProfile}
                  />
                )}
              </>
            )}
          </VoiceFeedbackProvider>
        )}
      </I18nProvider>
      </ProgressProvider>
    </ProfileProvider>
  );
}
