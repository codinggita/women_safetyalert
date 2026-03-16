const express = require('express');
const router = express.Router();
const SafeZone = require('../models/SafeZone');

/**
 * @route   GET /api/safezones
 * @desc    Get all safe zones for current user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const safeZones = await SafeZone.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, safeZones });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/safezones
 * @desc    Create a new safe zone
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    const { name, type, latitude, longitude, address } = req.body;

    const safeZone = await SafeZone.create({
      userId: req.user.id,
      name,
      type: type || 'other',
      location: { latitude, longitude },
      address,
    });

    res.status(201).json({ success: true, safeZone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/safezones/:id
 * @desc    Update a safe zone
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, type, latitude, longitude, address } = req.body;

    let safeZone = await SafeZone.findOne({ _id: req.params.id, userId: req.user.id });

    if (!safeZone) {
      return res.status(404).json({ message: 'Safe zone not found' });
    }

    safeZone = await SafeZone.findByIdAndUpdate(
      req.params.id,
      { name, type, location: { latitude, longitude }, address },
      { new: true }
    );

    res.json({ success: true, safeZone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/safezones/:id
 * @desc    Delete a safe zone
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const safeZone = await SafeZone.findOne({ _id: req.params.id, userId: req.user.id });

    if (!safeZone) {
      return res.status(404).json({ message: 'Safe zone not found' });
    }

    await SafeZone.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Safe zone deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
