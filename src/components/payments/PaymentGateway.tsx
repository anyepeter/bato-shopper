import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
import { BootstrapIcon } from '../BootstrapIcon';

interface PaymentGatewayProps {
  orderId: string;
  amount: number;
  currency?: string;
  customerId: string;
  vendorId: string;
  onPaymentSuccess?: (transaction: any) => void;
  onPaymentError?: (error: string) => void;
}

export function PaymentGateway({
  orderId,
  amount,
  currency = 'USD',
  customerId,
  vendorId,
  onPaymentSuccess,
  onPaymentError,
}: PaymentGatewayProps) {
  const {
    paymentMethods,
    isProcessing,
    error,
    gatewayStatus,
    processPayment,
    detectFraudulentActivity,
  } = usePaymentProcessing();

  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculate fees and breakdown
  const selectedPaymentMethod = paymentMethods.find(pm => pm.id === selectedMethod);
  const processingFee = selectedPaymentMethod ? amount * selectedPaymentMethod.processingFee : 0;
  const platformCommission = amount * 0.05; // 5%
  const vendorAmount = amount - processingFee - platformCommission;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPaymentMethod || !agreedToTerms) {
      onPaymentError?.('Please complete all required fields and agree to terms.');
      return;
    }

    try {
      const paymentDetails = {
        customerId,
        vendorId,
        paymentMethod: selectedMethod,
        cardData: paymentData,
        metadata: {
          orderId,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      };

      // Simulate fraud detection
      const mockTransaction = {
        id: `temp_${Date.now()}`,
        customerId,
        vendorId,
        amount,
        orderId,
        createdAt: new Date(),
        status: 'pending' as const,
        paymentMethod: selectedPaymentMethod,
        platformFee: platformCommission,
        processingFee,
        vendorAmount,
        currency,
        gatewayTransactionId: '',
      };

      const fraudCheck = detectFraudulentActivity(mockTransaction);
      
      if (fraudCheck.requiresReview) {
        onPaymentError?.('Payment requires additional verification. Please contact support.');
        return;
      }

      const transaction = await processPayment(orderId, amount, selectedMethod, paymentDetails);
      onPaymentSuccess?.(transaction);
    } catch (error) {
      onPaymentError?.(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  const getGatewayStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <BootstrapIcon name="check-circle-fill" className="text-green-600" />;
      case 'degraded': return <BootstrapIcon name="exclamation-triangle-fill" className="text-yellow-600" />;
      case 'offline': return <BootstrapIcon name="x-circle-fill" className="text-red-600" />;
      default: return <BootstrapIcon name="question-circle" className="text-gray-400" />;
    }
  };

  const getPaymentMethodIcon = (method: any) => {
    const iconMap = {
      'credit-card': 'credit-card',
      'paypal': 'paypal',
      'apple': 'apple',
      'google': 'google',
      'bank': 'bank2',
    };
    return iconMap[method.icon] || 'credit-card';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BootstrapIcon name="credit-card" className="text-xl" />
            <span>Payment Summary</span>
          </CardTitle>
          <CardDescription>Review your order and payment details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Order Total:</span>
              <span className="font-semibold ml-2">${amount.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Processing Fee:</span>
              <span className="font-semibold ml-2">${processingFee.toFixed(2)}</span>
            </div>
          </div>
          
          {showAdvanced && (
            <div className="bg-gray-50 p-3 rounded space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee ({((selectedPaymentMethod?.processingFee || 0) * 100).toFixed(1)}%):</span>
                <span>${processingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Commission (5%):</span>
                <span>${platformCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Vendor Receives:</span>
                <span className="font-semibold">${vendorAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs"
          >
            {showAdvanced ? 'Hide' : 'Show'} Payment Breakdown
            <BootstrapIcon name={showAdvanced ? 'chevron-up' : 'chevron-down'} className="ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Gateway Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Payment Gateway Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(gatewayStatus).map(([gateway, status]) => (
              <div key={gateway} className="flex items-center space-x-2 text-sm">
                {getGatewayStatusIcon(status.status)}
                <span className="capitalize">{gateway}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <form onSubmit={handlePaymentSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Choose your preferred payment method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods
                .filter(method => method.isEnabled)
                .map((method) => (
                <div
                  key={method.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BootstrapIcon 
                        name={getPaymentMethodIcon(method)} 
                        className="text-2xl text-gray-600" 
                      />
                      <div>
                        <h4 className="font-medium">{method.name}</h4>
                        <p className="text-sm text-gray-600">
                          {(method.processingFee * 100).toFixed(1)}% fee
                        </p>
                      </div>
                    </div>
                    {selectedMethod === method.id && (
                      <BootstrapIcon name="check-circle-fill" className="text-blue-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        {selectedMethod && selectedPaymentMethod?.type === 'credit_card' && (
          <Card>
            <CardHeader>
              <CardTitle>Card Details</CardTitle>
              <CardDescription>Enter your payment information securely</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  value={paymentData.cardholderName}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              {/* Billing Address */}
              <Separator />
              <h4 className="font-medium">Billing Address</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={paymentData.billingAddress.street}
                    onChange={(e) => setPaymentData(prev => ({ 
                      ...prev, 
                      billingAddress: { ...prev.billingAddress, street: e.target.value }
                    }))}
                    placeholder="123 Main St"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={paymentData.billingAddress.city}
                      onChange={(e) => setPaymentData(prev => ({ 
                        ...prev, 
                        billingAddress: { ...prev.billingAddress, city: e.target.value }
                      }))}
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={paymentData.billingAddress.state}
                      onChange={(e) => setPaymentData(prev => ({ 
                        ...prev, 
                        billingAddress: { ...prev.billingAddress, state: e.target.value }
                      }))}
                      placeholder="NY"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={paymentData.billingAddress.zipCode}
                      onChange={(e) => setPaymentData(prev => ({ 
                        ...prev, 
                        billingAddress: { ...prev.billingAddress, zipCode: e.target.value }
                      }))}
                      placeholder="10001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={paymentData.billingAddress.country}
                      onValueChange={(value) => setPaymentData(prev => ({ 
                        ...prev, 
                        billingAddress: { ...prev.billingAddress, country: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alternative Payment Methods */}
        {selectedMethod && selectedPaymentMethod?.type !== 'credit_card' && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedPaymentMethod.name} Payment</CardTitle>
              <CardDescription>
                You will be redirected to {selectedPaymentMethod.name} to complete your payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BootstrapIcon name="info-circle" className="text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-800">
                      After clicking "Pay Now", you'll be securely redirected to {selectedPaymentMethod.name} 
                      to authorize the payment of ${amount.toFixed(2)}.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Terms and Conditions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                . I understand that my payment will be processed securely and that I can request a refund 
                within 30 days of purchase.
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert>
            <BootstrapIcon name="exclamation-triangle" className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full btn-moema-primary h-12 text-lg"
            disabled={!selectedMethod || !agreedToTerms || isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing Payment...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <BootstrapIcon name="shield-check" />
                <span>Pay ${amount.toFixed(2)} Securely</span>
              </div>
            )}
          </Button>

          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <BootstrapIcon name="shield-fill-check" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              <BootstrapIcon name="lock-fill" />
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <BootstrapIcon name="award-fill" />
              <span>Industry Standard Security</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}