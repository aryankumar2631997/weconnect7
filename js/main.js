// ========================================
// WECONNECT - MAIN.JS
// Global JavaScript for ALL 50 Pages
// Version: 2.0
// ========================================

// ============ DOM Ready Wrapper ============
const WeConnect = {
  // Initialize all components
  init: function() {
    this.initToast();
    this.initModals();
    this.initHeaderScroll();
    this.initScrollTop();
    this.initMobileMenu();
    this.initDateInputs();
    this.initFormValidation();
    this.initLazyLoad();
  },

  // ============ TOAST NOTIFICATIONS ============
  toastContainer: null,

  initToast: function() {
    this.toastContainer = document.getElementById('toast-container');
    if (!this.toastContainer) {
      this.toastContainer = document.createElement('div');
      this.toastContainer.id = 'toast-container';
      document.body.appendChild(this.toastContainer);
    }
  },

  showToast: function(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    
    this.toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
    
    return toast;
  },

  // ============ MODAL MANAGEMENT ============
  initModals: function() {
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
    
    // Close modal on overlay click
    document.addEventListener('click', (e) => {
      if (e.target.classList && e.target.classList.contains('modal-overlay')) {
        this.closeModal(e.target.id);
      }
    });
  },

  openModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
    }
  },

  closeModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  },

  closeAllModals: function() {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  },

  getScrollbarWidth: function() {
    return window.innerWidth - document.documentElement.clientWidth;
  },

  // ============ HEADER SCROLL EFFECT ============
  initHeaderScroll: function() {
    const header = document.querySelector('.navbar');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  },

  // ============ SCROLL TO TOP ============
  initScrollTop: function() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  // ============ MOBILE MENU ============
  initMobileMenu: function() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;
    
    btn.addEventListener('click', () => {
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  },

  closeMobileMenu: function() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  // ============ DATE INPUTS ============
  initDateInputs: function() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
      if (!input.value) {
        input.min = today;
      }
    });
  },

  // ============ FORM VALIDATION ============
  initFormValidation: function() {
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });
    });
  },

  validateForm: function(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
        this.showToast(`Please fill ${field.previousElementSibling?.textContent || 'this field'}`, 'error');
      } else {
        field.classList.remove('error');
      }
    });
    
    return isValid;
  },

  // ============ LAZY LOAD IMAGES ============
  initLazyLoad: function() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        observer.observe(img);
      });
    }
  },

  // ============ LOADING STATES ============
  showLoading: function(element) {
    if (element) {
      element.disabled = true;
      element.dataset.originalText = element.innerHTML;
      element.innerHTML = '<span class="loading-spinner"></span> Loading...';
    }
  },

  hideLoading: function(element) {
    if (element) {
      element.disabled = false;
      if (element.dataset.originalText) {
        element.innerHTML = element.dataset.originalText;
      }
    }
  },

  // ============ DEBOUNCE FUNCTION ============
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // ============ THROTTLE FUNCTION ============
  throttle: function(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // ============ DATE FORMATTING ============
  formatDate: function(dateString, format = 'DD/MM/YYYY') {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    switch(format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD MMM YYYY':
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day} ${months[date.getMonth()]} ${year}`;
      case 'full':
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      default:
        return `${day}/${month}/${year}`;
    }
  },

  // ============ GENERATE UNIQUE ID ============
  generateId: function(prefix = 'LC') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  },

  // ============ STATUS HELPERS ============
  getStatusMessage: function(status) {
    const messages = {
      pending: '⏳ Your order is placed. Waiting for merchant to confirm...',
      confirmed: '✅ Your order has been confirmed by the merchant!',
      completed: '🎉 Order Completed! Thank you for using WeConnect.',
      rejected: '❌ Order could not be confirmed. Please try another option.'
    };
    return messages[status] || messages.pending;
  },

  getStatusBadge: function(status) {
    const badges = {
      pending: '<span class="badge badge-pending">Pending</span>',
      confirmed: '<span class="badge badge-confirmed">Confirmed</span>',
      completed: '<span class="badge badge-completed">Completed</span>',
      rejected: '<span class="badge badge-rejected">Rejected</span>'
    };
    return badges[status] || badges.pending;
  },

  getStatusClass: function(status) {
    const classes = {
      pending: 'status-pending-message',
      confirmed: 'status-confirmed-message',
      completed: 'status-completed-message',
      rejected: 'status-rejected-message'
    };
    return classes[status] || 'status-pending-message';
  },

  // ============ URL HELPERS ============
  getUrlParams: function() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    return params;
  },

  redirect: function(url) {
    window.location.href = url;
  },

  reload: function() {
    window.location.reload();
  },

  // ============ STORAGE HELPERS ============
  setLocalStorage: function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getLocalStorage: function(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  removeLocalStorage: function(key) {
    localStorage.removeItem(key);
  },

  setSessionStorage: function(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  getSessionStorage: function(key) {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  removeSessionStorage: function(key) {
    sessionStorage.removeItem(key);
  },

  // ============ ELEMENT HELPERS ============
  getElement: function(selector) {
    return document.querySelector(selector);
  },

  getElements: function(selector) {
    return document.querySelectorAll(selector);
  },

  addClass: function(element, className) {
    if (element) element.classList.add(className);
  },

  removeClass: function(element, className) {
    if (element) element.classList.remove(className);
  },

  toggleClass: function(element, className) {
    if (element) element.classList.toggle(className);
  },

  // ============ AJAX HELPERS ============
  fetchData: async function(url, options = {}) {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Fetch error:', error);
      this.showToast('Network error. Please try again.', 'error');
      return { success: false, error };
    }
  },

  postData: async function(url, data) {
    return await this.fetchData(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};

// ============ GLOBAL FUNCTIONS (for inline HTML calls) ==========
window.showToast = (message, type) => WeConnect.showToast(message, type);
window.openModal = (modalId) => WeConnect.openModal(modalId);
window.closeModal = (modalId) => WeConnect.closeModal(modalId);
window.closeAllModals = () => WeConnect.closeAllModals();
window.closeMobileMenu = () => WeConnect.closeMobileMenu();
window.showLoading = (el) => WeConnect.showLoading(el);
window.hideLoading = (el) => WeConnect.hideLoading(el);
window.generateId = (prefix) => WeConnect.generateId(prefix);
window.getStatusMessage = (status) => WeConnect.getStatusMessage(status);
window.getStatusBadge = (status) => WeConnect.getStatusBadge(status);
window.formatDate = (date, format) => WeConnect.formatDate(date, format);

// ============ LOADING SPINNER CSS ============
if (!document.querySelector('#weconnect-spinner-style')) {
  const style = document.createElement('style');
  style.id = 'weconnect-spinner-style';
  style.textContent = `
    .loading-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: weconnect-spin 0.6s linear infinite;
      margin-right: 6px;
    }
    @keyframes weconnect-spin {
      to { transform: rotate(360deg); }
    }
    input.error, select.error, textarea.error {
      border-color: #EF4444 !important;
      background-color: rgba(239,68,68,0.05) !important;
    }
  `;
  document.head.appendChild(style);
}

// ============ INITIALIZE ON DOM READY ============
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => WeConnect.init());
} else {
  WeConnect.init();
}

// ============ EXPORT FOR MODULE USE (if needed) ============
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WeConnect;
}