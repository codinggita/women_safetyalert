import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ReportIncident from './pages/ReportIncident';
import Incidents from './pages/Incidents';
import SafeZones from './pages/SafeZones';
import Resources from './pages/Resources';
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
          <div className="text-center p-8">
            <p className="text-red-500 text-lg mb-2">Something went wrong</p>
            <p className="text-gray-500 text-sm mb-4">{this.state.error?.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute><ReportIncident /></ProtectedRoute>} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/safe-zones" element={<ErrorBoundary><ProtectedRoute><SafeZones /></ProtectedRoute></ErrorBoundary>} />
              <Route path="/resources" element={<Resources />} />
            </Routes>
          </Router>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
