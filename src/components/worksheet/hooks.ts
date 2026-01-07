/**
 * Custom Hooks for Worksheet Management
 * useWorksheetSettings, useProblemGeneration, useTemplateManager, useAutoSave
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { WorksheetSettings, Problem, SavedTemplate, ValidationError } from './types';
import { validateSettings, generateAllWorksheetProblems } from './utils';

export const DEFAULT_SETTINGS: WorksheetSettings = {
  numProblems: 20,
  minNumber: 1,
  maxNumber: 20,
  includeAddition: true,
  includeSubtraction: true,
  includeMultiplication: true,
  includeDivision: false,
  difficulty: 'beginner',
  theme: 'standard',
  layout: 'horizontal',
  spacing: 'normal',
  worksheetTitle: 'Math Worksheet',
  showAnswers: false,
  includeWorkspace: false,
  answerKeyPosition: 'none',
  requireCarrying: false,
  requireBorrowing: false,
  multiDigit: false,
  multiplicationTables: [2, 3, 4, 5],
  problemTypes: {
    standard: true,
    fillBlank: false,
    compare: false,
    missingOperator: false,
  },
  timedPractice: false,
  timeLimit: 5,
  progressiveDifficulty: false,
  skillFocus: {
    numberBonds: false,
    doubles: false,
    friendlyNumbers: false,
  },
  numWorksheets: 1,
  addDecorations: false,
  includeStickers: false,
  includeCertificate: false,
  accessibilityMode: false,
  highContrast: false,
  extraLargeFont: false,
};

/**
 * Hook for managing worksheet settings with validation
 */
export function useWorksheetSettings() {
  const [settings, setSettings] = useState<WorksheetSettings>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('worksheetSettings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const updateSettings = useCallback((updates: Partial<WorksheetSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      const errors = validateSettings(newSettings);
      setValidationErrors(errors);
      return newSettings;
    });
  }, []);

  // Validate on mount and settings change
  useEffect(() => {
    const errors = validateSettings(settings);
    setValidationErrors(errors);
  }, [settings]);

  return {
    settings,
    updateSettings,
    validationErrors,
    isValid: validationErrors.length === 0,
  };
}

/**
 * Hook for managing problem generation with loading states
 */
export function useProblemGeneration(settings: WorksheetSettings) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const generateProblems = useCallback(async () => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      // Simulate async generation (can be replaced with Web Worker for large batches)
      await new Promise(resolve => setTimeout(resolve, 100));

      const newProblems = generateAllWorksheetProblems(settings);
      setProblems(newProblems);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate problems');
    } finally {
      setIsGenerating(false);
    }
  }, [settings]);

  // Generate initial problems
  useEffect(() => {
    generateProblems();
  }, []); // Only on mount

  // Split problems into worksheets
  const worksheets = useMemo(() => {
    const result: Problem[][] = [];
    const problemsPerWorksheet = settings.numProblems;

    for (let w = 0; w < settings.numWorksheets; w++) {
      const start = w * problemsPerWorksheet;
      const worksheetProblems = problems.slice(start, start + problemsPerWorksheet);
      if (worksheetProblems.length > 0) {
        result.push(worksheetProblems);
      }
    }

    return result;
  }, [problems, settings.numProblems, settings.numWorksheets]);

  return {
    problems,
    worksheets,
    isGenerating,
    generationError,
    regenerateProblems: generateProblems,
  };
}

/**
 * Hook for managing saved templates
 */
export function useTemplateManager() {
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>(() => {
    const saved = localStorage.getItem('worksheetTemplates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const saveTemplate = useCallback((name: string, settings: WorksheetSettings) => {
    setSavedTemplates(prev => {
      const newTemplates = [...prev, { name, settings }];
      localStorage.setItem('worksheetTemplates', JSON.stringify(newTemplates));
      return newTemplates;
    });
  }, []);

  const loadTemplate = useCallback((template: SavedTemplate) => {
    return template.settings;
  }, []);

  const deleteTemplate = useCallback((index: number) => {
    setSavedTemplates(prev => {
      const newTemplates = prev.filter((_, i) => i !== index);
      localStorage.setItem('worksheetTemplates', JSON.stringify(newTemplates));
      return newTemplates;
    });
  }, []);

  return {
    savedTemplates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
  };
}

/**
 * Hook for auto-saving settings every 30 seconds
 */
export function useAutoSave(settings: WorksheetSettings, enabled: boolean = true) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const saveToLocalStorage = () => {
      setIsSaving(true);
      try {
        localStorage.setItem('worksheetSettings', JSON.stringify(settings));
        setLastSaved(new Date());
      } catch (error) {
        console.error('Failed to auto-save settings:', error);
      } finally {
        setIsSaving(false);
      }
    };

    // Save immediately on first mount
    saveToLocalStorage();

    // Auto-save every 30 seconds
    const interval = setInterval(saveToLocalStorage, 30000);

    return () => clearInterval(interval);
  }, [settings, enabled]);

  return {
    lastSaved,
    isSaving,
  };
}

/**
 * Hook for managing panel resize
 */
export function usePanelResize(initialWidth: number = 500) {
  const [panelWidth, setPanelWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth >= 350 && newWidth <= 800) {
          setPanelWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return {
    panelWidth,
    isResizing,
    startResizing: () => setIsResizing(true),
  };
}
