const express = require('express');
const router = express.Router();
const SOSAlert = require('../models/SOSAlert');
const EmergencyContact = require('../models/EmergencyContact');

/**
 * @route   POST /api/sos
 * @desc    Trigger SOS alert
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    const { latitude, longitude, message } = req.body;

    // Get all emergency contacts for the user
    const contacts = await EmergencyContact.find({ userId: req.user.id });
    const contactIds = contacts.map(c => c._id);

    // Create SOS alert
    const sosAlert = await SOSAlert.create({
      userId: req.user.id,
      location: { latitude, longitude },
      contactsNotified: contactIds,
      message,
      status: 'sent',
    });

    res.status(201).json({ success: true, sosAlert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/sos
 * @desc    Get all SOS alerts for current user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const sosAlerts = await SOSAlert.find({ userId: req.user.id })
      .populate('contactsNotified', 'name phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, sosAlerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/sos/:id
 * @desc    Get single SOS alert
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const sosAlert = await SOSAlert.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('contactsNotified', 'name phone');

    if (!sosAlert) {
      return res.status(404).json({ message: 'SOS alert not found' });
    }

    res.json({ success: true, sosAlert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/sos/:id/resolve
 * @desc    Resolve an SOS alert
 * @access  Private
 */
router.put('/:id/resolve', async (req, res) => {
  try {
    const sosAlert = await SOSAlert.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: 'resolved' },
      { new: true }
    );

    if (!sosAlert) {
      return res.status(404).json({ message: 'SOS alert not found' });
    }

    res.json({ success: true, sosAlert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/sos/:id/cancel
 * @desc    Cancel an SOS alert
 * @access  Private
 */
router.put('/:id/cancel', async (req, res) => {
  try {
    const sosAlert = await SOSAlert.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id, status: 'sent' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!sosAlert) {
      return res.status(404).json({ message: 'SOS alert not found or already resolved' });
    }

    res.json({ success: true, sosAlert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
