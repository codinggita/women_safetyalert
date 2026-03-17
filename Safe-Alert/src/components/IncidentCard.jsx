import { MapPin, Clock, AlertTriangle, Shield, Heart, Car, Home } from 'lucide-react';

const incidentIcons = {
  harassment: AlertTriangle,
  assault: Shield,
  theft: Heart,
  suspicious: Car,
  accident: Home,
  other: AlertTriangle,
};

const incidentColors = {
  harassment: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
  assault: 'text-red-500 bg-red-100 dark:bg-red-900/30',
  theft: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
  suspicious: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
  accident: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  other: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
};

export default function IncidentCard({ incident }) {
  const Icon = incidentIcons[incident.type] || AlertTriangle;
  const colorClass = incidentColors[incident.type] || incidentColors.other;

  const timeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
              {incident.type} Incident
            </h4>
            <span className={`text-xs px-2 py-1 rounded-full ${
              incident.severity === 'high' 
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : incident.severity === 'medium'
                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
            }`}>
              {incident.severity}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
            {incident.description}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {incident.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(incident.date)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
