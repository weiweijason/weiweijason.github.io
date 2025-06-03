// 遊戲狀態管理
class WordMatchingGame {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 0;
        this.gameStarted = false;
        this.gameEnded = false;
        
        // DOM 元素
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.endScreen = document.getElementById('end-screen');
        this.loadingScreen = document.getElementById('loading-screen');
        
        // 遊戲元素
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.currentScoreSpan = document.getElementById('current-score');
        this.progressFill = document.getElementById('progress-fill');
        this.questionText = document.getElementById('question-text');
        this.optionsGrid = document.getElementById('options-grid');
        this.feedback = document.getElementById('feedback');
        this.feedbackText = document.getElementById('feedback-text');
        this.nextBtn = document.getElementById('next-btn');
        
        // 結束畫面元素
        this.finalScore = document.getElementById('final-score');
        this.scoreMessage = document.getElementById('score-message');
        
        // 按鈕
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.backHomeBtn = document.getElementById('back-home-btn');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.backHomeBtn.addEventListener('click', () => this.goToHome());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
    }
    
    async loadQuestions() {
        try {
            this.showLoading();
            const response = await fetch('../data/questions.json');
            if (!response.ok) {
                throw new Error('無法載入題目資料');
            }
            const data = await response.json();
            this.questions = this.shuffleArray([...data.questions]);
            this.totalQuestions = this.questions.length;
            this.hideLoading();
            return true;
        } catch (error) {
            console.error('載入題目失敗:', error);
            alert('載入題目失敗，請檢查網路連線或稍後再試。');
            this.hideLoading();
            return false;
        }
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    async startGame() {
        const loaded = await this.loadQuestions();
        if (!loaded) return;
        
        this.gameStarted = true;
        this.gameEnded = false;
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        this.showScreen('game');
        this.updateGameUI();
        this.displayCurrentQuestion();
    }
    
    displayCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        this.questionText.textContent = question.sentence;
        
        // 清空並重新創建選項
        this.optionsGrid.innerHTML = '';
        
        // 打亂選項順序
        const shuffledOptions = this.shuffleArray([...question.options]);
        
        shuffledOptions.forEach(option => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.textContent = option;
            optionBtn.addEventListener('click', () => this.selectOption(option, question.correctAnswer));
            this.optionsGrid.appendChild(optionBtn);
        });
        
        // 隱藏回饋和下一題按鈕
        this.hideFeedback();
    }
    
    selectOption(selectedOption, correctAnswer) {
        const isCorrect = selectedOption === correctAnswer;
        
        // 禁用所有選項按鈕
        const optionBtns = this.optionsGrid.querySelectorAll('.option-btn');
        optionBtns.forEach(btn => {
            btn.classList.add('disabled');
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            } else if (btn.textContent === selectedOption && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        // 更新分數
        if (isCorrect) {
            this.score++;
            this.updateScoreDisplay();
        }
        
        // 顯示回饋
        this.showFeedback(isCorrect, correctAnswer);
        
        // 延遲一下再顯示下一題按鈕
        setTimeout(() => {
            this.showNextButton();
        }, 1500);
    }
    
    showFeedback(isCorrect, correctAnswer) {
        this.feedback.classList.remove('hidden', 'correct', 'incorrect');
        this.feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        if (isCorrect) {
            this.feedbackText.textContent = '🎉 答對了！太棒了！';
        } else {
            this.feedbackText.textContent = `❌ 答錯了，正確答案是「${correctAnswer}」`;
        }
    }
    
    hideFeedback() {
        this.feedback.classList.add('hidden');
        this.nextBtn.classList.add('hidden');
    }
    
    showNextButton() {
        this.nextBtn.classList.remove('hidden');
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        this.updateGameUI();
        
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame();
        } else {
            this.displayCurrentQuestion();
        }
    }
    
    updateGameUI() {
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        this.totalQuestionsSpan.textContent = this.totalQuestions;
        this.updateScoreDisplay();
        this.updateProgressBar();
    }
    
    updateScoreDisplay() {
        this.currentScoreSpan.textContent = this.score;
    }
    
    updateProgressBar() {
        const progress = ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
        this.progressFill.style.width = `${progress}%`;
    }
    
    endGame() {
        this.gameEnded = true;
        this.showScreen('end');
        this.displayFinalResults();
    }
    
    displayFinalResults() {
        this.finalScore.textContent = this.score;
        
        const percentage = (this.score / this.totalQuestions) * 100;
        let message = '';
        
        if (percentage === 100) {
            message = '🏆 完美！你是詞語大師！';
        } else if (percentage >= 80) {
            message = '🎖️ 很棒！你已經掌握了大部分詞語！';
        } else if (percentage >= 60) {
            message = '👍 不錯！繼續努力就會更好！';
        } else if (percentage >= 40) {
            message = '💪 加油！多練習就會進步！';
        } else {
            message = '📚 別灰心！多閱讀會幫助你學會更多詞語！';
        }
        
        this.scoreMessage.textContent = message;
    }
    
    restartGame() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.gameStarted = false;
        this.gameEnded = false;
        this.startGame();
    }
    
    goToHome() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.gameStarted = false;
        this.gameEnded = false;
        this.showScreen('start');
    }
    
    showScreen(screenName) {
        // 隱藏所有畫面
        this.startScreen.classList.add('hidden');
        this.gameScreen.classList.add('hidden');
        this.endScreen.classList.add('hidden');
        this.loadingScreen.classList.add('hidden');
        
        // 顯示指定畫面
        switch (screenName) {
            case 'start':
                this.startScreen.classList.remove('hidden');
                break;
            case 'game':
                this.gameScreen.classList.remove('hidden');
                break;
            case 'end':
                this.endScreen.classList.remove('hidden');
                break;
            case 'loading':
                this.loadingScreen.classList.remove('hidden');
                break;
        }
    }
    
    showLoading() {
        this.showScreen('loading');
    }
    
    hideLoading() {
        // 載入完成後不自動切換畫面，讓呼叫者決定
    }
}

// 頁面載入完成後初始化遊戲
document.addEventListener('DOMContentLoaded', () => {
    const game = new WordMatchingGame();
    
    // 防止頁面刷新時丟失遊戲狀態
    window.addEventListener('beforeunload', (e) => {
        if (game.gameStarted && !game.gameEnded) {
            e.preventDefault();
            e.returnValue = '遊戲進行中，確定要離開嗎？';
        }
    });
    
    console.log('語文詞語配對遊戲載入完成！');
});
