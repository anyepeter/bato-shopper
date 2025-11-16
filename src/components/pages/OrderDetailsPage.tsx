import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Package, Truck, MapPin, Calendar, Clock, Star, 
  Eye, Share2, MessageCircle, Download, Print, Phone, Mail,
  CheckCircle2, AlertCircle, Info, CreditCard, User, Home,
  ShoppingBag, Gift, ThumbsUp, Heart, Copy, ExternalLink
} from 'lucide-react';
import { useApp } from '../AppProvider';

interface OrderDetailsPageProps {
  onNavigateBack?: () => void;
  onNavigateToPage?: (page: string) => void;
}

export const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ onNavigateBack, onNavigateToPage }) => {
  const { state, actions, auth } = useApp();
  const [copiedMessage, setCopiedMessage] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('items');

  // Get order data from state
  const order = state?.selectedOrderDetails;
  const isMobile = state?.isMobile || false;

  // Handle back navigation
  const handleBack = useCallback(() => {
    actions?.setSelectedOrderDetails?.(null);
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      actions?.navigateToPage?.('orders');
    }
  }, [actions, onNavigateBack]);

  // Handle copy functions
  const handleCopy = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessage(`${type} copied!`);
      setTimeout(() => setCopiedMessage(''), 2000);
    });
  }, []);

  // Handle track order
  const handleTrackOrder = useCallback(() => {
    if (order?.trackingNumber) {
      actions?.setTrackingData?.({
        trackingNumber: order.trackingNumber,
        orderNumber: order.orderNumber,
        orderData: order
      });
      if (onNavigateToPage) {
        onNavigateToPage('package-tracking');
      } else {
        actions?.navigateToPage?.('package-tracking');
      }
    }
  }, [order, actions, onNavigateToPage]);

  // Handle contact vendor
  const handleContactVendor = useCallback(() => {
    console.log('Contacting vendor:', order?.vendor?.name);
    
    // Open the appropriate chat based on user type
    const isAdmin = state?.isAdminMode || auth?.currentUser?.isAdmin;
    
    if (isAdmin) {
      console.log('🎯 ADMIN MODE DETECTED - Opening AdminChatRoom to contact vendor');
      actions?.setIsChatOpen?.(false);
      actions?.setIsAdminChatOpen?.(true);
    } else {
      console.log('🎯 CUSTOMER MODE - Opening regular ChatRoom to contact vendor');
      actions?.setIsAdminChatOpen?.(false);
      actions?.setIsChatOpen?.(true);
    }
  }, [order, state?.isAdminMode, auth?.currentUser?.isAdmin, actions]);

  // Handle reorder
  const handleReorder = useCallback(() => {
    console.log('Reordering items from:', order?.orderNumber);
    // Navigate to home page for order again functionality
    if (onNavigateToPage) {
      onNavigateToPage('home');
    } else {
      actions?.navigateToPage?.('home');
    }
  }, [order, onNavigateToPage, actions]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-medium-gray font-body">Loading order details...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      delivered: '#0fa342',
      in_transit: '#2b2bf7',
      processing: '#6e29f6ff',
      cancelled: '#e74c3c'
    };
    return colors[status as keyof typeof colors] || colors.processing;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle2;
      case 'in_transit': return Truck;
      case 'processing': return Clock;
      case 'cancelled': return AlertCircle;
      default: return Package;
    }
  };

  const StatusIcon = getStatusIcon(order.status);

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: isMobile ? '#000000' : 'var(--light-gray)',
        background: isMobile ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)' : 'var(--light-gray)',
        fontFamily: 'var(--font-body)',
        paddingBottom: isMobile ? 'calc(80px - 8px + env(safe-area-inset-bottom))' : '0'
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 p-4 md:p-6"
        style={{
          background: 'transparent',
          borderBottom: isMobile ? 'none' : '1px solid var(--border)',
          boxShadow: 'none',
          borderRadius: isMobile ? '0 0 8px 8px' : '0'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="flex items-center justify-center w-12 h-12"
              style={{
                background: isMobile 
                  ? 'linear-gradient(135deg, #ff1744, #ff6b35)' 
                  : 'var(--primary-blue)',
                color: 'var(--pure-white)',
                borderRadius: isMobile ? '8px' : '3px',
                boxShadow: isMobile 
                  ? '0 4px 16px rgba(255, 23, 68, 0.6)' 
                  : 'none',
                border: isMobile ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            
            <div>
              <h1 
                className="font-heading"
                style={{ 
                  color: isMobile ? '#ffffff' : 'var(--primary-blue)',
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: '700',
                  textShadow: isMobile ? '0 2px 8px rgba(0, 0, 0, 0.8)' : 'none'
                }}
              >
                📦 Order Details
              </h1>
              <p 
                className="text-sm font-body"
                style={{ 
                  color: isMobile ? 'rgba(255, 255, 255, 0.8)' : 'var(--medium-gray)',
                  textShadow: isMobile ? '0 1px 4px rgba(0, 0, 0, 0.6)' : 'none'
                }}
              >
                {order.orderNumber}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {!isMobile && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopy(order.orderNumber, 'Order number')}
                  className="p-2 rounded-lg"
                  style={{
                    background: 'var(--primary-extra-light-blue)',
                    color: 'var(--primary-blue)'
                  }}
                >
                  <Copy className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg"
                  style={{
                    background: 'var(--primary-extra-light-blue)',
                    color: 'var(--primary-blue)'
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-4 md:p-6 space-y-6">
        
        {/* Order Status Card - Very Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden"
          style={{
            background: isMobile 
              ? 'linear-gradient(135deg, rgba(43, 43, 247, 0.15), rgba(110, 41, 246, 0.15))' 
              : 'var(--pure-white)',
            border: isMobile 
              ? '1px solid rgba(110, 41, 246, 0.3)' 
              : 'var(--border-standard-desktop)',
            borderRadius: isMobile ? '8px' : '3px',
            boxShadow: isMobile 
              ? '0 8px 32px rgba(43, 43, 247, 0.3)' 
              : 'var(--shadow-standard-desktop)',
            backdropFilter: isMobile ? 'blur(20px)' : 'none',
            padding: '24px'
          }}
        >
          {/* Animated Background */}
          {isMobile && (
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                background: 'linear-gradient(45deg, #2b2bf7, #4040f8, #6e29f6ff)',
                backgroundSize: '300% 300%'
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}

          <div className="relative z-10">
            {/* Large Status Display */}
            <div className="text-center mb-6">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4"
                style={{
                  background: `linear-gradient(135deg, ${getStatusColor(order.status)}, ${getStatusColor(order.status)}80)`,
                  boxShadow: `0 8px 32px ${getStatusColor(order.status)}40`
                }}
              >
                <StatusIcon 
                  className="h-12 w-12 text-white" 
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                />
              </motion.div>

              <h2 
                className="font-heading font-bold mb-2"
                style={{
                  fontSize: isMobile ? '28px' : '24px',
                  color: isMobile ? '#ffffff' : 'var(--primary-blue)',
                  textShadow: isMobile ? '0 2px 8px rgba(0, 0, 0, 0.8)' : 'none'
                }}
              >
                {order.statusText}
              </h2>

              <p 
                className="font-body"
                style={{
                  fontSize: '16px',
                  color: isMobile ? 'rgba(255, 255, 255, 0.8)' : 'var(--medium-gray)',
                  textShadow: isMobile ? '0 1px 4px rgba(0, 0, 0, 0.6)' : 'none'
                }}
              >
                Order placed on {new Date(order.orderDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>

              {order.estimatedDelivery && (
                <p 
                  className="font-body mt-2"
                  style={{
                    fontSize: '14px',
                    color: isMobile ? 'rgba(255, 255, 255, 0.7)' : 'var(--dark-gray)',
                    textShadow: isMobile ? '0 1px 2px rgba(0, 0, 0, 0.6)' : 'none'
                  }}
                >
                  📅 Expected delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Progress Bar for In Transit Orders */}
            {order.status === 'in_transit' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: isMobile ? '#ffffff' : 'var(--primary-blue)' }}
                  >
                    🚚 On the way
                  </span>
                  <span 
                    className="text-sm"
                    style={{ color: isMobile ? 'rgba(255, 255, 255, 0.8)' : 'var(--medium-gray)' }}
                  >
                    75% complete
                  </span>
                </div>
                <div 
                  className="w-full h-3 rounded-full overflow-hidden"
                  style={{ backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.2)' : 'var(--light-gray)' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${getStatusColor(order.status)}, ${getStatusColor(order.status)}cc)`
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'}`}>
              {order.trackingNumber && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTrackOrder}
                  className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold"
                  style={{
                    background: isMobile 
                      ? 'linear-gradient(135deg, #2b2bf7, #4040f8)' 
                      : 'var(--primary-blue)',
                    color: '#ffffff',
                    boxShadow: isMobile 
                      ? '0 4px 16px rgba(43, 43, 247, 0.4)' 
                      : 'var(--shadow-standard-desktop)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: isMobile ? '16px' : '14px'
                  }}
                >
                  <Package className="h-5 w-5" />
                  📦 Track Package
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContactVendor}
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold"
                style={{
                  background: isMobile 
                    ? 'linear-gradient(135deg, #0fa342, #028b31)' 
                    : 'var(--success-green)',
                  color: '#ffffff',
                  boxShadow: isMobile 
                    ? '0 4px 16px rgba(15, 163, 66, 0.4)' 
                    : 'var(--shadow-standard-desktop)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: isMobile ? '16px' : '14px'
                }}
              >
                <MessageCircle className="h-5 w-5" />
                💬 Contact Seller
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReorder}
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold"
                style={{
                  background: isMobile 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'transparent',
                  color: isMobile ? '#ffffff' : 'var(--primary-blue)',
                  border: isMobile 
                    ? '1px solid rgba(255, 255, 255, 0.3)' 
                    : '1px solid var(--primary-blue)',
                  backdropFilter: isMobile ? 'blur(10px)' : 'none',
                  fontSize: isMobile ? '16px' : '14px'
                }}
              >
                <ShoppingBag className="h-5 w-5" />
                🔄 Order Again
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Order Items - Expandable Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden"
          style={{
            background: isMobile 
              ? 'linear-gradient(135deg, rgba(43, 43, 247, 0.1), rgba(110, 41, 246, 0.1))' 
              : 'var(--pure-white)',
            border: isMobile 
              ? '1px solid rgba(110, 41, 246, 0.2)' 
              : 'var(--border-standard-desktop)',
            borderRadius: isMobile ? '8px' : '3px',
            boxShadow: isMobile 
              ? '0 4px 16px rgba(43, 43, 247, 0.2)' 
              : 'var(--shadow-standard-desktop)',
            backdropFilter: isMobile ? 'blur(10px)' : 'none'
          }}
        >
          {/* Section Header */}
          <motion.button
            whileHover={{ backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.05)' : 'var(--primary-extra-light-blue)' }}
            onClick={() => setExpandedSection(expandedSection === 'items' ? null : 'items')}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: isMobile 
                    ? 'linear-gradient(135deg, #2b2bf7, #4040f8)' 
                    : 'var(--primary-blue)',
                  color: '#ffffff'
                }}
              >
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 
                  className="font-heading font-semibold"
                  style={{
                    color: isMobile ? '#ffffff' : 'var(--primary-blue)',
                    fontSize: '18px',
                    textShadow: isMobile ? '0 1px 4px rgba(0, 0, 0, 0.6)' : 'none'
                  }}
                >
                  🛍️ Items Ordered ({order.items.length})
                </h3>
                <p 
                  className="text-sm font-body"
                  style={{
                    color: isMobile ? 'rgba(255, 255, 255, 0.7)' : 'var(--medium-gray)',
                    textShadow: isMobile ? '0 1px 2px rgba(0, 0, 0, 0.6)' : 'none'
                  }}
                >
                  Tap to {expandedSection === 'items' ? 'hide' : 'view'} details
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expandedSection === 'items' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowLeft 
                className="h-5 w-5 transform rotate-90"
                style={{ color: isMobile ? '#ffffff' : 'var(--primary-blue)' }}
              />
            </motion.div>
          </motion.button>

          {/* Items List */}
          <AnimatePresence>
            {expandedSection === 'items' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t"
                style={{ borderColor: isMobile ? 'rgba(255, 255, 255, 0.1)' : 'var(--border)' }}
              >
                <div className="p-4 space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg"
                      style={{
                        background: 'transparent',
                        border: isMobile 
                          ? '1px solid rgba(255, 255, 255, 0.15)' 
                          : '1px solid var(--border)',
                        backdropFilter: isMobile ? 'blur(10px)' : 'none'
                      }}
                    >
                      {/* Product Image */}
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        className="relative flex-shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          style={{ 
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            border: '2px solid rgba(255, 255, 255, 0.2)'
                          }}
                        />
                        <div 
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            background: 'var(--primary-blue)',
                            color: '#ffffff',
                            boxShadow: '0 2px 8px rgba(88, 37, 239, 0.4)'
                          }}
                        >
                          {item.quantity}
                        </div>
                      </motion.div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h4 
                          className="font-heading font-medium mb-1"
                          style={{
                            backgroundColor: 'transparent',
                            color: isMobile ? '#ffffff' : 'var(--primary-blue)',
                            fontSize: '16px',
                            textShadow: isMobile ? '0 1px 4px rgba(0, 0, 0, 0.6)' : 'none'
                          }}
                        >
                          {item.name}
                        </h4>
                        
                        <div className="flex items-center gap-4 mb-2">
                          <div 
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                            style={{
                              background: isMobile 
                                ? 'rgba(255, 255, 255, 0.15)' 
                                : 'var(--primary-extra-light-blue)',
                              color: isMobile ? '#ffffff' : 'var(--primary-blue)'
                            }}
                          >
                            📏 {item.size}
                          </div>
                          <div 
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                            style={{
                              background: isMobile 
                                ? 'rgba(255, 255, 255, 0.15)' 
                                : 'var(--primary-extra-light-blue)',
                              color: isMobile ? '#ffffff' : 'var(--primary-blue)'
                            }}
                          >
                            🎨 {item.color}
                          </div>
                        </div>

                        <p 
                          className="font-body font-bold"
                          style={{
                            color: isMobile ? '#ffffff' : 'var(--primary-blue)',
                            fontSize: '18px',
                            textShadow: isMobile ? '0 1px 4px rgba(0, 0, 0, 0.6)' : 'none'
                          }}
                        >
                          💰 ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-col gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg"
                          style={{
                            background: 'var(--error-red)',
                            color: '#ffffff'
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg"
                          style={{
                            background: isMobile 
                              ? 'rgba(255, 255, 255, 0.15)' 
                              : 'var(--primary-extra-light-blue)',
                            color: isMobile ? '#ffffff' : 'var(--primary-blue)',
                            border: isMobile ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden"
          style={{
            background: isMobile 
              ? 'linear-gradient(135deg, rgba(15, 163, 66, 0.15), rgba(2, 139, 49, 0.15))' 
              : 'var(--pure-white)',
            border: isMobile 
              ? '1px solid rgba(15, 163, 66, 0.3)' 
              : 'var(--border-standard-desktop)',
            borderRadius: isMobile ? '8px' : '3px',
            boxShadow: isMobile 
              ? '0 4px 16px rgba(15, 163, 66, 0.2)' 
              : 'var(--shadow-standard-desktop)',
            backdropFilter: isMobile ? 'blur(10px)' : 'none',
            padding: '24px'
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: isMobile 
                  ? 'linear-gradient(135deg, #0fa342, #028b31)' 
                  : 'var(--success-green)',
                color: '#ffffff'
              }}
            >
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 
              className="font-heading font-bold"
              style={{
                color: isMobile ? '#ffffff' : 'var(--success-green)',
                fontSize: '20px',
                textShadow: isMobile ? '0 2px 8px rgba(0, 0, 0, 0.6)' : 'none'
              }}
            >
              💳 Order Summary
            </h3>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span 
                className="font-body"
                style={{
                  color: isMobile ? 'rgba(255, 255, 255, 0.8)' : 'var(--medium-gray)',
                  fontSize: '16px',
                  textShadow: isMobile ? '0 1px 2px rgba(0, 0, 0, 0.6)' : 'none'
                }}
              >
                🛍️ Subtotal
              </span>
              <span 
                className="font-body font-semibold"
                style={{
                  color: isMobile ? '#ffffff' : 'var(--black)',
                  fontSize: '16px',
                  textShadow: isMobile ? '0 1px 4px rgba(0, 0, 0, 0.6)' : 'none'
                }}
              >
                ${(order.totalAmount - 12.99).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span 
                className="font-body"
                style={{
                  color: isMobile ? 'rgba(255, 255, 255, 0.8)' : 'var(--medium-gray)',
                  fontSize: '16px',
                  textShadow: isMobile ? '0 1px 2px rgba(0, 0, 0, 0.6)' : 'none'
                }}
              >
                🚚 Shipping
              </span>
              <span 
                className="font-body font-semibold"
                style={{
                  color: isMobile ? '#ffffff' : 'var(--black)',
                  fontSize: '16px',
                  textShadow: isMobile ? '0 1px 4px rgba(0, 0, 0, 0.6)' : 'none'
                }}
              >
                $12.99
              </span>
            </div>
            <div 
              className="border-t pt-3"
              style={{ borderColor: isMobile ? 'rgba(255, 255, 255, 0.2)' : 'var(--border)' }}
            >
              <div className="flex items-center justify-between">
                <span 
                  className="font-heading font-bold"
                  style={{
                    color: isMobile ? '#ffffff' : 'var(--success-green)',
                    fontSize: '20px',
                    textShadow: isMobile ? '0 2px 8px rgba(0, 0, 0, 0.6)' : 'none'
                  }}
                >
                  💰 Total
                </span>
                <span 
                  className="font-heading font-bold"
                  style={{
                    color: isMobile ? '#ffffff' : 'var(--success-green)',
                    fontSize: '24px',
                    textShadow: isMobile ? '0 2px 8px rgba(0, 0, 0, 0.6)' : 'none'
                  }}
                >
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Shipping Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="overflow-hidden"
          style={{
            background: isMobile 
              ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(255, 142, 83, 0.15))' 
              : 'var(--pure-white)',
            border: isMobile 
              ? '1px solid rgba(255, 107, 107, 0.3)' 
              : 'var(--border-standard-desktop)',
            borderRadius: isMobile ? '8px' : '3px',
            boxShadow: isMobile 
              ? '0 4px 16px rgba(255, 107, 107, 0.2)' 
              : 'var(--shadow-standard-desktop)',
            backdropFilter: isMobile ? 'blur(10px)' : 'none',
            padding: '24px'
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'var(--error-red)',
                color: '#ffffff'
              }}
            >
              <Home className="h-6 w-6" />
            </div>
            <h3 
              className="font-heading font-bold"
              style={{
                color: isMobile ? '#ffffff' : 'var(--error-red)',
                fontSize: '20px',
                textShadow: isMobile ? '0 2px 8px rgba(0, 0, 0, 0.6)' : 'none'
              }}
            >
              🏠 Delivery Address
            </h3>
          </div>

          <div className="space-y-2">
            <p 
              className="font-body font-semibold"
              style={{
                color: isMobile ? '#ffffff' : 'var(--black)',
                fontSize: '18px',
                textShadow: isMobile ? '0 1px 4px rgba(0, 0, 0, 0.6)' : 'none'
              }}
            >
              👤 {order.shippingAddress.name}
            </p>
            <p 
              className="font-body"
              style={{
                color: isMobile ? 'rgba(255, 255, 255, 0.8)' : 'var(--medium-gray)',
                fontSize: '16px',
                textShadow: isMobile ? '0 1px 2px rgba(0, 0, 0, 0.6)' : 'none',
                lineHeight: '1.5'
              }}
            >
              📍 {order.shippingAddress.address}
            </p>
            <p 
              className="font-body"
              style={{
                color: isMobile ? 'rgba(255, 255, 255, 0.8)' : 'var(--medium-gray)',
                fontSize: '16px',
                textShadow: isMobile ? '0 1px 2px rgba(0, 0, 0, 0.6)' : 'none'
              }}
            >
              🌍 {order.shippingAddress.country}
            </p>
          </div>
        </motion.div>

        {/* Vendor Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="overflow-hidden"
          style={{
            background: isMobile 
              ? 'linear-gradient(135deg, rgba(110, 41, 246, 0.15), rgba(43, 43, 247, 0.15))' 
              : 'var(--pure-white)',
            border: isMobile 
              ? '1px solid rgba(110, 41, 246, 0.3)' 
              : 'var(--border-standard-desktop)',
            borderRadius: isMobile ? '8px' : '3px',
            boxShadow: isMobile 
              ? '0 4px 16px rgba(110, 41, 246, 0.2)' 
              : 'var(--shadow-standard-desktop)',
            backdropFilter: isMobile ? 'blur(10px)' : 'none',
            padding: '24px'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: isMobile 
                    ? 'linear-gradient(135deg, #6e29f6ff, #2b2bf7)' 
                    : 'var(--primary-blue)',
                  color: '#ffffff'
                }}
              >
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 
                  className="font-heading font-bold"
                  style={{
                    color: isMobile ? '#ffffff' : 'var(--primary-blue)',
                    fontSize: '18px',
                    textShadow: isMobile ? '0 2px 8px rgba(0, 0, 0, 0.6)' : 'none'
                  }}
                >
                  🏪 {order.vendor.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(order.vendor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span 
                    className="text-sm font-body"
                    style={{
                      color: isMobile ? 'rgba(255, 255, 255, 0.8)' : 'var(--medium-gray)',
                      textShadow: isMobile ? '0 1px 2px rgba(0, 0, 0, 0.6)' : 'none'
                    }}
                  >
                    {order.vendor.rating} ⭐
                  </span>
                </div>
                <p 
                  className="text-sm font-body"
                  style={{
                    color: isMobile ? 'rgba(255, 255, 255, 0.7)' : 'var(--dark-gray)',
                    textShadow: isMobile ? '0 1px 2px rgba(0, 0, 0, 0.6)' : 'none'
                  }}
                >
                  📍 {order.vendor.location}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContactVendor}
              className="px-4 py-2 rounded-lg font-semibold"
              style={{
                background: isMobile 
                  ? 'linear-gradient(135deg, #0fa342, #028b31)' 
                  : 'var(--success-green)',
                color: '#ffffff',
                fontSize: '14px'
              }}
            >
              💬 Contact
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Copy Message Toast */}
      <AnimatePresence>
        {copiedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div 
              className="px-4 py-2 rounded-lg font-semibold"
              style={{
                background: 'var(--success-green)',
                color: '#ffffff',
                boxShadow: '0 4px 16px rgba(15, 163, 66, 0.4)'
              }}
            >
              ✅ {copiedMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};