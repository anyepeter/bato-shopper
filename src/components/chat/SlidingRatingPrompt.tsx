import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X } from 'lucide-react';

interface SlidingRatingPromptProps {
  isVisible: boolean;
  currentRating: number;
  onRatingSelect: (rating: number) => void;
  onClose: () => void;
  productName?: string;
}

export const SlidingRatingPrompt: React.FC<SlidingRatingPromptProps> = ({
  isVisible,
  currentRating,
  onRatingSelect,
  onClose,
  productName = 'this product'
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.3
          }}
          className="absolute bottom-full left-0 right-0 z-50"
          style={{ marginBottom: '14px' }}
        >
          {/* Rating Prompt Container - Styled to match input field */}
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-4 mx-0" style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px' }}>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-3 p-1 rounded-full hover:bg-white/20 transition-colors duration-200 text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Rating Prompt Content */}
            <div className="space-y-3 pr-8">
              {/* Header */}
              <div className="text-center">
                <h3 className="font-heading text-sm font-medium text-white">
                  Rate {productName}
                </h3>
                <p className="text-white/60 text-xs font-body">
                  Select your rating before writing your review
                </p>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => onRatingSelect(star)}
                    className="transition-all duration-200 hover:scale-110 active:scale-95 p-1 rounded-full hover:bg-white/10"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= currentRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-transparent text-white/40 hover:text-white/60'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Rating Label */}
              {currentRating > 0 && (
                <div className="text-center">
                  <span className="text-white/70 font-body text-xs">
                    {currentRating === 1 && 'Poor'}
                    {currentRating === 2 && 'Fair'}
                    {currentRating === 3 && 'Good'}
                    {currentRating === 4 && 'Very Good'}
                    {currentRating === 5 && 'Excellent'}
                  </span>
                </div>
              )}

              {/* Selected Rating Display */}
              {currentRating > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center bg-white/10 py-2 px-3 border border-white/10"
                  style={{ borderRadius: '4px' }}
                >
                  <p className="text-white font-body text-xs">
                    ⭐ {currentRating} star{currentRating !== 1 ? 's' : ''} selected
                  </p>
                  <p className="text-white/50 text-xs mt-1">
                    Continue typing below
                  </p>
                </motion.div>
              )}
            </div>

            {/* Connection indicator - visual element to connect to input */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="w-3 h-3 bg-white/10 border-l border-b border-white/20 transform rotate-45"></div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};