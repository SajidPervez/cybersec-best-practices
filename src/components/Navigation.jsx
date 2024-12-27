import { Link, useLocation } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            General
          </Link>
        </li>
        <li>
          <Link 
            to="/explain" 
            className={`nav-link ${location.pathname === '/explain' ? 'active' : ''}`}
          >
            With Examples
          </Link>
        </li>
        <li>
          <a
            href="https://github.com/SajidPervez/cybersec-best-practices"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link github-link"
          >
            <FaGithub />
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
