import { useState, useEffect, useRef } from "react";
import { Heart, ShoppingCart, Share2, Star, Eye, Ruler } from "lucide-react";
import { BootstrapIcon } from "../BootstrapIcon";
import { ChatIcon } from "../BootstrapIcon";
import { Product } from "../../types";
import { motion, AnimatePresence } from "motion/react";
import { getYouTubeEmbedUrl, getColorCode, renderStars } from "../../utils/homePageHelpers";

// Import live streaming functionality
import { getProductLiveStream, isProductInLiveStream, getProductStreamData } from "../../utils/homePageHelpers";
import { JoinLiveStreamButton } from "../streaming/JoinLiveStreamButton";

// Import the engaging incentive balloon
import { MobileIncentiveBalloon } from "./MobileIncentiveBalloon";

// Import social commerce components
import { SocialActivityFeed } from "./SocialActivityFeed";
import { LiveViewersIndicator } from "./LiveViewersIndicator";
import { QuickSocialActions } from "./QuickSocialActions";
import { SocialProofBadges } from "./SocialProofBadges";
import { CommunityReviewsPreview } from "./CommunityReviewsPreview";

// Import social commerce styles
import "../../styles/social-commerce-mobile.css";

// 🔥 MOBILE FLOATING CHAT BUTTON - Adapted from FloatingChatButton for mobile layout
interface MobileFloatingChatButtonProps {
  onClick: () => void;
}

function MobileFloatingChatButton({ onClick }: MobileFloatingChatButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 relative"
      style={{
        background: 'linear-gradient(135deg, #5825efff, #6e29f6)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(88, 37, 239, 0.4)'
      }}
      whileHover={{ 
        scale: 1.1,
        rotate: 5
      }}
      whileTap={{ 
        scale: 0.9,
        rotate: -5
      }}
      animate={{
        y: [0, -4, 0],
        boxShadow: [
          '0 4px 12px rgba(88, 37, 239, 0.4)',
          '0 8px 20px rgba(88, 37, 239, 0.6)',
          '0 4px 12px rgba(88, 37, 239, 0.4)'
        ]
      }}
      transition={{
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        },
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      title="Live Chat Support"
    >
      {/* Bootstrap Chat Icon */}
      <ChatIcon
        size={20}
        color="white"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
        }}
      />

      {/* Notification Pulse */}
      <motion.div
        className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #5825efff, #6e29f6)',
          border: '1px solid white'
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.7, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(88, 37, 239, 0.4), rgba(110, 41, 246, 0.4))',
          filter: 'blur(6px)',
          zIndex: -1
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
}

interface MobileHomeProductViewProps {
  products: Product[];
  currentProductIndex: number;
  selectedSize: string;
  selectedColor: string;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  onNavigateToSizeGuide?: () => void;
  onNavigateToReviews?: (product: Product) => void;
  onChatOpen?: () => void;
  onNavigateToLiveStream?: (streamId: string) => void;
  onIncentiveAction?: (offerId: string, product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export function MobileHomeProductView({
  products,
  currentProductIndex,
  selectedSize,
  selectedColor,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  onNavigateToSizeGuide,
  onNavigateToReviews,
  onChatOpen,
  onNavigateToLiveStream,
  onIncentiveAction,
  onQuickView
}: MobileHomeProductViewProps) {
  const [showProductInfo, setShowProductInfo] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const currentProduct = products[currentProductIndex];

  if (!currentProduct) return null;

  // Check if product is in live stream
  const streamData = getProductStreamData(currentProduct.id);

  const handleQuickViewClick = () => {
    if (currentProduct && onQuickView) {
      onQuickView(currentProduct);
    }
  };

  const handleNavigateToReviewsClick = () => {
    if (currentProduct && onNavigateToReviews) {
      onNavigateToReviews(currentProduct);
    }
  };

  const handleJoinLiveStream = () => {
    if (streamData.stream && onNavigateToLiveStream) {
      onNavigateToLiveStream(streamData.stream.id);
    }
  };

  const handleIncentiveAction = (offerId: string) => {
    if (onIncentiveAction && currentProduct) {
      onIncentiveAction(offerId, currentProduct);
    }
    
    // Trigger appropriate action based on offer type
    switch (offerId) {
      case 'flash-sale':
      case 'daily-special':
      case 'weekend-vibes':
        // Add to cart with discount
        onAddToCart(currentProduct, selectedSize, selectedColor);
        break;
      case 'exclusive-vip':
        // Could navigate to VIP section or apply special discount
        onAddToCart(currentProduct, selectedSize, selectedColor);
        break;
      case 'first-order':
        // Could navigate to sign up or apply first-timer discount
        onAddToCart(currentProduct, selectedSize, selectedColor);
        break;
      default:
        // Default action - add to cart
        onAddToCart(currentProduct, selectedSize, selectedColor);
    }
  };

  return (
    <motion.div
      key={`${currentProduct.id}-${currentProductIndex}`}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="relative w-full h-full"
    >
      <div className="absolute inset-0" style={{ overflow: 'hidden', zIndex: 1 }}>
        <iframe
          key={`video-${currentProduct.id}-${currentProductIndex}`}
          width="100%"
          height="100%"
          src={getYouTubeEmbedUrl(currentProduct.id, currentProduct)}
          title={`${currentProduct.name} Video`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: '-800px',
            left: '-200px',
            width: '200%',
            height: '200%',
            border: 'none',
            objectFit: 'cover',
            zIndex: 1
          }}
        />
        
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"
          style={{ zIndex: 2, pointerEvents: 'none' }}
        />
      </div>

      {/* 🌟 SOCIAL ACTIVITY FEED - Real-time user activity */}
      <SocialActivityFeed product={currentProduct} position="top" />

      {/* 🔥 JOIN LIVE STREAM BUTTON - Only show if product is in a live stream */}
      {streamData.isLive && streamData.stream && (
        <div className="absolute top-4 left-4" style={{ zIndex: 9999 }}>
          <JoinLiveStreamButton
            onJoinStream={handleJoinLiveStream}
            isLive={streamData.isLive}
            viewerCount={streamData.viewerCount}
          />
        </div>
      )}

      {/* 👥 LIVE VIEWERS INDICATOR - Show how many people are viewing */}
      <div className="absolute top-4 right-4" style={{ zIndex: 9999 }}>
        <LiveViewersIndicator productId={currentProduct.id} />
      </div>

      {/* 🔥 MOBILE INTERACTION BUTTONS - EXACT MATCH TO HOMEPAGE */}
      <div 
        className="absolute right-4 bottom-[193px] flex flex-col gap-4"
        style={{ zIndex: 9999 }}
      >
        <motion.div 
          className="flex flex-col items-center"
          whileTap={{ scale: 0.8 }}
        >
          <button
            onClick={() => onToggleFavorite(currentProduct)}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300"
            style={{
              backgroundColor: isFavorite(currentProduct.id) ? '#ff4757' : 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            <Heart 
              className={`h-6 w-6 ${isFavorite(currentProduct.id) ? 'fill-current' : ''}`}
            />
          </button>
          
          <span className="text-white text-xs mt-1 opacity-75 font-body">
            {Math.floor(Math.random() * 100) + 50}
          </span>
        </motion.div>

        <motion.div 
          className="flex flex-col items-center"
          whileTap={{ scale: 0.8 }}
        >
          <button
            onClick={() => onAddToCart(currentProduct, selectedSize, selectedColor)}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            <ShoppingCart className="h-6 w-6" />
          </button>
          
          <span className="text-white text-xs mt-1 opacity-75 font-body">
            Add
          </span>
        </motion.div>

        <motion.div 
          className="flex flex-col items-center"
          whileTap={{ scale: 0.8 }}
        >
          <button
            onClick={handleQuickViewClick}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            <Eye className="h-6 w-6" />
          </button>
          
          <span className="text-white text-xs mt-1 opacity-75 font-body">
            View
          </span>
        </motion.div>

        {/* 🔥 REVIEW PRODUCT FLOATING ICON BUTTON - EXACT MATCH TO HOMEPAGE */}
        <motion.div 
          className="flex flex-col items-center"
          whileTap={{ scale: 0.8 }}
        >
          <button
            onClick={handleNavigateToReviewsClick}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            <Star className="h-6 w-6" />
          </button>
          
          <span className="text-white text-xs mt-1 opacity-75 font-body">
            {Math.floor(Math.random() * 50) + 5}
          </span>
        </motion.div>

        <motion.div 
          className="flex flex-col items-center"
          whileTap={{ scale: 0.8 }}
        >
          <button
            onClick={() => { 
              if (navigator.share) {
                navigator.share({
                  title: currentProduct.name,
                  text: `Check out this ${currentProduct.name} from Modish Style!`,
                  url: window.location.href
                });
              }
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            <Share2 className="h-6 w-6" />
          </button>
          
          <span className="text-white text-xs mt-1 opacity-75 font-body">
            Share
          </span>
        </motion.div>

        {/* 🔥 ORANGE FLOATING CHAT BUTTON */}
        {onChatOpen && (
          <motion.div 
            className="flex flex-col items-center"
            whileTap={{ scale: 0.8 }}
          >
            <MobileFloatingChatButton onClick={onChatOpen} />
            <span className="text-white text-xs mt-1 opacity-75 font-body">
              Chat
            </span>
          </motion.div>
        )}
      </div>

      {/* 🔥 MOBILE PRODUCT INFO SECTION - EXACT MATCH TO HOMEPAGE STRUCTURE */}
      <AnimatePresence>
        {showProductInfo && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute left-0 right-0 bottom-0"
            style={{
              zIndex: 90,
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.85) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px 24px 0 0',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderBottom: 'none',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.3)',
              paddingBottom: '89px' // Account for mobile navigation
            }}
          >
            <div className="px-6 pt-8 pb-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-heading text-2xl text-white flex-1">{currentProduct.name}</h3>
                
                {/* 🔥 LIVE STREAM INDICATOR - Show if product is featured in live stream */}
                {streamData.isLive && streamData.stream && (
                  <motion.div
                    className="ml-3 px-2 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
                    style={{
                      background: 'linear-gradient(135deg, #e74c3c, #c0392b)'
                    }}
                    animate={{
                      boxShadow: [
                        '0 2px 8px rgba(231, 76, 60, 0.4)',
                        '0 4px 16px rgba(231, 76, 60, 0.6)',
                        '0 2px 8px rgba(231, 76, 60, 0.4)'
                      ]
                    }}
                    transition={{
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full bg-white"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.7, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <span>LIVE</span>
                  </motion.div>
                )}
              </div>
              
              {/* 🌟 SOCIAL PROOF BADGES */}
              <div className="mb-3">
                <SocialProofBadges product={currentProduct} />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center">{renderStars(currentProduct.rating)}</div>
                <span className="text-sm font-body text-white/70">({currentProduct.rating})</span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="font-heading text-2xl text-white">${currentProduct.price}</span>
                {currentProduct.originalPrice && (
                  <span className="text-lg line-through font-body text-white/50">${currentProduct.originalPrice}</span>
                )}
                {currentProduct.badge && (
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: currentProduct.badge === 'Sale' ? 'var(--error-red)' : 'var(--primary-blue)', 
                      color: 'var(--pure-white)' 
                    }}
                  >
                    {currentProduct.badge}
                  </div>
                )}
              </div>

              {/* 💬 QUICK SOCIAL ACTIONS */}
              <div className="mb-4">
                <QuickSocialActions 
                  product={currentProduct}
                  onShare={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: currentProduct.name,
                        text: `Check out this ${currentProduct.name} from Bato!`,
                        url: window.location.href
                      });
                    }
                  }}
                  onComment={onChatOpen}
                  onReaction={(emoji) => console.log('Reacted with:', emoji)}
                />
              </div>

              {/* 🔥 ACTION BUTTONS ROW - EXACTLY MATCHING HOMEPAGE */}
              <div className="flex gap-3 mt-5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAddToCart(currentProduct, selectedSize, selectedColor)}
                  className="flex-1 mobile-blue-button flex items-center justify-center"
                  style={{
                    backgroundColor: '#5825efff',
                    color: 'white',
                    fontFamily: 'var(--font-body)',
                    fontWeight: '500',
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                    border: 'none',
                    height: '3.5rem',
                    borderRadius: '8px'
                  }}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  ADD TO CART
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigateToSizeGuide && onNavigateToSizeGuide()}
                  className="px-6 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white'
                  }}
                >
                  <Ruler className="h-5 w-5" />
                </motion.button>

                {/* 🔥 JOIN LIVE STREAM BUTTON - Only show in action row if product is in live stream */}
                {streamData.isLive && streamData.stream && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleJoinLiveStream}
                    className="px-6 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                      color: 'white',
                      fontFamily: 'var(--font-body)',
                      fontWeight: '500',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      boxShadow: '0 4px 16px rgba(231, 76, 60, 0.4)',
                      border: 'none'
                    }}
                  >
                    <BootstrapIcon name="broadcast-pin" size={16} color="white" />
                    <span className="ml-2">LIVE</span>
                  </motion.button>
                )}
              </div>

              {/* 💬 COMMUNITY REVIEWS PREVIEW - Toggle visibility */}
              <AnimatePresence>
                {showReviews && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <CommunityReviewsPreview 
                      product={currentProduct}
                      onViewAll={handleNavigateToReviewsClick}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle Reviews Button */}
              <motion.button
                onClick={() => setShowReviews(!showReviews)}
                className="w-full mt-3 py-2 rounded-lg text-white font-body text-sm flex items-center justify-center gap-2"
                style={{
                  background: showReviews 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'linear-gradient(135deg, rgba(88, 37, 239, 0.3), rgba(110, 41, 246, 0.3))',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BootstrapIcon 
                  name={showReviews ? 'chevron-up' : 'chat-quote-fill'} 
                  className="w-4 h-4"
                />
                {showReviews ? 'Hide Reviews' : 'See What Others Say'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎉 ENGAGING INCENTIVE BALLOON - Appears every 30 seconds with exciting offers */}
      <MobileIncentiveBalloon
        onAction={handleIncentiveAction}
        onDismiss={() => {
          // Optional: Track dismissal analytics
          console.log('🎯 Incentive balloon dismissed for product:', currentProduct.name);
        }}
      />
    </motion.div>
  );
}