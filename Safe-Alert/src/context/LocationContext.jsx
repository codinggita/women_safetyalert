import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = 'Geolocation is not supported by your browser';
        setError(err);
        reject(err);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setLocation(newLocation);
          setPermissionGranted(true);
          setLoading(false);
          resolve(newLocation);
        },
        (err) => {
          let message = 'Unable to get location';
          if (err.code === 1) message = 'Location permission denied';
          else if (err.code === 2) message = 'Location unavailable';
          else if (err.code === 3) message = 'Location request timeout';
          setError(message);
          setLoading(false);
          reject(message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );
    });
  };

  const watchPosition = () => {
    if (!navigator.geolocation) return null;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (err) => {
        console.error('Watch position error:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );

    return watchId;
  };

  useEffect(() => {
    const checkPermission = async () => {
      if (navigator.permissions) {
        try {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          if (result.state === 'granted') {
            setPermissionGranted(true);
            requestLocation();
          }
        } catch (e) {
          console.log('Permission API not supported');
        }
      }
    };
    checkPermission();
  }, []);

  return (
    <LocationContext.Provider value={{
      location,
      loading,
      error,
      permissionGranted,
      requestLocation,
      watchPosition,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}