/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect } from 'react';
import { ProfileProvider } from './context/ProfileContext';
import { I18nProvider } from './i18n/I18nContext';
import { VoiceFeedbackProvider } from './hooks/useVoiceFeedback';
import { ProfileSelector } from './components/ProfileSelector';
import { HomePage } from './pages/HomePage';
import { MathChallengePage } from './pages/MathChallengePage';
import { MathWorksheetPage } from './pages/MathWorksheetPage';
import { MultiplicationLearningPageEnhanced } from './pages/MultiplicationLearningPageEnhanced';
import { ParentDashboardPage } from './pages/ParentDashboardPage';

export type Page = 'home' | 'math-challenge' | 'math-worksheet' | 'multiplication-learning' | 'parent-dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfile(profileId);
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
                  <MathWorksheetPage
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
              </>
            )}
          </VoiceFeedbackProvider>
        )}
      </I18nProvider>
    </ProfileProvider>
  );
}
