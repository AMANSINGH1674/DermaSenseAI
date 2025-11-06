import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  FileText, 
  User, 
  Calendar, 
  Bell, 
  Settings, 
  PieChart, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Droplet,
  Thermometer,
  Brain,
  Shield,
  Lock,
  Database,
  Search,
  Copy,
  ArrowRight,
  Server,
  Eye,
  LogOut
} from 'lucide-react';
import CalendarModal from '../components/CalendarModal';
import ChatInterface from '../components/ChatInterface';
import { useAuthStore } from '../store/authStore';
import { UserProfile } from '../components/UserProfile';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const { signOut, user, profile } = useAuthStore();
  
  // Mock data for the dashboard
  const healthMetrics = [
    { 
      name: 'Skin Health Score', 
      value: '92/100', 
      change: '+5', 
      status: 'excellent',
      icon: <Heart size={18} />,
      color: 'text-primary-500'
    },
    { 
      name: 'Mole Analysis', 
      value: 'No Concerns', 
      change: '0', 
      status: 'normal',
      icon: <Activity size={18} />,
      color: 'text-primary-500'
    },
    { 
      name: 'Hydration Level', 
      value: 'Good', 
      change: '+2', 
      status: 'normal',
      icon: <Droplet size={18} />,
      color: 'text-primary-500'
    },
    { 
      name: 'UV Exposure', 
      value: 'Low Risk', 
      change: '-1', 
      status: 'normal',
      icon: <Thermometer size={18} />,
      color: 'text-primary-500'
    }
  ];
  
  const recentRecords = [
    {
      id: 'DS-8294',
      title: 'AI Skin Analysis - Face Scan',
      date: '2025-03-15',
      provider: 'DermaSense AI',
      status: 'verified',
      hash: '0x7a9d8f3c2b1e0a4d5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z'
    },
    {
      id: 'DS-7651',
      title: 'Mole Detection Analysis',
      date: '2025-02-28',
      provider: 'DermaSense AI',
      status: 'verified',
      hash: '0x8b2e9f4d3c1a0b5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z'
    },
    {
      id: 'DS-6543',
      title: 'Skin Health Assessment',
      date: '2025-02-10',
      provider: 'Dr. Sarah Johnson',
      status: 'verified',
      hash: '0x9c3f0e1d2b4a5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c'
    }
  ];
  
  const notifications = [
    {
      id: 1,
      type: 'alert',
      message: 'New mole detected - requires attention',
      time: '2 hours ago',
      icon: <AlertTriangle size={16} className="text-amber-500" />
    },
    {
      id: 2,
      type: 'info',
      message: 'Skin analysis completed successfully',
      time: '1 day ago',
      icon: <CheckCircle size={16} className="text-green-500" />
    },
    {
      id: 3,
      type: 'reminder',
      message: 'Upcoming dermatology appointment',
      time: '2 days ago',
      icon: <Clock size={16} className="text-primary-500" />
    }
  ];
  
  const aiInsights = [
    {
      title: 'Skin Hydration Analysis',
      description: 'Your skin hydration levels have improved significantly over the past month.',
      recommendation: 'Continue your current skincare routine for optimal hydration.',
      confidence: 92
    },
    {
      title: 'UV Damage Assessment',
      description: 'Minimal UV damage detected. Your sun protection habits are effective.',
      recommendation: 'Maintain consistent sunscreen application and sun protection measures.',
      confidence: 88
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary-50">
      {/* Custom header with logout button */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center mr-2">
            <Activity className="text-white" size={24} />
          </div>
          <span className="text-xl font-display font-bold text-secondary-900">Derma<span className="text-primary-500">SenseAI</span></span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </header>
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">DermaSenseAI Dashboard</h1>
              <p className="text-secondary-600">Welcome back, {profile?.full_name || (user as any)?.user_metadata?.full_name || user?.email || 'there'}</p>
            </div>
            
            <div className="flex space-x-4 mt-4 md:mt-0">
              <button className="btn-secondary py-2 px-4 flex items-center">
                <Bell size={18} className="mr-2" />
                Notifications
                <span className="ml-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="btn-primary py-2 px-4 flex items-center">
                <FileText size={18} className="mr-2" />
                New Record
              </button>
            </div>
          </motion.div>
          
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <ChatInterface />
          </motion.div>
          
          {/* Dashboard Navigation removed per request */}
          
          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Health Metrics */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Skin Health Metrics</h2>
                  <Link to="/metrics" className="text-primary-500 text-sm font-medium hover:text-primary-600">
                    View All
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {healthMetrics.map((metric, index) => (
                    <div key={index} className="bg-secondary-50 rounded-lg p-4 flex items-center">
                      <div className={`w-10 h-10 rounded-full ${metric.status === 'normal' ? 'bg-primary-100' : 'bg-amber-100'} flex items-center justify-center mr-4`}>
                        <div className={metric.color}>
                          {metric.icon}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-secondary-600">{metric.name}</div>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold mr-2">{metric.value}</span>
                          <span className={`text-xs ${metric.change.startsWith('+') ? 'text-green-500' : metric.change.startsWith('-') ? 'text-red-500' : 'text-secondary-500'}`}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Recent Health Records */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Recent Skin Analysis</h2>
                  <Link to="/records" className="text-primary-500 text-sm font-medium hover:text-primary-600">
                    View All
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-secondary-100">
                        <th className="py-3 px-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">ID</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Title</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Date</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Provider</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRecords.map((record, index) => (
                        <tr key={index} className="border-b border-secondary-100 hover:bg-secondary-50">
                          <td className="py-4 px-4 text-sm font-medium text-secondary-900">{record.id}</td>
                          <td className="py-4 px-4 text-sm text-secondary-800">{record.title}</td>
                          <td className="py-4 px-4 text-sm text-secondary-600">{record.date}</td>
                          <td className="py-4 px-4 text-sm text-secondary-600">{record.provider}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" />
                              {record.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm">
                            <div className="flex space-x-2">
                              <button className="text-primary-500 hover:text-primary-600">View</button>
                              <button className="text-secondary-500 hover:text-secondary-600">Verify</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
              
              {/* AI Insights */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">AI Skin Insights</h2>
                  <Link to="/ai-insights" className="text-primary-500 text-sm font-medium hover:text-primary-600">
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="bg-primary-50 rounded-lg p-5 border border-primary-100">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4 mt-1">
                          <Brain className="text-primary-500" size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
                          <p className="text-secondary-700 mb-3">{insight.description}</p>
                          <div className="bg-white rounded-lg p-3 mb-3">
                            <div className="flex items-center">
                              <CheckCircle className="text-green-500 mr-2" size={16} />
                              <span className="text-secondary-800 font-medium">Recommendation:</span>
                            </div>
                            <p className="text-secondary-700 mt-1">{insight.recommendation}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-secondary-600">AI Confidence Score</span>
                            <span className="text-xs font-medium text-primary-600">{insight.confidence}%</span>
                          </div>
                          <div className="w-full bg-secondary-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-primary-500 h-1.5 rounded-full" 
                              style={{ width: `${insight.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* User Profile Card */}
              <UserProfile />
              
              {/* Upcoming Appointments */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-bold mb-4">Upcoming Appointments</h3>
                
                <div className="bg-primary-50 rounded-lg p-4 border border-primary-100 mb-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <Calendar className="text-primary-500" size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium">Dermatology Consultation</h4>
                      <p className="text-sm text-secondary-600 mb-1">Dr. Sarah Johnson</p>
                      <p className="text-sm text-secondary-600">March 28, 2025 - 10:30 AM</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <button 
                    onClick={() => setIsCalendarModalOpen(true)}
                    className="text-primary-500 text-sm font-medium hover:text-primary-600"
                  >
                    Schedule New Appointment
                  </button>
                </div>
              </motion.div>
              
              {/* Notifications */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Notifications</h3>
                  <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                    {notifications.length} New
                  </span>
                </div>
                
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start p-3 rounded-lg hover:bg-secondary-50">
                      <div className="mr-3 mt-0.5">
                        {notification.icon}
                      </div>
                      <div>
                        <p className="text-secondary-800 text-sm">{notification.message}</p>
                        <p className="text-secondary-500 text-xs mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <button className="text-primary-500 text-sm font-medium hover:text-primary-600">
                    View All Notifications
                  </button>
                </div>
              </motion.div>
              
              {/* Blockchain Verification */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration:  0.5, delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-bold mb-4">Blockchain Verification</h3>
                
                <p className="text-sm text-secondary-700 mb-4">
                  Verify the integrity of your skin analysis records using our blockchain verification system.
                </p>
                
                <Link to="/blockchain-verification" className="btn-primary w-full py-2 text-center">
                  Verify Analysis
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;