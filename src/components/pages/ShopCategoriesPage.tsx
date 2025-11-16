import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowLeft, Grid3X3, Search, Filter } from 'lucide-react';
import { comprehensiveCategories, CategoryItem } from '../../constants/comprehensiveCategories';
import { triggerHapticFeedback } from '../../hooks/useSwipeNavigation';

interface ShopCategoriesPageProps {
  onNavigateBack: () => void;
  onNavigateToPage: (page: string) => void;
}

export function ShopCategoriesPage({ onNavigateBack, onNavigateToPage }: ShopCategoriesPageProps) {
  const [viewState, setViewState] = useState<'main' | 'subcategories' | 'deep-subcategories'>('main');
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<CategoryItem | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0);
  const [currentSubcategoryPage, setCurrentSubcategoryPage] = useState(0);
  const [currentDeepSubcategoryPage, setCurrentDeepSubcategoryPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Pagination settings
  const categoriesPerPage = isMobile ? 6 : 9;
  const totalPages = Math.ceil(comprehensiveCategories.length / categoriesPerPage);

  const getSubcategoryTotalPages = () => {
    if (!selectedCategory?.subcategories) return 0;
    return Math.ceil(selectedCategory.subcategories.length / categoriesPerPage);
  };

  const getDeepSubcategoryTotalPages = () => {
    if (!selectedSubcategory?.subcategories) return 0;
    return Math.ceil(selectedSubcategory.subcategories.length / categoriesPerPage);
  };

  // Handle category navigation
  const handleCategoryClick = (category: CategoryItem) => {
    if (category.subcategories && category.subcategories.length > 0) {
      triggerHapticFeedback('medium');
      setSelectedCategory(category);
      setCurrentSubcategoryPage(0);
      setViewState('subcategories');
    } else {
      triggerHapticFeedback('light');
      onNavigateToPage('new-arrivals');
    }
  };

  // Handle subcategory navigation
  const handleSubcategoryClick = (subcategory: CategoryItem) => {
    if (subcategory.subcategories && subcategory.subcategories.length > 0) {
      triggerHapticFeedback('medium');
      setSelectedSubcategory(subcategory);
      setCurrentDeepSubcategoryPage(0);
      setViewState('deep-subcategories');
    } else {
      triggerHapticFeedback('light');
      onNavigateToPage('new-arrivals');
    }
  };

  // Handle pagination
  const handleNextPage = () => {
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

  const handlePrevPage = () => {
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

  // Handle back navigation
  const handleBack = () => {
    if (viewState === 'deep-subcategories') {
      setViewState('subcategories');
      setSelectedSubcategory(null);
      setCurrentDeepSubcategoryPage(0);
    } else if (viewState === 'subcategories') {
      setViewState('main');
      setSelectedCategory(null);
      setCurrentSubcategoryPage(0);
    } else {
      onNavigateBack();
    }
  };

  // Get current categories to display
  const getCurrentCategories = () => {
    if (viewState === 'main') {
      const startIndex = currentCategoryPage * categoriesPerPage;
      return comprehensiveCategories.slice(startIndex, startIndex + categoriesPerPage);
    } else if (viewState === 'subcategories' && selectedCategory?.subcategories) {
      const startIndex = currentSubcategoryPage * categoriesPerPage;
      return selectedCategory.subcategories.slice(startIndex, startIndex + categoriesPerPage);
    } else if (viewState === 'deep-subcategories' && selectedSubcategory?.subcategories) {
      const startIndex = currentDeepSubcategoryPage * categoriesPerPage;
      return selectedSubcategory.subcategories.slice(startIndex, startIndex + categoriesPerPage);
    }
    return [];
  };

  const currentCategories = getCurrentCategories();

  // Filter categories based on search
  const filteredCategories = currentCategories.filter(category =>
    category.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div 
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ 
        backgroundColor: '#000000',
        fontFamily: 'var(--font-body)',
        overflow: 'hidden',
        paddingBottom: isMobile ? 'calc(80px - 8px + env(safe-area-inset-bottom))' : '0'
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex items-center justify-between mb-6 relative"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="flex items-center justify-center w-12 h-12"
            style={{
              background: '#4040f8ff',
              color: '#FFFFFF',
              borderRadius: isMobile ? '8px' : '3px',
              boxShadow: isMobile 
                ? '0 4px 16px rgba(64, 64, 248, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : 'none',
              border: isMobile ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>

          <div>
            <motion.h1 
              className="font-heading"
              style={{ 
                color: '#FFFFFF',
                fontSize: isMobile ? '28px' : '32px',
                fontWeight: '700'
              }}
            >
              {viewState === 'main' && '🛍️ Shop Categories'}
              {viewState === 'subcategories' && `📂 ${selectedCategory?.label}`}
              {viewState === 'deep-subcategories' && `📁 ${selectedSubcategory?.label}`}
            </motion.h1>
            <motion.p 
              className="text-sm font-body mt-1"
              style={{ 
                color: '#FFFFFF',
                opacity: 0.8
              }}
            >
              {viewState === 'main' && `${comprehensiveCategories.length} categories available`}
              {viewState === 'subcategories' && `${selectedCategory?.subcategories?.length || 0} subcategories`}
              {viewState === 'deep-subcategories' && `${selectedSubcategory?.subcategories?.length || 0} items`}
            </motion.p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Grid3X3 className="h-6 w-6" style={{ color: '#FFFFFF', opacity: 0.6 }} />
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#FFFFFF', opacity: 0.6 }} />
          <input
            type="text"
            placeholder={`Search ${viewState === 'main' ? 'categories' : viewState === 'subcategories' ? 'subcategories' : 'items'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border-none outline-none"
            style={{
              backgroundColor: '#3f3f3fff',
              color: '#FFFFFF',
              borderRadius: isMobile ? '8px' : '3px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <AnimatePresence mode="wait">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={`${viewState}-${category.key}-${currentCategoryPage}-${currentSubcategoryPage}-${currentDeepSubcategoryPage}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (viewState === 'main') {
                  handleCategoryClick(category);
                } else if (viewState === 'subcategories') {
                  handleSubcategoryClick(category);
                } else {
                  triggerHapticFeedback('light');
                  onNavigateToPage('new-arrivals');
                }
              }}
              onMouseEnter={() => {
                if (viewState === 'main' || viewState === 'subcategories') {
                  setHoveredCategory(category.key);
                } else {
                  setHoveredSubcategory(category.key);
                }
              }}
              onMouseLeave={() => {
                setHoveredCategory(null);
                setHoveredSubcategory(null);
              }}
              className="relative overflow-hidden cursor-pointer group"
              style={{
                backgroundColor: '#3f3f3fff',
                borderRadius: isMobile ? '8px' : '3px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: hoveredCategory === category.key || hoveredSubcategory === category.key
                  ? '0 8px 32px rgba(64, 64, 248, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Category Image/Icon */}
              <div 
                className="aspect-square flex items-center justify-center relative overflow-hidden"
                style={{
                  background: '#1e2a39ff'
                }}
              >
                <motion.div
                  animate={{
                    scale: hoveredCategory === category.key || hoveredSubcategory === category.key ? 1.1 : 1
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  style={{
                    fontSize: isMobile ? '6.75rem' : '9rem', // 3x larger than text-4xl (2.25rem) and text-5xl (3rem)
                    lineHeight: '1'
                  }}
                >
                  {category.emoji}
                </motion.div>


                {/* Subcategory Indicator */}
                {(category.subcategories && category.subcategories.length > 0) && (
                  <motion.div
                    className="absolute bottom-2 right-2"
                    animate={{ 
                      x: hoveredCategory === category.key || hoveredSubcategory === category.key ? 2 : 0 
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <ChevronRight 
                      className="h-5 w-5" 
                      style={{ 
                        color: '#FFFFFF',
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))'
                      }} 
                    />
                  </motion.div>
                )}
              </div>

              {/* Category Info */}
              <div className="p-4">
                <h3 
                  className="font-heading font-semibold mb-1"
                  style={{ 
                    color: '#FFFFFF',
                    fontSize: '16px'
                  }}
                >
                  {category.label}
                </h3>
                {category.description && (
                  <p 
                    className="text-sm font-body line-clamp-2"
                    style={{ 
                      color: '#FFFFFF',
                      opacity: 0.8
                    }}
                  >
                    {category.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevPage}
          disabled={
            (viewState === 'main' && currentCategoryPage === 0) ||
            (viewState === 'subcategories' && currentSubcategoryPage === 0) ||
            (viewState === 'deep-subcategories' && currentDeepSubcategoryPage === 0)
          }
          className="px-4 py-2 font-semibold disabled:opacity-50"
          style={{
            background: '#4040f8ff',
            color: '#FFFFFF',
            borderRadius: isMobile ? '8px' : '3px',
            border: 'none'
          }}
        >
          Previous
        </motion.button>

        <div className="flex items-center gap-2">
          {Array.from({ 
            length: viewState === 'main' 
              ? totalPages 
              : viewState === 'subcategories' 
                ? getSubcategoryTotalPages() 
                : getDeepSubcategoryTotalPages() 
          }).map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: (
                  (viewState === 'main' && index === currentCategoryPage) ||
                  (viewState === 'subcategories' && index === currentSubcategoryPage) ||
                  (viewState === 'deep-subcategories' && index === currentDeepSubcategoryPage)
                ) ? '#4040f8ff' : '#3f3f3fff'
              }}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextPage}
          disabled={
            (viewState === 'main' && currentCategoryPage >= totalPages - 1) ||
            (viewState === 'subcategories' && currentSubcategoryPage >= getSubcategoryTotalPages() - 1) ||
            (viewState === 'deep-subcategories' && currentDeepSubcategoryPage >= getDeepSubcategoryTotalPages() - 1)
          }
          className="px-4 py-2 font-semibold disabled:opacity-50"
          style={{
            background: '#4040f8ff',
            color: '#FFFFFF',
            borderRadius: isMobile ? '8px' : '3px',
            border: 'none'
          }}
        >
          Next
        </motion.button>
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Grid3X3 className="h-16 w-16 mx-auto mb-4" style={{ color: '#FFFFFF', opacity: 0.5 }} />
          <h3 
            className="font-heading text-xl mb-2"
            style={{ color: '#FFFFFF' }}
          >
            No categories found
          </h3>
          <p 
            className="font-body mb-6"
            style={{ color: '#FFFFFF', opacity: 0.8 }}
          >
            Try adjusting your search criteria
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchQuery('')}
            className="px-6 py-3 font-semibold"
            style={{
              background: '#4040f8ff',
              color: '#FFFFFF',
              borderRadius: isMobile ? '8px' : '3px',
              border: 'none'
            }}
          >
            Clear Search
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}