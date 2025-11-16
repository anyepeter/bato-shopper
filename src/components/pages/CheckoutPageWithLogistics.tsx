import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowLeft, Check, ChevronRight, ShoppingBag, Truck, CreditCard, FileText, Calendar, Clock, MapPin, Phone, Mail, User, Lock, Star, Heart, Sparkles, ShoppingCart, Package, Gift, Zap, Shield, Moon, Sun } from "lucide-react";
import { CartItem } from "../../types";
import { motion, AnimatePresence } from "motion/react";
import { allLogisticsCompanies, getLogisticsByCountry, calculateShippingCost, LogisticsCompany, LogisticsService } from "../../constants/logisticsCompanies";

interface CheckoutPageProps {
  cartItems: CartItem[];
  onNavigateBack: () => void;
  onOrderComplete: () => void;
  onNavigateToPackageTracking?: (orderNumber: string) => void;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface MobileMoneyInfo {
  provider: string;
  phoneNumber: string;
  accountName: string;
}

type PaymentMethod = 'card' | 'mobile_money';

interface SelectedShipping {
  companyId: string;
  serviceId: string;
  companyName: string;
  serviceName: string;
  price: number;
  deliveryTime: string;
  description: string;
}

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation';

export function CheckoutPageWithLogistics({ cartItems, onNavigateBack, onOrderComplete, onNavigateToPackageTracking }: CheckoutPageProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [selectedShipping, setSelectedShipping] = useState<SelectedShipping | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSwipeInProgress, setIsSwipeInProgress] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Cameroon'
  });
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  
  const [mobileMoneyInfo, setMobileMoneyInfo] = useState<MobileMoneyInfo>({
    provider: '',
    phoneNumber: '',
    accountName: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mobile_money');
  const [orderNumber] = useState(`BAT${Date.now().toString().slice(-6)}`);

  // Calculate cart weight for shipping cost calculation
  const cartWeight = useMemo(() => {
    return cartItems.reduce((weight, item) => {
      const estimatedWeight = item.product.category === 'dresses' ? 0.8 : 
                             item.product.category === 'tops' ? 0.4 : 0.2;
      return weight + (estimatedWeight * item.quantity);
    }, 0);
  }, [cartItems]);

  // Get available logistics companies based on selected country
  const availableLogistics = useMemo(() => {
    return getLogisticsByCountry(shippingInfo.country);
  }, [shippingInfo.country]);

  // Generate shipping methods from logistics companies
  const availableShippingMethods = useMemo(() => {
    const methods: Array<{
      id: string;
      companyId: string;
      serviceId: string;
      name: string;
      companyName: string;
      time: string;
      price: number;
      emoji: string;
      desc: string;
      features: string[];
      popular: boolean;
      type: string;
      rating: number;
    }> = [];

    availableLogistics.forEach(company => {
      company.services.forEach(service => {
        const calculatedPrice = calculateShippingCost(service.id, cartWeight);
        const displayPrice = service.currency === 'XAF' ? calculatedPrice / 600 : calculatedPrice;
        
        methods.push({
          id: `${company.id}-${service.id}`,
          companyId: company.id,
          serviceId: service.id,
          name: service.name,
          companyName: company.name,
          time: service.deliveryTime,
          price: displayPrice,
          emoji: company.type === 'bus_agency' ? '🚌' : 
                 company.type === 'international' ? '✈️' : 
                 company.type === 'express' ? '⚡' : '📦',
          desc: service.description,
          features: service.features,
          popular: company.type === 'bus_agency' && company.rating > 4.0,
          type: company.type,
          rating: company.rating
        });
      });
    });

    return methods.sort((a, b) => {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return a.price - b.price;
    });
  }, [availableLogistics, cartWeight]);

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.incentive ? item.incentive.discountedPrice : item.product.price;
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  const tax = subtotal * 0.08;
  const shippingCost = selectedShipping?.price || 0;
  const total = subtotal + tax + shippingCost;

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: Truck, emoji: '🚚', title: 'Choose Your Delivery Partner!', subtitle: 'We work with trusted local and international logistics companies' },
    { id: 'payment', label: 'Payment', icon: CreditCard, emoji: '💳', title: 'Secure Payment!', subtitle: 'Your payment is protected with bank-level security' },
    { id: 'review', label: 'Review', icon: FileText, emoji: '📋', title: 'Almost There!', subtitle: 'Review your order before we make it official' },
    { id: 'confirmation', label: 'Complete', icon: Check, emoji: '🎉', title: 'Order Complete!', subtitle: 'Your beautiful African fashion is on its way!' }
  ];

  // Mobile and dark mode detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    checkMobile();
    checkDarkMode();
    
    window.addEventListener('resize', checkMobile);
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);
  const currentStepData = steps[getCurrentStepIndex()];

  const handleNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setIsSwipeInProgress(true);
      setSwipeDirection('left');
      setTimeout(() => {
        setCurrentStep(steps[currentIndex + 1].id as CheckoutStep);
        setIsSwipeInProgress(false);
        setSwipeDirection(null);
      }, 300);
    }
  };

  const handlePrevStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setIsSwipeInProgress(true);
      setSwipeDirection('right');
      setTimeout(() => {
        setCurrentStep(steps[currentIndex - 1].id as CheckoutStep);
        setIsSwipeInProgress(false);
        setSwipeDirection(null);
      }, 300);
    }
  };

  const handleCompleteOrder = () => {
    setCurrentStep('confirmation');
  };

  const handleShippingSelection = (method: any) => {
    setSelectedShipping({
      companyId: method.companyId,
      serviceId: method.serviceId,
      companyName: method.companyName,
      serviceName: method.name,
      price: method.price,
      deliveryTime: method.time,
      description: method.desc
    });
  };

  // Step 1: Shipping Selection
  const renderShippingStep = () => (
    <motion.div 
      className="fixed inset-0 overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        paddingTop: '140px',
        paddingBottom: '20px'
      }}
      initial={{ x: swipeDirection === 'right' ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: swipeDirection === 'left' ? -100 : 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="px-4 h-full overflow-y-auto scrollbar-hide" style={{ backgroundColor: 'transparent' }}>
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          style={{ backgroundColor: 'transparent' }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="text-6xl mb-3" style={{ backgroundColor: 'transparent' }}>🚚</div>
          <h1 className="text-3xl font-bold font-heading mb-2 text-white" style={{ backgroundColor: 'transparent' }}>
            Choose Your Delivery Partner!
          </h1>
          <p className="text-white/80 font-body" style={{ backgroundColor: 'transparent' }}>
            We work with trusted local and international logistics companies
          </p>
        </motion.div>

        {/* Shipping Address Form */}
        <motion.div
          className="mb-6 p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px'
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-heading font-bold text-white mb-4" style={{ backgroundColor: 'transparent' }}>
            📍 Shipping Address
          </h3>
          <div className="space-y-4" style={{ backgroundColor: 'transparent' }}>
            <div className="grid grid-cols-2 gap-3" style={{ backgroundColor: 'transparent' }}>
              <input
                type="text"
                placeholder="First Name"
                value={shippingInfo.firstName}
                onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 font-body"
                style={{ borderRadius: '12px' }}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={shippingInfo.lastName}
                onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 font-body"
                style={{ borderRadius: '12px' }}
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={shippingInfo.email}
              onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 font-body"
              style={{ borderRadius: '12px' }}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={shippingInfo.phone}
              onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 font-body"
              style={{ borderRadius: '12px' }}
            />
            <input
              type="text"
              placeholder="Street Address"
              value={shippingInfo.address}
              onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 font-body"
              style={{ borderRadius: '12px' }}
            />
            <div className="grid grid-cols-2 gap-3" style={{ backgroundColor: 'transparent' }}>
              <input
                type="text"
                placeholder="City"
                value={shippingInfo.city}
                onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 font-body"
                style={{ borderRadius: '12px' }}
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={shippingInfo.zipCode}
                onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 font-body"
                style={{ borderRadius: '12px' }}
              />
            </div>
            <select
              value={shippingInfo.country}
              onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 font-body"
              style={{ borderRadius: '12px' }}
            >
              <option value="Cameroon" className="bg-gray-800">Cameroon</option>
              <option value="Nigeria" className="bg-gray-800">Nigeria</option>
              <option value="Ghana" className="bg-gray-800">Ghana</option>
              <option value="Kenya" className="bg-gray-800">Kenya</option>
              <option value="South Africa" className="bg-gray-800">South Africa</option>
            </select>
          </div>
        </motion.div>

        {/* Shipping Methods */}
        <motion.div
          className="mb-6"
          style={{ backgroundColor: 'transparent' }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-lg font-heading font-bold text-white mb-4" style={{ backgroundColor: 'transparent' }}>
            🚚 Delivery Options
          </h3>
          <div className="space-y-3" style={{ backgroundColor: 'transparent' }}>
            {availableShippingMethods.map((method) => (
              <motion.button
                key={method.id}
                onClick={() => handleShippingSelection(method)}
                className={`w-full p-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                  selectedShipping?.companyId === method.companyId && selectedShipping?.serviceId === method.serviceId
                    ? 'ring-2 ring-white/50' : ''
                }`}
                style={{
                  background: selectedShipping?.companyId === method.companyId && selectedShipping?.serviceId === method.serviceId
                    ? 'linear-gradient(135deg, #5825efff, #6e29f6)'
                    : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between" style={{ backgroundColor: 'transparent' }}>
                  <div className="flex items-center gap-3" style={{ backgroundColor: 'transparent' }}>
                    <span className="text-2xl" style={{ backgroundColor: 'transparent' }}>{method.emoji}</span>
                    <div className="text-left" style={{ backgroundColor: 'transparent' }}>
                      <div className="font-bold text-white font-heading" style={{ backgroundColor: 'transparent' }}>{method.companyName}</div>
                      <div className="text-white/70 text-sm font-body" style={{ backgroundColor: 'transparent' }}>{method.name}</div>
                      <div className="text-white/60 text-xs" style={{ backgroundColor: 'transparent' }}>{method.time}</div>
                    </div>
                  </div>
                  <div className="text-right" style={{ backgroundColor: 'transparent' }}>
                    <div className="font-bold text-white font-heading" style={{ backgroundColor: 'transparent' }}>${method.price.toFixed(2)}</div>
                    {method.popular && (
                      <div className="text-xs text-yellow-300" style={{ backgroundColor: 'transparent' }}>🔥 Popular</div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.button
          onClick={handleNextStep}
          disabled={!selectedShipping || !shippingInfo.firstName || !shippingInfo.email}
          className="w-full p-4 rounded-2xl transition-all duration-300 mb-4 disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #5825efff, #6e29f6)',
            borderRadius: '16px',
            border: 'none'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-center gap-3">
            <CreditCard className="h-5 w-5 text-white" />
            <span className="font-bold font-heading text-white">Continue to Payment</span>
            <ChevronRight className="h-5 w-5 text-white" />
          </div>
        </motion.button>
      </div>
    </motion.div>
  );

  // Step 2: Payment Method
  const renderPaymentStep = () => (
    <motion.div 
      className="fixed inset-0 overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        paddingTop: '140px',
        paddingBottom: '20px'
      }}
      initial={{ x: swipeDirection === 'right' ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: swipeDirection === 'left' ? -100 : 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="px-4 h-full overflow-y-auto scrollbar-hide" style={{ backgroundColor: 'transparent' }}>
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          style={{ backgroundColor: 'transparent' }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="text-6xl mb-3" style={{ backgroundColor: 'transparent' }}>💳</div>
          <h1 className="text-3xl font-bold font-heading mb-2 text-white" style={{ backgroundColor: 'transparent' }}>
            Secure Payment!
          </h1>
          <p className="text-white/80 font-body" style={{ backgroundColor: 'transparent' }}>
            Your payment is protected with bank-level security
          </p>
        </motion.div>

        {/* Payment Method Selection */}
        <motion.div
          className="mb-6"
          style={{ backgroundColor: 'transparent' }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-heading font-bold text-white mb-4" style={{ backgroundColor: 'transparent' }}>
            💰 Payment Method
          </h3>
          <div className="space-y-3" style={{ backgroundColor: 'transparent' }}>
            <motion.button
              onClick={() => setPaymentMethod('mobile_money')}
              className={`w-full p-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                paymentMethod === 'mobile_money' ? 'ring-2 ring-white/50' : ''
              }`}
              style={{
                background: paymentMethod === 'mobile_money'
                  ? 'linear-gradient(135deg, #5825efff, #6e29f6)'
                  : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3" style={{ backgroundColor: 'transparent' }}>
                <span className="text-2xl" style={{ backgroundColor: 'transparent' }}>📱</span>
                <div className="text-left" style={{ backgroundColor: 'transparent' }}>
                  <div className="font-bold text-white font-heading" style={{ backgroundColor: 'transparent' }}>Mobile Money</div>
                  <div className="text-white/70 text-sm font-body" style={{ backgroundColor: 'transparent' }}>Pay with MTN, Orange, or other mobile services</div>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                paymentMethod === 'card' ? 'ring-2 ring-white/50' : ''
              }`}
              style={{
                background: paymentMethod === 'card'
                  ? 'linear-gradient(135deg, #5825efff, #6e29f6)'
                  : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3" style={{ backgroundColor: 'transparent' }}>
                <span className="text-2xl" style={{ backgroundColor: 'transparent' }}>💳</span>
                <div className="text-left" style={{ backgroundColor: 'transparent' }}>
                  <div className="font-bold text-white font-heading" style={{ backgroundColor: 'transparent' }}>Credit/Debit Card</div>
                  <div className="text-white/70 text-sm font-body" style={{ backgroundColor: 'transparent' }}>Visa, Mastercard, and other major cards</div>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          className="mb-6 p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px'
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-lg font-heading font-bold text-white mb-4" style={{ backgroundColor: 'transparent' }}>
            {paymentMethod === 'mobile_money' ? '📱 Mobile Money Details' : '💳 Card Details'}
          </h3>
          
          {paymentMethod === 'mobile_money' ? (
            <div className="space-y-4" style={{ backgroundColor: 'transparent' }}>
              <select
                value={mobileMoneyInfo.provider}
                onChange={(e) => setMobileMoneyInfo({...mobileMoneyInfo, provider: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 font-body"
                style={{ borderRadius: '12px' }}
              >
                <option value="" className="bg-gray-800">Select Provider</option>
                <option value="MTN" className="bg-gray-800">MTN Mobile Money</option>
                <option value="Orange" className="bg-gray-800">Orange Money</option>
                <option value="Moov" className="bg-gray-800">Moov Money</option>
              </select>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobileMoneyInfo.phoneNumber}
                onChange={(e) => setMobileMoneyInfo({...mobileMoneyInfo, phoneNumber: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 font-body"
                style={{ borderRadius: '12px' }}
              />
              <input
                type="text"
                placeholder="Account Name"
                value={mobileMoneyInfo.accountName}
                onChange={(e) => setMobileMoneyInfo({...mobileMoneyInfo, accountName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 font-body"
                style={{ borderRadius: '12px' }}
              />
            </div>
          ) : (
            <div className="space-y-4" style={{ backgroundColor: 'transparent' }}>
              <input
                type="text"
                placeholder="Card Number"
                value={paymentInfo.cardNumber}
                onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 font-body"
                style={{ borderRadius: '12px' }}
              />
              <div className="grid grid-cols-2 gap-3" style={{ backgroundColor: 'transparent' }}>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 font-body"
                  style={{ borderRadius: '12px' }}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 font-body"
                  style={{ borderRadius: '12px' }}
                />
              </div>
              <input
                type="text"
                placeholder="Cardholder Name"
                value={paymentInfo.cardholderName}
                onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 font-body"
                style={{ borderRadius: '12px' }}
              />
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mb-4" style={{ backgroundColor: 'transparent' }}>
          <motion.button
            onClick={handlePrevStep}
            className="flex-1 p-4 rounded-2xl transition-all duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-3" style={{ backgroundColor: 'transparent' }}>
              <ArrowLeft className="h-5 w-5 text-white" />
              <span className="font-bold font-heading text-white" style={{ backgroundColor: 'transparent' }}>Back</span>
            </div>
          </motion.button>

          <motion.button
            onClick={handleNextStep}
            disabled={paymentMethod === 'mobile_money' ? !mobileMoneyInfo.provider || !mobileMoneyInfo.phoneNumber : !paymentInfo.cardNumber || !paymentInfo.expiryDate}
            className="flex-2 p-4 rounded-2xl transition-all duration-300 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #5825efff, #6e29f6)',
              borderRadius: '16px',
              border: 'none',
              flex: '2'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-5 w-5 text-white" />
              <span className="font-bold font-heading text-white">Review Order</span>
              <ChevronRight className="h-5 w-5 text-white" />
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Step 3: Review Order
  const renderReviewStep = () => (
    <motion.div 
      className="fixed inset-0 overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        paddingTop: '140px',
        paddingBottom: '20px'
      }}
      initial={{ x: swipeDirection === 'right' ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: swipeDirection === 'left' ? -100 : 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="px-4 h-full overflow-y-auto scrollbar-hide" style={{ backgroundColor: 'transparent' }}>
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          style={{ backgroundColor: 'transparent' }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="text-6xl mb-3" style={{ backgroundColor: 'transparent' }}>📋</div>
          <h1 className="text-3xl font-bold font-heading mb-2 text-white" style={{ backgroundColor: 'transparent' }}>
            Almost There!
          </h1>
          <p className="text-white/80 font-body" style={{ backgroundColor: 'transparent' }}>
            Review your order before we make it official
          </p>
        </motion.div>

        {/* Order Items */}
        <motion.div
          className="mb-6 p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px'
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-heading font-bold text-white mb-4" style={{ backgroundColor: 'transparent' }}>
            🛍️ Your Items ({cartItems.length})
          </h3>
          <div className="space-y-3" style={{ backgroundColor: 'transparent' }}>
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1" style={{ backgroundColor: 'transparent' }}>
                  <div className="font-bold text-white text-sm" style={{ backgroundColor: 'transparent' }}>{item.product.name}</div>
                  <div className="text-white/60 text-xs" style={{ backgroundColor: 'transparent' }}>
                    {item.size && `Size: ${item.size} • `}
                    {item.color && `Color: ${item.color} • `}
                    Qty: {item.quantity}
                  </div>
                  {item.incentive && (
                    <div className="text-green-300 text-xs" style={{ backgroundColor: 'transparent' }}>💚 {item.incentive.offerTitle}</div>
                  )}
                </div>
                <div className="text-right" style={{ backgroundColor: 'transparent' }}>
                  <div className="font-bold text-white" style={{ backgroundColor: 'transparent' }}>
                    ${(item.incentive ? item.incentive.discountedPrice : item.product.price * item.quantity).toFixed(2)}
                  </div>
                  {item.incentive && (
                    <div className="text-white/50 line-through text-xs" style={{ backgroundColor: 'transparent' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Shipping & Payment Summary */}
        <motion.div
          className="mb-6 p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px'
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-lg font-heading font-bold text-white mb-4" style={{ backgroundColor: 'transparent' }}>
            📦 Delivery & Payment
          </h3>
          <div className="space-y-3 text-white/80 font-body" style={{ backgroundColor: 'transparent' }}>
            <div className="flex justify-between" style={{ backgroundColor: 'transparent' }}>
              <span style={{ backgroundColor: 'transparent' }}>Shipping to:</span>
              <span style={{ backgroundColor: 'transparent' }}>{shippingInfo.firstName} {shippingInfo.lastName}</span>
            </div>
            <div className="text-right text-sm text-white/60" style={{ backgroundColor: 'transparent' }}>
              {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.country}
            </div>
            <div className="flex justify-between" style={{ backgroundColor: 'transparent' }}>
              <span style={{ backgroundColor: 'transparent' }}>Delivery:</span>
              <span style={{ backgroundColor: 'transparent' }}>{selectedShipping?.serviceName} ({selectedShipping?.deliveryTime})</span>
            </div>
            <div className="flex justify-between" style={{ backgroundColor: 'transparent' }}>
              <span style={{ backgroundColor: 'transparent' }}>Payment:</span>
              <span style={{ backgroundColor: 'transparent' }}>{paymentMethod === 'mobile_money' ? `Mobile Money (${mobileMoneyInfo.provider})` : 'Credit/Debit Card'}</span>
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          className="mb-6 p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px'
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-heading font-bold text-white mb-4" style={{ backgroundColor: 'transparent' }}>
            💰 Order Summary
          </h3>
          <div className="space-y-3 text-white/80 font-body" style={{ backgroundColor: 'transparent' }}>
            <div className="flex justify-between" style={{ backgroundColor: 'transparent' }}>
              <span style={{ backgroundColor: 'transparent' }}>Subtotal</span>
              <span style={{ backgroundColor: 'transparent' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ backgroundColor: 'transparent' }}>
              <span style={{ backgroundColor: 'transparent' }}>Shipping</span>
              <span style={{ backgroundColor: 'transparent' }}>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ backgroundColor: 'transparent' }}>
              <span style={{ backgroundColor: 'transparent' }}>Tax</span>
              <span style={{ backgroundColor: 'transparent' }}>${tax.toFixed(2)}</span>
            </div>
            <hr className="border-white/20" style={{ backgroundColor: 'transparent' }} />
            <div className="flex justify-between font-bold text-lg text-white" style={{ backgroundColor: 'transparent' }}>
              <span style={{ backgroundColor: 'transparent' }}>Total</span>
              <span style={{ backgroundColor: 'transparent' }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mb-4" style={{ backgroundColor: 'transparent' }}>
          <motion.button
            onClick={handlePrevStep}
            className="flex-1 p-4 rounded-2xl transition-all duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3" style={{ backgroundColor: 'transparent' }}>
              <ArrowLeft className="h-5 w-5 text-white" />
              <span className="font-bold font-heading text-white" style={{ backgroundColor: 'transparent' }}>Back</span>
            </div>
          </motion.button>

          <motion.button
            onClick={handleCompleteOrder}
            className="flex-2 p-4 rounded-2xl transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #34d399, #10b981)',
              borderRadius: '16px',
              border: 'none',
              flex: '2'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3">
              <Check className="h-5 w-5 text-white" />
              <span className="font-bold font-heading text-white">Complete Order</span>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Step 4: TikTok-style order confirmation with navigation choices
  const renderConfirmationStep = () => (
    <motion.div 
      className="fixed inset-0 overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        paddingTop: '140px',
        paddingBottom: '20px'
      }}
      initial={{ x: swipeDirection === 'right' ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: swipeDirection === 'left' ? -100 : 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full opacity-10" 
          style={{ background: 'linear-gradient(135deg, #5825efff, #6e29f6)' }} />
        <div className="absolute bottom-40 left-10 w-24 h-24 rounded-full opacity-10"
          style={{ background: 'linear-gradient(135deg, #6e29f6, #5825efff)' }} />
      </div>

      <div className="px-4 h-full overflow-y-auto scrollbar-hide" style={{ backgroundColor: 'transparent' }}>
        {/* Success Hero Section */}
        <motion.div 
          className="text-center mb-8"
          style={{ backgroundColor: 'transparent' }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="text-8xl mb-4"
            style={{ backgroundColor: 'transparent' }}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🎉
          </motion.div>
          <h1 className="text-4xl font-bold font-heading mb-2 text-white" style={{ backgroundColor: 'transparent' }}>
            Order Complete! 
          </h1>
          <p className="text-white/80 font-body text-lg mb-2" style={{ backgroundColor: 'transparent' }}>
            Your beautiful African fashion is on its way!
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/60" style={{ backgroundColor: 'transparent' }}>
            <span style={{ backgroundColor: 'transparent' }}>📦</span>
            <span style={{ backgroundColor: 'transparent' }}>Order #{orderNumber}</span>
            <span style={{ backgroundColor: 'transparent' }}>•</span>
            <span style={{ backgroundColor: 'transparent' }}>✨</span>
            <span style={{ backgroundColor: 'transparent' }}>Thank you!</span>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          className="mb-6 p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px'
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-heading font-bold text-white mb-4 text-center" style={{ backgroundColor: 'transparent' }}>
            Order Summary 📋
          </h3>
          <div className="space-y-3 text-white/80 font-body" style={{ backgroundColor: 'transparent' }}>
            <div className="flex justify-between" style={{ backgroundColor: 'transparent' }}>
              <span style={{ backgroundColor: 'transparent' }}>Items ({cartItems.length})</span>
              <span style={{ backgroundColor: 'transparent' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ backgroundColor: 'transparent' }}>
              <span style={{ backgroundColor: 'transparent' }}>Shipping ({selectedShipping?.serviceName})</span>
              <span style={{ backgroundColor: 'transparent' }}>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ backgroundColor: 'transparent' }}>
              <span style={{ backgroundColor: 'transparent' }}>Tax</span>
              <span style={{ backgroundColor: 'transparent' }}>${tax.toFixed(2)}</span>
            </div>
            <hr className="border-white/20" style={{ backgroundColor: 'transparent' }} />
            <div className="flex justify-between font-bold text-lg text-white" style={{ backgroundColor: 'transparent' }}>
              <span style={{ backgroundColor: 'transparent' }}>Total</span>
              <span style={{ backgroundColor: 'transparent' }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Navigation Options */}
        <motion.div 
          className="space-y-4 mb-8"
          style={{ backgroundColor: 'transparent' }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Track Package Button */}
          <motion.button
            onClick={() => {
              if (onNavigateToPackageTracking) {
                onNavigateToPackageTracking(orderNumber);
              }
            }}
            className="w-full p-6 rounded-2xl transition-all duration-300 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #5825efff, #6e29f6)',
              borderRadius: '16px',
              border: 'none'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-4" style={{ backgroundColor: 'transparent' }}>
              <Package className="h-6 w-6 text-white" />
              <div className="text-center" style={{ backgroundColor: 'transparent' }}>
                <div className="font-bold font-heading text-white text-lg" style={{ backgroundColor: 'transparent' }}>Track Your Package</div>
                <div className="text-white/70 text-sm font-body" style={{ backgroundColor: 'transparent' }}>Get real-time delivery updates</div>
              </div>
              <ChevronRight className="h-5 w-5 text-white/70" />
            </div>
          </motion.button>

          {/* Continue Shopping Button */}
          <motion.button
            onClick={() => {
              onOrderComplete();
            }}
            className="w-full p-6 rounded-2xl transition-all duration-300 relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-4" style={{ backgroundColor: 'transparent' }}>
              <ShoppingBag className="h-6 w-6 text-white" />
              <div className="text-center" style={{ backgroundColor: 'transparent' }}>
                <div className="font-bold font-heading text-white text-lg" style={{ backgroundColor: 'transparent' }}>Continue Shopping</div>
                <div className="text-white/70 text-sm font-body" style={{ backgroundColor: 'transparent' }}>Discover more amazing products</div>
              </div>
              <ChevronRight className="h-5 w-5 text-white/70" />
            </div>
          </motion.button>
        </motion.div>

        {/* Success Message */}
        <motion.div
          className="text-center p-6 rounded-2xl mb-4"
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '16px'
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-2xl mb-2" style={{ backgroundColor: 'transparent' }}>✅</div>
          <p className="text-green-300 font-body text-sm" style={{ backgroundColor: 'transparent' }}>
            Order confirmation sent to {shippingInfo.email}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );

  // Render step based on current step and device
  const renderCurrentStep = () => {
    if (!isMobile) {
      // Desktop layout can be added here later
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            Desktop checkout layout coming soon...
          </div>
        </div>
      );
    }

    // Mobile TikTok-style steps
    switch (currentStep) {
      case 'shipping':
        return renderShippingStep();
      case 'payment':
        return renderPaymentStep();
      case 'review':
        return renderReviewStep();
      case 'confirmation':
        return renderConfirmationStep();
      default:
        return renderShippingStep();
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: isMobile ? '#000' : 'var(--light-gray)' }}>
      {/* Mobile Progress Indicator */}
      {isMobile && currentStep !== 'confirmation' && (
        <div className="fixed top-16 left-0 right-0 z-50 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onNavigateBack}
              className="p-2 rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-8 h-2 rounded-full transition-all duration-300 ${
                    getCurrentStepIndex() >= index ? 'bg-white' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {renderCurrentStep()}
      </AnimatePresence>
    </div>
  );
}