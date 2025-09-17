import React from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertTriangle, BarChart, Activity } from 'lucide-react';

const AISection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              AI-Powered Anomaly Detection
            </h2>
            <p className="text-lg text-secondary-700 mb-8">
              Our advanced AI algorithms continuously monitor health data to identify patterns and detect anomalies that might indicate health issues before they become serious.
            </p>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                  <Brain className="text-primary-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Neural Networks</h3>
                  <p className="text-secondary-700">Deep learning models trained on millions of health records to recognize normal and abnormal patterns.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                  <AlertTriangle className="text-primary-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Early Warning System</h3>
                  <p className="text-secondary-700">Proactive alerts when the AI detects potential health issues, enabling early intervention.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                  <BarChart className="text-primary-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Predictive Analytics</h3>
                  <p className="text-secondary-700">Forecast health trends and potential outcomes based on historical data and current indicators.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl blur opacity-30"></div>
              <div className="glass-card p-6 relative">
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="relative w-full h-[400px]">
                    <img 
                      src="https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                      alt="AI Medical Technology" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 to-secondary-900/30 flex flex-col justify-end p-6">
                      <div className="mb-6">
                        <h3 className="text-white text-2xl font-bold mb-2">Real-time Health Monitoring</h3>
                        <p className="text-white/80">AI-powered analysis of vital signs and health metrics</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Activity className="text-primary-400 mr-2" size={18} />
                              <span className="text-white font-medium">Heart Rate</span>
                            </div>
                            <span className="text-white font-bold">72 BPM</span>
                          </div>
                          <div className="w-full bg-white/20 h-2 rounded-full">
                            <div className="bg-primary-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Activity className="text-primary-400 mr-2" size={18} />
                              <span className="text-white font-medium">Blood Pressure</span>
                            </div>
                            <span className="text-white font-bold">120/80</span>
                          </div>
                          <div className="w-full bg-white/20 h-2 rounded-full">
                            <div className="bg-primary-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Activity className="text-primary-400 mr-2" size={18} />
                              <span className="text-white font-medium">Blood Glucose</span>
                            </div>
                            <span className="text-white font-bold">98 mg/dL</span>
                          </div>
                          <div className="w-full bg-white/20 h-2 rounded-full">
                            <div className="bg-primary-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AISection;