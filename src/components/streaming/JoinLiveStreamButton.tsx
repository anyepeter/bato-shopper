import React from 'react';
import { motion } from 'motion/react';
import { BootstrapIcon } from '../BootstrapIcon';

interface JoinLiveStreamButtonProps {
  onJoinStream: () => void;
  isLive?: boolean;
  viewerCount?: number;
}

export function JoinLiveStreamButton({ 
  onJoinStream, 
  isLive = true, 
  viewerCount = 0 
}: JoinLiveStreamButtonProps) {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onJoinStream();
      }}
      className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 text-xs font-body font-bold text-white transition-all duration-300"
      style={{
        background: isLive 
          ? 'linear-gradient(135deg, #e74c3c, #c0392b)' 
          : 'linear-gradient(135deg, #df660d, #a85c0e)',
        borderRadius: '3px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
      }}
      whileTap={{ 
        scale: 0.95 
      }}
      animate={isLive ? {
        boxShadow: [
          '0 2px 8px rgba(231, 76, 60, 0.4)',
          '0 4px 16px rgba(231, 76, 60, 0.6)',
          '0 2px 8px rgba(231, 76, 60, 0.4)'
        ]
      } : {}}
      transition={isLive ? {
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      } : {}}
      title={isLive ? "Join Live Stream" : "View Stream"}
    >
      {/* Live indicator pulse dot */}
      {isLive && (
        <motion.div
          className="w-2 h-2 rounded-full mr-1"
          style={{ backgroundColor: '#ffffff' }}
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
      
      {/* Stream icon */}
      <BootstrapIcon 
        name={isLive ? "broadcast-pin" : "play-circle"} 
        size={12} 
        color="white"
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
        }}
      />
      
      {/* Text */}
      <span className="ml-1">
        {isLive ? 'LIVE' : 'STREAM'}
      </span>
      
      {/* Viewer count for live streams */}
      {isLive && viewerCount > 0 && (
        <span className="ml-1 opacity-90">
          {viewerCount}
        </span>
      )}

      {/* Background glow effect for live streams */}
      {isLive && (
        <motion.div
          className="absolute inset-0 rounded-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.3), rgba(192, 57, 43, 0.3))',
            filter: 'blur(4px)',
            zIndex: -1,
            borderRadius: '3px'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.button>
  );
}