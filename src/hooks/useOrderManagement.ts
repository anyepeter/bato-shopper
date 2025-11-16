import { useState, useCallback, useEffect } from 'react';
import { Order, OrderStatus, PaymentStatus, VendorOrder, Commission, TrackingInfo } from '../types';

interface OrderManagementState {
  orders: Order[];
  vendorOrders: VendorOrder[];
  commissions: Commission[];
  isLoading: boolean;
  error: string | null;
  selectedOrder: Order | null;
}

const initialState: OrderManagementState = {
  orders: [],
  vendorOrders: [],
  commissions: [],
  isLoading: false,
  error: null,
  selectedOrder: null,
};

export function useOrderManagement() {
  const [state, setState] = useState<OrderManagementState>(initialState);

  // 📦 ORDER CREATION AND PROCESSING
  const createOrder = useCallback(async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call for order creation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newOrder: Order = {
        ...orderData,
        id: `order_${Date.now()}`,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Split order by vendors
      const vendorOrders = splitOrderByVendors(newOrder);
      
      // Calculate commissions
      const commissions = calculateCommissions(newOrder, vendorOrders);

      setState(prev => ({
        ...prev,
        orders: [...prev.orders, newOrder],
        vendorOrders: [...prev.vendorOrders, ...vendorOrders],
        commissions: [...prev.commissions, ...commissions],
        isLoading: false,
      }));

      // Send notifications to vendors
      await notifyVendorsOfNewOrder(vendorOrders);

      return newOrder;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create order. Please try again.',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // 🔄 ORDER STATUS UPDATES
  const updateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus, vendorId?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setState(prev => ({
        ...prev,
        orders: prev.orders.map(order => {
          if (order.id === orderId) {
            const updatedOrder = { ...order, status: newStatus, updatedAt: new Date() };
            
            // Update payment status based on order status
            if (newStatus === 'confirmed') {
              updatedOrder.paymentStatus = 'completed';
            } else if (newStatus === 'cancelled') {
              updatedOrder.paymentStatus = 'refunded';
            }

            return updatedOrder;
          }
          return order;
        }),
        vendorOrders: prev.vendorOrders.map(vendorOrder => {
          const order = prev.orders.find(o => o.id === orderId);
          if (order && (!vendorId || vendorOrder.vendorId === vendorId)) {
            return { ...vendorOrder, status: newStatus };
          }
          return vendorOrder;
        }),
        isLoading: false,
      }));

      // Send status update notifications
      await sendOrderStatusNotification(orderId, newStatus);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to update order status',
        isLoading: false,
      }));
    }
  }, []);

  // 📋 ORDER RETRIEVAL FUNCTIONS
  const getOrdersByCustomer = useCallback((customerId: string) => {
    return state.orders.filter(order => order.customerId === customerId);
  }, [state.orders]);

  const getOrdersByVendor = useCallback((vendorId: string) => {
    return state.vendorOrders.filter(vendorOrder => vendorOrder.vendorId === vendorId);
  }, [state.vendorOrders]);

  const getOrderById = useCallback((orderId: string) => {
    return state.orders.find(order => order.id === orderId);
  }, [state.orders]);

  // 🚚 SHIPPING AND TRACKING
  const addTrackingInfo = useCallback(async (orderId: string, trackingInfo: TrackingInfo) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setState(prev => ({
        ...prev,
        orders: prev.orders.map(order => {
          if (order.id === orderId) {
            return {
              ...order,
              trackingNumbers: [...order.trackingNumbers, trackingInfo],
              updatedAt: new Date(),
            };
          }
          return order;
        }),
        isLoading: false,
      }));

      // Notify customer of tracking information
      await sendTrackingNotification(orderId, trackingInfo);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to add tracking information',
        isLoading: false,
      }));
    }
  }, []);

  const updateTrackingStatus = useCallback(async (orderId: string, trackingNumber: string, newStatus: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setState(prev => ({
        ...prev,
        orders: prev.orders.map(order => {
          if (order.id === orderId) {
            return {
              ...order,
              trackingNumbers: order.trackingNumbers.map(tracking => 
                tracking.trackingNumber === trackingNumber
                  ? { ...tracking, status: newStatus as any }
                  : tracking
              ),
              updatedAt: new Date(),
            };
          }
          return order;
        }),
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to update tracking status',
        isLoading: false,
      }));
    }
  }, []);

  // 💰 FINANCIAL OPERATIONS
  const processRefund = useCallback(async (orderId: string, amount: number, reason: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      setState(prev => ({
        ...prev,
        orders: prev.orders.map(order => {
          if (order.id === orderId) {
            return {
              ...order,
              status: 'refunded',
              paymentStatus: amount === order.totalAmount ? 'refunded' : 'partially_refunded',
              updatedAt: new Date(),
            };
          }
          return order;
        }),
        commissions: prev.commissions.map(commission => {
          if (commission.orderId === orderId) {
            return { ...commission, status: 'disputed' };
          }
          return commission;
        }),
        isLoading: false,
      }));

      // Process actual refund through payment gateway
      await processPaymentRefund(orderId, amount, reason);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to process refund',
        isLoading: false,
      }));
    }
  }, []);

  // 📊 ORDER ANALYTICS
  const getOrderAnalytics = useCallback((timeRange: { from: Date; to: Date }) => {
    const filteredOrders = state.orders.filter(
      order => order.createdAt >= timeRange.from && order.createdAt <= timeRange.to
    );

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusBreakdown = filteredOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<OrderStatus, number>);

    const vendorBreakdown = state.vendorOrders
      .filter(vo => {
        const order = state.orders.find(o => o.id === vo.vendorId);
        return order && order.createdAt >= timeRange.from && order.createdAt <= timeRange.to;
      })
      .reduce((acc, vendorOrder) => {
        acc[vendorOrder.vendorId] = (acc[vendorOrder.vendorId] || 0) + vendorOrder.subtotal;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      statusBreakdown,
      vendorBreakdown,
      conversionMetrics: calculateConversionMetrics(filteredOrders),
    };
  }, [state.orders, state.vendorOrders]);

  // Load initial order data
  useEffect(() => {
    const loadOrders = async () => {
      setState(prev => ({ ...prev, isLoading: true }));

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockOrders = generateMockOrders();
        const mockVendorOrders = generateMockVendorOrders();
        const mockCommissions = generateMockCommissions();

        setState(prev => ({
          ...prev,
          orders: mockOrders,
          vendorOrders: mockVendorOrders,
          commissions: mockCommissions,
          isLoading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to load orders',
          isLoading: false,
        }));
      }
    };

    loadOrders();
  }, []);

  return {
    // State
    ...state,
    
    // Order Creation & Management
    createOrder,
    updateOrderStatus,
    
    // Order Retrieval
    getOrdersByCustomer,
    getOrdersByVendor,
    getOrderById,
    
    // Shipping & Tracking
    addTrackingInfo,
    updateTrackingStatus,
    
    // Financial Operations
    processRefund,
    
    // Analytics
    getOrderAnalytics,
  };
}

// 🔧 HELPER FUNCTIONS

function splitOrderByVendors(order: Order): VendorOrder[] {
  const vendorGroups = order.items.reduce((acc, item) => {
    if (!acc[item.vendorId]) {
      acc[item.vendorId] = [];
    }
    acc[item.vendorId].push(item);
    return acc;
  }, {} as Record<string, typeof order.items>);

  return Object.entries(vendorGroups).map(([vendorId, items]) => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const platformCommission = subtotal * 0.05; // 5% platform commission
    const vendorCommission = subtotal - platformCommission;

    return {
      vendorId,
      vendorName: `Vendor ${vendorId}`, // This would be fetched from vendor data
      items,
      subtotal,
      vendorCommission,
      platformCommission,
      status: order.status,
      shippingMethod: 'standard',
    };
  });
}

function calculateCommissions(order: Order, vendorOrders: VendorOrder[]): Commission[] {
  return vendorOrders.map(vendorOrder => ({
    orderId: order.id,
    vendorId: vendorOrder.vendorId,
    saleAmount: vendorOrder.subtotal,
    commissionRate: 0.05,
    commissionAmount: vendorOrder.platformCommission,
    platformFee: vendorOrder.platformCommission,
    vendorPayout: vendorOrder.vendorCommission,
    processingFee: vendorOrder.subtotal * 0.029, // 2.9% processing fee
    status: 'pending',
  }));
}

async function notifyVendorsOfNewOrder(vendorOrders: VendorOrder[]) {
  // Simulate sending notifications to vendors
  console.log('Notifying vendors of new order:', vendorOrders.map(vo => vo.vendorId));
}

async function sendOrderStatusNotification(orderId: string, status: OrderStatus) {
  // Simulate sending status update notification
  console.log(`Order ${orderId} status updated to: ${status}`);
}

async function sendTrackingNotification(orderId: string, trackingInfo: TrackingInfo) {
  // Simulate sending tracking notification
  console.log(`Tracking added for order ${orderId}:`, trackingInfo.trackingNumber);
}

async function processPaymentRefund(orderId: string, amount: number, reason: string) {
  // Simulate processing refund through payment gateway
  console.log(`Processing refund for order ${orderId}: $${amount} - ${reason}`);
}

function calculateConversionMetrics(orders: Order[]) {
  const completedOrders = orders.filter(order => order.status === 'delivered');
  const conversionRate = orders.length > 0 ? completedOrders.length / orders.length : 0;
  
  return {
    conversionRate,
    completionRate: conversionRate,
    averageTimeToDelivery: 5.2, // days - would be calculated from actual data
    returnRate: 0.08, // 8% - would be calculated from actual data
  };
}

function generateMockOrders(): Order[] {
  return [
    {
      id: 'order_001',
      customerId: 'customer_1',
      customerDetails: {
        id: 'customer_1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@example.com',
        phone: '+1-555-0123',
      },
      items: [
        {
          productId: 'prod_1',
          vendorId: 'vendor_1',
          productName: 'Traditional Ankara Dress',
          productImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
          sku: 'ANK-001',
          quantity: 1,
          unitPrice: 89.99,
          totalPrice: 89.99,
          size: 'M',
          color: 'Red',
        },
      ],
      vendorOrders: [],
      totalAmount: 89.99,
      tax: 7.20,
      shippingCost: 9.99,
      status: 'confirmed',
      paymentStatus: 'completed',
      shippingAddress: {
        id: 1,
        type: 'shipping',
        firstName: 'Sarah',
        lastName: 'Johnson',
        street: '123 Main Street',
        apartment: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isDefault: true,
      },
      billingAddress: {
        id: 2,
        type: 'billing',
        firstName: 'Sarah',
        lastName: 'Johnson',
        street: '123 Main Street',
        apartment: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isDefault: true,
      },
      paymentMethod: {
        method: 'credit_card',
        last4: '4242',
        brand: 'Visa',
        transactionId: 'txn_1234567890',
      },
      trackingNumbers: [
        {
          carrier: 'UPS',
          trackingNumber: '1Z999AA1234567890',
          vendorId: 'vendor_1',
          status: 'in_transit',
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          trackingUrl: 'https://www.ups.com/track?tracknum=1Z999AA1234567890',
        },
      ],
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ];
}

function generateMockVendorOrders(): VendorOrder[] {
  return [
    {
      vendorId: 'vendor_1',
      vendorName: 'African Heritage Boutique',
      items: [
        {
          productId: 'prod_1',
          vendorId: 'vendor_1',
          productName: 'Traditional Ankara Dress',
          productImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
          sku: 'ANK-001',
          quantity: 1,
          unitPrice: 89.99,
          totalPrice: 89.99,
          size: 'M',
          color: 'Red',
        },
      ],
      subtotal: 89.99,
      vendorCommission: 85.49,
      platformCommission: 4.50,
      status: 'processing',
      shippingMethod: 'standard',
      trackingNumber: '1Z999AA1234567890',
    },
  ];
}

function generateMockCommissions(): Commission[] {
  return [
    {
      orderId: 'order_001',
      vendorId: 'vendor_1',
      saleAmount: 89.99,
      commissionRate: 0.05,
      commissionAmount: 4.50,
      platformFee: 4.50,
      vendorPayout: 85.49,
      processingFee: 2.61,
      status: 'pending',
    },
  ];
}