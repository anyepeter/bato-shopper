import { useState, useEffect } from "react";
import { RotateCcw, Package, Calendar, CheckCircle, AlertCircle, Mail, FileText, ArrowLeft, RefreshCw, Clock, Shield, Heart, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

export function ReturnsPage() {
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
              Returns & Exchanges
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
              <RefreshCw size={48} style={{ margin: '0 auto 1rem', color: '#5825efff' }} />
              <h2 className="font-heading text-2xl mb-3" style={{ color: 'var(--pure-white)' }}>
                Easy Returns & Exchanges! 🔄
              </h2>
              <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Not in love? No worries! We make returns super easy and stress-free! 💫
              </p>
            </div>
          </div>

          {/* Return Policy - Same card style */}
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
              Our Return Promise 💝
            </h3>
            <p className="font-body text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Your happiness is our priority!
            </p>

            <div 
              className="p-3 rounded-lg mb-4"
              style={{
                background: 'rgba(88, 37, 239, 0.2)',
                border: '1px solid rgba(88, 37, 239, 0.3)',
                borderRadius: '8px'
              }}
            >
              <h4 className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600', marginBottom: '0.5rem' }}>
                30-Day Return Window 📅
              </h4>
              <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5' }}>
                You have <strong>30 full days</strong> from delivery to return your items. That's a whole month to decide if you love it! 💭
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)' }}
                >
                  <CheckCircle size={20} color="white" />
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                    Free Returns ✨
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    We cover return shipping costs!
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #ff6b6b, #ff5252)' }}
                >
                  <Heart size={20} color="white" />
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                    Tags Required 🏷️
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Items must have original tags attached
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #00a8ff, #0078ff)' }}
                >
                  <Package size={20} color="white" />
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                    Original Condition 🌟
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Unworn and in sellable condition
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How to Return - Same styling as admin response cards */}
          <div 
            className="p-4 rounded-lg"
            style={{
              background: 'rgba(88, 37, 239, 0.2)',
              border: '1px solid rgba(88, 37, 239, 0.3)',
              borderRadius: '8px'
            }}
          >
            <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--pure-white)' }}>
              How to Return (Super Easy!) 🚀
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5825efff, #5825efff)', flexShrink: 0 }}
                >
                  <span className="font-body text-xs" style={{ color: 'white', fontWeight: '700' }}>1</span>
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600', marginBottom: '0.25rem' }}>
                    Start Your Return 📱
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Email us or use our online return form
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5825efff, #5825efff)', flexShrink: 0 }}
                >
                  <span className="font-body text-xs" style={{ color: 'white', fontWeight: '700' }}>2</span>
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600', marginBottom: '0.25rem' }}>
                    Get Your Label 🏷️
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    We'll send you a prepaid return label
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5825efff, #5825efff)', flexShrink: 0 }}
                >
                  <span className="font-body text-xs" style={{ color: 'white', fontWeight: '700' }}>3</span>
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600', marginBottom: '0.25rem' }}>
                    Pack & Ship 📦
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Pack items and drop off at any post office
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)', flexShrink: 0 }}
                >
                  <span className="font-body text-xs" style={{ color: 'white', fontWeight: '700' }}>4</span>
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600', marginBottom: '0.25rem' }}>
                    Get Your Refund 💰
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Refund processed within 3-5 business days!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Exchanges - Same card style */}
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
              Exchanges Made Easy 🔄
            </h3>

            <div 
              className="p-3 rounded-lg mb-4"
              style={{
                background: 'rgba(88, 37, 239, 0.2)',
                border: '1px solid rgba(88, 37, 239, 0.3)',
                borderRadius: '8px'
              }}
            >
              <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5', textAlign: 'center' }}>
                Want a different size or color? We'll swap it for you faster than you can say "fashion!" 💨✨
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5825efff, #5825efff)' }}
                >
                  <RefreshCw size={20} color="white" />
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                    Size Exchanges 📏
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Free size swaps within 30 days
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5825efff, #5825efff)' }}
                >
                  <Sparkles size={20} color="white" />
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                    Color Changes 🎨
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Switch colors if available in stock
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5825efff, #5825efff)' }}
                >
                  <Clock size={20} color="white" />
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                    Quick Processing ⚡
                  </div>
                  <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Exchanges shipped within 2-3 days
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes - Same styling as admin response cards */}
          <div 
            className="p-4 rounded-lg"
            style={{
              background: 'rgba(88, 37, 239, 0.2)',
              border: '1px solid rgba(88, 37, 239, 0.3)',
              borderRadius: '8px'
            }}
          >
            <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--pure-white)' }}>
              Good to Know 💡
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600', marginBottom: '0.5rem' }}>
                  What Can't Be Returned 🚫
                </h4>
                <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5' }}>
                  • Final sale items (marked clearly)<br/>
                  • Items worn or damaged<br/>
                  • Custom or personalized pieces<br/>
                  • Items without original tags
                </div>
              </div>
              <div>
                <h4 className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Refund Timeline ⏰
                </h4>
                <div className="font-body text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5' }}>
                  • Credit cards: 3-5 business days<br/>
                  • PayPal: 1-2 business days<br/>
                  • Store credit: Instant! 🚀<br/>
                  • International: 5-10 business days
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
              Questions? We're Here! 💬
            </h3>
            <p className="font-body text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
              Need help with a return? Our team is ready to assist! ✨
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
                📧 Start a Return
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
                💬 Chat with Support
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
              <RotateCcw className="h-8 w-8 text-yellow-400" />
              <span 
                className="text-yellow-400"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontWeight: '600'
                }}
              >
                Hassle-Free Returns
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
              Returns & Exchanges
            </h1>
            <p 
              className="mb-8 opacity-90 animate-fade-in-delay"
              style={{ 
                fontSize: '1.25rem',
                fontFamily: 'var(--font-body)'
              }}
            >
              Not completely satisfied? We make returns and exchanges easy
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Return Policy Overview */}
        <section className="mb-12">
          <div 
            className="bg-white p-8 shadow-sm"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <h2 
              className="text-gray-900 mb-6 text-center"
              style={{ 
                fontSize: '1.5rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: '700'
              }}
            >
              Our Return Policy
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div 
                  className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-4"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h3 
                  className="text-gray-900 mb-2"
                  style={{ 
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  30-Day Return Window
                </h3>
                <p 
                  className="text-gray-600"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Return items within 30 days of delivery for a full refund
                </p>
              </div>
              
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
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  Original Condition
                </h3>
                <p 
                  className="text-gray-600"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Items must be unworn with original tags and packaging
                </p>
              </div>
              
              <div className="text-center">
                <div 
                  className="w-16 h-16 bg-purple-100 flex items-center justify-center mx-auto mb-4"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <RotateCcw className="h-8 w-8 text-purple-600" />
                </div>
                <h3 
                  className="text-gray-900 mb-2"
                  style={{ 
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  Free Exchanges
                </h3>
                <p 
                  className="text-gray-600"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Exchange for different size or color at no extra cost
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Return Process Steps */}
        <section className="mb-12">
          <h2 
            className="text-gray-900 mb-8 text-center"
            style={{ 
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: '700'
            }}
          >
            How to Return an Item
          </h2>
          
          <div className="space-y-6">
            <div 
              className="bg-white p-6 shadow-sm flex items-start space-x-4"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center" style={{ borderRadius: '50%', fontWeight: '700' }}>
                  1
                </div>
              </div>
              <div>
                <h3 
                  className="text-gray-900 mb-2"
                  style={{ 
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  Initiate Your Return
                </h3>
                <p 
                  className="text-gray-600 mb-3"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Contact our customer service team via email or phone to start your return process. Have your order number ready.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button 
                    className="btn-moema-primary btn-moema-rounded-lg inline-flex items-center px-4 py-2"
                    style={{
                      borderRadius: 'var(--radius-lg)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem'
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </button>
                  <button 
                    className="btn-moema-secondary btn-moema-rounded-lg inline-flex items-center px-4 py-2"
                    style={{
                      borderRadius: 'var(--radius-lg)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem'
                    }}
                  >
                    Call (555) 123-4567
                  </button>
                </div>
              </div>
            </div>

            <div 
              className="bg-white p-6 shadow-sm flex items-start space-x-4"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center" style={{ borderRadius: '50%', fontWeight: '700' }}>
                  2
                </div>
              </div>
              <div>
                <h3 
                  className="text-gray-900 mb-2"
                  style={{ 
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  Receive Return Authorization
                </h3>
                <p 
                  className="text-gray-600"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  We'll send you a Return Merchandise Authorization (RMA) number and a prepaid return shipping label via email.
                </p>
              </div>
            </div>

            <div 
              className="bg-white p-6 shadow-sm flex items-start space-x-4"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center" style={{ borderRadius: '50%', fontWeight: '700' }}>
                  3
                </div>
              </div>
              <div>
                <h3 
                  className="text-gray-900 mb-2"
                  style={{ 
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  Package Your Items
                </h3>
                <p 
                  className="text-gray-600"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Pack items in original packaging (if available) or a secure box. Include all tags, accessories, and the RMA number.
                </p>
              </div>
            </div>

            <div 
              className="bg-white p-6 shadow-sm flex items-start space-x-4"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center" style={{ borderRadius: '50%', fontWeight: '700' }}>
                  4
                </div>
              </div>
              <div>
                <h3 
                  className="text-gray-900 mb-2"
                  style={{ 
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  Ship Your Return
                </h3>
                <p 
                  className="text-gray-600"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Attach the prepaid return label and drop off at any authorized shipping location. You'll receive a tracking number for your return.
                </p>
              </div>
            </div>

            <div 
              className="bg-white p-6 shadow-sm flex items-start space-x-4"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center" style={{ borderRadius: '50%', fontWeight: '700' }}>
                  5
                </div>
              </div>
              <div>
                <h3 
                  className="text-gray-900 mb-2"
                  style={{ 
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '600'
                  }}
                >
                  Receive Your Refund
                </h3>
                <p 
                  className="text-gray-600"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Once we receive and process your return (5-7 business days), your refund will be issued to your original payment method.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Return Conditions */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Returnable Items */}
            <div 
              className="p-8"
              style={{ 
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))'
              }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 
                  className="text-gray-900"
                  style={{ 
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '700'
                  }}
                >
                  What Can Be Returned
                </h3>
              </div>
              <div className="space-y-3 text-gray-700" style={{ fontFamily: 'var(--font-body)' }}>
                <p>• Unworn clothing with original tags attached</p>
                <p>• Shoes in original box with no signs of wear</p>
                <p>• Accessories in original packaging</p>
                <p>• Items purchased within the last 30 days</p>
                <p>• Defective or damaged items (any timeframe)</p>
                <p>• Wrong size or color sent by mistake</p>
              </div>
            </div>

            {/* Non-Returnable Items */}
            <div 
              className="p-8"
              style={{ 
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))'
              }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <h3 
                  className="text-gray-900"
                  style={{ 
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '700'
                  }}
                >
                  What Cannot Be Returned
                </h3>
              </div>
              <div className="space-y-3 text-gray-700" style={{ fontFamily: 'var(--font-body)' }}>
                <p>• Items worn or used beyond try-on</p>
                <p>• Customized or personalized items</p>
                <p>• Items without original tags</p>
                <p>• Undergarments for hygiene reasons</p>
                <p>• Items damaged by misuse</p>
                <p>• Returns after 30-day window (except defects)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Exchange Information */}
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
              Exchanges Made Easy
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
                  Size Exchanges
                </h3>
                <div className="space-y-3 text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                  <p>• Free exchanges for different sizes</p>
                  <p>• Subject to availability</p>
                  <p>• Same item style and color only</p>
                  <p>• Processing time: 3-5 business days</p>
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
                  Color Exchanges
                </h3>
                <div className="space-y-3 text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                  <p>• Exchange for different color variations</p>
                  <p>• Must be same item and size</p>
                  <p>• Free if item availability permits</p>
                  <p>• Price difference may apply for premium colors</p>
                </div>
              </div>
            </div>
            
            <div 
              className="mt-8 p-6"
              style={{ 
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--primary-extra-light-blue), rgba(88, 37, 239, 0.05))'
              }}
            >
              <h4 
                className="text-gray-900 mb-2"
                style={{ 
                  fontFamily: 'var(--font-heading)',
                  fontWeight: '600'
                }}
              >
                Quick Exchange Tip
              </h4>
              <p 
                className="text-gray-700"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                For faster exchanges, you can place a new order for your desired item and return the original item separately. This ensures you get your preferred item even if stock is limited.
              </p>
            </div>
          </div>
        </section>

        {/* Contact for Questions */}
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
              Have Return Questions?
            </h2>
            <p 
              className="text-gray-600 mb-6 max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Our customer service team is here to help with any return-related questions or concerns you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="btn-moema-primary btn-moema-rounded-lg inline-flex items-center justify-center px-6 py-3"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Return Support
              </button>
              <button 
                className="btn-moema-secondary btn-moema-rounded-lg inline-flex items-center justify-center px-6 py-3"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
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