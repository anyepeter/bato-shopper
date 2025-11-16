import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

// Social Media Icons as SVG components
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

interface CreateAccountPageProps {
  onNavigateBack: () => void;
  onCreateAccount: (userData: any) => Promise<void>;
  onNavigateToSignIn: () => void;
  isLoading?: boolean;
}

export function CreateAccountPage({ 
  onNavigateBack, 
  onCreateAccount, 
  onNavigateToSignIn,
  isLoading = false 
}: CreateAccountPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    city: '',
    newsletter: false,
    terms: false,
    marketing: false,
    accountType: 'customer'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      }
    }

    if (step === 1) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 2) {
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      }
      if (!formData.gender) {
        newErrors.gender = 'Please select your gender';
      }
      if (!formData.country) {
        newErrors.country = 'Country is required';
      }
      if (!formData.terms) {
        newErrors.terms = 'You must accept the Terms of Service';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setIsSubmitting(true);
    try {
      await onCreateAccount({
        ...formData,
        accountType: 'customer'
      });
    } catch (error) {
      setErrors({ submit: 'Failed to create account. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSocialLogin = async (provider: string) => {
    console.log(`Initiating ${provider} login...`);
    // In a real implementation, this would:
    // 1. Redirect to OAuth provider
    // 2. Handle OAuth callback
    // 3. Create/link account with social provider
    // 4. Log user in
    alert(`${provider} login will be implemented with OAuth integration`);
  };

  const countries = [
    'United States', 
    'Canada', 
    'United Kingdom', 
    'Nigeria', 
    'Ghana', 
    'Kenya', 
    'South Africa', 
    'Other'
  ];

  const genders = [
    'Female',
    'Male', 
    'Non-binary',
    'Prefer not to say'
  ];

  // Mobile TikTok-style layout
  if (isMobile) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white',
        fontFamily: 'Abel, sans-serif',
        padding: '1rem'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          paddingTop: '1rem'
        }}>
          <button 
            onClick={currentStep === 0 ? onNavigateBack : handleBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: '#5825efff',
              fontFamily: 'Abel, sans-serif',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#5825efff',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingBag size={20} color="white" />
            </div>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700',
              fontFamily: 'Ubuntu, sans-serif'
            }}>
              BATO
            </span>
          </div>
        </div>

        {/* Progress Indicators */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '0.5rem', 
          marginBottom: '2rem' 
        }}>
          {[0, 1, 2].map((step) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Abel, sans-serif',
                backgroundColor: step <= currentStep ? '#5825efff' : '#333',
                color: step <= currentStep ? 'white' : '#666'
              }}>
                {step + 1}
              </div>
              {step < 2 && (
                <div style={{
                  width: '24px',
                  height: '2px',
                  backgroundColor: step < currentStep ? '#5825efff' : '#333',
                  marginLeft: '8px',
                  marginRight: '8px'
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          border: '1px solid #333'
        }}>
          {/* Step 0: Basic Info */}
          {currentStep === 0 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600',
                  fontFamily: 'Ubuntu, sans-serif',
                  color: '#5825efff',
                  marginBottom: '0.5rem'
                }}>
                  Join Bato
                </h2>
                <p style={{ 
                  color: '#a1a1aa', 
                  fontSize: '14px',
                  fontFamily: 'Abel, sans-serif'
                }}>
                  Start your African fashion journey today
                </p>
              </div>

              {/* Social Login Buttons - Mobile */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <button
                    onClick={() => handleSocialLogin('Google')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid #333',
                      borderRadius: '3px',
                      fontFamily: 'Abel, sans-serif',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1a1a1a',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <GoogleIcon />
                    Google
                  </button>

                  <button
                    onClick={() => handleSocialLogin('Facebook')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: '#1877F2',
                      border: '1px solid #1877F2',
                      borderRadius: '3px',
                      fontFamily: 'Abel, sans-serif',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#166FE5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1877F2';
                    }}
                  >
                    <FacebookIcon />
                    Facebook
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleSocialLogin('LinkedIn')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: '#0A66C2',
                      border: '1px solid #0A66C2',
                      borderRadius: '3px',
                      fontFamily: 'Abel, sans-serif',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#095196';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#0A66C2';
                    }}
                  >
                    <LinkedInIcon />
                    LinkedIn
                  </button>

                  <button
                    onClick={() => handleSocialLogin('Apple')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: '#000000',
                      border: '1px solid #000000',
                      borderRadius: '3px',
                      fontFamily: 'Abel, sans-serif',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1a1a1a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#000000';
                    }}
                  >
                    <AppleIcon />
                    Apple
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                marginBottom: '1.5rem' 
              }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }} />
                <span style={{ 
                  color: '#666', 
                  fontFamily: 'Abel, sans-serif', 
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  OR
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    color: 'white', 
                    fontSize: '14px',
                    fontFamily: 'Abel, sans-serif',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#1a1a1a',
                      border: errors.firstName ? '1px solid #ef4444' : '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontFamily: 'Abel, sans-serif',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem' }}>
                      {errors.firstName}
                    </div>
                  )}
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    color: 'white', 
                    fontSize: '14px',
                    fontFamily: 'Abel, sans-serif',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#1a1a1a',
                      border: errors.lastName ? '1px solid #ef4444' : '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontFamily: 'Abel, sans-serif',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem' }}>
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  fontSize: '14px',
                  fontFamily: 'Abel, sans-serif',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1a1a1a',
                    border: errors.email ? '1px solid #ef4444' : '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontFamily: 'Abel, sans-serif',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem' }}>
                    {errors.email}
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  fontSize: '14px',
                  fontFamily: 'Abel, sans-serif',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1a1a1a',
                    border: errors.phone ? '1px solid #ef4444' : '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontFamily: 'Abel, sans-serif',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phone && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem' }}>
                    {errors.phone}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Password */}
          {currentStep === 1 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600',
                  fontFamily: 'Ubuntu, sans-serif',
                  color: '#5825efff',
                  marginBottom: '0.5rem'
                }}>
                  Secure Your Account
                </h2>
                <p style={{ 
                  color: '#a1a1aa', 
                  fontSize: '14px',
                  fontFamily: 'Abel, sans-serif'
                }}>
                  Create a strong password
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  fontSize: '14px',
                  fontFamily: 'Abel, sans-serif',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      paddingRight: '2.5rem',
                      backgroundColor: '#1a1a1a',
                      border: errors.password ? '1px solid #ef4444' : '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontFamily: 'Abel, sans-serif',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem' }}>
                    {errors.password}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  fontSize: '14px',
                  fontFamily: 'Abel, sans-serif',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      paddingRight: '2.5rem',
                      backgroundColor: '#1a1a1a',
                      border: errors.confirmPassword ? '1px solid #ef4444' : '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontFamily: 'Abel, sans-serif',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem' }}>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <div style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <h4 style={{ 
                  color: 'white', 
                  fontFamily: 'Ubuntu, sans-serif',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  fontSize: '14px'
                }}>
                  Password Requirements:
                </h4>
                <ul style={{ 
                  color: '#a1a1aa', 
                  fontFamily: 'Abel, sans-serif', 
                  fontSize: '12px',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Additional Info */}
          {currentStep === 2 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600',
                  fontFamily: 'Ubuntu, sans-serif',
                  color: '#5825efff',
                  marginBottom: '0.5rem'
                }}>
                  Complete Your Profile
                </h2>
                <p style={{ 
                  color: '#a1a1aa', 
                  fontSize: '14px',
                  fontFamily: 'Abel, sans-serif'
                }}>
                  Tell us a bit more about yourself
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  fontSize: '14px',
                  fontFamily: 'Abel, sans-serif',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1a1a1a',
                    border: errors.dateOfBirth ? '1px solid #ef4444' : '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontFamily: 'Abel, sans-serif',
                    fontSize: '14px',
                    outline: 'none',
                    colorScheme: 'dark'
                  }}
                />
                {errors.dateOfBirth && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem' }}>
                    {errors.dateOfBirth}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  fontSize: '14px',
                  fontFamily: 'Abel, sans-serif',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1a1a1a',
                    border: errors.gender ? '1px solid #ef4444' : '1px solid #333',
                    borderRadius: '8px',
                    color: formData.gender ? 'white' : '#666',
                    fontFamily: 'Abel, sans-serif',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="" style={{ color: '#666' }}>Select your gender</option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender.toLowerCase()} style={{ color: 'white', backgroundColor: '#1a1a1a' }}>
                      {gender}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem' }}>
                    {errors.gender}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    color: 'white', 
                    fontSize: '14px',
                    fontFamily: 'Abel, sans-serif',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#1a1a1a',
                      border: errors.country ? '1px solid #ef4444' : '1px solid #333',
                      borderRadius: '8px',
                      color: formData.country ? 'white' : '#666',
                      fontFamily: 'Abel, sans-serif',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="" style={{ color: '#666' }}>Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country.toLowerCase()} style={{ color: 'white', backgroundColor: '#1a1a1a' }}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem' }}>
                      {errors.country}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: 'white', 
                    fontSize: '14px',
                    fontFamily: 'Abel, sans-serif',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontFamily: 'Abel, sans-serif',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="checkbox"
                    id="newsletter-mobile"
                    checked={formData.newsletter}
                    onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                    style={{ 
                      accentColor: '#5825efff',
                      marginTop: '0.15rem',
                      cursor: 'pointer'
                    }}
                  />
                  <label htmlFor="newsletter-mobile" style={{ 
                    color: '#a1a1aa', 
                    fontFamily: 'Abel, sans-serif', 
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    Subscribe to newsletter for exclusive offers
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="checkbox"
                    id="marketing-mobile"
                    checked={formData.marketing}
                    onChange={(e) => handleInputChange('marketing', e.target.checked)}
                    style={{ 
                      accentColor: '#5825efff',
                      marginTop: '0.15rem',
                      cursor: 'pointer'
                    }}
                  />
                  <label htmlFor="marketing-mobile" style={{ 
                    color: '#a1a1aa', 
                    fontFamily: 'Abel, sans-serif', 
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    Receive marketing communications
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="terms-mobile"
                    checked={formData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.checked)}
                    style={{ 
                      accentColor: '#5825efff',
                      marginTop: '0.15rem',
                      cursor: 'pointer'
                    }}
                  />
                  <label htmlFor="terms-mobile" style={{ 
                    color: '#a1a1aa', 
                    fontFamily: 'Abel, sans-serif', 
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>
                {errors.terms && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '0.25rem' }}>
                    {errors.terms}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <button
          onClick={currentStep < 2 ? handleNext : handleSubmit}
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: '#5825efff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontFamily: 'Abel, sans-serif',
            fontSize: '16px',
            fontWeight: '500',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.6 : 1,
            marginBottom: '1rem'
          }}
        >
          {isSubmitting ? 'Creating Account...' : currentStep < 2 ? 'Continue' : 'Create Account'}
        </button>

        {/* Sign In Link */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: '#a1a1aa', fontFamily: 'Abel, sans-serif', fontSize: '14px' }}>
            Already have an account?{' '}
          </span>
          <button
            onClick={onNavigateToSignIn}
            style={{
              color: '#5825efff',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              fontFamily: 'Abel, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        </div>

        {errors.submit && (
          <div style={{ 
            color: '#ef4444', 
            fontSize: '14px', 
            textAlign: 'center',
            marginTop: '1rem' 
          }}>
            {errors.submit}
          </div>
        )}
      </div>
    );
  }

  // Desktop & Tablet layout
  return (
    <div 
      className="min-h-screen flex items-center justify-center py-8 px-6"
      style={{ backgroundColor: '#f0f4f9' }}
    >
      <div 
        className="max-w-2xl w-full p-10"
        style={{ 
          backgroundColor: '#ffffff',
          borderRadius: '3px',
          boxShadow: '0 2px 4px hsla(205, 11%, 83%, 0.9)'
        }}
      >
        <button
          onClick={currentStep === 0 ? onNavigateBack : handleBack}
          className="flex items-center gap-2 mb-6"
          style={{
            color: '#5825efff',
            fontFamily: 'Abel, sans-serif',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        {/* Progress Indicator */}
        <div className="flex justify-center items-center gap-4 mb-8">
          {[0, 1, 2].map((step, index) => (
            <div key={step} className="flex items-center gap-4">
              <div 
                className="flex items-center justify-center"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: step <= currentStep ? '#5825efff' : '#f0f4f9',
                  color: step <= currentStep ? '#ffffff' : '#868686',
                  fontFamily: 'Ubuntu, sans-serif',
                  fontWeight: '600',
                  fontSize: '18px'
                }}
              >
                {step + 1}
              </div>
              {index < 2 && (
                <div 
                  style={{
                    width: '80px',
                    height: '3px',
                    backgroundColor: step < currentStep ? '#5825efff' : '#f0f4f9',
                    borderRadius: '3px'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Basic Info */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 style={{ 
                color: '#5825efff',
                fontFamily: 'Ubuntu, sans-serif',
                marginBottom: '0.5rem'
              }}>
                Join Bato
              </h2>
              <p style={{ 
                fontFamily: 'Abel, sans-serif',
                color: '#868686'
              }}>
                Start your African fashion journey today
              </p>
            </div>

            {/* Social Login Buttons - Desktop/Tablet */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => handleSocialLogin('Google')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    backgroundColor: '#ffffff',
                    border: '0.5px solid hsla(205, 11%, 83%, 0.9)',
                    borderRadius: '3px',
                    fontFamily: 'Abel, sans-serif',
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#000000',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <button
                  onClick={() => handleSocialLogin('Facebook')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    backgroundColor: '#1877F2',
                    border: '1px solid #1877F2',
                    borderRadius: '3px',
                    fontFamily: 'Abel, sans-serif',
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#166FE5';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1877F2';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <FacebookIcon />
                  Continue with Facebook
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  onClick={() => handleSocialLogin('LinkedIn')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    backgroundColor: '#0A66C2',
                    border: '1px solid #0A66C2',
                    borderRadius: '3px',
                    fontFamily: 'Abel, sans-serif',
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#095196';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#0A66C2';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <LinkedInIcon />
                  Continue with LinkedIn
                </button>

                <button
                  onClick={() => handleSocialLogin('Apple')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    backgroundColor: '#000000',
                    border: '1px solid #000000',
                    borderRadius: '3px',
                    fontFamily: 'Abel, sans-serif',
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a1a1a';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <AppleIcon />
                  Continue with Apple
                </button>
              </div>
            </div>

            {/* Divider */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              marginBottom: '2rem' 
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'hsla(205, 11%, 83%, 0.9)' }} />
              <span style={{ 
                color: '#868686', 
                fontFamily: 'Abel, sans-serif', 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                OR
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'hsla(205, 11%, 83%, 0.9)' }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" style={{ fontFamily: 'Abel, sans-serif', fontWeight: '500' }}>
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  style={{ 
                    fontFamily: 'Abel, sans-serif',
                    borderRadius: '3px',
                    marginTop: '0.5rem'
                  }}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm" style={{ color: '#e74c3c', fontFamily: 'Abel, sans-serif' }}>
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName" style={{ fontFamily: 'Abel, sans-serif', fontWeight: '500' }}>
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  style={{ 
                    fontFamily: 'Abel, sans-serif',
                    borderRadius: '3px',
                    marginTop: '0.5rem'
                  }}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm" style={{ color: '#e74c3c', fontFamily: 'Abel, sans-serif' }}>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email" style={{ fontFamily: 'Abel, sans-serif', fontWeight: '500' }}>
                Email Address
              </Label>
              <div className="relative" style={{ marginTop: '0.5rem' }}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5" style={{ color: '#868686' }} />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{ 
                    fontFamily: 'Abel, sans-serif',
                    paddingLeft: '2.5rem',
                    borderRadius: '3px'
                  }}
                  placeholder="john.doe@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm" style={{ color: '#e74c3c', fontFamily: 'Abel, sans-serif' }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" style={{ fontFamily: 'Abel, sans-serif', fontWeight: '500' }}>
                Phone Number
              </Label>
              <div className="relative" style={{ marginTop: '0.5rem' }}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5" style={{ color: '#868686' }} />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={{ 
                    fontFamily: 'Abel, sans-serif',
                    paddingLeft: '2.5rem',
                    borderRadius: '3px'
                  }}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm" style={{ color: '#e74c3c', fontFamily: 'Abel, sans-serif' }}>
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 1: Password */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 style={{ 
                color: '#5825efff',
                fontFamily: 'Ubuntu, sans-serif',
                marginBottom: '0.5rem'
              }}>
                Secure Your Account
              </h2>
              <p style={{ 
                fontFamily: 'Abel, sans-serif',
                color: '#868686'
              }}>
                Create a strong password to protect your account
              </p>
            </div>

            <div>
              <Label htmlFor="password" style={{ fontFamily: 'Abel, sans-serif', fontWeight: '500' }}>
                Password
              </Label>
              <div className="relative" style={{ marginTop: '0.5rem' }}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: '#868686' }} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  style={{ 
                    fontFamily: 'Abel, sans-serif',
                    paddingLeft: '2.5rem',
                    paddingRight: '2.5rem',
                    borderRadius: '3px'
                  }}
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" style={{ color: '#868686' }} />
                  ) : (
                    <Eye className="h-5 w-5" style={{ color: '#868686' }} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm" style={{ color: '#e74c3c', fontFamily: 'Abel, sans-serif' }}>
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" style={{ fontFamily: 'Abel, sans-serif', fontWeight: '500' }}>
                Confirm Password
              </Label>
              <div className="relative" style={{ marginTop: '0.5rem' }}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: '#868686' }} />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  style={{ 
                    fontFamily: 'Abel, sans-serif',
                    paddingLeft: '2.5rem',
                    paddingRight: '2.5rem',
                    borderRadius: '3px'
                  }}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" style={{ color: '#868686' }} />
                  ) : (
                    <Eye className="h-5 w-5" style={{ color: '#868686' }} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm" style={{ color: '#e74c3c', fontFamily: 'Abel, sans-serif' }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div 
              className="p-4"
              style={{ 
                backgroundColor: 'rgba(88, 37, 239, 0.1)',
                borderRadius: '3px'
              }}
            >
              <h4 style={{ 
                color: '#5825efff', 
                fontFamily: 'Ubuntu, sans-serif',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Password Requirements:
              </h4>
              <ul className="text-sm space-y-1" style={{ color: '#848584', fontFamily: 'Abel, sans-serif' }}>
                <li>• At least 8 characters long</li>
                <li>• Contains uppercase and lowercase letters</li>
                <li>• Contains at least one number</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: Additional Info */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 style={{ 
                color: '#5825efff',
                fontFamily: 'Ubuntu, sans-serif',
                marginBottom: '0.5rem'
              }}>
                Almost Done!
              </h2>
              <p style={{ 
                fontFamily: 'Abel, sans-serif',
                color: '#868686'
              }}>
                Tell us a bit more about yourself
              </p>
            </div>

            <div>
              <Label htmlFor="dateOfBirth" style={{ fontFamily: 'Abel, sans-serif', fontWeight: '500' }}>
                Date of Birth
              </Label>
              <div className="relative" style={{ marginTop: '0.5rem' }}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5" style={{ color: '#868686' }} />
                </div>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  style={{ 
                    fontFamily: 'Abel, sans-serif',
                    paddingLeft: '2.5rem',
                    borderRadius: '3px'
                  }}
                />
              </div>
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm" style={{ color: '#e74c3c', fontFamily: 'Abel, sans-serif' }}>
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="gender" style={{ fontFamily: 'Abel, sans-serif', fontWeight: '500' }}>
                Gender
              </Label>
              <div style={{ marginTop: '0.5rem' }}>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  style={{ 
                    fontFamily: 'Abel, sans-serif',
                    borderRadius: '3px',
                    borderColor: errors.gender ? '#e74c3c' : '#d1d5db',
                    color: formData.gender ? '#000' : '#868686',
                    backgroundColor: '#fff'
                  }}
                >
                  <option value="">Select your gender</option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender.toLowerCase()}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm" style={{ color: '#e74c3c', fontFamily: 'Abel, sans-serif' }}>
                  {errors.gender}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country" style={{ fontFamily: 'Abel, sans-serif', fontWeight: '500' }}>
                  Country
                </Label>
                <div style={{ marginTop: '0.5rem' }}>
                  <select
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    style={{ 
                      fontFamily: 'Abel, sans-serif',
                      borderRadius: '3px',
                      borderColor: errors.country ? '#e74c3c' : '#d1d5db',
                      color: formData.country ? '#000' : '#868686',
                      backgroundColor: '#fff'
                    }}
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country} value={country.toLowerCase()}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && (
                  <p className="mt-1 text-sm" style={{ color: '#e74c3c', fontFamily: 'Abel, sans-serif' }}>
                    {errors.country}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="city" style={{ fontFamily: 'Abel, sans-serif', fontWeight: '500' }}>
                  City (Optional)
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  style={{ 
                    fontFamily: 'Abel, sans-serif',
                    borderRadius: '3px',
                    marginTop: '0.5rem'
                  }}
                  placeholder="Enter your city"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="newsletter"
                  checked={formData.newsletter}
                  onCheckedChange={(checked) => handleInputChange('newsletter', !!checked)}
                />
                <Label htmlFor="newsletter" className="text-sm" style={{ fontFamily: 'Abel, sans-serif' }}>
                  Subscribe to our newsletter for exclusive offers
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="marketing"
                  checked={formData.marketing}
                  onCheckedChange={(checked) => handleInputChange('marketing', !!checked)}
                />
                <Label htmlFor="marketing" className="text-sm" style={{ fontFamily: 'Abel, sans-serif' }}>
                  Receive marketing communications via SMS and email
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.terms}
                  onCheckedChange={(checked) => handleInputChange('terms', !!checked)}
                />
                <Label htmlFor="terms" className="text-sm" style={{ fontFamily: 'Abel, sans-serif' }}>
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>
              {errors.terms && (
                <p className="mt-1 text-sm" style={{ color: '#e74c3c', fontFamily: 'Abel, sans-serif' }}>
                  {errors.terms}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {currentStep < 2 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="w-full"
              style={{
                backgroundColor: '#5825efff',
                color: '#ffffff',
                fontFamily: 'Abel, sans-serif',
                borderRadius: '3px',
                padding: '0.75rem 2rem',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
              style={{
                backgroundColor: '#5825efff',
                color: '#ffffff',
                fontFamily: 'Abel, sans-serif',
                borderRadius: '3px',
                padding: '0.75rem 2rem',
                fontSize: '16px',
                fontWeight: '500',
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          )}
        </div>

        <div className="text-center mt-6">
          <p style={{ fontFamily: 'Abel, sans-serif', color: '#868686' }}>
            Already have an account?{' '}
            <button
              onClick={onNavigateToSignIn}
              style={{
                color: '#5825efff',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                fontFamily: 'Abel, sans-serif',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Sign In
            </button>
          </p>
        </div>

        {errors.submit && (
          <p className="text-center mt-4" style={{ color: '#e74c3c', fontFamily: 'Abel, sans-serif' }}>
            {errors.submit}
          </p>
        )}
      </div>
    </div>
  );
}
