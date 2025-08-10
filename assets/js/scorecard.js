document.addEventListener('DOMContentLoaded', () => {
  // Load quiz results
  const quizResults = JSON.parse(localStorage.getItem('quizResults'));
  
  if (!quizResults) {
    window.location.href = 'index.html';
    return;
  }
  
  // Display summary
  document.getElementById('dateValue').textContent = new Date().toLocaleDateString();
  document.getElementById('marksValue').textContent = quizResults.total;
  document.getElementById('durationValue').textContent = 
    `${Math.floor(quizResults.timeTaken / 60)}:${(quizResults.timeTaken % 60).toString().padStart(2, '0')}`;
  document.getElementById('scoreValue').textContent = `${quizResults.percentage}%`;
  
  // Generate question results
  const resultsContainer = document.querySelector('.question-results');
  resultsContainer.innerHTML = '';
  
  quizResults.details.forEach((result, index) => {
    const questionCard = document.createElement('div');
    questionCard.className = `question-card ${result.isCorrect ? 'correct' : 'incorrect'}`;
    
    questionCard.innerHTML = `
      <div class="question-header">
        <span class="question-number">${index + 1}.</span>
        <span class="question-status">
          <i class="fas ${result.isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
          <span>${result.isCorrect ? 'સાચું' : 'ખોટું'}</span>
        </span>
      </div>
      <div class="question-text">${result.question}</div>
      <div class="question-response">
        <div class="response-answer">
          <span class="response-label">તમારો જવાબ:</span>
          <span class="response-value ${result.isCorrect ? 'correct' : 'incorrect'}">${result.selected}</span>
        </div>
        ${!result.isCorrect ? `
        <div class="response-answer">
          <span class="response-label">સાચો જવાબ:</span>
          <span class="response-value correct">${result.correct}</span>
        </div>
        ` : ''}
        <div class="response-time">
          <i class="fas fa-clock"></i>
          <span>${result.timeSpent} સેકન્ડ</span>
        </div>
      </div>
    `;
    
    resultsContainer.appendChild(questionCard);
  });
  
  // Bind button events
  document.getElementById('retakeExamBtn').addEventListener('click', () => {
    window.location.href = 'exam.html';
  });
  
  document.getElementById('homeBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  
  document.getElementById('downloadBtn').addEventListener('click', () => {
    document.getElementById('downloadModal').classList.remove('hidden');
  });
  
  document.getElementById('closeDownloadModal').addEventListener('click', () => {
    document.getElementById('downloadModal').classList.add('hidden');
  });
  
  document.getElementById('printBtn').addEventListener('click', () => {
    // Prepare printable content
    const printContent = document.createElement('div');
    printContent.className = 'print-content';
    printContent.innerHTML = `
      <h1>RTO Exam Scorecard</h1>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <p>Score: ${quizResults.score}/${quizResults.total} (${quizResults.percentage}%)</p>
      <!-- Add more printable content as needed -->
    `;
    
    document.getElementById('printPreview').appendChild(printContent);
    document.getElementById('printModal').classList.remove('hidden');
  });
  
  document.getElementById('closePrintModal').addEventListener('click', () => {
    document.getElementById('printModal').classList.add('hidden');
  });
  
  document.getElementById('printNowBtn').addEventListener('click', () => {
    window.print();
  });
});
