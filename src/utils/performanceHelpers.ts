/**
 * Performance optimization utilities
 */

/**
 * Debounce function for optimizing frequent events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * Throttle function for limiting function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Lazy loading utility for images
 */
export function lazyLoadImage(img: HTMLImageElement, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = src;
            img.onload = () => {
              observer.disconnect();
              resolve();
            };
            img.onerror = () => {
              observer.disconnect();
              reject(new Error('Failed to load image'));
            };
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(img);
  });
}

/**
 * Memory cleanup utility
 */
export function cleanupEventListeners(
  element: Element | Window,
  events: Array<{ type: string; listener: EventListener }>
): void {
  events.forEach(({ type, listener }) => {
    element.removeEventListener(type, listener);
  });
}

/**
 * RAF-based smooth animations
 */
export function animateValue(
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void
): void {
  const startTime = performance.now();
  
  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out cubic function
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const value = start + (end - start) * easeOut;
    
    callback(value);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  requestAnimationFrame(animate);
}

/**
 * Component performance monitoring
 */
export function measureComponentRender(componentName: string) {
  if (process.env.NODE_ENV === 'development') {
    performance.mark(`${componentName}-start`);
    
    return () => {
      performance.mark(`${componentName}-end`);
      performance.measure(
        `${componentName}-render`,
        `${componentName}-start`,
        `${componentName}-end`
      );
      
      const measure = performance.getEntriesByName(`${componentName}-render`)[0];
      if (measure.duration > 16) { // 60fps threshold
        console.warn(`${componentName} render took ${measure.duration.toFixed(2)}ms`);
      }
    };
  }
  
  return () => {}; // No-op in production
}