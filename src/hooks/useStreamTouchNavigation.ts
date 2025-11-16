import { useCallback, useRef } from 'react';
import { useApp } from '../components/AppProvider';
import { MOCK_STREAMS } from '../constants/streamingData';

interface TouchStart {
  x: number;
  y: number;
  time: number;
}

export function useStreamTouchNavigation() {
  const { state, actions } = useApp();
  const touchStart = useRef<TouchStart | null>(null);
  const touchEnd = useRef<{ x: number; y: number; time: number } | null>(null);

  const switchToNextStream = useCallback(() => {
    if (!state.currentStream) return;
    
    const currentIndex = MOCK_STREAMS.findIndex(stream => stream.id === state.currentStream.id);
    const nextIndex = (currentIndex + 1) % MOCK_STREAMS.length;
    const nextStream = MOCK_STREAMS[nextIndex];
    
    actions.switchStream(nextStream.id);
  }, [state.currentStream, actions]);

  const switchToPreviousStream = useCallback(() => {
    if (!state.currentStream) return;
    
    const currentIndex = MOCK_STREAMS.findIndex(stream => stream.id === state.currentStream.id);
    const prevIndex = currentIndex === 0 ? MOCK_STREAMS.length - 1 : currentIndex - 1;
    const prevStream = MOCK_STREAMS[prevIndex];
    
    actions.switchStream(prevStream.id);
  }, [state.currentStream, actions]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    touchEnd.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current || !touchEnd.current) return;

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const deltaTime = touchEnd.current.time - touchStart.current.time;
    
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;
    
    // Check if it's a valid swipe gesture
    if (deltaTime > maxSwipeTime) return;
    
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    // Vertical swipes (up/down) for stream navigation
    if (absDeltaY > minSwipeDistance && absDeltaY > absDeltaX) {
      e.preventDefault();
      
      if (deltaY > 0) {
        // Swipe down - previous stream
        switchToPreviousStream();
      } else {
        // Swipe up - next stream
        switchToNextStream();
      }
    }
    
    // Horizontal swipes (left/right) for product overlay
    if (absDeltaX > minSwipeDistance && absDeltaX > absDeltaY) {
      e.preventDefault();
      
      if (deltaX > 0) {
        // Swipe right - hide products
        actions.setIsProductOverlayVisible(false);
      } else {
        // Swipe left - show products
        actions.setIsProductOverlayVisible(true);
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
  }, [switchToNextStream, switchToPreviousStream, actions]);

  const handleDoubleClick = useCallback(() => {
    // Toggle stream like/favorite
    console.log('Double tap - like stream');
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onDoubleClick: handleDoubleClick
  };
}