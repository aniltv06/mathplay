/**
 * Voice Feedback (Text-to-Speech) system for React
 * Supports multi-language voice feedback with Web Speech API
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import { Language } from '../i18n';

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
const langMap: Record<Language, string> = {
  'en': 'en-US',
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'zh': 'zh-CN',
  'kn': 'kn-IN',  // Kannada (India)
  'te': 'te-IN'   // Telugu (India)
};

// Operation words in different languages
const operationWords: Record<Language, Record<string, string>> = {
  en: { '+': 'plus', '-': 'minus', '×': 'times', '÷': 'divided by' },
  es: { '+': 'más', '-': 'menos', '×': 'por', '÷': 'dividido por' },
  fr: { '+': 'plus', '-': 'moins', '×': 'fois', '÷': 'divisé par' },
  de: { '+': 'plus', '-': 'minus', '×': 'mal', '÷': 'geteilt durch' },
  zh: { '+': '加', '-': '减', '×': '乘', '÷': '除以' },
  kn: { '+': 'ಸೇರಿಸಿ', '-': 'ಕಳೆಯಿರಿ', '×': 'ಗುಣಿಸಿ', '÷': 'ಭಾಗಿಸಿ' },
  te: { '+': 'కూడిక', '-': 'తీసివేయి', '×': 'గುణించు', '÷': 'భాగించు' }
};

export function VoiceFeedbackProvider({ children, language }: VoiceFeedbackProviderProps) {
  const [enabled, setEnabledState] = useState<boolean>(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voice feedback preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mathplay_voice_feedback');
    if (saved === 'true') {
      setEnabledState(true);
    }
  }, []);

  // Save voice feedback preference to localStorage
  const setEnabled = useCallback((isEnabled: boolean) => {
    setEnabledState(isEnabled);
    localStorage.setItem('mathplay_voice_feedback', String(isEnabled));
  }, []);

  // Cancel any ongoing speech
  const cancel = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      currentUtteranceRef.current = null;
    }
  }, []);

  // Main speak function
  const speak = useCallback((text: string) => {
    if (!enabled) return;
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    try {
      // Cancel any previous speech
      window.speechSynthesis.cancel();

      // Small delay to ensure cancellation completes
      setTimeout(() => {
        actuallySpeak(text, language);
      }, 100);
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  }, [enabled, language]);

  // Separated function to actually perform speech
  const actuallySpeak = (text: string, lang: Language) => {
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtteranceRef.current = utterance;

    // Set voice properties
    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;

    // Event handlers
    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
    };

    utterance.onend = () => {
      currentUtteranceRef.current = null;
    };

    // Function to speak with voice selection
    const doSpeak = () => {
      const voices = window.speechSynthesis.getVoices();

      if (voices.length > 0) {
        const langPrefix = langMap[lang]?.split('-')[0] || 'en';
        const matchingVoice = voices.find(voice => voice.lang.startsWith(langPrefix));

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    };

    // Handle voice loading
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = doSpeak;
    } else {
      doSpeak();
    }
  };

  // Speak a math problem
  const speakProblem = useCallback((num1: number, operation: string, num2: number) => {
    if (!enabled) return;

    const opWord = operationWords[language][operation] || operation;
    const text = `${num1} ${opWord} ${num2}`;
    speak(text);
  }, [enabled, language, speak]);

  const value: VoiceFeedbackContextType = {
    enabled,
    setEnabled,
    speak,
    speakProblem,
    cancel
  };

  return (
    <VoiceFeedbackContext.Provider value={value}>
      {children}
    </VoiceFeedbackContext.Provider>
  );
}

/**
 * Hook to use voice feedback
 */
export function useVoiceFeedback() {
  const context = useContext(VoiceFeedbackContext);
  if (!context) {
    throw new Error('useVoiceFeedback must be used within VoiceFeedbackProvider');
  }
  return context;
}
