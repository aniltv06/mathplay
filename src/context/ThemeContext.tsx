/**
 * Theme Context — manages appearance preferences (mode, color theme, contrast)
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark' | 'system';
export type LightTheme = 'light' | 'light-protanopia' | 'light-tritanopia';
export type DarkTheme = 'dark' | 'dark-protanopia' | 'dark-tritanopia' | 'soft-dark';

export interface ThemePreferences {
  mode: ThemeMode;
  lightTheme: LightTheme;
  darkTheme: DarkTheme;
  highContrastEnabled: boolean;
  highContrastSystemBased: boolean;
}

interface ThemeContextType {
  prefs: ThemePreferences;
  /** The mode that is actually active right now (light or dark) */
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  setLightTheme: (theme: LightTheme) => void;
  setDarkTheme: (theme: DarkTheme) => void;
  setHighContrast: (enabled: boolean, systemBased: boolean) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'mathplay_theme';

const DEFAULTS: ThemePreferences = {
  mode: 'system',
  lightTheme: 'light',
  darkTheme: 'dark',
  highContrastEnabled: false,
  highContrastSystemBased: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadPrefs(): ThemePreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function savePrefs(prefs: ThemePreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

/**
 * Applies the correct classes to <html> based on current preferences and
 * system state. Called on every preference change and system event.
 */
export function applyThemeToDOM(
  prefs: ThemePreferences,
  systemDark: boolean,
  systemHighContrast: boolean
): void {
  const root = document.documentElement;

  root.classList.remove('dark', 'soft-dark', 'theme-protan', 'theme-tritan', 'high-contrast');

  const isDark = prefs.mode === 'dark' || (prefs.mode === 'system' && systemDark);

  if (isDark) root.classList.add('dark');

  const variant = isDark ? prefs.darkTheme : prefs.lightTheme;
  if (variant === 'soft-dark') {
    root.classList.add('soft-dark');
  } else if (variant.includes('protanopia')) {
    root.classList.add('theme-protan');
  } else if (variant.includes('tritanopia')) {
    root.classList.add('theme-tritan');
  }

  if (prefs.highContrastEnabled) {
    const apply = prefs.highContrastSystemBased ? systemHighContrast : true;
    if (apply) root.classList.add('high-contrast');
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<ThemePreferences>(loadPrefs);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [systemHighContrast, setSystemHighContrast] = useState(
    () => window.matchMedia('(prefers-contrast: more)').matches
  );

  // Apply theme classes whenever anything changes
  useEffect(() => {
    applyThemeToDOM(prefs, systemDark, systemHighContrast);
  }, [prefs, systemDark, systemHighContrast]);

  // Listen for OS dark mode changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Listen for OS contrast preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-contrast: more)');
    const handler = (e: MediaQueryListEvent) => setSystemHighContrast(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const update = useCallback((updates: Partial<ThemePreferences>) => {
    setPrefs(prev => {
      const next = { ...prev, ...updates };
      savePrefs(next);
      return next;
    });
  }, []);

  const resolvedMode: 'light' | 'dark' =
    prefs.mode === 'dark' || (prefs.mode === 'system' && systemDark) ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{
      prefs,
      resolvedMode,
      setMode: (mode) => update({ mode }),
      setLightTheme: (lightTheme) => update({ lightTheme }),
      setDarkTheme: (darkTheme) => update({ darkTheme }),
      setHighContrast: (enabled, systemBased) =>
        update({ highContrastEnabled: enabled, highContrastSystemBased: systemBased }),
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
