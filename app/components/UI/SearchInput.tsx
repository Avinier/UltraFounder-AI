import { useState, useRef, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Send, Loader, Check, File } from 'lucide-react';

interface SearchInputProps {
  onSearchStart?: () => void;
  onSearchComplete?: (result: any) => void;
  searchCompleted?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearchStart, onSearchComplete, searchCompleted }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const recommendations = [
    "Review my attached pitch deck",
    "Give a strategic overview of my idea",
    "Find me a co-founder",
    "How do I fund my startup",
    "VCs near me",
    "Marketing campaign analysis"
  ];

  const constructPrompt = (query: string) => {
    return `Analyze this query and provide market research insights: "${query}"

Please provide exactly:
- 3 pain points (labeled as PAIN:)
- 4 strategic recommendations (labeled as STRATEGY:)
- 3 psychological triggers (labeled as TRIGGER:)

Format your response exactly like these examples:

Example 1 - Coffee Shop:
PAIN: Long wait times during morning rush hours
PAIN: Inconsistent coffee quality between visits
PAIN: Limited healthy food options

STRATEGY: Implement mobile order-ahead system
STRATEGY: Deploy barista training program
STRATEGY: Expand healthy breakfast menu
STRATEGY: Partner with local nutritionists

TRIGGER: Fear of missing out on morning productivity
TRIGGER: Desire for a personalized experience
TRIGGER: Social status of being a regular

Example 2 - Fitness Tracker:
PAIN: Battery dies during workouts
PAIN: Inaccurate sleep tracking
PAIN: Syncing issues with phone

STRATEGY: Develop fast-charging technology
STRATEGY: Improve sleep algorithms
STRATEGY: Create seamless app integration
STRATEGY: Launch premium health insights

TRIGGER: Anxiety about missing fitness goals
TRIGGER: Need for validation of progress
TRIGGER: Competitive drive with friends

Now, generate insights for: "${query}"
Important: Use exactly the same format with PAIN:, STRATEGY:, and TRIGGER: labels, one item per line.`;
  };

  const transformResponse = (textResponse: string) => {
    // Parse the text response into structured data
    const pains = textResponse.match(/PAIN: .+/g)?.map((p: string) => p.replace('PAIN: ', '')) || [];
    const strategies = textResponse.match(/STRATEGY: .+/g)?.map((s: string) => s.replace('STRATEGY: ', '')) || [];
    const triggers = textResponse.match(/TRIGGER: .+/g)?.map((t: string) => t.replace('TRIGGER: ', '')) || [];

    // Create the structured items array
    const items = [
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
        id: 1,
        type: 'topResearchFinds',
        height: 'h-64',
        width: 'col-span-2',
        data: pains.map((text: string, index: number) => ({
          id: index + 1,
          source: ['User Interviews', 'Industry Reports', 'Founder Surveys'][index % 3],
          text,
          frequency: Math.floor(Math.random() * (85 - 65) + 65)  // Random frequency between 65-85
        }))
      },
      {
        id: 3,
        type: 'challengesFaced',
        height: 'min-h-72',
        width: 'col-span-1',
        data: triggers.map((text: string, index: number) => ({
          id: index + 1,
          type: ['Financial', 'Operational', 'Personal'][index % 3],
          text,
          strength: (0.95 - (index * 0.1)).toFixed(2)  // Decreasing strength: 0.95, 0.85, 0.75
        }))
      },
      {
        id: 2,
        type: 'productDevelopmentInsights',
        height: 'h-[400px]',
        width: 'col-span-3',
        data: strategies.map((text: string, index: number) => ({
          id: index + 1,
          category: ['Market Analysis', 'User Feedback', 'Competitive Analysis', 'Technology Trends'][index % 4],
          text
        }))
      },
    ];

    return { items };
  };

  const makeApiCall = async (query: string) => {
    try {
      const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer fw_3ZiSSnWzBTmLi3NfDCMDbZAG`
        },
        body: JSON.stringify({
          model: "accounts/fireworks/models/deepseek-v3",
          max_tokens: 4096,
          top_p: 1,
          top_k: 40,
          presence_penalty: 0,
          frequency_penalty: 0,
          temperature: 0.7,
          messages: [
            {
              role: "user",
              content: constructPrompt(query)
            }
          ]
        })
      });

      const data = await response.json();
      const textResponse = data.choices[0].message.content;

      console.log('Raw LLM Response:', textResponse);

      // Transform the text response into our structured format
      const structuredData = transformResponse(textResponse);
      console.log('Structured Data:', structuredData);

      return structuredData;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      onSearchStart?.();

      try {
        progressIntervalRef.current = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressIntervalRef.current);
              return 90;
            }
            return prev + 1;
          });
        }, 50);

        const result = await makeApiCall(searchQuery);
        console.log('Final structured data:', result);

        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          onSearchComplete?.(result);
        }, 500);
      } catch (error) {
        setIsLoading(false);
        setProgress(0);
      }

      if (progressIntervalRef.current !== null) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  const scroll = (direction: string) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.querySelector('button')!.offsetWidth + 16;
    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    let targetScroll = direction === 'left'
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount;

    if (targetScroll > maxScroll) targetScroll = 0;
    if (targetScroll < 0) targetScroll = maxScroll;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const startAutoScroll = () => {
      scrollIntervalRef.current = setInterval(() => {
        if (!isPaused) {
          scroll('right');
        }
      }, 3000);
    };

    if (!isLoading) {
      startAutoScroll();
    }

    return () => {
      if (scrollIntervalRef.current !== null) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isPaused, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSearchQuery(file.name); // Set the filename as the search query
      // You can add additional logic here to handle the file,
      // such as reading its content or preparing it for upload.
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 font-subheading">
      {/* Search Input Container */}
      <form 
        onSubmit={handleSubmit}
        className={`
          relative
          backdrop-blur-xl
          bg-white/35
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
          ${isFocused ? 'shadow-[0_0_25px_rgba(255,255,255,0.6)] border-white/60' : 'hover:border-white/50 hover:bg-white/20'}
        `}
      >
        <div className="flex items-center px-6 py-4">
          <Search className={`w-6 h-6 text-white ${isLoading ? 'animate-pulse' : ''}`} />
          <input
            type="text"
            placeholder="What would you like to research?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={searchCompleted}
            className="
              w-full
              ml-4
              border-none
              bg-transparent
              text-grey
              placeholder-grey/50
              focus:outline-none
              font-light
              text-lg
              disabled:opacity-50
            "
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {/* File Input */}
          <label htmlFor="file-upload" className="cursor-pointer ml-2 relative group">
            <File className="w-6 h-6 text-white" />
            {/* Helper Container for File Upload */}
            <div className="absolute hidden group-hover:block bg-white/90 text-grey text-xs px-4 py-2 rounded-md shadow-lg -top-12 left-1/2 -translate-x-1/2 transition-all duration-300">
              upload your pitchdeck
            </div>
          </label>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          {/* End File Input */}

          <button 
            type="submit"
            className="
              ml-4
              p-1.5
              rounded-full
              bg-white/10
              border
              border-white/20
              transition-all
              duration-300
              hover:bg-white/20
              hover:border-white/30
              hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]
              group
              disabled:opacity-50
              disabled:cursor-not-allowed
              relative
            "
            disabled={!searchQuery.trim() || isLoading}
          >
            {!searchCompleted && <Send 
              className={`
                w-5 
                h-5 
                text-white 
                group-hover:text-grey/70 
                transition-colors 
                duration-300
                ${isLoading ? 'animate-pulse' : ''}
              `}
            />}
            {/* Helper Container for Send Button */}
            <div className="absolute hidden group-hover:block bg-white/90 text-grey text-xs px-4 py-2 rounded-md shadow-lg -top-12 left-1/2 -translate-x-1/2 transition-all duration-300">
              send
            </div>
          </button>
        </div>
      </form>

      {/* Loading Progress */}
      {isLoading && (
        <div className="mt-8 space-y-6">
          <div className="backdrop-blur-xl bg-white/20 border border-white/40 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-grey">Processing Query...</span>
                  <Loader className="w-6 h-6 animate-spin text-grey" />
                </div>

                <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.7)] animate-pulse"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-grey">
                  <div className="flex items-center gap-2">
                    {progress > 33 ? (
                      <Check className="w-4 h-4 text-grey shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
                    ) : (
                      <Loader className="w-4 h-4 animate-spin text-grey" />
                    )}
                    Analyzing Query
                  </div>
                  <div className="flex items-center gap-2">
                    {progress > 66 ? (
                      <Check className="w-4 h-4 text-grey shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
                    ) : (
                      <Loader className="w-4 h-4 animate-spin text-grey" />
                    )}
                    Processing
                  </div>
                  <div className="flex items-center gap-2">
                    {progress > 90 ? (
                      <Check className="w-4 h-4 text-grey shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
                    ) : (
                      <Loader className="w-4 h-4 animate-spin text-grey" />
                    )}
                    Generating Response
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Carousel */}
      {!searchCompleted && !isLoading && (
        <div 
          className="mt-6 relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
              w-8 h-8 rounded-full bg-white/10 backdrop-blur-lg border border-white/20
              flex items-center justify-center
              transition-all duration-300
              hover:bg-white/20 hover:border-white/30
              disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4 text-grey/50" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 overflow-x-hidden scroll-smooth mx-8"
          >
            {[...recommendations, ...recommendations].map((recommendation, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(recommendation)}
                className="
                  whitespace-nowrap
                  px-6
                  py-2.5
                  rounded-full
                  backdrop-blur-lg
                  bg-white/10
                  border
                  border-white/20
                  text-grey/50
                  text-sm
                  transition-all
                  duration-300
                  hover:bg-white/20
                  hover:border-white/30
                  hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]
                  flex-shrink-0
                "
              >
                {recommendation}
              </button>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
              w-8 h-8 rounded-full bg-white/10 backdrop-blur-lg border border-white/20
              flex items-center justify-center
              transition-all duration-300
              hover:bg-white/20 hover:border-white/30
              disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronRight className="w-4 h-4 text-grey/50" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
