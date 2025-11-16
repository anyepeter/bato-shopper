import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BootstrapIcon } from '../BootstrapIcon';
import { Input } from '../ui/input';

interface MobileLiveStreamFloatingButtonsProps {
  onFavoritesClick: () => void;
  onReviewsClick: () => void;
  onShareClick: () => void;
  onChatClick: () => void;
  onSearchQuery: (query: string) => void;
  onCategorySelect: (category: string) => void;
  favoritesCount?: number;
  selectedCategory?: string;
}

export function MobileLiveStreamFloatingButtons({
  onFavoritesClick,
  onReviewsClick,
  onShareClick,
  onChatClick,
  onSearchQuery,
  onCategorySelect,
  favoritesCount = 0,
  selectedCategory = 'all'
}: MobileLiveStreamFloatingButtonsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'all', label: 'All', icon: 'grid' },
    { id: 'traditional', label: 'Traditional', icon: 'star' },
    { id: 'contemporary', label: 'Contemporary', icon: 'palette' },
    { id: 'designer', label: 'Designer', icon: 'award' }
  ];

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      // Focus search input when menu opens
      setTimeout(() => searchInputRef.current?.focus(), 300);
    } else {
      // Clear search when menu closes
      setSearchQuery('');
      onSearchQuery('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchQuery(query);
  };

  const handleCategorySelect = (categoryId: string) => {
    onCategorySelect(categoryId);
    // Don't close menu when selecting category
  };

  const handleOtherButtonClick = (callback: () => void) => {
    // Close menu when other buttons are clicked
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setSearchQuery('');
      onSearchQuery('');
    }
    callback();
  };

  const mainButtons = [
    {
      id: 'menu',
      icon: 'list',
      onClick: handleMenuToggle,
      isActive: isMenuOpen,
      delay: 0.1
    },
    {
      id: 'favorites',
      icon: 'heart',
      onClick: () => handleOtherButtonClick(onFavoritesClick),
      isActive: false,
      badge: favoritesCount > 0 ? favoritesCount : undefined,
      delay: 0.2
    },
    {
      id: 'reviews',
      icon: 'star',
      onClick: () => handleOtherButtonClick(onReviewsClick),
      isActive: false,
      delay: 0.3
    },
    {
      id: 'share',
      icon: 'share',
      onClick: () => handleOtherButtonClick(onShareClick),
      isActive: true, // Orange/active state
      delay: 0.4
    },
    {
      id: 'chat',
      icon: 'chat-dots',
      onClick: () => handleOtherButtonClick(onChatClick),
      isActive: true, // Orange/active state
      delay: 0.5
    }
  ];

  return (
    <div className="relative">
      {/* Animated Search Field and Categories */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: 100, width: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.8, 0.25, 1],
              width: { duration: 0.3 }
            }}
            className="absolute right-16 top-0 flex items-center gap-3"
            style={{ 
              zIndex: 45,
              minWidth: '280px'
            }}
          >
            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="relative"
            >
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search streams..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-48 h-12 px-4 pr-10 font-body text-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '3px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
              />
              <BootstrapIcon 
                name="search"
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </motion.div>

            {/* Category Buttons */}
            <motion.div 
              className="flex gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="w-10 h-10 flex items-center justify-center transition-all duration-300"
                  style={{
                    background: selectedCategory === category.id
                      ? 'linear-gradient(135deg, #5825efff, #5825efff)'
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: selectedCategory === category.id
                      ? '0 4px 15px rgba(88, 37, 239, 0.4)'
                      : '0 4px 15px rgba(0, 0, 0, 0.1)',
                    borderRadius: '3px'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.3 + (index * 0.1),
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  title={category.label}
                >
                  <BootstrapIcon 
                    name={category.icon} 
                    size={16}
                    style={{
                      color: selectedCategory === category.id ? 'white' : '#5825efff',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                    }}
                  />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Buttons */}
      <div className="flex flex-col gap-3">
        {mainButtons.map((button) => (
          <motion.button
            key={button.id}
            onClick={button.onClick}
            className="relative w-12 h-12 flex items-center justify-center text-white transition-all duration-300 shadow-lg"
            style={{
              background: button.isActive 
                ? 'linear-gradient(135deg, #5825efff, #5825efff)'
                : 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: button.isActive 
                ? '0 4px 15px rgba(88, 37, 239, 0.4)'
                : '0 4px 15px rgba(0, 0, 0, 0.2)',
              borderRadius: '3px'
            }}
            whileHover={{ 
              scale: 1.1,
              rotate: button.id === 'share' ? 12 : 0
            }}
            whileTap={{ 
              scale: 0.95,
              rotate: button.id === 'share' ? -12 : 0
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: button.delay,
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <BootstrapIcon 
              name={button.icon} 
              size={20}
              style={{
                color: button.isActive ? 'white' : 'rgba(255, 255, 255, 0.9)',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
              }}
            />
            
            {/* Badge for favorites count */}
            {button.badge && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                  color: 'white',
                  fontSize: '10px',
                  border: '2px solid white',
                  boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)',
                  borderRadius: '3px'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: button.delay + 0.2,
                  type: "spring",
                  stiffness: 500,
                  damping: 25
                }}
              >
                {button.badge > 99 ? '99+' : button.badge}
              </motion.div>
            )}

            {/* Pulse animation for active buttons */}
            {button.isActive && (
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(88, 37, 239, 0.3), rgba(88, 37, 239, 0.3))',
                  filter: 'blur(8px)',
                  zIndex: -1,
                  borderRadius: '3px'
                }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}