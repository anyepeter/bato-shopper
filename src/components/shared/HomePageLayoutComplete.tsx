import { useState, useEffect } from "react";
import { Search, Filter, Star } from "lucide-react";
import { BootstrapIcon } from "../BootstrapIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { ProductCard } from "../ProductCard";
import { Product } from "../../types";
import { motion } from "motion/react";

interface HomePageLayoutProps {
  title?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  filteredProducts: Product[];
  allFilteredProducts: Product[];
  filterCategory: string;
  searchQuery: string;
  sortBy: string;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  onNavigateToStoreLocator: (product: Product) => void;
  onNavigateToPage: (page: string) => void;
  setFilterCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  onNavigateToSizeGuide?: () => void;
  onNavigateToReviews?: (product: Product) => void;
  // 🔥 PAGINATION PROPS (REQUIRED)
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  // Additional props for live streams functionality
  isFloatingIconsVisible: boolean;
  isMobileSearchOpen: boolean;
  onToggleMobileSearch: () => void;
  onCloseMobileSearch: () => void;
  currentUser?: any;
  onSignOut: () => void;
  onChatOpen: () => void;
  onNavigateToLiveStream: (streamId: string) => void;
  // Custom filter for each page (e.g., newArrivals, dresses filter)
  customProductFilter?: (products: Product[]) => Product[];
  // Custom render props to override panels
  customLeftPanel?: () => React.ReactNode;
  customMainContent?: () => React.ReactNode;
  customRightPanel?: () => React.ReactNode;
}

export function HomePageLayout({
  title,
  bannerTitle = "Featured Collection",
  bannerSubtitle = "Browse authentic African fashion with modern elegance",
  filteredProducts,
  allFilteredProducts,
  filterCategory,
  searchQuery,
  sortBy,
  onAddToCart,
  onQuickView,
  onToggleFavorite,
  isFavorite,
  onNavigateToStoreLocator,
  onNavigateToPage,
  setFilterCategory,
  setSearchQuery,
  setSortBy,
  onNavigateToSizeGuide,
  onNavigateToReviews,
  // 🔥 PAGINATION PROPS
  currentPage,
  totalPages,
  totalProducts,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  // Additional props
  isFloatingIconsVisible,
  isMobileSearchOpen,
  onToggleMobileSearch,
  onCloseMobileSearch,
  currentUser,
  onSignOut,
  onChatOpen,
  onNavigateToLiveStream,
  // Custom product filter
  customProductFilter,
  // Custom render props
  customLeftPanel,
  customMainContent,
  customRightPanel
}: HomePageLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activeTrendingTab, setActiveTrendingTab] = useState<'hot' | 'trending'>('hot');

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

  // Apply custom filter if provided, otherwise use filtered products
  const displayProducts = customProductFilter ? customProductFilter(filteredProducts) : filteredProducts;

  // 🔥 PAGINATION LOGIC - Calculate paginated products (same as HomePage)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = displayProducts.slice(startIndex, endIndex);

  // 🔥 FILTER PRODUCTS FOR HOT AND TRENDING TABS (same as HomePage)
  const getHotProducts = () => {
    return allFilteredProducts
      .filter(product => 
        product.rating >= 4.7 || 
        product.badge === 'New' || 
        product.badge === 'Popular' ||
        product.price >= 100
      )
      .slice(0, 4);
  };

  const getTrendingProducts = () => {
    return allFilteredProducts
      .filter(product => 
        product.badge === 'Sale' || 
        product.rating >= 4.5 ||
        product.originalPrice
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  };

  // EXACT CATEGORY DATA FROM HOMEPAGE
  const categoryData = [
    { id: 'all', name: 'All Products', count: allFilteredProducts.length, icon: '🌟' },
    { id: 'dresses', name: 'Dresses', count: allFilteredProducts.filter(p => p.category === 'dresses').length, icon: '👗' },
    { id: 'tops', name: 'Tops', count: allFilteredProducts.filter(p => p.category === 'tops').length, icon: '👚' },
    { id: 'sets', name: 'Sets', count: allFilteredProducts.filter(p => p.category === 'sets').length, icon: '👕' },
    { id: 'traditional', name: 'Traditional', count: allFilteredProducts.filter(p => p.category === 'traditional').length, icon: '🎭' },
    { id: 'accessories', name: 'Accessories', count: allFilteredProducts.filter(p => p.category === 'accessories').length, icon: '💎' }
  ];

  // Helper function to get icon size for categories (same as HomePage)
  const getCategoryIconSize = () => {
    if (isMobile) return '24px';
    return '96px'; // 4x larger for desktop and tablet
  };

  const getProductGridCols = () => {
    if (isMobile) return 'grid-cols-1';
    if (isTablet) return 'grid-cols-2';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  };

  const getLayoutClasses = () => {
    if (isMobile) {
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
    if (isMobile || totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

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
              Showing {startItem}-{endItem} of {totalProducts} products
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-body">Show:</span>
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
              <span className="text-sm text-gray-600 font-body">per page</span>
            </div>
          </div>

          {/* Pagination Controls */}
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
              
              {/* Ellipsis for large page counts */}
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

  const layoutClasses = getLayoutClasses();

  return (
    <div 
      className="min-h-screen py-8"
      style={{ backgroundColor: 'var(--light-gray)' }}
    >
      <div className={layoutClasses.container}>
        {/* 🔥 LEFT PANEL - Search & Filter or Custom Content */}
        <div className={layoutClasses.leftPanel}>
          {customLeftPanel ? (
            <div 
              className="p-5 rounded mb-5 sticky top-5"
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-md)',
                maxHeight: 'calc(100vh - 40px)'
              }}
            >
              {customLeftPanel()}
            </div>
          ) : (
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
                placeholder="Search products..."
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

            {/* Categories */}
            <div className="space-y-4">
              <div className="space-y-3">
                {categoryData.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFilterCategory(category.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      filterCategory === category.id
                        ? 'shadow-md'
                        : 'hover:shadow-sm'
                    }`}
                    style={{
                      backgroundColor: filterCategory === category.id ? 'var(--primary-extra-light-blue)' : 'var(--light-gray)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div 
                      className="flex items-center justify-center rounded"
                      style={{ 
                        fontSize: getCategoryIconSize(),
                        width: isMobile ? '32px' : '48px',
                        height: isMobile ? '32px' : '48px',
                        backgroundColor: filterCategory === category.id ? 'var(--pure-white)' : 'var(--pure-white)',
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
          )}
        </div>

        {/* 🔥 MIDDLE PANEL - Custom Content or Default Products */}
        <div className={layoutClasses.middlePanel}>
          {customMainContent ? (
            customMainContent()
          ) : (
            <>
              {/* Featured Collection Banner */}
              <div 
                className="p-8 rounded mb-5 text-center"
                style={{ 
                  backgroundColor: 'var(--primary-blue)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <h2 className="font-heading font-medium text-white mb-2">
                  {bannerTitle}
                </h2>
                <p className="text-white/90 font-body mb-4">
                  {bannerSubtitle}
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
                  SHOP NOW
                </Button>
              </div>

              {/* Products Grid */}
              <div 
                className="p-5 rounded mb-5"
                style={{ 
                  backgroundColor: 'var(--pure-white)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                {paginatedProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="font-heading font-medium text-gray-600 mb-2">No products found</h3>
                    <p className="text-gray-500 font-body">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  <div className={`grid gap-6 ${getProductGridCols()}`}>
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={(product, size, color) => onAddToCart(product, 1, size, color)}
                        onQuickView={onQuickView}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={isFavorite(product.id)}
                        onNavigateToStoreLocator={onNavigateToStoreLocator}
                        onNavigateToSizeGuide={onNavigateToSizeGuide}
                        onNavigateToReviews={onNavigateToReviews}
                        currentUser={currentUser}
                        onFavoriteProduct={(productId) => onToggleFavorite(product)}
                        onPurchaseProduct={(productId) => onAddToCart(product, 1)}
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 🔥 PAGINATION SECTION (SAME AS HOMEPAGE) */}
              {renderPagination()}
            </>
          )}
        </div>

        {/* 🔥 RIGHT PANEL - Custom Content or Default Trending */}
        <div className={layoutClasses.rightPanel}>
          {customRightPanel ? (
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
              {customRightPanel()}
            </div>
          ) : (
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
                { key: 'hot', label: 'Hot', icon: 'fire' },
                { key: 'trending', label: 'Trending', icon: 'trending_up' }
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

            {/* Hot Products */}
            {activeTrendingTab === 'hot' && (
              <div className="space-y-4">
                {getHotProducts().map((product, index) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-sm"
                    style={{
                      backgroundColor: 'var(--light-gray)',
                      borderRadius: 'var(--radius-md)'
                    }}
                    onClick={() => onQuickView(product)}
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                      />
                      {product.badge && (
                        <div
                          className="absolute -top-1 -right-1 px-1 py-0.5 text-xs font-medium rounded"
                          style={{
                            backgroundColor: product.badge === 'Sale' ? 'var(--error-red)' : 'var(--primary-blue)',
                            color: 'var(--pure-white)',
                            fontSize: '10px'
                          }}
                        >
                          {product.badge}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium font-body text-sm line-clamp-2" style={{ color: 'var(--primary-blue)' }}>
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(product.rating)}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold font-body text-sm" style={{ color: 'var(--primary-blue)' }}>
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through font-body">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Trending Products */}
            {activeTrendingTab === 'trending' && (
              <div className="space-y-4">
                {getTrendingProducts().map((product, index) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-sm"
                    style={{
                      backgroundColor: 'var(--light-gray)',
                      borderRadius: 'var(--radius-md)'
                    }}
                    onClick={() => onQuickView(product)}
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                      />
                      {product.badge && (
                        <div
                          className="absolute -top-1 -right-1 px-1 py-0.5 text-xs font-medium rounded"
                          style={{
                            backgroundColor: product.badge === 'Sale' ? 'var(--error-red)' : 'var(--primary-blue)',
                            color: 'var(--pure-white)',
                            fontSize: '10px'
                          }}
                        >
                          {product.badge}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium font-body text-sm line-clamp-2" style={{ color: 'var(--primary-blue)' }}>
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(product.rating)}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold font-body text-sm" style={{ color: 'var(--primary-blue)' }}>
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through font-body">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}