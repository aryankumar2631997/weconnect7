// ============================================
// WECONNECT - THEME & LANGUAGE (site-wide)
// Does NOT affect booking or admin logic
// ============================================

// ---------- DARK / LIGHT THEME ----------
function initTheme() {
  const savedTheme = localStorage.getItem('weconnect_theme');
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
  } else {
    document.body.classList.add('dark-mode');
  }
  updateThemeButton();
}

function updateThemeButton() {
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ Light' : '🌙 Dark';
  }
}

function toggleTheme() {
  if (document.body.classList.contains('dark-mode')) {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('weconnect_theme', 'light');
  } else {
    document.body.classList.add('dark-mode');
    localStorage.setItem('weconnect_theme', 'dark');
  }
  updateThemeButton();
}

// ---------- ENGLISH / HINDI LANGUAGE ----------
const translations = {
  en: {
    nav_services: "Services",
    nav_how: "How it works",
    nav_features: "Features",
    nav_reviews: "Reviews",
    nav_login: "Login",
    nav_logout: "Logout",
    nav_myorders: "My Orders"
  },
  hi: {
    nav_services: "सेवाएँ",
    nav_how: "कैसे काम करता है",
    nav_features: "विशेषताएँ",
    nav_reviews: "समीक्षाएँ",
    nav_login: "लॉगिन",
    nav_logout: "लॉगआउट",
    nav_myorders: "मेरे ऑर्डर"
  }
};

let currentLang = localStorage.getItem('weconnect_lang') || 'en';

function applyLanguage() {
  document.querySelectorAll('[data-lang-key]').forEach(el => {
    const key = el.getAttribute('data-lang-key');
    if (translations[currentLang][key]) {
      el.innerText = translations[currentLang][key];
    }
  });
  const langBtn = document.getElementById('langSwitcher');
  if (langBtn) {
    langBtn.innerHTML = currentLang === 'en' ? '🌐 हिन्दी' : '🇬🇧 English';
  }
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  localStorage.setItem('weconnect_lang', currentLang);
  applyLanguage();
}

// ---------- INJECT BUTTONS INTO NAVBAR ----------
function injectButtons() {
  const navButtons = document.querySelector('.nav-buttons');
  if (!navButtons) return;

  if (!document.getElementById('themeToggle')) {
    const themeBtn = document.createElement('button');
    themeBtn.id = 'themeToggle';
    themeBtn.className = 'btn btn-outline';
    themeBtn.style.marginLeft = '8px';
    themeBtn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ Light' : '🌙 Dark';
    themeBtn.addEventListener('click', toggleTheme);
    navButtons.appendChild(themeBtn);
  }

  if (!document.getElementById('langSwitcher')) {
    const langBtn = document.createElement('button');
    langBtn.id = 'langSwitcher';
    langBtn.className = 'btn btn-outline';
    langBtn.style.marginLeft = '8px';
    langBtn.innerHTML = currentLang === 'en' ? '🌐 हिन्दी' : '🇬🇧 English';
    langBtn.addEventListener('click', toggleLanguage);
    navButtons.appendChild(langBtn);
  }
}

// ---------- INITIALIZE ----------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  injectButtons();
  applyLanguage();
});