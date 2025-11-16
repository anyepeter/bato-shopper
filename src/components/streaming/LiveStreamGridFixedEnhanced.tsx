import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BootstrapIcon } from "../BootstrapIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { MOCK_STREAMS, LIVE_STREAMS } from "../../constants/streamingData";
import { Stream } from "../../types";
import { useApp } from "../AppProvider";
import { MobileLiveStreamFloatingButtons } from "./MobileLiveStreamFloatingButtons";
import { ProductThumbnail } from "./ProductThumbnail";
import { StreamCard } from "./StreamCard";
import { Search, Star } from "lucide-react";

// Import the unified shop pages CSS for consistency
import "../../styles/shop-pages.css";

// Mobile Full-Screen Stream Viewer Component (keeping existing implementation)
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
                      {currentStream.description || `Live fashion show featuring ${currentStream.category} designs`}
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

  // Use MOCK_STREAMS as the single source of truth to avoid duplicates
  const allStreams = MOCK_STREAMS;

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

  // 🔥 FILTER STREAMS FOR LIVE AND POPULAR TABS (same logic as Home page trending)
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

  // EXACT CATEGORY DATA MATCHING HOME PAGE STRUCTURE
  const categoryData = [
    { id: 'all', name: 'All Streams', count: allStreams.length, icon: '🎥' },
    { id: 'Fashion Shows', name: 'Fashion Shows', count: allStreams.filter(s => s.category === 'Fashion Shows').length, icon: '👗' },
    { id: 'Product Reviews', name: 'Product Reviews', count: allStreams.filter(s => s.category === 'Product Reviews').length, icon: '⭐' },
    { id: 'Styling Tips', name: 'Styling Tips', count: allStreams.filter(s => s.category === 'Styling Tips').length, icon: '💄' },
    { id: 'Behind the Scenes', name: 'Behind the Scenes', count: allStreams.filter(s => s.category === 'Behind the Scenes').length, icon: '🎬' },
    { id: 'Live Now', name: 'Live Now', count: allStreams.filter(s => s.isLive).length, icon: '🔴' }
  ];

  // Helper function to get icon size for categories (same as HomePage)
  const getCategoryIconSize = () => {
    if (state.isMobile) return '24px';
    return '96px'; // 4x larger for desktop and tablet
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

  // 🔥 PAGINATION COMPONENT (EXACT COPY FROM HOMEPAGE)
  const renderPagination = () => {
    if (state.isMobile || totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredStreams.length);

    return (
      <div 
        className="p-5 rounded mb-5"
        style={{ 
          backgroundColor: 'var(--pure-white)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div className="flex flex-col gap-4">
          {/* Results Info and Items Per Page Selector */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 font-body">
              Showing {startItem}-{endItem} of {filteredStreams.length} streams
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
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600 font-body">per page</span>
            </div>
          </div>

          {/* Pagination Controls */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  className={`${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-blue-50'}`}
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: currentPage <= 1 ? 'var(--medium-gray)' : 'var(--primary-blue)'
                  }}
                />
              </PaginationItem>
              
              {/* Page Numbers */}
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
              
              {/* Ellipsis for large page counts */}
              {totalPages > 7 && currentPage < totalPages - 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  className={`${currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-blue-50'}`}
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
    );
  };

  const layoutClasses = getLayoutClasses();

  // 🔥 DESKTOP/TABLET THREE-PANEL LAYOUT - EXACT MATCH TO HOME PAGE
  return (
    <div 
      className="min-h-screen py-8"
      style={{ backgroundColor: 'var(--light-gray)' }}
    >
      <div className={layoutClasses.container}>
        {/* 🔥 LEFT PANEL - Search & Filter - EXACT MATCH TO HOME PAGE */}
        <div className={layoutClasses.leftPanel}>
          <div 
            className="p-5 rounded mb-5 sticky top-5"
            style={{ 
              backgroundColor: 'var(--pure-white)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)',
              maxHeight: 'calc(100vh - 40px)'
            }}
          >
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

            {/* Featured Tab - EXACT STYLING */}
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

            {/* Categories - ENHANCED TO MATCH HOME PAGE EXACTLY */}
            <div className="space-y-4">
              <div className="space-y-3">
                {categoryData.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (category.id === 'Live Now') {
                        setStreamStatus('live');
                        setSelectedCategory('all');
                      } else {
                        setSelectedCategory(category.id);
                        setStreamStatus('all');
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      (selectedCategory === category.id || (category.id === 'Live Now' && streamStatus === 'live'))
                        ? 'shadow-md'
                        : 'hover:shadow-sm'
                    }`}
                    style={{
                      backgroundColor: (selectedCategory === category.id || (category.id === 'Live Now' && streamStatus === 'live')) 
                        ? 'var(--primary-extra-light-blue)' 
                        : 'var(--light-gray)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div 
                      className="flex items-center justify-center rounded"
                      style={{ 
                        fontSize: getCategoryIconSize(),
                        width: state.isMobile ? '32px' : '48px',
                        height: state.isMobile ? '32px' : '48px',
                        backgroundColor: (selectedCategory === category.id || (category.id === 'Live Now' && streamStatus === 'live')) 
                          ? 'var(--pure-white)' 
                          : 'var(--pure-white)',
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

            {/* Stream Quality Section - NEW */}
            <div className="mt-8 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <BootstrapIcon name="badge-hd" size={16} color="var(--primary-blue)" />
                <span className="font-heading font-medium text-sm" style={{ color: 'var(--primary-blue)' }}>
                  Stream Quality
                </span>
              </div>
              <div className="space-y-2">
                {['All Quality', 'HD (1080p)', '4K Ultra HD'].map((quality) => (
                  <div key={quality} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors">
                    <BootstrapIcon name="check-circle" size={14} />
                    <span className="font-body">{quality}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stream Duration Section - NEW */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <BootstrapIcon name="clock" size={16} color="var(--primary-blue)" />
                <span className="font-heading font-medium text-sm" style={{ color: 'var(--primary-blue)' }}>
                  Duration
                </span>
              </div>
              <div className="space-y-2">
                {['Any Duration', 'Short (< 30 min)', 'Medium (30-60 min)', 'Long (> 60 min)'].map((duration) => (
                  <div key={duration} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors">
                    <BootstrapIcon name="check-circle" size={14} />
                    <span className="font-body">{duration}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 🔥 MIDDLE PANEL - Live Streams Banner & Grid */}
        <div className={layoutClasses.middlePanel}>
          {/* Featured Live Streams Banner */}
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
              Watch live fashion shows and styling sessions from our community
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
              JOIN LIVE NOW
            </Button>
          </div>

          {/* Streams Grid */}
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
                  <Search className="h-12 w-12 mx-auto" />
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

          {/* 🔥 PAGINATION SECTION (SAME AS HOMEPAGE) */}
          {renderPagination()}
        </div>

        {/* 🔥 RIGHT PANEL - Trending Streams - EXACT MATCH TO HOME PAGE TRENDING */}
        <div className={layoutClasses.rightPanel}>
          <div 
            className="p-5 rounded sticky top-5"
            style={{ 
              backgroundColor: 'var(--pure-white)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto'
            }}
          >
            {/* Title */}
            <div className="flex items-center gap-2 mb-4">
              <BootstrapIcon name="trending_up" size={16} color="var(--primary-blue)" />
              <span className="font-heading font-medium" style={{ color: 'var(--primary-blue)' }}>
                Trending
              </span>
            </div>

            {/* Tab Navigation */}
            <div className="flex mb-6 gap-1 p-1 rounded" style={{ backgroundColor: 'var(--light-gray)' }}>
              {[
                { key: 'live', label: 'Live', icon: 'broadcast' },
                { key: 'popular', label: 'Popular', icon: 'trending_up' }
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

            {/* Live Streams */}
            {activeTrendingTab === 'live' && (
              <div className="space-y-4">
                {getLiveStreams().map((stream, index) => (
                  <motion.div
                    key={stream.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-sm"
                    style={{
                      backgroundColor: 'var(--light-gray)',
                      borderRadius: 'var(--radius-md)'
                    }}
                    onClick={() => handleStreamClick(stream)}
                  >
                    <div className="relative">
                      <img
                        src={stream.thumbnailImage}
                        alt={stream.title}
                        className="w-16 h-16 object-cover rounded"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                      />
                      {stream.isLive && (
                        <div
                          className="absolute -top-1 -right-1 px-1 py-0.5 text-xs font-medium rounded"
                          style={{
                            backgroundColor: 'var(--error-red)',
                            color: 'var(--pure-white)',
                            fontSize: '10px'
                          }}
                        >
                          LIVE
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium font-body text-sm line-clamp-2" style={{ color: 'var(--primary-blue)' }}>
                        {stream.title}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <BootstrapIcon name="person-fill" size={12} color="var(--medium-gray)" />
                        <span className="text-xs text-gray-500 font-body">{stream.streamerName}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold font-body text-sm" style={{ color: 'var(--primary-blue)' }}>
                          {stream.viewerCount.toLocaleString()} viewers
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Popular Streams */}
            {activeTrendingTab === 'popular' && (
              <div className="space-y-4">
                {getPopularStreams().map((stream, index) => (
                  <motion.div
                    key={stream.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-sm"
                    style={{
                      backgroundColor: 'var(--light-gray)',
                      borderRadius: 'var(--radius-md)'
                    }}
                    onClick={() => handleStreamClick(stream)}
                  >
                    <div className="relative">
                      <img
                        src={stream.thumbnailImage}
                        alt={stream.title}
                        className="w-16 h-16 object-cover rounded"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                      />
                      {stream.category && (
                        <div
                          className="absolute -top-1 -right-1 px-1 py-0.5 text-xs font-medium rounded"
                          style={{
                            backgroundColor: 'var(--primary-blue)',
                            color: 'var(--pure-white)',
                            fontSize: '10px'
                          }}
                        >
                          {stream.category.slice(0, 3).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium font-body text-sm line-clamp-2" style={{ color: 'var(--primary-blue)' }}>
                        {stream.title}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <BootstrapIcon name="person-fill" size={12} color="var(--medium-gray)" />
                        <span className="text-xs text-gray-500 font-body">{stream.streamerName}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold font-body text-sm" style={{ color: 'var(--primary-blue)' }}>
                          {stream.viewerCount.toLocaleString()} viewers
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveStreamGridFixed({ onStreamClick, onNavigateToPage }: LiveStreamGridProps) {
  return <LiveStreamGrid onStreamClick={onStreamClick} onNavigateToPage={onNavigateToPage} />;
}