import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BootstrapIcon } from '../BootstrapIcon';
import { Product } from '../../types';

interface QuickSocialActionsProps {
  product: Product;
  onShare?: () => void;
  onComment?: () => void;
  onReaction?: (emoji: string) => void;
}

export function QuickSocialActions({ 
  product, 
  onShare, 
  onComment,
  onReaction 
}: QuickSocialActionsProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const reactions = ['❤️', '😍', '🔥', '👏', '✨', '🎉'];

  const handleReaction = (emoji: string) => {
    setSelectedReaction(emoji);
    onReaction?.(emoji);
    
    // Auto-hide after animation
    setTimeout(() => {
      setShowReactions(false);
    }, 300);
  };

  return (
    <div className="relative">
      {/* Main Action Buttons */}
      <div className="flex gap-3">
        {/* Quick Reaction */}
        <motion.button
          onClick={() => setShowReactions(!showReactions)}
          className="relative flex flex-col items-center gap-1"
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md"
            style={{
              background: selectedReaction 
                ? 'linear-gradient(135deg, #ec4899, #f43f5e)' 
                : 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            animate={selectedReaction ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            {selectedReaction ? (
              <span className="text-2xl">{selectedReaction}</span>
            ) : (
              <BootstrapIcon name="heart" className="w-6 h-6 text-white" />
            )}
          </motion.div>
          <span className="text-white text-xs font-body font-medium">
            {selectedReaction ? 'Loved' : 'React'}
          </span>
        </motion.button>

        {/* Comments */}
        <motion.button
          onClick={onComment}
          className="flex flex-col items-center gap-1"
          whileTap={{ scale: 0.9 }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md relative"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            <BootstrapIcon name="chat-dots" className="w-6 h-6 text-white" />
            {/* Comment count badge */}
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, #5825efff, #6e29f6)',
                border: '1px solid white',
                color: 'white'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {Math.floor(Math.random() * 20) + 5}
            </motion.div>
          </div>
          <span className="text-white text-xs font-body font-medium">Discuss</span>
        </motion.button>

        {/* Share */}
        <motion.button
          onClick={onShare}
          className="flex flex-col items-center gap-1"
          whileTap={{ scale: 0.9 }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            <BootstrapIcon name="share" className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-body font-medium">Share</span>
        </motion.button>
      </div>

      {/* Reaction Picker Popup */}
      <AnimatePresence>
        {showReactions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-2 p-2 rounded-lg backdrop-blur-md"
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div className="flex gap-2">
              {reactions.map((emoji, index) => (
                <motion.button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="text-2xl hover:scale-125 transition-transform"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
