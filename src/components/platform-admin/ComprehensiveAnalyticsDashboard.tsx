import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Package, 
  Target, PieChart, BarChart3, LineChart, Globe, Smartphone, Monitor, 
  Calendar, Clock, Star, AlertTriangle, CheckCircle, ArrowUp, ArrowDown,
  Eye, MousePointer, Search, Heart, MessageSquare, Mail, Phone, 
  Truck, CreditCard, RefreshCw, Activity, Database, Zap, Shield,
  MapPin, Filter, Download, FileText, Settings, Percent, Calculator,
  Bell, Edit, Plus, Share, Megaphone, BookOpen, Award, Gift, 
  Lightbulb, ChartBar, Workflow, Headphones, Flag, BrainCircuit
} from "lucide-react";

// Platform-wide analytics data
const PLATFORM_ANALYTICS_DATA = {
  // Platform Financial Metrics
  platform: {
    totalGMV: 2850000, // Gross Merchandise Value
    platformRevenue: 427500, // Platform fees
    monthlyGMV: 285000,
    avgCommissionRate: 15,
    totalVendors: 156,
    activeVendors: 134,
    newVendors: 12,
    vendorRetentionRate: 89.5,
    totalCustomers: 45678,
    activeCustomers: 23456,
    customerAcquisitionCost: 45.80,
    customerLifetimeValue: 892.30
  },

  // Vendor Performance
  vendorMetrics: {
    topVendors: [
      { name: "AfriStyle Boutique", gmv: 125000, commission: 18750, orders: 567, rating: 4.8 },
      { name: "Kente Expressions", gmv: 98500, commission: 14775, orders: 445, rating: 4.9 },
      { name: "Ankara Dreams", gmv: 87300, commission: 13095, orders: 389, rating: 4.7 },
      { name: "Heritage Threads", gmv: 76200, commission: 11430, orders: 334, rating: 4.6 },
      { name: "Royal African", gmv: 69800, commission: 10470, orders: 298, rating: 4.8 }
    ],
    vendorCategories: [
      { category: "Dresses", vendors: 45, gmv: 1200000, avgRating: 4.7 },
      { category: "Tops", vendors: 38, gmv: 680000, avgRating: 4.6 },
      { category: "Accessories", vendors: 52, gmv: 520000, avgRating: 4.8 },
      { category: "Traditional", vendors: 21, gmv: 450000, avgRating: 4.9 }
    ]
  },

  // Geographic Distribution
  geographic: {
    regions: [
      { region: "North America", customers: 18750, gmv: 1425000, percentage: 50 },
      { region: "Europe", customers: 9123, gmv: 712500, percentage: 25 },
      { region: "Africa", customers: 7345, gmv: 427500, percentage: 15 },
      { region: "Asia Pacific", customers: 4567, gmv: 285000, percentage: 10 }
    ],
    topCities: [
      { city: "New York", customers: 3456, orders: 1234 },
      { city: "London", customers: 2890, orders: 1045 },
      { city: "Toronto", customers: 2345, orders: 876 },
      { city: "Lagos", customers: 2123, orders: 967 },
      { city: "Atlanta", customers: 1987, orders: 754 }
    ]
  },

  // Platform Health Metrics
  health: {
    systemUptime: 99.9,
    avgPageLoadTime: 1.2,
    apiResponseTime: 145,
    errorRate: 0.02,
    disputeResolutionTime: 2.8,
    customerSatisfaction: 4.6,
    vendorSatisfaction: 4.4,
    supportTickets: 234,
    resolvedTickets: 211,
    avgResolutionTime: "4.2 hours"
  },

  // Growth Metrics
  growth: {
    quarterlyGrowth: [
      { quarter: "Q1 2023", gmv: 2100000, vendors: 120, customers: 34567 },
      { quarter: "Q2 2023", gmv: 2350000, vendors: 135, customers: 38901 },
      { quarter: "Q3 2023", gmv: 2650000, vendors: 145, customers: 42456 },
      { quarter: "Q4 2023", gmv: 2850000, vendors: 156, customers: 45678 }
    ],
    monthlyMetrics: [
      { month: "Jan", gmv: 245000, newVendors: 8, newCustomers: 1456 },
      { month: "Feb", gmv: 267000, newVendors: 6, newCustomers: 1678 },
      { month: "Mar", gmv: 285000, newVendors: 12, newCustomers: 1987 }
    ]
  }
};

interface ComprehensiveAnalyticsDashboardProps {
  timeRange?: string;
}

export function ComprehensiveAnalyticsDashboard({ timeRange = "30d" }: ComprehensiveAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedRegion, setSelectedRegion] = useState("all");

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading" style={{ color: 'var(--primary-blue)' }}>
            Platform Analytics Dashboard
          </h1>
          <p className="text-gray-600 font-body">
            Comprehensive platform-wide metrics and insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="btn-moema-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="health">Platform Health</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Platform Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total GMV</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${(PLATFORM_ANALYTICS_DATA.platform.totalGMV / 1000000).toFixed(2)}M
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+18.5%</span>
                    <span className="text-gray-600 ml-1">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${(PLATFORM_ANALYTICS_DATA.platform.platformRevenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-600">Avg Commission: {PLATFORM_ANALYTICS_DATA.platform.avgCommissionRate}%</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                      <p className="text-2xl font-bold text-purple-600">{PLATFORM_ANALYTICS_DATA.platform.activeVendors}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+{PLATFORM_ANALYTICS_DATA.platform.newVendors} new</span>
                    <span className="text-gray-600 ml-1">this month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Customers</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {(PLATFORM_ANALYTICS_DATA.platform.activeCustomers / 1000).toFixed(1)}K
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-600">CLV: ${PLATFORM_ANALYTICS_DATA.platform.customerLifetimeValue}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Platform Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Growth chart visualization would appear here</p>
                  <p className="text-sm text-gray-500 mt-2">Showing quarterly GMV, vendor, and customer growth</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Vendor Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {PLATFORM_ANALYTICS_DATA.platform.vendorRetentionRate}%
                  </div>
                  <Progress value={PLATFORM_ANALYTICS_DATA.platform.vendorRetentionRate} className="h-3" />
                  <p className="text-sm text-gray-600 mt-2">12-month retention rate</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Customer Acquisition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    ${PLATFORM_ANALYTICS_DATA.platform.customerAcquisitionCost}
                  </div>
                  <p className="text-sm text-gray-600">Average acquisition cost</p>
                  <div className="flex items-center justify-center mt-2 text-sm">
                    <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">-8.2% vs last quarter</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">Monthly Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">+18.5%</div>
                  <p className="text-sm text-gray-600">GMV month-over-month</p>
                  <div className="flex items-center justify-center mt-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">Accelerating growth</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-6">
          {/* Top Vendors */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Top Performing Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PLATFORM_ANALYTICS_DATA.vendorMetrics.topVendors.map((vendor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{vendor.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{vendor.orders} orders</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{vendor.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${(vendor.gmv / 1000).toFixed(0)}K GMV</div>
                      <div className="text-sm text-gray-600">${(vendor.commission / 1000).toFixed(1)}K commission</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Vendor Performance by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PLATFORM_ANALYTICS_DATA.vendorMetrics.vendorCategories.map((category, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{category.category}</h4>
                      <Badge variant="secondary">{category.vendors} vendors</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>GMV:</span>
                        <span className="font-medium">${(category.gmv / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg Rating:</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{category.avgRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Customer Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Customer analytics dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PLATFORM_ANALYTICS_DATA.geographic.regions.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Globe className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-medium">{region.region}</h4>
                        <p className="text-sm text-gray-600">{region.customers.toLocaleString()} customers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${(region.gmv / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-gray-600">{region.percentage}% of total</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Health Tab */}
        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Uptime</p>
                    <p className="text-2xl font-bold text-green-600">{PLATFORM_ANALYTICS_DATA.health.systemUptime}%</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Page Load Time</p>
                    <p className="text-2xl font-bold text-blue-600">{PLATFORM_ANALYTICS_DATA.health.avgPageLoadTime}s</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
                    <p className="text-2xl font-bold text-yellow-600">{PLATFORM_ANALYTICS_DATA.health.customerSatisfaction}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}