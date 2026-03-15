import { useState } from 'react';
import { Plus, Search, Phone, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import ContactCard from '../components/ContactCard';
import Modal from '../components/Modal';

const initialContacts = [
  { id: 1, name: 'Priya Sharma', phone: '+91 98765 43210', relationship: 'Mother', isPrimary: true },
  { id: 2, name: 'Anita Desai', phone: '+91 98765 43211', relationship: 'Best Friend', isPrimary: false },
  { id: 3, name: 'Raj Patel', phone: '+91 98765 43212', relationship: 'Brother', isPrimary: false },
  { id: 4, name: 'Meera Singh', phone: '+91 98765 43213', relationship: 'Colleague', isPrimary: false },
];

export default function Contacts() {
  const { darkMode } = useTheme();
  const [contacts, setContacts] = useState(initialContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
  });

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = () => {
    setEditingContact(null);
    setFormData({ name: '', phone: '', relationship: '' });
    setIsModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
    });
    setIsModalOpen(true);
  };

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleSetPrimary = (id) => {
    setContacts(contacts.map(c => ({
      ...c,
      isPrimary: c.id === id
    })));
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (editingContact) {
      setContacts(contacts.map(c =>
        c.id === editingContact.id
          ? { ...c, ...formData }
          : c
      ));
    } else {
      const newContact = {
        id: Date.now(),
        ...formData,
        isPrimary: contacts.length === 0,
      };
      setContacts([...contacts, newContact]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      
      <main className="pt-20 pb-24 md:pt-24 md:pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Emergency Contacts
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage your trusted contacts
              </p>
            </div>
            <button
              onClick={handleAddContact}
              className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white font-medium hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Contact
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-dark-card flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No contacts found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Add your first emergency contact to get started
              </p>
              <button
                onClick={handleAddContact}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Contact
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                  onSetPrimary={handleSetPrimary}
                />
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-300">
                  Tip: Add up to 5 contacts
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  Your primary contact will be notified first in case of emergency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingContact ? 'Edit Contact' : 'Add Contact'}
      >
        <form onSubmit={handleSaveContact} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="Enter contact name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Relationship
            </label>
            <select
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              required
            >
              <option value="">Select relationship</option>
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Friend">Friend</option>
              <option value="Colleague">Colleague</option>
              <option value="Partner">Partner</option>
              <option value="Other">Other</option>
            </select>
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
              {editingContact ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
