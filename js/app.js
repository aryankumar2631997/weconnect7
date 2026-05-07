// ========== SITE-WIDE THEME TOGGLE ==========
function initTheme() {
  const savedTheme = localStorage.getItem('weconnect_theme');
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
  } else {
    document.body.classList.add('dark-mode');
  }
  updateThemeButtonText();
}

function updateThemeButtonText() {
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ Light' : '🌙 Dark';
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
  updateThemeButtonText();
}

// ========== SITE-WIDE LANGUAGE SWITCHER ==========
const translations = {
  en: {
    nav_services: "Services",
    nav_how: "How it works",
    nav_features: "Features",
    nav_reviews: "Reviews",
    nav_login: "Login",
    nav_logout: "Logout",
    nav_myorders: "My Orders",
    hero_badge: "Now live in Lakhisarai, Bihar",
    hero_title1: "City services,",
    hero_title2: "one platform.",
    hero_subtitle: "सब कुछ एक जगह — लखीसराय",
    hero_desc: "Book doctors, cinema tickets, hotels, transport, wedding vendors, and local services — all in one place. WhatsApp-confirmed bookings in minutes.",
    hero_btn1: "Explore Services →",
    hero_btn2: "How it works",
    stat_services: "Services",
    stat_merchants: "Merchants",
    stat_confirmation: "Confirmation",
    stat_fee: "Booking Fee",
    services_tag: "What we offer",
    services_title1: "Every city service,",
    services_title2: "digitized.",
    service_healthcare: "Healthcare",
    service_healthcare_desc: "Book appointments with doctors and hospitals. 24/7 emergency available.",
    service_cinema: "Cinema",
    service_cinema_desc: "Book seats at Raj Talkies and Mahadev Talkies. Choose your show.",
    service_hotel: "Hotels & Banquets",
    service_hotel_desc: "AC rooms, party halls, marriage venues, and catering services.",
    service_transport: "Transport",
    service_transport_desc: "Book cars, bikes, and Toto e-rickshaws for local and outstation travel.",
    service_wedding: "Wedding Services",
    service_wedding_desc: "Complete wedding ecosystem — halls, catering, decoration, photography, DJ.",
    service_local: "Local Services",
    service_local_desc: "Electricians, plumbers, carpenters, cleaning, and grocery delivery.",
    service_school: "School & Tuition",
    service_school_desc: "Find schools, tuition classes, and home tutors in Lakhisarai.",
    service_delivery: "Delivery Service",
    service_delivery_desc: "Food, grocery, medicine & parcel delivery in Lakhisarai.",
    how_tag: "Simple process",
    how_title1: "Book in",
    how_title2: "3 steps",
    how_desc: "No app download needed. Just pick your service, fill details, and confirm.",
    step1_title: "Choose & Fill",
    step1_desc: "Pick any service and fill a quick booking form — name, time, and details.",
    step2_title: "Order Placed",
    step2_desc: "Your order is received and pending merchant confirmation.",
    step3_title: "Confirmed!",
    step3_desc: "Merchant confirms your order. You receive update instantly.",
    features_tag: "Why choose us",
    features_title1: "Built for",
    features_title2: "Lakhisarai.",
    feature1_title: "No app download",
    feature1_desc: "Works directly in your browser. No Play Store, no installation required.",
    feature2_title: "Instant updates",
    feature2_desc: "Get real-time order status updates on your dashboard.",
    feature3_title: "Quick confirmation",
    feature3_desc: "Average order confirmed in under 10 minutes.",
    feature4_title: "Secure & private",
    feature4_desc: "Your information is safe and never shared.",
    feature5_title: "Hyperlocal",
    feature5_desc: "Every business listed is verified and located in Lakhisarai.",
    feature6_title: "Free for users",
    feature6_desc: "No booking fees, no hidden charges. Always free to use.",
    reviews_tag: "Reviews",
    reviews_title: "loves it.",
    review1_text: "Doctor appointment booked in 3 minutes. The order confirmation came immediately. No more waiting in queues!",
    review2_text: "Booked cinema tickets for my family in seconds. Seat selection was so easy, and tracking my order was simple.",
    review3_text: "As a plumber, I now get all my bookings through WeConnect. The platform is easy to use and brings me customers.",
    cta_title1: "Ready to connect",
    cta_title2: "Lakhisarai?",
    cta_desc: "Whether you're a resident looking to book services or a local business wanting to go digital — WeConnect is for you.",
    cta_btn1: "Browse services →",
    cta_btn2: "Create Account",
    stat_users: "For users",
    stat_setup: "To set up",
    stat_available: "Available",
    footer_desc: "Digitizing every service in Lakhisarai, Bihar. One booking at a time.",
    footer_services: "Services",
    footer_platform: "Platform",
    footer_contact: "Contact"
  },
  hi: {
    nav_services: "सेवाएँ",
    nav_how: "कैसे काम करता है",
    nav_features: "विशेषताएँ",
    nav_reviews: "समीक्षाएँ",
    nav_login: "लॉगिन",
    nav_logout: "लॉगआउट",
    nav_myorders: "मेरे ऑर्डर",
    hero_badge: "अभी लाइव - लखीसराय, बिहार",
    hero_title1: "शहर की सेवाएँ,",
    hero_title2: "एक मंच पर।",
    hero_subtitle: "सब कुछ एक जगह — लखीसराय",
    hero_desc: "डॉक्टर, सिनेमा, होटल, परिवहन, शादी, और स्थानीय सेवाएँ बुक करें — सब एक जगह। व्हाट्सएप पर पुष्टि।",
    hero_btn1: "सेवाएँ देखें →",
    hero_btn2: "कैसे काम करता है",
    stat_services: "सेवाएँ",
    stat_merchants: "व्यापारी",
    stat_confirmation: "पुष्टि समय",
    stat_fee: "बुकिंग शुल्क",
    services_tag: "हमारी सेवाएँ",
    services_title1: "हर शहरी सेवा,",
    services_title2: "डिजिटल।",
    service_healthcare: "स्वास्थ्य सेवा",
    service_healthcare_desc: "डॉक्टरों और अस्पतालों में अपॉइंटमेंट बुक करें। 24/7 आपातकाल।",
    service_cinema: "सिनेमा",
    service_cinema_desc: "राज टॉकीज और महादेव टॉकीज में सीट बुक करें।",
    service_hotel: "होटल और बैंक्वेट",
    service_hotel_desc: "एसी कमरे, पार्टी हॉल, शादी स्थल और कैटरिंग।",
    service_transport: "परिवहन",
    service_transport_desc: "कार, बाइक, और टोटो ई-रिक्शा बुक करें।",
    service_wedding: "शादी सेवाएँ",
    service_wedding_desc: "पूर्ण शादी इकोसिस्टम — हॉल, कैटरिंग, सजावट, फोटोग्राफी, DJ।",
    service_local: "स्थानीय सेवाएँ",
    service_local_desc: "इलेक्ट्रीशियन, प्लंबर, कारपेंटर, सफाई, और किराना डिलीवरी।",
    service_school: "स्कूल और ट्यूशन",
    service_school_desc: "लखीसराय में स्कूल, ट्यूशन क्लास, और होम ट्यूटर खोजें।",
    service_delivery: "डिलीवरी सेवा",
    service_delivery_desc: "भोजन, किराना, दवा और पार्सल डिलीवरी।",
    how_tag: "सरल प्रक्रिया",
    how_title1: "बुक करें",
    how_title2: "3 चरणों में",
    how_desc: "कोई ऐप डाउनलोड नहीं। बस सेवा चुनें, विवरण भरें, और पुष्टि करें।",
    step1_title: "चुनें और भरें",
    step1_desc: "कोई भी सेवा चुनें और त्वरित फॉर्म भरें — नाम, समय और विवरण।",
    step2_title: "ऑर्डर डाला गया",
    step2_desc: "आपका ऑर्डर प्राप्त हो गया है, व्यापारी पुष्टि की प्रतीक्षा में।",
    step3_title: "पुष्टि हुई!",
    step3_desc: "व्यापारी आपके ऑर्डर की पुष्टि करता है। आपको तुरंत अपडेट मिलता है।",
    features_tag: "हमें क्यों चुनें",
    features_title1: "के लिए बनाया गया",
    features_title2: "लखीसराय।",
    feature1_title: "कोई ऐप डाउनलोड नहीं",
    feature1_desc: "सीधे ब्राउज़र में काम करता है। प्ले स्टोर की जरूरत नहीं।",
    feature2_title: "तुरंत अपडेट",
    feature2_desc: "अपने डैशबोर्ड पर ऑर्डर की स्थिति देखें।",
    feature3_title: "त्वरित पुष्टि",
    feature3_desc: "औसतन ऑर्डर 10 मिनट में पुष्टि।",
    feature4_title: "सुरक्षित और निजी",
    feature4_desc: "आपकी जानकारी सुरक्षित है।",
    feature5_title: "स्थानीय",
    feature5_desc: "प्रत्येक व्यवसाय सत्यापित और लखीसराय में स्थित।",
    feature6_title: "उपयोगकर्ताओं के लिए मुफ्त",
    feature6_desc: "कोई बुकिंग शुल्क नहीं। हमेशा मुफ्त।",
    reviews_tag: "समीक्षाएँ",
    reviews_title: "प्यार करता है।",
    review1_text: "डॉक्टर अपॉइंटमेंट 3 मिनट में बुक हुआ। ऑर्डर की पुष्टि तुरंत आ गई।",
    review2_text: "सिनेमा टिकट सेकंडों में बुक किए। सीट चुनना आसान था।",
    review3_text: "एक प्लंबर के रूप में, मुझे अब सभी बुकिंग WeConnect के माध्यम से मिलती हैं।",
    cta_title1: "लखीसराय को जोड़ने के लिए तैयार हैं?",
    cta_title2: "",
    cta_desc: "चाहे आप सेवाएँ बुक करना चाहते हों या डिजिटल होना चाहते हों — WeConnect आपके लिए है।",
    cta_btn1: "सेवाएँ देखें →",
    cta_btn2: "खाता बनाएँ",
    stat_users: "उपयोगकर्ताओं के लिए",
    stat_setup: "सेटअप समय",
    stat_available: "उपलब्ध",
    footer_desc: "लखीसराय, बिहार में हर सेवा को डिजिटल बनाना। एक बुकिंग एक बार।",
    footer_services: "सेवाएँ",
    footer_platform: "प्लेटफॉर्म",
    footer_contact: "संपर्क"
  }
};

let currentLang = localStorage.getItem('weconnect_lang') || 'en';

function applyLanguage() {
  document.querySelectorAll('[data-lang-key]').forEach(el => {
    const key = el.getAttribute('data-lang-key');
    if (translations[currentLang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[currentLang][key];
      } else {
        el.innerText = translations[currentLang][key];
      }
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

// ========== INJECT BUTTONS INTO EVERY PAGE ==========
function injectNavButtons() {
  const navButtons = document.querySelector('.nav-buttons');
  if (!navButtons) return;

  // Add theme toggle if not already present
  if (!document.getElementById('themeToggle')) {
    const themeBtn = document.createElement('button');
    themeBtn.id = 'themeToggle';
    themeBtn.className = 'btn btn-outline';
    themeBtn.style.marginLeft = '8px';
    themeBtn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ Light' : '🌙 Dark';
    themeBtn.addEventListener('click', toggleTheme);
    navButtons.appendChild(themeBtn);
  }

  // Add language switcher if not already present
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

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  injectNavButtons();
  applyLanguage();
});






const API_BASE = window.location.origin; // Railway will provide the correct URL
// Then use fetch(API_BASE + '/api/save-booking', ...)

// ========================================
// WECONNECT - COMPLETE APP.JS
// ========================================
const BACKEND_URL = 'http://localhost:3001'; // CHANGE when you deploy

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + (type || 'info');
  toast.innerHTML = '<span>' + (type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️') + '</span><span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 4000);
}

// ============ GLOBAL OBJECTS (for existing pages) ============
window.WeConnect = {
  showToast: showToast,
  formatDate: function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  },
  getStatusMessage: function(status) {
    const messages = { pending: '⏳ Your order is placed. Waiting for merchant to confirm...', confirmed: '✅ Your order has been confirmed!', completed: '🎉 Order Completed!', rejected: '❌ Order could not be confirmed.' };
    return messages[status] || messages.pending;
  },
  getStatusBadge: function(status) {
    const badges = { pending: 'badge-pending', confirmed: 'badge-confirmed', completed: 'badge-completed', rejected: 'badge-rejected' };
    return `<span class="badge ${badges[status] || 'badge-pending'}">${status.toUpperCase()}</span>`;
  }
};

window.WeConnectAuth = {
  getCurrentUser: getCurrentUser,
  isLoggedIn: isLoggedIn,
  logout: logoutUser,
  login: loginUser,
  register: registerUser,
  sendOTP: function(phone) {
    console.log(`OTP for ${phone}: 123456`);
    showToast(`Demo OTP: 123456`, 'info');
    return { success: true };
  },
  verifyOTP: function(phone, otp) {
    if (otp === '123456') {
      let users = getUsers();
      let user = users.find(u => u.phone === phone);
      if (!user) {
        user = { id: 'U-' + Date.now(), name: '', phone: phone, email: '', password: '', createdAt: new Date().toISOString() };
        users.push(user);
        saveUsers(users);
      }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, name: user.name || phone, phone: user.phone, email: user.email, loginTime: new Date().toISOString() }));
      showToast('OTP verified! Login successful', 'success');
      return { success: true };
    } else {
      showToast('Invalid OTP', 'error');
      return { success: false };
    }
  },
  getUsers: getUsers,
  saveUsers: saveUsers
};
// Auto‑sync any booking saved to localStorage to the live backend
(function autoSync() {
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (key === 'weconnect_bookings') {
      try {
        const all = JSON.parse(value);
        if (all.length === 0) return;
        const latest = all[all.length - 1];
        fetch('/api/save-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: 'doctor', // or map from latest.serviceType
            customerName: latest.userName,
            customerPhone: latest.userPhone,
            formData: latest.formData
          })
        })
        .then(res => res.json())
        .then(data => console.log('✅ Synced to Google Sheets:', data))
        .catch(err => console.error('Sync error:', err));
      } catch(e) {}
    }
  };
})();
// ============ HELPER FUNCTIONS ============
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function generateId() { return 'LC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(); }
function getStatusMessage(status) {
  const messages = { pending: '⏳ Your order is placed. Waiting for merchant to confirm...', confirmed: '✅ Your order has been confirmed!', completed: '🎉 Order Completed!', rejected: '❌ Order could not be confirmed.' };
  return messages[status] || messages.pending;
}
function getStatusBadge(status) {
  const badges = { pending: 'badge-pending', confirmed: 'badge-confirmed', completed: 'badge-completed', rejected: 'badge-rejected' };
  return `<span class="badge ${badges[status] || 'badge-pending'}">${status.toUpperCase()}</span>`;
}

// ============ AUTHENTICATION ============
const USERS_KEY = 'weconnect_users';
const SESSION_KEY = 'weconnect_current_user';

function getUsers() { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function getCurrentUser() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch(e) { return null; } }
function isLoggedIn() { return getCurrentUser() !== null; }

function registerUser(name, phone, email, password) {
  let users = getUsers();
  if (users.find(u => u.phone === phone)) return { success: false, message: 'Phone number already registered' };
  const user = { id: 'U-' + Date.now(), name, phone, email, password, createdAt: new Date().toISOString() };
  users.push(user);
  saveUsers(users);
  return { success: true, user };
}

function loginUser(identifier, password) {
  const users = getUsers();
  const user = users.find(u => (u.phone === identifier || u.email === identifier) && u.password === password);
  if (!user) return { success: false, message: 'Invalid credentials' };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, name: user.name, phone: user.phone, email: user.email, loginTime: new Date().toISOString() }));
  return { success: true, user };
}

function logoutUser() { sessionStorage.removeItem(SESSION_KEY); showToast('Logged out successfully', 'success'); window.location.href = '/index.html'; }

function updateAuthUI() {
  const user = getCurrentUser();
  const loginBtn = document.getElementById('login-nav-btn');
  const logoutBtn = document.getElementById('logout-nav-btn');
  const myOrdersBtn = document.getElementById('my-orders-link');
  const userNameSpan = document.getElementById('user-name');
  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
    if (myOrdersBtn) myOrdersBtn.style.display = 'inline-block';
    if (userNameSpan) userNameSpan.textContent = user.name || user.phone;
    const mobileMyOrders = document.getElementById('mobile-my-orders');
    if (mobileMyOrders) mobileMyOrders.style.display = 'block';
    const mobileLogin = document.getElementById('mobile-login');
    if (mobileLogin) mobileLogin.style.display = 'none';
    const mobileLogout = document.getElementById('mobile-logout');
    if (mobileLogout) mobileLogout.style.display = 'block';
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (myOrdersBtn) myOrdersBtn.style.display = 'none';
    if (userNameSpan) userNameSpan.style.display = 'none';
  }
}
function requireAuth() {
  if (!isLoggedIn()) {
    sessionStorage.setItem('weconnect_redirect_after_login', window.location.pathname);
    showToast('Please login to continue', 'warning');
    window.location.href = '/user/login.html';
    return false;
  }
  return true;
}

// ============ BOOKINGS (with automatic backend sync) ============
function getBookings() { return JSON.parse(localStorage.getItem('weconnect_bookings') || '[]'); }
function saveBookings(bookings) { localStorage.setItem('weconnect_bookings', JSON.stringify(bookings)); }

function getCategoryFromServiceType(serviceType) {
  const map = {
    'healthcare': 'doctor', 'hospital': 'doctor', 'doctor': 'doctor', 'cinema': 'cinema',
    'hotel': 'hotel', 'transport': 'transport', 'wedding': 'wedding', 'local services': 'local',
    'local': 'local', 'school': 'school', 'delivery': 'delivery', 'tutor': 'school',
    'tuition': 'school', 'restaurant': 'delivery', 'grocery': 'delivery', 'pharmacy': 'delivery'
  };
  const lower = (serviceType || '').toLowerCase();
  return map[lower] || lower;
}

function syncBookingToBackend(booking) {
  const category = getCategoryFromServiceType(booking.serviceType);
  fetch(`${BACKEND_URL}/api/save-booking`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, customerName: booking.userName, customerPhone: booking.userPhone, formData: booking.formData || {} })
  })
  .then(res => res.json())
  .then(data => { if (data.success) console.log('✅ Synced to Google Sheets:', data.id); else console.warn('⚠️ Sync error:', data.message); })
  .catch(err => console.error('❌ Network error:', err));
}

function createBooking(serviceType, serviceName, formData) {
  const user = getCurrentUser();
  if (!user) return null;
  const booking = {
    id: generateId(), userId: user.id, userPhone: user.phone, userName: user.name || formData.name,
    serviceType, serviceName, status: 'pending', createdAt: new Date().toISOString(), formData
  };
  const bookings = getBookings();
  bookings.push(booking);
  saveBookings(bookings);
  syncBookingToBackend(booking);
  showToast(`✅ Booking confirmed! ID: ${booking.id}`, 'success');
  return booking;
}

// Interceptor for direct localStorage saves (catches any booking saved without createBooking)
(function installInterceptor() {
  if (window.__weconnectInterceptorInstalled) return;
  window.__weconnectInterceptorInstalled = true;
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (key === 'weconnect_bookings') {
      try {
        const all = JSON.parse(value);
        if (all.length === 0) return;
        const latest = all[all.length - 1];
        if (!latest._synced) { latest._synced = true; syncBookingToBackend(latest); }
      } catch(e) {}
    }
  };
})();

// ============ GLOBAL FUNCTIONS FOR BUTTONS (all your pages expect these) ============
window.bookService = function(type, id) {
  const user = getCurrentUser();
  if (!user) { showToast('Please login to book', 'warning'); setTimeout(() => window.location.href = '/user/login.html', 1000); return; }
  if (type === 'hospital') window.location.href = `/healthcare/hospital-details.html?id=${id}`;
  else if (type === 'doctor') window.location.href = `/healthcare/doctor-details.html?id=${id}`;
  else window.location.href = `/healthcare/${type}-details.html?id=${id}`;
};

window.bookNow = window.bookService;

window.bookVendor = function(type, id, name, price) {
  const user = getCurrentUser();
  if (!user) { showToast('Please login to book', 'warning'); setTimeout(() => window.location.href = '/user/login.html', 1000); return; }
  sessionStorage.setItem('booking_temp', JSON.stringify({ type: 'wedding', serviceType: type, vendorId: id, vendorName: name, price: price }));
  window.location.href = `/wedding/booking.html?type=${type}&id=${id}&name=${encodeURIComponent(name)}&price=${price}`;
};

window.bookCompletePackage = function() {
  const user = getCurrentUser();
  if (!user) { showToast('Please login to book', 'warning'); setTimeout(() => window.location.href = '/user/login.html', 1000); return; }
  sessionStorage.setItem('booking_temp', JSON.stringify({ type: 'wedding', serviceType: 'complete-package', packageName: 'Complete Wedding Package', price: 'Custom Quote' }));
  window.location.href = `/wedding/booking.html?type=complete-package&name=Complete%20Wedding%20Package&price=Custom%20Quote`;
};

window.bookRoom = function(hotelId, roomName, price) {
  const user = getCurrentUser();
  if (!user) { showToast('Please login to book', 'warning'); setTimeout(() => window.location.href = '/user/login.html', 1000); return; }
  sessionStorage.setItem('booking_temp', JSON.stringify({ type: 'hotel', serviceType: 'hotel', id: hotelId, roomName: roomName, price: price }));
  window.location.href = `/hotel/booking.html?type=hotel&id=${hotelId}&room=${encodeURIComponent(roomName)}&price=${price}`;
};

window.bookPackage = function(hallId, packageName, price) {
  const user = getCurrentUser();
  if (!user) { showToast('Please login to book', 'warning'); setTimeout(() => window.location.href = '/user/login.html', 1000); return; }
  sessionStorage.setItem('booking_temp', JSON.stringify({ type: 'banquet', serviceType: 'banquet', id: hallId, packageName: packageName, price: price }));
  window.location.href = `/hotel/booking.html?type=banquet&id=${hallId}&package=${encodeURIComponent(packageName)}&price=${price}`;
};

window.bookVehicle = function(id, type, name, price, priceValue) {
  const user = getCurrentUser();
  if (!user) { showToast('Please login to book', 'warning'); setTimeout(() => window.location.href = '/user/login.html', 1000); return; }
  sessionStorage.setItem('booking_temp', JSON.stringify({ type: 'transport', vehicleType: type, vehicleId: id, vehicleName: name, price: price, priceValue: priceValue }));
  window.location.href = `/transport/booking.html?type=${type}&id=${id}&name=${encodeURIComponent(name)}&price=${price}`;
};

window.bookDriver = function(id, name) {
  const user = getCurrentUser();
  if (!user) { showToast('Please login to book', 'warning'); setTimeout(() => window.location.href = '/user/login.html', 1000); return; }
  sessionStorage.setItem('booking_temp', JSON.stringify({ type: 'transport', serviceType: 'driver', driverId: id, driverName: name }));
  window.location.href = `/transport/booking.html?type=driver&id=${id}&name=${encodeURIComponent(name)}`;
};

window.orderNow = function(type, id, name, price) {
  const user = getCurrentUser();
  if (!user) { showToast('Please login to place order', 'warning'); setTimeout(() => window.location.href = '/user/login.html', 1000); return; }
  sessionStorage.setItem('booking_temp', JSON.stringify({ type: 'delivery', serviceType: type, id: id, name: name, price: price }));
  window.location.href = `/delivery/booking.html?type=${type}&id=${id}&name=${encodeURIComponent(name)}&price=${price}`;
};

window.enquireSchool = function(id, name, fee) {
  const user = getCurrentUser();
  if (!user) { showToast('Please login to enquire', 'warning'); setTimeout(() => window.location.href = '/user/login.html', 1000); return; }
  sessionStorage.setItem('booking_temp', JSON.stringify({ type: 'school', serviceType: 'school', id: id, name: name, fee: fee }));
  window.location.href = `/school/booking.html?type=school&id=${id}&name=${encodeURIComponent(name)}&fee=${fee}`;
};

window.enquireTutor = function(id, name, fee) {
  const user = getCurrentUser();
  if (!user) { showToast('Please login to enquire', 'warning'); setTimeout(() => window.location.href = '/user/login.html', 1000); return; }
  sessionStorage.setItem('booking_temp', JSON.stringify({ type: 'school', serviceType: 'tutor', id: id, name: name, fee: fee }));
  window.location.href = `/school/booking.html?type=tutor&id=${id}&name=${encodeURIComponent(name)}&fee=${fee}`;
};

window.bookLabTest = function(testName) {
  const user = getCurrentUser();
  if (!user) { showToast('Please login to book lab test', 'warning'); setTimeout(() => window.location.href = '/user/login.html', 1000); return; }
  const booking = createBooking('Local Service', testName, { testName, patientName: user.name || '', patientPhone: user.phone });
  if (booking) setTimeout(() => window.location.href = `/user/confirmation.html?id=${booking.id}`, 1500);
};

window.submitBooking = function(e, bookingInfo) {
  if (e && e.preventDefault) e.preventDefault();
  const user = getCurrentUser();
  if (!user) { showToast('Please login to book', 'warning'); setTimeout(() => window.location.href = '/user/login.html', 1000); return false; }
  const name = document.getElementById('fullName')?.value.trim() || '';
  const phone = document.getElementById('phone')?.value.trim() || '';
  if (!name || !phone) { showToast('Please fill your name and phone number', 'error'); return false; }
  const formData = {};
  const form = document.getElementById('bookingForm') || document.getElementById('orderForm');
  if (form) new FormData(form).forEach((val, key) => { formData[key] = val; });
  const serviceType = bookingInfo?.type || bookingInfo?.serviceType || 'Service';
  const serviceName = bookingInfo?.name || bookingInfo?.vehicleName || 'Booking';
  const booking = createBooking(serviceType, serviceName, { ...formData, customerName: name, customerPhone: phone });
  if (booking) { sessionStorage.removeItem('booking_temp'); setTimeout(() => window.location.href = `/user/confirmation.html?id=${booking.id}`, 1500); }
  return false;
};

window.changeQuantity = function(delta) {
  if (typeof window.quantity === 'undefined') window.quantity = 1;
  window.quantity = Math.max(1, window.quantity + delta);
  const qtySpan = document.getElementById('quantityDisplay');
  if (qtySpan) qtySpan.textContent = window.quantity;
  if (window.pricePerUnit && window.pricePerUnit > 0) {
    const totalSpan = document.getElementById('totalAmount');
    if (totalSpan) totalSpan.textContent = `₹${window.pricePerUnit * window.quantity}`;
  }
};

// ============ MODAL & UI ============
function openModal(id) { const m = document.getElementById(id); if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; } }
function closeModal(id) { const m = document.getElementById(id); if (m) { m.classList.remove('active'); document.body.style.overflow = ''; } }
document.addEventListener('click', (e) => { if (e.target.classList && e.target.classList.contains('modal-overlay')) closeModal(e.target.id); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id)); });

window.addEventListener('scroll', () => { const h = document.querySelector('.navbar'); if (h) h.classList.toggle('scrolled', window.scrollY > 50); });

function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => { btn.classList.toggle('visible', window.scrollY > 300); });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
}
function closeMobileMenu() { const menu = document.getElementById('mobileMenu'); if (menu) menu.classList.remove('open'); }

// ============ ADMIN AUTH ============
function checkAdminAuth() {
  if (localStorage.getItem('weconnect_admin_logged_in') !== 'true' && window.location.pathname.includes('/admin/')) {
    window.location.href = '/admin/login.html';
  }
}

// ============ PAGE INITIALIZERS ============
function initLoginPage() {
  const loginForm = document.getElementById('passwordLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const identifier = document.getElementById('loginIdentifier').value;
      const password = document.getElementById('loginPassword').value;
      const result = loginUser(identifier, password);
      if (result.success) {
        showToast(result.message, 'success');
        setTimeout(() => {
          const redirect = sessionStorage.getItem('weconnect_redirect_after_login') || '/user/dashboard.html';
          sessionStorage.removeItem('weconnect_redirect_after_login');
          window.location.href = redirect;
        }, 1000);
      } else showToast(result.message, 'error');
    });
  }
  const otpLoginForm = document.getElementById('otpLoginForm');
  if (otpLoginForm) {
    otpLoginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const phone = document.getElementById('otpPhone').value;
      const otp = document.getElementById('otpCode').value;
      if (otp === '123456') {
        let users = getUsers();
        let user = users.find(u => u.phone === phone);
        if (!user) {
          user = { id: 'U-' + Date.now(), name: '', phone: phone, email: '', password: '', createdAt: new Date().toISOString() };
          users.push(user);
          saveUsers(users);
        }
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, name: user.name || phone, phone: user.phone, email: user.email, loginTime: new Date().toISOString() }));
        showToast('OTP verified! Login successful', 'success');
        setTimeout(() => window.location.href = '/user/dashboard.html', 1000);
      } else showToast('Invalid OTP', 'error');
    });
  }
}

function initRegisterPage() {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('fullName').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      if (password !== confirmPassword) { showToast('Passwords do not match', 'error'); return; }
      const result = registerUser(name, phone, email, password);
      if (result.success) { showToast('Registration successful! Please login.', 'success'); setTimeout(() => window.location.href = '/user/login.html', 1500); }
      else showToast(result.message, 'error');
    });
  }
}

function initDashboardPage() {
  const user = getCurrentUser();
  if (!user) { window.location.href = '/user/login.html'; return; }
  const welcomeName = document.getElementById('welcomeName');
  if (welcomeName) welcomeName.textContent = `Welcome back, ${user.name || user.phone}!`;
  const bookings = getBookings().filter(b => b.userId === user.id);
  document.getElementById('totalOrders').textContent = bookings.length;
  document.getElementById('pendingOrders').textContent = bookings.filter(b => b.status === 'pending').length;
  document.getElementById('confirmedOrders').textContent = bookings.filter(b => b.status === 'confirmed').length;
  document.getElementById('completedOrders').textContent = bookings.filter(b => b.status === 'completed').length;
  updateAuthUI();
}

function initMyOrdersPage() {
  const user = getCurrentUser();
  if (!user) { window.location.href = '/user/login.html'; return; }
  const bookings = getBookings().filter(b => b.userId === user.id).reverse();
  const container = document.getElementById('ordersContainer');
  if (!container) return;
  if (bookings.length === 0) { container.innerHTML = '<div class="empty-state">No orders yet</div>'; return; }
  container.innerHTML = bookings.map(b => `
    <div class="order-card">
      <div class="order-header"><span>${b.id}</span><span class="badge badge-${b.status}">${b.status}</span></div>
      <div class="order-body"><strong>${b.serviceName || b.serviceType}</strong><br>${formatDate(b.createdAt)}</div>
      <div class="order-footer"><button onclick="viewOrder('${b.id}')" class="btn btn-sm">View Details</button></div>
    </div>
  `).join('');
  updateAuthUI();
}

function viewOrder(id) { window.location.href = `/user/order-details.html?id=${id}`; }

function initOrderDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) { window.location.href = '/user/my-orders.html'; return; }
  const bookings = getBookings();
  const order = bookings.find(b => b.id === id);
  if (!order) { document.getElementById('orderContent').innerHTML = '<div class="empty-state">Order not found</div>'; return; }
  const html = `<div class="order-card"><div class="order-header">Order ID: ${order.id}<span class="badge badge-${order.status}">${order.status}</span></div><div class="order-body"><p><strong>Service:</strong> ${order.serviceName || order.serviceType}</p><p><strong>Status:</strong> ${getStatusMessage(order.status)}</p><p><strong>Booked on:</strong> ${formatDate(order.createdAt)}</p></div></div>`;
  const container = document.getElementById('orderContent');
  if (container) container.innerHTML = html;
  updateAuthUI();
}

function initAdminDashboard() {
  const bookings = getBookings().reverse();
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;
  if (bookings.length === 0) { tbody.innerHTML = '<tr><td colspan="7">No bookings yet</tr>'; return; }
  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.userName || '—'}</td>
      <td>${b.userPhone || '—'}</td>
      <td>${b.serviceType}</td>
      <td>${formatDate(b.createdAt)}</td>
      <td><span class="badge badge-${b.status}">${b.status}</span></td>
      <td><button class="btn btn-sm" onclick="updateOrderStatus('${b.id}','confirmed')">Confirm</button><button class="btn btn-sm" onclick="updateOrderStatus('${b.id}','rejected')">Reject</button></td>
    </tr>
  `).join('');
}

function updateOrderStatus(id, status) {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) { bookings[index].status = status; saveBookings(bookings); showToast(`Order ${status}`, 'success'); location.reload(); }
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
  initScrollTop();
  initMobileMenu();
  updateAuthUI();
  checkAdminAuth();
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(input => { if (!input.value) input.min = today; });
  const path = window.location.pathname;
  if (path.includes('/user/login.html')) initLoginPage();
  else if (path.includes('/user/register.html')) initRegisterPage();
  else if (path.includes('/user/dashboard.html')) initDashboardPage();
  else if (path.includes('/user/my-orders.html')) initMyOrdersPage();
  else if (path.includes('/user/order-details.html')) initOrderDetailsPage();
  else if (path.includes('/admin/dashboard.html')) initAdminDashboard();
});

// ========== DARK / LIGHT MODE (site-wide) ==========
function initTheme() {
  const savedTheme = localStorage.getItem('weconnect_theme');
  // If no saved preference, default to dark mode
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
  } else {
    document.body.classList.add('dark-mode');
  }
  // Update the toggle button text if it exists
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ Light' : '🌙 Dark';
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
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ Light' : '🌙 Dark';
  }
}

// Initialize theme on page load
initTheme();

// Make toggle function globally available
window.toggleTheme = toggleTheme;

// Expose critical functions globally
window.showToast = showToast;
window.getCurrentUser = getCurrentUser;
window.logoutUser = logoutUser;
window.updateOrderStatus = updateOrderStatus;
window.viewOrder = viewOrder;
window.createBooking = createBooking;
window.WeConnect = window.WeConnect;
window.WeConnectAuth = window.WeConnectAuth;