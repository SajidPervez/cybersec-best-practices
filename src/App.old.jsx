import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ExplainPage from './pages/ExplainPage';
import HomePage from './pages/HomePage';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import practices from './data/security-practices.json';
import './styles.css';

function App() {
  const [displayText, setDisplayText] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [index, setIndex] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [currentDomain, setCurrentDomain] = useState('');
  const [showDomain, setShowDomain] = useState(false);
  const [interval, setInterval] = useState(20);
  const domains = Object.keys(practices.domains);
  const TYPING_SPEED = 50; // milliseconds per character
  const timerRef = useRef(null);

  // Function to format domain name for display
  const formatDomainName = (domain) => {
    return domain
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get domains from the practices object
  const domains = Object.keys(practices.domains);

  // Function to get random practice from selected domain
  const getRandomPractice = useCallback(() => {
    let domain = selectedDomain;
    if (!selectedDomain) {
      domain = domains[Math.floor(Math.random() * domains.length)];
    }
    setCurrentDomain(domain);
    const domainPractices = practices.domains[domain];
    return domainPractices[Math.floor(Math.random() * domainPractices.length)];
  }, [selectedDomain, domains]);

  // Function to start new practice
  const startNewPractice = useCallback(() => {
    const practice = getRandomPractice();
    setCurrentText(practice);
    setDisplayText('');
    setIndex(0);
    setShowDomain(false);
  }, [getRandomPractice]);

  // Initialize with random practice
  useEffect(() => {
    startNewPractice();
  }, [selectedDomain]);

  // Handle interval timer
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

  // Typewriter effect
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
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={
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
        } />
        <Route path="/explain" element={<ExplainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
