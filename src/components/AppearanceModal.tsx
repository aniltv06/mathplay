/**
 * Appearance Modal — GitHub-style theme preferences panel
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, type ThemeMode, type LightTheme, type DarkTheme } from '../context/ThemeContext';

// ─── Swatch preview mini-browser ──────────────────────────────────────────────

interface SwatchPreviewProps {
  bg: string;
  header: string;
  text: string;
}

function SwatchPreview({ bg, header, text }: SwatchPreviewProps) {
  return (
    <div style={{ width: 88, height: 60, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
      {/* Simulated title bar */}
      <div style={{
        height: 13,
        background: header,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        paddingLeft: 5,
      }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }}
          />
        ))}
      </div>
      {/* Simulated body */}
      <div style={{ background: bg, padding: '6px 7px', height: 'calc(100% - 13px)' }}>
        <div style={{ height: 3, width: '68%', background: text, borderRadius: 2, opacity: 0.75, marginBottom: 3 }} />
        <div style={{ height: 3, width: '45%', background: text, borderRadius: 2, opacity: 0.38, marginBottom: 5 }} />
        <div style={{ height: 8, width: '40%', background: header, borderRadius: 3, opacity: 0.9 }} />
      </div>
    </div>
  );
}

// ─── Individual swatch button ─────────────────────────────────────────────────

interface ThemeSwatchProps<T extends string> {
  id: T;
  name: string;
  preview: SwatchPreviewProps;
  selected: boolean;
  onClick: () => void;
}

function ThemeSwatch<T extends string>({ name, preview, selected, onClick }: ThemeSwatchProps<T>) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`Select ${name} theme`}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
        selected ? 'bg-purple-100' : 'hover:bg-gray-100'
      }`}
    >
      <div style={{
        border: `2px solid ${selected ? '#9333ea' : '#e5e7eb'}`,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        transition: 'border-color 0.15s',
      }}>
        <SwatchPreview {...preview} />
        {selected && (
          <div style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            width: 16,
            height: 16,
            background: '#9333ea',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Check style={{ width: 10, height: 10, color: 'white', strokeWidth: 3 }} />
          </div>
        )}
      </div>
      <span style={{
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 1.3,
        maxWidth: 88,
        color: selected ? '#7e22ce' : '#4b5563',
        fontWeight: selected ? 600 : 400,
        whiteSpace: 'pre-line',
      }}>
        {name}
      </span>
    </button>
  );
}

// ─── Theme data ───────────────────────────────────────────────────────────────

const LIGHT_THEMES: Array<{
  id: LightTheme;
  name: string;
  preview: SwatchPreviewProps;
}> = [
  {
    id: 'light',
    name: 'Light',
    preview: { bg: '#ffffff', header: '#7c3aed', text: '#111827' },
  },
  {
    id: 'light-protanopia',
    name: 'Protanopia &\nDeuteranopia',
    preview: { bg: '#ffffff', header: '#2563eb', text: '#111827' },
  },
  {
    id: 'light-tritanopia',
    name: 'Tritanopia',
    preview: { bg: '#ffffff', header: '#9333ea', text: '#111827' },
  },
];

const DARK_THEMES: Array<{
  id: DarkTheme;
  name: string;
  preview: SwatchPreviewProps;
}> = [
  {
    id: 'dark',
    name: 'Dark',
    preview: { bg: '#0d1117', header: '#3b82f6', text: '#e5eaf2' },
  },
  {
    id: 'dark-protanopia',
    name: 'Protanopia &\nDeuteranopia',
    preview: { bg: '#0d1117', header: '#60a5fa', text: '#e5eaf2' },
  },
  {
    id: 'dark-tritanopia',
    name: 'Tritanopia',
    preview: { bg: '#0d1117', header: '#a78bfa', text: '#e5eaf2' },
  },
  {
    id: 'soft-dark',
    name: 'Soft Dark',
    preview: { bg: '#22272e', header: '#539bf5', text: '#adbac7' },
  },
];

// ─── Mode option buttons ──────────────────────────────────────────────────────

const MODE_OPTIONS: Array<{ id: ThemeMode; label: string; Icon: typeof Sun }> = [
  { id: 'light',  label: 'Light',           Icon: Sun },
  { id: 'dark',   label: 'Dark',            Icon: Moon },
  { id: 'system', label: 'Sync with system', Icon: Monitor },
];

// ─── Contrast option row ──────────────────────────────────────────────────────

interface ContrastOptionProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description: string;
}

function ContrastOption({ checked, onChange, title, description }: ContrastOptionProps) {
  return (
    <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
      checked
        ? 'border-purple-400 bg-purple-50'
        : 'border-gray-200 hover:border-purple-300'
    }`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-purple-600 cursor-pointer flex-shrink-0"
      />
      <div>
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </label>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AppearanceModal({ isOpen, onClose }: Props) {
  const { prefs, resolvedMode, setMode, setLightTheme, setDarkTheme, setHighContrast } = useTheme();

  if (!isOpen) return null;

  const isSystemBased  = prefs.highContrastEnabled && prefs.highContrastSystemBased;
  const isAlwaysOn     = prefs.highContrastEnabled && !prefs.highContrastSystemBased;

  const handleSystemContrastChange = (checked: boolean) => {
    setHighContrast(checked, true);
  };

  const handleAlwaysContrastChange = (checked: boolean) => {
    setHighContrast(checked, false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="appearance-title"
        >
          {/* ── Header ── */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-3xl flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-hidden="true">🎨</span>
              <h2 id="appearance-title" className="text-2xl font-bold text-white">
                Appearance
              </h2>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close appearance settings"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="p-6 space-y-7">

            {/* ── Theme Mode ── */}
            <section aria-labelledby="theme-mode-label">
              <h3 id="theme-mode-label" className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Theme mode
              </h3>
              <div className="flex flex-wrap gap-2">
                {MODE_OPTIONS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setMode(id)}
                    aria-pressed={prefs.mode === id}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                      prefs.mode === id
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {label}
                    {prefs.mode === id && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                  </button>
                ))}
              </div>
              {prefs.mode === 'system' && (
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${resolvedMode === 'dark' ? 'bg-gray-700' : 'bg-yellow-400'}`} />
                  Currently using <strong className="text-gray-700">{resolvedMode}</strong> mode based on your system settings
                </p>
              )}
            </section>

            <div className="border-t border-gray-100" />

            {/* ── Color Theme ── */}
            <section aria-labelledby="color-theme-label">
              <h3 id="color-theme-label" className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Color theme
              </h3>

              {/* Light themes */}
              <div className="mb-5">
                <p className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                  Light themes
                </p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Light color theme">
                  {LIGHT_THEMES.map(theme => (
                    <ThemeSwatch
                      key={theme.id}
                      id={theme.id}
                      name={theme.name}
                      preview={theme.preview}
                      selected={prefs.lightTheme === theme.id}
                      onClick={() => setLightTheme(theme.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Dark themes */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                  Dark themes
                </p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Dark color theme">
                  {DARK_THEMES.map(theme => (
                    <ThemeSwatch
                      key={theme.id}
                      id={theme.id}
                      name={theme.name}
                      preview={theme.preview}
                      selected={prefs.darkTheme === theme.id}
                      onClick={() => setDarkTheme(theme.id)}
                    />
                  ))}
                </div>
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* ── Accessibility / Contrast ── */}
            <section aria-labelledby="contrast-label">
              <h3 id="contrast-label" className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Accessibility
              </h3>
              <p className="text-base font-semibold text-gray-800 mb-3">Increase contrast</p>
              <div className="space-y-3">
                <ContrastOption
                  checked={isSystemBased}
                  onChange={handleSystemContrastChange}
                  title="Use system setting"
                  description="Enable high contrast for light or dark mode (or both) based on your system settings"
                />
                <ContrastOption
                  checked={isAlwaysOn}
                  onChange={handleAlwaysContrastChange}
                  title="Always enable high contrast"
                  description="Always applies stronger borders, higher contrast text, and more prominent focus indicators regardless of system settings"
                />
              </div>
            </section>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
