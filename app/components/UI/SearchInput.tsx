import { useState, useRef, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Send, Loader, Check } from 'lucide-react';

const SearchInput = ({ onSearchStart, onSearchComplete, searchCompleted }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const progressIntervalRef = useRef(null);
  
  const recommendations = [
    "Research about digital art trends",
    "Coffee shop social media strategy",
    "Yetis in Kailash marketing campaign",
    "Brand identity exploration",
    "Social media content calendar",
    "Marketing campaign analysis"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      onSearchStart?.();
      
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressIntervalRef.current);
            setTimeout(() => {
              setIsLoading(false);
              onSearchComplete?.(searchQuery);
            }, 500);
            return 100;
          }
          return prev + 1;
        });
      }, 50);
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.querySelector('button').offsetWidth + 16;
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
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isPaused, isLoading]);

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
            placeholder="What would you like to explore?"
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
          </button>
        </div>
      </form>

      {/* Loading Progress - Now with white glowing elements */}
      {isLoading && (
        <div className="mt-8 space-y-6">
          <div className="backdrop-blur-xl bg-white/20 border border-white/40 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-grey">Analyzing Data Sources...</span>
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
                    Market Research
                  </div>
                  <div className="flex items-center gap-2">
                    {progress > 66 ? (
                      <Check className="w-4 h-4 text-grey shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
                    ) : (
                      <Loader className="w-4 h-4 animate-spin text-grey" />
                    )}
                    Competitor Analysis
                  </div>
                  <div className="flex items-center gap-2">
                    {progress > 90 ? (
                      <Check className="w-4 h-4 text-grey shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
                    ) : (
                      <Loader className="w-4 h-4 animate-spin text-grey" />
                    )}
                    Content Strategy
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading skeletons with glow effect */}
          <div className="space-y-4">
            <div className="h-4 bg-white/30 rounded-full w-3/4 mx-auto animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
            <div className="h-4 bg-white/30 rounded-full w-1/2 mx-auto animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
            <div className="h-4 bg-white/30 rounded-full w-2/3 mx-auto animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
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