import { motion } from "motion/react";
import { ChatIcon } from "./BootstrapIcon";

interface FloatingChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function FloatingChatButton({ onClick, isOpen }: FloatingChatButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
      style={{
        width: '64px',
        height: '64px',
        background: isOpen 
          ? 'linear-gradient(135deg, #5825efff, #5825efff)' 
          : 'linear-gradient(135deg, #5825efff, #5825efff)',
        border: '2px solid rgba(255, 255, 255, 0.2)'
      }}
      whileHover={{ 
        scale: 1.1,
        rotate: 5
      }}
      whileTap={{ 
        scale: 0.95,
        rotate: -5
      }}
      animate={{
        y: [0, -8, 0],
        boxShadow: [
          '0 10px 25px rgba(88, 37, 239, 0.3)',
          '0 15px 35px rgba(88, 37, 239, 0.4)',
          '0 10px 25px rgba(88, 37, 239, 0.3)'
        ]
      }}
      transition={{
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        },
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      title={isOpen ? "Close Chat" : "Open Chat Support"}
    >
      {/* Bootstrap Chat Icon */}
      <ChatIcon
        size={24}
        color="white"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
        }}
      />

      {/* Notification Pulse */}
      {!isOpen && (
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(88, 37, 239, 0.3), #5825efff)',
            border: '2px solid white'
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(88, 37, 239, 0.4), rgba(88, 37, 239, 0.4))',
          filter: 'blur(8px)',
          zIndex: -1
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
}