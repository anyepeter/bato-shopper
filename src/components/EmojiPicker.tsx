import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smile, X, Search, Sparkles, Heart, Globe, Clock } from "lucide-react";

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  position?: 'top' | 'bottom';
  className?: string;
}

// Enhanced emoji categories with comprehensive African-focused selections
const EMOJI_CATEGORIES = {
  'Recently Used': [],
  'African & Cultural': [
    '👑', '🌍', '🦁', '🐘', '🌺', '🥭', '🍌', '🥥', 
    '👸🏾', '🤴🏾', '👩🏾‍🦱', '👨🏾‍🦱', '🙋🏾‍♀️', '🙋🏾‍♂️',
    '💃🏾', '🕺🏾', '👶🏾', '👧🏾', '👦🏾', '🧕🏾', '👵🏾', '👴🏾',
    '🏺', '🪘', '🎭', '🪶', '🌾', '🌿', '🌴', '☀️', '🌄', '🐆',
    '🦓', '🦏', '🦒', '🪃', '🥻', '🌊', '🏝️', '🌋', '⛰️', '🎪'
  ],
  'Smileys & Emotion': [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂',
    '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛',
    '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳',
    '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖',
    '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯',
    '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔'
  ],
  'Fashion & Beauty': [
    '👗', '👚', '👕', '👖', '🩱', '👘', '💄', '💅', '👠', '👡',
    '👢', '👞', '👟', '🥿', '👒', '🧢', '👑', '💍', '📿', '💎',
    '🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🎀', '🎗️', '✨', '💫',
    '⭐', '🌟', '💄', '👜', '👛', '🎒', '👝', '🛍️', '💳', '💰'
  ],
  'Love & Hearts': [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔',
    '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️',
    '💋', '💌', '💐', '🌹', '😍', '🥰', '😘', '💑', '💏', '👨‍❤️‍👩',
    '👩‍❤️‍👩', '👨‍❤️‍👨', '💒', '🎎', '💅', '💆‍♀️', '💇‍♀️', '🤱', '🤰', '👰'
  ],
  'Hands & Gestures': [
    '👋🏾', '🤚🏾', '🖐🏾', '✋🏾', '🖖🏾', '👌🏾', '🤌🏾', '🤏🏾', '✌🏾', '🤞🏾',
    '🤟🏾', '🤘🏾', '🤙🏾', '👈🏾', '👉🏾', '👆🏾', '👇🏾', '☝🏾', '👍🏾', '👎🏾',
    '👊🏾', '✊🏾', '🤛🏾', '🤜🏾', '👏🏾', '🙌🏾', '👐🏾', '🤲🏾', '🤝', '🙏🏾',
    '💪🏾', '🦵🏾', '🦶🏾', '👂🏾', '🦻🏾', '👃🏾', '👶🏾', '🧒🏾', '👦🏾', '👧🏾'
  ],
  'Objects & Symbols': [
    '💯', '🔥', '⭐', '🌟', '💫', '⚡', '💥', '🎉', '🎊', '🎁',
    '🛍️', '💰', '💳', '💎', '👑', '🏆', '🥇', '🎯', '🎪', '🎭',
    '🎨', '🎵', '🎶', '🎤', '🎧', '📱', '💻', '⌚', '💡', '🔑',
    '🌈', '☀️', '🌙', '⭐', '💝', '🎀', '🏅', '🎖️', '🏵️', '🌺'
  ]
};

const QUICK_ACCESS_EMOJIS = ['👑', '🌍', '💃🏾', '👸🏾', '❤️', '✨', '🔥', '💎'];

export function EmojiPicker({ isOpen, onClose, onEmojiSelect, position = 'top', className = '' }: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('African & Cultural');
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const [activeTab, setActiveTab] = useState('categories');
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [clickedTab, setClickedTab] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      const vh = window.innerHeight;
      setIsMobile(mobile);
      setViewportHeight(vh);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Load recently used emojis from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('modish-style-recent-emojis');
    if (saved) {
      try {
        setRecentlyUsed(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load recent emojis');
      }
    }
  }, []);

  // Save recently used emojis to localStorage
  const saveRecentEmoji = (emoji: string) => {
    const updated = [emoji, ...recentlyUsed.filter(e => e !== emoji)].slice(0, 24);
    setRecentlyUsed(updated);
    localStorage.setItem('modish-style-recent-emojis', JSON.stringify(updated));
  };

  // Handle tab click with blink animation
  const handleTabClick = (tabName: string) => {
    setClickedTab(tabName);
    setActiveTab(tabName);
    
    // Remove the animation class after animation completes
    setTimeout(() => {
      setClickedTab(null);
    }, 600);
  };

  // Enhanced search functionality
  const getFilteredEmojis = () => {
    if (activeCategory === 'Recently Used') {
      return recentlyUsed;
    }
    
    const categoryEmojis = EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES] || [];
    
    if (!searchQuery) {
      return categoryEmojis;
    }
    
    // Enhanced search with keywords
    const query = searchQuery.toLowerCase();
    return categoryEmojis.filter(emoji => {
      // Direct emoji match
      if (emoji.includes(searchQuery)) return true;
      
      // Keyword matching
      const keywords: { [key: string]: string[] } = {
        'heart': ['❤️', '🧡', '💛', '💚', '💙', '💜', '💔', '💕', '💞', '💓', '💗', '💖', '💘'],
        'smile': ['😀', '😃', '😄', '😁', '😊', '🙂', '😌'],
        'love': ['😍', '🥰', '😘', '💋', '❤️', '💕', '💖'],
        'crown': ['👑'],
        'fire': ['🔥'],
        'star': ['⭐', '🌟', '✨'],
        'queen': ['👑', '👸🏾'],
        'king': ['🤴🏾'],
        'dance': ['💃🏾', '🕺🏾'],
        'africa': ['🌍', '🦁', '🐘'],
        'fashion': ['👗', '👚', '💄', '👠'],
        'beauty': ['💄', '💅', '💎', '✨']
      };
      
      for (const [keyword, emojis] of Object.entries(keywords)) {
        if (query.includes(keyword) && emojis.includes(emoji)) {
          return true;
        }
      }
      
      return false;
    });
  };

  const filteredEmojis = getFilteredEmojis();

  // Smart positioning with responsive viewport detection
  useEffect(() => {
    if (isOpen && pickerRef.current) {
      const rect = pickerRef.current.getBoundingClientRect();
      const availableSpaceAbove = rect.top;
      const availableSpaceBelow = viewportHeight - rect.bottom;
      const pickerHeight = isMobile ? Math.min(viewportHeight * 0.8, 500) : 520;
      
      if (position === 'top') {
        setAdjustedPosition(availableSpaceAbove >= pickerHeight ? 'top' : 'bottom');
      } else {
        setAdjustedPosition(availableSpaceBelow >= pickerHeight ? 'bottom' : 'top');
      }
    }
  }, [isOpen, position, isMobile, viewportHeight]);

  const handleEmojiClick = (emoji: string) => {
    saveRecentEmoji(emoji);
    onEmojiSelect(emoji);
    onClose();
  };

  const categoryNames = Object.keys(EMOJI_CATEGORIES);
  if (recentlyUsed.length > 0 && !categoryNames.includes('Recently Used')) {
    categoryNames.unshift('Recently Used');
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Recently Used': return <Clock className={`${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />;
      case 'African & Cultural': return <Globe className={`${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />;
      case 'Smileys & Emotion': return <Smile className={`${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />;
      case 'Fashion & Beauty': return <Sparkles className={`${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />;
      case 'Love & Hearts': return <Heart className={`${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />;
      default: return <span className={`${isMobile ? 'text-sm' : 'text-xs'}`}>✨</span>;
    }
  };

  // Responsive dimensions
  const getResponsiveDimensions = () => {
    if (isMobile) {
      const isLandscape = window.innerWidth > window.innerHeight;
      return {
        width: isLandscape ? 'min(95vw, 500px)' : 'min(95vw, 380px)',
        height: isLandscape ? 'min(70vh, 400px)' : 'min(80vh, 500px)',
        maxHeight: `${viewportHeight * 0.85}px`
      };
    }
    return {
      width: '440px',
      height: '520px',
      maxHeight: '90vh'
    };
  };

  const dimensions = getResponsiveDimensions();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Mobile backdrop */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[9998] flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            ref={pickerRef}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", duration: 0.4, damping: 25, stiffness: 300 }}
            className="modern-emoji-container emoji-picker-scrollable"
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              width: dimensions.width,
              height: dimensions.height,
              maxHeight: dimensions.maxHeight,
              maxWidth: '95vw',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {renderContent()}
          </motion.div>
        </motion.div>
      )}

      {/* Desktop positioning */}
      {!isMobile && (
        <motion.div
          ref={pickerRef}
          initial={{ opacity: 0, scale: 0.95, y: adjustedPosition === 'top' ? 15 : -15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: adjustedPosition === 'top' ? 15 : -15 }}
          transition={{ type: "spring", duration: 0.4, damping: 25, stiffness: 300 }}
          className={`modern-emoji-container emoji-picker-scrollable ${adjustedPosition === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'} ${className}`}
          style={{
            position: 'absolute',
            right: '0',
            zIndex: 9999,
            borderRadius: '20px',
            overflow: 'hidden',
            width: dimensions.width,
            height: dimensions.height,
            maxHeight: dimensions.maxHeight,
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Backdrop click handler for desktop */}
          <div 
            className="fixed inset-0 z-[-1]" 
            onClick={onClose}
            style={{ backgroundColor: 'transparent' }}
          />
          {renderContent()}
        </motion.div>
      )}
    </AnimatePresence>
  );

  function renderContent() {
    return (
      <div className="flex flex-col h-full modern-emoji-scrollbar">
        {/* Modern enhanced header */}
        <div className="modern-emoji-header border-b flex-shrink-0" style={{ borderColor: 'rgba(223, 102, 13, 0.15)' }}>
          {/* Title and close button */}
          <div className={`flex items-center justify-between ${isMobile ? 'p-4' : 'p-5'} pb-3`}>
            <div className="flex items-center gap-3">
              <motion.span 
                className={`${isMobile ? 'text-xl' : 'text-2xl'}`}
                animate={{ 
                  rotate: [0, 15, -15, 10, -5, 0],
                  scale: [1, 1.1, 1.2, 1.1, 1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(223, 102, 13, 0.3))' }}
              >
                ✨
              </motion.span>
              <div>
                <h3 
                  className={`font-semibold font-heading ${isMobile ? 'text-lg' : 'text-xl'}`}
                  style={{ 
                    color: 'var(--primary-blue)',
                    fontFamily: 'var(--font-heading)',
                    background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-light-blue))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Express Yourself
                </h3>
                <p 
                  className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-70 font-body`}
                  style={{ 
                    color: 'var(--primary-dark-blue)',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Choose the perfect emoji ✨
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className={`${isMobile ? 'p-3' : 'p-2.5'} rounded-full transition-all duration-300`}
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(223, 102, 13, 0.2)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                minTouchTarget: isMobile ? '44px' : 'auto'
              }}
            >
              <X 
                className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} 
                style={{ color: 'var(--primary-blue)' }} 
              />
            </motion.button>
          </div>

          {/* Modern responsive tab navigation */}
          <div className={`flex ${isMobile ? 'px-4' : 'px-5'} pb-4`}>
            <div 
              className="flex rounded-2xl p-1.5 gap-1 w-full"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(223, 102, 13, 0.1)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              }}
            >
              {[
                { id: 'categories', icon: Sparkles, label: 'Categories', shortLabel: 'Categories' },
                { id: 'quick', icon: Heart, label: 'Quick', shortLabel: 'Quick' }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabClick(tab.id)}
                  className={`modern-emoji-tab flex items-center gap-2 ${isMobile ? 'px-3 py-2.5' : 'px-4 py-2.5'} rounded-xl ${isMobile ? 'text-xs' : 'text-sm'} font-medium transition-all duration-300 flex-1 justify-center ${
                    clickedTab === tab.id ? 'emoji-tab-active' : ''
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id 
                      ? 'var(--primary-blue)' 
                      : 'rgba(255, 255, 255, 0.5)',
                    color: activeTab === tab.id 
                      ? 'var(--pure-white)' 
                      : 'var(--primary-blue)',
                    fontFamily: 'var(--font-body)',
                    minHeight: isMobile ? '44px' : 'auto',
                    boxShadow: activeTab === tab.id 
                      ? '0 8px 25px rgba(223, 102, 13, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.05)',
                    border: activeTab === tab.id 
                      ? '1px solid rgba(255, 255, 255, 0.2)' 
                      : '1px solid rgba(223, 102, 13, 0.1)'
                  }}
                >
                  <tab.icon className={`${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
                  <span>{isMobile ? tab.shortLabel : tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === 'categories' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Modern search bar */}
            <div className={`${isMobile ? 'p-4' : 'p-5'} border-b flex-shrink-0`} style={{ borderColor: 'rgba(223, 102, 13, 0.15)' }}>
              <div className="relative">
                <Search 
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} 
                  style={{ color: 'var(--primary-blue)' }}
                />
                <input
                  type="text"
                  placeholder={isMobile ? "Search emojis..." : "Search emojis... (try 'heart', 'smile', 'queen')"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${isMobile ? 'pl-12 pr-4 py-4' : 'pl-12 pr-4 py-3'} rounded-2xl font-body ${isMobile ? 'text-base' : 'text-sm'} transition-all duration-300 focus:outline-none focus:ring-2`}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(223, 102, 13, 0.2)',
                    fontSize: isMobile ? '16px' : '14px',
                    fontFamily: 'var(--font-body)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                    color: 'var(--black)'
                  }}
                />
              </div>
            </div>

            {/* Modern category tabs */}
            <div 
              className={`flex overflow-x-auto modern-emoji-scrollbar ${isMobile ? 'px-3 py-3' : 'px-4 py-3'} border-b scrollbar-none flex-shrink-0`} 
              style={{ borderColor: 'rgba(223, 102, 13, 0.15)' }}
            >
              {categoryNames.map((category, index) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveCategory(category)}
                  className={`modern-emoji-tab flex-shrink-0 flex items-center gap-2 ${isMobile ? 'px-4 py-3' : 'px-4 py-2.5'} mx-1 rounded-2xl ${isMobile ? 'text-xs' : 'text-sm'} font-medium transition-all duration-300`}
                  style={{
                    backgroundColor: activeCategory === category 
                      ? 'var(--primary-blue)' 
                      : 'rgba(255, 255, 255, 0.7)',
                    color: activeCategory === category 
                      ? 'var(--pure-white)' 
                      : 'var(--primary-blue)',
                    fontFamily: 'var(--font-body)',
                    minHeight: isMobile ? '44px' : 'auto',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(223, 102, 13, 0.2)',
                    boxShadow: activeCategory === category 
                      ? '0 8px 25px rgba(223, 102, 13, 0.3)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.05)',
                    minTouchTarget: isMobile ? '44px' : 'auto'
                  }}
                >
                  {getCategoryIcon(category)}
                  <span>
                    {category === 'Recently Used' ? 'Recent' :
                     category === 'African & Cultural' ? 'African' :
                     category === 'Smileys & Emotion' ? 'Smileys' :
                     category === 'Fashion & Beauty' ? 'Fashion' :
                     category === 'Love & Hearts' ? 'Love' :
                     category === 'Hands & Gestures' ? 'Hands' :
                     category === 'Objects & Symbols' ? 'Objects' :
                     category}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Modern emoji grid */}
            <div className={`flex-1 ${isMobile ? 'p-4' : 'p-5'} overflow-y-auto modern-emoji-scrollbar`}>
              {filteredEmojis.length > 0 ? (
                <motion.div 
                  className={`grid ${isMobile ? 'grid-cols-6' : 'grid-cols-8'} gap-2`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, staggerChildren: 0.02 }}
                >
                  {filteredEmojis.map((emoji, index) => (
                    <motion.button
                      key={`${emoji}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.01 }}
                      whileHover={{ scale: 1.25, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEmojiClick(emoji)}
                      className={`modern-emoji-button ${isMobile ? 'p-3' : 'p-2.5'} rounded-2xl transition-all duration-200 ${isMobile ? 'text-3xl' : 'text-2xl'} flex items-center justify-center`}
                      style={{ 
                        minHeight: isMobile ? '56px' : '48px',
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(223, 102, 13, 0.1)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        minTouchTarget: isMobile ? '44px' : 'auto'
                      }}
                      title={`Select ${emoji}`}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <div className={`text-center ${isMobile ? 'py-16' : 'py-12'}`}>
                  <motion.div 
                    className={`${isMobile ? 'text-6xl' : 'text-5xl'} mb-6`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔍
                  </motion.div>
                  <p 
                    className={`font-medium font-body ${isMobile ? 'text-lg' : 'text-base'} mb-2`}
                    style={{ 
                      color: 'var(--primary-blue)',
                      fontFamily: 'var(--font-body)' 
                    }}
                  >
                    {searchQuery ? 'No emojis found' : 'No recent emojis yet'}
                  </p>
                  {searchQuery && (
                    <p 
                      className={`font-body ${isMobile ? 'text-sm' : 'text-xs'} mt-2 opacity-70`}
                      style={{ 
                        color: 'var(--medium-gray)',
                        fontFamily: 'var(--font-body)' 
                      }}
                    >
                      Try: heart, smile, queen, crown, fire, star
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'quick' && (
          <div className={`flex-1 ${isMobile ? 'p-4' : 'p-6'} overflow-y-auto modern-emoji-scrollbar`}>
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h4 
                className={`font-semibold mb-3 ${isMobile ? 'text-lg' : 'text-xl'}`}
                style={{ 
                  color: 'var(--primary-blue)',
                  fontFamily: 'var(--font-heading)',
                  background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-light-blue))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                ⚡ Quick Access
              </h4>
              <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-4'} gap-3`}>
                {QUICK_ACCESS_EMOJIS.map((emoji, index) => (
                  <motion.button
                    key={emoji}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEmojiClick(emoji)}
                    className={`modern-emoji-button ${isMobile ? 'p-5' : 'p-4'} rounded-3xl transition-all duration-300 ${isMobile ? 'text-5xl' : 'text-3xl'} flex items-center justify-center`}
                    style={{ 
                      minHeight: isMobile ? '80px' : '72px',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 238, 230, 0.7))',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(223, 102, 13, 0.2)',
                      boxShadow: '0 8px 32px rgba(223, 102, 13, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                      minTouchTarget: isMobile ? '44px' : 'auto'
                    }}
                    title={`Quick select ${emoji}`}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Additional sections with scrollable content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {[
                { title: '🌍 Popular African', emojis: EMOJI_CATEGORIES['African & Cultural'].slice(0, 12) },
                { title: '💄 Fashion & Beauty', emojis: EMOJI_CATEGORIES['Fashion & Beauty'].slice(0, 12) },
                { title: '❤️ Love & Hearts', emojis: EMOJI_CATEGORIES['Love & Hearts'].slice(0, 12) }
              ].map((section, sectionIndex) => (
                <div key={section.title}>
                  <h4 
                    className={`font-semibold mb-4 ${isMobile ? 'text-base' : 'text-lg'}`}
                    style={{ 
                      color: 'var(--primary-blue)',
                      fontFamily: 'var(--font-heading)'
                    }}
                  >
                    {section.title}
                  </h4>
                  <div className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-6'} gap-3`}>
                    {section.emojis.map((emoji, index) => (
                      <motion.button
                        key={`${section.title}-${emoji}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (sectionIndex * 0.1) + (index * 0.02) }}
                        whileHover={{ scale: 1.15, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEmojiClick(emoji)}
                        className={`modern-emoji-button ${isMobile ? 'p-4' : 'p-3'} rounded-2xl transition-all duration-200 ${isMobile ? 'text-3xl' : 'text-2xl'} flex items-center justify-center`}
                        style={{ 
                          minHeight: isMobile ? '64px' : '56px',
                          backgroundColor: 'rgba(255, 255, 255, 0.6)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(223, 102, 13, 0.1)',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                          minTouchTarget: isMobile ? '44px' : 'auto'
                        }}
                        title={`Select ${emoji}`}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Modern enhanced footer */}
        <motion.div 
          className={`${isMobile ? 'px-4 py-3' : 'px-5 py-4'} border-t text-center flex-shrink-0`}
          style={{ 
            borderColor: 'rgba(223, 102, 13, 0.15)',
            background: 'linear-gradient(135deg, rgba(255, 238, 230, 0.8), rgba(255, 255, 255, 0.9))',
            backdropFilter: 'blur(20px)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p 
            className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-80 font-medium`}
            style={{ 
              color: 'var(--primary-blue)',
              fontFamily: 'var(--font-body)'
            }}
          >
            {activeTab === 'categories' && (isMobile ? 'Enhanced search • African focus' : 'Enhanced search • African focus • Recent history')}
            {activeTab === 'quick' && 'Quick access to most popular emojis ⚡'}
          </p>
        </motion.div>
      </div>
    );
  }
}