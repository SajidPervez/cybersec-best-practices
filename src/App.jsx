import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ExplainPage from './pages/ExplainPage';
import HomePage from './pages/HomePage';
import './styles.css';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explain" element={<ExplainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
