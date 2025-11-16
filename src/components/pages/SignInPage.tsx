import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

interface SignInPageProps {
  onNavigateBack: () => void;
  onSignIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  onNavigateToCreateAccount: () => void;
  isLoading?: boolean;
}

export function SignInPage({ 
  onNavigateBack, 
  onSignIn, 
  onNavigateToCreateAccount,
  isLoading = false 
}: SignInPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSignIn(formData.email, formData.password, formData.rememberMe);
    } catch (error) {
      setErrors({ submit: 'Invalid email or password. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
              onClick={onNavigateBack}
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
              Sign In
            </h1>
            <div style={{ width: '80px' }}></div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Hero Section - Same card style as Product Reviews */}
          <div 
            className="p-6 rounded-lg"
            style={{
              background: 'transparent',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(88, 37, 239, 0.2)',
              borderRadius: '8px'
            }}
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles size={32} style={{ color: '#5825efff' }} />
                <span 
                  className="font-heading text-2xl" 
                  style={{ color: '#5825efff', fontWeight: '900' }}
                >
                  B
                </span>
              </div>
              <h2 className="font-heading text-2xl mb-3" style={{ color: 'var(--pure-white)' }}>
                Welcome Back! 👋
              </h2>
              <p className="font-body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Ready to continue your fashion journey? Let's get you signed in! ✨
              </p>
            </div>
          </div>

          {/* Sign In Form - Same card style */}
          <div 
            className="p-4 rounded-lg space-y-4"
            style={{
              background: 'transparent',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}
          >
            <h3 className="font-heading text-lg mb-4" style={{ color: 'var(--pure-white)' }}>
              Sign In to Your Account
            </h3>
            <p className="font-body text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Your style adventure continues here! 🌟
            </p>

            {errors.submit && (
              <div 
                className="p-3 rounded-lg mb-4"
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px'
                }}
              >
                <p className="font-body text-xs text-center" style={{ color: '#ff6b6b' }}>
                  {errors.submit}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-body text-sm mb-2 block" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                  Email Address 📧
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="w-full py-3 px-4 pr-12 rounded-lg font-body text-sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'var(--pure-white)',
                      borderRadius: '8px',
                      paddingLeft: '3rem'
                    }}
                    required
                  />
                  <Mail 
                    size={20} 
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="font-body text-xs mt-1" style={{ color: '#ff6b6b' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="font-body text-sm mb-2 block" style={{ color: 'var(--pure-white)', fontWeight: '600' }}>
                  Password 🔐
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className="w-full py-3 px-4 pr-12 rounded-lg font-body text-sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'var(--pure-white)',
                      borderRadius: '8px',
                      paddingLeft: '3rem',
                      paddingRight: '3rem'
                    }}
                    required
                  />
                  <Lock 
                    size={20} 
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="font-body text-xs mt-1" style={{ color: '#ff6b6b' }}>
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{
                      accentColor: '#5825efff',
                      borderRadius: '4px'
                    }}
                  />
                  <span className="font-body text-sm" style={{ color: 'var(--pure-white)' }}>
                    Remember me
                  </span>
                </label>
                <button 
                  type="button"
                  className="font-body text-sm underline"
                  style={{ color: '#5825efff' }}
                >
                  Forgot password?
                </button>
              </div>

              <button 
                type="submit"
                className="w-full py-4 px-6 rounded-lg font-heading transition-all duration-300 mb-4"
                style={{
                  background: 'linear-gradient(135deg, #5825efff, #5825efff)',
                  color: 'var(--pure-white)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div 
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    ></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In 🚀'
                )}
              </button>
            </form>
          </div>

          {/* Social Sign In - Same styling as admin response cards */}
          <div 
            className="p-4 rounded-lg"
            style={{
              background: 'transparent',
              border: '1px solid rgba(88, 37, 239, 0.3)',
              borderRadius: '8px'
            }}
          >
            <p className="font-body text-sm text-center mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Or continue with
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-body text-sm transition-all"
                style={{
                  background: '#4285F4',
                  border: '1px solid #4285F4',
                  color: 'var(--pure-white)',
                  borderRadius: '8px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#FFFFFF" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#FFFFFF" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FFFFFF" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#FFFFFF" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button 
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-body text-sm transition-all"
                style={{
                  background: '#1DA1F2',
                  border: '1px solid #1DA1F2',
                  color: 'var(--pure-white)',
                  borderRadius: '8px'
                }}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                Twitter
              </button>
            </div>
          </div>

          {/* Sign Up Link - Same card style */}
          <div 
            className="p-4 rounded-lg"
            style={{
              background: 'transparent',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}
          >
            <div className="text-center">
              <p className="font-body text-sm mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                New to Bato?
              </p>
              <button
                type="button"
                onClick={onNavigateToCreateAccount}
                className="font-body text-sm underline"
                style={{ color: '#5825efff', fontWeight: '600' }}
              >
                Create an account ✨
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout - Updated with blue theme and proper design system
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--light-gray)' }}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={onNavigateBack}
            className="mr-4 p-2 hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--warning-yellow)',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <span 
                className="font-bold text-lg font-heading"
                style={{ color: 'var(--primary-blue)' }}
              >
                B
              </span>
            </div>
            <h1 
              className="text-2xl font-bold font-heading"
              style={{ 
                color: 'var(--primary-blue)',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Bato
            </h1>
          </div>
        </div>

        {/* Sign In Form */}
        <div 
          className="p-8 shadow-lg"
          style={{ 
            backgroundColor: 'var(--pure-white)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div className="text-center mb-8">
            <div 
              className="mx-auto w-16 h-16 flex items-center justify-center mb-4"
              style={{ 
                backgroundColor: 'var(--primary-extra-light-blue)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <User 
                className="h-8 w-8"
                style={{ color: 'var(--primary-blue)' }}
              />
            </div>
            <h2 
              className="text-3xl font-bold mb-2 font-heading"
              style={{ 
                color: 'var(--primary-blue)',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Welcome Back
            </h2>
            <p 
              className="text-gray-600 font-body"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Sign in to your account to continue shopping
            </p>
          </div>

          {errors.submit && (
            <div 
              className="mb-6 p-4"
              style={{ 
                backgroundColor: '#fee2e2',
                color: 'var(--error-red)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <p className="text-sm font-body">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label 
                htmlFor="email" 
                className="font-body font-medium"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--dark-gray)'
                }}
              >
                Email Address
              </Label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail 
                    className="h-5 w-5"
                    style={{ color: 'var(--medium-gray)' }}
                  />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 font-body"
                  placeholder="Enter your email"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    borderRadius: 'var(--radius-lg)'
                  }}
                />
              </div>
              {errors.email && (
                <p 
                  className="mt-1 text-sm font-body"
                  style={{ color: 'var(--error-red)' }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <Label 
                htmlFor="password" 
                className="font-body font-medium"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--dark-gray)'
                }}
              >
                Password
              </Label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock 
                    className="h-5 w-5"
                    style={{ color: 'var(--medium-gray)' }}
                  />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10 font-body"
                  placeholder="Enter your password"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    borderRadius: 'var(--radius-lg)'
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff 
                      className="h-5 w-5"
                      style={{ color: 'var(--medium-gray)' }}
                    />
                  ) : (
                    <Eye 
                      className="h-5 w-5"
                      style={{ color: 'var(--medium-gray)' }}
                    />
                  )}
                </button>
              </div>
              {errors.password && (
                <p 
                  className="mt-1 text-sm font-body"
                  style={{ color: 'var(--error-red)' }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                />
                <Label 
                  htmlFor="remember-me" 
                  className="text-sm font-body"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--dark-gray)'
                  }}
                >
                  Remember me
                </Label>
              </div>
              <button 
                type="button"
                className="text-sm font-body underline transition-colors"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--primary-blue)'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-dark-blue)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--primary-blue)'}
              >
                Forgot password?
              </button>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || isLoading}
              className="btn-moema btn-moema-primary w-full"
              style={{ 
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                fontFamily: 'var(--font-body)'
              }}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Social Sign In */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div 
                  className="w-full border-t"
                  style={{ borderColor: 'var(--light-gray)' }}
                />
              </div>
              <div className="relative flex justify-center text-sm">
                <span 
                  className="px-2 font-body"
                  style={{ 
                    backgroundColor: 'var(--pure-white)',
                    color: 'var(--medium-gray)',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 shadow-sm text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 transition-colors"
                style={{ 
                  borderRadius: 'var(--radius-lg)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 shadow-sm text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 transition-colors"
                style={{ 
                  borderRadius: 'var(--radius-lg)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                <span className="ml-2">Twitter</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p 
              className="text-sm font-body"
              style={{ 
                fontFamily: 'var(--font-body)',
                color: 'var(--medium-gray)'
              }}
            >
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToCreateAccount}
                className="font-medium underline transition-colors"
                style={{ 
                  color: 'var(--primary-blue)',
                  fontFamily: 'var(--font-body)'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-dark-blue)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--primary-blue)'}
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}