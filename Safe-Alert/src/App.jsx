import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ReportIncident from './pages/ReportIncident';
import Incidents from './pages/Incidents';
import SafeZones from './pages/SafeZones';
import Resources from './pages/Resources';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/report" element={<ReportIncident />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/safe-zones" element={<SafeZones />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
