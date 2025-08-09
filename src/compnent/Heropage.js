import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLink, FaRobot, FaChartLine, FaLock, FaLightbulb, FaSyncAlt } from 'react-icons/fa';
import { FaLayerGroup } from 'react-icons/fa';


const HeroPage = ({ isLoggedIn }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState('linksaver'); // 'linksaver' or 'summarizer'

  const fullText = "Boost Your Productivity with AI-Powered Tools";
  const words = fullText.split(' ');

  const linkSaverBenefits = [
    {
      icon: <FaLink className="text-2xl text-indigo-600" />,
      title: "Save Any Link",
      description: "Store web pages, articles, and resources with one click"
    },
    {
      icon: <FaLayerGroup className="text-2xl text-indigo-600" />,
      title: "Organize Smartly",
      description: "Categorize with tags and folders for easy retrieval"
    },
    {
      icon: <FaSyncAlt className="text-2xl text-indigo-600" />,
      title: "Cross-Device Sync",
      description: "Access your saved links anywhere, anytime"
    }
  ];

  const summarizerBenefits = [
    {
      icon: <FaRobot className="text-2xl text-indigo-600" />,
      title: "Instant Summaries",
      description: "Get concise overviews of long articles in seconds"
    },
    {
      icon: <FaChartLine className="text-2xl text-indigo-600" />,
      title: "Key Points Extraction",
      description: "Identify and highlight the most important information"
    },
    {
      icon: <FaLightbulb className="text-2xl text-indigo-600" />,
      title: "Smart Analysis",
      description: "Understand complex content with AI-powered insights"
    }
  ];

  // Text animation effect
  useEffect(() => {
    if (currentWordIndex < words.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => `${prev} ${words[currentWordIndex]}`);
        setCurrentWordIndex(currentWordIndex + 1);
      }, currentWordIndex === 0 ? 500 : 100);

      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => setAnimationComplete(true), 500);
    }
  }, [currentWordIndex, words]);

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
    } else {
      // navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col justify-center items-center px-4 py-12 md:py-24 overflow-hidden relative">
      {/* Floating Background Elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            rotate: [0, 360]
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          className="absolute rounded-full bg-indigo-200 opacity-20"
          style={{
            width: Math.random() * 300 + 100,
            height: Math.random() * 300 + 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            zIndex: 0
          }}
        />
      ))}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto text-center mb-12 relative z-10">
        {/* Animated Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            {displayText}
            <motion.span 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="ml-1"
            >
              |
            </motion.span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The ultimate toolkit for digital organization and content understanding
          </p>
        </motion.div>

        {/* Feature Tabs */}
        <AnimatePresence>
          {animationComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-white p-1 rounded-xl shadow-sm">
                  <button
                    onClick={() => setActiveTab('linksaver')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'linksaver' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-indigo-600'}`}
                  >
                    LinkSaver
                  </button>
                  <button
                    onClick={() => setActiveTab('summarizer')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'summarizer' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-indigo-600'}`}
                  >
                    AI Summarizer
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {(activeTab === 'linksaver' ? linkSaverBenefits : summarizerBenefits).map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-indigo-50 rounded-xl p-6 text-center hover:shadow-md transition-all"
                    >
                      <div className="flex justify-center mb-4">
                        <div className="bg-white p-3 rounded-full shadow-sm">
                          {benefit.icon}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" 
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGetStarted}
                  className="relative px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-xl transition-all overflow-hidden"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700 opacity-0 hover:opacity-100 transition-opacity duration-300 z-0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                  />
                </motion.button>

                {/* Login Prompt */}
                <AnimatePresence>
                  {showLoginPrompt && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg inline-block"
                    >
                      Please login to access all features
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Demo Preview */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="hidden lg:block absolute right-10 bottom-10 w-72 h-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-blue-100 opacity-80"></div>
        <div className="relative z-10 p-4">
          <div className="flex space-x-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
            <div className="h-2 bg-gray-200 rounded-full mb-2 w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-2 bg-gray-200 rounded-full w-5/6"></div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-indigo-100 rounded-full mr-2"></div>
              <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mb-2 w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded-full w-2/3"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroPage;