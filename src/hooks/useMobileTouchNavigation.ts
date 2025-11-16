import { useEffect, useRef } from 'react';

interface UseMobileTouchNavigationProps {
  isMobile: boolean;
  currentProductIndex: number;
  totalProducts: number;
  onNavigate: (direction: 'up' | 'down') => void;
}

export function useMobileTouchNavigation({
  isMobile,
  currentProductIndex,
  totalProducts,
  onNavigate
}: UseMobileTouchNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  useEffect(() => {
    if (!isMobile || !containerRef.current) return;

    const container = containerRef.current;
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;

      const direction = e.deltaY > 0 ? 'down' : 'up';
      handleProductNavigation(direction);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      const deltaY = touchStartY.current - touchEndY;
      const deltaTime = touchEndTime - touchStartTime.current;
      
      if (Math.abs(deltaY) > 50 && deltaTime < 500) {
        const direction = deltaY > 0 ? 'down' : 'up';
        handleProductNavigation(direction);
      }
    };

    const handleProductNavigation = (direction: 'up' | 'down') => {
      if (isScrolling) return;
      
      isScrolling = true;

      if (direction === 'down' && currentProductIndex < totalProducts - 1) {
        onNavigate('down');
      } else if (direction === 'up' && currentProductIndex > 0) {
        onNavigate('up');
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 800);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(scrollTimeout);
    };
  }, [isMobile, currentProductIndex, totalProducts, onNavigate]);

  return { containerRef };
}