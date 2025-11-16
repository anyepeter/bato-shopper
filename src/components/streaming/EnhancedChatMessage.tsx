import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageReactions } from '../chat/MessageReactions';
import { QuickReactionPicker } from '../chat/QuickReactionPicker';
import { BootstrapIcon } from '../BootstrapIcon';
import { Heart, MoreVertical, Reply, Copy, Flag } from 'lucide-react';

export interface LiveChatMessage {
  id: number;
  user: string;
  message: string;
  timestamp: Date;
  isStreamer?: boolean;
  isVip?: boolean;
  isModerator?: boolean;
  reactions?: { [emoji: string]: number };
  userReactions?: string[];
  attachments?: {
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    name: string;
  }[];
  isVoiceMessage?: boolean;
  voiceDuration?: number;
}

interface EnhancedChatMessageProps {
  message: LiveChatMessage;
  onReactionAdd?: (messageId: number, emoji: string) => void;
  onReactionRemove?: (messageId: number, emoji: string) => void;
  onReply?: (messageId: number) => void;
  onReport?: (messageId: number) => void;
  className?: string;
}

export function EnhancedChatMessage({
  message,
  onReactionAdd,
  onReactionRemove,
  onReply,
  onReport,
  className = ""
}: EnhancedChatMessageProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMessageActions, setShowMessageActions] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const handleReactionClick = (emoji: string) => {
    const userHasReacted = message.userReactions?.includes(emoji);
    if (userHasReacted) {
      onReactionRemove?.(message.id, emoji);
    } else {
      onReactionAdd?.(message.id, emoji);
    }
  };

  const handleQuickReaction = (emoji: string) => {
    onReactionAdd?.(message.id, emoji);
    setShowReactionPicker(false);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(message.message);
    setShowMessageActions(false);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative flex items-start gap-2 ${className}`}
      onMouseEnter={() => setShowMessageActions(true)}
      onMouseLeave={() => setShowMessageActions(false)}
    >
      {/* User Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
        message.isStreamer ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
        message.isVip ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
        message.isModerator ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
        'bg-gradient-to-r from-blue-500 to-cyan-500'
      }`}>
        {message.user.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        {/* User Info & Timestamp */}
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-medium ${
            message.isStreamer ? 'text-yellow-400' :
            message.isVip ? 'text-purple-400' :
            message.isModerator ? 'text-green-400' :
            'text-cyan-400'
          }`}>
            {message.user}
          </span>
          
          {/* Badges */}
          {message.isStreamer && (
            <span className="text-xs px-1.5 py-0.5 bg-yellow-500 text-black rounded text-[10px] font-bold">
              HOST
            </span>
          )}
          {message.isVip && (
            <span className="text-xs px-1.5 py-0.5 bg-purple-500 text-white rounded text-[10px] font-bold">
              VIP
            </span>
          )}
          {message.isModerator && (
            <span className="text-xs px-1.5 py-0.5 bg-green-500 text-white rounded text-[10px] font-bold">
              MOD
            </span>
          )}
          
          <span className="text-xs text-white/60 font-body">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        {/* Message Content */}
        <div className="relative">
          {/* Voice Message */}
          {message.isVoiceMessage ? (
            <motion.div
              className="flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/20 max-w-64"
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <motion.button
                onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BootstrapIcon 
                  name={isPlayingVoice ? "pause-fill" : "play-fill"} 
                  className="w-4 h-4 text-white"
                />
              </motion.button>
              
              {/* Voice Waveform Placeholder */}
              <div className="flex-1 flex items-center gap-1">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-0.5 bg-blue-400 rounded-full transition-all duration-100 ${
                      isPlayingVoice && i <= 8 ? 'bg-blue-600' : ''
                    }`}
                    style={{ height: `${Math.random() * 20 + 8}px` }}
                  />
                ))}
              </div>
              
              <span className="text-xs text-white/80">
                {message.voiceDuration || 15}s
              </span>
            </motion.div>
          ) : (
            <>
              {/* Text Message */}
              <p className="text-white/90 text-sm font-body break-words">
                {message.message}
              </p>

              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.attachments.map((attachment, index) => (
                    <div key={index} className="max-w-64">
                      {attachment.type === 'image' ? (
                        <motion.img
                          src={attachment.url}
                          alt={attachment.name}
                          className="w-full h-auto rounded-lg border border-white/20 cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          onClick={() => window.open(attachment.url, '_blank')}
                        />
                      ) : attachment.type === 'video' ? (
                        <video
                          src={attachment.url}
                          controls
                          className="w-full h-auto rounded-lg border border-white/20"
                          style={{ maxHeight: '200px' }}
                        />
                      ) : (
                        <motion.div
                          className="flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/20 cursor-pointer"
                          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                          onClick={() => window.open(attachment.url, '_blank')}
                        >
                          <BootstrapIcon name="file-earmark" className="w-5 h-5 text-blue-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {attachment.name}
                            </p>
                            <p className="text-white/60 text-xs">
                              {attachment.type.toUpperCase()}
                            </p>
                          </div>
                          <BootstrapIcon name="download" className="w-4 h-4 text-white/60" />
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Message Actions (Desktop Hover) */}
          <AnimatePresence>
            {showMessageActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -top-2 right-0 flex items-center gap-1 bg-black/80 backdrop-blur-md rounded-lg border border-white/20 p-1"
              >
                <motion.button
                  onClick={() => setShowReactionPicker(!showReactionPicker)}
                  className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={12} color="white" />
                </motion.button>
                
                <motion.button
                  onClick={() => onReply?.(message.id)}
                  className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Reply size={12} color="white" />
                </motion.button>
                
                <motion.button
                  onClick={copyMessage}
                  className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Copy size={12} color="white" />
                </motion.button>
                
                <motion.button
                  onClick={() => onReport?.(message.id)}
                  className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Flag size={12} color="white" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Reaction Picker */}
          <QuickReactionPicker
            isOpen={showReactionPicker}
            messageId={message.id}
            messageSender="bot"
            onEmojiSelect={handleQuickReaction}
          />
        </div>

        {/* Message Reactions */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <MessageReactions
            reactions={message.reactions}
            userReactions={message.userReactions}
            onReactionClick={handleReactionClick}
            className="mt-2"
            size="sm"
          />
        )}
      </div>
    </motion.div>
  );
}