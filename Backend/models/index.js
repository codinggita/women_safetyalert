/**
 * Models Index
 * Central export file for all Mongoose models
 */

const User = require('./User');
const EmergencyContact = require('./EmergencyContact');
const SOSAlert = require('./SOSAlert');
const IncidentReport = require('./IncidentReport');
const SafeZone = require('./SafeZone');

module.exports = {
  User,
  EmergencyContact,
  SOSAlert,
  IncidentReport,
  SafeZone,
};
