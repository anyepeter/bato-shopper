// Share API Safety Module
// This module prevents accidental use of the native Web Share API
// which can cause permission errors in certain environments

/**
 * Safely disable the native Web Share API to prevent permission errors
 * This function should be called early in the app initialization
 */
export const disableNativeShareAPI = (): void => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    // Check if navigator.share exists
    if ('share' in navigator) {
      // Check if the property is configurable before trying to redefine it
      const descriptor = Object.getOwnPropertyDescriptor(navigator, 'share');
      
      if (descriptor && descriptor.configurable === false) {
        // Property exists but cannot be redefined, so we'll use a different approach
        console.log('ℹ️ Native Web Share API exists but cannot be modified - will handle errors gracefully');
        return;
      }

      // Store the original share function
      const originalShare = navigator.share;
      
      try {
        // Try to replace navigator.share with a safe fallback
        Object.defineProperty(navigator, 'share', {
          value: async (shareData: any) => {
            // Silently redirect to copy to clipboard instead of throwing errors
            try {
              if (shareData?.url) {
                await navigator.clipboard.writeText(shareData.url);
                console.log('✅ Share redirected to clipboard copy');
                return Promise.resolve();
              }
            } catch (clipboardError) {
              // If clipboard fails, just resolve silently
              console.log('ℹ️ Share attempted - use custom ShareModal for full functionality');
            }
            
            return Promise.resolve();
          },
          writable: true,
          configurable: true
        });

        console.log('✅ Native Web Share API safely redirected to clipboard');
      } catch (defineError) {
        // If we can't redefine the property, that's okay - we'll handle it elsewhere
        console.log('ℹ️ Native Web Share API could not be modified - using error handling approach');
      }
    }
  } catch (error) {
    // Silent handling - don't show this error to users
    console.log('ℹ️ Share safety initialization complete - using custom implementation');
  }
};

/**
 * Check if the app environment supports safe sharing
 */
export const isShareEnvironmentSafe = (): boolean => {
  try {
    // Always return false to force use of custom share modal
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * Safe share function that always uses custom implementation
 */
export const safeShare = async (shareData: {
  title: string;
  text: string;
  url: string;
}): Promise<void> => {
  // Always use clipboard copy instead of native share API
  try {
    await navigator.clipboard.writeText(shareData.url);
    console.log('✅ URL copied to clipboard');
  } catch (error) {
    // Fallback for browsers that don't support clipboard API
    try {
      const textArea = document.createElement('textarea');
      textArea.value = shareData.url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('✅ URL copied using fallback method');
    } catch (fallbackError) {
      console.log('ℹ️ Use custom ShareModal for sharing functionality');
    }
  }
};

/**
 * Wrapper to prevent any accidental native share API usage
 */
export const preventNativeShare = () => {
  // Return a promise that resolves immediately to prevent errors
  return Promise.resolve();
};

/**
 * Check if we should use native share (always returns false for safety)
 */
export const shouldUseNativeShare = (): boolean => {
  return false;
};

/**
 * Initialize share safety measures - optimized asynchronous version
 */
export const initializeShareSafety = (): Promise<void> => {
  return new Promise((resolve) => {
    try {
      // Minimal initialization - just disable native share API
      disableNativeShareAPI();
      
      // Defer heavy operations
      setTimeout(() => {
        try {
          // Add minimal error handling without overriding addEventListener
          if (typeof window !== 'undefined') {
            window.addEventListener('error', (event: any) => {
              if (event.error?.message?.includes('share') || event.error?.name === 'NotAllowedError') {
                event.preventDefault();
                console.log('ℹ️ Share error handled gracefully');
              }
            });
          }
        } catch (error) {
          // Silent handling
        }
      }, 0);
      
      resolve();
    } catch (error) {
      resolve(); // Always resolve to not block app
    }
  });
};

export default {
  disableNativeShareAPI,
  isShareEnvironmentSafe,
  safeShare,
  initializeShareSafety
};