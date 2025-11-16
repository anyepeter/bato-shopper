import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BootstrapIcon } from "./BootstrapIcon";

interface FloatingToggleButtonProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function FloatingToggleButton({ isVisible, onToggle }: FloatingToggleButtonProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Mobile breakpoint at 768px
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only show on mobile
  if (!isMobile) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="btn-moema-icon rounded-full"
      style={{
        position: 'fixed',
        top: '100px', // 30px below typical header height (70px) - moved down 20px
        right: '16px',
        zIndex: 49, // Below the header (50)
        backgroundColor: 'rgba(167, 164, 168, 0.6)', // 🎯 SET TO #a7a4a8 WITH 60% OPACITY
        backdropFilter: 'blur(10px)', // 🎯 ADD BACKDROP BLUR EFFECT
        WebkitBackdropFilter: 'blur(10px)', // 🎯 WEBKIT BROWSER SUPPORT
        color: '#FFFFFF', // 🎯 SET FONT COLOR TO WHITE
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        border: '1px solid #a7a4a865',
        width: '44px',
        height: '44px',
        padding: '10px',
        borderRadius: '50%',
        textAlign: 'center' as const,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
      }}
      title={isVisible ? 'Hide Menu' : 'Show Menu'}
    >
      {/* Bootstrap Icon */}
      <BootstrapIcon 
        name={isVisible ? 'close' : 'menu'} 
        size={24}
        color="#FFFFFF"
      />
      
      {/* Pulse animation when closed to indicate functionality */}
      {!isVisible && (
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="rounded-full"
          style={{
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            right: '-4px',
            bottom: '-4px',
            borderRadius: '50%',
            border: '2px solid #a7a4a865',
            pointerEvents: 'none'
          }}
        />
      )}
    </motion.button>
  );
}