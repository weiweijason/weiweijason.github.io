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
        this.gameStartTime = 0; // 遊戲開始時間
        this.isReviewMode = false; // 是否為複習模式
        
        // 遊戲化系統
        this.gameStars = 0; // 本局獲得的星星
        this.totalStars = this.loadTotalStars(); // 總星星數
        this.currentLevel = this.calculateLevel(this.totalStars); // 當前等級
        this.speechSynthesis = window.speechSynthesis; // 語音合成
        
        // 徽章檢查用變數
        this.lastGamePerfect = false;
        this.lastGameTime = 0;
        this.lastGameQuestions = 0;
        
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
        
        // 初始化第二階段系統
        setTimeout(() => {
            this.initPhase2Systems();
        }, 1000);
    }

    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.backHomeBtn.addEventListener('click', () => this.goToHome());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        
        // 語音朗讀按鈕
        this.readQuestionBtn.addEventListener('click', () => this.readQuestion());
        
        // 吉祥物點擊事件
        document.querySelector('.mascot-character')?.addEventListener('click', () => {
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
    
    // 添加星星的輔助方法
    addStars(amount) {
        for (let i = 0; i < amount; i++) {
            this.earnStar();
        }
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
        speechBubble?.classList.remove('hidden');
        
        setTimeout(() => {
            speechBubble?.classList.add('hidden');
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
        this.starAnimation?.classList.remove('hidden');
        setTimeout(() => {
            this.starAnimation?.classList.add('hidden');
        }, 1500);
    }
    
    // 顯示升級動畫
    showLevelUpAnimation() {
        this.newLevel.textContent = this.currentLevel;
        this.levelUpAnimation?.classList.remove('hidden');
        
        setTimeout(() => {
            this.levelUpAnimation?.classList.add('hidden');
        }, 3000);
    }
    
    // 顯示消息（用於徽章系統）
    showMessage(message, type = 'info') {
        this.showMascotMessage(message, 3000);
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
        this.gameStartTime = Date.now(); // 記錄開始時間
        
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
            optionBtn.addEventListener('click', () => this.selectOption(option, question.correctAnswer, question.sentence));
            this.optionsGrid.appendChild(optionBtn);
        });
        
        // 隱藏回饋和下一題按鈕
        this.hideFeedback();
    }

    selectOption(selectedOption, correctAnswer, questionText) {
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
        } else {
            // 記錄錯題
            this.handleWrongAnswer(questionText, selectedOption, correctAnswer);
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
        
        // 執行第二階段結束邏輯
        this.extendedEndGame();
        
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
        this.isReviewMode = false;
        
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
        this.isReviewMode = false;
        
        // 重置題目數量選擇
        this.countBtns.forEach(btn => btn.classList.remove('selected'));
        this.startBtn.classList.add('hidden');
        
        this.showScreen('start');
    }
    
    showScreen(screenName) {
        // 隱藏所有畫面
        const screens = ['start', 'game', 'end', 'loading', 'daily', 'review', 'stats', 'badges'];
        screens.forEach(screen => {
            const element = document.getElementById(`${screen}-screen`);
            if (element) {
                element.classList.add('hidden');
            }
        });
        
        // 顯示指定畫面
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
        }
        
        // 更新對應畫面的顯示
        this.updateScreenDisplay(screenName);
    }

    updateScreenDisplay(screenName) {
        switch (screenName) {
            case 'daily':
                this.dailyMissionSystem?.updateMissionDisplay();
                break;
            case 'review':
                this.reviewSystem?.updateReviewDisplay();
                break;
            case 'stats':
                this.statisticsSystem?.updateStatsDisplay();
                break;
            case 'badges':
                this.badgeSystem?.updateBadgeDisplay();
                break;
        }
    }

    updateAllDisplays() {
        this.dailyMissionSystem?.updateMissionDisplay();
        this.reviewSystem?.updateReviewDisplay();
        this.statisticsSystem?.updateStatsDisplay();
        this.badgeSystem?.updateBadgeDisplay();
    }

    // 擴展遊戲結束邏輯以整合第二階段功能
    extendedEndGame() {
        const studyTime = Math.round((Date.now() - this.gameStartTime) / 1000 / 60); // 分鐘
        
        // 記錄統計數據
        this.statisticsSystem?.recordGameSession(this.totalQuestions, this.score, Math.max(studyTime, 1));
        
        // 更新每日任務
        this.updateDailyMissions();
        
        // 檢查新徽章
        this.badgeSystem?.checkNewBadges();
        
        // 記錄遊戲表現用於徽章檢查
        this.lastGamePerfect = (this.score === this.totalQuestions);
        this.lastGameTime = (Date.now() - this.gameStartTime) / 1000; // 秒
        this.lastGameQuestions = this.totalQuestions;
    }

    updateDailyMissions() {
        if (!this.dailyMissionSystem) return;
        
        // 更新答題數任務
        const currentQuestions = this.dailyMissionSystem.dailyData.missions.questions.progress + this.totalQuestions;
        this.dailyMissionSystem.updateMission('questions', currentQuestions);
        
        // 更新正確率任務
        const totalAnswered = this.statisticsSystem?.stats.totalQuestionsAnswered || 0;
        const totalCorrect = this.statisticsSystem?.stats.totalCorrectAnswers || 0;
        const accuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered * 100) : 0;
        this.dailyMissionSystem.updateMission('accuracy', accuracy);
        
        // 更新遊戲場次任務
        const currentGames = this.dailyMissionSystem.dailyData.missions.games.progress + 1;
        this.dailyMissionSystem.updateMission('games', currentGames);
    }

    handleWrongAnswer(question, userAnswer, correctAnswer) {
        // 添加到錯題系統
        this.reviewSystem?.addWrongQuestion(question, userAnswer, correctAnswer);
    }

    // 初始化第二階段系統
    initPhase2Systems() {
        this.dailyMissionSystem = new DailyMissionSystem(this);
        this.reviewSystem = new ReviewSystem(this);
        this.statisticsSystem = new StatisticsSystem(this);
        this.badgeSystem = new BadgeSystem(this);
        
        // 初始化導航事件
        this.initNavigationEvents();
        
        // 初始化顯示
        this.updateAllDisplays();
        
        // 設置全局引用
        window.reviewSystem = this.reviewSystem;
        window.dailyMissionSystem = this.dailyMissionSystem;
        window.statisticsSystem = this.statisticsSystem;
        window.badgeSystem = this.badgeSystem;
    }

    initNavigationEvents() {
        // 導航按鈕事件
        document.getElementById('nav-game')?.addEventListener('click', () => this.showScreen('start'));
        document.getElementById('nav-daily')?.addEventListener('click', () => this.showScreen('daily'));
        document.getElementById('nav-review')?.addEventListener('click', () => this.showScreen('review'));
        document.getElementById('nav-stats')?.addEventListener('click', () => this.showScreen('stats'));
        document.getElementById('nav-badges')?.addEventListener('click', () => this.showScreen('badges'));
    }
}

// 每日任務系統
class DailyMissionSystem {
    constructor(game) {
        this.game = game;
        this.missions = {
            questions: { target: 10, progress: 0, reward: 'xp', amount: 50 },
            accuracy: { target: 80, progress: 0, reward: 'stars', amount: 3 },
            games: { target: 3, progress: 0, reward: 'mystery', amount: 1 }
        };
        this.dailyData = this.loadDailyData();
        this.initDailyMissionEvents();
    }

    loadDailyData() {
        const today = new Date().toDateString();
        const saved = localStorage.getItem('dailyMissions');
        let data = saved ? JSON.parse(saved) : {};
        
        // 如果是新的一天，重置任務
        if (data.date !== today) {
            data = {
                date: today,
                missions: {
                    questions: { completed: false, progress: 0 },
                    accuracy: { completed: false, progress: 0 },
                    games: { completed: false, progress: 0 }
                },
                streak: data.date === this.getYesterday() ? (data.streak || 0) + 1 : 1
            };
            this.saveDailyData(data);
        }
        
        return data;
    }

    getYesterday() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toDateString();
    }

    saveDailyData(data) {
        localStorage.setItem('dailyMissions', JSON.stringify(data));
    }

    updateMission(type, value) {
        if (this.dailyData.missions[type].completed) return;

        this.dailyData.missions[type].progress = value;
        
        // 檢查是否完成任務
        if (this.checkMissionComplete(type)) {
            this.dailyData.missions[type].completed = true;
            this.completeMission(type);
        }
        
        this.saveDailyData(this.dailyData);
        this.updateMissionDisplay();
    }

    checkMissionComplete(type) {
        const mission = this.missions[type];
        const progress = this.dailyData.missions[type].progress;
        
        if (type === 'accuracy') {
            return progress >= mission.target;
        }
        return progress >= mission.target;
    }

    completeMission(type) {
        const mission = this.missions[type];
        
        // 給予獎勵
        if (mission.reward === 'stars') {
            this.game.addStars(mission.amount);
        } else if (mission.reward === 'xp') {
            console.log(`獲得 ${mission.amount} XP!`);
        } else if (mission.reward === 'mystery') {
            this.game.addStars(5);
        }
        
        // 顯示完成動畫
        this.showMissionCompleteAnimation(type);
    }

    showMissionCompleteAnimation(type) {
        const missionElement = document.getElementById(`mission-${type}`);
        if (missionElement) {
            missionElement.classList.add('completed');
            
            const celebration = document.createElement('div');
            celebration.className = 'mission-celebration';
            celebration.innerHTML = '🎉 任務完成！';
            celebration.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                font-weight: bold;
                z-index: 1000;
                animation: bounceIn 0.5s ease-out;
            `;
            missionElement.appendChild(celebration);
            
            setTimeout(() => {
                celebration.remove();
            }, 2000);
        }
    }

    updateMissionDisplay() {
        // 更新日期和連續天數
        const currentDateEl = document.getElementById('current-date');
        const learningStreakEl = document.getElementById('learning-streak');
        
        if (currentDateEl) {
            currentDateEl.textContent = new Date().toLocaleDateString('zh-TW');
        }
        if (learningStreakEl) {
            learningStreakEl.textContent = this.dailyData.streak;
        }

        // 更新各任務進度
        Object.keys(this.missions).forEach(type => {
            const mission = this.missions[type];
            const dailyMission = this.dailyData.missions[type];
            const progress = dailyMission.progress;
            const target = mission.target;
            
            const fillElement = document.getElementById(`mission-${type}-fill`);
            const textElement = document.getElementById(`mission-${type}-text`);
            const missionElement = document.getElementById(`mission-${type}`);
            
            if (fillElement && textElement) {
                if (type === 'accuracy') {
                    const percentage = Math.min(progress, target);
                    fillElement.style.width = `${(percentage / target) * 100}%`;
                    textElement.textContent = `${percentage.toFixed(1)}%`;
                } else {
                    fillElement.style.width = `${Math.min((progress / target) * 100, 100)}%`;
                    textElement.textContent = `${progress} / ${target}`;
                }
                
                if (dailyMission.completed && missionElement) {
                    missionElement.classList.add('completed');
                }
            }
        });
    }

    initDailyMissionEvents() {
        document.getElementById('back-to-game-btn')?.addEventListener('click', () => {
            this.game.showScreen('start');
        });
    }
}

// 錯題複習系統
class ReviewSystem {
    constructor(game) {
        this.game = game;
        this.wrongQuestions = this.loadWrongQuestions();
        this.masteredQuestions = this.loadMasteredQuestions();
        this.initReviewEvents();
    }

    loadWrongQuestions() {
        const saved = localStorage.getItem('wrongQuestions');
        return saved ? JSON.parse(saved) : [];
    }

    loadMasteredQuestions() {
        const saved = localStorage.getItem('masteredQuestions');
        return saved ? JSON.parse(saved) : [];
    }

    saveWrongQuestions() {
        localStorage.setItem('wrongQuestions', JSON.stringify(this.wrongQuestions));
    }

    saveMasteredQuestions() {
        localStorage.setItem('masteredQuestions', JSON.stringify(this.masteredQuestions));
    }

    addWrongQuestion(question, userAnswer, correctAnswer) {
        const existing = this.wrongQuestions.find(wq => wq.question === question);
        
        if (existing) {
            existing.mistakes++;
            existing.lastMistake = new Date().toISOString();
        } else {
            this.wrongQuestions.push({
                question,
                userAnswer,
                correctAnswer,
                mistakes: 1,
                firstMistake: new Date().toISOString(),
                lastMistake: new Date().toISOString()
            });
        }
        
        this.saveWrongQuestions();
        this.updateReviewDisplay();
    }

    markQuestionMastered(question) {
        this.wrongQuestions = this.wrongQuestions.filter(wq => wq.question !== question);
        
        if (!this.masteredQuestions.includes(question)) {
            this.masteredQuestions.push(question);
        }
        
        this.saveWrongQuestions();
        this.saveMasteredQuestions();
        this.updateReviewDisplay();
    }

    getRecentWrongQuestions(days = 7) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        return this.wrongQuestions.filter(wq => 
            new Date(wq.lastMistake) > cutoff
        );
    }

    startReviewMode(questions = null) {
        const reviewQuestions = questions || this.wrongQuestions;
        
        if (reviewQuestions.length === 0) {
            alert('沒有需要複習的題目！');
            return;
        }

        const gameQuestions = reviewQuestions.map(wq => {
            const originalQuestion = this.game.allQuestions.find(q => 
                q.sentence === wq.question || q.question === wq.question
            );
            return originalQuestion;
        }).filter(q => q);

        if (gameQuestions.length === 0) {
            alert('找不到對應的題目資料！');
            return;
        }

        this.game.questions = gameQuestions;
        this.game.totalQuestions = gameQuestions.length;
        this.game.currentQuestionIndex = 0;
        this.game.score = 0;
        this.game.gameStars = 0;
        this.game.isReviewMode = true;
        this.game.gameStartTime = Date.now();
        
        this.game.showScreen('game');
        this.game.updateGameUI();
        this.game.displayCurrentQuestion();
    }

    updateReviewDisplay() {
        const wrongCountEl = document.getElementById('wrong-questions-count');
        const masteredCountEl = document.getElementById('mastered-questions-count');
        
        if (wrongCountEl) wrongCountEl.textContent = this.wrongQuestions.length;
        if (masteredCountEl) masteredCountEl.textContent = this.masteredQuestions.length;

        const listContainer = document.getElementById('wrong-questions-list');
        if (listContainer) {
            listContainer.innerHTML = '';
            
            if (this.wrongQuestions.length === 0) {
                listContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">太棒了！沒有需要複習的題目！</p>';
                return;
            }
            
            this.wrongQuestions.forEach((wq, index) => {
                const item = document.createElement('div');
                item.className = 'wrong-question-item';
                item.innerHTML = `
                    <div class="question-text">${wq.question}</div>
                    <div class="mistake-count">錯誤 ${wq.mistakes} 次</div>
                    <button class="review-question-btn" onclick="window.reviewSystem.reviewSingleQuestion(${index})">
                        複習
                    </button>
                `;
                listContainer.appendChild(item);
            });
        }
    }

    reviewSingleQuestion(index) {
        const wq = this.wrongQuestions[index];
        const originalQuestion = this.game.allQuestions.find(q => 
            q.sentence === wq.question || q.question === wq.question
        );
        
        if (originalQuestion) {
            this.startReviewMode([wq]);
        }
    }

    initReviewEvents() {
        document.getElementById('review-all-btn')?.addEventListener('click', () => {
            this.startReviewMode();
        });

        document.getElementById('review-recent-btn')?.addEventListener('click', () => {
            const recentQuestions = this.getRecentWrongQuestions();
            this.startReviewMode(recentQuestions);
        });

        document.getElementById('back-to-game-btn-2')?.addEventListener('click', () => {
            this.game.showScreen('start');
        });
    }
}

// 學習統計系統
class StatisticsSystem {
    constructor(game) {
        this.game = game;
        this.stats = this.loadStats();
        this.initStatsEvents();
    }

    loadStats() {
        const saved = localStorage.getItem('gameStatistics');
        return saved ? JSON.parse(saved) : {
            totalQuestionsAnswered: 0,
            totalCorrectAnswers: 0,
            totalGamesPlayed: 0,
            totalStudyTime: 0,
            weeklyData: this.initWeeklyData()
        };
    }

    initWeeklyData() {
        const weekData = {};
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            weekData[dateStr] = {
                questions: 0,
                correct: 0,
                games: 0,
                studyTime: 0
            };
        }
        return weekData;
    }

    saveStats() {
        localStorage.setItem('gameStatistics', JSON.stringify(this.stats));
    }

    recordGameSession(totalQuestions, correctAnswers, studyTime) {
        this.stats.totalQuestionsAnswered += totalQuestions;
        this.stats.totalCorrectAnswers += correctAnswers;
        this.stats.totalGamesPlayed++;
        this.stats.totalStudyTime += studyTime;

        const today = new Date().toDateString();
        if (!this.stats.weeklyData[today]) {
            this.stats.weeklyData[today] = { questions: 0, correct: 0, games: 0, studyTime: 0 };
        }
        
        this.stats.weeklyData[today].questions += totalQuestions;
        this.stats.weeklyData[today].correct += correctAnswers;
        this.stats.weeklyData[today].games++;
        this.stats.weeklyData[today].studyTime += studyTime;

        this.cleanOldWeeklyData();
        this.saveStats();
        this.updateStatsDisplay();
    }

    cleanOldWeeklyData() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        Object.keys(this.stats.weeklyData).forEach(dateStr => {
            if (new Date(dateStr) < sevenDaysAgo) {
                delete this.stats.weeklyData[dateStr];
            }
        });
    }

    updateStatsDisplay() {
        const accuracy = this.stats.totalQuestionsAnswered > 0 ? 
            (this.stats.totalCorrectAnswers / this.stats.totalQuestionsAnswered * 100).toFixed(1) : '0';
        
        const elements = {
            'overall-accuracy': `${accuracy}%`,
            'total-questions-answered': this.stats.totalQuestionsAnswered,
            'total-games-played': this.stats.totalGamesPlayed,
            'total-study-time': `${this.stats.totalStudyTime}分`
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });

        this.updateWeekChart();
    }

    updateWeekChart() {
        const chartContainer = document.getElementById('week-chart');
        if (!chartContainer) return;

        chartContainer.innerHTML = '';
        
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
        const maxQuestions = Math.max(...Object.values(this.stats.weeklyData).map(d => d.questions), 1);

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            const dayData = this.stats.weeklyData[dateStr] || { questions: 0 };
            
            const dayBar = document.createElement('div');
            dayBar.className = 'day-bar';
            
            const barHeight = (dayData.questions / maxQuestions) * 100;
            
            dayBar.innerHTML = `
                <div class="bar" style="height: ${Math.max(barHeight, 10)}%;" title="${dayData.questions} 題"></div>
                <div class="day-label">${weekDays[date.getDay()]}</div>
            `;
            
            chartContainer.appendChild(dayBar);
        }
    }

    initStatsEvents() {
        document.getElementById('back-to-game-btn-3')?.addEventListener('click', () => {
            this.game.showScreen('start');
        });
    }
}

// 成就徽章系統
class BadgeSystem {
    constructor(game) {
        this.game = game;
        this.badges = this.initBadges();
        this.unlockedBadges = this.loadUnlockedBadges();
        this.initBadgeEvents();
    }

    initBadges() {
        return [
            {
                id: 'first_star',
                icon: '⭐',
                title: '初學者',
                description: '獲得第一顆星星',
                condition: () => this.game.totalStars >= 1
            },
            {
                id: 'star_collector',
                icon: '🌟',
                title: '星星收集家',
                description: '累積 50 顆星星',
                condition: () => this.game.totalStars >= 50
            },
            {
                id: 'level_up',
                icon: '📈',
                title: '等級提升',
                description: '達到等級 5',
                condition: () => this.game.currentLevel >= 5
            },
            {
                id: 'perfect_game',
                icon: '💯',
                title: '完美表現',
                description: '一局遊戲全部答對',
                condition: () => this.game.lastGamePerfect === true
            },
            {
                id: 'question_master',
                icon: '📚',
                title: '題目大師',
                description: '累積答對 100 題',
                condition: () => this.game.statisticsSystem?.stats.totalCorrectAnswers >= 100
            },
            {
                id: 'daily_learner',
                icon: '📅',
                title: '每日學習者',
                description: '連續學習 7 天',
                condition: () => this.game.dailyMissionSystem?.dailyData.streak >= 7
            },
            {
                id: 'reviewer',
                icon: '🔄',
                title: '複習達人',
                description: '掌握 10 個錯題',
                condition: () => this.game.reviewSystem?.masteredQuestions.length >= 10
            },
            {
                id: 'speed_demon',
                icon: '⚡',
                title: '閃電俠',
                description: '在 30 秒內完成 10 題',
                condition: () => this.game.lastGameTime <= 30 && this.game.lastGameQuestions >= 10
            },
            {
                id: 'marathon',
                icon: '🏃',
                title: '馬拉松選手',
                description: '累積學習 60 分鐘',
                condition: () => this.game.statisticsSystem?.stats.totalStudyTime >= 60
            },
            {
                id: 'accuracy_expert',
                icon: '🎯',
                title: '精準專家',
                description: '總體正確率達 90%',
                condition: () => {
                    const stats = this.game.statisticsSystem?.stats;
                    if (!stats || stats.totalQuestionsAnswered === 0) return false;
                    return (stats.totalCorrectAnswers / stats.totalQuestionsAnswered) >= 0.9;
                }
            },
            {
                id: 'game_master',
                icon: '👑',
                title: '遊戲大師',
                description: '完成 50 場遊戲',
                condition: () => this.game.statisticsSystem?.stats.totalGamesPlayed >= 50
            },
            {
                id: 'star_legend',
                icon: '🌠',
                title: '星星傳說',
                description: '累積 200 顆星星',
                condition: () => this.game.totalStars >= 200
            }
        ];
    }

    loadUnlockedBadges() {
        const saved = localStorage.getItem('unlockedBadges');
        return saved ? JSON.parse(saved) : [];
    }

    saveUnlockedBadges() {
        localStorage.setItem('unlockedBadges', JSON.stringify(this.unlockedBadges));
    }

    checkNewBadges() {
        let newBadges = [];
        
        this.badges.forEach(badge => {
            if (!this.unlockedBadges.includes(badge.id) && badge.condition()) {
                this.unlockedBadges.push(badge.id);
                newBadges.push(badge);
            }
        });
        
        if (newBadges.length > 0) {
            this.saveUnlockedBadges();
            this.showNewBadgeAnimation(newBadges);
        }
        
        this.updateBadgeDisplay();
    }

    showNewBadgeAnimation(newBadges) {
        newBadges.forEach((badge, index) => {
            setTimeout(() => {
                this.game.showMessage(`🎉 獲得新徽章：${badge.icon} ${badge.title}！`, 'success');
            }, index * 1000);
        });
    }

    updateBadgeDisplay() {
        const badgesGrid = document.getElementById('badges-grid');
        const earnedCount = document.getElementById('earned-badges-count');
        const totalCount = document.getElementById('total-badges-count');
        
        if (earnedCount) earnedCount.textContent = this.unlockedBadges.length;
        if (totalCount) totalCount.textContent = this.badges.length;
        
        if (!badgesGrid) return;
        
        badgesGrid.innerHTML = '';
        
        this.badges.forEach(badge => {
            const isUnlocked = this.unlockedBadges.includes(badge.id);
            const progress = this.getBadgeProgress(badge);
            
            const badgeElement = document.createElement('div');
            badgeElement.className = `badge-item ${isUnlocked ? 'earned' : 'locked'}`;
            
            badgeElement.innerHTML = `
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-title">${badge.title}</div>
                <div class="badge-description">${badge.description}</div>
                ${!isUnlocked ? `<div class="badge-progress">${progress}</div>` : ''}
            `;
            
            badgesGrid.appendChild(badgeElement);
        });
    }

    getBadgeProgress(badge) {
        switch (badge.id) {
            case 'star_collector':
                return `${this.game.totalStars} / 50`;
            case 'level_up':
                return `等級 ${this.game.currentLevel} / 5`;
            case 'question_master':
                const correct = this.game.statisticsSystem?.stats.totalCorrectAnswers || 0;
                return `${correct} / 100`;
            case 'daily_learner':
                const streak = this.game.dailyMissionSystem?.dailyData.streak || 0;
                return `${streak} / 7 天`;
            case 'reviewer':
                const mastered = this.game.reviewSystem?.masteredQuestions.length || 0;
                return `${mastered} / 10`;
            case 'marathon':
                const studyTime = this.game.statisticsSystem?.stats.totalStudyTime || 0;
                return `${studyTime} / 60 分鐘`;
            case 'game_master':
                const games = this.game.statisticsSystem?.stats.totalGamesPlayed || 0;
                return `${games} / 50`;
            case 'star_legend':
                return `${this.game.totalStars} / 200`;
            default:
                return '尚未解鎖';
        }
    }

    initBadgeEvents() {
        document.getElementById('back-to-game-btn-4')?.addEventListener('click', () => {
            this.game.showScreen('start');
        });
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
