import { useState, useEffect } from "react";
import { HeartIcon, EyeIcon, CartIcon, StarIcon, BootstrapIcon } from "./BootstrapIcon";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductCommunityButton } from "./chat/ProductCommunityButton";
import { FloatingIncentiveBadge } from "./FloatingIncentiveBadge";
import { Play } from "lucide-react";
import "../styles/product-card-hover-video.css";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  sizes: string[];
  colors: string[];
  badge?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: boolean;
  className?: string;
  onNavigateToStoreLocator?: (product: Product) => void;
  onNavigateToSizeGuide?: () => void;
  onNavigateToReviews?: (product: Product) => void;
  isMobile?: boolean;
  style?: React.CSSProperties;
  currentUser?: any;
  onFavoriteProduct?: (productId: number) => void;
  onPurchaseProduct?: (productId: number) => void;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onQuickView, 
  onToggleFavorite, 
  isFavorite, 
  className = "", 
  onNavigateToStoreLocator,
  onNavigateToSizeGuide,
  onNavigateToReviews,
  isMobile = false,
  style,
  currentUser,
  onFavoriteProduct,
  onPurchaseProduct
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [hasVideoAvailable, setHasVideoAvailable] = useState(false);

  // YouTube video IDs from the gallery
  const youtubeVideoIds = [
    'JLnjExtdyAs', '1YseVzwa0Rw', 'WJjx47FUgfs', 'F08tHtD_qfc',
    'thoWb5Fs3fw', 'h3kx0BxnPA0', 'QZP9nDVFF00', 'r7J7LJ1zhIk',
    'KHXwwiG7lug', 'MmRXT5ik4cE', 'JJbgGuf9nq8', 'HIC9LRab0zo',
    'o96D5B_KUvQ'
  ];

  // Extract YouTube video ID from product images array (first item if it's a YouTube link)
  const extractYouTubeVideoId = () => {
    if (!product.images || product.images.length === 0) return null;
    
    const videoUrl = product.images[0];
    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) return null;
    
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\??v?=?([^#&?]*).*/;
    const match = videoUrl.match(regExp);
    return (match && match[8].length === 11) ? match[8] : null;
  };

  // Map product to YouTube video ID
  const getYouTubeVideoId = (productId: number) => {
    // First try to get video from product images
    const extractedId = extractYouTubeVideoId();
    if (extractedId) return extractedId;
    
    // Fallback to predefined videos
    const index = (productId - 1) % youtubeVideoIds.length;
    return youtubeVideoIds[index];
  };

  // Generate YouTube embed URL for hover video
  const getHoverVideoEmbedUrl = (productId: number) => {
    const videoId = getYouTubeVideoId(productId);
    // Enable autoplay with muted audio, no controls for clean hover effect
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
  };

  // Generate YouTube embed URL for mobile (with controls)
  const getYouTubeEmbedUrl = (productId: number) => {
    const videoId = getYouTubeVideoId(productId);
    // Enable autoplay with muted audio for better mobile compatibility
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
  };

  // Check if product has video available
  useEffect(() => {
    const videoId = getYouTubeVideoId(product.id);
    setHasVideoAvailable(!!videoId && !videoError);
  }, [product.id, videoError]);

  // Handle hover with delay for video transition
  useEffect(() => {
    let hoverTimeout: NodeJS.Timeout;
    
    if (isHovered && !isMobile && hasVideoAvailable) {
      // Delay video appearance by 300ms to create smooth anticipation
      hoverTimeout = setTimeout(() => {
        setShowVideo(true);
      }, 300);
    } else {
      setShowVideo(false);
      setVideoLoaded(false); // Reset video loaded state when not showing
    }
    
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [isHovered, isMobile, hasVideoAvailable]);

  // Debug logging for development
  useEffect(() => {
    if (isMobile) {
      const videoId = getYouTubeVideoId(product.id);
      console.log(`Product ${product.id} (${product.name}) mapped to YouTube video: ${videoId}`);
    }
  }, [product.id, product.name, isMobile]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} size={16} color="#fbbf24" />);
    }

    if (hasHalfStar) {
      stars.push(<BootstrapIcon key="half" name="star-half" size={16} color="#fbbf24" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} size={16} color="#d1d5db" />);
    }

    return stars;
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className={`group relative bg-white transition-all duration-300 overflow-hidden ${className} ${
        showVideo && !isMobile ? 'product-card-video-active' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...style,
        // 🎯 DESKTOP/TABLET: Apply standardized shadow and border radius with enhanced glow for video
        borderRadius: '3px',
        boxShadow: showVideo && !isMobile
          ? '0 8px 32px rgba(88, 37, 239, 0.2), 0 0 0 1px rgba(88, 37, 239, 0.15), 0 0 40px rgba(88, 37, 239, 0.1)'
          : isHovered 
          ? (window.innerWidth >= 768 
              ? 'var(--shadow-standard-desktop)'
              : '0 12px 48px rgba(88, 37, 239, 0.15), 0 0 0 1px rgba(88, 37, 239, 0.1)')
          : (window.innerWidth >= 768 
              ? 'var(--shadow-standard-desktop)'
              : '0 4px 10px rgba(0, 0, 0, 0.1)'),
        border: window.innerWidth >= 768 ? 'var(--border-standard-desktop)' : '1px solid rgba(88, 37, 239, 0.08)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
      }}
    >
      {/* Product Badge */}
      {product.badge && (
        <Badge 
          className={`absolute top-3 left-3 z-10 ${
            product.badge === 'New' ? 'bg-green-500' :
            product.badge === 'Sale' ? 'bg-red-500' :
            product.badge === 'Popular' ? 'bg-blue-500' :
            'bg-blue-500'
          } text-white`}
          style={{
            borderRadius: '3px'
          }}
        >
          {product.badge}
        </Badge>
      )}

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <Badge 
          className="absolute top-3 right-3 z-10 bg-red-500 text-white"
          style={{
            borderRadius: '3px'
          }}
        >
          -{discountPercentage}%
        </Badge>
      )}

      {/* Product Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden group/image" style={{ borderRadius: '3px' }}>
        {/* Floating Incentive Badge - Desktop/Tablet Only */}
        {!isMobile && (
          <FloatingIncentiveBadge productId={product.id} />
        )}
        
        {isMobile ? (
          // Mobile: Show YouTube video embed
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
                  className={`w-full h-full transition-transform duration-500 ${
                    isHovered ? 'scale-110' : 'scale-100'
                  } ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    borderRadius: '3px',
                    objectFit: 'cover'
                  }}
                  onLoad={() => setVideoLoaded(true)}
                  onError={() => setVideoError(true)}
                />
                {/* Loading placeholder */}
                {!videoLoaded && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${product.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '3px'
                    }}
                  />
                )}
              </>
            ) : (
              // Fallback to product image if video fails
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
                style={{
                  borderRadius: '3px'
                }}
              />
            )}
          </div>
        ) : (
          // Desktop/Tablet: Show image, transition to video on hover
          <div className="relative w-full h-full">
            {/* Product Image - Always visible, fades out when video appears */}
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                showVideo ? 'scale-110 opacity-0' : isHovered ? 'scale-105' : 'scale-100'
              }`}
              style={{
                filter: 'none',
                transformOrigin: 'center center',
                borderRadius: '3px',
                position: 'absolute',
                inset: 0
              }}
            />
            
            {/* Video available indicator - subtle play button when not hovered */}
            {!isHovered && hasVideoAvailable && (
              <div 
                className="absolute top-2 left-2 z-15 flex items-center justify-center"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '3px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Play className="h-4 w-4 text-white fill-white" style={{ opacity: 0.9 }} />
              </div>
            )}
            
            {/* "Hover for Video" hint - Shows briefly on initial hover */}
            {isHovered && !showVideo && hasVideoAvailable && (
              <div 
                className="absolute top-2 left-2 z-20 flex items-center gap-1.5 px-2.5 py-1.5"
                style={{
                  background: 'rgba(88, 37, 239, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '3px',
                  boxShadow: '0 2px 8px rgba(88, 37, 239, 0.3)',
                  animation: 'fadeIn 0.3s ease-out forwards'
                }}
              >
                <Play className="h-3 w-3 text-white fill-white play-pulse" />
                <span className="text-white font-heading text-xs" style={{ fontWeight: 500 }}>
                  Loading video...
                </span>
              </div>
            )}
            
            {/* Video - Appears on hover with fade-in effect */}
            {showVideo && (
              <div 
                className="absolute inset-0 w-full h-full product-card-video-optimized"
                style={{
                  animation: 'fadeInScale 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) forwards',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  zIndex: 10
                }}
              >
                {/* Subtle gradient overlay for depth */}
                <div 
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)',
                    borderRadius: '3px'
                  }}
                />
                
                {/* Video iframe */}
                <iframe
                  width="100%"
                  height="100%"
                  src={getHoverVideoEmbedUrl(product.id)}
                  title={`${product.name} Video Preview`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  style={{
                    borderRadius: '3px',
                    objectFit: 'cover',
                    pointerEvents: 'none' // Prevents iframe from capturing mouse events
                  }}
                  onLoad={() => setVideoLoaded(true)}
                  onError={() => setVideoError(true)}
                />
                
                {/* Video indicator badge with play icon */}
                <div 
                  className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 px-2.5 py-1.5 video-badge-slide"
                  style={{
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '3px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    animation: 'slideInFromBottom 0.4s ease-out 0.3s forwards',
                    opacity: 0
                  }}
                >
                  <div className="play-pulse">
                    <Play className="h-3 w-3 text-white fill-white" />
                  </div>
                  <span className="text-white font-heading text-xs" style={{ fontWeight: 500 }}>
                    Video Preview
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Overlay Actions - Always visible on hover, positioned above video/image with higher z-index */}
      <div 
        className={`product-card-actions-overlay absolute top-0 left-0 right-0 aspect-[3/4] flex items-center justify-center gap-2 transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} 
        style={{ 
          borderRadius: '3px', 
          zIndex: 50,
          background: isMobile 
            ? 'rgba(0, 0, 0, 0.4)' 
            : isHovered 
              ? 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0) 100%)'
              : 'transparent'
        }}
      >
        <button
          className="btn-moema-icon btn-moema-secondary pointer-events-auto"
          style={{
            backgroundColor: 'var(--pure-white)',
            color: isFavorite ? 'var(--error-red)' : 'var(--medium-gray)',
            border: 'none',
            borderRadius: '3px',
            boxShadow: window.innerWidth >= 768 ? 'var(--shadow-standard-desktop)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
            transform: isHovered ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(10px)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          onClick={() => onToggleFavorite(product)}
          title="Add to Favorites"
        >
          <HeartIcon size={16} />
        </button>
        
        <button
          className="btn-moema-icon btn-moema-secondary pointer-events-auto"
          style={{
            backgroundColor: 'var(--pure-white)',
            color: 'var(--medium-gray)',
            border: 'none',
            borderRadius: '3px',
            boxShadow: window.innerWidth >= 768 ? 'var(--shadow-standard-desktop)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
            transform: isHovered ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(10px)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transitionDelay: isHovered ? '0.05s' : '0s'
          }}
          onClick={() => onQuickView(product)}
          title="Quick View"
        >
          <EyeIcon size={16} />
        </button>
        
        <button
          className="btn-moema-icon btn-moema-gradient-orange pointer-events-auto"
          onClick={() => onAddToCart(product, selectedSize, selectedColor)}
          title="Add to Cart"
          style={{
            borderRadius: '3px',
            transform: isHovered ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(10px)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transitionDelay: isHovered ? '0.1s' : '0s'
          }}
        >
          <CartIcon size={16} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="text-sm font-medium mb-1" style={{ color: 'var(--primary-blue)' }}>{product.category}</div>
        
        <h3 className="font-semibold mb-2 line-clamp-2 transition-colors" style={{ 
          color: isHovered ? 'var(--primary-blue)' : '#111827' 
        }}>
          {product.name}
        </h3>
        
        {/* Rating with Review Button */}
        <div className="flex items-center gap-1 mb-3">
          {renderStars(product.rating)}
          <span className="text-sm text-gray-500 ml-1">({product.rating})</span>
          
          {/* Review Navigation Button */}
          {onNavigateToReviews && (
            <button
              onClick={() => onNavigateToReviews(product)}
              className="btn-moema-icon-sm"
              style={{
                backgroundColor: 'var(--pure-white)',
                color: 'var(--primary-blue)',
                border: '0.5px solid var(--primary-blue)',
                borderRadius: '3px',
                boxShadow: window.innerWidth >= 768 ? 'var(--shadow-standard-desktop)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                width: '20px',
                height: '20px',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                marginLeft: '2px'
              }}
              title="View Reviews"
            >
              <BootstrapIcon name="chat-square-text" size={12} />
            </button>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Size Selection with Size Guide Button */}
        <div className="mb-3">
          <div className="text-sm font-medium text-gray-700 mb-2">Size:</div>
          <div className="flex gap-1 flex-wrap items-center">
            {/* Size Buttons */}
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2 py-1 text-xs border transition-colors ${
                  selectedSize === size
                    ? 'text-white' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{
                  borderRadius: '3px',
                  borderColor: selectedSize === size ? 'var(--primary-blue)' : undefined,
                  backgroundColor: selectedSize === size ? 'var(--primary-blue)' : undefined
                }}
              >
                {size}
              </button>
            ))}
            
            {/* Size Guide Icon Button */}
            {onNavigateToSizeGuide && (
              <button
                onClick={onNavigateToSizeGuide}
                className="btn-moema-icon-sm ml-2"
                style={{
                  backgroundColor: 'var(--pure-white)',
                  color: 'var(--primary-blue)',
                  border: '0.5px solid var(--primary-blue)',
                  borderRadius: '3px',
                  boxShadow: window.innerWidth >= 768 ? 'var(--shadow-standard-desktop)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                  width: '24px',
                  height: '24px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                title="Size Guide"
              >
                <BootstrapIcon name="rulers" size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Color:</div>
          <div className="flex gap-1">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? 'scale-110'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ 
                  backgroundColor: color.toLowerCase(),
                  borderColor: selectedColor === color ? 'var(--success-light-green)' : '#d1d5db',
                  borderRadius: '3px'
                }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          className="btn-moema-gradient-orange btn-moema-rounded-lg w-full mb-3"
          style={{ 
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            height: '50px'
          }}
          onClick={() => onAddToCart(product, selectedSize, selectedColor)}
        >
          <CartIcon size={16} />
          Add to Cart
        </button>

        {/* Product Community Button */}
        <ProductCommunityButton
          product={product}
          currentUser={currentUser}
          isMobile={isMobile}
          onFavoriteProduct={onFavoriteProduct}
          onPurchaseProduct={onPurchaseProduct}
          isFavorite={isFavorite}
          className="w-full"
        />
      </div>
    </div>
  );
}