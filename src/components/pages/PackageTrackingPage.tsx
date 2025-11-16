import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Package, Truck, MapPin, Clock, CheckCircle, Phone, Mail, Copy, Share2, Star, Navigation, Check } from 'lucide-react';
import { useApp } from '../AppProvider';

interface PackageTrackingPageProps {
  onNavigateBack: () => void;
  orderNumber?: string;
}

interface TrackingUpdate {
  id: string;
  timestamp: string;
  status: string;
  location: string;
  description: string;
  isCompleted: boolean;
}

interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  vendor: string;
}

interface ShipmentInfo {
  trackingNumber: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  origin: string;
  destination: string;
  status: 'delivered' | 'out_for_delivery' | 'in_transit' | 'pending';
  estimatedDelivery: string;
  currentLocation: string;
  logisticsCompany: string;
  deliveryFee: number;
  items: OrderItem[];
  events: TrackingUpdate[];
}

// Mock shipment data - moved outside component to prevent re-renders
const createMockShipmentData = (orderNumber: string): ShipmentInfo => ({
  trackingNumber: 'CMR123456789',
  orderId: orderNumber,
  customerName: 'Jean-Baptiste Mbala',
  customerPhone: '+237 655 123 456',
  origin: 'TechCameroon Store, Douala',
  destination: 'Quartier Bonamoussadi, Douala',
  status: 'in_transit',
  estimatedDelivery: '2024-01-15 14:00',
  currentLocation: 'Distribution Center - Douala',
  logisticsCompany: 'Nexus Express',
  deliveryFee: 2500,
  items: [
    {
      name: 'Vibrant Ankara Maxi Dress',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100',
      vendor: 'African Heritage Store'
    }
  ],
  events: [
    {
      id: '1',
      timestamp: '2024-01-12 09:30',
      status: 'Order Confirmed',
      location: 'Douala',
      description: 'Your order has been confirmed and is being prepared',
      isCompleted: true
    },
    {
      id: '2',
      timestamp: '2024-01-12 14:15',
      status: 'Package Picked Up',
      location: 'TechCameroon Store, Douala',
      description: 'Package collected from vendor',
      isCompleted: true
    },
    {
      id: '3',
      timestamp: '2024-01-13 08:45',
      status: 'In Transit',
      location: 'Nexus Express Hub, Douala',
      description: 'Package is on its way to distribution center',
      isCompleted: true
    },
    {
      id: '4',
      timestamp: '2024-01-14 10:30',
      status: 'At Distribution Center',
      location: 'Distribution Center - Douala',
      description: 'Package arrived at local distribution center',
      isCompleted: true
    },
    {
      id: '5',
      timestamp: '2024-01-15 08:00',
      status: 'Out for Delivery',
      location: 'Bonamoussadi Area',
      description: 'Package is out for delivery to your address',
      isCompleted: false
    },
    {
      id: '6',
      timestamp: '2024-01-15 14:00',
      status: 'Delivered',
      location: 'Quartier Bonamoussadi, Douala',
      description: 'Package delivered successfully',
      isCompleted: false
    }
  ]
});

export function PackageTrackingPage({ onNavigateBack, orderNumber = `BAT${Date.now().toString().slice(-6)}` }: PackageTrackingPageProps) {
  const appContext = useApp();
  
  // Safety check for app context
  if (!appContext) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-body">Loading tracking page...</p>
        </div>
      </div>
    );
  }
  
  const { state, actions } = appContext;
  
  // Get tracking data from app state if available
  const trackingDataFromState = state?.trackingData;
  const selectedOrderDetails = state?.selectedOrderDetails;
  
  // Start in 'tracking' view if we have order details, otherwise 'home' view
  const initialView = (selectedOrderDetails?.trackingNumber || trackingDataFromState?.trackingNumber) ? 'tracking' : 'home';
  
  const [currentView, setCurrentView] = useState<'home' | 'tracking'>(initialView);
  const [trackingNumber, setTrackingNumber] = useState(selectedOrderDetails?.trackingNumber || trackingDataFromState?.trackingNumber || '');
  const [shipmentInfo, setShipmentInfo] = useState<ShipmentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Utility functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'out_for_delivery': return 'bg-blue-500';
      case 'in_transit': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'in_transit': return 'In Transit';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Safety check to ensure we're not formatting an event object
      if (!dateString || typeof dateString !== 'string' || dateString.length > 50) {
        console.warn('Invalid date string for formatting:', dateString);
        return 'Invalid Date';
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  // Handlers
  const handleTrackPackage = useCallback((customTrackingNumber?: string) => {
    try {
      const numberToTrack = customTrackingNumber || trackingNumber.trim();
      if (!numberToTrack) return;
      
      setCurrentView('tracking');
      setIsLoading(true);
      setHasError(false);
      
      // Simulate API loading with timeout protection
      const loadingTimeout = setTimeout(() => {
        try {
          const mockData = createMockShipmentData(orderNumber);
          const updatedShipmentInfo = { ...mockData, trackingNumber: numberToTrack };
          setShipmentInfo(updatedShipmentInfo);
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading tracking data:', error);
          setIsLoading(false);
          setHasError(true);
        }
      }, 1500);
      
      // Fallback timeout in case of hanging
      const fallbackTimeout = setTimeout(() => {
        setIsLoading(false);
        setHasError(true);
      }, 5000);
      
      return () => {
        clearTimeout(loadingTimeout);
        clearTimeout(fallbackTimeout);
      };
    } catch (error) {
      console.error('Error in handleTrackPackage:', error);
      setIsLoading(false);
      setHasError(true);
    }
  }, [trackingNumber, orderNumber]);

  const handleBackToHome = useCallback(() => {
    setCurrentView('home');
    setTrackingNumber('');
    setShipmentInfo(null);
  }, []);

  // Auto-initiate tracking on mount if we have tracking data
  useEffect(() => {
    // Check if we have tracking number from either source
    const trackingNumberToUse = selectedOrderDetails?.trackingNumber || trackingDataFromState?.trackingNumber;
    
    if (trackingNumberToUse && !shipmentInfo) {
      // Set the view to tracking immediately
      setCurrentView('tracking');
      setIsLoading(true);
      
      // Simulate API loading
      setTimeout(() => {
        try {
          const mockData = createMockShipmentData(selectedOrderDetails?.orderNumber || orderNumber);
          
          // If we have full order details, use them to enhance the tracking data
          const updatedShipmentInfo = selectedOrderDetails ? {
            ...mockData,
            trackingNumber: trackingNumberToUse,
            orderId: selectedOrderDetails.orderNumber || mockData.orderId,
            customerName: selectedOrderDetails.shippingAddress?.name || mockData.customerName,
            destination: selectedOrderDetails.shippingAddress?.address || mockData.destination,
            status: selectedOrderDetails.status === 'delivered' ? 'delivered' : 
                    selectedOrderDetails.status === 'shipped' ? 'in_transit' : 'pending',
            estimatedDelivery: selectedOrderDetails.estimatedDelivery || mockData.estimatedDelivery,
            items: selectedOrderDetails.items?.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              image: item.image,
              vendor: selectedOrderDetails.vendor?.name || 'Unknown Vendor'
            })) || mockData.items
          } : { ...mockData, trackingNumber: trackingNumberToUse };
          
          setShipmentInfo(updatedShipmentInfo);
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading tracking data:', error);
          setIsLoading(false);
          setHasError(true);
        }
      }, 1500);
      
      // Clear tracking data after use if it came from trackingDataFromState
      if (trackingDataFromState?.trackingNumber) {
        actions?.setTrackingData?.(null);
      }
    }
  }, []); // Run only once on mount

  const handleCopyTracking = useCallback(async () => {
    if (shipmentInfo) {
      try {
        await navigator.clipboard.writeText(shipmentInfo.trackingNumber);
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  }, [shipmentInfo]);

  const handleShare = useCallback(async () => {
    if (navigator.share && shipmentInfo) {
      try {
        await navigator.share({
          title: 'Package Tracking',
          text: `Track my package: ${shipmentInfo.trackingNumber}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  }, [shipmentInfo]);

  const handleDemoTracking = useCallback(() => {
    setTrackingNumber('CMR123456789');
  }, []);

  // Support handlers
  const handleCallSupport = useCallback(() => {
    window.open('tel:+237677123456');
  }, []);

  const handleWhatsAppSupport = useCallback(() => {
    const message = `Hello, I need help with tracking number: ${shipmentInfo?.trackingNumber || trackingNumber}`;
    window.open(`https://wa.me/237677123456?text=${encodeURIComponent(message)}`);
  }, [shipmentInfo, trackingNumber]);

  const handleGetDirections = useCallback(() => {
    // Navigate to the Get Directions page
    actions?.navigateToPage?.('get-directions');
  }, [actions]);

  const handleRateExperience = useCallback(() => {
    // Navigate to the Rate Experience page
    actions?.navigateToPage?.('rate-experience');
  }, [actions]);

  // Calculate progress
  const progressPercentage = shipmentInfo ? 
    Math.round((shipmentInfo.events.filter(evt => evt.isCompleted).length / shipmentInfo.events.length) * 100) : 0;

  // Home View Component
  const HomeView = () => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 
            className="text-3xl mb-2 font-heading font-bold"
            style={{ color: '#885cf8' }}
          >
            Package Tracker
          </h1>
          <p className="text-gray-400 font-body">Track your packages with ease</p>
        </motion.div>
        
        <motion.div 
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: isMobile ? '16px' : '12px'
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-4">
            <label 
              htmlFor="trackingInput" 
              className="block text-sm font-medium text-gray-400 mb-2 font-body"
            >
              Tracking Number
            </label>
            <input
              id="trackingInput"
              type="text"
              placeholder="Enter your tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && trackingNumber.trim()) {
                  e.preventDefault();
                  handleTrackPackage();
                }
              }}
              className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 font-body"
              style={{ 
                borderRadius: isMobile ? '12px' : '8px',
                outline: 'none'
              }}
              onFocus={(e) => {
                const target = e.target as HTMLInputElement;
                target.style.borderColor = '#5825ef';
              }}
              onBlur={(e) => {
                const target = e.target as HTMLInputElement;
                target.style.borderColor = '#374151';
              }}
            />
          </div>
          
          <button 
            onClick={() => handleTrackPackage()}
            disabled={!trackingNumber.trim()}
            className="w-full py-3 rounded-xl font-medium font-body transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: '#5825ef',
              color: 'white',
              borderRadius: isMobile ? '12px' : '8px'
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              if (!target.disabled) {
                target.style.backgroundColor = '#4040f8';
              }
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              if (!target.disabled) {
                target.style.backgroundColor = '#5825ef';
              }
            }}
          >
            Track Package
          </button>
          
          <div className="mt-4 text-center">
            <button 
              onClick={() => handleDemoTracking()}
              className="text-sm font-body"
              style={{ 
                color: '#d6c9fd',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Try with demo tracking number
            </button>
          </div>
        </motion.div>
        
        <div className="mt-6 text-center text-xs text-gray-400 font-body">
          <p>Powered by Nexus Express Logistics</p>
        </div>
      </div>
    </div>
  );

  // Tracking View Component
  const TrackingView = () => (
    <div className="min-h-screen bg-black text-white overflow-y-auto">
      {/* Header */}
      <div 
        className="sticky top-0 z-50 px-4 py-3"
        style={{
          backgroundColor: '#1a1a1a',
          borderBottom: '1px solid #2a2a2a'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => currentView === 'home' ? onNavigateBack() : handleBackToHome()}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div>
              <h1 className="text-lg font-bold font-heading">Package Tracking</h1>
              <p className="text-sm text-gray-400 font-body">Nexus Express</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleCopyTracking()}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <Copy className="h-5 w-5 text-white" />
            </button>
            <button 
              onClick={() => handleShare()}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center">
            <div 
              className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
              style={{
                borderColor: '#5825ef',
                borderTopColor: 'transparent'
              }}
            />
            <p className="text-gray-400 font-body">Loading tracking information...</p>
          </div>
        )}

        {/* Tracking Content */}
        {!isLoading && shipmentInfo && (
          <div className="space-y-6">
            {/* Tracking Number Card */}
            <motion.div 
              className="p-6 rounded-2xl text-center"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: isMobile ? '16px' : '12px'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm text-gray-400 mb-2 font-body">Tracking Number</p>
              <div className="flex items-center justify-center gap-2">
                <p 
                  className="text-xl font-bold font-heading"
                  style={{ color: '#885cf8' }}
                >
                  {shipmentInfo.trackingNumber}
                </p>
                {copiedMessage && (
                  <span 
                    className="px-2 py-1 text-xs rounded-full"
                    style={{ backgroundColor: '#16a34a', color: 'white' }}
                  >
                    Copied!
                  </span>
                )}
              </div>
              <span 
                className="inline-block px-3 py-1 text-sm rounded-full mt-3"
                style={{ backgroundColor: '#eab308', color: 'white' }}
              >
                {getStatusText(shipmentInfo.status)}
              </span>
            </motion.div>

            {/* Progress Overview */}
            <motion.div 
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: isMobile ? '16px' : '12px'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ 
                      background: 'linear-gradient(135deg, #5825ef, #885cf8)' 
                    }}
                  >
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white font-heading">Current Location</h3>
                    <p className="text-sm text-gray-400 font-body">{shipmentInfo.currentLocation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 font-body">Estimated Delivery</p>
                  <p 
                    className="font-bold font-heading"
                    style={{ color: '#885cf8' }}
                  >
                    {formatDate(shipmentInfo.estimatedDelivery)}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2 font-body">
                  <span>Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div 
                  className="w-full h-2 overflow-hidden"
                  style={{ backgroundColor: '#2a2a2a', borderRadius: '3px' }}
                >
                  <motion.div
                    className="h-full"
                    style={{ 
                      background: 'linear-gradient(to right, #5825ef, #885cf8)',
                      width: `${progressPercentage}%`,
                      borderRadius: '3px'
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Route Info */}
              <div className="grid grid-cols-2 gap-4 text-sm font-body">
                <div>
                  <p className="text-gray-400">From</p>
                  <p className="font-medium text-white">{shipmentInfo.origin}</p>
                </div>
                <div>
                  <p className="text-gray-400">To</p>
                  <p className="font-medium text-white">{shipmentInfo.destination}</p>
                </div>
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div 
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: isMobile ? '16px' : '12px'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-bold text-white mb-4 font-heading">🛍️ Order Items ({shipmentInfo.items.length})</h3>
              <div className="space-y-3">
                {shipmentInfo.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-white text-sm font-heading">{item.name}</div>
                      <div className="text-gray-400 text-xs font-body">
                        Qty: {item.quantity} • {item.vendor}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div 
                className="border-t pt-3 mt-3"
                style={{ borderColor: '#2a2a2a' }}
              >
                <div className="flex justify-between text-sm font-body">
                  <span className="text-gray-400">Order ID</span>
                  <span className="text-white">{shipmentInfo.orderId}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-gray-400">Delivery Fee</span>
                  <span style={{ color: '#885cf8' }}>{formatPrice(shipmentInfo.deliveryFee)}</span>
                </div>
              </div>
            </motion.div>

            {/* Tracking Timeline */}
            <motion.div 
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: isMobile ? '16px' : '12px'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="font-bold text-white mb-4 font-heading">🚚 Tracking Timeline</h3>
              <div className="space-y-4">
                {shipmentInfo.events.map((trackingEvent, index) => {
                  // Safety check to ensure trackingEvent is a proper object and not an event object
                  if (!trackingEvent || 
                      typeof trackingEvent !== 'object' || 
                      !trackingEvent.id ||
                      trackingEvent.hasOwnProperty('target') || 
                      trackingEvent.hasOwnProperty('currentTarget') ||
                      trackingEvent.hasOwnProperty('nativeEvent')) {
                    console.error('Invalid tracking event detected (possible DOM event):', trackingEvent);
                    return null;
                  }
                  
                  const isCurrentStep = !trackingEvent.isCompleted && index === shipmentInfo.events.findIndex(evt => !evt.isCompleted);
                  
                  return (
                    <div key={trackingEvent.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: trackingEvent.isCompleted ? '#5825ef' : 
                                           isCurrentStep ? '#885cf8' : '#2a2a2a'
                          }}
                        >
                          {trackingEvent.isCompleted ? 
                            <Check className="w-4 h-4 text-white" /> :
                            <div className="w-2 h-2 rounded-full bg-white" />
                          }
                        </div>
                        {index < shipmentInfo.events.length - 1 && (
                          <div 
                            className="w-0.5 h-8"
                            style={{
                              backgroundColor: trackingEvent.isCompleted ? '#5825ef' : '#2a2a2a'
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 
                            className="font-medium font-heading"
                            style={{
                              color: trackingEvent.isCompleted ? 'white' : 
                                     isCurrentStep ? '#885cf8' : '#6b7280'
                            }}
                          >
                            {String(trackingEvent.status || '').substring(0, 100)}
                          </h4>
                          <span className="text-sm text-gray-400 font-body">
                            {trackingEvent.timestamp ? formatDate(String(trackingEvent.timestamp)) : 'Unknown'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-1 font-body">
                          {String(trackingEvent.description || '').substring(0, 200)}
                        </p>
                        <div className="flex items-center text-xs text-gray-400 font-body">
                          <MapPin className="w-3 h-3 mr-1" />
                          {String(trackingEvent.location || '').substring(0, 100)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Delivery Information */}
            <motion.div 
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: isMobile ? '16px' : '12px'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="font-bold text-white mb-4 font-heading">📋 Delivery Information</h3>
              <div className="space-y-3 font-body">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Customer</span>
                  <span className="text-white">{shipmentInfo.customerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Phone</span>
                  <span className="text-white">{shipmentInfo.customerPhone}</span>
                </div>
              </div>
            </motion.div>

            {/* Support Actions */}
            <motion.div 
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: isMobile ? '16px' : '12px'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="font-bold text-white mb-4 font-heading">❓ Need Help?</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleCallSupport()}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl transition-colors font-body"
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.backgroundColor = '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.backgroundColor = '#2563eb';
                  }}
                >
                  <Phone className="w-4 h-4" />
                  Call Support
                </button>
                <button 
                  onClick={() => handleWhatsAppSupport()}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl transition-colors font-body"
                  style={{
                    backgroundColor: '#16a34a',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.backgroundColor = '#15803d';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.backgroundColor = '#16a34a';
                  }}
                >
                  <Mail className="w-4 h-4" />
                  WhatsApp Support
                </button>
                <button 
                  onClick={() => handleGetDirections()}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl transition-colors font-body"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #2a2a2a',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.backgroundColor = '#2a2a2a';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.backgroundColor = 'transparent';
                  }}
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </button>
                <button 
                  onClick={() => handleRateExperience()}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl transition-colors font-body"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #2a2a2a',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.backgroundColor = '#2a2a2a';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.backgroundColor = 'transparent';
                  }}
                >
                  <Star className="w-4 h-4" />
                  Rate Experience
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );

  // Error boundary fallback
  if (hasError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading mb-4" style={{ color: '#885cf8' }}>
            Tracking Temporarily Unavailable
          </h1>
          <p className="text-gray-400 font-body mb-6">
            We're having trouble loading the tracking page. Please try again.
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => setHasError(false)}
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Retry
            </button>
            <button 
              onClick={() => onNavigateBack()}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-800"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Return appropriate view with error handling
  try {
    return (
      <AnimatePresence mode="wait">
        {currentView === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomeView />
          </motion.div>
        ) : (
          <motion.div
            key="tracking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TrackingView />
          </motion.div>
        )}
      </AnimatePresence>
    );
  } catch (error) {
    console.error('PackageTrackingPage render error:', error);
    setHasError(true);
    return null;
  }
}