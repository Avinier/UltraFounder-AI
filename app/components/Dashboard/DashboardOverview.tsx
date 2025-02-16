import React, { useState } from 'react';
import { Link } from '@remix-run/react';
import { AlertCircle, Target, TrendingUp, Atom, MessageCircle, Users, Briefcase, Search, Link as LucideLink } from 'lucide-react';
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

export interface DashboardCardItem {
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
      <div
        className="space-y-5 p-6 w-full h-full bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/40 shadow-md"
      >
        <div className="flex items-center gap-2 mb-4">
          <Atom className="w-6 h-6 text-tacao" />
          <h3 className="text-lg font-semibold text-grey/80">
            Deep Research
          </h3>
        </div>
        <div className="flex flex-col pb-2 w-full h-full items-center justify-center">
          <p className="text-grey/90 text-center px-4">
            Uncover strategic opportunities, identify potential co-founders,
            and connect with venture capitalists through comprehensive
            data-driven insights.
          </p>
          <div className="flex flex-row gap-4 mt-4 overflow-x-auto">
            <Link to="/cofounder" className="no-underline">
              <div className="p-4 bg-white/10 rounded-xl border border-white/20 flex flex-col items-center justify-center min-w-[200px] hover:bg-white/20 transition-all duration-300">
                <Users className="w-12 h-12 text-tacao" />
                <p className="text-grey/90 text-center mt-2">Find Co-founders</p>
              </div>
            </Link>
            <div className="p-4 bg-white/10 rounded-xl border border-white/20 flex flex-col items-center justify-center min-w-[200px]">
              <Briefcase className="w-12 h-12 text-tacao" />
              <p className="text-grey/90 text-center mt-2">Attract Investors</p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl border border-white/20 flex flex-col items-center justify-center min-w-[200px]">
              <Search className="w-12 h-12 text-tacao" />
              <p className="text-grey/90 text-center mt-2">Market Research</p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl border border-white/20 flex flex-col items-center justify-center min-w-[200px]">
              <LucideLink className="w-12 h-12 text-tacao" />
              <p className="text-grey/90 text-center mt-2">Strategic Partnerships</p>
            </div>
          </div>
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

const DashboardOverview = ({ items }: DashboardOverviewProps) => {
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
