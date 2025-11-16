import { useState, useEffect, useRef } from "react";
import { X, Heart, Star, ShoppingCart, ChevronLeft, ChevronRight, Info, Leaf, Ruler, Smartphone, MapPin, Play, Share2, MessageCircle, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  sizes: string[];
  colors: string[];
  badge?: string;
  description?: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onNavigateToStoreLocator?: (product: Product) => void;
}

export function ProductModal({ product, isOpen, onClose, onAddToCart, onNavigateToStoreLocator }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showProductInfo, setShowProductInfo] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const mainDisplayRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // YouTube video IDs from the gallery - same as ProductCard
  const youtubeVideoIds = [
    'JLnjExtdyAs', '1YseVzwa0Rw', 'WJjx47FUgfs', 'F08tHtD_qfc',
    'thoWb5Fs3fw', 'h3kx0BxnPA0', 'QZP9nDVFF00', 'r7J7LJ1zhIk',
    'KHXwwiG7lug', 'MmRXT5ik4cE', 'JJbgGuf9nq8', 'HIC9LRab0zo',
    'o96D5B_KUvQ'
  ];

  // Map product to YouTube video ID - same logic as ProductCard
  const getYouTubeVideoId = (productId: number) => {
    const index = (productId - 1) % youtubeVideoIds.length;
    return youtubeVideoIds[index];
  };

  // Generate YouTube embed URL - same as ProductCard
  const getYouTubeEmbedUrl = (productId: number) => {
    const videoId = getYouTubeVideoId(productId);
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
  };

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Debug logging for development
  useEffect(() => {
    if (product) {
      const videoId = getYouTubeVideoId(product.id);
      console.log(`ProductModal: Product ${product.id} (${product.name}) mapped to YouTube video: ${videoId}`);
    }
  }, [product?.id, product?.name]);

  if (!isOpen || !product) return null;

  // Swipe detection for mobile navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (displayImages.length > 1) {
      if (isLeftSwipe) {
        // Swipe left - next image
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
      } else if (isRightSwipe) {
        // Swipe right - previous image
        setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
      }
    }
  };

  // Initialize selections when product changes
  if (selectedSize === '' && product.sizes.length > 0) {
    setSelectedSize(product.sizes[0]);
  }
  if (selectedColor === '' && product.colors.length > 0) {
    setSelectedColor(product.colors[0]);
  }

  // Get clean product images - filter out video placeholders and ensure we have real URLs
  const cleanOriginalImages = (product.images || [product.image])
    .filter(img => img && !img.startsWith('VIDEO_PLACEHOLDER_'))
    .filter(img => img.startsWith('http')); // Only include actual URLs
  
  // If no clean images, fallback to main product image
  const originalImages = cleanOriginalImages.length > 0 ? cleanOriginalImages : [product.image];
  
  // Create display images: YouTube Video + clean original images
  const displayImages = [`YOUTUBE_VIDEO_${product.id}`, ...originalImages];
  
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  const getColorCode = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      'red': '#ef4444',
      'blue': '#3b82f6',
      'green': '#10b981',
      'yellow': '#f59e0b',
      'orange': '#f97316',
      'purple': '#8b5cf6',
      'pink': '#ec4899',
      'black': '#1f2937',
      'white': '#f9fafb',
      'brown': '#92400e',
      'gold': '#fbbf24',
      'multi': 'linear-gradient(45deg, #f97316, #dc2626, #fbbf24)'
    };
    return colorMap[colorName.toLowerCase()] || '#6b7280';
  };

  // 🎬 TikTok-Style Mobile Render
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 🎬 TIKTOK-STYLE FULL-SCREEN MODAL CONTAINER */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 overflow-hidden"
              style={{ 
                height: '100vh',
                zIndex: 50,
                background: '#000000'
              }}
            >
              {/* 🎬 BACKGROUND VIDEO/IMAGE */}
              <div 
                className="absolute inset-0"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    {displayImages[currentImageIndex].startsWith('YOUTUBE_VIDEO_') ? (
                      !videoError ? (
                        <>
                          <iframe
                            width="100%"
                            height="100%"
                            src={getYouTubeEmbedUrl(product.id)}
                            title={`${product.name} Video`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full object-cover"
                            style={{
                              borderRadius: '0px',
                              objectFit: 'cover',
                              filter: 'brightness(0.8)'
                            }}
                          />
                        </>
                      ) : (
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          style={{ filter: 'brightness(0.8)' }}
                        />
                      )
                    ) : (
                      <ImageWithFallback
                        src={displayImages[currentImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        style={{ filter: 'brightness(0.8)' }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
                
                {/* Orange overlay for better text readability */}
                <div 
                  className="absolute inset-0"
                  style={{ 
                    zIndex: 2,
                    background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(255, 107, 107, 0.4) 100%)'
                  }}
                />
              </div>

              {/* 🔥 NAVIGATION ARROWS - Only show if multiple images */}
              {displayImages.length > 1 && (
                <>
                  {/* Previous Arrow */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 z-[15]"
                    style={{
                      backgroundColor: 'rgba(255, 107, 107, 0.4)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)'
                    }}
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </motion.button>

                  {/* Next Arrow */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 z-[15]"
                    style={{
                      backgroundColor: 'rgba(255, 107, 107, 0.4)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)'
                    }}
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.button>

                  {/* Media Type & Counter Indicator */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-6 right-6 flex flex-col items-end gap-1 z-[15]"
                  >
                    {/* Media Type Badge */}
                    <div 
                      className="px-2 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1"
                      style={{
                        backgroundColor: displayImages[currentImageIndex].startsWith('YOUTUBE_VIDEO_') 
                          ? 'rgba(255, 0, 0, 0.7)' 
                          : 'rgba(0, 150, 255, 0.7)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {displayImages[currentImageIndex].startsWith('YOUTUBE_VIDEO_') ? (
                        <>
                          <Play className="h-3 w-3" fill="currentColor" />
                          Video
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          Image
                        </>
                      )}
                    </div>
                    
                    {/* Counter */}
                    <div 
                      className="px-3 py-1 rounded-full text-white text-sm font-medium"
                      style={{
                        backgroundColor: 'rgba(255, 107, 107, 0.4)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)'
                      }}
                    >
                      {currentImageIndex + 1} / {displayImages.length}
                    </div>
                  </motion.div>

                  {/* Dots Indicator */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-[15]"
                  >
                    {displayImages.map((_, index) => (
                      <motion.button
                        key={index}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/50'
                        }`}
                        style={{
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}
                      />
                    ))}
                  </motion.div>
                </>
              )}

              {/* 🔥 TIKTOK-STYLE CLOSE BUTTON */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-6 left-6 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 z-[60]"
                style={{
                  backgroundColor: 'rgba(255, 107, 107, 0.3)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)'
                }}
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </motion.button>

              {/* 🔥 TIKTOK-STYLE SIDE ACTION PANEL - EXACT MATCH TO MOBILE HOME PAGE DESIGN */}
              <div 
                className="absolute right-4 bottom-[193px] flex flex-col gap-4"
                style={{ zIndex: 9999 }}
              >
                {/* Favorite Button */}
                <motion.div 
                  className="flex flex-col items-center"
                  whileTap={{ scale: 0.8 }}
                >
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300"
                    style={{
                      backgroundColor: isLiked ? '#ff4757' : 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <Heart 
                      className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`}
                    />
                  </button>
                  
                  <span className="text-white text-xs mt-1 opacity-75 font-body">
                    {Math.floor(Math.random() * 100) + 50}
                  </span>
                </motion.div>

                {/* Add Button */}
                <motion.div 
                  className="flex flex-col items-center"
                  whileTap={{ scale: 0.8 }}
                >
                  <button
                    onClick={() => onAddToCart(product, selectedSize, selectedColor)}
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

                {/* Share Button */}
                <motion.div 
                  className="flex flex-col items-center"
                  whileTap={{ scale: 0.8 }}
                >
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: product.name,
                          text: `Check out this ${product.name} from Bato!`,
                          url: window.location.href,
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

                {/* Location Marker Button */}
                <motion.div 
                  className="flex flex-col items-center"
                  whileTap={{ scale: 0.8 }}
                >
                  <button
                    onClick={() => onNavigateToStoreLocator?.(product)}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <MapPin className="h-6 w-6" />
                  </button>
                  
                  <span className="text-white text-xs mt-1 opacity-75 font-body">
                    Store
                  </span>
                </motion.div>
              </div>

              {/* 🎵 TIKTOK-STYLE BOTTOM INFO PANEL */}
              <AnimatePresence>
                {showProductInfo && (
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="absolute bottom-0 left-0 right-0 p-4 text-white"
                    style={{ zIndex: 10 }}
                  >
                    {/* Product Info */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-lg font-bold font-heading truncate">
                          @modishstyle
                        </h2>
                        <div className="w-1 h-1 bg-white rounded-full opacity-60" />
                        <span className="text-sm opacity-80">
                          {product.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 font-heading">
                        {product.name}
                      </h3>

                      {/* 🔥 RATING SECTION */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-xs text-gray-300">
                          {product.rating} ({Math.floor(Math.random() * 50) + 10} reviews)
                        </span>
                      </div>
                      
                      <p className="text-sm opacity-90 mb-3 line-clamp-2">
                        Authentic African fashion • Premium quality • Free shipping
                        {product.description && ` • ${product.description.slice(0, 50)}...`}
                      </p>

                      {/* Hashtags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="text-sm text-blue-300">#AfricanFashion</span>
                        <span className="text-sm text-blue-300">#ModishStyle</span>
                        <span className="text-sm text-blue-300">#Fashion</span>
                        <span className="text-sm text-blue-300">#{product.category}</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-bold text-green-400">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <>
                            <span className="text-lg text-gray-400 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                            <span className="px-2 py-1 bg-red-500 rounded-full text-xs font-bold">
                              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </span>
                          </>
                        )}
                      </div>

                      {/* 🔥 COLOR SELECTION */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold">Color:</span>
                            <span className="text-sm opacity-80">{selectedColor}</span>
                          </div>
                          <div className="flex gap-2">
                            {product.colors.slice(0, 6).map((color) => (
                              <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                                  selectedColor === color ? 'scale-110' : 'border-white/50'
                                }`}
                                style={{ 
                                  background: color === 'Multi' ? 'linear-gradient(45deg, #f97316, #dc2626, #fbbf24)' : getColorCode(color),
                                  borderColor: selectedColor === color ? '#fff' : 'rgba(255, 255, 255, 0.5)'
                                }}
                                title={color}
                              >
                                {selectedColor === color && (
                                  <div className="absolute inset-0 rounded-full border border-white/60"></div>
                                )}
                              </button>
                            ))}
                            {product.colors.length > 6 && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs">
                                +{product.colors.length - 6}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 🔥 SIZE SELECTION */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold">Size:</span>
                            <span className="text-sm opacity-80">{selectedSize}</span>
                            <button 
                              onClick={() => alert('Size Chart\n\nXS: 0-2\nS: 4-6\nM: 8-10\nL: 12-14\nXL: 16-18\nXXL: 20-22')}
                              className="text-xs text-blue-300 flex items-center gap-1"
                            >
                              <Ruler className="h-3 w-3" />
                              Chart
                            </button>
                          </div>
                          <div className="flex gap-2">
                            {product.sizes.slice(0, 6).map((size) => (
                              <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-3 py-1 rounded-full border text-sm font-medium transition-all duration-200 ${
                                  selectedSize === size
                                    ? 'bg-white text-black border-white'
                                    : 'border-white/50 text-white hover:bg-white/20'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                            {product.sizes.length > 6 && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs">
                                +{product.sizes.length - 6}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 🔥 ADD TO CART BUTTON - TikTok Style */}
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 px-6 py-3 rounded-full font-bold text-center transition-all duration-300"
                          style={{
                            background: 'var(--primary-blue)',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(88, 37, 239, 0.4)'
                          }}
                          onClick={() => onAddToCart(product, selectedSize, selectedColor)}
                        >
                          ADD TO CART • ${product.price.toFixed(2)}
                        </motion.button>

                        {/* Store Locator Button - Compact */}
                        {onNavigateToStoreLocator && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-3 rounded-full font-bold text-center transition-all duration-300"
                            style={{
                              backgroundColor: 'rgba(255, 107, 107, 0.3)',
                              backdropFilter: 'blur(10px)',
                              boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
                              color: 'white'
                            }}
                            onClick={() => onNavigateToStoreLocator(product)}
                          >
                            <MapPin className="h-5 w-5" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // 🖥️ DESKTOP VERSION - FULL SCREEN Modal
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Full Screen Style */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-sm transition-colors flex items-center justify-center shadow-lg"
          >
            <X className="h-6 w-6 text-gray-800" />
          </button>

          <div className="flex h-full">
            {/* Left side - Image Gallery - Full Height */}
            <div className="w-3/5 relative bg-gradient-to-br from-orange-50 to-red-50 h-full">
              {/* Product Badge */}
              {product.badge && (
                <Badge 
                  className={`absolute top-6 left-6 z-10 text-white shadow-lg ${
                    product.badge === 'New' ? 'bg-green-500' :
                    product.badge === 'Sale' ? 'bg-red-500' :
                    product.badge === 'Popular' ? 'bg-blue-500' :
                    product.badge === 'Limited' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`}
                >
                  {product.badge}
                </Badge>
              )}

              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <Badge className="absolute top-6 left-32 z-10 bg-red-500 text-white shadow-lg">
                  -{discountPercentage}%
                </Badge>
              )}

              {/* Main Image Display - Optimized for Responsive Thumbnails */}
              <div className="relative h-[65vh] bg-white overflow-hidden">
                {displayImages[currentImageIndex].startsWith('YOUTUBE_VIDEO_') ? (
                  <div className="relative w-full h-full">
                    {!videoError ? (
                      <>
                        <iframe
                          width="100%"
                          height="100%"
                          src={getYouTubeEmbedUrl(product.id)}
                          title={`${product.name} Video`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className={`w-full h-full ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                          style={{
                            borderRadius: '0px',
                            objectFit: 'cover'
                          }}
                          onLoad={() => setVideoLoaded(true)}
                          onError={() => setVideoError(true)}
                        />
                        {!videoLoaded && (
                          <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ 
                              backgroundImage: `url(${product.image})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <ImageWithFallback
                    src={displayImages[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Navigation Arrows */}
                {displayImages.length > 1 && (
                  <>
                    <button
                      className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors flex items-center justify-center shadow-lg z-10"
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-600" />
                    </button>
                    
                    <button
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors flex items-center justify-center shadow-lg z-10"
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)}
                    >
                      <ChevronRight className="h-6 w-6 text-gray-600" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {displayImages.length > 1 && (
                  <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-black/60 text-white z-10">
                    {currentImageIndex + 1} / {displayImages.length}
                  </div>
                )}
              </div>

              {/* 🔥 FULLY RESPONSIVE THUMBNAIL GALLERY */}
              {displayImages.length > 1 && (
                <div className="p-4 md:p-6 lg:p-8 h-[35vh] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
                    {displayImages.map((image, index) => {
                      const isYouTubeVideo = image.startsWith('YOUTUBE_VIDEO_');
                      const viewLabels = ['Video', 'Front View', 'Left View', 'Right View', 'Back View'];
                      
                      let thumbnailImageSrc = image;
                      let altText = `${product.name} view ${index + 1}`;
                      let labelText = viewLabels[index] || `View ${index + 1}`;
                      
                      if (isYouTubeVideo) {
                        altText = `${product.name} video`;
                        labelText = 'Video';
                      } else {
                        const imageIndex = index - 1;
                        
                        if (imageIndex >= 0 && imageIndex < originalImages.length) {
                          thumbnailImageSrc = originalImages[imageIndex];
                          altText = `${product.name} ${viewLabels[index]}`;
                          labelText = viewLabels[index] || `View ${index}`;
                        } else {
                          thumbnailImageSrc = product.image;
                          altText = `${product.name} ${viewLabels[index]}`;
                          labelText = viewLabels[index] || `View ${index}`;
                        }
                      }
                      
                      const maxThumbnails = Math.min(originalImages.length + 1, 10);
                      if (index >= maxThumbnails) return null;
                      
                      return (
                        <div key={index} className="flex flex-col items-center">
                          <button
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative w-full aspect-square rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-3 lg:border-4 transition-all duration-300 flex-shrink-0 max-w-[200px] ${
                              currentImageIndex === index 
                                ? 'border-orange-500 shadow-lg md:shadow-xl lg:shadow-2xl scale-105' 
                                : 'border-gray-200 hover:border-orange-300 hover:scale-102 hover:shadow-md md:hover:shadow-lg lg:hover:shadow-xl'
                            }`}
                          >
                            {isYouTubeVideo ? (
                              <div className="w-full h-full bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
                                <div className="w-1/3 h-1/3 bg-white/90 rounded-full flex items-center justify-center shadow-md md:shadow-lg">
                                  <Play className="w-1/2 h-1/2 text-orange-600 ml-0.5" fill="currentColor" />
                                </div>
                              </div>
                            ) : (
                              <ImageWithFallback
                                src={thumbnailImageSrc}
                                alt={altText}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </button>
                          
                          <span className={`text-xs md:text-sm lg:text-base mt-2 md:mt-3 lg:mt-4 px-2 md:px-4 lg:px-6 py-1 md:py-2 rounded-full font-medium transition-all duration-300 text-center ${
                            currentImageIndex === index 
                              ? 'bg-orange-500 text-white shadow-md md:shadow-lg' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}>
                            {labelText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Product Information - Full Height Scrollable */}
            <div className="w-2/5 p-8 overflow-y-auto h-full bg-white">
              {/* Product Header */}
              <div className="mb-8">
                <div className="text-sm font-semibold text-orange-600 mb-3 tracking-wide uppercase">
                  {product.badge && `${product.badge} • `}Online Exclusive
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-gray-600 font-medium">
                    {product.rating} ({Math.floor(Math.random() * 50) + 10} REVIEWS)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-6 mb-8">
                  {product.originalPrice && (
                    <span className="text-2xl text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-red-600">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-semibold text-gray-900 text-lg">Color:</span>
                  <span className="text-gray-700 font-medium text-lg">{selectedColor}</span>
                </div>
                <div className="flex gap-4">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-14 h-14 rounded-full border-3 transition-all duration-200 ${
                        selectedColor === color
                          ? 'scale-110 shadow-lg'
                          : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                      }`}
                      style={{ 
                        background: color === 'Multi' ? 'linear-gradient(45deg, #f97316, #dc2626, #fbbf24)' : getColorCode(color),
                        borderColor: selectedColor === color ? 'var(--success-light-green)' : '#d1d5db'
                      }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <div className="absolute inset-0 rounded-full border-2 border-white"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-900 text-lg">Size:</span>
                  <div className="flex gap-4 text-sm">
                    <button className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                      <Ruler className="h-4 w-4" />
                      Size Chart
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-4 border-2 rounded-xl font-semibold transition-all duration-200 min-w-[60px] text-center text-lg ${
                        selectedSize === size
                          ? 'border-orange-500 bg-orange-500 text-white scale-105'
                          : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-orange-700">
                    {Math.floor(Math.random() * 1000) + 240}
                  </div>
                  <div className="text-orange-600 font-medium">Sales This Month</div>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-orange-700">
                    ${Math.floor(Math.random() * 10000) + 5000}
                  </div>
                  <div className="text-orange-600 font-medium">Revenue Generated</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-8">
                <div className="flex gap-8">
                  {[
                    { id: 'details', label: 'Product Details', icon: Info },
                    { id: 'care', label: 'Material & Care', icon: Leaf }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 pb-4 border-b-2 transition-colors font-medium text-lg ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-600 hover:text-orange-500'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="space-y-6 mb-8">
                {activeTab === 'details' && (
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                      {product.description || "High-quality African fashion piece that combines traditional patterns with modern styling. Perfect for special occasions or everyday elegance."}
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-4">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-lg">Authentic African print fabric with vibrant colors</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-lg">Premium quality construction and finishing</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-lg">Comfortable fit with breathable fabric</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === 'care' && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 text-xl">Care Instructions</h4>
                    <ul className="space-y-3 text-gray-700 text-lg">
                      <li>• Machine wash cold with like colors</li>
                      <li>• Do not bleach</li>
                      <li>• Tumble dry low heat</li>
                      <li>• Iron on low temperature if needed</li>
                      <li>• Dry clean when necessary</li>
                    </ul>
                    
                    <h4 className="font-semibold text-gray-900 mb-4 mt-8 text-xl">Material</h4>
                    <p className="text-gray-700 text-lg">100% Premium Cotton with authentic African print</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 sticky bottom-0 bg-white pt-6 pb-6 border-t border-gray-100">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isLiked
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-red-300 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                
                <Button
                  onClick={() => onAddToCart(product, selectedSize, selectedColor)}
                  className="flex-1 h-16 btn-moema-primary text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                  disabled={!selectedSize || !selectedColor}
                >
                  <ShoppingCart className="h-6 w-6 mr-3" />
                  ADD TO CART - ${product.price.toFixed(2)}
                </Button>

                {onNavigateToStoreLocator && (
                  <button
                    onClick={() => onNavigateToStoreLocator(product)}
                    className="w-16 h-16 rounded-full border-2 border-orange-300 bg-white text-orange-600 hover:border-orange-500 hover:bg-orange-50 flex items-center justify-center transition-all duration-200"
                  >
                    <MapPin className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}