import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, Clock, X, ShoppingBag, Zap, Star, XCircle } from 'lucide-react';
import { Product } from '../../types';

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

// Function to extract discount percentage from offer strings
const extractDiscountPercentage = (discountString: string): number => {
  const match = discountString.match(/(\d+)%/);
  return match ? parseInt(match[1]) : 0;
};

// Function to calculate discounted price
const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number): number => {
  return originalPrice * (1 - discountPercentage / 100);
};

// Function to generate product-specific offers
const generateProductSpecificOffers = (product: Product): Offer[] => {
  if (!product) return [];

  const offers: Offer[] = [];
  const productName = product.name.split(' ').slice(0, 2).join(' '); // Get first 2 words
  const discountPrice = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 25;

  // Category-based offers
  if (product.category === 'Dresses') {
    offers.push({
      id: 'dress-special',
      emoji: '👗',
      title: 'DRESS SPECIAL!',
      subtitle: `${productName}`,
      discount: `${discountPrice}% OFF`,
      timeLeft: '6 hours left',
      action: 'GRAB IT',
      color: '#e83e8c',
      gradient: 'linear-gradient(135deg, #e83e8c, #fd7e14)',
      urgency: 'high'
    });
  } else if (product.category === 'Tops') {
    offers.push({
      id: 'top-deal',
      emoji: '👕',
      title: 'TOP DEAL!',
      subtitle: `${productName}`,
      discount: `${discountPrice}% OFF`,
      timeLeft: '4 hours left',
      action: 'SHOP NOW',
      color: '#5825efff',
      gradient: 'linear-gradient(135deg, #5825efff, #6e29f6)',
      urgency: 'medium'
    });
  } else if (product.category === 'Accessories') {
    offers.push({
      id: 'accessory-bonus',
      emoji: '💎',
      title: 'ACCESSORY BONUS!',
      subtitle: `${productName}`,
      discount: 'Buy 2 Get 1',
      timeLeft: 'Today only',
      action: 'ADD NOW',
      color: '#ffd700',
      gradient: 'linear-gradient(135deg, #ffd700, #ffb347)',
      urgency: 'medium'
    });
  } else if (product.category === 'Sets' || product.category === 'Traditional') {
    offers.push({
      id: 'collection-deal',
      emoji: '🌟',
      title: 'COLLECTION DEAL!',
      subtitle: `${productName}`,
      discount: `${discountPrice}% OFF`,
      timeLeft: '8 hours left',
      action: 'GET SET',
      color: '#28a745',
      gradient: 'linear-gradient(135deg, #28a745, #20c997)',
      urgency: 'medium'
    });
  }

  // Badge-based offers
  if (product.badge === 'Sale') {
    offers.push({
      id: 'sale-countdown',
      emoji: '🔥',
      title: 'SALE ENDING!',
      subtitle: `${productName}`,
      discount: `Last ${discountPrice}% OFF`,
      timeLeft: '2 hours left!',
      action: 'HURRY UP',
      color: '#e74c3c',
      gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)',
      urgency: 'high'
    });
  } else if (product.badge === 'New') {
    offers.push({
      id: 'new-arrival',
      emoji: '✨',
      title: 'NEW ARRIVAL!',
      subtitle: `${productName}`,
      discount: '20% OFF',
      timeLeft: 'Launch week',
      action: 'BE FIRST',
      color: '#5825efff',
      gradient: 'linear-gradient(135deg, #5825efff, #6e29f6)',
      urgency: 'medium'
    });
  } else if (product.badge === 'Limited') {
    offers.push({
      id: 'limited-edition',
      emoji: '⚡',
      title: 'LIMITED EDITION!',
      subtitle: `${productName}`,
      discount: 'Exclusive',
      timeLeft: 'Few left',
      action: 'SECURE IT',
      color: '#e74c3c',
      gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)',
      urgency: 'high'
    });
  } else if (product.badge === 'Popular') {
    offers.push({
      id: 'trending-now',
      emoji: '📈',
      title: 'TRENDING NOW!',
      subtitle: `${productName}`,
      discount: '15% OFF',
      timeLeft: 'While trending',
      action: 'JOIN TREND',
      color: '#e83e8c',
      gradient: 'linear-gradient(135deg, #e83e8c, #fd7e14)',
      urgency: 'medium'
    });
  }

  // Price-based offers
  if (product.price > 100) {
    offers.push({
      id: 'luxury-deal',
      emoji: '💎',
      title: 'LUXURY DEAL!',
      subtitle: `${productName}`,
      discount: 'Free Shipping',
      timeLeft: 'Premium items',
      action: 'TREAT YOURSELF',
      color: '#ffd700',
      gradient: 'linear-gradient(135deg, #ffd700, #ffb347)',
      urgency: 'low'
    });
  } else if (product.price < 50) {
    offers.push({
      id: 'budget-friendly',
      emoji: '💰',
      title: 'BUDGET STEAL!',
      subtitle: `${productName}`,
      discount: 'Extra 10% OFF',
      timeLeft: 'Great value',
      action: 'SAVE MORE',
      color: '#28a745',
      gradient: 'linear-gradient(135deg, #28a745, #20c997)',
      urgency: 'medium'
    });
  }

  // Rating-based offers
  if (product.rating >= 4.8) {
    offers.push({
      id: 'top-rated',
      emoji: '⭐',
      title: 'TOP RATED!',
      subtitle: `${productName}`,
      discount: `${product.rating}★ Special`,
      timeLeft: 'Highly rated',
      action: 'DISCOVER',
      color: '#ffd700',
      gradient: 'linear-gradient(135deg, #ffd700, #ffb347)',
      urgency: 'low'
    });
  }

  // Fallback general offers if no specific ones match
  if (offers.length === 0) {
    offers.push(
      {
        id: 'product-special',
        emoji: '🎯',
        title: 'SPECIAL OFFER!',
        subtitle: `${productName}`,
        discount: '25% OFF',
        timeLeft: '5 hours left',
        action: 'GET IT',
        color: '#5825efff',
        gradient: 'linear-gradient(135deg, #5825efff, #6e29f6)',
        urgency: 'medium'
      },
      {
        id: 'quick-buy',
        emoji: '⚡',
        title: 'QUICK BUY!',
        subtitle: `${productName}`,
        discount: 'Fast Deal',
        timeLeft: '3 hours left',
        action: 'ADD NOW',
        color: '#e74c3c',
        gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        urgency: 'high'
      }
    );
  }

  return offers;
};

interface MobileIncentiveBalloonStandaloneProps {
  onAction?: (offerId: string, incentiveData?: any) => void;
  currentProduct?: Product | null;
}

export function MobileIncentiveBalloonStandalone({
  onAction,
  currentProduct
}: MobileIncentiveBalloonStandaloneProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'idle' | 'exit'>('enter');
  const [countdownProgress, setCountdownProgress] = useState(1); // 1 = full time, 0 = no time left
  const [overlayOpacity, setOverlayOpacity] = useState(0.4); // Start at 40% opacity
  const [isPermanentlyDismissed, setIsPermanentlyDismissed] = useState(false);
  const [closeClickCount, setCloseClickCount] = useState(0);

  // 🔧 DEBUG: Add global function to manually test balloon
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).testMobileIncentiveBalloon = () => {
        console.log('🎈 Manual test: Clearing localStorage and showing balloon');
        localStorage.removeItem('bato-incentive-balloon-dismissed');
        setIsPermanentlyDismissed(false);
        setIsVisible(true);
        setAnimationPhase('enter');
        return 'Balloon should now be visible!';
      };
      
      (window as any).clearBalloonDismissal = () => {
        localStorage.removeItem('bato-incentive-balloon-dismissed');
        setIsPermanentlyDismissed(false);
        console.log('🎈 Balloon dismissal cleared from localStorage');
        return 'Balloon dismissal cleared - refresh page to see balloon again';
      };
    }
  }, []);

  // Check if permanently dismissed on component mount
  useEffect(() => {
    const dismissed = localStorage.getItem('bato-incentive-balloon-dismissed');
    if (dismissed === 'true') {
      setIsPermanentlyDismissed(true);
    }
  }, []);

  // Generate product-specific offers when product changes
  const getProductSpecificOffer = useCallback(() => {
    if (!currentProduct) return null;
    const productOffers = generateProductSpecificOffers(currentProduct);
    const randomIndex = Math.floor(Math.random() * productOffers.length);
    return productOffers[randomIndex];
  }, [currentProduct]);

  // Update offer when product changes
  useEffect(() => {
    if (currentProduct) {
      const newOffer = getProductSpecificOffer();
      if (newOffer) {
        setCurrentOffer(newOffer);
      }
    }
  }, [currentProduct, getProductSpecificOffer]);

  // Show balloon every 30 seconds with countdown animation
  useEffect(() => {
    // Don't show if permanently dismissed
    if (isPermanentlyDismissed) {
      return;
    }

    const showBalloon = () => {
      if (!isVisible && currentProduct) {
        const newOffer = getProductSpecificOffer();
        if (newOffer) {
          setCurrentOffer(newOffer);
          setIsVisible(true);
          setAnimationPhase('enter');
          setCountdownProgress(1); // Reset countdown
          setOverlayOpacity(0.4); // Reset overlay to 40%
        }
        
        // Countdown animation - update every 50ms for smooth animation
        const totalDuration = 6000; // 6 seconds
        const updateInterval = 50; // 50ms intervals for smooth animation
        const totalSteps = totalDuration / updateInterval;
        let currentStep = 0;
        
        const countdownTimer = setInterval(() => {
          currentStep++;
          const progress = 1 - (currentStep / totalSteps);
          
          // Creative easing function for smoother fade
          const easedProgress = progress * progress; // Quadratic easing for faster fade at the end
          
          setCountdownProgress(progress);
          setOverlayOpacity(easedProgress * 0.4); // Fade from 40% to 0%
          
          if (currentStep >= totalSteps) {
            clearInterval(countdownTimer);
            setAnimationPhase('exit');
            setTimeout(() => {
              setIsVisible(false);
              setCountdownProgress(1);
              setOverlayOpacity(0.4);
            }, 500);
          }
        }, updateInterval);
        
        // Cleanup function to clear timer if component unmounts
        return () => clearInterval(countdownTimer);
      }
    };

    // Show immediately on first load (after 3 seconds)
    const initialTimeout = setTimeout(showBalloon, 3000);
    
    // Then show every 30 seconds
    const interval = setInterval(showBalloon, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isVisible, getProductSpecificOffer, isPermanentlyDismissed, currentProduct]);

  const handleAction = () => {
    if (onAction && currentOffer && currentProduct) {
      // Extract discount information from the offer
      const discountPercentage = extractDiscountPercentage(currentOffer.discount);
      const discountedPrice = discountPercentage > 0 
        ? calculateDiscountedPrice(currentProduct.price, discountPercentage)
        : currentProduct.price;
      
      // Create incentive data object
      const incentiveData = {
        offerId: currentOffer.id,
        offerTitle: currentOffer.title,
        discountType: discountPercentage > 0 ? 'percentage' : 'special',
        discountValue: discountPercentage,
        discountedPrice: discountedPrice,
        description: `${currentOffer.subtitle} - ${currentOffer.discount}`
      };
      
      onAction(currentOffer.id, incentiveData);
    }
    
    handleDismiss();
  };

  const handleDismiss = () => {
    setAnimationPhase('exit');
    setTimeout(() => {
      setIsVisible(false);
      setCountdownProgress(1);
      setOverlayOpacity(0.4);
      setCloseClickCount(0); // Reset click count
    }, 300);
  };

  const handlePermanentDismiss = () => {
    localStorage.setItem('bato-incentive-balloon-dismissed', 'true');
    setIsPermanentlyDismissed(true);
    handleDismiss();
  };

  const handleCloseClick = () => {
    setCloseClickCount(prev => prev + 1);
    
    // Close immediately on first click
    handleDismiss();
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

  // Don't render if permanently dismissed, not visible, no current product, or no current offer
  if (isPermanentlyDismissed || !isVisible || !currentProduct || !currentOffer) {
    return null;
  }
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed pointer-events-none"
        style={{
          zIndex: 49,
          top: '100px', // 30px below the typical 70px header height (moved 10px up)
          left: '16px', // Position at left corner
          transform: 'scale(0.6)', // Reduce size but keep it visible
          transformOrigin: 'top left'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Main Balloon */}
        <motion.div
          className="relative pointer-events-auto"
          variants={balloonVariants}
          initial="hidden"
          animate={animationPhase === 'enter' ? 'enter' : animationPhase === 'exit' ? 'exit' : 'idle'}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
            width: '280px' // Fixed width for consistent sizing when scaled
          }}
        >
          {/* Constant Dark Glow Effect - Intensifies as countdown decreases */}
          <motion.div
            className="absolute inset-0"
            style={{
              borderRadius: '15px',
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(20, 20, 30, 0.2) 50%, rgba(0, 0, 0, 0.2) 100%)',
              filter: `blur(${20 + (1 - countdownProgress) * 10}px)`,
              opacity: 0.6 + (1 - countdownProgress) * 0.3, // Gets brighter as time runs out
              transform: `scale(${1.1 + (1 - countdownProgress) * 0.1})`, // Gets bigger as urgency increases
            }}
            animate={{
              boxShadow: [
                `0 0 ${20 + (1 - countdownProgress) * 20}px ${currentOffer.color}40`,
                `0 0 ${40 + (1 - countdownProgress) * 40}px ${currentOffer.color}60`,
                `0 0 ${20 + (1 - countdownProgress) * 20}px ${currentOffer.color}40`
              ]
            }}
            transition={{
              duration: 2 - (1 - countdownProgress), // Pulses faster as countdown decreases
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Main Balloon Body - Border intensifies with urgency */}
          <motion.div
            className="relative rounded-full p-4 w-full shadow-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, 
                rgba(0, 0, 0, 0.2) 0%, 
                rgba(20, 20, 30, 0.2) 30%, 
                rgba(40, 40, 60, 0.2) 70%, 
                rgba(0, 0, 0, 0.2) 100%)`,
              borderRadius: '15px', // Rounded rectangle to make close button more visible
              backdropFilter: 'blur(20px)',
              aspectRatio: '1', // Maintain square aspect ratio
            }}
            animate={{
              border: `${2 + (1 - countdownProgress) * 2}px solid ${currentOffer.color}`,
              boxShadow: [
                `0 20px 40px rgba(0, 0, 0, 0.5), 0 0 ${40 + (1 - countdownProgress) * 60}px ${currentOffer.color}${Math.floor(20 + (1 - countdownProgress) * 40).toString(16).padStart(2, '0')}`,
                `0 20px 40px rgba(0, 0, 0, 0.5), 0 0 ${60 + (1 - countdownProgress) * 80}px ${currentOffer.color}${Math.floor(30 + (1 - countdownProgress) * 50).toString(16).padStart(2, '0')}`,
                `0 20px 40px rgba(0, 0, 0, 0.5), 0 0 ${40 + (1 - countdownProgress) * 60}px ${currentOffer.color}${Math.floor(20 + (1 - countdownProgress) * 40).toString(16).padStart(2, '0')}`
              ]
            }}
            transition={{
              duration: 1.5 - countdownProgress * 0.5, // Faster pulsing as countdown decreases
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div 
                className="w-full h-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${currentOffer.color}, transparent 70%),
                               radial-gradient(circle at 70% 70%, ${currentOffer.color}, transparent 70%)`
                }}
              />
            </div>

            {/* Dark Glass Effect Overlay */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: `linear-gradient(45deg, 
                  rgba(88, 37, 239, 0.1) 0%, 
                  transparent 50%, 
                  rgba(88, 37, 239, 0.1) 100%)`,
                backdropFilter: 'blur(10px)'
              }}
            />

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

            {/* Close Button - Larger for mobile touch targets */}
            <motion.button
              onClick={handleCloseClick}
              className="absolute top-2 right-2 w-12 h-12 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors z-20"
              style={{ 
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                minWidth: '48px',
                minHeight: '48px'
              }}
              whileTap={{ scale: 0.9 }}
              whileHover={{ 
                background: 'rgba(0, 0, 0, 0.5)',
                scale: 1.05 
              }}
            >
              <X className="h-6 w-6" />
            </motion.button>

            {/* "Don't show again" button - appears at bottom */}
            <motion.button
              onClick={handlePermanentDismiss}
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white/40 hover:text-white/60 transition-colors font-body z-10"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              Don't show again
            </motion.button>

            {/* Creative Countdown Progress Ring */}
            <div className="absolute top-2 left-2 w-10 h-10 z-10">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                  className="opacity-20"
                  d="m18,2.0845a 15.9155,15.9155 0 0,1 0,31.831a 15.9155,15.9155 0 0,1 0,-31.831"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Progress circle */}
                <motion.path
                  d="m18,2.0845a 15.9155,15.9155 0 0,1 0,31.831a 15.9155,15.9155 0 0,1 0,-31.831"
                  stroke={currentOffer.color}
                  strokeWidth="2.5"
                  fill="none"
                  style={{
                    strokeDasharray: '100, 100',
                    filter: `drop-shadow(0 0 4px ${currentOffer.color}40)`
                  }}
                  animate={{
                    strokeDashoffset: 100 - (countdownProgress * 100)
                  }}
                  transition={{
                    duration: 0.05,
                    ease: "linear"
                  }}
                />
              </svg>
              {/* Countdown percentage text */}
              <div 
                className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                style={{ 
                  color: currentOffer.color,
                  textShadow: `0 0 8px ${currentOffer.color}40`
                }}
              >
                {Math.ceil(countdownProgress * 100)}%
              </div>
            </div>

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
                <div 
                  className="text-white text-xs font-bold px-3 py-1 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #ff4444, #ff6666)',
                    boxShadow: '0 4px 12px rgba(255, 68, 68, 0.4)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  🔥 HOT DEAL
                </div>
              </motion.div>
            )}

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Emoji */}
              <motion.div
                className="text-4xl mb-2"
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
                className="font-heading font-bold text-lg mb-1"
                style={{ 
                  color: currentOffer.color,
                  textShadow: `0 0 20px ${currentOffer.color}40`,
                  filter: 'brightness(1.2)'
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentOffer.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                className="text-white/70 text-sm mb-3 font-body"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {currentOffer.subtitle}
              </motion.p>

              {/* Discount */}
              <motion.div
                className="text-2xl font-bold mb-1"
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
                className="flex items-center justify-center gap-1 mb-3 font-body"
                style={{ 
                  color: currentOffer.color,
                  filter: 'brightness(1.1)'
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Clock className="h-4 w-4" />
                <span className="text-sm">{currentOffer.timeLeft}</span>
              </motion.div>

              {/* Action Button */}
              <motion.button
                onClick={handleAction}
                className="btn-moema-primary text-white font-bold py-2 px-6 rounded-full text-sm"
                style={{
                  background: currentOffer.gradient,
                  boxShadow: `0 4px 15px ${currentOffer.color}40`,
                  border: 'none'
                }}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.8, type: "spring", damping: 12 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentOffer.action} 🚀
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}