import { useState } from "react";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Heart, Star, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem } from "../../types";

interface MobileCartPageProps {
  cartItems: CartItem[];
  onNavigateBack: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onUpdateSizeColor?: (cartItemId: number, newSize: string, newColor: string) => void;
  onProceedToCheckout: () => void;
  onToggleFavorite?: (productId: number) => void;
  isFavorite?: (productId: number) => boolean;
}

export function MobileCartPage({
  cartItems,
  onNavigateBack,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateSizeColor = () => {},
  onProceedToCheckout,
  onToggleFavorite = () => {},
  isFavorite = () => false
}: MobileCartPageProps) {
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const totalAmount = cartItems.reduce((total, item) => {
    const itemPrice = item.incentive ? item.incentive.discountedPrice : item.product.price;
    return total + (itemPrice * item.quantity);
  }, 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleRemoveItem = (itemId: number) => {
    setDeletingItemId(itemId);
    setTimeout(() => {
      onRemoveItem(itemId);
      setDeletingItemId(null);
    }, 300);
  };

  const getColorCode = (colorName: string) => {
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
          <h1 className="text-white text-lg font-heading">My Cart</h1>
          <p className="text-white/70 text-sm font-body">{totalItems} items</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <Share2 className="h-5 w-5 text-white" />
        </motion.button>
      </motion.div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto pb-32" style={{ paddingTop: '20px' }}>
        <AnimatePresence mode="popLayout">
          {cartItems.length === 0 ? (
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
                <ShoppingBag className="h-20 w-20 text-white/30" />
              </motion.div>
              <h3 className="text-white text-xl font-heading mb-2">Your cart is empty</h3>
              <p className="text-white/70 text-center font-body mb-6">
                Discover amazing African fashion and add items to your cart
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onNavigateBack}
                className="btn-moema btn-moema-sm mobile-blue-button"
                style={{
                  backgroundColor: '#5825efff',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '14px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                  border: 'none',
                  height: '3.5rem',
                  borderRadius: '8px',
                  padding: '15px 30px'
                }}
              >
                Start Shopping
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-4 px-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ 
                    opacity: deletingItemId === item.id ? 0 : 1,
                    x: deletingItemId === item.id ? -100 : 0,
                    scale: deletingItemId === item.id ? 0.8 : 1
                  }}
                  exit={{ opacity: 0, x: -100, scale: 0.8 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    damping: 20,
                    stiffness: 300
                  }}
                  className="relative overflow-hidden rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <div className="flex p-4">
                    {/* Product Image */}
                    <motion.div 
                      className="relative w-24 h-24 rounded-xl overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", damping: 20 }}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        style={{ filter: 'brightness(0.9)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </motion.div>

                    {/* Product Details */}
                    <div className="flex-1 ml-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-heading text-sm leading-tight">
                          {item.product.name}
                        </h3>
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => onToggleFavorite(item.product.id)}
                          className="ml-2"
                        >
                          <Heart 
                            className={`h-5 w-5 ${isFavorite(item.product.id) ? 'fill-red-400 text-red-400' : 'text-white/60'}`}
                          />
                        </motion.button>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(item.product.rating)}
                        <span className="text-white/60 text-xs ml-1">({item.product.rating})</span>
                      </div>

                      {/* Size & Color Selectors */}
                      <div className="space-y-2 mb-3">
                        {/* Size Selector */}
                        <div>
                          <span className="text-white/60 text-xs block mb-1">Size:</span>
                          <div className="flex gap-1 flex-wrap">
                            {item.product.sizes.map((size) => (
                              <motion.button
                                key={size}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onUpdateSizeColor(item.id, size, item.color)}
                                className={`px-2 py-1 text-xs rounded transition-colors ${
                                  item.size === size
                                    ? 'text-white'
                                    : 'bg-white/20 text-white/80 hover:bg-white/30'
                                }`}
                                style={{
                                  backgroundColor: item.size === size ? '#5825efff' : undefined
                                }}
                              >
                                {size}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Color Selector */}
                        <div>
                          <span className="text-white/60 text-xs block mb-1">Color:</span>
                          <div className="flex gap-1 flex-wrap">
                            {item.product.colors.map((color) => (
                              <motion.button
                                key={color}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onUpdateSizeColor(item.id, item.size, color)}
                                className={`w-5 h-5 rounded-full border-2 transition-all ${
                                  item.color === color
                                    ? 'ring-2 ring-offset-1 ring-offset-black'
                                    : 'border-white/30 hover:border-white/60'
                                }`}
                                style={{ 
                                  backgroundColor: getColorCode(color),
                                  ...(item.color === color ? { 
                                    '--tw-ring-color': '#5825efff',
                                    ringColor: '#5825efff'
                                  } : {})
                                }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Price & Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-heading text-lg">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          {item.product.originalPrice && (
                            <span className="text-white/50 text-sm line-through">
                              ${(item.product.originalPrice * item.quantity).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1">
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                            >
                              <Minus className="h-3 w-3 text-white" />
                            </motion.button>
                            
                            <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                            
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center mobile-blue-button"
                              style={{ 
                                backgroundColor: '#5825efff',
                                color: 'white',
                                fontWeight: '500',
                                fontSize: '14px',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                                border: 'none',
                                height: '2rem',
                                width: '2rem'
                              }}
                            >
                              <Plus className="h-3 w-3 text-white" />
                            </motion.button>
                          </div>

                          {/* Delete Button */}
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => handleRemoveItem(item.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center ml-2"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                          >
                            <Trash2 className="h-3 w-3 text-red-400" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shimmer Effect */}
                  <div 
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                      transform: 'translateX(-100%)',
                      animation: `shimmer 3s infinite ${index * 0.5}s`
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Checkout Footer */}
      {cartItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.95) 100%)',
            paddingBottom: '34px'
          }}
        >
          <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 font-body">Subtotal ({totalItems} items)</span>
              <span className="text-white font-heading text-lg">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 font-body">Shipping</span>
              <span className="text-green-400 font-body text-sm">FREE</span>
            </div>
            <div className="h-px bg-white/20 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-white font-heading">Total</span>
              <span className="text-white font-heading text-xl">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onProceedToCheckout}
            className="w-full mobile-blue-button flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#5825efff',
              color: 'white',
              fontFamily: 'var(--font-body)',
              fontWeight: '500',
              fontSize: '14px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              border: 'none',
              height: '3.5rem',
              borderRadius: '8px'
            }}
          >
            <ShoppingBag className="h-5 w-5 text-white" />
            <span className="text-white font-heading text-lg">Proceed to Checkout</span>
          </motion.button>
        </motion.div>
      )}

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