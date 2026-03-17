const express = require('express');
const router = express.Router();
const IncidentReport = require('../models/IncidentReport');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/incidents
 * @desc    Get all incident reports (with filters)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { type, severity, lat, lng, radius } = req.query;

    let query = {};

    // Filter by incident type
    if (type && type !== 'all') {
      query.incidentType = type;
    }

    // Filter by severity
    if (severity && severity !== 'all') {
      query.severity = severity;
    }

    // For now, return all incidents (could add geospatial query for location-based)
    const incidents = await IncidentReport.find(query)
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(100);

    // Mask user info if anonymous
    const sanitizedIncidents = incidents.map(incident => {
      if (incident.isAnonymous) {
        return { ...incident._doc, reportedBy: null };
      }
      return incident;
    });

    res.json({ success: true, incidents: sanitizedIncidents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/incidents
 * @desc    Report an incident
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const { incidentType, description, latitude, longitude, address, date, severity, isAnonymous } = req.body;

    const incident = await IncidentReport.create({
      reportedBy: req.user.id,
      incidentType,
      description,
      location: { latitude, longitude, address },
      date: date || Date.now(),
      severity: severity || 'medium',
      isAnonymous: isAnonymous || false,
    });

    res.status(201).json({ success: true, incident });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/incidents/:id
 * @desc    Get single incident report
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const incident = await IncidentReport.findById(req.params.id)
      .populate('reportedBy', 'name');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Mask user info if anonymous
    const sanitizedIncident = incident.isAnonymous
      ? { ...incident._doc, reportedBy: null }
      : incident;

    res.json({ success: true, incident: sanitizedIncident });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/incidents/user/me
 * @desc    Get current user's reported incidents
 * @access  Private
 */
router.get('/user/me', protect, async (req, res) => {
  try {
    const incidents = await IncidentReport.find({ reportedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, incidents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
