import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import BlockchainSection from '../components/BlockchainSection';
import AISection from '../components/AISection';
import CTASection from '../components/CTASection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <BlockchainSection />
      <AISection />
      <CTASection />
    </>
  );
};

export default HomePage;