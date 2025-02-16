import React, { useState } from 'react';
import Background from '~/components/UI/Background';
import GlassContainer from '~/components/UI/GlassContainer';
import GlowingInput from '~/components/UI/GlowingInput';
import { Search, Code, Briefcase, Users, Target } from 'lucide-react';

const CofounderSearch = () => {
  const [activeTab, setActiveTab] = useState('create');
  
    // Calculate profile completion
  const calculateCompletion = (profile) => {
    const requiredFields = ['roleType', 'experienceLevel', 'vision'];
    const completedFields = requiredFields.filter(field => Boolean(profile[field]));
    const hasSkills = profile.skills.length > 0;
    return Math.round(((completedFields.length + (hasSkills ? 1 : 0)) / (requiredFields.length + 1)) * 100);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState([]);

  // Simulated matches data
  const mockMatches = [
    { id: 1, name: "Sarah Chen", role: "Business Development Lead", skills: ["Strategic Partnerships", "Deal Negotiation", "Client Relations"] },
    { id: 2, name: "Michael Rodriguez", role: "Marketing Director", skills: ["Growth Marketing", "Brand Strategy", "Digital Marketing"] },
    { id: 3, name: "Aisha Patel", role: "Finance Executive", skills: ["Financial Planning", "Investment Strategy", "Risk Management"] },
    { id: 4, name: "David Kim", role: "Operations Manager", skills: ["Business Operations", "Process Optimization", "Team Management"] }
];

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setMatches(mockMatches);
      setIsLoading(false);
    }, 3000);
  };

  const [profile, setProfile] = useState({
    roleType: '',
    skills: [],
    experienceLevel: '',
    commitment: '',
    vision: ''
  });

  const skillOptions = [
    'Technical/Engineering',
    'Product/Design',
    'Business/Operations',
    'Marketing/Growth',
    'Sales/Business Development',
    'Finance/Legal'
  ];

  return (
    <Background>
      <div className="min-h-screen p-8">
        {/* Header Section */}
        <GlassContainer className="mb-8 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-black font-subheading">Co-founder Search</h1>
          </div>
        </GlassContainer>

        {/* Main Content */}
        {activeTab === 'create' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Profile Form */}
            <GlassContainer className="p-6 space-y-6">
              <h2 className="text-2xl font-semibold text-black mb-6 font-subheading">Create Your Co-founder Requirements</h2>
              
              {/* Role Type */}
              <div className="space-y-2">
                <label className="text-gray-700 block font-medium font-subheading">Role Type</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Technical', 'Business', 'Product', 'Operations'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setProfile({ ...profile, roleType: role })}
                      className={`p-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                        profile.roleType === role
                          ? 'bg-white/20 text-black'
                          : 'bg-white/5 text-gray-600 hover:bg-white/10 hover:text-black'
                      }`}
                    >
                      <Code className="w-4 h-4" />
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="text-gray-700 block font-medium font-subheading">Required Skills</label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        const newSkills = profile.skills.includes(skill)
                          ? profile.skills.filter(s => s !== skill)
                          : [...profile.skills, skill];
                        setProfile({ ...profile, skills: newSkills });
                      }}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                        profile.skills.includes(skill)
                          ? 'bg-white/20 text-black'
                          : 'bg-white/5 text-gray-600 hover:bg-white/10 hover:text-black'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <label className="text-gray-700 block font-medium font-subheading">Experience Level</label>
                <div className="grid grid-cols-3 gap-4">
                  {['Entry', 'Mid-Level', 'Senior'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setProfile({ ...profile, experienceLevel: level })}
                      className={`p-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                        profile.experienceLevel === level
                          ? 'bg-white/20 text-black'
                          : 'bg-white/5 text-gray-600 hover:bg-white/10 hover:text-black'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vision & Goals */}
              <div className="space-y-2">
                <label className="text-gray-700 block font-medium font-subheading">Vision & Goals</label>
                <textarea
                  value={profile.vision}
                  onChange={(e) => setProfile({ ...profile, vision: e.target.value })}
                  className="w-full p-4 rounded-lg bg-white/5 text-black border border-white/10 focus:border-white/30 transition-all duration-300 focus:outline-none min-h-[100px] placeholder-gray-500"
                  placeholder="Describe your startup vision and what you're looking for in a co-founder..."
                />
              </div>
            </GlassContainer>

            {/* Right Column - Preview & Stats */}
            <div className="space-y-8">
              {/* Profile Preview */}
              <GlassContainer className="p-6">
                <h3 className="text-xl font-semibold text-black mb-4 font-subheading">Profile Preview</h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-gray-600" />
                    <span>Looking for: {profile.roleType || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-gray-600" />
                    <span>Required skills: {profile.skills.join(', ') || 'None selected'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                    <span>Experience: {profile.experienceLevel || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span>Vision: {profile.vision ? 'Specified' : 'Not specified'}</span>
                  </div>
                </div>
              </GlassContainer>

              {/* Matching Stats */}
              <GlassContainer className="p-6">
                <h3 className="text-xl font-semibold text-black mb-4 font-subheading">Potential Matches</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-subheading">Profile Completion</span>
                    <span className="text-black font-medium font-subheading">
                      {calculateCompletion(profile)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 transition-all duration-300"
                      style={{
                        width: `${calculateCompletion(profile)}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleSearch}
                      disabled={calculateCompletion(profile) < 100 || isLoading}
                      className={`px-6 py-3 rounded-lg transition-all duration-300 font-subheading
                        ${calculateCompletion(profile) === 100 
                          ? 'bg-purple-500/80 text-white hover:bg-purple-600/80' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                        ${isLoading ? 'cursor-wait opacity-75' : ''}
                      `}
                    >
                      {isLoading ? 'Searching...' : 'Search Profiles'}
                    </button>
                  </div>

                  {/* Matches List */}
                  {matches.length > 0 && (
                    <div className="mt-8 space-y-4">
                      <h4 className="text-lg font-medium text-black font-subheading">Found Matches</h4>
                      <div className="space-y-3">
                        {matches.map((match) => (
                          <div 
                            key={match.id}
                            className="p-4 bg-white/10 rounded-lg border border-white/20 hover:border-purple-500/30 transition-all duration-300"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-black font-subheading">{match.name}</h5>
                                <p className="text-gray-600 text-sm font-subheading">{match.role}</p>
                              </div>
                              <button className="text-purple-500 hover:text-purple-600 text-sm font-subheading">
                                View Profile
                              </button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {match.skills.map((skill, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-purple-500/10 text-purple-600 rounded-full text-xs font-subheading"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </GlassContainer>
            </div>
          </div>
        ) : (
          // Search Interface
          <div className="space-y-8">
            <GlassContainer className="p-6">
              <div className="max-w-2xl mx-auto">
                <GlowingInput placeholder="Search for co-founders..." />
              </div>
            </GlassContainer>
            
            {/* Search Filters */}
            <GlassContainer className="p-6">
              <div className="flex flex-wrap gap-4">
                {['Technical', 'Business', 'Product', 'Operations'].map((filter) => (
                  <button
                    key={filter}
                    className="px-4 py-2 rounded-lg bg-white/5 text-gray-600 hover:bg-white/10 hover:text-black transition-all duration-300"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </GlassContainer>
          </div>
        )}
      </div>
    </Background>
  );
};

export default CofounderSearch;