import { useState } from 'react';
import { Plus, Home, Building, GraduationCap, MapPin, Edit2, Trash2, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import MapComponent from '../components/MapComponent';
import Modal from '../components/Modal';

const initialZones = [
  { id: 1, name: 'Home', address: '123 Main Street, Apt 4B', type: 'home', x: 30, y: 40 },
  { id: 2, name: 'Office', address: '456 Business Park, Floor 12', type: 'office', x: 60, y: 35 },
  { id: 3, name: 'College', address: 'XYZ University, Campus A', type: 'college', x: 45, y: 70 },
];

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
  const { darkMode } = useTheme();
  const [zones, setZones] = useState(initialZones);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'home',
  });

  const handleAddZone = () => {
    setEditingZone(null);
    setFormData({ name: '', address: '', type: 'home' });
    setIsModalOpen(true);
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      address: zone.address,
      type: zone.type,
    });
    setIsModalOpen(true);
  };

  const handleDeleteZone = (id) => {
    setZones(zones.filter(z => z.id !== id));
  };

  const handleSaveZone = (e) => {
    e.preventDefault();
    if (editingZone) {
      setZones(zones.map(z =>
        z.id === editingZone.id
          ? { ...z, ...formData }
          : z
      ));
    } else {
      const newZone = {
        id: Date.now(),
        ...formData,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      };
      setZones([...zones, newZone]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      
      <main className="pt-20 pb-24 md:pt-24 md:pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Safe Zones
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Mark your safe places
              </p>
            </div>
            <button
              onClick={handleAddZone}
              className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white font-medium hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Zone
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-dark-border">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Map View
                  </h3>
                </div>
                <div className="h-96">
                  <MapComponent
                    showCurrentLocation={false}
                    markers={zones.map(zone => ({
                      id: zone.id,
                      x: zone.x,
                      y: zone.y,
                      type: 'safe'
                    }))}
                    onMarkerClick={(marker) => {
                      const zone = zones.find(z => z.id === marker.id);
                      if (zone) setSelectedZone(zone);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Your Safe Zones
              </h3>
              
              {zones.length === 0 ? (
                <div className="bg-white dark:bg-dark-card rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 dark:bg-dark-card flex items-center justify-center mb-3">
                    <Shield className="w-7 h-7 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    No safe zones yet
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Add your trusted locations
                  </p>
                  <button
                    onClick={handleAddZone}
                    className="text-primary font-medium text-sm"
                  >
                    + Add Safe Zone
                  </button>
                </div>
              ) : (
                zones.map((zone) => {
                  const Icon = zoneIcons[zone.type];
                  return (
                    <div
                      key={zone.id}
                      className={`bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm border border-gray-100 dark:border-dark-border cursor-pointer transition-all hover:shadow-md ${
                        selectedZone?.id === zone.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedZone(zone)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg ${zoneColors[zone.type]} flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {zone.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {zone.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-dark-border">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditZone(zone);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteZone(zone.id);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingZone ? 'Edit Safe Zone' : 'Add Safe Zone'}
      >
        <form onSubmit={handleSaveZone} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Zone Type
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
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="Enter address"
                required
              />
            </div>
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
              {editingZone ? 'Save Changes' : 'Add Zone'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
