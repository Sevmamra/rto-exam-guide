class QuizEngine {
  constructor(questions, options = {}) {
    this.questions = questions;
    this.totalQuestions = options.totalQuestions || 15;
    this.timePerQuestion = options.timePerQuestion || 45;
    this.difficulty = options.difficulty || 'medium';
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.timer = null;
    this.timeRemaining = 0;
    this.quizResults = [];
    this.quizStarted = false;
    
    this.initElements();
    this.bindEvents();
  }
  
  initElements() {
    this.elements = {
      quizContainer: document.getElementById('quizContainer'),
      questionText: document.getElementById('questionText'),
      questionNumber: document.getElementById('questionNumber'),
      optionsContainer: document.getElementById('optionsContainer'),
      timer: document.getElementById('timer'),
      nextBtn: document.getElementById('nextBtn'),
      progressBar: document.getElementById('globalProgress'),
      progressText: document.getElementById('progressText')
    };
  }
  
  bindEvents() {
    this.elements.nextBtn.addEventListener('click', () => this.nextQuestion());
    
    document.querySelectorAll('.option-card').forEach(option => {
      option.addEventListener('click', (e) => this.selectOption(e));
    });
  }
  
  startQuiz() {
    this.quizStarted = true;
    this.shuffleQuestions();
    this.showQuestion();
    this.startTimer();
    this.updateProgress();
  }
  
  shuffleQuestions() {
    // Filter by difficulty and shuffle
    this.filteredQuestions = this.questions
      .filter(q => q.difficulty === this.difficulty)
      .sort(() => Math.random() - 0.5)
      .slice(0, this.totalQuestions);
  }
  
  showQuestion() {
    const question = this.filteredQuestions[this.currentQuestionIndex];
    
    // Update UI
    this.elements.questionText.textContent = question.question;
    this.elements.questionNumber.textContent = `પ્રશ્ન ${this.currentQuestionIndex + 1}`;
    
    // Clear previous options
    this.elements.optionsContainer.innerHTML = '';
    
    // Add new options
    question.options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'option-card';
      optionElement.dataset.option = index + 1;
      optionElement.innerHTML = `
        <div class="option-letter">${String.fromCharCode(65 + index)}</div>
        <div class="option-text">${option}</div>
        <div class="option-selector">
          <div class="selector-circle"></div>
        </div>
      `;
      optionElement.addEventListener('click', (e) => this.selectOption(e));
      this.elements.optionsContainer.appendChild(optionElement);
    });
    
    // Reset timer for new question
    this.timeRemaining = this.timePerQuestion;
    this.updateTimerDisplay();
  }
  
  selectOption(e) {
    const selectedOption = e.currentTarget;
    const selectedOptionIndex = parseInt(selectedOption.dataset.option);
    
    // Mark selected option
    document.querySelectorAll('.option-card').forEach(option => {
      option.classList.remove('selected');
    });
    selectedOption.classList.add('selected');
    
    // Enable next button
    this.elements.nextBtn.disabled = false;
    
    // Store selected answer
    this.selectedAnswer = selectedOptionIndex;
  }
  
  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      
      if (this.timeRemaining <= 0) {
        this.handleTimeout();
      }
    }, 1000);
  }
  
  updateTimerDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    this.elements.timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Change color when time is running out
    if (this.timeRemaining <= 10) {
      this.elements.timer.style.color = '#ef4444';
    } else {
      this.elements.timer.style.color = '#f59e0b';
    }
  }
  
  handleTimeout() {
    clearInterval(this.timer);
    this.elements.timer.textContent = '00:00';
    this.nextQuestion();
  }
  
  nextQuestion() {
    // Save result
    const currentQuestion = this.filteredQuestions[this.currentQuestionIndex];
    const isCorrect = this.selectedAnswer === currentQuestion.correctAnswer;
    
    this.quizResults.push({
      question: currentQuestion.question,
      selected: currentQuestion.options[this.selectedAnswer - 1],
      correct: currentQuestion.options[currentQuestion.correctAnswer - 1],
      isCorrect,
      timeSpent: this.timePerQuestion - this.timeRemaining
    });
    
    if (isCorrect) this.score++;
    
    // Move to next question or end quiz
    this.currentQuestionIndex++;
    this.updateProgress();
    
    if (this.currentQuestionIndex < this.filteredQuestions.length) {
      this.showQuestion();
      this.startTimer();
    } else {
      this.endQuiz();
    }
  }
  
  updateProgress() {
    const progress = (this.currentQuestionIndex / this.filteredQuestions.length) * 100;
    this.elements.progressBar.style.width = `${progress}%`;
    this.elements.progressText.textContent = 
      `${this.currentQuestionIndex}/${this.filteredQuestions.length}`;
  }
  
  endQuiz() {
    clearInterval(this.timer);
    
    // Calculate results
    const percentage = Math.round((this.score / this.filteredQuestions.length) * 100);
    const totalTime = this.quizResults.reduce((sum, q) => sum + q.timeSpent, 0);
    
    // Save to localStorage
    const userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
    userProgress.highScore = Math.max(userProgress.highScore || 0, percentage);
    userProgress.correctAnswers = (userProgress.correctAnswers || 0) + this.score;
    userProgress.timePracticed = (userProgress.timePracticed || 0) + totalTime;
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
    
    // Save quiz results for scorecard
    localStorage.setItem('quizResults', JSON.stringify({
      score: this.score,
      total: this.filteredQuestions.length,
      percentage,
      timeTaken: totalTime,
      details: this.quizResults
    }));
    
    // Show completion screen
    this.showCompletionScreen(percentage);
  }
  
  showCompletionScreen(percentage) {
    this.elements.quizContainer.classList.add('hidden');
    
    const completionScreen = document.getElementById('quizCompleted');
    completionScreen.classList.remove('hidden');
    
    // Animate percentage
    let current = 0;
    const target = percentage;
    const increment = target > 0 ? 1 : -1;
    const duration = 2000; // 2 seconds
    const stepTime = Math.abs(Math.floor(duration / (target - current)));
    
    const timer = setInterval(() => {
      current += increment;
      document.getElementById('resultPercentage').textContent = `${current}%`;
      
      if (current === target) {
        clearInterval(timer);
      }
    }, stepTime);
    
    // Set other result values
    document.getElementById('correctStat').textContent = this.score;
    document.getElementById('incorrectStat').textContent = this.filteredQuestions.length - this.score;
    
    const minutes = Math.floor(this.quizResults.reduce((sum, q) => sum + q.timeSpent, 0) / 60);
    document.getElementById('timeStat').textContent = minutes.toFixed(1);
    
    // Bind button events
    document.getElementById('scorecardBtn').addEventListener('click', () => {
      window.location.href = 'scorecard.html';
    });
    
    document.getElementById('reviewBtn').addEventListener('click', () => {
      window.location.href = 'scorecard.html?review=true';
    });
  }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Load questions based on selected language
  const lang = new URLSearchParams(window.location.search).get('lang') || 'gu';
  const questionsFile = lang === 'gu' ? '../data/questions-gu.json' : '../data/questions-en.json';
  
  fetch(questionsFile)
    .then(response => response.json())
    .then(data => {
      const quiz = new QuizEngine(data.questions, {
        totalQuestions: parseInt(new URLSearchParams(window.location.search).get('total')) || 15,
        difficulty: 'medium' // Can be set from UI
      });
      
      document.getElementById('startExamBtn').addEventListener('click', () => {
        quiz.startQuiz();
      });
    })
    .catch(error => {
      console.error('Error loading questions:', error);
      showToast('Error loading questions. Please try again.', 'error');
    });
});
