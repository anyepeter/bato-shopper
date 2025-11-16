import React from 'react';
import { motion } from 'motion/react';
import { Package, Sparkles } from 'lucide-react';

interface ProductQuestionButtonProps {
  onClick: () => void;
  className?: string;
  hasActiveProducts?: boolean;
}

export const ProductQuestionButton: React.FC<ProductQuestionButtonProps> = ({
  onClick,
  className = '',
  hasActiveProducts = true
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={!hasActiveProducts}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full ${className}`}
      style={{ 
        background: hasActiveProducts 
          ? 'linear-gradient(135deg, #5825efff 0%, #8a5cf6 100%)'
          : 'rgba(255, 255, 255, 0.1)',
        border: hasActiveProducts ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'
      }}
      whileHover={hasActiveProducts ? { scale: 1.1 } : {}}
      whileTap={hasActiveProducts ? { scale: 0.9 } : {}}
      title={hasActiveProducts ? 'Ask about featured products' : 'No products featured'}
    >
      {/* Sparkle Animation for Active State */}
      {hasActiveProducts && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(88, 37, 239, 0.7)',
              '0 0 0 8px rgba(88, 37, 239, 0)',
              '0 0 0 0 rgba(88, 37, 239, 0)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      )}

      {/* Main Icon */}
      <Package 
        size={18} 
        color={hasActiveProducts ? 'white' : 'rgba(255, 255, 255, 0.4)'} 
      />

      {/* Sparkle Indicator */}
      {hasActiveProducts && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Sparkles size={12} color="white" />
        </motion.div>
      )}

      {/* Pulse Effect */}
      {hasActiveProducts && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'rgba(255, 255, 255, 0.2)' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.button>
  );
};