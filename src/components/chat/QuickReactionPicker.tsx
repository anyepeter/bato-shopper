import { motion, AnimatePresence } from "motion/react";
import { QUICK_REACTION_EMOJIS } from "../../constants/chatData";

interface QuickReactionPickerProps {
  isOpen: boolean;
  messageId: number;
  messageSender: 'user' | 'bot';
  onEmojiSelect: (emoji: string) => void;
}

export function QuickReactionPicker({ 
  isOpen, 
  messageId, 
  messageSender, 
  onEmojiSelect 
}: QuickReactionPickerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ type: "spring", duration: 0.2 }}
          className={`absolute ${messageSender === 'user' ? 'left-0' : 'right-0'} top-full mt-2 p-2 rounded-xl shadow-lg z-20 ${
            messageSender === 'user' ? 'transform -translate-x-8' : 'transform translate-x-8'
          }`}
          style={{
            backgroundColor: 'var(--pure-white)',
            border: '0.5px solid var(--border)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}
        >
          <div className="flex gap-1">
            {QUICK_REACTION_EMOJIS.map((emoji, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEmojiSelect(emoji)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                style={{ fontSize: '16px' }}
                title={`React with ${emoji}`}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}