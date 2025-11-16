import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BootstrapIcon } from "../BootstrapIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { MOCK_STREAMS, LIVE_STREAMS } from "../../constants/streamingData";
import { Stream } from "../../types";
import { useApp } from "../AppProvider";
import { HomePageLayout } from "../shared/HomePageLayout";
import { MobileLiveStreamFloatingButtons } from "./MobileLiveStreamFloatingButtons";
import { ProductThumbnail } from "./ProductThumbnail";
import { Search } from "lucide-react";

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
              borderRadius: '8px' // Mobile override
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

                    {/* Product Thumbnails with Navigation */}
                    {currentStream.products && currentStream.products.length > 0 && (
                      <div 
                        style={{ 
                          marginTop: '10px', 
                          marginBottom: '10px',
                          padding: '16px',
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

                        {/* Products Container */}
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

function LiveStreamGrid({ onStreamClick, onNavigateToPage }: LiveStreamGridProps) {
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
    if (isTablet) return 'grid-cols-2';
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

  // 🔥 DESKTOP AND TABLET LAYOUT - Simple implementation
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--light-gray)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-4" style={{ color: 'var(--primary-blue)' }}>
            Live Streams
          </h1>
          
          {/* Search */}
          <div className="relative max-w-md">
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
        </div>

        {/* Stream Grid */}
        <div className={`grid ${getStreamGridCols()} gap-6`}>
          {paginatedStreams.map((stream) => (
            <motion.div
              key={stream.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden"
              style={{
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-standard-desktop)'
              }}
              onClick={() => handleStreamClick(stream)}
            >
              {/* Stream Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={stream.thumbnailImage}
                  alt={stream.title}
                  className="w-full h-full object-cover"
                />
                {stream.isLive && (
                  <div
                    className="absolute top-2 left-2 px-2 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: 'var(--error-red)',
                      color: 'var(--pure-white)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    LIVE
                  </div>
                )}
                <div className="absolute bottom-2 right-2 px-2 py-1 text-xs text-white bg-black/50 rounded">
                  {stream.viewerCount.toLocaleString()} viewers
                </div>
              </div>
              
              {/* Stream Info */}
              <div className="p-4">
                <h3 className="font-heading font-bold text-lg mb-2 line-clamp-2" style={{ color: 'var(--primary-blue)' }}>
                  {stream.title}
                </h3>
                <p className="font-body text-sm text-gray-600 mb-2">{stream.streamerName}</p>
                <p className="font-body text-sm text-gray-500 line-clamp-2">
                  {stream.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStreams.length === 0 && (
          <div className="text-center py-12">
            <BootstrapIcon name="camera-video-off" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">No streams found</h3>
            <p className="font-body text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}