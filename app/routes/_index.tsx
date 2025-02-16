import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchInput from '~/components/UI/SearchInput';
import AnimatedBackground from '~/components/UI/AnimatedBackground';
import DashboardOverview from '~/components/Dashboard/DashboardOverview';
import AnalyticsDashboard from '~/components/Dashboard/AnalyticsDashboard';
import ProfileLogo from '~/components/UI/ProfileLogo';
import GlassContainer from '~/components/UI/GlassContainer';

const Index = () => {
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchCompleted, setSearchCompleted] = React.useState(false);
  const [items, setItems] = React.useState<any[]>([]);

  useEffect(() => {
    const savedIsSearching = localStorage.getItem('isSearching');
    const savedSearchCompleted = localStorage.getItem('searchCompleted');
    const savedItems = localStorage.getItem('items');

    if (savedIsSearching !== null) {
      setIsSearching(savedIsSearching === 'true');
    }
    if (savedSearchCompleted !== null) {
      setSearchCompleted(savedSearchCompleted === 'true');
    }
    if (savedItems !== null) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (error) {
        console.error("Error parsing saved items:", error);
        localStorage.removeItem('items');
      }
    }
    console.log("Loaded from localStorage:", { savedIsSearching, savedSearchCompleted, savedItems });
  }, []);

  useEffect(() => {
    console.log("Saving to localStorage:", { isSearching, searchCompleted, items });
    localStorage.setItem('isSearching', isSearching.toString());
    localStorage.setItem('searchCompleted', searchCompleted.toString());
    try {
      localStorage.setItem('items', JSON.stringify(items));
    } catch (error) {
      console.error("Error stringifying items:", error);
    }
  }, [isSearching, searchCompleted, items]);

  const handleSearchComplete = (results: { items: any[] }) => {
    setItems(results.items);
    setSearchCompleted(true);
    setIsSearching(false);
  };

  return (
    <AnimatedBackground className="min-h-screen items-center justify-center">
      <AnimatePresence mode="wait">
        <ProfileLogo/>
        {!searchCompleted && (
          <motion.div
            className="mx-auto pt-40"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            key="header"
          >
            <motion.h1
              className="font-subheading text-5xl pb-3 text-gray-800 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              UltraFounder.AI
            </motion.h1>
            <motion.h3
              className="font-subheading text-xl font-light text-gray-600 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              The ultimate suite of AI-tools for your startup idea
            </motion.h3>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div
          className={`${searchCompleted ? 'pt-10' : 'mt-12'}`}
          transition={{ duration: 0.5 }}
          key="search-input"
        >
          <SearchInput
            onSearchStart={() => setIsSearching(true)}
            onSearchComplete={handleSearchComplete}
            searchCompleted={searchCompleted}
            setIsSearching={setIsSearching}
            setItems={setItems}
          />
        </motion.div>
      </AnimatePresence>

      {/* New Flex Container */}
      {!searchCompleted && (
        <motion.div
          className="flex flex-row justify-around items-center w-3/4 cursor-pointer mx-auto mt-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GlassContainer
            className="w-1/4 p-4"
          >
            <h3 className="font-subheading text-lg text-gray-800">
              Analyse your pitchdeck with UltraFounder.AI Chat
            </h3>
          </GlassContainer>
          <GlassContainer
            className="w-1/4 p-4"
          >
            <h3 className="font-subheading text-lg text-gray-800">
              Find your co-founder with UltraFounder.AI Network
            </h3>
          </GlassContainer>
          <GlassContainer
            className="w-1/4 p-4"
          >
            <h3 className="font-subheading text-lg text-gray-800">
              Do a proper research with UltraFounder.AI DeepResearch
            </h3>
          </GlassContainer>
        </motion.div>
      )}
      {/* End New Flex Container */}

      <AnimatePresence>
        {searchCompleted && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            key="welcome-message"
          >
            <DashboardOverview  items={items}/>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedBackground>
  );
};

export default Index;
