const mongoose = require('mongoose');

/**
 * SOSAlert Model
 * Represents an emergency SOS alert sent by a user
 * Contains location data and notification status
 */
const sosAlertSchema = new mongoose.Schema(
  {
    // Reference to the User who triggered the SOS
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },

    // Location where the SOS was triggered
    location: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
      },
    },

    // Array of emergency contacts that were notified
    contactsNotified: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmergencyContact',
      },
    ],

    // Current status of the SOS alert
    status: {
      type: String,
      enum: ['sent', 'resolved', 'cancelled'],
      default: 'sent',
    },

    // Optional: Additional message sent with the SOS
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

/**
 * Index for faster queries by userId
 * Helps in fetching alert history for a specific user
 */
sosAlertSchema.index({ userId: 1, createdAt: -1 });

/**
 * Index for querying by status
 * Useful for admin dashboards or monitoring
 */
sosAlertSchema.index({ status: 1 });

module.exports = mongoose.model('SOSAlert', sosAlertSchema);
