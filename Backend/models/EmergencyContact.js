const mongoose = require('mongoose');

/**
 * EmergencyContact Model
 * Represents emergency contacts saved by users
 * Each contact belongs to a specific user
 */
const emergencyContactSchema = new mongoose.Schema(
  {
    // Reference to the User who owns this contact
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },

    // Contact's name
    name: {
      type: String,
      required: [true, 'Please provide contact name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    // Contact's phone number
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },

    // Relationship to the user (e.g., Mother, Father, Friend)
    relationship: {
      type: String,
      trim: true,
      maxlength: [30, 'Relationship cannot exceed 30 characters'],
    },

    // Flag to mark primary contact (first to be notified in emergencies)
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

/**
 * Index for faster queries by userId
 * Helps in fetching all contacts for a specific user
 */
emergencyContactSchema.index({ userId: 1 });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
