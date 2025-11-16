import { ReactNode } from 'react';

interface MobilePageContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  backgroundColor?: string;
  isMobile?: boolean;
}

/**
 * MobilePageContainer - Ensures consistent bottom spacing above mobile navigation
 * 
 * This component automatically applies the correct bottom padding to prevent content
 * from being hidden behind the mobile bottom navigation bar, with -8px clearance (8px overlap).
 * 
 * @param children - The page content to render
 * @param className - Additional CSS classes
 * @param style - Additional inline styles
 * @param backgroundColor - Background color (defaults to #000000 for Bato design)
 * @param isMobile - Whether mobile layout is active (auto-detected if not provided)
 */
export function MobilePageContainer({ 
  children, 
  className = '', 
  style = {}, 
  backgroundColor = '#000000',
  isMobile 
}: MobilePageContainerProps) {
  
  // Auto-detect mobile if not explicitly provided
  const isCurrentlyMobile = isMobile ?? (typeof window !== 'undefined' && window.innerWidth < 768);
  
  return (
    <div 
      className={`min-h-screen ${className}`}
      style={{
        backgroundColor,
        fontFamily: 'var(--font-body)',
        paddingBottom: isCurrentlyMobile ? 'calc(80px - 8px + env(safe-area-inset-bottom))' : '0',
        ...style
      }}
    >
      {children}
    </div>
  );
}

/**
 * MobileContentWrapper - Wrapper for page content with proper spacing
 * 
 * Use this for wrapping just the content area instead of the entire page.
 * Useful when you need custom page background or structure.
 */
export function MobileContentWrapper({ 
  children, 
  className = '', 
  style = {},
  isMobile 
}: Omit<MobilePageContainerProps, 'backgroundColor'>) {
  
  const isCurrentlyMobile = isMobile ?? (typeof window !== 'undefined' && window.innerWidth < 768);
  
  return (
    <div 
      className={`mobile-page-spacing-content ${className}`}
      style={{
        paddingBottom: isCurrentlyMobile ? 'calc(80px - 8px + env(safe-area-inset-bottom))' : '0',
        marginBottom: 0,
        ...style
      }}
    >
      {children}
    </div>
  );
}

/**
 * Hook to get the correct bottom spacing value
 * 
 * @param isMobile - Whether mobile layout is active
 * @returns The padding-bottom value to apply
 */
export function useMobileBottomSpacing(isMobile?: boolean): string {
  const isCurrentlyMobile = isMobile ?? (typeof window !== 'undefined' && window.innerWidth < 768);
  return isCurrentlyMobile ? 'calc(80px - 8px + env(safe-area-inset-bottom))' : '0';
}

/**
 * Constants for mobile spacing
 */
export const MOBILE_SPACING = {
  BOTTOM_NAV_HEIGHT: '80px',
  CLEARANCE: '-8px',
  SAFE_AREA: 'env(safe-area-inset-bottom)',
  TOTAL: 'calc(80px - 8px + env(safe-area-inset-bottom))',
  
  // For special cases like stream pages
  STREAM_BOTTOM_NAV_HEIGHT: '70px',
  STREAM_TOTAL: 'calc(70px - 8px + env(safe-area-inset-bottom))'
} as const;