import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { useOrderManagement } from '../../hooks/useOrderManagement';
import { Order, OrderStatus, VendorOrder } from '../../types';
import { BootstrapIcon } from '../BootstrapIcon';

interface OrderManagementDashboardProps {
  vendorId?: string; // If provided, shows vendor-specific orders
  isVendorView?: boolean;
}

export function OrderManagementDashboard({ vendorId, isVendorView = false }: OrderManagementDashboardProps) {
  const {
    orders,
    vendorOrders,
    isLoading,
    error,
    updateOrderStatus,
    addTrackingInfo,
    processRefund,
    getOrderAnalytics,
    getOrdersByVendor,
  } = useOrderManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Filter orders based on vendor and search criteria
  const filteredOrders = React.useMemo(() => {
    let orderList = isVendorView && vendorId 
      ? orders.filter(order => order.vendorOrders.some(vo => vo.vendorId === vendorId))
      : orders;

    if (searchTerm) {
      orderList = orderList.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerDetails.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerDetails.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerDetails.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      orderList = orderList.filter(order => order.status === statusFilter);
    }

    return orderList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, vendorId, isVendorView, searchTerm, statusFilter]);

  // Get analytics for the current time range
  const analytics = React.useMemo(() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    return getOrderAnalytics({ from: thirtyDaysAgo, to: now });
  }, [getOrderAnalytics, orders]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, vendorId);
      // Close order details if it was the selected order
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(orders.find(o => o.id === orderId) || null);
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleAddTracking = async (orderId: string, trackingNumber: string, carrier: string) => {
    try {
      await addTrackingInfo(orderId, {
        carrier,
        trackingNumber,
        vendorId: vendorId || 'platform',
        status: 'label_created',
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        trackingUrl: `https://${carrier.toLowerCase()}.com/track?tracknum=${trackingNumber}`,
      });
    } catch (error) {
      console.error('Failed to add tracking info:', error);
    }
  };

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'processing': return 'default';
      case 'shipped': return 'default';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      case 'returned': return 'secondary';
      case 'refunded': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'confirmed': return 'text-blue-600';
      case 'processing': return 'text-purple-600';
      case 'shipped': return 'text-orange-600';
      case 'delivered': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      case 'returned': return 'text-gray-600';
      case 'refunded': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading orders...</p>
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
            {isVendorView ? 'My Orders' : 'Order Management'}
          </h1>
          <p className="text-gray-600">
            {isVendorView 
              ? 'Manage orders for your products'
              : 'Monitor and manage all platform orders'
            }
          </p>
        </div>
        
        {!isVendorView && (
          <Button className="btn-moema-primary">
            <BootstrapIcon name="download" className="mr-2" />
            Export Orders
          </Button>
        )}
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</p>
              </div>
              <BootstrapIcon name="currency-dollar" className="text-green-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{analytics.totalOrders}</p>
              </div>
              <BootstrapIcon name="box" className="text-blue-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Order Value</p>
                <p className="text-2xl font-bold">${analytics.averageOrderValue.toFixed(2)}</p>
              </div>
              <BootstrapIcon name="graph-up" className="text-purple-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{(analytics.conversionMetrics.completionRate * 100).toFixed(1)}%</p>
              </div>
              <BootstrapIcon name="check-circle" className="text-green-600 text-2xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          {!isVendorView && <TabsTrigger value="disputes">Disputes</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search orders by ID, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BootstrapIcon name="inbox" className="text-gray-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Orders will appear here once customers start purchasing.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                  onAddTracking={handleAddTracking}
                  onViewDetails={() => setSelectedOrder(order)}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                  getStatusColor={getStatusColor}
                  isVendorView={isVendorView}
                  vendorId={vendorId}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsView analytics={analytics} />
        </TabsContent>

        {!isVendorView && (
          <TabsContent value="disputes" className="space-y-4">
            <DisputesView />
          </TabsContent>
        )}
      </Tabs>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
          onAddTracking={handleAddTracking}
          isVendorView={isVendorView}
        />
      )}
    </div>
  );
}

// Order Card Component
interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  onAddTracking: (orderId: string, trackingNumber: string, carrier: string) => void;
  onViewDetails: () => void;
  getStatusBadgeVariant: (status: OrderStatus) => any;
  getStatusColor: (status: OrderStatus) => string;
  isVendorView: boolean;
  vendorId?: string;
}

function OrderCard({ 
  order, 
  onStatusUpdate, 
  onViewDetails, 
  getStatusBadgeVariant, 
  getStatusColor,
  isVendorView,
  vendorId 
}: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter items for vendor view
  const relevantItems = isVendorView && vendorId
    ? order.items.filter(item => item.vendorId === vendorId)
    : order.items;

  const canUpdateStatus = (currentStatus: OrderStatus): OrderStatus[] => {
    const statusFlow = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: ['returned'],
      cancelled: [],
      returned: ['refunded'],
      refunded: [],
    };
    return statusFlow[currentStatus] || [];
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="font-semibold">{order.id}</h3>
              <p className="text-sm text-gray-600">
                {order.customerDetails.firstName} {order.customerDetails.lastName}
              </p>
            </div>
            <Badge variant={getStatusBadgeVariant(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              <BootstrapIcon name="eye" className="mr-2" />
              View Details
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {relevantItems.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-10 h-10 object-cover rounded"
              />
              <div>
                <p className="text-sm font-medium">{item.productName}</p>
                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
          {relevantItems.length > 3 && (
            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2 w-16 h-16">
              <span className="text-sm text-gray-600">+{relevantItems.length - 3}</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {canUpdateStatus(order.status).map((nextStatus) => (
            <Button
              key={nextStatus}
              size="sm"
              variant="outline"
              onClick={() => onStatusUpdate(order.id, nextStatus)}
              className="text-xs"
            >
              Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Analytics View Component
function AnalyticsView({ analytics }: { analytics: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize">{status}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(count as number / analytics.totalOrders) * 100} className="w-20" />
                    <span className="text-sm font-medium">{count as number}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Conversion Rate</span>
              <span className="font-medium">{(analytics.conversionMetrics.conversionRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Average Delivery Time</span>
              <span className="font-medium">{analytics.conversionMetrics.averageTimeToDelivery} days</span>
            </div>
            <div className="flex justify-between">
              <span>Return Rate</span>
              <span className="font-medium">{(analytics.conversionMetrics.returnRate * 100).toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Disputes View Component
function DisputesView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispute Management</CardTitle>
        <CardDescription>
          Manage order disputes and resolution processes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <BootstrapIcon name="shield-exclamation" className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Active Disputes</h3>
          <p className="text-gray-500">Disputes will appear here when customers raise concerns.</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Order Details Modal Component (placeholder)
function OrderDetailsModal({ 
  order, 
  onClose, 
  onStatusUpdate, 
  onAddTracking, 
  isVendorView 
}: {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  onAddTracking: (orderId: string, trackingNumber: string, carrier: string) => void;
  isVendorView: boolean;
}) {
  // This would be a detailed modal with full order information
  // For now, we'll keep it simple
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <BootstrapIcon name="x" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Order Information</h3>
            <p>Order ID: {order.id}</p>
            <p>Customer: {order.customerDetails.firstName} {order.customerDetails.lastName}</p>
            <p>Email: {order.customerDetails.email}</p>
            <p>Status: {order.status}</p>
            <p>Total: ${order.totalAmount.toFixed(2)}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                  <img src={item.productImage} alt={item.productName} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity} × ${item.unitPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}