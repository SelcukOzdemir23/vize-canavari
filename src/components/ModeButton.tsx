import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ModeButtonProps {
  to?: string;
  title: string;
  disabled?: boolean;
  badge?: number;
  onClick?: () => void;
  className?: string; // Custom class name property
}

const ModeButton: React.FC<ModeButtonProps> = ({ 
  to, 
  title, 
  disabled = false, 
  badge,
  onClick,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <motion.button 
      onClick={handleClick}
      disabled={disabled}
      className={`mode-button ${disabled ? 'disabled' : ''} ${className}`}
      whileHover={!disabled ? { y: -5, scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      <span className="text-lg font-semibold">{title}</span>
      {typeof badge === 'number' && badge > 0 && (
        <motion.span 
          className="badge"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 600,
            damping: 25,
            duration: 0.2
          }}
        >
          {badge}
        </motion.span>
      )}
    </motion.button>
  );
};

export default ModeButton;