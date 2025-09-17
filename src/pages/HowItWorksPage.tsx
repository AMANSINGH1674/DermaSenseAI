import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Lock, Brain, Database, Users, ArrowRight, Smartphone, Shield, Target, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: <Camera size={24} />,
    title: 'Image Capture & Data Input',
    description: 'Users capture skin lesion images using smartphones or dermatoscope devices. DermaSense also integrates with clinical photography systems to gather high-quality dermatological images.',
    details: 'Our platform supports seamless integration with mobile apps and web portals, providing an intuitive workflow for healthcare workers, clinicians, and patients.',
    features: [
      'Smartphone camera integration',
      'Dermatoscope device support',
      'Clinical photography systems',
      'Mobile and web portal access'
    ]
  },
  {
    icon: <Lock size={24} />,
    title: 'Secure Image Processing',
    description: 'All images and accompanying patient metadata are encrypted using AES-256 encryption before being securely uploaded to our processing servers.',
    details: 'Our secure pipeline ensures data privacy and compliance with healthcare standards such as HIPAA and GDPR, with multi-layer security to protect sensitive health information throughout the analysis.',
    features: [
      'AES-256 encryption',
      'HIPAA compliance',
      'GDPR compliance',
      'Multi-layer security'
    ]
  },
  {
    icon: <Brain size={24} />,
    title: 'AI-Powered Dermatology Analysis',
    description: 'Leveraging Google\'s MedGemma multimodal AI model, DermaSense analyzes the encrypted skin images to identify and classify over 20 common dermatological conditions.',
    details: 'The AI provides confidence scores and risk stratification (Urgent, Soon, Routine) helping healthcare providers prioritize cases effectively. Explainable AI features generate visual heatmaps pinpointing diagnostic regions, enhancing trust and clinical decision support.',
    features: [
      'Google MedGemma AI model',
      '20+ dermatological conditions',
      'Confidence scoring',
      'Risk stratification (Urgent/Soon/Routine)',
      'Visual heatmaps',
      'Explainable AI features'
    ]
  },
  {
    icon: <Target size={24} />,
    title: 'Intelligent Diagnostic Insights',
    description: 'Advanced pattern recognition and anomaly detection provide comprehensive diagnostic insights for healthcare providers.',
    details: 'DermaSense identifies typical skin condition patterns by comparing lesion characteristics with patient history and demographics. The AI flags unusual or atypical skin manifestations that may indicate serious conditions requiring urgent attention. Predictive analytics estimate potential disease progression or complications based on current image and patient data.',
    features: [
      'Pattern Recognition',
      'Anomaly Detection',
      'Risk Forecasting',
      'Patient history integration',
      'Demographic analysis'
    ]
  },
  {
    icon: <Database size={24} />,
    title: 'Secure Data Management & Audit Trail',
    description: 'DermaSense stores anonymized diagnostic data securely in encrypted cloud storage with full audit trails.',
    details: 'Each diagnostic event is logged immutably, ensuring transparency and accountability. Role-based access control allows healthcare professionals and patients to securely access diagnostic reports and follow-up recommendations. Access attempts and data usage are meticulously logged for regulatory compliance and auditing.',
    features: [
      'Encrypted cloud storage',
      'Immutable audit trails',
      'Role-based access control',
      'Regulatory compliance',
      'Transparency and accountability'
    ]
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Continuous Model Improvement',
    description: 'Our AI system continuously learns from anonymized image datasets and clinical feedback to enhance diagnostic accuracy and broaden condition coverage.',
    details: 'The platform incorporates feedback from healthcare providers and clinical outcomes to improve AI model performance. Regular updates ensure the system stays current with the latest dermatological research and diagnostic techniques.',
    features: [
      'Continuous learning',
      'Clinical feedback integration',
      'Performance improvement',
      'Research updates',
      'Expanded condition coverage'
    ]
  }
];

const HowItWorksPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            How Derma<span className="text-primary-500">Sense</span> Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-secondary-700"
          >
            DermaSense combines advanced AI-powered dermatological image analysis with secure data management to deliver rapid, accurate, and explainable preliminary skin condition diagnoses. Our platform is designed to be accessible in diverse healthcare settings, including underserved regions and telemedicine.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="mb-12 relative"
            >
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-primary-100"></div>
              )}
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white z-10 relative">
                    {step.icon}
                  </div>
                </div>
                
                <div className="ml-8">
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-lg text-secondary-700 mb-4">{step.description}</p>
                  
                  <div className="glass-card p-6 bg-white/50">
                    <p className="text-secondary-700 mb-4">{step.details}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-secondary-600">
                          <div className="w-2 h-2 rounded-full bg-primary-500 mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {index === 2 && (
                    <div className="mt-8 bg-primary-50 rounded-xl p-6 border border-primary-100">
                      <h4 className="flex items-center text-lg font-semibold mb-3">
                        <Brain className="text-primary-500 mr-2" size={20} />
                        AI Dermatology Analysis in Action
                      </h4>
                      <p className="text-secondary-700 mb-4">
                        Our MedGemma AI model analyzes skin images with clinical-grade accuracy, providing detailed insights and risk assessments for healthcare providers.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="font-semibold mb-1">Visual Heatmaps</div>
                          <p className="text-sm text-secondary-600">Pinpoint diagnostic regions with explainable AI visualization</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="font-semibold mb-1">Risk Stratification</div>
                          <p className="text-sm text-secondary-600">Categorize cases as Urgent, Soon, or Routine for prioritization</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="font-semibold mb-1">Confidence Scoring</div>
                          <p className="text-sm text-secondary-600">Provide confidence levels for each diagnostic assessment</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6">Ready to Experience AI-Powered Dermatology?</h3>
            <a href="/login" className="btn-primary inline-flex items-center">
              Get Started Now
              <ArrowRight className="ml-2" size={18} />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;