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

  // TikTok-style order confirmation with navigation choices
  const renderTikTokConfirmationStep = () => (
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

      <div className="px-4 h-full overflow-y-auto scrollbar-hide">
        {/* Success Hero Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="text-8xl mb-4"
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
          <h1 className="text-4xl font-bold font-heading mb-2 text-white">
            Order Complete! 
          </h1>
          <p className="text-white/80 font-body text-lg mb-2">
            Your beautiful African fashion is on its way!
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <span>📦</span>
            <span>Order #{orderNumber}</span>
            <span>•</span>
            <span>✨</span>
            <span>Thank you!</span>
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
          <h3 className="text-xl font-heading font-bold text-white mb-4 text-center">
            Order Summary 📋
          </h3>
          <div className="space-y-3 text-white/80 font-body">
            <div className="flex justify-between">
              <span>Items ({cartItems.length})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping ({selectedShipping?.serviceName})</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <hr className="border-white/20" />
            <div className="flex justify-between font-bold text-lg text-white">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Navigation Options */}
        <motion.div 
          className="space-y-4 mb-8"
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
            <div className="flex items-center justify-center gap-4">
              <Package className="h-6 w-6 text-white" />
              <div className="text-center">
                <div className="font-bold font-heading text-white text-lg">Track Your Package</div>
                <div className="text-white/70 text-sm font-body">Get real-time delivery updates</div>
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
            <div className="flex items-center justify-center gap-4">
              <ShoppingBag className="h-6 w-6 text-white" />
              <div className="text-center">
                <div className="font-bold font-heading text-white text-lg">Continue Shopping</div>
                <div className="text-white/70 text-sm font-body">Discover more amazing products</div>
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
          <div className="text-2xl mb-2">✅</div>
          <p className="text-green-300 font-body text-sm">
            Order confirmation sent to {shippingInfo.email}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: isMobile ? '#000' : 'var(--light-gray)' }}>
      {isMobile && renderTikTokConfirmationStep()}
      {/* Add other mobile/desktop layouts here */}
    </div>
  );
}