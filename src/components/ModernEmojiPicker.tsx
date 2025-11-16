import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Palette, Globe, Heart } from "lucide-react";

interface ModernEmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  position?: 'top' | 'bottom';
  className?: string;
}

// Enhanced emoji picker using emoji-picker-react with modern design
export function ModernEmojiPicker({ 
  isOpen, 
  onClose, 
  onEmojiSelect, 
  position = 'top', 
  className = '' 
}: ModernEmojiPickerProps) {
  const [EmojiPicker, setEmojiPicker] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const [activeTab, setActiveTab] = useState('picker');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
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
        setRecentEmojis(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load recent emojis');
      }
    }
  }, []);

  // Save recent emoji
  const saveRecentEmoji = (emoji: string) => {
    const updated = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 24);
    setRecentEmojis(updated);
    localStorage.setItem('modish-style-recent-emojis', JSON.stringify(updated));
  };

  // Dynamic import of emoji-picker-react with enhanced error handling
  useEffect(() => {
    const loadEmojiPicker = async () => {
      if (!isOpen) return;
      
      setIsLoading(true);
      setLoadError(false);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        const module = await import('emoji-picker-react');
        setEmojiPicker(() => module.default);
        setIsLoading(false);
      } catch (error) {
        console.warn('Failed to load emoji-picker-react:', error);
        setLoadError(true);
        setIsLoading(false);
      }
    };

    loadEmojiPicker();
  }, [isOpen]);

  // Smart positioning with responsive viewport detection
  useEffect(() => {
    if (isOpen && pickerRef.current) {
      const rect = pickerRef.current.getBoundingClientRect();
      const availableSpaceAbove = rect.top;
      const availableSpaceBelow = viewportHeight - rect.bottom;
      const pickerHeight = isMobile ? Math.min(viewportHeight * 0.8, 500) : 480;
      
      if (position === 'top') {
        setAdjustedPosition(availableSpaceAbove >= pickerHeight ? 'top' : 'bottom');
      } else {
        setAdjustedPosition(availableSpaceBelow >= pickerHeight ? 'bottom' : 'top');
      }
    }
  }, [isOpen, position, isMobile, viewportHeight]);

  const handleEmojiClick = (emojiData: any) => {
    const emoji = emojiData.emoji || emojiData.native || emojiData;
    saveRecentEmoji(emoji);
    onEmojiSelect(emoji);
    onClose();
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

  // Quick reactions for African fashion theme
  const quickReactions = ['👑', '✨', '💎', '🌍', '👸🏾', '💃🏾', '🔥', '❤️', '😍', '🥰', '👍🏾', '🙌🏾'];
  
  // African-themed emoji suggestions
  const africanEmojis = [
    '👑', '🌍', '🦁', '🐘', '🌺', '🥭', '🍌', '🥥', 
    '👸🏾', '🤴🏾', '👩🏾‍🦱', '👨🏾‍🦱', '🙋🏾‍♀️', '🙋🏾‍♂️',
    '💃🏾', '🕺🏾', '👶🏾', '👧🏾', '👦🏾', '🧕🏾', '👵🏾', '👴🏾',
    '🏺', '🪘', '🎭', '🪶', '🌾', '🌿', '🌴', '☀️'
  ];

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
      {/* 🔥 TIKTOK-STYLE MOBILE BACKDROP */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-end justify-center"
          style={{ 
            background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.98) 0%, rgba(26, 26, 26, 0.98) 50%, rgba(42, 24, 16, 0.98) 100%)', // TikTok dark gradient
            backdropFilter: 'blur(25px)' 
          }}
          onClick={onClose}
        >
          {/* 🔥 FLOATING PARTICLES BACKGROUND */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                  background: `linear-gradient(135deg, hsl(${15 + Math.random() * 45}, 85%, 70%), hsl(${340 + Math.random() * 40}, 85%, 70%))`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: `0 0 ${8 + Math.random() * 12}px hsl(${15 + Math.random() * 45}, 85%, 70%)`
                }}
                animate={{
                  y: [0, -250, 0],
                  x: [0, Math.random() * 80 - 40, 0],
                  opacity: [0, 0.9, 0],
                  scale: [0, 1.8, 0],
                  rotate: [0, 360, 720]
                }}
                transition={{
                  duration: 8 + Math.random() * 6,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* 🔥 TIKTOK-STYLE BOTTOM SHEET */}
          <motion.div
            ref={pickerRef}
            initial={{ opacity: 0, scale: 0.96, y: 200 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 200 }}
            transition={{ type: "spring", duration: 0.7, damping: 25, stiffness: 180 }}
            className="modern-emoji-container emoji-picker-scrollable mb-0 mx-0"
            style={{
              borderRadius: '32px 32px 0 0', // TikTok-style rounded top only
              overflow: 'hidden',
              width: '100vw',
              height: '80vh',
              maxHeight: '650px',
              background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.98) 0%, rgba(34, 34, 34, 0.98) 30%, rgba(42, 24, 16, 0.98) 100%)', // Dark glass
              backdropFilter: 'blur(35px)',
              border: '1px solid rgba(255, 107, 53, 0.3)',
              borderBottom: 'none',
              boxShadow: '0 -10px 50px rgba(0, 0, 0, 0.7), 0 0 100px rgba(255, 107, 53, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)' // Enhanced vibrant glow
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {renderContent()}
          </motion.div>
        </motion.div>
      )}

      {/* Desktop positioning - unchanged */}
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
            maxHeight: dimensions.maxHeight
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
        {/* 🔥 TIKTOK-STYLE ENHANCED HEADER */}
        <div 
          className="modern-emoji-header border-b flex-shrink-0 relative overflow-hidden" 
          style={{ 
            borderColor: isMobile ? 'rgba(255, 107, 53, 0.2)' : 'rgba(223, 102, 13, 0.15)',
            background: isMobile 
              ? 'linear-gradient(135deg, rgba(255, 51, 102, 0.15) 0%, rgba(255, 107, 53, 0.15) 50%, rgba(223, 102, 13, 0.15) 100%)'
              : 'transparent'
          }}
        >
          {/* 🔥 MOBILE: Drag Handle */}
          {isMobile && (
            <motion.div 
              className="flex justify-center pt-3 pb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="w-12 h-1.5 rounded-full"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.6), rgba(255, 51, 102, 0.6))',
                  boxShadow: '0 0 20px rgba(255, 107, 53, 0.4)'
                }}
                animate={{
                  width: [48, 56, 48],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          )}

          {/* 🔥 ANIMATED SHIMMER BACKGROUND (MOBILE) */}
          {isMobile && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Title and close button */}
          <div className={`flex items-center justify-between ${isMobile ? 'px-6 py-4' : 'p-5'} pb-3 relative z-10`}>
            <div className="flex items-center gap-4">
              <motion.span 
                className={`${isMobile ? 'text-3xl' : 'text-2xl'}`}
                animate={{ 
                  rotate: [0, 15, -15, 10, -5, 0],
                  scale: [1, 1.2, 1.4, 1.2, 1, 1],
                  textShadow: isMobile ? [
                    '0 0 10px rgba(255, 107, 53, 0.6)',
                    '0 0 20px rgba(255, 107, 53, 0.8)',
                    '0 0 30px rgba(255, 107, 53, 1)',
                    '0 0 20px rgba(255, 107, 53, 0.8)',
                    '0 0 10px rgba(255, 107, 53, 0.6)'
                  ] : []
                }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                style={{ 
                  filter: isMobile 
                    ? 'drop-shadow(0 0 15px rgba(255, 107, 53, 0.8))' 
                    : 'drop-shadow(0 2px 4px rgba(223, 102, 13, 0.3))'
                }}
              >
                ✨
              </motion.span>
              <div>
                <motion.h3 
                  className={`font-semibold font-heading ${isMobile ? 'text-2xl' : 'text-xl'}`}
                  style={{ 
                    color: isMobile ? '#ff6b35' : 'var(--primary-blue)',
                    fontFamily: 'var(--font-heading)',
                    background: isMobile 
                      ? 'linear-gradient(135deg, #ff3366, #ff6b35, #df660d)'
                      : 'linear-gradient(135deg, var(--primary-blue), var(--primary-light-blue))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: isMobile ? '0 0 30px rgba(255, 107, 53, 0.5)' : 'none'
                  }}
                  animate={isMobile ? {
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  } : {}}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  Express Yourself
                </motion.h3>
                <motion.p 
                  className={`${isMobile ? 'text-sm' : 'text-sm'} opacity-80 font-body`}
                  style={{ 
                    color: isMobile ? 'rgba(255, 255, 255, 0.8)' : 'var(--primary-dark-blue)',
                    fontFamily: 'var(--font-body)',
                    textShadow: isMobile ? '0 0 10px rgba(255, 107, 53, 0.3)' : 'none'
                  }}
                  animate={isMobile ? {
                    opacity: [0.7, 1, 0.7]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Choose the perfect emoji ✨
                </motion.p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className={`${isMobile ? 'p-4' : 'p-2.5'} rounded-full transition-all duration-300 relative overflow-hidden`}
              style={{ 
                background: isMobile 
                  ? 'linear-gradient(135deg, rgba(255, 51, 102, 0.2), rgba(255, 107, 53, 0.2))'
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(15px)',
                border: isMobile 
                  ? '1px solid rgba(255, 107, 53, 0.3)' 
                  : '1px solid rgba(223, 102, 13, 0.2)',
                boxShadow: isMobile 
                  ? '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 107, 53, 0.4)'
                  : '0 4px 12px rgba(0, 0, 0, 0.1)',
                minWidth: isMobile ? '52px' : 'auto',
                minHeight: isMobile ? '52px' : 'auto'
              }}
              title="Close emoji picker"
            >
              {isMobile && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <X 
                className={`${isMobile ? 'h-6 w-6' : 'h-4 w-4'} relative z-10`} 
                style={{ color: isMobile ? '#ff6b35' : 'var(--primary-blue)' }} 
              />
            </motion.button>
          </div>

          {/* 🔥 TIKTOK-STYLE RESPONSIVE TAB NAVIGATION */}
          <div className={`flex ${isMobile ? 'px-6' : 'px-5'} pb-6`}>
            <motion.div 
              className="flex rounded-3xl p-2 gap-2 w-full"
              style={{
                background: isMobile 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 107, 53, 0.1))'
                  : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(25px)',
                border: isMobile 
                  ? '1px solid rgba(255, 107, 53, 0.2)' 
                  : '1px solid rgba(223, 102, 13, 0.1)',
                boxShadow: isMobile 
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 107, 53, 0.2)'
                  : 'inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {[
                { id: 'picker', icon: Sparkles, label: 'All Emojis', shortLabel: 'All' },
                { id: 'african', icon: Globe, label: 'African', shortLabel: 'African' },
                { id: 'quick', icon: Heart, label: 'Quick', shortLabel: 'Quick' }
              ].map((tab, index) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleTabClick(tab.id)}
                  className={`modern-emoji-tab flex items-center gap-3 ${isMobile ? 'px-4 py-3.5' : 'px-4 py-2.5'} rounded-2xl ${isMobile ? 'text-sm' : 'text-sm'} font-medium transition-all duration-400 flex-1 justify-center relative overflow-hidden ${
                    clickedTab === tab.id ? 'emoji-tab-active' : ''
                  }`}
                  style={{
                    background: activeTab === tab.id 
                      ? (isMobile 
                          ? 'linear-gradient(135deg, #ff3366 0%, #ff6b35 50%, #df660d 100%)'
                          : 'var(--primary-blue)')
                      : (isMobile 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : 'rgba(255, 255, 255, 0.5)'),
                    color: activeTab === tab.id 
                      ? 'var(--pure-white)' 
                      : (isMobile ? 'rgba(255, 255, 255, 0.8)' : 'var(--primary-blue)'),
                    fontFamily: 'var(--font-body)',
                    minHeight: isMobile ? '56px' : 'auto',
                    boxShadow: activeTab === tab.id 
                      ? (isMobile 
                          ? '0 0 30px rgba(255, 107, 53, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                          : '0 8px 25px rgba(223, 102, 13, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)')
                      : '0 2px 8px rgba(0, 0, 0, 0.05)',
                    border: activeTab === tab.id 
                      ? '1px solid rgba(255, 255, 255, 0.2)' 
                      : (isMobile ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(223, 102, 13, 0.1)')
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                >
                  {/* Shimmer effect for active tab */}
                  {activeTab === tab.id && isMobile && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <tab.icon className={`${isMobile ? 'h-5 w-5' : 'h-3.5 w-3.5'} relative z-10`} />
                  <span className={`${isMobile ? 'text-sm' : 'text-sm'} relative z-10`}>
                    {isMobile ? tab.shortLabel : tab.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* 🔥 TIKTOK-STYLE RESPONSIVE TAB CONTENT */}
        <div 
          className="flex-1 overflow-hidden modern-emoji-scrollbar" 
          style={{ 
            backgroundColor: isMobile 
              ? 'rgba(17, 17, 17, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backgroundImage: isMobile 
              ? 'radial-gradient(circle at 20% 80%, rgba(255, 51, 102, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
              : 'none'
          }}
        >
          {activeTab === 'picker' && (
            <div className="h-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <motion.div 
                      className={`${isMobile ? 'w-16 h-16' : 'w-10 h-10'} rounded-full mx-auto mb-8`}
                      style={{ 
                        background: isMobile 
                          ? 'linear-gradient(135deg, #ff3366, #ff6b35, #df660d)'
                          : 'linear-gradient(135deg, var(--primary-blue), var(--primary-light-blue))',
                        position: 'relative'
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      <div 
                        className="absolute inset-2 rounded-full"
                        style={{ 
                          backgroundColor: isMobile ? 'rgba(17, 17, 17, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                          border: isMobile ? '1px solid rgba(255, 107, 53, 0.3)' : 'none'
                        }}
                      />
                    </motion.div>
                    <motion.p 
                      className={`${isMobile ? 'text-xl' : 'text-base'} font-medium font-body mb-2`}
                      style={{ 
                        color: isMobile ? '#ff6b35' : 'var(--primary-blue)',
                        fontFamily: 'var(--font-body)',
                        textShadow: isMobile ? '0 0 20px rgba(255, 107, 53, 0.5)' : 'none'
                      }}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Loading thousands of emojis...
                    </motion.p>
                    <p 
                      className={`${isMobile ? 'text-base' : 'text-xs'} font-body opacity-70`}
                      style={{ 
                        color: isMobile ? 'rgba(255, 255, 255, 0.7)' : 'var(--primary-dark-blue)',
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      Including skin tones & advanced search ✨
                    </p>
                  </div>
                </div>
              ) : loadError ? (
                <div className="flex items-center justify-center h-full">
                  <div className={`text-center ${isMobile ? 'p-8' : 'p-10'}`}>
                    <motion.div 
                      className={`${isMobile ? 'text-8xl' : 'text-5xl'} mb-6`}
                      animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      😔
                    </motion.div>
                    <p 
                      className={`${isMobile ? 'text-xl' : 'text-base'} font-medium font-body mb-3`}
                      style={{ 
                        color: isMobile ? '#ff6b35' : 'var(--primary-blue)',
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      Couldn't load full emoji library
                    </p>
                    <p 
                      className={`${isMobile ? 'text-base' : 'text-xs'} font-body opacity-70`}
                      style={{ 
                        color: isMobile ? 'rgba(255, 255, 255, 0.7)' : 'var(--medium-gray)',
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      Try the Quick or African tabs instead
                    </p>
                  </div>
                </div>
              ) : EmojiPicker ? (
                <div className="modern-emoji-scrollbar h-full">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    autoFocusSearch={false}
                    theme={isMobile ? "dark" : "light"}
                    width="100%"
                    height={isMobile ? "100%" : "430px"}
                    previewConfig={{
                      showPreview: !isMobile,
                      defaultEmoji: "1f60a",
                      defaultCaption: "Choose an emoji to express yourself!"
                    }}
                    searchPlaceHolder="Search thousands of emojis..."
                    defaultSkinTone="medium-dark"
                    categories={[
                      { name: "Smileys & People", category: "smileys_people" },
                      { name: "Animals & Nature", category: "animals_nature" },
                      { name: "Food & Drink", category: "food_drink" },
                      { name: "Activities", category: "activities" },
                      { name: "Travel & Places", category: "travel_places" },
                      { name: "Objects", category: "objects" },
                      { name: "Symbols", category: "symbols" },
                      { name: "Flags", category: "flags" }
                    ]}
                    suggestedEmojisMode="recent"
                    skinTonesDisabled={false}
                    emojiStyle="native"
                    lazyLoadEmojis={true}
                    style={{
                      '--epr-emoji-size': isMobile ? '42px' : '32px',
                      '--epr-emoji-padding': isMobile ? '12px' : '6px',
                      '--epr-category-label-bg-color': isMobile 
                        ? 'linear-gradient(135deg, rgba(255, 51, 102, 0.2), rgba(255, 107, 53, 0.2))'
                        : 'linear-gradient(135deg, var(--primary-extra-light-blue), rgba(255, 255, 255, 0.9))',
                      '--epr-category-label-text-color': isMobile ? '#ff6b35' : 'var(--primary-blue)',
                      '--epr-search-border-color': isMobile ? 'rgba(255, 107, 53, 0.3)' : 'rgba(223, 102, 13, 0.2)',
                      '--epr-search-bg-color': isMobile ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                      '--epr-search-text-color': isMobile ? '#ffffff' : 'var(--black)',
                      '--epr-highlight-color': isMobile ? '#ff6b35' : 'var(--primary-blue)',
                      '--epr-hover-bg-color': isMobile ? 'rgba(255, 107, 53, 0.2)' : 'rgba(223, 102, 13, 0.1)',
                      '--epr-focus-bg-color': isMobile ? 'rgba(255, 107, 53, 0.3)' : 'rgba(223, 102, 13, 0.15)',
                      '--epr-text-color': isMobile ? '#ffffff' : 'var(--black)',
                      '--epr-bg-color': 'transparent',
                      '--epr-category-icon-active-color': isMobile ? '#ff6b35' : 'var(--primary-blue)',
                      '--epr-skin-tone-picker-menu-color': isMobile ? 'rgba(34, 34, 34, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      '--epr-preview-bg-color': isMobile ? 'rgba(255, 107, 53, 0.1)' : 'rgba(255, 238, 230, 0.8)',
                      '--epr-preview-text-color': isMobile ? '#ff6b35' : 'var(--primary-blue)',
                      '--epr-preview-border-color': isMobile ? 'rgba(255, 107, 53, 0.3)' : 'rgba(223, 102, 13, 0.2)',
                      '--epr-preview-height': isMobile ? '0px' : '70px',
                      fontFamily: 'var(--font-body)',
                      fontSize: isMobile ? '20px' : '16px'
                    } as React.CSSProperties}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className={`${isMobile ? 'text-6xl' : 'text-4xl'} mb-4`}>🤔</div>
                    <p 
                      className={`${isMobile ? 'text-base' : 'text-sm'} font-body`}
                      style={{ 
                        color: isMobile ? 'rgba(255, 255, 255, 0.7)' : 'var(--medium-gray)',
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      Something went wrong
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'african' && (
            <div className={`h-full overflow-y-auto modern-emoji-scrollbar ${isMobile ? 'p-6' : 'p-6'}`}>
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h4 
                  className={`font-semibold mb-4 ${isMobile ? 'text-2xl' : 'text-xl'}`}
                  style={{ 
                    color: isMobile ? '#ff6b35' : 'var(--primary-blue)',
                    fontFamily: 'var(--font-heading)',
                    background: isMobile 
                      ? 'linear-gradient(135deg, #ff3366, #ff6b35, #df660d)'
                      : 'linear-gradient(135deg, var(--primary-blue), var(--primary-light-blue))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: isMobile ? '0 0 30px rgba(255, 107, 53, 0.5)' : 'none'
                  }}
                  animate={isMobile ? {
                    textShadow: [
                      '0 0 20px rgba(255, 107, 53, 0.5)',
                      '0 0 40px rgba(255, 107, 53, 0.8)',
                      '0 0 20px rgba(255, 107, 53, 0.5)'
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🌍 African & Cultural Emojis
                </motion.h4>
                <p 
                  className={`${isMobile ? 'text-base' : 'text-base'} opacity-80 mb-8`}
                  style={{ 
                    color: isMobile ? 'rgba(255, 255, 255, 0.8)' : 'var(--primary-dark-blue)',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Curated collection celebrating African heritage and culture ✨
                </p>
              </motion.div>
              
              <motion.div 
                className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-6'} gap-4`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, staggerChildren: 0.05 }}
              >
                {africanEmojis.map((emoji, index) => (
                  <motion.button
                    key={`african-${emoji}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ 
                      scale: 1.2, 
                      y: -4,
                      boxShadow: isMobile ? '0 0 30px rgba(255, 107, 53, 0.6)' : '0 8px 25px rgba(0, 0, 0, 0.2)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEmojiClick({ emoji })}
                    className={`modern-emoji-button ${isMobile ? 'p-5' : 'p-3'} rounded-3xl transition-all duration-300 ${isMobile ? 'text-5xl' : 'text-3xl'} flex items-center justify-center relative overflow-hidden`}
                    style={{ 
                      minHeight: isMobile ? '80px' : '56px',
                      background: isMobile 
                        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 107, 53, 0.1))'
                        : 'rgba(255, 255, 255, 0.6)',
                      backdropFilter: 'blur(15px)',
                      border: isMobile 
                        ? '1px solid rgba(255, 107, 53, 0.2)' 
                        : '1px solid rgba(223, 102, 13, 0.1)',
                      boxShadow: isMobile 
                        ? '0 8px 25px rgba(0, 0, 0, 0.3)' 
                        : '0 4px 15px rgba(0, 0, 0, 0.05)',
                      minTouchTarget: isMobile ? '44px' : 'auto'
                    }}
                    title={`Select ${emoji}`}
                  >
                    {isMobile && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }}
                      />
                    )}
                    <span className="relative z-10">{emoji}</span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Recent emojis section */}
              {recentEmojis.length > 0 && (
                <motion.div 
                  className="mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h4 
                    className={`font-semibold mb-6 ${isMobile ? 'text-xl' : 'text-lg'}`}
                    style={{ 
                      color: isMobile ? '#ff6b35' : 'var(--primary-blue)',
                      fontFamily: 'var(--font-heading)'
                    }}
                  >
                    🕒 Recently Used
                  </h4>
                  <div className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-6'} gap-4`}>
                    {recentEmojis.slice(0, isMobile ? 8 : 12).map((emoji, index) => (
                      <motion.button
                        key={`recent-${emoji}-${index}`}
                        whileHover={{ 
                          scale: 1.2, 
                          y: -4,
                          boxShadow: isMobile ? '0 0 25px rgba(255, 107, 53, 0.5)' : '0 8px 20px rgba(245, 113, 15, 0.3)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEmojiClick({ emoji })}
                        className={`modern-emoji-button ${isMobile ? 'p-5' : 'p-3'} rounded-3xl transition-all duration-300 ${isMobile ? 'text-4xl' : 'text-2xl'} flex items-center justify-center relative overflow-hidden`}
                        style={{ 
                          minHeight: isMobile ? '80px' : '56px',
                          background: isMobile 
                            ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(245, 113, 15, 0.2))'
                            : 'rgba(245, 113, 15, 0.1)',
                          backdropFilter: 'blur(15px)',
                          border: isMobile 
                            ? '1px solid rgba(255, 107, 53, 0.3)' 
                            : '1px solid rgba(245, 113, 15, 0.2)',
                          boxShadow: isMobile 
                            ? '0 8px 25px rgba(0, 0, 0, 0.3)' 
                            : '0 4px 15px rgba(245, 113, 15, 0.1)',
                          minTouchTarget: isMobile ? '44px' : 'auto'
                        }}
                        title={`Select ${emoji}`}
                      >
                        {isMobile && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/20 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                          />
                        )}
                        <span className="relative z-10">{emoji}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {activeTab === 'quick' && (
            <div className={`h-full overflow-y-auto modern-emoji-scrollbar ${isMobile ? 'p-6' : 'p-6'}`}>
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h4 
                  className={`font-semibold mb-4 ${isMobile ? 'text-2xl' : 'text-xl'}`}
                  style={{ 
                    color: isMobile ? '#ff6b35' : 'var(--primary-blue)',
                    fontFamily: 'var(--font-heading)',
                    background: isMobile 
                      ? 'linear-gradient(135deg, #ff3366, #ff6b35, #df660d)'
                      : 'linear-gradient(135deg, var(--primary-blue), var(--primary-light-blue))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: isMobile ? '0 0 30px rgba(255, 107, 53, 0.5)' : 'none'
                  }}
                  animate={isMobile ? {
                    textShadow: [
                      '0 0 20px rgba(255, 107, 53, 0.5)',
                      '0 0 40px rgba(255, 107, 53, 0.8)',
                      '0 0 20px rgba(255, 107, 53, 0.5)'
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚡ Quick Reactions
                </motion.h4>
                <p 
                  className={`${isMobile ? 'text-base' : 'text-base'} opacity-80 mb-8`}
                  style={{ 
                    color: isMobile ? 'rgba(255, 255, 255, 0.8)' : 'var(--primary-dark-blue)',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Most popular emojis for quick responses ✨
                </p>
              </motion.div>
              
              <motion.div 
                className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-4'} gap-6 mb-8`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, staggerChildren: 0.1 }}
              >
                {quickReactions.map((emoji, index) => (
                  <motion.button
                    key={`quick-${emoji}-${index}`}
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ 
                      scale: 1.12, 
                      y: -6,
                      boxShadow: isMobile 
                        ? '0 0 40px rgba(255, 107, 53, 0.8), 0 20px 40px rgba(0, 0, 0, 0.4)'
                        : '0 15px 35px rgba(0, 0, 0, 0.2)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEmojiClick({ emoji })}
                    className={`modern-emoji-button ${isMobile ? 'p-8' : 'p-5'} rounded-[32px] transition-all duration-400 ${isMobile ? 'text-6xl' : 'text-4xl'} flex items-center justify-center relative overflow-hidden`}
                    style={{ 
                      minHeight: isMobile ? '120px' : '80px',
                      background: isMobile 
                        ? 'linear-gradient(135deg, rgba(255, 51, 102, 0.15) 0%, rgba(255, 107, 53, 0.15) 50%, rgba(223, 102, 13, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 238, 230, 0.7))',
                      backdropFilter: 'blur(20px)',
                      border: isMobile 
                        ? '2px solid rgba(255, 107, 53, 0.3)' 
                        : '1px solid rgba(223, 102, 13, 0.2)',
                      boxShadow: isMobile 
                        ? '0 15px 35px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 107, 53, 0.3)'
                        : '0 8px 25px rgba(0, 0, 0, 0.1)',
                      minTouchTarget: isMobile ? '44px' : 'auto'
                    }}
                    title={`Select ${emoji}`}
                  >
                    {/* Enhanced shimmer effect for mobile */}
                    {isMobile && (
                      <>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-[32px]"
                          animate={{
                            boxShadow: [
                              '0 0 20px rgba(255, 107, 53, 0.3)',
                              '0 0 40px rgba(255, 107, 53, 0.6)',
                              '0 0 20px rgba(255, 107, 53, 0.3)'
                            ]
                          }}
                          transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
                        />
                      </>
                    )}
                    <span className="relative z-10">{emoji}</span>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    );
  }
}