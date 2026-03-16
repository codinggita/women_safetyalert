/**
 * Database Seeder
 * Run this file to populate the database with sample data
 * Usage: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const EmergencyContact = require('./models/EmergencyContact');
const IncidentReport = require('./models/IncidentReport');
const SafeZone = require('./models/SafeZone');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await EmergencyContact.deleteMany({});
    await IncidentReport.deleteMany({});
    await SafeZone.deleteMany({});
    console.log('Cleared existing data...');

    // Create default user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = await User.create({
      name: 'Demo User',
      email: 'demo@safealert.com',
      password: hashedPassword,
    });
    console.log('Created default user:', user.email);

    // Create emergency contacts for demo user
    const contacts = await EmergencyContact.insertMany([
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
      {
        userId: user._id,
        name: 'Meera Singh',
        phone: '+91 98765 43213',
        relationship: 'Colleague',
        isPrimary: false,
      },
    ]);
    console.log(`Created ${contacts.length} emergency contacts`);

    // Create sample incident reports
    const incidents = await IncidentReport.insertMany([
      {
        reportedBy: user._id,
        incidentType: 'harassment',
        description: 'Man followed me from the metro station to my apartment building. Kept asking for my number.',
        location: { latitude: 28.6139, longitude: 77.209, address: 'Sector 21, Metro Station' },
        date: new Date(Date.now() - 1 * 60 * 60 * 1000),
        severity: 'high',
        isAnonymous: false,
      },
      {
        reportedBy: user._id,
        incidentType: 'suspicious',
        description: 'White van circling the block multiple times. License plate partially visible.',
        location: { latitude: 28.6294, longitude: 77.2197, address: 'MG Road' },
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        severity: 'medium',
        isAnonymous: false,
      },
      {
        reportedBy: user._id,
        incidentType: 'harassment',
        description: 'Inappropriate comments made by stranger while walking in the park.',
        location: { latitude: 28.5921, longitude: 77.2295, address: 'City Park' },
        date: new Date(Date.now() - 5 * 60 * 60 * 1000),
        severity: 'low',
        isAnonymous: true,
      },
      {
        reportedBy: user._id,
        incidentType: 'theft',
        description: 'Snatch theft near the market area. Perpetrant fled on a motorcycle.',
        location: { latitude: 28.6548, longitude: 77.2354, address: 'Central Market' },
        date: new Date(Date.now() - 8 * 60 * 60 * 1000),
        severity: 'medium',
        isAnonymous: false,
      },
      {
        reportedBy: user._id,
        incidentType: 'accident',
        description: 'Hit and run near the traffic signal. Driver was overspeeding.',
        location: { latitude: 28.6304, longitude: 77.2177, address: 'Junction 5' },
        date: new Date(Date.now() - 12 * 60 * 60 * 1000),
        severity: 'medium',
        isAnonymous: true,
      },
    ]);
    console.log(`Created ${incidents.length} incident reports`);

    // Create safe zones for demo user
    const safeZones = await SafeZone.insertMany([
      {
        userId: user._id,
        name: 'Home',
        type: 'home',
        location: { latitude: 28.6139, longitude: 77.209 },
        address: '123 Main Street, Apt 4B, New Delhi',
      },
      {
        userId: user._id,
        name: 'Office',
        type: 'office',
        location: { latitude: 28.6294, longitude: 77.2197 },
        address: '456 Business Park, Floor 12, New Delhi',
      },
      {
        userId: user._id,
        name: 'College',
        type: 'college',
        location: { latitude: 28.5921, longitude: 77.2295 },
        address: 'XYZ University, Campus A, New Delhi',
      },
    ]);
    console.log(`Created ${safeZones.length} safe zones`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\nDemo Login Credentials:');
    console.log('   Email: demo@safealert.com');
    console.log('   Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedData();
