// 遊戲狀態管理
class WordMatchingGame {
    constructor() {
        this.allQuestions = []; // 儲存所有題目
        this.questions = []; // 儲存遊戲中使用的題目
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 0;
        this.selectedQuestionCount = 0; // 用戶選擇的題目數量
        this.gameStarted = false;
        this.gameEnded = false;
        
        // 遊戲化系統
        this.gameStars = 0; // 本局獲得的星星
        this.totalStars = this.loadTotalStars(); // 總星星數
        this.currentLevel = this.calculateLevel(this.totalStars); // 當前等級
        this.speechSynthesis = window.speechSynthesis; // 語音合成
        
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
        
        // 遊戲化元素
        this.gameStarsSpan = document.getElementById('game-stars');
        this.totalStarsSpan = document.getElementById('total-stars');
        this.userLevelSpan = document.getElementById('user-level');
        this.levelProgressFill = document.getElementById('level-progress-fill');
        this.currentLevelStarsSpan = document.getElementById('current-level-stars');
        this.nextLevelStarsSpan = document.getElementById('next-level-stars');
        this.mascotMessage = document.getElementById('mascot-message');
        this.readQuestionBtn = document.getElementById('read-question-btn');
        this.starAnimation = document.getElementById('star-animation');
        this.levelUpAnimation = document.getElementById('level-up-animation');
        this.newLevel = document.getElementById('new-level');
        
        // 結束畫面元素
        this.finalScore = document.getElementById('final-score');
        this.finalTotal = document.getElementById('final-total');
        this.scoreMessage = document.getElementById('score-message');
        this.finalGameStars = document.getElementById('final-game-stars');
        this.finalTotalStars = document.getElementById('final-total-stars');
        this.finalLevel = document.getElementById('final-level');
        this.finalMascotMessage = document.getElementById('final-mascot-message');
        
        // 按鈕
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.backHomeBtn = document.getElementById('back-home-btn');
        
        // 題目數量選擇相關
        this.countBtns = document.querySelectorAll('.count-btn');
        
        this.initEventListeners();
        this.loadAllQuestions(); // 頁面載入時就先載入所有題目
        this.updateUserStats(); // 初始化用戶統計
        this.showMascotMessage('你好！我是小喵老師！一起來學習吧！'); // 歡迎訊息
    }

    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.backHomeBtn.addEventListener('click', () => this.goToHome());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        
        // 語音朗讀按鈕
        this.readQuestionBtn.addEventListener('click', () => this.readQuestion());
        
        // 吉祥物點擊事件
        document.querySelector('.mascot-character').addEventListener('click', () => {
            this.showRandomMascotMessage();
        });
        
        // 題目數量選擇事件
        this.countBtns.forEach(btn => {
            btn.addEventListener('click', () => this.selectQuestionCount(btn));
        });
    }

    // 選擇題目數量
    selectQuestionCount(selectedBtn) {
        // 移除所有按鈕的選中狀態
        this.countBtns.forEach(btn => btn.classList.remove('selected'));
        
        // 為選中的按鈕添加選中狀態
        selectedBtn.classList.add('selected');
        
        // 獲取選擇的題目數量
        this.selectedQuestionCount = parseInt(selectedBtn.dataset.count);
        
        // 顯示開始遊戲按鈕
        this.startBtn.classList.remove('hidden');
        
        // 吉祥物鼓勵
        this.showMascotMessage(`很好！選擇了${this.selectedQuestionCount}題，準備好了嗎？`);
        
        console.log(`選擇了 ${this.selectedQuestionCount} 題`);
    }
    
    // ===== 遊戲化系統方法 =====
    
    // 載入總星星數
    loadTotalStars() {
        const saved = localStorage.getItem('wordGame_totalStars');
        return saved ? parseInt(saved) : 0;
    }
    
    // 保存總星星數
    saveTotalStars() {
        localStorage.setItem('wordGame_totalStars', this.totalStars.toString());
    }
    
    // 計算等級（每10顆星星升一級）
    calculateLevel(stars) {
        return Math.floor(stars / 10) + 1;
    }
    
    // 獲得星星需要的下一級星星數
    getNextLevelStars(level) {
        return level * 10;
    }
    
    // 更新用戶統計顯示
    updateUserStats() {
        this.userLevelSpan.textContent = this.currentLevel;
        this.totalStarsSpan.textContent = this.totalStars;
        
        // 計算升級進度
        const currentLevelStars = this.totalStars % 10;
        const nextLevelStars = 10;
        
        this.currentLevelStarsSpan.textContent = currentLevelStars;
        this.nextLevelStarsSpan.textContent = nextLevelStars;
        
        // 更新進度條
        const progressPercent = (currentLevelStars / nextLevelStars) * 100;
        this.levelProgressFill.style.width = `${progressPercent}%`;
    }
    
    // 顯示吉祥物訊息
    showMascotMessage(message, duration = 3000) {
        this.mascotMessage.textContent = message;
        const speechBubble = document.querySelector('.mascot-speech');
        speechBubble.classList.remove('hidden');
        
        setTimeout(() => {
            speechBubble.classList.add('hidden');
        }, duration);
    }
    
    // 隨機吉祥物訊息
    showRandomMascotMessage() {
        const messages = [
            '加油！你做得很好！',
            '繼續努力，你一定可以的！',
            '學習很有趣對吧？',
            '每一道題都是進步的機會！',
            '相信自己，你很棒！',
            '學習讓我們變得更聰明！'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.showMascotMessage(randomMessage);
    }
    
    // 語音朗讀題目
    readQuestion() {
        if (this.speechSynthesis && this.questionText.textContent) {
            // 停止之前的朗讀
            this.speechSynthesis.cancel();
            
            // 準備朗讀文字（移除底線標記）
            const textToRead = this.questionText.textContent.replace(/_+/g, '空格');
            
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.lang = 'zh-TW';
            utterance.rate = 0.8; // 較慢的速度
            utterance.pitch = 1.1; // 稍高的音調，更適合兒童
            
            this.speechSynthesis.speak(utterance);
            
            // 按鈕動畫效果
            this.readQuestionBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.readQuestionBtn.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    // 獲得星星
    earnStar() {
        this.gameStars++;
        this.totalStars++;
        
        // 更新顯示
        this.gameStarsSpan.textContent = this.gameStars;
        this.updateUserStats();
        
        // 顯示星星動畫
        this.showStarAnimation();
        
        // 檢查是否升級
        const newLevel = this.calculateLevel(this.totalStars);
        if (newLevel > this.currentLevel) {
            this.currentLevel = newLevel;
            this.showLevelUpAnimation();
        }
        
        // 保存星星數
        this.saveTotalStars();
    }
    
    // 顯示星星獲得動畫
    showStarAnimation() {
        this.starAnimation.classList.remove('hidden');
        setTimeout(() => {
            this.starAnimation.classList.add('hidden');
        }, 1500);
    }
    
    // 顯示升級動畫
    showLevelUpAnimation() {
        this.newLevel.textContent = this.currentLevel;
        this.levelUpAnimation.classList.remove('hidden');
        
        setTimeout(() => {
            this.levelUpAnimation.classList.add('hidden');
        }, 3000);
    }
    
    // 獲得最終吉祥物訊息
    getFinalMascotMessage(scorePercent) {
        if (scorePercent >= 90) {
            return '哇！太厲害了！你是語文小天才！🌟';
        } else if (scorePercent >= 70) {
            return '很棒！繼續保持這樣的努力！👏';
        } else if (scorePercent >= 50) {
            return '不錯喔！多練習會越來越好的！💪';
        } else {
            return '沒關係，學習需要時間，我們一起加油！❤️';
        }
    }
    
    // 載入所有題目（在頁面載入時執行）
    async loadAllQuestions() {
        try {
            const response = await fetch('../data/questions.json');
            if (!response.ok) {
                throw new Error('無法載入題目資料');
            }
            const data = await response.json();
            this.allQuestions = data.questions;
            console.log(`成功載入 ${this.allQuestions.length} 道題目`);
            return true;
        } catch (error) {
            console.error('載入題目失敗:', error);
            alert('載入題目失敗，請檢查網路連線或稍後再試。');
            return false;
        }
    }
    
    // 隨機選擇指定數量的題目
    selectRandomQuestions(count) {
        if (this.allQuestions.length < count) {
            console.warn(`題庫只有 ${this.allQuestions.length} 題，少於要求的 ${count} 題`);
            count = this.allQuestions.length;
        }
        
        // 深拷貝所有題目並隨機打亂
        const shuffledQuestions = this.shuffleArray([...this.allQuestions]);
        
        // 選取前 count 道題目
        this.questions = shuffledQuestions.slice(0, count);
        this.totalQuestions = this.questions.length;
        
        console.log(`隨機選擇了 ${this.totalQuestions} 道題目`);
        return this.questions;
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
        // 檢查是否已選擇題目數量
        if (this.selectedQuestionCount === 0) {
            alert('請先選擇題目數量！');
            return;
        }
        
        // 檢查題庫是否已載入
        if (this.allQuestions.length === 0) {
            const loaded = await this.loadAllQuestions();
            if (!loaded) return;
        }
        
        // 從題庫中隨機選擇指定數量的題目
        this.selectRandomQuestions(this.selectedQuestionCount);
        
        this.gameStarted = true;
        this.gameEnded = false;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.gameStars = 0; // 重置本局星星
        
        // 更新遊戲星星顯示
        this.gameStarsSpan.textContent = this.gameStars;
        
        // 吉祥物鼓勵
        this.showMascotMessage('遊戲開始！一起來挑戰吧！🎯');
        
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
        
        // 更新分數和星星
        if (isCorrect) {
            this.score++;
            this.updateScoreDisplay();
            this.earnStar(); // 獲得星星
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
            // 隨機鼓勵訊息
            const encourageMessages = [
                '太棒了！你真聰明！',
                '完全正確！繼續加油！',
                '答對了！你學得很快！',
                '很好！你越來越厲害了！'
            ];
            const randomMessage = encourageMessages[Math.floor(Math.random() * encourageMessages.length)];
            setTimeout(() => this.showMascotMessage(randomMessage), 800);
        } else {
            this.feedbackText.textContent = `😔 答錯了，正確答案是「${correctAnswer}」`;
            // 安慰和鼓勵訊息
            const comfortMessages = [
                '沒關係，學習需要過程！',
                '繼續努力，你一定可以的！',
                '錯誤是學習的好機會！',
                '下次會更好的，加油！'
            ];
            const randomMessage = comfortMessages[Math.floor(Math.random() * comfortMessages.length)];
            setTimeout(() => this.showMascotMessage(randomMessage), 800);
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
        
        // 保存星星數據
        this.saveTotalStars();
        
        // 顯示最終吉祥物訊息
        const scorePercent = (this.score / this.totalQuestions) * 100;
        const finalMessage = this.getFinalMascotMessage(scorePercent);
        
        this.showScreen('end');
        this.displayFinalResults();
        
        // 延遲顯示吉祥物訊息
        setTimeout(() => {
            this.finalMascotMessage.textContent = finalMessage;
        }, 500);
    }

    displayFinalResults() {
        this.finalScore.textContent = this.score;
        this.finalTotal.textContent = this.totalQuestions;
        
        // 更新星星和等級信息
        this.finalGameStars.textContent = this.gameStars;
        this.finalTotalStars.textContent = this.totalStars;
        this.finalLevel.textContent = this.currentLevel;
        
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
        this.gameStars = 0; // 重置本局星星
        
        // 更新遊戲星星顯示
        this.gameStarsSpan.textContent = this.gameStars;
        
        // 重新選擇題目（保持相同數量但重新隨機）
        if (this.selectedQuestionCount > 0) {
            this.selectRandomQuestions(this.selectedQuestionCount);
        }
        
        // 吉祥物鼓勵
        this.showMascotMessage('準備好再次挑戰了嗎？💪');
        
        this.showScreen('game');
        this.updateGameUI();
        this.displayCurrentQuestion();
    }
    
    goToHome() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.gameStarted = false;
        this.gameEnded = false;
        this.selectedQuestionCount = 0;
        
        // 重置題目數量選擇
        this.countBtns.forEach(btn => btn.classList.remove('selected'));
        this.startBtn.classList.add('hidden');
        
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
