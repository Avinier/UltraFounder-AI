import React, { useState, useEffect } from 'react';
import { PerformanceRadar } from './ChartComponents';
import { TimePatterns } from './ChartComponents';
import { PlatformPerformance } from './ChartComponents';
import { CTAFunnel } from './ChartComponents';
import { ROIComparison } from './ChartComponents';
import Background from '../UI/Background';
import GlassContainer from '../UI/GlassContainer';
import { AnimatePresence, motion } from 'framer-motion';
import GlowingInput from '../UI/GlowingInput';

const DashboardCard = ({ title, children, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <GlassContainer
      className={`rounded-lg shadow-lg p-4 transition-all duration-500 font-subheading hover:shadow-xl transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
    >
      <h3 className={`text-lg font-semibold mb-4 text-gray-800 transition-all duration-500 delay-200
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
        {title}
      </h3>
      <div className={`transition-all duration-500 delay-300
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
        {children}
      </div>
    </GlassContainer>
  );
};

const Modal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()} // Prevent modal close on content click
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6"
      >
        <h2 className="text-2xl font-semibold mb-4">Instagram Post Ideas</h2>
        <p className="mb-4">
          📸 **Post Idea:** "The Perfect Brew"  
          Share a story showcasing the brewing process of your premium coffee, focusing on the rich aroma and the art of pouring.
        </p>
        <p className="mb-4">
          ✍️ **Caption Skeleton:**  
          "Start your day right with our signature [Coffee Name]! ☕️  
          Experience the perfect blend of flavor and aroma, crafted to elevate your mornings.  
          #PremiumCoffee #BrewedToPerfection #CoffeeLovers #MorningVibes #ArtisanBlend"
        </p>
        <p className="mb-4">
          🎯 **Hashtags:**  
          #SpecialtyCoffee #CraftCoffee #CoffeeTime #CoffeeCulture #DailyBrew #CoffeeArt
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-sky-600 text-white font-semibold shadow-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};


const GenerateButton = ({ onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative
        px-6 
        py-3 
        rounded-lg
        font-semibold
        text-white
        bg-gradient-to-r 
        from-blue-600 
        via-blue-500 
        to-sky-500
        transition-all 
        duration-300
        transform
        hover:scale-102
        hover:brightness-110
        focus:outline-none
        focus:ring-2
        focus:ring-blue-400
        focus:ring-opacity-50
        shadow-lg
        group
        ${isActive ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
      `}
    >
      <span className="relative z-10">
        Generate Posts
      </span>
      {/* Constant subtle glow */}
      <div
        className="
          absolute 
          inset-0 
          rounded-lg
          opacity-40
          transition-opacity
          duration-300
          bg-gradient-to-r 
          from-blue-600 
          via-blue-500 
          to-sky-500
          blur-md
          -z-10
        "
      />
      {/* Additional glow on hover */}
      <div
        className="
          absolute 
          inset-0 
          rounded-lg
          opacity-0
          group-hover:opacity-20
          transition-opacity
          duration-300
          bg-gradient-to-r 
          from-blue-600 
          via-blue-500 
          to-sky-500
          blur-xl
          -z-10
        "
      />
    </button>
  );
};

const CompetitorButton = ({ onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative
        px-6 
        py-3 
        rounded-lg
        font-semibold
        text-white
        bg-gradient-to-r 
        from-red-600 
        via-red-500 
        to-rose-500
        transition-all 
        duration-300
        transform
        hover:scale-102
        hover:brightness-110
        focus:outline-none
        focus:ring-2
        focus:ring-red-400
        focus:ring-opacity-50
        shadow-lg
        group
        ${isActive ? 'ring-2 ring-red-400 ring-opacity-50' : ''}
      `}
    >
      <span className="relative z-10">
        Competitor Analysis
      </span>
      {/* Constant subtle glow */}
      <div
        className="
          absolute 
          inset-0 
          rounded-lg
          opacity-40
          transition-opacity
          duration-300
          bg-gradient-to-r 
          from-red-600 
          via-red-500 
          to-rose-500
          blur-md
          -z-10
        "
      />
      {/* Additional glow on hover */}
      <div
        className="
          absolute 
          inset-0 
          rounded-lg
          opacity-0
          group-hover:opacity-20
          transition-opacity
          duration-300
          bg-gradient-to-r 
          from-red-600 
          via-red-500 
          to-rose-500
          blur-xl
          -z-10
        "
      />
    </button>
  );
};

const AnalyticsDashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCompetitor, setShowCompetitor] = useState(false);
  const [showGeneration, setShowGeneration] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <Background className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className={`text-3xl font-subheading text-gray-900 mb-4 md:mb-0 transition-all duration-500
            ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            ARTGuru Analytics
          </h1>
          <div className={`transition-all duration-500 delay-100
            ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <CompetitorButton 
              onClick={() => setShowCompetitor(!showCompetitor)}
              isActive={showCompetitor}
            />
          </div>
          <div className={`transition-all duration-500 delay-100
            ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <GenerateButton
              onClick={() => setShowGeneration(true)}
              isActive={showGeneration}
            />
          </div>
        </div>
        <AnimatePresence>
        {showCompetitor && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut"
            }}
            className="font-subheading text-md text-red-600 text-center my-10"
          >
            We outperform competitors with 25% higher YouTube impressions and better retention. 
            Despite their higher ad spend on Instagram, we achieve greater revenue ($900 vs $850 peak) 
            and stronger profits ($200-300 vs $130-200 monthly). Our marketing shows superior ROI 
            and customer retention across both platforms.
          </motion.div>
        )}
      </AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          {/* Performance Metrics */}
          <div className="lg:col-span-2">
            <DashboardCard title="Platform Performance Trends" delay={100}>
              <PlatformPerformance showCompetitor={showCompetitor} />
            </DashboardCard>
          </div>
          
          {/* Radar Chart */}
          <div className="lg:col-span-1">
            <DashboardCard title="Performance Metrics" delay={300}>
              <PerformanceRadar showCompetitor={showCompetitor} />
            </DashboardCard>
          </div>
          
          {/* ROI Comparison */}
          <div className="lg:col-span-2">
            <DashboardCard title="ROI Analysis" delay={500}>
              <ROIComparison showCompetitor={showCompetitor} />
            </DashboardCard>
          </div>
          
          {/* CTA Funnel */}
          <div className="lg:col-span-1">
            <DashboardCard title="Conversion Funnel" delay={700}>
              <CTAFunnel showCompetitor={showCompetitor} />
            </DashboardCard>
          </div>
          
          {/* Time Patterns */}
          <div className="lg:col-span-3">
            <DashboardCard title="Engagement Patterns Over Time" delay={900}>
              <TimePatterns showCompetitor={showCompetitor} />
            </DashboardCard>
          </div>
        </div>
      </div>
      {showGeneration && <Modal onClose={() => setShowGeneration(false)} />}
    </Background>
  );
};

export default AnalyticsDashboard;