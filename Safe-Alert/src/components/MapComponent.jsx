import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Navigation, Crosshair, MapPin, LocateFixed } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from '../context/LocationContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const safeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const incidentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.latitude, center.longitude], 15);
    }
  }, [center, map]);
  return null;
}

export default function MapComponent({ 
  markers = [], 
  onMarkerClick, 
  showCurrentLocation = true,
  center = null 
}) {
  const { darkMode } = useTheme();
  const { location, loading: locationLoading, error: locationError, requestLocation, permissionGranted } = useLocation();
  const [mapReady, setMapReady] = useState(false);
  const [locating, setLocating] = useState(false);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    try {
      setMapReady(true);
    } catch (err) {
      setMapError(err.message);
      console.error('Map error:', err);
    }
  }, []);

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-dark-border rounded-xl">
        <p className="text-gray-500">Unable to load map</p>
      </div>
    );
  }

  try {
  const userLocation = location ? { latitude: location.latitude, longitude: location.longitude } : null;

  const defaultCenter = userLocation 
    ? [userLocation.latitude, userLocation.longitude]
    : [28.6139, 77.209];

  const handleGetLocation = async () => {
    setLocating(true);
    try {
      await requestLocation();
    } catch (err) {
      console.error('Failed to get location:', err);
    }
    setLocating(false);
  };

  const tileUrl = darkMode 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution = darkMode
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          url={tileUrl}
          attribution={attribution}
        />
        
        <MapCenter center={center} />

        {showCurrentLocation && userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>Your current location</Popup>
          </Marker>
        )}

        {markers.map((marker, index) => {
          const markerLocation = marker.location?.latitude && marker.location?.longitude
            ? [marker.location.latitude, marker.location.longitude]
            : marker.latitude && marker.longitude
            ? [marker.latitude, marker.longitude]
            : null;

          if (!markerLocation) return null;

          return (
            <Marker
              key={marker.id || index}
              position={markerLocation}
              icon={marker.type === 'safe' ? safeIcon : marker.type === 'incident' ? incidentIcon : defaultIcon}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(marker),
              }}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold">{marker.name || 'Location'}</p>
                  {marker.address && <p className="text-sm text-gray-500">{marker.address}</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {!permissionGranted && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[1000]">
          <div className="bg-white dark:bg-dark-card p-6 rounded-xl max-w-sm mx-4 text-center">
            <LocateFixed className="w-12 h-12 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Enable Location
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              SafeAlert needs location access to show your position on the map and provide emergency services.
            </p>
            <button
              onClick={handleGetLocation}
              disabled={locating}
              className="w-full px-4 py-3 rounded-xl gradient-primary text-white font-medium disabled:opacity-50"
            >
              {locating ? 'Getting location...' : 'Allow Location Access'}
            </button>
            {locationError && (
              <p className="text-red-500 text-sm mt-2">{locationError}</p>
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[500]">
        {!permissionGranted && (
          <button 
            onClick={handleGetLocation}
            disabled={locating}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              darkMode ? 'bg-dark-border hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
            } ${locating ? 'animate-pulse' : ''}`}
          >
            {locating ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <LocateFixed className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        )}
        <button 
          onClick={handleGetLocation}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
            darkMode ? 'bg-dark-border hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
          } transition-colors`}
        >
          <Crosshair className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {locationLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark-card px-4 py-2 rounded-full shadow-lg z-[500] flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-600 dark:text-gray-300">Getting location...</span>
        </div>
      )}
    </div>
    );
  } catch (err) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-dark-border rounded-xl">
        <p className="text-gray-500">Unable to load map</p>
      </div>
    );
  }
}