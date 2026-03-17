import { Link } from 'react-router-dom';
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Phone, 
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

export default function Landing() {
  const { darkMode } = useTheme();

  const features = [
    {
      icon: AlertTriangle,
      title: 'SOS Alerts',
      description: 'One-tap emergency alert to instantly notify your contacts and local authorities.',
      color: 'bg-red-100 dark:bg-red-900/30 text-red-500',
    },
    {
      icon: MapPin,
      title: 'Live Location',
      description: 'Share your real-time location with trusted contacts during emergencies.',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-500',
    },
    {
      icon: Users,
      title: 'Emergency Contacts',
      description: 'Manage up to 5 emergency contacts who will be notified immediately.',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-500',
    },
    {
      icon: Shield,
      title: 'Safe Zones',
      description: 'Mark and discover safe zones in your area for added security.',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-500',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '1M+', label: 'Alerts Sent' },
    { value: '24/7', label: 'Support' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      
      <main className="pt-16">
        <section className="relative overflow-hidden py-12 md:py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  Your Safety. One Click Away.
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Stay Safe with
                  <span className="text-primary block mt-2">SafeAlert</span>
                </h1>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                  A comprehensive women safety platform designed to protect you everywhere. 
                  Instant alerts, live tracking, and emergency support at your fingertips.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-dark-card text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-dark-border hover:border-secondary hover:text-secondary transition-colors"
                  >
                    Login
                  </Link>
                </div>
                <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Free to use</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No credit card</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative w-full max-w-md mx-auto">
                  <div className="absolute inset-0 gradient-primary rounded-3xl transform rotate-3 opacity-20"></div>
                  <div className="relative bg-white dark:bg-dark-card rounded-3xl shadow-2xl p-8">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto rounded-full gradient-primary flex items-center justify-center mb-6 sos-pulse">
                        <Shield className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        SOS Button
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Press and hold to send emergency alert
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white dark:bg-dark-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Everything You Need to Stay Safe
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Powerful features designed for your protection
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 card-animate stagger-${index + 1}`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-primary/10 dark:via-dark-card dark:to-secondary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Emergency Helplines
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Know these numbers - they can save lives
            </p>
            
            <div className="grid sm:grid-cols-3 gap-6 mt-10">
              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-primary">112</div>
                <div className="text-gray-500 dark:text-gray-400 mt-1">Emergency</div>
              </div>
              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-secondary">100</div>
                <div className="text-gray-500 dark:text-gray-400 mt-1">Police</div>
              </div>
              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-pink-500">1091</div>
                <div className="text-gray-500 dark:text-gray-400 mt-1">Women Helpline</div>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-center gap-2 text-gray-500">
              <Phone className="w-4 h-4" />
              <span>These services are available 24/7</span>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary to-red-400 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25IiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L2c+PC9zdmc+')]"></div>
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Ready to Feel Safer?
                </h2>
                <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
                  Join thousands of women who trust SafeAlert for their daily safety needs.
                </p>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 mt-8 px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">SafeAlert</span>
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                Your safety is our priority. We're committed to making the world safer for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/safety" className="hover:text-white transition-colors">Safety Guidelines</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Emergency</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">112</span> - Emergency
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary font-bold">100</span> - Police
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-500 font-bold">1091</span> - Women Helpline
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            &copy; 2026 SafeAlert. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
