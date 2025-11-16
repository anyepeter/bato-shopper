import React, { useMemo, useEffect } from 'react';
import { BootstrapIcon } from '../BootstrapIcon';
import { useApp } from '../AppProvider';

interface MobileBottomNavigationProps {
  cartItemsCount: number;
  favoriteItemsCount: number;
  currentUser: any;
  onNavigateToPage: (page: string) => void;
  onCartClick: () => void;
  onFavoritesClick: () => void;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  cartItemsCount,
  favoriteItemsCount,
  currentUser,
  onNavigateToPage,
  onCartClick,
  onFavoritesClick,
}) => {
  const { state } = useApp();
  const currentPage = state?.currentPage || 'home';
  
  // Component mount logging (minimal)
  React.useEffect(() => {
    console.log('🔥 MobileBottomNavigation mounted');
  }, []);
  
  // Debug logging
  console.log('🔥 MobileBottomNavigation rendered:', {
    currentPage,
    cartItemsCount,
    favoriteItemsCount,
    isMobile: state?.isMobile,
    isModalOpen: state?.isModalOpen,
    isChatOpen: state?.isChatOpen || state?.isAdminChatOpen
  });

  // Define navigation items
  const navigationItems = useMemo(() => [
    {
      id: 'home',
      label: 'Home',
      icon: 'house-fill',
      iconInactive: 'house',
      page: 'home',
      action: () => onNavigateToPage('home'),
      isActive: currentPage === 'home',
    },
    {
      id: 'live-streams',
      label: 'Live Streams',
      icon: 'play-circle-fill',
      iconInactive: 'play-circle',
      page: 'live-streams',
      action: () => onNavigateToPage('live-streams'),
      isActive: ['live-streams', 'stream-viewer', 'watch-live-stream'].includes(currentPage),
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: 'box-fill',
      iconInactive: 'box',
      page: 'orders',
      action: () => onNavigateToPage('orders'),
      isActive: ['orders', 'package-tracking'].includes(currentPage),
    },
    {
      id: 'shop-categories',
      label: 'Shop',
      icon: 'grid-fill',
      iconInactive: 'grid',
      page: 'shop-categories',
      action: () => onNavigateToPage('shop-categories'),

      isActive: currentPage === 'shop-categories',
    },
    {
      id: 'profile',
      label: 'Account',
      icon: 'person-fill',
      iconInactive: 'person',
      page: 'buyer-profile',
      action: () => {
        if (currentUser) {
          onNavigateToPage('buyer-profile');
        } else {
          onNavigateToPage('sign-in');
        }
      },
      isActive: currentPage === 'buyer-profile' || currentPage === 'user-profile' || currentPage === 'sign-in' || currentPage === 'create-account',
    },
  ], [currentPage, cartItemsCount, favoriteItemsCount, currentUser, onNavigateToPage, onCartClick, onFavoritesClick]);

  // Get additional state for conditional rendering
  const isModalOpen = state?.isModalOpen;
  const isChatOpen = state?.isChatOpen || state?.isAdminChatOpen;

  return (
    <div 
      className={`mobile-bottom-nav force-navigation-zero-radius ${isModalOpen ? 'modal-open' : ''} ${isChatOpen ? 'chat-open' : ''}`}
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9998, // Match header z-index
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        backgroundColor: '#000000', // Match header solid black background
        borderTop: '1px solid rgba(255, 255, 255, 0.1)', // Match header border
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)', // Inverted header shadow
        padding: `8px 0 calc(8px + env(safe-area-inset-bottom))`, // Safe area padding
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '0px', // 🔥 CRITICAL: Force 0px border-radius
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px'
      }}
    >
      <div 
        className="mobile-bottom-nav-container force-navigation-zero-radius"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          maxWidth: '100%',
          margin: '0 auto',
          padding: '0 16px',
          borderRadius: '0px', // 🔥 CRITICAL: Force 0px border-radius
          borderTopLeftRadius: '0px',
          borderTopRightRadius: '0px',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px'
        }}
      >
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`mobile-bottom-nav-item ${item.isActive ? 'active' : ''}`}
            aria-label={`Navigate to ${item.label}${item.badge ? ` (${item.badge} items)` : ''}`}
            aria-current={item.isActive ? 'page' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 12px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
              borderRadius: '0px',
              minWidth: '56px',
              minHeight: '56px',
              position: 'relative',
              color: item.isActive ? '#5825efff' : 'rgba(255, 255, 255, 0.7)',
              fontFamily: 'var(--font-body)',
              willChange: 'transform, color',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <div 
              className="mobile-bottom-nav-icon-container"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '4px',
                transition: 'transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
                transform: item.isActive ? 'translateY(-1px)' : 'translateY(0)'
              }}
            >
              <BootstrapIcon
                name={item.isActive ? item.icon : item.iconInactive}
                size="20px"
                style={{
                  transition: 'color 0.2s ease',
                  color: 'inherit'
                }}
              />
              {item.badge && item.badge > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    background: '#e74c3c',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '500',
                    padding: '2px 6px',
                    borderRadius: '0px',
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1',
                    fontFamily: 'var(--font-body)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                  aria-label={`${item.badge} items`}
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span 
              style={{
                fontSize: '10px',
                fontWeight: '400',
                lineHeight: '1',
                marginTop: '2px',
                transition: 'color 0.2s ease',
                textAlign: 'center',
                color: 'inherit'
              }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};