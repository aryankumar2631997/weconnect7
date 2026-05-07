require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Serve frontend files from the current directory (where index.html is)
// If your index.html is one level up, change to '../' – but Railway expects './'
app.use(express.static('./'));

// Google Auth
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP;

// Sheet names for each category
const SHEET_NAMES = {
  doctor: 'Doctor_Bookings',
  hotel: 'Hotel_Bookings',
  cinema: 'Cinema_Bookings',
  transport: 'Transport_Bookings',
  wedding: 'Wedding_Bookings',
  local: 'Local_Bookings',
  school: 'School_Bookings',
  delivery: 'Delivery_Bookings'
};

// Headers for each sheet
const SHEET_HEADERS = {
  Doctor_Bookings: ['ID', 'Timestamp', 'Customer Name', 'Phone', 'Doctor Name', 'Date', 'Time', 'Issue'],
  Hotel_Bookings: ['ID', 'Timestamp', 'Customer Name', 'Phone', 'Hotel Name', 'Room Type', 'Check-in', 'Check-out', 'Guests'],
  Cinema_Bookings: ['ID', 'Timestamp', 'Customer Name', 'Phone', 'Cinema', 'Movie', 'Showtime', 'Seats', 'Amount'],
  Transport_Bookings: ['ID', 'Timestamp', 'Customer Name', 'Phone', 'Vehicle', 'Pickup', 'Drop', 'Date', 'Time'],
  Wedding_Bookings: ['ID', 'Timestamp', 'Customer Name', 'Phone', 'Service Type', 'Event Date', 'Guests', 'Budget', 'Requirements'],
  Local_Bookings: ['ID', 'Timestamp', 'Customer Name', 'Phone', 'Service Type', 'Address', 'Date', 'Time', 'Description'],
  School_Bookings: ['ID', 'Timestamp', 'Parent Name', 'Phone', 'Student Name', 'Class', 'Subject', 'Timings', 'Address'],
  Delivery_Bookings: ['ID', 'Timestamp', 'Customer Name', 'Phone', 'Store Name', 'Items', 'Delivery Address', 'Total Amount']
};

// Initialize sheets
async function initSheets() {
  try {
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const existingSheets = spreadsheet.data.sheets.map(s => s.properties.title);
    
    for (const [sheetName, headers] of Object.entries(SHEET_HEADERS)) {
      if (!existingSheets.includes(sheetName)) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SHEET_ID,
          requestBody: { requests: [{ addSheet: { properties: { title: sheetName } } }] }
        });
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `${sheetName}!A1`,
          valueInputOption: 'RAW',
          requestBody: { values: [headers] }
        });
        console.log(`✅ Created sheet: ${sheetName}`);
      }
    }
    console.log('✅ Google Sheets ready!');
  } catch (error) {
    console.log('⚠️ Sheets ready (may already exist)');
  }
}

// Save booking endpoint
app.post('/api/save-booking', async (req, res) => {
  try {
    const { category, formData, customerName, customerPhone } = req.body;
    const id = uuidv4();
    const timestamp = new Date().toISOString();
    
    let sheetName = SHEET_NAMES[category] || 'Doctor_Bookings';
    let row = [id, timestamp, customerName, customerPhone];
    
    if (category === 'doctor') {
      row.push(formData.doctor || '', formData.date || '', formData.time || '', formData.issue || '');
    } else if (category === 'hotel') {
      row.push(formData.hotel || '', formData.roomType || '', formData.checkin || '', formData.checkout || '', formData.guests || '');
    } else if (category === 'cinema') {
      row.push(formData.cinema || '', formData.movie || '', formData.showtime || '', formData.seats || '', formData.amount || '');
    } else if (category === 'transport') {
      row.push(formData.vehicle || '', formData.pickup || '', formData.drop || '', formData.date || '', formData.time || '');
    } else if (category === 'wedding') {
      row.push(formData.serviceType || '', formData.eventDate || '', formData.guests || '', formData.budget || '', formData.requirements || '');
    } else if (category === 'local') {
      row.push(formData.serviceType || '', formData.address || '', formData.date || '', formData.time || '', formData.description || '');
    } else {
      row.push(JSON.stringify(formData));
    }
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });
    
    console.log(`✅ Booking saved: ${id} - ${category}`);
    
    res.json({ success: true, message: 'Booking saved to Google Sheet!', id: id });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get bookings for a specific category
app.get('/api/get-bookings/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const sheetName = SHEET_NAMES[category] || 'Doctor_Bookings';
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${sheetName}!A:Z`,
    });
    
    const rows = response.data.values || [];
    const headers = rows[0] || [];
    const data = rows.slice(1).map(row => {
      let obj = {};
      headers.forEach((h, i) => { obj[h] = row[i] || ''; });
      return obj;
    });
    
    res.json(data);
  } catch (error) {
    res.json([]);
  }
});

// *** NEW ENDPOINT: Get all bookings from all sheets ***
app.get('/api/get-all-bookings', async (req, res) => {
  try {
    const allBookings = [];
    for (const [category, sheetName] of Object.entries(SHEET_NAMES)) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${sheetName}!A:Z`,
      });
      const rows = response.data.values || [];
      if (rows.length > 1) {
        const headers = rows[0];
        const dataRows = rows.slice(1);
        dataRows.forEach(row => {
          const obj = {};
          headers.forEach((h, i) => { obj[h] = row[i] || ''; });
          obj.category = category;
          obj.sheet = sheetName;
          allBookings.push(obj);
        });
      }
    }
    // Sort by timestamp descending (most recent first)
    allBookings.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
    res.json(allBookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║                                                          ║
  ║     🚀  WeConnect Backend with Google Sheets            ║
  ║                                                          ║
  ╠══════════════════════════════════════════════════════════╣
  ║                                                          ║
  ║  📱 Frontend: http://localhost:${PORT}/index.html         ║
  ║  🔧 Admin:    http://localhost:${PORT}/admin/login.html   ║
  ║                                                          ║
  ╠══════════════════════════════════════════════════════════╣
  ║  ✅ Google Sheet Connected                               ║
  ║  ✅ WhatsApp: ${ADMIN_WHATSAPP}                           ║
  ║                                                          ║
  ╚══════════════════════════════════════════════════════════╝
  `);
  initSheets();
});