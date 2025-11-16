import React from 'react';
import { motion } from 'motion/react';
import { Play, Users, Zap } from 'lucide-react';
import { LIVE_STREAMS } from '../../constants/streamingData';

interface QuickWatchStreamButtonProps {
  onNavigateToStream: () => void;
  className?: string;
}

export function QuickWatchStreamButton({ onNavigateToStream, className = '' }: QuickWatchStreamButtonProps) {
  const liveStreamCount = LIVE_STREAMS.length;
  const totalViewers = LIVE_STREAMS.reduce((total, stream) => total + stream.viewerCount, 0);

  if (liveStreamCount === 0) {
    return null; // Don't show if no live streams
  }

  return (
    <motion.button
      onClick={onNavigateToStream}
      className={`group relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, #2b2bf7 0%, #4040f8 50%, #6e29f6 100%)',
        borderRadius: '3px',
        padding: '12px 20px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(43, 43, 247, 0.3)'
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 6px 25px rgba(43, 43, 247, 0.4)'
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #6e29f6 0%, #2b2bf7 50%, #4040f8 100%)',
          opacity: 0
        }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
          transform: 'translateX(-100%)'
        }}
        animate={{ transform: 'translateX(300%)' }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex items-center gap-3">
        {/* Play icon with pulse effect */}
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Play size={20} color="white" fill="white" />
          
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white"
            animate={{ 
              scale: [1, 1.8, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="font-heading text-white font-bold text-sm">
              Watch Live
            </span>
            <motion.div
              className="w-2 h-2 bg-red-500 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
          
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <Zap size={12} color="rgba(255, 255, 255, 0.8)" />
              <span className="font-body text-white/80 text-xs">
                {liveStreamCount} Live
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Users size={12} color="rgba(255, 255, 255, 0.8)" />
              <span className="font-body text-white/80 text-xs">
                {totalViewers.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, white, transparent 70%)',
          borderRadius: '3px'
        }}
      />
    </motion.button>
  );
}