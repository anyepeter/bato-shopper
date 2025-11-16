import React, { useEffect, useState, useMemo, useCallback, Suspense } from "react";

// Import styles first - critical for app to render
import "./styles/globals.css";

// Import core components
import ErrorBoundary from "./components/ErrorBoundary";
import { AppProvider, useApp } from "./components/AppProvider";
import { AppRouter } from "./components/AppRouter";

// Lazy load components with error handling
const Header = React.lazy(() => 
  import("./components/Header")
    .then(m => ({ default: m.Header }))
    .catch(() => ({ default: () => <div>Header unavailable</div> }))
);

const ShoppingCart = React.lazy(() => 
  import("./components/ShoppingCart")
    .then(m => ({ default: m.ShoppingCart }))
    .catch(() => ({ default: () => null }))
);

const ProductModal = React.lazy(() => 
  import("./components/ProductModal")
    .then(m => ({ default: m.ProductModal }))
    .catch(() => ({ default: () => null }))
);

const FloatingChatButton = React.lazy(() => 
  import("./components/FloatingChatButton")
    .then(m => ({ default: m.FloatingChatButton }))
    .catch(() => ({ default: () => null }))
);

const FloatingToggleButton = React.lazy(() => 
  import("./components/FloatingToggleButton")
    .then(m => ({ default: m.FloatingToggleButton }))
    .catch(() => ({ default: () => null }))
);

const Footer = React.lazy(() => 
  import("./components/Footer")
    .then(m => ({ default: m.Footer }))
    .catch(() => ({ default: () => null }))
);

const ChatRoom = React.lazy(() => 
  import("./components/ChatRoom")
    .then(m => ({ default: m.ChatRoom }))
    .catch(() => ({ default: () => null }))
);

const AdminChatRoom = React.lazy(() => 
  import("./components/admin/AdminChatRoom")
    .then(m => ({ default: m.AdminChatRoom }))
    .catch(() => ({ default: () => null }))
);

const MobileSplashScreen = React.lazy(() => 
  import("./components/MobileSplashScreen")
    .then(m => ({ default: m.MobileSplashScreen }))
    .catch(() => ({ default: () => null }))
);

const MobileIncentiveBalloonStandalone = React.lazy(() => 
  import("./components/mobile/MobileIncentiveBalloonStandalone")
    .then(m => ({ default: m.MobileIncentiveBalloonStandalone }))
    .catch(() => ({ default: () => null }))
);

const FloatingProductCommunityButton = React.lazy(() => 
  import("./components/mobile/FloatingProductCommunityButton")
    .then(m => ({ default: m.FloatingProductCommunityButton }))
    .catch(() => ({ default: () => null }))
);

const MobileBottomNavigation = React.lazy(() => 
  import("./components/mobile/MobileBottomNavigation")
    .then(m => ({ default: m.MobileBottomNavigation }))
    .catch(() => ({ default: () => null }))
);

/**
 * Loading fallback component
 */
const LoadingFallback = ({ message = "Loading..." }: { message?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-black text-white">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="font-body">{message}</p>
    </div>
  </div>
);

/**
 * App Content Component
 */
function AppContent() {
  const { state, actions, auth, cart, favorites } = useApp();
  const [isSplashVisible, setIsSplashVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  // Mobile detection
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        document.body.classList.add('mobile', 'mobile-bottom-nav-enabled');
        document.body.classList.remove('desktop');
      } else {
        document.body.classList.add('desktop');
        document.body.classList.remove('mobile', 'mobile-bottom-nav-enabled');
      }
      
      actions.setIsMobile(isMobile);
    };

    checkMobile();

    const debouncedCheckMobile = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 200);
    };

    window.addEventListener('resize', debouncedCheckMobile);
    
    return () => {
      window.removeEventListener('resize', debouncedCheckMobile);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [actions]);

  // Bootstrap Icons loading
  useEffect(() => {
    try {
      const existingLink = document.querySelector('link[href*="bootstrap-icons"]');
      if (existingLink) return;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    } catch (error) {
      console.log('Bootstrap icons loading deferred');
    }
  }, []);

  // Splash screen logic
  useEffect(() => {
    try {
      const isMobileView = window.innerWidth < 768;
      const hasSeenSplash = sessionStorage.getItem('bato-splash-seen');
      
      if (isMobileView && !hasSeenSplash) {
        setIsSplashVisible(true);
      }
    } catch (error) {
      console.log('Splash screen check failed, continuing without it');
    }
  }, []);

  // Initialize debug helpers
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !(window as any).batoDebugInitialized) {
      (window as any).batoDebugInitialized = true;
      
      const debugHelpers = {
        navigateToBuyersPortal: () => actions.navigateToPage('home'),
        navigateToSignIn: () => actions.navigateToPage('sign-in'),
        enableAdminMode: () => {
          const adminUser = {
            id: 9999,
            firstName: 'Admin',
            lastName: 'Demo',
            email: 'admin@bato.com',
            phone: '+1 (555) 123-4567',
            isAdmin: true,
            adminLevel: 'Live Chat Administrator',
            department: 'Customer Support',
            jobTitle: 'Live Chat Manager',
            companyName: 'Bato Inc.',
            location: 'Customer Support HQ',
            bio: 'Live Chat admin user for managing customer support conversations.',
            emergencyContact: '+1 (555) 987-6543',
            supervisorEmail: 'supervisor@bato.com',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150'
          };
          actions.setIsAdminMode(true);
          actions.setTestAdminUser(adminUser);
          return adminUser;
        }
      };

      Object.assign(window, debugHelpers);
    }
  }, [actions]);

  // Memoized handlers
  const handleSplashComplete = useCallback(() => {
    setIsSplashVisible(false);
    sessionStorage.setItem('bato-splash-seen', 'true');
  }, []);

  const handleChatOpen = useCallback(() => {
    const isAdmin = state.isAdminMode || auth.currentUser?.isAdmin;
    
    if (isAdmin) {
      actions.setIsChatOpen(false);
      actions.setIsAdminChatOpen(true);
    } else {
      actions.setIsAdminChatOpen(false);
      actions.setIsChatOpen(true);
    }
  }, [state.isAdminMode, auth.currentUser, actions]);

  const handleChatClose = useCallback(() => {
    actions.setIsChatOpen(false);
    actions.setIsAdminChatOpen(false);
  }, [actions]);

  const handleMobileCartClick = useCallback(() => {
    if (state.isMobile) {
      actions.navigateToPage('mobile-cart');
    } else {
      cart.setIsCartOpen(true);
    }
  }, [state.isMobile, actions, cart]);

  const handleMobileFavoritesClick = useCallback(() => {
    if (state.isMobile) {
      actions.navigateToPage('mobile-favorites');
    } else {
      actions.navigateToPage('favorites');
    }
  }, [state.isMobile, actions]);

  const handleSignOut = useCallback(() => {
    auth.handleSignOut();
    actions.setIsAdminMode(false);
    actions.setTestAdminUser(null);
    
    if (state.currentPage === 'admin-dashboard' || state.currentPage === 'admin-profile') {
      actions.navigateToPage('home');
    }
    actions.setIsChatOpen(false);
    actions.setIsAdminChatOpen(false);
  }, [auth, actions, state.currentPage]);

  // Memoized computed values
  const currentUser = useMemo(() => 
    state.isAdminMode ? state.testAdminUser : auth.currentUser,
    [state.isAdminMode, state.testAdminUser, auth.currentUser]
  );
  
  const shouldShowFloatingToggleButton = useMemo(() => 
    state.isMobile && ['home', 'new-arrivals', 'dresses', 'tops', 'accessories'].includes(state.currentPage),
    [state.isMobile, state.currentPage]
  );
  
  const shouldShowFloatingChatButton = useMemo(() => 
    !state.isMobile && ['home', 'live-streams', 'new-arrivals', 'dresses', 'tops', 'accessories'].includes(state.currentPage),
    [state.isMobile, state.currentPage]
  );
  
  const shouldShowChatComponents = useMemo(() => 
    state.isChatOpen || state.isAdminChatOpen,
    [state.isChatOpen, state.isAdminChatOpen]
  );
  
  const isAdminChatMode = useMemo(() => 
    state.isAdminMode || auth.currentUser?.isAdmin,
    [state.isAdminMode, auth.currentUser]
  );

  const shouldShowMobileIncentiveBalloon = useMemo(() => 
    state.isMobile && (state.currentPage === 'home' || state.currentPage === 'live-streams' || state.currentPage === 'stream-viewer'),
    [state.isMobile, state.currentPage]
  );

  const shouldShowMobileCommunityButton = useMemo(() => 
    state.isMobile && (state.currentPage === 'home' || state.currentPage === 'live-streams' || state.currentPage === 'stream-viewer') && currentProduct,
    [state.isMobile, state.currentPage, currentProduct]
  );

  const handleMobileIncentiveBalloonAction = useCallback((offerId: string, incentiveData?: any) => {
    if (currentProduct) {
      const defaultSize = currentProduct.sizes?.[0] || '';
      const defaultColor = currentProduct.colors?.[0] || '';
      
      if (incentiveData && cart.handleAddToCartWithIncentive) {
        cart.handleAddToCartWithIncentive(currentProduct, defaultSize, defaultColor, incentiveData);
      } else {
        cart.handleAddToCart(currentProduct, defaultSize, defaultColor);
      }
    }
  }, [currentProduct, cart]);

  const handleCurrentProductChange = useCallback((product: any) => {
    setCurrentProduct(product);
  }, []);

  return (
    <div className="min-h-screen" style={{ 
      backgroundColor: state.isMobile ? '#000000' : 'var(--light-gray)' 
    }}>
      <Suspense fallback={<LoadingFallback message="Loading header..." />}>
        {/* Mobile Splash Screen */}
        {isSplashVisible && (
          <MobileSplashScreen 
            isVisible={isSplashVisible} 
            onComplete={handleSplashComplete}
          />
        )}

        {/* Header */}
        <Header
          cartItemsCount={cart.cartItemsCount}
          favoriteItemsCount={favorites.favoriteItems.length}
          onCartClick={handleMobileCartClick}
          onNavigateToPage={actions.navigateToPage}
          onNavigateToFavorites={handleMobileFavoritesClick}
          currentUser={currentUser}
          onSignOut={handleSignOut}
          currentPage={state.currentPage}
          onAdminNavigate={actions.setCurrentAdminView}
          currentAdminView={state.currentAdminView}
        />

        {/* Floating Toggle Button - Mobile Only */}
        {shouldShowFloatingToggleButton && (
          <FloatingToggleButton 
            isVisible={state.isFloatingIconsVisible}
            onToggle={actions.handleToggleFloatingIcons}
          />
        )}
      </Suspense>

      {/* Main Content Router */}
      <Suspense fallback={<LoadingFallback message="Loading page..." />}>
        <AppRouter onCurrentProductChange={handleCurrentProductChange} />
      </Suspense>

      <Suspense fallback={null}>
        {/* Footer - Desktop Only, Non-Admin */}
        {!state.isMobile && state.currentPage !== 'admin-dashboard' && (
          <Footer onNavigateToPage={actions.navigateToPage} />
        )}

        {/* Shopping Cart - Desktop Only */}
        {!state.isMobile && (
          <ShoppingCart
            items={cart.cartItems}
            isOpen={cart.isCartOpen}
            onClose={() => cart.setIsCartOpen(false)}
            onUpdateQuantity={cart.handleUpdateQuantity}
            onRemoveItem={cart.handleRemoveItem}
            onUpdateSizeColor={cart.handleUpdateSizeColor}
            onProceedToCheckout={() => {
              cart.setIsCartOpen(false);
              actions.navigateToPage('checkout');
            }}
          />
        )}

        {/* Product Modal */}
        {state.selectedProduct && (
          <ProductModal
            product={state.selectedProduct}
            isOpen={state.isModalOpen}
            onClose={() => {
              actions.setIsModalOpen(false);
              actions.setSelectedProduct(null);
            }}
            onAddToCart={cart.handleAddToCart}
            onNavigateToStoreLocator={(product) => {
              actions.setSelectedProduct(product);
              actions.setIsModalOpen(false);
              actions.navigateToPage('store-locator');
            }}
          />
        )}

        {/* Floating Chat Button - Desktop Only */}
        {shouldShowFloatingChatButton && (
          <FloatingChatButton 
            onClick={handleChatOpen} 
            isOpen={state.isChatOpen || state.isAdminChatOpen} 
          />
        )}

        {/* Chat Components */}
        {shouldShowChatComponents && (
          isAdminChatMode ? (
            <AdminChatRoom
              isOpen={state.isAdminChatOpen}
              onClose={handleChatClose}
              currentUser={currentUser}
            />
          ) : (
            <ChatRoom
              isOpen={state.isChatOpen}
              onClose={handleChatClose}
              currentUser={null}
            />
          )
        )}

        {/* Mobile Incentive Balloon */}
        {shouldShowMobileIncentiveBalloon && (
          <MobileIncentiveBalloonStandalone
            onAction={handleMobileIncentiveBalloonAction}
            currentProduct={currentProduct}
          />
        )}

        {/* Mobile Community Chat Button */}
        {shouldShowMobileCommunityButton && (
          <FloatingProductCommunityButton
            product={currentProduct}
            currentUser={currentUser}
            onFavoriteProduct={(productId) => favorites.handleToggleFavorite({ id: productId } as any)}
            onPurchaseProduct={(productId) => {
              if (currentProduct && currentProduct.id === productId) {
                const defaultSize = currentProduct.sizes?.[0] || '';
                const defaultColor = currentProduct.colors?.[0] || '';
                cart.handleAddToCart(currentProduct, defaultSize, defaultColor);
              }
            }}
            className="!fixed !top-[186px] !right-4 !z-[49]"
          />
        )}

        {/* Mobile Bottom Navigation */}
        {state.isMobile && (
          <MobileBottomNavigation
            cartItemsCount={cart.cartItemsCount}
            favoriteItemsCount={favorites.favoriteItems.length}
            currentUser={currentUser}
            onNavigateToPage={actions.navigateToPage}
            onCartClick={handleMobileCartClick}
            onFavoritesClick={handleMobileFavoritesClick}
          />
        )}
      </Suspense>
    </div>
  );
}

/**
 * Main App Component with Provider
 */
export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
