import React from 'react';
import { motion } from 'framer-motion';

interface StreakIndicatorProps {
  count: number;
}

const StreakIndicator: React.FC<StreakIndicatorProps> = ({ count }) => {
  return (
    <motion.div 
      className="streak-indicator"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <motion.span 
        className="streak-emoji"
        animate={{ 
          rotate: [0, 10, -10, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      >
        🔥
      </motion.span>
      <motion.span 
        className="streak-count"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="streak-count-number">{count}</span>
        <span className="streak-count-label">Günlük Seri</span>
      </motion.span>
    </motion.div>
  );
};

export default StreakIndicator;