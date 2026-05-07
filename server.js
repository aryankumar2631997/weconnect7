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
  Doctor_Bookings: ['ID', 'Timestamp', 'Customer Name', 'Phone', 'Doctor Name', 'Date', 'Time', 'Issue', 'Status'],
  Hotel_Bookings: ['ID', 'Timestamp', 'Customer Name', 'Phone', 'Hotel Name', 'Room Type', 'Check-in', 'Check-out', 'Guests', 'Status'],
  Cinema_Bookings: ['ID', 'Timestamp', 'Customer Name', 'Phone', 'Cinema', 'Movie', 'Showtime', 'Seats', 'Amount', 'Status'],
  Transport_Bookings: ['ID', 'Timestamp', 'Customer Name', 'Phone', 'Vehicle', 'Pickup', 'Drop', 'Date', 'Time', 'Status'],
  Wedding_Bookings: ['ID', 'Timestamp', 'Customer Name', 'Phone', 'Service Type', 'Event Date', 'Guests', 'Budget', 'Requirements', 'Status'],
  Local_Bookings: ['ID', 'Timestamp', 'Customer Name', 'Phone', 'Service Type', 'Address', 'Date', 'Time', 'Description', 'Status'],
  School_Bookings: ['ID', 'Timestamp', 'Parent Name', 'Phone', 'Student Name', 'Class', 'Subject', 'Timings', 'Address', 'Status'],
  Delivery_Bookings: ['ID', 'Timestamp', 'Customer Name', 'Phone', 'Store Name', 'Items', 'Delivery Address', 'Total Amount', 'Status']
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

    // Append initial status as 'pending'
    row.push('pending');
    
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

// *** NEW ENDPOINT: Update booking status by ID across all sheets ***
app.post('/api/update-booking-status', async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ success: false, message: 'Missing required fields: id and status' });
    }

    const validStatuses = ['pending', 'confirmed', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    for (const [category, sheetName] of Object.entries(SHEET_NAMES)) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${sheetName}!A:Z`,
      });

      const rows = response.data.values || [];
      if (rows.length < 2) continue;

      const headers = rows[0];
      let statusColIndex = headers.indexOf('Status');

      // If the sheet doesn't have a Status column yet, add it to the header row
      if (statusColIndex === -1) {
        statusColIndex = headers.length;
        const headerRange = `${sheetName}!${columnLetter(statusColIndex + 1)}1`;
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: headerRange,
          valueInputOption: 'RAW',
          requestBody: { values: [['Status']] },
        });
      }

      // Find the row whose ID (column A) matches the requested id
      const idColIndex = headers.indexOf('ID');
      const rowIndex = rows.findIndex((row, i) => i > 0 && row[idColIndex === -1 ? 0 : idColIndex] === id);

      if (rowIndex === -1) continue;

      // rowIndex is 0-based in the array; row 1 is the header, so sheet row = rowIndex + 1
      const sheetRowNumber = rowIndex + 1;
      const statusCellRange = `${sheetName}!${columnLetter(statusColIndex + 1)}${sheetRowNumber}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: statusCellRange,
        valueInputOption: 'RAW',
        requestBody: { values: [[status]] },
      });

      console.log(`✅ Status updated: booking ${id} → ${status} (${sheetName}, row ${sheetRowNumber})`);
      return res.json({ success: true, message: `Booking status updated to '${status}'`, id, status });
    }

    // Booking ID not found in any sheet
    return res.status(404).json({ success: false, message: `Booking with ID '${id}' not found` });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper: convert a 1-based column number to a spreadsheet letter (e.g. 1 → A, 27 → AA)
function columnLetter(n) {
  let letter = '';
  while (n > 0) {
    const remainder = (n - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    n = Math.floor((n - 1) / 26);
  }
  return letter;
}

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