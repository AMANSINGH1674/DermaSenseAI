import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                <Activity className="text-white" size={24} />
              </div>
              <span className="text-xl font-display font-bold text-white">Derma<span className="text-primary-400">SenseAI</span></span>
            </Link>
            <p className="mt-4 text-secondary-300 text-sm">
              Advanced AI-powered dermatology platform with blockchain-secured skin health analysis.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-secondary-300 hover:text-primary-400 transition-colors">How It Works</Link></li>
              <li><Link to="/ai-security" className="text-secondary-300 hover:text-primary-400 transition-colors">AI Analysis</Link></li>
              <li><Link to="/blockchain-verification" className="text-secondary-300 hover:text-primary-400 transition-colors">Verification</Link></li>
              <li><Link to="/dashboard" className="text-secondary-300 hover:text-primary-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">Developer Guide</a></li>
              <li><a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">FHIR Standards</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">About Us</a></li>
              <li><Link to="/contact" className="text-secondary-300 hover:text-primary-400 transition-colors">Contact</Link></li>
              <li><a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-secondary-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              &copy; {new Date().getFullYear()} DermaSenseAI. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li><a href="#" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors">Privacy</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors">Terms</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;