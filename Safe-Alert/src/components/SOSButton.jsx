import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Check, Phone, MapPin, MessageSquare, Loader2, XCircle } from 'lucide-react';
import api from '../services/api';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';

export default function SOSButton({ onAlertSent }) {
  const { location } = useLocation();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(false);
  const [count, setCount] = useState(3);
  const [isShaking, setIsShaking] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const startCountdown = () => {
    setCountdown(true);
    setCount(3);
  };

  const cancelAlert = () => {
    setCountdown(false);
    setCount(3);
    setError(null);
  };

  const sendAlert = async () => {
    setSending(true);
    setError(null);
    try {
      if (location) {
        await api.sos.trigger({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      } else {
        await api.sos.trigger(null);
      }
      setAlertSent(true);
      setShowModal(true);
      if (onAlertSent) onAlertSent();
    } catch (err) {
      console.error('Failed to send SOS:', err);
      setError(err.message || 'Failed to send alert. Please try again.');
      setAlertSent(false);
      setShowModal(true);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (countdown && count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown && count === 0) {
      sendAlert();
    }
  }, [countdown, count]);

  useEffect(() => {
    let shakeInterval;
    const handleShake = () => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    };

    if (window.DeviceMotionEvent) {
      let lastX, lastY, lastZ;
      let shakeThreshold = 15;

      window.addEventListener('devicemotion', (event) => {
        const { acceleration } = event;
        if (acceleration) {
          const current = Math.abs(
            acceleration.x + acceleration.y + acceleration.z - (lastX + lastY + lastZ) / 3
          );
          if (current > shakeThreshold) {
            handleShake();
            if (!countdown && !alertSent) {
              startCountdown();
            }
          }
          lastX = acceleration.x;
          lastY = acceleration.y;
          lastZ = acceleration.z;
        }
      });
    }

    return () => {
      if (shakeInterval) clearInterval(shakeInterval);
    };
  }, [countdown, alertSent]);

  return (
    <>
      <div className={`relative ${isShaking ? 'shake' : ''}`}>
        {countdown ? (
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="90"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="96"
                cy="96"
                r="90"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-primary countdown-circle"
                strokeDasharray="565"
                strokeDashoffset="0"
                style={{
                  strokeDashoffset: (count / 3) * 565,
                }}
              />
            </svg>
            <button
              onClick={cancelAlert}
              disabled={sending}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-dark-card rounded-full shadow-2xl"
            >
              {sending ? (
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              ) : (
                <>
                  <span className="text-6xl font-bold text-primary">{count}</span>
                  <span className="text-sm text-gray-500 mt-2">Tap to cancel</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={startCountdown}
            className="w-48 h-48 mx-auto rounded-full gradient-primary flex flex-col items-center justify-center text-white shadow-2xl shadow-primary/30 sos-pulse hover:scale-105 transition-transform"
          >
            <AlertTriangle className="w-12 h-12 mb-2" />
            <span className="text-xl font-bold">SOS</span>
            <span className="text-xs opacity-80 mt-1">Hold to activate</span>
          </button>
        )}
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
          onClick={(e) => { 
            if (e.target === e.currentTarget) {
              setShowModal(false); 
              setAlertSent(false); 
              setError(null); 
            }
          }}
        >
          <div className="bg-white dark:bg-dark-card rounded-2xl p-8 max-w-sm w-full text-center animate-scale-in">
            {error ? (
              <>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Alert Failed
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {error}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Please check your email configuration or try again.
                </p>
                <button
                  onClick={() => { setShowModal(false); setError(null); }}
                  className="px-6 py-2 rounded-xl bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-200 font-medium"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Alert Sent!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your emergency contacts and local authorities have been notified.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span>Emergency contacts notified</span>
                  </div>
                  {location ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>Location unavailable</span>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <MessageSquare className="w-4 h-4" />
                    <span>Email sent to pritesh.v.bachhav.cg@gmail.com</span>
                  </div>
                </div>
                <button
                  onClick={() => { setShowModal(false); setAlertSent(false); }}
                  className="mt-6 px-6 py-2 rounded-xl bg-primary text-white font-medium"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>Ready</span>
        </div>
      </div>
    </>
  );
}
