import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, Package, MapPin, Users, BarChart3, Settings, 
  Clock, CheckCircle, AlertTriangle, Navigation, Activity,
  Scan, FileText, TrendingUp, Shield, Bell, Search,
  QrCode, Camera, Route, Zap, Phone, MessageCircle,
  AlertCircle, Calendar, DollarSign, Globe, Smartphone,
  Battery, Wifi, Signal, Navigation2, Timer, Star,
  Eye, Edit, Trash2, Plus, Filter, Download, Upload,
  RefreshCw, PlayCircle, PauseCircle, StopCircle
} from 'lucide-react';
import LogisticsRealTimeTracking from './LogisticsRealTimeTracking';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface LogisticsDashboardProps {
  currentUser?: any;
}

// Cameroon-specific data structures
interface CameroonAddress {
  region: 'Centre' | 'Littoral' | 'West' | 'Northwest' | 'Southwest' | 'North' | 'Adamawa' | 'East' | 'Far North' | 'South';
  city: string;
  district: string;
  streetAddress: string;
  landmark?: string;
  postalCode?: string;
}

interface Package {
  id: string;
  trackingNumber: string;
  qrCode: string;
  vendor: {
    id: string;
    name: string;
    shopName: string;
    verification: 'verified' | 'pro' | 'basic';
  };
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: CameroonAddress;
    preferences: {
      language: 'French' | 'English';
      notifications: boolean;
      deliveryTime: 'morning' | 'afternoon' | 'evening' | 'anytime';
    };
  };
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
    currency: 'XAF' | 'USD' | 'EUR';
    images: string[];
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
  delivery: {
    method: 'standard' | 'express' | 'overnight' | 'pickup';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    timeSlot: string;
    specialInstructions?: string;
    contactlessDelivery: boolean;
    signature_required: boolean;
    insurance: boolean;
    estimatedDelivery: string;
    actualDelivery?: string;
  };
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
  location: {
    current: CameroonAddress;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    lastUpdated: string;
  };
  timeline: Array<{
    timestamp: string;
    status: string;
    location: string;
    description: string;
    staffId?: string;
    images?: string[];
  }>;
  payments: {
    total: number;
    currency: 'XAF' | 'USD' | 'EUR';
    method: 'mobile_money' | 'card' | 'cash' | 'bank_transfer';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId: string;
  };
  documents: Array<{
    type: 'invoice' | 'receipt' | 'customs' | 'photo' | 'signature';
    url: string;
    uploadedAt: string;
    uploadedBy: string;
  }>;
}

interface Route {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'planned' | 'cancelled';
  driver: {
    id: string;
    name: string;
    phone: string;
    license: string;
    vehicle: string;
    plateNumber: string;
    rating: number;
  };
  packages: Package[];
  stops: Array<{
    id: string;
    address: CameroonAddress;
    packages: string[];
    timeWindow: {
      start: string;
      end: string;
    };
    status: 'pending' | 'completed' | 'failed' | 'skipped';
    completedAt?: string;
    notes?: string;
  }>;
  optimization: {
    totalDistance: number;
    estimatedDuration: number;
    fuelCost: number;
    tollFees: number;
    optimizedOrder: boolean;
    lastOptimized: string;
  };
}

const LogisticsDashboard: React.FC<LogisticsDashboardProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('hub');
  const [isMobile, setIsMobile] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTrackingNumber, setSelectedTrackingNumber] = useState<string | null>(null);
  const [selectedRouteData, setSelectedRouteData] = useState<any>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [clickedTab, setClickedTab] = useState<string | null>(null);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [emergencyAlertData, setEmergencyAlertData] = useState<any>(null);

  // Mobile detection with TikTok theme application
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      
      // Apply TikTok-style mobile theme classes for logistics portal
      if (isMobileView) {
        document.body.classList.add('tiktok-mobile-logistics', 'mobile');
        document.body.classList.remove('desktop');
      } else {
        document.body.classList.remove('tiktok-mobile-logistics', 'mobile');
        document.body.classList.add('desktop');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Cleanup function to remove classes when component unmounts
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.classList.remove('tiktok-mobile-logistics');
    };
  }, []);

  // Handle tab navigation with click animation (matching Header behavior)
  const handleTabClick = (tabId: string) => {
    setClickedTab(tabId);
    setActiveTab(tabId);
    
    // Reset click animation after a short delay
    setTimeout(() => {
      setClickedTab(null);
    }, 300);
  };

  // Emergency Alert Handler
  const handleEmergencyAlert = useCallback(() => {
    const emergencyData = {
      id: `EMERGENCY-${Date.now()}`,
      type: 'critical',
      timestamp: new Date().toISOString(),
      location: 'Current Hub Location',
      driver: currentUser?.name || 'Unknown Driver',
      message: 'Emergency assistance requested',
      priority: 'urgent',
      status: 'active'
    };
    
    setEmergencyAlertData(emergencyData);
    setShowEmergencyAlert(true);
    
    // Log emergency alert
    console.log('🚨 EMERGENCY ALERT TRIGGERED:', emergencyData);
    
    // Simulate emergency alert dispatch (would integrate with real emergency services)
    setTimeout(() => {
      console.log('🚨 Emergency alert dispatched to headquarters');
    }, 500);
  }, [currentUser]);

  // Close Emergency Alert Modal
  const handleCloseEmergencyAlert = useCallback(() => {
    setShowEmergencyAlert(false);
    setEmergencyAlertData(null);
  }, []);

  // Cameroon regions
  const cameroonRegions = [
    'Centre', 'Littoral', 'West', 'Northwest', 'Southwest', 
    'North', 'Adamawa', 'East', 'Far North', 'South'
  ];

  // Enhanced hub metrics with comprehensive data
  const hubMetrics = {
    activeDeliveries: 1247,
    pendingPackages: 892,
    availableDrivers: 156,
    completedToday: 2341,
    averageDeliveryTime: 2.4,
    successRate: 94.2,
    customerSatisfactionScore: 4.6,
    totalRevenue: 45670000, // XAF
    profitMargin: 23.5,
    packagesPerHour: 87,
    averageDistance: 12.7,
    fuelEfficiency: 89.3,
    onTimeDeliveryRate: 91.8
  };

  // Regional performance data
  const regionalPerformance = [
    { region: 'Centre', performance: 95, deliveries: 456 },
    { region: 'Littoral', performance: 88, deliveries: 378 },
    { region: 'West', performance: 92, deliveries: 234 },
    { region: 'Northwest', performance: 85, deliveries: 167 },
    { region: 'Southwest', performance: 79, deliveries: 123 }
  ];

  // Real-time activity feed
  const [recentActivity] = useState([
    {
      id: 1,
      message: 'Package BAT-2024-001234 delivered successfully in Yaoundé',
      time: '2 minutes ago',
      status: 'success',
      region: 'Centre'
    },
    {
      id: 2,
      message: 'New urgent delivery request from Douala - Express shipping',
      time: '5 minutes ago',
      status: 'info',
      region: 'Littoral'
    },
    {
      id: 3,
      message: 'Route optimization completed for West region (+15% efficiency)',
      time: '8 minutes ago',
      status: 'success',
      region: 'West'
    },
    {
      id: 4,
      message: 'Weather alert: Heavy rains in Northwest region may affect deliveries',
      time: '12 minutes ago',
      status: 'warning',
      region: 'Northwest'
    },
    {
      id: 5,
      message: 'Driver Jean Mballa completed 12 deliveries in Bafoussam',
      time: '15 minutes ago',
      status: 'success',
      region: 'West'
    }
  ]);

  // Mock routes data
  const mockRoutes: Route[] = [
    {
      id: 'RT-001',
      name: 'Yaoundé Central Route',
      status: 'active',
      driver: {
        id: 'DR-001',
        name: 'Jean Mballa',
        phone: '+237 6XX XX XX XX',
        license: 'CM-YDE-2024-001',
        vehicle: 'Toyota Hiace',
        plateNumber: 'CE-1234-YDE',
        rating: 4.8
      },
      packages: [],
      stops: [
        {
          id: 'ST-001',
          address: {
            region: 'Centre',
            city: 'Yaoundé',
            district: 'Bastos',
            streetAddress: 'Avenue Kennedy'
          },
          packages: ['BAT-001', 'BAT-002'],
          timeWindow: { start: '09:00', end: '11:00' },
          status: 'completed',
          completedAt: '10:30'
        },
        {
          id: 'ST-002',
          address: {
            region: 'Centre',
            city: 'Yaoundé',
            district: 'Melen',
            streetAddress: 'Carrefour Melen'
          },
          packages: ['BAT-003'],
          timeWindow: { start: '11:30', end: '13:00' },
          status: 'pending'
        }
      ],
      optimization: {
        totalDistance: 45.2,
        estimatedDuration: 4.5,
        fuelCost: 25000,
        tollFees: 2000,
        optimizedOrder: true,
        lastOptimized: '2024-01-15 08:00'
      }
    }
  ];

  // Mock packages data
  const mockPackages: Package[] = [
    {
      id: 'PKG-001',
      trackingNumber: 'BAT-2024-001234',
      qrCode: 'QR-BAT-001234',
      vendor: {
        id: 'VND-001',
        name: 'Marie Kouam',
        shopName: 'Authentic African Fashion',
        verification: 'verified'
      },
      customer: {
        id: 'CUS-001',
        name: 'Grace Tabi',
        phone: '+237 6XX XX XX XX',
        email: 'grace.tabi@email.com',
        address: {
          region: 'Centre',
          city: 'Yaoundé',
          district: 'Bastos',
          streetAddress: '123 Avenue Kennedy'
        },
        preferences: {
          language: 'French',
          notifications: true,
          deliveryTime: 'morning'
        }
      },
      product: {
        id: 'PRD-001',
        name: 'Traditional Kaba Ngondo',
        category: 'Traditional Wear',
        price: 45000,
        currency: 'XAF',
        images: ['img1.jpg'],
        weight: 0.8,
        dimensions: { length: 30, width: 25, height: 5 }
      },
      delivery: {
        method: 'express',
        priority: 'high',
        timeSlot: '09:00-12:00',
        contactlessDelivery: false,
        signature_required: true,
        insurance: true,
        estimatedDelivery: '2024-01-16 11:00'
      },
      status: 'out_for_delivery',
      location: {
        current: {
          region: 'Centre',
          city: 'Yaoundé',
          district: 'Bastos',
          streetAddress: 'Near Bastos Market'
        },
        coordinates: { latitude: 3.8667, longitude: 11.5167 },
        lastUpdated: '2024-01-15 10:30'
      },
      timeline: [
        {
          timestamp: '2024-01-15 08:00',
          status: 'picked_up',
          location: 'Warehouse Yaoundé',
          description: 'Package picked up from vendor'
        },
        {
          timestamp: '2024-01-15 10:30',
          status: 'out_for_delivery',
          location: 'Near Bastos Market',
          description: 'Out for delivery'
        }
      ],
      payments: {
        total: 45000,
        currency: 'XAF',
        method: 'mobile_money',
        status: 'paid',
        transactionId: 'TXN-001234'
      },
      documents: []
    }
  ];

  // Tab configuration
  const tabs = [
    { 
      id: 'hub', 
      label: 'Hub', 
      icon: Activity, 
      description: 'Operations center with real-time metrics and alerts' 
    },
    { 
      id: 'routes', 
      label: 'Routes', 
      icon: Navigation, 
      description: 'Route planning, optimization, and management' 
    },
    { 
      id: 'tracking', 
      label: 'Tracking', 
      icon: MapPin, 
      description: 'Real-time package and driver location tracking' 
    },
    { 
      id: 'scan', 
      label: 'Scan', 
      icon: Scan, 
      description: 'QR code scanning and package processing' 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      description: 'Performance analytics and business intelligence' 
    },
    { 
      id: 'verify', 
      label: 'Verify', 
      icon: Shield, 
      description: 'Package verification and quality assurance' 
    }
  ];

  // Hub component with comprehensive metrics - styled to match screenshots
  const renderHub = () => (
    <div className="logistics-content mobile-logistics-content" style={{ background: '#000000', color: '#ffffff' }}>
      {/* Header Section - Purple Bar like in screenshots */}
      <div 
        className="p-4 mb-6 logistics-header-zero-radius" 
        style={{ 
          background: isMobile ? 'transparent' : '#5825efff',
          marginBottom: '24px',
          border: isMobile ? 'none' : undefined
        }}
      >
        <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
          <Activity className="h-6 w-6" />
          Logistics Hub
        </h1>
        <p className="text-white/80 font-body mt-1">Real-time logistics operations center</p>
      </div>

      {/* Quick Actions Bar */}
      <div className="px-4 mb-6">
        <Card 
          className="border-0" 
          style={{ 
            background: 'rgba(30, 30, 30, 0.95)', 
            border: '1px solid rgba(88, 37, 239, 0.2)',
            borderRadius: '3px'
          }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="font-heading flex items-center gap-2 text-white">
              <Zap className="h-5 w-5" style={{ color: '#5825efff' }} />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                className="btn-moema-primary"
                style={{ 
                  background: '#5825efff',
                  color: 'white',
                  borderRadius: '3px',
                  border: 'none'
                }}
                onClick={() => setActiveTab('scan')}
              >
                <QrCode className="h-4 w-4 mr-2" />
                Scan Package
              </Button>
              <Button 
                style={{
                  background: 'transparent',
                  border: '1px solid #5825efff',
                  color: '#5825efff',
                  borderRadius: '3px'
                }}
                onClick={() => setActiveTab('routes')}
              >
                <Route className="h-4 w-4 mr-2" />
                Create Route
              </Button>
              <Button 
                onClick={handleEmergencyAlert}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 68, 68, 0.6)',
                  color: 'rgba(255, 68, 68, 0.9)',
                  borderRadius: '3px',
                  transition: 'all 0.2s ease',
                  pointerEvents: 'auto'
                }}
                className="emergency-alert-button"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 68, 68, 0.8)';
                  e.currentTarget.style.color = '#ff4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255, 68, 68, 0.6)';
                  e.currentTarget.style.color = 'rgba(255, 68, 68, 0.9)';
                }}
              >
                <Bell className="h-4 w-4 mr-2" />
                Emergency Alert
              </Button>
              <Button 
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '3px'
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card 
            className="border-0" 
            style={{ 
              background: 'rgba(30, 30, 30, 0.95)', 
              border: '1px solid rgba(88, 37, 239, 0.2)',
              borderRadius: '3px'
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold font-heading" style={{ color: '#5825efff' }}>
                    {hubMetrics.activeDeliveries}
                  </p>
                  <p className="text-sm font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Active Deliveries
                  </p>
                </div>
                <Truck className="h-8 w-8" style={{ color: '#5825efff', opacity: 0.7 }} />
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" style={{ color: '#00ff88' }} />
                  <span className="text-xs font-body" style={{ color: '#00ff88' }}>+12% from yesterday</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-0" 
            style={{ 
              background: 'rgba(30, 30, 30, 0.95)', 
              border: '1px solid rgba(88, 37, 239, 0.2)',
              borderRadius: '3px'
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold font-heading" style={{ color: '#ffcc00' }}>
                    {hubMetrics.pendingPackages}
                  </p>
                  <p className="text-sm font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Pending Packages
                  </p>
                </div>
                <Package className="h-8 w-8" style={{ color: '#ffcc00', opacity: 0.7 }} />
              </div>
              <div className="mt-2">
                <Progress 
                  value={75} 
                  className="h-2" 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px'
                  }} 
                />
                <span className="text-xs font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>75% processed</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-0" 
            style={{ 
              background: 'rgba(30, 30, 30, 0.95)', 
              border: '1px solid rgba(88, 37, 239, 0.2)',
              borderRadius: '3px'
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold font-heading" style={{ color: '#00ff88' }}>
                    {hubMetrics.availableDrivers}
                  </p>
                  <p className="text-sm font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Available Drivers
                  </p>
                </div>
                <Users className="h-8 w-8" style={{ color: '#00ff88', opacity: 0.7 }} />
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  <span className="text-xs font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>32 total drivers</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-0" 
            style={{ 
              background: 'rgba(30, 30, 30, 0.95)', 
              border: '1px solid rgba(88, 37, 239, 0.2)',
              borderRadius: '3px'
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold font-heading" style={{ color: '#5825efff' }}>
                    {hubMetrics.completedToday}
                  </p>
                  <p className="text-sm font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Completed Today
                  </p>
                </div>
                <CheckCircle className="h-8 w-8" style={{ color: '#5825efff', opacity: 0.7 }} />
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-1">
                  <Timer className="h-3 w-3" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  <span className="text-xs font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Avg: {hubMetrics.averageDeliveryTime}h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-0" 
            style={{ 
              background: 'rgba(30, 30, 30, 0.95)', 
              border: '1px solid rgba(88, 37, 239, 0.2)',
              borderRadius: '3px'
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold font-heading" style={{ color: '#00ff88' }}>
                    {hubMetrics.successRate}%
                  </p>
                  <p className="text-sm font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Success Rate
                  </p>
                </div>
                <TrendingUp className="h-8 w-8" style={{ color: '#00ff88', opacity: 0.7 }} />
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" style={{ color: '#ffcc00' }} />
                  <span className="text-xs font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {hubMetrics.customerSatisfactionScore}/5 rating
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-0" 
            style={{ 
              background: 'rgba(30, 30, 30, 0.95)', 
              border: '1px solid rgba(88, 37, 239, 0.2)',
              borderRadius: '3px'
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold font-heading" style={{ color: '#00ff88' }}>
                    {(hubMetrics.totalRevenue / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Revenue (XAF)
                  </p>
                </div>
                <DollarSign className="h-8 w-8" style={{ color: '#00ff88', opacity: 0.7 }} />
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" style={{ color: '#00ff88' }} />
                  <span className="text-xs font-body" style={{ color: '#00ff88' }}>
                    {hubMetrics.profitMargin}% margin
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Regional Performance & Recent Activity */}
      <div className="px-4 mb-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Regional Performance */}
          <Card 
            className="border-0" 
            style={{ 
              background: 'rgba(30, 30, 30, 0.95)', 
              border: '1px solid rgba(88, 37, 239, 0.2)',
              borderRadius: '3px'
            }}
          >
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2 text-white">
                <Globe className="h-5 w-5" style={{ color: '#5825efff' }} />
                Regional Performance
              </CardTitle>
              <CardDescription className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Delivery performance across Cameroon regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionalPerformance.map(({ region, performance, deliveries }) => (
                  <div key={region} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-body text-sm font-medium text-white">{region}</span>
                        <span className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {deliveries} deliveries
                        </span>
                      </div>
                      <Progress 
                        value={performance} 
                        className="h-2" 
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '3px'
                        }} 
                      />
                    </div>
                    <div className="ml-4 text-right">
                      <p className="font-body text-sm font-bold" style={{ color: '#5825efff' }}>{performance}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Real-time Activity Feed */}
          <Card 
            className="border-0" 
            style={{ 
              background: 'rgba(30, 30, 30, 0.95)', 
              border: '1px solid rgba(88, 37, 239, 0.2)',
              borderRadius: '3px'
            }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading flex items-center gap-2 text-white">
                  <Activity className="h-5 w-5" style={{ color: '#5825efff' }} />
                  Live Activity Feed
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-body" style={{ color: '#00ff88' }}>Live</span>
                  </div>
                  <Switch
                    checked={realTimeUpdates}
                    onCheckedChange={setRealTimeUpdates}
                    style={{ 
                      background: realTimeUpdates ? '#5825efff' : 'rgba(255, 255, 255, 0.2)'
                    }}
                  />
                </div>
              </div>
              <CardDescription className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Latest logistics operations and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-hide">
                {recentActivity.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-3 rounded"
                    style={{ 
                      background: activity.status === 'warning' ? 'rgba(255, 204, 0, 0.1)' : 'rgba(20, 20, 20, 0.8)',
                      border: '1px solid rgba(88, 37, 239, 0.1)',
                      borderRadius: '3px',
                      borderLeft: `3px solid ${
                        activity.status === 'success' ? '#00ff88' :
                        activity.status === 'warning' ? '#ffcc00' : 
                        activity.status === 'info' ? '#5825efff' : 'rgba(255, 255, 255, 0.3)'
                      }`
                    }}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' : 
                      activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-white">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{activity.time}</p>
                        <Badge 
                          variant="outline" 
                          className="text-xs font-body"
                          style={{
                            background: 'rgba(88, 37, 239, 0.2)',
                            border: '1px solid #5825efff',
                            color: '#5825efff',
                            borderRadius: '3px'
                          }}
                        >
                          {activity.region}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="px-4 mb-6">
        <Card 
          className="border-0" 
          style={{ 
            background: 'rgba(30, 30, 30, 0.95)', 
            border: '1px solid rgba(88, 37, 239, 0.2)',
            borderRadius: '3px'
          }}
        >
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5" style={{ color: '#ffcc00' }} />
              Active Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div 
                className="flex items-center gap-3 p-3 border rounded" 
                style={{ 
                  borderColor: '#ffcc00', 
                  backgroundColor: 'rgba(255, 204, 0, 0.1)',
                  borderRadius: '3px'
                }}
              >
                <AlertCircle className="h-5 w-5" style={{ color: '#ffcc00' }} />
                <div className="flex-1">
                  <p className="font-body font-medium text-white">Weather Alert: Heavy rains expected in Littoral region</p>
                  <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Consider adjusting delivery schedules for Douala area routes
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="font-body" 
                  style={{ 
                    borderRadius: '3px',
                    background: 'transparent',
                    border: '1px solid #5825efff',
                    color: '#5825efff'
                  }}
                >
                  View Details
                </Button>
              </div>

              <div 
                className="flex items-center gap-3 p-3 border rounded" 
                style={{ 
                  borderColor: '#5825efff', 
                  backgroundColor: 'rgba(88, 37, 239, 0.1)', 
                  borderRadius: '3px' 
                }}
              >
                <Bell className="h-5 w-5" style={{ color: '#5825efff' }} />
                <div className="flex-1">
                  <p className="font-body font-medium text-white">System Update: New route optimization algorithm deployed</p>
                  <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Routes are now 15% more efficient with improved Cameroon road data
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="font-body" 
                  style={{ 
                    borderRadius: '3px',
                    background: 'transparent',
                    border: '1px solid #5825efff',
                    color: '#5825efff'
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Routes management component
  const renderRoutes = () => (
    <div className="logistics-content mobile-logistics-content" style={{ background: '#000000', color: '#ffffff' }}>
      {/* Header Section - Purple Bar like in Hub */}
      <div 
        className="p-4 mb-6 logistics-header-zero-radius" 
        style={{ 
          background: isMobile ? 'transparent' : '#5825efff',
          marginBottom: '24px',
          border: isMobile ? 'none' : undefined
        }}
      >
        <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
          <Navigation className="h-6 w-6" />
          Route Management
        </h1>
        <p className="text-white/80 font-body mt-1">Advanced route planning and optimization</p>
      </div>

      <div className="px-4 space-y-6">
      <Card className="border-0" style={{ 
        background: 'rgba(30, 30, 30, 0.95)', 
        border: '1px solid rgba(88, 37, 239, 0.2)',
        borderRadius: '3px' 
      }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading flex items-center gap-2 text-white">
              <Navigation className="h-5 w-5" style={{ color: '#5825efff' }} />
              Route Management & Optimization
            </CardTitle>
            <Button 
              className="btn-moema-primary" 
              style={{ 
                background: '#5825efff',
                color: 'white',
                borderRadius: '3px',
                border: 'none'
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Route
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="active" 
            className="w-full logistics-tabs-dark"
            style={{
              '--tabs-bg': 'rgba(20, 20, 20, 0.9)',
              '--tabs-border': '1px solid rgba(88, 37, 239, 0.3)',
              '--tabs-active-bg': '#5825efff',
              '--tabs-active-color': '#ffffff',
              '--tabs-text-color': 'rgba(255, 255, 255, 0.7)'
            } as React.CSSProperties}
          >
            <TabsList 
              className="grid w-full grid-cols-4 p-1"
              style={{
                background: 'rgba(20, 20, 20, 0.9)',
                border: '1px solid rgba(88, 37, 239, 0.3)',
                borderRadius: '8px'
              }}
            >
              <TabsTrigger 
                value="active" 
                className="font-body"
                style={{
                  background: 'transparent',
                  color: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '6px',
                  border: '1px solid transparent'
                }}
                data-state="inactive"
              >
                Active Routes
              </TabsTrigger>
              <TabsTrigger 
                value="planning" 
                className="font-body"
                style={{
                  background: 'transparent',
                  color: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '6px',
                  border: '1px solid transparent'
                }}
                data-state="inactive"
              >
                Planning
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="font-body"
                style={{
                  background: 'transparent',
                  color: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '6px',
                  border: '1px solid transparent'
                }}
                data-state="inactive"
              >
                Completed
              </TabsTrigger>
              <TabsTrigger 
                value="optimize" 
                className="font-body"
                style={{
                  background: 'transparent',
                  color: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '6px',
                  border: '1px solid transparent'
                }}
                data-state="inactive"
              >
                Optimize
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4">
              {mockRoutes.map((route) => (
                <Card 
                  key={route.id} 
                  className="border-0" 
                  style={{ 
                    background: 'rgba(20, 20, 20, 0.8)',
                    border: '1px solid rgba(88, 37, 239, 0.1)',
                    borderRadius: '3px' 
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={route.status === 'active' ? 'default' : 'secondary'}
                          className="font-body"
                        >
                          {route.status}
                        </Badge>
                        <h3 className="font-heading font-semibold text-white">{route.id}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          style={{ 
                            borderRadius: '3px',
                            background: 'transparent',
                            border: '1px solid #5825efff',
                            color: '#5825efff'
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Track
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          style={{ 
                            borderRadius: '3px',
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Driver</p>
                        <p className="font-body font-medium text-white">{route.driver.name}</p>
                      </div>
                      <div>
                        <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Vehicle</p>
                        <p className="font-body font-medium text-white">{route.driver.vehicle}</p>
                      </div>
                      <div>
                        <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Distance</p>
                        <p className="font-body font-medium text-white">{route.optimization.totalDistance} km</p>
                      </div>
                      <div>
                        <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>ETA</p>
                        <p className="font-body font-medium text-white">{route.optimization.estimatedDuration}h</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-body text-sm font-medium text-white">Stops ({route.stops.length})</p>
                      {route.stops.map((stop) => (
                        <div key={stop.id} className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${
                            stop.status === 'completed' ? 'bg-green-500' :
                            stop.status === 'failed' ? 'bg-red-500' : 'bg-gray-400'
                          }`} />
                          <span className="font-body text-white">
                            {stop.address.district}, {stop.address.city} ({stop.packages.length} packages)
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="planning">
              <div className="text-center py-12">
                <Route className="h-12 w-12 mx-auto mb-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  No routes in planning stage
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto mb-4" style={{ color: '#00ff88' }} />
                <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  156 routes completed today
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="optimize">
              <Card 
                className="border-0" 
                style={{ 
                  background: 'rgba(20, 20, 20, 0.8)',
                  border: '1px solid rgba(88, 37, 239, 0.1)',
                  borderRadius: '3px' 
                }}
              >
                <CardHeader>
                  <CardTitle className="font-heading text-white">AI Route Optimization</CardTitle>
                  <CardDescription className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Optimize routes using Cameroon road conditions and traffic data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Select>
                      <SelectTrigger 
                        className="w-48"
                        style={isMobile ? {
                          backgroundColor: 'rgba(26, 26, 26, 0.8)',
                          border: '1px solid rgba(88, 37, 239, 0.5)',
                          color: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '8px'
                        } : {}}
                      >
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent
                        style={isMobile ? {
                          backgroundColor: 'rgba(20, 20, 20, 0.95)',
                          backgroundImage: 'none',
                          border: '1px solid rgba(88, 37, 239, 0.4)',
                          borderRadius: '8px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                          backdropFilter: 'blur(10px)',
                          color: 'rgba(255, 255, 255, 0.9)'
                        } : {}}
                      >
                        {cameroonRegions.map((region) => (
                          <SelectItem 
                            key={region} 
                            value={region.toLowerCase()}
                            style={isMobile ? {
                              backgroundColor: 'transparent',
                              color: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: '6px'
                            } : {}}
                          >
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      className="btn-moema-primary" 
                      style={{ 
                        background: '#5825efff',
                        color: 'white',
                        borderRadius: '3px',
                        border: 'none'
                      }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Optimize Routes
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold font-heading" style={{ color: '#00ff88' }}>15%</p>
                      <p className="text-sm font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Time Saved</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-heading" style={{ color: '#00ff88' }}>12%</p>
                      <p className="text-sm font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Fuel Saved</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-heading" style={{ color: '#00ff88' }}>8%</p>
                      <p className="text-sm font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Cost Reduced</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </div>
  );

  // Enhanced tracking handler
  const handleTrackPackage = (trackingNumber: string, routeData?: any) => {
    console.log('🚚 Tracking Package:', trackingNumber, routeData);
    setSelectedTrackingNumber(trackingNumber);
    setSelectedRouteData(routeData);
    // Navigate to tracking tab if not already there
    if (activeTab !== 'tracking') {
      setActiveTab('tracking');
    }
  };

  const handleBackToTracking = () => {
    console.log('🔙 Back to tracking overview');
    setSelectedTrackingNumber(null);
    setSelectedRouteData(null);
  };

  // Tracking component
  const renderTracking = () => {
    // If a specific tracking number is selected, show detailed tracking
    if (selectedTrackingNumber && selectedRouteData) {
      return (
        <LogisticsRealTimeTracking
          trackingNumber={selectedTrackingNumber}
          routeData={selectedRouteData}
          onBack={handleBackToTracking}
        />
      );
    }

    // Otherwise show the tracking overview
    return (
      <div className="logistics-content mobile-logistics-content" style={{ background: '#000000', color: '#ffffff' }}>
        {/* Header Section - Purple Bar like in Hub */}
        <div 
          className="p-4 mb-6 logistics-header-zero-radius" 
          style={{ 
            background: isMobile ? 'transparent' : '#5825efff',
            marginBottom: '24px',
            border: isMobile ? 'none' : undefined
          }}
        >
          <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Real-Time Tracking
          </h1>
          <p className="text-white/80 font-body mt-1">Live package and driver location tracking</p>
        </div>

        <div className="px-4 space-y-6">
        <Card className="border-0" style={{ 
          background: 'rgba(30, 30, 30, 0.95)', 
          border: '1px solid rgba(88, 37, 239, 0.2)',
          borderRadius: '3px' 
        }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading flex items-center gap-2 text-white">
                <MapPin className="h-5 w-5" style={{ color: '#5825efff' }} />
                Real-Time Package & Driver Tracking
              </CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  id="logistics-tracking-search"
                  placeholder="Search tracking number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 font-body logistics-search-input"
                  style={isMobile ? {
                    backgroundColor: 'rgba(26, 26, 26, 0.8)',
                    border: '1px solid rgba(88, 37, 239, 0.5)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  } : { 
                    borderRadius: '3px' 
                  }}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  style={{ 
                    borderRadius: '3px',
                    background: 'transparent',
                    border: '1px solid #5825efff',
                    color: '#5825efff'
                  }}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Live Map Placeholder */}
            <Card 
              className="border-0" 
              style={{ 
                background: 'rgba(20, 20, 20, 0.8)',
                border: '1px solid rgba(88, 37, 239, 0.1)',
                borderRadius: '3px' 
              }}
            >
              <CardContent className="p-0">
                <div 
                  className="h-96 bg-gradient-to-br flex items-center justify-center"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(40, 40, 40, 0.9))',
                    borderRadius: '3px'
                  }}
                >
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-4" style={{ color: '#5825efff' }} />
                    <h3 className="font-heading text-xl mb-2 text-white">Interactive Cameroon Map</h3>
                    <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Real-time tracking of {hubMetrics.activeDeliveries} active deliveries across Cameroon
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-sm font-body text-white">On Route</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="text-sm font-body text-white">Delayed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span className="text-sm font-body text-white">At Hub</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Package Tracking List */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card 
                className="border-0" 
                style={{ 
                  background: 'rgba(20, 20, 20, 0.8)',
                  border: '1px solid rgba(88, 37, 239, 0.1)',
                  borderRadius: '3px' 
                }}
              >
                <CardHeader>
                  <CardTitle className="font-heading text-white">Active Packages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockPackages.map((pkg) => (
                    <div 
                      key={pkg.id} 
                      className="border rounded-lg p-4" 
                      style={{ 
                        borderRadius: '3px',
                        background: 'rgba(10, 10, 10, 0.5)',
                        border: '1px solid rgba(88, 37, 239, 0.2)'
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-body font-semibold text-white">{pkg.trackingNumber}</p>
                          <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {pkg.customer.name}
                          </p>
                        </div>
                        <Badge 
                          variant={pkg.status === 'out_for_delivery' ? 'default' : 'secondary'}
                          className="font-body"
                        >
                          {pkg.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Destination</p>
                          <p className="font-body text-white">{pkg.customer.address.district}</p>
                        </div>
                        <div>
                          <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>ETA</p>
                          <p className="font-body text-white">{new Date(pkg.delivery.estimatedDelivery).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          style={{ 
                            borderRadius: '3px',
                            background: 'transparent',
                            border: '1px solid #5825efff',
                            color: '#5825efff'
                          }}
                          onClick={() => handleTrackPackage(pkg.trackingNumber, { packageData: pkg })}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Track
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          style={{ 
                            borderRadius: '3px',
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          style={{ 
                            borderRadius: '3px',
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card 
                className="border-0" 
                style={{ 
                  background: 'rgba(20, 20, 20, 0.8)',
                  border: '1px solid rgba(88, 37, 239, 0.1)',
                  borderRadius: '3px' 
                }}
              >
                <CardHeader>
                  <CardTitle className="font-heading text-white">Driver Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockRoutes.map((route) => (
                    <div 
                      key={route.id} 
                      className="border rounded-lg p-4" 
                      style={{ 
                        borderRadius: '3px',
                        background: 'rgba(10, 10, 10, 0.5)',
                        border: '1px solid rgba(88, 37, 239, 0.2)'
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-body font-semibold text-white">{route.driver.name}</p>
                          <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {route.driver.vehicle} - {route.driver.plateNumber}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm font-body" style={{ color: '#00ff88' }}>Active</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Current Location</p>
                          <p className="font-body text-white">Near Bastos Market</p>
                        </div>
                        <div>
                          <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Packages</p>
                          <p className="font-body text-white">{route.stops.reduce((acc, stop) => acc + stop.packages.length, 0)} remaining</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" style={{ borderRadius: '3px' }}>
                          <MapPin className="h-3 w-3 mr-1" />
                          Locate
                        </Button>
                        <Button variant="outline" size="sm" style={{ borderRadius: '3px' }}>
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm" style={{ borderRadius: '3px' }}>
                          <Route className="h-3 w-3 mr-1" />
                          Route
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  };

  // Recent scans data
  const [recentScans] = useState([
    {
      id: 1,
      packageId: 'BAT-2024-001234',
      qrCode: 'QR-BAT-001234',
      action: 'Package picked up',
      location: 'Warehouse Yaoundé',
      time: '10:30 AM',
      staff: 'Jean Mballa',
      status: 'success'
    },
    {
      id: 2,
      packageId: 'BAT-2024-001235',
      qrCode: 'QR-BAT-001235',
      action: 'Out for delivery',
      location: 'Douala Hub',
      time: '09:45 AM',
      staff: 'Marie Kouam',
      status: 'success'
    },
    {
      id: 3,
      packageId: 'BAT-2024-001236',
      qrCode: 'QR-BAT-001236',
      action: 'Delivery attempted',
      location: 'Bafoussam Center',
      time: '08:20 AM',
      staff: 'Paul Nkomo',
      status: 'warning'
    }
  ]);

  // Scan component
  const renderScan = () => (
    <div className="logistics-content mobile-logistics-content" style={{ background: '#000000', color: '#ffffff' }}>
      {/* Header Section - Purple Bar like in Hub */}
      <div 
        className="p-4 mb-6 logistics-header-zero-radius" 
        style={{ 
          background: isMobile ? 'transparent' : '#5825efff',
          marginBottom: '24px',
          border: isMobile ? 'none' : undefined
        }}
      >
        <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
          <QrCode className="h-6 w-6" />
          QR Scanner & Processing
        </h1>
        <p className="text-white/80 font-body mt-1">Package scanning and processing center</p>
      </div>

      <div className="px-4 space-y-6">
      <Card className="border-0" style={{ 
        background: 'rgba(30, 30, 30, 0.95)', 
        border: '1px solid rgba(88, 37, 239, 0.2)',
        borderRadius: '3px' 
      }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading flex items-center gap-2 text-white">
              <QrCode className="h-5 w-5" style={{ color: '#5825efff' }} />
              QR Code Scanner & Package Processing
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                className="btn-moema-primary" 
                style={{ 
                  background: '#5825efff',
                  color: 'white',
                  borderRadius: '3px',
                  border: 'none'
                }}
              >
                <Camera className="h-4 w-4 mr-2" />
                Open Scanner
              </Button>
              <Button 
                variant="outline" 
                style={{ 
                  borderRadius: '3px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Scanner Interface */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card 
              className="border-0" 
              style={{ 
                background: 'rgba(20, 20, 20, 0.8)',
                border: '1px solid rgba(88, 37, 239, 0.1)',
                borderRadius: '3px' 
              }}
            >
              <CardContent className="p-0">
                <div 
                  className="h-64 bg-gradient-to-br flex items-center justify-center"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(40, 40, 40, 0.9))',
                    borderRadius: '3px'
                  }}
                >
                  <div className="text-center">
                    <QrCode className="h-16 w-16 mx-auto mb-4" style={{ color: '#5825efff' }} />
                    <h3 className="font-heading text-lg mb-2 text-white">QR Code Scanner</h3>
                    <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Position QR code within the frame to scan
                    </p>
                    <Button 
                      className="btn-moema-primary mt-4" 
                      style={{ 
                        background: '#5825efff',
                        color: 'white',
                        borderRadius: '3px',
                        border: 'none'
                      }}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Activate Camera
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-0" 
              style={{ 
                background: 'rgba(20, 20, 20, 0.8)',
                border: '1px solid rgba(88, 37, 239, 0.1)',
                borderRadius: '3px' 
              }}
            >
              <CardHeader>
                <CardTitle className="font-heading text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  style={{ 
                    borderRadius: '3px',
                    background: 'transparent',
                    border: '1px solid #5825efff',
                    color: '#5825efff'
                  }}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Mark as Picked Up
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  style={{ 
                    borderRadius: '3px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Out for Delivery
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  style={{ 
                    borderRadius: '3px',
                    background: 'transparent',
                    border: '1px solid #00ff88',
                    color: '#00ff88'
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Delivered
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  style={{ 
                    borderRadius: '3px',
                    background: 'transparent',
                    border: '1px solid #ffcc00',
                    color: '#ffcc00'
                  }}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Scans */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg text-white">Recent Scans</h3>
              <Button 
                variant="outline" 
                size="sm" 
                style={{ 
                  borderRadius: '3px',
                  background: 'transparent',
                  border: '1px solid #5825efff',
                  color: '#5825efff'
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div 
                  key={scan.id} 
                  className="flex items-center justify-between p-4 border rounded" 
                  style={{ 
                    borderRadius: '3px',
                    background: 'rgba(10, 10, 10, 0.5)',
                    border: '1px solid rgba(88, 37, 239, 0.2)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      scan.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="font-body font-medium text-white">{scan.packageId}</p>
                      <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {scan.action}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {scan.time}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      style={{ 
                        borderRadius: '3px',
                        background: 'transparent',
                        border: '1px solid #5825efff',
                        color: '#5825efff'
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
        
      {/* Scanning Statistics */}
      <Card 
        className="border-0 mt-6" 
        style={{ 
          background: 'rgba(30, 30, 30, 0.95)', 
          border: '1px solid rgba(88, 37, 239, 0.2)',
          borderRadius: '3px' 
        }}
      >
        <CardHeader>
          <CardTitle className="font-heading text-white">Scanning Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold font-heading" style={{ color: '#5825efff' }}>
                1,247
              </p>
              <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Scans Today
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold font-heading" style={{ color: '#00ff88' }}>
                98.5%
              </p>
              <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Success Rate
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold font-heading" style={{ color: '#ffcc00' }}>
                1.2s
              </p>
              <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Avg Scan Time
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold font-heading" style={{ color: '#5825efff' }}>
                18
              </p>
              <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Active Scanners
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );

  // Analytics component
  const renderAnalytics = () => (
    <div className="logistics-content mobile-logistics-content" style={{ background: '#000000', color: '#ffffff' }}>
      {/* Header Section - Purple Bar like in Hub */}
      <div 
        className="p-4 mb-6 logistics-header-zero-radius" 
        style={{ 
          background: isMobile ? 'transparent' : '#5825efff',
          marginBottom: '24px',
          border: isMobile ? 'none' : undefined
        }}
      >
        <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Analytics & Reporting
        </h1>
        <p className="text-white/80 font-body mt-1">Comprehensive analytics and business intelligence</p>
      </div>

      <div className="px-4 space-y-6">
      <Card className="border-0" style={{ 
        background: 'rgba(30, 30, 30, 0.95)', 
        border: '1px solid rgba(88, 37, 239, 0.2)',
        borderRadius: '3px' 
      }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading flex items-center gap-2 text-white">
              <BarChart3 className="h-5 w-5" style={{ color: '#5825efff' }} />
              Comprehensive Analytics & Reporting
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger 
                  className="w-48"
                  style={isMobile ? {
                    backgroundColor: 'rgba(26, 26, 26, 0.8)',
                    border: '1px solid rgba(88, 37, 239, 0.5)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px'
                  } : {}}
                >
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent
                  style={isMobile ? {
                    backgroundColor: 'rgba(20, 20, 20, 0.95)',
                    backgroundImage: 'none',
                    border: '1px solid rgba(88, 37, 239, 0.4)',
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(10px)',
                    color: 'rgba(255, 255, 255, 0.9)'
                  } : {}}
                >
                  <SelectItem 
                    value="all"
                    style={isMobile ? {
                      backgroundColor: 'transparent',
                      color: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '6px'
                    } : {}}
                  >
                    All Regions
                  </SelectItem>
                  {cameroonRegions.map((region) => (
                    <SelectItem 
                      key={region} 
                      value={region.toLowerCase()}
                      style={isMobile ? {
                        backgroundColor: 'transparent',
                        color: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '6px'
                      } : {}}
                    >
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                style={{ 
                  borderRadius: '3px',
                  background: 'transparent',
                  border: '1px solid #5825efff',
                  color: '#5825efff'
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card 
              className="border-0 text-center p-6" 
              style={{ 
                background: 'rgba(20, 20, 20, 0.8)',
                border: '1px solid rgba(88, 37, 239, 0.1)',
                borderRadius: '3px' 
              }}
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full" style={{ background: 'rgba(88, 37, 239, 0.2)' }} >
                <div className="w-full h-full flex items-center justify-center">
                  <Truck className="h-8 w-8" style={{ color: '#5825efff' }} />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading" style={{ color: '#5825efff' }}>
                {hubMetrics.activeDeliveries.toLocaleString()}
              </p>
              <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Deliveries
              </p>
            </Card>

            <Card 
              className="border-0 text-center p-6" 
              style={{ 
                background: 'rgba(20, 20, 20, 0.8)',
                border: '1px solid rgba(88, 37, 239, 0.1)',
                borderRadius: '3px' 
              }}
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full" style={{ background: 'rgba(0, 255, 136, 0.2)' }}>
                <div className="w-full h-full flex items-center justify-center">
                  <TrendingUp className="h-8 w-8" style={{ color: '#00ff88' }} />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading" style={{ color: '#00ff88' }}>
                {hubMetrics.successRate}%
              </p>
              <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Success Rate
              </p>
            </Card>

            <Card 
              className="border-0 text-center p-6" 
              style={{ 
                background: 'rgba(20, 20, 20, 0.8)',
                border: '1px solid rgba(88, 37, 239, 0.1)',
                borderRadius: '3px' 
              }}
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full" style={{ background: 'rgba(255, 204, 0, 0.2)' }}>
                <div className="w-full h-full flex items-center justify-center">
                  <Clock className="h-8 w-8" style={{ color: '#ffcc00' }} />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading" style={{ color: '#ffcc00' }}>
                {hubMetrics.averageDeliveryTime}h
              </p>
              <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Avg Delivery Time
              </p>
            </Card>

            <Card 
              className="border-0 text-center p-6" 
              style={{ 
                background: 'rgba(20, 20, 20, 0.8)',
                border: '1px solid rgba(88, 37, 239, 0.1)',
                borderRadius: '3px' 
              }}
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full" style={{ background: 'rgba(88, 37, 239, 0.2)' }}>
                <div className="w-full h-full flex items-center justify-center">
                  <DollarSign className="h-8 w-8" style={{ color: '#5825efff' }} />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading" style={{ color: '#5825efff' }}>
                {(hubMetrics.totalRevenue / 1000000).toFixed(1)}M
              </p>
              <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Revenue (XAF)
              </p>
            </Card>
          </div>

          {/* Charts Placeholder */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card 
              className="border-0" 
              style={{ 
                background: 'rgba(20, 20, 20, 0.8)',
                border: '1px solid rgba(88, 37, 239, 0.1)',
                borderRadius: '3px' 
              }}
            >
              <CardHeader>
                <CardTitle className="font-heading text-white">Daily Delivery Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="h-64 bg-gradient-to-br flex items-center justify-center"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(40, 40, 40, 0.9))',
                    borderRadius: '3px'
                  }}
                >
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" style={{ color: '#5825efff' }} />
                    <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Interactive delivery trends chart
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-0" 
              style={{ 
                background: 'rgba(20, 20, 20, 0.8)',
                border: '1px solid rgba(88, 37, 239, 0.1)',
                borderRadius: '3px' 
              }}
            >
              <CardHeader>
                <CardTitle className="font-heading text-white">Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="h-64 bg-gradient-to-br flex items-center justify-center"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(40, 40, 40, 0.9))',
                    borderRadius: '3px'
                  }}
                >
                  <div className="text-center">
                    <Globe className="h-12 w-12 mx-auto mb-4" style={{ color: '#00ff88' }} />
                    <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Cameroon regions performance map
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics */}
          <Card 
            className="border-0" 
            style={{ 
              background: 'rgba(20, 20, 20, 0.8)',
              border: '1px solid rgba(88, 37, 239, 0.1)',
              borderRadius: '3px' 
            }}
          >
            <CardHeader>
              <CardTitle className="font-heading text-white">Detailed Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                <div className="text-center">
                  <p className="text-lg font-bold font-heading" style={{ color: '#5825efff' }}>
                    {hubMetrics.onTimeDeliveryRate}%
                  </p>
                  <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    On-time Delivery
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-bold font-heading" style={{ color: '#00ff88' }}>
                    {hubMetrics.packagesPerHour}
                  </p>
                  <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Packages/Hour
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-bold font-heading" style={{ color: '#ffcc00' }}>
                    {hubMetrics.averageDistance}km
                  </p>
                  <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Avg Distance
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-bold font-heading" style={{ color: '#00ff88' }}>
                    {hubMetrics.fuelEfficiency}%
                  </p>
                  <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Fuel Efficiency
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-bold font-heading" style={{ color: '#5825efff' }}>
                    {hubMetrics.customerSatisfactionScore}/5
                  </p>
                  <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Customer Rating
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-bold font-heading" style={{ color: '#00ff88' }}>
                    {hubMetrics.profitMargin}%
                  </p>
                  <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Profit Margin
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      </div>
    </div>
  );

  // Verification component
  const renderVerify = () => (
    <div className="logistics-content mobile-logistics-content" style={{ background: '#000000', color: '#ffffff' }}>
      {/* Header Section - Purple Bar like in Hub */}
      <div 
        className="p-4 mb-6 logistics-header-zero-radius" 
        style={{ 
          background: isMobile ? 'transparent' : '#5825efff',
          marginBottom: '24px',
          border: isMobile ? 'none' : undefined
        }}
      >
        <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Package Verification
        </h1>
        <p className="text-white/80 font-body mt-1">Quality assurance and verification center</p>
      </div>

      <div className="px-4 space-y-6">
      <Card className="border-0" style={{ 
        background: 'rgba(30, 30, 30, 0.95)', 
        border: '1px solid rgba(88, 37, 239, 0.2)',
        borderRadius: '3px' 
      }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading flex items-center gap-2 text-white">
              <Shield className="h-5 w-5" style={{ color: '#5825efff' }} />
              Package Verification & Quality Assurance
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                className="btn-moema-primary" 
                style={{ 
                  background: '#5825efff',
                  color: 'white',
                  borderRadius: '3px',
                  border: 'none'
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Verification
              </Button>
              <Button 
                variant="outline" 
                style={{ 
                  borderRadius: '3px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Verification Process */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card 
              className="border-0" 
              style={{ 
                background: 'rgba(20, 20, 20, 0.8)',
                border: '1px solid rgba(88, 37, 239, 0.1)',
                borderRadius: '3px' 
              }}
            >
              <CardHeader>
                <CardTitle className="font-heading text-center text-white">Package Inspection</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full" style={{ background: 'rgba(88, 37, 239, 0.2)' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-8 w-8" style={{ color: '#5825efff' }} />
                  </div>
                </div>
                <p className="font-body text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Physical inspection of package condition, weight, and dimensions
                </p>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  style={{ 
                    borderRadius: '3px',
                    background: 'transparent',
                    border: '1px solid #5825efff',
                    color: '#5825efff'
                  }}
                >
                  Start Inspection
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="border-0" 
              style={{ 
                background: 'rgba(20, 20, 20, 0.8)',
                border: '1px solid rgba(88, 37, 239, 0.1)',
                borderRadius: '3px' 
              }}
            >
              <CardHeader>
                <CardTitle className="font-heading text-center text-white">Document Check</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full" style={{ background: 'rgba(0, 255, 136, 0.2)' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="h-8 w-8" style={{ color: '#00ff88' }} />
                  </div>
                </div>
                <p className="font-body text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Verify shipping documents, customs forms, and insurance papers
                </p>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  style={{ 
                    borderRadius: '3px',
                    background: 'transparent',
                    border: '1px solid #00ff88',
                    color: '#00ff88'
                  }}
                >
                  Check Documents
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="border-0" 
              style={{ 
                background: 'rgba(20, 20, 20, 0.8)',
                border: '1px solid rgba(88, 37, 239, 0.1)',
                borderRadius: '3px' 
              }}
            >
              <CardHeader>
                <CardTitle className="font-heading text-center text-white">Quality Approval</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full" style={{ background: 'rgba(88, 37, 239, 0.2)' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8" style={{ color: '#5825efff' }} />
                  </div>
                </div>
                <p className="font-body text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Final quality check and approval for delivery release
                </p>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  style={{ 
                    borderRadius: '3px',
                    background: 'transparent',
                    border: '1px solid #5825efff',
                    color: '#5825efff'
                  }}
                >
                  Approve Package
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Verification Statistics */}
          <Card 
            className="border-0" 
            style={{ 
              background: 'rgba(20, 20, 20, 0.8)',
              border: '1px solid rgba(88, 37, 239, 0.1)',
              borderRadius: '3px' 
            }}
          >
            <CardHeader>
              <CardTitle className="font-heading text-white">Quality Assurance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full" style={{ background: 'rgba(0, 255, 136, 0.2)' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8" style={{ color: '#00ff88' }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold font-heading" style={{ color: '#00ff88' }}>
                    98.7%
                  </p>
                  <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Pass Rate
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full" style={{ background: 'rgba(88, 37, 239, 0.2)' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <Shield className="h-8 w-8" style={{ color: '#5825efff' }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold font-heading" style={{ color: '#5825efff' }}>
                    156
                  </p>
                  <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Verified Packages
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full" style={{ background: 'rgba(255, 204, 0, 0.2)' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <Star className="h-8 w-8" style={{ color: '#ffcc00' }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold font-heading" style={{ color: '#ffcc00' }}>
                    4.8/5
                  </p>
                  <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Quality Score
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'hub': return renderHub();
      case 'routes': return renderRoutes();
      case 'tracking': return renderTracking();
      case 'scan': return renderScan();
      case 'analytics': return renderAnalytics();
      case 'verify': return renderVerify();
      default: return renderHub();
    }
  };

  // Mobile TikTok-style layout with modern dark theme consistency
  if (isMobile) {
    return (
      <div className="tiktok-mobile-page mobile-logistics-content" style={{ 
        background: '#000000',
        backgroundColor: '#000000',
        minHeight: '100vh'
      }}>

        {/* Mobile Content with deep black background */}
        <div className="tiktok-mobile-container mobile-logistics-content" style={{ 
          background: '#000000', 
          backgroundColor: '#000000',
          minHeight: '100vh',
          paddingBottom: '40px'
        }}>
          {renderContent()}
        </div>

        {/* Mobile Bottom Navigation - Styled to Match Top Header */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t logistics-header-zero-radius logistics-bottom-nav"
          style={{ 
            backgroundColor: '#000000', // Match header black background
            borderColor: 'rgba(255, 255, 255, 0.1)', // Match header border
            backdropFilter: 'blur(20px)',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)', // Match header shadow
            borderRadius: '0px' // Force 0px border-radius like header
          }}
        >
          <div className="flex items-center px-4 py-2 h-16"> {/* Match header height */}
            <div className="flex items-center justify-between w-full">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    data-active={isActive}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTabClick(tab.id)}
                    onMouseEnter={() => setHoveredTab(tab.id)}
                    onMouseLeave={() => setHoveredTab(null)}
                    className={`flex flex-col items-center space-y-1 p-2 font-body transition-all duration-300 ${
                      (hoveredTab === tab.id || clickedTab === tab.id) ? 'animate-pulse' : ''
                    }`}
                    style={{
                      color: isActive ? 'var(--pure-white)' : 'rgba(255, 255, 255, 0.6)',
                      backgroundColor: isActive ? 'rgba(88, 37, 239, 0.2)' : 'transparent',
                      borderRadius: '0px', // Match header 0px border-radius on mobile
                      border: 'none',
                      minWidth: '48px',
                      fontSize: '11px'
                    }}
                  >
                    <Icon 
                      className="h-4 w-4" 
                      style={{ 
                        color: isActive ? 'var(--pure-white)' : 'rgba(255, 255, 255, 0.6)',
                        filter: isActive ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' : 'none'
                      }}
                    />
                    <span 
                      className="font-body text-xs leading-tight"
                      style={{ 
                        color: isActive ? 'var(--pure-white)' : 'rgba(255, 255, 255, 0.6)',
                        textShadow: isActive ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none',
                        fontWeight: isActive ? '500' : '400'
                      }}
                    >
                      {tab.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop/Tablet layout with dark theme
  return (
    <div 
      className="min-h-screen p-6" 
      style={{ 
        background: '#000000',
        color: '#ffffff'
      }}
    >
      {/* Desktop Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-heading mb-2 flex items-center gap-3" style={{ color: '#5825efff' }}>
              <Truck className="h-10 w-10" />
              Bato Logistics Portal
            </h1>
            <p className="font-body text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Comprehensive logistics management system for African fashion marketplace
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              style={{ 
                borderRadius: '3px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </Button>
            <Button 
              variant="outline" 
              style={{ 
                borderRadius: '3px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              style={{ 
                borderRadius: '3px',
                background: '#5825efff',
                color: 'white',
                border: 'none'
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Quick Action
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="flex space-x-2 mb-8 logistics-header-zero-radius">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant={isActive ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-2 font-body px-6 py-3 transition-all duration-300"
              style={{
                backgroundColor: isActive ? '#5825efff' : 'rgba(30, 30, 30, 0.8)',
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                borderRadius: '3px',
                border: isActive ? 'none' : '1px solid rgba(88, 37, 239, 0.2)',
                boxShadow: isActive ? 'var(--shadow-standard-desktop)' : 'none'
              }}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
              <div className="text-left">
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs opacity-80">{tab.description}</div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Desktop Content */}
      <div className="max-w-none">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>

      {/* Emergency Alert Modal */}
      <AnimatePresence>
        {showEmergencyAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative max-w-md w-full mx-4"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)',
                border: '2px solid rgba(255, 68, 68, 0.6)',
                borderRadius: '8px',
                boxShadow: '0 20px 60px rgba(255, 68, 68, 0.3)'
              }}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-red-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-red-500/20">
                    <AlertTriangle className="h-6 w-6 text-red-400 animate-pulse" />
                  </div>
                  <h2 className="text-xl font-heading font-bold text-white">
                    Emergency Alert Activated
                  </h2>
                </div>
                <p className="text-red-300 font-body">
                  Emergency assistance has been requested
                </p>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                {emergencyAlertData && (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60 font-body">Alert ID:</span>
                        <p className="text-white font-mono text-xs">{emergencyAlertData.id}</p>
                      </div>
                      <div>
                        <span className="text-white/60 font-body">Priority:</span>
                        <p className="text-red-400 font-semibold uppercase">{emergencyAlertData.priority}</p>
                      </div>
                      <div>
                        <span className="text-white/60 font-body">Location:</span>
                        <p className="text-white">{emergencyAlertData.location}</p>
                      </div>
                      <div>
                        <span className="text-white/60 font-body">Driver:</span>
                        <p className="text-white">{emergencyAlertData.driver}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/30">
                      <p className="text-red-200 font-body text-sm">
                        ⚠️ Emergency services have been notified. Help is on the way.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
                      <p className="text-yellow-200 font-body text-sm">
                        📞 For immediate assistance, call: <strong>+237 911</strong>
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Modal Actions */}
              <div className="p-6 border-t border-red-500/20 flex gap-3 justify-end">
                <Button
                  onClick={handleCloseEmergencyAlert}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '6px'
                  }}
                >
                  Close
                </Button>
                <Button
                  style={{
                    background: '#ff4444',
                    color: 'white',
                    borderRadius: '6px',
                    border: 'none'
                  }}
                  onClick={() => {
                    // Additional emergency actions
                    console.log('🚨 Additional emergency action triggered');
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogisticsDashboard;