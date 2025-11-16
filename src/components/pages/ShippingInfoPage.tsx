import { useState, useEffect } from "react";
import { Truck, Package, Clock, MapPin, Shield, Plane, Globe, ArrowLeft, Zap, Star } from "lucide-react";

export function ShippingInfoPage() {
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  // Mobile layout with EXACT same styling as Product Reviews page
  if (isMobile) {
    return (
      <div 
        className="min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a1810 100%)',
          color: 'var(--pure-white)',
          paddingBottom: '2rem'
        }}
      >
        {/* Mobile Header - EXACT same as Product Reviews */}
        <div 
          className="sticky top-0 z-50 p-4 border-b header"
          style={{
            background: 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0px'
          }}
        >
          <div className="flex items-center justify-between">
            <button 
              onClick={handleGoBack}
              className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'var(--pure-white)',
                borderRadius: '8px'
              }}
            >
              <ArrowLeft size={20} />
              <span className="font-body">Back</span>
            </button>
            <h1 className="font-heading text-lg" style={{ color: 'var(--pure-white)' }}>
              Shipping Info
            </h1>
            <div style={{ width: '80px' }}></div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Hero Section - Same card style as Product Reviews */}
          <div 
            className="p-6 rounded-lg"
            style={{
              background: 'rgba(88, 37, 239, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(88, 37, 239, 0.2)',
              borderRadius: '8px'
            }}
          >
            <div className="text-center mb-6">
              <Truck size={48} style={{ margin: '0 auto 1rem', color: '#5825efff' }} />
              <h2 className="font-heading text-2xl mb-3" style={{ color: 'var(--pure-white)' }}>
                Lightning Fast Shipping! ⚡
              </h2>
              <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                We deliver your African fashion worldwide with speed and style! 🌍✨
              </p>
            </div>
          </div>

          {/* Shipping Options - Same card style */}
          <div 
            className="p-4 rounded-lg space-y-4"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}
          >
            <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--pure-white)' }}>
              Choose Your Speed 🚀
            </h3>
            <p className="font-body text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Pick the perfect shipping option for you!
            </p>

            <div className="space-y-3">
              {/* Standard Shipping */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5825efff, #5825efff)' }}
                >
                  <Package size={20} color="white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                      Standard Shipping 📦
                    </div>
                    <div className="font-body text-sm" style={{ color: '#5825efff', fontWeight: '700' }}>
                      $5.99
                    </div>
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    5-7 business days • Free on orders $75+
                  </div>
                </div>
              </div>

              {/* Express Shipping */}
              <div 
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  background: 'rgba(88, 37, 239, 0.2)',
                  border: '1px solid rgba(88, 37, 239, 0.3)',
                  borderRadius: '8px'
                }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5825efff, #5825efff)' }}
                >
                  <Zap size={20} color="white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                      Express Shipping ⚡
                    </div>
                    <div className="font-body text-sm" style={{ color: '#5825efff', fontWeight: '700' }}>
                      $12.99
                    </div>
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    2-3 business days • Most popular! 🔥
                  </div>
                </div>
              </div>

              {/* International Shipping */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5825efff, #5825efff)' }}
                >
                  <Globe size={20} color="white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                      International 🌍
                    </div>
                    <div className="font-body text-sm" style={{ color: '#5825efff', fontWeight: '700' }}>
                      $24.99
                    </div>
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    7-14 business days • Worldwide delivery
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Policies - Same styling as admin response cards */}
          <div 
            className="p-4 rounded-lg"
            style={{
              background: 'rgba(88, 37, 239, 0.2)',
              border: '1px solid rgba(88, 37, 239, 0.3)',
              borderRadius: '8px'
            }}
          >
            <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--pure-white)' }}>
              The Shipping Scoop 📋
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Processing Time ⏰
                </h4>
                <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5' }}>
                  • Orders processed in 1-2 business days<br/>
                  • Custom orders: 3-5 business days<br/>
                  • Weekend orders processed Monday<br/>
                  • Holiday times may vary 🎄
                </div>
              </div>
              <div>
                <h4 className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Delivery Guidelines 📦
                </h4>
                <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5' }}>
                  • Signature required for high-value orders<br/>
                  • We ship to PO boxes & APO/FPO<br/>
                  • Times exclude weekends & holidays<br/>
                  • Weather may cause delays ⛈️
                </div>
              </div>
            </div>
          </div>

          {/* International Details - Same card style */}
          <div 
            className="p-4 rounded-lg space-y-4"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}
          >
            <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--pure-white)' }}>
              Going Global 🌍
            </h3>

            <div>
              <h4 className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600', marginBottom: '0.5rem' }}>
                Countries We Ship To ✈️
              </h4>
              <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5' }}>
                <strong>🇪🇺 Europe:</strong> UK, Germany, France, Italy, Spain +<br/>
                <strong>🌏 Asia-Pacific:</strong> Australia, Japan, Singapore +<br/>
                <strong>🌍 Africa:</strong> South Africa, Nigeria, Ghana +<br/>
                <strong>🌎 Americas:</strong> Mexico, Brazil, Argentina +
              </div>
            </div>

            <div 
              className="p-3 rounded-lg"
              style={{
                background: 'rgba(88, 37, 239, 0.2)',
                border: '1px solid rgba(88, 37, 239, 0.3)',
                borderRadius: '8px'
              }}
            >
              <h4 className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600', marginBottom: '0.5rem' }}>
                Important Notes 📝
              </h4>
              <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5' }}>
                • Customs fees are buyer's responsibility<br/>
                • Some countries have import restrictions<br/>
                • Delivery times vary by destination<br/>
                • Track with provided tracking number 📱
              </div>
            </div>
          </div>

          {/* Packaging - Same card style */}
          <div 
            className="p-4 rounded-lg space-y-4"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}
          >
            <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--pure-white)' }}>
              Packaging with Love 💝
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)' }}
                >
                  <Package size={20} color="white" />
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                    Eco-Friendly 🌱
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Recyclable materials only!
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #00a8ff, #0078ff)' }}
                >
                  <Shield size={20} color="white" />
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                    Super Secure 🔒
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Carefully wrapped for safe delivery
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #ff6b6b, #ff5252)' }}
                >
                  <Star size={20} color="white" />
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                    Gift Ready 🎁
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Beautiful presentation, gift messages available
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support - Same card style */}
          <div 
            className="p-4 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}
          >
            <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--pure-white)' }}>
              Need Help? We Got You! 💬
            </h3>
            <p className="font-body text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
              Questions about shipping? Our team is here to help you out! ✨
            </p>
            
            <div className="space-y-3">
              <button 
                className="w-full py-4 px-6 rounded-lg font-heading transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #5825efff, #5825efff)',
                  color: 'var(--pure-white)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                📧 Email Shipping Support
              </button>
              <button 
                className="w-full py-3 px-4 rounded-lg font-body text-sm transition-all"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'var(--pure-white)',
                  borderRadius: '8px'
                }}
              >
                📞 Call (555) 123-4567
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout - Updated with blue theme and proper design system
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--light-gray)' }}>
      {/* Hero Section - Updated to blue gradient */}
      <section className="relative h-80 overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-dark-blue), var(--primary-light-blue))'
      }}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="h-8 w-8 text-yellow-400" />
              <span 
                className="text-yellow-400"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontWeight: '600'
                }}
              >
                Fast & Reliable
              </span>
            </div>
            <h1 
              className="mb-4 animate-fade-in"
              style={{ 
                fontSize: 'clamp(2.5rem, 5vw, 3rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: '700'
              }}
            >
              Shipping Information
            </h1>
            <p 
              className="mb-8 opacity-90 animate-fade-in-delay"
              style={{ 
                fontSize: '1.25rem',
                fontFamily: 'var(--font-body)'
              }}
            >
              We deliver your African fashion worldwide with care and speed
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Shipping Options */}
        <section className="mb-12">
          <h2 
            className="text-gray-900 mb-8 text-center"
            style={{ 
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: '700'
            }}
          >
            Shipping Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Standard Shipping */}
            <div 
              className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <div className="text-center">
                <div 
                  className="w-16 h-16 bg-blue-100 flex items-center justify-center mx-auto mb-4"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <h3 
                  className="text-gray-900 mb-2"
                  style={{ 
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '700'
                  }}
                >
                  Standard Shipping
                </h3>
                <p 
                  className="text-gray-600 mb-4"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Perfect for regular orders
                </p>
                <div 
                  className="text-blue-600 mb-2"
                  style={{ 
                    fontSize: '1.875rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '700'
                  }}
                >
                  $5.99
                </div>
                <p 
                  className="text-gray-500 mb-6"
                  style={{ 
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Free on orders over $75
                </p>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span 
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      5-7 business days
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span 
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Package tracking included
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span 
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Continental US & Canada
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Express Shipping */}
            <div 
              className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow border-2 border-blue-200"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <div className="text-center">
                <div 
                  className="w-16 h-16 bg-blue-100 flex items-center justify-center mx-auto mb-4"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
                <h3 
                  className="text-gray-900 mb-2"
                  style={{ 
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '700'
                  }}
                >
                  Express Shipping
                </h3>
                <p 
                  className="text-gray-600 mb-4"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  When you need it fast
                </p>
                <div 
                  className="text-blue-600 mb-2"
                  style={{ 
                    fontSize: '1.875rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '700'
                  }}
                >
                  $12.99
                </div>
                <p 
                  className="text-gray-500 mb-6"
                  style={{ 
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Most popular choice
                </p>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span 
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      2-3 business days
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span 
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Priority handling
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span 
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      North America
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* International Shipping */}
            <div 
              className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <div className="text-center">
                <div 
                  className="w-16 h-16 bg-purple-100 flex items-center justify-center mx-auto mb-4"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <h3 
                  className="text-gray-900 mb-2"
                  style={{ 
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '700'
                  }}
                >
                  International
                </h3>
                <p 
                  className="text-gray-600 mb-4"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Worldwide delivery
                </p>
                <div 
                  className="text-purple-600 mb-2"
                  style={{ 
                    fontSize: '1.875rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '700'
                  }}
                >
                  $24.99
                </div>
                <p 
                  className="text-gray-500 mb-6"
                  style={{ 
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Calculated at checkout
                </p>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span 
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      7-14 business days
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span 
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Customs handling
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Plane className="h-4 w-4 text-green-500" />
                    <span 
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      190+ countries
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping Policies */}
        <section className="mb-12">
          <div 
            className="bg-white p-8 shadow-sm"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <h2 
              className="text-gray-900 mb-8"
              style={{ 
                fontSize: '1.5rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: '700'
              }}
            >
              Shipping Policies
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 
                  className="text-gray-900 mb-4"
                  style={{ 
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  Processing Time
                </h3>
                <div className="space-y-3 text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                  <p>• Orders are processed within 1-2 business days</p>
                  <p>• Custom orders may require 3-5 business days</p>
                  <p>• Orders placed on weekends are processed Monday</p>
                  <p>• Holiday processing times may vary</p>
                </div>
              </div>
              
              <div>
                <h3 
                  className="text-gray-900 mb-4"
                  style={{ 
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  Delivery Guidelines
                </h3>
                <div className="space-y-3 text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                  <p>• Signature may be required for high-value orders</p>
                  <p>• We ship to PO boxes and APO/FPO addresses</p>
                  <p>• Delivery times exclude weekends and holidays</p>
                  <p>• Weather conditions may cause delays</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* International Shipping Details */}
        <section className="mb-12">
          <div 
            className="p-8"
            style={{ 
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--primary-extra-light-blue), rgba(88, 37, 239, 0.05))'
            }}
          >
            <h2 
              className="text-gray-900 mb-6"
              style={{ 
                fontSize: '1.5rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: '700'
              }}
            >
              International Shipping Details
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 
                  className="text-gray-900 mb-4"
                  style={{ 
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  Countries We Ship To
                </h3>
                <div className="space-y-2 text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                  <p><strong>Europe:</strong> UK, Germany, France, Italy, Spain, Netherlands, and more</p>
                  <p><strong>Asia-Pacific:</strong> Australia, Japan, Singapore, Hong Kong, South Korea</p>
                  <p><strong>Africa:</strong> South Africa, Nigeria, Ghana, Kenya, Morocco</p>
                  <p><strong>Americas:</strong> Mexico, Brazil, Argentina, Chile, Colombia</p>
                </div>
              </div>
              
              <div>
                <h3 
                  className="text-gray-900 mb-4"
                  style={{ 
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  Important Notes
                </h3>
                <div className="space-y-3 text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                  <p>• Customs fees and duties are the buyer's responsibility</p>
                  <p>• Some countries may have import restrictions</p>
                  <p>• Delivery times may vary by destination</p>
                  <p>• Track your package with the provided tracking number</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Packaging Information */}
        <section className="mb-12">
          <div 
            className="bg-white p-8 shadow-sm"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <h2 
              className="text-gray-900 mb-6"
              style={{ 
                fontSize: '1.5rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: '700'
              }}
            >
              Packaging & Care
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div 
                  className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-4"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <h3 
                  className="text-gray-900 mb-2"
                  style={{ 
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  Eco-Friendly Packaging
                </h3>
                <p 
                  className="text-gray-600"
                  style={{ 
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  We use recyclable and biodegradable materials wherever possible
                </p>
              </div>
              
              <div className="text-center">
                <div 
                  className="w-16 h-16 bg-blue-100 flex items-center justify-center mx-auto mb-4"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 
                  className="text-gray-900 mb-2"
                  style={{ 
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  Secure Packaging
                </h3>
                <p 
                  className="text-gray-600"
                  style={{ 
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Your items are carefully wrapped to prevent damage during transit
                </p>
              </div>
              
              <div className="text-center">
                <div 
                  className="w-16 h-16 bg-purple-100 flex items-center justify-center mx-auto mb-4"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <svg className="h-8 w-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 
                  className="text-gray-900 mb-2"
                  style={{ 
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  Gift Ready
                </h3>
                <p 
                  className="text-gray-600"
                  style={{ 
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Beautiful presentation perfect for gifting, with optional gift messages
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact for Shipping Questions */}
        <section>
          <div 
            className="bg-white p-8 shadow-sm text-center"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <h2 
              className="text-gray-900 mb-4"
              style={{ 
                fontSize: '1.5rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: '700'
              }}
            >
              Have Shipping Questions?
            </h2>
            <p 
              className="text-gray-600 mb-6 max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Our customer service team is here to help with any shipping-related questions or concerns you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="btn-moema-primary btn-moema-rounded-lg inline-flex items-center justify-center px-6 py-3"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                <Package className="h-4 w-4 mr-2" />
                Email Shipping Support
              </button>
              <button 
                className="btn-moema-secondary btn-moema-rounded-lg inline-flex items-center justify-center px-6 py-3"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                <Truck className="h-4 w-4 mr-2" />
                Call (555) 123-4567
              </button>
            </div>
          </div>
        </section>
      </main>

      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fade-in-delay {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
          
          .animate-fade-in-delay {
            animation: fade-in-delay 0.6s ease-out 0.3s both;
          }
        `}
      </style>
    </div>
  );
}