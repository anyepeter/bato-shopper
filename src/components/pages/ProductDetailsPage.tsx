import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Heart, Star, ShoppingCart, ChevronLeft, ChevronRight, Info, Leaf, Ruler, Smartphone, MapPin, Play, ChevronDown, ChevronUp, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
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

interface ProductDetailsPageProps {
  product: Product | null;
  onNavigateBack: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onNavigateToStoreLocator?: (product: Product) => void;
}

export function ProductDetailsPage({ product, onNavigateBack, onAddToCart, onNavigateToStoreLocator }: ProductDetailsPageProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showUpArrow, setShowUpArrow] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  
  // Touch gesture state for swipe navigation
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const mainDisplayRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const productInfoRef = useRef<HTMLDivElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Product Media data with labels
  const productMediaItems = [
    {
      id: 'video',
      label: 'Product Video',
      type: 'video',
      src: `YOUTUBE_VIDEO_${product?.id}`,
      isYouTube: true
    },
    {
      id: 'front',
      label: 'Front View',
      type: 'image',
      src: product?.image || '',
      isYouTube: false
    },
    {
      id: 'left',
      label: 'Left View', 
      type: 'image',
      src: product?.images?.[0] || product?.image || '',
      isYouTube: false
    },
    {
      id: 'right',
      label: 'Right View',
      type: 'image',
      src: product?.images?.[1] || product?.image || '',
      isYouTube: false
    },
    {
      id: 'back',
      label: 'Back View',
      type: 'image',
      src: product?.images?.[2] || product?.image || '',
      isYouTube: false
    }
  ];

  // Touch gesture handling for swipe navigation
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && selectedMediaIndex < productMediaItems.length - 1) {
      setSelectedMediaIndex(selectedMediaIndex + 1);
    }
    if (isRightSwipe && selectedMediaIndex > 0) {
      setSelectedMediaIndex(selectedMediaIndex - 1);
    }
  };

  // Keyboard navigation for media
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && selectedMediaIndex > 0) {
        setSelectedMediaIndex(selectedMediaIndex - 1);
      }
      if (e.key === 'ArrowRight' && selectedMediaIndex < productMediaItems.length - 1) {
        setSelectedMediaIndex(selectedMediaIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedMediaIndex, productMediaItems.length]);

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

  // Debug logging for development
  useEffect(() => {
    if (product) {
      const videoId = getYouTubeVideoId(product.id);
      console.log(`ProductDetailsPage: Product ${product.id} (${product.name}) mapped to YouTube video: ${videoId}`);
    }
  }, [product?.id, product?.name]);

  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isMobile ? 'bg-black text-white' : 'bg-white'}`}>
        <div className="text-center">
          <h2 className={`text-xl font-bold mb-4 ${isMobile ? 'text-white' : 'text-gray-900'}`}>Product not found</h2>
          <Button onClick={onNavigateBack} className="btn-moema-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Initialize selections when product changes
  if (selectedSize === '' && product.sizes.length > 0) {
    setSelectedSize(product.sizes[0]);
  }
  if (selectedColor === '' && product.colors.length > 0) {
    setSelectedColor(product.colors[0]);
  }

  // Scroll detection effect - Use window scroll for page layout
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      setScrollTop(currentScrollTop);
      
      // Set scrolling state when scroll starts
      if (currentScrollTop > 0) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }

      // Determine if we should show up arrow (when scrolled past media section)
      const threshold = window.innerHeight * 0.8; // Show up arrow when scrolled 80% of viewport
      setShowUpArrow(currentScrollTop > threshold);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        if (currentScrollTop > 0) {
          setIsScrolling(true); // Keep it fixed if still scrolled
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-400" />);
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
      'multi': 'linear-gradient(45deg, #5825efff, #6e29f6, #885cf8)'
    };
    return colorMap[colorName.toLowerCase()] || '#6b7280';
  };

  // Scroll to section functionality - Use window scroll for page layout
  const handleScrollToSection = () => {
    console.log('🔥 Scroll button clicked!', { showUpArrow });
    
    if (showUpArrow) {
      // Scroll to top (media section)
      console.log('📍 Scrolling to top');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Scroll to product info section
      if (productInfoRef.current) {
        const targetElement = productInfoRef.current;
        const targetTop = targetElement.offsetTop - 80; // Account for header
        
        console.log('📍 Scrolling to product info section', { targetTop });
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      } else {
        console.log('❌ ProductInfoRef not found');
      }
    }
  };

  // Handle product details toggle
  const handleToggleProductDetails = () => {
    setShowProductDetails(!showProductDetails);
  };

  // TikTok-style mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* 🔥 TIKTOK-STYLE HEADER - Transparent overlay */}
        <div className="fixed top-0 left-0 right-0 z-50 p-4" style={{ backgroundColor: 'transparent' }}>
          <div className="flex items-center justify-between">
            {/* Back Arrow Button - Styled like floating navigation arrows */}
            <motion.button
              onClick={onNavigateBack}
              className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all duration-300 z-50 bg-black/60 text-white hover:bg-black/80 active:scale-95"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                borderRadius: '8px'
              }}
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 transition-all duration-200" style={{ backgroundColor: 'transparent !important' }}>
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 transition-all duration-200" style={{ backgroundColor: 'transparent !important' }}>
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 🔥 FULL-SCREEN MEDIA DISPLAY - TikTok Style */}
        <div 
          className="absolute inset-0 w-full h-full"
          onTouchStart={(e) => {
            setTouchEnd(null);
            setTouchStart(e.targetTouches[0].clientX);
          }}
          onTouchMove={(e) => {
            setTouchEnd(e.targetTouches[0].clientX);
          }}
          onTouchEnd={() => {
            if (!touchStart || !touchEnd) return;
            
            const distance = touchStart - touchEnd;
            const isLeftSwipe = distance > minSwipeDistance;
            const isRightSwipe = distance < -minSwipeDistance;

            if (isLeftSwipe && currentImageIndex < displayImages.length - 1) {
              setCurrentImageIndex(currentImageIndex + 1);
            }
            if (isRightSwipe && currentImageIndex > 0) {
              setCurrentImageIndex(currentImageIndex - 1);
            }
          }}
        >
          {displayImages[currentImageIndex].startsWith('YOUTUBE_VIDEO_') ? (
            <div className="relative w-full h-full bg-black">
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
                    className={`w-full h-full object-cover ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
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

          {/* 🔥 MOBILE INTERACTION BUTTONS - EXACT MATCH TO MOBILE HOME PRODUCT VIEW */}
          <div 
            className="absolute right-4 bottom-[193px] flex flex-col gap-4"
            style={{ zIndex: 9999, backgroundColor: 'transparent' }}
          >
            {/* Like Button */}
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

            {/* Add to Cart Button */}
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
                disabled={!selectedSize || !selectedColor}
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

            {/* Store Locator Button */}
            {onNavigateToStoreLocator && (
              <motion.div 
                className="flex flex-col items-center"
                whileTap={{ scale: 0.8 }}
              >
                <button
                  onClick={() => onNavigateToStoreLocator(product)}
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
            )}
          </div>

          {/* 🔥 FLOATING NAVIGATION ARROWS - TikTok Style */}
          {displayImages.length > 1 && (
            <>
              {/* Left Arrow */}
              <motion.button
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all duration-300 z-50 ${
                  currentImageIndex > 0 
                    ? 'bg-black/60 text-white hover:bg-black/80 active:scale-95' 
                    : 'bg-black/20 text-white/40 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (currentImageIndex > 0) {
                    setCurrentImageIndex(currentImageIndex - 1);
                  }
                }}
                disabled={currentImageIndex <= 0}
                whileHover={currentImageIndex > 0 ? { scale: 1.1 } : {}}
                whileTap={currentImageIndex > 0 ? { scale: 0.9 } : {}}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  backgroundColor: currentImageIndex > 0 ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px'
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              {/* Right Arrow */}
              <motion.button
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all duration-300 z-50 ${
                  currentImageIndex < displayImages.length - 1 
                    ? 'bg-black/60 text-white hover:bg-black/80 active:scale-95' 
                    : 'bg-black/20 text-white/40 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (currentImageIndex < displayImages.length - 1) {
                    setCurrentImageIndex(currentImageIndex + 1);
                  }
                }}
                disabled={currentImageIndex >= displayImages.length - 1}
                whileHover={currentImageIndex < displayImages.length - 1 ? { scale: 1.1 } : {}}
                whileTap={currentImageIndex < displayImages.length - 1 ? { scale: 0.9 } : {}}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  backgroundColor: currentImageIndex < displayImages.length - 1 ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px'
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </>
          )}

          {/* 🔥 MEDIA NAVIGATION DOTS - TikTok Style */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-40">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    currentImageIndex === index 
                      ? 'bg-[#5825efff] scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}

          {/* 🔥 PRODUCT INFO OVERLAY - TikTok Style Bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-20 pb-6 px-4 z-30">
            {/* Product Name & Price */}
            <div className="mb-4">
              <h1 className="font-bold text-xl text-white mb-2 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-2">
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-2xl font-bold text-[#5825efff]">
                  ${product.price.toFixed(2)}
                </span>
                {discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-300">
                  {product.rating} ({Math.floor(Math.random() * 50) + 10} reviews)
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 mb-4">
              {/* Size Selection - Compact */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Size:</span>
                <div className="flex gap-1">
                  {product.sizes.slice(0, 3).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-2 py-1 text-xs rounded border transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-[#5825efff] bg-[#5825efff] text-white font-medium'
                          : 'border-white/40 text-white hover:border-[#5825efff]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  {product.sizes.length > 3 && (
                    <button
                      onClick={handleToggleProductDetails}
                      className="px-2 py-1 text-xs rounded border border-white/40 text-white hover:border-[#5825efff] transition-all duration-200"
                    >
                      +{product.sizes.length - 3}
                    </button>
                  )}
                </div>
              </div>

              {/* Color Selection - Compact */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Color:</span>
                <div className="flex gap-1">
                  {product.colors.slice(0, 3).map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-white/40 hover:border-white hover:scale-105'
                      }`}
                      style={{ 
                        background: color === 'Multi' ? 'linear-gradient(45deg, #5825efff, #6e29f6, #885cf8)' : getColorCode(color)
                      }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <button
                      onClick={handleToggleProductDetails}
                      className="w-6 h-6 rounded-full border-2 border-white/40 text-white text-xs flex items-center justify-center hover:border-white transition-all duration-200"
                      style={{ backgroundColor: 'transparent !important' }}
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* View Details Button */}
            <button
              onClick={handleToggleProductDetails}
              className="w-full py-3 px-4 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'transparent',
                borderRadius: isMobile ? '8px' : '9999px' // 8px on mobile, rounded-full on desktop
              }}
            >
              <Info className="h-4 w-4" />
              View Full Details
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 🔥 SLIDE-UP PRODUCT DETAILS PANEL - TikTok Style */}
        {showProductDetails && (
          <div 
            className="fixed inset-0 z-50 flex items-end"
            style={{ backgroundColor: 'transparent' }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0"
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
              }}
              onClick={handleToggleProductDetails}
            />
            
            {/* Details Panel */}
            <div 
              className="relative w-full border-t border-white/20 rounded-t-3xl overflow-y-auto"
              style={{ 
                backgroundColor: '#000000',
                height: '60vh',
                maxHeight: '60vh',
                minHeight: '60vh'
              }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1 bg-white/40 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Product Details</h2>
                <button
                  onClick={handleToggleProductDetails}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <ChevronDown className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-6">
                {/* Full Size Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Select Size</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-4 rounded-xl border transition-all duration-200 text-center ${
                          selectedSize === size
                            ? 'border-[#5825efff] bg-[#5825efff] text-white font-medium'
                            : 'border-white/40 text-white hover:border-[#5825efff]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full Color Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Select Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-12 h-12 rounded-full border-3 transition-all duration-200 ${
                          selectedColor === color
                            ? 'scale-110 shadow-lg border-white'
                            : 'border-white/40 hover:border-white hover:scale-105'
                        }`}
                        style={{ 
                          background: color === 'Multi' ? 'linear-gradient(45deg, #5825efff, #6e29f6, #885cf8)' : getColorCode(color)
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

                {/* 🔥 MOBILE PRODUCT MEDIA SECTION */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Product Media</h3>
                  
                  {/* Media Grid */}
                  <div 
                    className="grid grid-cols-3 gap-3 mb-4"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >
                    {productMediaItems.map((mediaItem, index) => (
                      <motion.div
                        key={mediaItem.id}
                        className="cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedMediaIndex(index);
                          setCurrentImageIndex(index);
                        }}
                      >
                        <div 
                          className={`aspect-square overflow-hidden transition-all duration-300 ${
                            selectedMediaIndex === index 
                              ? 'ring-2 ring-[#5825efff] shadow-lg' 
                              : 'ring-1 ring-white/20 hover:ring-[#5825efff]/60'
                          }`}
                          style={{ borderRadius: '8px' }}
                        >
                          {mediaItem.isYouTube ? (
                            <div 
                              className="w-full h-full flex flex-col items-center justify-center"
                              style={{ 
                                background: selectedMediaIndex === index 
                                  ? 'linear-gradient(135deg, #5825efff, #6e29f6)' 
                                  : 'linear-gradient(135deg, #4a5568, #2d3748)'
                              }}
                            >
                              <div 
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  selectedMediaIndex === index ? 'bg-white/90' : 'bg-white/70'
                                }`}
                              >
                                <Play 
                                  className={`w-3 h-3 ml-0.5 ${
                                    selectedMediaIndex === index ? 'text-[#5825efff]' : 'text-gray-600'
                                  }`} 
                                  fill="currentColor" 
                                />
                              </div>
                              <span 
                                className={`text-xs font-medium mt-1 ${
                                  selectedMediaIndex === index ? 'text-white' : 'text-gray-300'
                                }`}
                              >
                                Video
                              </span>
                            </div>
                          ) : (
                            <div className="relative w-full h-full">
                              <ImageWithFallback
                                src={mediaItem.src}
                                alt={mediaItem.label}
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Active Indicator */}
                              {selectedMediaIndex === index && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#5825efff] flex items-center justify-center"
                                >
                                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Label */}
                        <div className="mt-2 text-center">
                          <span 
                            className={`text-xs font-medium px-2 py-1 rounded transition-colors duration-200 ${
                              selectedMediaIndex === index 
                                ? 'bg-[#5825efff] text-white' 
                                : 'bg-white/20 text-white/80'
                            }`}
                            style={{ borderRadius: '8px' }}
                          >
                            {mediaItem.label}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Selected Media Info */}
                  <motion.div
                    className="p-3 bg-white/10 rounded-lg backdrop-blur-sm"
                    style={{ borderRadius: '8px' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        productMediaItems[selectedMediaIndex].isYouTube ? 'bg-[#5825efff]' : 'bg-green-400'
                      }`} />
                      <span className="text-white font-medium text-sm">
                        {productMediaItems[selectedMediaIndex].label}
                      </span>
                      <span className="text-white/60 text-xs">
                        {selectedMediaIndex + 1}/{productMediaItems.length}
                      </span>
                    </div>
                    <p className="text-white/80 text-xs leading-relaxed">
                      {productMediaItems[selectedMediaIndex].isYouTube 
                        ? `Watch our product video to see ${product.name} in action.`
                        : `Explore the ${productMediaItems[selectedMediaIndex].label.toLowerCase()} of ${product.name}.`
                      }
                    </p>
                  </motion.div>
                  
                  {/* Swipe Hint */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-3 text-center"
                  >
                    <span className="text-xs text-white/60">
                      Swipe left or right to explore ↔
                    </span>
                  </motion.div>
                </div>

                {/* Product Description */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {product.description || "High-quality African fashion piece that combines traditional patterns with modern styling. Perfect for special occasions or everyday elegance."}
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#5825efff] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">Authentic African print fabric with vibrant colors</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#5825efff] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">Premium quality construction and finishing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#5825efff] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">Comfortable fit with breathable fabric</span>
                    </li>
                  </ul>
                </div>

                {/* Add to Cart Button */}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      onAddToCart(product, selectedSize, selectedColor);
                      handleToggleProductDetails();
                    }}
                    disabled={!selectedSize || !selectedColor}
                    className="w-full py-4 px-6 bg-[#5825efff] hover:bg-[#6e29f6] disabled:bg-gray-600 text-white font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart - ${product.price.toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop version (original design preserved)
  return (
    <div className="min-h-screen bg-white">
      {/* 🔥 DESKTOP HEADER WITH BACK BUTTON */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="font-medium">Back</span>
          </button>
          
          <h1 className="font-bold text-lg text-gray-900 truncate max-w-[200px]">
            {product.name}
          </h1>
          
          <div className="w-16" /> {/* Spacer for center alignment */}
        </div>
      </div>

      {/* PRODUCT CONTENT - Same as ProductModal but adapted for page layout */}
      <div 
        ref={modalRef}
        className="w-full bg-white overflow-y-auto"
      >
        <div className="flex flex-col lg:flex-row min-h-full">
          {/* Media Section */}
          <div className="lg:w-3/5 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen lg:min-h-full">
            {/* Main Image Display - Now with scroll-triggered fixed positioning */}
            <div 
              ref={mainDisplayRef}
              className={`relative bg-white rounded-bl-2xl lg:rounded-bl-none lg:rounded-br-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                isScrolling ? 'fixed z-[999]' : 'h-[65vh] lg:h-[65vh] m-4 lg:ml-4 lg:mb-4'
              }`}
              style={
                isScrolling
                  ? {
                      position: 'fixed',
                      top: '0',
                      left: '0',
                      right: '0',
                      height: '65vh',
                      zIndex: 999,
                      margin: '0',
                      borderRadius: '0'
                    }
                  : {}
              }
            >
              {product.badge && (
                <Badge 
                  className={`absolute top-4 left-4 z-10 text-white shadow-lg ${
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

              {discountPercentage > 0 && (
                <Badge className="absolute top-4 right-4 z-10 bg-red-500 text-white shadow-lg">
                  -{discountPercentage}%
                </Badge>
              )}

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
              
              {/* 🔥 ENHANCED NAVIGATION ARROWS - Always visible for better UX */}
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 z-20"
                style={{
                  background: 'rgba(22, 24, 35, 0.7)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(22, 24, 35, 0.4)',
                  opacity: displayImages.length > 1 ? 1 : 0.3
                }}
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
                disabled={displayImages.length <= 1}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 z-20"
                style={{
                  background: 'rgba(22, 24, 35, 0.7)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(22, 24, 35, 0.4)',
                  opacity: displayImages.length > 1 ? 1 : 0.3
                }}
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)}
                disabled={displayImages.length <= 1}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* 🔥 IMAGE COUNTER INDICATOR */}
              {displayImages.length > 1 && (
                <div 
                  className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-white text-sm font-medium z-20"
                  style={{
                    background: 'rgba(22, 24, 35, 0.7)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 8px rgba(22, 24, 35, 0.3)'
                  }}
                >
                  {currentImageIndex + 1} / {displayImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {displayImages.length > 1 && (
              <div 
                className="px-4"
                style={{
                  marginTop: isScrolling ? 'calc(65vh + 32px)' : '0',
                  marginBottom: '16px',
                  paddingBottom: '16px'
                }}
              >
                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                    gap: '12px',
                    width: '100%'
                  }}
                >
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
                    
                    const maxThumbnails = Math.min(originalImages.length + 1, 5);
                    if (index >= maxThumbnails) return null;
                    
                    return (
                      <div key={index} className="flex flex-col">
                        <button
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative w-full aspect-square rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                            currentImageIndex === index 
                              ? 'border-orange-500 shadow-lg scale-105' 
                              : 'border-gray-200 hover:border-orange-300 hover:scale-102'
                          }`}
                          style={{ minHeight: '120px' }}
                        >
                          {isYouTubeVideo ? (
                            <div className="w-full h-full bg-gradient-to-br from-orange-200 to-red-200 flex flex-col items-center justify-center">
                              <div className="w-1/4 aspect-square bg-white/90 rounded-full flex items-center justify-center mb-2 shadow-lg min-w-[30px] max-w-[50px]">
                                <Play className="w-1/2 h-1/2 text-orange-600 ml-0.5" fill="currentColor" />
                              </div>
                              <span className="text-orange-800 font-semibold text-xs">Video</span>
                            </div>
                          ) : (
                            <ImageWithFallback
                              src={thumbnailImageSrc}
                              alt={altText}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </button>
                        
                        <div className="text-center mt-1">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            currentImageIndex === index 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {labelText}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div 
            ref={productInfoRef}
            className="lg:w-2/5 lg:overflow-y-auto lg:max-h-screen"
            style={{
              marginTop: isScrolling ? 'calc(65vh + 32px)' : '0',
              padding: '10px 24px 120px 24px' // Extra bottom padding for floating cart button
            }}
          >
            {/* Product Header */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-orange-600 mb-2 tracking-wide uppercase">
                {product.badge && `${product.badge} • `}Online Exclusive
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {product.rating} ({Math.floor(Math.random() * 50) + 10} REVIEWS)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-3xl font-bold text-red-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-semibold text-gray-900">Color:</span>
                <span className="text-gray-700 font-medium">{selectedColor}</span>
              </div>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-12 h-12 rounded-full border-3 transition-all duration-200 ${
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

            {/* 🔥 PRODUCT MEDIA SECTION - TikTok-Style Social Media Energy */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-heading text-lg font-bold text-gray-900">Product Media</span>
                <span className="text-sm text-gray-600 font-body">({productMediaItems.length} items)</span>
              </div>
              
              {/* Media Thumbnails Grid */}
              <div 
                ref={mediaContainerRef}
                className="grid grid-cols-5 gap-3 mb-4"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {productMediaItems.map((mediaItem, index) => (
                  <motion.div
                    key={mediaItem.id}
                    className="cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedMediaIndex(index);
                      setCurrentImageIndex(index);
                    }}
                  >
                    <div 
                      className={`aspect-square overflow-hidden transition-all duration-300 ${
                        selectedMediaIndex === index 
                          ? 'ring-2 ring-[#5825efff] shadow-lg' 
                          : 'ring-1 ring-gray-200 hover:ring-[#5825efff]/50'
                      }`}
                      style={{ borderRadius: '3px' }}
                    >
                      {mediaItem.isYouTube ? (
                        <div 
                          className="w-full h-full flex flex-col items-center justify-center relative"
                          style={{ 
                            background: selectedMediaIndex === index 
                              ? 'linear-gradient(135deg, #5825efff, #6e29f6)' 
                              : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)'
                          }}
                        >
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 shadow-lg ${
                              selectedMediaIndex === index ? 'bg-white/90' : 'bg-white/80'
                            }`}
                          >
                            <Play 
                              className={`w-4 h-4 ml-0.5 ${
                                selectedMediaIndex === index ? 'text-[#5825efff]' : 'text-gray-600'
                              }`} 
                              fill="currentColor" 
                            />
                          </div>
                          <span 
                            className={`text-xs font-medium ${
                              selectedMediaIndex === index ? 'text-white' : 'text-gray-700'
                            }`}
                          >
                            Video
                          </span>
                          
                          {/* Play Button Overlay */}
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '3px' }}
                          >
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                              <Play className="w-6 h-6 text-[#5825efff] ml-0.5" fill="currentColor" />
                            </div>
                          </motion.div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <ImageWithFallback
                            src={mediaItem.src}
                            alt={mediaItem.label}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          
                          {/* Selected Indicator */}
                          {selectedMediaIndex === index && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#5825efff] flex items-center justify-center shadow-lg"
                            >
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Media Label */}
                    <div className="text-center mt-2">
                      <span 
                        className={`text-xs font-medium px-2 py-1 rounded transition-colors duration-200 ${
                          selectedMediaIndex === index 
                            ? 'bg-[#5825efff] text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-[#5825efff]/10'
                        }`}
                        style={{ borderRadius: '3px' }}
                      >
                        {mediaItem.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Swipe Navigation Hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <span className="text-xs text-gray-500 font-body">
                  ← Swipe or click to explore different angles →
                </span>
              </motion.div>
              
              {/* Selected Media Display */}
              <motion.div
                className="mt-4 p-4 bg-gray-50 rounded-lg"
                style={{ borderRadius: '3px' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    productMediaItems[selectedMediaIndex].isYouTube ? 'bg-[#5825efff]' : 'bg-green-500'
                  }`} />
                  <span className="font-medium text-gray-900">
                    {productMediaItems[selectedMediaIndex].label}
                  </span>
                  <span className="text-sm text-gray-600">
                    {selectedMediaIndex + 1} of {productMediaItems.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-body">
                  {productMediaItems[selectedMediaIndex].isYouTube 
                    ? `Watch our product video to see ${product.name} in action with styling tips and details.`
                    : `View the ${productMediaItems[selectedMediaIndex].label.toLowerCase()} of ${product.name} to see every detail and craftsmanship.`
                  }
                </p>
              </motion.div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">Size:</span>
                <div className="flex gap-4 text-sm">
                  <button className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    Size Chart
                  </button>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-3 border-2 rounded-xl font-semibold transition-all duration-200 min-w-[50px] text-center ${
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
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-700">
                  {Math.floor(Math.random() * 1000) + 240}
                </div>
                <div className="text-sm text-orange-600 font-medium">Sales This Month</div>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-700">
                  ${Math.floor(Math.random() * 10000) + 5000}
                </div>
                <div className="text-sm text-orange-600 font-medium">Revenue Generated</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-6">
                {[
                  { id: 'details', label: 'Product Details', icon: Info },
                  { id: 'care', label: 'Material & Care', icon: Leaf }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 pb-3 border-b-2 transition-colors font-medium ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-600 hover:text-orange-500'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {activeTab === 'details' && (
                <div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {product.description || "High-quality African fashion piece that combines traditional patterns with modern styling. Perfect for special occasions or everyday elegance."}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Authentic African print fabric with vibrant colors</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Premium quality construction and finishing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Comfortable fit with breathable fabric</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'care' && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Care Instructions</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Machine wash cold with like colors</li>
                    <li>• Do not bleach</li>
                    <li>• Tumble dry low heat</li>
                    <li>• Iron on low temperature if needed</li>
                    <li>• Dry clean when necessary</li>
                  </ul>
                  
                  <h4 className="font-semibold text-gray-900 mb-3 mt-6">Material</h4>
                  <p className="text-gray-700">100% Premium Cotton with authentic African print</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🔥 FLOATING SCROLL NAVIGATION ARROW - Fixed position for page layout */}
        <button
          onClick={handleScrollToSection}
          className="fixed left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 z-30 lg:hidden"
          style={{
            background: 'rgba(22, 24, 35, 0.7)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 16px rgba(22, 24, 35, 0.4)',
            bottom: showUpArrow ? '180px' : '50%', // Position in center when down arrow, above cart when up arrow
            transform: 'translateX(-50%)',
            transition: 'bottom 0.3s ease, transform 0.3s ease',
          }}
          onTouchStart={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(0.95)';
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
          }}
        >
          {showUpArrow ? (
            <ChevronUp className="h-7 w-7" strokeWidth={2.5} />
          ) : (
            <ChevronDown className="h-7 w-7" strokeWidth={2.5} />
          )}
        </button>

        {/* 🔥 ENHANCED ADD TO CART BUTTON - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 lg:hidden">
          <div className="flex gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                isLiked
                  ? 'border-red-500 bg-red-500 text-white'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-red-300 hover:text-red-500'
              }`}
            >
              <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            
            <Button
              onClick={() => onAddToCart(product, selectedSize, selectedColor)}
              className="flex-1 h-14 btn-moema-primary text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              disabled={!selectedSize || !selectedColor}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              ADD TO CART - ${product.price.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}