import React, { Suspense } from 'react';
import { useApp } from './AppProvider';
import { HomePage } from './HomePage';
import { PageLayout } from './PageLayout';
import { SAMPLE_PRODUCTS } from '../constants/products';
import { Product } from '../types';

// Lazy load components - using named exports destructuring
const ContactUsPage = React.lazy(() => import("./pages/ContactUsPage").then(module => ({ default: module.ContactUsPage })));
const ShippingInfoPage = React.lazy(() => import("./pages/ShippingInfoPage").then(module => ({ default: module.ShippingInfoPage })));
const ReturnsPage = React.lazy(() => import("./pages/ReturnsPage").then(module => ({ default: module.ReturnsPage })));
const SizeGuidePage = React.lazy(() => import("./pages/SizeGuidePage").then(module => ({ default: module.SizeGuidePage })));
const StoreLocatorPage = React.lazy(() => import("./pages/StoreLocatorPage").then(module => ({ default: module.StoreLocatorPage })));
const UserProfilePage = React.lazy(() => import("./pages/UserProfilePage").then(module => ({ default: module.UserProfilePage })));
const BuyerProfilePage = React.lazy(() => import("./pages/BuyerProfilePage").then(module => ({ default: module.BuyerProfilePage })));
const CheckoutPage = React.lazy(() => 
  import("./pages/CheckoutPageWithLogistics")
    .then(module => ({ default: module.CheckoutPageWithLogistics || module.default }))
    .catch(error => {
      console.error('Failed to load CheckoutPageWithLogistics:', error);
      return { default: () => <div>Checkout page temporarily unavailable</div> };
    })
);
const FavoritesPage = React.lazy(() => import("./pages/FavoritesPage").then(module => ({ default: module.FavoritesPage })));
const MobileCartPage = React.lazy(() => import("./pages/MobileCartPageWithIncentives").then(module => ({ default: module.MobileCartPageWithIncentives })));
const MobileFavoritesPage = React.lazy(() => import("./pages/MobileFavoritesPage").then(module => ({ default: module.MobileFavoritesPage })));
const SignInPage = React.lazy(() => import("./pages/SignInPage").then(module => ({ default: module.SignInPage })));
const CreateAccountPage = React.lazy(() => import("./pages/CreateAccountPage").then(module => ({ default: module.CreateAccountPage })));
const AdminDashboardPage = React.lazy(() => import("./pages/AdminDashboardPage").then(module => ({ default: module.AdminDashboardPage })));
const AdminSignInPage = React.lazy(() => import("./pages/AdminSignInPage").then(module => ({ default: module.AdminSignInPage })));
const AdminCreateAccountPage = React.lazy(() => import("./pages/AdminCreateAccountPage").then(module => ({ default: module.AdminCreateAccountPage })));
const AdminProfilePage = React.lazy(() => import("./pages/AdminProfilePage").then(module => ({ default: module.AdminProfilePage })));
const ProductReviewsPage = React.lazy(() => import("./pages/ProductReviewsPageEnhanced").then(module => ({ default: module.ProductReviewsPageEnhanced })));
const PackageTrackingPage = React.lazy(() => import("./pages/PackageTrackingPage").then(module => ({ default: module.PackageTrackingPage })));
const GetDirectionsPage = React.lazy(() => import("./pages/GetDirectionsPage").then(module => ({ default: module.GetDirectionsPage })));
const RateExperiencePage = React.lazy(() => import("./pages/RateExperiencePage").then(module => ({ default: module.RateExperiencePage })));
const ShopCategoriesPage = React.lazy(() => import("./pages/ShopCategoriesPage").then(module => ({ default: module.ShopCategoriesPage })));
const ProductDetailsPage = React.lazy(() => import("./pages/ProductDetailsPage").then(module => ({ default: module.ProductDetailsPage })));
const SharePage = React.lazy(() => import("./pages/SharePage").then(module => ({ default: module.SharePage })));
const OrdersPage = React.lazy(() => import("./pages/OrdersPage").then(module => ({ default: module.OrdersPage })));
const OrderDetailsPage = React.lazy(() => import("./pages/OrderDetailsPage").then(module => ({ default: module.OrderDetailsPage })));

// Live Streaming Components - using TABLET version for proper tablet layout
const LiveStreamGrid = React.lazy(() => 
  import("./streaming/LiveStreamGridFixedTablet")
    .then(module => ({ default: module.default || module.LiveStreamGridFixedTablet }))
    .catch(() => import("./streaming/LiveStreamGrid").then(module => ({ default: module.default || module.LiveStreamGrid })))
);

const MobileStreamViewer = React.lazy(() => 
  import("./streaming/MobileStreamViewer")
    .then(module => ({ default: module.default || module.MobileStreamViewer }))
    .catch(() => ({ default: () => <div>Stream Viewer Not Available</div> }))
);

const WatchLiveStreamPage = React.lazy(() => 
  import("./pages/WatchLiveStreamPage")
    .then(module => ({ default: module.WatchLiveStreamPage }))
    .catch(() => ({ default: () => <div>Watch Live Stream Not Available</div> }))
);

// Logistics Components - using default exports with fallback
const LogisticsDashboard = React.lazy(() => 
  import("./logistics/LogisticsDashboard")
    .then(module => ({ default: module.default || module.LogisticsDashboard }))
    .catch(() => ({ default: () => <div>Logistics Dashboard Not Available</div> }))
);


// Platform Admin Components
const PlatformAdminDashboardPage = React.lazy(() => import("./pages/PlatformAdminDashboardPage").then(module => ({ default: module.PlatformAdminDashboardPage })));
const PlatformAdminSignInPage = React.lazy(() => import("./pages/PlatformAdminSignInPage").then(module => ({ default: module.PlatformAdminSignInPage })));

// Logistics Portal Components
const LogisticsSignInPage = React.lazy(() => import("./pages/LogisticsSignInPage").then(module => ({ default: module.LogisticsSignInPage })));
const LogisticsCreateAccountPage = React.lazy(() => import("./pages/LogisticsCreateAccountPage").then(module => ({ default: module.LogisticsCreateAccountPage })));

// Framework Components - correct syntax for named exports with error handling
const FrameworkDemo = React.lazy(() => 
  import("./FrameworkDemo")
    .then(module => ({ default: module.FrameworkDemo || module.default }))
    .catch(() => ({ default: () => <div>Framework Demo Not Available</div> }))
);


const OrderManagementDashboard = React.lazy(() => 
  import("./orders/OrderManagementDashboard")
    .then(module => ({ default: module.OrderManagementDashboard || module.default }))
    .catch(() => ({ default: () => <div>Order Management Not Available</div> }))
);

const PaymentGateway = React.lazy(() => 
  import("./payments/PaymentGateway")
    .then(module => ({ default: module.PaymentGateway || module.default }))
    .catch(() => ({ default: () => <div>Payment Gateway Not Available</div> }))
);

const InventoryDashboard = React.lazy(() => 
  import("./inventory/InventoryDashboard")
    .then(module => ({ default: module.InventoryDashboard || module.default }))
    .catch(() => ({ default: () => <div>Inventory Dashboard Not Available</div> }))
);

const DisputeResolutionCenter = React.lazy(() => 
  import("./disputes/DisputeResolutionCenter")
    .then(module => ({ default: module.DisputeResolutionCenter || module.default }))
    .catch(() => ({ default: () => <div>Dispute Resolution Not Available</div> }))
);

const BusinessIntelligenceDashboard = React.lazy(() => 
  import("./intelligence/BusinessIntelligenceDashboard")
    .then(module => ({ default: module.BusinessIntelligenceDashboard || module.default }))
    .catch(() => ({ default: () => <div>Business Intelligence Not Available</div> }))
);

const SocialCommerceDashboard = React.lazy(() => 
  import("./social/SocialCommerceDashboard")
    .then(module => ({ default: module.SocialCommerceDashboard || module.default }))
    .catch(() => ({ default: () => <div>Social Commerce Not Available</div> }))
);

const InternationalDashboard = React.lazy(() => 
  import("./international/InternationalDashboard")
    .then(module => ({ default: module.InternationalDashboard || module.default }))
    .catch(() => ({ default: () => <div>International Dashboard Not Available</div> }))
);

// Suspense fallback component with error boundary
const PageSuspenseFallback = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--light-gray)' }}>
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-medium-gray font-body">Loading...</p>
    </div>
  </div>
));

// Set displayName to prevent React DevTools issues
PageSuspenseFallback.displayName = 'PageSuspenseFallback';

// Safe Suspense wrapper with error boundary
const SafeSuspense = React.memo(({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => {
  const [hasError, setHasError] = React.useState(false);
  
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="text-center p-6">
          <p className="text-medium-gray font-body mb-4">Component temporarily unavailable</p>
          <button 
            onClick={() => setHasError(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <Suspense fallback={fallback || <PageSuspenseFallback />}>
      {children}
    </Suspense>
  );
});

SafeSuspense.displayName = 'SafeSuspense';

interface AppRouterProps {
  onCurrentProductChange?: (product: Product | null) => void;
}

export function AppRouter({ onCurrentProductChange }: AppRouterProps = {}) {
  const appContext = useApp();
  
  // Defensive check for app context
  if (!appContext) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-medium-gray font-body">Loading application...</p>
        </div>
      </div>
    );
  }
  
  const { state, actions, auth, cart, favorites } = appContext;
  const products = SAMPLE_PRODUCTS;

  // Filtered products logic (moved from App.tsx)
  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    if (state.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    if (state.filterCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === state.filterCategory.toLowerCase()
      );
    }

    switch (state.sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  }, [products, state.searchQuery, state.sortBy, state.filterCategory]);

  // Pagination calculations
  const paginationData = React.useMemo(() => {
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / state.itemsPerPage);
    const startIndex = (state.currentPaginationPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      totalProducts,
      totalPages,
      paginatedProducts
    };
  }, [filteredProducts, state.currentPaginationPage, state.itemsPerPage]);

  // Product sets for different categories
  const productSets = React.useMemo(() => ({
    newArrivals: filteredProducts.filter(product => 
      product.badge === 'New' || 
      ['Vibrant Ankara Maxi Dress', 'Traditional African Print Top'].includes(product.name)
    ),
    dresses: filteredProducts.filter(product => product.category.toLowerCase() === 'dresses'),
    tops: filteredProducts.filter(product => product.category.toLowerCase() === 'tops'),
    accessories: filteredProducts.filter(product => product.category.toLowerCase() === 'accessories')
  }), [filteredProducts]);

  // Helper function for pages that should use PageLayout
  const shouldUsePageLayout = (page: string) => {
    const adminPages = ['admin-dashboard', 'admin-sign-in', 'admin-create-account', 'admin-profile'];
    const vendorPages = ['vendor-dashboard', 'vendor-sign-in', 'vendor-create-account', 'vendor-profile'];
    const platformAdminPages = ['platform-admin-dashboard', 'platform-admin-sign-in', 'platform-admin-create-account', 'platform-admin-profile'];
    const logisticsPages = ['logistics-dashboard', 'logistics-sign-in', 'logistics-create-account', 'logistics-profile'];
    const authPages = ['sign-in', 'create-account'];
    const specialPages = ['checkout', 'product-details', 'mobile-cart', 'mobile-favorites', 'store-locator', 'product-reviews', 'reviews', 'live-streams', 'stream-viewer', 'watch-live-stream', 'admin-streams', 'share', 'package-tracking', 'get-directions', 'rate-experience', 'orders', 'order-details', 'buyer-profile'];
    const shopPages = ['dresses', 'tops', 'accessories', 'new-arrivals'];
    
    if (shopPages.includes(page)) {
      return false;
    }
    
    return !adminPages.includes(page) && 
           !vendorPages.includes(page) && 
           !platformAdminPages.includes(page) && 
           !logisticsPages.includes(page) && 
           !authPages.includes(page) && 
           !specialPages.includes(page) && 
           page !== 'home';
  };

  // Common props for pages
  const commonPageProps = {
    allFilteredProducts: filteredProducts,
    filterCategory: state.filterCategory,
    searchQuery: state.searchQuery,
    sortBy: state.sortBy,
    setFilterCategory: actions.setFilterCategory,
    setSearchQuery: actions.setSearchQuery,
    setSortBy: actions.setSortBy,
    onAddToCart: cart.handleAddToCart,
    onQuickView: actions.handleQuickView,
    onToggleFavorite: favorites.handleToggleFavorite,
    isFavorite: favorites.isFavorite,
    onNavigateToStoreLocator: (product: Product) => {
      actions.setSelectedProduct(product);
      actions.setIsModalOpen(false);
      actions.navigateToPage('store-locator');
    },
    onNavigateToShare: (product: Product) => {
      actions.setSelectedProduct(product);
      actions.setIsModalOpen(false);
      actions.navigateToPage('share');
    },
    onNavigateToSizeGuide: () => actions.navigateToPage('size-guide'),
    onNavigateToReviews: (product: Product) => {
      actions.setSelectedProduct(product);
      actions.setIsModalOpen(false);
      actions.navigateToPage('product-reviews');
    }
  };

  // HomePage props
  const createHomePageProps = (pageProducts: Product[]) => ({
    filteredProducts: state.isMobile ? pageProducts : paginationData.paginatedProducts,
    allFilteredProducts: pageProducts,
    filterCategory: state.filterCategory,
    searchQuery: state.searchQuery,
    sortBy: state.sortBy,
    onAddToCart: cart.handleAddToCart,
    onQuickView: actions.handleQuickView,
    onToggleFavorite: favorites.handleToggleFavorite,
    isFavorite: favorites.isFavorite,
    onNavigateToStoreLocator: commonPageProps.onNavigateToStoreLocator,
    onNavigateToShare: commonPageProps.onNavigateToShare,
    onNavigateToPage: actions.navigateToPage,
    setFilterCategory: actions.setFilterCategory,
    setSearchQuery: actions.setSearchQuery,
    setSortBy: actions.setSortBy,
    onNavigateToReviews: commonPageProps.onNavigateToReviews,
    isFloatingIconsVisible: state.isFloatingIconsVisible,
    isMobileSearchOpen: state.isMobileSearchOpen,
    onToggleMobileSearch: actions.handleToggleMobileSearch,
    onCloseMobileSearch: actions.handleCloseMobileSearch,
    currentPage: state.currentPaginationPage,
    totalPages: paginationData.totalPages,
    totalProducts: paginationData.totalProducts,
    itemsPerPage: state.itemsPerPage,
    onPageChange: actions.handlePageChange,
    onItemsPerPageChange: actions.handleItemsPerPageChange,
    currentUser: state.isAdminMode ? state.testAdminUser : auth.currentUser,
    onSignOut: () => {
      auth.handleSignOut();
      actions.setIsAdminMode(false);
      actions.setTestAdminUser(null);
      
      if (state.currentPage === 'admin-dashboard' || state.currentPage === 'admin-profile') {
        actions.navigateToPage('home');
      }
      actions.setIsChatOpen(false);
      actions.setIsAdminChatOpen(false);
    },
    // 🔥 Chat handler - the missing piece!
    onChatOpen: () => {
      console.log('🔥 MOBILE CHAT BUTTON CLICKED IN HOMEPAGE!');
      console.log('Current isAdminMode:', state.isAdminMode);
      console.log('Current testAdminUser:', state.testAdminUser);
      console.log('Auth currentUser:', auth.currentUser);
      
      if (state.isAdminMode === true) {
        console.log('🎯 ADMIN MODE DETECTED - Opening AdminChatRoom');
        actions.setIsChatOpen(false);
        actions.setIsAdminChatOpen(true);
        return;
      }
      
      if (auth.currentUser?.isAdmin === true) {
        console.log('🎯 AUTH ADMIN DETECTED - Opening AdminChatRoom');
        actions.setIsChatOpen(false);
        actions.setIsAdminChatOpen(true);
        return;
      }
      
      console.log('🎯 CUSTOMER MODE - Opening regular ChatRoom');
      actions.setIsAdminChatOpen(false);
      actions.setIsChatOpen(true);
    },
    // 🔥 Live stream navigation handler
    onNavigateToLiveStream: (streamId: string) => {
      console.log('🔥 Navigating to live stream:', streamId);
      actions.navigateToPage('stream-viewer');
    },
    // 🎉 Incentive action handler
    onIncentiveAction: (offerId: string, product: Product) => {
      console.log('🎯 Incentive balloon action:', offerId, product?.name);
      // Add to cart with the current product
      if (product) {
        cart.handleAddToCart(product, product.sizes?.[0] || '', product.colors?.[0] || '');
      }
    },
    // 🎯 Current product change handler
    onCurrentProductChange: onCurrentProductChange || (() => {})
  });

  // Render current page content
  const renderPageContent = () => {
    switch (state.currentPage) {
      case 'home':
        return <HomePage {...createHomePageProps(filteredProducts)} />;
      case 'new-arrivals':
        return <HomePage {...createHomePageProps(productSets.newArrivals)} />;
      case 'dresses':
        return <HomePage {...createHomePageProps(productSets.dresses)} />;
      case 'tops':
        return <HomePage {...createHomePageProps(productSets.tops)} />;
      case 'accessories':
        return <HomePage {...createHomePageProps(productSets.accessories)} />;
      
      case 'contact':
        return shouldUsePageLayout(state.currentPage) ? (
          <SafeSuspense fallback={<PageSuspenseFallback />}>
            <PageLayout {...commonPageProps}>
              <ContactUsPage />
            </PageLayout>
          </SafeSuspense>
        ) : (
          <SafeSuspense fallback={<PageSuspenseFallback />}>
            <ContactUsPage />
          </SafeSuspense>
        );
      
      case 'shipping':
        return shouldUsePageLayout(state.currentPage) ? (
          <Suspense fallback={<PageSuspenseFallback />}>
            <PageLayout {...commonPageProps}>
              <ShippingInfoPage />
            </PageLayout>
          </Suspense>
        ) : (
          <Suspense fallback={<PageSuspenseFallback />}>
            <ShippingInfoPage />
          </Suspense>
        );
      
      case 'returns':
        return shouldUsePageLayout(state.currentPage) ? (
          <Suspense fallback={<PageSuspenseFallback />}>
            <PageLayout {...commonPageProps}>
              <ReturnsPage />
            </PageLayout>
          </Suspense>
        ) : (
          <Suspense fallback={<PageSuspenseFallback />}>
            <ReturnsPage />
          </Suspense>
        );
      
      case 'size-guide':
        return shouldUsePageLayout(state.currentPage) ? (
          <Suspense fallback={<PageSuspenseFallback />}>
            <PageLayout {...commonPageProps}>
              <SizeGuidePage />
            </PageLayout>
          </Suspense>
        ) : (
          <Suspense fallback={<PageSuspenseFallback />}>
            <SizeGuidePage />
          </Suspense>
        );
      
      case 'store-locator':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <StoreLocatorPage 
              product={state.selectedProduct} 
              onNavigateBack={() => actions.navigateToPage('home')} 
            />
          </Suspense>
        );
      
      case 'product-reviews':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <ProductReviewsPage 
              product={state.selectedProduct} 
              onNavigateBack={() => actions.navigateToPage('home')} 
              onToggleFavorite={favorites.handleToggleFavorite}
              isFavorite={favorites.isFavorite}
              onAddToCart={cart.handleAddToCart}
            />
          </Suspense>
        );
      
      case 'profile':
        return shouldUsePageLayout(state.currentPage) ? (
          <Suspense fallback={<PageSuspenseFallback />}>
            <PageLayout {...commonPageProps}>
              <UserProfilePage onNavigateBack={() => actions.navigateToPage('home')} />
            </PageLayout>
          </Suspense>
        ) : (
          <Suspense fallback={<PageSuspenseFallback />}>
            <UserProfilePage onNavigateBack={() => actions.navigateToPage('home')} />
          </Suspense>
        );
      
      case 'buyer-profile':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <BuyerProfilePage onNavigateToPage={actions.navigateToPage} />
          </Suspense>
        );
      
      case 'checkout':
        return (
          <SafeSuspense fallback={<PageSuspenseFallback />}>
            <CheckoutPage 
              cartItems={cart.cartItems} 
              onNavigateBack={() => actions.navigateToPage('home')} 
              onOrderComplete={() => { 
                cart.setCartItems([]); 
                actions.navigateToPage('home'); 
              }}
              onNavigateToPackageTracking={(orderNumber: string) => {
                actions.navigateToPage('package-tracking');
              }}
            />
          </SafeSuspense>
        );
      
      case 'package-tracking':
        return (
          <SafeSuspense fallback={<PageSuspenseFallback />}>
            <PackageTrackingPage 
              onNavigateBack={() => actions.navigateToPage('orders')}
              orderNumber={state.selectedOrderDetails?.orderNumber || state.selectedOrderDetails?.trackingNumber}
            />
          </SafeSuspense>
        );
      
      case 'get-directions':
        return (
          <SafeSuspense fallback={<PageSuspenseFallback />}>
            <GetDirectionsPage 
              onNavigateBack={() => actions.navigateToPage('package-tracking')}
            />
          </SafeSuspense>
        );
      
      case 'rate-experience':
        return (
          <SafeSuspense fallback={<PageSuspenseFallback />}>
            <RateExperiencePage 
              onNavigateBack={() => actions.navigateToPage('package-tracking')}
            />
          </SafeSuspense>
        );
      
      case 'shop-categories':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <ShopCategoriesPage 
              onNavigateBack={() => actions.navigateToPage('home')}
              onNavigateToPage={actions.navigateToPage}
            />
          </Suspense>
        );
      
      case 'orders':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <OrdersPage 
              onNavigateBack={() => actions.navigateToPage('home')}
              onNavigateToPage={actions.navigateToPage}
            />
          </Suspense>
        );
      
      case 'favorites':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <FavoritesPage 
              favoriteItems={favorites.favoriteItems} 
              allProducts={products} 
              onNavigateBack={() => actions.navigateToPage('home')} 
              onRemoveFromFavorites={favorites.handleRemoveFromFavorites} 
              onAddToCart={cart.handleAddToCart} 
              onQuickView={actions.handleQuickView} 
              onToggleFavorite={favorites.handleToggleFavorite} 
              isFavorite={favorites.isFavorite} 
              onNavigateToSizeGuide={() => actions.navigateToPage('size-guide')} 
              onNavigateToReviews={commonPageProps.onNavigateToReviews} 
            />
          </Suspense>
        );
      
      case 'mobile-cart':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <MobileCartPage 
              cartItems={cart.cartItems} 
              onNavigateBack={() => actions.navigateToPage('home')} 
              onUpdateQuantity={cart.handleUpdateQuantity} 
              onRemoveItem={cart.handleRemoveItem} 
              onUpdateSizeColor={cart.handleUpdateSizeColor}
              onProceedToCheckout={() => actions.navigateToPage('checkout')}
              onToggleFavorite={favorites.handleToggleFavorite}
              isFavorite={favorites.isFavorite}
            />
          </Suspense>
        );
      
      case 'mobile-favorites':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <MobileFavoritesPage 
              favoriteItems={favorites.favoriteItems} 
              allProducts={products} 
              onNavigateBack={() => actions.navigateToPage('home')} 
              onRemoveFromFavorites={favorites.handleRemoveFromFavorites} 
              onAddToCart={cart.handleAddToCart} 
              onQuickView={actions.handleQuickView} 
              onToggleFavorite={favorites.handleToggleFavorite} 
              isFavorite={favorites.isFavorite} 
            />
          </Suspense>
        );
      
      case 'sign-in':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <SignInPage 
              onNavigateBack={() => actions.navigateToPage('home')} 
              onSignIn={async (email: string, password: string, rememberMe: boolean) => {
                await auth.handleSignIn(email, password, rememberMe);
                actions.navigateToPage('home');
              }} 
              onNavigateToCreateAccount={() => actions.navigateToPage('create-account')} 
              isLoading={auth.isAuthLoading} 
            />
          </Suspense>
        );
      
      case 'create-account':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <CreateAccountPage 
              onNavigateBack={() => actions.navigateToPage('home')} 
              onCreateAccount={async (userData: any) => {
                await auth.handleCreateAccount(userData);
                actions.navigateToPage('home');
              }} 
              onNavigateToSignIn={() => actions.navigateToPage('sign-in')} 
              isLoading={auth.isAuthLoading} 
            />
          </Suspense>
        );
      
      case 'admin-dashboard':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <AdminDashboardPage 
              onNavigateBack={() => actions.navigateToPage('home')} 
              currentAdminView={state.currentAdminView} 
              onAdminNavigate={actions.setCurrentAdminView} 
              currentUser={state.isAdminMode ? state.testAdminUser : auth.currentUser} 
              onNavigateToPage={actions.navigateToPage}
            />
          </Suspense>
        );
      
      case 'admin-sign-in':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <AdminSignInPage 
              onNavigateBack={() => actions.navigateToPage('home')} 
              onSignIn={async (email: string, password: string, rememberMe: boolean, adminCode?: string) => {
                await auth.handleAdminSignIn(email, password, rememberMe, adminCode);
                actions.navigateToPage('admin-dashboard');
              }} 
              onNavigateToCreateAccount={() => actions.navigateToPage('admin-create-account')} 
              isLoading={auth.isAuthLoading} 
            />
          </Suspense>
        );
      
      case 'admin-create-account':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <AdminCreateAccountPage 
              onNavigateBack={() => actions.navigateToPage('home')} 
              onCreateAccount={async (userData: any) => {
                await auth.handleAdminCreateAccount(userData);
                actions.navigateToPage('admin-sign-in');
              }} 
              onNavigateToSignIn={() => actions.navigateToPage('admin-sign-in')} 
              isLoading={auth.isAuthLoading} 
            />
          </Suspense>
        );
      
      case 'admin-profile':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <AdminProfilePage 
              onNavigateBack={() => actions.navigateToPage('admin-dashboard')} 
              currentUser={state.isAdminMode ? state.testAdminUser : auth.currentUser} 
              onUpdateProfile={auth.handleUpdateProfile} 
            />
          </Suspense>
        );
      
      // Platform Admin Portal Routes
      case 'platform-admin-dashboard':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <PlatformAdminDashboardPage 
              onNavigateBack={() => actions.navigateToPage('home')} 
              currentPlatformAdminView={state.currentAdminView} 
              onPlatformAdminNavigate={actions.setCurrentAdminView} 
              currentUser={state.isAdminMode ? state.testAdminUser : auth.currentUser} 
              onNavigateToPage={actions.navigateToPage}
            />
          </Suspense>
        );
      
      case 'platform-admin-sign-in':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <PlatformAdminSignInPage 
              onNavigateBack={() => actions.navigateToPage('home')} 
              onSignIn={(email, password) => {
                // Handle platform admin sign in logic
                console.log('Platform admin sign in:', email, password);
                actions.navigateToPage('platform-admin-dashboard');
              }}
              onNavigateToCreateAccount={() => actions.navigateToPage('platform-admin-create-account')} 
            />
          </Suspense>
        );
      
      // Logistics Portal Routes
      case 'logistics-dashboard':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <LogisticsDashboard 
              currentUser={state.isAdminMode ? state.testAdminUser : auth.currentUser}
            />
          </Suspense>
        );
      
      case 'logistics-sign-in':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <LogisticsSignInPage 
              onNavigateBack={() => actions.navigateToPage('home')} 
              onSignIn={async (credentials: any) => {
                // Handle logistics sign in logic
                console.log('Logistics sign in:', credentials);
                // Simulate successful authentication
                actions.navigateToPage('logistics-dashboard');
              }}
              onNavigateToCreateAccount={() => actions.navigateToPage('logistics-create-account')} 
              isLoading={auth.isAuthLoading}
            />
          </Suspense>
        );
      
      case 'logistics-create-account':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <LogisticsCreateAccountPage 
              onNavigateBack={() => actions.navigateToPage('home')} 
              onCreateAccount={async (userData: any) => {
                // Handle logistics account creation
                console.log('Creating logistics account:', userData);
                // Simulate successful account creation
                actions.navigateToPage('logistics-sign-in');
              }}
              onNavigateToSignIn={() => actions.navigateToPage('logistics-sign-in')} 
              isLoading={auth.isAuthLoading}
            />
          </Suspense>
        );
      
      case 'product-details':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <ProductDetailsPage 
              product={state.selectedProduct} 
              onNavigateBack={() => actions.navigateToPage('home')}
              onAddToCart={cart.handleAddToCart}
              onToggleFavorite={favorites.handleToggleFavorite}
              isFavorite={favorites.isFavorite}
              onNavigateToStoreLocator={commonPageProps.onNavigateToStoreLocator}
              onNavigateToShare={commonPageProps.onNavigateToShare}
              onNavigateToSizeGuide={commonPageProps.onNavigateToSizeGuide}
              onNavigateToReviews={commonPageProps.onNavigateToReviews}
            />
          </Suspense>
        );

      // Duplicate product-details case removed
      
      case 'share':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <SharePage 
              product={state.selectedProduct} 
              onNavigateBack={() => actions.navigateToPage('home')} 
            />
          </Suspense>
        );
      
      case 'live-streams':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <LiveStreamGrid 
              onStreamClick={(stream) => {
                console.log('🎯 Stream clicked:', stream.title);
                actions.setCurrentStream?.(stream);
                actions.navigateToPage('watch-live-stream');
              }}
              onNavigateToPage={actions.navigateToPage}
            />
          </Suspense>
        );
      
      case 'stream-viewer':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <MobileStreamViewer />
          </Suspense>
        );
      
      case 'watch-live-stream':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <WatchLiveStreamPage 
              streamId={state.currentStream?.id}
              onNavigateBack={() => actions.navigateToPage('live-streams')}
            />
          </Suspense>
        );
      
      // 🚀 NEW FRAMEWORK TESTING ROUTES
      case 'framework-demo':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <FrameworkDemo />
          </Suspense>
        );
      
      case 'order-management':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <OrderManagementDashboard />
          </Suspense>
        );
      
      case 'payment-gateway':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <PaymentGateway 
              orderId="order_demo_001"
              amount={89.99}
              customerId="customer_1"
              vendorId="vendor_1"
              onPaymentSuccess={(transaction) => {
                console.log('Payment successful:', transaction);
                actions.navigateToPage('framework-demo');
              }}
              onPaymentError={(error) => {
                console.error('Payment failed:', error);
              }}
            />
          </Suspense>
        );
      
      case 'inventory-management':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <InventoryDashboard />
          </Suspense>
        );
      

      
      case 'partner-dashboard':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <LogisticsDashboard 
              partnerId="partner_001"
              isPartnerView={true}
            />
          </Suspense>
        );
      
      case 'dispute-resolution':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <DisputeResolutionCenter userRole="admin" />
          </Suspense>
        );
      
      case 'customer-disputes':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <DisputeResolutionCenter 
              userRole="customer" 
              userId="customer_1"
            />
          </Suspense>
        );
      
      case 'ai-intelligence':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <BusinessIntelligenceDashboard userRole="admin" scope="platform" />
          </Suspense>
        );
      
      case 'social-commerce':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <SocialCommerceDashboard />
          </Suspense>
        );
      
      case 'international-expansion':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <InternationalDashboard />
          </Suspense>
        );
      
      case 'order-details':
        return (
          <Suspense fallback={<PageSuspenseFallback />}>
            <OrderDetailsPage 
              onNavigateBack={() => actions.navigateToPage('orders')}
              onNavigateToPage={actions.navigateToPage}
            />
          </Suspense>
        );
      
      default:
        return <HomePage {...createHomePageProps(filteredProducts)} />;
    }
  };

  return renderPageContent();
}

AppRouter.displayName = 'AppRouter';