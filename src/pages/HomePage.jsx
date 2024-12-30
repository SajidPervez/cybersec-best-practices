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

  return (
    <div className="app-container">
      <div className="header">
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="domain-select"
        >
          <option value="">All Domains</option>
          {domains.map(domain => (
            <option key={domain} value={domain}>
              {formatDomainName(domain)}
            </option>
          ))}
        </select>

        <div className="interval-container">
          <input
            type="number"
            min="10"
            max="60"
            value={delay}
            onChange={handleDelayChange}
            className="interval-input"
          />
          <span className="interval-label">seconds</span>
        </div>
      </div>

      <div className="practice-container">
        <div className="practice-text-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="practice-text"
            >
              <div className="practice-content">
                <Typewriter 
                  text={currentText} 
                  speed={50}
                  showCursor={true}
                  loop={false}
                  className="practice-text"
                  onComplete={handleTypingComplete}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div className="domain-and-button-container">
          <motion.div className="domain-container">
            {(!selectedDomain && showDomain) && (
              <motion.div
                className="domain-name"
              >
                {formatDomainName(currentDomain)}
              </motion.div>
            )}
          </motion.div>

          {showDomain && (
            <div className="button-container">
              <button onClick={startNewPractice} className="next-practice-button">
              <FaArrowRight className="next-icon" /> Next 
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default HomePage;
