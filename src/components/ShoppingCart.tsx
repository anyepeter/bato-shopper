import { CloseIcon, BootstrapIcon } from "./BootstrapIcon";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CartItem } from "../types";

interface ShoppingCartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onUpdateSizeColor: (cartItemId: number, newSize: string, newColor: string) => void;
  onProceedToCheckout?: () => void;
}

export function ShoppingCart({ items, isOpen, onClose, onUpdateQuantity, onRemoveItem, onUpdateSizeColor, onProceedToCheckout }: ShoppingCartProps) {
  const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = totalAmount > 50 ? 0 : 5.99;
  const subtotal = totalAmount;
  const finalTotal = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300"
        onClick={onClose}
        style={{ 
          background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(223,102,13,0.1))' 
        }}
      />
      
      {/* Cart Panel */}
      <div 
        className="fixed right-0 top-0 h-full w-full bg-white z-50 shadow-2xl transform transition-all duration-300 ease-out"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.15), -5px 0 20px rgba(223, 102, 13, 0.1)'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Enhanced Header */}
          <div 
            className="flex items-center justify-between p-8 border-b relative"
            style={{
              background: 'linear-gradient(135deg, var(--pure-white) 0%, var(--primary-extra-light-blue) 100%)',
              borderBottom: '1px solid rgba(223, 102, 13, 0.1)'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-light-blue))',
                  boxShadow: '0 4px 12px rgba(223, 102, 13, 0.3)'
                }}
              >
                <BootstrapIcon name="bag-fill" size={20} color="white" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold text-gray-900">Shopping Cart</h2>
                <p className="text-sm text-gray-500 font-body">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} • ${totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
            
            {/* Enhanced Close Button */}
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'var(--medium-gray)',
                border: '1px solid rgba(223, 102, 13, 0.2)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <CloseIcon size={18} />
            </button>

            {/* Decorative line */}
            <div 
              className="absolute bottom-0 left-8 right-8 h-px"
              style={{
                background: 'linear-gradient(90deg, var(--primary-blue), var(--primary-light-blue), var(--primary-blue))'
              }}
            />
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-12">
                <div 
                  className="w-40 h-40 rounded-full flex items-center justify-center mb-8 relative"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary-extra-light-blue), var(--light-gray))',
                    border: '2px dashed rgba(223, 102, 13, 0.3)'
                  }}
                >
                  <BootstrapIcon name="bag" size={80} color="rgba(223, 102, 13, 0.4)" />
                  <div 
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                      background: 'linear-gradient(45deg, transparent 30%, rgba(223, 102, 13, 0.1) 50%, transparent 70%)'
                    }}
                  />
                </div>
                <h3 className="font-heading text-2xl font-semibold text-gray-700 mb-3">Your cart is empty</h3>
                <p className="text-base text-center text-gray-500 max-w-md font-body leading-relaxed">
                  Discover our beautiful collection of African fashion pieces and add your favorites!
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 btn-moema-gradient-orange btn-moema-rounded-lg px-12 py-4 font-body text-base"
                  style={{ height: '52px' }}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="p-8 space-y-8">
                {items.map((item, index) => (
                  <div 
                    key={`${item.id}-${item.size}-${item.color}`} 
                    className="group relative bg-white rounded-xl p-8 transition-all duration-300 hover:shadow-lg animate-fade-in"
                    style={{
                      border: '1px solid rgba(223, 102, 13, 0.1)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    {/* Product Image */}
                    <div className="flex gap-8">
                      <div className="flex-shrink-0 relative">
                        <div 
                          className="w-56 h-64 rounded-lg overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, var(--light-gray), var(--primary-extra-light-blue))'
                          }}
                        >
                          <ImageWithFallback
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        {/* Quantity badge */}
                        <div 
                          className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{
                            background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-light-blue))',
                            boxShadow: '0 2px 6px rgba(223, 102, 13, 0.4)'
                          }}
                        >
                          {item.quantity}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Product Info */}
                        <div className="mb-4">
                          <h3 className="font-heading font-semibold text-gray-900 line-clamp-2 mb-3 text-lg">
                            {item.product.name}
                          </h3>
                          
                          {/* Size Selector */}
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-600 font-body">Size:</span>
                              <BootstrapIcon name="rulers" size={12} color="var(--primary-blue)" />
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {item.product.sizes.map((size) => (
                                <button
                                  key={size}
                                  onClick={() => onUpdateSizeColor(item.id, size, item.color)}
                                  className={`px-2 py-1 text-xs rounded transition-colors font-body ${
                                    item.size === size
                                      ? 'bg-orange-500 text-white border-orange-500'
                                      : 'border border-gray-300 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Color Selector */}
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-600 font-body">Color:</span>
                              <BootstrapIcon name="palette" size={12} color="var(--primary-blue)" />
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {item.product.colors.map((color) => (
                                <button
                                  key={color}
                                  onClick={() => onUpdateSizeColor(item.id, item.size, color)}
                                  className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                                    item.color === color
                                      ? 'ring-2 ring-orange-400 ring-offset-1'
                                      : 'border-gray-300 hover:border-gray-400'
                                  }`}
                                  style={{ 
                                    backgroundColor: color.toLowerCase(),
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                                  }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span 
                                className="font-heading font-bold text-lg"
                                style={{ color: 'var(--primary-blue)' }}
                              >
                                ${item.product.price.toFixed(2)}
                              </span>
                              <span className="text-xs text-gray-500 font-body">
                                ${(item.product.price * item.quantity).toFixed(2)} total
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div 
                            className="flex items-center gap-1 rounded-lg p-1"
                            style={{
                              backgroundColor: 'rgba(223, 102, 13, 0.05)',
                              border: '1px solid rgba(223, 102, 13, 0.1)'
                            }}
                          >
                            <button
                              className="w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                              style={{
                                backgroundColor: 'var(--pure-white)',
                                color: 'var(--primary-blue)',
                                border: '1px solid rgba(223, 102, 13, 0.2)',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                              }}
                              onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            >
                              <BootstrapIcon name="dash" size={12} />
                            </button>
                            
                            <span 
                              className="w-8 text-center font-heading font-semibold text-sm"
                              style={{ color: 'var(--primary-blue)' }}
                            >
                              {item.quantity}
                            </span>
                            
                            <button
                              className="w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                              style={{
                                backgroundColor: 'var(--pure-white)',
                                color: 'var(--primary-blue)',
                                border: '1px solid rgba(223, 102, 13, 0.2)',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                              }}
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <BootstrapIcon name="plus" size={12} />
                            </button>
                          </div>
                          
                          <button
                            className="w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-red-50"
                            style={{
                              backgroundColor: 'transparent',
                              color: 'var(--error-red)',
                              border: '1px solid rgba(231, 76, 60, 0.2)'
                            }}
                            onClick={() => onRemoveItem(item.id)}
                            title="Remove Item"
                          >
                            <BootstrapIcon name="trash" size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          {items.length > 0 && (
            <div 
              className="border-t p-8 space-y-4"
              style={{
                background: 'linear-gradient(135deg, var(--pure-white) 0%, var(--primary-extra-light-blue) 100%)',
                borderTop: '1px solid rgba(223, 102, 13, 0.1)'
              }}
            >
              {/* Order Summary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-body">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-body">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? (
                      <span style={{ color: 'var(--success-green)' }}>FREE</span>
                    ) : (
                      `${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="text-xs text-gray-500 font-body">
                    Add ${(50 - totalAmount).toFixed(2)} more for free shipping
                  </div>
                )}
                <div 
                  className="h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(223, 102, 13, 0.3), transparent)'
                  }}
                />
                <div className="flex justify-between items-center">
                  <span className="font-heading font-semibold text-lg text-gray-900">Total</span>
                  <span 
                    className="font-heading font-bold text-xl"
                    style={{ color: 'var(--primary-blue)' }}
                  >
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  className="w-full rounded-lg font-heading font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg relative overflow-hidden"
                  style={{ 
                    height: '52px',
                    background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-light-blue))',
                    boxShadow: '0 4px 16px rgba(223, 102, 13, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none'
                  }}
                  onClick={onProceedToCheckout}
                >
                  <BootstrapIcon name="credit-card" size={18} />
                  Proceed to Checkout
                  <div 
                    className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)'
                    }}
                  />
                </button>
                
                <button 
                  className="w-full rounded-lg font-heading font-medium transition-all duration-300 hover:scale-[1.01]"
                  style={{ 
                    height: '44px',
                    backgroundColor: 'var(--pure-white)',
                    color: 'var(--primary-blue)',
                    border: '1px solid rgba(223, 102, 13, 0.3)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onClick={onClose}
                >
                  <BootstrapIcon name="arrow-left" size={16} />
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}