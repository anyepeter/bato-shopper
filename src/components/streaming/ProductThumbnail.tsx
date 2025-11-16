import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BootstrapIcon } from '../BootstrapIcon';
import { Product } from '../../types';

interface ProductThumbnailProps {
  product: Product;
  discountPercentage: number;
  onAddToCart: (size?: string, color?: string) => void;
  onQuickView: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ProductThumbnail({
  product,
  discountPercentage,
  onAddToCart,
  onQuickView,
  onToggleFavorite,
  isFavorite,
  className = '',
  style = {}
}: ProductThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...style,
        // Match screenshot: clean white background with subtle shadow
        backgroundColor: '#ffffff',
        borderRadius: '3px', // Design system constraint
        boxShadow: isHovered 
          ? '0 8px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(223, 102, 13, 0.1)'
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '280px',
        fontFamily: 'var(--font-body)'
      }}
    >
      {/* Product Badge - Match screenshot: Orange NEW badge */}
      {(product.badge || product.isNew || product.isBestSeller) && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            zIndex: 10,
            padding: '4px 8px',
            backgroundColor: '#df660d', // Orange from screenshot
            color: '#ffffff',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '700',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {product.badge || (product.isNew ? 'NEW' : product.isBestSeller ? 'POPULAR' : '')}
        </div>
      )}

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 10,
            padding: '4px 8px',
            backgroundColor: '#e74c3c',
            color: '#ffffff',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '700',
            fontFamily: 'var(--font-heading)'
          }}
        >
          -{discountPercentage}%
        </div>
      )}

      {/* Product Image Container */}
      <div 
        style={{ 
          position: 'relative',
          aspectRatio: '3/4', // Match screenshot proportions
          overflow: 'hidden',
          backgroundColor: '#f8f9fa' // Light background for loading
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transformOrigin: 'center center',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.4s ease-out'
          }}
        />
        
        {/* Hover Action Buttons - Centered horizontally and vertically */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                inset: '0',
                backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px' // Space between buttons
              }}
            >
              {/* Favorite Button */}
              <motion.button
                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.05, duration: 0.25, ease: "easeOut" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                style={{
                  backgroundColor: '#ffffff',
                  color: isFavorite ? '#e74c3c' : '#6b7280',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s ease',
                  transform: 'scale(1)',
                  pointerEvents: 'auto',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title="Add to Favorites"
              >
                <BootstrapIcon 
                  name={isFavorite ? "heart-fill" : "heart"} 
                  style={{ 
                    width: '18px', 
                    height: '18px',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </motion.button>
              
              {/* Quick View Button */}
              <motion.button
                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.25, ease: "easeOut" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView();
                }}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s ease',
                  transform: 'scale(1)',
                  pointerEvents: 'auto',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title="Quick View"
              >
                <BootstrapIcon 
                  name="eye" 
                  style={{ 
                    width: '18px', 
                    height: '18px',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </motion.button>
              
              {/* Add to Cart Button */}
              <motion.button
                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.25, ease: "easeOut" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart();
                }}
                title="Add to Cart"
                style={{
                  backgroundColor: '#df660d', // Orange brand color
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(223, 102, 13, 0.3)',
                  transition: 'all 0.2s ease',
                  transform: 'scale(1)',
                  pointerEvents: 'auto',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.backgroundColor = '#c55a0b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '#df660d';
                }}
              >
                <BootstrapIcon 
                  name="cart-plus" 
                  style={{ 
                    width: '18px', 
                    height: '18px',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Product Info Section - Match screenshot layout */}
      <div style={{ padding: '16px' }}>
        {/* Product Name - Match screenshot typography */}
        <h3 
          style={{
            color: '#1f2937', // Dark gray like screenshot
            fontFamily: 'var(--font-heading)', // Ubuntu
            fontSize: '16px',
            fontWeight: '500',
            lineHeight: '1.4',
            marginBottom: '8px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {product.name}
        </h3>
        
        {/* Rating - Match screenshot: yellow/orange stars */}
        <div 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            marginBottom: '8px'
          }}
        >
          {[...Array(5)].map((_, i) => (
            <BootstrapIcon 
              key={i}
              name={i < Math.floor(product.rating) ? "star-fill" : "star"} 
              style={{ 
                width: '14px',
                height: '14px',
                color: i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db' // Yellow like screenshot
              }}
            />
          ))}
          <span 
            style={{ 
              color: '#6b7280',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              marginLeft: '4px'
            }}
          >
            ({product.rating})
          </span>
        </div>
        
        {/* Price - Match screenshot layout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            style={{ 
              color: '#1f2937', // Dark like screenshot
              fontFamily: 'var(--font-heading)',
              fontSize: '18px',
              fontWeight: '700'
            }}
          >
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span 
              style={{ 
                color: '#9ca3af', // Light gray like screenshot
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                textDecoration: 'line-through'
              }}
            >
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}