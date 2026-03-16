const mongoose = require('mongoose');

/**
 * IncidentReport Model
 * Represents an incident reported by a user in the community
 * Used for community safety awareness
 */
const incidentReportSchema = new mongoose.Schema(
  {
    // Reference to the User who reported the incident
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter ID is required'],
    },

    // Type of incident (e.g., harassment, assault, theft)
    incidentType: {
      type: String,
      required: [true, 'Incident type is required'],
      enum: [
        'harassment',
        'assault',
        'theft',
        'suspicious',
        'accident',
        'other',
      ],
    },

    // Detailed description of what happened
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    // Location where the incident occurred
    location: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
      },
      address: {
        type: String,
        trim: true,
        maxlength: [200, 'Address cannot exceed 200 characters'],
      },
    },

    // Date and time when the incident occurred
    date: {
      type: Date,
      required: [true, 'Incident date is required'],
      default: Date.now,
    },

    // Severity level of the incident
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    // Whether the report was submitted anonymously
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

/**
 * Index for searching incidents by type
 */
incidentReportSchema.index({ incidentType: 1 });

/**
 * Index for searching incidents by location (for geospatial queries)
 */
incidentReportSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

/**
 * Index for sorting by date (most recent first)
 */
incidentReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('IncidentReport', incidentReportSchema);
