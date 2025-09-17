import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, FileText, AlertTriangle, Shield, Users, Target } from 'lucide-react';

const features = [
  {
    icon: <Smartphone size={24} />,
    title: 'Multi-Device Integration',
    description: 'Seamlessly works across smartphones, tablets, and desktop devices for comprehensive skin analysis anywhere.',
  },
  {
    icon: <FileText size={24} />,
    title: 'Comprehensive Reports',
    description: 'Detailed analysis reports with visual comparisons, risk assessments, and personalized recommendations.',
  },
  {
    icon: <AlertTriangle size={24} />,
    title: 'Risk Stratification',
    description: 'Advanced AI algorithms categorize skin conditions by risk level, prioritizing urgent cases for immediate attention.',
  },
  {
    icon: <Shield size={24} />,
    title: 'HIPAA/GDPR Compliant',
    description: 'Full compliance with healthcare privacy regulations ensuring your skin health data remains completely secure.',
  },
  {
    icon: <Users size={24} />,
    title: 'Role-Based Interface',
    description: 'Customized interfaces for patients, dermatologists, and healthcare providers with appropriate access levels.',
  },
  {
    icon: <Target size={24} />,
    title: '95% Accuracy Rate',
    description: 'Clinically validated AI technology with industry-leading accuracy in skin condition detection and analysis.',
  },
];

const FeatureSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Medical-Grade AI Technology
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-secondary-700"
          >
            Advanced dermatological AI powered by medical-grade technology for accurate, reliable skin health analysis and monitoring.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-lg bg-primary-100 flex items-center justify-center mb-6">
                <div className="text-primary-500">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-secondary-700">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;