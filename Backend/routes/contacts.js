const express = require('express');
const router = express.Router();
const EmergencyContact = require('../models/EmergencyContact');

/**
 * @route   GET /api/contacts
 * @desc    Get all emergency contacts for current user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/contacts
 * @desc    Add a new emergency contact
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    const { name, phone, relationship, isPrimary } = req.body;

    // If this is set as primary, unset other primaries
    if (isPrimary) {
      await EmergencyContact.updateMany(
        { userId: req.user.id },
        { isPrimary: false }
      );
    }

    const contact = await EmergencyContact.create({
      userId: req.user.id,
      name,
      phone,
      relationship,
      isPrimary: isPrimary || false,
    });

    res.status(201).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/contacts/:id
 * @desc    Update an emergency contact
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, relationship, isPrimary } = req.body;

    let contact = await EmergencyContact.findOne({ _id: req.params.id, userId: req.user.id });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // If setting as primary, unset other primaries first
    if (isPrimary) {
      await EmergencyContact.updateMany(
        { userId: req.user.id, _id: { $ne: req.params.id } },
        { isPrimary: false }
      );
    }

    contact = await EmergencyContact.findByIdAndUpdate(
      req.params.id,
      { name, phone, relationship, isPrimary },
      { new: true }
    );

    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/contacts/:id
 * @desc    Delete an emergency contact
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const contact = await EmergencyContact.findOne({ _id: req.params.id, userId: req.user.id });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await EmergencyContact.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/contacts/:id/primary
 * @desc    Set a contact as primary
 * @access  Private
 */
router.put('/:id/primary', async (req, res) => {
  try {
    // Unset all other primaries
    await EmergencyContact.updateMany(
      { userId: req.user.id },
      { isPrimary: false }
    );

    // Set this contact as primary
    const contact = await EmergencyContact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isPrimary: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
