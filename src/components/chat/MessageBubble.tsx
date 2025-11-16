import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Smile } from "lucide-react";
import { Message } from "../../types";
import { formatTime } from "../../utils/chatHelpers";
import { MessageReactions } from "./MessageReactions";
import { QuickReactionPicker } from "./QuickReactionPicker";

interface MessageBubbleProps {
  message: Message;
  isHovered: boolean;
  activeReactionMessageId: number | null;
  onReactionButtonClick: (messageId: number) => void;
  onMessageReaction: (messageId: number, emoji: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function MessageBubble({
  message,
  isHovered,
  activeReactionMessageId,
  onReactionButtonClick,
  onMessageReaction,
  onMouseEnter,
  onMouseLeave
}: MessageBubbleProps) {
  const isReactionPickerOpen = activeReactionMessageId === message.id;
  
  // 🔥 MOBILE DETECTION
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", duration: 0.3 }}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative group max-w-xs lg:max-w-md">
        {/* Message Bubble */}
        <motion.div
          className={`px-4 py-3 rounded-2xl relative overflow-hidden ${
            message.sender === 'user' 
              ? 'rounded-br-md' 
              : 'rounded-bl-md'
          }`}
          style={{
            backgroundColor: 'transparent', // 🔥 TRANSPARENT BACKGROUND FOR ALL MESSAGES
            color: isMobile 
              ? '#ffffff' // 🔥 WHITE TEXT ON MOBILE
              : message.sender === 'user' 
                ? 'var(--pure-white)' 
                : 'var(--black)',
            boxShadow: isMobile 
              ? message.sender === 'user'
                ? '0 8px 25px rgba(255, 107, 53, 0.3)'
                : '0 8px 25px rgba(0, 0, 0, 0.3)'
              : 'var(--shadow-sm)',
            backdropFilter: isMobile && message.sender === 'bot' ? 'blur(20px)' : 'none',
            border: isMobile && message.sender === 'bot' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
          }}
          whileHover={isMobile ? { scale: 1.02 } : {}}
          animate={isMobile && message.sender === 'user' ? {
            boxShadow: [
              '0 8px 25px rgba(255, 107, 53, 0.3)',
              '0 8px 25px rgba(255, 51, 102, 0.4)',
              '0 8px 25px rgba(255, 107, 53, 0.3)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* 🔥 SHIMMER EFFECT FOR USER MESSAGES ON MOBILE */}
          {isMobile && message.sender === 'user' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <p 
            className={`${isMobile ? 'text-base' : 'text-sm'} leading-relaxed font-body relative z-10`}
            style={{ 
              fontFamily: 'var(--font-body)',
              textShadow: isMobile && message.sender === 'user' ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'
            }}
          >
            {message.text}
          </p>
          
          {/* 🔥 ENHANCED MESSAGE METADATA */}
          <div className={`flex items-center justify-between mt-2 relative z-10 ${
            isMobile 
              ? 'text-white/80' 
              : message.sender === 'user' 
                ? 'text-white/70' 
                : 'text-gray-500'
          }`}>
            <span className={`${isMobile ? 'text-xs' : 'text-xs'} font-body`}>
              {formatTime(message.timestamp)}
            </span>
            
            {/* Status indicators for user messages */}
            {message.sender === 'user' && (
              <div className="flex items-center space-x-1">
                {message.status === 'sending' && (
                  <div className="w-3 h-3 rounded-full border border-current animate-spin" />
                )}
                {message.status === 'sent' && (
                  <div className="text-xs">✓</div>
                )}
                {(message.status === 'delivered' || message.status === 'read') && (
                  <div className="text-xs">✓✓</div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* 🔥 TIKTOK-STYLE EMOJI REACTION BUTTON */}
        <motion.button
          whileHover={{ 
            scale: 1.2,
            rotate: 360
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onReactionButtonClick(message.id)}
          className={`absolute ${message.sender === 'user' ? 'left-0' : 'right-0'} bottom-0 transform translate-y-1/2 ${
            message.sender === 'user' ? '-translate-x-1/2' : 'translate-x-1/2'
          } ${isMobile ? 'p-2' : 'p-1.5'} rounded-full shadow-lg transition-all duration-300 z-10 backdrop-blur-md ${
            isHovered || isReactionPickerOpen
              ? 'opacity-100' 
              : 'opacity-0 group-hover:opacity-100'
          }`}
          style={{
            backgroundColor: isMobile 
              ? isReactionPickerOpen 
                ? 'rgba(255, 107, 53, 0.9)' 
                : 'rgba(255, 255, 255, 0.15)'
              : isReactionPickerOpen 
                ? 'var(--primary-blue)' 
                : 'var(--pure-white)',
            color: isMobile 
              ? '#ffffff'
              : isReactionPickerOpen 
                ? 'var(--pure-white)' 
                : 'var(--primary-blue)',
            border: isMobile 
              ? '1px solid rgba(255, 255, 255, 0.3)'
              : `1px solid var(--primary-blue)`,
            boxShadow: isMobile && isReactionPickerOpen 
              ? '0 0 20px rgba(255, 107, 53, 0.5)' 
              : 'none'
          }}
          title="React to this message"
          animate={isMobile && isReactionPickerOpen ? {
            boxShadow: [
              '0 0 20px rgba(255, 107, 53, 0.5)',
              '0 0 30px rgba(255, 107, 53, 0.7)',
              '0 0 20px rgba(255, 107, 53, 0.5)'
            ]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Smile className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
        </motion.button>

        {/* Quick Reaction Picker */}
        <QuickReactionPicker
          isOpen={isReactionPickerOpen}
          messageId={message.id}
          messageSender={message.sender}
          onEmojiSelect={(emoji) => onMessageReaction(message.id, emoji)}
        />

        {/* Message Reactions Display */}
        <MessageReactions
          reactions={message.reactions || []}
          onReactionClick={(emoji) => onMessageReaction(message.id, emoji)}
        />
      </div>
    </motion.div>
  );
}