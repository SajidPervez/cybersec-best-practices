import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import practices from '../data/security-practices.json';
import Typewriter from '../components/Typewriter';

function HomePage() {
  const [displayText, setDisplayText] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [index, setIndex] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [currentDomain, setCurrentDomain] = useState('');
  const [showDomain, setShowDomain] = useState(false);
  const [delay, setDelay] = useState(10); // Default 10 seconds for General page
  const domains = Object.keys(practices.domains);
  const timerRef = useRef(null);
  const TYPING_SPEED = 50;

  const formatDomainName = (domain) => {
    return domain
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getRandomPractice = useCallback(() => {
    let domain = selectedDomain;
    if (!selectedDomain) {
      domain = domains[Math.floor(Math.random() * domains.length)];
    }
    setCurrentDomain(domain);
    const domainPractices = practices.domains[domain];
    return domainPractices[Math.floor(Math.random() * domainPractices.length)];
  }, [selectedDomain, domains]);

  const startNewPractice = useCallback(() => {
    const practice = getRandomPractice();
    setCurrentText(practice);
    setDisplayText('');
    setIndex(0);
    setShowDomain(false);
  }, [getRandomPractice]);

  useEffect(() => {
    startNewPractice();
  }, [selectedDomain]);

  useEffect(() => {
    let timer;
    if (index < currentText.length) {
      timer = setTimeout(() => {
        setDisplayText(prev => prev + currentText[index]);
        setIndex(index + 1);
      }, TYPING_SPEED);
    } else if (index === currentText.length && currentText.length > 0) {
      setShowDomain(true);
      timerRef.current = setTimeout(() => {
        startNewPractice();
      }, delay * 1000);
    }
    return () => {
      clearTimeout(timer);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [index, currentText, delay, startNewPractice]);

  const handleTypingComplete = () => {
    setShowDomain(true);
  };

  const handleDelayChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 10) { // Minimum 10 seconds
      setDelay(value);
    }
  };

  const handleDomainChange = (e) => {
    setSelectedDomain(e.target.value);
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      {/* Header with controls - Fixed at top */}
      <div className="w-full bg-black/80 backdrop-blur-md px-4 py-3 mt-16">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <select
            value={selectedDomain}
            onChange={handleDomainChange}
            className="flex-1 px-3 py-2 rounded-lg text-base bg-white border-none text-black min-w-0"
          >
            <option value="">All Domains</option>
            {domains.map(domain => (
              <option key={domain} value={domain}>
                {formatDomainName(domain)}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 shrink-0">
            <input
              type="number"
              min="10"
              max="60"
              value={delay}
              onChange={handleDelayChange}
              className="w-16 px-3 py-2 rounded-lg text-base border-none text-center text-black"
            />
            <span className="text-white text-base">seconds</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Main content area */}
        <div className="flex-1 px-4 pb-32">
          <div className="h-full flex items-center justify-center mt-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-white text-center max-w-2xl mx-auto"
              >
                <div className="practice-content">
                  <Typewriter 
                    text={currentText}
                    speed={50}
                    showCursor={true}
                    loop={false}
                    onComplete={handleTypingComplete}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {(!selectedDomain && showDomain) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/70 text-lg text-center mt-4"
            >
              {formatDomainName(currentDomain)}
            </motion.div>
          )}
        </div>

        {/* Bottom buttons */}
        {index === currentText.length && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md">
            <div className="max-w-2xl mx-auto">
              <button 
                onClick={startNewPractice} 
                className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <FaArrowRight className="w-5 h-5" /> Next 
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
