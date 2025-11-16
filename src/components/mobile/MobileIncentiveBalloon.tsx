import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, Clock, X, ShoppingBag, Zap, Star } from 'lucide-react';

interface Offer {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  discount: string;
  timeLeft: string;
  action: string;
  color: string;
  gradient: string;
  urgency: 'high' | 'medium' | 'low';
}

interface MobileIncentiveBalloonProps {
  isVisible?: boolean;
  onAction?: (offerId: string) => void;
  onDismiss?: () => void;
}

const EXCITING_OFFERS: Offer[] = [
  {
    id: 'flash-sale',
    emoji: '⚡',
    title: 'FLASH SALE!',
    subtitle: 'Lightning Deal',
    discount: '50% OFF',
    timeLeft: '5 min left!',
    action: 'GRAB NOW',
    color: '#e74c3c',
    gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)',
    urgency: 'high'
  },
  {
    id: 'daily-special',
    emoji: '🎁',
    title: 'TODAY ONLY!',
    subtitle: 'Daily Special',
    discount: '30% OFF',
    timeLeft: '12 hours left',
    action: 'SHOP NOW',
    color: '#5825efff',
    gradient: 'linear-gradient(135deg, #5825efff, #6e29f6)',
    urgency: 'medium'
  },
  {
    id: 'exclusive-vip',
    emoji: '👑',
    title: 'VIP EXCLUSIVE!',
    subtitle: 'Members Only',
    discount: 'Buy 2 Get 1',
    timeLeft: 'Limited time',
    action: 'UNLOCK',
    color: '#ffd700',
    gradient: 'linear-gradient(135deg, #ffd700, #ffb347)',
    urgency: 'medium'
  },
  {
    id: 'first-order',
    emoji: '🌟',
    title: 'FIRST ORDER?',
    subtitle: 'Welcome Gift',
    discount: '25% OFF',
    timeLeft: 'New customers',
    action: 'CLAIM',
    color: '#28a745',
    gradient: 'linear-gradient(135deg, #28a745, #20c997)',
    urgency: 'low'
  },
  {
    id: 'weekend-vibes',
    emoji: '🎉',
    title: 'WEEKEND VIBES!',
    subtitle: 'Party Collection',
    discount: '40% OFF',
    timeLeft: 'This weekend',
    action: 'PARTY ON',
    color: '#e83e8c',
    gradient: 'linear-gradient(135deg, #e83e8c, #fd7e14)',
    urgency: 'medium'
  }
];

export function MobileIncentiveBalloon({
  isVisible: externalVisible,
  onAction,
  onDismiss
}: MobileIncentiveBalloonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(EXCITING_OFFERS[0]);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'idle' | 'exit'>('enter');

  // Rotate through offers randomly
  const getRandomOffer = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * EXCITING_OFFERS.length);
    return EXCITING_OFFERS[randomIndex];
  }, []);

  // Show balloon every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isVisible && externalVisible !== false) {
        const newOffer = getRandomOffer();
        setCurrentOffer(newOffer);
        setIsVisible(true);
        setAnimationPhase('enter');
        
        // Auto-hide after 6 seconds
        setTimeout(() => {
          setAnimationPhase('exit');
          setTimeout(() => {
            setIsVisible(false);
          }, 500);
        }, 6000);
      }
    }, 30000);

    // Show immediately on first load (after 3 seconds)
    const initialTimeout = setTimeout(() => {
      if (!isVisible && externalVisible !== false) {
        const newOffer = getRandomOffer();
        setCurrentOffer(newOffer);
        setIsVisible(true);
        setAnimationPhase('enter');
        
        setTimeout(() => {
          setAnimationPhase('exit');
          setTimeout(() => {
            setIsVisible(false);
          }, 500);
        }, 6000);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [isVisible, externalVisible, getRandomOffer]);

  const handleAction = () => {
    if (onAction) {
      onAction(currentOffer.id);
    }
    handleDismiss();
  };

  const handleDismiss = () => {
    setAnimationPhase('exit');
    setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) {
        onDismiss();
      }
    }, 300);
  };

  const balloonVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      y: 100,
      rotate: -180,
    },
    enter: {
      scale: [0, 1.2, 0.9, 1.05, 1],
      opacity: 1,
      y: [100, -20, 10, 0],
      rotate: [180, -10, 5, 0],
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
        duration: 1.2,
        times: [0, 0.3, 0.6, 0.8, 1]
      }
    },
    idle: {
      scale: 1,
      y: [0, -8, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        },
        rotate: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      y: -100,
      rotate: 180,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    idle: {
      boxShadow: [
        `0 0 20px ${currentOffer.color}40`,
        `0 0 40px ${currentOffer.color}60`,
        `0 0 20px ${currentOffer.color}40`
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const sparkleVariants = {
    twinkle: {
      scale: [1, 1.5, 1],
      rotate: [0, 180, 360],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(2px)'
        }}
      >
        {/* Main Balloon */}
        <motion.div
          className="relative pointer-events-auto"
          variants={balloonVariants}
          initial="hidden"
          animate={animationPhase === 'enter' ? 'enter' : animationPhase === 'exit' ? 'exit' : 'idle'}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: currentOffer.gradient,
              filter: 'blur(20px)',
              opacity: 0.6,
              transform: 'scale(1.1)',
            }}
            variants={glowVariants}
            animate="idle"
          />

          {/* Main Balloon Body */}
          <motion.div
            className="relative bg-white rounded-3xl p-6 mx-4 max-w-sm w-full shadow-2xl overflow-hidden"
            style={{
              border: `3px solid ${currentOffer.color}`,
              borderRadius: '24px' // Mobile 8px equivalent for larger element
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div 
                className="w-full h-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${currentOffer.color}, transparent 70%),
                               radial-gradient(circle at 70% 70%, ${currentOffer.color}, transparent 70%)`
                }}
              />
            </div>

            {/* Floating Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${15 + (i % 3) * 20}%`,
                  color: currentOffer.color,
                  fontSize: '12px'
                }}
                variants={sparkleVariants}
                animate="twinkle"
                transition={{ delay: i * 0.2 }}
              >
                <Sparkles className="h-3 w-3" />
              </motion.div>
            ))}

            {/* Close Button */}
            <motion.button
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors z-10"
              whileTap={{ scale: 0.9 }}
              style={{ borderRadius: '50%' }}
            >
              <X className="h-4 w-4" />
            </motion.button>

            {/* Urgency Indicator */}
            {currentOffer.urgency === 'high' && (
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  🔥 HOT DEAL
                </div>
              </motion.div>
            )}

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Emoji */}
              <motion.div
                className="text-6xl mb-3"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {currentOffer.emoji}
              </motion.div>

              {/* Title */}
              <motion.h2
                className="font-heading font-bold text-2xl mb-1"
                style={{ color: currentOffer.color }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentOffer.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                className="text-gray-600 text-sm mb-3 font-body"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {currentOffer.subtitle}
              </motion.p>

              {/* Discount */}
              <motion.div
                className="text-4xl font-bold mb-2"
                style={{ 
                  background: currentOffer.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", damping: 15 }}
              >
                {currentOffer.discount}
              </motion.div>

              {/* Time Left */}
              <motion.div
                className="flex items-center justify-center gap-1 mb-4 text-orange-600 font-body"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{currentOffer.timeLeft}</span>
              </motion.div>

              {/* Action Button */}
              <motion.button
                onClick={handleAction}
                className="w-full h-14 rounded-2xl font-bold text-white font-body text-lg flex items-center justify-center gap-2 shadow-lg"
                style={{
                  background: currentOffer.gradient,
                  borderRadius: '16px' // Mobile 8px equivalent
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring", damping: 15 }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
              >
                {currentOffer.urgency === 'high' ? (
                  <Zap className="h-5 w-5" />
                ) : currentOffer.action.includes('GRAB') || currentOffer.action.includes('SHOP') ? (
                  <ShoppingBag className="h-5 w-5" />
                ) : (
                  <Gift className="h-5 w-5" />
                )}
                <span>{currentOffer.action}</span>
              </motion.button>

              {/* Rating Stars for Social Proof */}
              <motion.div
                className="flex items-center justify-center gap-1 mt-3 text-yellow-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                  >
                    <Star className="h-3 w-3 fill-current" />
                  </motion.div>
                ))}
                <span className="text-xs text-gray-500 ml-1 font-body">4.9 (2.1k reviews)</span>
              </motion.div>
            </div>

            {/* Floating Icons */}
            <motion.div
              className="absolute bottom-2 right-2 text-2xl opacity-20"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 15, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              💫
            </motion.div>

            <motion.div
              className="absolute top-4 left-4 text-xl opacity-20"
              animate={{
                x: [0, 5, 0],
                rotate: [0, -10, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              ✨
            </motion.div>
          </motion.div>

          {/* Balloon String */}
          <motion.div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.6 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div
              className="w-0.5 h-16"
              style={{
                background: `linear-gradient(to bottom, ${currentOffer.color}, transparent)`,
                transformOrigin: 'top'
              }}
            />
            <motion.div
              className="w-2 h-2 rounded-full mx-auto"
              style={{ backgroundColor: currentOffer.color }}
              animate={{
                scale: [1, 1.2, 1],
                y: [0, 2, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>

        {/* Animated Background Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20 pointer-events-none"
            style={{
              left: `${10 + (i * 7)}%`,
              top: `${20 + (i % 4) * 20}%`,
              color: currentOffer.color
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 10, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          >
            {['💎', '⭐', '🌟', '✨', '💫', '🎉'][i % 6]}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}