import { MapPin, Navigation, Crosshair } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function MapComponent({ 
  markers = [], 
  onMarkerClick, 
  showCurrentLocation = true,
  center = null 
}) {
  const { darkMode } = useTheme();

  return (
    <div className={`relative w-full h-full rounded-xl overflow-hidden ${
      darkMode ? 'bg-dark-card' : 'bg-gray-100'
    }`}>
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-20">
        {Array.from({ length: 64 }).map((_, i) => (
          <div
            key={i}
            className={`border ${darkMode ? 'border-dark-border' : 'border-gray-300'}`}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className={`w-16 h-16 mx-auto mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Map View
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {showCurrentLocation ? 'Showing your current location' : 'Tap markers for details'}
          </p>
        </div>
      </div>

      {showCurrentLocation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-dark-card shadow-lg"></div>
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-50"></div>
          </div>
        </div>
      )}

      {markers.map((marker, index) => (
        <button
          key={marker.id || index}
          onClick={() => onMarkerClick && onMarkerClick(marker)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
          style={{
            left: `${marker.x || 50}%`,
            top: `${marker.y || 50}%`,
          }}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
            marker.type === 'safe' 
              ? 'bg-green-500' 
              : marker.type === 'incident'
              ? 'bg-red-500'
              : 'bg-secondary'
          }`}>
            <MapPin className="w-4 h-4 text-white" />
          </div>
        </button>
      ))}

      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          darkMode ? 'bg-dark-border hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
        } transition-colors`}>
          <Crosshair className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          darkMode ? 'bg-dark-border hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
        } transition-colors`}>
          <Navigation className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
}
