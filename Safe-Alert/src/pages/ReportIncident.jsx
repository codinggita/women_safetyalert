import { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Upload,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import MapComponent from '../components/MapComponent';
import api from '../services/api';

const incidentTypes = [
  { value: 'harassment', label: 'Harassment', icon: AlertTriangle },
  { value: 'assault', label: 'Assault', icon: AlertTriangle },
  { value: 'theft', label: 'Theft', icon: AlertTriangle },
  { value: 'suspicious', label: 'Suspicious Activity', icon: AlertTriangle },
  { value: 'accident', label: 'Accident', icon: AlertTriangle },
  { value: 'other', label: 'Other', icon: AlertTriangle },
];

export default function ReportIncident() {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    anonymous: false,
    shareLocation: true,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.incidents.create({
        incidentType: formData.type,
        description: formData.description,
        location: {
          address: formData.location,
        },
        isAnonymous: formData.anonymous,
        severity: 'medium',
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          type: '',
          description: '',
          location: '',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().slice(0, 5),
          anonymous: false,
          shareLocation: true,
        });
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      
      <main className="pt-20 pb-24 md:pt-24 md:pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Report Incident
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Help keep your community safe by reporting incidents
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-white dark:bg-dark-card rounded-2xl p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Report Submitted!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Thank you for helping keep your community safe.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Incident Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Incident Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {incidentTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: type.value })}
                          className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                            formData.type === type.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300 hover:border-primary/50'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                      placeholder="Describe what happened..."
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Location
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Location
                    </label>
                    <div className="h-64 rounded-xl overflow-hidden">
                      <MapComponent 
                        showCurrentLocation={true}
                        markers={[
                          { id: 1, x: 50, y: 50, type: 'incident' }
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="Enter address or use current location"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Date & Time
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Privacy Options
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.anonymous}
                      onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Report Anonymously
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your identity will not be shared with authorities
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shareLocation}
                      onChange={(e) => setFormData({ ...formData, shareLocation: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Share My Location
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Include your current location with the report
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl gradient-primary text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
