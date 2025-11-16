import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  Users, 
  Shield, 
  Crown,
  Sparkles,
  X,
  Heart,
  ShoppingBag,
  MessageSquare,
  Users2
} from 'lucide-react';
import { ProductCommunityChatRoomFixed } from '../chat/ProductCommunityChatRoomFixed';
import { getCommunityByProductId, getUserEligibility } from '../../constants/productCommunityData';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
}

interface FloatingProductCommunityButtonProps {
  product: Product;
  currentUser: any;
  onFavoriteProduct?: (productId: number) => void;
  onPurchaseProduct?: (productId: number) => void;
  className?: string;
}

export function FloatingProductCommunityButton({
  product,
  currentUser,
  onFavoriteProduct,
  onPurchaseProduct,
  className = ""
}: FloatingProductCommunityButtonProps) {
  const [showCommunityChat, setShowCommunityChat] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get community data and user eligibility
  const communityData = getCommunityByProductId(product.id);
  const userEligibility = getUserEligibility(currentUser?.id || null, product.id);

  const handleCommunityClick = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    console.log('🔥 FloatingProductCommunityButton clicked!', product?.name);
    e?.preventDefault();
    e?.stopPropagation();
    
    // Clear any ongoing long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    setShowCommunityChat(true);
    setShowTooltip(false);
  }, [product?.name]);

  const handleTooltipToggle = useCallback(() => {
    console.log('🔥 Tooltip toggled for product:', product?.name);
    setShowTooltip(!showTooltip);
  }, [showTooltip, product?.name]);

  // Simplified touch handlers - long press only for tooltip
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    console.log('🔥 Touch start on FloatingProductCommunityButton');
    // Start long press timer for tooltip
    longPressTimerRef.current = setTimeout(() => {
      console.log('🔥 Long press detected - showing tooltip');
      handleTooltipToggle();
    }, 1000); // 1 second for long press
  }, [handleTooltipToggle]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    console.log('🔥 Touch end on FloatingProductCommunityButton');
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  if (!communityData) {
    return null; // No community for this product
  }

  const getButtonColor = () => {
    if (!userEligibility.isEligible) {
      return 'bg-gray-500';
    }
    
    switch (userEligibility.purchaseStatus) {
      case 'both':
        return 'bg-purple-600';
      case 'purchased':
        return 'bg-blue-600';
      case 'favorited':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getButtonBackgroundColor = () => {
    // 🎯 SET TO #a7a4a8 WITH 60% OPACITY FOR ALL STATES IN MOBILE
    return 'rgba(167, 164, 168, 0.6)';
  };

  const getStatusIcon = () => {
    const iconProps = { 
      size: 20, // Slightly smaller than FloatingToggleButton to fit better
      color: 'var(--pure-white)',
      style: { filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }
    };
    
    if (!userEligibility.isEligible) {
      return <Users2 {...iconProps} />; // Community group icon for non-eligible users
    }
    
    switch (userEligibility.purchaseStatus) {
      case 'both':
        return <Crown {...iconProps} />; // VIP crown for both purchased and favorited
      case 'purchased':
        return <MessageSquare {...iconProps} />; // Forum discussion icon for verified buyers
      case 'favorited':
        return <Users {...iconProps} />; // Community users icon for fans
      default:
        return <Users2 {...iconProps} />; // Default community icon
    }
  };

  const getTooltipText = () => {
    if (!userEligibility.isEligible) {
      return 'Join Product Community';
    }
    
    switch (userEligibility.purchaseStatus) {
      case 'both':
        return 'VIP Community Member';
      case 'purchased':
        return 'Verified Buyer Community';
      case 'favorited':
        return 'Community Fan';
      default:
        return 'Product Community';
    }
  };

  return (
    <>
      {/* Floating button matching FloatingToggleButton design */}
      <motion.button
        onClick={handleCommunityClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`btn-moema-icon rounded-full floating-community-button ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
        style={{
          position: 'fixed',
          backgroundColor: getButtonBackgroundColor(),
          backdropFilter: 'blur(10px)', // 🎯 ADD BACKDROP BLUR EFFECT
          WebkitBackdropFilter: 'blur(10px)', // 🎯 WEBKIT BROWSER SUPPORT
          color: 'var(--pure-white)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          border: '1px solid #a7a4a865',
          width: '44px',
          height: '44px',
          padding: '10px',
          borderRadius: '50%',
          textAlign: 'center' as const,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          pointerEvents: 'auto',
          WebkitTapHighlightColor: 'transparent',
          zIndex: 9999
        }}
      >
        {/* Icon - matching FloatingToggleButton style */}
        <div className="relative z-10 flex items-center justify-center pointer-events-none">
          {getStatusIcon()}
        </div>

        {/* Pulse animation to indicate functionality */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="rounded-full"
          style={{
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            right: '-4px',
            bottom: '-4px',
            borderRadius: '50%',
            border: `2px solid ${getButtonBackgroundColor()}`,
            pointerEvents: 'none'
          }}
        />

        {/* Online indicator */}
        {communityData.onlineCount > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 bg-green-400 rounded-full min-w-[18px] h-4 flex items-center justify-center text-xs font-bold text-white border border-white pointer-events-none"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ fontSize: '10px' }}
          >
            {communityData.onlineCount}
          </motion.div>
        )}

        {/* VIP sparkle effect - subtle for circular design */}
        {userEligibility.purchaseStatus === 'both' && (
          <motion.div
            className="absolute top-0 right-0 pointer-events-none"
            animate={{
              opacity: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="h-2 w-2 text-yellow-300" />
          </motion.div>
        )}
      </motion.button>

      {/* Tooltip - positioned for circular button */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="fixed z-[10000]"
            style={{ 
              top: '130px', // Position above the button
              right: '70px', // Position to the left of the button
              transform: 'translateY(-50%)'
            }}
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-xs font-medium backdrop-blur-md border border-white/10 max-w-[200px]">
              <div className="text-center">
                <div className="font-bold font-heading">{getTooltipText()}</div>
                <div className="text-gray-300 mt-1 font-body">
                  {communityData.memberCount} members • {communityData.onlineCount} online
                </div>
                <div className="text-gray-400 text-xs mt-1 font-body">
                  Tap to join conversation
                </div>
              </div>
              {/* Tooltip arrow pointing right */}
              <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-black/90 rotate-45" />
            </div>
            
            {/* Close button for tooltip */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="absolute -top-2 -right-2 bg-white/20 text-white rounded-full p-1 backdrop-blur-md"
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-3 w-3" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Community Chat Room - Fixed Version with Reviews Tab */}
      <ProductCommunityChatRoomFixed
        isOpen={showCommunityChat}
        onClose={() => setShowCommunityChat(false)}
        product={product}
        currentUser={currentUser}
        isMobile={true}
      />
    </>
  );
}