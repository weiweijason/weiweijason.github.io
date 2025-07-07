let score = 0;
let timeLeft = 60;
let currentQuestion = {};
let isPaused = false;
let interval;

function startTimer() {
    const timerElement = document.getElementById('timer');
    interval = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timerElement.textContent = `時間剩餘: ${timeLeft} 秒`;
            if (timeLeft <= 0) {
                clearInterval(interval);
                endGame();
            }
        }
    }, 1000);
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 8) + 2; // 2 到 9
    const num2 = Math.floor(Math.random() * 8) + 2; // 2 到 9
    currentQuestion = {
        num1,
        num2,
        answer: num1 * num2
    };
    document.getElementById('question').textContent = `${num1} x ${num2} = ?`;
}

function submitAnswer() {
    const answer = parseInt(document.getElementById('answer').value, 10);
    if (answer === currentQuestion.answer) {
        score++;
        document.getElementById('score').textContent = `得分: ${score} / 38`;
        if (score >= 38) {
            endGame();
        } else {
            generateQuestion();
            document.getElementById('answer').value = '';
        }
    } else {
        alert('答案錯誤，請再試一次！');
    }
}

function endGame() {
    alert(`遊戲結束！你的得分是 ${score} / 38`);
    window.location.href = '../html/mathgame_index.html';
}

function togglePause() {
    isPaused = !isPaused;
    const questionContainer = document.getElementById('question-container');
    const pauseButton = document.getElementById('pause-button');
    if (isPaused) {
        questionContainer.style.display = 'none';
        pauseButton.textContent = '繼續';
    } else {
        questionContainer.style.display = 'block';
        pauseButton.textContent = '暫停';
    }
}

window.onload = () => {
    startTimer();
    generateQuestion();
};