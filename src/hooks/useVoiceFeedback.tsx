/**
 * Voice Feedback (Text-to-Speech) system for React
 * Supports multi-language voice feedback with Web Speech API
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import {
  createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef,
} from 'react';
import type { Language } from '../i18n';

interface VoiceFeedbackContextType {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  speak: (text: string) => void;
  speakProblem: (num1: number, operation: string, num2: number) => void;
  cancel: () => void;
}

const VoiceFeedbackContext = createContext<VoiceFeedbackContextType | undefined>(undefined);

interface VoiceFeedbackProviderProps {
  children: ReactNode;
  language: Language;
}

// Language to speech synthesis lang codes mapping
const LANG_MAP: Record<Language, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  zh: 'zh-CN',
  kn: 'kn-IN',
  te: 'te-IN',
};

// Operation words in different languages
const OPERATION_WORDS: Record<Language, Record<string, string>> = {
  en: { '+': 'plus', '-': 'minus', '×': 'times', '÷': 'divided by' },
  es: { '+': 'más', '-': 'menos', '×': 'por', '÷': 'dividido por' },
  fr: { '+': 'plus', '-': 'moins', '×': 'fois', '÷': 'divisé par' },
  de: { '+': 'plus', '-': 'minus', '×': 'mal', '÷': 'geteilt durch' },
  zh: { '+': '加', '-': '减', '×': '乘', '÷': '除以' },
  kn: { '+': 'ಸೇರಿಸಿ', '-': 'ಕಳೆಯಿರಿ', '×': 'ಗುಣಿಸಿ', '÷': 'ಭಾಗಿಸಿ' },
  te: { '+': 'కూడిక', '-': 'తీసివేయి', '×': 'గుణించు', '÷': 'భాగించు' },
};

export function VoiceFeedbackProvider({ children, language }: VoiceFeedbackProviderProps) {
  const [enabled, setEnabledState] = useState<boolean>(false);
  // Store language in a ref so speak callbacks always see current value without
  // needing to be recreated on every language change.
  const languageRef = useRef<Language>(language);
  languageRef.current = language;

  // Load preference on mount only
  useEffect(() => {
    const saved = localStorage.getItem('mathplay_voice_feedback');
    if (saved === 'true') setEnabledState(true);
  }, []);

  // Cancel all speech on unmount to prevent zombie utterances
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const setEnabled = useCallback((isEnabled: boolean) => {
    setEnabledState(isEnabled);
    localStorage.setItem('mathplay_voice_feedback', String(isEnabled));
    if (!isEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const cancel = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback((text: string) => {
    if (!enabled) return;
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    const lang = languageRef.current;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_MAP[lang] ?? 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    utterance.onerror = (event) => {
      // 'interrupted' is fired when we cancel an utterance intentionally – not a real error.
      if (event.error !== 'interrupted') {
        console.error('Speech error:', event.error);
      }
    };

    const doSpeak = () => {
      // Cancel previous utterance before queuing a new one
      window.speechSynthesis.cancel();

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const langPrefix = (LANG_MAP[lang] ?? 'en').split('-')[0];
        const match = voices.find(v => v.lang.startsWith(langPrefix));
        if (match) utterance.voice = match;
      }
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      doSpeak();
    } else {
      // Voices not yet loaded – wait for the event, then clean it up
      const handler = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
      window.speechSynthesis.onvoiceschanged = handler;
    }
  }, [enabled]);

  const speakProblem = useCallback((num1: number, operation: string, num2: number) => {
    if (!enabled) return;
    const lang = languageRef.current;
    const opWord = OPERATION_WORDS[lang]?.[operation] ?? operation;
    speak(`${num1} ${opWord} ${num2}`);
  }, [enabled, speak]);

  return (
    <VoiceFeedbackContext.Provider value={{ enabled, setEnabled, speak, speakProblem, cancel }}>
      {children}
    </VoiceFeedbackContext.Provider>
  );
}

export function useVoiceFeedback() {
  const context = useContext(VoiceFeedbackContext);
  if (!context) {
    throw new Error('useVoiceFeedback must be used within VoiceFeedbackProvider');
  }
  return context;
}
