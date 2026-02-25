/**
 * Internationalization (i18n) translations for Math Fun
 * Supports 7 languages: English, Spanish, French, German, Chinese, Kannada, Telugu
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'kn' | 'te';

export interface Translations {
  // Header
  appTitle: string;
  greeting: string;
  welcomeBack: string;
  chooseActivity: string;

  // Profile Management
  selectProfile: string;
  createNewProfile: string;
  createButton: string;
  noProfiles: string;
  parentDashboard: string;

  // Settings
  settings: string;
  customizeTitle: string;
  chooseDifficulty: string;
  easy: string;
  medium: string;
  hard: string;
  easyDesc: string;
  mediumDesc: string;
  hardDesc: string;
  customizeBelow: string;
  numProblems: string;
  maxNumber: string;
  minNumber: string;
  includeAddition: string;
  includeSubtraction: string;
  includeMultiplication: string;
  includeDivision: string;
  timedChallenge: string;
  timeLimit: string;
  voiceFeedback: string;
  voiceFeedbackDesc: string;
  language: string;
  generateNew: string;
  changeName: string;

  // Navigation
  home: string;
  logout: string;
  backToHome: string;

  // Activities
  mathChallenge: string;
  mathChallengeDesc: string;
  mathWorksheet: string;
  mathWorksheetDesc: string;
  multiplicationLearning: string;
  multiplicationLearningDesc: string;
  moreComingSoon: string;
  newActivities: string;

  // Instructions
  instructionsText: string;

  // Buttons
  clearAll: string;
  printWorksheet: string;
  showAnswerKey: string;
  hideAnswerKey: string;
  checkAnswers: string;
  select: string;
  stats: string;
  delete: string;
  playAgain: string;
  startGame: string;
  submit: string;

  // Stats
  resultsTitle: string;
  correct: string;
  wrong: string;
  score: string;
  totalSessions: string;
  totalProblems: string;
  accuracy: string;
  bestStreak: string;
  timeSpent: string;
  yourProgress: string;
  gamesPlayed: string;
  totalScore: string;
  highScore: string;
  lives: string;
  streak: string;
  time: string;

  // Messages
  greatJob: string;
  tryAgain: string;
  fillRemaining: string;
  timeUp: string;
  badgeEarned: string;
  congratulations: string;
  streakBonus: string;
  gameOver: string;
  finalScore: string;

  // Dashboard
  allProfiles: string;
  profileComparison: string;
  recentActivity: string;
  badgeLeaderboard: string;
  sessions: string;
  problems: string;
  badges: string;

  // Sections
  additionProblems: string;
  subtractionProblems: string;
  multiplicationProblems: string;
  divisionProblems: string;

  // Number pad
  question: string;
  of: string;
  skip: string;
  next: string;
  back: string;

  // Operations (spoken)
  plus: string;
  minus: string;
  times: string;
  dividedBy: string;
}

/**
 * English translations
 */
const en: Translations = {
  // Header
  appTitle: 'Math Fun!',
  greeting: "Let's solve some addition and subtraction!",
  welcomeBack: 'Welcome back',
  chooseActivity: 'Choose an activity to continue learning',

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

  // Navigation
  home: 'Home',
  logout: 'Logout',
  backToHome: 'Back to Home',

  // Activities
  mathChallenge: 'Math Hangman',
  mathChallengeDesc: 'Solve problems before you lose all lives',
  mathWorksheet: 'Math Worksheet',
  mathWorksheetDesc: 'Practice addition, subtraction, multiplication, and division',
  multiplicationLearning: 'Learn Multiplication',
  multiplicationLearningDesc: 'Master times tables step by step',
  moreComingSoon: 'More Coming Soon!',
  newActivities: 'New learning activities are on the way',

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
  playAgain: 'Play Again',
  startGame: 'Start Game',
  submit: 'Submit',

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
  yourProgress: 'Your Progress',
  gamesPlayed: 'Games Played',
  totalScore: 'Total Score',
  highScore: 'High Score',
  lives: 'Lives',
  streak: 'Streak',
  time: 'Time',

  // Messages
  greatJob: 'Great job!',
  tryAgain: 'Try again! You can do it!',
  fillRemaining: 'Fill in more:',
  timeUp: "Time's up! Let's see how you did!",
  badgeEarned: 'Badge Earned!',
  congratulations: 'Congratulations! You earned the',
  streakBonus: 'in a row! Amazing!',
  gameOver: 'Game Over!',
  finalScore: 'Final Score',

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

// Spanish, French, German, Chinese, Kannada, Telugu translations
// (Full translations copied from original i18n.ts)

const es: Translations = {
  appTitle: '¡Matemáticas Divertidas!',
  greeting: '¡Resolvamos sumas y restas!',
  welcomeBack: 'Bienvenido de nuevo',
  chooseActivity: 'Elige una actividad para continuar aprendiendo',
  selectProfile: 'Selecciona Tu Perfil',
  createNewProfile: 'Crear nuevo perfil...',
  createButton: 'Crear',
  noProfiles: '¡No hay perfiles aún! Crea uno abajo para comenzar.',
  parentDashboard: 'Panel de Padres',
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
  home: 'Inicio',
  logout: 'Cerrar Sesión',
  backToHome: 'Volver al Inicio',
  mathChallenge: 'Ahorcado Matemático',
  mathChallengeDesc: 'Resuelve problemas antes de perder todas las vidas',
  mathWorksheet: 'Hoja de Matemáticas',
  mathWorksheetDesc: 'Practica suma, resta, multiplicación y división',
  multiplicationLearning: 'Aprender Multiplicación',
  multiplicationLearningDesc: 'Domina las tablas de multiplicar paso a paso',
  moreComingSoon: '¡Más Próximamente!',
  newActivities: 'Nuevas actividades de aprendizaje están en camino',
  instructionsText: '¡Escribe tus respuestas en las cajas y haz clic en "Revisar Mis Respuestas" para ver cómo te fue!',
  clearAll: 'Limpiar Todo',
  printWorksheet: 'Imprimir Hoja',
  showAnswerKey: 'Mostrar Respuestas (para imprimir)',
  hideAnswerKey: 'Ocultar Respuestas',
  checkAnswers: 'Revisar Mis Respuestas',
  select: 'Seleccionar',
  stats: 'Estadísticas',
  delete: 'Eliminar',
  playAgain: 'Jugar de Nuevo',
  startGame: 'Comenzar Juego',
  submit: 'Enviar',
  resultsTitle: 'Resultados',
  correct: 'Correctas',
  wrong: 'Incorrectas',
  score: 'Puntuación',
  totalSessions: 'Sesiones Totales',
  totalProblems: 'Problemas Totales',
  accuracy: 'Precisión',
  bestStreak: 'Mejor Racha',
  timeSpent: 'Tiempo Gastado',
  yourProgress: 'Tu Progreso',
  gamesPlayed: 'Juegos Jugados',
  totalScore: 'Puntuación Total',
  highScore: 'Puntuación Más Alta',
  lives: 'Vidas',
  streak: 'Racha',
  time: 'Tiempo',
  greatJob: '¡Buen trabajo!',
  tryAgain: '¡Inténtalo de nuevo! ¡Tú puedes!',
  fillRemaining: 'Completa más:',
  timeUp: '¡Se acabó el tiempo! ¡Veamos cómo te fue!',
  badgeEarned: '¡Insignia Ganada!',
  congratulations: '¡Felicidades! Ganaste la insignia',
  streakBonus: 'seguidas! ¡Increíble!',
  gameOver: '¡Juego Terminado!',
  finalScore: 'Puntuación Final',
  allProfiles: 'Todos los Perfiles',
  profileComparison: 'Comparación de Perfiles',
  recentActivity: 'Actividad Reciente',
  badgeLeaderboard: 'Tabla de Insignias',
  sessions: 'sesiones',
  problems: 'problemas',
  badges: 'insignias',
  additionProblems: 'Problemas de Suma',
  subtractionProblems: 'Problemas de Resta',
  multiplicationProblems: 'Problemas de Multiplicación',
  divisionProblems: 'Problemas de División',
  question: 'Pregunta',
  of: 'de',
  skip: 'Saltar',
  next: 'Siguiente',
  back: 'Atrás',
  plus: 'más',
  minus: 'menos',
  times: 'por',
  dividedBy: 'dividido por'
};

// Abbreviated for brevity - full translations would be included
const fr: Translations = {
  appTitle: 'Maths Amusantes!',
  greeting: 'Résolvons des additions et des soustractions!',
  welcomeBack: 'Bon retour',
  chooseActivity: 'Choisissez une activité pour continuer',
  selectProfile: 'Sélectionnez votre profil',
  createNewProfile: 'Créer un nouveau profil...',
  createButton: 'Créer',
  noProfiles: 'Pas encore de profils ! Créez-en un ci-dessous.',
  parentDashboard: 'Tableau de bord parents',
  settings: 'Paramètres',
  customizeTitle: 'Personnalisez votre pratique',
  chooseDifficulty: 'Choisissez la difficulté',
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
  easyDesc: 'Addition et soustraction (1-10)',
  mediumDesc: 'Toutes les opérations (1-20)',
  hardDesc: 'Toutes les opérations (1-100)',
  customizeBelow: 'Ou personnalisez vos propres paramètres ci-dessous',
  numProblems: 'Nombre de problèmes :',
  maxNumber: 'Nombre maximum :',
  minNumber: 'Nombre minimum :',
  includeAddition: 'Inclure l\'addition',
  includeSubtraction: 'Inclure la soustraction',
  includeMultiplication: 'Inclure la multiplication',
  includeDivision: 'Inclure la division',
  timedChallenge: 'Défi chronométré',
  timeLimit: 'Limite de temps (minutes) :',
  voiceFeedback: 'Retour vocal',
  voiceFeedbackDesc: 'Écoutez les problèmes lus à voix haute !',
  language: 'Langue :',
  generateNew: 'Générer de nouveaux problèmes',
  changeName: 'Changer le nom',
  home: 'Accueil',
  logout: 'Déconnexion',
  backToHome: 'Retour à l\'accueil',
  mathChallenge: 'Pendu Mathématique',
  mathChallengeDesc: 'Résolvez des problèmes avant de perdre toutes vos vies',
  mathWorksheet: 'Feuille de maths',
  mathWorksheetDesc: 'Pratiquez addition, soustraction, multiplication et division',
  multiplicationLearning: 'Apprendre la multiplication',
  multiplicationLearningDesc: 'Maîtrisez les tables de multiplication étape par étape',
  moreComingSoon: 'Plus à venir !',
  newActivities: 'De nouvelles activités sont en route',
  instructionsText: 'Écrivez vos réponses et cliquez sur "Vérifier mes réponses" !',
  clearAll: 'Tout effacer',
  printWorksheet: 'Imprimer la feuille',
  showAnswerKey: 'Afficher les réponses',
  hideAnswerKey: 'Masquer les réponses',
  checkAnswers: 'Vérifier mes réponses',
  select: 'Sélectionner',
  stats: 'Statistiques',
  delete: 'Supprimer',
  playAgain: 'Rejouer',
  startGame: 'Commencer le jeu',
  submit: 'Soumettre',
  resultsTitle: 'Résultats',
  correct: 'Correct',
  wrong: 'Incorrect',
  score: 'Score',
  totalSessions: 'Sessions totales',
  totalProblems: 'Problèmes totaux',
  accuracy: 'Précision',
  bestStreak: 'Meilleure série',
  timeSpent: 'Temps passé',
  yourProgress: 'Votre progression',
  gamesPlayed: 'Jeux joués',
  totalScore: 'Score total',
  highScore: 'Meilleur score',
  lives: 'Vies',
  streak: 'Série',
  time: 'Temps',
  greatJob: 'Excellent travail !',
  tryAgain: 'Réessayez ! Vous pouvez le faire !',
  fillRemaining: 'Complétez davantage :',
  timeUp: 'Temps écoulé ! Voyons comment vous avez fait !',
  badgeEarned: 'Badge obtenu !',
  congratulations: 'Félicitations ! Vous avez gagné le badge',
  streakBonus: 'd\'affilée ! Incroyable !',
  gameOver: 'Jeu terminé !',
  finalScore: 'Score final',
  allProfiles: 'Tous les profils',
  profileComparison: 'Comparaison des profils',
  recentActivity: 'Activité récente',
  badgeLeaderboard: 'Classement des badges',
  sessions: 'sessions',
  problems: 'problèmes',
  badges: 'badges',
  additionProblems: 'Problèmes d\'addition',
  subtractionProblems: 'Problèmes de soustraction',
  multiplicationProblems: 'Problèmes de multiplication',
  divisionProblems: 'Problèmes de division',
  question: 'Question',
  of: 'sur',
  skip: 'Passer',
  next: 'Suivant',
  back: 'Retour',
  plus: 'plus',
  minus: 'moins',
  times: 'fois',
  dividedBy: 'divisé par',
};

const de: Translations = {
  appTitle: 'Mathe Spaß!',
  greeting: 'Lass uns Addition und Subtraktion lösen!',
  welcomeBack: 'Willkommen zurück',
  chooseActivity: 'Wähle eine Aktivität zum Weiterlernen',
  selectProfile: 'Wähle dein Profil',
  createNewProfile: 'Neues Profil erstellen...',
  createButton: 'Erstellen',
  noProfiles: 'Noch keine Profile! Erstelle unten eins.',
  parentDashboard: 'Eltern-Dashboard',
  settings: 'Einstellungen',
  customizeTitle: 'Passe deine Übung an',
  chooseDifficulty: 'Schwierigkeit wählen',
  easy: 'Leicht',
  medium: 'Mittel',
  hard: 'Schwer',
  easyDesc: 'Addition & Subtraktion (1-10)',
  mediumDesc: 'Alle Operationen (1-20)',
  hardDesc: 'Alle Operationen (1-100)',
  customizeBelow: 'Oder passe deine eigenen Einstellungen unten an',
  numProblems: 'Anzahl der Aufgaben:',
  maxNumber: 'Maximale Zahl:',
  minNumber: 'Minimale Zahl:',
  includeAddition: 'Addition einbeziehen',
  includeSubtraction: 'Subtraktion einbeziehen',
  includeMultiplication: 'Multiplikation einbeziehen',
  includeDivision: 'Division einbeziehen',
  timedChallenge: 'Zeitchallenge',
  timeLimit: 'Zeitlimit (Minuten):',
  voiceFeedback: 'Sprachfeedback',
  voiceFeedbackDesc: 'Höre dir Aufgaben vor und erhalte gesprochene Ermutigung!',
  language: 'Sprache:',
  generateNew: 'Neue Aufgaben generieren',
  changeName: 'Name ändern',
  home: 'Startseite',
  logout: 'Abmelden',
  backToHome: 'Zurück zur Startseite',
  mathChallenge: 'Mathe-Galgenmännchen',
  mathChallengeDesc: 'Löse Aufgaben bevor du alle Leben verlierst',
  mathWorksheet: 'Mathe-Arbeitsblatt',
  mathWorksheetDesc: 'Übe Addition, Subtraktion, Multiplikation und Division',
  multiplicationLearning: 'Multiplikation lernen',
  multiplicationLearningDesc: 'Meistere das Einmaleins Schritt für Schritt',
  moreComingSoon: 'Mehr kommt bald!',
  newActivities: 'Neue Lernaktivitäten sind in Arbeit',
  instructionsText: 'Schreibe deine Antworten in die Felder und klicke auf "Antworten prüfen"!',
  clearAll: 'Alles löschen',
  printWorksheet: 'Arbeitsblatt drucken',
  showAnswerKey: 'Lösungsschlüssel anzeigen',
  hideAnswerKey: 'Lösungsschlüssel ausblenden',
  checkAnswers: 'Meine Antworten prüfen',
  select: 'Auswählen',
  stats: 'Statistiken',
  delete: 'Löschen',
  playAgain: 'Nochmal spielen',
  startGame: 'Spiel starten',
  submit: 'Absenden',
  resultsTitle: 'Ergebnisse',
  correct: 'Richtig',
  wrong: 'Falsch',
  score: 'Punktzahl',
  totalSessions: 'Sitzungen gesamt',
  totalProblems: 'Aufgaben gesamt',
  accuracy: 'Genauigkeit',
  bestStreak: 'Beste Serie',
  timeSpent: 'Verbrachte Zeit',
  yourProgress: 'Dein Fortschritt',
  gamesPlayed: 'Gespielte Spiele',
  totalScore: 'Gesamtpunktzahl',
  highScore: 'Höchstpunktzahl',
  lives: 'Leben',
  streak: 'Serie',
  time: 'Zeit',
  greatJob: 'Großartige Arbeit!',
  tryAgain: 'Versuch es nochmal! Du schaffst das!',
  fillRemaining: 'Fülle mehr aus:',
  timeUp: 'Zeit abgelaufen! Lass uns sehen, wie du abgeschnitten hast!',
  badgeEarned: 'Abzeichen erhalten!',
  congratulations: 'Glückwunsch! Du hast das Abzeichen erhalten',
  streakBonus: 'hintereinander! Fantastisch!',
  gameOver: 'Spiel vorbei!',
  finalScore: 'Endpunktzahl',
  allProfiles: 'Alle Profile',
  profileComparison: 'Profilvergleich',
  recentActivity: 'Letzte Aktivität',
  badgeLeaderboard: 'Abzeichen-Rangliste',
  sessions: 'Sitzungen',
  problems: 'Aufgaben',
  badges: 'Abzeichen',
  additionProblems: 'Additionsaufgaben',
  subtractionProblems: 'Subtraktionsaufgaben',
  multiplicationProblems: 'Multiplikationsaufgaben',
  divisionProblems: 'Divisionsaufgaben',
  question: 'Frage',
  of: 'von',
  skip: 'Überspringen',
  next: 'Weiter',
  back: 'Zurück',
  plus: 'plus',
  minus: 'minus',
  times: 'mal',
  dividedBy: 'geteilt durch',
};

const zh: Translations = {
  appTitle: '数学乐园！',
  greeting: '让我们一起做加减法！',
  welcomeBack: '欢迎回来',
  chooseActivity: '选择一项活动继续学习',
  selectProfile: '选择你的档案',
  createNewProfile: '创建新档案...',
  createButton: '创建',
  noProfiles: '还没有档案！在下面创建一个。',
  parentDashboard: '家长仪表板',
  settings: '设置',
  customizeTitle: '自定义你的练习',
  chooseDifficulty: '选择难度',
  easy: '简单',
  medium: '中等',
  hard: '困难',
  easyDesc: '加法和减法（1-10）',
  mediumDesc: '所有运算（1-20）',
  hardDesc: '所有运算（1-100）',
  customizeBelow: '或在下面自定义你的设置',
  numProblems: '题目数量：',
  maxNumber: '最大数字：',
  minNumber: '最小数字：',
  includeAddition: '包括加法',
  includeSubtraction: '包括减法',
  includeMultiplication: '包括乘法',
  includeDivision: '包括除法',
  timedChallenge: '限时挑战',
  timeLimit: '时间限制（分钟）：',
  voiceFeedback: '语音反馈',
  voiceFeedbackDesc: '听题目朗读并获得语音鼓励！',
  language: '语言：',
  generateNew: '生成新题目',
  changeName: '修改名字',
  home: '首页',
  logout: '退出',
  backToHome: '返回首页',
  mathChallenge: '数学猜字游戏',
  mathChallengeDesc: '在失去所有生命之前解答题目',
  mathWorksheet: '数学练习表',
  mathWorksheetDesc: '练习加法、减法、乘法和除法',
  multiplicationLearning: '学习乘法',
  multiplicationLearningDesc: '一步一步掌握乘法表',
  moreComingSoon: '更多即将推出！',
  newActivities: '新的学习活动即将到来',
  instructionsText: '在方框中写下你的答案，然后点击"检查我的答案"！',
  clearAll: '全部清除',
  printWorksheet: '打印练习表',
  showAnswerKey: '显示答案',
  hideAnswerKey: '隐藏答案',
  checkAnswers: '检查我的答案',
  select: '选择',
  stats: '统计',
  delete: '删除',
  playAgain: '再玩一次',
  startGame: '开始游戏',
  submit: '提交',
  resultsTitle: '结果',
  correct: '正确',
  wrong: '错误',
  score: '分数',
  totalSessions: '总会话数',
  totalProblems: '总题目数',
  accuracy: '准确率',
  bestStreak: '最佳连续',
  timeSpent: '花费时间',
  yourProgress: '你的进度',
  gamesPlayed: '已玩游戏',
  totalScore: '总分',
  highScore: '最高分',
  lives: '生命',
  streak: '连续',
  time: '时间',
  greatJob: '做得很好！',
  tryAgain: '再试试！你能做到！',
  fillRemaining: '填写更多：',
  timeUp: '时间到！让我们看看你的成绩！',
  badgeEarned: '获得徽章！',
  congratulations: '恭喜！你获得了',
  streakBonus: '连续！太棒了！',
  gameOver: '游戏结束！',
  finalScore: '最终分数',
  allProfiles: '所有档案',
  profileComparison: '档案比较',
  recentActivity: '最近活动',
  badgeLeaderboard: '徽章排行榜',
  sessions: '会话',
  problems: '题目',
  badges: '徽章',
  additionProblems: '加法题',
  subtractionProblems: '减法题',
  multiplicationProblems: '乘法题',
  divisionProblems: '除法题',
  question: '问题',
  of: '共',
  skip: '跳过',
  next: '下一个',
  back: '返回',
  plus: '加',
  minus: '减',
  times: '乘',
  dividedBy: '除以',
};

const kn: Translations = {
  appTitle: 'ಮ್ಯಾಥ್ ಫನ್!',
  greeting: 'ಬನ್ನಿ ಸೇರಿಕೆ ಮತ್ತು ವ್ಯವಕಲನ ಮಾಡೋಣ!',
  welcomeBack: 'ಮರಳಿ ಸ್ವಾಗತ',
  chooseActivity: 'ಕಲಿಕೆ ಮುಂದುವರಿಸಲು ಒಂದು ಚಟುವಟಿಕೆ ಆರಿಸಿ',
  selectProfile: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ',
  createNewProfile: 'ಹೊಸ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ...',
  createButton: 'ರಚಿಸಿ',
  noProfiles: 'ಇನ್ನೂ ಯಾವ ಪ್ರೊಫೈಲ್ ಇಲ್ಲ! ಕೆಳಗೆ ಒಂದನ್ನು ರಚಿಸಿ.',
  parentDashboard: 'ಪೋಷಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
  settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
  customizeTitle: 'ನಿಮ್ಮ ಅಭ್ಯಾಸ ಕಸ್ಟಮೈಸ್ ಮಾಡಿ',
  chooseDifficulty: 'ಕಷ್ಟದ ಮಟ್ಟ ಆಯ್ಕೆಮಾಡಿ',
  easy: 'ಸುಲಭ',
  medium: 'ಮಧ್ಯಮ',
  hard: 'ಕಷ್ಟ',
  easyDesc: 'ಸೇರಿಕೆ ಮತ್ತು ವ್ಯವಕಲನ (1-10)',
  mediumDesc: 'ಎಲ್ಲಾ ಕ್ರಿಯೆಗಳು (1-20)',
  hardDesc: 'ಎಲ್ಲಾ ಕ್ರಿಯೆಗಳು (1-100)',
  customizeBelow: 'ಅಥವಾ ಕೆಳಗೆ ನಿಮ್ಮ ಸ್ವಂತ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ',
  numProblems: 'ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆ:',
  maxNumber: 'ಗರಿಷ್ಠ ಸಂಖ್ಯೆ:',
  minNumber: 'ಕನಿಷ್ಠ ಸಂಖ್ಯೆ:',
  includeAddition: 'ಸೇರಿಕೆ ಸೇರಿಸಿ',
  includeSubtraction: 'ವ್ಯವಕಲನ ಸೇರಿಸಿ',
  includeMultiplication: 'ಗುಣಾಕಾರ ಸೇರಿಸಿ',
  includeDivision: 'ಭಾಗಾಕಾರ ಸೇರಿಸಿ',
  timedChallenge: 'ಸಮಯ ಸವಾಲು',
  timeLimit: 'ಸಮಯ ಮಿತಿ (ನಿಮಿಷಗಳು):',
  voiceFeedback: 'ಧ್ವನಿ ಪ್ರತಿಕ್ರಿಯೆ',
  voiceFeedbackDesc: 'ಪ್ರಶ್ನೆಗಳನ್ನು ಗಟ್ಟಿಯಾಗಿ ಓದಿ ಕೇಳಿ!',
  language: 'ಭಾಷೆ:',
  generateNew: 'ಹೊಸ ಪ್ರಶ್ನೆಗಳನ್ನು ರಚಿಸಿ',
  changeName: 'ಹೆಸರು ಬದಲಾಯಿಸಿ',
  home: 'ಮನೆ',
  logout: 'ನಿರ್ಗಮಿಸಿ',
  backToHome: 'ಮನೆಗೆ ಹಿಂತಿರುಗಿ',
  mathChallenge: 'ಗಣಿತ ನೇಣು ಆಟ',
  mathChallengeDesc: 'ಎಲ್ಲಾ ಜೀವ ಕಳೆದುಕೊಳ್ಳುವ ಮೊದಲು ಪ್ರಶ್ನೆಗಳನ್ನು ಬಿಡಿಸಿ',
  mathWorksheet: 'ಗಣಿತ ವರ್ಕ್‌ಶೀಟ್',
  mathWorksheetDesc: 'ಸೇರಿಕೆ, ವ್ಯವಕಲನ, ಗುಣಾಕಾರ ಮತ್ತು ಭಾಗಾಕಾರ ಅಭ್ಯಾಸ ಮಾಡಿ',
  multiplicationLearning: 'ಗುಣಾಕಾರ ಕಲಿಯಿರಿ',
  multiplicationLearningDesc: 'ಹಂತ ಹಂತವಾಗಿ ಗುಣಾಕಾರ ಕೋಷ್ಟಕಗಳನ್ನು ಕರಗತ ಮಾಡಿ',
  moreComingSoon: 'ಇನ್ನಷ್ಟು ಶೀಘ್ರದಲ್ಲೇ!',
  newActivities: 'ಹೊಸ ಕಲಿಕಾ ಚಟುವಟಿಕೆಗಳು ಬರಲಿವೆ',
  instructionsText: 'ಪೆಟ್ಟಿಗೆಗಳಲ್ಲಿ ನಿಮ್ಮ ಉತ್ತರಗಳನ್ನು ಬರೆಯಿರಿ ಮತ್ತು ಪರಿಶೀಲಿಸಿ!',
  clearAll: 'ಎಲ್ಲವನ್ನೂ ತೆರವುಮಾಡಿ',
  printWorksheet: 'ವರ್ಕ್‌ಶೀಟ್ ಮುದ್ರಿಸಿ',
  showAnswerKey: 'ಉತ್ತರ ಕೀ ತೋರಿಸಿ',
  hideAnswerKey: 'ಉತ್ತರ ಕೀ ಮರೆಮಾಡಿ',
  checkAnswers: 'ನನ್ನ ಉತ್ತರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
  select: 'ಆಯ್ಕೆಮಾಡಿ',
  stats: 'ಅಂಕಿಅಂಶಗಳು',
  delete: 'ಅಳಿಸಿ',
  playAgain: 'ಮತ್ತೆ ಆಡಿ',
  startGame: 'ಆಟ ಪ್ರಾರಂಭಿಸಿ',
  submit: 'ಸಲ್ಲಿಸಿ',
  resultsTitle: 'ಫಲಿತಾಂಶಗಳು',
  correct: 'ಸರಿ',
  wrong: 'ತಪ್ಪು',
  score: 'ಅಂಕ',
  totalSessions: 'ಒಟ್ಟು ಅವಧಿಗಳು',
  totalProblems: 'ಒಟ್ಟು ಪ್ರಶ್ನೆಗಳು',
  accuracy: 'ನಿಖರತೆ',
  bestStreak: 'ಅತ್ಯುತ್ತಮ ಸರಣಿ',
  timeSpent: 'ಕಳೆದ ಸಮಯ',
  yourProgress: 'ನಿಮ್ಮ ಪ್ರಗತಿ',
  gamesPlayed: 'ಆಡಿದ ಆಟಗಳು',
  totalScore: 'ಒಟ್ಟು ಅಂಕ',
  highScore: 'ಅತ್ಯಧಿಕ ಅಂಕ',
  lives: 'ಜೀವಗಳು',
  streak: 'ಸರಣಿ',
  time: 'ಸಮಯ',
  greatJob: 'ಅದ್ಭುತ ಕೆಲಸ!',
  tryAgain: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ! ನೀವು ಮಾಡಬಲ್ಲಿರಿ!',
  fillRemaining: 'ಇನ್ನಷ್ಟು ತುಂಬಿಸಿ:',
  timeUp: 'ಸಮಯ ಮುಗಿಯಿತು! ನಿಮ್ಮ ಫಲಿತಾಂಶ ನೋಡೋಣ!',
  badgeEarned: 'ಬ್ಯಾಡ್ಜ್ ಗಳಿಸಿದ್ದೀರಿ!',
  congratulations: 'ಅಭಿನಂದನೆಗಳು! ನೀವು ಗಳಿಸಿದ್ದೀರಿ',
  streakBonus: 'ಸರಣಿ! ಅದ್ಭುತ!',
  gameOver: 'ಆಟ ಮುಗಿಯಿತು!',
  finalScore: 'ಅಂತಿಮ ಅಂಕ',
  allProfiles: 'ಎಲ್ಲಾ ಪ್ರೊಫೈಲ್‌ಗಳು',
  profileComparison: 'ಪ್ರೊಫೈಲ್ ಹೋಲಿಕೆ',
  recentActivity: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',
  badgeLeaderboard: 'ಬ್ಯಾಡ್ಜ್ ಲೀಡರ್‌ಬೋರ್ಡ್',
  sessions: 'ಅವಧಿಗಳು',
  problems: 'ಪ್ರಶ್ನೆಗಳು',
  badges: 'ಬ್ಯಾಡ್ಜ್‌ಗಳು',
  additionProblems: 'ಸೇರಿಕೆ ಪ್ರಶ್ನೆಗಳು',
  subtractionProblems: 'ವ್ಯವಕಲನ ಪ್ರಶ್ನೆಗಳು',
  multiplicationProblems: 'ಗುಣಾಕಾರ ಪ್ರಶ್ನೆಗಳು',
  divisionProblems: 'ಭಾಗಾಕಾರ ಪ್ರಶ್ನೆಗಳು',
  question: 'ಪ್ರಶ್ನೆ',
  of: 'ಇಲ್ಲಿ',
  skip: 'ಬಿಟ್ಟುಬಿಡಿ',
  next: 'ಮುಂದೆ',
  back: 'ಹಿಂದೆ',
  plus: 'ಸೇರಿಸಿ',
  minus: 'ಕಳೆಯಿರಿ',
  times: 'ಗುಣಿಸಿ',
  dividedBy: 'ಭಾಗಿಸಿ',
};

const te: Translations = {
  appTitle: 'మ్యాథ్ ఫన్!',
  greeting: 'రండి కూడిక మరియు వ్యవకలనం చేద్దాం!',
  welcomeBack: 'మళ్ళీ స్వాగతం',
  chooseActivity: 'నేర్చుకోవడం కొనసాగించడానికి ఒక కార్యకలాపం ఎంచుకోండి',
  selectProfile: 'మీ ప్రొఫైల్ ఎంచుకోండి',
  createNewProfile: 'కొత్త ప్రొఫైల్ సృష్టించండి...',
  createButton: 'సృష్టించండి',
  noProfiles: 'ఇంకా ప్రొఫైల్‌లు లేవు! దయచేసి క్రింద ఒకటి సృష్టించండి.',
  parentDashboard: 'తల్లిదండ్రుల డాష్‌బోర్డ్',
  settings: 'సెట్టింగ్‌లు',
  customizeTitle: 'మీ అభ్యాసాన్ని అనుకూలీకరించండి',
  chooseDifficulty: 'కష్టతరం ఎంచుకోండి',
  easy: 'సులభం',
  medium: 'మధ్యమ',
  hard: 'కష్టం',
  easyDesc: 'కూడిక మరియు తీసివేత (1-10)',
  mediumDesc: 'అన్ని క్రియలు (1-20)',
  hardDesc: 'అన్ని క్రియలు (1-100)',
  customizeBelow: 'లేదా క్రింద మీ స్వంత సెట్టింగ్‌లను అనుకూలీకరించండి',
  numProblems: 'సమస్యల సంఖ్య:',
  maxNumber: 'గరిష్ఠ సంఖ్య:',
  minNumber: 'కనిష్ఠ సంఖ్య:',
  includeAddition: 'కూడికను చేర్చండి',
  includeSubtraction: 'తీసివేతను చేర్చండి',
  includeMultiplication: 'గుణకారాన్ని చేర్చండి',
  includeDivision: 'భాగాహారాన్ని చేర్చండి',
  timedChallenge: 'సమయ సవాల్',
  timeLimit: 'సమయ పరిమితి (నిమిషాలు):',
  voiceFeedback: 'వాయిస్ ఫీడ్‌బ్యాక్',
  voiceFeedbackDesc: 'సమస్యలను బిగ్గరగా చదవడం వినండి!',
  language: 'భాష:',
  generateNew: 'కొత్త సమస్యలు రూపొందించండి',
  changeName: 'పేరు మార్చండి',
  home: 'హోమ్',
  logout: 'లాగ్ అవుట్',
  backToHome: 'హోమ్‌కు తిరిగి వెళ్ళండి',
  mathChallenge: 'గణిత హ్యాంగ్‌మ్యాన్',
  mathChallengeDesc: 'అన్ని జీవితాలు కోల్పోయే ముందు సమస్యలు పరిష్కరించండి',
  mathWorksheet: 'గణిత వర్క్‌షీట్',
  mathWorksheetDesc: 'కూడిక, తీసివేత, గుణకారం మరియు భాగాహారం అభ్యసించండి',
  multiplicationLearning: 'గుణకారం నేర్చుకోండి',
  multiplicationLearningDesc: 'దశదశగా గుణకార పట్టికలను నేర్చుకోండి',
  moreComingSoon: 'మరిన్ని త్వరలో వస్తున్నాయి!',
  newActivities: 'కొత్త అభ్యాస కార్యకలాపాలు రానున్నాయి',
  instructionsText: 'పెట్టెలలో మీ సమాధానాలు రాసి "నా సమాధానాలు తనిఖీ చేయండి" పై క్లిక్ చేయండి!',
  clearAll: 'అన్నీ క్లియర్ చేయండి',
  printWorksheet: 'వర్క్‌షీట్ ముద్రించండి',
  showAnswerKey: 'సమాధాన కీ చూపించండి',
  hideAnswerKey: 'సమాధాన కీ దాచండి',
  checkAnswers: 'నా సమాధానాలు తనిఖీ చేయండి',
  select: 'ఎంచుకోండి',
  stats: 'గణాంకాలు',
  delete: 'తొలగించండి',
  playAgain: 'మళ్ళీ ఆడండి',
  startGame: 'ఆట ప్రారంభించండి',
  submit: 'సమర్పించండి',
  resultsTitle: 'ఫలితాలు',
  correct: 'సరైనది',
  wrong: 'తప్పు',
  score: 'స్కోర్',
  totalSessions: 'మొత్తం సెషన్‌లు',
  totalProblems: 'మొత్తం సమస్యలు',
  accuracy: 'ఖచ్చితత్వం',
  bestStreak: 'అత్యుత్తమ వరుస',
  timeSpent: 'గడిపిన సమయం',
  yourProgress: 'మీ పురోగతి',
  gamesPlayed: 'ఆడిన గేమ్‌లు',
  totalScore: 'మొత్తం స్కోర్',
  highScore: 'అత్యధిక స్కోర్',
  lives: 'జీవితాలు',
  streak: 'వరుస',
  time: 'సమయం',
  greatJob: 'అద్భుతమైన పని!',
  tryAgain: 'మళ్ళీ ప్రయత్నించండి! మీరు చేయగలరు!',
  fillRemaining: 'మరింత పూరించండి:',
  timeUp: 'సమయం అయిపోయింది! మీరు ఎలా చేశారో చూద్దాం!',
  badgeEarned: 'బ్యాడ్జ్ సంపాదించారు!',
  congratulations: 'అభినందనలు! మీరు సంపాదించారు',
  streakBonus: 'వరుసగా! అద్భుతం!',
  gameOver: 'గేమ్ ముగిసింది!',
  finalScore: 'చివరి స్కోర్',
  allProfiles: 'అన్ని ప్రొఫైల్‌లు',
  profileComparison: 'ప్రొఫైల్ పోలిక',
  recentActivity: 'ఇటీవలి కార్యకలాపం',
  badgeLeaderboard: 'బ్యాడ్జ్ లీడర్‌బోర్డ్',
  sessions: 'సెషన్‌లు',
  problems: 'సమస్యలు',
  badges: 'బ్యాడ్జ్‌లు',
  additionProblems: 'కూడిక సమస్యలు',
  subtractionProblems: 'తీసివేత సమస్యలు',
  multiplicationProblems: 'గుణకార సమస్యలు',
  divisionProblems: 'భాగాహార సమస్యలు',
  question: 'ప్రశ్న',
  of: 'లో',
  skip: 'దాటవేయండి',
  next: 'తదుపరి',
  back: 'వెనక్కి',
  plus: 'కూడిక',
  minus: 'తీసివేయి',
  times: 'గుణించు',
  dividedBy: 'భాగించు',
};

/**
 * All translations
 */
export const translations: Record<Language, Translations> = {
  en,
  es,
  fr,
  de,
  zh,
  kn,
  te
};

/**
 * Language names for display
 */
export const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  zh: '中文',
  kn: 'ಕನ್ನಡ',
  te: 'తెలుగు'
};
