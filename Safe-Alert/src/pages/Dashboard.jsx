import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  User, 
  MapPin, 
  Phone, 
  AlertTriangle,
  ChevronRight,
  Shield,
  Clock,
  MessageSquare,
  Video,
  Mic,
  Settings,
  LocateFixed,
  Loader2,
  Share2,
  CheckCircle,
  PhoneCall,
  Ambulance,
  ShieldAlert,
  Timer,
  Clock3
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from '../context/LocationContext';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import SOSButton from '../components/SOSButton';
import MapComponent from '../components/MapComponent';
import IncidentCard from '../components/IncidentCard';
import api from '../services/api';

export default function Dashboard() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { location, requestLocation, loading: locationLoading } = useLocation();
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInSent, setCheckInSent] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const emergencyNumbers = [
    { number: '112', label: 'Emergency', icon: PhoneCall, color: 'bg-red-500' },
    { number: '100', label: 'Police', icon: ShieldAlert, color: 'bg-blue-500' },
    { number: '102', label: 'Ambulance', icon: Ambulance, color: 'bg-green-500' },
    { number: '1091', label: 'Women Helpline', icon: Shield, color: 'bg-pink-500' },
  ];

  const handleEmergencyCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const handleShareLocation = () => {
    if (!location) {
      requestLocation().then(() => {
        const url = `https://www.google.com/maps?q=${location?.latitude},${location?.longitude}`;
        navigator.clipboard.writeText(url);
        alert('Location link copied to clipboard!');
      });
    } else {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      navigator.clipboard.writeText(url);
      alert('Location link copied to clipboard!');
    }
  };

  const handleCheckIn = async () => {
    setCheckInSent(true);
    try {
      await api.sos.trigger(location ? { latitude: location.latitude, longitude: location.longitude } : null);
    } catch (err) {
      console.log('Check-in sent');
    }
    setTimeout(() => {
      setShowCheckInModal(false);
      setCheckInSent(false);
    }, 2000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactsData, incidentsData] = await Promise.all([
        api.contacts.getAll().catch(() => []),
        api.incidents.getAll().catch(() => [])
      ]);
      setContacts(contactsData);
      setIncidents(incidentsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLocationAddress = (loc) => {
    if (!loc) return 'Unknown location';
    if (typeof loc === 'string') return loc;
    return loc.address || 'Unknown location';
  };

  const transformIncident = (incident) => ({
    ...incident,
    location: getLocationAddress(incident.location),
    date: new Date(incident.createdAt || Date.now()),
    type: incident.incidentType,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      
      <main className="pt-20 pb-24 md:pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Emergency Calls
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      One-tap emergency dialing
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {emergencyNumbers.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleEmergencyCall(item.number)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-dark-border transition-all active:scale-95 hover:-translate-y-1 hover:shadow-lg card-animate stagger-${index + 1}`}
                      >
                        <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {item.number}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-center py-4">
                  <SOSButton onAlertSent={() => setShowSOSModal(true)} />
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <button
                    onClick={handleShareLocation}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-blue-500" />
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Share Location</span>
                  </button>
                  <button
                    onClick={() => setShowCheckInModal(true)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">I'm Safe</span>
                  </button>
                  <button
                    onClick={() => alert('Coming soon!')}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-purple-500" />
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Fake Call</span>
                  </button>
                </div>
              </div>

              {showCheckInModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                  <div className="bg-white dark:bg-dark-card rounded-2xl p-6 max-w-sm w-full text-center">
                    {checkInSent ? (
                      <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Check-in Sent!
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Your contacts have been notified that you're safe.
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Send "I'm Safe" Check-in?
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          This will notify your emergency contacts that you're safe.
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowCheckInModal(false)}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-200 font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleCheckIn}
                            className="flex-1 px-4 py-3 rounded-xl gradient-primary text-white font-medium"
                          >
                            Send
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Live Location
                    </h3>
                    {location && (
                      <span className="flex items-center gap-1 text-xs text-green-500">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => requestLocation()}
                      disabled={locationLoading}
                      className="text-sm text-primary flex items-center gap-1 hover:underline"
                    >
                      {locationLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LocateFixed className="w-4 h-4" />
                      )}
                      {location ? 'Refresh' : 'Enable'}
                    </button>
                    <Link to="/safe-zones" className="text-sm text-primary flex items-center gap-1">
                      View Map <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="h-64">
                  <MapComponent showCurrentLocation={true} />
                </div>
              </div>

              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
                <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Recent Incidents
                  </h3>
                  <Link to="/incidents" className="text-sm text-primary flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="p-4 space-y-4">
                  {loading ? (
                    <div className="text-center py-4">
                      <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
                    </div>
                  ) : incidents.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No recent incidents
                    </p>
                  ) : (
                    incidents.slice(0, 3).map((incident) => (
                      <IncidentCard key={incident._id} incident={transformIncident(incident)} />
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Emergency Contacts
                  </h3>
                  <Link to="/contacts" className="text-sm text-primary">
                    Manage
                  </Link>
                </div>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-4">
                      <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
                    </div>
                  ) : contacts.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No contacts yet
                    </p>
                  ) : (
                    contacts.slice(0, 3).map((contact) => (
                      <div
                        key={contact._id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-bg"
                      >
                        <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center text-white font-medium">
                          {contact.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {contact.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {contact.phone}
                          </p>
                        </div>
                        {contact.isPrimary && (
                          <Shield className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    ))
                  )}
                </div>
                <Link
                  to="/contacts"
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-gray-300 dark:border-dark-border text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Add Emergency Contact
                </Link>
              </div>

              <div className="bg-gradient-to-br from-primary to-red-400 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="font-semibold">Emergency Numbers</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { number: '112', label: 'Emergency' },
                    { number: '100', label: 'Police' },
                    { number: '1091', label: 'Women Helpline' },
                    { number: '102', label: 'Ambulance' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white/20 rounded-xl p-3"
                    >
                      <span className="font-bold text-lg">{item.number}</span>
                      <span className="text-sm opacity-80">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Safety Tips
                </h3>
                <div className="space-y-3">
                  {[
                    'Stay aware of your surroundings',
                    'Share your trip details with someone',
                    'Trust your instincts',
                    'Keep emergency numbers saved'
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                        <Shield className="w-3 h-3 text-green-500" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/resources"
                  className="mt-4 text-sm text-primary font-medium flex items-center gap-1"
                >
                  Learn more <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
