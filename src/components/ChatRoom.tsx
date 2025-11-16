import { useState, useRef, useEffect } from "react";
import { X, Send, Smile, Paperclip, Phone, Video } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdminChatRoom } from "./AdminChatRoom";
import { EmojiPicker } from "./EmojiPicker";
import { ModernEmojiPicker } from "./ModernEmojiPicker";
import { MessageBubble } from "./chat/MessageBubble";
import { VoiceMessageInterface } from "./chat/VoiceMessageInterface";
import { VideoCallInterface } from "./chat/VideoCallInterface";
import { PhoneCallInterface } from "./chat/PhoneCallInterface";
import { Message } from "../types";
import { 
  getBotResponse, 
  createUserMessage, 
  createBotMessage, 
  updateMessageStatus,
  handleMessageReaction as handleReactionHelper
} from "../utils/chatHelpers";

interface ChatRoomProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: any;
}

export function ChatRoom({ isOpen, onClose, currentUser }: ChatRoomProps) {
  // Check if current user is admin - ONLY show AdminChatRoom to actual admins
  if (currentUser?.isAdmin === true) {
    return <AdminChatRoom isOpen={isOpen} onClose={onClose} currentUser={currentUser} />;
  }
  
  // State management
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! 👋🏾 I'm Amara, your personal style assistant at Modish Style! Welcome to our beautiful collection of authentic African fashion! ✨ How can I help you find the perfect piece today? 👗👑",
      sender: 'bot',
      timestamp: new Date(),
      status: 'delivered',
      reactions: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showModernEmojiPicker, setShowModernEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [emojiPickerMode, setEmojiPickerMode] = useState<'quick' | 'full'>('quick');
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<number | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
  
  // 🔥 NEW INTERFACE STATES
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const [showVideoInterface, setShowVideoInterface] = useState(false);
  const [showPhoneInterface, setShowPhoneInterface] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔥 MOBILE DETECTION STATE
  const [isMobile, setIsMobile] = useState(false);

  // 🔥 MOBILE DETECTION EFFECT
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Mobile breakpoint at 768px
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Event handlers
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = createUserMessage(inputMessage);
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Update message status to sent
    setTimeout(() => {
      setMessages(prev => updateMessageStatus(prev, userMessage.id, 'sent'));
    }, 500);

    // Simulate typing delay and bot response
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = createBotMessage(getBotResponse(inputMessage));
      setMessages(prev => [...prev, botResponse]);
    }, Math.random() * 2000 + 1000);
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
    setShowModernEmojiPicker(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleMessageReaction = (messageId: number, emoji: string) => {
    setMessages(prev => handleReactionHelper(prev, messageId, emoji));
    setActiveReactionMessageId(null);
  };

  const handleReactionButtonClick = (messageId: number) => {
    setActiveReactionMessageId(activeReactionMessageId === messageId ? null : messageId);
  };

  const handleEmojiButtonClick = () => {
    if (emojiPickerMode === 'quick') {
      setShowEmojiPicker(!showEmojiPicker);
      setShowModernEmojiPicker(false);
    } else {
      setShowModernEmojiPicker(!showModernEmojiPicker);
      setShowEmojiPicker(false);
    }
  };

  const toggleEmojiPickerMode = () => {
    setEmojiPickerMode(prev => prev === 'quick' ? 'full' : 'quick');
    setShowEmojiPicker(false);
    setShowModernEmojiPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        const fileMessage = createUserMessage(`📎 ${file.name}`);
        setMessages(prev => [...prev, { ...fileMessage, status: 'sent' }]);
        setInputMessage('');
        setShowAttachmentMenu(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  // 🔥 NEW INTERFACE HANDLERS
  const handleVoiceMessageOpen = () => {
    setShowVoiceInterface(true);
  };

  const handleVoiceMessageClose = () => {
    setShowVoiceInterface(false);
  };

  const handleVoiceMessageSend = (audioBlob: Blob, duration: number) => {
    const voiceMessage = createUserMessage(`🎤 Voice message (${Math.floor(duration)}s)`);
    setMessages(prev => [...prev, { ...voiceMessage, status: 'sent' }]);
    
    // Simulate bot response to voice message
    setTimeout(() => {
      const botResponse = createBotMessage("I received your voice message! I'm listening and will respond to help you with your fashion needs. 🎧✨");
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  const handleVideoCallOpen = () => {
    setShowVideoInterface(true);
  };

  const handleVideoCallClose = () => {
    setShowVideoInterface(false);
  };

  const handlePhoneCallOpen = () => {
    setShowPhoneInterface(true);
  };

  const handlePhoneCallClose = () => {
    setShowPhoneInterface(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999]"
        style={{
          background: isMobile 
            ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a1810 100%)' // 🔥 TIKTOK DARK GRADIENT
            : 'rgba(0, 0, 0, 0.5)' // Desktop: Normal overlay
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ 
            opacity: 0, 
            scale: isMobile ? 0.98 : 0.95, 
            y: isMobile ? 30 : 20 
          }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0 
          }}
          exit={{ 
            opacity: 0, 
            scale: isMobile ? 0.98 : 0.95, 
            y: isMobile ? 30 : 20 
          }}
          transition={{ 
            type: "spring", 
            duration: isMobile ? 0.6 : 0.5,
            bounce: isMobile ? 0.3 : 0.25
          }}
          className={`absolute ${
            isMobile 
              ? 'inset-0' // 🔥 MOBILE: Full screen TikTok-style
              : 'inset-4 md:inset-8 lg:inset-16' // Desktop: Normal insets
          } ${isMobile ? 'rounded-none' : 'rounded-2xl'} overflow-hidden shadow-2xl flex flex-col`}
          style={{ 
            backgroundColor: isMobile 
              ? '#000000' // 🔥 PURE BLACK FOR TIKTOK STYLE
              : 'var(--pure-white)',
            border: isMobile 
              ? 'none' 
              : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: isMobile 
              ? '0 0 50px rgba(223, 102, 13, 0.3)' // 🔥 ORANGE GLOW
              : '0 25px 50px rgba(0, 0, 0, 0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 🔥 TIKTOK-STYLE CHAT HEADER */}
          <motion.div 
            className="flex items-center justify-between px-6 py-4 border-b relative overflow-hidden"
            style={{ 
              background: isMobile 
                ? 'linear-gradient(135deg, #5825efff 0%, #5825efff 50%, #5825efff 100%)' // 🔥 BLUE GRADIENT
                : 'linear-gradient(180deg, #5825efff, #5825efff)',
              borderColor: isMobile 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.2)',
              height: isMobile ? '80px' : '70px' // 🔥 TALLER ON MOBILE
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {/* 🔥 ANIMATED BACKGROUND PARTICLES (MOBILE ONLY) */}
            {isMobile && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.2, 0.8, 0.2],
                      scale: [1, 1.5, 1]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center space-x-4 z-10">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`${isMobile ? 'w-14 h-14' : 'w-12 h-12'} rounded-full flex items-center justify-content overflow-hidden relative`}
                  style={{ 
                    background: isMobile 
                      ? 'linear-gradient(135deg, #ffd700, #ffb347)' // 🔥 GOLD GRADIENT
                      : 'var(--warning-yellow)',
                    border: isMobile ? '3px solid rgba(255, 255, 255, 0.3)' : 'none'
                  }}
                  animate={isMobile ? {
                    boxShadow: [
                      '0 0 0 0 rgba(255, 215, 0, 0.7)',
                      '0 0 0 10px rgba(255, 215, 0, 0)',
                      '0 0 0 0 rgba(255, 215, 0, 0)'
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span 
                    className={`${isMobile ? 'text-2xl' : 'text-xl'} font-bold font-heading`}
                    style={{ color: isMobile ? '#000000' : 'var(--primary-blue)' }}
                  >
                    A
                  </span>
                  
                  {/* 🔥 ONLINE STATUS INDICATOR (MOBILE) */}
                  {isMobile && (
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              </motion.div>
              
              <div className="flex-1">
                <motion.h3 
                  className={`font-semibold font-heading ${isMobile ? 'text-lg' : 'text-base'}`}
                  style={{ 
                    color: 'var(--pure-white)',
                    fontFamily: 'var(--font-heading)',
                    textShadow: isMobile ? '0 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
                  }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Amara - Style Assistant
                </motion.h3>
                
                <motion.div className="flex items-center gap-2">
                  <motion.p 
                    className={`${isMobile ? 'text-sm' : 'text-sm'} opacity-90 font-body`}
                    style={{ 
                      color: 'var(--pure-white)',
                      fontFamily: 'var(--font-body)',
                      textShadow: isMobile ? '0 1px 2px rgba(0, 0, 0, 0.5)' : 'none'
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {isTyping ? 'typing...' : 'Online • African Fashion Expert'}
                  </motion.p>
                  
                  {/* 🔥 LIVE INDICATOR (MOBILE) */}
                  {isMobile && !isTyping && (
                    <motion.div
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-xs text-white/90 font-body">LIVE</span>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 z-10">
              {isMobile && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleVoiceMessageOpen}
                  className="p-3 rounded-full backdrop-blur-md"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  title="Voice Message"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🎤
                  </motion.div>
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleVideoCallOpen}
                className={`${isMobile ? 'p-3' : 'p-2'} rounded-full backdrop-blur-md`}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                title="Video Call Support"
              >
                <Video className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} style={{ color: 'var(--pure-white)' }} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePhoneCallOpen}
                className={`${isMobile ? 'p-3' : 'p-2'} rounded-full backdrop-blur-md`}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                title="Phone Support: +1 (800) BATO-HELP"
              >
                <Phone className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} style={{ color: 'var(--pure-white)' }} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`${isMobile ? 'p-3 ml-2' : 'p-2 ml-2'} rounded-full backdrop-blur-md`}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <X className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} style={{ color: 'var(--pure-white)' }} />
              </motion.button>
            </div>
          </motion.div>

          {/* 🔥 TIKTOK-STYLE CHAT MESSAGES */}
          <motion.div 
            className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages-scrollable relative"
            style={{ 
              backgroundColor: isMobile ? '#000000' : '#f0f2f5', // 🔥 BLACK BACKGROUND
              backgroundImage: isMobile 
                ? 'radial-gradient(circle at 20% 50%, rgba(88, 37, 239, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(88, 37, 239, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(88, 37, 239, 0.1) 0%, transparent 50%)' // 🔥 SUBTLE BLUE GRADIENT ORBS
                : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2h-4zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              height: isMobile ? 'calc(100vh - 200px)' : 'calc(100vh - 240px)', // 🔥 ADJUSTED FOR NEW HEADER
              minHeight: '400px'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {/* 🔥 FLOATING PARTICLES BACKGROUND (MOBILE ONLY) */}
            {isMobile && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width: Math.random() * 4 + 2,
                      height: Math.random() * 4 + 2,
                      backgroundColor: `hsl(${260 + Math.random() * 20}, 70%, 60%)`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    animate={{
                      y: [0, -100, 0],
                      x: [0, Math.random() * 50 - 25, 0],
                      opacity: [0, 0.6, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 4 + Math.random() * 4,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            )}
            <AnimatePresence>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isHovered={hoveredMessageId === message.id}
                  activeReactionMessageId={activeReactionMessageId}
                  onReactionButtonClick={handleReactionButtonClick}
                  onMessageReaction={handleMessageReaction}
                  onMouseEnter={() => setHoveredMessageId(message.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                />
              ))}
            </AnimatePresence>
            
            {/* 🔥 TIKTOK-STYLE TYPING INDICATOR */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                className="flex justify-start"
              >
                <motion.div
                  className="px-4 py-3 rounded-2xl rounded-bl-md relative overflow-hidden"
                  style={{
                    backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.1)' : 'var(--pure-white)',
                    backdropFilter: isMobile ? 'blur(20px)' : 'none',
                    border: isMobile ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                    boxShadow: isMobile 
                      ? '0 8px 25px rgba(0, 0, 0, 0.3)' 
                      : 'var(--shadow-sm)'
                  }}
                  animate={isMobile ? {
                    boxShadow: [
                      '0 8px 25px rgba(0, 0, 0, 0.3)',
                      '0 8px 25px rgba(223, 102, 13, 0.2)',
                      '0 8px 25px rgba(0, 0, 0, 0.3)'
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {/* 🔥 SHIMMER EFFECT (MOBILE) */}
                  {isMobile && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  
                  <div className="flex space-x-1 relative z-10">
                    {[0, 1, 2].map(delay => (
                      <motion.div
                        key={delay}
                        className="w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: isMobile 
                            ? '#5825efff' // 🔥 VIBRANT BLUE
                            : 'var(--medium-gray)' 
                        }}
                        animate={{ 
                          y: [0, -8, 0],
                          scale: [1, 1.3, 1]
                        }}
                        transition={{ 
                          duration: 0.6, 
                          repeat: Infinity, 
                          delay: delay * 0.15,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </motion.div>

          {/* 🔥 TIKTOK-STYLE CHAT INPUT AREA */}
          <motion.div 
            className="relative"
            style={{
              height: isMobile ? '120px' : '120px', // 🔥 INCREASED HEIGHT FOR MOBILE
              backgroundColor: 'transparent', // 🔥 TRANSPARENT BACKGROUND
              borderTop: isMobile 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : `0.5px solid var(--border)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: isMobile 
                ? 'linear-gradient(135deg, rgba(88, 37, 239, 0.05) 0%, rgba(88, 37, 239, 0.05) 100%)'
                : 'none'
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {/* Emoji Pickers */}
            <div className="absolute bottom-full left-0 right-0">
              <AnimatePresence>
                {showEmojiPicker && emojiPickerMode === 'quick' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ type: "spring", duration: 0.3 }}
                    className={`absolute bottom-0 ${isMobile ? 'left-4' : 'left-8'} mb-4 p-4 rounded-2xl shadow-lg z-30 overflow-y-auto`}
                    style={{
                      backgroundColor: 'var(--pure-white)',
                      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
                      width: isMobile ? '320px' : '300px', // 🔥 MOBILE: Wider for better UX
                      maxHeight: '350px',
                      border: isMobile 
                        ? '1px solid rgba(255, 255, 255, 0.2)' 
                        : '0.5px solid var(--border)',
                      backgroundColor: isMobile 
                        ? 'rgba(17, 17, 17, 0.95)' // 🔥 DARK GLASS
                        : 'var(--pure-white)',
                      backdropFilter: isMobile ? 'blur(20px)' : 'none'
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <motion.h4 
                        className="font-semibold font-heading"
                        style={{
                          color: isMobile ? '#5825efff' : 'var(--primary-blue)', // 🔥 VIBRANT BLUE
                          fontFamily: 'var(--font-heading)',
                          fontSize: isMobile ? '16px' : '14px',
                          textShadow: isMobile ? '0 0 10px rgba(88, 37, 239, 0.5)' : 'none' // 🔥 BLUE GLOW EFFECT
                        }}
                        animate={isMobile ? {
                          textShadow: [
                            '0 0 10px rgba(88, 37, 239, 0.5)',
                            '0 0 20px rgba(88, 37, 239, 0.8)',
                            '0 0 10px rgba(88, 37, 239, 0.5)'
                          ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ✨ Quick Emojis
                      </motion.h4>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleEmojiPickerMode}
                        className="px-3 py-1 text-xs rounded-full backdrop-blur-md"
                        style={{
                          backgroundColor: isMobile 
                            ? 'rgba(88, 37, 239, 0.2)' // 🔥 VIBRANT BLUE GLASS
                            : 'var(--primary-extra-light-blue)',
                          color: isMobile ? '#5825efff' : 'var(--primary-blue)',
                          fontFamily: 'var(--font-body)',
                          border: isMobile ? '1px solid rgba(88, 37, 239, 0.3)' : 'none',
                          boxShadow: isMobile ? '0 4px 15px rgba(88, 37, 239, 0.2)' : 'none'
                        }}
                        title="Switch to full emoji picker"
                      >
                        View All
                      </motion.button>
                    </div>
                    
                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {['👑', '🌍', '🦁', '🐘', '🌺', '👸🏾', '🤴🏾', '💃🏾', '🕺🏾', '👶🏾', '👧🏾', '👦🏾'].map((emoji, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEmojiClick(emoji)}
                          className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                          style={{ 
                            fontSize: isMobile ? '24px' : '20px', // 🔥 LARGER ON MOBILE
                            backgroundColor: 'transparent',
                            border: isMobile ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                          }}
                          whileHover={{
                            scale: 1.2,
                            backgroundColor: isMobile 
                              ? 'rgba(88, 37, 239, 0.2)' 
                              : 'rgba(0, 0, 0, 0.1)',
                            boxShadow: isMobile 
                              ? '0 0 20px rgba(88, 37, 239, 0.4)'
                              : 'none'
                          }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                    
                    <div 
                      className="pt-3 border-t" 
                      style={{ 
                        borderColor: isMobile 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'var(--light-gray)' 
                      }}
                    >
                      <div className="grid grid-cols-6 gap-2">
                        {['❤️', '😍', '🥰', '😊', '👍', '🙏🏾', '🔥', '✨', '💫', '⭐', '🎉', '💖'].map((emoji, index) => (
                          <motion.button
                            key={`extra-${index}`}
                            whileHover={{ 
                              scale: 1.3,
                              rotate: 360
                            }}
                            whileTap={{ scale: 0.8 }}
                            onClick={() => handleEmojiClick(emoji)}
                            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                            style={{ 
                              fontSize: isMobile ? '22px' : '18px',
                              backgroundColor: 'transparent',
                              border: isMobile ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                            }}
                            animate={isMobile ? {
                              boxShadow: [
                                '0 0 0 0 rgba(88, 37, 239, 0)',
                                '0 0 0 2px rgba(88, 37, 239, 0.3)',
                                '0 0 0 0 rgba(88, 37, 239, 0)'
                              ]
                            } : {}}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              delay: index * 0.2 
                            }}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <EmojiPicker
                isOpen={showEmojiPicker && emojiPickerMode === 'full'}
                onClose={() => setShowEmojiPicker(false)}
                onEmojiSelect={handleEmojiClick}
                position="top"
                className={`absolute bottom-0 ${isMobile ? 'left-4' : 'left-8'} mb-4 z-30`}
              />

              <ModernEmojiPicker
                isOpen={showModernEmojiPicker}
                onClose={() => setShowModernEmojiPicker(false)}
                onEmojiSelect={handleEmojiClick}
                position="top"
                className={`absolute bottom-0 ${isMobile ? 'left-4' : 'left-8'} mb-4 z-30`}
              />

              {/* Attachment Menu */}
              <AnimatePresence>
                {showAttachmentMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ type: "spring", duration: 0.3 }}
                    className={`absolute bottom-0 ${isMobile ? 'right-16' : 'right-20'} mb-4 p-3 rounded-2xl shadow-lg z-30`}
                    style={{
                      backgroundColor: 'var(--pure-white)',
                      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
                      width: isMobile ? '180px' : '200px', // 🔥 MOBILE: Slightly smaller width
                      border: '0.5px solid var(--border)'
                    }}
                  >
                    <div className="space-y-2">
                      {[
                        { icon: '📎', title: 'Document', subtitle: 'PDF, DOC, TXT', accept: '*/*' },
                        { icon: '🖼️', title: 'Photo', subtitle: 'JPG, PNG, GIF', accept: 'image/*' }
                      ].map((item, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (fileInputRef.current) {
                              fileInputRef.current.accept = item.accept;
                              fileInputRef.current.click();
                            }
                          }}
                          className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-100"
                          style={{ textAlign: 'left' }}
                        >
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'var(--primary-extra-light-blue)' }}
                          >
                            <span style={{ color: 'var(--primary-blue)', fontSize: '16px' }}>{item.icon}</span>
                          </div>
                          <div>
                            <p 
                              className="font-medium font-body"
                              style={{ 
                                color: 'var(--black)',
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px'
                              }}
                            >
                              {item.title}
                            </p>
                            <p 
                              className="text-xs font-body"
                              style={{ 
                                color: 'var(--medium-gray)',
                                fontFamily: 'var(--font-body)'
                              }}
                            >
                              {item.subtitle}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 🔥 TIKTOK-STYLE INPUT CONTAINER */}
            <motion.div 
              className={`relative w-full ${isMobile ? 'mx-4' : 'max-w-4xl mx-6'} flex items-center`}
              style={{ height: isMobile ? '64px' : '56px' }} // 🔥 TALLER ON MOBILE
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              {/* 🔥 TIKTOK-STYLE EMOJI BUTTON */}
              <div className="absolute left-3 flex items-center gap-2 z-20">
                <motion.button
                  whileHover={{ 
                    scale: 1.15,
                    rotate: 360
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleEmojiButtonClick}
                  className={`${isMobile ? 'p-3' : 'p-2'} rounded-full relative backdrop-blur-md`}
                  style={{ 
                    color: isMobile ? '#5825efff' : 'var(--primary-blue)',
                    backgroundColor: isMobile 
                      ? (showEmojiPicker || showModernEmojiPicker) 
                        ? 'rgba(88, 37, 239, 0.2)' 
                        : 'rgba(255, 255, 255, 0.1)'
                      : (showEmojiPicker || showModernEmojiPicker) 
                        ? 'var(--primary-extra-light-blue)' 
                        : 'var(--pure-white)',
                    border: isMobile 
                      ? `1px solid ${(showEmojiPicker || showModernEmojiPicker) ? 'rgba(88, 37, 239, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`
                      : `1px solid ${(showEmojiPicker || showModernEmojiPicker) ? 'var(--primary-blue)' : 'var(--border)'}`,
                    boxShadow: isMobile 
                      ? (showEmojiPicker || showModernEmojiPicker) 
                        ? '0 0 20px rgba(88, 37, 239, 0.4)' 
                        : '0 4px 15px rgba(0, 0, 0, 0.2)'
                      : (showEmojiPicker || showModernEmojiPicker) 
                        ? '0 4px 12px rgba(88, 37, 239, 0.25)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  title="Add emojis to your message"
                  animate={isMobile && (showEmojiPicker || showModernEmojiPicker) ? {
                    boxShadow: [
                      '0 0 20px rgba(88, 37, 239, 0.4)',
                      '0 0 30px rgba(88, 37, 239, 0.6)',
                      '0 0 20px rgba(88, 37, 239, 0.4)'
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Smile className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
                </motion.button>
                
                {!isMobile && ( // 🔥 MOBILE: Hide emoji mode toggle on mobile to save space
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleEmojiPickerMode}
                    className="px-2 py-1 text-xs rounded-full border"
                    style={{
                      backgroundColor: emojiPickerMode === 'full' ? 'var(--primary-blue)' : 'var(--pure-white)',
                      color: emojiPickerMode === 'full' ? 'var(--pure-white)' : 'var(--primary-blue)',
                      borderColor: 'var(--primary-blue)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '10px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    title={`Switch to ${emojiPickerMode === 'quick' ? 'full' : 'quick'} emoji picker`}
                  >
                    {emojiPickerMode === 'quick' ? '⚡' : '🌟'}
                  </motion.button>
                )}
              </div>

              {/* 🔥 TIKTOK-STYLE INPUT FIELD */}
              <motion.input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isMobile ? "Type message... ✨" : "Type your message here... ✨"} // 🔥 ENHANCED PLACEHOLDER
                className={`w-full ${isMobile ? 'pl-18 pr-18' : 'pl-20 pr-20'} py-3 text-base border outline-none font-body transition-all duration-300`}
                style={{
                  backgroundColor: isMobile 
                    ? 'rgba(255, 255, 255, 0.1)' // 🔥 GLASS MORPHISM
                    : 'var(--light-gray)',
                  color: isMobile ? '#ffffff' : 'var(--black)', // 🔥 WHITE TEXT ON MOBILE
                  fontFamily: 'var(--font-body)',
                  borderColor: isMobile 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'var(--border)',
                  borderWidth: isMobile ? '1px' : '0.5px',
                  fontSize: isMobile ? '16px' : '14px',
                  backdropFilter: isMobile ? 'blur(20px)' : 'none',
                  boxShadow: isMobile 
                    ? '0 8px 25px rgba(0, 0, 0, 0.3)' 
                    : 'none',
                  borderRadius: '3px' // 🎯 FIXED: 3px border radius instead of rounded-full
                }}
                whileFocus={isMobile ? {
                  borderColor: 'rgba(88, 37, 239, 0.5)',
                  boxShadow: '0 0 20px rgba(88, 37, 239, 0.3)'
                } : {}}
              />

              {/* 🔥 TIKTOK-STYLE RIGHT SIDE BUTTONS */}
              <div className="absolute right-3 flex items-center gap-2 z-20">
                <motion.button
                  whileHover={{ 
                    scale: 1.15,
                    rotate: 15
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  className={`${isMobile ? 'p-3' : 'p-2'} rounded-full backdrop-blur-md`}
                  style={{ 
                    color: isMobile ? '#ff6b35' : (showAttachmentMenu ? 'var(--primary-blue)' : 'var(--medium-gray)'),
                    backgroundColor: isMobile 
                      ? showAttachmentMenu 
                        ? 'rgba(255, 107, 53, 0.2)' 
                        : 'rgba(255, 255, 255, 0.1)'
                      : 'var(--pure-white)',
                    border: isMobile 
                      ? `1px solid ${showAttachmentMenu ? 'rgba(255, 107, 53, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`
                      : `1px solid ${showAttachmentMenu ? 'var(--primary-blue)' : 'var(--border)'}`,
                    boxShadow: isMobile 
                      ? showAttachmentMenu 
                        ? '0 0 20px rgba(255, 107, 53, 0.4)' 
                        : '0 4px 15px rgba(0, 0, 0, 0.2)'
                      : 'none'
                  }}
                  title="Attach files"
                >
                  <Paperclip className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className={`${isMobile ? 'p-3' : 'p-2'} rounded-full backdrop-blur-md relative overflow-hidden`}
                  style={{
                    backgroundColor: isMobile 
                      ? inputMessage.trim() 
                        ? 'linear-gradient(135deg, #ff6b35, #ff3366)' // 🔥 VIBRANT GRADIENT
                        : 'rgba(255, 255, 255, 0.1)'
                      : inputMessage.trim() 
                        ? 'var(--primary-blue)' 
                        : 'var(--medium-gray)',
                    color: 'var(--pure-white)',
                    border: isMobile ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                    boxShadow: isMobile && inputMessage.trim() 
                      ? '0 0 25px rgba(255, 107, 53, 0.5)' 
                      : 'none'
                  }}
                  title="Send message"
                  animate={isMobile && inputMessage.trim() ? {
                    boxShadow: [
                      '0 0 25px rgba(255, 107, 53, 0.5)',
                      '0 0 35px rgba(255, 51, 102, 0.7)',
                      '0 0 25px rgba(255, 107, 53, 0.5)'
                    ]
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {/* 🔥 SEND BUTTON SHIMMER EFFECT (MOBILE) */}
                  {isMobile && inputMessage.trim() && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  
                  <Send className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'} relative z-10`} />
                </motion.button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="*/*"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 🔥 NEW INTERFACE MODALS */}
      <VoiceMessageInterface
        isOpen={showVoiceInterface}
        onClose={handleVoiceMessageClose}
        onSendVoiceMessage={handleVoiceMessageSend}
        isMobile={isMobile}
      />

      <VideoCallInterface
        isOpen={showVideoInterface}
        onClose={handleVideoCallClose}
        supportAgent={{
          name: 'Amara - Style Assistant',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150',
          status: 'online'
        }}
        isMobile={isMobile}
      />

      <PhoneCallInterface
        isOpen={showPhoneInterface}
        onClose={handlePhoneCallClose}
        supportAgent={{
          name: 'Amara Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150',
          status: 'online',
          phone: '+1 (800) BATO-HELP',
          department: 'Customer Support'
        }}
        isMobile={isMobile}
      />
    </AnimatePresence>
  );
}