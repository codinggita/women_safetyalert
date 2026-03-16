require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { protect } = require('./middleware/auth');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', protect, require('./routes/contacts'));
app.use('/api/sos', protect, require('./routes/sos'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/safezones', protect, require('./routes/safezones'));

// Seed route (for development only)
app.post('/api/seed', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    const EmergencyContact = require('./models/EmergencyContact');
    const IncidentReport = require('./models/IncidentReport');
    const SafeZone = require('./models/SafeZone');

    // Clear existing data
    await User.deleteMany({});
    await EmergencyContact.deleteMany({});
    await IncidentReport.deleteMany({});
    await SafeZone.deleteMany({});

    // Create default user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = await User.create({
      name: 'Demo User',
      email: 'demo@safealert.com',
      password: hashedPassword,
    });

    // Create emergency contacts
    await EmergencyContact.insertMany([
      {
        userId: user._id,
        name: 'Priya Sharma',
        phone: '+91 98765 43210',
        relationship: 'Mother',
        isPrimary: true,
      },
      {
        userId: user._id,
        name: 'Anita Desai',
        phone: '+91 98765 43211',
        relationship: 'Best Friend',
        isPrimary: false,
      },
      {
        userId: user._id,
        name: 'Raj Patel',
        phone: '+91 98765 43212',
        relationship: 'Brother',
        isPrimary: false,
      },
    ]);

    // Create incident reports
    await IncidentReport.insertMany([
      {
        reportedBy: user._id,
        incidentType: 'harassment',
        description: 'Man followed me from the metro station.',
        location: { latitude: 28.6139, longitude: 77.209, address: 'Sector 21, Metro Station' },
        severity: 'high',
        isAnonymous: false,
      },
      {
        reportedBy: user._id,
        incidentType: 'suspicious',
        description: 'White van circling the block multiple times.',
        location: { latitude: 28.6294, longitude: 77.2197, address: 'MG Road' },
        severity: 'medium',
        isAnonymous: true,
      },
    ]);

    // Create safe zones
    await SafeZone.insertMany([
      {
        userId: user._id,
        name: 'Home',
        type: 'home',
        location: { latitude: 28.6139, longitude: 77.209 },
        address: '123 Main Street, New Delhi',
      },
      {
        userId: user._id,
        name: 'Office',
        type: 'office',
        location: { latitude: 28.6294, longitude: 77.2197 },
        address: '456 Business Park, New Delhi',
      },
    ]);

    res.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SafeAlert API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
