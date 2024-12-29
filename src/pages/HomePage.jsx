import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
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
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (index === currentText.length && currentText) {
      timerRef.current = setTimeout(() => {
        startNewPractice();
      }, delay * 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [index, currentText, delay, startNewPractice]);

  const handleDelayChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 10) { // Minimum 10 seconds
      setDelay(value);
    }
  };

  const handleTypingComplete = () => {
    setShowDomain(true);
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
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

        {(!selectedDomain && showDomain) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="domain-name"
          >
            {formatDomainName(currentDomain)}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
