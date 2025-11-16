import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Package, Truck, MessageSquare, Send, CheckCircle, Heart, ThumbsUp, Clock, Shield } from 'lucide-react';

interface RateExperiencePageProps {
  onNavigateBack: () => void;
  trackingNumber?: string;
  orderNumber?: string;
  deliveryCompany?: string;
}

interface RatingCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  rating: number;
}

interface FeedbackSubmission {
  overallRating: number;
  categories: RatingCategory[];
  comment: string;
  wouldRecommend: boolean;
}

export function RateExperiencePage({ 
  onNavigateBack, 
  trackingNumber = "CMR123456789",
  orderNumber = `BAT${Date.now().toString().slice(-6)}`,
  deliveryCompany = "Nexus Express"
}: RateExperiencePageProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const [comment, setComment] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  
  const [categories, setCategories] = useState<RatingCategory[]>([
    {
      id: 'delivery-time',
      label: 'Delivery Time',
      icon: <Clock className="w-4 h-4" />,
      rating: 0
    },
    {
      id: 'package-condition',
      label: 'Package Condition',
      icon: <Package className="w-4 h-4" />,
      rating: 0
    },
    {
      id: 'driver-service',
      label: 'Driver Service',
      icon: <Truck className="w-4 h-4" />,
      rating: 0
    },
    {
      id: 'tracking-accuracy',
      label: 'Tracking Accuracy',
      icon: <Shield className="w-4 h-4" />,
      rating: 0
    }
  ]);

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOverallRating = useCallback((rating: number) => {
    setOverallRating(rating);
  }, []);

  const handleCategoryRating = useCallback((categoryId: string, rating: number) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId ? { ...cat, rating } : cat
      )
    );
  }, []);

  const handleSubmitFeedback = useCallback(async () => {
    if (overallRating === 0) return;

    setIsSubmitting(true);

    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    const feedbackData: FeedbackSubmission = {
      overallRating,
      categories,
      comment,
      wouldRecommend: wouldRecommend ?? false
    };

    console.log('Feedback submitted:', feedbackData);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  }, [overallRating, categories, comment, wouldRecommend]);

  const renderStarRating = (rating: number, onRate: (rating: number) => void, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(star)}
            className={`${starSize} transition-colors`}
            style={{
              color: star <= rating ? '#fbbf24' : '#374151'
            }}
          >
            <Star 
              className={`${starSize}`}
              fill={star <= rating ? '#fbbf24' : 'none'}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5: return 'Excellent';
      case 4: return 'Good';
      case 3: return 'Average';
      case 2: return 'Poor';
      case 1: return 'Very Poor';
      default: return 'Not Rated';
    }
  };

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 5: return '#10b981';
      case 4: return '#059669';
      case 3: return '#eab308';
      case 2: return '#f59e0b';
      case 1: return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: '#10b981' }}
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h1 
              className="text-3xl font-bold font-heading mb-4"
              style={{ color: '#885cf8' }}
            >
              Thank You!
            </h1>
            <p className="text-gray-400 font-body mb-6">
              Your feedback has been submitted successfully. We appreciate your time and will use your input to improve our services.
            </p>
            
            <div 
              className="p-4 rounded-xl mb-6"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a'
              }}
            >
              <p className="text-sm text-gray-400 font-body mb-2">Your Rating</p>
              <div className="flex items-center justify-center gap-2">
                {renderStarRating(overallRating, () => {}, 'lg')}
                <span 
                  className="ml-2 font-medium font-heading"
                  style={{ color: getRatingColor(overallRating) }}
                >
                  {getRatingText(overallRating)}
                </span>
              </div>
            </div>

            <button 
              onClick={onNavigateBack}
              className="w-full py-3 rounded-xl font-medium font-body transition-all"
              style={{
                backgroundColor: '#5825ef',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.backgroundColor = '#4040f8';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.backgroundColor = '#5825ef';
              }}
            >
              Back to Tracking
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto">
      {/* Header */}
      <div 
        className="sticky top-0 z-50 px-4 py-3"
        style={{
          backgroundColor: '#1a1a1a',
          borderBottom: '1px solid #2a2a2a'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateBack}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div>
              <h1 className="text-lg font-bold font-heading">Rate Experience</h1>
              <p className="text-sm text-gray-400 font-body">Share your delivery feedback</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Order Info */}
        <motion.div 
          className="p-4 rounded-2xl"
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: isMobile ? '16px' : '12px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-body">Order #{orderNumber}</p>
              <p className="text-white font-heading font-medium">{deliveryCompany}</p>
              <p className="text-xs text-gray-500 font-body">Tracking: {trackingNumber}</p>
            </div>
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #5825ef, #885cf8)' }}
            >
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Overall Rating */}
        <motion.div 
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: isMobile ? '16px' : '12px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="font-bold text-white mb-4 font-heading">⭐ Overall Experience</h3>
          <div className="text-center">
            <p className="text-gray-400 font-body mb-4">How would you rate your delivery experience?</p>
            <div className="flex justify-center mb-4">
              {renderStarRating(overallRating, handleOverallRating, 'lg')}
            </div>
            {overallRating > 0 && (
              <p 
                className="font-medium font-heading"
                style={{ color: getRatingColor(overallRating) }}
              >
                {getRatingText(overallRating)}
              </p>
            )}
          </div>
        </motion.div>

        {/* Category Ratings */}
        <motion.div 
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: isMobile ? '16px' : '12px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="font-bold text-white mb-4 font-heading">📊 Detailed Ratings</h3>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#2a2a2a' }}
                  >
                    {category.icon}
                  </div>
                  <span className="text-white font-body">{category.label}</span>
                </div>
                {renderStarRating(category.rating, (rating) => handleCategoryRating(category.id, rating))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendation */}
        <motion.div 
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: isMobile ? '16px' : '12px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="font-bold text-white mb-4 font-heading">👍 Recommendation</h3>
          <p className="text-gray-400 font-body mb-4">Would you recommend {deliveryCompany} to others?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setWouldRecommend(true)}
              className="flex-1 p-4 rounded-xl font-body transition-all"
              style={{
                backgroundColor: wouldRecommend === true ? '#10b981' : 'transparent',
                border: '1px solid #2a2a2a',
                color: wouldRecommend === true ? 'white' : '#9ca3af'
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <ThumbsUp className="w-5 h-5" />
                Yes, I would
              </div>
            </button>
            <button
              onClick={() => setWouldRecommend(false)}
              className="flex-1 p-4 rounded-xl font-body transition-all"
              style={{
                backgroundColor: wouldRecommend === false ? '#ef4444' : 'transparent',
                border: '1px solid #2a2a2a',
                color: wouldRecommend === false ? 'white' : '#9ca3af'
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                No, I wouldn't
              </div>
            </button>
          </div>
        </motion.div>

        {/* Comments */}
        <motion.div 
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: isMobile ? '16px' : '12px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="font-bold text-white mb-4 font-heading">💬 Additional Comments</h3>
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience... (optional)"
              className="w-full p-4 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 font-body resize-none"
              style={{
                borderRadius: isMobile ? '12px' : '8px',
                outline: 'none',
                minHeight: '120px'
              }}
              onFocus={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.borderColor = '#5825ef';
              }}
              onBlur={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.borderColor = '#374151';
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500 font-body">
                {comment.length}/500 characters
              </span>
              <MessageSquare className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <button 
            onClick={handleSubmitFeedback}
            disabled={overallRating === 0 || isSubmitting}
            className="w-full p-4 rounded-xl font-medium font-body transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: overallRating > 0 ? '#5825ef' : '#2a2a2a',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              if (!target.disabled) {
                target.style.backgroundColor = '#4040f8';
              }
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              if (!target.disabled) {
                target.style.backgroundColor = overallRating > 0 ? '#5825ef' : '#2a2a2a';
              }
            }}
          >
            <div className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <div 
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Feedback
                </>
              )}
            </div>
          </button>
        </motion.div>

        {/* Help Text */}
        <motion.div 
          className="p-4 rounded-2xl"
          style={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-sm text-gray-400 font-body text-center">
            Your feedback helps us improve our delivery service and ensures better experiences for all customers.
          </p>
        </motion.div>
      </div>
    </div>
  );
}