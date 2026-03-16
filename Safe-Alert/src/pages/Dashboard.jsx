import { useState } from 'react';
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
  Settings
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import SOSButton from '../components/SOSButton';
import MapComponent from '../components/MapComponent';
import IncidentCard from '../components/IncidentCard';

const mockContacts = [
  { id: 1, name: 'Mom', phone: '+1 234 567 890', isPrimary: true },
  { id: 2, name: 'Bestie', phone: '+1 234 567 891', isPrimary: false },
  { id: 3, name: 'Roomie', phone: '+1 234 567 892', isPrimary: false },
];

const mockIncidents = [
  {
    id: 1,
    type: 'harassment',
    description: 'Suspicious person following near the metro station',
    location: 'Metro Station, Downtown',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    severity: 'medium'
  },
  {
    id: 2,
    type: 'suspicious',
    description: 'Unknown vehicle circling the block multiple times',
    location: 'Park Avenue',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    severity: 'low'
  },
];

export default function Dashboard() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [showSOSModal, setShowSOSModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      
      <main className="pt-20 pb-24 md:pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Quick Actions
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your safety tools at one place
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: Phone, label: 'Call', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-500' },
                    { icon: MessageSquare, label: 'Message', color: 'bg-green-100 dark:bg-green-900/30 text-green-500' },
                    { icon: Video, label: 'Video', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-500' },
                    { icon: Mic, label: 'Record', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500' },
                  ].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                      >
                        <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {action.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-center py-4">
                  <SOSButton onAlertSent={() => setShowSOSModal(true)} />
                </div>
              </div>

              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Live Location
                  </h3>
                  <Link to="/safe-zones" className="text-sm text-primary flex items-center gap-1">
                    View Map <ChevronRight className="w-4 h-4" />
                  </Link>
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
                  {mockIncidents.map((incident) => (
                    <IncidentCard key={incident.id} incident={incident} />
                  ))}
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
                  {mockContacts.slice(0, 3).map((contact) => (
                    <div
                      key={contact.id}
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
                  ))}
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
