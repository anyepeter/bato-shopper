import React, { memo, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Product } from '../../types';
import { measureComponentRender } from '../../utils/performanceHelpers';

interface OptimizedProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: boolean;
  className?: string;
}

/**
 * Optimized ProductCard with performance enhancements
 * - Memoized to prevent unnecessary re-renders
 * - Optimized event handlers with useCallback
 * - Memoized computed values
 * - Performance monitoring in development
 */
export const OptimizedProductCard = memo<OptimizedProductCardProps>(({
  product,
  onAddToCart,
  onQuickView,
  onToggleFavorite,
  isFavorite,
  className = ''
}) => {
  // Performance monitoring (development only)
  const endMeasure = measureComponentRender('OptimizedProductCard');
  React.useEffect(() => endMeasure, [endMeasure]);

  // Memoized event handlers to prevent child re-renders
  const handleAddToCart = useCallback(() => {
    const defaultSize = product.sizes?.[0] || 'M';
    const defaultColor = product.colors?.[0] || 'Default';
    onAddToCart(product, defaultSize, defaultColor);
  }, [product, onAddToCart]);

  const handleQuickView = useCallback(() => {
    onQuickView(product);
  }, [product, onQuickView]);

  const handleToggleFavorite = useCallback(() => {
    onToggleFavorite(product);
  }, [product, onToggleFavorite]);

  // Memoized computed values
  const computedValues = useMemo(() => {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercentage = hasDiscount 
      ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
      : 0;
    
    const badgeColor = product.badge === 'Sale' 
      ? 'var(--error-red)' 
      : product.badge === 'New' 
        ? 'var(--success-green)' 
        : 'var(--primary-blue)';

    return {
      hasDiscount,
      discountPercentage,
      badgeColor
    };
  }, [product.originalPrice, product.price, product.badge]);

  const { hasDiscount, discountPercentage, badgeColor } = computedValues;

  // Memoized star rating component
  const StarRating = useMemo(() => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < fullStars || (i === fullStars && hasHalfStar)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      );
    }

    return <div className="flex items-center gap-1">{stars}</div>;
  }, [product.rating]);

  return (
    <motion.div
      className={`group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}
      style={{
        backgroundColor: 'var(--pure-white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-standard-desktop)'
      }}
      whileHover={{ 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        
        {/* Badge */}
        {product.badge && (
          <div
            className="absolute top-3 left-3 px-2 py-1 text-xs font-medium text-white rounded"
            style={{ 
              backgroundColor: badgeColor,
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {product.badge}
            {hasDiscount && ` -${discountPercentage}%`}
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button
            onClick={handleQuickView}
            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4 text-gray-700" />
          </motion.button>
          
          <motion.button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 hover:bg-white text-gray-700'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-heading font-medium text-lg mb-2 line-clamp-2" style={{ color: 'var(--primary-blue)' }}>
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          {StarRating}
          <span className="text-sm text-gray-500 font-body">
            ({product.reviewCount || 0})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-heading font-medium text-xl" style={{ color: 'var(--primary-blue)' }}>
            ${product.price}
          </span>
          {hasDiscount && (
            <span className="text-sm line-through text-gray-500 font-body">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          className="w-full btn-moema-primary flex items-center justify-center gap-2"
          style={{
            backgroundColor: 'var(--primary-blue)',
            color: 'var(--pure-white)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            border: 'none',
            fontFamily: 'var(--font-body)',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';