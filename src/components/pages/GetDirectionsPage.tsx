import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Navigation, Car, Clock, Route, Share2, Phone, Copy } from 'lucide-react';

interface GetDirectionsPageProps {
  onNavigateBack: () => void;
  destination?: string;
  currentLocation?: string;
  trackingNumber?: string;
}

interface DirectionsStep {
  id: string;
  instruction: string;
  distance: string;
  duration: string;
  icon: string;
}

interface RouteInfo {
  totalDistance: string;
  totalDuration: string;
  steps: DirectionsStep[];
  estimatedArrival: string;
}

// Mock directions data
const createMockDirectionsData = (destination: string): RouteInfo => ({
  totalDistance: '4.2 km',
  totalDuration: '12 minutes',
  estimatedArrival: new Date(Date.now() + 12 * 60 * 1000).toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }),
  steps: [
    {
      id: '1',
      instruction: 'Head north on Rue de la République toward Boulevard de la Liberté',
      distance: '350 m',
      duration: '2 min',
      icon: '⬆️'
    },
    {
      id: '2',
      instruction: 'Turn right onto Boulevard de la Liberté',
      distance: '800 m',
      duration: '3 min',
      icon: '➡️'
    },
    {
      id: '3',
      instruction: 'Continue straight through 2 roundabouts',
      distance: '1.2 km',
      duration: '4 min',
      icon: '⬆️'
    },
    {
      id: '4',
      instruction: 'Turn left onto Avenue du Président Ahmadou Ahidjo',
      distance: '900 m',
      duration: '2 min',
      icon: '⬅️'
    },
    {
      id: '5',
      instruction: 'Turn right into Quartier Bonamoussadi',
      distance: '600 m',
      duration: '1 min',
      icon: '➡️'
    },
    {
      id: '6',
      instruction: `Arrive at ${destination}`,
      distance: '0 m',
      duration: '0 min',
      icon: '🎯'
    }
  ]
});

export function GetDirectionsPage({ 
  onNavigateBack, 
  destination = "Quartier Bonamoussadi, Douala",
  currentLocation = "Your current location",
  trackingNumber = "CMR123456789"
}: GetDirectionsPageProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [selectedTransportMode, setSelectedTransportMode] = useState<'driving' | 'walking' | 'transit'>('driving');

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load directions on mount
  useEffect(() => {
    setIsLoading(true);
    const loadTimeout = setTimeout(() => {
      const mockData = createMockDirectionsData(destination);
      setRouteInfo(mockData);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadTimeout);
  }, [destination, selectedTransportMode]);

  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(destination);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [destination]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Package Delivery Directions',
          text: `Directions to: ${destination}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  }, [destination]);

  const handleOpenMaps = useCallback(() => {
    const encodedDestination = encodeURIComponent(destination);
    const mapsUrl = `https://maps.google.com/maps?daddr=${encodedDestination}`;
    window.open(mapsUrl, '_blank');
  }, [destination]);

  const handleCallDelivery = useCallback(() => {
    window.open('tel:+237677123456');
  }, []);

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'driving': return <Car className="w-5 h-5" />;
      case 'walking': return <span className="text-lg">🚶</span>;
      case 'transit': return <span className="text-lg">🚌</span>;
      default: return <Car className="w-5 h-5" />;
    }
  };

  const getTransportLabel = (mode: string) => {
    switch (mode) {
      case 'driving': return 'Driving';
      case 'walking': return 'Walking';
      case 'transit': return 'Transit';
      default: return 'Driving';
    }
  };

  return (
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
              onClick={onNavigateBack}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div>
              <h1 className="text-lg font-bold font-heading">Directions</h1>
              <p className="text-sm text-gray-400 font-body">Package Delivery Route</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <Share2 className="h-5 w-5 text-white" />
            </button>
            <button 
              onClick={handleCallDelivery}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <Phone className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Tracking Info Card */}
        <motion.div 
          className="p-4 rounded-2xl"
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: isMobile ? '16px' : '12px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5825ef, #885cf8)' }}
              >
                <Navigation className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white font-heading">Package Tracking</p>
                <p className="text-xs text-gray-400 font-body">{trackingNumber}</p>
              </div>
            </div>
            {copiedMessage && (
              <span 
                className="px-2 py-1 text-xs rounded-full"
                style={{ backgroundColor: '#16a34a', color: 'white' }}
              >
                Copied!
              </span>
            )}
          </div>
        </motion.div>

        {/* Route Overview */}
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
          <h3 className="font-bold text-white mb-4 font-heading">🗺️ Route Overview</h3>
          
          {/* Transport Mode Selector */}
          <div className="flex gap-2 mb-4">
            {(['driving', 'walking', 'transit'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedTransportMode(mode)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-body text-sm"
                style={{
                  backgroundColor: selectedTransportMode === mode ? '#5825ef' : 'transparent',
                  border: '1px solid #2a2a2a',
                  color: selectedTransportMode === mode ? 'white' : '#9ca3af'
                }}
              >
                {getTransportIcon(mode)}
                {getTransportLabel(mode)}
              </button>
            ))}
          </div>

          {/* From/To */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-400 font-body">From</p>
                <p className="text-white font-body">{currentLocation}</p>
              </div>
            </div>
            <div className="w-0.5 h-6 bg-gray-600 ml-1.5" />
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-400 font-body">To</p>
                <div className="flex items-center gap-2">
                  <p className="text-white font-body">{destination}</p>
                  <button 
                    onClick={handleCopyAddress}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Copy className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Route Summary */}
          {routeInfo && (
            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-gray-900/50">
              <div className="text-center">
                <p className="text-xs text-gray-400 font-body">Distance</p>
                <p className="font-bold text-white font-heading">{routeInfo.totalDistance}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 font-body">Duration</p>
                <p className="font-bold text-white font-heading">{routeInfo.totalDuration}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 font-body">Arrival</p>
                <p className="font-bold text-white font-heading">{routeInfo.estimatedArrival}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Step-by-Step Directions */}
        {isLoading ? (
          <motion.div 
            className="p-6 rounded-2xl text-center"
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: isMobile ? '16px' : '12px'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div 
              className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
              style={{
                borderColor: '#5825ef',
                borderTopColor: 'transparent'
              }}
            />
            <p className="text-gray-400 font-body">Calculating directions...</p>
          </motion.div>
        ) : routeInfo && (
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
            <h3 className="font-bold text-white mb-4 font-heading">🧭 Step-by-Step Directions</h3>
            <div className="space-y-4">
              {routeInfo.steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{
                        backgroundColor: index === routeInfo.steps.length - 1 ? '#ef4444' : '#5825ef'
                      }}
                    >
                      {step.icon}
                    </div>
                    {index < routeInfo.steps.length - 1 && (
                      <div 
                        className="w-0.5 h-8"
                        style={{ backgroundColor: '#2a2a2a' }}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-white font-body mb-1">{step.instruction}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-400 font-body">
                      <span>{step.distance}</span>
                      <span>•</span>
                      <span>{step.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button 
            onClick={handleOpenMaps}
            className="w-full p-4 rounded-xl font-medium font-body transition-all"
            style={{
              backgroundColor: '#5825ef',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.backgroundColor = '#4040f8';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.backgroundColor = '#5825ef';
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" />
              Open in Maps App
            </div>
          </button>
          
          <button 
            onClick={handleCallDelivery}
            className="w-full p-4 rounded-xl font-medium font-body transition-all"
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
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-5 w-5" />
              Call Delivery Driver
            </div>
          </button>
        </motion.div>

        {/* Tips */}
        <motion.div 
          className="p-4 rounded-2xl"
          style={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h4 className="font-bold text-white mb-2 font-heading">💡 Tips</h4>
          <ul className="space-y-1 text-sm text-gray-400 font-body">
            <li>• Keep your phone charged for navigation</li>
            <li>• Check traffic conditions before departing</li>
            <li>• Have the tracking number ready when calling</li>
            <li>• Consider peak traffic hours in your route</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}