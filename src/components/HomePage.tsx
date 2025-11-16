import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Eye, Share2, MessageCircle, Bookmark, MoreHorizontal, Ruler, Play, Star, Sparkles, Clock, Gift, Zap } from "lucide-react";
import { BootstrapIcon } from "./BootstrapIcon";
import { ChatIcon } from "./BootstrapIcon";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { ProductCard } from "./ProductCard";
import { Product } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Import the unified shop pages CSS for consistency
import "../styles/shop-pages.css";
// Import incentive cards animation CSS
import "../styles/incentive-cards-animation.css";
// Import independent panel scrolling CSS
import "../styles/independent-panel-scrolling.css";

// Import extracted constants and helpers
import { createFloatingCategories, createCategoryData, BRAND_DATA } from "../constants/homePageConstants";
import { 
  getColorCode, 
  getYouTubeEmbedUrl, 
  renderStars, 
  getHotProducts, 
  getTrendingProducts, 
  getLayoutClasses, 
  getProductGridCols, 
  getCategoryIconSize,
  getProductLiveStream,
  isProductInLiveStream,
  getProductStreamData
} from "../utils/homePageHelpers";

// Import mobile components
import { MobileSearchOverlay } from "./mobile/MobileSearchOverlay";
import { FloatingCategories } from "./mobile/FloatingCategories";
import { MobileHomeProductView } from "./mobile/MobileHomeProductView";
import { MobileIncentiveBalloonStandalone } from "./mobile/MobileIncentiveBalloonStandalone";
import { FloatingProductCommunityButton } from "./mobile/FloatingProductCommunityButton";

// Import mobile touch navigation hook
import { useMobileTouchNavigation } from "../hooks/useMobileTouchNavigation";

// Import live streaming components and data
import { LiveStreamGrid } from "./streaming/LiveStreamGrid";
import { MOCK_STREAMS, LIVE_STREAMS } from "../constants/streamingData";
import { QuickWatchStreamButton } from "./streaming/QuickWatchStreamButton";

// Import sharing components
import { FloatingShareButton } from "./sharing/FloatingShareButton";

// 🔥 MOBILE FLOATING CHAT BUTTON - Adapted from FloatingChatButton for mobile layout
interface MobileFloatingChatButtonProps {
  onClick: () => void;
}

function MobileFloatingChatButton({ onClick }: MobileFloatingChatButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 relative"
      style={{
        background: 'linear-gradient(135deg, #5825efff, #5825efff)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(88, 37, 239, 0.4)'
      }}
      whileHover={{ 
        scale: 1.1,
        rotate: 5
      }}
      whileTap={{ 
        scale: 0.9,
        rotate: -5
      }}
      animate={{
        y: [0, -4, 0],
        boxShadow: [
          '0 4px 12px rgba(88, 37, 239, 0.4)',
          '0 8px 20px rgba(88, 37, 239, 0.6)',
          '0 4px 12px rgba(88, 37, 239, 0.4)'
        ]
      }}
      transition={{
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        },
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      title="Live Chat Support"
    >
      {/* Bootstrap Chat Icon */}
      <ChatIcon
        size={20}
        color="white"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
        }}
      />

      {/* Notification Pulse */}
      <motion.div
        className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #5825efff, #5825efff)',
          border: '1px solid white'
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.7, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(88, 37, 239, 0.4), rgba(88, 37, 239, 0.4))',
          filter: 'blur(6px)',
          zIndex: -1
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
}

interface HomePageProps {
  filteredProducts: Product[];
  allFilteredProducts: Product[];
  filterCategory: string;
  searchQuery: string;
  sortBy?: string;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  onNavigateToStoreLocator: (product: Product) => void;
  onNavigateToShare: (product: Product) => void;
  onNavigateToPage: (page: string) => void;
  setFilterCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy?: (sort: string) => void;
  isFloatingIconsVisible?: boolean;
  isMobileSearchOpen?: boolean;
  onToggleMobileSearch?: () => void;
  onCloseMobileSearch?: () => void;
  onNavigateToReviews?: (product: Product) => void;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  // Admin props
  currentUser?: any;
  onSignOut?: () => void;
  // 🔥 Chat handler prop
  onChatOpen?: () => void;
  // 🔥 Live stream navigation prop
  onNavigateToLiveStream?: (streamId: string) => void;
  // 🎉 Incentive action prop
  onIncentiveAction?: (offerId: string, product: Product) => void;
  // 🎯 Current product change callback
  onCurrentProductChange?: (product: Product | null) => void;
}

export function HomePage({
  filteredProducts,
  allFilteredProducts,
  filterCategory,
  searchQuery,
  sortBy = 'featured',
  onAddToCart,
  onQuickView,
  onToggleFavorite,
  isFavorite,
  onNavigateToStoreLocator,
  onNavigateToShare,
  onNavigateToPage,
  setFilterCategory,
  setSearchQuery,
  setSortBy = () => {},
  isFloatingIconsVisible = false,
  isMobileSearchOpen = false,
  onToggleMobileSearch = () => {},
  onCloseMobileSearch = () => {},
  onNavigateToReviews = () => {},
  currentPage,
  totalPages,
  totalProducts,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  currentUser,
  onSignOut = () => {},
  onChatOpen = () => {}, // 🔥 Chat handler with default
  onNavigateToLiveStream = () => {}, // 🔥 Live stream navigation with default
  onIncentiveAction = () => {}, // 🎉 Incentive action with default
  onCurrentProductChange = () => {} // 🎯 Current product change with default
}: HomePageProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showProductInfo, setShowProductInfo] = useState(true);
  const [activeTrendingTab, setActiveTrendingTab] = useState<'hot' | 'trending'>('hot');
  const [activeLeftTab, setActiveLeftTab] = useState<'categories' | 'brands' | 'collections'>('categories');
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1200);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (allFilteredProducts.length > 0 && currentProductIndex >= allFilteredProducts.length) {
      setCurrentProductIndex(0);
    }
  }, [allFilteredProducts.length, currentProductIndex]);

  const currentProduct = allFilteredProducts[currentProductIndex];
  
  useEffect(() => {
    if (currentProduct) {
      setSelectedSize(currentProduct.sizes?.[0] || '');
      setSelectedColor(currentProduct.colors?.[0] || '');
    }
    // Notify parent component about current product change
    onCurrentProductChange(currentProduct || null);
  }, [currentProduct?.id, onCurrentProductChange]);

  // Use mobile touch navigation hook
  const { containerRef } = useMobileTouchNavigation({
    isMobile,
    currentProductIndex,
    totalProducts: allFilteredProducts.length,
    onNavigate: (direction) => {
      setIsScrolling(true);
      if (direction === 'down' && currentProductIndex < allFilteredProducts.length - 1) {
        setCurrentProductIndex(prev => prev + 1);
      } else if (direction === 'up' && currentProductIndex > 0) {
        setCurrentProductIndex(prev => prev - 1);
      }
      setTimeout(() => setIsScrolling(false), 800);
    }
  });

  // Create dynamic data using helpers
  const floatingCategories = createFloatingCategories(onToggleMobileSearch, setFilterCategory)
    .filter(category => category.id !== 'share'); // Remove any share button to avoid duplication
  const categoryData = createCategoryData(allFilteredProducts);

  const handleMobileSearchSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    onCloseMobileSearch();
  };

  const handleNavigateToSizeGuide = () => {
    onNavigateToPage('size-guide');
  };

  const handleQuickViewClick = () => {
    if (currentProduct) {
      onQuickView(currentProduct);
    }
  };

  const handleNavigateToReviewsClick = () => {
    if (currentProduct) {
      onNavigateToReviews(currentProduct);
    }
  };

  // 🔥 Product Community handlers - wrapper functions to match signature
  const handleFavoriteProduct = (productId: number) => {
    const product = allFilteredProducts.find(p => p.id === productId);
    if (product) {
      onToggleFavorite(product);
    }
  };

  const handlePurchaseProduct = (productId: number) => {
    const product = allFilteredProducts.find(p => p.id === productId);
    if (product) {
      // Add to cart with default size and color
      const size = product.sizes?.[0] || '';
      const color = product.colors?.[0] || '';
      onAddToCart(product, size, color);
    }
  };

  // 🎉 Handle incentive balloon actions for mobile
  const handleIncentiveBalloonAction = (offerId: string) => {
    console.log('🎯 Mobile incentive balloon action:', offerId);
    if (currentProduct) {
      onAddToCart(currentProduct, selectedSize, selectedColor);
    }
  };

  // 🔥 MODERN RADIO BUTTON COMPONENTS FOR MOBILE
  const MobileSizeSelector = () => {
    if (!currentProduct?.sizes || currentProduct.sizes.length === 0) return null;

    return (
      <div className="mb-4">
        <label className="block text-xs mb-3 font-body opacity-75 text-white">Choose Size</label>
        <div className="flex flex-wrap gap-2">
          {currentProduct.sizes.map((size) => (
            <motion.label
              key={size}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer"
            >
              <input
                type="radio"
                name="size"
                value={size}
                checked={selectedSize === size}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="sr-only"
              />
              <motion.div
                className={`
                  px-4 py-2 rounded-lg border-2 transition-all duration-300 backdrop-blur-md
                  ${selectedSize === size
                    ? 'bg-white/30 border-white/80 shadow-lg shadow-white/20'
                    : 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50'
                  }
                `}
                animate={selectedSize === size ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(255, 255, 255, 0.7)',
                    '0 0 0 8px rgba(255, 255, 255, 0)',
                    '0 0 0 0 rgba(255, 255, 255, 0)'
                  ]
                } : {}}
                transition={{ duration: 0.3 }}
              >
                <span className={`
                  text-sm font-medium transition-colors duration-300
                  ${selectedSize === size ? 'text-white' : 'text-white/80'}
                `}>
                  {size}
                </span>
                {selectedSize === size && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </motion.div>
                )}
              </motion.div>
            </motion.label>
          ))}
        </div>
      </div>
    );
  };

  const MobileColorSelector = () => {
    if (!currentProduct?.colors || currentProduct.colors.length === 0) return null;

    return (
      <div className="mb-4">
        <label className="block text-xs mb-3 font-body opacity-75 text-white">Choose Color</label>
        <div className="flex flex-wrap gap-3">
          {currentProduct.colors.map((color) => (
            <motion.label
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative cursor-pointer"
            >
              <input
                type="radio"
                name="color"
                value={color}
                checked={selectedColor === color}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="sr-only"
              />
              <motion.div
                className={`
                  relative w-12 h-12 border-3 transition-all duration-300
                  ${selectedColor === color
                    ? 'border-white shadow-lg shadow-white/40 scale-110'
                    : 'border-white/40 hover:border-white/70 hover:scale-105'
                  }
                `}
                style={{ 
                  backgroundColor: getColorCode(color),
                  borderRadius: '50%'
                }}
                animate={selectedColor === color ? {
                  rotate: [0, 360],
                  scale: [1.1, 1.2, 1.1],
                  borderRadius: '50%'
                } : {}}
                transition={{ duration: 0.5 }}
              >
                {selectedColor === color && (
                  <>
                    {/* Pulsing ring animation */}
                    <motion.div
                      className="absolute inset-0 border-2 border-white"
                      style={{ borderRadius: '50%' }}
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [1, 0, 1],
                        borderRadius: '50%'
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    {/* Check mark */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3, type: "spring" }}
                    >
                      <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <BootstrapIcon name="check" size={12} color="var(--success-green)" />
                      </div>
                    </motion.div>
                  </>
                )}
              </motion.div>
              {/* Color name tooltip */}
              <motion.div
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white/80 whitespace-nowrap"
                initial={{ opacity: 0, y: 5 }}
                animate={{ 
                  opacity: selectedColor === color ? 1 : 0,
                  y: selectedColor === color ? 0 : 5
                }}
                transition={{ duration: 0.2 }}
              >
                {color}
              </motion.div>
            </motion.label>
          ))}
        </div>
      </div>
    );
  };

  // Trending panel component that can be reused - wrapped with container
  const TrendingPanel = () => (
    <div className="shop-trending-container" style={{ marginTop: '0px', paddingTop: '0px' }}>


      <div className="shop-panel-card shop-trending-card smooth-animated" style={{ marginTop: '0px', paddingTop: '0px' }}>
      <div className="shop-trending-header">
        <BootstrapIcon name="trending_up" size={16} color="var(--primary-blue)" />
        <span className="shop-trending-title">Trending</span>
      </div>

      <div className={`trending-tabs-container ${activeTrendingTab === 'trending' ? 'trending-active' : ''}`}>
        {[
          { key: 'hot', label: 'Hot', icon: 'fire' },
          { key: 'trending', label: 'Trending', icon: 'trending_up' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              // 🎯 SWITCH ANIMATION LOGIC - Updated for new CSS classes
              const newTab = tab.key as 'hot' | 'trending';
              if (activeTrendingTab !== newTab) {
                const container = document.querySelector('.trending-tabs-container');
                
                // Add animation class for smooth transition
                if (container) {
                  if (newTab === 'trending') {
                    container.classList.add('animate-to-trending');
                    container.classList.remove('animate-to-hot');
                  } else {
                    container.classList.add('animate-to-hot');
                    container.classList.remove('animate-to-trending');
                  }
                }
                
                // Set new active tab
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
        {(activeTrendingTab === 'hot' ? getHotProducts(allFilteredProducts) : getTrendingProducts(allFilteredProducts)).map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2, ease: [0.25, 0.8, 0.25, 1] }}
            className="shop-trending-product-card shop-interactive smooth-animated"
            onClick={() => onQuickView(product)}
            style={{
              // 🎯 DESKTOP/TABLET: Apply standardized shadow and border radius like ProductCard
              borderRadius: '3px',
              boxShadow: window.innerWidth >= 768 
                ? 'var(--shadow-standard-desktop)'
                : '0 4px 10px rgba(0, 0, 0, 0.1)',
              border: window.innerWidth >= 768 ? 'var(--border-standard-desktop)' : '1px solid rgba(223, 102, 13, 0.08)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth >= 768) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-standard-desktop)';
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth >= 768) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-standard-desktop)';
              }
            }}
          >
            <div 
              className="shop-trending-product-image-container"
              style={{
                borderRadius: '3px'
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="shop-trending-product-image"
                style={{
                  borderRadius: '3px'
                }}
              />
              {product.badge && (
                <div 
                  className={`shop-trending-product-badge ${product.badge === 'Sale' ? 'sale' : 'default'}`}
                  style={{
                    borderRadius: '3px'
                  }}
                >
                  {product.badge}
                </div>
              )}
            </div>
            <div className="shop-trending-product-info">
              <h4 className="shop-trending-product-name">{product.name}</h4>
              <div className="shop-trending-product-rating">{renderStars(product.rating)}</div>
              <div className="shop-trending-product-price">
                <span className="shop-trending-product-current-price">${product.price}</span>
                {product.originalPrice && (
                  <span className="shop-trending-product-original-price">${product.originalPrice}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    </div>
  );

  // Pagination component
  const renderPagination = () => {
    if (isMobile || totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

    return (
      <div className="shop-pagination-container">
        <div className="shop-pagination-content">
          <div className="shop-pagination-info">
            <div className="shop-pagination-results">
              Showing {startItem}-{endItem} of {totalProducts} products
            </div>
            
            <div className="shop-pagination-per-page">
              <span className="shop-pagination-per-page-label">Show:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(parseInt(value))}>
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
              <span className="shop-pagination-per-page-label">per page</span>
            </div>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
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
                      onClick={() => onPageChange(pageNumber)}
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
                  onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
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

  const layoutClasses = getLayoutClasses(isMobile, isTablet);

  // Search & Filter Panel Component with wrapper container
  const SearchFilterPanel = () => (
    <div className="shop-search-filter-container">
      <div className="shop-panel-card shop-search-filter-card smooth-animated">
        <div className="shop-search-header">
          <BootstrapIcon name="funnel" size={16} color="var(--primary-blue)" />
          <span>Search & Filter</span>
        </div>

        <div className="shop-search-input-container">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="shop-search-input"
            style={{
              fontFamily: 'var(--font-body)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--input-background)',
              border: '0.5px solid var(--border)'
            }}
          />
          <BootstrapIcon name="search" size={16} className="shop-search-icon" />
        </div>

        <div className="shop-featured-tab">
          <div className="shop-featured-tab-container">
            {['categories', 'brands', 'collections'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveLeftTab(tab as any)}
                className={`shop-featured-tab-button ${activeLeftTab === tab ? 'active' : ''}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="shop-category-list">
          {activeLeftTab === 'categories' ? (
            categoryData.map((category) => (
              <motion.button
                key={category.name}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2, ease: [0.25, 0.8, 0.25, 1] }}
                onClick={() => setFilterCategory(category.name.toLowerCase())}
                className={`shop-category-item ${filterCategory === category.name.toLowerCase() ? 'active' : ''}`}
              >
                <div className="shop-category-icon">{category.icon}</div>
                <div className="shop-category-info">
                  <div className="shop-category-name">{category.name}</div>
                  <div className="shop-category-count">({category.count})</div>
                </div>
              </motion.button>
            ))
          ) : activeLeftTab === 'brands' ? (
            BRAND_DATA.map((brand) => (
              <motion.button
                key={brand.name}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2, ease: [0.25, 0.8, 0.25, 1] }}
                onClick={() => setFilterCategory(brand.name.toLowerCase())}
                className={`shop-category-item ${filterCategory === brand.name.toLowerCase() ? 'active' : ''}`}
              >
                <div className="shop-category-icon">{brand.icon}</div>
                <div className="shop-category-info">
                  <div className="shop-category-name">{brand.name}</div>
                  <div className="shop-category-count">({brand.count})</div>
                </div>
              </motion.button>
            ))
          ) : (
            ['Summer Collection', 'Winter Collection', 'Traditional Wear'].map((collection) => (
              <motion.button
                key={collection}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2, ease: [0.25, 0.8, 0.25, 1] }}
                onClick={() => setFilterCategory(collection.toLowerCase())}
                className={`shop-category-item ${filterCategory === collection.toLowerCase() ? 'active' : ''}`}
              >
                <div className="shop-category-icon">🌟</div>
                <div className="shop-category-info">
                  <div className="shop-category-name">{collection}</div>
                  <div className="shop-category-count">(12)</div>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>
    </div>
  );

  // Mobile layout
  if (isMobile && allFilteredProducts.length > 0) {
    return (
      <div className="relative">
        <AnimatePresence>
          <MobileSearchOverlay
            isOpen={isMobileSearchOpen}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClose={onCloseMobileSearch}
            onSubmit={handleMobileSearchSubmit}
          />
        </AnimatePresence>

        <AnimatePresence>
          <FloatingCategories
            isVisible={isFloatingIconsVisible}
            categories={floatingCategories}
            filterCategory={filterCategory}
            isMobileSearchOpen={isMobileSearchOpen}
          />
        </AnimatePresence>

        <div 
          ref={containerRef}
          className="fixed inset-0 overflow-hidden"
          style={{ 
            height: '100vh',
            zIndex: 1,
            background: '#000000'
          }}
        >
          {currentProduct && (
            <motion.div
              key={`${currentProduct.id}-${currentProductIndex}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              <div className="absolute inset-0" style={{ overflow: 'hidden', zIndex: 1 }}>
                <iframe
                  key={`video-${currentProduct.id}-${currentProductIndex}`}
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(currentProduct.id, currentProduct)}
                  title={`${currentProduct.name} Video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: '-800px',
                    left: '-200px',
                    width: '200%',
                    height: '200%',
                    border: 'none',
                    objectFit: 'cover',
                    zIndex: 1
                  }}
                />
                
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"
                  style={{ zIndex: 2, pointerEvents: 'none' }}
                />
              </div>

              {/* 🔥 MOBILE INTERACTION BUTTONS - INCLUDING REVIEW BUTTON */}
              <div 
                className="absolute right-4 bottom-[193px] flex flex-col gap-4"
                style={{ zIndex: 9999 }}
              >
                <motion.div 
                  className="flex flex-col items-center"
                  whileTap={{ scale: 0.8 }}
                >
                  <button
                    onClick={() => onToggleFavorite(currentProduct)}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300"
                    style={{
                      backgroundColor: isFavorite(currentProduct.id) ? '#ff4757' : 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <Heart 
                      className={`h-6 w-6 ${isFavorite(currentProduct.id) ? 'fill-current' : ''}`}
                    />
                  </button>
                  
                  <span className="text-white text-xs mt-1 opacity-75 font-body">
                    {Math.floor(Math.random() * 100) + 50}
                  </span>
                </motion.div>

                <motion.div 
                  className="flex flex-col items-center"
                  whileTap={{ scale: 0.8 }}
                >
                  <button
                    onClick={() => onAddToCart(currentProduct, selectedSize, selectedColor)}
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

                <motion.div 
                  className="flex flex-col items-center"
                  whileTap={{ scale: 0.8 }}
                >
                  <button
                    onClick={handleQuickViewClick}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <Eye className="h-6 w-6" />
                  </button>
                  
                  <span className="text-white text-xs mt-1 opacity-75 font-body">
                    View
                  </span>
                </motion.div>

                {/* 🔥 NEW: REVIEW PRODUCT FLOATING ICON BUTTON */}
                <motion.div 
                  className="flex flex-col items-center"
                  whileTap={{ scale: 0.8 }}
                >
                  <button
                    onClick={handleNavigateToReviewsClick}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <Star className="h-6 w-6" />
                  </button>
                  
                  <span className="text-white text-xs mt-1 opacity-75 font-body">
                    Review
                  </span>
                </motion.div>



                <motion.div 
                  className="flex flex-col items-center"
                  whileTap={{ scale: 0.8 }}
                >
                  <button
                    onClick={() => {
                      if (currentProduct) {
                        onNavigateToShare(currentProduct);
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

                {/* 🔥 ORANGE FLOATING CHAT BUTTON - Replacing basic chat icon */}
                <motion.div 
                  className="flex flex-col items-center"
                  whileTap={{ scale: 0.8 }}
                >
                  <MobileFloatingChatButton onClick={onChatOpen} />
                  
                  <span className="text-white text-xs mt-1 opacity-75 font-body">
                    Chat
                  </span>
                </motion.div>
              </div>

              {/* 🔥 MOBILE ACTION BUTTONS - POSITIONED RELATIVE TO FLOATING CHAT BUTTON */}
              <AnimatePresence>
                {showProductInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="absolute left-0 right-0 px-6"
                    style={{ 
                      zIndex: 10,
                      bottom: '100px' // 🔥 POSITIONED RELATIVE TO FLOATING CHAT BUTTON (60px + 20px + 20px)
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() => onAddToCart(currentProduct, selectedSize, selectedColor)}
                        className="btn-moema-primary flex-1"
                        style={{
                          backgroundColor: 'var(--primary-blue)',
                          color: 'white',    
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          padding: '8px 24px',
                          fontFamily: 'var(--font-body)',
                          height: '44px',
                          minHeight: '44px',
                          maxHeight: '44px'
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        ADD TO CART
                      </Button>
                      
                      <Button
                        onClick={handleNavigateToSizeGuide}
                        className="btn-moema-secondary"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          borderRadius: 'var(--radius-md)',
                          padding: '8px 16px',
                          fontFamily: 'var(--font-body)',
                          height: '44px',
                          minHeight: '44px',
                          maxHeight: '44px'
                        }}
                      >
                        <Ruler className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 🔥 MOBILE PRODUCT INFORMATION - POSITIONED 20PX ABOVE ACTION BUTTONS */}
              <AnimatePresence>
                {showProductInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="absolute left-0 right-0 p-6 text-white"
                    style={{ 
                      zIndex: 10,
                      bottom: '174px' // 🔥 POSITIONED 20PX ABOVE ACTION BUTTONS (100px + 54px + 20px)
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
                          style={{
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                          }}
                        >
                          <BootstrapIcon name="person_circle" size={24} color="white" />
                        </div>
                        <div>
                          <div className="font-semibold font-body">@modishstyle</div>
                          <div className="text-sm opacity-75 font-body">African Fashion</div>
                        </div>
                      </div>
                      
                      <button className="p-2">
                        <MoreHorizontal className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <h2 className="font-bold text-xl mb-2 font-heading">
                        {currentProduct.name}
                      </h2>
                      <p className="text-sm opacity-90 leading-relaxed font-body mb-2">
                        Authentic African fashion • Premium quality • Available in multiple sizes and colors
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm mb-4">
                        <div className="flex items-center gap-1">
                          {renderStars(currentProduct.rating)}
                          <span className="ml-1 font-body">{currentProduct.rating}</span>
                        </div>
                        <div className="font-bold font-body">
                          ${currentProduct.price}
                          {currentProduct.originalPrice && (
                            <span className="ml-2 text-sm line-through opacity-75">
                              ${currentProduct.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 🔥 MODERN RADIO BUTTON SELECTORS FOR MOBILE */}
                      <MobileSizeSelector />
                      <MobileColorSelector />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Floating Share Button */}
        <FloatingShareButton
          isVisible={isFloatingIconsVisible && !!currentProduct}
          onClick={() => {
            if (currentProduct) {
              onNavigateToShare(currentProduct);
            }
          }}
          currentProduct={currentProduct ? {
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image
          } : undefined}
        />
      </div>
    );
  }

  // Desktop/Tablet Layout using unified CSS classes
  return (
    <div className="shop-page-container">
      <div className={layoutClasses.container}>
        {/* LEFT PANEL */}
        <div className={layoutClasses.leftPanel} style={{ paddingTop: '0px', marginTop: '0px' }}>
          <div className="shop-panel-card shop-search-filter-card" style={{ marginTop: '0px', paddingTop: '0px' }}>
            <h3 className="shop-search-header">Search & Filter</h3>

            <div className="shop-search-input-container">
              <div className="shop-search-icon">
                <BootstrapIcon name="search" size={16} />
              </div>
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shop-search-input"
              />
            </div>

            <div className={`trending-tabs-container ${activeLeftTab === 'brands' ? 'trending-active' : ''}`}>
              {[
                { key: 'categories', label: 'Categories', icon: 'grid_3x3_gap' },
                { key: 'brands', label: 'Brands', icon: 'award' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    // 🎯 SWITCH ANIMATION LOGIC - Same as trending section
                    const newTab = tab.key as 'categories' | 'brands' | 'collections';
                    if (activeLeftTab !== newTab) {
                      const container = document.querySelector('.shop-search-filter-card .trending-tabs-container');
                      
                      // Add animation class for smooth transition
                      if (container) {
                        if (newTab === 'brands') {
                          container.classList.add('animate-to-trending');
                          container.classList.remove('animate-to-hot');
                        } else {
                          container.classList.add('animate-to-hot');
                          container.classList.remove('animate-to-trending');
                        }
                      }
                      
                      // Set new active tab
                      setActiveLeftTab(newTab);
                    }
                  }}
                  className={`trending-tab-button ${activeLeftTab === tab.key ? 'active' : ''}`}
                  data-tab={tab.key}
                >
                  <BootstrapIcon name={tab.icon} size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeLeftTab === 'categories' ? (
              <div className="shop-category-list">
                {categoryData.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="shop-category-item shop-interactive"
                    onClick={() => setFilterCategory(category.id)}
                  >
                    <div className="shop-category-icon">{category.icon}</div>
                    <div className="shop-category-info">
                      <div className="shop-category-name">{category.name}</div>
                      <div className="shop-category-count">({category.count})</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="shop-category-list">
                {BRAND_DATA.map((brand) => (
                  <motion.button
                    key={brand.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="shop-category-item shop-interactive"
                    onClick={() => setFilterCategory(brand.id)}
                  >
                    <div className="shop-category-icon">
                      <BootstrapIcon name="award" size={16} color="var(--primary-blue)" />
                    </div>
                    <div className="shop-category-info">
                      <div className="shop-category-name">{brand.name}</div>
                      <div className="shop-category-count">({brand.count})</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* 🔥 TABLET ONLY: Render Trending Panel below Search & Filter */}
          {isTablet && <TrendingPanel />}
        </div>

        {/* MIDDLE PANEL */}
        <div className={layoutClasses.middlePanel} style={{ paddingTop: '0px', marginTop: '0px' }}>
          {/* Premium Product Deals Carousel */}
          <motion.div 
            className="mb-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginTop: '0px', paddingTop: '0px' }}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-heading" style={{ fontWeight: 700, fontSize: '1.1rem', color: '#000' }}>
                  ⚡ Today's Hot Deals
                </h3>
                <p className="font-body text-xs mt-0.5" style={{ color: '#868686' }}>
                  Limited time offers on trending items
                </p>
              </div>
              <motion.div
                animate={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="h-5 w-5" style={{ color: '#5825efff' }} />
              </motion.div>
            </div>

            {/* Scrollable Product Deals */}
            <div 
              className="flex gap-3 overflow-x-auto pb-2"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#5825efff transparent',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth'
              }}
            >
              {/* Deal Card 1 - Flash Sale */}
              {filteredProducts.length > 0 && (() => {
                const product = filteredProducts[0];
                const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 25;
                return (
                  <motion.div
                    key={`deal-${product.id}`}
                    className="flex-shrink-0 relative overflow-hidden cursor-pointer group"
                    style={{
                      borderRadius: '3px',
                      minWidth: '200px',
                      height: '140px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    whileHover={{ scale: 1.02, y: -2, boxShadow: '0 4px 16px rgba(88,37,239,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onQuickView(product)}
                  >
                    {/* Product Image Background */}
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        filter: 'brightness(0.75)'
                      }}
                    />
                    
                    {/* Black Overlay for readability */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'rgba(0, 0, 0, 0.26)'
                      }}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10 p-3 h-full flex flex-col justify-between">
                      {/* Top: Badge & Timer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-0.5" style={{ borderRadius: '3px' }}>
                          <span className="text-sm">🔥</span>
                          <span className="text-white font-heading text-xs" style={{ fontWeight: 700 }}>FLASH SALE</span>
                        </div>
                        <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-1.5 py-0.5" style={{ borderRadius: '3px' }}>
                          <Clock className="h-2.5 w-2.5 text-white" />
                          <span className="text-white font-body text-xs">2h 47m</span>
                        </div>
                      </div>
                      
                      {/* Bottom: Product Info */}
                      <div>
                        <h4 className="text-white font-heading text-sm mb-1" style={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {product.name.length > 35 ? product.name.substring(0, 35) + '...' : product.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-heading" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-white/70 font-body text-xs line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                          <span className="bg-white text-red-600 px-1.5 py-0.5 font-heading text-xs" style={{ borderRadius: '3px', fontWeight: 700 }}>
                            -{discount}%
                          </span>
                        </div>
                        <motion.div
                          className="text-white font-body text-xs flex items-center gap-1"
                          whileHover={{ x: 2 }}
                        >
                          <span>View Deal</span>
                          <Eye className="h-3 w-3" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                      style={{ pointerEvents: 'none' }}
                    />
                  </motion.div>
                );
              })()}

              {/* Deal Card 2 - Special Offer */}
              {filteredProducts.length > 1 && (() => {
                const product = filteredProducts[1];
                const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 20;
                return (
                  <motion.div
                    key={`deal-${product.id}`}
                    className="flex-shrink-0 relative overflow-hidden cursor-pointer group"
                    style={{
                      borderRadius: '3px',
                      minWidth: '200px',
                      height: '140px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    whileHover={{ scale: 1.02, y: -2, boxShadow: '0 4px 16px rgba(88,37,239,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onQuickView(product)}
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        filter: 'brightness(0.75)'
                      }}
                    />
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'rgba(0, 0, 0, 0.26)'
                      }}
                    />
                    <div className="relative z-10 p-3 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-0.5" style={{ borderRadius: '3px' }}>
                          <span className="text-sm">🎁</span>
                          <span className="text-white font-heading text-xs" style={{ fontWeight: 700 }}>BUY 2 GET 1</span>
                        </div>
                        <div className="bg-black/30 backdrop-blur-sm px-1.5 py-0.5" style={{ borderRadius: '3px' }}>
                          <span className="text-white font-body text-xs">Limited</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-heading text-sm mb-1" style={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {product.name.length > 35 ? product.name.substring(0, 35) + '...' : product.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-heading" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-white/70 font-body text-xs line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                          <span className="bg-white px-1.5 py-0.5 font-heading text-xs" style={{ borderRadius: '3px', fontWeight: 700, color: '#5825efff' }}>
                            SPECIAL
                          </span>
                        </div>
                        <motion.div
                          className="text-white font-body text-xs flex items-center gap-1"
                          whileHover={{ x: 2 }}
                        >
                          <span>Shop Now</span>
                          <ShoppingCart className="h-3 w-3" />
                        </motion.div>
                      </div>
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                      style={{ pointerEvents: 'none' }}
                    />
                  </motion.div>
                );
              })()}

              {/* Deal Card 3 - New Arrivals */}
              {filteredProducts.length > 2 && (() => {
                const product = filteredProducts[2];
                const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 20;
                return (
                  <motion.div
                    key={`deal-${product.id}`}
                    className="flex-shrink-0 relative overflow-hidden cursor-pointer group"
                    style={{
                      borderRadius: '3px',
                      minWidth: '200px',
                      height: '140px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    whileHover={{ scale: 1.02, y: -2, boxShadow: '0 4px 16px rgba(88,37,239,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onQuickView(product)}
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        filter: 'brightness(0.75)'
                      }}
                    />
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'rgba(0, 0, 0, 0.26)'
                      }}
                    />
                    <div className="relative z-10 p-3 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-0.5" style={{ borderRadius: '3px' }}>
                          <span className="text-sm">✨</span>
                          <span className="text-white font-heading text-xs" style={{ fontWeight: 700 }}>NEW ARRIVAL</span>
                        </div>
                        <div className="flex items-center gap-0.5 bg-black/30 backdrop-blur-sm px-1.5 py-0.5" style={{ borderRadius: '3px' }}>
                          <Star className="h-2.5 w-2.5 text-yellow-300 fill-yellow-300" />
                          <span className="text-white font-body text-xs">{product.rating}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-heading text-sm mb-1" style={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {product.name.length > 35 ? product.name.substring(0, 35) + '...' : product.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-heading" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <>
                              <span className="text-white/70 font-body text-xs line-through">
                                ${product.originalPrice}
                              </span>
                              <span className="bg-white text-green-600 px-1.5 py-0.5 font-heading text-xs" style={{ borderRadius: '3px', fontWeight: 700 }}>
                                -{discount}%
                              </span>
                            </>
                          )}
                        </div>
                        <motion.div
                          className="text-white font-body text-xs flex items-center gap-1"
                          whileHover={{ x: 2 }}
                        >
                          <span>Explore</span>
                          <Eye className="h-3 w-3" />
                        </motion.div>
                      </div>
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                      style={{ pointerEvents: 'none' }}
                    />
                  </motion.div>
                );
              })()}

              {/* Deal Card 4 - Free Shipping */}
              {filteredProducts.length > 3 && (() => {
                const product = filteredProducts[3];
                return (
                  <motion.div
                    key={`deal-${product.id}`}
                    className="flex-shrink-0 relative overflow-hidden cursor-pointer group"
                    style={{
                      borderRadius: '3px',
                      minWidth: '200px',
                      height: '140px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    whileHover={{ scale: 1.02, y: -2, boxShadow: '0 4px 16px rgba(88,37,239,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onQuickView(product)}
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        filter: 'brightness(0.75)'
                      }}
                    />
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'rgba(0, 0, 0, 0.26)'
                      }}
                    />
                    <div className="relative z-10 p-3 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-0.5" style={{ borderRadius: '3px' }}>
                          <span className="text-sm">🚚</span>
                          <span className="text-white font-heading text-xs" style={{ fontWeight: 700 }}>FREE SHIP</span>
                        </div>
                        <div className="bg-black/30 backdrop-blur-sm px-1.5 py-0.5" style={{ borderRadius: '3px' }}>
                          <span className="text-white font-body text-xs">$50+</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-heading text-sm mb-1" style={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {product.name.length > 35 ? product.name.substring(0, 35) + '...' : product.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-heading" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                            ${product.price}
                          </span>
                          <span className="bg-white text-orange-600 px-1.5 py-0.5 font-heading text-xs" style={{ borderRadius: '3px', fontWeight: 700 }}>
                            FREE SHIP
                          </span>
                        </div>
                        <motion.div
                          className="text-white font-body text-xs flex items-center gap-1"
                          whileHover={{ x: 2 }}
                        >
                          <span>Order Now</span>
                          <Zap className="h-3 w-3" />
                        </motion.div>
                      </div>
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                      style={{ pointerEvents: 'none' }}
                    />
                  </motion.div>
                );
              })()}

              {/* Deal Card 5 - Trending */}
              {filteredProducts.length > 4 && (() => {
                const product = filteredProducts[4];
                const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 15;
                return (
                  <motion.div
                    key={`deal-${product.id}`}
                    className="flex-shrink-0 relative overflow-hidden cursor-pointer group"
                    style={{
                      borderRadius: '3px',
                      minWidth: '200px',
                      height: '140px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    whileHover={{ scale: 1.02, y: -2, boxShadow: '0 4px 16px rgba(88,37,239,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onQuickView(product)}
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        filter: 'brightness(0.75)'
                      }}
                    />
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'rgba(0, 0, 0, 0.26)'
                      }}
                    />
                    <div className="relative z-10 p-3 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-0.5" style={{ borderRadius: '3px' }}>
                          <span className="text-sm">🔥</span>
                          <span className="text-white font-heading text-xs" style={{ fontWeight: 700 }}>TRENDING</span>
                        </div>
                        <div className="flex items-center gap-0.5 bg-black/30 backdrop-blur-sm px-1.5 py-0.5" style={{ borderRadius: '3px' }}>
                          <Heart className="h-2.5 w-2.5 text-pink-300 fill-pink-300" />
                          <span className="text-white font-body text-xs">Hot</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-heading text-sm mb-1" style={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {product.name.length > 35 ? product.name.substring(0, 35) + '...' : product.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-heading" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <>
                              <span className="text-white/70 font-body text-xs line-through">
                                ${product.originalPrice}
                              </span>
                              <span className="bg-white text-purple-600 px-1.5 py-0.5 font-heading text-xs" style={{ borderRadius: '3px', fontWeight: 700 }}>
                                -{discount}%
                              </span>
                            </>
                          )}
                        </div>
                        <motion.div
                          className="text-white font-body text-xs flex items-center gap-1"
                          whileHover={{ x: 2 }}
                        >
                          <span>Discover</span>
                          <Eye className="h-3 w-3" />
                        </motion.div>
                      </div>
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                      style={{ pointerEvents: 'none' }}
                    />
                  </motion.div>
                );
              })()}
            </div>
          </motion.div>

          <div className="shop-products-container" style={{ marginTop: '0px', paddingTop: '0px' }}>
            {filteredProducts.length === 0 ? (
              <div className="shop-empty-state">
                <div className="shop-empty-state-icon">
                  <BootstrapIcon name="search" size={48} />
                </div>
                <h3 className="shop-empty-state-title">No products found</h3>
                <p className="shop-empty-state-description">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="shop-product-grid" style={{ marginTop: '0px', paddingTop: '0px' }}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onQuickView={onQuickView}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={isFavorite(product.id)}
                    onNavigateToStoreLocator={onNavigateToStoreLocator}
                    onNavigateToSizeGuide={handleNavigateToSizeGuide}
                    onNavigateToReviews={onNavigateToReviews}
                    currentUser={currentUser}
                    onFavoriteProduct={handleFavoriteProduct}
                    onPurchaseProduct={handlePurchaseProduct}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            )}
          </div>

          {renderPagination()}
        </div>

        {/* RIGHT PANEL - DESKTOP ONLY */}
        {!isTablet && (
          <div className={layoutClasses.rightPanel}>
            <TrendingPanel />
          </div>
        )}
      </div>
    </div>
  );

  // Desktop and Tablet layout
  return (
    <div className={layoutClasses.container}>
      <div className={layoutClasses.layout}>
        {/* Left Panel - Search & Filter */}
        <div className={layoutClasses.leftPanel}>
          <SearchFilterPanel />
        </div>

        {/* Middle Panel - Premium Featured Collection + Products */}
        <div className={layoutClasses.middlePanel}>
          {/* Featured Collection Banner */}
          {/* Special Offers & Incentives Section */}
          <div 
            className="mb-6 incentive-section-container"
            style={{ marginTop: '0px', paddingTop: '0px' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-heading" style={{ fontWeight: 700 }}>⚡ Limited Time Offers</h2>
                <p className="text-sm text-gray-600 font-body mt-1">Grab these deals before they expire!</p>
              </div>
              <motion.div
                animate={{ rotate: [0, 15, 0, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="h-6 w-6 text-purple-600" />
              </motion.div>
            </div>

            <div className="incentive-grid-animated">
              {/* Flash Sale Offer */}
              <motion.div
                className="relative overflow-hidden cursor-pointer incentive-card-animated incentive-card-1 incentive-card-3d"
                style={{
                  background: 'var(--error-red)',
                  borderRadius: '3px',
                  padding: '1.25rem'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (filteredProducts.length > 0) {
                    onIncentiveAction?.('flash-sale', filteredProducts[0]);
                  }
                }}
              >
                {/* Shimmer overlay */}
                <div className="incentive-card-shimmer" />
                {/* Spotlight effect */}
                <div className="incentive-spotlight" />
                <div className="relative z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl incentive-icon-bounce">🔥</span>
                    <span className="text-white font-heading text-sm incentive-badge-pulse" style={{ fontWeight: 700 }}>FLASH SALE</span>
                  </div>
                  <div className="text-white mb-3">
                    <div className="text-2xl font-heading" style={{ fontWeight: 700 }}>25% OFF</div>
                    <div className="text-xs opacity-90 font-body">Next 3 hours only!</div>
                  </div>
                  <div className="flex items-center gap-2 incentive-countdown-pulse">
                    <Clock className="h-3 w-3 text-white opacity-75" />
                    <span className="text-xs text-white opacity-90 font-body">Ends in 2h 47m</span>
                  </div>
                  <Button
                    className="w-full mt-3 bg-white text-red-600 hover:bg-gray-100 incentive-button"
                    style={{
                      borderRadius: '3px',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      padding: '0.5rem'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (filteredProducts.length > 0) {
                        onIncentiveAction?.('flash-sale', filteredProducts[0]);
                      }
                    }}
                  >
                    GRAB NOW
                  </Button>
                </div>
                {/* Animated background effect */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                  animate={{
                    backgroundPosition: ['0px 0px', '20px 20px'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              </motion.div>

              {/* Buy 2 Get 1 Offer */}
              <motion.div
                className="relative overflow-hidden cursor-pointer incentive-card-animated incentive-card-2 incentive-card-3d"
                style={{
                  background: 'linear-gradient(135deg, #5825efff, #6e29f6)',
                  borderRadius: '3px',
                  padding: '1.25rem'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (filteredProducts.length > 1) {
                    onIncentiveAction?.('buy-2-get-1', filteredProducts[1]);
                  }
                }}
              >
                {/* Shimmer overlay */}
                <div className="incentive-card-shimmer" />
                {/* Spotlight effect */}
                <div className="incentive-spotlight" />
                <div className="relative z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl incentive-icon-bounce" style={{ animationDelay: '0.2s' }}>🎁</span>
                    <span className="text-white font-heading text-sm incentive-badge-pulse" style={{ fontWeight: 700, animationDelay: '0.2s' }}>SPECIAL DEAL</span>
                  </div>
                  <div className="text-white mb-3">
                    <div className="text-2xl font-heading" style={{ fontWeight: 700 }}>Buy 2 Get 1</div>
                    <div className="text-xs opacity-90 font-body">On selected items</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="h-3 w-3 text-white opacity-75" />
                    <span className="text-xs text-white opacity-90 font-body">Limited stock</span>
                  </div>
                  <Button
                    className="w-full mt-3 bg-white text-purple-600 hover:bg-gray-100 incentive-button"
                    style={{
                      borderRadius: '3px',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      padding: '0.5rem'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (filteredProducts.length > 1) {
                        onIncentiveAction?.('buy-2-get-1', filteredProducts[1]);
                      }
                    }}
                  >
                    SHOP NOW
                  </Button>
                </div>
                {/* Sparkle effect */}
                <motion.div
                  className="absolute top-2 right-2"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <Sparkles className="h-4 w-4 text-white opacity-50" />
                </motion.div>
              </motion.div>

              {/* New Arrival Bonus */}
              <motion.div
                className="relative overflow-hidden cursor-pointer incentive-card-animated incentive-card-3 incentive-card-3d"
                style={{
                  background: 'linear-gradient(135deg, #28a745, #20c997)',
                  borderRadius: '3px',
                  padding: '1.25rem'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (filteredProducts.length > 2) {
                    onIncentiveAction?.('new-arrival', filteredProducts[2]);
                  }
                }}
              >
                {/* Shimmer overlay */}
                <div className="incentive-card-shimmer" />
                {/* Spotlight effect */}
                <div className="incentive-spotlight" />
                <div className="relative z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl incentive-icon-bounce" style={{ animationDelay: '0.4s' }}>✨</span>
                    <span className="text-white font-heading text-sm incentive-badge-pulse" style={{ fontWeight: 700, animationDelay: '0.4s' }}>NEW ARRIVALS</span>
                  </div>
                  <div className="text-white mb-3">
                    <div className="text-2xl font-heading" style={{ fontWeight: 700 }}>20% OFF</div>
                    <div className="text-xs opacity-90 font-body">Launch week special</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-3 w-3 text-white opacity-75" />
                    <span className="text-xs text-white opacity-90 font-body">Be the first!</span>
                  </div>
                  <Button
                    className="w-full mt-3 bg-white text-green-600 hover:bg-gray-100 incentive-button"
                    style={{
                      borderRadius: '3px',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      padding: '0.5rem'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (filteredProducts.length > 2) {
                        onIncentiveAction?.('new-arrival', filteredProducts[2]);
                      }
                    }}
                  >
                    EXPLORE
                  </Button>
                </div>
                {/* Pulse effect */}
                <motion.div
                  className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white"
                  style={{ opacity: 0.1 }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              </motion.div>

              {/* Free Shipping Offer */}
              <motion.div
                className="relative overflow-hidden cursor-pointer incentive-card-animated incentive-card-4 incentive-card-3d"
                style={{
                  background: 'linear-gradient(135deg, #e83e8c, #fd7e14)',
                  borderRadius: '3px',
                  padding: '1.25rem'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (filteredProducts.length > 3) {
                    onIncentiveAction?.('free-shipping', filteredProducts[3]);
                  }
                }}
              >
                {/* Shimmer overlay */}
                <div className="incentive-card-shimmer" />
                {/* Spotlight effect */}
                <div className="incentive-spotlight" />
                <div className="relative z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl incentive-icon-bounce" style={{ animationDelay: '0.6s' }}>🚚</span>
                    <span className="text-white font-heading text-sm incentive-badge-pulse" style={{ fontWeight: 700, animationDelay: '0.6s' }}>FREE SHIPPING</span>
                  </div>
                  <div className="text-white mb-3">
                    <div className="text-2xl font-heading" style={{ fontWeight: 700 }}>Orders $50+</div>
                    <div className="text-xs opacity-90 font-body">Worldwide delivery</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-white opacity-75" />
                    <span className="text-xs text-white opacity-90 font-body">Fast delivery</span>
                  </div>
                  <Button
                    className="w-full mt-3 bg-white text-orange-600 hover:bg-gray-100 incentive-button"
                    style={{
                      borderRadius: '3px',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      padding: '0.5rem'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (filteredProducts.length > 3) {
                        onIncentiveAction?.('free-shipping', filteredProducts[3]);
                      }
                    }}
                  >
                    SHOP NOW
                  </Button>
                </div>
                {/* Diagonal stripes animation */}
                <motion.div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: 'repeating-linear-gradient(45deg, white 0px, white 2px, transparent 2px, transparent 10px)',
                  }}
                  animate={{
                    backgroundPosition: ['0px 0px', '14px 14px'],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* Framework Demo Banner */}
          <motion.div 
            className="shop-featured-banner mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #5825efff 0%, #6e29f6 50%, #885cf8 100%)',
              borderRadius: '3px',
              padding: '2rem',
              marginBottom: '2rem',
              position: 'relative'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated Background Pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)',
                backgroundSize: '50px 50px'
              }}
            />
            
            <div className="relative z-10 text-center">
              <motion.div
                className="flex items-center justify-center mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <span className="text-4xl mr-3">🚀</span>
                <h2 className="text-2xl font-bold font-heading">Explore Framework Features</h2>
                <span className="text-4xl ml-3">⚡</span>
              </motion.div>
              
              <motion.p 
                className="text-lg opacity-90 mb-6 max-w-2xl mx-auto font-body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Experience our complete multi-vendor marketplace with AI intelligence, social commerce, 
                international expansion, and advanced logistics management.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  onClick={() => onNavigateToPage('framework-demo')}
                  className="btn-moema-primary bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 font-semibold text-lg transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: 'white',
                    color: '#5825efff',
                    border: 'none',
                    borderRadius: '3px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                >
                  🎯 View All Features
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => onNavigateToPage('ai-intelligence')}
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300"
                    style={{ borderRadius: '3px' }}
                  >
                    🤖 AI Intelligence
                  </Button>
                  <Button
                    onClick={() => onNavigateToPage('social-commerce')}
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300"
                    style={{ borderRadius: '3px' }}
                  >
                    📱 Social Commerce
                  </Button>
                </div>
              </motion.div>
              
              {/* Phase Indicators */}
              <motion.div
                className="flex justify-center items-center mt-6 gap-4 text-sm opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Phase 1-2: Complete
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Phase 3: Operations
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Phase 4: AI & Global
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Products Section */}
          <div className="shop-products-container" style={{ marginTop: '0px', paddingTop: '0px' }}>
            <div className="shop-product-grid" style={{ marginTop: '0px', paddingTop: '0px' }}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={isFavorite(product.id)}
                  onNavigateToStoreLocator={onNavigateToStoreLocator}
                  onNavigateToSizeGuide={handleNavigateToSizeGuide}
                  onNavigateToReviews={onNavigateToReviews}
                  currentUser={currentUser}
                  onFavoriteProduct={handleFavoriteProduct}
                  onPurchaseProduct={handlePurchaseProduct}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {renderPagination()}
        </div>

        {/* Right Panel - Elegant Trending */}
        <div className={layoutClasses.rightPanel} style={{ paddingTop: '0px', marginTop: '0px' }}>
          {/* Live Stream Quick Access */}
          <div className="shop-panel-card mb-6" style={{ marginTop: '0px' }}>
            <div className="shop-search-header mb-4">
              <BootstrapIcon name="broadcast" size={16} color="var(--primary-blue)" />
              <span>Live Streams</span>
            </div>
            <QuickWatchStreamButton 
              onNavigateToStream={() => onNavigateToPage('watch-live-stream')}
              className="w-full"
            />
          </div>
          <TrendingPanel />
        </div>
      </div>
    </div>
  );
}