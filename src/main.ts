/**
 * Math Fun Worksheet
 * Interactive math practice app for kids
 *
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 * @license MIT
 */

// Import CSS
import './style.css';

// Import types
import type {
  Problem,
  ProblemSettings,
  SoundType,
  ValidationResult,
  UserProfile
} from './types';

// Import storage utilities
import {
  createProfile,
  getProfile,
  getLastActiveProfile,
  profileExists,
  createSession,
  saveSessionProgress,
  completeSession,
  updateBestStreak,
  getProfileNames,
  deleteProfile
} from './storage';

// Application state
let problems: Problem[] = [];
let currentInputIndex: number | null = null;
let padValue: string = '';
let childName: string = '';
let correctStreak: number = 0;
let totalAnswered: number = 0;
let sessionStartTime: number = 0;
let currentProfile: UserProfile | null = null;

// Sound effects using Web Audio API
function playSound(type: SoundType): void {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (type === 'correct') {
    // Happy "ding" sound
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } else if (type === 'wrong') {
    // Gentle "buzz" sound
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(250, audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }
}

// Create confetti
function createConfetti(): void {
  const colors = ['#667eea', '#764ba2', '#51cf66', '#ffa500', '#ff6b6b', '#ffe066'];
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 4000);
  }
}

// Show bonus message
function showBonusMessage(message: string): void {
  const bonus = document.createElement('div');
  bonus.className = 'bonus-message';
  bonus.textContent = message;
  document.body.appendChild(bonus);
  setTimeout(() => bonus.remove(), 1500);
}

// Update streak counter
function updateStreakDisplay(): void {
  const streakEl = document.getElementById('streakCounter');
  if (!streakEl) return;

  if (correctStreak > 0) {
    streakEl.style.display = 'block';
    streakEl.textContent = `🔥 Streak: ${correctStreak}`;

    // Milestone bonuses
    if (correctStreak % 5 === 0 && correctStreak > 0) {
      showBonusMessage(`🔥 ${correctStreak} in a row! Amazing!`);
    }

    // Update best streak
    if (childName) {
      updateBestStreak(childName, correctStreak);
    }
  } else {
    streakEl.style.display = 'none';
  }
}

// Update progress bar
function updateProgressBar(): void {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;

  const progress = (totalAnswered / problems.length) * 100;
  progressBar.style.width = progress + '%';
}

// Save current progress to localStorage
function saveProgress(): void {
  if (!childName || problems.length === 0) return;

  const answers: (number | null)[] = problems.map((_, index) => {
    const value = (document.getElementById(`answer${index}`) as HTMLInputElement)?.value;
    return value ? parseInt(value) : null;
  });

  let correct = 0;
  let wrong = 0;

  problems.forEach((problem, index) => {
    const answer = answers[index];
    if (answer !== null) {
      if (answer === problem.correct) {
        correct++;
      } else {
        wrong++;
      }
    }
  });

  const total = correct + wrong;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  saveSessionProgress(childName, answers, correct, wrong, percentage);
}

function startWithName(): void {
  const nameInput = document.getElementById('childName') as HTMLInputElement;
  const name = nameInput.value.trim();

  if (name === '') {
    alert('Please enter your name! 😊');
    return;
  }

  childName = name;
  sessionStartTime = Date.now();

  // Load or create profile
  if (profileExists(name)) {
    currentProfile = getProfile(name);

    // Check if there's a current session to restore
    if (currentProfile?.currentSession && !currentProfile.currentSession.completed) {
      restoreSession(currentProfile.currentSession);
    } else {
      // Start fresh
      generateProblems();
    }
  } else {
    currentProfile = createProfile(name);
    generateProblems();
  }

  const namePanel = document.getElementById('namePanel');
  const greetingText = document.getElementById('greetingText');

  if (namePanel) namePanel.style.display = 'none';
  if (greetingText) {
    greetingText.textContent = `Great to see you, ${childName}! 🌟 Let's practice!`;
  }
}

// Restore a previous session
function restoreSession(session: any): void {
  problems = session.problems;
  renderProblems();

  // Restore answers
  setTimeout(() => {
    session.answers.forEach((answer: number | null, index: number) => {
      if (answer !== null) {
        const input = document.getElementById(`answer${index}`) as HTMLInputElement;
        if (input) {
          input.value = answer.toString();
          validateAnswer(index);
        }
      }
    });

    updateStats();
  }, 300);
}

// Profile Management Functions
function loadProfiles(): void {
  const profileListEl = document.getElementById('profileList');
  if (!profileListEl) return;

  const profileNames = getProfileNames();

  if (profileNames.length === 0) {
    profileListEl.innerHTML = `
      <div class="empty-profiles">
        <div class="empty-profiles-icon">👤</div>
        <p>No profiles yet!<br>Create one below to get started.</p>
      </div>
    `;
    return;
  }

  profileListEl.innerHTML = profileNames.map(name => {
    const profile = getProfile(name);
    if (!profile) return '';

    const totalAnswered = profile.stats.totalCorrect + profile.stats.totalWrong;
    const accuracy = totalAnswered > 0
      ? Math.round((profile.stats.totalCorrect / totalAnswered) * 100)
      : 0;

    return `
      <div class="profile-card">
        <div class="profile-info">
          <div class="profile-name">👤 ${profile.name}</div>
          <div class="profile-stats-preview">
            <div class="profile-stat-item">
              <span>📊</span>
              <span>${profile.stats.totalSessions} sessions</span>
            </div>
            <div class="profile-stat-item">
              <span>✅</span>
              <span>${accuracy}% accuracy</span>
            </div>
            <div class="profile-stat-item">
              <span>🔥</span>
              <span>${profile.stats.bestStreak} streak</span>
            </div>
          </div>
        </div>
        <div class="profile-actions">
          <button class="profile-btn profile-btn-select" onclick="selectProfile('${name}')">Select</button>
          <button class="profile-btn profile-btn-view" onclick="viewProfileStats('${name}')">Stats</button>
          <button class="profile-btn profile-btn-delete" onclick="confirmDeleteProfile('${name}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function createNewProfile(): void {
  const input = document.getElementById('newProfileName') as HTMLInputElement;
  const name = input.value.trim();

  if (name === '') {
    alert('Please enter a name! 😊');
    return;
  }

  if (profileExists(name)) {
    alert(`Profile "${name}" already exists! Please choose a different name.`);
    return;
  }

  childName = name;
  sessionStartTime = Date.now();
  currentProfile = createProfile(name);

  const profilePanel = document.getElementById('profilePanel');
  const greetingText = document.getElementById('greetingText');

  if (profilePanel) profilePanel.style.display = 'none';
  if (greetingText) {
    greetingText.textContent = `Great to see you, ${childName}! 🌟 Let's practice!`;
  }

  // Start fresh
  generateProblems();
}

function selectProfile(name: string): void {
  childName = name;
  sessionStartTime = Date.now();
  currentProfile = getProfile(name);

  // Check if there's a current session to restore
  if (currentProfile?.currentSession && !currentProfile.currentSession.completed) {
    restoreSession(currentProfile.currentSession);
  } else {
    // Start fresh
    generateProblems();
  }

  const profilePanel = document.getElementById('profilePanel');
  const greetingText = document.getElementById('greetingText');

  if (profilePanel) profilePanel.style.display = 'none';
  if (greetingText) {
    greetingText.textContent = `Welcome back, ${childName}! 🌟 Let's practice!`;
  }
}

function viewProfileStats(name: string): void {
  const profile = getProfile(name);
  if (!profile) return;

  const statsProfileNameEl = document.getElementById('statsProfileName');
  const statTotalSessionsEl = document.getElementById('statTotalSessions');
  const statTotalProblemsEl = document.getElementById('statTotalProblems');
  const statAccuracyEl = document.getElementById('statAccuracy');
  const statBestStreakEl = document.getElementById('statBestStreak');
  const statTimeSpentEl = document.getElementById('statTimeSpent');
  const sessionHistoryListEl = document.getElementById('sessionHistoryList');

  if (statsProfileNameEl) statsProfileNameEl.textContent = profile.name;
  if (statTotalSessionsEl) statTotalSessionsEl.textContent = profile.stats.totalSessions.toString();
  if (statTotalProblemsEl) statTotalProblemsEl.textContent = profile.stats.totalProblems.toString();

  const totalAnswered = profile.stats.totalCorrect + profile.stats.totalWrong;
  const accuracy = totalAnswered > 0
    ? Math.round((profile.stats.totalCorrect / totalAnswered) * 100)
    : 0;

  if (statAccuracyEl) statAccuracyEl.textContent = accuracy + '%';
  if (statBestStreakEl) statBestStreakEl.textContent = profile.stats.bestStreak.toString();

  const minutes = Math.floor(profile.stats.timeSpent / 60);
  if (statTimeSpentEl) statTimeSpentEl.textContent = minutes + ' min';

  // Display session history
  if (sessionHistoryListEl) {
    if (profile.history.length === 0) {
      sessionHistoryListEl.innerHTML = '<div class="no-sessions">No completed sessions yet!</div>';
    } else {
      sessionHistoryListEl.innerHTML = profile.history
        .slice(-10)
        .reverse()
        .map(session => {
          const date = new Date(session.date).toLocaleDateString();
          const time = new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return `
            <div class="session-item">
              <div class="session-date">📅 ${date} at ${time}</div>
              <div class="session-details">
                <div class="session-detail-item">
                  <span>📝</span>
                  <span>${session.problems.length} problems</span>
                </div>
                <div class="session-detail-item">
                  <span>✅</span>
                  <span>${session.correctCount} correct</span>
                </div>
                <div class="session-detail-item">
                  <span>❌</span>
                  <span>${session.wrongCount} wrong</span>
                </div>
                <div class="session-detail-item">
                  <span>📊</span>
                  <span>${session.percentage}%</span>
                </div>
              </div>
            </div>
          `;
        })
        .join('');
    }
  }

  const modal = document.getElementById('profileStatsModal');
  if (modal) modal.style.display = 'block';
}

function closeProfileStats(): void {
  const modal = document.getElementById('profileStatsModal');
  if (modal) modal.style.display = 'none';
}

function confirmDeleteProfile(name: string): void {
  const confirmed = confirm(`Are you sure you want to delete ${name}'s profile? This cannot be undone!`);
  if (confirmed) {
    deleteProfile(name);
    loadProfiles();
  }
}

// Allow Enter key to submit name
document.addEventListener('DOMContentLoaded', function () {
  const newProfileInput = document.getElementById('newProfileName') as HTMLInputElement;
  newProfileInput?.addEventListener('keypress', function (event: KeyboardEvent) {
    if (event.key === 'Enter') {
      createNewProfile();
    }
  });

  // Prevent browser extension errors on custom inputs
  const inputs = document.querySelectorAll('input[readonly]');
  inputs.forEach(input => {
    input.setAttribute('data-form-type', 'other');
    input.setAttribute('autocomplete', 'off');
  });

  // Load profiles on startup
  loadProfiles();
});

function openSettings(): void {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.style.display = 'block';
}

function closeSettings(): void {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.style.display = 'none';
}

// Close settings modal when clicking outside
window.addEventListener('click', function (event: MouseEvent) {
  const modal = document.getElementById('settingsModal');
  if (event.target === modal) {
    closeSettings();
  }
});

function openNumberPad(inputIndex: number): void {
  currentInputIndex = inputIndex;
  const input = document.getElementById(`answer${inputIndex}`) as HTMLInputElement;
  padValue = input.value || '';
  updatePadDisplay();

  // Display the question in the number pad
  const problem = problems[inputIndex];
  const questionNum1 = document.getElementById('questionNum1');
  const questionOp = document.getElementById('questionOp');
  const questionNum2 = document.getElementById('questionNum2');
  const currentQuestion = document.getElementById('currentQuestion');
  const totalQuestions = document.getElementById('totalQuestions');

  if (questionNum1) questionNum1.textContent = problem.num1.toString();
  if (questionOp) questionOp.textContent = problem.operation;
  if (questionNum2) questionNum2.textContent = problem.num2.toString();
  if (currentQuestion) currentQuestion.textContent = (inputIndex + 1).toString();
  if (totalQuestions) totalQuestions.textContent = problems.length.toString();

  const modal = document.getElementById('numberpadModal');
  if (modal) modal.style.display = 'block';
}

function closeNumberPad(): void {
  // If there's a value entered, save and validate it
  if (currentInputIndex !== null && padValue !== '') {
    const input = document.getElementById(`answer${currentInputIndex}`) as HTMLInputElement;
    if (input) {
      input.value = padValue;
      validateAnswer(currentInputIndex);
      updateStats();
      saveProgress(); // Auto-save
    }
  }

  const modal = document.getElementById('numberpadModal');
  if (modal) modal.style.display = 'none';
  currentInputIndex = null;
  padValue = '';
}

function padNumber(num: number): void {
  if (padValue.length < 6) {
    // Limit to 6 digits max (supports up to 999,999)
    padValue += num.toString();
    updatePadDisplay();
  }
}

function padBackspace(): void {
  padValue = padValue.slice(0, -1);
  updatePadDisplay();
}

function updatePadDisplay(): void {
  const display = document.getElementById('numberpadDisplay');
  if (display) display.textContent = padValue || '0';
}

function confirmAndNext(): void {
  if (currentInputIndex !== null) {
    const input = document.getElementById(`answer${currentInputIndex}`) as HTMLInputElement;
    if (input) {
      input.value = padValue;

      // Validate and update immediately
      validateAnswer(currentInputIndex);

      // Update stats in real-time
      updateStats();

      // Auto-save progress
      saveProgress();
    }
  }

  // Move to next question
  const nextIndex = (currentInputIndex ?? -1) + 1;
  if (nextIndex < problems.length) {
    padValue = '';
    openNumberPad(nextIndex);
  } else {
    // All questions answered
    closeNumberPad();
    showCompletionMessage();
  }
}

// Validate a single answer
function validateAnswer(index: number): ValidationResult {
  const problem = problems[index];
  const problemBox = document.querySelector(`[data-problem-index="${index}"]`);
  const input = document.getElementById(`answer${index}`) as HTMLInputElement;
  const userAnswer = parseInt(input.value);

  if (isNaN(userAnswer)) {
    // No answer or invalid
    input.style.borderColor = '#667eea';
    input.style.backgroundColor = 'white';
    if (problemBox) {
      problemBox.classList.remove('correct', 'incorrect');
    }
    return null; // Not answered
  } else if (userAnswer === problem.correct) {
    // Correct answer
    playSound('correct');
    const modal = document.getElementById('numberpadModal');
    if (modal && modal.style.display === 'block') {
      createConfetti(); // Only show confetti during initial answering
    }

    input.style.borderColor = '#51cf66';
    input.style.backgroundColor = '#e8f8f5';
    if (problemBox) {
      problemBox.classList.remove('incorrect');
      problemBox.classList.add('correct');
    }

    // Update streak
    correctStreak++;
    updateStreakDisplay();

    return true; // Correct
  } else {
    // Wrong answer
    playSound('wrong');

    input.style.borderColor = '#ff6b6b';
    input.style.backgroundColor = '#ffe0e0';
    if (problemBox) {
      problemBox.classList.remove('correct');
      problemBox.classList.add('incorrect');
    }

    // Reset streak
    correctStreak = 0;
    updateStreakDisplay();

    return false; // Incorrect
  }
}

// Update statistics panel
function updateStats(): void {
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  problems.forEach((problem, index) => {
    const input = document.getElementById(`answer${index}`) as HTMLInputElement;
    const userAnswer = input.value;

    if (userAnswer === '' || isNaN(parseInt(userAnswer))) {
      unanswered++;
    } else if (parseInt(userAnswer) === problem.correct) {
      correct++;
    } else {
      wrong++;
    }
  });

  const percentage = problems.length > 0 ? Math.round((correct / problems.length) * 100) : 0;
  const answered = correct + wrong;

  // Update stats panel
  const statsName = document.getElementById('statsName');
  const correctCount = document.getElementById('correctCount');
  const wrongCount = document.getElementById('wrongCount');
  const scorePercentage = document.getElementById('scorePercentage');
  const statsPanel = document.getElementById('statsPanel');

  if (statsName) statsName.textContent = `${childName}'s Results`;
  if (correctCount) correctCount.textContent = correct.toString();
  if (wrongCount) wrongCount.textContent = wrong.toString();
  if (scorePercentage) scorePercentage.textContent = percentage.toString();

  // Show stats panel if at least one answer is provided
  if (answered > 0 && statsPanel) {
    statsPanel.style.display = 'block';
  }

  // Update progress bar based on answered questions
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    const progress = (answered / problems.length) * 100;
    progressBar.style.width = progress + '%';
  }

  totalAnswered = answered;

  // Update result message
  updateResultMessage(correct, wrong, unanswered, percentage);
}

// Update result message based on stats
function updateResultMessage(correct: number, wrong: number, unanswered: number, percentage: number): void {
  const resultDiv = document.getElementById('result');
  if (!resultDiv) return;

  if (unanswered > 0) {
    // Calculate which problems are unanswered
    const unansweredProblems: number[] = [];
    problems.forEach((problem, index) => {
      const input = document.getElementById(`answer${index}`) as HTMLInputElement;
      const userAnswer = input.value;
      if (userAnswer === '' || isNaN(parseInt(userAnswer))) {
        unansweredProblems.push(index + 1);
      }
    });

    resultDiv.className = 'result incorrect';
    resultDiv.innerHTML = `<div>⏰ Fill in ${unanswered} more: ${unansweredProblems.join(', ')}</div>`;
  } else if (correct + wrong === 0) {
    // No answers yet
    resultDiv.className = 'result';
    resultDiv.innerHTML = '';
  } else {
    // All answered
    resultDiv.className = 'result correct';
    let emoji = '⭐';
    if (percentage === 100) emoji = '🌟 ⭐ 🎉';
    else if (percentage >= 80) emoji = '🌟 ⭐';
    resultDiv.innerHTML = `<div>Great job!</div><div class="emoji-feedback">${emoji}</div>`;
  }
}

function skipQuestion(): void {
  // Don't validate skipped questions - just move to next
  const nextIndex = (currentInputIndex ?? -1) + 1;
  if (nextIndex < problems.length) {
    padValue = '';
    openNumberPad(nextIndex);
  } else {
    // All questions done
    closeNumberPad();
    showCompletionMessage();
  }
}

function showCompletionMessage(): void {
  const resultDiv = document.getElementById('result');
  if (!resultDiv) return;

  resultDiv.className = 'result correct';
  resultDiv.innerHTML = `<div>Awesome job, ${childName}! You finished all the problems! 🎉</div><div class="emoji-feedback">⭐ 🎉 ⭐</div>`;

  // Auto-check answers when all completed
  setTimeout(() => {
    checkAnswers();
  }, 500);
}

function checkAnswers(): void {
  // Validate all answers and update visual feedback
  problems.forEach((problem, index) => {
    validateAnswer(index);
  });

  // Update statistics panel
  updateStats();

  // Save progress
  saveProgress();

  // Complete session and save to history
  if (childName) {
    const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000); // in seconds
    completeSession(childName, timeSpent);
  }
}

// Close pad when clicking outside
window.onclick = function (event: MouseEvent) {
  const modal = document.getElementById('numberpadModal');
  if (event.target === modal) {
    closeNumberPad();
  }
};

// Close pad on Escape key
document.addEventListener('keydown', function (event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeNumberPad();
  }
});

function generateProblems(): void {
  const numProblemsInput = document.getElementById('numProblems') as HTMLInputElement;
  const maxNumInput = document.getElementById('maxNum') as HTMLInputElement;
  const minNumInput = document.getElementById('minNum') as HTMLInputElement;
  const includeAdditionInput = document.getElementById('includeAddition') as HTMLInputElement;
  const includeSubtractionInput = document.getElementById('includeSubtraction') as HTMLInputElement;
  const includeMultiplicationInput = document.getElementById('includeMultiplication') as HTMLInputElement;
  const includeDivisionInput = document.getElementById('includeDivision') as HTMLInputElement;

  const numProblems = parseInt(numProblemsInput.value) || 5;
  const maxNum = parseInt(maxNumInput.value) || 9;
  const minNum = parseInt(minNumInput.value) || 1;
  const includeAddition = includeAdditionInput.checked;
  const includeSubtraction = includeSubtractionInput.checked;
  const includeMultiplication = includeMultiplicationInput.checked;
  const includeDivision = includeDivisionInput.checked;

  // Validate inputs
  if (maxNum < minNum) {
    alert('Max Number must be greater than or equal to Min Number!');
    return;
  }

  if (!includeAddition && !includeSubtraction && !includeMultiplication && !includeDivision) {
    alert('Please select at least one operation!');
    return;
  }

  problems = [];

  // Helper function to generate unique random number pairs
  const generateUniquePair = (usedPairs: Set<string>) => {
    let num1: number, num2: number, pairKey: string;
    let attempts = 0;
    do {
      num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      pairKey = `${num1},${num2}`;
      attempts++;
      // Prevent infinite loop if range is too small
      if (attempts > 100) break;
    } while (usedPairs.has(pairKey) || usedPairs.has(`${num2},${num1}`));

    usedPairs.add(pairKey);
    return { num1, num2 };
  };

  const usedPairs = new Set<string>();

  // Add addition problems
  if (includeAddition) {
    for (let i = 0; i < numProblems; i++) {
      const { num1, num2 } = generateUniquePair(usedPairs);
      problems.push({
        num1: num1,
        num2: num2,
        operation: '+',
        correct: num1 + num2,
      });
    }
  }

  // Add subtraction problems
  if (includeSubtraction) {
    for (let i = 0; i < numProblems; i++) {
      const { num1, num2 } = generateUniquePair(usedPairs);
      // For subtraction, ensure result is positive
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      problems.push({
        num1: larger,
        num2: smaller,
        operation: '-',
        correct: larger - smaller,
      });
    }
  }

  // Add multiplication problems
  if (includeMultiplication) {
    for (let i = 0; i < numProblems; i++) {
      const { num1, num2 } = generateUniquePair(usedPairs);
      problems.push({
        num1: num1,
        num2: num2,
        operation: '×',
        correct: num1 * num2,
      });
    }
  }

  // Add division problems
  if (includeDivision) {
    for (let i = 0; i < numProblems; i++) {
      const { num1, num2 } = generateUniquePair(usedPairs);
      // For division, create problems where result is a whole number
      // Use the smaller number as divisor to keep dividend within range
      const divisor = Math.max(1, Math.min(num1, num2)); // Ensure divisor >= 1
      const quotient = Math.max(1, Math.max(num1, num2)); // Use larger as quotient
      const dividend = divisor * quotient; // This keeps dividend within reasonable bounds

      // Ensure dividend doesn't exceed maxNum * maxNum (reasonable upper bound)
      if (dividend <= maxNum * maxNum) {
        problems.push({
          num1: dividend,
          num2: divisor,
          operation: '÷',
          correct: quotient,
        });
      } else {
        // Fallback: create simpler division problem
        const simpleDivisor = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        const simpleQuotient = Math.floor(Math.random() * 10) + 1; // Keep quotient small
        problems.push({
          num1: simpleDivisor * simpleQuotient,
          num2: simpleDivisor,
          operation: '÷',
          correct: simpleQuotient,
        });
      }
    }
  }

  // Create session in storage
  if (childName) {
    const settings: ProblemSettings = {
      numProblems,
      maxNum,
      minNum,
      includeAddition,
      includeSubtraction,
      includeMultiplication,
      includeDivision,
    };

    createSession(childName, settings, problems);
  }

  sessionStartTime = Date.now();
  correctStreak = 0;
  updateStreakDisplay();

  renderProblems();

  const resultDiv = document.getElementById('result');
  if (resultDiv) {
    resultDiv.innerHTML = '';
    resultDiv.className = 'result';
  }
}

function renderProblems(): void {
  const container = document.getElementById('problemsContainer');
  if (!container) return;

  container.innerHTML = '';

  if (problems.length === 0) {
    container.innerHTML = '<div class="no-problems">No problems generated yet!</div>';
    return;
  }

  // Separate by operation for better organization
  const additionProblems = problems.filter(p => p.operation === '+');
  const subtractionProblems = problems.filter(p => p.operation === '-');
  const multiplicationProblems = problems.filter(p => p.operation === '×');
  const divisionProblems = problems.filter(p => p.operation === '÷');

  let html = '';

  if (additionProblems.length > 0) {
    html += '<div class="section-title"><span class="emoji">➕</span> Addition Problems</div>';
    html += '<div class="problems-grid">';
    additionProblems.forEach(problem => {
      const globalIndex = problems.indexOf(problem);
      html += renderProblemBox(problem, globalIndex);
    });
    html += '</div>';
  }

  if (subtractionProblems.length > 0) {
    html += '<div class="section-title"><span class="emoji">➖</span> Subtraction Problems</div>';
    html += '<div class="problems-grid">';
    subtractionProblems.forEach(problem => {
      const globalIndex = problems.indexOf(problem);
      html += renderProblemBox(problem, globalIndex);
    });
    html += '</div>';
  }

  if (multiplicationProblems.length > 0) {
    html += '<div class="section-title"><span class="emoji">✖️</span> Multiplication Problems</div>';
    html += '<div class="problems-grid">';
    multiplicationProblems.forEach(problem => {
      const globalIndex = problems.indexOf(problem);
      html += renderProblemBox(problem, globalIndex);
    });
    html += '</div>';
  }

  if (divisionProblems.length > 0) {
    html += '<div class="section-title"><span class="emoji">➗</span> Division Problems</div>';
    html += '<div class="problems-grid">';
    divisionProblems.forEach(problem => {
      const globalIndex = problems.indexOf(problem);
      html += renderProblemBox(problem, globalIndex);
    });
    html += '</div>';
  }

  container.innerHTML = html;

  // Auto-open the first problem
  setTimeout(() => {
    openNumberPad(0);
  }, 300);
}

function renderProblemBox(problem: Problem, index: number): string {
  return `
    <div class="problem-box" data-problem-index="${index}" onclick="openNumberPad(${index})">
      <div class="operation">${problem.num1}</div>
      <div class="operation">${problem.operation}</div>
      <div class="operation">${problem.num2}</div>
      <div style="border-top: 2px solid #667eea; margin: 10px 0;"></div>
      <input type="number" class="answer-input" id="answer${index}" placeholder="?" min="0" max="999999" readonly style="cursor: pointer;">
    </div>
  `;
}

function resetWorksheet(): void {
  const resultDiv = document.getElementById('result');
  const statsPanel = document.getElementById('statsPanel');

  if (resultDiv) {
    resultDiv.innerHTML = '';
    resultDiv.className = 'result';
  }
  if (statsPanel) statsPanel.style.display = 'none';

  correctStreak = 0;
  totalAnswered = 0;
  updateStreakDisplay();
  updateProgressBar();

  problems.forEach((_, index) => {
    const input = document.getElementById(`answer${index}`) as HTMLInputElement;
    const problemBox = document.querySelector(`[data-problem-index="${index}"]`);
    if (input) {
      input.value = '';
      input.style.borderColor = '#667eea';
      input.style.backgroundColor = 'white';
    }
    if (problemBox) {
      problemBox.classList.remove('correct', 'incorrect');
    }
  });
}

function changeName(): void {
  childName = '';
  correctStreak = 0;
  totalAnswered = 0;
  currentProfile = null;

  const profilePanel = document.getElementById('profilePanel');
  const newProfileInput = document.getElementById('newProfileName') as HTMLInputElement;
  const greetingText = document.getElementById('greetingText');

  if (profilePanel) profilePanel.style.display = 'block';
  if (newProfileInput) {
    newProfileInput.value = '';
  }
  if (greetingText) greetingText.textContent = "Let's solve some addition and subtraction!";

  updateStreakDisplay();
  updateProgressBar();
  resetWorksheet();

  // Reload profiles
  loadProfiles();
}

// Expose functions to window for inline onclick handlers (Vite ES modules fix)
(window as any).startWithName = startWithName;
(window as any).createNewProfile = createNewProfile;
(window as any).selectProfile = selectProfile;
(window as any).viewProfileStats = viewProfileStats;
(window as any).closeProfileStats = closeProfileStats;
(window as any).confirmDeleteProfile = confirmDeleteProfile;
(window as any).openSettings = openSettings;
(window as any).closeSettings = closeSettings;
(window as any).openNumberPad = openNumberPad;
(window as any).closeNumberPad = closeNumberPad;
(window as any).padNumber = padNumber;
(window as any).padBackspace = padBackspace;
(window as any).confirmAndNext = confirmAndNext;
(window as any).skipQuestion = skipQuestion;
(window as any).checkAnswers = checkAnswers;
(window as any).generateProblems = generateProblems;
(window as any).resetWorksheet = resetWorksheet;
(window as any).changeName = changeName;
