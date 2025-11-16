import { useEffect } from 'react';
import { useApp } from '../components/AppProvider';

/**
 * Optimized Bootstrap Icons loading hook
 */
export function useBootstrapIcons() {
  const { actions } = useApp();

  useEffect(() => {
    // Check if already loaded
    const existingLink = document.querySelector('link[href*="bootstrap-icons"]');
    if (existingLink || document.body.classList.contains('bootstrap-icons-loaded')) {
      actions.setIsBootstrapIconsLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css';
    link.crossOrigin = 'anonymous';
    
    const handleLoad = () => {
      actions.setIsBootstrapIconsLoaded(true);
      document.body.classList.add('bootstrap-icons-loaded');
    };
    
    const handleError = () => {
      console.warn('⚠️ Bootstrap Icons failed to load, using fallback');
      actions.setIsBootstrapIconsLoaded(true);
    };
    
    link.addEventListener('load', handleLoad, { once: true });
    link.addEventListener('error', handleError, { once: true });
    document.head.appendChild(link);

    // Fallback timeout (reduced from 1000ms to 500ms)
    const fallbackTimer = setTimeout(() => {
      if (!document.body.classList.contains('bootstrap-icons-loaded')) {
        actions.setIsBootstrapIconsLoaded(true);
      }
    }, 500);

    return () => {
      clearTimeout(fallbackTimer);
      if (document.head.contains(link)) {
        link.removeEventListener('load', handleLoad);
        link.removeEventListener('error', handleError);
        document.head.removeChild(link);
      }
    };
  }, [actions]);
}