import React, { useState, useRef, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Smile, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { SlidingRatingPrompt } from './SlidingRatingPrompt';

interface EnhancedReviewInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onEmojiClick: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  productName?: string;
  isMobile?: boolean;
  hasSelectedRating?: boolean;
  preSubmissionRating?: number;
  onRatingSelect?: (rating: number) => void;
  showEmojiPicker?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onFocus?: () => void;
  onBlur?: () => void;
  onRatingPromptShow?: () => void;
  onEmojiToggle?: () => void;
  onEmojiModeToggle?: () => void;
  emojiPickerMode?: 'quick' | 'full';
}

export const EnhancedReviewInput = forwardRef<HTMLInputElement, EnhancedReviewInputProps>(({
  value,
  onChange,
  onSend,
  onEmojiClick,
  onKeyPress,
  placeholder = "Share your thoughts...",
  productName,
  isMobile = false,
  hasSelectedRating = false,
  preSubmissionRating = 5,
  onRatingSelect,
  showEmojiPicker = false,
  className,
  style,
  onFocus,
  onBlur,
  onRatingPromptShow
}, ref) => {
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);
    if (onFocus) {
      onFocus();
    }
    if (!hasSelectedRating && isMobile && onRatingSelect) {
      setShowRatingPrompt(true);
    }
    if (onRatingPromptShow) {
      onRatingPromptShow();
    }
  }, [hasSelectedRating, isMobile, onRatingSelect, onFocus, onRatingPromptShow]);

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false);
    if (onBlur) {
      onBlur();
    }
    // Keep prompt open to allow rating selection
  }, [onBlur]);

  const handleRatingSelect = useCallback((rating: number) => {
    if (onRatingSelect) {
      onRatingSelect(rating);
    }
    setShowRatingPrompt(false);
    // Focus back on input after rating selection
    setTimeout(() => {
      if (ref && 'current' in ref) {
        ref.current?.focus();
      }
    }, 100);
  }, [onRatingSelect, ref]);

  const handleClosePrompt = useCallback(() => {
    setShowRatingPrompt(false);
  }, []);

  return (
    <div className="relative">
      {/* ⭐ NEW: Sliding Rating Prompt for Mobile */}
      <SlidingRatingPrompt
        isVisible={showRatingPrompt}
        currentRating={preSubmissionRating}
        onRatingSelect={handleRatingSelect}
        onClose={handleClosePrompt}
        productName={productName}
      />

      {/* Review Input Container */}
      <div className={`flex items-center gap-2 p-3 bg-white border-t ${
        isMobile 
          ? 'border-gray-200' 
          : 'border-gray-200 rounded-lg'
      } ${showRatingPrompt ? 'mt-2' : ''}`}>
        
        {/* Rating Indicator (Mobile) */}
        {isMobile && hasSelectedRating && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-lg mr-2"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-purple-700">
              {preSubmissionRating}
            </span>
          </motion.div>
        )}

        {/* Input Field */}
        <div className="flex-1 relative">
          <Input
            ref={ref}
            type="text"
            placeholder={hasSelectedRating ? "Now tell us more..." : placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className={`pr-10 border-0 bg-gray-50 focus:bg-white transition-colors duration-200 ${
              isMobile ? 'rounded-lg text-base' : 'rounded-md'
            } ${hasSelectedRating ? 'border-purple-200' : ''} ${className || ''}`}
            style={{ 
              fontSize: isMobile ? '16px' : '14px', // Prevent zoom on iOS
              ...style 
            }}
          />
          
          {/* Input Focus Animation */}
          {isInputFocused && (
            <motion.div
              layoutId="input-focus"
              className="absolute inset-0 border-2 border-purple-400 rounded-lg pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </div>

        {/* Emoji Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEmojiClick}
          className={`p-2 hover:bg-gray-100 ${showEmojiPicker ? 'bg-gray-100' : ''}`}
        >
          <Smile className="w-5 h-5 text-gray-500" />
        </Button>

        {/* Send Button */}
        <Button
          type="button"
          size="sm"
          onClick={onSend}
          disabled={!value.trim()}
          className={`p-2 ${
            value.trim()
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          } transition-all duration-200`}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* Rating Success Message */}
      <AnimatePresence>
        {hasSelectedRating && !showRatingPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-8 left-0 right-0 text-center"
          >
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>Rated {preSubmissionRating} stars</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

EnhancedReviewInput.displayName = 'EnhancedReviewInput';