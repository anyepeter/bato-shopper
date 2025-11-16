import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Truck, MapPin, Calendar, Clock, Star, ArrowLeft, Filter, Search, RefreshCw, Eye, Share2, MessageCircle } from 'lucide-react';
import { useApp } from '../AppProvider';

// Mock order data with comprehensive details
const mockOrders = [
  {
    id: 'ORD-2024-001',
    orderNumber: '#BTO240001',
    status: 'delivered',
    statusText: 'Delivered',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-18',
    totalAmount: 156.99,
    currency: 'USD',
    trackingNumber: 'BTO1234567890',
    estimatedDelivery: '2024-01-18',
    items: [
      {
        id: 1,
        name: 'African Print Maxi Dress',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjBwcmludCUyMGRyZXNzfGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=300',
        price: 89.99,
        quantity: 1,
        size: 'M',
        color: 'Royal Blue'
      },
      {
        id: 2,
        name: 'Ankara Headwrap Set',
        image: 'https://images.unsplash.com/photo-1583711746432-421ca78dfa92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFua2FyYSUyMGhlYWR3cmFwfGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=300',
        price: 35.00,
        quantity: 2,
        size: 'One Size',
        color: 'Multi-color'
      }
    ],
    shippingAddress: {
      name: 'Sarah Johnson',
      address: '123 Fashion Ave, Style City, SC 12345',
      country: 'United States'
    },
    vendor: {
      name: 'AfroStyle Boutique',
      rating: 4.8,
      location: 'Lagos, Nigeria'
    }
  },
  {
    id: 'ORD-2024-002',
    orderNumber: '#BTO240002',
    status: 'shipped',
    statusText: 'Shipped',
    orderDate: '2024-01-20',
    deliveryDate: null,
    totalAmount: 245.50,
    currency: 'USD',
    trackingNumber: 'BTO2345678901',
    estimatedDelivery: '2024-01-25',
    items: [
      {
        id: 3,
        name: 'Kente Cloth Blazer',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGtlbnRlJTIwY2xvdGh8ZW58MHx8fHwxNjk5MzY1NzM5fDA&ixlib=rb-4.1.0&q=80&w=300',
        price: 189.99,
        quantity: 1,
        size: 'L',
        color: 'Traditional Gold'
      },
      {
        id: 4,
        name: 'Beaded Jewelry Set',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjBqZXdlbHJ5fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=300',
        price: 55.51,
        quantity: 1,
        size: 'One Size',
        color: 'Multicolor'
      }
    ],
    shippingAddress: {
      name: 'Michael Chen',
      address: '456 Market St, Commerce City, NY 10001',
      country: 'United States'
    },
    vendor: {
      name: 'Heritage Crafts Co.',
      rating: 4.9,
      location: 'Accra, Ghana'
    }
  },
  {
    id: 'ORD-2024-003',
    orderNumber: '#BTO240003',
    status: 'processing',
    statusText: 'Processing',
    orderDate: '2024-01-22',
    deliveryDate: null,
    totalAmount: 99.99,
    currency: 'USD',
    trackingNumber: null,
    estimatedDelivery: '2024-01-28',
    items: [
      {
        id: 5,
        name: 'Dashiki Shirt',
        image: 'https://images.unsplash.com/photo-1506629905607-14d04040c8f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGRhc2hpa2l8ZW58MHx8fHwxNjk5MzY1NzM5fDA&ixlib=rb-4.1.0&q=80&w=300',
        price: 69.99,
        quantity: 1,
        size: 'XL',
        color: 'Earth Tones'
      },
      {
        id: 6,
        name: 'African Print Face Mask',
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGZhY2UlMjBtYXNrfGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=300',
        price: 15.00,
        quantity: 2,
        size: 'One Size',
        color: 'Vibrant Print'
      }
    ],
    shippingAddress: {
      name: 'Emma Williams',
      address: '789 Culture Blvd, Heritage Town, CA 90210',
      country: 'United States'
    },
    vendor: {
      name: 'Afrocentric Designs',
      rating: 4.7,
      location: 'Nairobi, Kenya'
    }
  }
];

// Filter options
const filterOptions = [
  { key: 'all', label: 'All Orders', count: mockOrders.length },
  { key: 'delivered', label: 'Delivered', count: mockOrders.filter(o => o.status === 'delivered').length },
  { key: 'shipped', label: 'Shipped', count: mockOrders.filter(o => o.status === 'shipped').length },
  { key: 'processing', label: 'Processing', count: mockOrders.filter(o => o.status === 'processing').length },
];

// Status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return '#10B981';
    case 'shipped': return '#3B82F6';
    case 'processing': return '#F59E0B';
    case 'cancelled': return '#EF4444';
    default: return '#6B7280';
  }
};

interface OrdersPageProps {
  onNavigateBack: () => void;
  onNavigateToPage: (page: string) => void;
}

export function OrdersPage({ onNavigateBack, onNavigateToPage }: OrdersPageProps) {
  const { state, actions } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    let filtered = mockOrders;
    
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(order => order.status === selectedFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  }, [selectedFilter, searchQuery]);

  const handleBack = useCallback(() => {
    onNavigateBack();
  }, [onNavigateBack]);

  const handleTrackOrder = useCallback((order: any) => {
    console.log('Track order:', order);
    // Set the selected order details in the app state for the PackageTrackingPage to access
    actions?.setSelectedOrderDetails?.(order);
    onNavigateToPage('package-tracking');
  }, [onNavigateToPage, actions]);

  const handleViewDetails = useCallback((order: any) => {
    console.log('View order details:', order);
    // Set the selected order details in the app state for the OrderDetailsPage to access
    actions?.setSelectedOrderDetails?.(order);
    onNavigateToPage('order-details');
  }, [onNavigateToPage, actions]);

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: '#000000',
        fontFamily: 'var(--font-body)',
        paddingBottom: isMobile ? 'calc(80px - 8px + env(safe-area-inset-bottom))' : '0'
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="sticky top-0 z-50 p-4 md:p-6"
        style={{
          background: 'transparent',
          border: 'none'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="flex items-center justify-center w-12 h-12 relative overflow-hidden"
              style={{
                background: '#4040f8ff',
                color: '#FFFFFF',
                borderRadius: isMobile ? '8px' : '3px',
                boxShadow: isMobile 
                  ? '0 4px 16px rgba(64, 64, 248, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                  : 'none',
                border: isMobile ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
              }}
            >
              <motion.div
                whileHover={{ x: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.div>
            </motion.button>
            
            <div>
              <motion.h1 
                className="font-heading"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                style={{ 
                  color: '#FFFFFF',
                  fontSize: isMobile ? '28px' : '32px',
                  fontWeight: '700',
                  textShadow: 'none'
                }}
              >
                🛍️ Your Orders
              </motion.h1>
              <motion.p 
                className="text-sm font-body mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ 
                  color: '#FFFFFF',
                  textShadow: 'none'
                }}
              >
                {filteredOrders.length} orders found
              </motion.p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#FFFFFF' }} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-none outline-none"
                style={{
                  backgroundColor: '#3f3f3fff',
                  color: '#FFFFFF',
                  borderRadius: isMobile ? '8px' : '3px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filterOptions.map((filter) => (
            <motion.button
              key={filter.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedFilter(filter.key)}
              className="px-4 py-2 text-sm font-semibold whitespace-nowrap"
              style={{
                background: selectedFilter === filter.key ? '#4040f8ff' : '#3f3f3fff',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: isMobile ? '8px' : '3px',
                backdropFilter: 'none',
                textShadow: 'none'
              }}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Orders List */}
      <div className="px-4 md:px-6">
        {isMobile ? (
          // Mobile TikTok-style vertical layout - IMPROVED DESIGN
          <div className="space-y-4">
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.1 }}
                  className="relative rounded-lg overflow-hidden"
                  style={{
                    background: '#3f3f3fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px rgba(64, 64, 248, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  {/* Order Header - Compact */}
                  <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-semibold" style={{ color: '#FFFFFF', fontSize: '16px' }}>
                          {order.orderNumber}
                        </h3>
                        <div 
                          className="inline-block px-2 py-0.5 rounded text-xs font-semibold"
                          style={{
                            backgroundColor: getStatusColor(order.status),
                            color: '#FFFFFF',
                            borderRadius: '4px'
                          }}
                        >
                          {order.statusText}
                        </div>
                      </div>
                      <p className="text-xs font-body" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold font-heading" style={{ color: '#FFFFFF', fontSize: '18px' }}>
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Store/Vendor Info - Prominent */}
                  <div className="px-4 py-3 flex items-center gap-2 bg-black bg-opacity-20">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#4040f8ff' }}>
                      <Package className="h-5 w-5" style={{ color: '#FFFFFF' }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold font-heading" style={{ color: '#FFFFFF', fontSize: '15px' }}>
                        {order.vendor.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                        <span className="text-xs font-body" style={{ color: '#FFFFFF', opacity: 0.8 }}>
                          {order.vendor.rating} • {order.vendor.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items - Improved Layout */}
                  <div className="px-4 py-3 space-y-3">
                    {order.items.map((item, itemIdx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + itemIdx * 0.05 }}
                        className="flex gap-3 p-2 rounded-lg bg-black bg-opacity-20"
                        style={{
                          borderRadius: '8px'
                        }}
                      >
                        {/* Product Image - Larger and Prominent */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                            style={{ 
                              borderRadius: '8px',
                              border: '2px solid rgba(255, 255, 255, 0.1)'
                            }}
                          />
                          {/* Quantity Badge */}
                          <div 
                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              background: '#4040f8ff',
                              color: '#FFFFFF',
                              border: '2px solid #3f3f3fff',
                              boxShadow: '0 2px 8px rgba(64, 64, 248, 0.6)'
                            }}
                          >
                            {item.quantity}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading font-semibold line-clamp-2 mb-1" style={{ color: '#FFFFFF', fontSize: '14px' }}>
                            {item.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 rounded" style={{ 
                              background: 'rgba(255, 255, 255, 0.1)', 
                              color: '#FFFFFF',
                              borderRadius: '4px'
                            }}>
                              {item.size}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded" style={{ 
                              background: 'rgba(255, 255, 255, 0.1)', 
                              color: '#FFFFFF',
                              borderRadius: '4px'
                            }}>
                              {item.color}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-body" style={{ color: '#FFFFFF', opacity: 0.7 }}>
                              Qty: {item.quantity}
                            </p>
                            <p className="font-semibold font-heading" style={{ color: '#FFFFFF', fontSize: '15px' }}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 pb-4 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTrackOrder(order)}
                      className="flex items-center justify-center gap-2 py-3 px-4 font-semibold flex-1"
                      style={{
                        background: '#4040f8ff',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                        boxShadow: '0 4px 16px rgba(64, 64, 248, 0.4)'
                      }}
                    >
                      <Truck className="h-4 w-4" />
                      Track Order
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewDetails(order)}
                      className="flex items-center justify-center gap-2 py-3 px-4 font-semibold flex-1"
                      style={{
                        background: '#4040f8ff',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                        boxShadow: '0 4px 16px rgba(64, 64, 248, 0.4)'
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          // Desktop grid layout
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.1 }}
                  className="p-6 rounded-lg"
                  style={{
                    backgroundColor: '#3f3f3fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '3px',
                    boxShadow: '0 2px 4px hsla(205, 11%, 83%, 0.9)'
                  }}
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 
                        className="font-heading font-semibold"
                        style={{
                          color: '#FFFFFF',
                          fontSize: '18px'
                        }}
                      >
                        {order.orderNumber}
                      </h3>
                      <p 
                        className="text-sm font-body"
                        style={{
                          color: '#FFFFFF',
                          opacity: 0.8
                        }}
                      >
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div 
                      className="px-3 py-1 rounded text-sm font-semibold"
                      style={{
                        backgroundColor: getStatusColor(order.status),
                        color: '#FFFFFF',
                        borderRadius: '3px'
                      }}
                    >
                      {order.statusText}
                    </div>
                  </div>

                  {/* Order Amount */}
                  <div className="mb-4">
                    <p 
                      className="text-xl font-semibold"
                      style={{ color: '#FFFFFF' }}
                    >
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <p 
                      className="text-sm"
                      style={{ color: '#FFFFFF', opacity: 0.8 }}
                    >
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Vendor Info */}
                  <div className="mb-4 pb-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                    <p 
                      className="font-semibold"
                      style={{ color: '#FFFFFF' }}
                    >
                      {order.vendor.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4" style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                      <span 
                        className="text-sm"
                        style={{ color: '#FFFFFF', opacity: 0.8 }}
                      >
                        {order.vendor.rating} • {order.vendor.location}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTrackOrder(order)}
                      className="flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold flex-1"
                      style={{
                        background: '#4040f8ff',
                        color: '#FFFFFF',
                        borderRadius: '3px',
                        border: 'none'
                      }}
                    >
                      <Truck className="h-4 w-4" />
                      Track
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleViewDetails(order)}
                      className="flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold flex-1"
                      style={{
                        background: '#4040f8ff',
                        color: '#FFFFFF',
                        borderRadius: '3px',
                        border: 'none'
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      Details
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="h-16 w-16 mx-auto mb-4" style={{ color: '#FFFFFF', opacity: 0.5 }} />
            <h3 
              className="font-heading text-xl mb-2"
              style={{ color: '#FFFFFF' }}
            >
              No orders found
            </h3>
            <p 
              className="font-body mb-6"
              style={{ color: '#FFFFFF', opacity: 0.8 }}
            >
              Try adjusting your search or filter criteria
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter('all')}
              className="px-6 py-3 font-semibold"
              style={{
                background: '#4040f8ff',
                color: '#FFFFFF',
                borderRadius: isMobile ? '8px' : '3px',
                border: 'none'
              }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}