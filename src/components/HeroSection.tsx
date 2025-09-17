import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Database, Brain, ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-white to-primary-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                AI-Powered <span className="text-primary-500">Dermatology</span> with <span className="text-primary-500">Blockchain</span> Security
              </h1>
              <p className="text-lg text-secondary-700 mb-8 max-w-xl">
                Advanced skin health analysis powered by AI, secured with blockchain technology for accurate and trustworthy dermatological insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="btn-primary">
                  Get Started
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link to="/how-it-works" className="btn-secondary">
                  Learn How It Works
                </Link>
              </div>
              
              <div className="mt-12 flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Shield className="text-primary-500" size={24} />
                  </div>
                  <span className="ml-3 text-secondary-800 font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Database className="text-primary-500" size={24} />
                  </div>
                  <span className="ml-3 text-secondary-800 font-medium">AI-Powered Analysis</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl blur opacity-30 animate-pulse-glow"></div>
                <div className="glass-card p-6 relative">
                  <div className="w-full h-[400px] rounded-xl bg-white flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full">
                      <img 
                        src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                        alt="Medical AI Technology" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 to-transparent flex flex-col justify-end p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center mr-3">
                            <Brain className="text-white" size={20} />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">AI Skin Analysis</h3>
                            <p className="text-white/80 text-sm">Advanced dermatological AI technology</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="text-white/90 text-xs font-medium mb-1">Data Points</div>
                            <div className="text-white font-bold">1.2M+</div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="text-white/90 text-xs font-medium mb-1">Accuracy</div>
                            <div className="text-white font-bold">99.7%</div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="text-white/90 text-xs font-medium mb-1">Response</div>
                            <div className="text-white font-bold">&lt; 50ms</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-200 rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;