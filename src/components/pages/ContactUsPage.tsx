import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, ArrowLeft, Instagram, Twitter } from "lucide-react";

export function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleGoBack = () => {
    window.history.back();
  };

  // Mobile success screen with same styling as Product Reviews
  if (isSubmitted && isMobile) {
    return (
      <div 
        className="min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a1810 100%)',
          color: 'var(--pure-white)',
          paddingBottom: '2rem'
        }}
      >
        {/* Mobile Header */}
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
              onClick={() => setIsSubmitted(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'var(--pure-white)',
                borderRadius: '8px'
              }}
            >
              <ArrowLeft size={20} />
              <span className="font-body">Back to Form</span>
            </button>
            <h1 className="font-heading text-lg" style={{ color: 'var(--pure-white)' }}>
              Message Sent
            </h1>
            <div style={{ width: '120px' }}></div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          <div 
            className="p-6 rounded-lg text-center"
            style={{
              background: 'rgba(88, 37, 239, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(88, 37, 239, 0.2)',
              borderRadius: '8px'
            }}
          >
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="font-heading text-2xl mb-4" style={{ color: 'var(--pure-white)' }}>
              Message Sent!
            </h2>
            <p className="font-body mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Thanks for reaching out! We'll get back to you within 24 hours with some fresh vibes ✨
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full py-4 px-6 rounded-lg font-heading transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #5825efff, #5825efff)',
                color: 'var(--pure-white)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop success screen  
  if (isSubmitted && !isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white p-8 text-center shadow-lg" style={{ borderRadius: 'var(--radius-lg)' }}>
            <div 
              className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-4"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h2 
              className="font-bold text-gray-900 mb-4" 
              style={{ 
                fontSize: '1.5rem',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Message Sent!
            </h2>
            <p 
              className="text-gray-600 mb-6" 
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Thank you for reaching out to us. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn-moema-primary btn-moema-rounded-lg"
              style={{
                borderRadius: 'var(--radius-lg)',
                height: '50px',
                width: '100%',
                fontFamily: 'var(--font-body)'
              }}
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              Contact Us
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
              <MessageCircle size={48} style={{ margin: '0 auto 1rem', color: '#5825efff' }} />
              <h2 className="font-heading text-2xl mb-3" style={{ color: 'var(--pure-white)' }}>
                Let's Chat! 💬
              </h2>
              <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Got questions? Drop us a line and let's make some magic happen! ✨
              </p>
            </div>
          </div>

          {/* Contact Form - Same card style */}
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
              Send us a message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: 'var(--pure-white)' }}>
                  Full Name ✨
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="What should we call you?"
                  className="w-full px-4 py-3 rounded-lg font-body"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'var(--pure-white)',
                    borderRadius: '8px'
                  }}
                  required
                />
              </div>

              <div>
                <label className="block font-body text-sm mb-2" style={{ color: 'var(--pure-white)' }}>
                  Email Address 📧
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg font-body"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'var(--pure-white)',
                    borderRadius: '8px'
                  }}
                  required
                />
              </div>

              <div>
                <label className="block font-body text-sm mb-2" style={{ color: 'var(--pure-white)' }}>
                  Subject 💭
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  className="w-full px-4 py-3 rounded-lg font-body"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'var(--pure-white)',
                    borderRadius: '8px'
                  }}
                  required
                />
              </div>

              <div>
                <label className="block font-body text-sm mb-2" style={{ color: 'var(--pure-white)' }}>
                  Message 💌
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us your story..."
                  className="w-full px-4 py-3 rounded-lg font-body"
                  rows={4}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'var(--pure-white)',
                    borderRadius: '8px',
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-4 px-6 rounded-lg font-heading transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #5825efff, #5825efff)',
                  color: 'var(--pure-white)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message 🚀'}
              </button>
            </form>
          </div>

          {/* Contact Info - Same card style */}
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
              Get in touch 📱
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5825efff, #5825efff)' }}
                >
                  <Mail size={20} color="white" />
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                    Email Us
                  </div>
                  <div className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    hello@bato.com
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5825efff, #5825efff)' }}
                >
                  <Phone size={20} color="white" />
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                    Call Us
                  </div>
                  <div className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    +1 (555) 123-4567
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5825efff, #5825efff)' }}
                >
                  <MapPin size={20} color="white" />
                </div>
                <div>
                  <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                    Visit Us
                  </div>
                  <div className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    123 Fashion Avenue, NY
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
                    We're Open
                  </div>
                  <div className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Mon-Fri: 9AM-6PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section - Same styling as admin response cards */}
          <div 
            className="p-4 rounded-lg"
            style={{
              background: 'rgba(88, 37, 239, 0.2)',
              border: '1px solid rgba(88, 37, 239, 0.3)',
              borderRadius: '8px'
            }}
          >
            <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--pure-white)' }}>
              Quick Answers 💡
            </h3>
            <div className="space-y-3">
              <div>
                <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600', marginBottom: '0.25rem' }}>
                  How long does shipping take?
                </div>
                <div className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  5-7 business days standard, express available! 📦
                </div>
              </div>
              <div>
                <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600', marginBottom: '0.25rem' }}>
                  What's your return policy?
                </div>
                <div className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  30-day returns on unworn items with tags 🔄
                </div>
              </div>
              <div>
                <div className="font-body text-sm" style={{ color: 'var(--pure-white)', fontWeight: '600', marginBottom: '0.25rem' }}>
                  International shipping?
                </div>
                <div className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Yes! We ship worldwide 🌍
                </div>
              </div>
            </div>
          </div>

          {/* Social Media - Same card style */}
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
              Follow the Vibes 🔥
            </h3>
            <p className="font-body text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
              Stay connected for the latest African fashion trends and exclusive content! ✨
            </p>
            
            <div className="grid grid-cols-4 gap-3">
              <button 
                className="aspect-square rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'var(--pure-white)',
                  borderRadius: '8px'
                }}
              >
                <Instagram size={24} />
              </button>
              <button 
                className="aspect-square rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'var(--pure-white)',
                  borderRadius: '8px'
                }}
              >
                <Twitter size={24} />
              </button>
              <button 
                className="aspect-square rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'var(--pure-white)',
                  borderRadius: '8px'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.748.097.118.112.222.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </button>
              <button 
                className="aspect-square rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'var(--pure-white)',
                  borderRadius: '8px'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
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
              <MessageCircle className="h-8 w-8 text-yellow-400" />
              <span 
                className="text-yellow-400"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontWeight: '600'
                }}
              >
                We're Here to Help
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
              Contact Us
            </h1>
            <p 
              className="mb-8 opacity-90 animate-fade-in-delay"
              style={{ 
                fontSize: '1.25rem',
                fontFamily: 'var(--font-body)'
              }}
            >
              Have questions about our African fashion? We'd love to hear from you
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
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
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-gray-700 mb-2"
                  style={{ 
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: '500'
                  }}
                >
                  Full Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full"
                  style={{ 
                    borderRadius: 'var(--radius-lg)',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>

              <div>
                <label 
                  htmlFor="email" 
                  className="block text-gray-700 mb-2"
                  style={{ 
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: '500'
                  }}
                >
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full"
                  style={{ 
                    borderRadius: 'var(--radius-lg)',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>

              <div>
                <label 
                  htmlFor="subject" 
                  className="block text-gray-700 mb-2"
                  style={{ 
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: '500'
                  }}
                >
                  Subject *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  className="w-full"
                  style={{ 
                    borderRadius: 'var(--radius-lg)',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>

              <div>
                <label 
                  htmlFor="message" 
                  className="block text-gray-700 mb-2"
                  style={{ 
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: '500'
                  }}
                >
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help you..."
                  rows={6}
                  className="w-full"
                  style={{ 
                    borderRadius: 'var(--radius-lg)',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-moema-primary btn-moema-rounded-lg w-full"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  height: '50px',
                  fontFamily: 'var(--font-body)'
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
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
                Get in touch
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-12 h-12 bg-blue-100 flex items-center justify-center"
                      style={{ borderRadius: 'var(--radius-lg)' }}
                    >
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 
                      className="text-gray-900"
                      style={{ 
                        fontFamily: 'var(--font-heading)',
                        fontWeight: '600'
                      }}
                    >
                      Email
                    </h3>
                    <p 
                      className="text-gray-600"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      hello@bato.com
                    </p>
                    <p 
                      className="text-gray-600"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      support@bato.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-12 h-12 bg-blue-100 flex items-center justify-center"
                      style={{ borderRadius: 'var(--radius-lg)' }}
                    >
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 
                      className="text-gray-900"
                      style={{ 
                        fontFamily: 'var(--font-heading)',
                        fontWeight: '600'
                      }}
                    >
                      Phone
                    </h3>
                    <p 
                      className="text-gray-600"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      +1 (555) 123-4567
                    </p>
                    <p 
                      className="text-gray-600"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      +1 (555) 987-6543
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-12 h-12 bg-green-100 flex items-center justify-center"
                      style={{ borderRadius: 'var(--radius-lg)' }}
                    >
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 
                      className="text-gray-900"
                      style={{ 
                        fontFamily: 'var(--font-heading)',
                        fontWeight: '600'
                      }}
                    >
                      Address
                    </h3>
                    <p 
                      className="text-gray-600"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      123 Fashion Avenue
                    </p>
                    <p 
                      className="text-gray-600"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      New York, NY 10001
                    </p>
                    <p 
                      className="text-gray-600"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-12 h-12 bg-purple-100 flex items-center justify-center"
                      style={{ borderRadius: 'var(--radius-lg)' }}
                    >
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 
                      className="text-gray-900"
                      style={{ 
                        fontFamily: 'var(--font-heading)',
                        fontWeight: '600'
                      }}
                    >
                      Business Hours
                    </h3>
                    <p 
                      className="text-gray-600"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </p>
                    <p 
                      className="text-gray-600"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                    <p 
                      className="text-gray-600"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div 
              className="p-8"
              style={{ 
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--primary-extra-light-blue), rgba(88, 37, 239, 0.05))'
              }}
            >
              <h3 
                className="text-gray-900 mb-4"
                style={{ 
                  fontFamily: 'var(--font-heading)',
                  fontWeight: '700'
                }}
              >
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 
                    className="text-gray-900 mb-1"
                    style={{ 
                      fontFamily: 'var(--font-heading)',
                      fontWeight: '500'
                    }}
                  >
                    How long does shipping take?
                  </h4>
                  <p 
                    className="text-gray-600"
                    style={{ 
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    Standard shipping takes 5-7 business days. Express shipping is available.
                  </p>
                </div>
                <div>
                  <h4 
                    className="text-gray-900 mb-1"
                    style={{ 
                      fontFamily: 'var(--font-heading)',
                      fontWeight: '500'
                    }}
                  >
                    What's your return policy?
                  </h4>
                  <p 
                    className="text-gray-600"
                    style={{ 
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    We offer 30-day returns on unworn items with original tags.
                  </p>
                </div>
                <div>
                  <h4 
                    className="text-gray-900 mb-1"
                    style={{ 
                      fontFamily: 'var(--font-heading)',
                      fontWeight: '500'
                    }}
                  >
                    Do you ship internationally?
                  </h4>
                  <p 
                    className="text-gray-600"
                    style={{ 
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    Yes, we ship to most countries worldwide. International shipping rates apply.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div 
              className="bg-white p-8 shadow-sm"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <h3 
                className="text-gray-900 mb-4"
                style={{ 
                  fontFamily: 'var(--font-heading)',
                  fontWeight: '700'
                }}
              >
                Follow Us
              </h3>
              <p 
                className="text-gray-600 mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Stay connected for the latest African fashion trends and updates
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-pink-100 flex items-center justify-center hover:bg-pink-200 transition-colors"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <svg className="h-5 w-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.748.097.118.112.222.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition-colors"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849.219 3.205.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
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