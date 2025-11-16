import { useState, useEffect } from 'react';
import { Gift, Zap, Clock, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingIncentiveBadgeProps {
  productId: number;
  className?: string;
}

// Incentive types with icons and messages
const INCENTIVE_TYPES = [
  { icon: Zap, text: 'FLASH SALE', color: '#e74c3c', bgColor: 'rgba(231, 76, 60, 0.95)' },
  { icon: Gift, text: 'FREE GIFT', color: '#4ecdc4', bgColor: 'rgba(78, 205, 196, 0.95)' },
  { icon: Clock, text: 'LIMITED TIME', color: '#ffa500', bgColor: 'rgba(255, 165, 0, 0.95)' },
  { icon: Star, text: '20% OFF', color: '#ff69b4', bgColor: 'rgba(255, 105, 180, 0.95)' },
  { icon: Sparkles, text: 'FREE SHIPPING', color: '#9b59b6', bgColor: 'rgba(155, 89, 182, 0.95)' },
];

export function FloatingIncentiveBadge({ productId, className = '' }: FloatingIncentiveBadgeProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);

  // Select incentive based on product ID for variety
  const incentive = INCENTIVE_TYPES[productId % INCENTIVE_TYPES.length];
  const IconComponent = incentive.icon;

  useEffect(() => {
    // Cycle: 2 minutes visible (120000ms), 30 seconds hidden (30000ms)
    const VISIBLE_DURATION = 120000; // 2 minutes
    const HIDDEN_DURATION = 30000;   // 30 seconds

    // Start visible
    setIsVisible(true);

    const cycleTimer = setInterval(() => {
      setIsVisible((prev) => {
        if (prev) {
          // Currently visible, switch to hidden after 2 minutes
          return false;
        } else {
          // Currently hidden, switch to visible after 30 seconds
          setCycleCount((count) => count + 1);
          return true;
        }
      });
    }, isVisible ? VISIBLE_DURATION : HIDDEN_DURATION);

    return () => clearInterval(cycleTimer);
  }, [isVisible]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={`incentive-${cycleCount}`}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ 
            opacity: 1, 
            scale: [0.8, 1.15, 1],
            y: 0,
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8,
            y: 10,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          transition={{
            opacity: { duration: 0.5, ease: "easeOut" },
            scale: { 
              duration: 2, 
              ease: "easeInOut",
              times: [0, 0.6, 1]
            },
            y: { duration: 0.5, ease: "easeOut" }
          }}
          className={`absolute bottom-0 left-0 right-0 z-30 flex items-center justify-center py-2 px-3 ${className}`}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.26)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 255, 255, 0.1)',
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            borderBottomLeftRadius: '3px',
            borderBottomRightRadius: '3px',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: `radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, transparent 70%)`,
              borderTopLeftRadius: '0px',
              borderTopRightRadius: '0px',
              borderBottomLeftRadius: '3px',
              borderBottomRightRadius: '3px',
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center gap-2">
            {/* Animated icon */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 0.5
              }}
            >
              <IconComponent className="h-4 w-4 text-white" />
            </motion.div>

            {/* Text with sparkle effect */}
            <motion.span
              className="font-heading text-white text-sm tracking-wider"
              style={{ 
                fontWeight: 700,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)'
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {incentive.text}
            </motion.span>

            {/* Animated sparkles */}
            <motion.div
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="h-3 w-3 text-white" style={{ opacity: 0.9 }} />
            </motion.div>
          </div>

          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{
              borderTopLeftRadius: '0px',
              borderTopRightRadius: '0px',
              borderBottomLeftRadius: '3px',
              borderBottomRightRadius: '3px',
            }}
          >
            <motion.div
              className="absolute h-full w-1/2"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                filter: 'blur(10px)',
              }}
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 2
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
