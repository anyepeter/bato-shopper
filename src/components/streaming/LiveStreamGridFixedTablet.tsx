import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { BootstrapIcon } from "../BootstrapIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { MOCK_STREAMS, LIVE_STREAMS } from "../../constants/streamingData";
import { SAMPLE_PRODUCTS } from "../../constants/products";
import { Stream, Product } from "../../types";
import { useApp } from "../AppProvider";
import { MobileLiveStreamFloatingButtons } from "./MobileLiveStreamFloatingButtons";
import { ProductThumbnail } from "./ProductThumbnail";
import { StreamCard } from "./StreamCard";
import { Search, Star } from "lucide-react";

// Import the unified shop pages CSS for consistency
import "../../styles/shop-pages.css";

// Enhanced Product Carousel Component with TikTok-Style Swipe Gestures
interface ProductCarouselProps {
  products: Product[];
  onCurrentProductChange?: (product: Product | null) => void;
}

function ProductCarousel({ products, onCurrentProductChange }: ProductCarouselProps) {
  const { state, actions, cart, favorites } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState(0);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Notify parent about current product change
  useEffect(() => {
    if (products.length > 0 && currentIndex < products.length) {
      const currentProduct = products[currentIndex];
      onCurrentProductChange?.(currentProduct);
    }
  }, [currentIndex, products, onCurrentProductChange]);

  const itemWidth = 180; // Larger cards for better visibility
  const gap = 16;
  const totalWidth = (itemWidth + gap) * products.length;

  // Auto-scroll functionality for TikTok-style experience
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % Math.max(1, products.length - 2);
          setDirection(1);
          return nextIndex;
        });
      }
    }, 4000); // Auto-advance every 4 seconds

    return () => clearInterval(interval);
  }, [isDragging, products.length]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const dragThreshold = 50;
    
    if (Math.abs(info.offset.x) > dragThreshold) {
      if (info.offset.x > 0 && currentIndex > 0) {
        // Swiped right - go to previous
        setCurrentIndex(currentIndex - 1);
        setDirection(-1);
      } else if (info.offset.x < 0 && currentIndex < products.length - 3) {
        // Swiped left - go to next
        setCurrentIndex(currentIndex + 1);
        setDirection(1);
      }
    }
  };

  const navigateToProduct = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setDirection(-1);
    } else if (direction === 'next' && currentIndex < products.length - 3) {
      setCurrentIndex(currentIndex + 1);
      setDirection(1);
    }
  };

  return (
    <div className="relative">
      {/* Enhanced Navigation Buttons */}
      <motion.button
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigateToProduct('prev')}
        disabled={currentIndex === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md"
        style={{
          backgroundColor: '#a7a4a899',
          opacity: currentIndex === 0 ? 0.3 : 0.8,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          transform: `translateX(-50%) translateY(-50%)`,
          left: '8px',
          color: '#FFFFFF'
        }}
        onMouseEnter={(e) => {
          if (currentIndex !== 0) {
            e.currentTarget.style.color = '#4040f8ff';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#FFFFFF';
        }}
      >
        <BootstrapIcon name="chevron-left" className="w-5 h-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1, x: 2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigateToProduct('next')}
        disabled={currentIndex >= products.length - 3}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md"
        style={{
          backgroundColor: '#a7a4a899',
          opacity: currentIndex >= products.length - 3 ? 0.3 : 0.8,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          transform: `translateX(50%) translateY(-50%)`,
          right: '8px',
          color: '#FFFFFF'
        }}
        onMouseEnter={(e) => {
          if (currentIndex < products.length - 3) {
            e.currentTarget.style.color = '#4040f8ff';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#FFFFFF';
        }}
      >
        <BootstrapIcon name="chevron-right" className="w-5 h-5" />
      </motion.button>

      {/* Carousel Container */}
      <div 
        ref={constraintsRef}
        className="overflow-hidden"
        style={{ paddingLeft: '24px', paddingRight: '24px' }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: -(totalWidth - 320), right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          animate={{ x: -currentIndex * (itemWidth + gap) }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.6
          }}
          className="flex gap-4 cursor-grab active:cursor-grabbing"
          style={{ width: totalWidth }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: index >= currentIndex && index < currentIndex + 3 ? 1 : 0.85,
                y: 0
              }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.05,
                y: -8,
                transition: { duration: 0.3, type: "spring" }
              }}
              className="group relative bg-white rounded-lg overflow-hidden shadow-lg"
              style={{ 
                width: itemWidth,
                minWidth: itemWidth,
                height: '240px', // Fixed height for consistent layout
                filter: index >= currentIndex && index < currentIndex + 3 
                  ? 'brightness(1) saturate(1)' 
                  : 'brightness(0.7) saturate(0.8)'
              }}
            >
              {/* Enhanced Product Image */}
              <div className="relative h-40 overflow-hidden">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  style={{
                    borderRadius: '3px 3px 0px 0px' // Top corners rounded, bottom corners 0px
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />

                {/* Shimmer Effect on Hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%', opacity: 0 }}
                  whileHover={{ x: '100%', opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                
                {/* Enhanced Product Badge with Animation */}
                <div className="absolute top-2 left-2">
                  {product.badge && (
                    <motion.span
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      className={`px-2 py-1 text-white text-xs font-bold shadow-lg ${
                        product.badge === 'New' ? 'bg-orange-500' :
                        product.badge === 'Sale' ? 'bg-red-600' :
                        product.badge === 'Popular' ? 'bg-blue-600' :
                        product.badge === 'Limited' ? 'bg-purple-600' :
                        'bg-gray-600'
                      }`}
                      style={{
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {product.badge}
                    </motion.span>
                  )}
                </div>

                {/* Animated Discount Badge */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <motion.div
                    initial={{ scale: 0, rotate: 10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.1, rotate: -2 }}
                    className="absolute top-2 right-2"
                  >
                    <span 
                      className="px-2 py-1 bg-black text-white text-xs font-bold shadow-lg"
                      style={{
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                        background: 'linear-gradient(135deg, #000000, #333333)'
                      }}
                    >
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </motion.div>
                )}

                {/* Enhanced Floating Action Buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center"
                >
                  <div className="flex gap-2">
                    {/* View Product Button */}
                    <motion.button
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        actions.setSelectedProduct(product);
                        if (state.isMobile) {
                          actions.navigateToPage('product-details');
                        } else {
                          actions.setIsModalOpen(true);
                        }
                      }}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-xl"
                      style={{
                        backgroundColor: '#a7a4a899',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#4040f8ff';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#a7a4a899';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                    >
                      <BootstrapIcon name="eye" className="w-4 h-4 text-white" />
                    </motion.button>

                    {/* Add to Cart Button */}
                    <motion.button
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const defaultSize = product.sizes?.[0] || '';
                        const defaultColor = product.colors?.[0] || '';
                        cart.handleAddToCart(product, defaultSize, defaultColor);
                      }}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-xl"
                      style={{
                        backgroundColor: '#a7a4a899',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#4040f8ff';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#a7a4a899';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                    >
                      <BootstrapIcon name="cart-plus" className="w-4 h-4 text-white" />
                    </motion.button>

                    {/* Favorite Button */}
                    <motion.button
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => favorites.handleToggleFavorite(product)}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-xl"
                      style={{
                        backgroundColor: '#a7a4a899',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        const isFavorite = favorites.favoriteItems.some(item => item.id === product.id);
                        e.currentTarget.style.backgroundColor = isFavorite ? '#ff0000' : '#4040f8ff';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        const isFavorite = favorites.favoriteItems.some(item => item.id === product.id);
                        e.currentTarget.style.backgroundColor = '#a7a4a899';
                        e.currentTarget.style.color = isFavorite ? '#ff0000' : '#FFFFFF';
                      }}
                    >
                      <BootstrapIcon 
                        name={favorites.favoriteItems.some(item => item.id === product.id) ? "heart-fill" : "heart"} 
                        className="w-4 h-4"
                        style={{
                          color: favorites.favoriteItems.some(item => item.id === product.id) ? '#ff0000' : '#FFFFFF'
                        }}
                      />
                    </motion.button>
                  </div>
                </motion.div>
              </div>
              
              {/* Enhanced Product Info */}
              <motion.div 
                className="p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.h4 
                  className="font-body text-sm font-medium mb-2 line-clamp-2"
                  style={{ color: '#FFFFFF' }}
                  whileHover={{ color: '#5825ef' }}
                  transition={{ duration: 0.2 }}
                >
                  {product.name}
                </motion.h4>

                {/* Enhanced Star Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: star * 0.05, duration: 0.4 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      <BootstrapIcon
                        name={star <= Math.floor(product.rating) ? "star-fill" : "star"}
                        className="w-3 h-3"
                        style={{
                          color: star <= Math.floor(product.rating) ? '#fbbf24' : '#d1d5db'
                        }}
                      />
                    </motion.div>
                  ))}
                  <span className="text-sm ml-1">({product.rating})</span>
                </div>

                {/* Enhanced Price Display */}
                <div className="flex items-center gap-2">
                  <motion.span 
                    className="font-body text-lg font-bold text-gray-900"
                    whileHover={{ scale: 1.05 }}
                    style={{ color: '#5825ef' }}
                  >
                    ${product.price}
                  </motion.span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <motion.span 
                      className="font-body text-sm text-gray-500 line-through"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      ${product.originalPrice}
                    </motion.span>
                  )}
                </div>
              </motion.div>

              {/* Pulse Effect for Current Items */}
              {index >= currentIndex && index < currentIndex + 3 && (
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(88, 37, 239, 0.1), rgba(88, 37, 239, 0.05))',
                    border: '2px solid rgba(88, 37, 239, 0.3)'
                  }}
                  animate={{ 
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.01, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Progress Indicators */}
      <motion.div 
        className="flex justify-center gap-2 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {Array.from({ length: Math.max(1, products.length - 2) }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setDirection(index > currentIndex ? 1 : -1);
            }}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: index === currentIndex ? '#5825ef' : 'rgba(255, 255, 255, 0.4)',
              boxShadow: index === currentIndex ? '0 0 8px rgba(88, 37, 239, 0.6)' : 'none'
            }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </motion.div>
    </div>
  );
}

// Mobile Full-Screen Stream Viewer Component
interface MobileFullScreenStreamViewerProps {
  streams: Stream[];
  onStreamClick: (stream: Stream) => void;
  onNavigateToHome: () => void;
}

function MobileFullScreenStreamViewer({ streams, onStreamClick, onNavigateToHome }: MobileFullScreenStreamViewerProps) {
  const { state, actions, cart, favorites } = useApp();
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showStreamInfo, setShowStreamInfo] = useState(true);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const productsScrollRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  const currentStream = streams[currentStreamIndex];

  useEffect(() => {
    if (streams.length > 0 && currentStreamIndex >= streams.length) {
      setCurrentStreamIndex(0);
    }
  }, [streams.length, currentStreamIndex]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleStreamNavigation = (direction: 'up' | 'down') => {
      if (isScrolling) return;
      
      isScrolling = true;
      setIsScrolling(true);

      if (direction === 'down' && currentStreamIndex < streams.length - 1) {
        setCurrentStreamIndex(prev => prev + 1);
      } else if (direction === 'up' && currentStreamIndex > 0) {
        setCurrentStreamIndex(prev => prev - 1);
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        setIsScrolling(false);
      }, 800);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;
      const direction = e.deltaY > 0 ? 'down' : 'up';
      handleStreamNavigation(direction);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      const deltaY = touchStartY.current - touchEndY;
      const deltaTime = touchEndTime - touchStartTime.current;
      
      if (Math.abs(deltaY) > 50 && deltaTime < 500) {
        const direction = deltaY > 0 ? 'down' : 'up';
        handleStreamNavigation(direction);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(scrollTimeout);
    };
  }, [currentStreamIndex, streams.length]);

  const handleWatchStream = () => {
    console.log('🔥 MOBILE: handleWatchStream called', { 
      currentStream: currentStream?.title, 
      isLive: currentStream?.isLive 
    });
    
    if (currentStream && currentStream.isLive) {
      console.log('🎯 MOBILE: Navigating to watch-live-stream page');
      // Navigate to the dedicated watch live stream page
      actions.navigateToPage('watch-live-stream');
    } else if (currentStream) {
      console.log('🎯 MOBILE: Using modal for non-live stream');
      // For non-live streams, use the existing modal behavior
      onStreamClick(currentStream);
    }
  };

  // Product navigation functions
  const handlePreviousProduct = () => {
    if (!currentStream?.products) return;
    const newIndex = currentProductIndex > 0 ? currentProductIndex - 1 : currentStream.products.length - 1;
    setCurrentProductIndex(newIndex);
  };

  const handleNextProduct = () => {
    if (!currentStream?.products) return;
    const newIndex = currentProductIndex < currentStream.products.length - 1 ? currentProductIndex + 1 : 0;
    setCurrentProductIndex(newIndex);
  };

  // Reset product index when stream changes
  useEffect(() => {
    setCurrentProductIndex(0);
  }, [currentStreamIndex]);

  if (streams.length === 0) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #000000, #1a1a1a, #000000)' }}
      >
        <div className="text-center">
          <BootstrapIcon name="camera-video-off" className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h2 className="font-heading text-2xl text-white mb-2">No Streams Available</h2>
          <p className="text-white/60 font-body mb-6">Check back soon for live streaming content!</p>
          <button
            onClick={onNavigateToHome}
            className="px-6 py-3 font-body font-medium text-white transition-all duration-300 hover:scale-105"
            style={{ 
              background: 'var(--primary-blue)',
              boxShadow: '0 8px 32px rgba(88, 37, 239, 0.4)',
              borderRadius: '8px'
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="fixed right-4 z-50" style={{ top: '270px', backgroundColor: 'transparent' }}>
        <MobileLiveStreamFloatingButtons
          onFavoritesClick={() => actions.navigateToPage('mobile-favorites')}
          onReviewsClick={() => actions.navigateToPage('reviews')}
          onShareClick={() => {
            if (navigator.share && currentStream) {
              navigator.share({
                title: currentStream.title,
                text: `Watch ${currentStream.streamerName} live on Bato!`,
                url: window.location.href
              }).catch(console.error);
            } else {
              navigator.clipboard.writeText(window.location.href).catch(console.error);
            }
          }}
          onChatClick={() => {
            console.log('🔥 MOBILE LIVE STREAM CHAT BUTTON CLICKED!');
            if (state.isAdminMode === true) {
              actions.setIsChatOpen(false);
              actions.setIsAdminChatOpen(true);
            } else {
              actions.setIsAdminChatOpen(false);
              actions.setIsChatOpen(true);
            }
          }}
          onSearchQuery={(query) => {
            console.log('Search query:', query);
          }}
          onCategorySelect={(category) => {
            console.log('Selected category:', category);
          }}
          favoritesCount={favorites.favoriteItems.length}
          selectedCategory="all"
        />
      </div>

      <div 
        ref={containerRef}
        className="fixed inset-0 overflow-hidden"
        style={{ 
          height: '100vh',
          zIndex: 1,
          background: 'linear-gradient(135deg, #000000, #1a1a1a, #000000)',
          paddingTop: '64px'
        }}
      >
        {currentStream && (
          <motion.div
            key={`${currentStream.id}-${currentStreamIndex}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            <div className="absolute inset-0">
              <img
                src={currentStream.thumbnailImage}
                alt={currentStream.title}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.7) contrast(1.1)' }}
              />
              
              <div 
                className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"
                style={{ zIndex: 2 }}
              />
            </div>

            <AnimatePresence>
              {showStreamInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="absolute left-0 right-0 bottom-0"
                  style={{
                    zIndex: 90,
                    background: 'transparent',
                    backdropFilter: 'none',
                    paddingBottom: '40px'
                  }}
                >
                  <div className="px-6 pt-8 pb-6">
                    {currentStream.isLive && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ boxShadow: '0 0 10px #ef4444' }}></div>
                        <span className="font-body text-sm text-red-500 font-bold tracking-wide">LIVE</span>
                        <div className="flex items-center gap-1 ml-2">
                          <BootstrapIcon name="eye" className="w-4 h-4 text-white/60" />
                          <span className="font-body text-sm text-white/60">{currentStream.viewerCount.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    <h3 className="font-heading text-2xl mb-2 text-white font-bold">{currentStream.title}</h3>
                    <p className="font-body text-lg mb-3 font-semibold" style={{ color: 'var(--primary-blue)' }}>{currentStream.streamerName}</p>
                    <p className="font-body text-base text-white/80 line-clamp-2 mb-4 leading-relaxed">
                      {currentStream.description || `Live fashion show featuring ${currentStream.category} designs`}
                    </p>

                    {/* Tags */}
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 bg-white/20 text-white font-body text-sm rounded-full">
                        Traditional Designs
                      </span>
                      <span className="px-3 py-1 bg-white/20 text-white font-body text-sm rounded-full">
                        3 hours left
                      </span>
                    </div>

                    {/* Enhanced Featured Products Section with Swipe Gestures & TikTok-Style Animations */}
                    <div className="mb-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex items-center justify-between mb-4"
                      >
                        <h3 className="text-white font-body text-lg font-medium">
                          🔥 Featured Products ({SAMPLE_PRODUCTS.slice(0, 6).length}/6)
                        </h3>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
                          className="flex items-center gap-2 px-3 py-1"
                          style={{
                            background: 'linear-gradient(135deg, rgba(88, 37, 239, 0.2), rgba(88, 37, 239, 0.4))',
                            border: '1px solid rgba(88, 37, 239, 0.3)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '4px'
                          }}
                        >
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          >
                            ✨
                          </motion.div>
                          <span className="text-white text-xs font-medium">Swipe to explore</span>
                        </motion.div>
                      </motion.div>
                      
                      {/* Enhanced Product Cards Carousel with Swipe Gestures */}
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      >
                        <ProductCarousel products={SAMPLE_PRODUCTS.slice(0, 6)} />
                      </motion.div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="px-3 py-1 backdrop-blur-md" style={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px'
                      }}>
                        <span className="font-body text-sm text-white font-medium">
                          {currentStream.category}
                        </span>
                      </div>
                      
                      {currentStream.products && currentStream.products.length > 0 && (
                        <div className="px-3 py-1 backdrop-blur-md" style={{ 
                          background: 'rgba(88, 37, 239, 0.2)',
                          border: '1px solid rgba(88, 37, 239, 0.3)',
                          borderRadius: '8px'
                        }}>
                          <span className="font-body text-sm font-bold" style={{ color: 'var(--primary-blue)' }}>
                            {currentStream.products.length} items ✨
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 px-6 font-body font-bold text-white transition-all duration-300"
                        style={{
                          background: 'var(--primary-blue)',
                          borderRadius: '8px',
                          border: 'none',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          fontSize: '14px',
                          boxShadow: '0 8px 32px rgba(88, 37, 239, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onClick={handleWatchStream}
                      >
                        <BootstrapIcon name="play-circle-fill" className="w-5 h-5" />
                        Watch Live Stream
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute right-4 top-1/2 transform -translate-y-1/2" style={{ zIndex: 100 }}>
              <div className="flex flex-col gap-2">
                {streams.map((_, index) => (
                  <div
                    key={index}
                    className="w-1 h-8 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor: index === currentStreamIndex 
                        ? 'var(--primary-blue)' 
                        : 'rgba(255, 255, 255, 0.3)'
                    }}
                  />
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStreamInfo(!showStreamInfo)}
              className="absolute top-20 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                zIndex: 100
              }}
              title={showStreamInfo ? 'Hide stream info' : 'Show stream info'}
            >
              <BootstrapIcon name={showStreamInfo ? 'eye-slash' : 'eye'} className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Main LiveStreamGrid Component with Tablet Trending Section
interface LiveStreamGridProps {
  onStreamClick: (stream: Stream) => void;
  onNavigateToPage: (page: string) => void;
}

function LiveStreamGrid({ onStreamClick, onNavigateToPage }: LiveStreamGridProps) {
  const { state, actions, cart, favorites } = useApp();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [streamStatus, setStreamStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [activeTrendingTab, setActiveTrendingTab] = useState<'live' | 'popular'>('live');
  const [forceRerender, setForceRerender] = useState(0);
  
  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      return !state.isMobile && width >= 768 && width < 1200;
    }
    return false;
  });

  const getStreamGridCols = () => {
    if (state.isMobile) return 'grid-cols-1';
    if (isTablet) return 'grid-cols-2';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  };

  useEffect(() => {
    const handleResize = () => {
      setForceRerender(prev => prev + 1);
      const width = window.innerWidth;
      setIsTablet(!state.isMobile && width >= 768 && width < 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.isMobile]);

  const allStreams = MOCK_STREAMS;

  const filteredStreams = allStreams.filter(stream => {
    const matchesSearch = searchQuery === "" || 
      stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.streamerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || stream.category === selectedCategory;
    
    const matchesStatus = streamStatus === "all" || 
      (streamStatus === "live" && stream.isLive) ||
      (streamStatus === "upcoming" && !stream.isLive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStreams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStreams = filteredStreams.slice(startIndex, endIndex);

  const handleStreamClick = (stream: Stream) => {
    console.log('🎯 Stream clicked:', stream.title);
    onStreamClick(stream);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, streamStatus]);

  if (state.isMobile) {
    return (
      <MobileFullScreenStreamViewer
        streams={filteredStreams}
        onStreamClick={handleStreamClick}
        onNavigateToHome={() => onNavigateToPage('home')}
      />
    );
  }

  const getLiveStreams = () => {
    return allStreams
      .filter(stream => 
        stream.isLive || 
        stream.viewerCount >= 5000 || 
        stream.category === 'Fashion Shows'
      )
      .slice(0, 4);
  };

  const getPopularStreams = () => {
    return allStreams
      .filter(stream => 
        stream.viewerCount >= 1000 ||
        stream.category === 'Product Reviews'
      )
      .sort((a, b) => b.viewerCount - a.viewerCount)
      .slice(0, 4);
  };

  const categoryData = [
    { id: 'all', name: 'All Streams', count: allStreams.length, icon: '🎥' },
    { id: 'Fashion Shows', name: 'Fashion Shows', count: allStreams.filter(s => s.category === 'Fashion Shows').length, icon: '👗' },
    { id: 'Product Reviews', name: 'Product Reviews', count: allStreams.filter(s => s.category === 'Product Reviews').length, icon: '⭐' },
    { id: 'Styling Tips', name: 'Styling Tips', count: allStreams.filter(s => s.category === 'Styling Tips').length, icon: '💄' },
    { id: 'Behind the Scenes', name: 'Behind the Scenes', count: allStreams.filter(s => s.category === 'Behind the Scenes').length, icon: '🎬' },
    { id: 'Live Now', name: 'Live Now', count: allStreams.filter(s => s.isLive).length, icon: '🔴' }
  ];

  const getCategoryIconSize = () => {
    if (state.isMobile) return '24px';
    return '20px';
  };

  const getLayoutClasses = () => {
    if (state.isMobile) {
      return {
        container: 'flex flex-col gap-5 px-0',
        leftPanel: 'hidden',
        middlePanel: 'w-full px-5',
        rightPanel: 'w-full px-5 order-first'
      };
    }
    
    if (isTablet) {
      return {
        container: 'flex gap-5 max-w-[1600px] mx-auto px-5',
        leftPanel: 'w-1/3 overflow-y-auto',
        middlePanel: 'w-2/3 overflow-y-auto',
        rightPanel: 'hidden'
      };
    }
    
    return {
      container: 'flex gap-5 px-2.5',
      leftPanel: 'w-1/6 overflow-y-auto',
      middlePanel: 'flex-1 overflow-y-auto',
      rightPanel: 'w-1/6 overflow-y-auto'
    };
  };

  // 🎯 TRENDING SECTION - HOME PAGE STYLE: Proper product cards for Desktop only
  const renderTrendingSection = () => {
    // Show for Desktop (≥1200px) only, hide for Tablet (768px-1199px) and Mobile (<768px)
    if (state.isMobile || isTablet) return null;

    const trendingStreams = activeTrendingTab === 'live' ? getLiveStreams() : getPopularStreams();

    return (
      <div className="shop-trending-container">
        <div className="shop-panel-card shop-trending-card smooth-animated">
          <div className="shop-trending-header">
            <BootstrapIcon name="trending_up" size={16} color="var(--primary-blue)" />
            <span className="shop-trending-title">Trending</span>
          </div>

          <div className={`trending-tabs-container ${activeTrendingTab === 'popular' ? 'trending-active' : ''}`}>
            {[
              { key: 'live', label: 'Hot', icon: 'fire' },
              { key: 'popular', label: 'Trending', icon: 'trending_up' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  const newTab = tab.key as 'live' | 'popular';
                  if (activeTrendingTab !== newTab) {
                    const container = document.querySelector('.trending-tabs-container');
                    
                    if (container) {
                      if (newTab === 'popular') {
                        container.classList.add('animate-to-trending');
                        container.classList.remove('animate-to-hot');
                      } else {
                        container.classList.add('animate-to-hot');
                        container.classList.remove('animate-to-trending');
                      }
                    }
                    
                    setActiveTrendingTab(newTab);
                  }
                }}
                className={`trending-tab-button ${activeTrendingTab === tab.key ? 'active' : ''}`}
                data-tab={tab.key}
              >
                <BootstrapIcon name={tab.icon} size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="shop-trending-products">
            {trendingStreams.map((stream, index) => (
              <motion.div
                key={stream.id}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2, ease: [0.25, 0.8, 0.25, 1] }}
                className="shop-trending-product-card shop-interactive smooth-animated"
                onClick={() => handleStreamClick(stream)}
                style={{
                  borderRadius: '3px',
                  boxShadow: window.innerWidth >= 768 
                    ? 'var(--shadow-standard-desktop)'
                    : '0 4px 10px rgba(0, 0, 0, 0.1)',
                  border: window.innerWidth >= 768 ? 'var(--border-standard-desktop)' : '1px solid rgba(223, 102, 13, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-standard-desktop)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-standard-desktop)';
                  }
                }}
              >
                <div 
                  className="shop-trending-product-image-container"
                  style={{ borderRadius: '3px' }}
                >
                  <img
                    src={stream.thumbnailImage}
                    alt={stream.title}
                    className="shop-trending-product-image"
                    style={{ borderRadius: '3px' }}
                  />
                  
                  {/* Live Badge - positioned like in the screenshots */}
                  {stream.isLive && (
                    <div 
                      className="shop-trending-product-badge default"
                      style={{
                        borderRadius: '3px',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white'
                      }}
                    >
                      LIVE
                    </div>
                  )}
                  
                  {/* Additional stream badges like NEW, POPULAR */}
                  {stream.category === 'Fashion Shows' && (
                    <div 
                      className="shop-trending-product-badge default"
                      style={{
                        borderRadius: '3px',
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        color: 'white',
                        top: '8px',
                        left: '8px'
                      }}
                    >
                      NEW
                    </div>
                  )}
                  
                  {stream.viewerCount > 5000 && (
                    <div 
                      className="shop-trending-product-badge default"
                      style={{
                        borderRadius: '3px',
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        color: 'white',
                        top: stream.category === 'Fashion Shows' ? '40px' : '8px',
                        left: '8px'
                      }}
                    >
                      POPULAR
                    </div>
                  )}
                </div>
                
                <div className="shop-trending-product-info">
                  <h4 className="shop-trending-product-name">{stream.title}</h4>
                  <div className="shop-trending-product-rating">{renderStars(stream.rating || 4.5)}</div>
                  <div className="shop-trending-product-price">
                    <span className="shop-trending-product-current-price">{stream.viewerCount.toLocaleString()}</span>
                    <span className="shop-trending-product-original-price">viewers</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />);
    }

    return stars;
  };

  const layoutClasses = getLayoutClasses();

  return (
    <div 
      className="min-h-screen py-8"
      style={{ backgroundColor: 'var(--light-gray)' }}
    >
      <div className={layoutClasses.container}>
        {/* Left Panel - Search & Filter */}
        <div className={layoutClasses.leftPanel}>
          <div 
            className="p-5 rounded mb-5 sticky top-5"
            style={{ 
              backgroundColor: 'var(--pure-white)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-standard-desktop)',
              maxHeight: 'calc(100vh - 40px)'
            }}
          >
            <h3 className="font-heading font-medium mb-4" style={{ color: 'var(--primary-blue)' }}>
              Filter Streams
            </h3>

            {/* Search */}
            <div className="mb-4">
              <label className="font-body text-sm font-medium mb-2 block" style={{ color: 'var(--text-dark)' }}>
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--medium-gray)' }} />
                <Input
                  placeholder="Search streams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-body text-sm"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--pure-white)'
                  }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="font-body text-sm font-medium mb-2 block" style={{ color: 'var(--text-dark)' }}>
                Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger 
                  className="w-full font-body text-sm"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--pure-white)'
                  }}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryData.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: getCategoryIconSize() }}>{category.icon}</span>
                        <span>{category.name}</span>
                        <span className="text-xs" style={{ color: 'var(--medium-gray)' }}>({category.count})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stream Status Filter */}
            <div className="mb-4">
              <label className="font-body text-sm font-medium mb-2 block" style={{ color: 'var(--text-dark)' }}>
                Status
              </label>
              <Select value={streamStatus} onValueChange={setStreamStatus}>
                <SelectTrigger 
                  className="w-full font-body text-sm"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--pure-white)'
                  }}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Streams</SelectItem>
                  <SelectItem value="live">Live Now</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Items per page */}
            <div className="mb-4">
              <label className="font-body text-sm font-medium mb-2 block" style={{ color: 'var(--text-dark)' }}>
                Streams per page
              </label>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger 
                  className="w-full font-body text-sm"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--pure-white)'
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 streams</SelectItem>
                  <SelectItem value="12">12 streams</SelectItem>
                  <SelectItem value="24">24 streams</SelectItem>
                  <SelectItem value="48">48 streams</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setStreamStatus("all");
                setCurrentPage(1);
              }}
              className="w-full font-body text-sm"
              style={{
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--pure-white)'
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Middle Panel - Stream Grid */}
        <div className={layoutClasses.middlePanel}>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="font-heading text-3xl font-bold mb-2" style={{ color: 'var(--text-dark)' }}>
                  Live Streams
                </h1>
                <p className="font-body" style={{ color: 'var(--medium-gray)' }}>
                  {filteredStreams.length} stream{filteredStreams.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              {filteredStreams.length > 0 && (
                <div className="flex items-center gap-2 font-body text-sm">
                  <span style={{ color: 'var(--medium-gray)' }}>Page</span>
                  <span style={{ color: 'var(--primary-blue)' }} className="font-medium">
                    {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </div>

            {/* Stream Grid */}
            {filteredStreams.length > 0 ? (
              <>
                <div className={`grid gap-6 ${getStreamGridCols()}`}>
                  {paginatedStreams.map((stream, index) => (
                    <StreamCard
                      key={stream.id}
                      stream={stream}
                      onClick={() => handleStreamClick(stream)}
                      priority={index < 4}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) {
                                setCurrentPage(currentPage - 1);
                              }
                            }}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                        
                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }
                          
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(pageNumber);
                                }}
                                isActive={currentPage === pageNumber}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) {
                                setCurrentPage(currentPage + 1);
                              }
                            }}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <BootstrapIcon name="camera-video-off" className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--medium-gray)' }} />
                <h3 className="font-heading text-xl font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                  No streams found
                </h3>
                <p className="font-body mb-4" style={{ color: 'var(--medium-gray)' }}>
                  Try adjusting your filters or search terms
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setStreamStatus("all");
                    setCurrentPage(1);
                  }}
                  style={{
                    background: 'var(--primary-blue)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  className="font-body text-white hover:scale-105 transition-transform"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Trending (Desktop only) */}
        <div className={layoutClasses.rightPanel}>
          {renderTrendingSection()}
        </div>
      </div>
    </div>
  );
}

export default LiveStreamGrid;