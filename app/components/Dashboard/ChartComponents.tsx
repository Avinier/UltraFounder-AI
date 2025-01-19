import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
         PolarRadiusAxis, Radar} from 'recharts';

         export const PerformanceRadar = ({ showCompetitor }) => {
          const [activeRadar, setActiveRadar] = useState(null);
         
          const data = [
            { metric: 'Engagement', A: 120, B: 110, CompA: 140, CompB: 135 },
            { metric: 'Reach', A: 98, B: 130, CompA: 145, CompB: 140 },
            { metric: 'Clicks', A: 86, B: 130, CompA: 110, CompB: 125 },
            { metric: 'Conversions', A: 99, B: 100, CompA: 115, CompB: 105 },
            { metric: 'Shares', A: 85, B: 90, CompA: 100, CompB: 95 },
          ];
        
          const handleMouseEnter = (platform) => {
            setActiveRadar(platform);
          };
        
          const handleMouseLeave = () => {
            setActiveRadar(null);
          };
        
          return (
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                  <PolarGrid strokeDasharray="3 3" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: '#666', fontSize: 14 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} />
                 
                  <Radar
                    name="Youtube"
                    dataKey="A"
                    stroke="#F0B28A"
                    fill="#F0B28A"
                    fillOpacity={activeRadar && activeRadar !== 'A' ? 0.2 : 0.6}
                    strokeWidth={activeRadar === 'A' ? 3 : 1}
                    onMouseEnter={() => handleMouseEnter('A')}
                    onMouseLeave={handleMouseLeave}
                    animationBegin={0}
                    animationDuration={500}
                    animationEasing="linear"
                  />
                 
                  <Radar
                    name="Instagram"
                    dataKey="B"
                    stroke="#8A8FF0"
                    fill="#8A8FF0"
                    fillOpacity={activeRadar && activeRadar !== 'B' ? 0.2 : 0.6}
                    strokeWidth={activeRadar === 'B' ? 3 : 1}
                    onMouseEnter={() => handleMouseEnter('B')}
                    onMouseLeave={handleMouseLeave}
                    animationBegin={0}
                    animationDuration={500}
                    animationEasing="linear"
                  />
        
                  {showCompetitor && (
                    <>
                      <Radar
                        name="Competitor Youtube"
                        dataKey="CompA"
                        stroke="#FF4D4D"
                        fill="#FF4D4D"
                        fillOpacity={activeRadar && activeRadar !== 'CompA' ? 0.2 : 0.6}
                        strokeWidth={activeRadar === 'CompA' ? 3 : 1}
                        onMouseEnter={() => handleMouseEnter('CompA')}
                        onMouseLeave={handleMouseLeave}
                        animationBegin={0}
                        animationDuration={500}
                        animationEasing="linear"
                      />
                      
                      <Radar
                        name="Competitor Instagram"
                        dataKey="CompB"
                        stroke="#FF8080"
                        fill="#FF8080"
                        fillOpacity={activeRadar && activeRadar !== 'CompB' ? 0.2 : 0.6}
                        strokeWidth={activeRadar === 'CompB' ? 3 : 1}
                        onMouseEnter={() => handleMouseEnter('CompB')}
                        onMouseLeave={handleMouseLeave}
                        animationBegin={0}
                        animationDuration={500}
                        animationEasing="linear"
                      />
                    </>
                  )}
                 
                  <Tooltip
                    animationDuration={200}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '6px',
                      padding: '8px',
                      border: '1px solid #ccc'
                    }}
                  />
                 
                  <Legend
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                    onMouseEnter={(entry) => handleMouseEnter(entry.dataKey)}
                    onMouseLeave={handleMouseLeave}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          );
        };

import {  ComposedChart, Area, Scatter, XAxis, YAxis, 
    CartesianGrid, Tooltip } from 'recharts';

    import React, { useState } from 'react';
    import {
      ResponsiveContainer,
      ComposedChart,
      LineChart,
      Area,
      Scatter,
      Line,
      XAxis,
      YAxis,
      CartesianGrid,
      Tooltip,
      Legend,
      TooltipProps
    } from 'recharts';
    import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
    
    // Types for data structures
    interface TimePatternData {
      time: string;
      engagement: number;
      viral: number;
    }
    
    interface PlatformPerformanceData {
      date: string;
      youtube: number;
      instagram: number;
      reddit: number;
    }
    
    // Custom Tooltip Component
    const CustomTooltip = ({
      active,
      payload,
      label
    }: TooltipProps<ValueType, NameType>) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white/90 rounded-lg p-4 shadow-lg border border-gray-200">
            <p className="font-bold text-gray-700">{label}</p>
            {payload.map((entry, index) => (
              <div 
                key={`tooltip-${index}`} 
                className="text-sm flex justify-between items-center"
                style={{ color: entry.color }}
              >
                <span className="mr-2">{entry.name}:</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat().format(entry.value as number)}
                </span>
              </div>
            ))}
          </div>
        );
      }
      return null;
    };
    
    export const TimePatterns = ({ showCompetitor }) => {
      const [activeType, setActiveType] = useState(null);
    
      const data = [
        { 
          time: '00:00', 
          engagement: 1400, 
          viral: 2200,
          competitorEngagement: 1600,
          competitorViral: 2400
        },
        { 
          time: '04:00', 
          engagement: 2000, 
          viral: 4000,
          competitorEngagement: 2200,
          competitorViral: 4200
        },
        { 
          time: '08:00', 
          engagement: 3000, 
          viral: 6000,
          competitorEngagement: 3200,
          competitorViral: 6200
        },
        { 
          time: '12:00', 
          engagement: 2780, 
          viral: 5400,
          competitorEngagement: 2980,
          competitorViral: 5600
        },
        { 
          time: '16:00', 
          engagement: 1890, 
          viral: 3200,
          competitorEngagement: 2090,
          competitorViral: 3400
        },
        { 
          time: '20:00', 
          engagement: 2390, 
          viral: 4800,
          competitorEngagement: 2590,
          competitorViral: 5000
        },
      ];
    
      const handleMouseEnter = (type) => {
        setActiveType(type);
      };
    
      const handleMouseLeave = () => {
        setActiveType(null);
      };
    
      return (
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E98AF0" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#E98AF0" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="competitorEngagementGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF0000" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF0000" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" opacity={0.8} />
              <XAxis dataKey="time" tick={{ fill: '#666' }} axisLine={{ stroke: '#999' }} />
              <YAxis tick={{ fill: '#666' }} axisLine={{ stroke: '#999' }} />
              
              <Tooltip 
                animationDuration={200}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '6px',
                  padding: '8px',
                  border: '1px solid #ccc'
                }}
              />
              
              <Legend 
                onMouseEnter={(e) => handleMouseEnter(e.dataKey)}
                onMouseLeave={handleMouseLeave}
              />
              
              <Area 
                type="monotone" 
                dataKey="engagement" 
                name="Engagement"
                fill="url(#engagementGradient)"
                stroke="#E98AF0"
                strokeWidth={activeType === 'engagement' ? 3 : 1}
                fillOpacity={activeType === 'viral' ? 0.3 : 1}
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-in-out"
                isAnimationActive={true}
              />
              
              {showCompetitor && (
                <Area 
                  type="monotone" 
                  dataKey="competitorEngagement" 
                  name="Competitor Engagement"
                  fill="url(#competitorEngagementGradient)"
                  stroke="#FF0000"
                  strokeWidth={activeType === 'competitorEngagement' ? 3 : 1}
                  fillOpacity={activeType === 'viral' ? 0.3 : 0.6}
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                  isAnimationActive={true}
                />
              )}
              
              <Scatter 
                dataKey="viral" 
                name="Viral"
                fill="#8A8FF0"
                stroke="#8A8FF0"
                strokeWidth={activeType === 'viral' ? 2 : 0}
                r={activeType === 'viral' ? 8 : 6}
                fillOpacity={activeType === 'engagement' ? 0.3 : 0.8}
                animationBegin={800}
                animationDuration={400}
                isAnimationActive={true}
              />
              
              {showCompetitor && (
                <Scatter 
                  dataKey="competitorViral" 
                  name="Competitor Viral"
                  fill="#FF0000"
                  stroke="#FF0000"
                  strokeWidth={activeType === 'competitorViral' ? 2 : 0}
                  r={activeType === 'competitorViral' ? 8 : 6}
                  fillOpacity={activeType === 'engagement' ? 0.3 : 0.8}
                  animationBegin={800}
                  animationDuration={400}
                  isAnimationActive={true}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      );
    };
    
    export const PlatformPerformance = ({ showCompetitor }) => {
      const [activePlatform, setActivePlatform] = useState(null);
    
      const data = [
        { 
          date: '2024-01', 
          youtube: 4000, 
          instagram: 2400, 
          reddit: 2400,
          competitorYoutube: 4200,
          competitorInstagram: 2600
        },
        { 
          date: '2024-02', 
          youtube: 3000, 
          instagram: 1398, 
          reddit: 2210,
          competitorYoutube: 3200,
          competitorInstagram: 1598
        },
        { 
          date: '2024-03', 
          youtube: 2000, 
          instagram: 9800, 
          reddit: 2290,
          competitorYoutube: 2200,
          competitorInstagram: 10000
        },
        { 
          date: '2024-04', 
          youtube: 2780, 
          instagram: 3908, 
          reddit: 2000,
          competitorYoutube: 2980,
          competitorInstagram: 4108
        },
        { 
          date: '2024-05', 
          youtube: 1890, 
          instagram: 4800, 
          reddit: 2181,
          competitorYoutube: 2090,
          competitorInstagram: 5000
        },
      ];
    
      const handleMouseEnter = (platform) => {
        setActivePlatform(platform);
      };
    
      const handleMouseLeave = () => {
        setActivePlatform(null);
      };
    
      return (
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
              
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#666' }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('default', { month: 'short' });
                }}
              />
              
              <YAxis tick={{ fill: '#666' }} width={40} />
              
              <Tooltip 
                animationDuration={200}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '6px',
                  padding: '8px',
                  border: '1px solid #ccc'
                }}
                formatter={(value) => new Intl.NumberFormat().format(value)}
              />
              
              <Legend 
                onMouseEnter={(e) => handleMouseEnter(e.dataKey)}
                onMouseLeave={handleMouseLeave}
                wrapperStyle={{
                  paddingTop: '12px'
                }}
              />
              
              <Line 
                type="monotone" 
                dataKey="youtube" 
                name="YouTube"
                stroke="#F0B28A"
                strokeWidth={activePlatform === 'youtube' ? 3 : 1.5}
                dot={{ r: activePlatform === 'youtube' ? 5 : 3 }}
                opacity={!activePlatform || activePlatform === 'youtube' ? 1 : 0.3}
                animationBegin={0}
                animationDuration={600}
                animationEasing="ease-in-out"
              />
              
              {showCompetitor && (
                <Line 
                  type="monotone" 
                  dataKey="competitorYoutube" 
                  name="Competitor YouTube"
                  stroke="#FF0000"
                  strokeWidth={activePlatform === 'competitorYoutube' ? 3 : 1.5}
                  dot={{ r: activePlatform === 'competitorYoutube' ? 5 : 3 }}
                  opacity={!activePlatform || activePlatform === 'competitorYoutube' ? 1 : 0.3}
                  animationBegin={0}
                  animationDuration={600}
                  animationEasing="ease-in-out"
                />
              )}
              
              <Line 
                type="monotone" 
                dataKey="instagram" 
                name="Instagram"
                stroke="#8A8FF0"
                strokeWidth={activePlatform === 'instagram' ? 3 : 1.5}
                dot={{ r: activePlatform === 'instagram' ? 5 : 3 }}
                opacity={!activePlatform || activePlatform === 'instagram' ? 1 : 0.3}
                animationBegin={200}
                animationDuration={600}
                animationEasing="ease-in-out"
              />
              
              {showCompetitor && (
                <Line 
                  type="monotone" 
                  dataKey="competitorInstagram" 
                  name="Competitor Instagram"
                  stroke="#FF6666"
                  strokeWidth={activePlatform === 'competitorInstagram' ? 3 : 1.5}
                  dot={{ r: activePlatform === 'competitorInstagram' ? 5 : 3 }}
                  opacity={!activePlatform || activePlatform === 'competitorInstagram' ? 1 : 0.3}
                  animationBegin={200}
                  animationDuration={600}
                  animationEasing="ease-in-out"
                />
              )}
              
              <Line 
                type="monotone" 
                dataKey="reddit" 
                name="Reddit"
                stroke="#E98AF0"
                strokeWidth={activePlatform === 'reddit' ? 3 : 1.5}
                dot={{ r: activePlatform === 'reddit' ? 5 : 3 }}
                opacity={!activePlatform || activePlatform === 'reddit' ? 1 : 0.3}
                animationBegin={400}
                animationDuration={600}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    };

import { BarChart, Bar } from 'recharts';

export const CTAFunnel = ({ showCompetitor }) => {
  const [activeBar, setActiveBar] = useState(null);
  
  const data = [
    { 
      stage: 'Impressions', 
      value: 1000,
      competitorValue: 800
    },
    { 
      stage: 'Clicks', 
      value: 800,
      competitorValue: 600
    },
    { 
      stage: 'Sign-ups', 
      value: 400,
      competitorValue: 300
    },
    { 
      stage: 'Purchases', 
      value: 200,
      competitorValue: 150
    },
    { 
      stage: 'Retention', 
      value: 100,
      competitorValue: 70
    },
  ];

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
        >
          <defs>
            <linearGradient id="funnelGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F0B28A" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#F0D28A" stopOpacity={0.9} />
            </linearGradient>
            <linearGradient id="competitorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF6B6B" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#FF8585" stopOpacity={0.9} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
          
          <XAxis 
            type="number"
            tick={{ fill: '#666' }}
            axisLine={{ stroke: '#999' }}
          />
          
          <YAxis 
            dataKey="stage" 
            type="category"
            tick={{ fill: '#666' }}
            axisLine={{ stroke: '#999' }}
          />
          
          <Tooltip 
            cursor={{ fill: 'rgba(240,178,138,0.1)' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '6px',
              padding: '8px',
              border: '1px solid #ccc'
            }}
          />
          
          <Legend />
          
          <Bar 
            name="Our Metrics"
            dataKey="value" 
            fill="url(#funnelGradient)"
            onMouseEnter={(data, index) => setActiveBar(index)}
            onMouseLeave={() => setActiveBar(null)}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          />
          
          {showCompetitor && (
            <Bar 
              name="Competitor Metrics"
              dataKey="competitorValue" 
              fill="url(#competitorGradient)"
              onMouseEnter={(data, index) => setActiveBar(index)}
              onMouseLeave={() => setActiveBar(null)}
              animationBegin={200}
              animationDuration={800}
              animationEasing="ease-out"
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ROIComparison = ({ showCompetitor }) => {
  const [activeType, setActiveType] = useState(null);
  
  const data = [
    { 
      month: 'Jan', 
      cost: 400, revenue: 600, profit: 200,
      competitorCost: 450, competitorRevenue: 550, competitorProfit: 100
    },
    { 
      month: 'Feb', 
      cost: 300, revenue: 500, profit: 200,
      competitorCost: 350, competitorRevenue: 480, competitorProfit: 130
    },
    { 
      month: 'Mar', 
      cost: 500, revenue: 700, profit: 200,
      competitorCost: 550, competitorRevenue: 680, competitorProfit: 130
    },
    { 
      month: 'Apr', 
      cost: 600, revenue: 900, profit: 300,
      competitorCost: 650, competitorRevenue: 850, competitorProfit: 200
    },
    { 
      month: 'May', 
      cost: 400, revenue: 700, profit: 300,
      competitorCost: 450, competitorRevenue: 650, competitorProfit: 200
    },
  ];

  const handleMouseEnter = (type) => {
    setActiveType(type);
  };

  const handleMouseLeave = () => {
    setActiveType(null);
  };

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#96F0A3" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8AF096" stopOpacity={0.3}/>
            </linearGradient>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F0EC8A" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ECF08A" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="competitorCostGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FF8585" stopOpacity={0.3}/>
            </linearGradient>
            <linearGradient id="competitorProfitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF9999" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FFACAC" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
          
          <XAxis dataKey="month" tick={{ fill: '#666' }} />
          <YAxis tick={{ fill: '#666' }} />
          
          <Tooltip 
            animationDuration={200}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '6px',
              padding: '8px',
              border: '1px solid #ccc'
            }}
          />
          
          <Legend 
            onMouseEnter={(e) => handleMouseEnter(e.dataKey)}
            onMouseLeave={handleMouseLeave}
            wrapperStyle={{ paddingTop: '12px' }}
          />
          
          <Bar 
            name="Our Cost"
            dataKey="cost" 
            fill="url(#costGradient)"
            opacity={!activeType || activeType === 'cost' ? 1 : 0.3}
            animationBegin={0}
            animationDuration={600}
            animationEasing="ease-out"
          />
          
          <Line 
            name="Our Revenue"
            type="monotone" 
            dataKey="revenue" 
            stroke="#8A8FF0"
            strokeWidth={activeType === 'revenue' ? 3 : 1.5}
            dot={{ r: activeType === 'revenue' ? 5 : 3 }}
            opacity={!activeType || activeType === 'revenue' ? 1 : 0.3}
            animationBegin={400}
            animationDuration={600}
            animationEasing="ease-in-out"
          />
          
          <Area 
            name="Our Profit"
            type="monotone" 
            dataKey="profit" 
            fill="url(#profitGradient)"
            stroke="#ECF08A"
            strokeWidth={activeType === 'profit' ? 2 : 1}
            fillOpacity={activeType === 'profit' ? 1 : !activeType ? 0.8 : 0.3}
            animationBegin={800}
            animationDuration={600}
            animationEasing="ease-in-out"
          />

          {showCompetitor && (
            <>
              <Bar 
                name="Competitor Cost"
                dataKey="competitorCost" 
                fill="url(#competitorCostGradient)"
                opacity={!activeType || activeType === 'competitorCost' ? 1 : 0.3}
                animationBegin={200}
                animationDuration={600}
                animationEasing="ease-out"
              />
              
              <Line 
                name="Competitor Revenue"
                type="monotone" 
                dataKey="competitorRevenue" 
                stroke="#FF4D4D"
                strokeWidth={activeType === 'competitorRevenue' ? 3 : 1.5}
                dot={{ r: activeType === 'competitorRevenue' ? 5 : 3 }}
                opacity={!activeType || activeType === 'competitorRevenue' ? 1 : 0.3}
                animationBegin={600}
                animationDuration={600}
                animationEasing="ease-in-out"
              />
              
              <Area 
                name="Competitor Profit"
                type="monotone" 
                dataKey="competitorProfit" 
                fill="url(#competitorProfitGradient)"
                stroke="#FF6666"
                strokeWidth={activeType === 'competitorProfit' ? 2 : 1}
                fillOpacity={activeType === 'competitorProfit' ? 1 : !activeType ? 0.8 : 0.3}
                animationBegin={1000}
                animationDuration={600}
                animationEasing="ease-in-out"
              />
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
