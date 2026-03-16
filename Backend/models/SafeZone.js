const mongoose = require('mongoose');

/**
 * SafeZone Model
 * Represents a safe location marked by a user
 * Examples: Home, Office, College, etc.
 */
const safeZoneSchema = new mongoose.Schema(
  {
    // Reference to the User who created this safe zone
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },

    // Name/label for the safe zone (e.g., "Home", "Office")
    name: {
      type: String,
      required: [true, 'Please provide a name for the safe zone'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    // Type of safe zone
    type: {
      type: String,
      enum: ['home', 'office', 'college', 'other'],
      default: 'other',
    },

    // Location coordinates of the safe zone
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

    // Address of the safe zone
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

/**
 * Index for faster queries by userId
 * Helps in fetching all safe zones for a specific user
 */
safeZoneSchema.index({ userId: 1 });

/**
 * Index for querying by type
 */
safeZoneSchema.index({ type: 1 });

module.exports = mongoose.model('SafeZone', safeZoneSchema);
