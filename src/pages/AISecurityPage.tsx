import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, Lock, AlertTriangle, CheckCircle, BarChart, Eye, EyeOff, FileText, Server, Zap, Target, Award, Users } from 'lucide-react';

const AISecurityPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            AI & Security
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-secondary-700"
          >
            At DermaSense, we fuse cutting-edge artificial intelligence with robust, enterprise-grade security to protect sensitive dermatological health data while delivering actionable diagnostic insights with confidence.
          </motion.p>
        </div>

        {/* AI Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                  <Brain className="text-primary-500" size={24} />
                </div>
                <h2 className="text-3xl font-bold">Intelligent AI Diagnosis & Risk Detection</h2>
              </div>
              
              <p className="text-lg text-secondary-700 mb-8">
                Our AI systems utilize state-of-the-art neural network architectures trained on millions of anonymized dermatology images and clinical records to detect skin conditions early and flag potential risks promptly.
              </p>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-6">How Our AI Operates</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex flex-col items-center text-center p-6 bg-primary-50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                        <FileText className="text-primary-500" size={20} />
                      </div>
                      <h4 className="font-semibold mb-3">Comprehensive Data Analysis</h4>
                      <p className="text-sm text-secondary-700">Efficiently processes both image inputs and patient metadata from diverse sources.</p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-6 bg-primary-50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                        <Brain className="text-primary-500" size={20} />
                      </div>
                      <h4 className="font-semibold mb-3">Deep Neural Networks</h4>
                      <p className="text-sm text-secondary-700">Employs sophisticated models to identify diagnostic patterns and subtle anomalies.</p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-6 bg-primary-50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                        <AlertTriangle className="text-primary-500" size={20} />
                      </div>
                      <h4 className="font-semibold mb-3">Real-Time Alerting</h4>
                      <p className="text-sm text-secondary-700">Instantly notifies healthcare providers of urgent diagnostic findings requiring immediate attention.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                <h4 className="font-semibold mb-6 flex items-center text-xl">
                  <BarChart className="text-primary-500 mr-3" size={24} />
                  AI Accuracy & Efficiency
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                      <span className="font-medium">Accuracy</span>
                      <span className="text-2xl font-bold text-primary-500">98%+</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                      <span className="font-medium">Sensitivity</span>
                      <span className="text-2xl font-bold text-primary-500">97%+</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                      <span className="font-medium">Specificity</span>
                      <span className="text-2xl font-bold text-primary-500">96%+</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center p-6 bg-white rounded-lg">
                    <div className="text-center">
                      <Zap className="text-primary-500 mx-auto mb-2" size={32} />
                      <div className="text-2xl font-bold text-primary-500 mb-1">Sub-100ms</div>
                      <div className="text-sm text-secondary-600">Lightning-fast inference response times</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Security Section */}
        <section>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                  <Shield className="text-primary-500" size={24} />
                </div>
                <h2 className="text-3xl font-bold">Built-In Security by Design</h2>
              </div>
              
              <p className="text-lg text-secondary-700 mb-8">
                Security is the foundation of DermaSense, seamlessly embedded into every layer of our platform to ensure your data is safeguarded without compromise.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <Lock className="text-primary-500 mr-3" size={24} />
                    <h3 className="text-xl font-semibold">Robust Data Protection</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="text-primary-500 mr-3 flex-shrink-0 mt-1" size={16} />
                      <span className="text-secondary-700">AES-256 encryption secures all data at rest and in transit.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-primary-500 mr-3 flex-shrink-0 mt-1" size={16} />
                      <span className="text-secondary-700">Use of TLS 1.3 protocol for secure communication channels.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-primary-500 mr-3 flex-shrink-0 mt-1" size={16} />
                      <span className="text-secondary-700">Encrypted, redundant backups to prevent data loss.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <Users className="text-primary-500 mr-3" size={24} />
                    <h3 className="text-xl font-semibold">Empowering Privacy & Control</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="text-primary-500 mr-3 flex-shrink-0 mt-1" size={16} />
                      <span className="text-secondary-700">Fine-grained user and provider access permissions.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-primary-500 mr-3 flex-shrink-0 mt-1" size={16} />
                      <span className="text-secondary-700">Transparent patient consent management with easy-to-use controls.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-primary-500 mr-3 flex-shrink-0 mt-1" size={16} />
                      <span className="text-secondary-700">Immutable audit trails tracking every data access and modification for full accountability.</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Award className="text-primary-500 mr-3" size={24} />
                    Compliance & Industry Certifications
                  </h3>
                  <p className="text-secondary-700 mb-6">
                    DermaSense proudly meets and exceeds healthcare industry standards:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-primary-50 p-4 rounded-lg text-center">
                      <div className="font-semibold mb-2 text-primary-700">HIPAA</div>
                      <p className="text-sm text-secondary-600">Fully HIPAA-compliant to protect US patient data.</p>
                    </div>
                    <div className="bg-primary-50 p-4 rounded-lg text-center">
                      <div className="font-semibold mb-2 text-primary-700">GDPR</div>
                      <p className="text-sm text-secondary-600">GDPR adherence ensuring EU data privacy rights.</p>
                    </div>
                    <div className="bg-primary-50 p-4 rounded-lg text-center">
                      <div className="font-semibold mb-2 text-primary-700">SOC 2 Type II</div>
                      <p className="text-sm text-secondary-600">SOC 2 Type II certification for security and availability.</p>
                    </div>
                    <div className="bg-primary-50 p-4 rounded-lg text-center">
                      <div className="font-semibold mb-2 text-primary-700">ISO 27001</div>
                      <p className="text-sm text-secondary-600">ISO 27001-certified information security management.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                <div className="flex items-center mb-6">
                  <Server className="text-primary-500 mr-3" size={24} />
                  <h3 className="text-xl font-semibold">Multi-Layered Infrastructure Defense</h3>
                </div>
                <p className="text-secondary-700 mb-6">
                  Our infrastructure architecture fortifies your data against internal and external threats with:
                </p>
                
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary-100"></div>
                  
                  <div className="mb-6 relative">
                    <div className="flex">
                      <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white z-10 relative">
                        <Shield size={20} />
                      </div>
                      <div className="ml-6">
                        <h4 className="text-lg font-semibold mb-2">Advanced Security Measures</h4>
                        <p className="text-secondary-700">
                          Advanced firewalls, intrusion detection, and DDoS mitigation.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6 relative">
                    <div className="flex">
                      <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white z-10 relative">
                        <Eye size={20} />
                      </div>
                      <div className="ml-6">
                        <h4 className="text-lg font-semibold mb-2">Continuous Monitoring</h4>
                        <p className="text-secondary-700">
                          Round-the-clock system monitoring coupled with real-time threat alerting.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex">
                      <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white z-10 relative">
                        <Lock size={20} />
                      </div>
                      <div className="ml-6">
                        <h4 className="text-lg font-semibold mb-2">Strict Access Controls</h4>
                        <p className="text-secondary-700">
                          Strict role-based access with mandatory multi-factor authentication for all privileged users.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AISecurityPage;