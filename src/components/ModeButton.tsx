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
  description?: string;
}

const ModeButton: React.FC<ModeButtonProps> = ({ 
  to, 
  title, 
  disabled = false, 
  badge,
  onClick,
  className = '',
  description
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

  const baseClasses = [
    'group relative flex w-full items-center justify-between gap-3 rounded-2xl border-2',
    'px-6 py-5 text-left text-text-primary transition-all duration-200'
  ].join(' ');

  const enabledHover = [
    'bg-white border-primary-500/30 hover:border-primary-500 hover:scale-[1.02] hover:-translate-y-1',
    'active:scale-100 active:translate-y-0'
  ].join(' ');

  const disabledStyles = 'cursor-not-allowed opacity-40 bg-bg-tertiary border-transparent';

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClasses} ${disabled ? disabledStyles : enabledHover} ${className}`.trim()}
      style={!disabled ? { boxShadow: 'var(--shadow-md)' } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-base font-bold">{title}</span>
        {description && (
          <span className="text-sm text-text-muted">{description}</span>
        )}
      </div>
      {typeof badge === 'number' && badge > 0 && (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-400 text-xs font-black text-white">
          {badge}
        </span>
      )}
      {!disabled && (
        <span className="text-xl text-text-muted transition-transform group-hover:translate-x-1">
          →
        </span>
      )}
    </motion.button>
  );
};

export default ModeButton;