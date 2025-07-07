let score = 0;
let totalQuestions = 38;
let timeLeft = 60;
let timerInterval;
let isPaused = false;

document.addEventListener('DOMContentLoaded', function() {
    startTimer();
    generateQuestion();
});

function startTimer() {
    timerInterval = setInterval(function() {
        if (!isPaused) {
            timeLeft--;
            document.getElementById('timer').textContent = `時間剩餘: ${timeLeft} 秒`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }
    }, 1000);
}

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pause-button').textContent = isPaused ? '繼續' : '暫停';
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    document.getElementById('question').textContent = `${num1} x ${num2} = ?`;
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
}

function submitAnswer() {
    const answer = parseInt(document.getElementById('answer').value);
    const questionText = document.getElementById('question').textContent;
    const [num1, num2] = questionText.split(' x ').map(part => parseInt(part));
    if (answer === num1 * num2) {
        score++;
        document.getElementById('score').textContent = `得分: ${score} / ${totalQuestions}`;
        if (score >= totalQuestions) {
            clearInterval(timerInterval);
            endGame();
        } else {
            generateQuestion();
        }
    } else {
        alert('回答錯誤，請再試一次！');
        document.getElementById('answer').value = '';
        document.getElementById('answer').focus();
    }
}

function endGame() {
    alert(`遊戲結束！您的得分是 ${score} 分`);
    submitScore();
}

function submitScore() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');

    fetch('https://0d97-118-167-198-53.ngrok-free.app/submit-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, gameId: 1, score })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('成績提交成功');
            window.location.href = '/html/assignments.html';
        } else {
            alert('成績提交失敗');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}