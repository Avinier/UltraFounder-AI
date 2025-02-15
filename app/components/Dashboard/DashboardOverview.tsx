import React, { useState } from 'react';
import { Link } from '@remix-run/react';
import { AlertCircle, Target, TrendingUp, Atom, MessageCircle } from 'lucide-react';
import GlowingInput from '../UI/GlowingInput';
import GlowingButton from "../UI/GlowingInput";

interface TopResearchFinds {
  id: number;
  source: string;
  text: string;
  frequency: number;
}

interface Challenge {
  id: number;
  type: string;
  text: string;
  strength: number;
}

interface StrategicInsight {
  id: number;
  category: string;
  text: string;
}

interface TopResearchFindsComponentProps {
  data: TopResearchFinds[];
}

interface ChallengesFacedComponentProps {
  data: Challenge[];
}

interface StrategicComponentProps {
  data: StrategicInsight[];
}

interface DashboardCardItem {
  id: number;
  type: string;
  height: string;
  width?: string;
  data: any; // TODO: Define a more specific type for the data
}

interface DashboardOverviewProps {
  items: DashboardCardItem[];
}

const DeepResearchComponent = () => {
    return (
        <Link to="/dashboard" className="h-full w-full">
            <div className="space-y-5 p-4 w-full h-full">
                <div className="flex items-center gap-2 mb-4">
                    <Atom className="w-6 h-6 text-lilac" />
                    <h3 className="text-lg font-semibold text-grey/80">Deep Research</h3>
                </div>
                <div className="flex  pb-2 w-full h-full items-center justify-center">
                    <p className="text-grey/90">Explore in-depth analysis and insights.</p>
                </div>
            </div>
        </Link>

    );
};

const ChatComponent = () => {
  return (
    <Link to="/chat" className="h-full w-full">
      <div className="space-y-4 p-4 h-full w-full">
        <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-6 h-6 text-portage" />
            <h3 className="text-lg font-semibold text-grey/80">Chat</h3>
        </div>
        <div className="w-full h-full items-center justify-center flex">
            <p className="text-grey/90">Click here to go to the chat</p>
        </div>
      </div>
    </Link>
  );
};

const TopResearchFindsComponent = ({ data }: TopResearchFindsComponentProps) => {
  return (
    <div className="space-y-5 p-4 w-full">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-6 h-6 text-lilac" />
        <h3 className="text-lg font-semibold text-grey/80">Top Research Finds</h3>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 w-full">
        {data.map(point => (
          <div key={point.id}
            className="min-w-[300px] p-4 backdrop-blur-xl bg-white/10 rounded-xl border border-lilac/30 
            hover:border-lilac/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-lilac">{point.source}</span>
              <span className="px-3 py-1 bg-lilac/10 text-lilac rounded-full text-sm border border-lilac/20">
                {point.frequency}%
              </span>
            </div>
            <p className="text-grey/90">{point.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChallengesFacedComponent = ({ data }: ChallengesFacedComponentProps) => {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-6 h-6 text-sulu" />
        <h3 className="text-lg font-semibold text-grey/80">Challenges Faced</h3>
      </div>
      <div className="space-y-4">
        {data.map(trigger => (
          <div key={trigger.id} className="flex items-center gap-4 p-3 backdrop-blur-xl bg-white/5 rounded-xl
            border border-sulu/20 hover:border-sulu/40 transition-all duration-300">
            <div className="w-24 text-sm font-medium text-sulu">{trigger.type}</div>
            <div className="flex-1">
              <div className="w-full bg-white/10 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-sulu/40 to-sulu h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${trigger.strength * 100}%` }}
                />
              </div>
            </div>
            <div className="w-32 text-sm text-grey/80">{trigger.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StrategicComponent = ({ data }: StrategicComponentProps) => {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-portage" />
        <h3 className="text-lg font-semibold text-grey/80">Product Development Insights</h3>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {data.map(insight => (
          <div key={insight.id}
            className="p-4 backdrop-blur-xl bg-white/10 rounded-xl border border-portage/30 
            hover:border-portage/50 transition-all duration-300">
            <div className="text-sm font-medium text-portage mb-2">
              {insight.category}
            </div>
            <p className="text-grey/90">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardCard = ({ item }: { item: DashboardCardItem }) => {
  const [isFocused, setIsFocused] = useState(false);

  const getComponent = () => {
    switch(item.type) {
      case 'topResearchFinds':
        return <TopResearchFindsComponent data={item.data} />;
      case 'challengesFaced':
        return <ChallengesFacedComponent data={item.data} />;
      case 'productDevelopmentInsights':
        return <StrategicComponent data={item.data} />;
      case 'deepResearch':
        return <DeepResearchComponent />;
      case 'chat':
        return <ChatComponent/>
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        relative
        break-inside-avoid
        ${item.height}
        backdrop-blur-xl
        bg-white/20
        rounded-xl
        border
        border-white/40
        transition-all
        duration-500
        before:absolute
        before:inset-0
        before:backdrop-blur-xl
        before:bg-white/5
        before:rounded-xl
        before:-z-10
        block
        mb-6
        overflow-hidden
        font-subheading
        ${item.width || ''}
        ${isFocused ? 'shadow-[0_0_25px_rgba(255,255,255,0.6)] border-white/60' : 'hover:border-white/50 hover:bg-white/20'}
      `}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      {getComponent()}
    </div>
  );
};

const DashboardOverview = () => {
  const items: DashboardCardItem[] = [
    {
        id: 5,
        type: 'deepResearch',
        height: 'h-64',
        width: 'col-span-2',
        data: []
    },
    {
        id: 6,
        type: 'chat',
        height: 'h-64',
        width: 'col-span-1',
        data: []
    },
    {
      id: 3,
      type: 'challengesFaced',
      height: 'min-h-72',
      width: 'col-span-1',
      data: [
        { id: 1, type: 'Financial', text: 'Limited access to funding and resources', strength: 0.9 },
        { id: 2, type: 'Operational', text: 'Managing all aspects of the business independently', strength: 0.85 },
        { id: 3, type: 'Personal', text: 'Maintaining work-life balance and avoiding burnout', strength: 0.8 }
      ]
    },
    {
      id: 1,
      type: 'topResearchFinds',
      height: 'h-64',
      width: 'col-span-2',
      data: [
        { id: 1, source: 'User Interviews', text: "Solo founders struggle with prioritizing tasks and managing their time effectively.", frequency: 85 },
        { id: 2, source: 'Industry Reports', text: "Many solo founders feel isolated and lack a strong support network.", frequency: 78 },
        { id: 3, source: 'Founder Surveys', text: "Solo founders often face difficulties in acquiring funding and attracting investors.", frequency: 72 }
      ]
    },
    {
      id: 2,
      type: 'productDevelopmentInsights',
      height: 'h-[400px]',
      width: 'col-span-3',
      data: [
        { id: 1, category: 'Market Analysis', text: 'Identify niche markets with unmet needs to focus product development efforts.' },
        { id: 2, category: 'User Feedback', text: 'Gather continuous user feedback to iterate and improve product features.' },
        { id: 3, category: 'Competitive Analysis', text: 'Analyze competitor products to identify opportunities for differentiation and innovation.' },
        { id: 4, category: 'Technology Trends', text: 'Stay updated with the latest technology trends to leverage them in product development.' }
      ]
    },

  ];

  return (
    <div className="
      w-[90vw]
      h-[90vh]
      mx-auto
      my-8
      border
      border-white
      rounded-lg
      backdrop-blur-xl
      bg-background/60
      shadow-[0_0_25px_rgba(255,255,255,0.6)]
      border-white/60
      overflow-auto
    ">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center font-subheading text-grey/80">
          Overview
        </h1>
        <div className="grid grid-cols-3 gap-6">
          {items.map(item => (
            <DashboardCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
