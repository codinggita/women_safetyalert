import { Phone, Edit2, Trash2, Star } from 'lucide-react';

export default function ContactCard({ contact, onEdit, onDelete, onSetPrimary }) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center text-white font-semibold">
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {contact.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {contact.relationship}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 mt-1">
              <Phone className="w-3 h-3" />
              {contact.phone}
            </p>
          </div>
        </div>
        {contact.isPrimary && (
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs text-yellow-700 dark:text-yellow-400">Primary</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
        {!contact.isPrimary && (
          <button
            onClick={() => onSetPrimary(contact._id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
          >
            <Star className="w-4 h-4" />
            Set Primary
          </button>
        )}
        <button
          onClick={() => onEdit(contact)}
          className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(contact._id)}
          className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
