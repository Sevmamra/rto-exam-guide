// ===== APP INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initServiceWorker();
  initPWAInstallPrompt();
  loadUserProgress();
});

// ===== THEME MANAGEMENT =====
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.classList.toggle('light-theme', savedTheme === 'light');
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? 
      '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
}

function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  
  const icon = document.querySelector('#themeToggle i');
  if (icon) {
    icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
  }
}

// ===== LANGUAGE MANAGEMENT =====
function initLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang') || 'gu';
  setLanguage(lang);
}

function setLanguage(lang) {
  // Save language preference
  localStorage.setItem('language', lang);
  
  // Update UI texts
  const elements = document.querySelectorAll('[data-lang]');
  elements.forEach(el => {
    const key = el.getAttribute('data-lang');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  
  // Update language selector
  const langSelector = document.getElementById('currentLang');
  if (langSelector) {
    langSelector.textContent = lang === 'gu' ? 'ગુજરાતી' : 'English';
  }
}

const translations = {
  gu: {
    welcome: 'સ્વાગત છે',
    start_quiz: 'ક્વિઝ શરૂ કરો',
    // Add all Gujarati translations
  },
  en: {
    welcome: 'Welcome',
    start_quiz: 'Start Quiz',
    // Add all English translations
  }
};

// ===== SERVICE WORKER =====
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }
}

// ===== PWA INSTALL PROMPT =====
let deferredPrompt;

function initPWAInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
      installPrompt.classList.add('show');
      
      const installBtn = document.getElementById('installBtn');
      if (installBtn) {
        installBtn.addEventListener('click', () => {
          installPrompt.classList.remove('show');
          deferredPrompt.prompt();
          
          deferredPrompt.userChoice.then(choiceResult => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted install prompt');
            }
            deferredPrompt = null;
          });
        });
      }
      
      const dismissBtn = document.getElementById('dismissBtn');
      if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
          installPrompt.classList.remove('show');
        });
      }
    }
  });
}

// ===== USER PROGRESS =====
function loadUserProgress() {
  const progress = JSON.parse(localStorage.getItem('userProgress')) || {
    highScore: 0,
    correctAnswers: 0,
    timePracticed: 0,
    lastTopics: []
  };
  
  // Update UI with progress
  document.getElementById('highScore')?.textContent = progress.highScore;
  document.getElementById('correctAnswers')?.textContent = progress.correctAnswers;
  document.getElementById('timePracticed')?.textContent = progress.timePracticed;
}

// ===== UTILITY FUNCTIONS =====
function showLoader() {
  document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}
