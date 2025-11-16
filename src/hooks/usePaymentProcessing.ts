import { useState, useCallback, useEffect } from 'react';
import { Order, Commission, VendorPayout, PaymentInfo } from '../types';

interface PaymentProcessingState {
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  payouts: VendorPayout[];
  isProcessing: boolean;
  error: string | null;
  gatewayStatus: GatewayStatus;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer' | 'crypto';
  provider: 'stripe' | 'paypal' | 'square' | 'apple' | 'google';
  isEnabled: boolean;
  processingFee: number;
  currency: string;
  minimumAmount: number;
  maximumAmount: number;
  supportedCountries: string[];
  icon: string;
}

interface Transaction {
  id: string;
  orderId: string;
  customerId: string;
  vendorId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  gatewayTransactionId: string;
  platformFee: number;
  processingFee: number;
  vendorAmount: number;
  createdAt: Date;
  completedAt?: Date;
  failureReason?: string;
  refundAmount?: number;
  metadata?: Record<string, any>;
}

interface GatewayStatus {
  stripe: { status: 'online' | 'offline' | 'degraded'; lastCheck: Date };
  paypal: { status: 'online' | 'offline' | 'degraded'; lastCheck: Date };
  square: { status: 'online' | 'offline' | 'degraded'; lastCheck: Date };
  apple: { status: 'online' | 'offline' | 'degraded'; lastCheck: Date };
  google: { status: 'online' | 'offline' | 'degraded'; lastCheck: Date };
}

type TransactionStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'refunded' 
  | 'partially_refunded'
  | 'disputed';

const initialState: PaymentProcessingState = {
  paymentMethods: [],
  transactions: [],
  payouts: [],
  isProcessing: false,
  error: null,
  gatewayStatus: {
    stripe: { status: 'online', lastCheck: new Date() },
    paypal: { status: 'online', lastCheck: new Date() },
    square: { status: 'online', lastCheck: new Date() },
    apple: { status: 'online', lastCheck: new Date() },
    google: { status: 'online', lastCheck: new Date() },
  },
};

export function usePaymentProcessing() {
  const [state, setState] = useState<PaymentProcessingState>(initialState);

  // 💳 PAYMENT METHOD MANAGEMENT
  const initializePaymentMethods = useCallback(async () => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const paymentMethods: PaymentMethod[] = [
        {
          id: 'stripe_card',
          name: 'Credit/Debit Card',
          type: 'credit_card',
          provider: 'stripe',
          isEnabled: true,
          processingFee: 0.029, // 2.9%
          currency: 'USD',
          minimumAmount: 0.50,
          maximumAmount: 999999.99,
          supportedCountries: ['US', 'CA', 'GB', 'AU'],
          icon: 'credit-card',
        },
        {
          id: 'paypal',
          name: 'PayPal',
          type: 'paypal',
          provider: 'paypal',
          isEnabled: true,
          processingFee: 0.034, // 3.4%
          currency: 'USD',
          minimumAmount: 1.00,
          maximumAmount: 10000.00,
          supportedCountries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR'],
          icon: 'paypal',
        },
        {
          id: 'apple_pay',
          name: 'Apple Pay',
          type: 'apple_pay',
          provider: 'apple',
          isEnabled: true,
          processingFee: 0.029, // 2.9%
          currency: 'USD',
          minimumAmount: 0.50,
          maximumAmount: 10000.00,
          supportedCountries: ['US', 'CA', 'GB', 'AU'],
          icon: 'apple',
        },
        {
          id: 'google_pay',
          name: 'Google Pay',
          type: 'google_pay',
          provider: 'google',
          isEnabled: true,
          processingFee: 0.029, // 2.9%
          currency: 'USD',
          minimumAmount: 0.50,
          maximumAmount: 10000.00,
          supportedCountries: ['US', 'CA', 'GB', 'AU'],
          icon: 'google',
        },
        {
          id: 'bank_transfer',
          name: 'Bank Transfer',
          type: 'bank_transfer',
          provider: 'stripe',
          isEnabled: true,
          processingFee: 0.008, // 0.8%
          currency: 'USD',
          minimumAmount: 10.00,
          maximumAmount: 50000.00,
          supportedCountries: ['US', 'CA'],
          icon: 'bank',
        },
      ];

      setState(prev => ({
        ...prev,
        paymentMethods,
        isProcessing: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to initialize payment methods',
        isProcessing: false,
      }));
    }
  }, []);

  // 💰 TRANSACTION PROCESSING
  const processPayment = useCallback(async (
    orderId: string,
    amount: number,
    paymentMethodId: string,
    paymentDetails: any
  ): Promise<Transaction> => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentMethod = state.paymentMethods.find(pm => pm.id === paymentMethodId);
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }

      // Calculate fees
      const processingFee = amount * paymentMethod.processingFee;
      const platformCommissionRate = 0.05; // 5% platform commission
      const platformFee = amount * platformCommissionRate;
      const vendorAmount = amount - processingFee - platformFee;

      const transaction: Transaction = {
        id: `txn_${Date.now()}`,
        orderId,
        customerId: paymentDetails.customerId,
        vendorId: paymentDetails.vendorId,
        amount,
        currency: paymentMethod.currency,
        paymentMethod,
        status: 'completed',
        gatewayTransactionId: `${paymentMethod.provider}_${Date.now()}`,
        platformFee,
        processingFee,
        vendorAmount,
        createdAt: new Date(),
        completedAt: new Date(),
        metadata: paymentDetails.metadata,
      };

      setState(prev => ({
        ...prev,
        transactions: [...prev.transactions, transaction],
        isProcessing: false,
      }));

      // Trigger vendor payout calculation
      await scheduleVendorPayout(paymentDetails.vendorId, vendorAmount);

      return transaction;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Payment processing failed',
        isProcessing: false,
      }));
      throw error;
    }
  }, [state.paymentMethods]);

  // 🔄 REFUND PROCESSING
  const processRefund = useCallback(async (
    transactionId: string,
    refundAmount: number,
    reason: string
  ): Promise<Transaction> => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const transaction = state.transactions.find(t => t.id === transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const refundedTransaction: Transaction = {
        ...transaction,
        status: refundAmount === transaction.amount ? 'refunded' : 'partially_refunded',
        refundAmount,
        metadata: {
          ...transaction.metadata,
          refundReason: reason,
          refundedAt: new Date().toISOString(),
        },
      };

      setState(prev => ({
        ...prev,
        transactions: prev.transactions.map(t =>
          t.id === transactionId ? refundedTransaction : t
        ),
        isProcessing: false,
      }));

      return refundedTransaction;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Refund processing failed',
        isProcessing: false,
      }));
      throw error;
    }
  }, [state.transactions]);

  // 💸 VENDOR PAYOUT MANAGEMENT
  const scheduleVendorPayout = useCallback(async (
    vendorId: string,
    amount: number
  ) => {
    try {
      const existingPayout = state.payouts.find(
        p => p.vendorId === vendorId && p.status === 'pending'
      );

      if (existingPayout) {
        // Add to existing pending payout
        const updatedPayout: VendorPayout = {
          ...existingPayout,
          totalSales: existingPayout.totalSales + amount,
          netPayout: existingPayout.netPayout + amount,
        };

        setState(prev => ({
          ...prev,
          payouts: prev.payouts.map(p =>
            p.id === existingPayout.id ? updatedPayout : p
          ),
        }));
      } else {
        // Create new payout
        const newPayout: VendorPayout = {
          id: `payout_${Date.now()}`,
          vendorId,
          period: {
            from: new Date(),
            to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          },
          totalSales: amount,
          totalCommissions: 0,
          processingFees: 0,
          netPayout: amount,
          orders: [],
          status: 'pending',
          paymentMethod: 'bank_transfer',
        };

        setState(prev => ({
          ...prev,
          payouts: [...prev.payouts, newPayout],
        }));
      }
    } catch (error) {
      console.error('Failed to schedule vendor payout:', error);
    }
  }, [state.payouts]);

  const processVendorPayout = useCallback(async (payoutId: string) => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      setState(prev => ({
        ...prev,
        payouts: prev.payouts.map(payout =>
          payout.id === payoutId
            ? { ...payout, status: 'completed', processedAt: new Date() }
            : payout
        ),
        isProcessing: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Payout processing failed',
        isProcessing: false,
      }));
    }
  }, []);

  // 📊 ANALYTICS AND REPORTING
  const getPaymentAnalytics = useCallback((dateRange: { from: Date; to: Date }) => {
    const filteredTransactions = state.transactions.filter(
      t => t.createdAt >= dateRange.from && t.createdAt <= dateRange.to
    );

    const totalVolume = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalFees = filteredTransactions.reduce((sum, t) => sum + t.processingFee + t.platformFee, 0);
    const successfulTransactions = filteredTransactions.filter(t => t.status === 'completed');
    const failedTransactions = filteredTransactions.filter(t => t.status === 'failed');

    const paymentMethodBreakdown = filteredTransactions.reduce((acc, t) => {
      const method = t.paymentMethod.name;
      acc[method] = (acc[method] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalVolume,
      totalFees,
      transactionCount: filteredTransactions.length,
      successRate: filteredTransactions.length > 0 
        ? successfulTransactions.length / filteredTransactions.length 
        : 0,
      averageTransactionValue: filteredTransactions.length > 0 
        ? totalVolume / filteredTransactions.length 
        : 0,
      paymentMethodBreakdown,
      failedTransactionsCount: failedTransactions.length,
      refundedAmount: filteredTransactions
        .filter(t => t.refundAmount)
        .reduce((sum, t) => sum + (t.refundAmount || 0), 0),
    };
  }, [state.transactions]);

  // 🔍 FRAUD DETECTION
  const detectFraudulentActivity = useCallback((transaction: Transaction) => {
    const riskFactors = [];

    // Check for unusual amounts
    if (transaction.amount > 5000) {
      riskFactors.push('high_amount');
    }

    // Check for rapid successive transactions
    const recentTransactions = state.transactions.filter(
      t => t.customerId === transaction.customerId &&
           t.createdAt > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );

    if (recentTransactions.length > 5) {
      riskFactors.push('rapid_transactions');
    }

    // Check for multiple failed attempts
    const failedAttempts = state.transactions.filter(
      t => t.customerId === transaction.customerId &&
           t.status === 'failed' &&
           t.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    );

    if (failedAttempts.length > 3) {
      riskFactors.push('multiple_failures');
    }

    const riskScore = riskFactors.length * 25; // Simple scoring system
    const riskLevel = riskScore > 75 ? 'high' : riskScore > 50 ? 'medium' : 'low';

    return {
      riskScore,
      riskLevel,
      riskFactors,
      requiresReview: riskLevel === 'high',
    };
  }, [state.transactions]);

  // 🔄 GATEWAY HEALTH MONITORING
  const checkGatewayHealth = useCallback(async () => {
    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Simulate API health checks
      const healthChecks = await Promise.all([
        simulateHealthCheck('stripe'),
        simulateHealthCheck('paypal'),
        simulateHealthCheck('square'),
        simulateHealthCheck('apple'),
        simulateHealthCheck('google'),
      ]);

      const gatewayStatus = healthChecks.reduce((acc, check) => {
        acc[check.gateway] = {
          status: check.status,
          lastCheck: new Date(),
        };
        return acc;
      }, {} as GatewayStatus);

      setState(prev => ({
        ...prev,
        gatewayStatus,
        isProcessing: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to check gateway health',
        isProcessing: false,
      }));
    }
  }, []);

  // Initialize payment methods on mount
  useEffect(() => {
    initializePaymentMethods();
    
    // Set up periodic gateway health checks
    const healthCheckInterval = setInterval(checkGatewayHealth, 5 * 60 * 1000); // Every 5 minutes
    
    return () => clearInterval(healthCheckInterval);
  }, [initializePaymentMethods, checkGatewayHealth]);

  // Load mock data on mount
  useEffect(() => {
    const loadMockData = async () => {
      try {
        const mockTransactions = generateMockTransactions();
        const mockPayouts = generateMockPayouts();

        setState(prev => ({
          ...prev,
          transactions: mockTransactions,
          payouts: mockPayouts,
        }));
      } catch (error) {
        console.error('Failed to load mock payment data:', error);
      }
    };

    loadMockData();
  }, []);

  return {
    // State
    ...state,
    
    // Payment Processing
    processPayment,
    processRefund,
    
    // Vendor Payouts
    scheduleVendorPayout,
    processVendorPayout,
    
    // Analytics
    getPaymentAnalytics,
    
    // Security
    detectFraudulentActivity,
    
    // Monitoring
    checkGatewayHealth,
  };
}

// 🔧 HELPER FUNCTIONS
async function simulateHealthCheck(gateway: string) {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
  
  const statuses = ['online', 'offline', 'degraded'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return { gateway, status };
}

function generateMockTransactions(): Transaction[] {
  return [
    {
      id: 'txn_001',
      orderId: 'order_001',
      customerId: 'customer_1',
      vendorId: 'vendor_1',
      amount: 89.99,
      currency: 'USD',
      paymentMethod: {
        id: 'stripe_card',
        name: 'Credit/Debit Card',
        type: 'credit_card',
        provider: 'stripe',
        isEnabled: true,
        processingFee: 0.029,
        currency: 'USD',
        minimumAmount: 0.50,
        maximumAmount: 999999.99,
        supportedCountries: ['US'],
        icon: 'credit-card',
      },
      status: 'completed',
      gatewayTransactionId: 'stripe_1234567890',
      platformFee: 4.50,
      processingFee: 2.61,
      vendorAmount: 82.88,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ];
}

function generateMockPayouts(): VendorPayout[] {
  return [
    {
      id: 'payout_001',
      vendorId: 'vendor_1',
      period: {
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
      totalSales: 1250.00,
      totalCommissions: 62.50,
      processingFees: 36.25,
      netPayout: 1151.25,
      orders: ['order_001', 'order_002', 'order_003'],
      status: 'pending',
      paymentMethod: 'bank_transfer',
    },
  ];
}