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

// Main LiveStreamGrid Component  
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
    return '20px'; // Fixed: Smaller icons for better layout
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

  // Render Trending Section for Tablet Layout - Updated to match Home page styling
  const renderTrendingSection = () => {
    if (!isTablet) return null;

    const trendingStreams = activeTrendingTab === 'live' ? getLiveStreams() : getPopularStreams();

    return (
      <div className="shop-trending-container">
        <div 
          className="shop-panel-card shop-trending-card smooth-animated"
          style={{ 
            backgroundColor: 'var(--pure-white)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-standard-desktop)',
            marginTop: '15px',
            padding: '20px'
          }}
        >
          <div className="shop-trending-header">
            <BootstrapIcon name="trending-up" size={16} color="var(--primary-blue)" />
            <span className="shop-trending-title">Trending</span>
          </div>

          <div className={`trending-tabs-container ${activeTrendingTab === 'popular' ? 'trending-active' : ''}`}>
            {[
              { key: 'live', label: 'Live', icon: 'record-circle' },
              { key: 'popular', label: 'Popular', icon: 'trending-up' }
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
                  boxShadow: 'var(--shadow-standard-desktop)',
                  border: 'var(--border-standard-desktop)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  transform: 'translateY(0)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(88, 37, 239, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-standard-desktop)';
                }}
              >
                <div 
                  className="shop-trending-product-image-container"
                  style={{
                    borderRadius: '3px'
                  }}
                >
                  <img
                    src={stream.thumbnailImage}
                    alt={stream.title}
                    className="shop-trending-product-image"
                    style={{
                      borderRadius: '3px'
                    }}
                  />
                  {stream.isLive && (
                    <div 
                      className="shop-trending-product-badge sale"
                      style={{
                        borderRadius: '3px',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        fontSize: '10px',
                        padding: '2px 6px'
                      }}
                    >
                      LIVE
                    </div>
                  )}
                </div>
                <div className="shop-trending-product-info">
                  <h4 className="shop-trending-product-name">{stream.title}</h4>
                  <div className="shop-trending-product-rating">{renderStars(stream.rating || 4.5)}</div>
                  <div className="shop-trending-product-price">
                    <span className="shop-trending-product-current-price">{stream.viewerCount.toLocaleString()} viewers</span>
                    <span className="shop-trending-product-original-price">{stream.category}</span>
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
          boxShadow: 'var(--shadow-standard-desktop)'
        }}
      >
        <div className="flex flex-col gap-4">
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
              
              {totalPages > 7 && currentPage < totalPages - 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
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
    );
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
              Search & Filter
            </h3>

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

            <div className="space-y-4">
              <div className="space-y-3">
                {categoryData.map((category) => (
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
                        fontSize: getCategoryIconSize(),
                        width: '24px',
                        height: '24px',
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

          </div>
        </div>

        {/* Middle Panel - Stream Content */}
        <div className={layoutClasses.middlePanel}>
          <div 
            className="p-8 rounded mb-5 text-center"
            style={{ 
              backgroundColor: 'var(--primary-blue)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-standard-desktop)'
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

          <div 
            className="p-5 rounded mb-5"
            style={{ 
              backgroundColor: 'var(--pure-white)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-standard-desktop)'
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
                    onStreamClick={handleStreamClick}
                    onNavigateToPage={onNavigateToPage}
                  />
                ))}
              </div>
            )}
          </div>

          {renderPagination()}
        </div>

        {/* Right Panel - Trending */}
        <div className={layoutClasses.rightPanel}>
          <div 
            className="p-5 rounded sticky top-5"
            style={{ 
              backgroundColor: 'var(--pure-white)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-standard-desktop)',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto'
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BootstrapIcon name="trending-up" size={16} color="var(--primary-blue)" />
              <span className="font-heading font-medium" style={{ color: 'var(--primary-blue)' }}>
                Trending
              </span>
            </div>

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
                        <BootstrapIcon name="person" size={12} color="var(--medium-gray)" />
                        <span className="text-xs text-gray-500 font-body">{stream.streamerName}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold font-body text-sm" style={{ color: 'var(--primary-blue)' }}>
                          <BootstrapIcon name="eye" size={12} color="var(--primary-blue)" />
                          {stream.viewerCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

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
                      <div
                        className="absolute -top-1 -right-1 px-1 py-0.5 text-xs font-medium rounded"
                        style={{
                          backgroundColor: 'var(--primary-blue)',
                          color: 'var(--pure-white)',
                          fontSize: '10px'
                        }}
                      >
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium font-body text-sm line-clamp-2" style={{ color: 'var(--primary-blue)' }}>
                        {stream.title}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <BootstrapIcon name="person" size={12} color="var(--medium-gray)" />
                        <span className="text-xs text-gray-500 font-body">{stream.streamerName}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold font-body text-sm" style={{ color: 'var(--primary-blue)' }}>
                          <BootstrapIcon name="eye" size={12} color="var(--primary-blue)" />
                          {stream.viewerCount.toLocaleString()}
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

export default LiveStreamGrid;