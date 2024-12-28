import { FaGithub } from 'react-icons/fa';

export const Layout = ({ children, controls }) => {
  return (
    <div className="app-container">
      <div className="top-header">
        {controls}
      </div>

      <main className="main-content">
        {children}
      </main>

      <nav className="mobile-nav">
        <span>General</span>
        <span>With Examples</span>
        <a href="https://github.com/SajidPervez/cybersec-best-practices" 
           target="_blank" 
           rel="noopener noreferrer"
        >
          <FaGithub />
        </a>
      </nav>

      <nav className="desktop-nav">
        <span>General</span>
        <span>With Examples</span>
        <a href="https://github.com/SajidPervez/cybersec-best-practices" 
           target="_blank" 
           rel="noopener noreferrer"
        >
          <FaGithub />
        </a>
      </nav>
    </div>
  );
};
