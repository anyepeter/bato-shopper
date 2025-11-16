import { useState, useEffect } from "react";
import { Search, Star, TrendingUp, Clock } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ProductCard } from "./ProductCard";
import { Product } from "../types";

interface PageLayoutProps {
  children: React.ReactNode;
  allFilteredProducts: Product[];
  filterCategory: string;
  searchQuery: string;
  sortBy: string;
  setFilterCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  onNavigateToStoreLocator: (product: Product) => void;
  onNavigateToSizeGuide: () => void;
  onNavigateToReviews: (product: Product) => void;
}

export function PageLayout({
  children,
  allFilteredProducts,
  filterCategory,
  searchQuery,
  sortBy,
  setFilterCategory,
  setSearchQuery,
  setSortBy,
  onAddToCart,
  onQuickView,
  onToggleFavorite,
  isFavorite,
  onNavigateToStoreLocator,
  onNavigateToSizeGuide,
  onNavigateToReviews
}: PageLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activeTrendingTab, setActiveTrendingTab] = useState<'hot' | 'trending'>('hot');
  const [activeLeftTab, setActiveLeftTab] = useState<'categories' | 'brands' | 'collections'>('categories');

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

  // 🔥 FILTER PRODUCTS FOR HOT AND TRENDING TABS
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
    { id: 'all', name: 'All Products', count: allFilteredProducts.length, icon: '🌟' },
    { id: 'dresses', name: 'Dresses', count: allFilteredProducts.filter(p => p.category === 'Dresses').length, icon: '👗' },
    { id: 'tops', name: 'Tops', count: allFilteredProducts.filter(p => p.category === 'Tops').length, icon: '👚' },
    { id: 'sets', name: 'Sets', count: allFilteredProducts.filter(p => p.category === 'Sets').length, icon: '👕' },
    { id: 'traditional', name: 'Traditional', count: allFilteredProducts.filter(p => p.category === 'Traditional').length, icon: '🎭' },
    { id: 'accessories', name: 'Accessories', count: allFilteredProducts.filter(p => p.category === 'Accessories').length, icon: '💎' }
  ];

  const brandData = [
    { name: 'Modish Premium', products: 45, rating: 4.8, featured: true },
    { name: 'African Heritage', products: 32, rating: 4.6, featured: false },
    { name: 'Ankara Dreams', products: 28, rating: 4.7, featured: true },
    { name: 'Traditional Elegance', products: 19, rating: 4.5, featured: false }
  ];

  const getLayoutClasses = () => {
    if (isMobile) {
      return {
        container: 'flex flex-col gap-5 px-0',
        leftPanel: 'hidden',
        middlePanel: 'w-full px-5',
        rightPanel: 'hidden'
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

  const layoutClasses = getLayoutClasses();

  // 🔥 MOBILE MODE: JUST RETURN CHILDREN WITHOUT PANELS
  if (isMobile) {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          backgroundColor: 'var(--light-gray)',
          marginBottom: '20px',
          fontFamily: 'var(--font-body)'
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: 'var(--light-gray)',
        marginBottom: '20px',
        fontFamily: 'var(--font-body)'
      }}
    >
      {/* 🔥 FIXED HEIGHT CONTAINER FOR INDEPENDENT SCROLLING */}
      <div 
        className={layoutClasses.container}
        style={{
          height: 'calc(100vh - 65px)', // Full height minus header
          maxHeight: 'calc(100vh - 65px)'
        }}
      >
        {/* 🔥 LEFT PANEL WITH INDEPENDENT SCROLLING */}
        <div 
          className={layoutClasses.leftPanel}
          style={{ 
            height: '100%',
            maxHeight: '100%'
          }}
        >
          <div className="space-y-5 h-full">
            <div 
              className="p-5 rounded"
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div className="space-y-4">
                <h3 className="font-heading text-lg text-gray-800">Search & Filter</h3>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 font-body"
                    style={{
                      borderRadius: 'var(--radius-xl)',
                      backgroundColor: 'var(--input-background)',
                      border: '1px solid var(--border)',
                      fontFamily: 'var(--font-body)'
                    }}
                  />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger style={{ borderRadius: 'var(--radius-xl)', fontFamily: 'var(--font-body)' }}>
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div 
              className="p-5 rounded"
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div className="flex gap-1 mb-4">
                {[
                  { id: 'categories', label: 'Categories' },
                  { id: 'brands', label: 'Brands' },
                  { id: 'collections', label: 'Collections' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveLeftTab(tab.id as any)}
                    className="px-3 py-2 text-sm font-medium transition-all"
                    style={{
                      backgroundColor: activeLeftTab === tab.id ? 'var(--primary-blue)' : 'transparent',
                      color: activeLeftTab === tab.id ? 'var(--pure-white)' : 'var(--medium-gray)',
                      borderRadius: 'var(--radius-md)',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {activeLeftTab === 'categories' && (
                  <>
                    {categoryData.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setFilterCategory(category.id)}
                        className="w-full flex items-center justify-between p-3 rounded transition-all text-left"
                        style={{
                          backgroundColor: filterCategory === category.id ? 'var(--primary-extra-light-blue)' : 'var(--light-gray)',
                          borderRadius: 'var(--radius-md)',
                          fontFamily: 'var(--font-body)'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium text-gray-700">{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">({category.count})</span>
                      </button>
                    ))}
                  </>
                )}

                {activeLeftTab === 'brands' && (
                  <>
                    {brandData.map((brand, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 rounded"
                        style={{
                          backgroundColor: 'var(--light-gray)',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">{brand.name}</span>
                            {brand.featured && (
                              <span 
                                className="px-2 py-1 text-xs rounded"
                                style={{
                                  backgroundColor: 'var(--primary-blue)',
                                  color: 'var(--pure-white)',
                                  borderRadius: 'var(--radius-sm)'
                                }}
                              >
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{brand.products} products</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{brand.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {activeLeftTab === 'collections' && (
                  <div className="space-y-3">
                    {['New Arrivals', 'Best Sellers', 'Sale Items', 'Premium Collection'].map((collection, index) => (
                      <button
                        key={index}
                        className="w-full p-3 rounded text-left transition-all"
                        style={{
                          backgroundColor: 'var(--light-gray)',
                          borderRadius: 'var(--radius-md)',
                          fontFamily: 'var(--font-body)'
                        }}
                      >
                        <span className="font-medium text-gray-700">{collection}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 🔥 TABLET MODE: TRENDING SECTION */}
            {isTablet && (
              <div 
                className="p-5 rounded"
                style={{ 
                  backgroundColor: 'var(--pure-white)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <h3 className="font-heading text-lg text-gray-800">Trending</h3>
                  </div>

                  <div className="flex gap-1">
                    {[
                      { id: 'hot', label: '🔥 Hot', icon: TrendingUp },
                      { id: 'trending', label: '📈 Trending', icon: Clock }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTrendingTab(tab.id as any)}
                        className="px-3 py-2 text-sm font-medium transition-all flex items-center gap-2"
                        style={{
                          backgroundColor: activeTrendingTab === tab.id ? 'var(--primary-blue)' : 'transparent',
                          color: activeTrendingTab === tab.id ? 'var(--pure-white)' : 'var(--medium-gray)',
                          borderRadius: 'var(--radius-md)',
                          fontFamily: 'var(--font-body)'
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {(activeTrendingTab === 'hot' ? getHotProducts() : getTrendingProducts()).map((product) => (
                      <div key={product.id} className="w-full">
                        <ProductCard
                          product={product}
                          onAddToCart={onAddToCart}
                          onQuickView={onQuickView}
                          onToggleFavorite={onToggleFavorite}
                          isFavorite={isFavorite(product.id)}
                          onNavigateToStoreLocator={onNavigateToStoreLocator}
                          onNavigateToSizeGuide={onNavigateToSizeGuide}
                          onNavigateToReviews={onNavigateToReviews}
                          style={{
                            backgroundColor: 'var(--pure-white)',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🔥 MIDDLE PANEL - MAIN CONTENT WITH INDEPENDENT SCROLLING */}
        <div 
          className={layoutClasses.middlePanel}
          style={{ 
            height: '100%',
            maxHeight: '100%'
          }}
        >
          <div className="space-y-5 h-full">
            {children}
          </div>
        </div>

        {/* 🔥 RIGHT PANEL - DESKTOP ONLY WITH INDEPENDENT SCROLLING */}
        {!isTablet && (
          <div 
            className={layoutClasses.rightPanel}
            style={{ 
              height: '100%',
              maxHeight: '100%'
            }}
          >
            <div className="space-y-5 h-full" style={{ paddingTop: '0px' }}>
              <div 
                className="p-5 rounded"
                style={{ 
                  backgroundColor: 'var(--pure-white)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-md)',
                  paddingTop: '0px',
                  marginTop: '0px'
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <h3 className="font-heading text-lg text-gray-800">Trending</h3>
                  </div>

                  <div className="flex gap-1">
                    {[
                      { id: 'hot', label: '🔥 Hot', icon: TrendingUp },
                      { id: 'trending', label: '📈 Trending', icon: Clock }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTrendingTab(tab.id as any)}
                        className="px-3 py-2 text-sm font-medium transition-all flex items-center gap-2"
                        style={{
                          backgroundColor: activeTrendingTab === tab.id ? 'var(--primary-blue)' : 'transparent',
                          color: activeTrendingTab === tab.id ? 'var(--pure-white)' : 'var(--medium-gray)',
                          borderRadius: 'var(--radius-md)',
                          fontFamily: 'var(--font-body)'
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {(activeTrendingTab === 'hot' ? getHotProducts() : getTrendingProducts()).map((product) => (
                      <div key={product.id} className="w-full">
                        <ProductCard
                          product={product}
                          onAddToCart={onAddToCart}
                          onQuickView={onQuickView}
                          onToggleFavorite={onToggleFavorite}
                          isFavorite={isFavorite(product.id)}
                          onNavigateToStoreLocator={onNavigateToStoreLocator}
                          onNavigateToSizeGuide={onNavigateToSizeGuide}
                          onNavigateToReviews={onNavigateToReviews}
                          style={{
                            backgroundColor: 'var(--pure-white)',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}