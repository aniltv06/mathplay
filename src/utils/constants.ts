/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 *
 * Centralised application constants.
 * Single source of truth for AVATAR_OPTIONS (previously duplicated in
 * ProfileSelector.tsx and EditProfileModal.tsx) and localStorage key strings.
 */

// ─── Avatar options ────────────────────────────────────────────────────────────

export const AVATAR_OPTIONS: string[] = [
  '👦', '👧', '🧒', '👶',
  '🐶', '🐱', '🐼', '🦊', '🐸', '🦁', '🐯', '🐻',
  '🐨', '🐰', '🦄', '🐙', '🦖', '🦕', '🐢', '🐝',
  '🦋', '🐵', '🐷', '🐮', '🐹', '🦉', '🦜', '🐧',
  '🦈', '🐳', '🦒', '🦏', '🦘', '🦥',
];

// ─── localStorage keys ─────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  profiles:          'mathplay_profiles',
  activeProfile:     'mathplay_currentProfileId',
  progress:          'mathplay_progress',
  lastTrack:         'mathplay_lastTrack',
  voiceFeedback:     'mathplay_voice_feedback',
  soundEffects:      'mathplay_sound_effects',
  theme:             'mathplay_theme',
  hangmanSettings:   'hangmanSettings',
  practiceSettings:  'practiceSettings',
  worksheetSettings: 'worksheetSettings',
  hangmanTheme:      'hangman_theme',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
