import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLightbulb, FaClipboardCheck, FaExclamationTriangle, FaArrowRight, FaPlayCircle } from 'react-icons/fa';
import practices from '../data/security-practices.json';

function ExplainPage() {
  const [displayText, setDisplayText] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [index, setIndex] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [currentDomain, setCurrentDomain] = useState('');
  const [showDomain, setShowDomain] = useState(false);
  const [delay, setDelay] = useState(20); // Default 20 seconds for Examples page
  const [isPaused, setIsPaused] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setExplanation(null);
    setIsPaused(false);
  }, [getRandomPractice]);

  const fetchExplanation = async (practice, domain) => {
    setIsLoading(true);
    try {
      // Make sure we have a base URL, either from env or default to current origin
      const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const apiUrl = `${baseUrl}/api/explain`;
      console.log('Base URL:', baseUrl);
      console.log('Full API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          practice,
          domain
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error('Error fetching explanation:', error);
      setExplanation(`Failed to fetch explanation. Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatExplanation = (text) => {
    // Split into sections based on numbered points
    const sections = text.split(/(?=\d\.\s+(?:Security Best Practice|Brief Explanation|Practice Example):)/g)
      .filter(Boolean)
      .map(section => section.trim());
    
    return sections.map((section, index) => {
      const trimmedSection = section.trim();
      
      if (trimmedSection.match(/1\.\s+Security Best Practice:/i)) {
        const content = trimmedSection.replace(/1\.\s+Security Best Practice:/i, '').trim();
        return (
          <div key={index} className="explanation-section main">
            <FaLightbulb className="section-icon" />
            <div>
              <h3>Security Best Practice</h3>
              <p>{content}</p>
            </div>
          </div>
        );
      } else if (trimmedSection.match(/2\.\s+Brief Explanation:/i)) {
        const content = trimmedSection.replace(/2\.\s+Brief Explanation:/i, '').trim();
        return (
          <div key={index} className="explanation-section detail">
            <FaArrowRight className="section-icon" />
            <div>
              <h3>Brief Explanation</h3>
              <p>{content}</p>
            </div>
          </div>
        );
      } else if (trimmedSection.match(/3\.\s+Practice Example:/i)) {
        const content = trimmedSection.replace(/3\.\s+Practice Example:/i, '').trim();
        return (
          <div key={index} className="explanation-section example">
            <FaClipboardCheck className="section-icon" />
            <div>
              <h3>Practice Example</h3>
              <p>{content}</p>
            </div>
          </div>
        );
      } else {
        return null;
      }
    }).filter(Boolean);
  };

  const handleDelayChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 20) { // Minimum 20 seconds to avoid API misuse
      setDelay(value);
    }
  };

  useEffect(() => {
    startNewPractice();
  }, [selectedDomain]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!isPaused && index === currentText.length && currentText) {
      timerRef.current = setTimeout(() => {
        startNewPractice();
      }, delay * 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [index, currentText, delay, startNewPractice, isPaused]);

  useEffect(() => {
    let timer;
    if (!isPaused && index < currentText.length) {
      timer = setTimeout(() => {
        setDisplayText(prev => prev + currentText[index]);
        setIndex(index + 1);
      }, TYPING_SPEED);
    } else if (index === currentText.length && currentText.length > 0) {
      setShowDomain(true);
    }
    return () => clearTimeout(timer);
  }, [index, currentText, isPaused]);

  const handleExplainClick = () => {
    setIsPaused(true);
    fetchExplanation(currentText, currentDomain);
  };

  const handleContinueClick = () => {
    startNewPractice();
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
            min="20"
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

        <AnimatePresence mode="wait">
          {!explanation && index === currentText.length && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="explain-button"
              onClick={handleExplainClick}
              disabled={isLoading}
            >
              {isLoading ? 'Getting explanation...' : 'Explain with example'}
            </motion.button>
          )}

          {explanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="explanation-container"
            >
              <div className="explanation-content">
                {formatExplanation(explanation)}
              </div>
              <button
                className="continue-button"
                onClick={handleContinueClick}
              >
                <FaPlayCircle className="button-icon" />
                Continue
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ExplainPage;
