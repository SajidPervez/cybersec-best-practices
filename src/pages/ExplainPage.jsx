import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLightbulb, FaClipboardCheck, FaExclamationTriangle, FaArrowRight, FaPlayCircle } from 'react-icons/fa';
import practices from '../data/security-practices.json';
import { getEnvConfig } from '../config/env';
import Typewriter from '../components/Typewriter';

function ExplainPage() {
  const [displayText, setDisplayText] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [index, setIndex] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [currentDomain, setCurrentDomain] = useState('');
  const [showDomain, setShowDomain] = useState(false);
  const [delay, setDelay] = useState(10); // Default 10 seconds for Examples page
  const [isPaused, setIsPaused] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const domains = Object.keys(practices.domains);
  const TYPING_SPEED = 50;
  const timerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    console.log('Selected domain:', domain);
    setCurrentDomain(domain);
    const domainPractices = practices.domains[domain];
    console.log('Available practices:', domainPractices);
    const practice = domainPractices[Math.floor(Math.random() * domainPractices.length)];
    console.log('Selected practice:', practice);
    return practice;
  }, [selectedDomain, domains]);

  const startNewPractice = useCallback(() => {
    console.log('startNewPractice called');
    const practice = getRandomPractice();
    console.log('New practice text:', practice);
    setCurrentText(practice);
    setDisplayText('');
    setIndex(0);
    setShowDomain(false);
  }, [getRandomPractice]);

  useEffect(() => {
    console.log('Current text changed to:', currentText);
    console.log('Current index:', index);
    console.log('Display text:', displayText);
  }, [currentText, index, displayText]);

  useEffect(() => {
    startNewPractice();
  }, [selectedDomain]);

  useEffect(() => {
    let timer;
    if (index < currentText.length) {
      console.log('Typing effect - index:', index, 'of total:', currentText.length);
      timer = setTimeout(() => {
        setDisplayText(prev => prev + currentText[index]);
        setIndex(index + 1);
      }, TYPING_SPEED);
    } else if (index === currentText.length && currentText.length > 0) {
      console.log('Reached end of text');
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

  const fetchExplanation = async (practice, domain) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let config;
      try {
        config = getEnvConfig();
      } catch (error) {
        console.warn('Failed to get environment config:', error);
        // Fallback for development
        config = {
          apiUrl: 'http://localhost:3001',
          isDev: true,
          isProd: false
        };
      }
      
      console.log('Config being used:', config);
      const fullUrl = `${config.apiUrl}/api/explain`;
      console.log('Making request to:', fullUrl);
      
      const response = await fetch(fullUrl, {
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
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          requestUrl: fullUrl,
          currentUrl: window.location.href
        });
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (!data.explanation) {
        throw new Error('No explanation received from server');
      }
      
      setExplanation(data.explanation);
    } catch (error) {
      console.error('Error fetching explanation:', error);
      setError(error.message);
      setExplanation('');
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
    if (value >= 10) { // Minimum 10 seconds to avoid API misuse
      setDelay(value);
    }
  };

  const handleDomainChange = (e) => {
    setSelectedDomain(e.target.value);
    startNewPractice();
  };

  const handleNextClick = () => {
    console.log('Next button clicked');
    startNewPractice();
  };

  const handleContinueClick = () => {
    console.log('Continue button clicked');
    setExplanation('');
    setIsLoading(false);
    setShowDomain(false);
    setIsPaused(false);  // Reset pause state
    startNewPractice();
  };

  const handleExplainClick = () => {
    console.log('Explain button clicked');
    setIsPaused(true);
    fetchExplanation(currentText, currentDomain);
  };

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

  const handleTypingComplete = () => {
    setShowDomain(true);
  };

  return (
    <div className="app-container">
      <div className="header">
        <select
          value={selectedDomain}
          onChange={handleDomainChange}
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

      {isMobile ? (
        <>
          <div className="content-container">
            <div className={`practice-container ${explanation ? 'hide-practice' : ''}`}>
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
                  className="domain-name"
                >
                  {formatDomainName(currentDomain)}
                </motion.div>
              )}

              {index === currentText.length && !explanation && (
                <div className="buttons-container">
                  <button 
                    className="explain-button" 
                    onClick={handleExplainClick}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Getting explanation...
                      </>
                    ) : (
                      <>
                        <FaLightbulb className="button-icon" />
                        Explain with example
                      </>
                    )}
                  </button>
                  <button className="next-practice-button" onClick={handleNextClick}>
                    <FaArrowRight className="next-icon" />
                    Next 
                  </button>
                </div>
              )}
            </div>

            {explanation && (
              <div className="explanation-container">
                <div className="explanation-content">
                  {formatExplanation(explanation)}
                </div>
              </div>
            )}
            {error && (
              <div className="error-container">
                <div className="error-content">
                  <FaExclamationTriangle className="error-icon" />
                  <p>{error}</p>
                </div>
              </div>
            )}
          </div>

          <div className="footer-container">
            <div className="button-container">
              <AnimatePresence mode="wait">
                {explanation && !error && (
                  <button
                    className="continue-button"
                    onClick={handleContinueClick}
                  >
                    <FaPlayCircle className="button-icon" />
                    Continue
                  </button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      ) : (
        <div className="practice-container">
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="buttons-container"
              >
                <button onClick={handleExplainClick} className="explain-button">
                  {isLoading ? 'Getting explanation...' : 'Explain with example'}
                </button>
                <button onClick={handleNextClick} className="next-practice-button">
                  Next <FaArrowRight className="next-icon" />
                </button>
              </motion.div>
            )}

            {explanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="explanation-container"
              >
                <div className="explanation-content">
                  {formatExplanation(explanation)}
                </div>
                <button className="continue-button" onClick={handleContinueClick}>
                  <FaPlayCircle className="button-icon" />
                  Continue
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default ExplainPage;
