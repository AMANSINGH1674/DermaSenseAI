import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Shield, Database, Brain } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, error } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Remove the useEffect that opens dashboard in a new tab
  // The redirection is now handled by authStore's redirectAfterSignIn
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!name.trim()) {
          setFormError('Name is required');
          return;
        }
        await signUp(email, password, name, role);
      }
      // Navigation handled by store redirect on success or user effect
    } catch (err) {
      setFormError((err as Error).message);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-secondary-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Left Side - Form */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-1/2 p-8 md:p-12"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-secondary-600">
                  {isLogin 
                    ? 'Sign in to access your secure health data dashboard' 
                    : 'Join MedChainAI for secure health data management'}
                </p>
              </div>
              
              {(formError || error) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {formError || error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <div className="mb-6">
                      <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="text-secondary-400" size={20} />
                        </div>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Account Type
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setRole('patient')}
                          className={`p-4 rounded-lg border ${
                            role === 'patient'
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-secondary-200 hover:border-primary-300'
                          } transition-colors`}
                        >
                          <User className="mx-auto mb-2" size={24} />
                          <div className="font-medium">Patient</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('doctor')}
                          className={`p-4 rounded-lg border ${
                            role === 'doctor'
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-secondary-200 hover:border-primary-300'
                          } transition-colors`}
                        >
                          <User className="mx-auto mb-2" size={24} />
                          <div className="font-medium">Doctor</div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-secondary-400" size={20} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
                      Password
                    </label>
                    {isLogin && (
                      <a href="#" className="text-sm text-primary-500 hover:text-primary-600">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="text-secondary-400" size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn-primary w-full mb-6"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>
                
                <div className="text-center">
                  <p className="text-secondary-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="ml-2 text-primary-500 font-medium hover:text-primary-600"
                    >
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </form>
            </motion.div>
            
            {/* Right Side - Image and Info */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-1/2 bg-primary-600 p-12 flex items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-400 to-primary-700"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-300 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-300 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10 text-white max-w-md">
                <div className="mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                    <Database className="text-white" size={32} />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Secure Health Data Platform</h2>
                  <p className="text-white/80 mb-6">
                    MedChainAI combines blockchain security with AI-powered analytics to revolutionize how healthcare data is stored, shared, and analyzed.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                      <Shield className="text-white" size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">HIPAA Compliant</h3>
                      <p className="text-white/70 text-sm">
                        Fully compliant with healthcare privacy regulations
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                      <Database className="text-white" size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Blockchain Verified</h3>
                      <p className="text-white/70 text-sm">
                        Immutable records with cryptographic verification
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                      <Brain className="text-white" size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">AI-Powered Insights</h3>
                      <p className="text-white/70 text-sm">
                        Advanced anomaly detection for early health warnings
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;