import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import practices from '../data/security-practices.json';

function HomePage() {
  const [displayText, setDisplayText] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [index, setIndex] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [currentDomain, setCurrentDomain] = useState('');
  const [showDomain, setShowDomain] = useState(false);
  const [interval, setInterval] = useState(20);
  const domains = Object.keys(practices.domains);
  const TYPING_SPEED = 50;
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
      }, interval * 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [index, currentText, interval, startNewPractice]);

  useEffect(() => {
    let timer;
    if (index < currentText.length) {
      timer = setTimeout(() => {
        setDisplayText(prev => prev + currentText[index]);
        setIndex(index + 1);
      }, TYPING_SPEED);
    } else if (index === currentText.length && currentText.length > 0) {
      setShowDomain(true);
    }
    return () => clearTimeout(timer);
  }, [index, currentText]);

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
            min="20"
            max="60"
            value={interval}
            onChange={(e) => setInterval(Math.max(20, Number(e.target.value)))}
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
            {displayText}
            <span className="cursor">|</span>
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
