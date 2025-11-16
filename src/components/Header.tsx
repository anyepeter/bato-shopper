import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronRight } from "lucide-react";
import { PageType, AdminView } from "../types";
import batoLogo from 'figma:asset/39788f429fb25d9683496a9972848a7efa9ddd0a.png';
import { comprehensiveCategories, CategoryItem } from "../constants/comprehensiveCategories";
import { useSwipeNavigation, triggerHapticFeedback } from "../hooks/useSwipeNavigation";

interface HeaderProps {
  cartItemsCount: number;
  favoriteItemsCount: number;
  onCartClick: () => void;
  onNavigateToPage: (page: PageType) => void;
  onNavigateToFavorites: () => void;
  currentUser?: any;
  onSignOut: () => void;
  currentPage: PageType;
  onAdminNavigate: (view: AdminView) => void;
  currentAdminView: AdminView;
}

export function Header({
  cartItemsCount,
  favoriteItemsCount,
  onCartClick,
  onNavigateToPage,
  onNavigateToFavorites,
  currentUser,
  onSignOut,
  currentPage,
  onAdminNavigate,
  currentAdminView
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0);
  
  // Hierarchical navigation states
  const [viewState, setViewState] = useState<'main' | 'subcategories' | 'deep-subcategories'>('main');
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<CategoryItem | null>(null);
  const [currentSubcategoryPage, setCurrentSubcategoryPage] = useState(0);
  const [currentDeepSubcategoryPage, setCurrentDeepSubcategoryPage] = useState(0);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle navigation with click animation
  const handleNavigation = (page: PageType, itemKey: string) => {
    setClickedItem(itemKey);
    onNavigateToPage(page);
    handleCloseMobileMenu();
    
    // Reset click animation after a short delay
    setTimeout(() => {
      setClickedItem(null);
    }, 300);
  };

  // Handle closing mobile menu with state reset
  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
    // Reset navigation state when closing menu
    setViewState('main');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setCurrentCategoryPage(0);
    setCurrentSubcategoryPage(0);
    setCurrentDeepSubcategoryPage(0);
  };

  // Handle admin navigation with click animation
  const handleAdminNavigation = (view: AdminView, itemKey: string) => {
    setClickedItem(itemKey);
    onAdminNavigate(view);
    handleCloseMobileMenu();
    
    // Reset click animation after a short delay
    setTimeout(() => {
      setClickedItem(null);
    }, 300);
  };

  // Get navigation item styling with blink animation only
  const getNavItemStyles = (itemKey: string, isActive: boolean = false) => {
    const isHovered = hoveredItem === itemKey;
    const isClicked = clickedItem === itemKey;
    
    return {
      color: 'var(--pure-white)',
      transition: 'all 0.3s ease',
      transform: isClicked ? 'scale(0.95)' : 'scale(1)',
      borderRadius: '0px' // Always 0px for navigation items
    };
  };

  // Get icon button styling with blink animation only
  const getIconButtonStyles = (itemKey: string, isActive: boolean = false) => {
    const isHovered = hoveredItem === itemKey;
    const isClicked = clickedItem === itemKey;
    
    return {
      color: 'var(--pure-white)',
      transition: 'all 0.3s ease',
      transform: isClicked ? 'scale(0.95)' : 'scale(1)',
      borderRadius: '0px' // Always 0px for icon buttons
    };
  };

  // Get logo container styling with simple blink animation only
  const getLogoContainerStyles = () => {
    const isHovered = hoveredItem === 'logo';
    const isClicked = clickedItem === 'logo';
    
    return {
      transition: 'all 0.3s ease',
      transform: isClicked ? 'scale(0.95)' : 'scale(1)',
      width: 'auto', // 🔥 Auto width to fit content exactly  
      height: 'auto', // 🔥 Auto height to fit content exactly
      position: 'relative' as const,
      zIndex: 10,
      overflow: 'visible' as const,
      borderRadius: '0px' // Always 0px for logo container
    };
  };

  // Main navigation items - reduced for mobile when bottom nav is present
  const mainNavItems = isMobile ? [
    // Fewer items since Home, Shop categories, Cart, Favorites, Account are in bottom nav
    { key: 'live-streams', label: 'Live Streams', page: 'live-streams' as PageType }
  ] : [
    // Full desktop navigation
    { key: 'home', label: 'Home', page: 'home' as PageType },
    { key: 'live-streams', label: 'Live Streams', page: 'live-streams' as PageType },
    { key: 'new-arrivals', label: 'New Arrivals', page: 'new-arrivals' as PageType }
  ];

  // Customer care items
  const customerCareItems = [
    { key: 'contact', label: 'Contact Us', page: 'contact' as PageType },
    { key: 'shipping', label: 'Shipping Info', page: 'shipping' as PageType },
    { key: 'returns', label: 'Returns', page: 'returns' as PageType },
    { key: 'size-guide', label: 'Size Guide', page: 'size-guide' as PageType }
  ];

  // Admin navigation items
  const adminNavItems = [
    { key: 'dashboard', label: 'Dashboard', view: 'dashboard' as AdminView },
    { key: 'products', label: 'Products', view: 'products' as AdminView },
    { key: 'users', label: 'Users', view: 'users' as AdminView },
    { key: 'analytics', label: 'Analytics', view: 'analytics' as AdminView },
    { key: 'reviews', label: 'Reviews', view: 'reviews' as AdminView }
  ];

  // Mobile categories pagination
  const categoriesPerPage = 6;
  const totalPages = Math.ceil(comprehensiveCategories.length / categoriesPerPage);
  
  const getCurrentPageCategories = () => {
    const startIndex = currentCategoryPage * categoriesPerPage;
    const endIndex = startIndex + categoriesPerPage;
    return comprehensiveCategories.slice(startIndex, endIndex);
  };

  // Subcategory pagination utilities
  const getCurrentSubcategories = () => {
    if (!selectedCategory?.subcategories) return [];
    const startIndex = currentSubcategoryPage * categoriesPerPage;
    const endIndex = startIndex + categoriesPerPage;
    return selectedCategory.subcategories.slice(startIndex, endIndex);
  };

  const getCurrentDeepSubcategories = () => {
    if (!selectedSubcategory?.subcategories) return [];
    const startIndex = currentDeepSubcategoryPage * categoriesPerPage;
    const endIndex = startIndex + categoriesPerPage;
    return selectedSubcategory.subcategories.slice(startIndex, endIndex);
  };

  const getSubcategoryTotalPages = () => {
    if (!selectedCategory?.subcategories) return 0;
    return Math.ceil(selectedCategory.subcategories.length / categoriesPerPage);
  };

  const getDeepSubcategoryTotalPages = () => {
    if (!selectedSubcategory?.subcategories) return 0;
    return Math.ceil(selectedSubcategory.subcategories.length / categoriesPerPage);
  };

  // Handle category navigation with enhanced UX
  const handleNextCategories = () => {
    if (viewState === 'main' && currentCategoryPage < totalPages - 1) {
      triggerHapticFeedback('light');
      setCurrentCategoryPage(prev => prev + 1);
    } else if (viewState === 'subcategories' && currentSubcategoryPage < getSubcategoryTotalPages() - 1) {
      triggerHapticFeedback('light');
      setCurrentSubcategoryPage(prev => prev + 1);
    } else if (viewState === 'deep-subcategories' && currentDeepSubcategoryPage < getDeepSubcategoryTotalPages() - 1) {
      triggerHapticFeedback('light');
      setCurrentDeepSubcategoryPage(prev => prev + 1);
    }
  };

  const handlePrevCategories = () => {
    if (viewState === 'main' && currentCategoryPage > 0) {
      triggerHapticFeedback('light');
      setCurrentCategoryPage(prev => prev - 1);
    } else if (viewState === 'subcategories' && currentSubcategoryPage > 0) {
      triggerHapticFeedback('light');
      setCurrentSubcategoryPage(prev => prev - 1);
    } else if (viewState === 'deep-subcategories' && currentDeepSubcategoryPage > 0) {
      triggerHapticFeedback('light');
      setCurrentDeepSubcategoryPage(prev => prev - 1);
    }
  };

  // Navigate to category subcategories
  const handleCategoryClick = (category: CategoryItem) => {
    if (category.subcategories && category.subcategories.length > 0) {
      triggerHapticFeedback('medium');
      setSelectedCategory(category);
      setCurrentSubcategoryPage(0);
      setViewState('subcategories');
    } else {
      // Navigate directly to category page if no subcategories
      triggerHapticFeedback('medium');
      console.log(`Navigate to category: ${category.key}`);
      handleCloseMobileMenu();
    }
  };

  // Navigate to subcategory deep categories
  const handleSubcategoryClick = (subcategory: CategoryItem) => {
    if (subcategory.subcategories && subcategory.subcategories.length > 0) {
      triggerHapticFeedback('medium');
      setSelectedSubcategory(subcategory);
      setCurrentDeepSubcategoryPage(0);
      setViewState('deep-subcategories');
    } else {
      // Navigate directly to subcategory page if no deep subcategories
      triggerHapticFeedback('medium');
      console.log(`Navigate to subcategory: ${subcategory.key}`);
      handleCloseMobileMenu();
    }
  };

  // Navigate back in hierarchy
  const handleBackNavigation = () => {
    triggerHapticFeedback('light');
    if (viewState === 'deep-subcategories') {
      setViewState('subcategories');
      setSelectedSubcategory(null);
      setCurrentDeepSubcategoryPage(0);
    } else if (viewState === 'subcategories') {
      setViewState('main');
      setSelectedCategory(null);
      setCurrentSubcategoryPage(0);
    }
  };

  // Enhanced swipe navigation with haptic feedback
  const { handleTouchStart, handleTouchEnd, handleTouchMove, isTransitioning } = useSwipeNavigation({
    minSwipeDistance: 60,
    maxVerticalDistance: 80,
    onSwipeLeft: handleNextCategories,
    onSwipeRight: handlePrevCategories
  });

  // Get current view pagination info
  const getCurrentPaginationInfo = () => {
    switch (viewState) {
      case 'main':
        return {
          currentPage: currentCategoryPage,
          totalPages: totalPages,
          items: getCurrentPageCategories(),
          canGoNext: currentCategoryPage < totalPages - 1,
          canGoPrev: currentCategoryPage > 0
        };
      case 'subcategories':
        return {
          currentPage: currentSubcategoryPage,
          totalPages: getSubcategoryTotalPages(),
          items: getCurrentSubcategories(),
          canGoNext: currentSubcategoryPage < getSubcategoryTotalPages() - 1,
          canGoPrev: currentSubcategoryPage > 0
        };
      case 'deep-subcategories':
        return {
          currentPage: currentDeepSubcategoryPage,
          totalPages: getDeepSubcategoryTotalPages(),
          items: getCurrentDeepSubcategories(),
          canGoNext: currentDeepSubcategoryPage < getDeepSubcategoryTotalPages() - 1,
          canGoPrev: currentDeepSubcategoryPage > 0
        };
      default:
        return {
          currentPage: 0,
          totalPages: 0,
          items: [],
          canGoNext: false,
          canGoPrev: false
        };
    }
  };

  const paginationInfo = getCurrentPaginationInfo();

  // Render comprehensive categories dropdown
  const renderCategoriesDropdown = () => (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setHoveredItem(hoveredItem === 'shop-categories' ? null : 'shop-categories')}
        onMouseEnter={() => setHoveredItem('shop-categories')}
        onMouseLeave={() => setTimeout(() => {
          if (hoveredCategory === null) {
            setHoveredItem(null);
          }
        }, 200)}
        className={`px-4 py-2 font-medium font-body transition-all duration-300 ${
          (hoveredItem === 'shop-categories' || clickedItem === 'shop-categories') ? 'animate-pulse' : ''
        }`}
        style={{
          color: 'var(--pure-white)',
          backgroundColor: 'rgba(88, 37, 239, 0.1)',
          border: '0.5px solid rgba(88, 37, 239, 0.3)',
          borderRadius: '0px',
          transition: 'all 0.3s ease',
          transform: clickedItem === 'shop-categories' ? 'scale(0.95)' : 'scale(1)'
        }}
        title="Shop All Categories"
      >
        🛍️ Shop All Categories ▼
      </motion.button>
      
      {/* Main Categories Dropdown */}
      <AnimatePresence>
        {hoveredItem === 'shop-categories' && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            className="absolute top-full left-0 mt-2 py-3 w-80 z-[99999]"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              border: '1px solid rgba(88, 37, 239, 0.3)',
              borderRadius: '0px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onMouseEnter={() => setHoveredItem('shop-categories')}
            onMouseLeave={() => {
              if (hoveredCategory === null) {
                setHoveredItem(null);
              }
            }}
          >
            <div className="grid grid-cols-2 gap-1 p-2">
              {comprehensiveCategories.map((category, index) => (
                <motion.div
                  key={category.key}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.03,
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                  onMouseEnter={() => setHoveredCategory(category.key)}
                  onMouseLeave={() => setTimeout(() => setHoveredCategory(null), 100)}
                >
                  <motion.button
                    whileHover={{ 
                      backgroundColor: 'rgba(88, 37, 239, 0.2)',
                      scale: 1.02,
                      x: 4
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      console.log(`Navigate to category: ${category.key}`);
                      // You can implement navigation to category page here
                      setHoveredItem(null);
                      setHoveredCategory(null);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium font-body transition-all duration-300 rounded-md flex items-center justify-between group"
                    style={{ color: 'var(--pure-white)' }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.span 
                        className="text-lg"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {category.emoji}
                      </motion.span>
                      <span className="line-clamp-1">{category.label}</span>
                    </div>
                    {category.subcategories && (
                      <motion.div
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <ChevronRight className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    )}
                  </motion.button>
                  
                  {/* Subcategories Level 2 Dropdown */}
                  {category.subcategories && hoveredCategory === category.key && (
                    <motion.div
                      initial={{ opacity: 0, x: -20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.9 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                        delay: 0.1
                      }}
                      className="absolute top-0 left-full ml-2 py-3 w-72 z-[99999]"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.98)',
                        border: '1px solid rgba(88, 37, 239, 0.3)',
                        borderRadius: '0px',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.7)',
                        maxHeight: '70vh',
                        overflowY: 'auto'
                      }}
                      onMouseEnter={() => setHoveredCategory(category.key)}
                      onMouseLeave={() => {
                        if (hoveredSubcategory === null) {
                          setHoveredCategory(null);
                        }
                      }}
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 mb-2 border-b border-gray-700">
                          <h3 className="font-semibold font-heading text-white text-sm flex items-center gap-2">
                            {category.emoji} {category.label}
                          </h3>
                          {category.description && (
                            <p className="text-xs text-gray-300 mt-1">{category.description}</p>
                          )}
                        </div>
                        
                        {category.subcategories.map((subcategory, subIndex) => (
                          <motion.div
                            key={subcategory.key}
                            className="relative"
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              delay: subIndex * 0.02,
                              type: "spring",
                              stiffness: 450,
                              damping: 25
                            }}
                            onMouseEnter={() => setHoveredSubcategory(subcategory.key)}
                            onMouseLeave={() => setTimeout(() => setHoveredSubcategory(null), 100)}
                          >
                            <motion.button
                              whileHover={{ 
                                backgroundColor: 'rgba(88, 37, 239, 0.15)',
                                scale: 1.02,
                                x: 3
                              }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                console.log(`Navigate to subcategory: ${subcategory.key}`);
                                // You can implement navigation to subcategory page here
                                setHoveredItem(null);
                                setHoveredCategory(null);
                                setHoveredSubcategory(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm font-medium font-body transition-all duration-300 rounded-md flex items-center justify-between group"
                              style={{ color: 'var(--pure-white)' }}
                            >
                              <div className="flex items-center gap-2">
                                <motion.span 
                                  className="text-sm"
                                  whileHover={{ scale: 1.15, rotate: 3 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  {subcategory.emoji}
                                </motion.span>
                                <span className="line-clamp-1">{subcategory.label}</span>
                              </div>
                              {subcategory.subcategories && (
                                <motion.div
                                  whileHover={{ x: 2 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  <ChevronRight className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                              )}
                            </motion.button>
                            
                            {/* Subcategories Level 3 Dropdown */}
                            {subcategory.subcategories && hoveredSubcategory === subcategory.key && (
                              <motion.div
                                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                                transition={{ 
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 30,
                                  delay: 0.05
                                }}
                                className="absolute top-0 left-full ml-2 py-3 w-60 z-[99999]"
                                style={{
                                  backgroundColor: 'rgba(0, 0, 0, 0.98)',
                                  border: '1px solid rgba(88, 37, 239, 0.3)',
                                  borderRadius: '0px',
                                  backdropFilter: 'blur(20px)',
                                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
                                  maxHeight: '60vh',
                                  overflowY: 'auto'
                                }}
                                onMouseEnter={() => setHoveredSubcategory(subcategory.key)}
                                onMouseLeave={() => setHoveredSubcategory(null)}
                              >
                                <div className="p-2">
                                  <motion.div 
                                    className="px-3 py-2 mb-2 border-b border-gray-700"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                  >
                                    <h4 className="font-semibold font-heading text-white text-xs flex items-center gap-2">
                                      <motion.span
                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                      >
                                        {subcategory.emoji}
                                      </motion.span>
                                      {subcategory.label}
                                    </h4>
                                  </motion.div>
                                  
                                  {subcategory.subcategories.map((deepSubcategory, deepIndex) => (
                                    <motion.button
                                      key={deepSubcategory.key}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ 
                                        delay: deepIndex * 0.02,
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 25
                                      }}
                                      whileHover={{ 
                                        backgroundColor: 'rgba(88, 37, 239, 0.15)',
                                        scale: 1.02,
                                        x: 2
                                      }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => {
                                        console.log(`Navigate to deep subcategory: ${deepSubcategory.key}`);
                                        // You can implement navigation to deep subcategory page here
                                        setHoveredItem(null);
                                        setHoveredCategory(null);
                                        setHoveredSubcategory(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm font-medium font-body transition-all duration-300 rounded-md flex items-center gap-2"
                                      style={{ color: 'var(--pure-white)' }}
                                    >
                                      <motion.span 
                                        className="text-xs"
                                        whileHover={{ scale: 1.1, rotate: 2 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                      >
                                        {deepSubcategory.emoji}
                                      </motion.span>
                                      <span className="line-clamp-1">{deepSubcategory.label}</span>
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Quick Access Popular Categories */}
            <motion.div 
              className="border-t border-gray-700 mt-3 pt-3 px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <motion.p 
                className="text-xs font-medium font-body text-gray-400 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Popular Categories
              </motion.p>
              <div className="flex flex-wrap gap-2">
                {['clothing-shoes-jewelry', 'electronics', 'home-kitchen', 'beauty-personal-care', 'sports-outdoors'].map((popularKey, index) => {
                  const popularCategory = comprehensiveCategories.find(cat => cat.key === popularKey);
                  if (!popularCategory) return null;
                  
                  return (
                    <motion.button
                      key={popularKey}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        delay: 0.4 + (index * 0.05),
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                      whileHover={{ 
                        scale: 1.08,
                        y: -2,
                        backgroundColor: 'rgba(88, 37, 239, 0.4)',
                        boxShadow: '0 4px 12px rgba(88, 37, 239, 0.3)'
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        console.log(`Navigate to popular category: ${popularKey}`);
                        setHoveredItem(null);
                        setHoveredCategory(null);
                      }}
                      className="px-2 py-1 text-xs font-medium font-body rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: 'rgba(88, 37, 239, 0.2)',
                        color: 'var(--pure-white)',
                        border: '1px solid rgba(88, 37, 239, 0.3)'
                      }}
                    >
                      <motion.span
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {popularCategory.emoji}
                      </motion.span>{' '}
                      {popularCategory.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderDesktopNav = () => (
    <div className="hidden md:flex items-center space-x-1">
      {currentPage === 'admin-dashboard' ? (
        // Admin Navigation
        adminNavItems.map((item) => (
          <motion.button
            key={item.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAdminNavigation(item.view, item.key)}
            onMouseEnter={() => setHoveredItem(item.key)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`px-4 py-2 font-medium font-body transition-all duration-300 ${
              (hoveredItem === item.key || clickedItem === item.key) ? 'animate-pulse' : ''
            }`}
            style={getNavItemStyles(item.key, currentAdminView === item.view)}
          >
            {item.label}
          </motion.button>
        ))
      ) : (
        <>
          {/* Main Navigation */}
          {mainNavItems.map((item) => (
            <motion.button
              key={item.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigation(item.page, item.key)}
              onMouseEnter={() => setHoveredItem(item.key)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`px-4 py-2 font-medium font-body transition-all duration-300 ${
                (hoveredItem === item.key || clickedItem === item.key) ? 'animate-pulse' : ''
              }`}
              style={getNavItemStyles(item.key, currentPage === item.page)}
            >
              {item.label}
            </motion.button>
          ))}
          
          {/* Comprehensive Categories Dropdown */}
          {renderCategoriesDropdown()}

        </>
      )}
    </div>
  );

  const renderMobileMenu = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t"
          style={{ 
            borderColor: 'rgba(255, 255, 255, 0.1)',
            backgroundColor: '#000000',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="px-4 py-4 space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              {currentPage === 'admin-dashboard' ? (
                // Admin Navigation
                adminNavItems.map((item) => (
                  <motion.button
                    key={item.key}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAdminNavigation(item.view, item.key)}
                    onMouseEnter={() => setHoveredItem(item.key)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full text-left px-4 py-3 font-medium font-body transition-all duration-300 ${
                      (hoveredItem === item.key || clickedItem === item.key) ? 'animate-pulse' : ''
                    }`}
                    style={getNavItemStyles(item.key, currentAdminView === item.view)}
                  >
                    {item.label}
                  </motion.button>
                ))
              ) : (
                <>
                  {/* Main Nav Items */}
                  {mainNavItems.map((item) => (
                    <motion.button
                      key={item.key}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item.page, item.key)}
                      onMouseEnter={() => setHoveredItem(item.key)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`w-full text-left px-4 py-3 font-medium font-body transition-all duration-300 ${
                        (hoveredItem === item.key || clickedItem === item.key) ? 'animate-pulse' : ''
                      }`}
                      style={getNavItemStyles(item.key, currentPage === item.page)}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </>
              )}
            </div>

            {/* Shop Categories Section - Mobile */}
            {/* 🛍️ Shop Categories - Desktop & Tablet Only (Hidden on Mobile) */}
            {currentPage !== 'admin-dashboard' && !isMobile && (
              <>
                <div 
                  className="h-px my-4"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
                <div className="space-y-1">
                  <p 
                    className="px-4 py-2 font-semibold font-heading opacity-90"
                    style={{ color: 'var(--pure-white)' }}
                  >
                    🛍️ Shop Categories
                  </p>
                  
                  {/* Categories Navigation with Swipe Support */}
                  <div className="px-4 py-2">
                    {/* Navigation Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Back Button */}
                        {viewState !== 'main' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBackNavigation}
                            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium font-body"
                            style={{
                              backgroundColor: 'rgba(88, 37, 239, 0.15)',
                              color: 'rgba(88, 37, 239, 1)',
                              border: '1px solid rgba(88, 37, 239, 0.3)'
                            }}
                          >
                            <span>←</span>
                            <span>Back</span>
                          </motion.button>
                        )}

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-body">
                          <span className={viewState === 'main' ? 'text-white font-medium' : ''}>
                            Categories
                          </span>
                          {selectedCategory && (
                            <>
                              <span>›</span>
                              <span className={viewState === 'subcategories' ? 'text-white font-medium' : ''}>
                                {selectedCategory.label}
                              </span>
                            </>
                          )}
                          {selectedSubcategory && (
                            <>
                              <span>›</span>
                              <span className={viewState === 'deep-subcategories' ? 'text-white font-medium' : ''}>
                                {selectedSubcategory.label}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Page Indicators */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: paginationInfo.totalPages }).map((_, index) => (
                          <motion.div
                            key={index}
                            className="w-2 h-2 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: paginationInfo.currentPage === index 
                                ? 'rgba(88, 37, 239, 1)' 
                                : 'rgba(88, 37, 239, 0.3)'
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-gray-400 font-body">
                        {paginationInfo.currentPage + 1} of {paginationInfo.totalPages}
                      </div>
                    </div>

                    {/* Categories Grid with Swipe Support */}
                    <motion.div 
                      className="relative overflow-hidden"
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      style={{ touchAction: 'pan-x' }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${viewState}-${paginationInfo.currentPage}`}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            duration: 0.3
                          }}
                          className="grid grid-cols-2 gap-2"
                        >
                          {paginationInfo.items.map((item, index) => (
                            <motion.button
                              key={item.key}
                              initial={{ opacity: 0, scale: 0.9, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ 
                                delay: index * 0.05,
                                type: "spring",
                                stiffness: 400,
                                damping: 25
                              }}
                              whileHover={{ 
                                scale: 1.02,
                                backgroundColor: 'rgba(88, 37, 239, 0.15)'
                              }}
                              whileTap={{ 
                                scale: 0.95,
                                backgroundColor: 'rgba(88, 37, 239, 0.25)'
                              }}
                              onClick={() => {
                                if (viewState === 'main') {
                                  handleCategoryClick(item);
                                } else if (viewState === 'subcategories') {
                                  handleSubcategoryClick(item);
                                } else {
                                  // Deep subcategory - navigate to final page
                                  triggerHapticFeedback('medium');
                                  console.log(`Navigate to deep subcategory: ${item.key}`);
                                  handleCloseMobileMenu();
                                }
                              }}
                              className="w-full text-left px-3 py-3 text-sm font-medium font-body transition-all duration-300 rounded-md min-h-[56px] flex items-center"
                              style={{
                                color: 'var(--pure-white)',
                                backgroundColor: 'rgba(88, 37, 239, 0.1)',
                                border: '0.5px solid rgba(88, 37, 239, 0.3)'
                              }}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <motion.span 
                                  className="text-lg"
                                  whileHover={{ scale: 1.2, rotate: 5 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  {item.emoji}
                                </motion.span>
                                <span className="line-clamp-1 text-xs flex-1">{item.label}</span>
                                {/* Arrow indicator for items with subcategories */}
                                {((viewState === 'main' && item.subcategories) || 
                                  (viewState === 'subcategories' && item.subcategories)) && (
                                  <motion.span
                                    className="text-xs opacity-60"
                                    whileHover={{ x: 2, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  >
                                    →
                                  </motion.span>
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                    
                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between mt-4 gap-3">
                      <motion.button
                        whileHover={{ 
                          scale: 1.02,
                          backgroundColor: !paginationInfo.canGoPrev ? 'rgba(88, 37, 239, 0.1)' : 'rgba(88, 37, 239, 0.25)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (paginationInfo.canGoPrev && !isTransitioning) {
                            handlePrevCategories();
                          }
                        }}
                        disabled={!paginationInfo.canGoPrev || isTransitioning}
                        className="flex-1 px-4 py-3 text-sm font-medium font-body transition-all duration-300 rounded-md flex items-center justify-center gap-2"
                        style={{
                          color: !paginationInfo.canGoPrev ? 'rgba(255, 255, 255, 0.5)' : 'var(--pure-white)',
                          backgroundColor: !paginationInfo.canGoPrev ? 'rgba(88, 37, 239, 0.1)' : 'rgba(88, 37, 239, 0.2)',
                          border: `1px solid ${!paginationInfo.canGoPrev ? 'rgba(88, 37, 239, 0.2)' : 'rgba(88, 37, 239, 0.4)'}`,
                          opacity: isTransitioning ? 0.6 : 1
                        }}
                      >
                        <motion.span
                          animate={{ x: isTransitioning ? -2 : 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          ←
                        </motion.span>
                        Previous
                      </motion.button>

                      <motion.button
                        whileHover={{ 
                          scale: 1.02,
                          backgroundColor: !paginationInfo.canGoNext ? 'rgba(88, 37, 239, 0.1)' : 'rgba(88, 37, 239, 0.25)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (paginationInfo.canGoNext && !isTransitioning) {
                            handleNextCategories();
                          }
                        }}
                        disabled={!paginationInfo.canGoNext || isTransitioning}
                        className="flex-1 px-4 py-3 text-sm font-medium font-body transition-all duration-300 rounded-md flex items-center justify-center gap-2"
                        style={{
                          color: !paginationInfo.canGoNext ? 'rgba(255, 255, 255, 0.5)' : 'var(--pure-white)',
                          backgroundColor: !paginationInfo.canGoNext ? 'rgba(88, 37, 239, 0.1)' : 'rgba(88, 37, 239, 0.2)',
                          border: `1px solid ${!paginationInfo.canGoNext ? 'rgba(88, 37, 239, 0.2)' : 'rgba(88, 37, 239, 0.4)'}`,
                          opacity: isTransitioning ? 0.6 : 1
                        }}
                      >
                        Next
                        <motion.span
                          animate={{ x: isTransitioning ? 2 : 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          →
                        </motion.span>
                      </motion.button>
                    </div>

                    {/* Swipe Hint */}
                    <motion.div 
                      className="text-center mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p className="text-xs text-gray-500 font-body">
                        {viewState === 'main' && '💡 Swipe left/right to browse categories'}
                        {viewState === 'subcategories' && '💡 Swipe to browse subcategories'}
                        {viewState === 'deep-subcategories' && '💡 Swipe to browse items'}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </>
            )}

            {/* Customer Care Section (only for non-admin pages) */}
            {currentPage !== 'admin-dashboard' && (
              <>
                <div 
                  className="h-px my-4"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
                <div className="space-y-1">
                  <p 
                    className="px-4 py-2 font-semibold font-heading opacity-90"
                    style={{ color: 'var(--pure-white)' }}
                  >
                    Customer Care
                  </p>
                  {customerCareItems.map((item) => (
                    <motion.button
                      key={item.key}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item.page, item.key)}
                      onMouseEnter={() => setHoveredItem(item.key)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`w-full text-left px-4 py-3 font-medium font-body transition-all duration-300 ${
                        (hoveredItem === item.key || clickedItem === item.key) ? 'animate-pulse' : ''
                      }`}
                      style={getNavItemStyles(item.key, currentPage === item.page)}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              </>
            )}

            {/* User Account Section - Hidden on Mobile (handled by bottom nav) */}
            {!isMobile && (
              <>
                <div 
                  className="h-px my-4"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
                <div className="space-y-1">
                  {currentUser ? (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigation('profile', 'profile')}
                        onMouseEnter={() => setHoveredItem('profile')}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`w-full text-left px-4 py-3 font-medium font-body transition-all duration-300 ${
                          (hoveredItem === 'profile' || clickedItem === 'profile') ? 'animate-pulse' : ''
                        }`}
                        style={getNavItemStyles('profile', currentPage === 'profile')}
                      >
                        My Profile
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setClickedItem('sign-out');
                          onSignOut();
                          setIsMobileMenuOpen(false);
                          setTimeout(() => setClickedItem(null), 300);
                        }}
                        onMouseEnter={() => setHoveredItem('sign-out')}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`w-full text-left px-4 py-3 font-medium font-body transition-all duration-300 ${
                          (hoveredItem === 'sign-out' || clickedItem === 'sign-out') ? 'animate-pulse' : ''
                        }`}
                        style={getNavItemStyles('sign-out')}
                      >
                        Sign Out
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigation('sign-in', 'sign-in')}
                        onMouseEnter={() => setHoveredItem('sign-in')}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`w-full text-left px-4 py-3 font-medium font-body transition-all duration-300 ${
                          (hoveredItem === 'sign-in' || clickedItem === 'sign-in') ? 'animate-pulse' : ''
                        }`}
                        style={getNavItemStyles('sign-in', currentPage === 'sign-in')}
                      >
                        Sign In
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigation('create-account', 'create-account')}
                        onMouseEnter={() => setHoveredItem('create-account')}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`w-full text-left px-4 py-3 font-medium font-body transition-all duration-300 ${
                          (hoveredItem === 'create-account' || clickedItem === 'create-account') ? 'animate-pulse' : ''
                        }`}
                        style={getNavItemStyles('create-account', currentPage === 'create-account')}
                      >
                        Create Account
                      </motion.button>
                    </>
                  )}
                </div>
              </>
            )}
            
            {/* Buyers Portal Section */}
            <div 
              className="h-px my-4"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            />
            <div className="space-y-1">
              <p 
                className="px-4 py-2 text-xs font-medium font-body opacity-70"
                style={{ color: 'var(--pure-white)' }}
              >
                Shopping Portal
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation('home', 'buyers-portal')}
                onMouseEnter={() => setHoveredItem('buyers-portal')}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full text-left px-4 py-3 font-medium font-body transition-all duration-300 ${
                  (hoveredItem === 'buyers-portal' || clickedItem === 'buyers-portal') ? 'animate-pulse' : ''
                }`}
                style={getNavItemStyles('buyers-portal', currentPage === 'home')}
              >
                🛍️ Shop Now
              </motion.button>
            </div>

            {/* Customer Support Section */}
            <div 
              className="h-px my-4"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            />
            <div className="space-y-1">
              <p 
                className="px-4 py-2 text-xs font-medium font-body opacity-70"
                style={{ color: 'var(--pure-white)' }}
              >
                Support & Help
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation('customer-disputes', 'customer-disputes')}
                onMouseEnter={() => setHoveredItem('customer-disputes')}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full text-left px-4 py-3 font-medium font-body transition-all duration-300 ${
                  (hoveredItem === 'customer-disputes' || clickedItem === 'customer-disputes') ? 'animate-pulse' : ''
                }`}
                style={getNavItemStyles('customer-disputes', currentPage === 'customer-disputes')}
              >
                💬 Help & Support
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <header 
      className={`header-main sticky top-0 border-b force-navigation-zero-radius ${isMobile ? 'mobile-header-zero-radius' : ''}`}
      style={{ 
        backgroundColor: '#000000', // TikTok black background
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderRadius: '0px', // 🔥 CRITICAL: Force 0px border-radius
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
        zIndex: 9998 // High z-index for header
      }}
    >
      {/* Main Header */}
      <div className="px-4 md:px-6 lg:px-8" style={{ backgroundColor: '#000000' }}>
        <div className="flex items-center justify-between h-16" style={{ backgroundColor: '#000000' }}>
          {/* Enhanced Logo with Double Size */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('home', 'logo')}
            onMouseEnter={() => setHoveredItem('logo')}
            onMouseLeave={() => setHoveredItem(null)}
            className="cursor-pointer flex items-center transition-all duration-300 relative z-20"
            style={getLogoContainerStyles()}
          >
            <div className="relative flex items-center gap-3">
              <img
                src={batoLogo}
                alt="Bato"
                className={`transition-all duration-300 relative z-10 ${
                  (hoveredItem === 'logo' || clickedItem === 'logo') ? 'animate-pulse' : ''
                }`}
                style={{
                  height: isMobile ? '40px' : '48px',
                  width: 'auto',
                  filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))',
                  objectFit: 'contain',
                  transformOrigin: 'center center'
                }}
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallbackText = document.createElement('h1');
                  fallbackText.textContent = 'Bato';
                  fallbackText.className = 'font-bold font-heading tracking-wide';
                  fallbackText.style.color = 'var(--pure-white)';
                  fallbackText.style.fontSize = isMobile ? '24px' : '28px';
                  fallbackText.style.fontFamily = 'var(--font-heading)';
                  fallbackText.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.5)';
                  target.parentNode?.appendChild(fallbackText);
                }}
              />
              <h1 
                className="font-bold font-heading tracking-wide"
                style={{
                  color: 'var(--pure-white)',
                  fontSize: isMobile ? '24px' : '28px',
                  fontFamily: 'var(--font-heading)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '0.05em'
                }}
              >
                Bato
              </h1>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          {renderDesktopNav()}

          {/* Right Side Actions with Enhanced Rounded Icons */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            {!isMobile && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHoveredItem('search')}
                onMouseLeave={() => setHoveredItem(null)}
                className={`p-3 transition-all duration-300 ${
                  (hoveredItem === 'search' || clickedItem === 'search') ? 'animate-pulse' : ''
                }`}
                style={getIconButtonStyles('search')}
                title="Search"
              >
                <Search className="h-5 w-5" />
              </motion.button>
            )}

            {/* Favorites */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onNavigateToFavorites}
              onMouseEnter={() => setHoveredItem('favorites')}
              onMouseLeave={() => setHoveredItem(null)}
              className={`p-3 relative transition-all duration-300 ${
                (hoveredItem === 'favorites' || clickedItem === 'favorites') ? 'animate-pulse' : ''
              }`}
              style={getIconButtonStyles('favorites')}
              title="Favorites"
            >
              <Heart className="h-5 w-5" />
              {favoriteItemsCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ 
                    backgroundColor: 'var(--error-red)',
                    color: 'var(--pure-white)',
                    fontSize: '10px',
                    border: '2px solid #000000',
                    minWidth: '24px',
                    minHeight: '24px'
                  }}
                >
                  {favoriteItemsCount}
                </span>
              )}
            </motion.button>

            {/* Shopping Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCartClick}
              onMouseEnter={() => setHoveredItem('cart')}
              onMouseLeave={() => setHoveredItem(null)}
              className={`p-3 relative transition-all duration-300 ${
                (hoveredItem === 'cart' || clickedItem === 'cart') ? 'animate-pulse' : ''
              }`}
              style={getIconButtonStyles('cart')}
              title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ 
                    backgroundColor: 'var(--error-red)',
                    color: 'var(--pure-white)',
                    fontSize: '10px',
                    border: '2px solid #000000',
                    minWidth: '24px',
                    minHeight: '24px'
                  }}
                >
                  {cartItemsCount}
                </span>
              )}
            </motion.button>

            {/* Business Portals Dropdown - Desktop/Tablet Only */}
            {!isMobile && currentPage !== 'admin-dashboard' && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setHoveredItem(hoveredItem === 'business-portals' ? null : 'business-portals')}
                  onMouseEnter={() => setHoveredItem('business-portals')}
                  onMouseLeave={() => setTimeout(() => setHoveredItem(null), 300)}
                  className={`px-4 py-2 font-medium font-body transition-all duration-300 ${
                    (hoveredItem === 'business-portals' || clickedItem === 'business-portals') ? 'animate-pulse' : ''
                  }`}
                  style={{
                    color: 'var(--pure-white)',
                    backgroundColor: 'rgba(88, 37, 239, 0.1)',
                    border: '0.5px solid rgba(88, 37, 239, 0.3)',
                    borderRadius: '0px',
                    transition: 'all 0.3s ease',
                    transform: clickedItem === 'business-portals' ? 'scale(0.95)' : 'scale(1)'
                  }}
                  title="Business Portals"
                >
                  🏢 Business Portals ▼
                </motion.button>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {hoveredItem === 'business-portals' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 py-2 w-48 z-50"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        border: '1px solid rgba(88, 37, 239, 0.3)',
                        borderRadius: '0px',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                      }}
                      onMouseEnter={() => setHoveredItem('business-portals')}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <motion.button
                        whileHover={{ backgroundColor: 'rgba(88, 37, 239, 0.2)' }}
                        onClick={() => {
                          handleNavigation('home', 'buyers-portal-desktop');
                          setHoveredItem(null);
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-medium font-body transition-all duration-200"
                        style={{ color: 'var(--pure-white)' }}
                      >
                        🛍️ Buyers Portal
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: 'rgba(88, 37, 239, 0.2)' }}
                        onClick={() => {
                          handleNavigation('vendor-sign-in', 'vendor-portal-desktop');
                          setHoveredItem(null);
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-medium font-body transition-all duration-200"
                        style={{ color: 'var(--pure-white)' }}
                      >
                        🏪 Vendors Portal
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: 'rgba(88, 37, 239, 0.2)' }}
                        onClick={() => {
                          handleNavigation('logistics-create-account', 'logistics-portal-desktop');
                          setHoveredItem(null);
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-medium font-body transition-all duration-200"
                        style={{ color: 'var(--pure-white)' }}
                      >
                        🚚 Logistics Portal
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* User Account */}
            {!isMobile && (
              <>
                {currentUser ? (
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleNavigation('profile', 'profile')}
                      onMouseEnter={() => setHoveredItem('profile')}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`p-3 transition-all duration-300 ${
                        (hoveredItem === 'profile' || clickedItem === 'profile') ? 'animate-pulse' : ''
                      }`}
                      style={getIconButtonStyles('profile', currentPage === 'profile')}
                      title="Profile"
                    >
                      <User className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setClickedItem('sign-out');
                        onSignOut();
                        setTimeout(() => setClickedItem(null), 300);
                      }}
                      onMouseEnter={() => setHoveredItem('sign-out')}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`px-4 py-2 font-medium font-body transition-all duration-300 ${
                        (hoveredItem === 'sign-out' || clickedItem === 'sign-out') ? 'animate-pulse' : ''
                      }`}
                      style={getNavItemStyles('sign-out')}
                    >
                      Sign Out
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation('sign-in', 'sign-in')}
                      onMouseEnter={() => setHoveredItem('sign-in')}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`px-4 py-2 font-medium font-body transition-all duration-300 ${
                        (hoveredItem === 'sign-in' || clickedItem === 'sign-in') ? 'animate-pulse' : ''
                      }`}
                      style={getNavItemStyles('sign-in', currentPage === 'sign-in')}
                    >
                      Sign In
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation('create-account', 'create-account')}
                      onMouseEnter={() => setHoveredItem('create-account')}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`px-4 py-2 font-medium font-body transition-all duration-300 ${
                        (hoveredItem === 'create-account' || clickedItem === 'create-account') ? 'animate-pulse' : ''
                      }`}
                      style={getNavItemStyles('create-account', currentPage === 'create-account')}
                    >
                      Join
                    </motion.button>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Toggle with Enhanced Styling */}
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                onMouseEnter={() => setHoveredItem('menu')}
                onMouseLeave={() => setHoveredItem(null)}
                className={`p-3 transition-all duration-300 ${
                  (hoveredItem === 'menu' || clickedItem === 'menu') ? 'animate-pulse' : ''
                }`}
                style={getIconButtonStyles('menu')}
                aria-expanded={isMobileMenuOpen}
                title="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {renderMobileMenu()}
    </header>
  );
}