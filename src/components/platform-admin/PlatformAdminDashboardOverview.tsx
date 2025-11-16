import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Shield, Users, Store, Globe, Database, Activity, AlertTriangle, 
  CheckCircle, TrendingUp, TrendingDown, RefreshCw, Bell, Settings,
  BarChart3, CreditCard, FileText, Phone, Mail, Zap, BrainCircuit,
  ArrowUp, ArrowDown, Monitor, Smartphone, MapPin, Target
} from "lucide-react";
import { User, AdminView } from "../../types";

// Platform-wide admin dashboard data
const PLATFORM_ADMIN_DATA = {
  // Platform-wide KPIs
  platformMetrics: {
    totalVendors: 1247,
    activeVendors: 1089,
    pendingApprovals: 23,
    totalUsers: 45673,
    newUsersToday: 234,
    totalRevenue: 2890450,
    platformRevenue: 289045, // 10% commission
    systemUptime: 99.97
  },

  // Security & Compliance
  security: {
    securityScore: 94,
    activeThreats: 2,
    blockedAttacks: 3456,
    complianceScore: 96,
    fraudPrevented: 145780,
    lastSecurityScan: "15 minutes ago"
  },

  // System Performance
  systemPerformance: {
    avgResponseTime: 180, // ms
    errorRate: 0.02,
    activeConnections: 12547,
    peakConcurrentUsers: 8900,
    dataProcessed: 45.6, // GB today
    apiCallsToday: 234567
  },

  // Platform Activities
  recentActivities: [
    { 
      type: "vendor", 
      message: "New vendor application from 'African Elegance Store'", 
      time: "5 minutes ago",
      priority: "normal"
    },
    { 
      type: "security", 
      message: "Blocked suspicious payment attempt ($5,450)", 
      time: "12 minutes ago",
      priority: "high"
    },
    { 
      type: "system", 
      message: "Platform backup completed successfully", 
      time: "25 minutes ago",
      priority: "normal"
    },
    { 
      type: "compliance", 
      message: "GDPR compliance check completed", 
      time: "1 hour ago",
      priority: "normal"
    },
    { 
      type: "integration", 
      message: "Payment gateway API updated to v2.1", 
      time: "2 hours ago",
      priority: "normal"
    }
  ],

  // Vendor Performance Summary
  vendorMetrics: [
    { name: "Top Performing Vendors", count: 50, growth: 15.3, revenue: 456780 },
    { name: "Growing Vendors", count: 234, growth: 8.7, revenue: 189340 },
    { name: "New Vendors", count: 156, growth: 45.2, revenue: 67890 },
    { name: "At-Risk Vendors", count: 23, growth: -5.4, revenue: 12340 }
  ],

  // Geographic Distribution
  geographicData: [
    { region: "North America", users: 18567, vendors: 467, percentage: 41 },
    { region: "Europe", users: 12890, vendors: 289, percentage: 28 },
    { region: "Africa", users: 8934, vendors: 234, percentage: 20 },
    { region: "Asia-Pacific", users: 5282, vendors: 156, percentage: 11 }
  ],

  // System Health Goals
  systemGoals: {
    uptime: { current: 99.97, target: 99.95, progress: 100 },
    responseTime: { current: 180, target: 200, progress: 110 }, // Lower is better, so > 100%
    errorRate: { current: 0.02, target: 0.05, progress: 150 }, // Lower is better
    userSatisfaction: { current: 4.2, target: 4.0, progress: 105 }
  },

  // Critical Alerts
  alerts: [
    { type: "warning", message: "Payment processing latency increased by 15%", time: "30 min ago" },
    { type: "info", message: "Monthly platform analytics report is ready", time: "2 hours ago" },
    { type: "success", message: "All security scans passed successfully", time: "4 hours ago" },
    { type: "critical", message: "2 vendors exceeded transaction limits", time: "6 hours ago" }
  ]
};

interface PlatformAdminDashboardOverviewProps {
  onNavigateBack: () => void;
  onPlatformAdminNavigate: (view: AdminView) => void;
  currentUser: User | null;
  onNavigateToPage?: (page: string) => void;
}

export function PlatformAdminDashboardOverview({ 
  onNavigateBack, 
  onPlatformAdminNavigate, 
  currentUser,
  onNavigateToPage
}: PlatformAdminDashboardOverviewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? (
      <ArrowUp className="h-4 w-4" style={{ color: 'var(--success-light-green)' }} />
    ) : (
      <ArrowDown className="h-4 w-4" style={{ color: 'var(--error-red)' }} />
    );
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'var(--success-light-green)' : 'var(--error-red)';
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'var(--error-red)';
      case 'warning': return 'var(--warning-yellow)';
      case 'success': return 'var(--success-light-green)';
      default: return 'var(--primary-blue)';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vendor': return Store;
      case 'security': return Shield;
      case 'system': return Database;
      case 'compliance': return CheckCircle;
      case 'integration': return Globe;
      default: return Activity;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleQuickAction = (action: string) => {
    console.log(`Platform admin quick action: ${action}`);
    alert(`${action} functionality would be implemented here. This would navigate to the relevant platform administration section.`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Real-time Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading" style={{ color: 'var(--primary-blue)' }}>
            Platform Administration
          </h1>
          <p className="text-muted-foreground font-body">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • {currentTime.toLocaleTimeString('en-US')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Activity className="h-3 w-3 mr-1" />
            Platform Operational
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-moema-outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Platform Admin Navigation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Platform Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => onPlatformAdminNavigate('users')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <Users 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--primary-blue)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--primary-blue)' }}
              >
                All Users
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => handleQuickAction('Vendor Management')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <Store 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--primary-blue)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--primary-blue)' }}
              >
                Vendors
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => onPlatformAdminNavigate('settings')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <Shield 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--primary-blue)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--primary-blue)' }}
              >
                Security
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => onPlatformAdminNavigate('analytics')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <BarChart3 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--primary-blue)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--primary-blue)' }}
              >
                Analytics
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => handleQuickAction('System Integration')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <Globe 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--primary-blue)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--primary-blue)' }}
              >
                Integrations
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => handleQuickAction('System Settings')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <Settings 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--primary-blue)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--primary-blue)' }}
              >
                Settings
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Platform Framework Features */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Advanced Platform Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => onNavigateToPage && onNavigateToPage('framework-demo')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <Zap 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--primary-blue)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--primary-blue)' }}
              >
                Framework Demo
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => onNavigateToPage && onNavigateToPage('order-management')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <Store 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--primary-blue)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--primary-blue)' }}
              >
                Order Mgmt
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => onNavigateToPage && onNavigateToPage('payment-gateway')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <CreditCard 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--success-light-green)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--success-light-green)' }}
              >
                Payment Gateway
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => onNavigateToPage && onNavigateToPage('inventory-management')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <Database 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--primary-blue)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--primary-blue)' }}
              >
                Inventory
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => onNavigateToPage && onNavigateToPage('logistics-dashboard')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <Globe 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--warning-yellow)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--warning-yellow)' }}
              >
                Logistics
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => onNavigateToPage && onNavigateToPage('dispute-resolution')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <Shield 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--error-red)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--error-red)' }}
              >
                Disputes
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Intelligence & Global Features */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">AI Intelligence & Global Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => onNavigateToPage && onNavigateToPage('ai-intelligence')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <BrainCircuit 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--primary-blue)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--primary-blue)' }}
              >
                AI Intelligence
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => onNavigateToPage && onNavigateToPage('social-commerce')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <Monitor 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--error-red)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--error-red)' }}
              >
                Social Commerce
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => onNavigateToPage && onNavigateToPage('international-expansion')}
              style={{ 
                backgroundColor: 'var(--pure-white)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border)'
              }}
            >
              <Globe 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: 'var(--success-light-green)' }}
              />
              <span 
                className="text-xs font-medium leading-tight text-center font-body"
                style={{ color: 'var(--success-light-green)' }}
              >
                International
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground font-body">Platform Revenue</p>
                  <p className="text-2xl font-bold font-heading" style={{ color: 'var(--success-light-green)' }}>
                    {formatCurrency(PLATFORM_ADMIN_DATA.platformMetrics.platformRevenue)}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4" style={{ color: 'var(--success-light-green)' }} />
                    <span className="text-sm font-body ml-1" style={{ color: 'var(--success-light-green)' }}>
                      12.5% this month
                    </span>
                  </div>
                </div>
                <CreditCard className="h-8 w-8" style={{ color: 'var(--success-light-green)' }} />
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground font-body">
                  Total GMV: {formatCurrency(PLATFORM_ADMIN_DATA.platformMetrics.totalRevenue)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground font-body">Active Vendors</p>
                  <p className="text-2xl font-bold font-heading" style={{ color: 'var(--primary-blue)' }}>
                    {formatNumber(PLATFORM_ADMIN_DATA.platformMetrics.activeVendors)}
                  </p>
                  <div className="flex items-center mt-2">
                    <Store className="h-4 w-4" style={{ color: 'var(--success-light-green)' }} />
                    <span className="text-sm font-body ml-1" style={{ color: 'var(--success-light-green)' }}>
                      {PLATFORM_ADMIN_DATA.platformMetrics.pendingApprovals} pending
                    </span>
                  </div>
                </div>
                <Store className="h-8 w-8" style={{ color: 'var(--primary-blue)' }} />
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground font-body">
                  Total: {formatNumber(PLATFORM_ADMIN_DATA.platformMetrics.totalVendors)} vendors
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground font-body">Total Users</p>
                  <p className="text-2xl font-bold font-heading" style={{ color: 'var(--primary-blue)' }}>
                    {formatNumber(PLATFORM_ADMIN_DATA.platformMetrics.totalUsers)}
                  </p>
                  <div className="flex items-center mt-2">
                    <Users className="h-4 w-4" style={{ color: 'var(--success-light-green)' }} />
                    <span className="text-sm font-body ml-1" style={{ color: 'var(--success-light-green)' }}>
                      +{PLATFORM_ADMIN_DATA.platformMetrics.newUsersToday} today
                    </span>
                  </div>
                </div>
                <Users className="h-8 w-8" style={{ color: 'var(--primary-blue)' }} />
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-body">
                    {formatNumber(PLATFORM_ADMIN_DATA.systemPerformance.activeConnections)} active sessions
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground font-body">System Health</p>
                  <p className="text-2xl font-bold font-heading" style={{ color: 'var(--success-light-green)' }}>
                    {PLATFORM_ADMIN_DATA.platformMetrics.systemUptime}%
                  </p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="h-4 w-4" style={{ color: 'var(--success-light-green)' }} />
                    <span className="text-sm font-body ml-1" style={{ color: 'var(--success-light-green)' }}>
                      {PLATFORM_ADMIN_DATA.systemPerformance.avgResponseTime}ms avg
                    </span>
                  </div>
                </div>
                <Activity className="h-8 w-8" style={{ color: 'var(--success-light-green)' }} />
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground font-body">
                  Error rate: {PLATFORM_ADMIN_DATA.systemPerformance.errorRate}%
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Critical Platform Alerts & Emergency Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Platform Activity & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PLATFORM_ADMIN_DATA.recentActivities.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--light-gray)' }}>
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-5 w-5" style={{ color: 'var(--primary-blue)' }} />
                      <div>
                        <p className="font-medium text-sm font-body">{activity.message}</p>
                        <p className="text-xs text-muted-foreground font-body">{activity.time}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary"
                      style={{ 
                        backgroundColor: activity.priority === 'high' ? 'var(--warning-yellow)20' : 'var(--primary-blue)20',
                        color: activity.priority === 'high' ? 'var(--warning-yellow)' : 'var(--primary-blue)'
                      }}
                    >
                      {activity.priority}
                    </Badge>
                  </div>
                );
              })}
            </div>
            <div className="flex space-x-2 mt-4">
              <Button 
                size="sm" 
                className="btn-moema-primary btn-moema-sm"
                onClick={() => handleQuickAction('View All Platform Activity')}
              >
                View All Activity
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="btn-moema-outline btn-moema-sm"
                onClick={() => handleQuickAction('Configure Alerts')}
              >
                Configure Alerts
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Emergency Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
                onClick={() => handleQuickAction('Security Lockdown')}
                style={{ 
                  backgroundColor: 'var(--pure-white)',
                  borderRadius: 'var(--radius-lg)',
                  borderColor: 'var(--error-red)',
                  borderWidth: '1px'
                }}
              >
                <Shield 
                  className="h-5 w-5 flex-shrink-0" 
                  style={{ color: 'var(--error-red)' }}
                />
                <span 
                  className="text-xs font-medium leading-tight text-center font-body"
                  style={{ color: 'var(--error-red)' }}
                >
                  Emergency Lock
                </span>
              </Button>
              <Button 
                variant="outline" 
                className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
                onClick={() => handleQuickAction('System Backup')}
                style={{ 
                  backgroundColor: 'var(--pure-white)',
                  borderRadius: 'var(--radius-lg)',
                  borderColor: 'var(--border)'
                }}
              >
                <Database 
                  className="h-5 w-5 flex-shrink-0" 
                  style={{ color: 'var(--primary-blue)' }}
                />
                <span 
                  className="text-xs font-medium leading-tight text-center font-body"
                  style={{ color: 'var(--primary-blue)' }}
                >
                  Backup Now
                </span>
              </Button>
              <Button 
                variant="outline" 
                className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
                onClick={() => handleQuickAction('Contact Support Team')}
                style={{ 
                  backgroundColor: 'var(--pure-white)',
                  borderRadius: 'var(--radius-lg)',
                  borderColor: 'var(--border)'
                }}
              >
                <Phone 
                  className="h-5 w-5 flex-shrink-0" 
                  style={{ color: 'var(--warning-yellow)' }}
                />
                <span 
                  className="text-xs font-medium leading-tight text-center font-body"
                  style={{ color: 'var(--warning-yellow)' }}
                >
                  Tech Support
                </span>
              </Button>
              <Button 
                variant="outline" 
                className="btn-moema-outline h-20 px-3 py-3 flex flex-col items-center justify-center gap-2 min-w-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
                onClick={() => handleQuickAction('Generate Platform Report')}
                style={{ 
                  backgroundColor: 'var(--pure-white)',
                  borderRadius: 'var(--radius-lg)',
                  borderColor: 'var(--border)'
                }}
              >
                <FileText 
                  className="h-5 w-5 flex-shrink-0" 
                  style={{ color: 'var(--primary-dark-blue)' }}
                />
                <span 
                  className="text-xs font-medium leading-tight text-center font-body"
                  style={{ color: 'var(--primary-dark-blue)' }}
                >
                  Reports
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Platform Security & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: 'var(--success-light-green)' }}
              >
                <Shield className="h-8 w-8 text-white" />
              </div>
              <p className="text-2xl font-bold font-heading" style={{ color: 'var(--success-light-green)' }}>
                {PLATFORM_ADMIN_DATA.security.securityScore}%
              </p>
              <p className="text-sm text-muted-foreground font-body">Security Score</p>
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: 'var(--primary-blue)' }}
              >
                <Target className="h-8 w-8 text-white" />
              </div>
              <p className="text-2xl font-bold font-heading" style={{ color: 'var(--primary-blue)' }}>
                {formatNumber(PLATFORM_ADMIN_DATA.security.blockedAttacks)}
              </p>
              <p className="text-sm text-muted-foreground font-body">Attacks Blocked</p>
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: 'var(--success-light-green)' }}
              >
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <p className="text-2xl font-bold font-heading" style={{ color: 'var(--success-light-green)' }}>
                {PLATFORM_ADMIN_DATA.security.complianceScore}%
              </p>
              <p className="text-sm text-muted-foreground font-body">Compliance</p>
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: 'var(--success-light-green)' }}
              >
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <p className="text-2xl font-bold font-heading" style={{ color: 'var(--success-light-green)' }}>
                {formatCurrency(PLATFORM_ADMIN_DATA.security.fraudPrevented)}
              </p>
              <p className="text-sm text-muted-foreground font-body">Fraud Prevented</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}