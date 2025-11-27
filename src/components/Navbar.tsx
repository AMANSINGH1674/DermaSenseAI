import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Activity, Shield, Database, FileCheck, Users, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Activity size={18} /> },
    { name: 'How It Works', path: '/how-it-works', icon: <ChevronDown size={18} /> },
    { name: 'AI Analysis', path: '/ai-security', icon: <Shield size={18} /> },
    { name: 'Verification', path: '/blockchain-verification', icon: <Database size={18} /> },
    // Dashboard link removed from main navigation
    { name: 'Contact & FAQ', path: '/contact', icon: <MessageCircle size={18} /> },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
              <Activity className="text-white" size={24} />
            </div>
            <span className="text-xl font-display font-bold text-secondary-900">Derma<span className="text-primary-500">SenseAI</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary-500 bg-primary-50'
                    : 'text-secondary-700 hover:text-primary-500 hover:bg-primary-50'
                }`}
              >
                <span className="flex items-center gap-1">
                  {link.icon}
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="btn-secondary py-2 px-4">
              Log In
            </Link>
            <Link to="/login" className="btn-primary py-2 px-4">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-700 hover:text-primary-500 hover:bg-primary-50 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-secondary-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-primary-500 bg-primary-50'
                    : 'text-secondary-700 hover:text-primary-500 hover:bg-primary-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center gap-2">
                  {link.icon}
                  {link.name}
                </span>
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-secondary-100">
              <div className="flex items-center px-3">
                <Link to="/login" className="block w-full text-center btn-secondary py-2">
                  Log In
                </Link>
              </div>
              <div className="mt-3 px-3">
                <Link to="/login" className="block w-full text-center btn-primary py-2">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;