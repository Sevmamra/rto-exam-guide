document.addEventListener('DOMContentLoaded', () => {
  // Load quiz results
  const quizResults = JSON.parse(localStorage.getItem('quizResults'));
  
  if (!quizResults) {
    window.location.href = 'index.html';
    return;
  }
  
  // Display results
  const isPass = quizResults.percentage >= 66;
  
  document.getElementById('resultStatus').textContent = isPass ? 'પાસ' : 'ફેઇલ';
  document.getElementById('resultDescription').textContent = isPass ? 
    'તમે પરીક્ષામાં સફળતાપૂર્વક ઉત્તીર્ણ થયા છો!' :
    'તમે પરીક્ષામાં ઉત્તીર્ણ થયા નથી, ફરીથી પ્રયાસ કરો.';
  
  // Set result colors
  const resultBadge = document.querySelector('.result-badge');
  resultBadge.style.background = isPass ? 
    'linear-gradient(135deg, #10b981, #3b82f6)' :
    'linear-gradient(135deg, #ef4444, #f59e0b)';
  
  // Initialize charts
  initCharts(quizResults);
  
  // Bind button events
  document.getElementById('retryBtn').addEventListener('click', () => {
    window.location.href = 'exam.html';
  });
  
  document.getElementById('scorecardBtn').addEventListener('click', () => {
    window.location.href = 'scorecard.html';
  });
  
  document.getElementById('shareBtn').addEventListener('click', () => {
    document.getElementById('shareModal').classList.remove('hidden');
  });
  
  document.getElementById('closeShareModal').addEventListener('click', () => {
    document.getElementById('shareModal').classList.add('hidden');
  });
});

function initCharts(quizResults) {
  const ctx = document.getElementById('performanceChart').getContext('2d');
  
  // Prepare data for chart
  const labels = quizResults.details.map((_, i) => `Q${i + 1}`);
  const correctAnswers = quizResults.details.map(q => q.isCorrect);
  const timeSpent = quizResults.details.map(q => q.timeSpent);
  
  // Create chart
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Time Spent (seconds)',
          data: timeSpent,
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Seconds'
          }
        }
      }
    }
  });
  
  // Tab switching functionality
  document.querySelectorAll('.chart-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('premium-tab')) {
        document.getElementById('premiumModal').classList.remove('hidden');
        return;
      }
      
      document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update chart based on selected tab
      const chartType = tab.dataset.chart;
      updateChart(chartType, chart, quizResults);
    });
  });
}

function updateChart(type, chart, quizResults) {
  // This would update the chart based on selected type
  // Implementation would depend on your data structure
}
