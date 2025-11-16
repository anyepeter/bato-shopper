import React, { useState, useEffect } from "react";
import { ArrowLeft, Heart, ShoppingCart, Star, Share2, Trash2, ShoppingBag, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FavoriteItem, Product } from "../../types";

interface MobileFavoritesPageProps {
  favoriteItems: FavoriteItem[];
  allProducts: Product[];
  onNavigateBack: () => void;
  onRemoveFromFavorites: (productId: number) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
}

export function MobileFavoritesPage({
  favoriteItems,
  allProducts,
  onNavigateBack,
  onRemoveFromFavorites,
  onAddToCart,
  onQuickView,
  onToggleFavorite,
  isFavorite
}: MobileFavoritesPageProps) {
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Ensure favoriteItems is always an array with null checks
  const safeFavoriteItems = favoriteItems || [];
  
  // 🔥 DEBUG: Log basic favorites data (before filteredItems initialization)
  console.log('🔥 MobileFavoritesPage - Received favoriteItems:', favoriteItems);
  console.log('🔥 MobileFavoritesPage - Safe favoriteItems count:', safeFavoriteItems.length);
  console.log('🔥 MobileFavoritesPage - All products count:', allProducts?.length);
  console.log('🔥 MobileFavoritesPage - Sample favoriteItem:', safeFavoriteItems[0]);
  console.log('🔥 MobileFavoritesPage - selectedCategory:', selectedCategory);
  
  // Safely extract categories with comprehensive null checks
  const categories = ['all', ...new Set(
    safeFavoriteItems
      .filter(item => item && item.category && typeof item.category === 'string') // Filter out items without valid category
      .map(item => item.category.toLowerCase())
  )];
  
  // More robust filtering with debugging
  const filteredItems = React.useMemo(() => {
    if (selectedCategory === 'all') {
      console.log('🔥 MobileFavoritesPage - Showing all items:', safeFavoriteItems.length);
      return safeFavoriteItems;
    } else {
      const filtered = safeFavoriteItems.filter(item => {
        const hasValidCategory = item && item.category && typeof item.category === 'string';
        if (!hasValidCategory) {
          console.log('🚨 Item missing category:', item);
          return false;
        }
        const matches = item.category.toLowerCase() === selectedCategory.toLowerCase();
        return matches;
      });
      console.log(`🔥 MobileFavoritesPage - Filtered by '${selectedCategory}':`, filtered.length);
      return filtered;
    }
  }, [safeFavoriteItems, selectedCategory]);

  // Debug logging for filteredItems after initialization
  React.useEffect(() => {
    console.log('🔥🔥🔥 MOBILE FAVORITES DETAILED DEBUG 🔥🔥🔥');
    console.log('🔥 MobileFavoritesPage - filteredItems count:', filteredItems?.length);
    console.log('🔥 MobileFavoritesPage - filteredItems data:', filteredItems);
    console.log('🔥 MobileFavoritesPage - localStorage raw:', localStorage.getItem('modish-style-favorites'));
    
    // Check each item's validity
    if (filteredItems && filteredItems.length > 0) {
      filteredItems.forEach((item, index) => {
        console.log(`🔥 Item ${index + 1}:`, {
          id: item?.id,
          name: item?.name,
          category: item?.category,
          hasImage: !!item?.image,
          hasPrice: item?.price !== undefined,
          fullItem: item
        });
      });
    }
  }, [filteredItems]);

  const handleRemoveFromFavorites = (itemId: number) => {
    if (!itemId) return;
    setRemovingItemId(itemId);
    setTimeout(() => {
      onRemoveFromFavorites(itemId);
      setRemovingItemId(null);
    }, 300);
  };

  const handleAddToCart = (item: FavoriteItem) => {
    if (!item || !item.id) return;
    
    const product = allProducts.find(p => p.id === item.id);
    if (product && product.sizes?.length > 0 && product.colors?.length > 0) {
      onAddToCart(product, product.sizes[0], product.colors[0]);
    }
  };

  const getColorCode = (colorName: string) => {
    if (!colorName || typeof colorName !== 'string') return '#6b7280';
    
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

  const renderStars = (rating: number) => {
    if (typeof rating !== 'number' || isNaN(rating)) {
      rating = 0; // Default to 0 if rating is invalid
    }
    
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

  const formatPrice = (price: any) => {
    return (typeof price === 'number' && !isNaN(price) ? price : 0).toFixed(2);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ 
        backgroundColor: '#000000',
        fontFamily: 'var(--font-body)'
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center justify-between p-4"
        style={{ 
          background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
          paddingTop: '60px'
        }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onNavigateBack}
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </motion.button>

        <div className="text-center">
          <h1 className="text-white text-lg font-heading">My Favorites</h1>
          <p className="text-white/70 text-sm font-body">{safeFavoriteItems.length} items loved</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <Share2 className="h-5 w-5 text-white" />
        </motion.button>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 py-3"
      >
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className="px-4 py-2 whitespace-nowrap transition-all"
              style={{
                backgroundColor: selectedCategory === category ? 'var(--primary-blue)' : 'rgba(255,255,255,0.1)',
                color: selectedCategory === category ? 'var(--pure-white)' : 'rgba(255,255,255,0.8)',
                border: selectedCategory === category ? 'none' : '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px'
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Favorites Items */}
      <div className="flex-1 overflow-y-auto pb-20" style={{ paddingTop: '10px' }}>
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-96 px-6"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                className="mb-6"
              >
                <Heart className="h-20 w-20 text-white/30" />
              </motion.div>
              <h3 className="text-white text-xl font-heading mb-2">No favorites yet</h3>
              <p className="text-white/70 text-center font-body mb-6">
                Start exploring and tap the heart icon on items you love
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onNavigateBack}
                className="btn-moema btn-moema-sm btn-moema-primary"
                style={{
                  backgroundColor: 'var(--primary-blue)',
                  color: 'var(--pure-white)',
                  borderRadius: '25px',
                  padding: '15px 30px',
                  height: 'auto'
                }}
              >
                Discover Fashion
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 gap-4 px-4">
              {filteredItems.map((item, index) => {
                // Create fallback values for any missing data
                const safeItem = {
                  id: item?.id || 0,
                  name: item?.name || 'Untitled Product',
                  price: item?.price || 0,
                  originalPrice: item?.originalPrice,
                  image: item?.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
                  category: item?.category || 'uncategorized',
                  rating: item?.rating || 0,
                  sizes: item?.sizes || [],
                  colors: item?.colors || [],
                  badge: item?.badge,
                  isNew: item?.isNew,
                  isBestSeller: item?.isBestSeller,
                  discount: item?.discount
                };
                
                console.log(`🔥 Rendering favorite item ${index + 1}:`, safeItem);
                
                return (
                <motion.div
                  key={safeItem.id || `fallback-${index}`}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ 
                    opacity: removingItemId === safeItem.id ? 0 : 1,
                    y: removingItemId === safeItem.id ? -50 : 0,
                    scale: removingItemId === safeItem.id ? 0.8 : 1
                  }}
                  exit={{ opacity: 0, y: -50, scale: 0.8 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    damping: 20,
                    stiffness: 300
                  }}
                  className="relative overflow-hidden rounded-2xl group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {/* Product Image */}
                  <motion.div 
                    className="relative aspect-[3/4] overflow-hidden rounded-t-2xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <img
                      src={safeItem.image}
                      alt={safeItem.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Badge */}
                    {safeItem.badge && (
                      <div 
                        className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: safeItem.badge === 'Sale' ? '#ef4444' : 
                                         safeItem.badge === 'New' ? '#10b981' : 'var(--primary-blue)',
                          color: 'var(--pure-white)'
                        }}
                      >
                        {safeItem.badge}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromFavorites(safeItem.id);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                      >
                        <Heart className="h-4 w-4 fill-red-400 text-red-400" />
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(safeItem);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                      >
                        <ShoppingCart className="h-4 w-4 text-white" />
                      </motion.button>
                    </div>

                    {/* Price Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-heading text-lg">
                          ${formatPrice(safeItem.price)}
                        </span>
                        {safeItem.originalPrice && typeof safeItem.originalPrice === 'number' && (
                          <span className="text-white/60 text-sm line-through">
                            ${formatPrice(safeItem.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Product Details */}
                  <div className="p-3">
                    <h3 className="text-white font-heading text-sm mb-1 leading-tight line-clamp-2">
                      {safeItem.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(safeItem.rating)}
                      <span className="text-white/60 text-xs">
                        ({safeItem.rating})
                      </span>
                    </div>

                    {/* Colors Available */}
                    {safeItem.colors && Array.isArray(safeItem.colors) && safeItem.colors.length > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-white/60 text-xs">Colors:</span>
                        <div className="flex gap-1">
                          {safeItem.colors.slice(0, 3).map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-3 h-3 rounded-full border border-white/30"
                              style={{ backgroundColor: getColorCode(color) }}
                            />
                          ))}
                          {safeItem.colors.length > 3 && (
                            <span className="text-white/60 text-xs">+{safeItem.colors.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const product = allProducts.find(p => p.id === safeItem.id);
                          if (product) onQuickView(product);
                        }}
                        className="flex-1 py-2 text-xs font-medium flex items-center justify-center"
                        style={{
                          backgroundColor: '#5825efff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          textAlign: 'center'
                        }}
                      >
                        Quick View
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(safeItem)}
                        className="flex-1 mobile-blue-button flex items-center justify-center gap-1"
                        style={{
                          backgroundColor: '#5825efff',
                          color: 'white',
                          fontWeight: '500',
                          fontSize: '12px',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                          border: 'none',
                          height: '2.5rem',
                          borderRadius: '8px',
                          fontFamily: 'var(--font-body)',
                          textAlign: 'center'
                        }}
                      >
                        <ShoppingCart className="h-3 w-3" />
                        Add
                      </motion.button>
                    </div>
                  </div>

                  {/* Shimmer Effect */}
                  <div 
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                      transform: 'translateX(-100%)',
                      animation: `shimmer 4s infinite ${index * 0.5}s`
                    }}
                  />
                </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}