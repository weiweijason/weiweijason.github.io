let timeLeft = 45 * 60; // 45 分鐘轉換為秒
let overtime = 0; // 超時秒數
let isOvertime = false;
let isPaused = true; // 預設為暫停模式
let interval;

function startTimer() {
    const timerElement = document.getElementById('timer');
    interval = setInterval(() => {
        if (!isPaused) {
            if (timeLeft <= 0) {
                isOvertime = true;
                overtime++;
                const minutes = Math.floor(overtime / 60);
                const seconds = overtime % 60;
                timerElement.textContent = `超時: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            } else {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerElement.textContent = `時間剩餘: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
        }
    }, 1000);
}

function togglePause() {
    const pauseButton = document.getElementById('pause-button');
    const googleForm = document.getElementById('google-form');
    const overlay = document.getElementById('overlay');
    isPaused = !isPaused;
    if (isPaused) {
        googleForm.style.display = 'none';
        overlay.style.display = 'flex';
        pauseButton.textContent = '繼續';
    } else {
        googleForm.style.display = 'block';
        overlay.style.display = 'none';
        pauseButton.textContent = '暫停';
    }
}

function startGame() {
    const startContainer = document.getElementById('start-container');
    const formContainer = document.getElementById('form-container');
    const pauseButton = document.getElementById('pause-button');
    const overlay = document.getElementById('overlay');
    startContainer.style.display = 'none';
    formContainer.style.display = 'flex';
    pauseButton.style.display = 'inline-block';
    overlay.style.display = 'none';
    isPaused = false;
}

window.onload = startTimer;