// Game State Manager
let gameData = {
    coins: 100,
    lives: 3,
    activeMode: null
};

// Questions Database (in English)
const quizQuestions = [
    {
        q: "In which year was the United States Central Bank (Federal Reserve) established?",
        options: ["1913", "1776", "1945", "1890"],
        correct: 0
    },
    {
        q: "What emotional expression is primarily represented by the 'Anchihoye' scale in Ethiopian music?",
        options: ["Joy and Romance", "Deep Melancholy and Nostalgia", "War and Battle", "Hope and Inspiration"],
        correct: 1
    },
    {
        q: "What does 'Inflation' mean in the finance sector?",
        options: ["Decrease in purchasing power of currency", "Decrease in item prices", "Increase in bank interest rates", "Expansion of job opportunities"],
        correct: 0
    }
];

let currentQuestionIndex = 0;

function refreshStats() {
    document.getElementById('coin-count').innerText = gameData.coins;
    document.getElementById('life-count').innerText = gameData.lives;
}

function goBackHome() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('top-bar').classList.add('hidden');
    document.getElementById('home-screen').classList.add('active');
}

function launchGame(mode) {
    gameData.activeMode = mode;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('top-bar').classList.remove('hidden');

    if (mode === 'quiz') {
        currentQuestionIndex = 0;
        document.getElementById('quiz-screen').classList.add('active');
        renderQuiz();
    } else if (mode === 'puzzle') {
        document.getElementById('puzzle-screen').classList.add('active');
        renderPuzzle();
    }
    refreshStats();
}

// Quiz Functions
function renderQuiz() {
    let q = quizQuestions[currentQuestionIndex];
    document.getElementById('quiz-question-text').innerText = q.q;
    
    let container = document.getElementById('quiz-answers-group');
    container.innerHTML = '';

    q.options.forEach((opt, idx) => {
        let btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerText = opt;
        btn.onclick = () => validateAnswer(idx === q.correct);
        container.appendChild(btn);
    });
}

function validateAnswer(isCorrect) {
    if (isCorrect) {
        gameData.coins += 20;
        alert("Correct Answer! +20 Coins");
    } else {
        gameData.lives -= 1;
        alert("Incorrect Answer!");
    }
    refreshStats();

    if (gameData.lives <= 0) {
        document.getElementById('gameover-modal').classList.remove('hidden');
    } else {
        currentQuestionIndex = (currentQuestionIndex + 1) % quizQuestions.length;
        renderQuiz();
    }
}

// Puzzle Functions
function renderPuzzle() {
    let board = document.getElementById('puzzle-board');
    board.innerHTML = '';
    let cards = ['🪙', '💎', '👑', '🪙', '💎', '👑'];
    cards.sort(() => Math.random() - 0.5);

    cards.forEach(symbol => {
        let card = document.createElement('div');
        card.className = 'puzzle-card';
        card.innerText = '❓';
        card.onclick = () => {
            card.innerText = symbol;
            gameData.coins += 5;
            refreshStats();
        };
        board.appendChild(card);
    });
}

// AdMob Flow Simulator (1 to 3 Ads)
let totalAdsToPlay = 2;
let currentAdIndex = 1;

function playRewardedAdsFlow() {
    document.getElementById('gameover-modal').classList.add('hidden');
    totalAdsToPlay = Math.floor(Math.random() * 3) + 1; // Random 1, 2, or 3 ads
    currentAdIndex = 1;
    executeAdSequence();
}

function executeAdSequence() {
    if (currentAdIndex > totalAdsToPlay) {
        document.getElementById('ad-simulation-modal').classList.add('hidden');
        gameData.lives = 3;
        gameData.coins += 30;
        refreshStats();
        alert("🎉 Lives restored and bonus coins added for watching ads!");
        return;
    }

    document.getElementById('ad-step').innerText = currentAdIndex;
    document.getElementById('ad-max').innerText = totalAdsToPlay;
    document.getElementById('ad-simulation-modal').classList.remove('hidden');

    let timeLeft = 5;
    document.getElementById('ad-timer-display').innerText = timeLeft;

    let countdown = setInterval(() => {
        timeLeft--;
        document.getElementById('ad-timer-display').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            currentAdIndex++;
            executeAdSequence();
        }
    }, 1000);
}

function closeGameOverAndExit() {
    document.getElementById('gameover-modal').classList.add('hidden');
    gameData.lives = 3;
    goBackHome();
}

function claimDailyBonus() {
    gameData.coins += 50;
    refreshStats();
    alert("🎉 50 Daily Golden Coins added to your account!");
}
