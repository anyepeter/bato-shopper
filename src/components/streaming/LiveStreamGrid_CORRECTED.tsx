import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BootstrapIcon } from "../BootstrapIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { MOCK_STREAMS, LIVE_STREAMS } from "../../constants/streamingData";
import { Stream } from "../../types";
import { useApp } from "../AppProvider";
import { ProductThumbnail } from "./ProductThumbnail";

// Import the unified shop pages CSS for consistency
import "../../styles/shop-pages.css";

// Floating Stream Categories for Full-Screen Mode
interface FloatingStreamCategoriesProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

function FloatingStreamCategories({ selectedCategory, onCategorySelect }: FloatingStreamCategoriesProps) {
  const STREAM_CATEGORIES = ['all', 'traditional-designs', 'contemporary-african', 'designer-showcases'];
  
  const CATEGORY_ICONS = {
    'all': 'grid',
    'traditional-designs': 'star',
    'contemporary-african': 'palette',  
    'designer-showcases': 'award'
  };

  const STREAM_CATEGORY_LABELS = {
    'all': 'All',
    'traditional-designs': 'Traditional',
    'contemporary-african': 'Contemporary', 
    'designer-showcases': 'Designer'
  };

  return (
    <div className="flex gap-2 px-3 py-2 backdrop-blur-md" style={{ 
      background: 'rgba(0, 0, 0, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      borderRadius: '3px' // Design system constraint
    }}>
      {STREAM_CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category;
        const iconName = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
        
        return (
          <motion.button
            key={category}
            onClick={() => onCategorySelect(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-2 font-body text-xs font-bold transition-all duration-300"
            style={{ 
              background: isSelected 
                ? 'var(--primary-blue)' // Orange gradient theme
                : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
              boxShadow: isSelected 
                ? '0 0 15px rgba(223, 102, 13, 0.4)'
                : 'none',
              borderRadius: '3px' // Design system constraint
            }}
          >
            <BootstrapIcon 
              name={iconName} 
              className="w-3 h-3 text-white"
              style={{ 
                filter: isSelected ? 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))' : 'none'
              }}
            />
            <span className="whitespace-nowrap">
              {STREAM_CATEGORY_LABELS[category as keyof typeof STREAM_CATEGORY_LABELS]}
            </span>
          </motion.button>
        );
      })}
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
    if (currentStream) {
      onStreamClick(currentStream);
    }
  };

  // Product navigation functions
  const scrollToProduct = (index: number) => {
    if (!productsScrollRef.current || !currentStream?.products) return;
    
    const container = productsScrollRef.current;
    const productWidth = 180; // Approximate width of each product thumbnail
    const gap = 12; // Gap between products
    const scrollPosition = index * (productWidth + gap);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    setCurrentProductIndex(index);
  };

  const handlePreviousProduct = () => {
    if (!currentStream?.products) return;
    const newIndex = currentProductIndex > 0 ? currentProductIndex - 1 : currentStream.products.length - 1;
    scrollToProduct(newIndex);
  };

  const handleNextProduct = () => {
    if (!currentStream?.products) return;
    const newIndex = currentProductIndex < currentStream.products.length - 1 ? currentProductIndex + 1 : 0;
    scrollToProduct(newIndex);
  };

  // Reset product index when stream changes
  useEffect(() => {
    setCurrentProductIndex(0);
  }, [currentStreamIndex]);

  // Enhanced touch gesture support for product navigation
  useEffect(() => {
    const container = productsScrollRef.current;
    if (!container || !currentStream?.products) return;

    let touchStartX = 0;
    let touchStartTime = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
      isDragging = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) {
        const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
        if (deltaX > 10) {
          isDragging = true;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndTime = Date.now();
      const deltaX = touchStartX - touchEndX;
      const deltaTime = touchEndTime - touchStartTime;

      // Check for swipe gesture (minimum distance and maximum time)
      if (Math.abs(deltaX) > 50 && deltaTime < 500) {
        if (deltaX > 0) {
          // Swipe left - next product
          handleNextProduct();
        } else {
          // Swipe right - previous product
          handlePreviousProduct();
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentStream?.products, currentProductIndex]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentStream?.products || currentStream.products.length <= 1) return;
      
      // Only handle keyboard events when the products section is visible
      if (!showStreamInfo) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePreviousProduct();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNextProduct();
          break;
        case 'Home':
          e.preventDefault();
          scrollToProduct(0);
          break;
        case 'End':
          e.preventDefault();
          scrollToProduct(currentStream.products.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStream?.products, showStreamInfo]);

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
              background: 'var(--primary-blue)', // Orange gradient theme
              boxShadow: '0 8px 32px rgba(223, 102, 13, 0.4)',
              borderRadius: '3px' // Design system constraint
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
      {/* Floating Stream Categories - 20px below main Header (64px + 20px = 84px) */}
      <div className="fixed left-1/2 transform -translate-x-1/2 z-40" style={{ top: '84px' }}>
        <FloatingStreamCategories 
          selectedCategory="all"
          onCategorySelect={() => {}}
        />
      </div>

      <div 
        ref={containerRef}
        className="fixed inset-0 overflow-hidden"
        style={{ 
          height: '100vh',
          zIndex: 1,
          background: 'linear-gradient(135deg, #000000, #1a1a1a, #000000)',
          paddingTop: '64px' // Account for main Header component
        }}
      >
        {/* TikTok-style Electric Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-r from-blue-500/15 to-green-500/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-orange-500/15 to-red-500/15 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Electric Particles */}
          <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ boxShadow: '0 0 15px #06b6d4' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '2s', boxShadow: '0 0 10px #ec4899' }}></div>
          <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s', boxShadow: '0 0 12px #4ade80' }}></div>
        </div>

        {currentStream && (
          <motion.div
            key={`${currentStream.id}-${currentStreamIndex}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            {/* Full-Screen Stream Background */}
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

            {/* Stream Info Overlay */}
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
                    borderRadius: '0px',
                    border: 'none',
                    boxShadow: 'none',
                    paddingBottom: '40px'
                  }}
                >
                  <div className="px-6 pt-8 pb-6">
                    {/* Live Indicator */}
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
                      {currentStream.description || `Live African fashion show featuring ${currentStream.category} designs`}
                    </p>

                    {/* Stream Meta */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="px-3 py-1 rounded-full backdrop-blur-md" style={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '3px'
                      }}>
                        <span className="font-body text-sm text-white font-medium">
                          {currentStream.category}
                        </span>
                      </div>
                      
                      {currentStream.products.length > 0 && (
                        <div className="px-3 py-1 backdrop-blur-md" style={{ 
                          background: 'rgba(223, 102, 13, 0.2)', // Orange theme
                          border: '1px solid rgba(223, 102, 13, 0.3)',
                          borderRadius: '3px'
                        }}>
                          <span className="font-body text-sm font-bold" style={{ color: 'var(--primary-blue)' }}>
                            {currentStream.products.length} items ✨
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Thumbnails with Navigation - Enhanced */}
                    {currentStream.products && currentStream.products.length > 0 && (
                      <div 
                        style={{ 
                          marginTop: '10px', 
                          marginBottom: '10px',
                          padding: '16px',
                          borderRadius: '0px',
                          background: 'transparent',
                          border: 'none',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        {/* Header with Navigation Controls */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <BootstrapIcon name="bag-fill" className="w-4 h-4" style={{
                              color: 'var(--primary-blue)',
                              filter: 'drop-shadow(0 0 4px rgba(223, 102, 13, 0.5))'
                            }} />
                            <span className="font-body text-sm font-bold" style={{
                              color: 'var(--primary-blue)',
                              textShadow: '0 0 8px rgba(223, 102, 13, 0.3)'
                            }}>
                              Featured Products ({currentProductIndex + 1}/{currentStream.products.length})
                            </span>
                          </div>
                          
                          {/* Navigation Controls */}
                          {currentStream.products.length > 1 && (
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePreviousProduct}
                                className="w-8 h-8 flex items-center justify-center transition-all duration-300"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.1)',
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  color: 'white',
                                  borderRadius: '3px' // Design system constraint
                                }}
                                title="Previous Product"
                              >
                                <BootstrapIcon name="chevron-left" className="w-4 h-4" />
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNextProduct}
                                className="w-8 h-8 flex items-center justify-center transition-all duration-300"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.1)',
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  color: 'white',
                                  borderRadius: '3px' // Design system constraint
                                }}
                                title="Next Product"
                              >
                                <BootstrapIcon name="chevron-right" className="w-4 h-4" />
                              </motion.button>
                            </div>
                          )}
                        </div>

                        {/* Products Container with Enhanced Scrolling */}
                        <div className="relative">
                          <div 
                            ref={productsScrollRef}
                            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" 
                            style={{ 
                              scrollbarWidth: 'none',
                              msOverflowStyle: 'none',
                              WebkitOverflowScrolling: 'touch',
                              scrollBehavior: 'smooth'
                            }}
                            onScroll={(e) => {
                              // Update current index based on scroll position
                              const container = e.currentTarget;
                              const scrollLeft = container.scrollLeft;
                              const productWidth = 180; // Approximate width
                              const gap = 12; // Gap between products
                              const newIndex = Math.round(scrollLeft / (productWidth + gap));
                              if (newIndex !== currentProductIndex && newIndex < currentStream.products.length) {
                                setCurrentProductIndex(newIndex);
                              }
                            }}
                          >
                            {currentStream.products.map((product, index) => {
                              const discountPercentage = product.originalPrice 
                                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                                : 0;
                              
                              return (
                                <motion.div
                                  key={`${product.id}-${index}`}
                                  initial={{ opacity: 0, x: 50 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -50 }}
                                  transition={{ duration: 0.4, delay: index * 0.1 }}
                                  className="flex-shrink-0 cursor-pointer"
                                  style={{ 
                                    width: '160px',
                                    minWidth: '160px'
                                  }}
                                  onClick={() => actions.handleQuickView(product)}
                                >
                                  {/* Product Image */}
                                  <div 
                                    className="relative mb-3 group overflow-hidden"
                                    style={{ 
                                      aspectRatio: '3/4',
                                      borderRadius: '3px'
                                    }}
                                  >
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      style={{ borderRadius: '3px' }}
                                    />
                                    
                                    {/* Sale Badge */}
                                    {discountPercentage > 0 && (
                                      <div 
                                        className="absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white"
                                        style={{ 
                                          background: '#e74c3c',
                                          borderRadius: '3px'
                                        }}
                                      >
                                        -{discountPercentage}%
                                      </div>
                                    )}
                                    
                                    {/* Quick action overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-3 py-2 text-xs font-body font-bold text-white transition-all duration-300"
                                        style={{ 
                                          background: 'var(--primary-blue)',
                                          borderRadius: '3px',
                                          border: 'none'
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          actions.handleQuickView(product);
                                        }}
                                      >
                                        Quick View
                                      </motion.button>
                                    </div>
                                  </div>
                                  
                                  {/* Product Info */}
                                  <div className="text-center">
                                    <h4 className="font-heading text-sm font-medium text-white mb-1 line-clamp-2">
                                      {product.name}
                                    </h4>
                                    
                                    {/* Price */}
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                      <span className="font-body text-sm font-bold" style={{ color: 'var(--primary-blue)' }}>
                                        ${product.price.toFixed(2)}
                                      </span>
                                      {product.originalPrice && (
                                        <span className="font-body text-xs text-white/60 line-through">
                                          ${product.originalPrice.toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* 🎯 ADD TO CART Button - FIXED ALIGNMENT */}
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="w-full font-body font-bold text-white transition-all duration-300"
                                      style={{ 
                                        background: 'var(--primary-blue)',
                                        borderRadius: '3px',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        padding: '8px 12px',
                                        minHeight: '36px',
                                        fontSize: '11px',
                                        letterSpacing: '0.5px',
                                        textTransform: 'uppercase',
                                        lineHeight: '1'
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        cart.handleAddToCart(product);
                                      }}
                                    >
                                      <BootstrapIcon 
                                        name="cart-plus" 
                                        style={{ 
                                          width: '14px', 
                                          height: '14px',
                                          flexShrink: 0
                                        }}
                                      />
                                      <span>ADD TO CART</span>
                                    </motion.button>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Desktop Grid Component (Implementation details for non-mobile view)
interface LiveStreamGridProps {
  onNavigateToPage: (page: string) => void;
  onStreamClick: (streamId: string) => void;
}

export function LiveStreamGrid({ onNavigateToPage, onStreamClick }: LiveStreamGridProps) {
  const { state } = useApp();
  
  const streams = [...LIVE_STREAMS, ...MOCK_STREAMS];
  const filteredStreams = streams.slice(0, 3); // Show first 3 streams for demo

  // Mobile view: use full-screen TikTok-style viewer
  if (state.isMobile) {
    return (
      <MobileFullScreenStreamViewer
        streams={filteredStreams}
        onStreamClick={() => onStreamClick('stream-1')}
        onNavigateToHome={() => onNavigateToPage('home')}
      />
    );
  }

  // Desktop view: use grid layout
  return (
    <div className="min-h-screen bg-light-gray">
      <div className="container mx-auto px-6 py-8">
        <h1 className="font-heading text-3xl font-bold mb-8 text-center">Live Streams</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStreams.map((stream) => (
            <div key={stream.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={stream.thumbnailImage} 
                alt={stream.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-heading text-lg font-bold mb-2">{stream.title}</h3>
                <p className="font-body text-sm text-medium-gray mb-3">{stream.streamerName}</p>
                <Button 
                  onClick={() => onStreamClick(stream.id)}
                  className="w-full"
                >
                  Watch Stream
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}