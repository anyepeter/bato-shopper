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
import { MobileLiveStreamFloatingButtons } from "./MobileLiveStreamFloatingButtons";
import { ProductThumbnail } from "./ProductThumbnail";

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
      {/* Mobile Live Stream Floating Action Buttons */}
      <MobileLiveStreamFloatingButtons
        onFavoritesClick={() => actions.navigateToPage('mobile-favorites')}
        onReviewsClick={() => actions.navigateToPage('reviews')}
        onShareClick={() => {
          if (navigator.share && currentStream) {
            navigator.share({
              title: currentStream.title,
              text: `Watch ${currentStream.streamerName} live on Modish Style!`,
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

                    {/* Product Thumbnails with Navigation - FIXED WITH ProductThumbnail */}
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

                        {/* Products Container with Enhanced Scrolling - NOW WITH ProductThumbnail */}
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
                                  {/* 🎯 FIXED: Now using ProductThumbnail with proper floating icon buttons */}
                                  <div className="mobile-stream-product-thumbnail">
                                    <ProductThumbnail
                                      product={product}
                                      discountPercentage={discountPercentage}
                                      onAddToCart={(size, color) => cart.handleAddToCart(product, 1, size, color)}
                                      onQuickView={() => actions.handleQuickView(product)}
                                      onToggleFavorite={() => favorites.handleToggleFavorite(product.id)}
                                      isFavorite={favorites.isFavorite(product.id)}
                                      className="mobile-stream-product-card"
                                      style={{
                                        maxWidth: '160px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '3px',
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
                          borderRadius: '3px',
                          border: 'none',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          fontSize: '14px',
                          boxShadow: '0 8px 32px rgba(223, 102, 13, 0.4)',
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
                zIndex: 100
              }}
              title={showStreamInfo ? "Hide Stream Info" : "Show Stream Info"}
            >
              <BootstrapIcon name={showStreamInfo ? "eye-slash" : "eye"} className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Desktop/Tablet Live Stream Grid Component (unchanged)
interface DesktopLiveStreamGridProps {
  streams: Stream[];
  onStreamClick: (stream: Stream) => void;
}

function DesktopLiveStreamGrid({ streams, onStreamClick }: DesktopLiveStreamGridProps) {
  const { state, actions, cart, favorites } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('viewers');
  const [currentPage, setCurrentPage] = useState(1);
  const streamsPerPage = 9;

  // Filter and sort streams
  const filteredStreams = streams.filter(stream => {
    const matchesSearch = stream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stream.streamerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || stream.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedStreams = [...filteredStreams].sort((a, b) => {
    switch (sortBy) {
      case 'viewers':
        return b.viewerCount - a.viewerCount;
      case 'recent':
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedStreams.length / streamsPerPage);
  const paginatedStreams = sortedStreams.slice(
    (currentPage - 1) * streamsPerPage,
    currentPage * streamsPerPage
  );

  const categories = ['all', 'dresses', 'tops', 'accessories', 'traditional'];

  return (
    <div className="shop-layout min-h-screen" style={{ backgroundColor: 'var(--light-gray)' }}>
      {/* Header Section */}
      <div className="shop-header">
        <h1 className="shop-title">Live Fashion Streams</h1>
        <p className="shop-description">
          Watch live African fashion shows and shop directly from the stream
        </p>
      </div>

      {/* Filters and Search */}
      <div className="shop-controls">
        <div className="search-section">
          <Input
            type="text"
            placeholder="Search live streams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="filter-select">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="sort-select">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewers">Most Viewers</SelectItem>
              <SelectItem value="recent">Recently Started</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Live Streams Grid */}
      <div className="shop-content">
        {paginatedStreams.length === 0 ? (
          <div className="empty-state">
            <BootstrapIcon name="camera-video-off" className="w-16 h-16 text-medium-gray mx-auto mb-4" />
            <h3 className="font-heading text-xl text-medium-gray mb-2">No Live Streams Found</h3>
            <p className="text-medium-gray font-body">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="products-grid">
            {paginatedStreams.map((stream) => (
              <motion.div
                key={stream.id}
                whileHover={{ y: -2 }}
                className="stream-card cursor-pointer"
                onClick={() => onStreamClick(stream)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={stream.thumbnailImage}
                    alt={stream.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Live Badge */}
                  {stream.isLive && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="font-body text-xs font-bold">LIVE</span>
                    </div>
                  )}
                  
                  {/* Viewer Count */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/50 text-white rounded-sm">
                    <BootstrapIcon name="eye" className="w-3 h-3" />
                    <span className="font-body text-xs">{stream.viewerCount.toLocaleString()}</span>
                  </div>
                  
                  {/* Duration (for non-live streams) */}
                  {!stream.isLive && stream.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white rounded-sm">
                      <span className="font-body text-xs">{stream.duration}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-heading text-lg font-medium mb-1 line-clamp-2">
                    {stream.title}
                  </h3>
                  <p className="text-primary font-body font-medium mb-2">
                    {stream.streamerName}
                  </p>
                  <div className="flex items-center justify-between text-sm text-medium-gray">
                    <span className="capitalize">{stream.category}</span>
                    <span>{new Date(stream.startTime).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-section">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

// Main LiveStreamGrid Component
export function LiveStreamGrid() {
  const { state, actions } = useApp();
  
  const allStreams = [...LIVE_STREAMS, ...MOCK_STREAMS];
  
  const handleStreamClick = (stream: Stream) => {
    console.log('Stream clicked:', stream.title);
    // Navigate to individual stream view or open stream modal
    actions.navigateToPage('stream-viewer');
  };

  const handleNavigateToHome = () => {
    actions.navigateToPage('home');
  };

  // Mobile view: Full-screen TikTok-style stream viewer
  if (state.isMobile) {
    return (
      <MobileFullScreenStreamViewer
        streams={allStreams}
        onStreamClick={handleStreamClick}
        onNavigateToHome={handleNavigateToHome}
      />
    );
  }

  // Desktop/Tablet view: Grid layout
  return (
    <DesktopLiveStreamGrid
      streams={allStreams}
      onStreamClick={handleStreamClick}
    />
  );
}

export default LiveStreamGrid;