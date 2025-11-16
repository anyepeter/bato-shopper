import { useState, useCallback, useMemo } from 'react';
import { PageType, AdminView, Product } from '../types';

export interface AppState {
  // Page Navigation
  currentPage: PageType;
  currentAdminView: AdminView;
  
  // Product & Filter State
  searchQuery: string;
  sortBy: string;
  filterCategory: string;
  
  // Pagination State
  currentPaginationPage: number;
  itemsPerPage: number;
  
  // Modal & UI State
  selectedProduct: Product | null;
  isModalOpen: boolean;
  
  // Mobile State
  isFloatingIconsVisible: boolean;
  isMobileSearchOpen: boolean;
  isMobile: boolean;
  
  // Chat State
  isChatOpen: boolean;
  isAdminChatOpen: boolean;
  
  // Admin Mode State
  isAdminMode: boolean;
  testAdminUser: any;
  
  // Bootstrap Icons State
  isBootstrapIconsLoaded: boolean;
  
  // Splash Screen State
  isSplashScreenVisible: boolean;
  
  // Live Streaming State
  currentStream: any | null;
  isStreamPlaying: boolean;
  streamQuality: 'low' | 'medium' | 'high';
  streams: any[];
  isStreamGridOpen: boolean;
  selectedStreamCategory: string;
  isMobileStreamViewer: boolean;
  streamProducts: any[];
  selectedStreamProduct: any | null;
  isProductOverlayVisible: boolean;
  
  // Package Tracking State
  trackingData: {
    trackingNumber: string;
    orderNumber: string;
    orderData?: any;
  } | null;
  
  // Order Details State
  selectedOrderDetails: any | null;
}

export interface AppActions {
  // Navigation Actions
  setCurrentPage: (page: PageType) => void;
  setCurrentAdminView: (view: AdminView) => void;
  navigateToPage: (page: PageType) => void;
  
  // Product & Filter Actions
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  setFilterCategory: (category: string) => void;
  
  // Pagination Actions
  setCurrentPaginationPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  
  // Modal & UI Actions
  setSelectedProduct: (product: Product | null) => void;
  setIsModalOpen: (open: boolean) => void;
  
  // Mobile Actions
  setIsFloatingIconsVisible: (visible: boolean) => void;
  setIsMobileSearchOpen: (open: boolean) => void;
  setIsMobile: (mobile: boolean) => void;
  
  // Chat Actions
  setIsChatOpen: (open: boolean) => void;
  setIsAdminChatOpen: (open: boolean) => void;
  
  // Admin Mode Actions
  setIsAdminMode: (mode: boolean) => void;
  setTestAdminUser: (user: any) => void;
  
  // Bootstrap Icons Actions
  setIsBootstrapIconsLoaded: (loaded: boolean) => void;
  
  // Splash Screen Actions
  setIsSplashScreenVisible: (visible: boolean) => void;
  
  // Live Streaming Actions
  setCurrentStream: (stream: any | null) => void;
  setIsStreamPlaying: (playing: boolean) => void;
  setStreamQuality: (quality: 'low' | 'medium' | 'high') => void;
  setStreams: (streams: any[]) => void;
  setIsStreamGridOpen: (open: boolean) => void;
  setSelectedStreamCategory: (category: string) => void;
  setIsMobileStreamViewer: (mobile: boolean) => void;
  setStreamProducts: (products: any[]) => void;
  setSelectedStreamProduct: (product: any | null) => void;
  setIsProductOverlayVisible: (visible: boolean) => void;
  
  // Package Tracking Actions
  setTrackingData: (data: { trackingNumber: string; orderNumber: string; orderData?: any } | null) => void;
  
  // Order Details Actions
  setSelectedOrderDetails: (order: any | null) => void;
  
  playStream: (streamId: string) => void;
  pauseStream: () => void;
  switchStream: (streamId: string) => void;
  openStreamGrid: () => void;
  closeStreamGrid: () => void;
  filterStreamsByCategory: (category: string) => void;
  toggleProductOverlay: () => void;
  selectStreamProduct: (product: any) => void;
  
  // Complex Actions
  handleQuickView: (product: Product) => void;
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (newItemsPerPage: number) => void;
  handleToggleFloatingIcons: () => void;
  handleToggleMobileSearch: () => void;
  handleCloseMobileSearch: () => void;
}

export function useAppState(): [AppState, AppActions] {
  // Consolidated State
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [currentAdminView, setCurrentAdminView] = useState<AdminView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPaginationPage, setCurrentPaginationPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFloatingIconsVisible, setIsFloatingIconsVisible] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  // Initialize mobile state immediately based on window width
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminChatOpen, setIsAdminChatOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [testAdminUser, setTestAdminUser] = useState<any>(null);
  const [isBootstrapIconsLoaded, setIsBootstrapIconsLoaded] = useState(false);
  // Initialize splash screen for mobile users on first load
  const [isSplashScreenVisible, setIsSplashScreenVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      const isMobileView = window.innerWidth < 768;
      const hasSeenSplash = sessionStorage.getItem('bato-splash-seen');
      
      // Show splash screen immediately if mobile and hasn't been seen
      if (isMobileView && !hasSeenSplash) {
        return true;
      }
    }
    return false;
  });

  // Live Streaming State
  const [currentStream, setCurrentStream] = useState<any | null>(null);
  const [isStreamPlaying, setIsStreamPlaying] = useState(false);
  const [streamQuality, setStreamQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [streams, setStreams] = useState<any[]>([]);
  const [isStreamGridOpen, setIsStreamGridOpen] = useState(false);
  const [selectedStreamCategory, setSelectedStreamCategory] = useState('all');
  const [isMobileStreamViewer, setIsMobileStreamViewer] = useState(false);
  const [streamProducts, setStreamProducts] = useState<any[]>([]);
  const [selectedStreamProduct, setSelectedStreamProduct] = useState<any | null>(null);
  const [isProductOverlayVisible, setIsProductOverlayVisible] = useState(false);
  
  // Package Tracking State
  const [trackingData, setTrackingData] = useState<{ trackingNumber: string; orderNumber: string; orderData?: any } | null>(null);
  
  // Order Details State
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  // Complex Action Handlers
  const handleQuickView = useCallback((product: Product) => {
    setSelectedProduct(product);
    
    if (isMobile) {
      navigateToPage('product-details');
    } else {
      setIsModalOpen(true);
    }
  }, [isMobile]);

  const navigateToPage = useCallback((page: PageType) => {
    setCurrentPage(page);
    if (page !== 'admin-dashboard') {
      setCurrentAdminView('dashboard');
    }
    
    if (!['home', 'live-streams', 'new-arrivals', 'dresses', 'tops', 'accessories'].includes(page)) {
      setIsFloatingIconsVisible(false);
      setIsMobileSearchOpen(false);
    }
    
    setCurrentPaginationPage(1);
    
    switch (page) {
      case 'new-arrivals':
        setFilterCategory('all');
        break;
      case 'dresses':
        setFilterCategory('dresses');
        break;
      case 'tops':
        setFilterCategory('tops');
        break;
      case 'accessories':
        setFilterCategory('accessories');
        break;
      default:
        if (page === 'home') {
          setSearchQuery('');
          setFilterCategory('all');
          setSortBy('featured');
        }
        break;
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPaginationPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPaginationPage(1);
  }, []);

  const handleToggleFloatingIcons = useCallback(() => {
    setIsFloatingIconsVisible(prev => !prev);
  }, []);

  const handleToggleMobileSearch = useCallback(() => {
    setIsMobileSearchOpen(prev => !prev);
  }, []);

  const handleCloseMobileSearch = useCallback(() => {
    setIsMobileSearchOpen(false);
  }, []);

  // Live Streaming Action Handlers
  const playStream = useCallback((streamId: string) => {
    const stream = streams.find(s => s.id === streamId);
    if (stream) {
      setCurrentStream(stream);
      setIsStreamPlaying(true);
      setStreamProducts(stream.products || []);
    }
  }, [streams]);

  const pauseStream = useCallback(() => {
    setIsStreamPlaying(false);
  }, []);

  const switchStream = useCallback((streamId: string) => {
    const stream = streams.find(s => s.id === streamId);
    if (stream) {
      setCurrentStream(stream);
      setIsStreamPlaying(true);
      setStreamProducts(stream.products || []);
      setSelectedStreamProduct(null);
    }
  }, [streams]);

  const openStreamGrid = useCallback(() => {
    setIsStreamGridOpen(true);
  }, []);

  const closeStreamGrid = useCallback(() => {
    setIsStreamGridOpen(false);
  }, []);

  const filterStreamsByCategory = useCallback((category: string) => {
    setSelectedStreamCategory(category);
  }, []);

  const toggleProductOverlay = useCallback(() => {
    setIsProductOverlayVisible(prev => !prev);
  }, []);

  const selectStreamProduct = useCallback((product: any) => {
    setSelectedStreamProduct(product);
  }, []);

  // State Object
  const state: AppState = useMemo(() => ({
    currentPage,
    currentAdminView,
    searchQuery,
    sortBy,
    filterCategory,
    currentPaginationPage,
    itemsPerPage,
    selectedProduct,
    isModalOpen,
    isFloatingIconsVisible,
    isMobileSearchOpen,
    isMobile,
    isChatOpen,
    isAdminChatOpen,
    isAdminMode,
    testAdminUser,
    isBootstrapIconsLoaded,
    isSplashScreenVisible,
    currentStream,
    isStreamPlaying,
    streamQuality,
    streams,
    isStreamGridOpen,
    selectedStreamCategory,
    isMobileStreamViewer,
    streamProducts,
    selectedStreamProduct,
    isProductOverlayVisible,
    trackingData,
    selectedOrderDetails
  }), [
    currentPage,
    currentAdminView,
    searchQuery,
    sortBy,
    filterCategory,
    currentPaginationPage,
    itemsPerPage,
    selectedProduct,
    isModalOpen,
    isFloatingIconsVisible,
    isMobileSearchOpen,
    isMobile,
    isChatOpen,
    isAdminChatOpen,
    isAdminMode,
    testAdminUser,
    isBootstrapIconsLoaded,
    isSplashScreenVisible,
    currentStream,
    isStreamPlaying,
    streamQuality,
    streams,
    isStreamGridOpen,
    selectedStreamCategory,
    isMobileStreamViewer,
    streamProducts,
    selectedStreamProduct,
    isProductOverlayVisible,
    trackingData,
    selectedOrderDetails
  ]);

  // Actions Object
  const actions: AppActions = useMemo(() => ({
    setCurrentPage,
    setCurrentAdminView,
    navigateToPage,
    setSearchQuery,
    setSortBy,
    setFilterCategory,
    setCurrentPaginationPage,
    setItemsPerPage,
    setSelectedProduct,
    setIsModalOpen,
    setIsFloatingIconsVisible,
    setIsMobileSearchOpen,
    setIsMobile,
    setIsChatOpen,
    setIsAdminChatOpen,
    setIsAdminMode,
    setTestAdminUser,
    setIsBootstrapIconsLoaded,
    setIsSplashScreenVisible,
    setCurrentStream,
    setIsStreamPlaying,
    setStreamQuality,
    setStreams,
    setIsStreamGridOpen,
    setSelectedStreamCategory,
    setIsMobileStreamViewer,
    setStreamProducts,
    setSelectedStreamProduct,
    setIsProductOverlayVisible,
    setTrackingData,
    setSelectedOrderDetails,
    playStream,
    pauseStream,
    switchStream,
    openStreamGrid,
    closeStreamGrid,
    filterStreamsByCategory,
    toggleProductOverlay,
    selectStreamProduct,
    handleQuickView,
    handlePageChange,
    handleItemsPerPageChange,
    handleToggleFloatingIcons,
    handleToggleMobileSearch,
    handleCloseMobileSearch
  }), [
    navigateToPage,
    playStream,
    pauseStream,
    switchStream,
    openStreamGrid,
    closeStreamGrid,
    filterStreamsByCategory,
    toggleProductOverlay,
    selectStreamProduct,
    handleQuickView,
    handlePageChange,
    handleItemsPerPageChange,
    handleToggleFloatingIcons,
    handleToggleMobileSearch,
    handleCloseMobileSearch,
    streams
  ]);

  return [state, actions];
}