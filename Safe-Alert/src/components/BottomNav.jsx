import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Users, 
  AlertTriangle, 
  Shield,
  PlusCircle
} from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Incidents', path: '/incidents', icon: AlertTriangle },
    { name: 'Add', path: '/report', icon: PlusCircle, isAdd: true },
    { name: 'Contacts', path: '/contacts', icon: Users },
    { name: 'Safe Zones', path: '/safe-zones', icon: Shield },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-dark-border pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isCurrentActive = isActive(item.path);
          
          if (item.isAdd) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/30 animate-bounce-subtle">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] mt-1 font-medium text-gray-500">{item.name}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors ${
                isCurrentActive
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isCurrentActive ? 'fill-current' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
