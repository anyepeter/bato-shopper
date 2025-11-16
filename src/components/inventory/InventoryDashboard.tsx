import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { useInventoryManagement } from '../../hooks/useInventoryManagement';
import { InventoryItem, StockAlert } from '../../types';
import { BootstrapIcon } from '../BootstrapIcon';

interface InventoryDashboardProps {
  vendorId?: string;
  isVendorView?: boolean;
}

export function InventoryDashboard({ vendorId, isVendorView = false }: InventoryDashboardProps) {
  const {
    inventory,
    stockAlerts,
    isLoading,
    error,
    demandForecast,
    updateInventory,
    searchInventory,
    generateDemandForecast,
    triggerAutomaticReorder,
    getInventoryAnalytics,
  } = useInventoryManagement();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Get analytics for current scope
  const analytics = React.useMemo(() => {
    return getInventoryAnalytics(isVendorView ? vendorId : undefined);
  }, [getInventoryAnalytics, vendorId, isVendorView, inventory]);

  // Filter inventory based on search and vendor
  const filteredInventory = React.useMemo(() => {
    return searchInventory(searchQuery, isVendorView ? vendorId : undefined);
  }, [searchInventory, searchQuery, vendorId, isVendorView]);

  // Filter alerts based on priority and vendor
  const filteredAlerts = React.useMemo(() => {
    let alerts = isVendorView && vendorId
      ? stockAlerts.filter(alert => alert.vendorId === vendorId)
      : stockAlerts;

    if (filterPriority !== 'all') {
      alerts = alerts.filter(alert => alert.priority === filterPriority);
    }

    return alerts.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [stockAlerts, vendorId, isVendorView, filterPriority]);

  const handleInventoryUpdate = async (
    productId: string,
    vendorId: string,
    quantityChange: number,
    reason: string
  ) => {
    try {
      await updateInventory({
        productId,
        vendorId,
        quantityChange,
        reason: reason as any,
        notes: `Manual adjustment: ${reason}`,
      });
    } catch (error) {
      console.error('Failed to update inventory:', error);
    }
  };

  const handleGenerateForecast = async () => {
    try {
      await generateDemandForecast(isVendorView ? vendorId : undefined);
    } catch (error) {
      console.error('Failed to generate forecast:', error);
    }
  };

  const getStockStatusColor = (item: InventoryItem) => {
    if (item.availableQuantity === 0) return 'text-red-600';
    if (item.availableQuantity <= item.reorderPoint) return 'text-yellow-600';
    if (item.quantity > item.maxStockLevel) return 'text-blue-600';
    return 'text-green-600';
  };

  const getStockStatusBadge = (item: InventoryItem) => {
    if (item.availableQuantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (item.availableQuantity <= item.reorderPoint) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
    }
    if (item.quantity > item.maxStockLevel) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Overstock</Badge>;
    }
    return <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>;
  };

  const getAlertIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <BootstrapIcon name="exclamation-triangle-fill" className="text-red-600" />;
      case 'high': return <BootstrapIcon name="exclamation-triangle" className="text-yellow-600" />;
      case 'medium': return <BootstrapIcon name="info-circle" className="text-blue-600" />;
      case 'low': return <BootstrapIcon name="info-circle" className="text-gray-600" />;
      default: return <BootstrapIcon name="info-circle" className="text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isVendorView ? 'My Inventory' : 'Inventory Management'}
          </h1>
          <p className="text-gray-600">
            {isVendorView 
              ? 'Monitor and manage your product stock levels'
              : 'Monitor stock levels across all vendors'
            }
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleGenerateForecast}
            disabled={isLoading}
            className="btn-moema-secondary"
          >
            <BootstrapIcon name="graph-up" className="mr-2" />
            Generate Forecast
          </Button>
          {!isVendorView && (
            <Button className="btn-moema-primary">
              <BootstrapIcon name="download" className="mr-2" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{analytics.totalProducts}</p>
              </div>
              <BootstrapIcon name="box" className="text-blue-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">${analytics.totalValue.toLocaleString()}</p>
              </div>
              <BootstrapIcon name="currency-dollar" className="text-green-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-600">{analytics.lowStockCount}</p>
              </div>
              <BootstrapIcon name="exclamation-triangle" className="text-yellow-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Turnover Rate</p>
                <p className="text-2xl font-bold">{analytics.turnoverRate.toFixed(1)}x</p>
              </div>
              <BootstrapIcon name="arrow-repeat" className="text-purple-600 text-2xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Summary */}
      {filteredAlerts.length > 0 && (
        <Alert>
          <BootstrapIcon name="exclamation-triangle" className="h-4 w-4" />
          <AlertDescription>
            You have {filteredAlerts.length} inventory alert(s) requiring attention.
            {analytics.alertCounts.critical > 0 && ` ${analytics.alertCounts.critical} critical alerts.`}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Inventory</TabsTrigger>
          <TabsTrigger value="alerts">Alerts ({filteredAlerts.length})</TabsTrigger>
          <TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by SKU or Product ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <BootstrapIcon name="funnel" className="mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Inventory List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredInventory.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BootstrapIcon name="archive" className="text-gray-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No inventory items found</h3>
                  <p className="text-gray-500">
                    {searchQuery 
                      ? 'Try adjusting your search criteria.'
                      : 'Inventory items will appear here once added.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredInventory.map((item) => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  onUpdate={handleInventoryUpdate}
                  onViewDetails={() => setSelectedItem(item)}
                  getStockStatusColor={getStockStatusColor}
                  getStockStatusBadge={getStockStatusBadge}
                  isVendorView={isVendorView}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {/* Alert Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Filter by priority:</span>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BootstrapIcon name="check-circle" className="text-green-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No active alerts</h3>
                  <p className="text-gray-500">All inventory levels are within normal ranges.</p>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onResolve={() => triggerAutomaticReorder(alert.productId, alert.vendorId)}
                  getAlertIcon={getAlertIcon}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <ForecastView 
            forecasts={demandForecast}
            onGenerateForecast={handleGenerateForecast}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsView analytics={analytics} />
        </TabsContent>
      </Tabs>

      {/* Item Details Modal */}
      {selectedItem && (
        <ItemDetailsModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={handleInventoryUpdate}
        />
      )}
    </div>
  );
}

// Inventory Item Card Component
interface InventoryItemCardProps {
  item: InventoryItem;
  onUpdate: (productId: string, vendorId: string, quantityChange: number, reason: string) => void;
  onViewDetails: () => void;
  getStockStatusColor: (item: InventoryItem) => string;
  getStockStatusBadge: (item: InventoryItem) => React.ReactNode;
  isVendorView: boolean;
}

function InventoryItemCard({ 
  item, 
  onUpdate, 
  onViewDetails, 
  getStockStatusColor, 
  getStockStatusBadge,
  isVendorView 
}: InventoryItemCardProps) {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('');

  const handleQuickAdjustment = (change: number) => {
    onUpdate(item.productId, item.vendorId, change, 'adjustment');
  };

  const handleCustomAdjustment = () => {
    const quantity = parseInt(adjustmentQuantity);
    if (!isNaN(quantity) && quantity !== 0) {
      onUpdate(item.productId, item.vendorId, quantity, 'adjustment');
      setAdjustmentQuantity('');
      setIsAdjusting(false);
    }
  };

  const stockLevel = item.availableQuantity / item.maxStockLevel * 100;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="font-semibold">{item.sku}</h3>
              <p className="text-sm text-gray-600">Product ID: {item.productId}</p>
              {!isVendorView && (
                <p className="text-xs text-gray-500">Vendor: {item.vendorId}</p>
              )}
            </div>
            {getStockStatusBadge(item)}
          </div>
          
          <div className="text-right">
            <p className={`text-2xl font-bold ${getStockStatusColor(item)}`}>
              {item.availableQuantity}
            </p>
            <p className="text-sm text-gray-600">Available</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Stock Level Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Stock Level</span>
              <span>{item.quantity}/{item.maxStockLevel}</span>
            </div>
            <Progress 
              value={stockLevel} 
              className={`h-2 ${
                stockLevel < 20 ? 'bg-red-100' : 
                stockLevel < 50 ? 'bg-yellow-100' : 'bg-green-100'
              }`}
            />
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Reserved:</span>
              <span className="font-medium ml-1">{item.reservedQuantity}</span>
            </div>
            <div>
              <span className="text-gray-600">Reorder at:</span>
              <span className="font-medium ml-1">{item.reorderPoint}</span>
            </div>
            <div>
              <span className="text-gray-600">Value:</span>
              <span className="font-medium ml-1">${(item.quantity * item.costPrice).toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            {!isAdjusting ? (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleQuickAdjustment(1)}
                >
                  <BootstrapIcon name="plus" className="mr-1" />
                  +1
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleQuickAdjustment(10)}
                >
                  <BootstrapIcon name="plus-lg" className="mr-1" />
                  +10
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleQuickAdjustment(-1)}
                  disabled={item.availableQuantity === 0}
                >
                  <BootstrapIcon name="dash" className="mr-1" />
                  -1
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setIsAdjusting(true)}
                >
                  <BootstrapIcon name="pencil" className="mr-1" />
                  Adjust
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={onViewDetails}
                >
                  <BootstrapIcon name="eye" className="mr-1" />
                  Details
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2 w-full">
                <Input
                  type="number"
                  placeholder="±Quantity"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(e.target.value)}
                  className="w-24"
                  size="sm"
                />
                <Button size="sm" onClick={handleCustomAdjustment}>
                  Apply
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => {
                    setIsAdjusting(false);
                    setAdjustmentQuantity('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Alert Card Component
function AlertCard({ alert, onResolve, getAlertIcon }: any) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getAlertIcon(alert.priority)}
            <div>
              <h4 className="font-medium capitalize">
                {alert.type.replace('_', ' ')} - {alert.productId}
              </h4>
              <p className="text-sm text-gray-600">
                Current: {alert.currentLevel} | Threshold: {alert.threshold}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={alert.priority === 'critical' ? 'destructive' : 'secondary'}>
              {alert.priority}
            </Badge>
            <Button size="sm" onClick={() => onResolve()}>
              Auto Reorder
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Forecast View Component
function ForecastView({ forecasts, onGenerateForecast, isLoading }: any) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Demand Forecast</CardTitle>
          <CardDescription>
            AI-powered demand forecasting based on historical data and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forecasts.length === 0 ? (
            <div className="text-center py-8">
              <BootstrapIcon name="graph-up" className="text-gray-400 text-4xl mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No forecast data available</h3>
              <p className="text-gray-500 mb-4">Generate a demand forecast to see predictions.</p>
              <Button onClick={onGenerateForecast} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Forecast'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {forecasts.map((forecast: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{forecast.productId}</h4>
                      <p className="text-sm text-gray-600">
                        Confidence: {(forecast.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Recommended Order</p>
                      <p className="text-xl font-bold text-blue-600">
                        {forecast.recommendedOrder}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-gray-600">Current:</span>
                      <span className="font-medium ml-1">{forecast.currentStock}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Projected:</span>
                      <span className="font-medium ml-1">{forecast.projectedDemand}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Seasonal:</span>
                      <span className="font-medium ml-1">{(forecast.seasonalFactor * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Analytics View Component
function AnalyticsView({ analytics }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>In Stock</span>
              <span className="font-medium">
                {analytics.totalProducts - analytics.lowStockCount - analytics.outOfStockCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Low Stock</span>
              <span className="font-medium text-yellow-600">{analytics.lowStockCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Out of Stock</span>
              <span className="font-medium text-red-600">{analytics.outOfStockCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Overstock</span>
              <span className="font-medium text-blue-600">{analytics.overstockCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Inventory Turnover</span>
              <span className="font-medium">{analytics.turnoverRate.toFixed(1)}x</span>
            </div>
            <div className="flex justify-between">
              <span>Total Value</span>
              <span className="font-medium">${analytics.totalValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Alerts</span>
              <span className="font-medium">
                {Object.values(analytics.alertCounts).reduce((a: number, b: number) => a + b, 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Item Details Modal (placeholder)
function ItemDetailsModal({ item, onClose, onUpdate }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Inventory Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <BootstrapIcon name="x" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Product Information</h3>
            <p>SKU: {item.sku}</p>
            <p>Product ID: {item.productId}</p>
            <p>Location: {item.location}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Stock Levels</h3>
            <p>Total Quantity: {item.quantity}</p>
            <p>Available: {item.availableQuantity}</p>
            <p>Reserved: {item.reservedQuantity}</p>
            <p>Reorder Point: {item.reorderPoint}</p>
            <p>Max Stock: {item.maxStockLevel}</p>
          </div>
          
          {item.supplier && (
            <div>
              <h3 className="font-medium">Supplier Information</h3>
              <p>Name: {item.supplier.name}</p>
              <p>Lead Time: {item.supplier.leadTime} days</p>
              <p>Minimum Order: {item.supplier.minimumOrderQuantity}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}