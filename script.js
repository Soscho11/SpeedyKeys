const textToType = document.getElementById('text-to-type');
const inputText = document.getElementById('input-text');
const timeEl = document.getElementById('time');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const resetBtn = document.getElementById('reset');
const difficultySelect = document.getElementById('difficulty');
const modeToggle = document.getElementById('mode-toggle');
const bestWPM = document.getElementById('best-wpm');
const bestAccuracy = document.getElementById('best-accuracy');

let startTime;
let timerInterval;

// Text samples by difficulty
const texts = {
    easy: "Coffee first, adulting second.",
    medium: "Typing is a fundamental skill that can improve productivity and communication.",
    hard: "Debugging code is like being a detective in a crime movie where you are also the murderer."
};

function loadText() {
    const difficulty = difficultySelect.value;
    textToType.textContent = texts[difficulty];
    inputText.value = '';
    timeEl.textContent = '0';
    wpmEl.textContent = '0';
    accuracyEl.textContent = '100';
    startTime = null;
    clearInterval(timerInterval);
}

function updateBestScores(wpm, accuracy) {
    let best = JSON.parse(localStorage.getItem('bestScores')) || { wpm: 0, accuracy: 0 };
    if (wpm > best.wpm) best.wpm = wpm;
    if (accuracy > best.accuracy) best.accuracy = accuracy;
    localStorage.setItem('bestScores', JSON.stringify(best));
    bestWPM.textContent = `Best WPM: ${best.wpm}`;
    bestAccuracy.textContent = `Best Accuracy: ${best.accuracy}%`;
}

// Load best scores on start
function loadBestScores() {
    let best = JSON.parse(localStorage.getItem('bestScores')) || { wpm: 0, accuracy: 0 };
    bestWPM.textContent = `Best WPM: ${best.wpm}`;
    bestAccuracy.textContent = `Best Accuracy: ${best.accuracy}%`;
}

inputText.addEventListener('input', () => {
    const input = inputText.value;
    const originalText = textToType.textContent;

    if (!startTime) {
        startTime = new Date();
        timerInterval = setInterval(updateTime, 1000);
    }

    let correct = 0;
    let htmlContent = '';
    for (let i = 0; i < originalText.length; i++) {
        if (i < input.length) {
            if (input[i] === originalText[i]) {
                htmlContent += `<span class="correct">${originalText[i]}</span>`;
                correct++;
            } else {
                htmlContent += `<span class="incorrect">${originalText[i]}</span>`;
            }
        } else {
            htmlContent += originalText[i];
        }
    }
    textToType.innerHTML = htmlContent;

    const accuracy = input.length === 0 ? 100 : Math.round((correct / input.length) * 100);
    accuracyEl.textContent = accuracy;

    const wordsTyped = input.trim().split(/\s+/).length;
    const minutes = ((new Date() - startTime) / 1000) / 60;
    const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
    wpmEl.textContent = wpm;

    if (input === originalText) {
        clearInterval(timerInterval);
        updateBestScores(wpm, accuracy);
    }
});

function updateTime() {
    const elapsed = Math.floor((new Date() - startTime) / 1000);
    timeEl.textContent = elapsed;
}

resetBtn.addEventListener('click', loadText);
difficultySelect.addEventListener('change', loadText);

// Dark/Light mode toggle
modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    modeToggle.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
});

// Initialize
loadText();
loadBestScores();
