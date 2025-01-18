import React, { useState, useEffect } from 'react';
import { PerformanceRadar } from './ChartComponents';
import { TimePatterns } from './ChartComponents';
import { PlatformPerformance } from './ChartComponents';
import { CTAFunnel } from './ChartComponents';
import { ROIComparison } from './ChartComponents';
import Background from '../UI/Background';
import GlassContainer from '../UI/GlassContainer';

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

const AnalyticsDashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <Background className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-subheading text-gray-900 mb-8 transition-all duration-500
          ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          ART Finder Analytics
        </h1>
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          {/* Performance Metrics */}
          <div className="lg:col-span-2">
            <DashboardCard title="Platform Performance Trends" delay={100}>
              <PlatformPerformance />
            </DashboardCard>
          </div>
         
          {/* Radar Chart */}
          <div className="lg:col-span-1">
            <DashboardCard title="Performance Metrics" delay={300}>
              <PerformanceRadar />
            </DashboardCard>
          </div>
         
          {/* ROI Comparison */}
          <div className="lg:col-span-2">
            <DashboardCard title="ROI Analysis" delay={500}>
              <ROIComparison />
            </DashboardCard>
          </div>
         
          {/* CTA Funnel */}
          <div className="lg:col-span-1">
            <DashboardCard title="Conversion Funnel" delay={700}>
              <CTAFunnel />
            </DashboardCard>
          </div>
         
          {/* Time Patterns */}
          <div className="lg:col-span-3">
            <DashboardCard title="Engagement Patterns Over Time" delay={900}>
              <TimePatterns />
            </DashboardCard>
          </div>
        </div>
      </div>
    </Background>
  );
};

export default AnalyticsDashboard;