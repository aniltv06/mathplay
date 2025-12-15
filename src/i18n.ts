/**
 * Internationalization (i18n) module for Math Fun Worksheet
 * Supports multiple languages: English, Spanish, French, German, Chinese
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import type { Language, Translations } from './types';

/**
 * English translations
 */
const en: Translations = {
  // Header
  appTitle: 'Math Fun!',
  greeting: "Let's solve some addition and subtraction!",

  // Profile Management
  selectProfile: 'Select Your Profile',
  createNewProfile: 'Create new profile...',
  createButton: 'Create',
  noProfiles: 'No profiles yet! Create one below to get started.',
  parentDashboard: 'Parent Dashboard',

  // Settings
  settings: 'Settings',
  customizeTitle: 'Customize Your Practice',
  chooseDifficulty: 'Choose Difficulty',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  easyDesc: 'Addition & Subtraction (1-10)',
  mediumDesc: 'All operations (1-20)',
  hardDesc: 'All operations (1-100)',
  customizeBelow: 'Or customize your own settings below',
  numProblems: 'Number of Problems:',
  maxNumber: 'Max Number:',
  minNumber: 'Min Number:',
  includeAddition: 'Include Addition',
  includeSubtraction: 'Include Subtraction',
  includeMultiplication: 'Include Multiplication',
  includeDivision: 'Include Division',
  timedChallenge: 'Timed Challenge',
  timeLimit: 'Time Limit (minutes):',
  voiceFeedback: 'Voice Feedback (Text-to-Speech)',
  voiceFeedbackDesc: 'Hear problems read aloud and get spoken encouragement!',
  language: 'Language:',
  generateNew: 'Generate New Problems',
  changeName: 'Change Name',

  // Instructions
  instructionsText: 'Write your answers in the boxes below and click "Check My Answers" to see how you did!',

  // Buttons
  clearAll: 'Clear All',
  printWorksheet: 'Print Worksheet',
  showAnswerKey: 'Show Answer Key (for printing)',
  hideAnswerKey: 'Hide Answer Key',
  checkAnswers: 'Check My Answers',
  select: 'Select',
  stats: 'Stats',
  delete: 'Delete',

  // Stats
  resultsTitle: 'Results',
  correct: 'Correct',
  wrong: 'Wrong',
  score: 'Score',
  totalSessions: 'Total Sessions',
  totalProblems: 'Total Problems',
  accuracy: 'Accuracy',
  bestStreak: 'Best Streak',
  timeSpent: 'Time Spent',

  // Messages
  greatJob: 'Great job!',
  tryAgain: 'Try again! You can do it!',
  fillRemaining: 'Fill in more:',
  timeUp: "Time's up! Let's see how you did!",
  badgeEarned: 'Badge Earned!',
  congratulations: 'Congratulations! You earned the',
  streakBonus: 'in a row! Amazing!',

  // Dashboard
  allProfiles: 'All Profiles',
  profileComparison: 'Profile Comparison',
  recentActivity: 'Recent Activity',
  badgeLeaderboard: 'Badge Leaderboard',
  sessions: 'sessions',
  problems: 'problems',
  badges: 'badges',

  // Sections
  additionProblems: 'Addition Problems',
  subtractionProblems: 'Subtraction Problems',
  multiplicationProblems: 'Multiplication Problems',
  divisionProblems: 'Division Problems',

  // Number pad
  question: 'Question',
  of: 'of',
  skip: 'Skip',
  next: 'Next',
  back: 'Back',

  // Operations (spoken)
  plus: 'plus',
  minus: 'minus',
  times: 'times',
  dividedBy: 'divided by'
};

/**
 * Spanish translations
 */
const es: Translations = {
  // Header
  appTitle: '¡Matemáticas Divertidas!',
  greeting: '¡Resolvamos sumas y restas!',

  // Profile Management
  selectProfile: 'Selecciona Tu Perfil',
  createNewProfile: 'Crear nuevo perfil...',
  createButton: 'Crear',
  noProfiles: '¡No hay perfiles aún! Crea uno abajo para comenzar.',
  parentDashboard: 'Panel de Padres',

  // Settings
  settings: 'Configuración',
  customizeTitle: 'Personaliza Tu Práctica',
  chooseDifficulty: 'Elige la Dificultad',
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',
  easyDesc: 'Suma y Resta (1-10)',
  mediumDesc: 'Todas las operaciones (1-20)',
  hardDesc: 'Todas las operaciones (1-100)',
  customizeBelow: 'O personaliza tu propia configuración abajo',
  numProblems: 'Número de Problemas:',
  maxNumber: 'Número Máximo:',
  minNumber: 'Número Mínimo:',
  includeAddition: 'Incluir Suma',
  includeSubtraction: 'Incluir Resta',
  includeMultiplication: 'Incluir Multiplicación',
  includeDivision: 'Incluir División',
  timedChallenge: 'Desafío Cronometrado',
  timeLimit: 'Límite de Tiempo (minutos):',
  voiceFeedback: 'Retroalimentación por Voz',
  voiceFeedbackDesc: '¡Escucha los problemas y recibe ánimo!',
  language: 'Idioma:',
  generateNew: 'Generar Nuevos Problemas',
  changeName: 'Cambiar Nombre',

  // Instructions
  instructionsText: '¡Escribe tus respuestas en las cajas y haz clic en "Revisar Mis Respuestas" para ver cómo te fue!',

  // Buttons
  clearAll: 'Limpiar Todo',
  printWorksheet: 'Imprimir Hoja',
  showAnswerKey: 'Mostrar Respuestas (para imprimir)',
  hideAnswerKey: 'Ocultar Respuestas',
  checkAnswers: 'Revisar Mis Respuestas',
  select: 'Seleccionar',
  stats: 'Estadísticas',
  delete: 'Eliminar',

  // Stats
  resultsTitle: 'Resultados',
  correct: 'Correctas',
  wrong: 'Incorrectas',
  score: 'Puntuación',
  totalSessions: 'Sesiones Totales',
  totalProblems: 'Problemas Totales',
  accuracy: 'Precisión',
  bestStreak: 'Mejor Racha',
  timeSpent: 'Tiempo Gastado',

  // Messages
  greatJob: '¡Buen trabajo!',
  tryAgain: '¡Inténtalo de nuevo! ¡Tú puedes!',
  fillRemaining: 'Completa más:',
  timeUp: '¡Se acabó el tiempo! ¡Veamos cómo te fue!',
  badgeEarned: '¡Insignia Ganada!',
  congratulations: '¡Felicidades! Ganaste la insignia',
  streakBonus: 'seguidas! ¡Increíble!',

  // Dashboard
  allProfiles: 'Todos los Perfiles',
  profileComparison: 'Comparación de Perfiles',
  recentActivity: 'Actividad Reciente',
  badgeLeaderboard: 'Tabla de Insignias',
  sessions: 'sesiones',
  problems: 'problemas',
  badges: 'insignias',

  // Sections
  additionProblems: 'Problemas de Suma',
  subtractionProblems: 'Problemas de Resta',
  multiplicationProblems: 'Problemas de Multiplicación',
  divisionProblems: 'Problemas de División',

  // Number pad
  question: 'Pregunta',
  of: 'de',
  skip: 'Saltar',
  next: 'Siguiente',
  back: 'Atrás',

  // Operations (spoken)
  plus: 'más',
  minus: 'menos',
  times: 'por',
  dividedBy: 'dividido por'
};

/**
 * French translations
 */
const fr: Translations = {
  // Header
  appTitle: 'Maths Amusantes!',
  greeting: 'Résolvons des additions et des soustractions!',

  // Profile Management
  selectProfile: 'Sélectionnez Votre Profil',
  createNewProfile: 'Créer un nouveau profil...',
  createButton: 'Créer',
  noProfiles: 'Pas encore de profils! Créez-en un ci-dessous pour commencer.',
  parentDashboard: 'Tableau de Bord Parent',

  // Settings
  settings: 'Paramètres',
  customizeTitle: 'Personnalisez Votre Pratique',
  chooseDifficulty: 'Choisissez la Difficulté',
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
  easyDesc: 'Addition et Soustraction (1-10)',
  mediumDesc: 'Toutes les opérations (1-20)',
  hardDesc: 'Toutes les opérations (1-100)',
  customizeBelow: 'Ou personnalisez vos propres paramètres ci-dessous',
  numProblems: 'Nombre de Problèmes:',
  maxNumber: 'Nombre Maximum:',
  minNumber: 'Nombre Minimum:',
  includeAddition: 'Inclure l\'Addition',
  includeSubtraction: 'Inclure la Soustraction',
  includeMultiplication: 'Inclure la Multiplication',
  includeDivision: 'Inclure la Division',
  timedChallenge: 'Défi Chronométré',
  timeLimit: 'Limite de Temps (minutes):',
  voiceFeedback: 'Retour Vocal',
  voiceFeedbackDesc: 'Écoutez les problèmes et recevez des encouragements!',
  language: 'Langue:',
  generateNew: 'Générer de Nouveaux Problèmes',
  changeName: 'Changer de Nom',

  // Instructions
  instructionsText: 'Écrivez vos réponses dans les cases ci-dessous et cliquez sur "Vérifier Mes Réponses" pour voir vos résultats!',

  // Buttons
  clearAll: 'Tout Effacer',
  printWorksheet: 'Imprimer la Feuille',
  showAnswerKey: 'Afficher les Réponses (pour impression)',
  hideAnswerKey: 'Masquer les Réponses',
  checkAnswers: 'Vérifier Mes Réponses',
  select: 'Sélectionner',
  stats: 'Statistiques',
  delete: 'Supprimer',

  // Stats
  resultsTitle: 'Résultats',
  correct: 'Correctes',
  wrong: 'Incorrectes',
  score: 'Score',
  totalSessions: 'Sessions Totales',
  totalProblems: 'Problèmes Totaux',
  accuracy: 'Précision',
  bestStreak: 'Meilleure Série',
  timeSpent: 'Temps Passé',

  // Messages
  greatJob: 'Excellent travail!',
  tryAgain: 'Réessayez! Vous pouvez le faire!',
  fillRemaining: 'Complétez plus:',
  timeUp: 'Temps écoulé! Voyons comment vous avez fait!',
  badgeEarned: 'Badge Gagné!',
  congratulations: 'Félicitations! Vous avez gagné le badge',
  streakBonus: 'd\'affilée! Incroyable!',

  // Dashboard
  allProfiles: 'Tous les Profils',
  profileComparison: 'Comparaison de Profils',
  recentActivity: 'Activité Récente',
  badgeLeaderboard: 'Classement des Badges',
  sessions: 'sessions',
  problems: 'problèmes',
  badges: 'badges',

  // Sections
  additionProblems: 'Problèmes d\'Addition',
  subtractionProblems: 'Problèmes de Soustraction',
  multiplicationProblems: 'Problèmes de Multiplication',
  divisionProblems: 'Problèmes de Division',

  // Number pad
  question: 'Question',
  of: 'de',
  skip: 'Passer',
  next: 'Suivant',
  back: 'Retour',

  // Operations (spoken)
  plus: 'plus',
  minus: 'moins',
  times: 'fois',
  dividedBy: 'divisé par'
};

/**
 * German translations
 */
const de: Translations = {
  // Header
  appTitle: 'Mathe Spaß!',
  greeting: 'Lass uns Addition und Subtraktion lösen!',

  // Profile Management
  selectProfile: 'Wähle Dein Profil',
  createNewProfile: 'Neues Profil erstellen...',
  createButton: 'Erstellen',
  noProfiles: 'Noch keine Profile! Erstelle unten eins um zu beginnen.',
  parentDashboard: 'Eltern-Dashboard',

  // Settings
  settings: 'Einstellungen',
  customizeTitle: 'Passe Deine Übung An',
  chooseDifficulty: 'Wähle den Schwierigkeitsgrad',
  easy: 'Einfach',
  medium: 'Mittel',
  hard: 'Schwer',
  easyDesc: 'Addition & Subtraktion (1-10)',
  mediumDesc: 'Alle Operationen (1-20)',
  hardDesc: 'Alle Operationen (1-100)',
  customizeBelow: 'Oder passe deine eigenen Einstellungen unten an',
  numProblems: 'Anzahl der Aufgaben:',
  maxNumber: 'Maximale Zahl:',
  minNumber: 'Minimale Zahl:',
  includeAddition: 'Addition Einbeziehen',
  includeSubtraction: 'Subtraktion Einbeziehen',
  includeMultiplication: 'Multiplikation Einbeziehen',
  includeDivision: 'Division Einbeziehen',
  timedChallenge: 'Zeitliche Herausforderung',
  timeLimit: 'Zeitlimit (Minuten):',
  voiceFeedback: 'Sprachfeedback',
  voiceFeedbackDesc: 'Höre Aufgaben vorgelesen und erhalte Ermutigung!',
  language: 'Sprache:',
  generateNew: 'Neue Aufgaben Generieren',
  changeName: 'Name Ändern',

  // Instructions
  instructionsText: 'Schreibe deine Antworten in die Kästchen und klicke auf "Antworten Überprüfen" um zu sehen, wie du abgeschnitten hast!',

  // Buttons
  clearAll: 'Alles Löschen',
  printWorksheet: 'Arbeitsblatt Drucken',
  showAnswerKey: 'Antworten Anzeigen (zum Drucken)',
  hideAnswerKey: 'Antworten Verbergen',
  checkAnswers: 'Antworten Überprüfen',
  select: 'Auswählen',
  stats: 'Statistiken',
  delete: 'Löschen',

  // Stats
  resultsTitle: 'Ergebnisse',
  correct: 'Richtig',
  wrong: 'Falsch',
  score: 'Punktzahl',
  totalSessions: 'Gesamt Sitzungen',
  totalProblems: 'Gesamt Aufgaben',
  accuracy: 'Genauigkeit',
  bestStreak: 'Beste Serie',
  timeSpent: 'Verwendete Zeit',

  // Messages
  greatJob: 'Großartige Arbeit!',
  tryAgain: 'Versuch es nochmal! Du schaffst das!',
  fillRemaining: 'Fülle mehr aus:',
  timeUp: 'Zeit ist um! Mal sehen, wie du abgeschnitten hast!',
  badgeEarned: 'Abzeichen Verdient!',
  congratulations: 'Glückwunsch! Du hast das Abzeichen verdient',
  streakBonus: 'hintereinander! Erstaunlich!',

  // Dashboard
  allProfiles: 'Alle Profile',
  profileComparison: 'Profilvergleich',
  recentActivity: 'Letzte Aktivität',
  badgeLeaderboard: 'Abzeichen-Rangliste',
  sessions: 'Sitzungen',
  problems: 'Aufgaben',
  badges: 'Abzeichen',

  // Sections
  additionProblems: 'Additions-Aufgaben',
  subtractionProblems: 'Subtraktions-Aufgaben',
  multiplicationProblems: 'Multiplikations-Aufgaben',
  divisionProblems: 'Divisions-Aufgaben',

  // Number pad
  question: 'Frage',
  of: 'von',
  skip: 'Überspringen',
  next: 'Weiter',
  back: 'Zurück',

  // Operations (spoken)
  plus: 'plus',
  minus: 'minus',
  times: 'mal',
  dividedBy: 'geteilt durch'
};

/**
 * Chinese (Simplified) translations
 */
const zh: Translations = {
  // Header
  appTitle: '数学乐园！',
  greeting: '让我们一起做加减法！',

  // Profile Management
  selectProfile: '选择您的个人资料',
  createNewProfile: '创建新个人资料...',
  createButton: '创建',
  noProfiles: '还没有个人资料！在下面创建一个开始吧。',
  parentDashboard: '家长仪表板',

  // Settings
  settings: '设置',
  customizeTitle: '自定义您的练习',
  chooseDifficulty: '选择难度',
  easy: '简单',
  medium: '中等',
  hard: '困难',
  easyDesc: '加法和减法 (1-10)',
  mediumDesc: '所有运算 (1-20)',
  hardDesc: '所有运算 (1-100)',
  customizeBelow: '或在下面自定义您自己的设置',
  numProblems: '问题数量：',
  maxNumber: '最大数字：',
  minNumber: '最小数字：',
  includeAddition: '包括加法',
  includeSubtraction: '包括减法',
  includeMultiplication: '包括乘法',
  includeDivision: '包括除法',
  timedChallenge: '限时挑战',
  timeLimit: '时间限制（分钟）：',
  voiceFeedback: '语音反馈',
  voiceFeedbackDesc: '听到题目朗读并获得鼓励！',
  language: '语言：',
  generateNew: '生成新题目',
  changeName: '更改名称',

  // Instructions
  instructionsText: '在下面的框中写下您的答案，然后点击"检查我的答案"查看结果！',

  // Buttons
  clearAll: '全部清除',
  printWorksheet: '打印工作表',
  showAnswerKey: '显示答案（用于打印）',
  hideAnswerKey: '隐藏答案',
  checkAnswers: '检查我的答案',
  select: '选择',
  stats: '统计',
  delete: '删除',

  // Stats
  resultsTitle: '结果',
  correct: '正确',
  wrong: '错误',
  score: '分数',
  totalSessions: '总练习次数',
  totalProblems: '总题目数',
  accuracy: '准确率',
  bestStreak: '最佳连胜',
  timeSpent: '用时',

  // Messages
  greatJob: '做得好！',
  tryAgain: '再试一次！你能做到！',
  fillRemaining: '填写更多：',
  timeUp: '时间到！让我们看看你做得怎么样！',
  badgeEarned: '获得徽章！',
  congratulations: '恭喜！你获得了徽章',
  streakBonus: '连对！太棒了！',

  // Dashboard
  allProfiles: '所有个人资料',
  profileComparison: '个人资料对比',
  recentActivity: '最近活动',
  badgeLeaderboard: '徽章排行榜',
  sessions: '次练习',
  problems: '题',
  badges: '徽章',

  // Sections
  additionProblems: '加法题',
  subtractionProblems: '减法题',
  multiplicationProblems: '乘法题',
  divisionProblems: '除法题',

  // Number pad
  question: '题目',
  of: '共',
  skip: '跳过',
  next: '下一题',
  back: '返回',

  // Operations (spoken)
  plus: '加',
  minus: '减',
  times: '乘',
  dividedBy: '除以'
};

/**
 * All translations
 */
const translations: Record<Language, Translations> = {
  en,
  es,
  fr,
  de,
  zh
};

/**
 * Language names for display
 */
export const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  zh: '中文'
};

/**
 * Current selected language
 */
let currentLanguage: Language = 'en';

/**
 * Get current language
 */
export function getCurrentLanguage(): Language {
  return currentLanguage;
}

/**
 * Set current language and save to localStorage
 */
export function setLanguage(lang: Language): void {
  currentLanguage = lang;
  localStorage.setItem('mathplay_language', lang);
}

/**
 * Load language from localStorage
 */
export function loadLanguage(): Language {
  const saved = localStorage.getItem('mathplay_language') as Language;
  if (saved && translations[saved]) {
    currentLanguage = saved;
    return saved;
  }
  return 'en';
}

/**
 * Get translation for a key
 */
export function t(key: keyof Translations): string {
  return translations[currentLanguage][key];
}

/**
 * Get all translations for current language
 */
export function getTranslations(): Translations {
  return translations[currentLanguage];
}
