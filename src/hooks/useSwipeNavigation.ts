import { useState, useCallback, useRef } from 'react';

interface SwipeConfig {
  minSwipeDistance?: number;
  maxVerticalDistance?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface TouchData {
  startX: number;
  startY: number;
  startTime: number;
}

export const useSwipeNavigation = (config: SwipeConfig) => {
  const {
    minSwipeDistance = 50,
    maxVerticalDistance = 100,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  } = config;

  const touchDataRef = useRef<TouchData | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchDataRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now()
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchDataRef.current || isTransitioning) return;

    const touch = e.changedTouches[0];
    const { startX, startY, startTime } = touchDataRef.current;
    
    const deltaX = startX - touch.clientX;
    const deltaY = startY - touch.clientY;
    const deltaTime = Date.now() - startTime;
    
    // Ignore very quick taps
    if (deltaTime < 100) return;
    
    // Calculate velocities
    const velocityX = Math.abs(deltaX) / deltaTime;
    const velocityY = Math.abs(deltaY) / deltaTime;
    
    // Determine swipe direction
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX);
    
    if (isHorizontalSwipe && Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < maxVerticalDistance) {
      // Horizontal swipe
      setIsTransitioning(true);
      
      if (deltaX > 0) {
        // Swipe left
        onSwipeLeft?.();
      } else {
        // Swipe right
        onSwipeRight?.();
      }
      
      // Reset transition state after animation
      setTimeout(() => setIsTransitioning(false), 300);
      
    } else if (isVerticalSwipe && Math.abs(deltaY) > minSwipeDistance) {
      // Vertical swipe
      if (deltaY > 0) {
        // Swipe up
        onSwipeUp?.();
      } else {
        // Swipe down
        onSwipeDown?.();
      }
    }
    
    touchDataRef.current = null;
  }, [minSwipeDistance, maxVerticalDistance, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, isTransitioning]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Optional: Add visual feedback during swipe
    if (!touchDataRef.current) return;
    
    const touch = e.touches[0];
    const { startX, startY } = touchDataRef.current;
    const deltaX = startX - touch.clientX;
    const deltaY = startY - touch.clientY;
    
    // Prevent default if it's a horizontal swipe to avoid scrolling
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
  }, []);

  return {
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    isTransitioning
  };
};

// Social media-style haptic feedback (if available)
export const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(25);
        break;
      case 'heavy':
        navigator.vibrate(50);
        break;
    }
  }
};

// Enhanced touch animation utility
export const createTouchAnimation = (element: HTMLElement, type: 'bounce' | 'pulse' | 'scale' = 'scale') => {
  const animations = {
    bounce: [
      { transform: 'scale(1) translateY(0)' },
      { transform: 'scale(1.02) translateY(-2px)' },
      { transform: 'scale(0.98) translateY(1px)' },
      { transform: 'scale(1) translateY(0)' }
    ],
    pulse: [
      { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(88, 37, 239, 0.4)' },
      { transform: 'scale(1.05)', boxShadow: '0 0 0 8px rgba(88, 37, 239, 0.1)' },
      { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(88, 37, 239, 0)' }
    ],
    scale: [
      { transform: 'scale(1)' },
      { transform: 'scale(0.95)' },
      { transform: 'scale(1.02)' },
      { transform: 'scale(1)' }
    ]
  };

  return element.animate(animations[type], {
    duration: 300,
    easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)'
  });
};