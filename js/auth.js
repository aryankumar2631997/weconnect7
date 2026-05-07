// ========================================
// WECONNECT - AUTH.JS
// User Authentication, Registration, Session Management
// For ALL 50 Pages
// Version: 2.0
// ========================================

// ============ AUTH NAMESPACE ============
const WeConnectAuth = {
  // Storage Keys
  STORAGE_KEYS: {
    USERS: 'weconnect_users',
    SESSION: 'weconnect_current_user',
    REDIRECT: 'weconnect_redirect_after_login',
    OTP: 'weconnect_otp_'
  },

  // ============ USER MANAGEMENT ============
  
  // Get all registered users
  getUsers: function() {
    const users = localStorage.getItem(this.STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  // Save users to storage
  saveUsers: function(users) {
    localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  // Get current logged in user
  getCurrentUser: function() {
    const session = sessionStorage.getItem(this.STORAGE_KEYS.SESSION);
    if (!session) return null;
    try {
      return JSON.parse(session);
    } catch (e) {
      return null;
    }
  },

  // Check if user is logged in
  isLoggedIn: function() {
    return this.getCurrentUser() !== null;
  },

  // Register new user
  register: function(userData) {
    const { name, phone, email, password, confirmPassword } = userData;
    
    // Validation
    if (!name || !phone || !email || !password) {
      return { success: false, message: 'Please fill all required fields' };
    }
    
    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }
    
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }
    
    if (!/^[0-9]{10}$/.test(phone)) {
      return { success: false, message: 'Please enter a valid 10-digit phone number' };
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }
    
    let users = this.getUsers();
    
    // Check if phone already exists
    if (users.find(u => u.phone === phone)) {
      return { success: false, message: 'Phone number already registered' };
    }
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }
    
    // Create new user
    const newUser = {
      id: 'U-' + Date.now(),
      name: name,
      phone: phone,
      email: email,
      password: password, // In production, hash this!
      createdAt: new Date().toISOString(),
      lastLogin: null,
      avatar: null,
      address: '',
      city: 'Lakhisarai',
      pincode: ''
    };
    
    users.push(newUser);
    this.saveUsers(users);
    
    return { success: true, message: 'Registration successful! Please login.', user: newUser };
  },

  // Login user with password
  login: function(phoneOrEmail, password) {
    const users = this.getUsers();
    const user = users.find(u => 
      (u.phone === phoneOrEmail || u.email === phoneOrEmail) && 
      u.password === password
    );
    
    if (!user) {
      return { success: false, message: 'Invalid credentials. Please try again.' };
    }
    
    // Create session
    const session = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      loginTime: new Date().toISOString()
    };
    
    sessionStorage.setItem(this.STORAGE_KEYS.SESSION, JSON.stringify(session));
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    this.saveUsers(users);
    
    return { success: true, message: 'Login successful!', user: session };
  },

  // ============ OTP LOGIN (Demo Mode) ============
  // For demo purposes, OTP will be shown in alert
  // In production, integrate with SMS/WhatsApp API
  
  generateOTP: function() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },
  
  sendOTP: function(phone) {
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return { success: false, message: 'Please enter a valid 10-digit phone number' };
    }
    
    const otp = this.generateOTP();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
    
    // Store OTP
    localStorage.setItem(this.STORAGE_KEYS.OTP + phone, JSON.stringify({
      otp: otp,
      expiry: expiry
    }));
    
    // In production: Send via SMS/WhatsApp API
    // For demo: Show in alert and console
    console.log(`OTP for ${phone}: ${otp}`);
    WeConnect.showToast(`Demo OTP: ${otp}`, 'info', 10000);
    
    return { success: true, message: 'OTP sent successfully!', otp: otp };
  },
  
  verifyOTP: function(phone, enteredOTP) {
    const storedData = localStorage.getItem(this.STORAGE_KEYS.OTP + phone);
    
    if (!storedData) {
      return { success: false, message: 'OTP expired. Please request again.' };
    }
    
    const { otp, expiry } = JSON.parse(storedData);
    
    if (Date.now() > expiry) {
      localStorage.removeItem(this.STORAGE_KEYS.OTP + phone);
      return { success: false, message: 'OTP expired. Please request again.' };
    }
    
    if (otp !== enteredOTP) {
      return { success: false, message: 'Invalid OTP. Please try again.' };
    }
    
    // OTP verified - login or register
    localStorage.removeItem(this.STORAGE_KEYS.OTP + phone);
    
    let users = this.getUsers();
    let user = users.find(u => u.phone === phone);
    
    if (!user) {
      // Auto-register new user
      const newUser = {
        id: 'U-' + Date.now(),
        name: '',
        phone: phone,
        email: '',
        password: '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      users.push(newUser);
      this.saveUsers(users);
      user = newUser;
    }
    
    // Create session
    const session = {
      id: user.id,
      name: user.name || user.phone,
      phone: user.phone,
      email: user.email || '',
      loginTime: new Date().toISOString()
    };
    
    sessionStorage.setItem(this.STORAGE_KEYS.SESSION, JSON.stringify(session));
    
    return { success: true, message: 'Login successful!', user: session };
  },

  // ============ SESSION MANAGEMENT ============
  
  // Logout user
  logout: function() {
    sessionStorage.removeItem(this.STORAGE_KEYS.SESSION);
    WeConnect.showToast('Logged out successfully', 'success');
    
    // Redirect to home if on protected page
    const protectedPaths = ['/user/', '/admin/'];
    const currentPath = window.location.pathname;
    if (protectedPaths.some(path => currentPath.includes(path))) {
      window.location.href = '/index.html';
    }
  },

  // Update user profile
  updateProfile: function(userId, updates) {
    let users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }
    
    // Update user data
    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);
    
    // Update session if current user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const session = {
        ...currentUser,
        name: users[userIndex].name,
        phone: users[userIndex].phone,
        email: users[userIndex].email
      };
      sessionStorage.setItem(this.STORAGE_KEYS.SESSION, JSON.stringify(session));
    }
    
    return { success: true, message: 'Profile updated successfully!' };
  },

  // Change password
  changePassword: function(userId, oldPassword, newPassword) {
    let users = this.getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    if (user.password && user.password !== oldPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }
    
    if (newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters' };
    }
    
    user.password = newPassword;
    this.saveUsers(users);
    
    return { success: true, message: 'Password changed successfully!' };
  },

  // Get user by ID
  getUserById: function(userId) {
    const users = this.getUsers();
    return users.find(u => u.id === userId);
  },

  // ============ PROTECTED ROUTES ============
  
  // Require authentication for page
  requireAuth: function() {
    if (!this.isLoggedIn()) {
      const redirectUrl = window.location.pathname;
      sessionStorage.setItem(this.STORAGE_KEYS.REDIRECT, redirectUrl);
      WeConnect.showToast('Please login to continue', 'warning');
      window.location.href = '/user/login.html';
      return false;
    }
    return true;
  },

  // Require guest (not logged in)
  requireGuest: function() {
    if (this.isLoggedIn()) {
      window.location.href = '/user/dashboard.html';
      return false;
    }
    return true;
  },

  // Get redirect URL after login
  getRedirectUrl: function() {
    const redirect = sessionStorage.getItem(this.STORAGE_KEYS.REDIRECT);
    sessionStorage.removeItem(this.STORAGE_KEYS.REDIRECT);
    return redirect || '/user/dashboard.html';
  },

  // ============ UI UPDATE ============
  
  // Update UI based on auth state
  updateUI: function() {
    const isLoggedIn = this.isLoggedIn();
    const currentUser = this.getCurrentUser();
    
    // Update login/logout buttons
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const myOrdersBtn = document.getElementById('my-orders-btn');
    const userNameSpan = document.getElementById('user-name');
    
    if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = isLoggedIn ? 'inline-flex' : 'none';
    if (myOrdersBtn) myOrdersBtn.style.display = isLoggedIn ? 'inline-flex' : 'none';
    
    if (userNameSpan && currentUser) {
      userNameSpan.textContent = currentUser.name || currentUser.phone;
    }
    
    // Update mobile menu buttons
    const mobileLogin = document.getElementById('mobile-login');
    const mobileLogout = document.getElementById('mobile-logout');
    const mobileMyOrders = document.getElementById('mobile-my-orders');
    
    if (mobileLogin) mobileLogin.style.display = isLoggedIn ? 'none' : 'block';
    if (mobileLogout) mobileLogout.style.display = isLoggedIn ? 'block' : 'none';
    if (mobileMyOrders) mobileMyOrders.style.display = isLoggedIn ? 'block' : 'none';
  },

  // ============ INITIALIZE ============
  init: function() {
    this.updateUI();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
        this.updateUI();
      });
    }
    
    // Setup mobile logout
    const mobileLogout = document.getElementById('mobile-logout');
    if (mobileLogout) {
      mobileLogout.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
        this.updateUI();
      });
    }
  }
};

// ============ GLOBAL FUNCTIONS ==========
window.WeConnectAuth = WeConnectAuth;

// Auth helper functions for HTML
window.isLoggedIn = () => WeConnectAuth.isLoggedIn();
window.getCurrentUser = () => WeConnectAuth.getCurrentUser();
window.requireAuth = () => WeConnectAuth.requireAuth();
window.logout = () => WeConnectAuth.logout();
window.sendOTP = (phone) => WeConnectAuth.sendOTP(phone);
window.verifyOTP = (phone, otp) => WeConnectAuth.verifyOTP(phone, otp);
window.loginUser = (phoneOrEmail, password) => WeConnectAuth.login(phoneOrEmail, password);
window.registerUser = (data) => WeConnectAuth.register(data);

// ============ INITIALIZE ============
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => WeConnectAuth.init());
} else {
  WeConnectAuth.init();
}