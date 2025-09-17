import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Lock, Shield, CheckCircle } from 'lucide-react';

const BlockchainSection: React.FC = () => {
  const [activeBlock, setActiveBlock] = useState(1);
  
  const blocks = [
    {
      id: 1,
      title: 'Data Encryption',
      icon: <Lock size={24} />,
      description: 'Patient data is encrypted using AES-256 before being processed for blockchain storage.',
    },
    {
      id: 2,
      title: 'Hash Generation',
      icon: <Shield size={24} />,
      description: 'A unique cryptographic hash is generated for each medical record, ensuring data integrity.',
    },
    {
      id: 3,
      title: 'Blockchain Storage',
      icon: <Database size={24} />,
      description: 'The hash is stored on the blockchain, creating an immutable record of the data without exposing sensitive information.',
    },
    {
      id: 4,
      title: 'Verification',
      icon: <CheckCircle size={24} />,
      description: 'Data can be verified at any time by comparing the current hash with the one stored on the blockchain.',
    },
  ];

  return (
    <section className="py-20 bg-secondary-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Blockchain-Powered Health Records
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-secondary-700"
          >
            Our platform leverages blockchain technology to create tamper-proof medical records that can be securely shared between healthcare providers.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
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
                      src="https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                      alt="Blockchain Technology" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 to-secondary-900/30 flex flex-col justify-end p-6">
                      <div className="mb-6">
                        <h3 className="text-white text-2xl font-bold mb-2">Secure Blockchain Architecture</h3>
                        <p className="text-white/80">Distributed ledger technology ensures data integrity and security</p>
                      </div>
                      
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {[1, 2, 3, 4].map((block) => (
                          <div 
                            key={block} 
                            className={`flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center ${
                              block <= activeBlock ? 'bg-primary-500' : 'bg-white/10'
                            } transition-colors duration-300`}
                          >
                            <div className={block <= activeBlock ? 'text-white' : 'text-white/50'}>
                              <Database size={24} />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="w-full bg-white/10 h-1 rounded-full mt-4">
                        <div 
                          className="bg-primary-500 h-1 rounded-full transition-all duration-500"
                          style={{ width: `${(activeBlock / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
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
            <div className="space-y-6">
              {blocks.map((block) => (
                <div 
                  key={block.id}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    activeBlock === block.id 
                      ? 'bg-white shadow-lg border-l-4 border-primary-500' 
                      : 'bg-white/50 hover:bg-white'
                  }`}
                  onClick={() => setActiveBlock(block.id)}
                >
                  <div className="flex items-start">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                      activeBlock === block.id ? 'bg-primary-100 text-primary-500' : 'bg-secondary-100 text-secondary-500'
                    }`}>
                      {block.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{block.title}</h3>
                      <p className="text-secondary-700">{block.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainSection;