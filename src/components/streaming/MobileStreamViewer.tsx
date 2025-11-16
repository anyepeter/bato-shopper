import React, { useState, useEffect } from 'react';
import { useApp } from '../AppProvider';
import { ProductCard } from '../ProductCard';
import { BootstrapIcon } from '../BootstrapIcon';
import { Stream } from '../../types';

interface MobileStreamViewerProps {
  streams: Stream[];
  onStreamClick: (stream: Stream) => void;
  onNavigateToHome: () => void;
}

function MobileStreamViewer({ streams, onStreamClick, onNavigateToHome }: MobileStreamViewerProps) {
  const { state, actions, cart } = useApp();
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showProducts, setShowProducts] = useState(false);
  
  const currentStream = streams[currentStreamIndex];

  // Auto-hide controls after 4 seconds for better UX
  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showControls]);

  // Touch/Keyboard navigation
  useEffect(() => {
    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      currentY = e.changedTouches[0].clientY;
      const diffY = startY - currentY;

      if (Math.abs(diffY) > 50) { // Minimum swipe distance
        if (diffY > 0) {
          handleNextStream(); // Swipe up for next
        } else {
          handlePrevStream(); // Swipe down for previous
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleNextStream();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handlePrevStream();
      } else if (e.key === 'Escape') {
        handleBackToGrid();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentStreamIndex, streams.length]);

  const handleScreenTap = () => {
    setShowControls(prev => !prev);
  };

  const handleProductsToggle = () => {
    setShowProducts(prev => !prev);
  };

  const handleBackToGrid = () => {
    onNavigateToHome();
  };

  const handleNextStream = () => {
    if (currentStreamIndex < streams.length - 1) {
      setCurrentStreamIndex(currentStreamIndex + 1);
    }
  };

  const handlePrevStream = () => {
    if (currentStreamIndex > 0) {
      setCurrentStreamIndex(currentStreamIndex - 1);
    }
  };

  if (!streams || streams.length === 0 || !currentStream) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #000000, #1a1a1a, #000000)',
        }}
      >
        <div className="text-center z-10">
          <BootstrapIcon name="exclamation-triangle" className="w-20 h-20 text-red-500 mb-6 mx-auto animate-pulse" />
          <p className="font-body text-white text-xl mb-8 font-medium">Stream not found</p>
          <button
            onClick={handleBackToGrid}
            className="px-8 py-4 font-body text-base font-medium text-white rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ 
              background: 'linear-gradient(45deg, #ff0050, #ff6b35)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 8px 32px rgba(255, 0, 80, 0.3)'
            }}
          >
            Back to Streams
          </button>
        </div>
        
        {/* TikTok-style Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative h-screen overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #000000, #1a1a1a, #000000)',
      }}
    >
      {/* Dynamic TikTok-style Background with Stream Thumbnail */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ 
          backgroundImage: `url(${currentStream.thumbnailImage})`,
          filter: 'blur(40px) saturate(150%) contrast(120%)',
          transform: 'scale(1.3)'
        }}
      />
      
      {/* Electric Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(255, 0, 80, 0.1), rgba(0, 242, 234, 0.1), rgba(0, 0, 0, 0.85))',
        }}
      />
      
      {/* Animated Neon Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ boxShadow: '0 0 20px #ec4899' }}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s', boxShadow: '0 0 15px #3b82f6' }}></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '2s', boxShadow: '0 0 18px #10b981' }}></div>
      </div>
      
      {/* Main TikTok-style Stream Content */}
      <div 
        className="relative h-full flex items-center justify-center"
        onClick={handleScreenTap}
      >
        {/* Full-Screen Stream Video/Image */}
        <div 
          className="w-full h-full relative overflow-hidden"
          style={{ 
            maxWidth: '100vw',
            maxHeight: '100vh'
          }}
        >
          <img
            src={currentStream.thumbnailImage}
            alt={currentStream.title}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.9) contrast(1.1)' }}
          />
          
          {/* TikTok-style Gradient Overlays */}
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%)'
            }}
          />
          
          {/* Electric Live Indicator */}
          <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md" style={{ 
            background: 'linear-gradient(45deg, #ff0050, #ff3366)',
            boxShadow: '0 0 20px rgba(255, 0, 80, 0.5)'
          }}>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ boxShadow: '0 0 10px white' }}></div>
            <span className="font-body text-sm text-white font-bold tracking-wide">LIVE</span>
          </div>
          
          {/* Neon Viewer Count */}
          <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md" style={{ 
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(0, 242, 234, 0.3)',
            boxShadow: '0 0 15px rgba(0, 242, 234, 0.2)'
          }}>
            <BootstrapIcon name="eye" className="w-4 h-4 text-cyan-400" />
            <span className="font-body text-sm text-cyan-400 font-bold">{currentStream.viewerCount.toLocaleString()}</span>
          </div>
          
          {/* Electric Play/Pause Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStreamClick(currentStream);
              }}
              className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              style={{ 
                background: 'linear-gradient(45deg, rgba(255, 0, 80, 0.8), rgba(255, 107, 53, 0.8))',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 30px rgba(255, 0, 80, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <BootstrapIcon name="play-fill" className="w-12 h-12 text-white ml-1" />
            </button>
          </div>
          
          {/* Stream Info Overlay */}
          <div className="absolute bottom-[44px] left-6 right-20">
            <div className="mb-4">
              <h1 className="font-heading text-2xl text-white font-bold mb-2 drop-shadow-lg">
                {currentStream.title}
              </h1>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={currentStream.streamerAvatar || `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face`}
                  alt={currentStream.streamerName}
                  className="w-10 h-10 rounded-full border-2 border-white/30"
                />
                <span className="font-body text-lg text-white font-semibold">{currentStream.streamerName}</span>
              </div>
              <p className="font-body text-base text-white/80 line-clamp-2 leading-relaxed mb-4">
                {currentStream.description || `Live African fashion show featuring ${currentStream.category} designs`}
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
              
              {/* Featured Products Section */}
              <div className="mb-4">
                <h3 className="text-white font-body text-lg font-medium mb-3">
                  Featured Products (3/3)
                </h3>
                
                {/* Product Cards - Horizontal Layout */}
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                  {/* Product 1 - NEW Badge */}
                  <div className="flex-shrink-0 w-32 bg-white rounded-lg overflow-hidden">
                    <div className="relative h-24">
                      <img
                        src="https://images.unsplash.com/photo-1594736797933-d0a9ba54d9f3?w=300&h=300&fit=crop"
                        alt="Vibrant Ankara Maxi Dress"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1">
                        <span className="px-1.5 py-0.5 bg-orange-500 text-white text-xs font-medium rounded">
                          NEW
                        </span>
                      </div>
                    </div>
                    <div className="p-2">
                      <h4 className="font-body text-xs font-medium text-gray-900 mb-1 line-clamp-2">
                        Vibrant Ankara Maxi Dress
                      </h4>
                      <div className="flex items-center gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <BootstrapIcon
                            key={star}
                            name="star-fill"
                            className="w-2.5 h-2.5 text-yellow-400"
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">(4.8)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-body text-xs font-medium text-gray-900">$89.99</span>
                        <span className="font-body text-xs text-gray-500 line-through">$109.99</span>
                      </div>
                    </div>
                  </div>

                  {/* Product 2 - LIVE Badge */}
                  <div className="flex-shrink-0 w-32 bg-white rounded-lg overflow-hidden">
                    <div className="relative h-24">
                      <img
                        src="https://images.unsplash.com/photo-1583391733981-3b783b5e1c7e?w=300&h=300&fit=crop"
                        alt="Elegant African Print Ensemble"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1">
                        <span className="px-1.5 py-0.5 bg-red-600 text-white text-xs font-medium rounded">
                          LIVE
                        </span>
                      </div>
                    </div>
                    <div className="p-2">
                      <h4 className="font-body text-xs font-medium text-gray-900 mb-1 line-clamp-2">
                        Elegant African Print Ensemble
                      </h4>
                      <div className="flex items-center gap-0.5 mb-1">
                        {[1, 2, 3, 4].map((star) => (
                          <BootstrapIcon
                            key={star}
                            name="star-fill"
                            className="w-2.5 h-2.5 text-yellow-400"
                          />
                        ))}
                        <BootstrapIcon
                          name="star"
                          className="w-2.5 h-2.5 text-gray-300"
                        />
                        <span className="text-xs text-gray-600 ml-1">(4.6)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-body text-xs font-medium text-gray-900">$129.99</span>
                        <span className="font-body text-xs text-gray-500 line-through">$149.99</span>
                      </div>
                    </div>
                  </div>

                  {/* Product 3 - SALE Badge + -19% */}
                  <div className="flex-shrink-0 w-32 bg-white rounded-lg overflow-hidden">
                    <div className="relative h-24">
                      <img
                        src="https://images.unsplash.com/photo-1616847304977-1b5a34f21814?w=300&h=300&fit=crop"
                        alt="Contemporary Dashiki Shirt"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 flex flex-col gap-0.5">
                        <span className="px-1.5 py-0.5 bg-red-600 text-white text-xs font-medium rounded">
                          SALE
                        </span>
                        <span className="px-1.5 py-0.5 bg-black text-white text-xs font-medium rounded">
                          -19%
                        </span>
                      </div>
                    </div>
                    <div className="p-2">
                      <h4 className="font-body text-xs font-medium text-gray-900 mb-1 line-clamp-2">
                        Contemporary Dashiki Shirt
                      </h4>
                      <div className="flex items-center gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <BootstrapIcon
                            key={star}
                            name="star-fill"
                            className="w-2.5 h-2.5 text-yellow-400"
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">(4.9)</span>
                      </div>
                      <span className="font-body text-xs font-medium text-gray-900">$67.99</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Watch Live Stream Button */}
              <button
                onClick={() => onStreamClick(currentStream)}
                className="w-full py-3 text-white font-body text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                style={{ 
                  backgroundColor: '#5825efff',
                  borderRadius: '8px'
                }}
              >
                <BootstrapIcon name="play-circle" className="w-4 h-4" />
                WATCH LIVE STREAM
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TikTok-Style Top Navigation */}
      {showControls && (
        <div className="absolute top-0 left-0 right-0 z-50 p-6 pt-12">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToGrid}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              style={{ 
                background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.6), rgba(255, 255, 255, 0.1))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            >
              <BootstrapIcon name="arrow-left" className="w-7 h-7 text-white" />
            </button>
            
            <div className="text-center">
              <div className="px-4 py-2 rounded-full backdrop-blur-md" style={{ 
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span className="font-body text-sm text-white font-semibold">
                  {currentStreamIndex + 1} / {streams.length}
                </span>
              </div>
            </div>

            <div className="w-14 h-14"></div> {/* Spacer for balance */}
          </div>
        </div>
      )}

      {/* TikTok-Style Floating Right Controls - Positioned 5px from right margin */}
      <div 
        className="fixed top-1/2 transform -translate-y-1/2 z-50"
        style={{ 
          right: '5px',
          position: 'sticky',
          zIndex: 88
        }}
      >
        <div className="flex flex-col gap-4 bg-transparent border-0">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={currentStream.streamerAvatar || `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face`}
              alt={currentStream.streamerName}
              className="w-14 h-14 rounded-full border-2 border-white transition-all duration-300 hover:scale-110 active:scale-95"
              style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
            />
          </div>

          {/* Like Button */}
          <button 
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{ 
              background: 'linear-gradient(45deg, #ff0050, #ff3366)',
              boxShadow: '0 0 20px rgba(255, 0, 80, 0.4)'
            }}
          >
            <BootstrapIcon name="heart-fill" className="w-8 h-8 text-white" />
          </button>

          {/* Comment Button */}
          <button 
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            <BootstrapIcon name="chat-dots" className="w-8 h-8 text-white" />
          </button>

          {/* Share Button */}
          <button 
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            <BootstrapIcon name="share" className="w-8 h-8 text-white" />
          </button>

          {/* Products Button */}
          <button 
            onClick={handleProductsToggle}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 relative"
            style={{ 
              background: 'linear-gradient(45deg, #00f2ea, #ff00c7)',
              boxShadow: '0 0 20px rgba(0, 242, 234, 0.4)'
            }}
          >
            <BootstrapIcon name="bag-fill" className="w-8 h-8 text-white" />
            {currentStream.products && currentStream.products.length > 0 && (
              <div 
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ 
                  background: 'linear-gradient(45deg, #ff0050, #ff6b35)',
                  boxShadow: '0 0 10px rgba(255, 0, 80, 0.5)'
                }}
              >
                {currentStream.products.length}
              </div>
            )}
          </button>

          {/* Music/Audio Button */}
          <button 
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            <BootstrapIcon name="music-note" className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>

      {/* TikTok-Style Electric Products Drawer */}
      {showProducts && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-end">
          <div 
            className="w-full max-h-[80vh] overflow-hidden animate-fade-in-up"
            style={{ 
              background: 'linear-gradient(135deg, #000000, #1a1a1a)',
              borderTopLeftRadius: 'var(--radius-lg)',
              borderTopRightRadius: 'var(--radius-lg)',
              border: '1px solid rgba(0, 242, 234, 0.3)',
              boxShadow: '0 -8px 32px rgba(0, 242, 234, 0.2)'
            }}
          >
            {/* Electric Drawer Header */}
            <div className="p-6 border-b border-white/10" style={{ 
              background: 'linear-gradient(45deg, rgba(255, 0, 80, 0.1), rgba(0, 242, 234, 0.1))'
            }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl text-white mb-1 font-bold">Shop the Look</h3>
                  <p className="font-body text-base text-cyan-400">
                    {currentStream.products?.length || 0} electric picks from this stream ⚡
                  </p>
                </div>
                <button
                  onClick={handleProductsToggle}
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                  style={{ 
                    background: 'linear-gradient(45deg, #ff0050, #ff3366)',
                    boxShadow: '0 0 20px rgba(255, 0, 80, 0.4)'
                  }}
                >
                  <BootstrapIcon name="x" className="w-7 h-7 text-white" />
                </button>
              </div>
            </div>
            
            {/* Electric Products Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <div className="space-y-6">
                {currentStream.products?.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="p-5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 animate-fade-in"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(0, 242, 234, 0.05))',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className="flex items-start gap-5">
                      <div className="flex-shrink-0 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-28 h-28 object-cover rounded-lg"
                          style={{ 
                            borderRadius: 'var(--radius-lg)',
                            filter: 'brightness(1.1) contrast(1.1)'
                          }}
                        />
                        <div className="absolute inset-0 rounded-lg" style={{
                          background: 'linear-gradient(45deg, transparent, rgba(0, 242, 234, 0.1))',
                          borderRadius: 'var(--radius-lg)'
                        }}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-xl text-white mb-3 line-clamp-2 font-bold">
                          {product.name}
                        </h4>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <span className="font-body text-2xl font-bold" style={{ 
                            background: 'linear-gradient(45deg, #00f2ea, #ff00c7)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                          }}>
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="font-body text-lg text-gray-400 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                          {product.discount && (
                            <div className="px-3 py-1 rounded-full text-white font-bold text-sm" style={{ 
                              background: 'linear-gradient(45deg, #ff0050, #ff6b35)',
                              boxShadow: '0 0 15px rgba(255, 0, 80, 0.3)'
                            }}>
                              -{product.discount}%
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 mb-5">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <BootstrapIcon
                                key={i}
                                name={i < Math.floor(product.rating) ? "star-fill" : "star"}
                                className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                                style={{ filter: i < Math.floor(product.rating) ? 'drop-shadow(0 0 5px #fbbf24)' : 'none' }}
                              />
                            ))}
                          </div>
                          <span className="font-body text-base text-cyan-400 font-medium">
                            ({product.reviewCount} reviews)
                          </span>
                        </div>
                        
                        <button
                          onClick={() => cart.handleAddToCart(product, product.sizes[0], product.colors[0])}
                          className="w-full py-4 font-body text-lg font-bold text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                          style={{ 
                            background: 'linear-gradient(45deg, #ff0050, #ff6b35)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: '0 8px 32px rgba(255, 0, 80, 0.3)',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                          }}
                        >
                          Add to Cart - ${product.price} ⚡
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TikTok-Style Electric Swipe Hints */}
      {showControls && !showProducts && (
        <div className="absolute left-6 bottom-24 z-40">
          <div className="flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur-md animate-pulse" style={{ 
            background: 'linear-gradient(45deg, rgba(0, 242, 234, 0.2), rgba(255, 0, 199, 0.2))',
            border: '1px solid rgba(0, 242, 234, 0.3)',
            boxShadow: '0 0 20px rgba(0, 242, 234, 0.2)'
          }}>
            <BootstrapIcon name="chevron-left" className="w-5 h-5 text-cyan-400" />
            <span className="font-body text-base text-white font-semibold">Shop the look</span>
            <BootstrapIcon name="lightning-fill" className="w-4 h-4 text-yellow-400" />
          </div>
        </div>
      )}

      {/* Electric Swipe Navigation Hint */}
      {showControls && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md" style={{ 
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <BootstrapIcon name="chevron-up" className="w-4 h-4 text-white animate-bounce" />
            <span className="font-body text-sm text-white font-medium">
              {currentStreamIndex < streams.length - 1 ? 'Swipe up for next' : 'End of streams'}
            </span>
            <BootstrapIcon name="chevron-up" className="w-4 h-4 text-white animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      )}
    </div>
  );
}

// Default export for React.lazy
export default MobileStreamViewer;