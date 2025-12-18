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
  UserProfile,
  DifficultyLevel,
  DifficultyPreset
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
  deleteProfile,
  checkAndAwardBadges,
  getEarnedBadges,
  getAllProfiles,
  updateProfile,
  getAvatarOptions,
  exportProfiles,
  importProfiles
} from './storage';

// Import i18n utilities
import {
  loadLanguage,
  setLanguage,
  t,
  getCurrentLanguage,
  languageNames
} from './i18n';
import type { Language } from './types';

// Difficulty Presets
const DIFFICULTY_PRESETS: DifficultyPreset[] = [
  {
    level: 'easy',
    name: 'Easy',
    description: 'Addition & Subtraction (1-10)',
    icon: '🌱',
    settings: {
      numProblems: 5,
      maxNum: 10,
      minNum: 1,
      includeAddition: true,
      includeSubtraction: true,
      includeMultiplication: false,
      includeDivision: false
    }
  },
  {
    level: 'medium',
    name: 'Medium',
    description: 'All operations (1-20)',
    icon: '🌟',
    settings: {
      numProblems: 10,
      maxNum: 20,
      minNum: 1,
      includeAddition: true,
      includeSubtraction: true,
      includeMultiplication: true,
      includeDivision: true
    }
  },
  {
    level: 'hard',
    name: 'Hard',
    description: 'All operations (1-100)',
    icon: '🚀',
    settings: {
      numProblems: 15,
      maxNum: 100,
      minNum: 1,
      includeAddition: true,
      includeSubtraction: true,
      includeMultiplication: true,
      includeDivision: true
    }
  }
];

// Application state
let problems: Problem[] = [];
let currentInputIndex: number | null = null;
let padValue: string = '';
let padValueChanged: boolean = false; // Track if user made changes in number pad
let childName: string = '';
let correctStreak: number = 0;
let totalAnswered: number = 0;
let sessionStartTime: number = 0;
let currentProfile: UserProfile | null = null;
let currentDifficulty: DifficultyLevel = 'medium';
let timedMode: boolean = false;
let timeLimit: number = 300; // 5 minutes default
let timeRemaining: number = 0;
let timerInterval: number | null = null;
let voiceFeedbackEnabled: boolean = false;

// Load voice feedback preference from localStorage
function loadVoiceFeedbackPreference(): boolean {
  const saved = localStorage.getItem('mathplay_voiceFeedback');
  return saved === 'true';
}

// Save voice feedback preference to localStorage
function saveVoiceFeedbackPreference(enabled: boolean): void {
  localStorage.setItem('mathplay_voiceFeedback', enabled.toString());
}

// Toggle voice feedback and save preference
function toggleVoiceFeedback(enabled: boolean): void {
  console.log('Toggling voice feedback to:', enabled);
  voiceFeedbackEnabled = enabled;
  saveVoiceFeedbackPreference(enabled);
}

// Handle voice feedback checkbox change
function handleVoiceFeedbackChange(): void {
  const voiceFeedbackInput = document.getElementById('voiceFeedback') as HTMLInputElement;
  if (voiceFeedbackInput) {
    console.log('Voice feedback checkbox changed to:', voiceFeedbackInput.checked);
    toggleVoiceFeedback(voiceFeedbackInput.checked);

    // Test speech immediately when enabled
    if (voiceFeedbackInput.checked) {
      speak('Voice feedback enabled!');
    }
  }
}

// Global AudioContext for sound effects (iOS compatibility)
let audioContext: AudioContext | null = null;

// Initialize AudioContext on first user interaction (required for iOS)
function initAudioContext(): void {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Resume context if suspended (iOS requirement)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

// Sound effects using Web Audio API
function playSound(type: SoundType): void {
  try {
    // Initialize or resume AudioContext
    initAudioContext();

    if (!audioContext) return;

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
  } catch (error) {
    console.log('Audio playback error:', error);
  }
}

// Keep track of current utterance to prevent garbage collection
let currentUtterance: SpeechSynthesisUtterance | null = null;

// Text-to-Speech voice feedback
function speak(text: string): void {
  if (!voiceFeedbackEnabled) {
    console.log('Voice feedback disabled');
    return;
  }

  console.log('=== TTS Debug: Attempting to speak:', text);

  // Check if browser supports speech synthesis
  if (!('speechSynthesis' in window)) {
    console.log('Speech synthesis not supported');
    return;
  }

  try {
    // Check speech synthesis state
    console.log('=== TTS Debug: speechSynthesis.speaking:', window.speechSynthesis.speaking);
    console.log('=== TTS Debug: speechSynthesis.pending:', window.speechSynthesis.pending);
    console.log('=== TTS Debug: speechSynthesis.paused:', window.speechSynthesis.paused);

    // Cancel any previous speech
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      console.log('=== TTS Debug: Canceling previous speech');
      window.speechSynthesis.cancel();

      // Small delay to ensure cancellation completes
      setTimeout(() => {
        actuallySpeak(text);
      }, 50);
    } else {
      actuallySpeak(text);
    }
  } catch (error) {
    console.error('=== TTS Debug: Speech synthesis error:', error);
  }
}

// Separated function to actually perform speech
function actuallySpeak(text: string): void {
  console.log('=== TTS Debug: actuallySpeak called with:', text);

  // Create new utterance
  currentUtterance = new SpeechSynthesisUtterance(text);

  // Set basic properties
  currentUtterance.lang = 'en-US';
  currentUtterance.rate = 0.9;
  currentUtterance.pitch = 1.1;
  currentUtterance.volume = 1.0;

  // Handle speech errors
  currentUtterance.onerror = (event) => {
    console.error('=== TTS Debug: Speech error:', event.error, event);
  };

  // Handle speech start
  currentUtterance.onstart = () => {
    console.log('=== TTS Debug: Speech STARTED successfully');
  };

  // Handle speech end
  currentUtterance.onend = () => {
    console.log('=== TTS Debug: Speech ENDED successfully');
    currentUtterance = null;
  };

  // Function to actually speak
  const doSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    console.log('=== TTS Debug: Available voices:', voices.length);

    if (voices.length > 0) {
      // Try to find an English voice
      const englishVoice = voices.find(voice =>
        voice.lang.startsWith('en')
      );

      if (englishVoice) {
        currentUtterance!.voice = englishVoice;
        console.log('=== TTS Debug: Using voice:', englishVoice.name, '| Lang:', englishVoice.lang);
      } else {
        console.log('=== TTS Debug: No English voice found, using default');
      }
    } else {
      console.log('=== TTS Debug: No voices available!');
    }

    console.log('=== TTS Debug: Calling speechSynthesis.speak()...');
    window.speechSynthesis.speak(currentUtterance!);

    // Verify it was added to queue
    setTimeout(() => {
      console.log('=== TTS Debug: After speak() - speaking:', window.speechSynthesis.speaking);
      console.log('=== TTS Debug: After speak() - pending:', window.speechSynthesis.pending);
    }, 10);
  };

  // Chrome/Safari may need to wait for voices to load
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    console.log('=== TTS Debug: Waiting for voices to load...');
    window.speechSynthesis.onvoiceschanged = () => {
      console.log('=== TTS Debug: Voices loaded event fired');
      doSpeak();
    };
  } else {
    doSpeak();
  }
}

// Problem-specific speech
function speakProblem(problem: Problem): void {
  if (!voiceFeedbackEnabled) return;

  const operationWords: { [key: string]: string } = {
    '+': t('plus'),
    '-': t('minus'),
    '×': t('times'),
    '÷': t('dividedBy')
  };

  const text = `${problem.num1} ${operationWords[problem.operation]} ${problem.num2}`;
  speak(text);
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

// Show badge earned notification
function showBadgeNotification(badge: any): void {
  const notification = document.createElement('div');
  notification.className = 'badge-notification';
  notification.innerHTML = `
    <div class="badge-notification-content">
      <div class="badge-icon">${badge.icon}</div>
      <div class="badge-info">
        <div class="badge-name">${t('badgeEarned')}</div>
        <div class="badge-title">${badge.name}</div>
        <div class="badge-desc">${badge.description}</div>
      </div>
    </div>
  `;
  document.body.appendChild(notification);

  // Play sound
  playSound('correct');

  // Announce badge
  speak(`${t('congratulations')} ${badge.name} ${t('badgeEarned')}`);

  // Create extra confetti for badge
  createConfetti();

  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 4000);
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

  // Calculate percentage based on total problems, not just answered ones
  const percentage = problems.length > 0 ? Math.round((correct / problems.length) * 100) : 0;

  saveSessionProgress(childName, answers, correct, wrong, percentage, correctStreak);
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

  // Restore streak if it exists
  if (session.currentStreak !== undefined) {
    correctStreak = session.currentStreak;
    updateStreakDisplay();
  }

  // Restore answers silently (no sounds, no streak updates)
  setTimeout(() => {
    session.answers.forEach((answer: number | null, index: number) => {
      if (answer !== null) {
        const input = document.getElementById(`answer${index}`) as HTMLInputElement;
        if (input) {
          input.value = answer.toString();
          validateAnswer(index, true); // silent = true
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

    const avatar = profile.avatar || '😊';

    return `
      <div class="profile-card">
        <div class="profile-info">
          <div class="profile-name"><span class="profile-avatar">${avatar}</span> ${profile.name}</div>
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
          <button class="profile-btn profile-btn-edit" onclick="openEditProfile('${name}')">Edit</button>
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
  const userWelcome = document.getElementById('userWelcome');
  const userName = document.getElementById('userName');
  const userAvatar = document.querySelector('.user-avatar');
  const greetingText = document.getElementById('greetingText');

  if (profilePanel) profilePanel.style.display = 'none';
  if (userWelcome) userWelcome.style.display = 'inline-flex';
  if (userName) userName.textContent = childName;
  if (userAvatar && currentProfile) userAvatar.textContent = currentProfile.avatar || '😊';
  if (greetingText) {
    greetingText.textContent = `Let's practice some math! 🌟`;
  }

  // Start fresh
  generateProblems();

  // Update profile switcher
  updateProfileSwitcher();
}

function selectProfile(name: string): void {
  childName = name;
  sessionStartTime = Date.now();
  currentProfile = getProfile(name);

  // Reset streak before restoring or starting new session
  correctStreak = 0;
  updateStreakDisplay();

  // Check if there's a current session to restore
  if (currentProfile?.currentSession && !currentProfile.currentSession.completed) {
    restoreSession(currentProfile.currentSession);
  } else {
    // Start fresh
    generateProblems();
  }

  const profilePanel = document.getElementById('profilePanel');
  const userWelcome = document.getElementById('userWelcome');
  const userName = document.getElementById('userName');
  const userAvatar = document.querySelector('.user-avatar');
  const greetingText = document.getElementById('greetingText');

  if (profilePanel) profilePanel.style.display = 'none';
  if (userWelcome) userWelcome.style.display = 'inline-flex';
  if (userName) userName.textContent = childName;
  if (userAvatar && currentProfile) userAvatar.textContent = currentProfile.avatar || '😊';
  if (greetingText) {
    greetingText.textContent = `Welcome back! Let's practice! 🌟`;
  }

  // Update profile switcher
  updateProfileSwitcher();
}

// Update profile switcher button and menu
function updateProfileSwitcher(): void {
  const profileAvatarBtn = document.getElementById('profileAvatarBtn');
  const headerAvatar = document.getElementById('headerAvatar');
  const profileNames = getProfileNames();

  if (!profileAvatarBtn || !headerAvatar) return;

  // Show avatar button only if there are multiple profiles and a user is logged in
  if (profileNames.length > 1 && childName) {
    profileAvatarBtn.style.display = 'flex';

    // Update button with current user's avatar
    const currentProfile = getProfile(childName);
    if (currentProfile) {
      headerAvatar.textContent = currentProfile.avatar || '😊';
    }
  } else {
    profileAvatarBtn.style.display = 'none';
  }
}

// Toggle profile switcher menu
function toggleProfileSwitcher(): void {
  const menu = document.getElementById('profileSwitcherMenu');
  const list = document.getElementById('profileSwitcherList');

  if (!menu || !list) return;

  // Toggle menu visibility
  if (menu.style.display === 'none' || menu.style.display === '') {
    // Populate the list
    const profileNames = getProfileNames();

    list.innerHTML = profileNames
      .filter(name => name !== childName)
      .map(name => {
        const profile = getProfile(name);
        const avatar = profile?.avatar || '😊';
        const accuracy = profile ?
          (profile.stats.totalCorrect + profile.stats.totalWrong > 0
            ? Math.round((profile.stats.totalCorrect / (profile.stats.totalCorrect + profile.stats.totalWrong)) * 100)
            : 0)
          : 0;

        return `
          <div class="profile-switcher-item" onclick="switchToProfile('${name}')">
            <span class="profile-switcher-avatar">${avatar}</span>
            <div class="profile-switcher-info">
              <div class="profile-switcher-name">${name}</div>
              <div class="profile-switcher-stat">${accuracy}% accuracy</div>
            </div>
          </div>
        `;
      })
      .join('');

    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
}

// Switch to a different profile
function switchToProfile(name: string): void {
  // Close the menu
  const menu = document.getElementById('profileSwitcherMenu');
  if (menu) menu.style.display = 'none';

  // Switch to the profile
  selectProfile(name);
}

// Handle profile switch from dropdown
function switchProfile(): void {
  const dropdown = document.getElementById('profileDropdown') as HTMLSelectElement;
  if (!dropdown || !dropdown.value) return;

  const selectedProfile = dropdown.value;

  // Reset dropdown to default
  dropdown.value = '';

  // Switch to selected profile
  selectProfile(selectedProfile);
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

  if (statsProfileNameEl) statsProfileNameEl.innerHTML = `${profile.avatar || '😊'} ${profile.name}`;
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

  // Display badges
  const badgesListEl = document.getElementById('badgesList');
  if (badgesListEl && profile.badges) {
    const earnedBadges = profile.badges.filter(b => b.earned);

    if (earnedBadges.length === 0) {
      badgesListEl.innerHTML = '<div class="no-badges">No badges earned yet! Keep practicing to unlock achievements!</div>';
    } else {
      badgesListEl.innerHTML = earnedBadges.map(badge => {
        const earnedDate = badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : '';
        return `
          <div class="badge-card">
            <div class="badge-icon-large">${badge.icon}</div>
            <div class="badge-details">
              <div class="badge-name">${badge.name}</div>
              <div class="badge-description">${badge.description}</div>
              <div class="badge-earned-date">Earned: ${earnedDate}</div>
            </div>
          </div>
        `;
      }).join('');
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

// Edit Profile Functions
function openEditProfile(name: string): void {
  const profile = getProfile(name);
  if (!profile) return;

  const modal = document.getElementById('editProfileModal');
  if (!modal) return;

  // Set current values
  const nameInput = document.getElementById('editProfileName') as HTMLInputElement;
  const currentAvatarEl = document.getElementById('currentAvatar');

  if (nameInput) nameInput.value = profile.name;
  if (currentAvatarEl) currentAvatarEl.textContent = profile.avatar || '😊';

  // Store the original name for updating
  modal.setAttribute('data-original-name', name);

  // Render avatar options
  renderAvatarOptions(profile.avatar || '😊');

  modal.style.display = 'block';
}

function renderAvatarOptions(selectedAvatar: string): void {
  const container = document.getElementById('avatarOptions');
  if (!container) return;

  const avatars = getAvatarOptions();

  container.innerHTML = avatars.map(avatar => `
    <button
      class="avatar-option ${avatar === selectedAvatar ? 'avatar-option-selected' : ''}"
      onclick="selectAvatar('${avatar}')"
      type="button"
    >
      ${avatar}
    </button>
  `).join('');
}

function selectAvatar(avatar: string): void {
  const currentAvatarEl = document.getElementById('currentAvatar');
  if (currentAvatarEl) currentAvatarEl.textContent = avatar;

  // Update selected state
  document.querySelectorAll('.avatar-option').forEach(btn => {
    btn.classList.remove('avatar-option-selected');
  });

  const selectedBtn = Array.from(document.querySelectorAll('.avatar-option'))
    .find(btn => btn.textContent?.trim() === avatar);
  if (selectedBtn) {
    selectedBtn.classList.add('avatar-option-selected');
  }
}

function saveProfileEdits(): void {
  const modal = document.getElementById('editProfileModal');
  if (!modal) return;

  const originalName = modal.getAttribute('data-original-name');
  if (!originalName) return;

  const nameInput = document.getElementById('editProfileName') as HTMLInputElement;
  const currentAvatarEl = document.getElementById('currentAvatar');

  const newName = nameInput?.value.trim();
  const newAvatar = currentAvatarEl?.textContent?.trim();

  if (!newName) {
    alert('Please enter a name! 😊');
    return;
  }

  try {
    const updatedProfile = updateProfile(originalName, newName !== originalName ? newName : undefined, newAvatar);

    if (updatedProfile) {
      // If this was the current active profile, update the UI
      if (childName === originalName) {
        childName = updatedProfile.name;
        const userName = document.getElementById('userName');
        if (userName) userName.textContent = childName;
      }

      closeEditProfile();
      loadProfiles();
    }
  } catch (error: any) {
    alert(error.message || 'Error updating profile');
  }
}

function closeEditProfile(): void {
  const modal = document.getElementById('editProfileModal');
  if (modal) modal.style.display = 'none';
}

// Parent Dashboard Functions
function openParentDashboard(): void {
  const data = getAllProfiles();
  const profiles = Object.values(data.profiles);

  if (profiles.length === 0) {
    alert('No profiles to display! Create some profiles first.');
    return;
  }

  // Calculate summary stats (including current sessions)
  let totalSessions = 0;
  let totalProblems = 0;
  let totalCorrect = 0;
  let totalWrong = 0;

  profiles.forEach(p => {
    totalSessions += p.stats.totalSessions;
    totalProblems += p.stats.totalProblems;
    totalCorrect += p.stats.totalCorrect;
    totalWrong += p.stats.totalWrong;

    // Include current session if exists
    if (p.currentSession) {
      totalProblems += p.currentSession.problems.length;
      totalCorrect += p.currentSession.correctCount;
      totalWrong += p.currentSession.wrongCount;
    }
  });

  const totalAccuracy = totalCorrect + totalWrong > 0
    ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
    : 0;
  const totalBadges = profiles.reduce((sum, p) =>
    sum + (p.badges?.filter(b => b.earned).length || 0), 0
  );

  // Summary cards
  const summaryEl = document.getElementById('dashboardSummary');
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="dashboard-stats-grid">
        <div class="dashboard-stat-card">
          <div class="dashboard-stat-icon">👥</div>
          <div class="dashboard-stat-value">${profiles.length}</div>
          <div class="dashboard-stat-label">Active Profiles</div>
        </div>
        <div class="dashboard-stat-card">
          <div class="dashboard-stat-icon">📝</div>
          <div class="dashboard-stat-value">${totalSessions}</div>
          <div class="dashboard-stat-label">Total Sessions</div>
        </div>
        <div class="dashboard-stat-card">
          <div class="dashboard-stat-icon">🎯</div>
          <div class="dashboard-stat-value">${totalProblems}</div>
          <div class="dashboard-stat-label">Problems Solved</div>
        </div>
        <div class="dashboard-stat-card">
          <div class="dashboard-stat-icon">✅</div>
          <div class="dashboard-stat-value">${totalAccuracy}%</div>
          <div class="dashboard-stat-label">Overall Accuracy</div>
        </div>
        <div class="dashboard-stat-card">
          <div class="dashboard-stat-icon">🏆</div>
          <div class="dashboard-stat-value">${totalBadges}</div>
          <div class="dashboard-stat-label">Badges Earned</div>
        </div>
      </div>
    `;
  }

  // Profile comparison
  const comparisonEl = document.getElementById('profileComparison');
  if (comparisonEl) {
    comparisonEl.innerHTML = profiles.map(profile => {
      // Include current session in calculations
      let totalCorrect = profile.stats.totalCorrect;
      let totalWrong = profile.stats.totalWrong;
      let totalProblems = profile.stats.totalProblems;
      let currentStreak = 0;

      if (profile.currentSession) {
        totalCorrect += profile.currentSession.correctCount;
        totalWrong += profile.currentSession.wrongCount;
        totalProblems += profile.currentSession.problems.length;
        currentStreak = profile.currentSession.currentStreak || 0;
      }

      const accuracy = totalCorrect + totalWrong > 0
        ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
        : 0;
      const earnedBadges = profile.badges?.filter(b => b.earned).length || 0;
      const bestStreak = Math.max(profile.stats.bestStreak, currentStreak);

      return `
        <div class="comparison-card">
          <div class="comparison-header"><span style="font-size: 1.5em; margin-right: 8px;">${profile.avatar || '😊'}</span>${profile.name}${profile.currentSession ? ' 🎮' : ''}</div>
          <div class="comparison-stats">
            <div class="comparison-stat">
              <span>Sessions:</span> <strong>${profile.stats.totalSessions}${profile.currentSession ? ' (+ current)' : ''}</strong>
            </div>
            <div class="comparison-stat">
              <span>Problems:</span> <strong>${totalProblems}</strong>
            </div>
            <div class="comparison-stat">
              <span>Accuracy:</span> <strong>${accuracy}%</strong>
            </div>
            <div class="comparison-stat">
              <span>Best Streak:</span> <strong>${bestStreak}</strong>
            </div>
            <div class="comparison-stat">
              <span>Badges:</span> <strong>${earnedBadges}</strong>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Recent activity
  const recentActivityEl = document.getElementById('recentActivity');
  if (recentActivityEl) {
    const allSessions: Array<{ profileData: typeof profiles[0]; session: any }> = [];

    profiles.forEach(profile => {
      profile.history.forEach(session => {
        allSessions.push({ profileData: profile, session });
      });
    });

    allSessions.sort((a, b) =>
      new Date(b.session.date).getTime() - new Date(a.session.date).getTime()
    );

    if (allSessions.length === 0) {
      recentActivityEl.innerHTML = '<div class="no-activity">No activity yet!</div>';
    } else {
      recentActivityEl.innerHTML = allSessions.slice(0, 10).map(({ profileData, session }) => {
        const date = new Date(session.date).toLocaleDateString();
        const time = new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const avatar = profileData.avatar || '😊';

        return `
          <div class="activity-item">
            <div class="activity-profile">${avatar} ${profileData.name}</div>
            <div class="activity-details">
              <span>📅 ${date} at ${time}</span>
              <span>📝 ${session.problems.length} problems</span>
              <span>✅ ${session.correctCount} correct</span>
              <span>📊 ${session.percentage}%</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Badge leaderboard
  const badgeLeaderboardEl = document.getElementById('badgeLeaderboard');
  if (badgeLeaderboardEl) {
    const profileBadges = profiles.map(profile => ({
      name: profile.name,
      avatar: profile.avatar || '😊',
      badges: profile.badges?.filter(b => b.earned).length || 0
    })).sort((a, b) => b.badges - a.badges);

    badgeLeaderboardEl.innerHTML = profileBadges.map((item, index) => `
      <div class="leaderboard-item">
        <div class="leaderboard-rank">${index + 1}</div>
        <div class="leaderboard-name">${item.avatar} ${item.name}</div>
        <div class="leaderboard-badges">🏆 ${item.badges} badges</div>
      </div>
    `).join('');
  }

  const modal = document.getElementById('parentDashboardModal');
  if (modal) modal.style.display = 'block';
}

function closeParentDashboard(): void {
  const modal = document.getElementById('parentDashboardModal');
  if (modal) modal.style.display = 'none';
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

  // Initialize language settings
  initializeApp();
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
  const settingsModal = document.getElementById('settingsModal');
  const numberpadModal = document.getElementById('numberpadModal');
  const profileStatsModal = document.getElementById('profileStatsModal');
  const parentDashboardModal = document.getElementById('parentDashboardModal');
  const printSettingsModal = document.getElementById('printSettingsModal');
  const editProfileModal = document.getElementById('editProfileModal');
  const profileSwitcherMenu = document.getElementById('profileSwitcherMenu');
  const profileAvatarBtn = document.getElementById('profileAvatarBtn');
  const exportModal = document.getElementById('exportModal');
  const importModal = document.getElementById('importModal');

  // Close settings modal if clicking on backdrop
  if (event.target === settingsModal) {
    closeSettings();
  }

  // Close number pad modal if clicking on backdrop
  if (event.target === numberpadModal) {
    closeNumberPad();
  }

  // Close profile stats modal if clicking on backdrop
  if (event.target === profileStatsModal) {
    closeProfileStats();
  }

  // Close parent dashboard modal if clicking on backdrop
  if (event.target === parentDashboardModal) {
    closeParentDashboard();
  }

  // Close print settings modal if clicking on backdrop
  if (event.target === printSettingsModal) {
    closePrintSettings();
  }

  // Close edit profile modal if clicking on backdrop
  if (event.target === editProfileModal) {
    closeEditProfile();
  }

  // Close export modal if clicking on backdrop
  if (event.target === exportModal) {
    closeExportModal();
  }

  // Close import modal if clicking on backdrop
  if (event.target === importModal) {
    closeImportModal();
  }

  // Close profile switcher menu if clicking outside
  if (profileSwitcherMenu && profileSwitcherMenu.style.display === 'block') {
    const target = event.target as HTMLElement;
    if (!profileSwitcherMenu.contains(target) && !profileAvatarBtn?.contains(target)) {
      profileSwitcherMenu.style.display = 'none';
    }
  }
});

function openNumberPad(inputIndex: number): void {
  // Initialize audio context on first user interaction (iOS requirement)
  initAudioContext();

  currentInputIndex = inputIndex;
  const input = document.getElementById(`answer${inputIndex}`) as HTMLInputElement;
  padValue = input.value || '';
  padValueChanged = false; // Reset changed flag when opening
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

  // Add keyboard event listener
  document.addEventListener('keydown', handleNumberPadKeyboard);

  // Speak the problem after modal is visible
  setTimeout(() => {
    speakProblem(problem);
  }, 200);
}

function closeNumberPad(): void {
  // Cancel any ongoing speech
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  // Remove keyboard event listener
  document.removeEventListener('keydown', handleNumberPadKeyboard);

  // Only validate if user actually made changes in the number pad
  if (currentInputIndex !== null && padValue !== '' && padValueChanged) {
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
  padValueChanged = false; // Reset flag
}

// Handle keyboard input for number pad
function handleNumberPadKeyboard(event: KeyboardEvent): void {
  // Only handle keyboard if number pad is open
  const modal = document.getElementById('numberpadModal');
  if (!modal || modal.style.display !== 'block') return;

  // Prevent default for handled keys
  const handledKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete', 'Enter'];
  if (handledKeys.includes(event.key)) {
    event.preventDefault();
  }

  // Handle number keys
  if (event.key >= '0' && event.key <= '9') {
    padNumber(parseInt(event.key));
  }
  // Handle backspace/delete
  else if (event.key === 'Backspace' || event.key === 'Delete') {
    if (event.ctrlKey || event.metaKey) {
      padClear(); // Ctrl+Backspace clears all
    } else {
      padBackspace();
    }
  }
  // Handle Enter key
  else if (event.key === 'Enter') {
    confirmAndNext();
  }
}

function padNumber(num: number): void {
  if (padValue.length < 8) {
    // Limit to 8 digits max (supports up to 99,999,999)
    padValue += num.toString();
    padValueChanged = true; // Mark as changed
    updatePadDisplay();
  }
}

function padBackspace(): void {
  padValue = padValue.slice(0, -1);
  padValueChanged = true; // Mark as changed
  updatePadDisplay();
}

function padClear(): void {
  padValue = '';
  padValueChanged = true; // Mark as changed
  updatePadDisplay();
}

function updatePadDisplay(): void {
  const display = document.getElementById('numberpadDisplay');
  if (display) {
    display.textContent = padValue || '';

    // Add placeholder styling when empty
    if (!padValue) {
      display.style.opacity = '0.5';
      display.textContent = 'Tap numbers';
    } else {
      display.style.opacity = '1';
    }
  }
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
function validateAnswer(index: number, silent: boolean = false): ValidationResult {
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
    if (!silent) {
      playSound('correct');
      speak(t('greatJob'));

      const modal = document.getElementById('numberpadModal');
      if (modal && modal.style.display === 'block') {
        createConfetti(); // Only show confetti during initial answering
      }
    }

    input.style.borderColor = '#51cf66';
    input.style.backgroundColor = '#e8f8f5';
    if (problemBox) {
      problemBox.classList.remove('incorrect');
      problemBox.classList.add('correct');
    }

    // Update streak only if not silent
    if (!silent) {
      correctStreak++;
      updateStreakDisplay();

      // Check for streak master badge immediately (10 correct in a row)
      if (correctStreak === 10 && childName) {
        const newBadges = checkAndAwardBadges(childName);
        if (newBadges.length > 0) {
          newBadges.forEach((badge) => {
            if (badge.id === 'streak-master') {
              setTimeout(() => {
                showBadgeNotification(badge);
              }, 500); // Small delay for smooth UX
            }
          });
        }
      }
    }

    return true; // Correct
  } else {
    // Wrong answer
    if (!silent) {
      playSound('wrong');
      speak(t('tryAgain'));
    }

    input.style.borderColor = '#ff6b6b';
    input.style.backgroundColor = '#ffe0e0';
    if (problemBox) {
      problemBox.classList.remove('correct');
      problemBox.classList.add('incorrect');
    }

    // Reset streak only if not silent
    if (!silent) {
      correctStreak = 0;
      updateStreakDisplay();
    }

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
  // Stop timer if running
  stopTimer();

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

    // Check and award badges
    const newBadges = checkAndAwardBadges(childName);

    // Show badge notifications
    if (newBadges.length > 0) {
      newBadges.forEach((badge, index) => {
        setTimeout(() => {
          showBadgeNotification(badge);
        }, index * 1000); // Stagger notifications by 1 second
      });
    }
  }
}

// Close modals on Escape key
document.addEventListener('keydown', function (event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeNumberPad();
    closeSettings();
    closeProfileStats();
    closeParentDashboard();
    closePrintSettings();
    closeEditProfile();
    closeExportModal();
    closeImportModal();
  }
});

// Set difficulty level and update UI
function setDifficulty(level: DifficultyLevel): void {
  currentDifficulty = level;

  // Update button states
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.classList.remove('difficulty-btn-active');
  });

  const activeBtn = document.querySelector(`[data-difficulty="${level}"]`);
  if (activeBtn) {
    activeBtn.classList.add('difficulty-btn-active');
  }

  // Apply preset if not custom
  if (level !== 'custom') {
    const preset = DIFFICULTY_PRESETS.find(p => p.level === level);
    if (preset) {
      applyDifficultyPreset(preset);
    }
  }
}

// Quick start with difficulty - used by quick start card
function startWithDifficulty(level: DifficultyLevel): void {
  // Set the difficulty
  setDifficulty(level);

  // Generate problems immediately
  generateProblems();
}

// Apply difficulty preset to settings
function applyDifficultyPreset(preset: DifficultyPreset): void {
  const numProblemsInput = document.getElementById('numProblems') as HTMLInputElement;
  const maxNumInput = document.getElementById('maxNum') as HTMLInputElement;
  const minNumInput = document.getElementById('minNum') as HTMLInputElement;
  const includeAdditionInput = document.getElementById('includeAddition') as HTMLInputElement;
  const includeSubtractionInput = document.getElementById('includeSubtraction') as HTMLInputElement;
  const includeMultiplicationInput = document.getElementById('includeMultiplication') as HTMLInputElement;
  const includeDivisionInput = document.getElementById('includeDivision') as HTMLInputElement;

  if (numProblemsInput) numProblemsInput.value = preset.settings.numProblems.toString();
  if (maxNumInput) maxNumInput.value = preset.settings.maxNum.toString();
  if (minNumInput) minNumInput.value = preset.settings.minNum.toString();
  if (includeAdditionInput) includeAdditionInput.checked = preset.settings.includeAddition;
  if (includeSubtractionInput) includeSubtractionInput.checked = preset.settings.includeSubtraction;
  if (includeMultiplicationInput) includeMultiplicationInput.checked = preset.settings.includeMultiplication;
  if (includeDivisionInput) includeDivisionInput.checked = preset.settings.includeDivision;
}

// Timer Functions
function startTimer(): void {
  const timerDisplay = document.getElementById('timerDisplay');
  if (timerDisplay) timerDisplay.style.display = 'block';

  timerInterval = window.setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining <= 0) {
      stopTimer();
      handleTimeUp();
    }
  }, 1000);
}

function stopTimer(): void {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerDisplay(): void {
  const timerText = document.getElementById('timerText');
  const timerDisplay = document.getElementById('timerDisplay');

  if (timerText && timerDisplay) {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Warning when under 1 minute
    if (timeRemaining <= 60) {
      timerDisplay.classList.add('timer-warning');
    } else {
      timerDisplay.classList.remove('timer-warning');
    }
  }
}

function handleTimeUp(): void {
  alert(`⏰ Time's up! Let's see how you did!`);
  checkAnswers();
}

function generateProblems(): void {
  // Initialize audio context on user interaction (iOS requirement)
  initAudioContext();

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

  // Handle timed mode
  const timedModeInput = document.getElementById('timedMode') as HTMLInputElement;
  const timeLimitInput = document.getElementById('timeLimit') as HTMLInputElement;

  timedMode = timedModeInput?.checked || false;
  timeLimit = parseInt(timeLimitInput?.value || '5') * 60; // Convert minutes to seconds

  // Stop any existing timer
  stopTimer();

  // Start timer if enabled
  if (timedMode) {
    timeRemaining = timeLimit;
    updateTimerDisplay();
    startTimer();
  } else {
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) timerDisplay.style.display = 'none';
  }

  // Voice feedback is already loaded from localStorage and set globally
  // No need to read from checkbox here - it's managed by handleVoiceFeedbackChange

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
    // Show quick start card with difficulty options
    container.innerHTML = `
      <div class="quick-start-card">
        <div class="quick-start-icon">🎯</div>
        <div class="quick-start-title">Ready to Practice Math?</div>
        <div class="quick-start-subtitle">Choose your difficulty level to get started!</div>

        <div class="quick-start-buttons">
          <button class="quick-start-btn quick-start-easy" onclick="startWithDifficulty('easy')">
            <span class="quick-start-btn-icon">🌱</span>
            <span class="quick-start-btn-name">Easy</span>
            <span class="quick-start-btn-desc">Addition & Subtraction (1-10)</span>
          </button>
          <button class="quick-start-btn quick-start-medium" onclick="startWithDifficulty('medium')">
            <span class="quick-start-btn-icon">🌟</span>
            <span class="quick-start-btn-name">Medium</span>
            <span class="quick-start-btn-desc">All operations (1-20)</span>
          </button>
          <button class="quick-start-btn quick-start-hard" onclick="startWithDifficulty('hard')">
            <span class="quick-start-btn-icon">🚀</span>
            <span class="quick-start-btn-name">Hard</span>
            <span class="quick-start-btn-desc">All operations (1-100)</span>
          </button>
        </div>

        <div class="quick-start-footer">
          Or <a href="#" onclick="openSettings(); return false;" class="quick-start-link">customize settings ⚙️</a>
        </div>
      </div>
    `;
    return;
  }

  // Separate by operation for better organization
  const additionProblems = problems.filter(p => p.operation === '+');
  const subtractionProblems = problems.filter(p => p.operation === '-');
  const multiplicationProblems = problems.filter(p => p.operation === '×');
  const divisionProblems = problems.filter(p => p.operation === '÷');

  let html = '';

  if (additionProblems.length > 0) {
    html += `<div class="section-title"><span class="emoji">➕</span> ${t('additionProblems')}</div>`;
    html += '<div class="problems-grid">';
    additionProblems.forEach(problem => {
      const globalIndex = problems.indexOf(problem);
      html += renderProblemBox(problem, globalIndex);
    });
    html += '</div>';
  }

  if (subtractionProblems.length > 0) {
    html += `<div class="section-title"><span class="emoji">➖</span> ${t('subtractionProblems')}</div>`;
    html += '<div class="problems-grid">';
    subtractionProblems.forEach(problem => {
      const globalIndex = problems.indexOf(problem);
      html += renderProblemBox(problem, globalIndex);
    });
    html += '</div>';
  }

  if (multiplicationProblems.length > 0) {
    html += `<div class="section-title"><span class="emoji">✖️</span> ${t('multiplicationProblems')}</div>`;
    html += '<div class="problems-grid">';
    multiplicationProblems.forEach(problem => {
      const globalIndex = problems.indexOf(problem);
      html += renderProblemBox(problem, globalIndex);
    });
    html += '</div>';
  }

  if (divisionProblems.length > 0) {
    html += `<div class="section-title"><span class="emoji">➗</span> ${t('divisionProblems')}</div>`;
    html += '<div class="problems-grid">';
    divisionProblems.forEach(problem => {
      const globalIndex = problems.indexOf(problem);
      html += renderProblemBox(problem, globalIndex);
    });
    html += '</div>';
  }

  container.innerHTML = html;
}

function renderProblemBox(problem: Problem, index: number): string {
  return `
    <div class="problem-box" data-problem-index="${index}" onclick="openNumberPad(${index})">
      <div class="operation">${problem.num1}</div>
      <div class="operation">${problem.operation}</div>
      <div class="operation">${problem.num2}</div>
      <div style="border-top: 2px solid #667eea; margin: 10px 0;"></div>
      <input type="number" class="answer-input" id="answer${index}" min="0" max="99999999" readonly style="cursor: pointer;">
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
  const userWelcome = document.getElementById('userWelcome');
  const greetingText = document.getElementById('greetingText');

  if (profilePanel) profilePanel.style.display = 'block';
  if (newProfileInput) {
    newProfileInput.value = '';
  }
  if (userWelcome) userWelcome.style.display = 'none';
  if (greetingText) {
    greetingText.style.display = 'block';
    greetingText.textContent = "Let's solve some addition and subtraction!";
  }

  updateStreakDisplay();
  updateProgressBar();
  resetWorksheet();

  // Reload profiles
  loadProfiles();
}

// Print worksheet functions
function openPrintSettings(): void {
  if (problems.length === 0) {
    alert('Please generate problems first!');
    return;
  }

  const modal = document.getElementById('printSettingsModal');
  if (modal) modal.style.display = 'block';
}

function closePrintSettings(): void {
  const modal = document.getElementById('printSettingsModal');
  if (modal) modal.style.display = 'none';
}

function doPrint(): void {
  // Get user settings
  const fontSelect = document.getElementById('printFont') as HTMLSelectElement;
  const columnsSelect = document.getElementById('printColumns') as HTMLSelectElement;
  const showAnswersCheckbox = document.getElementById('printShowAnswers') as HTMLInputElement;
  const showNameCheckbox = document.getElementById('printShowName') as HTMLInputElement;

  const selectedFont = fontSelect?.value || 'Comic Sans MS';
  const selectedColumns = columnsSelect?.value || '4';
  const showAnswers = showAnswersCheckbox?.checked ?? true;
  const showName = showNameCheckbox?.checked ?? true;

  // Generate simple unique worksheet code (format: WS-12345)
  const timestamp = Date.now().toString().slice(-5); // Last 5 digits
  const worksheetCode = `WS-${timestamp}`;

  // Apply CSS variables to document root
  document.documentElement.style.setProperty('--print-font', selectedFont);
  document.documentElement.style.setProperty('--print-columns', selectedColumns);

  // Create/update print header
  const container = document.querySelector('.container');
  if (!container) return;

  // Remove existing print elements
  let printHeader = document.querySelector('.print-header');
  if (printHeader) printHeader.remove();
  let printFooter = document.querySelector('.print-footer');
  if (printFooter) printFooter.remove();

  // Create new print header
  if (showName) {
    printHeader = document.createElement('div');
    printHeader.className = 'print-header';
    printHeader.innerHTML = `
      <div class="print-title">Math Fun Worksheet</div>
      <div class="print-name-line">
        Name: ____________________
      </div>
    `;
    container.insertBefore(printHeader, container.firstChild);
  }

  // Create print footer with code
  printFooter = document.createElement('div');
  printFooter.className = 'print-footer';
  printFooter.innerHTML = `Code: <strong>${worksheetCode}</strong>`;
  // Insert footer before answer key or at end
  const answerKey = document.querySelector('.answer-key');
  if (answerKey) {
    container.insertBefore(printFooter, answerKey);
  } else {
    container.appendChild(printFooter);
  }

  // Add section titles to print view
  addPrintSectionTitles();

  // Handle answer key
  if (showAnswers) {
    updateAnswerKeyDisplay(worksheetCode);
  } else {
    // Remove answer key if exists
    const answerKey = document.querySelector('.answer-key');
    if (answerKey) answerKey.remove();
  }

  // Close modal
  closePrintSettings();

  // Trigger print
  setTimeout(() => {
    window.print();

    // Cleanup after print
    setTimeout(() => {
      if (printHeader) printHeader.remove();
      if (printFooter) printFooter.remove();
      removePrintSectionTitles();
      if (!showAnswers) {
        const answerKey = document.querySelector('.answer-key');
        if (answerKey) answerKey.remove();
      }
    }, 100);
  }, 100);
}

// Add section titles for print view
function addPrintSectionTitles(): void {
  const sectionTitles = document.querySelectorAll('.section-title');
  sectionTitles.forEach(title => {
    title.classList.add('print-section-visible');
  });
}

// Remove print section titles after print
function removePrintSectionTitles(): void {
  const sectionTitles = document.querySelectorAll('.section-title');
  sectionTitles.forEach(title => {
    title.classList.remove('print-section-visible');
  });
}

function updateAnswerKeyDisplay(worksheetCode?: string): void {
  // Remove existing answer key
  let answerKey = document.querySelector('.answer-key');
  if (answerKey) {
    answerKey.remove();
  }

  // Add answer key
  if (problems.length > 0) {
    const container = document.querySelector('.container');
    if (!container) return;

    answerKey = document.createElement('div');
    answerKey.className = 'answer-key';

    const answersByOperation: { [key: string]: { num1: number; num2: number; op: string; answer: number; index: number }[] } = {};

    problems.forEach((problem, index) => {
      if (!answersByOperation[problem.operation]) {
        answersByOperation[problem.operation] = [];
      }
      answersByOperation[problem.operation].push({
        num1: problem.num1,
        num2: problem.num2,
        op: problem.operation,
        answer: problem.correct,
        index: index + 1
      });
    });

    let html = '<h2>Answer Key</h2>';

    // Add worksheet code if provided
    if (worksheetCode) {
      html += `<div style="text-align: right; font-size: 9pt; color: #999; margin-bottom: 15px;">Code: <strong>${worksheetCode}</strong></div>`;
    }

    Object.keys(answersByOperation).forEach(op => {
      const opName = {
        '+': 'Addition',
        '-': 'Subtraction',
        '×': 'Multiplication',
        '÷': 'Division'
      }[op] || '';

      html += `<h3>${opName}</h3>`;
      html += '<div class="answer-key-grid">';

      answersByOperation[op].forEach(item => {
        html += `
          <div class="answer-key-item">
            <strong>#${item.index}:</strong> ${item.num1} ${item.op} ${item.num2} = <strong>${item.answer}</strong>
          </div>
        `;
      });

      html += '</div>';
    });

    answerKey.innerHTML = html;
    container.appendChild(answerKey);
  }
}


// Language Management Functions
function changeLanguage(): void {
  const selectEl = document.getElementById('languageSelect') as HTMLSelectElement;
  if (!selectEl) return;

  const newLang = selectEl.value as Language;
  setLanguage(newLang);

  // Update all UI text with new language
  updateUIText();
}

function updateUIText(): void {
  // Update header
  const appTitleEl = document.querySelector('.header h1');
  if (appTitleEl) {
    appTitleEl.textContent = t('appTitle');
  }

  const greetingEl = document.getElementById('greetingText');
  if (greetingEl && !childName) {
    greetingEl.textContent = t('greeting');
  }

  // Update section titles
  const sectionTitles = document.querySelectorAll('.section-title');
  sectionTitles.forEach(el => {
    const text = el.textContent || '';
    if (text.includes('Addition') || text.includes('Suma') || text.includes('加法')) {
      el.innerHTML = `<span class="emoji">➕</span> ${t('additionProblems')}`;
    } else if (text.includes('Subtraction') || text.includes('Resta') || text.includes('减法')) {
      el.innerHTML = `<span class="emoji">➖</span> ${t('subtractionProblems')}`;
    } else if (text.includes('Multiplication') || text.includes('Multiplicación') || text.includes('乘法')) {
      el.innerHTML = `<span class="emoji">✖️</span> ${t('multiplicationProblems')}`;
    } else if (text.includes('Division') || text.includes('División') || text.includes('除法')) {
      el.innerHTML = `<span class="emoji">➗</span> ${t('divisionProblems')}`;
    }
  });
}

function initializeApp(): void {
  // Load saved language
  const savedLang = loadLanguage();
  const selectEl = document.getElementById('languageSelect') as HTMLSelectElement;
  if (selectEl) {
    selectEl.value = savedLang;
  }

  // Load voice feedback preference
  voiceFeedbackEnabled = loadVoiceFeedbackPreference();
  const voiceFeedbackInput = document.getElementById('voiceFeedback') as HTMLInputElement;
  if (voiceFeedbackInput) {
    voiceFeedbackInput.checked = voiceFeedbackEnabled;
  }

  // Update UI with loaded language
  updateUIText();
}


// Sync Functions - Export and Import Profiles
function openExportModal(): void {
  const modal = document.getElementById('exportModal');
  if (!modal) return;

  // Generate share code
  const shareCode = exportProfiles();
  const codeDisplay = document.getElementById('exportCodeDisplay') as HTMLTextAreaElement;
  if (codeDisplay) {
    codeDisplay.value = shareCode;
  }

  modal.style.display = 'block';
}

function closeExportModal(): void {
  const modal = document.getElementById('exportModal');
  if (modal) modal.style.display = 'none';
}

function copyExportCode(): void {
  const codeDisplay = document.getElementById('exportCodeDisplay') as HTMLTextAreaElement;
  if (!codeDisplay) return;

  codeDisplay.select();
  codeDisplay.setSelectionRange(0, 99999); // For mobile devices

  navigator.clipboard.writeText(codeDisplay.value).then(() => {
    const copyBtn = document.getElementById('copyExportBtn');
    if (copyBtn) {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    }
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy code. Please copy it manually.');
  });
}

function openImportModal(): void {
  const modal = document.getElementById('importModal');
  if (!modal) return;

  // Clear previous input
  const codeInput = document.getElementById('importCodeInput') as HTMLTextAreaElement;
  if (codeInput) {
    codeInput.value = '';
  }

  const resultEl = document.getElementById('importResult');
  if (resultEl) {
    resultEl.style.display = 'none';
  }

  modal.style.display = 'block';
}

function closeImportModal(): void {
  const modal = document.getElementById('importModal');
  if (modal) modal.style.display = 'none';
}

function doImport(): void {
  const codeInput = document.getElementById('importCodeInput') as HTMLTextAreaElement;
  const resultEl = document.getElementById('importResult');

  if (!codeInput || !resultEl) return;

  const shareCode = codeInput.value.trim();

  if (!shareCode) {
    alert('Please enter a share code!');
    return;
  }

  try {
    const importedNames = importProfiles(shareCode);

    resultEl.style.display = 'block';
    resultEl.className = 'import-result success';
    resultEl.innerHTML = `
      <div style="font-size: 1.2em; margin-bottom: 10px;">✅ Success!</div>
      <div>Imported ${importedNames.length} profile${importedNames.length > 1 ? 's' : ''}:</div>
      <ul style="margin-top: 10px; text-align: left;">
        ${importedNames.map(name => `<li><strong>${name}</strong></li>`).join('')}
      </ul>
      <div style="margin-top: 15px; font-size: 0.9em; color: #666;">
        Profiles have been merged with your existing data.
      </div>
    `;

    // Reload profiles list
    loadProfiles();

    // Clear input
    codeInput.value = '';
  } catch (error: any) {
    resultEl.style.display = 'block';
    resultEl.className = 'import-result error';
    resultEl.innerHTML = `
      <div style="font-size: 1.2em; margin-bottom: 10px;">❌ Error</div>
      <div>${error.message || 'Failed to import profiles'}</div>
    `;
  }
}


// Expose functions to window for inline onclick handlers (Vite ES modules fix)
(window as any).startWithName = startWithName;
(window as any).createNewProfile = createNewProfile;
(window as any).selectProfile = selectProfile;
(window as any).switchProfile = switchProfile;
(window as any).toggleProfileSwitcher = toggleProfileSwitcher;
(window as any).switchToProfile = switchToProfile;
(window as any).viewProfileStats = viewProfileStats;
(window as any).closeProfileStats = closeProfileStats;
(window as any).confirmDeleteProfile = confirmDeleteProfile;
(window as any).openEditProfile = openEditProfile;
(window as any).closeEditProfile = closeEditProfile;
(window as any).selectAvatar = selectAvatar;
(window as any).saveProfileEdits = saveProfileEdits;
(window as any).setDifficulty = setDifficulty;
(window as any).startWithDifficulty = startWithDifficulty;
(window as any).handleVoiceFeedbackChange = handleVoiceFeedbackChange;
(window as any).openSettings = openSettings;
(window as any).closeSettings = closeSettings;
(window as any).openNumberPad = openNumberPad;
(window as any).closeNumberPad = closeNumberPad;
(window as any).padNumber = padNumber;
(window as any).padBackspace = padBackspace;
(window as any).padClear = padClear;
(window as any).confirmAndNext = confirmAndNext;
(window as any).skipQuestion = skipQuestion;
(window as any).checkAnswers = checkAnswers;
(window as any).generateProblems = generateProblems;
(window as any).resetWorksheet = resetWorksheet;
(window as any).changeName = changeName;
(window as any).openPrintSettings = openPrintSettings;
(window as any).closePrintSettings = closePrintSettings;
(window as any).doPrint = doPrint;
(window as any).openParentDashboard = openParentDashboard;
(window as any).closeParentDashboard = closeParentDashboard;
(window as any).changeLanguage = changeLanguage;
(window as any).openExportModal = openExportModal;
(window as any).closeExportModal = closeExportModal;
(window as any).copyExportCode = copyExportCode;
(window as any).openImportModal = openImportModal;
(window as any).closeImportModal = closeImportModal;
(window as any).doImport = doImport;
