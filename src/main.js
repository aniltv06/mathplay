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

// Math Worksheet App - Main Application Logic
let problems = [];
let currentInputIndex = null;
let padValue = '';
let childName = '';
let correctStreak = 0;
let totalAnswered = 0;

// Sound effects using Web Audio API
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
function createConfetti() {
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
function showBonusMessage(message) {
    const bonus = document.createElement('div');
    bonus.className = 'bonus-message';
    bonus.textContent = message;
    document.body.appendChild(bonus);
    setTimeout(() => bonus.remove(), 1500);
}

// Update streak counter
function updateStreakDisplay() {
    const streakEl = document.getElementById('streakCounter');
    if (correctStreak > 0) {
        streakEl.style.display = 'block';
        streakEl.textContent = `🔥 Streak: ${correctStreak}`;

        // Milestone bonuses
        if (correctStreak % 5 === 0 && correctStreak > 0) {
            showBonusMessage(`🔥 ${correctStreak} in a row! Amazing!`);
        }
    } else {
        streakEl.style.display = 'none';
    }
}

// Update progress bar
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progress = (totalAnswered / problems.length) * 100;
    progressBar.style.width = progress + '%';
}

function startWithName() {
    const name = document.getElementById('childName').value.trim();
    if (name === '') {
        alert('Please enter your name! 😊');
        return;
    }
    childName = name;
    document.getElementById('namePanel').style.display = 'none';
    document.getElementById('greetingText').textContent = `Great to see you, ${childName}! 🌟 Let's practice!`;

    // Auto-generate problems with default values
    generateProblems();
}

// Allow Enter key to submit name
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('childName').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            startWithName();
        }
    });

    // Prevent browser extension errors on custom inputs
    const inputs = document.querySelectorAll('input[readonly]');
    inputs.forEach(input => {
        input.setAttribute('data-form-type', 'other');
        input.setAttribute('autocomplete', 'off');
    });

    // Service worker is automatically registered by Vite PWA plugin
});

function openSettings() {
    document.getElementById('settingsModal').style.display = 'block';
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

// Close settings modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('settingsModal');
    if (event.target === modal) {
        closeSettings();
    }
});

function openNumberPad(inputIndex) {
    currentInputIndex = inputIndex;
    const input = document.getElementById(`answer${inputIndex}`);
    padValue = input.value || '';
    updatePadDisplay();

    // Display the question in the number pad
    const problem = problems[inputIndex];
    document.getElementById('questionNum1').textContent = problem.num1;
    document.getElementById('questionOp').textContent = problem.operation;
    document.getElementById('questionNum2').textContent = problem.num2;
    document.getElementById('currentQuestion').textContent = inputIndex + 1;
    document.getElementById('totalQuestions').textContent = problems.length;

    document.getElementById('numberpadModal').style.display = 'block';
}

function closeNumberPad() {
    document.getElementById('numberpadModal').style.display = 'none';
    currentInputIndex = null;
    padValue = '';
}

function padNumber(num) {
    if (padValue.length < 3) { // Limit to 3 digits max (0-100+)
        padValue += num;
        updatePadDisplay();
    }
}

function padBackspace() {
    padValue = padValue.slice(0, -1);
    updatePadDisplay();
}

function updatePadDisplay() {
    const display = document.getElementById('numberpadDisplay');
    display.textContent = padValue || '0';
}

function confirmAndNext() {
    if (currentInputIndex !== null) {
        document.getElementById(`answer${currentInputIndex}`).value = padValue;

        // Auto-validate the answer
        const problem = problems[currentInputIndex];
        const problemBox = document.querySelector(`[data-problem-index="${currentInputIndex}"]`);
        const userAnswer = parseInt(padValue);

        totalAnswered++;

        if (userAnswer === problem.correct) {
            // Correct answer - Add rewards!
            playSound('correct');
            createConfetti();
            correctStreak++;

            document.getElementById(`answer${currentInputIndex}`).style.borderColor = '#51cf66';
            document.getElementById(`answer${currentInputIndex}`).style.backgroundColor = '#e8f8f5';
            if (problemBox) {
                problemBox.classList.remove('incorrect');
                problemBox.classList.add('correct');
            }

            updateStreakDisplay();
        } else {
            // Wrong answer
            playSound('wrong');
            correctStreak = 0;

            document.getElementById(`answer${currentInputIndex}`).style.borderColor = '#ff6b6b';
            document.getElementById(`answer${currentInputIndex}`).style.backgroundColor = '#ffe0e0';
            if (problemBox) {
                problemBox.classList.remove('correct');
                problemBox.classList.add('incorrect');
            }

            updateStreakDisplay();
        }

        updateProgressBar();
    }

    // Move to next question
    const nextIndex = currentInputIndex + 1;
    if (nextIndex < problems.length) {
        padValue = '';
        openNumberPad(nextIndex);
    } else {
        // All questions answered
        closeNumberPad();
        showCompletionMessage();
    }
}

function skipQuestion() {
    // Don't validate skipped questions - just move to next
    const nextIndex = currentInputIndex + 1;
    if (nextIndex < problems.length) {
        padValue = '';
        openNumberPad(nextIndex);
    } else {
        // All questions done
        closeNumberPad();
        showCompletionMessage();
    }
}

function showCompletionMessage() {
    const resultDiv = document.getElementById('result');
    resultDiv.className = 'result correct';
    resultDiv.innerHTML = `<div>Awesome job, ${childName}! You finished all the problems! 🎉</div><div class="emoji-feedback">⭐ 🎉 ⭐</div>`;

    // Auto-check answers when all completed
    setTimeout(() => {
        checkAnswers();
    }, 500);
}

function checkAnswers() {
    let correct = 0;
    let unanswered = 0;
    let unansweredProblems = [];

    problems.forEach((problem, index) => {
        const userAnswer = document.getElementById(`answer${index}`).value;
        const problemBox = document.querySelector(`[data-problem-index="${index}"]`);

        if (userAnswer === '') {
            unanswered++;
            unansweredProblems.push(index + 1);
            if (problemBox) problemBox.classList.remove('correct', 'incorrect');
        } else if (parseInt(userAnswer) === problem.correct) {
            correct++;
            document.getElementById(`answer${index}`).style.borderColor = '#51cf66';
            document.getElementById(`answer${index}`).style.backgroundColor = '#e8f8f5';
            if (problemBox) {
                problemBox.classList.remove('incorrect');
                problemBox.classList.add('correct');
            }
        } else {
            document.getElementById(`answer${index}`).style.borderColor = '#ff6b6b';
            document.getElementById(`answer${index}`).style.backgroundColor = '#ffe0e0';
            if (problemBox) {
                problemBox.classList.remove('correct');
                problemBox.classList.add('incorrect');
            }
        }
    });

    const wrong = problems.length - correct - unanswered;
    const percentage = Math.round((correct / problems.length) * 100);

    // Show stats
    document.getElementById('statsName').textContent = `${childName}'s Results`;
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('wrongCount').textContent = wrong;
    document.getElementById('scorePercentage').textContent = percentage;
    document.getElementById('statsPanel').style.display = 'block';

    // Show result message
    const resultDiv = document.getElementById('result');
    if (unanswered > 0) {
        resultDiv.className = 'result incorrect';
        resultDiv.innerHTML = `<div>⏰ Fill in ${unanswered} more: ${unansweredProblems.join(', ')}</div>`;
    } else {
        resultDiv.className = 'result correct';
        let emoji = '⭐';
        if (percentage === 100) emoji = '🌟 ⭐ 🎉';
        else if (percentage >= 80) emoji = '🌟 ⭐';
        resultDiv.innerHTML = `<div>Great job!</div><div class="emoji-feedback">${emoji}</div>`;
    }
}

// Close pad when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('numberpadModal');
    if (event.target === modal) {
        closeNumberPad();
    }
}

// Close pad on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeNumberPad();
    }
});

function generateProblems() {
    const numProblems = parseInt(document.getElementById('numProblems').value) || 5;
    const maxNum = parseInt(document.getElementById('maxNum').value) || 9;
    const minNum = parseInt(document.getElementById('minNum').value) || 1;
    const includeAddition = document.getElementById('includeAddition').checked;
    const includeSubtraction = document.getElementById('includeSubtraction').checked;
    const includeMultiplication = document.getElementById('includeMultiplication').checked;
    const includeDivision = document.getElementById('includeDivision').checked;

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

    // Generate the same number of problems for each operation
    // First, generate base number pairs
    const basePairs = [];
    for (let i = 0; i < numProblems; i++) {
        const num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        const num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        basePairs.push({ num1, num2 });
    }

    // Add addition problems
    if (includeAddition) {
        basePairs.forEach(pair => {
            problems.push({
                num1: pair.num1,
                num2: pair.num2,
                operation: '+',
                correct: pair.num1 + pair.num2
            });
        });
    }

    // Add subtraction problems (using same base pairs)
    if (includeSubtraction) {
        basePairs.forEach(pair => {
            // For subtraction, ensure result is positive
            const larger = Math.max(pair.num1, pair.num2);
            const smaller = Math.min(pair.num1, pair.num2);
            problems.push({
                num1: larger,
                num2: smaller,
                operation: '-',
                correct: larger - smaller
            });
        });
    }

    // Add multiplication problems
    if (includeMultiplication) {
        basePairs.forEach(pair => {
            problems.push({
                num1: pair.num1,
                num2: pair.num2,
                operation: '×',
                correct: pair.num1 * pair.num2
            });
        });
    }

    // Add division problems
    if (includeDivision) {
        basePairs.forEach(pair => {
            // For division, create problems where result is a whole number
            const divisor = Math.max(pair.num1, pair.num2);
            const dividend = divisor * Math.floor(Math.random() * 9 + 1); // Result between 1-9
            problems.push({
                num1: dividend,
                num2: divisor,
                operation: '÷',
                correct: Math.floor(dividend / divisor)
            });
        });
    }

    renderProblems();
    document.getElementById('result').innerHTML = '';
    document.getElementById('result').className = 'result';
}

function renderProblems() {
    const container = document.getElementById('problemsContainer');
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
        additionProblems.forEach((problem, index) => {
            const globalIndex = problems.indexOf(problem);
            html += renderProblemBox(problem, globalIndex);
        });
        html += '</div>';
    }

    if (subtractionProblems.length > 0) {
        html += '<div class="section-title"><span class="emoji">➖</span> Subtraction Problems</div>';
        html += '<div class="problems-grid">';
        subtractionProblems.forEach((problem, index) => {
            const globalIndex = problems.indexOf(problem);
            html += renderProblemBox(problem, globalIndex);
        });
        html += '</div>';
    }

    if (multiplicationProblems.length > 0) {
        html += '<div class="section-title"><span class="emoji">✖️</span> Multiplication Problems</div>';
        html += '<div class="problems-grid">';
        multiplicationProblems.forEach((problem, index) => {
            const globalIndex = problems.indexOf(problem);
            html += renderProblemBox(problem, globalIndex);
        });
        html += '</div>';
    }

    if (divisionProblems.length > 0) {
        html += '<div class="section-title"><span class="emoji">➗</span> Division Problems</div>';
        html += '<div class="problems-grid">';
        divisionProblems.forEach((problem, index) => {
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

function renderProblemBox(problem, index) {
    return `
        <div class="problem-box" data-problem-index="${index}" onclick="openNumberPad(${index})">
            <div class="operation">${problem.num1}</div>
            <div class="operation">${problem.operation}</div>
            <div class="operation">${problem.num2}</div>
            <div style="border-top: 2px solid #667eea; margin: 10px 0;"></div>
            <input type="number" class="answer-input" id="answer${index}" placeholder="?" min="0" max="100" readonly style="cursor: pointer;">
        </div>
    `;
}

function resetWorksheet() {
    document.getElementById('result').innerHTML = '';
    document.getElementById('result').className = 'result';
    document.getElementById('statsPanel').style.display = 'none';
    correctStreak = 0;
    totalAnswered = 0;
    updateStreakDisplay();
    updateProgressBar();
    problems.forEach((_, index) => {
        const input = document.getElementById(`answer${index}`);
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

function changeName() {
    childName = '';
    correctStreak = 0;
    totalAnswered = 0;
    document.getElementById('namePanel').style.display = 'block';
    document.getElementById('childName').value = '';
    document.getElementById('childName').focus();
    document.getElementById('greetingText').textContent = 'Let\'s solve some addition and subtraction!';
    updateStreakDisplay();
    updateProgressBar();
    resetWorksheet();
}

// Expose functions to window for inline onclick handlers (Vite ES modules fix)
window.startWithName = startWithName;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.openNumberPad = openNumberPad;
window.closeNumberPad = closeNumberPad;
window.padNumber = padNumber;
window.padBackspace = padBackspace;
window.confirmAndNext = confirmAndNext;
window.skipQuestion = skipQuestion;
window.checkAnswers = checkAnswers;
window.generateProblems = generateProblems;
window.resetWorksheet = resetWorksheet;
window.changeName = changeName;
