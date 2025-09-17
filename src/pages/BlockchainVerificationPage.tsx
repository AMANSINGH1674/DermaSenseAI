import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, CheckCircle, XCircle, Copy, ArrowRight, Shield, Lock } from 'lucide-react';

const BlockchainVerificationPage: React.FC = () => {
  const [hash, setHash] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'verified' | 'failed'>('idle');
  const [verificationDetails, setVerificationDetails] = useState<any>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hash.trim()) return;
    
    setVerificationStatus('loading');
    
    // Simulate verification process
    setTimeout(() => {
      if (hash.startsWith('0x') && hash.length > 20) {
        setVerificationStatus('verified');
        setVerificationDetails({
          timestamp: new Date().toISOString(),
          blockNumber: Math.floor(Math.random() * 1000000) + 8000000,
          network: 'Ethereum Mainnet',
          recordType: 'Medical Record',
          recordId: `MR-${Math.floor(Math.random() * 10000)}`,
          issuer: 'MedChain Certification Authority'
        });
      } else {
        setVerificationStatus('failed');
        setVerificationDetails(null);
      }
    }, 1500);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(hash);
    // In a real app, you would show a toast notification here
  };

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
            Blockchain Verification
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-secondary-700"
          >
            Verify the integrity and authenticity of health records using our blockchain verification system. Enter a record hash to check its status on the blockchain.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden mb-12"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                  <Database className="text-primary-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold">Verify Record Hash</h2>
              </div>
              
              <form onSubmit={handleVerify}>
                <div className="mb-6">
                  <label htmlFor="hash" className="block text-sm font-medium text-secondary-700 mb-2">
                    Enter Record Hash
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="hash"
                      value={hash}
                      onChange={(e) => setHash(e.target.value)}
                      placeholder="0x1a2b3c4d5e6f..."
                      className="w-full px-4 py-3 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                    {hash && (
                      <button
                        type="button"
                        onClick={handleCopyHash}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-primary-500"
                      >
                        <Copy size={18} />
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-secondary-600">
                    Enter the hash value provided with your medical record.
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={!hash.trim() || verificationStatus === 'loading'}
                  className={`btn-primary w-full flex items-center justify-center ${
                    !hash.trim() || verificationStatus === 'loading' ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {verificationStatus === 'loading' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2" size={18} />
                      Verify on Blockchain
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
          
          {verificationStatus === 'verified' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden mb-12 border-l-4 border-green-500"
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <CheckCircle className="text-green-500" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-green-700">Verification Successful</h2>
                    <p className="text-secondary-700">The record has been verified on the blockchain.</p>
                  </div>
                </div>
                
                <div className="bg-secondary-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Verification Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-secondary-500 mb-1">Record Hash</div>
                      <div className="flex items-center">
                        <span className="text-secondary-800 font-mono text-sm truncate">{hash}</span>
                        <button onClick={handleCopyHash} className="ml-2 text-secondary-500 hover:text-primary-500">
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-secondary-500 mb-1">Timestamp</div>
                      <div className="text-secondary-800">
                        {new Date(verificationDetails.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-secondary-500 mb-1">Block Number</div>
                      <div className="text-secondary-800">{verificationDetails.blockNumber}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-secondary-500 mb-1">Network</div>
                      <div className="text-secondary-800">{verificationDetails.network}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-secondary-500 mb-1">Record Type</div>
                      <div className="text-secondary-800">{verificationDetails.recordType}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-secondary-500 mb-1">Record ID</div>
                      <div className="text-secondary-800">{verificationDetails.recordId}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-secondary-200">
                    <div className="flex items-center">
                      <Shield className="text-green-500 mr-2" size={18} />
                      <span className="text-green-700 font-medium">Certified by {verificationDetails.issuer}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button className="btn-secondary py-2 px-4 text-sm">
                    Download Verification Certificate
                    <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          {verificationStatus === 'failed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden mb-12 border-l-4 border-red-500"
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                    <XCircle className="text-red-500" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-red-700">Verification Failed</h2>
                    <p className="text-secondary-700">The record could not be verified on the blockchain.</p>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-red-700">Possible Reasons</h3>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <XCircle className="text-red-500 mr-2 flex-shrink-0 mt-1" size={16} />
                      <span className="text-secondary-700">The hash may be incorrect or malformed</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="text-red-500 mr-2 flex-shrink-0 mt-1" size={16} />
                      <span className="text-secondary-700">The record may not exist on the blockchain</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="text-red-500 mr-2 flex-shrink-0 mt-1" size={16} />
                      <span className="text-secondary-700">The record may have been tampered with</span>
                    </li>
                  </ul>
                  
                  <div className="mt-4 text-secondary-700">
                    Please check the hash and try again. If the problem persists, contact support.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-primary-50 rounded-xl p-8 border border-primary-100"
          >
            <h2 className="text-2xl font-bold mb-6">How Blockchain Verification Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <Lock className="text-primary-500" size={20} />
                </div>
                <h3 className="text-lg font-semibold mb-2">1. Data Hashing</h3>
                <p className="text-secondary-700">
                  Medical records are hashed using SHA-256 to create a unique digital fingerprint.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <Database className="text-primary-500" size={20} />
                </div>
                <h3 className="text-lg font-semibold mb-2">2. Blockchain Storage</h3>
                <p className="text-secondary-700">
                  The hash is stored on the blockchain, creating an immutable record of the data.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <CheckCircle className="text-primary-500" size={20} />
                </div>
                <h3 className="text-lg font-semibold mb-2">3. Verification</h3>
                <p className="text-secondary-700">
                  The current hash is compared with the stored hash to verify data integrity.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-lg text-secondary-700 mb-6">
                Our blockchain verification system ensures that medical records remain tamper-proof and verifiable at all times.
              </p>
              <a href="/how-it-works" className="btn-secondary inline-flex items-center">
                Learn More About Our Technology
                <ArrowRight className="ml-2" size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainVerificationPage;