import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft,
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
  Shield,
  Mic,
  MicOff,
  Camera,
  Share2,
  MoreVertical,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Truck,
  RefreshCw,
  Target,
  Route,
  Timer,
  TrendingUp,
  FastForward,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX
} from 'lucide-react';

/**
 * LogisticsRealTimeTracking Component
 * 
 * Enhanced real-time tracking component for the Logistics Portal following Bato design system.
 * Features interactive maps, voice commands, emergency alerts, and comprehensive tracking.
 */

// Define the vehicle route and tracking data structure
interface TrackingLocation {
  lat: number;
  lng: number;
  timestamp: string;
  address: string;
  status: 'completed' | 'current' | 'pending';
  estimatedTime?: string;
}

interface VehicleData {
  id: string;
  driver: string;
  vehicleNumber: string;
  vehicleType: string;
  currentLocation: TrackingLocation;
  route: TrackingLocation[];
  customer: {
    name: string;
    phone: string;
    pickupAddress: string;
    deliveryAddress: string;
  };
  eta: number; // in minutes
  speed: number; // km/h
  fuel: number; // percentage
  status: 'approaching_pickup' | 'at_pickup' | 'in_transit' | 'approaching_delivery' | 'delivered';
}

interface LogisticsRealTimeTrackingProps {
  onBack: () => void;
  trackingNumber: string;
  routeData?: any;
}

const LogisticsRealTimeTracking: React.FC<LogisticsRealTimeTrackingProps> = ({ 
  onBack, 
  trackingNumber, 
  routeData 
}) => {
  // Core tracking state
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    id: trackingNumber,
    driver: routeData?.driver || 'Paul Mbarga',
    vehicleNumber: routeData?.vehicle || 'CM-DLA-2024-001',
    vehicleType: 'TOYOTA Camry 2023',
    currentLocation: {
      lat: 4.0614,
      lng: 9.7864,
      timestamp: new Date().toISOString(),
      address: 'Distribution Hub Douala',
      status: 'current'
    },
    route: [
      {
        lat: 4.0511,
        lng: 9.7679,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        address: 'CameroonMarket Warehouse',
        status: 'completed'
      },
      {
        lat: 4.0614,
        lng: 9.7864,
        timestamp: new Date().toISOString(),
        address: 'Distribution Hub Douala',
        status: 'current'
      },
      {
        lat: 4.0721,
        lng: 9.8011,
        timestamp: '',
        address: 'Local Delivery Station',
        status: 'pending',
        estimatedTime: new Date(Date.now() + 25 * 60000).toISOString()
      },
      {
        lat: 4.0821,
        lng: 9.8121,
        timestamp: '',
        address: 'Customer Delivery Address',
        status: 'pending',
        estimatedTime: new Date(Date.now() + 45 * 60000).toISOString()
      }
    ],
    customer: {
      name: routeData?.customerName || 'Marie Kouakou',
      phone: routeData?.customerPhone || '+237-699-123-456',
      pickupAddress: routeData?.origin || 'CameroonMarket Warehouse, Douala',
      deliveryAddress: routeData?.destination || 'Quartier Makepe, Douala, Cameroon'
    },
    eta: 28,
    speed: 45,
    fuel: 78,
    status: 'in_transit'
  });

  // UI and map state
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [driverStatus, setDriverStatus] = useState('Driver heading to delivery location');
  const [realTimeTracking, setRealTimeTracking] = useState(true);
  const [currentBearing, setCurrentBearing] = useState(45);
  const [tripStarted, setTripStarted] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [emergencyPopup, setEmergencyPopup] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Enhanced map state
  const [vehiclePosition, setVehiclePosition] = useState({ lat: 4.0614, lng: 9.7864 });
  const [routeProgress, setRouteProgress] = useState(25);
  const [isNavigating, setIsNavigating] = useState(true);
  const [mapZoom, setMapZoom] = useState(14);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [showRouteOverview, setShowRouteOverview] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 4.0700, lng: 9.7900 });
  const [animationPhase, setAnimationPhase] = useState(0);

  // Simulation refs
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const etaIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced real-time tracking simulation
  useEffect(() => {
    if (realTimeTracking && isNavigating) {
      trackingIntervalRef.current = setInterval(() => {
        const routeLength = vehicleData.route.length;
        
        setRouteProgress(prev => {
          const newProgress = Math.min(prev + (2 * simulationSpeed), 100);
          
          // Calculate vehicle position along route
          const segmentIndex = Math.floor((newProgress / 100) * (routeLength - 1));
          const nextIndex = Math.min(segmentIndex + 1, routeLength - 1);
          
          const currentPoint = vehicleData.route[segmentIndex];
          const nextPoint = vehicleData.route[nextIndex];
          
          if (currentPoint && nextPoint) {
            const segmentProgress = ((newProgress / 100) * (routeLength - 1)) - segmentIndex;
            const newLat = currentPoint.lat + (nextPoint.lat - currentPoint.lat) * segmentProgress;
            const newLng = currentPoint.lng + (nextPoint.lng - currentPoint.lng) * segmentProgress;
            
            setVehiclePosition({ lat: newLat, lng: newLng });
            
            // Calculate bearing for vehicle rotation
            const deltaLng = nextPoint.lng - currentPoint.lng;
            const deltaLat = nextPoint.lat - currentPoint.lat;
            const bearing = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI);
            setCurrentBearing(bearing);
          }
          
          if (newProgress >= 100) {
            setIsNavigating(false);
            setDriverStatus('Package delivered successfully!');
            return 100;
          }
          
          return newProgress;
        });

        // Update vehicle data
        setVehicleData(prev => ({
          ...prev,
          currentLocation: {
            ...prev.currentLocation,
            lat: vehiclePosition.lat,
            lng: vehiclePosition.lng,
            timestamp: new Date().toISOString()
          },
          speed: Math.max(20, Math.min(70, prev.speed + (Math.random() - 0.5) * 8)),
          fuel: Math.max(0, prev.fuel - Math.random() * 0.3)
        }));

        // Animation phase for pulsing effects
        setAnimationPhase(prev => (prev + 1) % 4);
        
      }, 3000 / simulationSpeed);

      // ETA countdown
      etaIntervalRef.current = setInterval(() => {
        setVehicleData(prev => ({
          ...prev,
          eta: Math.max(0, prev.eta - 1)
        }));
      }, 60000);

      return () => {
        if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
        if (etaIntervalRef.current) clearInterval(etaIntervalRef.current);
      };
    }
  }, [realTimeTracking, isNavigating, simulationSpeed, vehiclePosition, vehicleData.route]);

  // Voice command handler
  const handleVoiceCommand = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const command = event.results[0][0].transcript.toLowerCase();
        
        if (command.includes('call driver')) {
          handleCallDriver();
        } else if (command.includes('send alert')) {
          handleSendAlert();
        } else if (command.includes('zoom in')) {
          setMapZoom(prev => Math.min(prev + 2, 20));
        } else if (command.includes('zoom out')) {
          setMapZoom(prev => Math.max(prev - 2, 8));
        } else if (command.includes('share location')) {
          handleShareLocation();
        } else if (command.includes('speed up')) {
          setSimulationSpeed(prev => Math.min(prev + 0.5, 3));
        } else if (command.includes('slow down')) {
          setSimulationSpeed(prev => Math.max(prev - 0.5, 0.5));
        } else if (command.includes('center map')) {
          setMapCenter(vehiclePosition);
        }
      };
      
      recognition.start();
      setIsVoiceActive(true);
      setTimeout(() => setIsVoiceActive(false), 5000);
    }
  };

  // Action handlers
  const handleCallDriver = () => {
    alert(`Calling ${vehicleData.driver} at ${vehicleData.customer.phone}`);
  };

  const handleSendMessage = () => {
    alert('Opening chat with driver...');
  };

  const handleSendAlert = () => {
    setShowAlert(true);
    setAlertSent(true);
    
    setTimeout(() => {
      setShowAlert(false);
      setEmergencyPopup(true);
    }, 3000);
  };

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Live Location - Bato Delivery',
        text: `Track my delivery: ${trackingNumber}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tracking link copied to clipboard!');
    }
  };

  const getStatusColor = () => {
    switch (vehicleData.status) {
      case 'approaching_pickup': return 'bg-yellow-500';
      case 'at_pickup': return 'bg-blue-500';
      case 'in_transit': return 'bg-green-500';
      case 'approaching_delivery': return 'bg-orange-500';
      case 'delivered': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // Enhanced map rendering with Cameroon focus
  const renderMap = () => {
    // Map dimensions
    const mapWidth = 100;
    const mapHeight = 100;
    
    // Calculate bounds from route points
    const lats = vehicleData.route.map(p => p.lat);
    const lngs = vehicleData.route.map(p => p.lng);
    const minLat = Math.min(...lats) - 0.005;
    const maxLat = Math.max(...lats) + 0.005;
    const minLng = Math.min(...lngs) - 0.005;
    const maxLng = Math.max(...lngs) + 0.005;
    
    // Convert coordinates to SVG positions
    const coordToSVG = (lat: number, lng: number) => {
      const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth;
      const y = ((maxLat - lat) / (maxLat - minLat)) * mapHeight;
      return { x, y };
    };

    const routePoints = vehicleData.route.map(point => coordToSVG(point.lat, point.lng));
    const vehicleSVGPos = coordToSVG(vehiclePosition.lat, vehiclePosition.lng);
    
    // Generate route path
    const pathData = routePoints.reduce((path, point, index) => {
      return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
    }, '');

    return (
      <div className="relative w-full h-full overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, #f0f4f9, #d6c9fd)', 
        borderRadius: '3px' 
      }}>

        
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(var(--primary-blue) 1px, transparent 1px),
              linear-gradient(90deg, var(--primary-blue) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Cameroon Street Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-400/50" />
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400/50" />
          <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-400/50" />
          <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-400/50" />
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400/50" />
          <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-400/50" />
        </div>

        {/* Cameroon Landmarks */}
        <div className="absolute inset-0">
          {/* Douala Port */}
          <div className="absolute bottom-1/4 right-1/4 w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: 'var(--primary-blue)', borderRadius: '3px' }}>
            🏭
          </div>
          
          {/* Yaoundé */}
          <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-green-500 rounded flex items-center justify-center text-white text-xs" style={{ borderRadius: '3px' }}>
            🏛️
          </div>
          
          {/* Market */}
          <div className="absolute top-2/3 left-1/3 w-4 h-4 bg-yellow-500 rounded flex items-center justify-center text-white text-xs" style={{ borderRadius: '3px' }}>
            🏪
          </div>
        </div>

        {/* Main SVG for Route and Vehicle */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Completed route path */}
          <path
            d={pathData}
            stroke="var(--primary-blue)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4,2"
            opacity="0.7"
          />
          
          {/* Progress overlay */}
          <path
            d={pathData}
            stroke="var(--success-green)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${routeProgress} ${100 - routeProgress}`}
            className="animate-pulse"
          />

          {/* Route markers */}
          {routePoints.map((point, index) => {
            const routePoint = vehicleData.route[index];
            return (
              <g key={index}>
                {/* Marker background */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill={
                    routePoint.status === 'completed' ? 'var(--success-green)' : 
                    routePoint.status === 'current' ? 'var(--primary-blue)' : 
                    '#a8a8a8'
                  }
                  stroke="#ffffff"
                  strokeWidth="2"
                  className={routePoint.status === 'current' ? 'animate-pulse' : ''}
                />
                
                {/* Start marker */}
                {index === 0 && (
                  <circle cx={point.x} cy={point.y} r="2" fill="var(--success-green)" />
                )}
                
                {/* End marker */}
                {index === routePoints.length - 1 && (
                  <polygon 
                    points={`${point.x},${point.y-6} ${point.x-4},${point.y+3} ${point.x+4},${point.y+3}`}
                    fill="var(--error-red)"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}

          {/* Vehicle position with enhanced visibility */}
          <g transform={`translate(${vehicleSVGPos.x}, ${vehicleSVGPos.y})`}>
            {/* Pulsing range circles */}
            <circle 
              cx="0" 
              cy="0" 
              r={8 + animationPhase * 2}
              fill="none" 
              stroke="var(--primary-blue)" 
              strokeWidth="1"
              opacity={1 - (animationPhase * 0.25)}
            />
            <circle 
              cx="0" 
              cy="0" 
              r={6 + animationPhase * 1.5}
              fill="none" 
              stroke="var(--success-green)" 
              strokeWidth="1"
              opacity={1 - (animationPhase * 0.2)}
            />
            
            {/* Vehicle shadow */}
            <circle cx="1" cy="1" r="5" fill="rgba(0, 0, 0, 0.3)" opacity="0.5" />
            
            {/* Vehicle body */}
            <circle cx="0" cy="0" r="5" fill="var(--primary-blue)" stroke="#ffffff" strokeWidth="2" />
            
            {/* Vehicle directional arrow */}
            <polygon 
              points="0,-3 2,2 0,1 -2,2"
              fill="#ffffff"
              transform={`rotate(${currentBearing})`}
            />
          </g>
        </svg>
      </div>
    );
  };

  // Detect mobile for TikTok-style styling
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div 
      className={`min-h-screen text-foreground relative overflow-hidden ${isMobile ? 'mobile-logistics-content' : ''}`} 
      style={{ 
        backgroundColor: '#000000',
        background: '#000000',
        color: '#ffffff'
      }}
    >
      {/* Emergency Popup */}
      {emergencyPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
          <div className="p-6 text-center max-w-sm mx-4" style={{ 
            backgroundColor: '#e74c3c', 
            borderRadius: '3px',
            border: '1px solid rgba(88, 37, 239, 0.2)'
          }}>
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-white" />
            <h2 className="text-xl font-bold mb-2 text-white font-heading">Emergency Alert Sent</h2>
            <p className="mb-4 text-white font-body">Emergency services have been notified. Help is on the way.</p>
            <Button
              onClick={() => setEmergencyPopup(false)}
              className="btn-moema-primary"
              style={{ 
                borderRadius: '3px',
                background: '#5825efff',
                color: 'white',
                border: 'none'
              }}
            >
              OK
            </Button>
          </div>
        </div>
      )}

      {/* Alert Sending Animation */}
      {showAlert && (
        <div className="fixed inset-0 z-40 flex justify-center items-center" style={{ backgroundColor: '#e74c3c', opacity: 0.9 }}>
          <div className="text-center text-white">
            <div className="animate-spin w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2 font-heading">Sending Emergency Alert</h2>
            <p className="font-body">Contacting emergency services...</p>
          </div>
        </div>
      )}

      {/* Header with Navigation and Status - Purple Header Bar */}
      <div className="flex items-center justify-between p-4 border-b relative z-10 logistics-header-zero-radius" style={{ 
        background: '#5825efff',
        borderColor: 'rgba(88, 37, 239, 0.3)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 20px rgba(88, 37, 239, 0.3)',
        borderRadius: '0px !important'
      }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          style={{ 
            borderRadius: '3px',
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="text-center">
          <h1 className="font-bold font-heading text-white">Live Tracking</h1>
          <p className="text-sm font-body text-white/80">#{trackingNumber}</p>
        </div>
        
        <div className="flex gap-2">
          <Badge className={`${getStatusColor()} text-white font-body`} style={{ borderRadius: '3px' }}>
            {vehicleData.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative" style={{ height: 'calc(100vh - 320px)' }}>
        {renderMap()}
        
        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          {/* Voice Control */}
          <Button
            size="sm"
            variant={isVoiceActive ? "default" : "outline"}
            className={`w-12 h-12 rounded-full ${
              isVoiceActive 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'hover:bg-accent'
            }`}
            onClick={handleVoiceCommand}
            style={{ borderRadius: '50%' }}
          >
            {isVoiceActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          {/* Emergency Alert */}
          <Button
            size="sm"
            className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white"
            onClick={handleSendAlert}
            disabled={alertSent}
            style={{ borderRadius: '50%' }}
          >
            <Shield className="w-5 h-5" />
          </Button>

          {/* Share Location */}
          <Button
            size="sm"
            variant="outline"
            className="w-12 h-12 rounded-full hover:bg-accent"
            onClick={handleShareLocation}
            style={{ borderRadius: '50%' }}
          >
            <Share2 className="w-5 h-5" />
          </Button>

          {/* Toggle Real-time Tracking */}
          <Button
            size="sm"
            variant={realTimeTracking ? "default" : "outline"}
            className={`w-12 h-12 rounded-full ${
              realTimeTracking 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'hover:bg-accent'
            }`}
            onClick={() => setRealTimeTracking(!realTimeTracking)}
            style={{ borderRadius: '50%' }}
          >
            <Target className="w-5 h-5" />
          </Button>
        </div>

        {/* Speed Control */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 rounded-full hover:bg-accent"
            onClick={() => setSimulationSpeed(prev => Math.min(prev + 0.5, 3))}
            style={{ borderRadius: '50%' }}
          >
            <FastForward className="w-4 h-4" />
          </Button>
          <div className="text-center text-xs bg-card px-2 py-1 rounded font-body" style={{ borderRadius: '3px' }}>
            {simulationSpeed}x
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 rounded-full hover:bg-accent"
            onClick={() => setSimulationSpeed(prev => Math.max(prev - 0.5, 0.5))}
            style={{ borderRadius: '50%' }}
          >
            <Play className="w-4 h-4" />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-20">
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 rounded-full hover:bg-accent"
            onClick={() => setMapZoom(prev => Math.min(prev + 2, 20))}
            style={{ borderRadius: '50%' }}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 rounded-full hover:bg-accent"
            onClick={() => setMapZoom(prev => Math.max(prev - 2, 8))}
            style={{ borderRadius: '50%' }}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Status Panel - Dark Content Card */}
      <div className="p-4 space-y-3 mx-2 mb-0 shadow-lg" style={{ 
        background: 'rgba(30, 30, 30, 0.95)',
        border: '1px solid rgba(88, 37, 239, 0.2)',
        borderRadius: '3px 3px 0 0',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Status Message */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-5 h-5 animate-pulse" style={{ color: '#5825efff' }} />
            <p className="font-medium text-white font-body">{driverStatus}</p>
          </div>
          
          {/* ETA and Progress */}
          <div className="flex justify-center items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" style={{ color: '#5825efff' }} />
              <span className="text-white font-bold font-body">ETA: {vehicleData.eta} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Route className="w-4 h-4" style={{ color: '#5825efff' }} />
              <span className="text-white font-body">Progress: {Math.round(routeProgress)}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 mb-3" style={{ background: 'rgba(88, 37, 239, 0.2)', borderRadius: '3px' }}>
            <div 
              className="h-2 transition-all duration-1000 ease-out"
              style={{ 
                width: `${routeProgress}%`,
                background: '#5825efff',
                borderRadius: '3px'
              }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4">
          <Button
            size="sm"
            variant="outline"
            className="font-body"
            onClick={handleCallDriver}
            style={{ 
              borderRadius: '3px',
              background: 'transparent',
              border: '1px solid #5825efff',
              color: '#5825efff'
            }}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="font-body"
            onClick={handleSendMessage}
            style={{ 
              borderRadius: '3px',
              background: 'transparent',
              border: '1px solid #5825efff',
              color: '#5825efff'
            }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="font-body"
            onClick={() => setShowFullInfo(!showFullInfo)}
            style={{ 
              borderRadius: '3px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Expandable Info Panel */}
        {showFullInfo && (
          <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: 'rgba(88, 37, 239, 0.2)' }}>
            {/* Driver Info */}
            <div className="flex justify-between items-center">
              <span className="text-white font-body">Driver:</span>
              <span className="text-white font-medium font-body">{vehicleData.driver}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white font-body">Vehicle:</span>
              <span className="text-white font-medium font-body">{vehicleData.vehicleNumber}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white font-body">Speed:</span>
              <span className="text-white font-medium font-body">{Math.round(vehicleData.speed)} km/h</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white font-body">Fuel:</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2" style={{ background: 'rgba(88, 37, 239, 0.2)', borderRadius: '3px' }}>
                  <div 
                    className="h-2 transition-all duration-500"
                    style={{ 
                      width: `${vehicleData.fuel}%`,
                      background: '#5825efff',
                      borderRadius: '3px'
                    }}
                  />
                </div>
                <span className="text-white text-sm font-body">{Math.round(vehicleData.fuel)}%</span>
              </div>
            </div>

            {/* Route Details */}
            <div className="space-y-2">
              <h3 className="text-white font-medium font-heading">Route Details:</h3>
              {vehicleData.route.map((location, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className={`w-3 h-3 rounded-full ${
                    location.status === 'completed' ? 'bg-white' :
                    location.status === 'current' ? 'bg-blue-300' :
                    'bg-white/30'
                  }`} />
                  <div className="flex-1">
                    <p className="text-white font-body">{location.address}</p>
                    {location.estimatedTime && location.status === 'pending' && (
                      <p className="text-white/70 text-xs font-body">
                        ETA: {new Date(location.estimatedTime).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsRealTimeTracking;