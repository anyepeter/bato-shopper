import { useState, useRef, useEffect } from "react";
import { X, Send, Smile, Phone, Video, MoreVertical, Star, ShoppingBag, ArrowLeft, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  senderRole: 'admin' | 'customer';
  content: string;
  timestamp: string;
  isRead: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface CustomerChatSession {
  id: number;
  customerId: number;
  customerName: string;
  customerAvatar?: string;
  reviewId?: number;
  productName?: string;
  lastMessage: string;
  lastMessageTime: string;
  isActive: boolean;
  unreadCount: number;
  messages: ChatMessage[];
  reviewRating?: number;
  reviewTitle?: string;
}

interface ReviewChatRoomProps {
  isOpen: boolean;
  onClose: () => void;
  chatSession: CustomerChatSession | null;
  onBack: () => void;
}

// Review-focused response suggestions
const REVIEW_RESPONSES = [
  "Thank you so much for taking the time to share your experience! Your feedback means the world to us. 🧡",
  "We're thrilled to hear you love your purchase! Would you mind sharing what you loved most about it? ✨",
  "I apologize for any inconvenience you experienced. Let me help make this right for you. 💙",
  "Your detailed review is incredibly helpful for other customers. Thank you for being so thorough! 🙏",
  "We take all feedback seriously and are constantly working to improve. Thank you for helping us do better! 📈",
  "It sounds like this piece is perfect for you! Have you considered any matching accessories from our collection? 👗",
  "We're always here to help with sizing questions. Would you like me to send you our detailed size guide? 📏",
  "Quality is our top priority. I'd love to learn more about your experience so we can address any concerns. 🔍"
];

// Orange-themed emojis
const ORANGE_EMOJIS = [
  '🧡', '🍊', '🎃', '🦊', '🔥', '🌅', '🌻', '🥕', 
  '🦋', '✨', '💫', '⭐', '🎨', '👑', '💎', '🌟',
  '😊', '🥰', '😍', '🤗', '👍', '🙏', '💖', '🎉'
];

export function ReviewChatRoom({ isOpen, onClose, chatSession, onBack }: ReviewChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(chatSession?.messages || []);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showResponseSuggestions, setShowResponseSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatSession) {
      setMessages(chatSession.messages);
    }
  }, [chatSession]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !chatSession) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      senderId: 999, // Admin ID
      senderName: "Admin User",
      senderRole: 'admin',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: true,
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Update message status to sent
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 500);

    // Simulate delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleResponseSuggestion = (response: string) => {
    setInputMessage(response);
    setShowResponseSuggestions(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!isOpen || !chatSession) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="absolute inset-4 md:inset-8 lg:inset-16 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{ backgroundColor: 'var(--pure-white)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Review Chat Header */}
          <div 
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ 
              background: 'linear-gradient(135deg, #df660d, #f5710f)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }}
          >
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="p-2 rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <ArrowLeft className="h-5 w-5" style={{ color: 'var(--pure-white)' }} />
              </motion.button>

              <motion.div 
                className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {chatSession.customerAvatar ? (
                  <ImageWithFallback
                    src={chatSession.customerAvatar}
                    alt={chatSession.customerName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6" style={{ color: 'var(--pure-white)' }} />
                )}
              </motion.div>
              
              <div>
                <h3 
                  className="font-semibold font-heading"
                  style={{ 
                    color: 'var(--pure-white)',
                    fontFamily: 'var(--font-heading)'
                  }}
                >
                  {chatSession.customerName}
                </h3>
                <div className="flex items-center gap-2">
                  {chatSession.reviewRating && (
                    <div className="flex items-center gap-1">
                      {renderStars(chatSession.reviewRating)}
                    </div>
                  )}
                  <p 
                    className="text-sm opacity-90 font-body"
                    style={{ 
                      color: 'var(--pure-white)',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    {isTyping ? 'typing...' : `Review Discussion • ${chatSession.isActive ? 'Active' : 'Offline'}`}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                title="Video Call Support"
              >
                <Video className="h-5 w-5" style={{ color: 'var(--pure-white)' }} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                title="Phone Support"
              >
                <Phone className="h-5 w-5" style={{ color: 'var(--pure-white)' }} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full ml-2"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <X className="h-5 w-5" style={{ color: 'var(--pure-white)' }} />
              </motion.button>
            </div>
          </div>

          {/* Review Context Banner */}
          {chatSession.reviewTitle && (
            <div 
              className="px-6 py-3 border-b"
              style={{ 
                backgroundColor: 'rgba(245, 113, 15, 0.1)',
                borderColor: 'rgba(245, 113, 15, 0.2)'
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(245, 113, 15, 0.2)' }}
                >
                  <ShoppingBag className="h-4 w-4" style={{ color: '#f5710f' }} />
                </div>
                <div>
                  <p 
                    className="text-sm font-medium"
                    style={{ 
                      fontFamily: 'var(--font-heading)',
                      color: '#f5710f'
                    }}
                  >
                    Discussing Review: "{chatSession.reviewTitle}"
                  </p>
                  {chatSession.productName && (
                    <p 
                      className="text-xs text-gray-600"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Product: {chatSession.productName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ 
              backgroundColor: '#fef7f0',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f5710f' fill-opacity='0.03'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2h-4zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              height: 'calc(100vh - 300px)',
              minHeight: '400px'
            }}
          >
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: "spring", duration: 0.3 }}
                  className={`flex ${message.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative ${
                      message.senderRole === 'admin' 
                        ? 'rounded-br-md' 
                        : 'rounded-bl-md'
                    }`}
                    style={{
                      background: message.senderRole === 'admin' 
                        ? 'linear-gradient(135deg, #df660d, #f5710f)' 
                        : 'var(--pure-white)',
                      color: message.senderRole === 'admin' 
                        ? 'var(--pure-white)' 
                        : 'var(--black)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <p 
                      className="text-sm leading-relaxed font-body"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {message.content}
                    </p>
                    <div className={`flex items-center justify-end space-x-1 mt-1 ${
                      message.senderRole === 'admin' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.senderRole === 'admin' && (
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
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
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
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div className="flex space-x-1">
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#f5710f' }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#f5710f' }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#f5710f' }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div 
            className="relative"
            style={{
              height: '200px',
              backgroundColor: 'var(--pure-white)',
              borderTop: `1px solid rgba(245, 113, 15, 0.2)`,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {/* Response Suggestions */}
            <AnimatePresence>
              {showResponseSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  transition={{ type: "spring", duration: 0.3 }}
                  className="absolute bottom-full left-8 mb-4 p-4 rounded-2xl shadow-lg z-20 overflow-y-auto"
                  style={{
                    backgroundColor: 'var(--pure-white)',
                    boxShadow: 'var(--shadow-lg)',
                    width: '400px',
                    maxHeight: '300px',
                    border: `1px solid rgba(245, 113, 15, 0.2)`
                  }}
                >
                  <h4 
                    className="font-semibold mb-3 font-heading sticky top-0 bg-white"
                    style={{
                      color: '#f5710f',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '14px'
                    }}
                  >
                    Suggested Responses 🧡
                  </h4>
                  <div className="space-y-2">
                    {REVIEW_RESPONSES.map((response, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleResponseSuggestion(response)}
                        className="w-full text-left p-3 rounded-lg transition-colors hover:bg-orange-50 border border-transparent hover:border-orange-200"
                        style={{
                          fontSize: '13px',
                          fontFamily: 'var(--font-body)',
                          color: 'var(--black)'
                        }}
                      >
                        {response}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Emoji Picker */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  transition={{ type: "spring", duration: 0.3 }}
                  className="absolute bottom-full left-8 mb-4 p-4 rounded-2xl shadow-lg z-20 overflow-y-auto"
                  style={{
                    backgroundColor: 'var(--pure-white)',
                    boxShadow: 'var(--shadow-lg)',
                    width: '280px',
                    maxHeight: '300px',
                    border: `1px solid rgba(245, 113, 15, 0.2)`
                  }}
                >
                  <h4 
                    className="font-semibold mb-3 font-heading sticky top-0 bg-white"
                    style={{
                      color: '#f5710f',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '14px'
                    }}
                  >
                    Express Yourself 🧡
                  </h4>
                  <div className="grid grid-cols-6 gap-2">
                    {ORANGE_EMOJIS.map((emoji, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEmojiClick(emoji)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-orange-50"
                        style={{
                          fontSize: '20px',
                          backgroundColor: 'transparent'
                        }}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div 
              className="relative w-full h-full flex items-center"
              style={{ 
                backgroundColor: 'var(--pure-white)',
                padding: '24px'
              }}
            >
              {/* Quick Response Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowResponseSuggestions(!showResponseSuggestions)}
                className="absolute left-8 p-3 rounded-full z-10"
                style={{ 
                  color: showResponseSuggestions ? '#f5710f' : 'var(--medium-gray)',
                  backgroundColor: showResponseSuggestions ? 'rgba(245, 113, 15, 0.1)' : 'rgba(255, 255, 255, 0.8)'
                }}
                title="Quick responses"
              >
                <span style={{ fontSize: '16px' }}>💡</span>
              </motion.button>

              {/* Emoji Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute left-20 p-3 rounded-full z-10"
                style={{ 
                  color: showEmojiPicker ? '#f5710f' : 'var(--medium-gray)',
                  backgroundColor: showEmojiPicker ? 'rgba(245, 113, 15, 0.1)' : 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <Smile className="h-5 w-5" />
              </motion.button>

              {/* Input Field */}
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response to this customer..."
                className="w-full pl-32 pr-20 py-4 rounded-full text-base border-none outline-none font-body"
                style={{
                  backgroundColor: 'rgba(245, 113, 15, 0.05)',
                  color: 'var(--black)',
                  fontFamily: 'var(--font-body)',
                  border: `1px solid rgba(245, 113, 15, 0.2)`
                }}
              />

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="absolute right-8 p-3 rounded-full z-10"
                style={{ 
                  background: inputMessage.trim() ? 'linear-gradient(135deg, #df660d, #f5710f)' : 'var(--medium-gray)',
                  color: 'var(--pure-white)',
                  opacity: inputMessage.trim() ? 1 : 0.5
                }}
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}