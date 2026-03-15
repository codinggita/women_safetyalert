import { Phone, Shield, BookOpen, Heart, AlertTriangle, MapPin, Users, Lightbulb, ChevronRight, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

const emergencyNumbers = [
  { number: '112', label: 'Emergency Services', description: 'All emergencies', color: 'bg-red-500' },
  { number: '100', label: 'Police', description: 'Law enforcement', color: 'bg-blue-500' },
  { number: '1091', label: 'Women Helpline', description: 'Women safety', color: 'bg-pink-500' },
  { number: '102', label: 'Ambulance', description: 'Medical emergency', color: 'bg-green-500' },
  { number: '108', label: 'Fire Service', description: 'Fire emergency', color: 'bg-orange-500' },
  { number: '181', label: 'Railway Police', description: 'Rail safety', color: 'bg-purple-500' },
];

const safetyTips = [
  {
    title: 'Stay Aware of Your Surroundings',
    description: 'Always be mindful of your environment. Avoid distractions like headphones when walking alone.',
    icon: Eye,
  },
  {
    title: 'Share Your Location',
    description: 'Let someone know your whereabouts. Use location sharing with trusted contacts.',
    icon: MapPin,
  },
  {
    title: 'Trust Your Instincts',
    description: 'If something feels wrong, it probably is. Leave immediately and seek help.',
    icon: Heart,
  },
  {
    title: 'Plan Your Route',
    description: 'Know your route before you go. Stick to well-lit, populated areas when possible.',
    icon: Shield,
  },
  {
    title: 'Keep Emergency Contacts Handy',
    description: 'Save emergency numbers and quick-dial your trusted contacts.',
    icon: Users,
  },
  {
    title: 'Learn Self-Defense Basics',
    description: 'Basic self-defense skills can help you escape dangerous situations.',
    icon: Lightbulb,
  },
];

const selfDefenseTips = [
  'Maintain confident body language',
  'Make noise - scream for help',
  'Use your voice as a weapon',
  'Aim for vulnerable points (eyes, throat, groin, knees)',
  'Run away if possible',
  'Carry a personal safety alarm',
];

export default function Resources() {
  const { darkMode } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      
      <main className="pt-20 pb-24 md:pt-24 md:pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Safety Resources
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Important contacts and safety information
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Emergency Helplines
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {emergencyNumbers.map((item, index) => (
                <a
                  key={index}
                  href={`tel:${item.number}`}
                  className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white font-bold`}>
                      {item.number}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Safety Tips
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {safetyTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Self-Defense Basics
            </h2>
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
              <ul className="space-y-3">
                {selfDefenseTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="tel:112"
                className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-red-900 dark:text-red-300">
                    Call Emergency
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400" />
              </a>
              <a
                href="tel:1091"
                className="flex items-center justify-between p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span className="font-medium text-pink-900 dark:text-pink-300">
                    Women Helpline
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-pink-400" />
              </a>
              <a
                href="/resources"
                className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-blue-900 dark:text-blue-300">
                    Safety Guide
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-400" />
              </a>
              <a
                href="/contacts"
                className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-purple-900 dark:text-purple-300">
                    Emergency Contacts
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-400" />
              </a>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 dark:text-yellow-300">
                  Remember
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                  Your safety is paramount. Never hesitate to call emergency services if you feel threatened. 
                  It's better to be safe than sorry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
