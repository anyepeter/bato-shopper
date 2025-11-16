import { useState, useEffect } from "react";
import { Search, Star } from "lucide-react";
import { BootstrapIcon } from "../BootstrapIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { ProductCard } from "../ProductCard";
import { Product } from "../../types";
import { motion, AnimatePresence } from "motion/react";

// Import the enhanced shop pages CSS
import "../../styles/shop-pages.css";

interface SophisticatedShopLayoutProps {
  // Page specific props
  pageTitle: string;
  pageDescription: string;
  pageCategory: string;
  
  // Product props
  filteredProducts: Product[];
  allFilteredProducts: Product[];
  currentPageProducts: Product[];
  
  // Search and filter props
  searchQuery: string;
  sortBy: string;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  
  // Product interaction props
  onAddToCart: (product: Product, size: string, color: string) => void;
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  onNavigateToStoreLocator: (product: Product) => void;
  onNavigateToSizeGuide?: () => void;
  onNavigateToReviews?: (product: Product) => void;
  
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  
  // Additional category filter
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
}

export function SophisticatedShopLayout({
  pageTitle,
  pageDescription,
  pageCategory,
  filteredProducts,
  allFilteredProducts,
  currentPageProducts,
  searchQuery,
  sortBy,
  setSearchQuery,
  setSortBy,
  onAddToCart,
  onQuickView,
  onToggleFavorite,
  isFavorite,
  onNavigateToStoreLocator,
  onNavigateToSizeGuide,
  onNavigateToReviews,
  currentPage,
  totalPages,
  totalProducts,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onCategoryChange,
  selectedCategory = pageCategory
}: SophisticatedShopLayoutProps) {
  const [isTablet, setIsTablet] = useState(false);
  const [activeTrendingTab, setActiveTrendingTab] = useState<'hot' | 'trending'>('hot');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1200);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  const categoryData = [
    { id: 'all', name: 'All Products', count: allFilteredProducts.length, icon: '🌟', isActive: selectedCategory === 'all' },
    { id: 'dresses', name: 'Dresses', count: allFilteredProducts.filter(p => p.category === 'dresses').length, icon: '👗', isActive: selectedCategory === 'dresses' },
    { id: 'tops', name: 'Tops', count: allFilteredProducts.filter(p => p.category === 'tops').length, icon: '👚', isActive: selectedCategory === 'tops' },
    { id: 'sets', name: 'Sets', count: allFilteredProducts.filter(p => p.category === 'sets').length, icon: '👕', isActive: selectedCategory === 'sets' },
    { id: 'traditional', name: 'Traditional', count: allFilteredProducts.filter(p => p.category === 'traditional').length, icon: '🎭', isActive: selectedCategory === 'traditional' },
    { id: 'accessories', name: 'Accessories', count: allFilteredProducts.filter(p => p.category === 'accessories').length, icon: '💎', isActive: selectedCategory === 'accessories' }
  ];

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

  // Enhanced Sort By Control
  const SortByControl = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="mb-6"
    >
      <label className="block text-sm font-medium text-gray-700 mb-2 font-body">
        Sort Products
      </label>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger 
          className="w-full h-12 text-base border-0 bg-white/60 backdrop-blur-md rounded-xl hover:bg-white/80 transition-all duration-300"
          style={{ 
            borderRadius: '12px',
            fontFamily: 'var(--font-body)',
            border: '1px solid rgba(88, 37, 239, 0.1)',
            boxShadow: '0 4px 12px rgba(88, 37, 239, 0.08)'
          }}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
          <SelectItem value="name">Alphabetical</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );

  // Enhanced Trending panel component
  const TrendingPanel = () => (
    <motion.div 
      className="shop-panel-card shop-trending-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="shop-trending-header">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <BootstrapIcon name="trending_up" size={20} color="var(--primary-blue)" />
        </motion.div>
        <span className="shop-trending-title">Trending Now</span>
      </div>

      <div className="shop-trending-tabs">
        {[
          { key: 'hot', label: 'Hot', icon: 'fire' },
          { key: 'trending', label: 'Trending', icon: 'trending_up' }
        ].map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTrendingTab(tab.key as any)}
            className={`shop-trending-tab ${activeTrendingTab === tab.key ? 'active' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="shop-trending-tab-content">
              <BootstrapIcon name={tab.icon} size={14} />
              {tab.label}
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div 
        className="shop-trending-products shop-stagger-animation"
        layout
      >
        <AnimatePresence mode="wait">
          {(activeTrendingTab === 'hot' ? getHotProducts() : getTrendingProducts()).map((product, index) => (
            <motion.div
              key={`${activeTrendingTab}-${product.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="shop-trending-product-card shop-interactive"
              onClick={() => onQuickView(product)}
            >
              <div className="shop-trending-product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="shop-trending-product-image"
                />
                {product.badge && (
                  <motion.div 
                    className={`shop-trending-product-badge ${product.badge === 'Sale' ? 'sale' : 'default'}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {product.badge}
                  </motion.div>
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
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

    return (
      <motion.div 
        className="shop-pagination-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <div className="shop-pagination-content">
          <div className="shop-pagination-info">
            <div className="shop-pagination-results">
              Showing {startItem}-{endItem} of {totalProducts} exquisite items
            </div>
            
            <div className="shop-pagination-per-page">
              <span className="shop-pagination-per-page-label">Show:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(parseInt(value))}>
                <SelectTrigger 
                  className="w-20 h-8 text-sm border-0 bg-white/60 backdrop-blur-md rounded-lg"
                  style={{ 
                    borderRadius: '8px',
                    fontFamily: 'var(--font-body)',
                    border: '1px solid rgba(88, 37, 239, 0.1)'
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
                  className={`${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-blue-50 transition-all duration-300'}`}
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
                      className="cursor-pointer transition-all duration-300"
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
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                  className={`${currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-blue-50 transition-all duration-300'}`}
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: currentPage >= totalPages ? 'var(--medium-gray)' : 'var(--primary-blue)'
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </motion.div>
    );
  };

  // Layout classes
  const getLayoutClasses = () => {
    return {
      container: 'shop-layout-container',
      leftPanel: 'shop-left-panel',
      middlePanel: 'shop-middle-panel',
      rightPanel: 'shop-right-panel'
    };
  };

  const layoutClasses = getLayoutClasses();

  return (
    <div className="shop-page-container">
      <div className={layoutClasses.container}>
        {/* LEFT PANEL - Enhanced Search & Filter */}
        <motion.div 
          className={layoutClasses.leftPanel}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="shop-panel-card shop-search-filter-card">
            <motion.h3 
              className="shop-search-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Discover & Filter
            </motion.h3>

            <motion.div 
              className="shop-search-input-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div
                animate={{ 
                  scale: searchFocused ? 1.1 : 1,
                  color: searchFocused ? 'var(--primary-blue)' : '#9ca3af'
                }}
                transition={{ duration: 0.2 }}
              >
                <Search className="shop-search-icon" />
              </motion.div>
              <Input
                type="text"
                placeholder={`Search ${pageCategory}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="shop-search-input"
              />
            </motion.div>

            <motion.div 
              className="shop-featured-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="shop-featured-tab-container">
                <motion.button 
                  className="shop-featured-tab-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Featured Collection
                </motion.button>
              </div>
            </motion.div>

            <SortByControl />

            <motion.div 
              className="shop-category-list shop-stagger-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {categoryData.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onCategoryChange?.(category.id)}
                  className={`shop-category-item shop-interactive ${category.isActive ? 'ring-2 ring-blue-200' : ''}`}
                  style={{
                    background: category.isActive 
                      ? 'linear-gradient(135deg, rgba(88, 37, 239, 0.1) 0%, rgba(88, 37, 239, 0.2) 100%)'
                      : undefined
                  }}
                >
                  <motion.div 
                    className="shop-category-icon"
                    animate={{ rotate: category.isActive ? [0, 5, -5, 0] : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {category.icon}
                  </motion.div>
                  <div className="shop-category-info">
                    <div className="shop-category-name">{category.name}</div>
                    <div className="shop-category-count">({category.count})</div>
                  </div>
                </motion.button>
              ))}
            </motion.div>

          </div>

          {/* Tablet Only: Render Trending Panel below Search & Filter */}
          {isTablet && <TrendingPanel />}
        </motion.div>

        {/* MIDDLE PANEL - Enhanced Featured Collection + Products */}
        <motion.div 
          className={layoutClasses.middlePanel}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div 
            className="shop-featured-banner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {pageTitle}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {pageDescription}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Button 
                className="btn-moema-primary"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                EXPLORE COLLECTION
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="shop-products-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {currentPageProducts.length === 0 ? (
              <motion.div 
                className="shop-empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="shop-empty-state-icon">
                  <Search className="h-16 w-16" />
                </div>
                <h3 className="shop-empty-state-title">No products found</h3>
                <p className="shop-empty-state-description">Try adjusting your search or filter criteria to discover more beautiful items</p>
              </motion.div>
            ) : (
              <motion.div 
                className="shop-product-grid shop-stagger-animation"
                layout
              >
                <AnimatePresence>
                  {currentPageProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -40 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100 
                      }}
                      whileHover={{ y: -8 }}
                      layout
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={onAddToCart}
                        onQuickView={onQuickView}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={isFavorite(product.id)}
                        onNavigateToStoreLocator={onNavigateToStoreLocator}
                        onNavigateToSizeGuide={onNavigateToSizeGuide}
                        onNavigateToReviews={onNavigateToReviews}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>

          {renderPagination()}
        </motion.div>

        {/* RIGHT PANEL - Desktop Only Enhanced Trending */}
        {!isTablet && (
          <motion.div 
            className={layoutClasses.rightPanel}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <TrendingPanel />
          </motion.div>
        )}
      </div>
    </div>
  );
}