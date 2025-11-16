import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Smile, Plus } from "lucide-react";
import { MessageReaction } from "../../constants/adminChatData";
import { EmojiPicker } from "../EmojiPicker";
import { ModernEmojiPicker } from "../ModernEmojiPicker";

interface AdminChatMessagesProps {
  conversation: any;
  currentUser?: any;
  onMessageSend: (messageText: string, conversationId: number) => void;
  onConversationAction: (action: string, conversationId: number) => void;
}

export function AdminChatMessages({
  conversation,
  currentUser,
  onMessageSend,
  onConversationAction
}: AdminChatMessagesProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isModernEmojiPickerOpen, setIsModernEmojiPickerOpen] = useState(false);
  const [emojiPickerMode, setEmojiPickerMode] = useState<'enhanced' | 'modern'>('enhanced');
  const [messageReactions, setMessageReactions] = useState<Record<number, MessageReaction[]>>({});
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);

  // Mock messages for display
  const messages = [
    {
      id: 1,
      text: conversation.lastMessage,
      sender: 'customer',
      timestamp: conversation.lastMessageTime,
      status: 'delivered' as const
    },
    {
      id: 2,
      text: "Thank you for reaching out! I'll help you with your inquiry right away.",
      sender: 'admin',
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      status: 'read' as const
    }
  ];

  const handleEmojiSelect = (emoji: string) => {
    setInputMessage(inputMessage + emoji);
    setIsEmojiPickerOpen(false);
    setIsModernEmojiPickerOpen(false);
  };

  const handleEmojiButtonClick = () => {
    if (emojiPickerMode === 'enhanced') {
      setIsEmojiPickerOpen(!isEmojiPickerOpen);
      setIsModernEmojiPickerOpen(false);
    } else {
      setIsModernEmojiPickerOpen(!isModernEmojiPickerOpen);
      setIsEmojiPickerOpen(false);
    }
  };

  const toggleEmojiPickerMode = () => {
    setEmojiPickerMode(prev => prev === 'enhanced' ? 'modern' : 'enhanced');
    setIsEmojiPickerOpen(false);
    setIsModernEmojiPickerOpen(false);
  };

  const handleMessageReaction = (messageId: number, emoji: string) => {
    setMessageReactions(prev => {
      const currentReactions = prev[messageId] || [];
      const existingReaction = currentReactions.find(r => r.emoji === emoji);
      
      if (existingReaction) {
        // Toggle reaction (remove if admin already reacted)
        if (existingReaction.users.includes('admin')) {
          const updatedReaction = {
            ...existingReaction,
            users: existingReaction.users.filter(u => u !== 'admin'),
            count: existingReaction.count - 1
          };
          
          return {
            ...prev,
            [messageId]: updatedReaction.count > 0 
              ? currentReactions.map(r => r.emoji === emoji ? updatedReaction : r)
              : currentReactions.filter(r => r.emoji !== emoji)
          };
        } else {
          // Add admin reaction
          const updatedReaction = {
            ...existingReaction,
            users: [...existingReaction.users, 'admin'],
            count: existingReaction.count + 1
          };
          
          return {
            ...prev,
            [messageId]: currentReactions.map(r => r.emoji === emoji ? updatedReaction : r)
          };
        }
      } else {
        // Add new reaction
        const newReaction = {
          emoji,
          users: ['admin'],
          count: 1
        };
        
        return {
          ...prev,
          [messageId]: [...currentReactions, newReaction]
        };
      }
    });
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onMessageSend(inputMessage.trim(), conversation.id);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Customer Info Header */}
      <div 
        className="p-4 border-b"
        style={{ 
          backgroundColor: 'var(--light-gray)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={conversation.customerAvatar}
              alt={conversation.customerName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 
                className="font-semibold font-heading"
                style={{ color: 'var(--black)' }}
              >
                {conversation.customerName}
              </h3>
              <p 
                className="text-sm font-body"
                style={{ color: 'var(--medium-gray)' }}
              >
                {conversation.customerEmail} • {conversation.customerId}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                conversation.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                conversation.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                conversation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}
            >
              {conversation.priority.toUpperCase()}
            </span>
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                conversation.status === 'active' ? 'bg-green-100 text-green-800' :
                conversation.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                conversation.status === 'escalated' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              {conversation.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ 
          backgroundColor: '#f0f2f5',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2h-4zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <AnimatePresence>
          {messages.map((message) => {
            const reactions = messageReactions[message.id] || [];
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", duration: 0.3 }}
                className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                onMouseEnter={() => setHoveredMessageId(message.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                <div className="relative max-w-xs lg:max-w-md">
                  <div
                    className={`px-4 py-2 rounded-2xl relative ${
                      message.sender === 'admin' 
                        ? 'rounded-br-md' 
                        : 'rounded-bl-md'
                    }`}
                    style={{
                      backgroundColor: message.sender === 'admin' 
                        ? 'var(--primary-blue)' 
                        : 'var(--pure-white)',
                      color: message.sender === 'admin' 
                        ? 'var(--pure-white)' 
                        : 'var(--black)',
                      boxShadow: 'var(--shadow-standard-desktop)'
                    }}
                  >
                    <p className="text-sm leading-relaxed font-body">
                      {message.text}
                    </p>
                    <div className={`flex items-center justify-end space-x-1 mt-1 ${
                      message.sender === 'admin' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.sender === 'admin' && (
                        <div className="flex">
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
                  </div>

                  {/* Message Reaction Button */}
                  <AnimatePresence>
                    {hoveredMessageId === message.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute bottom-0 ${message.sender === 'admin' ? 'left-0' : 'right-0'} transform ${message.sender === 'admin' ? '-translate-x-2' : 'translate-x-2'} translate-y-1`}
                      >
                        <div className="flex space-x-1">
                          {['❤️', '👍', '😂', '😢', '😮'].map((emoji) => (
                            <motion.button
                              key={emoji}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleMessageReaction(message.id, emoji)}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-lg border-2"
                              style={{
                                backgroundColor: 'var(--pure-white)',
                                borderColor: reactions.find(r => r.emoji === emoji && r.users.includes('admin')) 
                                  ? 'var(--primary-blue)' 
                                  : 'var(--border)'
                              }}
                            >
                              {emoji}
                            </motion.button>
                          ))}
                          
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2"
                            style={{
                              backgroundColor: 'var(--pure-white)',
                              borderColor: 'var(--border)'
                            }}
                          >
                            <Plus className="h-3 w-3" style={{ color: 'var(--medium-gray)' }} />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Display Reactions */}
                  {reactions.length > 0 && (
                    <div className={`flex flex-wrap gap-1 mt-2 ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      {reactions.map((reaction, index) => (
                        <motion.button
                          key={`${reaction.emoji}-${index}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMessageReaction(message.id, reaction.emoji)}
                          className="px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 border"
                          style={{
                            backgroundColor: reaction.users.includes('admin') 
                              ? 'var(--primary-extra-light-blue)' 
                              : 'var(--pure-white)',
                            borderColor: reaction.users.includes('admin') 
                              ? 'var(--primary-blue)' 
                              : 'var(--border)',
                            color: reaction.users.includes('admin') 
                              ? 'var(--primary-blue)' 
                              : 'var(--medium-gray)'
                          }}
                        >
                          <span>{reaction.emoji}</span>
                          <span>{reaction.count}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {conversation.isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-start"
          >
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-md"
              style={{
                backgroundColor: 'var(--pure-white)',
                boxShadow: 'var(--shadow-standard-desktop)'
              }}
            >
              <div className="flex space-x-1">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--medium-gray)' }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--medium-gray)' }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--medium-gray)' }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Message Input */}
      <div 
        className="relative border-t bg-white"
        style={{ 
          backgroundColor: 'var(--pure-white)',
          borderColor: 'var(--border)',
          zIndex: 100,
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="p-4 flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-4 pr-12 border font-body text-base"
              style={{
                fontFamily: 'var(--font-body)',
                borderColor: 'var(--border)',
                backgroundColor: 'var(--pure-white)',
                minHeight: '56px',
                fontSize: '16px',
                borderRadius: '3px'
              }}
            />
            
            {/* Emoji Picker Buttons */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleEmojiPickerMode}
                className="p-1 rounded-full text-xs"
                style={{
                  backgroundColor: emojiPickerMode === 'modern' ? 'var(--primary-blue)' : 'var(--light-gray)',
                  color: emojiPickerMode === 'modern' ? 'var(--pure-white)' : 'var(--medium-gray)',
                  fontSize: '10px',
                  minWidth: '20px',
                  height: '20px'
                }}
                title={`Switch to ${emojiPickerMode === 'enhanced' ? 'modern' : 'enhanced'} emoji picker`}
              >
                {emojiPickerMode === 'enhanced' ? '⚡' : '🌟'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleEmojiButtonClick}
                className="p-2 rounded-full transition-colors relative"
                style={{
                  backgroundColor: (isEmojiPickerOpen || isModernEmojiPickerOpen) ? 'var(--primary-extra-light-blue)' : 'transparent',
                  color: (isEmojiPickerOpen || isModernEmojiPickerOpen) ? 'var(--primary-blue)' : 'var(--medium-gray)'
                }}
              >
                <Smile className="h-5 w-5" />
                {emojiPickerMode === 'modern' && (
                  <div 
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                    style={{ backgroundColor: 'var(--primary-blue)' }}
                  />
                )}
              </motion.button>
              
              {/* Emoji Picker Popups */}
              <div className="relative">
                <EmojiPicker
                  isOpen={isEmojiPickerOpen && emojiPickerMode === 'enhanced'}
                  onClose={() => setIsEmojiPickerOpen(false)}
                  onEmojiSelect={handleEmojiSelect}
                  position="top"
                  className="absolute bottom-full right-0 mb-2 z-[200]"
                />
                
                <ModernEmojiPicker
                  isOpen={isModernEmojiPickerOpen && emojiPickerMode === 'modern'}
                  onClose={() => setIsModernEmojiPickerOpen(false)}
                  onEmojiSelect={handleEmojiSelect}
                  position="top"
                  className="absolute bottom-full right-0 mb-2 z-[200]"
                />
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-4 rounded-lg flex-shrink-0"
            style={{
              backgroundColor: inputMessage.trim() ? 'var(--primary-blue)' : 'var(--medium-gray)',
              color: 'var(--pure-white)',
              minHeight: '56px',
              minWidth: '56px',
              borderRadius: '3px'
            }}
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}