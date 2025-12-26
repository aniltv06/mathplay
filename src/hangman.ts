/**
 * Math Hangman Game
 * Answer math problems quickly to save the hangman!
 *
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 * @license MIT
 */

import type { Problem, HangmanSettings, DifficultyLevel } from './types';
import { createHangmanSession, saveHangmanProgress, completeHangmanSession, checkAndAwardBadges } from './storage';
import { playSound, speak } from './main';
import { t } from './i18n';

// Game state
let hangmanProblems: Problem[] = [];
let currentProblemIndex: number = 0;
let lives: number = 6;
let score: number = 0;
let streak: number = 0;
let maxStreak: number = 0;
let questionTimer: number | null = null;
let timeRemaining: number = 30;
let gameStartTime: number = 0;
let currentDifficulty: DifficultyLevel = 'medium';
let currentSettings: HangmanSettings = {
  problemTypes: ['addition', 'subtraction', 'multiplication', 'division'],
  livesCount: 6,
  timeBonus: true,
  streakBonus: true
};
let childName: string = '';

/**
 * Open Hangman settings modal
 */
export function openHangmanSettings(): void {
  const modal = document.getElementById('hangmanSettingsModal');
  if (!modal) return;

  // Load current settings into the form
  const additionEl = document.getElementById('hangmanAddition') as HTMLInputElement;
  const subtractionEl = document.getElementById('hangmanSubtraction') as HTMLInputElement;
  const multiplicationEl = document.getElementById('hangmanMultiplication') as HTMLInputElement;
  const divisionEl = document.getElementById('hangmanDivision') as HTMLInputElement;
  const livesEl = document.getElementById('hangmanLives') as HTMLInputElement;
  const timeBonusEl = document.getElementById('hangmanTimeBonus') as HTMLInputElement;
  const streakBonusEl = document.getElementById('hangmanStreakBonus') as HTMLInputElement;

  if (additionEl) additionEl.checked = currentSettings.problemTypes.includes('addition');
  if (subtractionEl) subtractionEl.checked = currentSettings.problemTypes.includes('subtraction');
  if (multiplicationEl) multiplicationEl.checked = currentSettings.problemTypes.includes('multiplication');
  if (divisionEl) divisionEl.checked = currentSettings.problemTypes.includes('division');
  if (livesEl) livesEl.value = currentSettings.livesCount.toString();
  if (timeBonusEl) timeBonusEl.checked = currentSettings.timeBonus;
  if (streakBonusEl) streakBonusEl.checked = currentSettings.streakBonus;

  modal.style.display = 'block';
}

/**
 * Close Hangman settings modal
 */
export function closeHangmanSettings(): void {
  const modal = document.getElementById('hangmanSettingsModal');
  if (modal) modal.style.display = 'none';
}

/**
 * Save Hangman settings
 */
export function saveHangmanSettings(): void {
  const additionEl = document.getElementById('hangmanAddition') as HTMLInputElement;
  const subtractionEl = document.getElementById('hangmanSubtraction') as HTMLInputElement;
  const multiplicationEl = document.getElementById('hangmanMultiplication') as HTMLInputElement;
  const divisionEl = document.getElementById('hangmanDivision') as HTMLInputElement;
  const livesEl = document.getElementById('hangmanLives') as HTMLInputElement;
  const timeBonusEl = document.getElementById('hangmanTimeBonus') as HTMLInputElement;
  const streakBonusEl = document.getElementById('hangmanStreakBonus') as HTMLInputElement;

  // Build problem types array
  const problemTypes: string[] = [];
  if (additionEl?.checked) problemTypes.push('addition');
  if (subtractionEl?.checked) problemTypes.push('subtraction');
  if (multiplicationEl?.checked) problemTypes.push('multiplication');
  if (divisionEl?.checked) problemTypes.push('division');

  // Validate at least one problem type
  if (problemTypes.length === 0) {
    alert('Please select at least one problem type!');
    return;
  }

  // Update settings
  currentSettings = {
    problemTypes: problemTypes as any,
    livesCount: parseInt(livesEl?.value || '6'),
    timeBonus: timeBonusEl?.checked || false,
    streakBonus: streakBonusEl?.checked || false
  };

  closeHangmanSettings();
  speak('Settings saved!');

  // Check if game is in progress and restart with new settings
  const gameScreen = document.getElementById('hangmanGameScreen');
  const difficultyScreen = document.getElementById('hangmanDifficultyScreen');

  if (gameScreen && gameScreen.style.display !== 'none') {
    // Game is in progress - restart with current difficulty
    startHangmanGame(currentDifficulty);
  } else if (difficultyScreen && difficultyScreen.style.display !== 'none') {
    // On difficulty screen - just saved settings, no action needed
  }
}

// Difficulty presets (number ranges and problem counts)
const HANGMAN_DIFFICULTY_PRESETS = {
  easy: {
    maxNum: 10,
    minNum: 1,
    numProblems: 10
  },
  medium: {
    maxNum: 20,
    minNum: 1,
    numProblems: 15
  },
  hard: {
    maxNum: 100,
    minNum: 1,
    numProblems: 20
  }
};

/**
 * Initialize Hangman game
 */
export function initHangman(profileName: string): void {
  childName = profileName;
  showDifficultyScreen();
}

/**
 * Show difficulty selection screen
 */
function showDifficultyScreen(): void {
  const difficultyScreen = document.getElementById('hangmanDifficultyScreen');
  const gameScreen = document.getElementById('hangmanGameScreen');
  const finalScreen = document.getElementById('hangmanFinalScreen');

  if (difficultyScreen) difficultyScreen.style.display = 'block';
  if (gameScreen) gameScreen.style.display = 'none';
  if (finalScreen) finalScreen.style.display = 'none';

  // Hide game over card when returning to difficulty selection
  const gameOverCard = document.getElementById('hangmanGameOverCard');
  if (gameOverCard) gameOverCard.style.display = 'none';
}

/**
 * Start Hangman game with selected difficulty
 */
export function startHangmanGame(difficulty: DifficultyLevel): void {
  currentDifficulty = difficulty;
  const preset = HANGMAN_DIFFICULTY_PRESETS[difficulty];

  // Generate problems
  hangmanProblems = generateHangmanProblems(preset);

  // Initialize game state
  currentProblemIndex = 0;
  lives = currentSettings.livesCount;
  score = 0;
  streak = 0;
  maxStreak = 0;
  gameStartTime = Date.now();

  // Create session in storage
  if (childName) {
    createHangmanSession(childName, difficulty, currentSettings, hangmanProblems);
  }

  // Show game screen
  const difficultyScreen = document.getElementById('hangmanDifficultyScreen');
  const gameScreen = document.getElementById('hangmanGameScreen');

  if (difficultyScreen) difficultyScreen.style.display = 'none';
  if (gameScreen) gameScreen.style.display = 'block';

  // Start first question
  startQuestion();
}

/**
 * Generate math problems for Hangman
 */
function generateHangmanProblems(preset: any): Problem[] {
  const problems: Problem[] = [];
  const { maxNum, minNum, numProblems } = preset;
  const { problemTypes } = currentSettings;
  const usedPairs = new Set<string>();

  const generateUniquePair = () => {
    let num1: number, num2: number, pairKey: string;
    let attempts = 0;
    do {
      num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      pairKey = `${num1},${num2}`;
      attempts++;
      if (attempts > 100) break;
    } while (usedPairs.has(pairKey) || usedPairs.has(`${num2},${num1}`));

    usedPairs.add(pairKey);
    return { num1, num2 };
  };

  const problemsPerType = Math.ceil(numProblems / problemTypes.length);

  problemTypes.forEach(type => {
    for (let i = 0; i < problemsPerType && problems.length < numProblems; i++) {
      const { num1, num2 } = generateUniquePair();

      switch (type) {
        case 'addition':
          problems.push({
            num1,
            num2,
            operation: '+',
            correct: num1 + num2
          });
          break;

        case 'subtraction':
          const larger = Math.max(num1, num2);
          const smaller = Math.min(num1, num2);
          problems.push({
            num1: larger,
            num2: smaller,
            operation: '-',
            correct: larger - smaller
          });
          break;

        case 'multiplication':
          problems.push({
            num1,
            num2,
            operation: '×',
            correct: num1 * num2
          });
          break;

        case 'division':
          const divisor = Math.max(1, Math.min(num1, num2));
          const quotient = Math.max(1, Math.max(num1, num2));
          const dividend = divisor * quotient;
          problems.push({
            num1: dividend,
            num2: divisor,
            operation: '÷',
            correct: quotient
          });
          break;
      }
    }
  });

  // Shuffle problems
  return problems.sort(() => Math.random() - 0.5);
}

/**
 * Start a new question
 */
function startQuestion(): void {
  if (currentProblemIndex >= hangmanProblems.length) {
    endGame();
    return;
  }

  // Check if game is already over (lives <= 0)
  if (lives <= 0) {
    endGame();
    return;
  }

  // Stop any existing timer before starting a new one
  stopQuestionTimer();

  // Show the numberpad area (in case it was hidden)
  const numberpadArea = document.getElementById('hangmanNumberpadArea');
  if (numberpadArea) numberpadArea.style.display = 'block';

  // Hide the game over card (in case it was shown)
  const gameOverCard = document.getElementById('hangmanGameOverCard');
  if (gameOverCard) gameOverCard.style.display = 'none';

  const problem = hangmanProblems[currentProblemIndex];

  // Update problem display
  const num1El = document.getElementById('hangmanNum1');
  const opEl = document.getElementById('hangmanOp');
  const num2El = document.getElementById('hangmanNum2');
  const inputEl = document.getElementById('hangmanAnswerInput') as HTMLInputElement;

  if (num1El) num1El.textContent = problem.num1.toString();
  if (opEl) opEl.textContent = problem.operation;
  if (num2El) num2El.textContent = problem.num2.toString();
  if (inputEl) {
    inputEl.value = '';
    inputEl.focus();
  }

  // Update displays
  updateLivesDisplay();
  updateScoreDisplay();
  updateStreakDisplay();
  updateHangmanDisplay();

  // Start timer
  startQuestionTimer();

  // Speak problem
  speakHangmanProblem(problem);
}

/**
 * Start question timer
 */
function startQuestionTimer(): void {
  timeRemaining = 30;
  updateTimerDisplay();

  questionTimer = window.setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining <= 0) {
      stopQuestionTimer();
      handleWrongAnswer();
    }
  }, 1000);
}

/**
 * Stop question timer
 */
function stopQuestionTimer(): void {
  if (questionTimer) {
    clearInterval(questionTimer);
    questionTimer = null;
  }
}

/**
 * Submit answer
 */
export function submitHangmanAnswer(): void {
  const inputEl = document.getElementById('hangmanAnswerInput') as HTMLInputElement;
  if (!inputEl || inputEl.value === '') return;

  const userAnswer = parseInt(inputEl.value);
  const problem = hangmanProblems[currentProblemIndex];

  stopQuestionTimer();

  if (userAnswer === problem.correct) {
    handleCorrectAnswer(problem.correct);
  } else {
    handleWrongAnswer(userAnswer);
  }
}

/**
 * Handle correct answer
 */
function handleCorrectAnswer(correctAnswer: number): void {
  playSound('correct');
  speak(`${correctAnswer} ${t('correct')}`);

  // Update streak
  streak++;
  if (streak > maxStreak) {
    maxStreak = streak;
  }

  // Calculate score
  let points = 10; // Base points

  // Time bonus
  if (currentSettings.timeBonus && timeRemaining > 20) {
    points += 5;
  }

  // Streak bonus
  if (currentSettings.streakBonus && streak >= 3) {
    points += streak;
  }

  score += points;

  // Save progress
  if (childName) {
    saveHangmanProgress(childName, score, currentSettings.livesCount - lives, maxStreak);
  }

  // Move to next question
  currentProblemIndex++;
  setTimeout(() => {
    startQuestion();
  }, 2000);
}

/**
 * Handle wrong answer
 */
function handleWrongAnswer(wrongAnswer: number): void {
  // Guard: Don't process if game is already over
  if (lives <= 0) {
    return;
  }

  playSound('wrong');
  speak(`${wrongAnswer} ${t('wrong')}`);

  // Lose a life
  lives--;
  streak = 0;

  // Update displays
  updateLivesDisplay();
  updateStreakDisplay();
  updateHangmanDisplay();

  // Check if game over
  if (lives <= 0) {
    speak('Game over!');
    endGame();
    return; // Don't proceed further
  }

  // Move to next question
  currentProblemIndex++;
  setTimeout(() => {
    // Double-check game hasn't ended before starting next question
    if (lives > 0 && currentProblemIndex < hangmanProblems.length) {
      startQuestion();
    }
  }, 1500);
}

/**
 * End game
 */
function endGame(): void {
  stopQuestionTimer();

  // Hide the numberpad area
  const numberpadArea = document.getElementById('hangmanNumberpadArea');
  if (numberpadArea) numberpadArea.style.display = 'none';

  // Update Game Over message based on how the game ended
  const gameOverMessage = document.querySelector('.game-over-message');
  if (gameOverMessage) {
    if (lives <= 0) {
      // Lost all lives
      gameOverMessage.textContent = 'Better luck next time!';
    } else {
      // Completed all questions
      gameOverMessage.textContent = 'Great job! You finished all questions!';
    }
  }

  // Show the game over card
  const gameOverCard = document.getElementById('hangmanGameOverCard');
  if (gameOverCard) gameOverCard.style.display = 'flex';

  // Clear the answer input
  hangmanCurrentAnswer = '';
  updateHangmanAnswerDisplay();

  const timeSpent = Math.floor((Date.now() - gameStartTime) / 1000);

  // Complete session
  if (childName) {
    completeHangmanSession(childName, timeSpent);

    // Check for badges
    const newBadges = checkAndAwardBadges(childName);
    // TODO: Show badge notifications
  }

  // Show final screen
  showFinalScreen();
}

/**
 * Show final score screen
 */
function showFinalScreen(): void {
  const gameScreen = document.getElementById('hangmanGameScreen');
  const finalScreen = document.getElementById('hangmanFinalScreen');

  if (gameScreen) gameScreen.style.display = 'none';
  if (finalScreen) finalScreen.style.display = 'block';

  // Calculate stats
  const correct = hangmanProblems.length - (currentSettings.livesCount - lives);
  const wrong = currentSettings.livesCount - lives;

  // Update final stats
  const finalScore = document.getElementById('finalScore');
  const finalCorrect = document.getElementById('finalCorrect');
  const finalWrong = document.getElementById('finalWrong');
  const finalMaxStreak = document.getElementById('finalMaxStreak');

  if (finalScore) finalScore.textContent = score.toString();
  if (finalCorrect) finalCorrect.textContent = correct.toString();
  if (finalWrong) finalWrong.textContent = wrong.toString();
  if (finalMaxStreak) finalMaxStreak.textContent = maxStreak.toString();
}

/**
 * Update lives display
 */
function updateLivesDisplay(): void {
  const livesEl = document.getElementById('hangmanLives');
  if (!livesEl) return;

  // Ensure lives never goes negative for display purposes
  const displayLives = Math.max(0, lives);
  const emptyLives = Math.max(0, currentSettings.livesCount - displayLives);

  const hearts = '❤️'.repeat(displayLives);
  const emptyHearts = '🖤'.repeat(emptyLives);
  livesEl.textContent = hearts + emptyHearts;
}

/**
 * Update score display
 */
function updateScoreDisplay(): void {
  const scoreEl = document.getElementById('hangmanScore');
  if (scoreEl) scoreEl.textContent = score.toString();
}

/**
 * Update streak display
 */
function updateStreakDisplay(): void {
  const streakEl = document.getElementById('hangmanStreak');
  if (streakEl) streakEl.textContent = streak > 0 ? `${streak}🔥` : '0';
}

/**
 * Update timer display
 */
function updateTimerDisplay(): void {
  const timerEl = document.getElementById('hangmanTimer');
  if (!timerEl) return;

  timerEl.textContent = timeRemaining.toString();

  // Warning styling
  if (timeRemaining <= 10) {
    timerEl.classList.add('timer-warning');
  } else {
    timerEl.classList.remove('timer-warning');
  }
}

/**
 * Update hangman display
 */
function updateHangmanDisplay(): void {
  const displayEl = document.getElementById('hangmanDisplay');
  if (!displayEl) return;

  const wrongCount = currentSettings.livesCount - lives;
  displayEl.innerHTML = renderHangmanSVG(wrongCount);
}

/**
 * Render hangman SVG
 */
function renderHangmanSVG(wrongCount: number): string {
  const bodyParts = [
    '<circle cx="140" cy="50" r="20" />', // head
    '<line x1="140" y1="70" x2="140" y2="120" />', // body
    '<line x1="140" y1="85" x2="120" y2="100" />', // left arm
    '<line x1="140" y1="85" x2="160" y2="100" />', // right arm
    '<line x1="140" y1="120" x2="125" y2="145" />', // left leg
    '<line x1="140" y1="120" x2="155" y2="145" />', // right leg
  ];

  const visibleParts = bodyParts.slice(0, wrongCount).join('');

  return `
    <svg viewBox="0 0 200 200" class="hangman-svg">
      <!-- Gallows structure -->
      <line x1="20" y1="180" x2="180" y2="180" stroke="#333" stroke-width="4" />
      <line x1="50" y1="180" x2="50" y2="20" stroke="#333" stroke-width="4" />
      <line x1="50" y1="20" x2="140" y2="20" stroke="#333" stroke-width="4" />
      <line x1="140" y1="20" x2="140" y2="30" stroke="#333" stroke-width="4" />

      <!-- Body parts (based on wrong count) -->
      <g stroke="#ff6b6b" stroke-width="3" fill="none">
        ${visibleParts}
      </g>
    </svg>
  `;
}

/**
 * Speak problem
 */
function speakHangmanProblem(problem: Problem): void {
  const operationWords: { [key: string]: string } = {
    '+': 'plus',
    '-': 'minus',
    '×': 'times',
    '÷': 'divided by'
  };

  const text = `${problem.num1} ${operationWords[problem.operation]} ${problem.num2}`;
  speak(text);
}

/**
 * Hangman numberpad state
 */
let hangmanCurrentAnswer: string = '';

/**
 * Add a number to the answer
 */
function hangmanPadNumber(num: number): void {
  hangmanCurrentAnswer += num.toString();
  updateHangmanAnswerDisplay();
}

/**
 * Clear the answer
 */
function hangmanPadClear(): void {
  hangmanCurrentAnswer = '';
  updateHangmanAnswerDisplay();
}

/**
 * Backspace the last digit
 */
function hangmanPadBackspace(): void {
  hangmanCurrentAnswer = hangmanCurrentAnswer.slice(0, -1);
  updateHangmanAnswerDisplay();
}

/**
 * Update the answer display
 */
function updateHangmanAnswerDisplay(): void {
  const display = document.getElementById('hangmanAnswerDisplay');
  if (!display) return;

  if (hangmanCurrentAnswer === '') {
    display.textContent = 'Tap numbers';
  } else {
    display.textContent = hangmanCurrentAnswer;
  }
}

/**
 * Skip current question (counts as wrong)
 */
function hangmanSkip(): void {
  stopQuestionTimer();
  handleWrongAnswer();
  hangmanCurrentAnswer = '';
  updateHangmanAnswerDisplay();
}

/**
 * Confirm and submit answer
 */
function hangmanConfirm(): void {
  if (hangmanCurrentAnswer === '') return;

  const userAnswer = parseInt(hangmanCurrentAnswer);
  const problem = hangmanProblems[currentProblemIndex];

  stopQuestionTimer();

  if (userAnswer === problem.correct) {
    handleCorrectAnswer(problem.correct);
  } else {
    handleWrongAnswer(userAnswer);
  }

  // Clear answer for next question
  hangmanCurrentAnswer = '';
  updateHangmanAnswerDisplay();
}

/**
 * Setup keyboard for numberpad
 */
export function setupHangmanKeyboard(): void {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    // Only handle if game is active
    const gameScreen = document.getElementById('hangmanGameScreen');
    if (!gameScreen || gameScreen.style.display === 'none') return;

    // Number keys
    if (event.key >= '0' && event.key <= '9') {
      event.preventDefault();
      hangmanPadNumber(parseInt(event.key));
    }
    // Backspace
    else if (event.key === 'Backspace') {
      event.preventDefault();
      hangmanPadBackspace();
    }
    // Enter to submit
    else if (event.key === 'Enter') {
      event.preventDefault();
      hangmanConfirm();
    }
    // C or Escape to clear
    else if (event.key === 'c' || event.key === 'C' || event.key === 'Escape') {
      hangmanPadClear();
    }
  });
}

// Expose functions to window for onclick handlers
(window as any).startHangmanGame = startHangmanGame;
(window as any).submitHangmanAnswer = submitHangmanAnswer;
(window as any).showDifficultyScreen = showDifficultyScreen;
(window as any).hangmanPadNumber = hangmanPadNumber;
(window as any).hangmanPadClear = hangmanPadClear;
(window as any).hangmanPadBackspace = hangmanPadBackspace;
(window as any).hangmanSkip = hangmanSkip;
(window as any).hangmanConfirm = hangmanConfirm;
(window as any).openHangmanSettings = openHangmanSettings;
(window as any).closeHangmanSettings = closeHangmanSettings;
(window as any).saveHangmanSettings = saveHangmanSettings;

