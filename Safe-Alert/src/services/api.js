const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('token');

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  auth: {
    register: async (userData) => {
      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        if (data.token) localStorage.setItem('token', data.token);
        return data;
      } catch (error) {
        if (error.message === 'Failed to fetch') {
          throw new Error('Cannot connect to server. Make sure the backend is running on port 5002.');
        }
        throw error;
      }
    },

    login: async (credentials) => {
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        if (data.token) localStorage.setItem('token', data.token);
        return data;
      } catch (error) {
        if (error.message === 'Failed to fetch') {
          throw new Error('Cannot connect to server. Make sure the backend is running on port 5002.');
        }
        throw error;
      }
    },

    me: async () => {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to get user');
      return data;
    },

    logout: () => {
      localStorage.removeItem('token');
    },
  },

  contacts: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/contacts`, { headers: getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch contacts');
      return data.contacts;
    },

    create: async (contactData) => {
      const res = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(contactData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create contact');
      return data.contact;
    },

    update: async (id, contactData) => {
      const res = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(contactData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update contact');
      return data.contact;
    },

    delete: async (id) => {
      const res = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete contact');
      return data;
    },

    setPrimary: async (id) => {
      const res = await fetch(`${API_URL}/contacts/${id}/primary`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to set primary contact');
      return data.contact;
    },
  },

  incidents: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/incidents`, { headers: getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch incidents');
      return data.incidents;
    },

    getMyIncidents: async () => {
      const res = await fetch(`${API_URL}/incidents/user/me`, { headers: getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch incidents');
      return data.incidents;
    },

    create: async (incidentData) => {
      const res = await fetch(`${API_URL}/incidents`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(incidentData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create incident');
      return data.incident;
    },

    getById: async (id) => {
      const res = await fetch(`${API_URL}/incidents/${id}`, { headers: getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch incident');
      return data.incident;
    },
  },

  safeZones: {
    getAll: async () => {
      const headers = getHeaders();
      console.log('Getting zones with headers:', headers);
      const res = await fetch(`${API_URL}/safezones`, { headers });
      const data = await res.json();
      console.log('Response:', res.status, data);
      if (!res.ok) throw new Error(data.message || 'Failed to fetch safe zones');
      return data.safeZones;
    },

    create: async (zoneData) => {
      const res = await fetch(`${API_URL}/safezones`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(zoneData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create safe zone');
      return data.safeZone || data.safezone;
    },

    update: async (id, zoneData) => {
      const res = await fetch(`${API_URL}/safezones/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(zoneData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update safe zone');
      return data.safeZone || data.safezone;
    },

    delete: async (id) => {
      const res = await fetch(`${API_URL}/safezones/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete safe zone');
      return data;
    },
  },

  sos: {
    trigger: async (location) => {
      const res = await fetch(`${API_URL}/sos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          latitude: location?.latitude,
          longitude: location?.longitude,
          message: 'SOS Alert triggered from SafeAlert App',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to trigger SOS');
      return data.sosAlert;
    },

    getAll: async () => {
      const res = await fetch(`${API_URL}/sos`, { headers: getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch SOS alerts');
      return data.sosAlerts;
    },

    getById: async (id) => {
      const res = await fetch(`${API_URL}/sos/${id}`, { headers: getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch SOS alert');
      return data.sosAlert;
    },

    resolve: async (id) => {
      const res = await fetch(`${API_URL}/sos/${id}/resolve`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resolve SOS');
      return data.sosAlert;
    },

    cancel: async (id) => {
      const res = await fetch(`${API_URL}/sos/${id}/cancel`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to cancel SOS');
      return data.sosAlert;
    },
  },
};

export default api;