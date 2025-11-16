import React, { useState, useMemo, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ProductCard } from "../ProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { BootstrapIcon } from "../BootstrapIcon";
import { Product, FavoriteItem } from "../../types";

interface FavoritesPageProps {
  favoriteItems: FavoriteItem[];
  allProducts: Product[];
  onNavigateBack: () => void;
  onRemoveFromFavorites: (productId: number) => void;
  onAddToCart?: (product: Product, size: string, color: string) => void;
  onQuickView?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  isFavorite?: (productId: number) => boolean;
  onNavigateToSizeGuide?: () => void;
  onNavigateToReviews?: (product: Product) => void;
}

export function FavoritesPage({ 
  favoriteItems, 
  allProducts,
  onNavigateBack, 
  onRemoveFromFavorites,
  onAddToCart,
  onQuickView,
  onToggleFavorite,
  isFavorite,
  onNavigateToSizeGuide,
  onNavigateToReviews
}: FavoritesPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Convert favorite items to full product objects, with fallback for missing products
  const favoriteProducts = favoriteItems.filter(favorite => favorite && favorite.id).map(favorite => {
    const matchedProduct = allProducts.find(product => product.id === favorite.id);
    if (matchedProduct) {
      return matchedProduct;
    } else {
      // Create a pseudo-product from the favorite item data
      console.log(`🚨 Product with ID ${favorite.id} not found in allProducts, creating fallback`);
      return {
        id: favorite.id || 0,
        name: favorite.name || 'Unknown Product',
        price: favorite.price || 0,
        originalPrice: favorite.originalPrice,
        image: favorite.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
        category: (favorite.category as 'dresses' | 'tops' | 'accessories') || 'accessories',
        rating: favorite.rating || 4.0,
        sizes: favorite.sizes || [],
        colors: favorite.colors || [],
        // Default values for missing fields
        reviewCount: 0,
        description: 'No description available',
        fabric: 'Mixed materials',
        care: 'Follow care label instructions',
        origin: 'Origin not specified',
        fit: 'Standard fit',
        sku: `FAV-${favorite.id || 'unknown'}`,
        stockCount: 1,
        tags: [],
        isNew: favorite.isNew || false,
        isBestSeller: favorite.isBestSeller || false,
        discount: favorite.discount
      } as Product;
    }
  });

  // Debug logging to identify the issue
  React.useEffect(() => {
    console.log('🔥 FavoritesPage Debug:');
    console.log('🔥 favoriteItems:', favoriteItems);
    console.log('🔥 allProducts count:', allProducts.length);
    console.log('🔥 favoriteProducts:', favoriteProducts);
    console.log('🔥 favoriteProducts count:', favoriteProducts.length);
    
    if (favoriteItems.length > 0 && favoriteProducts.length === 0) {
      console.log('🚨 ISSUE: favoriteItems exist but favoriteProducts is empty!');
      console.log('🚨 First favorite item ID:', favoriteItems[0]?.id);
      console.log('🚨 Sample allProduct IDs:', allProducts.slice(0, 5).map(p => p.id));
    }
  }, [favoriteItems, allProducts, favoriteProducts]);

  // Advanced filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = favoriteProducts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product && product.name && product.category &&
        (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => 
        product && product.category &&
        product.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'recent':
      default:
        // Keep original order for "recent"
        break;
    }

    return filtered;
  }, [favoriteProducts, searchQuery, filterCategory, sortBy]);

  // Statistics calculations
  const favoriteStats = useMemo(() => {
    const validProducts = favoriteProducts.filter(product => product && typeof product.price === 'number');
    const totalValue = validProducts.reduce((sum, product) => sum + (product.price || 0), 0);
    const avgRating = validProducts.length > 0 
      ? validProducts.reduce((sum, product) => sum + (product.rating || 0), 0) / validProducts.length 
      : 0;
    const categories = [...new Set(validProducts.map(p => p.category).filter(Boolean))];
    const mostExpensive = validProducts.reduce((max, product) => 
      (product.price || 0) > (max.price || 0) ? product : max, validProducts[0] || { price: 0 });

    return {
      totalValue,
      avgRating,
      categoriesCount: categories.length,
      mostExpensive,
      categories
    };
  }, [favoriteProducts]);

  // Handle scroll for fixed header
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('favorites-hero');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        setIsHeaderFixed(rect.bottom <= 80);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRemoveFromFavorites = (productId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    onRemoveFromFavorites(productId);
  };

  const handleBulkRemove = () => {
    selectedProducts.forEach(productId => handleRemoveFromFavorites(productId));
    setSelectedProducts([]);
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredAndSortedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredAndSortedProducts.map(p => p.id));
    }
  };

  const categories = ['all', ...new Set(favoriteProducts.map(p => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        id="favorites-hero"
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-light-blue) 50%, var(--primary-dark-blue) 100%)',
          paddingTop: '2rem',
          paddingBottom: '4rem'
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(255,255,255,0.1)_20px,rgba(255,255,255,0.1)_40px)]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={onNavigateBack}
              className="mr-4 p-2 text-white hover:bg-white/20"
            >
              <BootstrapIcon name="arrow-left" size={20} />
            </Button>
          </div>

          {/* Hero Content */}
          <div className="text-center text-white">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm">
                <BootstrapIcon name="heart-fill" size={32} color="#f87171" />
              </div>
              <BootstrapIcon name="stars" size={24} color="#facc15" />
            </div>
            
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in font-heading"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              My Favorites Collection
            </h1>
            
            <p 
              className="text-xl mb-8 opacity-90 animate-fade-in-delay font-body max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Curate your personal style with handpicked African fashion pieces that speak to your heart
            </p>

            {/* Quick Stats */}
            <div className="flex justify-center items-center gap-8 flex-wrap mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold font-heading">{favoriteItems.length}</div>
                <div className="text-sm text-white/80 font-body">Loved Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-heading">${favoriteStats.totalValue.toFixed(0)}</div>
                <div className="text-sm text-white/80 font-body">Total Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-heading">{favoriteStats.categoriesCount}</div>
                <div className="text-sm text-white/80 font-body">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-heading">{favoriteStats.avgRating.toFixed(1)}★</div>
                <div className="text-sm text-white/80 font-body">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Controls */}
      <div 
        className={`sticky top-0 z-30 transition-all duration-300 ${
          isHeaderFixed ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <BootstrapIcon name="search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search your favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(Boolean).map(category => (
                    <SelectItem key={category} value={category}>
                      {category?.charAt(0).toUpperCase() + category?.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              {selectedProducts.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkRemove}
                  className="mr-2"
                >
                  Remove {selectedProducts.length} Selected
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="mr-2"
              >
                {selectedProducts.length === filteredAndSortedProducts.length ? 'Deselect All' : 'Select All'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <BootstrapIcon name="grid" size={16} /> : <BootstrapIcon name="grid-3x3" size={16} />}
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || filterCategory !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Search: "{searchQuery}"
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:text-orange-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterCategory !== 'all' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Category: {filterCategory}
                  <button 
                    onClick={() => setFilterCategory('all')}
                    className="ml-1 hover:text-blue-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favoriteItems.length === 0 ? (
          // Enhanced Empty State
          <div className="text-center py-24">
            <div className="relative mb-8">
              <div 
                className="mx-auto w-32 h-32 rounded-full flex items-center justify-center mb-6"
                style={{ 
                  background: 'linear-gradient(135deg, var(--primary-extra-light-blue), var(--light-gray))',
                  border: '3px solid var(--primary-blue)'
                }}
              >
                <BootstrapIcon 
                  name="heart-fill"
                  size={64}
                  style={{ color: 'var(--primary-blue)' }}
                />
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <BootstrapIcon name="stars" size={32} color="#facc15" className="animate-pulse" />
              </div>
            </div>
            
            <h3 
              className="text-3xl font-bold mb-4 font-heading"
              style={{ 
                color: 'var(--dark-gray)',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Your Heart's Collection Awaits
            </h3>
            
            <p 
              className="text-lg text-gray-600 mb-8 font-body max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Discover stunning African fashion pieces and start building your personal collection of favorites.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="btn-moema btn-moema-primary btn-moema-rounded"
                style={{ 
                  height: '48px',
                  padding: '0 32px',
                  borderRadius: 'var(--radius-full)'
                }}
                onClick={onNavigateBack}
              >
                <BootstrapIcon name="bag" size={20} className="mr-2" />
                Start Shopping
              </button>
              
              <button 
                className="btn-moema btn-moema-secondary btn-moema-rounded"
                style={{ 
                  height: '48px',
                  padding: '0 32px',
                  borderRadius: 'var(--radius-full)'
                }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <BootstrapIcon name="graph-up-arrow" size={20} className="mr-2" />
                View Trending
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 
                  className="text-2xl font-bold mb-2 font-heading"
                  style={{ 
                    color: 'var(--primary-blue)',
                    fontFamily: 'var(--font-heading)'
                  }}
                >
                  Your Favorites
                </h2>
                <p 
                  className="text-gray-600 font-body"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {filteredAndSortedProducts.length} of {favoriteItems.length} items
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
            </div>

            {/* Favorites Grid/List */}
            <section className="mb-12">

              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredAndSortedProducts.map((product, index) => (
                  <div key={product.id} className="relative group">
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-20">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="w-5 h-5 rounded border-2 border-white bg-white/80 backdrop-blur-sm"
                      />
                    </div>

                    <ProductCard
                      product={product}
                      onAddToCart={onAddToCart || (() => {})}
                      onQuickView={onQuickView || (() => {})}
                      onToggleFavorite={onToggleFavorite || (() => {})}
                      isFavorite={isFavorite ? isFavorite(product.id) : true}
                      onNavigateToSizeGuide={onNavigateToSizeGuide}
                      onNavigateToReviews={onNavigateToReviews}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    />
                    
                    {/* Enhanced Remove Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 h-9 w-9 p-0 rounded-full shadow-lg hover:scale-110"
                      onClick={(e) => handleRemoveFromFavorites(product.id, e)}
                      title="Remove from favorites"
                      style={{
                        backgroundColor: 'var(--error-red)',
                        color: 'var(--pure-white)'
                      }}
                    >
                      <BootstrapIcon name="trash" size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              {/* No Results */}
              {filteredAndSortedProducts.length === 0 && favoriteItems.length > 0 && (
                <div className="text-center py-16">
                  <BootstrapIcon name="search" size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterCategory('all');
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </section>

            {/* Advanced Statistics Section */}
            <section className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div 
                  className="p-6 rounded-lg text-center"
                  style={{ 
                    backgroundColor: 'var(--pure-white)',
                    boxShadow: 'var(--shadow-standard-desktop)',
                    borderRadius: '3px'
                  }}
                >
                  <BootstrapIcon 
                    name="bag"
                    size={32}
                    className="mx-auto mb-3"
                    style={{ color: 'var(--primary-blue)' }}
                  />
                  <div 
                    className="text-2xl font-bold mb-1 font-heading"
                    style={{ color: 'var(--primary-blue)' }}
                  >
                    ${favoriteStats.totalValue.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600 font-body">Total Collection Value</div>
                </div>

                <div 
                  className="p-6 rounded-lg text-center"
                  style={{ 
                    backgroundColor: 'var(--pure-white)',
                    boxShadow: 'var(--shadow-standard-desktop)',
                    borderRadius: '3px'
                  }}
                >
                  <BootstrapIcon 
                    name="star-fill"
                    size={32}
                    className="mx-auto mb-3"
                    style={{ color: 'var(--warning-yellow)' }}
                  />
                  <div 
                    className="text-2xl font-bold mb-1 font-heading"
                    style={{ color: 'var(--primary-blue)' }}
                  >
                    {favoriteStats.avgRating.toFixed(1)}★
                  </div>
                  <div className="text-sm text-gray-600 font-body">Average Rating</div>
                </div>

                <div 
                  className="p-6 rounded-lg text-center"
                  style={{ 
                    backgroundColor: 'var(--pure-white)',
                    boxShadow: 'var(--shadow-standard-desktop)',
                    borderRadius: '3px'
                  }}
                >
                  <BootstrapIcon 
                    name="tag"
                    size={32}
                    className="mx-auto mb-3"
                    style={{ color: 'var(--success-green)' }}
                  />
                  <div 
                    className="text-2xl font-bold mb-1 font-heading"
                    style={{ color: 'var(--primary-blue)' }}
                  >
                    {favoriteStats.categoriesCount}
                  </div>
                  <div className="text-sm text-gray-600 font-body">Categories Loved</div>
                </div>

                <div 
                  className="p-6 rounded-lg text-center"
                  style={{ 
                    backgroundColor: 'var(--pure-white)',
                    boxShadow: 'var(--shadow-standard-desktop)',
                    borderRadius: '3px'
                  }}
                >
                  <BootstrapIcon 
                    name="award"
                    size={32}
                    className="mx-auto mb-3"
                    style={{ color: 'var(--error-red)' }}
                  />
                  <div 
                    className="text-2xl font-bold mb-1 font-heading"
                    style={{ color: 'var(--primary-blue)' }}
                  >
                    ${favoriteStats.mostExpensive?.price?.toFixed(0) || '0'}
                  </div>
                  <div className="text-sm text-gray-600 font-body">Most Expensive</div>
                </div>
              </div>
            </section>

            {/* Action Panel */}
            <section 
              className="p-8 rounded-xl mb-12"
              style={{ 
                background: 'linear-gradient(135deg, var(--primary-extra-light-blue) 0%, rgba(255,255,255,0.8) 100%)',
                border: '1px solid var(--primary-blue)',
                boxShadow: 'var(--shadow-standard-desktop)',
                borderRadius: '3px'
              }}
            >
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
                <div className="text-center lg:text-left">
                  <h3 
                    className="text-2xl font-bold mb-2 font-heading"
                    style={{ 
                      color: 'var(--primary-blue)',
                      fontFamily: 'var(--font-heading)'
                    }}
                  >
                    Your Curated Collection
                  </h3>
                  <p 
                    className="text-gray-700 font-body max-w-md"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    You have {favoriteItems.length} beautiful pieces in your favorites. 
                    {favoriteStats.totalValue > 0 && ` Total value: $${favoriteStats.totalValue.toFixed(0)}`}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button 
                    className="btn-moema btn-moema-outline"
                    style={{ 
                      height: '48px',
                      padding: '0 24px',
                      borderRadius: '3px'
                    }}
                    onClick={() => {
                      // Export/Share functionality
                      navigator.share?.({
                        title: 'My Modish Style Favorites',
                        text: `Check out my curated collection of ${favoriteItems.length} African fashion pieces!`,
                        url: window.location.href
                      });
                    }}
                  >
                    <BootstrapIcon name="share" size={16} className="mr-2" />
                    Share Collection
                  </button>

                  <button 
                    className="btn-moema btn-moema-secondary"
                    style={{ 
                      height: '48px',
                      padding: '0 24px',
                      borderRadius: '3px'
                    }}
                    onClick={() => {
                      // Download functionality - create a JSON export
                      const exportData = {
                        favorites: favoriteItems,
                        exportDate: new Date().toISOString(),
                        totalItems: favoriteItems.length,
                        totalValue: favoriteStats.totalValue
                      };
                      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `modish-style-favorites-${new Date().toISOString().split('T')[0]}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <BootstrapIcon name="download" size={16} className="mr-2" />
                    Export List
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}