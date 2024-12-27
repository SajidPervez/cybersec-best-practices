import { motion } from 'framer-motion';
import Typewriter from './components/Typewriter';

function App() {
  const bestPractices = [
    "Use firewalls to segment traffic",
    "Implement secure VPNs",
    "Validate all user inputs",
    "Encrypt sensitive data"
  ];

  return (
    <div className="min-h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-[80%] mx-auto flex items-center justify-center"
      >
        <Typewriter
          text={bestPractices}
          className="text-white text-6xl md:text-7xl lg:text-8xl font-bold text-center"
          speed={70}
          waitTime={3000}
          cursorClassName="text-white text-6xl md:text-7xl lg:text-8xl font-bold ml-2"
        />
      </motion.div>
    </div>
  );
}

export default App;
