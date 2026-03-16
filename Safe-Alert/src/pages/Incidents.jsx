import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, MapPin, AlertTriangle, Shield, Car, Heart, Home, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import IncidentCard from '../components/IncidentCard';
import api from '../services/api';

const filters = [
  { value: 'all', label: 'All Incidents' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'theft', label: 'Theft' },
  { value: 'suspicious', label: 'Suspicious' },
  { value: 'accident', label: 'Accident' },
];

export default function Incidents() {
  const { darkMode } = useTheme();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await api.incidents.getAll();
      setIncidents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLocationAddress = (location) => {
    if (!location) return 'Unknown location';
    if (typeof location === 'string') return location;
    return location.address || 'Unknown location';
  };

  const transformIncident = (incident) => ({
    ...incident,
    location: getLocationAddress(incident.location),
    date: new Date(incident.createdAt || Date.now()),
    type: incident.incidentType,
  });

  const filteredIncidents = incidents
    .map(transformIncident)
    .filter(incident => {
      const location = getLocationAddress(incident.location);
      const matchesSearch = incident.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = activeFilter === 'all' || incident.type === activeFilter;
      const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
      return matchesSearch && matchesType && matchesSeverity;
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      
      <main className="pt-20 pb-24 md:pt-24 md:pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Community Incidents
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Stay informed about incidents in your area
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location or description..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeFilter === filter.value
                      ? 'gradient-primary text-white'
                      : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-border hover:border-primary'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Severity:</span>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <span className="text-sm text-gray-500">
                {filteredIncidents.length} incidents found
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <button onClick={fetchIncidents} className="mt-4 text-primary hover:underline">
                  Try again
                </button>
              </div>
            ) : filteredIncidents.length === 0 ? (
              <div className="bg-white dark:bg-dark-card rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-dark-card flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No incidents found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  No incidents match your current filters
                </p>
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))
            )}
          </div>

          {filteredIncidents.length > 0 && (
            <div className="flex justify-center mt-8">
              <button className="px-6 py-3 rounded-xl border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300 font-medium hover:border-primary hover:text-primary transition-colors">
                Load More
              </button>
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 dark:text-yellow-300">
                  Stay Alert
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                  This is a community-driven feed. Always verify information and stay cautious.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
