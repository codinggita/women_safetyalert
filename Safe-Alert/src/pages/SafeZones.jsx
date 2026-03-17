import { useState, useEffect } from 'react';
import { Plus, Home, Building, GraduationCap, Edit2, Trash2, Shield, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const zoneIcons = {
  home: Home,
  office: Building,
  college: GraduationCap,
};

const zoneColors = {
  home: 'bg-green-100 dark:bg-green-900/30 text-green-500',
  office: 'bg-blue-100 dark:bg-blue-900/30 text-blue-500',
  college: 'bg-purple-100 dark:bg-purple-900/30 text-purple-500',
};

export default function SafeZones() {
  const { user, loading: authLoading } = useAuth();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'home',
  });

  useEffect(() => {
    console.log('SafeZones useEffect:', { authLoading, user });
    if (!authLoading && user) {
      fetchZones();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  const fetchZones = async () => {
    try {
      setLoading(true);
      console.log('Fetching safe zones...');
      const data = await api.safeZones.getAll();
      console.log('Got zones:', data);
      setZones(data || []);
    } catch (err) {
      console.error('Error fetching zones:', err);
      setZones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddZone = () => {
    setEditingZone(null);
    setFormData({ name: '', address: '', type: 'home' });
    setIsModalOpen(true);
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone?.name || '',
      address: zone?.address || '',
      type: zone?.type || 'home',
    });
    setIsModalOpen(true);
  };

  const handleDeleteZone = async (id) => {
    try {
      await api.safeZones.delete(id);
      setZones(prev => prev.filter(z => z._id !== id));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleSaveZone = async (e) => {
    e.preventDefault();
    try {
      if (editingZone) {
        const result = await api.safeZones.update(editingZone._id, {
          name: formData.name,
          address: formData.address,
          type: formData.type,
        });
        setZones(prev => prev.map(z => z._id === editingZone._id ? result : z));
      } else {
        const result = await api.safeZones.create({
          name: formData.name,
          address: formData.address,
          type: formData.type,
        });
        setZones(prev => [...prev, result]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      
      <main className="pt-20 pb-24 md:pt-24 md:pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Safe Places
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Add your trusted locations
              </p>
            </div>
            <button
              onClick={handleAddZone}
              className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white font-medium hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1 btn-hover"
            >
              <Plus className="w-5 h-5" />
              Add Place
            </button>
          </div>

          {authLoading || loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : !user ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Please log in to view your safe places</p>
            </div>
          ) : !zones || zones.length === 0 ? (
            <div className="bg-white dark:bg-dark-card rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-dark-card flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No safe places yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Add your trusted locations
              </p>
              <button
                onClick={handleAddZone}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Safe Place
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {(zones || []).map((zone, index) => {
                const zoneType = zone?.type || 'home';
                const Icon = zoneIcons[zoneType] || Home;
                return (
                  <div
                    key={zone?._id}
                    className={`bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 card-animate stagger-${Math.min(index + 1, 5)}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl ${zoneColors[zoneType] || zoneColors.home} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {zone?.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {zone?.address}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-400 rounded-lg capitalize">
                          {zoneType}
                        </span>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleEditZone(zone)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteZone(zone._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <BottomNav />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingZone ? 'Edit Safe Place' : 'Add Safe Place'}
      >
        <form onSubmit={handleSaveZone} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Place Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'home', label: 'Home', icon: Home },
                { value: 'office', label: 'Office', icon: Building },
                { value: 'college', label: 'College', icon: GraduationCap },
              ].map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      formData.type === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 dark:border-dark-border'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${formData.type === type.value ? 'text-primary' : 'text-gray-500'}`} />
                    <span className={`text-xs font-medium ${formData.type === type.value ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="e.g., My Home, Office"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              placeholder="Enter address"
              rows="2"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl gradient-primary text-white font-medium hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              {editingZone ? 'Save Changes' : 'Add Place'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}