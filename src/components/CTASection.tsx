import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Lock } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Transform Your Healthcare Data Security?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white/90 mb-10"
          >
            Join thousands of healthcare providers who trust MedChainAI for secure, 
            efficient, and intelligent health data management.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/login" className="btn bg-white text-primary-600 hover:bg-white/90">
              Get Started Now
              <ArrowRight className="ml-2" size={18} />
            </Link>
            <Link to="/contact" className="btn bg-transparent border border-white text-white hover:bg-white/10">
              Contact Sales
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 flex flex-col md:flex-row justify-center items-center gap-8"
          >
            <div className="flex items-center">
              <Shield className="text-white/80 mr-2" size={20} />
              <span className="text-white/80">HIPAA Compliant</span>
            </div>
            <div className="flex items-center">
              <Lock className="text-white/80 mr-2" size={20} />
              <span className="text-white/80">End-to-End Encryption</span>
            </div>
            <div className="text-white/80">
              No Credit Card Required
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;