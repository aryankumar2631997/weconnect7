// ========================================
// WECONNECT - BOOKING.JS
// Booking Management, Order Creation, Status Updates
// For ALL 50 Pages
// Version: 2.0
// ========================================

// ============ BOOKING NAMESPACE ============
const WeConnectBooking = {
  // Storage Keys
  STORAGE_KEYS: {
    BOOKINGS: 'weconnect_bookings',
    ADMIN_SESSION: 'weconnect_admin_session'
  },

  // Order Status Constants
  STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    REJECTED: 'rejected'
  },

  // Status Messages for Users
  STATUS_MESSAGES: {
    pending: '⏳ Your order is placed. Waiting for merchant to confirm...',
    confirmed: '✅ Your order has been confirmed by the merchant!',
    completed: '🎉 Order Completed! Thank you for using WeConnect.',
    rejected: '❌ Order could not be confirmed. Please try another option.'
  },

  // ============ BOOKING CRUD OPERATIONS ============

  // Get all bookings
  getBookings: function() {
    const bookings = localStorage.getItem(this.STORAGE_KEYS.BOOKINGS);
    return bookings ? JSON.parse(bookings) : [];
  },

  // Save all bookings
  saveBookings: function(bookings) {
    localStorage.setItem(this.STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  // Get bookings for current user
  getUserBookings: function() {
    const currentUser = WeConnectAuth.getCurrentUser();
    if (!currentUser) return [];
    
    const bookings = this.getBookings();
    return bookings.filter(booking => booking.userId === currentUser.id).reverse();
  },

  // Get booking by ID
  getBookingById: function(bookingId) {
    const bookings = this.getBookings();
    return bookings.find(booking => booking.id === bookingId);
  },

  // Create new booking
  createBooking: function(serviceType, serviceName, formData) {
    const currentUser = WeConnectAuth.getCurrentUser();
    
    if (!currentUser) {
      WeConnect.showToast('Please login to book', 'warning');
      return { success: false, message: 'Please login to book' };
    }
    
    const bookingId = WeConnect.generateId('LC');
    const booking = {
      id: bookingId,
      userId: currentUser.id,
      userPhone: currentUser.phone,
      userName: currentUser.name || currentUser.phone,
      serviceType: serviceType,
      serviceName: serviceName,
      formData: { ...formData },
      status: this.STATUS.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: this.STATUS.PENDING,
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer'
        }
      ]
    };
    
    const bookings = this.getBookings();
    bookings.push(booking);
    this.saveBookings(bookings);
    
    // Send WhatsApp notification to admin
    this.sendAdminNotification(booking);
    
    WeConnect.showToast(`✅ Booking Confirmed! ID: ${bookingId}`, 'success');
    
    return { success: true, bookingId: bookingId, booking: booking };
  },

  // Update booking status
  updateBookingStatus: function(bookingId, newStatus, note = '') {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    
    if (index === -1) {
      return { success: false, message: 'Booking not found' };
    }
    
    const oldStatus = bookings[index].status;
    bookings[index].status = newStatus;
    bookings[index].updatedAt = new Date().toISOString();
    bookings[index].statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note
    });
    
    this.saveBookings(bookings);
    
    // Send status update notification to user
    this.sendStatusNotification(bookings[index], oldStatus, newStatus);
    
    return { success: true, message: `Booking ${newStatus} successfully` };
  },

  // ============ NOTIFICATIONS ============

  // Send WhatsApp notification to admin (YOU)
  sendAdminNotification: function(booking) {
    // Admin WhatsApp number
    const adminNumber = '918102284634';
    
    // Format message for admin
    const message = this.formatAdminMessage(booking);
    
    // Open WhatsApp with pre-filled message
    // Admin will receive this and manually update status in dashboard
    const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
    
    // Open in new tab (optional - can be silent in production)
    // window.open(whatsappUrl, '_blank');
    
    // For now, log to console
    console.log('Admin WhatsApp Notification:', message);
    
    return { success: true };
  },

  // Send status update notification to user
  sendStatusNotification: function(booking, oldStatus, newStatus) {
    const userPhone = booking.userPhone;
    if (!userPhone) return;
    
    const message = this.formatUserStatusMessage(booking, newStatus);
    const whatsappUrl = `https://wa.me/${userPhone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    // window.open(whatsappUrl, '_blank');
    
    console.log('User Status Notification:', message);
    
    return { success: true };
  },

  // Format message for admin
  formatAdminMessage: function(booking) {
    const date = new Date(booking.createdAt).toLocaleString('en-IN');
    
    let message = `🏥 *NEW BOOKING - WeConnect*\n\n`;
    message += `📋 *Booking ID:* ${booking.id}\n`;
    message += `👤 *Customer:* ${booking.userName}\n`;
    message += `📞 *Phone:* ${booking.userPhone}\n`;
    message += `🕐 *Time:* ${date}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📌 *Service:* ${booking.serviceName}\n`;
    message += `📁 *Category:* ${booking.serviceType}\n\n`;
    message += `📝 *Details:*\n`;
    
    // Add form fields
    for (const [key, value] of Object.entries(booking.formData)) {
      if (value && value !== '') {
        const label = key.replace(/_/g, ' ').toUpperCase();
        message += `• ${label}: ${value}\n`;
      }
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `✅ *To confirm:* Click Confirm in Admin Dashboard\n`;
    message += `❌ *To reject:* Click Reject in Admin Dashboard\n`;
    message += `🔗 *Admin Panel:* /admin/dashboard.html\n`;
    
    return message;
  },

  // Format status update message for user
  formatUserStatusMessage: function(booking, status) {
    const statusMessages = {
      confirmed: `✅ *Your booking has been CONFIRMED!*\n\n📋 Booking ID: ${booking.id}\n🎉 Thank you for choosing WeConnect!`,
      rejected: `❌ *Booking could not be confirmed*\n\n📋 Booking ID: ${booking.id}\n😞 We apologize. Please try another provider.`,
      completed: `🎉 *Service Completed!*\n\n📋 Booking ID: ${booking.id}\n⭐ Rate your experience on WeConnect!`
    };
    
    return statusMessages[status] || `Status updated: ${status}`;
  },

  // ============ FORM HANDLING ============

  // Submit booking from form
  submitBooking: function(event, serviceType, serviceName) {
    event.preventDefault();
    
    // Check if user is logged in
    if (!WeConnectAuth.isLoggedIn()) {
      WeConnect.showToast('Please login to book', 'warning');
      setTimeout(() => {
        window.location.href = '/user/login.html';
      }, 1500);
      return false;
    }
    
    // Collect form data
    const form = event.target;
    const formData = {};
    const requiredFields = form.querySelectorAll('[required]');
    
    // Validate required fields
    let isValid = true;
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
        WeConnect.showToast(`Please fill ${field.placeholder || field.name || 'all fields'}`, 'error');
      } else {
        field.classList.remove('error');
      }
    });
    
    if (!isValid) return false;
    
    // Collect all form data
    new FormData(form).forEach((value, key) => {
      formData[key] = value;
    });
    
    // Create booking
    const result = this.createBooking(serviceType, serviceName, formData);
    
    if (result.success) {
      // Reset form
      form.reset();
      
      // Close any open modals
      WeConnect.closeAllModals();
      
      // Redirect to confirmation page
      setTimeout(() => {
        window.location.href = `/user/confirmation.html?id=${result.bookingId}`;
      }, 1500);
    }
    
    return false;
  },

  // ============ ORDER DISPLAY ============

  // Render user orders on dashboard
  renderUserOrders: function(containerId = 'orders-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const bookings = this.getUserBookings();
    
    if (bookings.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3 class="empty-title">No orders yet</h3>
          <p class="empty-desc">Book a service to see your orders here</p>
          <a href="/index.html#services" class="btn btn-primary mt-4">Browse Services →</a>
        </div>
      `;
      return;
    }
    
    container.innerHTML = bookings.map(booking => `
      <div class="card order-card" data-order-id="${booking.id}">
        <div class="order-header">
          <div>
            <span class="order-id">#${booking.id}</span>
            <span class="order-date">${WeConnect.formatDate(booking.createdAt, 'DD MMM YYYY')}</span>
          </div>
          <span class="badge badge-${booking.status}">${booking.status.toUpperCase()}</span>
        </div>
        <div class="order-body">
          <div class="order-service">
            <span class="order-icon">${this.getServiceIcon(booking.serviceType)}</span>
            <div>
              <h4 class="order-title">${booking.serviceName}</h4>
              <p class="order-subtitle">${booking.serviceType}</p>
            </div>
          </div>
          <div class="order-status-message">
            <p class="status-message ${WeConnect.getStatusClass(booking.status)}">
              ${this.STATUS_MESSAGES[booking.status]}
            </p>
          </div>
        </div>
        <div class="order-footer">
          <button class="btn btn-outline btn-sm" onclick="WeConnectBooking.viewOrder('${booking.id}')">
            View Details
          </button>
          ${booking.status === 'pending' ? `
            <button class="btn btn-danger btn-sm" onclick="WeConnectBooking.cancelOrder('${booking.id}')">
              Cancel Order
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
  },

  // Render single order details
  renderOrderDetails: function(bookingId, containerId = 'order-details-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const booking = this.getBookingById(bookingId);
    
    if (!booking) {
      container.innerHTML = '<div class="empty-state"><h3>Order not found</h3></div>';
      return;
    }
    
    // Build details HTML
    let detailsHtml = `
      <div class="order-details-card">
        <div class="order-details-header">
          <div>
            <h2>Order Details</h2>
            <p class="text-muted">Booking ID: ${booking.id}</p>
          </div>
          <span class="badge badge-${booking.status}">${booking.status.toUpperCase()}</span>
        </div>
        
        <div class="order-details-info">
          <div class="info-grid">
            <div class="info-item">
              <label>Service</label>
              <p><strong>${booking.serviceName}</strong> (${booking.serviceType})</p>
            </div>
            <div class="info-item">
              <label>Customer</label>
              <p>${booking.userName}</p>
            </div>
            <div class="info-item">
              <label>Phone</label>
              <p>${booking.userPhone}</p>
            </div>
            <div class="info-item">
              <label>Booked On</label>
              <p>${WeConnect.formatDate(booking.createdAt, 'full')}</p>
            </div>
          </div>
          
          <div class="info-section">
            <h4>Booking Details</h4>
            <div class="details-grid">
    `;
    
    // Add form fields
    for (const [key, value] of Object.entries(booking.formData)) {
      if (value && value !== '') {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        detailsHtml += `
          <div class="detail-item">
            <label>${label}</label>
            <p>${value}</p>
          </div>
        `;
      }
    }
    
    detailsHtml += `
            </div>
          </div>
          
          <div class="info-section">
            <h4>Status Timeline</h4>
            <div class="timeline">
              <div class="timeline-steps">
    `;
    
    // Build timeline
    const steps = [
      { status: 'pending', label: 'Order Placed' },
      { status: 'confirmed', label: 'Confirmed by Merchant' },
      { status: 'completed', label: 'Completed' }
    ];
    
    let currentStepIndex = steps.findIndex(s => s.status === booking.status);
    if (currentStepIndex === -1 && booking.status === 'rejected') currentStepIndex = 1;
    
    steps.forEach((step, index) => {
      let stepClass = '';
      if (booking.status === 'rejected') {
        stepClass = index === 0 ? 'done' : (index === 1 ? 'rejected' : '');
      } else {
        stepClass = index < currentStepIndex ? 'done' : (index === currentStepIndex ? 'active' : '');
      }
      
      detailsHtml += `
        <div class="timeline-step ${stepClass}">
          <div class="timeline-dot">${index + 1}</div>
          <div class="timeline-label">${step.label}</div>
        </div>
      `;
    });
    
    detailsHtml += `
              </div>
            </div>
          </div>
        </div>
        
        <div class="order-details-footer">
          <a href="/user/my-orders.html" class="btn btn-outline">← Back to Orders</a>
        </div>
      </div>
    `;
    
    container.innerHTML = detailsHtml;
  },

  // View single order
  viewOrder: function(bookingId) {
    window.location.href = `/user/order-details.html?id=${bookingId}`;
  },

  // Cancel order (only if pending)
  cancelOrder: function(bookingId) {
    if (confirm('Are you sure you want to cancel this order?')) {
      const booking = this.getBookingById(bookingId);
      if (booking && booking.status === this.STATUS.PENDING) {
        this.updateBookingStatus(bookingId, this.STATUS.REJECTED, 'Cancelled by customer');
        WeConnect.showToast('Order cancelled successfully', 'success');
        this.renderUserOrders();
      } else {
        WeConnect.showToast('Order cannot be cancelled', 'error');
      }
    }
  },

  // Get service icon
  getServiceIcon: function(serviceType) {
    const icons = {
      'Healthcare': '🏥',
      'Cinema': '🎬',
      'Hotel': '🏨',
      'Transport': '🚗',
      'Wedding': '💍',
      'Local Services': '🔧',
      'School': '📚',
      'Delivery': '📦'
    };
    return icons[serviceType] || '📋';
  },

  // ============ ADMIN FUNCTIONS ============

  // Get all bookings for admin
  getAllBookings: function() {
    return this.getBookings().reverse();
  },

  // Render admin dashboard
  renderAdminBookings: function(containerId = 'admin-bookings-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const bookings = this.getAllBookings();
    
    if (bookings.length === 0) {
      container.innerHTML = '<div class="empty-state"><h3>No bookings yet</h3></div>';
      return;
    }
    
    container.innerHTML = `
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${bookings.map(booking => `
              <tr>
                <td><code>${booking.id}</code></td>
                <td>${booking.userName}<br><small>${booking.userPhone}</small></td>
                <td>${booking.serviceName}</td>
                <td>${WeConnect.formatDate(booking.createdAt)}</td>
                <td><span class="badge badge-${booking.status}">${booking.status}</span></td>
                <td>
                  <div class="action-btns">
                    ${booking.status === 'pending' ? `
                      <button class="btn btn-success btn-sm" onclick="WeConnectBooking.updateBookingStatus('${booking.id}', 'confirmed')">Confirm</button>
                      <button class="btn btn-danger btn-sm" onclick="WeConnectBooking.updateBookingStatus('${booking.id}', 'rejected')">Reject</button>
                    ` : ''}
                    ${booking.status === 'confirmed' ? `
                      <button class="btn btn-info btn-sm" onclick="WeConnectBooking.updateBookingStatus('${booking.id}', 'completed')">Complete</button>
                    ` : ''}
                    <button class="btn btn-outline btn-sm" onclick="WeConnectBooking.viewOrder('${booking.id}')">View</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ============ INITIALIZE ============
  init: function() {
    // Auto-render orders on my-orders page
    if (window.location.pathname.includes('/user/my-orders.html')) {
      this.renderUserOrders();
    }
    
    // Auto-render order details on order-details page
    if (window.location.pathname.includes('/user/order-details.html')) {
      const urlParams = new URLSearchParams(window.location.search);
      const bookingId = urlParams.get('id');
      if (bookingId) {
        this.renderOrderDetails(bookingId);
      }
    }
    
    // Auto-render admin bookings on admin dashboard
    if (window.location.pathname.includes('/admin/dashboard.html')) {
      this.renderAdminBookings();
    }
    
    // Setup form submissions
    document.querySelectorAll('form.booking-form').forEach(form => {
      const serviceType = form.dataset.serviceType;
      const serviceName = form.dataset.serviceName;
      form.addEventListener('submit', (e) => {
        this.submitBooking(e, serviceType, serviceName);
      });
    });
  }
};

// ============ GLOBAL FUNCTIONS ==========
window.WeConnectBooking = WeConnectBooking;

// Booking helper functions for HTML
window.submitBooking = (event, serviceType, serviceName) => WeConnectBooking.submitBooking(event, serviceType, serviceName);
window.viewOrder = (bookingId) => WeConnectBooking.viewOrder(bookingId);
window.cancelOrder = (bookingId) => WeConnectBooking.cancelOrder(bookingId);
window.updateBookingStatus = (bookingId, status) => WeConnectBooking.updateBookingStatus(bookingId, status);

// ============ INITIALIZE ============
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => WeConnectBooking.init());
} else {
  WeConnectBooking.init();
}