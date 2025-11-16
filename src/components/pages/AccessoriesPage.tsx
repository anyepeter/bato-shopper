import { useState, useEffect } from "react";
import { Search, Star } from "lucide-react";
import { BootstrapIcon } from "../BootstrapIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { ProductCard } from "../ProductCard";
import { Product } from "../../types";
import { motion } from "motion/react";

// Import the unified shop pages CSS
import "../../styles/shop-pages.css";

interface AccessoriesPageProps {
  filteredProducts: Product[];
  searchQuery: string;
  sortBy: string;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  onNavigateToStoreLocator: (product: Product) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  onNavigateToSizeGuide?: () => void;
  onNavigateToReviews?: (product: Product) => void;
  // Mobile props (unused since mobile uses HomePage)
  isFloatingIconsVisible?: boolean;
  isMobileSearchOpen?: boolean;
  onToggleMobileSearch?: () => void;
  onCloseMobileSearch?: () => void;
  onChatOpen?: () => void;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function AccessoriesPage({
  filteredProducts,
  searchQuery,
  sortBy,
  onAddToCart,
  onQuickView,
  onToggleFavorite,
  isFavorite,
  onNavigateToStoreLocator,
  setSearchQuery,
  setSortBy,
  onNavigateToSizeGuide,
  onNavigateToReviews,
  // Mobile props (unused)
  isFloatingIconsVisible = false,
  isMobileSearchOpen = false,
  onToggleMobileSearch = () => {},
  onCloseMobileSearch = () => {},
  onChatOpen = () => {},
  currentPage,
  totalPages,
  totalProducts,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: AccessoriesPageProps) {
  const [isTablet, setIsTablet] = useState(false);
  const [activeTrendingTab, setActiveTrendingTab] = useState<'hot' | 'trending'>('hot');

  // Filter to show only accessories
  const accessories = filteredProducts.filter(product => product.category === 'accessories');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1200);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Desktop/Tablet Layout
  const displayProducts = accessories;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = displayProducts.slice(startIndex, endIndex);

  const getHotProducts = () => {
    return filteredProducts
      .filter(product => 
        product.rating >= 4.7 || 
        product.badge === 'New' || 
        product.badge === 'Popular' ||
        product.price >= 100
      )
      .slice(0, 4);
  };

  const getTrendingProducts = () => {
    return filteredProducts
      .filter(product => 
        product.badge === 'Sale' || 
        product.rating >= 4.5 ||
        product.originalPrice
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  };

  const categoryData = [
    { id: 'all', name: 'All Products', count: filteredProducts.length, icon: '🌟' },
    { id: 'dresses', name: 'Dresses', count: filteredProducts.filter(p => p.category === 'dresses').length, icon: '👗' },
    { id: 'tops', name: 'Tops', count: filteredProducts.filter(p => p.category === 'tops').length, icon: '👚' },
    { id: 'sets', name: 'Sets', count: filteredProducts.filter(p => p.category === 'sets').length, icon: '👕' },
    { id: 'traditional', name: 'Traditional', count: filteredProducts.filter(p => p.category === 'traditional').length, icon: '🎭' },
    { id: 'accessories', name: 'Accessories', count: filteredProducts.filter(p => p.category === 'accessories').length, icon: '💎' }
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

  // Trending panel component
  const TrendingPanel = () => (
    <div className="shop-panel-card shop-trending-card">
      <div className="shop-trending-header">
        <BootstrapIcon name="trending_up" size={16} color="var(--primary-blue)" />
        <span className="shop-trending-title">Trending</span>
      </div>

      <div className="shop-trending-tabs">
        {[
          { key: 'hot', label: 'Hot', icon: 'fire' },
          { key: 'trending', label: 'Trending', icon: 'trending_up' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTrendingTab(tab.key as any)}
            className={`shop-trending-tab ${activeTrendingTab === tab.key ? 'active' : ''}`}
          >
            <div className="shop-trending-tab-content">
              <BootstrapIcon name={tab.icon} size={14} />
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      <div className="shop-trending-products">
        {(activeTrendingTab === 'hot' ? getHotProducts() : getTrendingProducts()).map((product) => (
          <motion.div
            key={product.id}
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
                <div className={`shop-trending-product-badge ${product.badge === 'Sale' ? 'sale' : 'default'}`}>
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
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

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
                <SelectTrigger className="w-20 h-8 text-sm">
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
                  className={`${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-blue-50'}`}
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
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                  className={`${currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-blue-50'}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  };

  // Layout classes
  const getLayoutClasses = () => {
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

  const layoutClasses = getLayoutClasses();

  return (
    <div className="shop-page-container">
      <div className={layoutClasses.container}>
        {/* LEFT PANEL */}
        <div className={layoutClasses.leftPanel}>
          <div className="shop-panel-card shop-search-filter-card">
            <h3 className="shop-search-header">Search & Filter</h3>

            <div className="shop-search-input-container">
              <Search className="shop-search-icon" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shop-search-input"
              />
            </div>

            <div className="shop-featured-tab">
              <div className="shop-featured-tab-container">
                <button className="shop-featured-tab-button">Featured</button>
              </div>
            </div>

            <div className="shop-category-list">
              {categoryData.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="shop-category-item shop-interactive"
                >
                  <div className="shop-category-icon">{category.icon}</div>
                  <div className="shop-category-info">
                    <div className="shop-category-name">{category.name}</div>
                    <div className="shop-category-count">({category.count})</div>
                  </div>
                </motion.button>
              ))}
            </div>

          </div>

          {/* 🔥 TABLET ONLY: Render Trending Panel below Search & Filter */}
          {isTablet && <TrendingPanel />}
        </div>

        {/* MIDDLE PANEL */}
        <div className={layoutClasses.middlePanel}>
          <div className="shop-featured-banner">
            <h2>Beautiful Accessories Collection</h2>
            <p>Complete your look with stunning African-inspired accessories</p>
            <Button className="btn-moema-primary">SHOP NOW</Button>
          </div>

          <div className="shop-products-container">
            {paginatedProducts.length === 0 ? (
              <div className="shop-empty-state">
                <div className="shop-empty-state-icon">
                  <Search className="h-12 w-12" />
                </div>
                <h3 className="shop-empty-state-title">No accessories found</h3>
                <p className="shop-empty-state-description">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="shop-product-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onQuickView={onQuickView}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={isFavorite(product.id)}
                    onNavigateToStoreLocator={onNavigateToStoreLocator}
                    onNavigateToSizeGuide={onNavigateToSizeGuide}
                    onNavigateToReviews={onNavigateToReviews}
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
}