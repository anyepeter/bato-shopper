import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check, ChevronRight, ShoppingBag, Truck, CreditCard, FileText, Calendar, Clock, MapPin, Phone, Mail, User, Lock, Star, Heart, Sparkles, ShoppingCart, Package, Gift, Zap, Shield, Moon, Sun } from "lucide-react";
import { CartItem } from "../../types";
import { motion, AnimatePresence } from "motion/react";

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

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation';

export function CheckoutPage({ cartItems, onNavigateBack, onOrderComplete, onNavigateToPackageTracking }: CheckoutPageProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingMethod, setShippingMethod] = useState('standard');
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
    country: 'United States'
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [orderNumber] = useState(`MS${Date.now().toString().slice(-6)}`);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shippingCost = shippingMethod === 'express' ? 15.99 : shippingMethod === 'overnight' ? 25.99 : 5.99;
  const total = subtotal + tax + shippingCost;

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: Truck, emoji: '🚚', title: 'Lightning Fast Shipping!', subtitle: 'We deliver your African fashion worldwide with speed and style!' },
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
    
    // Listen for dark mode changes
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
    setTimeout(() => {
      onOrderComplete();
    }, 3000);
  };

  // TikTok-style mobile progress indicator 
  const renderMobileProgress = () => (
    <div className="fixed top-0 left-0 right-0 z-50" 
      style={{ 
        background: 'linear-gradient(135deg, #5825efff, #6e29f6)',
        paddingTop: '44px' 
      }}>
      <div className="px-4 py-4">
        {/* Back button and title */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onNavigateBack}
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-white font-heading font-bold">Checkout</h1>
            <p className="text-white/70 text-sm font-body">{currentStepData?.label}</p>
          </div>
          
          <div className="w-10"></div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < getCurrentStepIndex();
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300`}
                  style={{
                    background: isActive || isCompleted 
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(255, 255, 255, 0.3)',
                    color: isActive || isCompleted 
                      ? '#5825efff' 
                      : 'rgba(255, 255, 255, 0.7)'
                  }}
                  animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
                >
                  {isCompleted ? '✓' : index + 1}
                </motion.div>
                <span className="text-xs mt-1 font-body text-white/70">{step.label}</span>
              </div>
            );
          })}
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 overflow-hidden bg-white/20" style={{ borderRadius: '3px' }}>
          <motion.div
            className="h-full bg-white"
            style={{ borderRadius: '3px' }}
            initial={{ width: '0%' }}
            animate={{ width: `${((getCurrentStepIndex() + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );

  // TikTok-style shipping step
  const renderTikTokShippingStep = () => (
    <motion.div 
      className="fixed inset-0 overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        paddingTop: '140px',
        paddingBottom: '100px'
      }}
      initial={{ x: swipeDirection === 'right' ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: swipeDirection === 'left' ? -100 : 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full opacity-10" 
          style={{ background: 'linear-gradient(135deg, #5825efff, #6e29f6)' }} />
        <div className="absolute bottom-40 left-10 w-24 h-24 rounded-full opacity-10"
          style={{ background: 'linear-gradient(135deg, #6e29f6, #5825efff)' }} />
      </div>

      <div className="px-4 h-full overflow-y-auto scrollbar-hide">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="text-8xl mb-4"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🚚
          </motion.div>
          <h1 className="text-4xl font-bold font-heading mb-2 text-white">
            Lightning Fast Shipping! ⚡
          </h1>
          <p className="text-white/80 font-body text-lg mb-2">
            We deliver your African fashion worldwide with speed and style!
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <span>🌍</span>
            <span>Global delivery</span>
            <span>•</span>
            <span>✨</span>
            <span>Premium packaging</span>
          </div>
        </motion.div>

        {/* Choose Your Speed Section */}
        <motion.div
          className="mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold font-heading text-white mb-4 text-center">
            Choose Your Speed 🚀
          </h2>
          <p className="text-white/70 text-center font-body mb-6">
            Pick the perfect shipping option for you!
          </p>

          <div className="space-y-4">
            {[
              { 
                id: 'standard', 
                name: 'Standard Shipping', 
                time: '5-7 business days', 
                price: 5.99, 
                emoji: '📦', 
                desc: 'Perfect for planning ahead',
                color: 'from-green-500 to-emerald-600',
                popular: false
              },
              { 
                id: 'express', 
                name: 'Express Shipping', 
                time: '2-3 business days', 
                price: 15.99, 
                emoji: '⚡', 
                desc: 'Faster delivery',
                color: 'from-blue-500 to-cyan-600',
                popular: true
              },
              { 
                id: 'overnight', 
                name: 'Overnight Express', 
                time: '1 business day', 
                price: 25.99, 
                emoji: '🚀', 
                desc: 'Need it now?',
                color: 'from-purple-500 to-pink-600',
                popular: false
              }
            ].map((method) => (
              <motion.label
                key={method.id}
                className={`relative flex items-center p-6 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                  shippingMethod === method.id 
                    ? 'shadow-2xl scale-[1.02]' 
                    : 'shadow-lg hover:shadow-xl hover:scale-[1.01]'
                }`}
                style={{
                  background: shippingMethod === method.id 
                    ? 'linear-gradient(135deg, rgba(88, 37, 239, 0.3), rgba(110, 41, 246, 0.3))'
                    : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: shippingMethod === method.id 
                    ? '2px solid rgba(255, 255, 255, 0.4)' 
                    : '1px solid rgba(255, 255, 255, 0.2)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {method.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #5825efff, #6e29f6)' }}>
                    POPULAR
                  </div>
                )}
                
                <input
                  type="radio"
                  name="shipping"
                  value={method.id}
                  checked={shippingMethod === method.id}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="sr-only"
                />
                
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-4xl">{method.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold font-heading text-white text-lg">{method.name}</span>
                    </div>
                    <div className="text-white/70 text-sm font-body mb-1">{method.desc}</div>
                    <div className="text-white/80 text-sm font-body">{method.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-2xl font-heading text-white">${method.price}</div>
                  </div>
                </div>
                
                {shippingMethod === method.id && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(88, 37, 239, 0.1), rgba(110, 41, 246, 0.1))',
                      border: '2px solid rgba(255, 255, 255, 0.3)'
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.label>
            ))}
          </div>
        </motion.div>

        {/* Personal Information Section */}
        <motion.div
          className="mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold font-heading text-white mb-4 text-center">
            Your Details 👤
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name"
                value={shippingInfo.firstName}
                onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                className="w-full p-4 rounded-2xl font-body text-white placeholder-white/50 transition-all duration-300 focus:ring-2 focus:ring-white/30 focus:outline-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={shippingInfo.lastName}
                onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                className="w-full p-4 rounded-2xl font-body text-white placeholder-white/50 transition-all duration-300 focus:ring-2 focus:ring-white/30 focus:outline-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              />
            </div>
            
            <input
              type="email"
              placeholder="your@email.com"
              value={shippingInfo.email}
              onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
              className="w-full p-4 rounded-2xl font-body text-white placeholder-white/50 transition-all duration-300 focus:ring-2 focus:ring-white/30 focus:outline-none"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            />
            
            <input
              type="tel"
              placeholder="(555) 123-4567"
              value={shippingInfo.phone}
              onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
              className="w-full p-4 rounded-2xl font-body text-white placeholder-white/50 transition-all duration-300 focus:ring-2 focus:ring-white/30 focus:outline-none"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            />
            
            <input
              type="text"
              placeholder="123 Fashion Street"
              value={shippingInfo.address}
              onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
              className="w-full p-4 rounded-2xl font-body text-white placeholder-white/50 transition-all duration-300 focus:ring-2 focus:ring-white/30 focus:outline-none"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                value={shippingInfo.city}
                onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                className="w-full p-4 rounded-2xl font-body text-white placeholder-white/50 transition-all duration-300 focus:ring-2 focus:ring-white/30 focus:outline-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              />
              <input
                type="text"
                placeholder="State"
                value={shippingInfo.state}
                onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                className="w-full p-4 rounded-2xl font-body text-white placeholder-white/50 transition-all duration-300 focus:ring-2 focus:ring-white/30 focus:outline-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  // TikTok-style payment step
  const renderTikTokPaymentStep = () => (
    <motion.div 
      className="fixed inset-0 overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        paddingTop: '140px',
        paddingBottom: '100px'
      }}
      initial={{ x: swipeDirection === 'right' ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: swipeDirection === 'left' ? -100 : 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="px-4 h-full overflow-y-auto scrollbar-hide">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="text-8xl mb-4"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            💳
          </motion.div>
          <h1 className="text-4xl font-bold font-heading mb-2 text-white">
            Secure Payment! 🔒
          </h1>
          <p className="text-white/80 font-body text-lg mb-2">
            Your payment is protected with bank-level security
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <span>🛡️</span>
            <span>SSL encrypted</span>
            <span>•</span>
            <span>🔐</span>
            <span>100% secure</span>
          </div>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          className="space-y-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <input
            type="text"
            placeholder="Cardholder Name"
            value={paymentInfo.cardholderName}
            onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
            className="w-full p-4 rounded-2xl font-body text-white placeholder-white/50 transition-all duration-300 focus:ring-2 focus:ring-white/30 focus:outline-none"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          />
          
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={paymentInfo.cardNumber}
            onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
            className="w-full p-4 rounded-2xl font-body text-white placeholder-white/50 transition-all duration-300 focus:ring-2 focus:ring-white/30 focus:outline-none"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              value={paymentInfo.expiryDate}
              onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
              className="w-full p-4 rounded-2xl font-body text-white placeholder-white/50 transition-all duration-300 focus:ring-2 focus:ring-white/30 focus:outline-none"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            />
            <input
              type="text"
              placeholder="CVV"
              value={paymentInfo.cvv}
              onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
              className="w-full p-4 rounded-2xl font-body text-white placeholder-white/50 transition-all duration-300 focus:ring-2 focus:ring-white/30 focus:outline-none"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            />
          </div>
        </motion.div>

        {/* Security Features */}
        <motion.div
          className="mt-8 p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-white font-heading font-bold mb-4 text-center">Why Your Payment is Safe 🛡️</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-green-400 text-xl">✅</span>
              <span className="text-white/80 font-body">256-bit SSL encryption</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-400 text-xl">✅</span>
              <span className="text-white/80 font-body">PCI DSS compliant</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-400 text-xl">✅</span>
              <span className="text-white/80 font-body">Never store your card details</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  // TikTok-style review step
  const renderTikTokReviewStep = () => (
    <motion.div 
      className="fixed inset-0 overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        paddingTop: '140px',
        paddingBottom: '100px'
      }}
      initial={{ x: swipeDirection === 'right' ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: swipeDirection === 'left' ? -100 : 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="px-4 h-full overflow-y-auto scrollbar-hide">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="text-8xl mb-4"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            📋
          </motion.div>
          <h1 className="text-4xl font-bold font-heading mb-2 text-white">
            Almost There! 🎯
          </h1>
          <p className="text-white/80 font-body text-lg">
            Review your order before we make it official
          </p>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          className="space-y-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Cart Items */}
          <div className="p-6 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
            <h3 className="text-white font-heading font-bold mb-4">Your Items ({cartItems.length})</h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-white font-body text-sm">{item.product.name}</div>
                    <div className="text-white/60 text-xs">Size: {item.size} • Color: {item.color}</div>
                  </div>
                  <div className="text-white font-bold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-6 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
            <h3 className="text-white font-heading font-bold mb-4">Order Total</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Shipping</span>
                <span className="text-white">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Tax</span>
                <span className="text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/20 pt-3 flex justify-between">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-white font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  // TikTok-style confirmation step
  const renderTikTokConfirmationStep = () => (
    <motion.div 
      className="fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{ 
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)'
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div 
        className="text-center px-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div 
          className="text-9xl mb-6"
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
        <h1 className="text-5xl font-bold font-heading mb-4 text-white">
          Order Complete!
        </h1>
        <p className="text-white/80 font-body text-xl mb-6">
          Your beautiful African fashion is on its way!
        </p>
        <div className="p-6 rounded-2xl mb-6"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
          <div className="text-white/70 text-sm font-body mb-2">Order Number</div>
          <div className="text-white font-bold text-2xl font-heading">#{orderNumber}</div>
        </div>
        <p className="text-white/60 text-sm font-body">
          You will receive a confirmation email shortly with tracking information
        </p>
      </motion.div>
    </motion.div>
  );

  // Mobile Navigation Footer
  const renderMobileNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.95) 100%)'
      }}>
      <div className="flex gap-3">
        {getCurrentStepIndex() > 0 && currentStep !== 'confirmation' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevStep}
            className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 text-white"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold font-body">Back</span>
          </motion.button>
        )}
        
        {currentStep !== 'confirmation' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={currentStep === 'review' ? handleCompleteOrder : handleNextStep}
            className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 text-white font-bold font-body"
            style={{ 
              background: 'linear-gradient(135deg, #5825efff, #6e29f6)',
              boxShadow: '0 4px 20px rgba(88, 37, 239, 0.4)'
            }}
          >
            {currentStep === 'review' ? (
              <>
                <ShoppingBag className="h-5 w-5" />
                <span>Complete Order</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );

  if (!isMobile) {
    // Desktop view - simplified for now, focus on mobile
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold font-heading mb-8">Checkout</h1>
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <p className="text-gray-600">Desktop checkout view - Use mobile for full TikTok-style experience</p>
            <button
              onClick={onNavigateBack}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      {renderMobileProgress()}
      
      <AnimatePresence mode="wait">
        {currentStep === 'shipping' && (
          <div key="shipping">
            {renderTikTokShippingStep()}
          </div>
        )}
        
        {currentStep === 'payment' && (
          <div key="payment">
            {renderTikTokPaymentStep()}
          </div>
        )}
        
        {currentStep === 'review' && (
          <div key="review">
            {renderTikTokReviewStep()}
          </div>
        )}
        
        {currentStep === 'confirmation' && (
          <div key="confirmation">
            {renderTikTokConfirmationStep()}
          </div>
        )}
      </AnimatePresence>
      
      {renderMobileNavigation()}
    </div>
  );
}