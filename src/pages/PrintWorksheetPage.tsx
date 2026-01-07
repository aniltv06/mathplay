/**
 * Print Worksheet Page - Refactored
 * Clean, component-based architecture with accessibility and auto-save
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useCallback } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import {
  WorksheetSettingsPanel,
  PreviewPanel,
  PrintStyles,
  useWorksheetSettings,
  useProblemGeneration,
  useTemplateManager,
  useAutoSave,
  usePanelResize,
  getThemeStyles,
} from '../components/worksheet';

interface Props {
  onBack: () => void;
  profileId: string;
}

export function PrintWorksheetPage({ onBack, profileId }: Props) {
  const { getProfile } = useProfiles();
  const profile = getProfile(profileId);

  // Custom hooks for state management
  const {
    settings,
    updateSettings,
    validationErrors,
    isValid,
  } = useWorksheetSettings();

  const {
    worksheets,
    isGenerating,
    generationError,
    regenerateProblems,
  } = useProblemGeneration(settings);

  const {
    savedTemplates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
  } = useTemplateManager();

  const {
    panelWidth,
    isResizing,
    startResizing,
  } = usePanelResize(500);

  // Auto-save settings every 30 seconds
  useAutoSave(settings, true);

  // Handle template save
  const handleSaveTemplate = useCallback(() => {
    const name = prompt('Enter template name:');
    if (!name) return;

    saveTemplate(name, settings);
    alert('Template saved!');
  }, [saveTemplate, settings]);

  // Handle template load
  const handleLoadTemplate = useCallback((template: { name: string; settings: any }) => {
    updateSettings(loadTemplate(template));
    alert(`Loaded template: ${template.name}`);
  }, [loadTemplate, updateSettings]);

  // Handle print
  const handlePrint = useCallback(() => {
    if (isGenerating) {
      alert('Please wait for problems to finish generating');
      return;
    }
    if (!isValid) {
      alert('Please fix validation errors before printing');
      return;
    }
    window.print();
  }, [isGenerating, isValid]);

  // Handle key press for buttons
  const handleKeyPress = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);

  if (!profile) return null;

  const theme = getThemeStyles(settings.theme);

  return (
    <div className="bg-gray-100">
      {/* Enhanced Controls Header */}
      <div className="no-print sticky top-0 z-50 bg-white border-b-2 border-gray-300 shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                onKeyPress={(e) => handleKeyPress(e, onBack)}
                aria-label="Go back"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Enhanced Worksheet Generator</h1>
                <p className="text-sm text-gray-600" role="status" aria-live="polite">
                  {isGenerating ? (
                    <span className="text-blue-600">Generating problems...</span>
                  ) : (
                    <>
                      {worksheets.reduce((sum, ws) => sum + ws.length, 0)} problems • {worksheets.length} worksheet{worksheets.length !== 1 ? 's' : ''}
                      {!isValid && <span className="text-red-600 ml-2">⚠ Please fix validation errors</span>}
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={regenerateProblems}
                onKeyPress={(e) => handleKeyPress(e, regenerateProblems)}
                disabled={isGenerating || !isValid}
                aria-label="Regenerate problems"
                className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isGenerating || !isValid ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                🔄 Regenerate
              </button>
              <button
                onClick={handlePrint}
                onKeyPress={(e) => handleKeyPress(e, handlePrint)}
                disabled={isGenerating || !isValid}
                aria-label="Print worksheets"
                className={`bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isGenerating || !isValid ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Printer className="w-5 h-5" aria-hidden="true" />
                Print
              </button>
            </div>
          </div>

          {/* Generation Error */}
          {generationError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm" role="alert">
              Error: {generationError}
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Layout */}
      <div className="flex">
        {/* Left Settings Panel */}
        <div
          className="no-print bg-white border-r-2 border-gray-300 overflow-y-auto"
          style={{ width: `${panelWidth}px`, maxHeight: 'calc(100vh - 80px)' }}
          role="complementary"
          aria-label="Worksheet settings panel"
        >
          <WorksheetSettingsPanel
            settings={settings}
            onSettingsChange={updateSettings}
            savedTemplates={savedTemplates}
            onSaveTemplate={handleSaveTemplate}
            onLoadTemplate={handleLoadTemplate}
            onDeleteTemplate={deleteTemplate}
            validationErrors={validationErrors}
            isGenerating={isGenerating}
          />
        </div>

        {/* Resize Handle */}
        <div
          className="no-print w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors relative group"
          onMouseDown={startResizing}
          role="separator"
          aria-label="Resize panels"
          aria-valuenow={panelWidth}
          aria-valuemin={350}
          aria-valuemax={800}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              // Decrease width
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              // Increase width
            }
          }}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-400 group-hover:bg-blue-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-1 h-8 bg-white rounded-full" />
          </div>
        </div>

        {/* Right Preview Panel */}
        <div className="flex-1 overflow-y-auto bg-gray-100" role="main" aria-label="Worksheet preview">
          <PreviewPanel
            worksheets={worksheets}
            settings={settings}
            theme={theme}
            profileName={profile.name}
            isGenerating={isGenerating}
          />
        </div>
      </div>

      {/* Print Styles */}
      <PrintStyles isResizing={isResizing} />
    </div>
  );
}
