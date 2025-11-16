import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BootstrapIcon } from "../BootstrapIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { MOCK_STREAMS, LIVE_STREAMS } from "../../constants/streamingData";
import { Stream } from "../../types";
import { useApp } from "../AppProvider";
import { HomePageLayout } from "../shared/HomePageLayout";
import { StreamCard } from "./StreamCard";
import { MobileLiveStreamFloatingButtons } from "./MobileLiveStreamFloatingButtons";
import { ProductThumbnail } from "./ProductThumbnail";
import { Search, Star } from "lucide-react";

// Import the unified shop pages CSS for consistency
import "../../styles/shop-pages.css";

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
              boxShadow: '0 8px 32px rgba(88, 37, 239, 0.4)',
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
      {/* Mobile Live Stream Floating Action Buttons */}
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
            // Fallback to copying URL to clipboard
            navigator.clipboard.writeText(window.location.href).catch(console.error);
          }
        }}
        onChatClick={() => {
          // Use the same chat opening logic as in App.tsx
          console.log('🔥 MOBILE LIVE STREAM CHAT BUTTON CLICKED!');
          console.log('Current isAdminMode:', state.isAdminMode);
          console.log('Current testAdminUser:', state.testAdminUser);
          
          if (state.isAdminMode === true) {
            console.log('🎯 ADMIN MODE DETECTED - Opening AdminChatRoom from Live Stream');
            actions.setIsChatOpen(false);
            actions.setIsAdminChatOpen(true);
            return;
          }
          
          console.log('🎯 CUSTOMER MODE - Opening regular ChatRoom from Live Stream');
          actions.setIsAdminChatOpen(false);
          actions.setIsChatOpen(true);
        }}
        onSearchQuery={(query) => {
          console.log('Search query:', query);
          // TODO: Implement stream search functionality
        }}
        onCategorySelect={(category) => {
          console.log('Selected category:', category);
          // TODO: Implement category filtering for streams
        }}
        favoritesCount={favorites.favoriteItems.length}
        selectedCategory="all"
      />

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
                      <div className={`px-3 py-1 backdrop-blur-md ${currentStream.category === 'traditional-designs' ? '' : 'rounded-full'}`} style={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: currentStream.category === 'traditional-designs' ? '8px' : undefined
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

                    {/* Product Thumbnails with Navigation */}
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
                              filter: 'drop-shadow(0 0 4px rgba(88, 37, 239, 0.5))'
                            }} />
                            <span className="font-body text-sm font-bold" style={{
                              color: 'var(--primary-blue)',
                              textShadow: '0 0 8px rgba(88, 37, 239, 0.3)'
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
                                  borderRadius: '8px'
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
                                  borderRadius: '8px'
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
                                  className="flex-shrink-0"
                                  style={{ 
                                    width: '160px',
                                    minWidth: '160px'
                                  }}
                                >
                                  {/* Using ProductThumbnail component */}
                                  <div className="mobile-stream-product-thumbnail">
                                    <ProductThumbnail
                                      product={product}
                                      discountPercentage={discountPercentage}
                                      onAddToCart={(size, color) => cart.handleAddToCart(product, 1, size, color)}
                                      onQuickView={() => actions.handleQuickView(product)}
                                      onToggleFavorite={() => favorites.handleToggleFavorite(product)}
                                      isFavorite={favorites.isFavorite(product.id)}
                                      className="mobile-stream-product-card"
                                      style={{
                                        maxWidth: '160px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                      }}
                                    />
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* WATCH STREAM Button */}
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

            {/* Stream Navigation Indicators */}
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

            {/* Toggle Stream Info Button */}
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
                borderRadius: '50%',
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

// Main LiveStreamGrid Component  
interface LiveStreamGridProps {
  onStreamClick: (stream: Stream) => void;
  onNavigateToPage: (page: string) => void;
}

export function LiveStreamGrid({ onStreamClick, onNavigateToPage }: LiveStreamGridProps) {
  const { state, actions, cart, favorites } = useApp();
  
  // 🔥 STATE MANAGEMENT - FILTERING, SEARCH, PAGINATION
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [streamStatus, setStreamStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [activeTrendingTab, setActiveTrendingTab] = useState<'live' | 'popular'>('live');
  const [forceRerender, setForceRerender] = useState(0);
  
  // 🎯 FIX: Add tablet state at component level
  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      return !state.isMobile && width >= 768 && width < 1200;
    }
    return false;
  });

  // 🎯 GRID COLUMNS FUNCTION - EXACT SAME LOGIC AS HOME PAGE
  const getStreamGridCols = () => {
    if (state.isMobile) return 'grid-cols-1';
    // Check for tablet layout (768px - 1199px) 
    if (window.innerWidth >= 768 && window.innerWidth < 1200) return 'grid-cols-2';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  };

  // Listen for window resize to update grid layout and tablet state
  useEffect(() => {
    const handleResize = () => {
      setForceRerender(prev => prev + 1);
      // Update tablet state
      const width = window.innerWidth;
      setIsTablet(!state.isMobile && width >= 768 && width < 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.isMobile]);

  // Combine all streams
  const allStreams = [...LIVE_STREAMS, ...MOCK_STREAMS];

  // 🔥 FILTERING LOGIC
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

  // 🔥 PAGINATION LOGIC
  const totalPages = Math.ceil(filteredStreams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStreams = filteredStreams.slice(startIndex, endIndex);

  // Handle stream click
  const handleStreamClick = (stream: Stream) => {
    console.log('🎯 Stream clicked:', stream.title);
    onStreamClick(stream);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, streamStatus]);

  // 🔥 MOBILE LAYOUT - TikTok style full-screen experience
  if (state.isMobile) {
    return (
      <MobileFullScreenStreamViewer
        streams={filteredStreams}
        onStreamClick={handleStreamClick}
        onNavigateToHome={() => onNavigateToPage('home')}
      />
    );
  }

  // 🔥 DESKTOP AND TABLET LAYOUT - Using HomePageLayout with custom render props
  return (
    <HomePageLayout
      filteredProducts={[]} // No products for live streams
      allFilteredProducts={[]}
      filterCategory="all"
      searchQuery={searchQuery}
      sortBy="newest"
      onAddToCart={() => {}}
      onQuickView={() => {}}
      onToggleFavorite={() => {}}
      isFavorite={() => false}
      onNavigateToStoreLocator={() => {}}
      onNavigateToPage={actions.navigateToPage}
      setFilterCategory={() => {}}
      setSearchQuery={setSearchQuery}
      setSortBy={() => {}}
      currentPage={currentPage}
      totalPages={totalPages}
      totalProducts={filteredStreams.length}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
      onItemsPerPageChange={setItemsPerPage}
      isFloatingIconsVisible={state.isFloatingIconsVisible}
      isMobileSearchOpen={state.isMobileSearchOpen}
      onToggleMobileSearch={actions.handleToggleMobileSearch}
      onCloseMobileSearch={actions.handleCloseMobileSearch}
      currentUser={state.testAdminUser}
      onSignOut={() => {}}
      onChatOpen={() => {}}
      onNavigateToLiveStream={(streamId) => {
        const stream = filteredStreams.find(s => s.id === streamId);
        if (stream) {
          // Use existing stream state methods
          actions.setCurrentStream(stream);
          actions.setIsStreamGridOpen(true);
        }
      }}
      // 🎯 CUSTOM LEFT PANEL - Replicating Home Page Design WITH TABLET TRENDING SECTION
      customLeftPanel={() => {
        // Use the component-level tablet state

        return (
          <>
            {/* Title */}
            <h3 className="font-heading font-medium mb-4" style={{ color: 'var(--primary-blue)' }}>
              Search & Filter
            </h3>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search streams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-body"
                style={{
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--input-background)',
                  border: '0.5px solid var(--border)'
                }}
              />
            </div>

            {/* Featured Tab - EXACT STYLING FROM HOME PAGE */}
            <div className="mb-6">
              <div className="flex mb-4 gap-1 p-1 rounded" style={{ backgroundColor: 'var(--light-gray)' }}>
                <button
                  className="flex-1 py-2 px-3 rounded text-sm font-medium font-body transition-all duration-300 text-white"
                  style={{
                    backgroundColor: 'var(--primary-blue)'
                  }}
                >
                  <div className="flex items-center justify-center">
                    <span>Featured</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Stream Categories - Styled Like Home Page Categories */}
            <div className="space-y-4">
              <div className="space-y-3">
                {[
                  { id: 'all', name: 'All Streams', count: filteredStreams.length, icon: '📺' },
                  { id: 'live', name: 'Live Now', count: filteredStreams.filter(s => s.isLive).length, icon: '🔴' },
                  { id: 'fashion', name: 'Fashion Shows', count: filteredStreams.filter(s => s.category === 'fashion').length, icon: '👗' },
                  { id: 'traditional', name: 'Traditional', count: filteredStreams.filter(s => s.category === 'traditional').length, icon: '🎭' },
                  { id: 'modern', name: 'Modern Style', count: filteredStreams.filter(s => s.category === 'modern').length, icon: '✨' },
                  { id: 'upcoming', name: 'Upcoming', count: filteredStreams.filter(s => !s.isLive).length, icon: '⏰' }
                ].map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'shadow-md'
                        : 'hover:shadow-sm'
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category.id ? 'var(--primary-extra-light-blue)' : 'var(--light-gray)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div 
                      className="flex items-center justify-center rounded"
                      style={{ 
                        fontSize: '24px',
                        width: '48px',
                        height: '48px',
                        backgroundColor: selectedCategory === category.id ? 'var(--pure-white)' : 'var(--pure-white)',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      {category.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium font-body" style={{ color: 'var(--primary-blue)' }}>
                        {category.name}
                      </div>
                      <div className="text-sm text-gray-500 font-body">
                        ({category.count})
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>



            {/* 🎯 TRENDING STREAMS SECTION - ONLY SHOW IN TABLET MODE */}
            {isTablet && (
              <div className="mt-8 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                {/* Title */}
                <div className="flex items-center gap-2 mb-4">
                  <BootstrapIcon name="trending-up" size={16} color="var(--primary-blue)" />
                  <span className="font-heading font-medium" style={{ color: 'var(--primary-blue)' }}>
                    Trending Streams
                  </span>
                </div>

                {/* Tab Navigation */}
                <div className="flex mb-6 gap-1 p-1 rounded" style={{ backgroundColor: 'var(--light-gray)' }}>
                  {[
                    { key: 'live', label: 'Live', icon: 'broadcast' },
                    { key: 'popular', label: 'Popular', icon: 'trending-up' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTrendingTab(tab.key as any)}
                      className={`flex-1 py-2 px-3 rounded text-sm font-medium font-body transition-all duration-300 ${
                        activeTrendingTab === tab.key 
                          ? 'text-white' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      style={{
                        backgroundColor: activeTrendingTab === tab.key ? 'var(--primary-blue)' : 'transparent'
                      }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <BootstrapIcon name={tab.icon} size={14} />
                        {tab.label}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Trending Stream Cards - VERTICAL LAYOUT MATCHING PRODUCT CARDS */}
                <div className="space-y-4">
                  {(activeTrendingTab === 'live' 
                    ? filteredStreams.filter(s => s.isLive).slice(0, 4)
                    : filteredStreams.sort((a, b) => b.viewerCount - a.viewerCount).slice(0, 4)
                  ).map((stream) => (
                    <motion.div
                      key={stream.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-lg cursor-pointer transition-all duration-300 hover:shadow-sm overflow-hidden"
                      style={{
                        backgroundColor: 'var(--pure-white)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-standard-desktop)'
                      }}
                      onClick={() => handleStreamClick(stream)}
                    >
                      {/* Large Stream Image - Same aspect ratio as product cards */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={stream.thumbnailImage}
                          alt={stream.title}
                          className="w-full h-full object-cover"
                        />
                        {stream.isLive && (
                          <div
                            className="absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded"
                            style={{
                              backgroundColor: 'var(--error-red)',
                              color: 'var(--pure-white)',
                              fontSize: '10px',
                              borderRadius: 'var(--radius-sm)'
                            }}
                          >
                            LIVE
                          </div>
                        )}
                      </div>
                      
                      {/* Stream Info - Same layout as product info */}
                      <div className="p-3">
                        <h4 className="font-medium font-body text-sm line-clamp-2 mb-2" style={{ color: 'var(--primary-blue)' }}>
                          {stream.title}
                        </h4>
                        
                        {/* Star Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }, (_, i) => {
                            // Generate rating based on viewer count for visual consistency
                            const rating = Math.min(5, Math.max(3.5, 3 + (stream.viewerCount / 2000)));
                            const fullStars = Math.floor(rating);
                            const hasHalfStar = rating % 1 >= 0.5;
                            
                            if (i < fullStars) {
                              return <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />;
                            } else if (i === fullStars && hasHalfStar) {
                              return <Star key={i} className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />;
                            } else {
                              return <Star key={i} className="h-3 w-3 text-gray-300" />;
                            }
                          })}
                        </div>
                        
                        {/* Viewer Count - Styled like product price */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-body text-sm" style={{ color: 'var(--primary-blue)' }}>
                            {stream.viewerCount.toLocaleString()} viewers
                          </span>
                          {stream.category && (
                            <span className="text-xs text-gray-500 font-body">
                              {stream.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
      }}
      // 🎯 CUSTOM MAIN CONTENT - Styled Like Home Page
      customMainContent={() => (
        <>
          {/* Live Streams Banner - EXACT STYLING FROM HOME PAGE */}
          <div 
            className="p-8 rounded mb-5 text-center"
            style={{ 
              backgroundColor: 'var(--primary-blue)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h2 className="font-heading font-medium text-white mb-2">
              Live Streams
            </h2>
            <p className="text-white/90 font-body mb-4">
              Watch live African fashion shows and discover trending styles
            </p>
            <Button
              className="btn-moema-primary"
              style={{
                backgroundColor: 'var(--pure-white)',
                color: 'var(--primary-blue)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '8px 24px',
                fontFamily: 'var(--font-body)'
              }}
            >
              DISCOVER LIVE
            </Button>
          </div>

          {/* Streams Grid - EXACT STYLING FROM HOME PAGE */}
          <div 
            className="p-5 rounded mb-5"
            style={{ 
              backgroundColor: 'var(--pure-white)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {paginatedStreams.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <BootstrapIcon name="camera-video-off" className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="font-heading font-medium text-gray-600 mb-2">No streams found</h3>
                <p className="text-gray-500 font-body">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${getStreamGridCols()}`}>
                {paginatedStreams.map((stream) => (
                  <StreamCard
                    key={stream.id}
                    stream={stream}
                    onStreamClick={() => handleStreamClick(stream)}
                    onAddToCart={cart.handleAddToCart}
                    onToggleFavorite={favorites.handleToggleFavorite}
                    isFavorite={favorites.isFavorite}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination - EXACT STYLING FROM HOME PAGE */}
          {totalPages > 1 && !state.isMobile && (
            <div 
              className="p-5 rounded mb-5"
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 font-body">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredStreams.length)} of {filteredStreams.length} streams
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-body">Show:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                      <SelectTrigger 
                        className="w-20 h-8 text-sm"
                        style={{ 
                          borderRadius: 'var(--radius-md)', 
                          fontFamily: 'var(--font-body)',
                          backgroundColor: 'var(--input-background)',
                          border: '0.5px solid var(--border)'
                        }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-600 font-body">per page</span>
                  </div>
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        className={`${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-orange-50'}`}
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: currentPage <= 1 ? 'var(--medium-gray)' : 'var(--primary-blue)'
                        }}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNumber;
                      
                      if (totalPages <= 7) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 4) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNumber = totalPages - 6 + i;
                      } else {
                        pageNumber = currentPage - 3 + i;
                      }
                      
                      if (pageNumber < 1 || pageNumber > totalPages) return null;
                      
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={currentPage === pageNumber}
                            className="cursor-pointer"
                            style={{
                              fontFamily: 'var(--font-body)',
                              backgroundColor: currentPage === pageNumber ? 'var(--primary-blue)' : 'transparent',
                              color: currentPage === pageNumber ? 'var(--pure-white)' : 'var(--primary-blue)',
                              borderColor: 'var(--primary-blue)'
                            }}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        className={`${currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-orange-50'}`}
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: currentPage >= totalPages ? 'var(--medium-gray)' : 'var(--primary-blue)'
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </>
      )}
      // 🎯 CUSTOM RIGHT PANEL - Styled Like Home Page Trending Section
      customRightPanel={() => (
        <>
          {/* Title */}
          <div className="flex items-center gap-2 mb-4">
            <BootstrapIcon name="trending-up" size={16} color="var(--primary-blue)" />
            <span className="font-heading font-medium" style={{ color: 'var(--primary-blue)' }}>
              Trending Streams
            </span>
          </div>

          {/* Tab Navigation - Same styling as Home Page */}
          <div className="flex mb-6 gap-1 p-1 rounded" style={{ backgroundColor: 'var(--light-gray)' }}>
            {[
              { key: 'live', label: 'Live', icon: 'camera-video' },
              { key: 'popular', label: 'Popular', icon: 'fire' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTrendingTab(tab.key as any)}
                className={`flex-1 py-2 px-3 rounded text-sm font-medium font-body transition-all duration-300 ${
                  activeTrendingTab === tab.key 
                    ? 'text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                style={{
                  backgroundColor: activeTrendingTab === tab.key ? 'var(--primary-blue)' : 'transparent'
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <BootstrapIcon name={tab.icon} size={14} />
                  {tab.label}
                </div>
              </button>
            ))}
          </div>

          {/* Trending Stream Cards - EXACT VERTICAL LAYOUT MATCHING PRODUCT CARDS */}
          <div className="space-y-4">
            {(activeTrendingTab === 'live' 
              ? filteredStreams.filter(s => s.isLive).slice(0, 4)
              : filteredStreams.sort((a, b) => b.viewerCount - a.viewerCount).slice(0, 4)
            ).map((stream) => (
              <motion.div
                key={stream.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg cursor-pointer transition-all duration-300 hover:shadow-sm overflow-hidden"
                style={{
                  backgroundColor: 'var(--pure-white)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-standard-desktop)'
                }}
                onClick={() => handleStreamClick(stream)}
              >
                {/* Large Stream Image - Same aspect ratio as product cards */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={stream.thumbnailImage}
                    alt={stream.title}
                    className="w-full h-full object-cover"
                  />
                  {stream.isLive && (
                    <div
                      className="absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded"
                      style={{
                        backgroundColor: 'var(--error-red)',
                        color: 'var(--pure-white)',
                        fontSize: '10px',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      LIVE
                    </div>
                  )}
                </div>
                
                {/* Stream Info - Same layout as product info */}
                <div className="p-3">
                  <h4 className="font-medium font-body text-sm line-clamp-2 mb-2" style={{ color: 'var(--primary-blue)' }}>
                    {stream.title}
                  </h4>
                  
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }, (_, i) => {
                      // Generate rating based on viewer count for visual consistency
                      const rating = Math.min(5, Math.max(3.5, 3 + (stream.viewerCount / 2000)));
                      const fullStars = Math.floor(rating);
                      const hasHalfStar = rating % 1 >= 0.5;
                      
                      if (i < fullStars) {
                        return <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />;
                      } else if (i === fullStars && hasHalfStar) {
                        return <Star key={i} className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />;
                      } else {
                        return <Star key={i} className="h-3 w-3 text-gray-300" />;
                      }
                    })}
                  </div>
                  
                  {/* Viewer Count - Styled like product price */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-body text-sm" style={{ color: 'var(--primary-blue)' }}>
                      {stream.viewerCount.toLocaleString()} viewers
                    </span>
                    {stream.category && (
                      <span className="text-xs text-gray-500 font-body">
                        {stream.category}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stream Statistics - Extra content to match home page density */}
          <div className="mt-8 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <h4 className="font-heading font-medium text-sm mb-3" style={{ color: 'var(--primary-blue)' }}>
              Stream Stats
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-body text-gray-600">Live Now:</span>
                <span className="font-body font-medium" style={{ color: 'var(--primary-blue)' }}>
                  {filteredStreams.filter(s => s.isLive).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-body text-gray-600">Total Viewers:</span>
                <span className="font-body font-medium" style={{ color: 'var(--primary-blue)' }}>
                  {filteredStreams.reduce((sum, s) => sum + s.viewerCount, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-body text-gray-600">Categories:</span>
                <span className="font-body font-medium" style={{ color: 'var(--primary-blue)' }}>
                  {new Set(filteredStreams.map(s => s.category)).size}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    />
  );
}