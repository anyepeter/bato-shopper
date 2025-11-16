import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  Users, 
  Heart, 
  ThumbsUp, 
  Smile, 
  Star,
  ShoppingBag,
  MessageCircle,
  Eye,
  Flag,
  Crown,
  Shield,
  Coffee,
  Sparkles,
  Zap,
  Gift,
  Paperclip,
  Mic,
  Phone,
  Video,
  Filter,
  Search,
  TrendingUp,
  Activity,
  Clock,
  Share2,
  MoreHorizontal,
  Upload,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Avatar } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { MessageBubble } from './MessageBubble';
import { MessageReactions } from './MessageReactions';
import { ModernEmojiPicker } from '../ModernEmojiPicker';
import { EmojiPicker } from '../EmojiPicker';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
}

interface CommunityMember {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  memberSince: string;
  purchaseStatus: 'purchased' | 'favorited' | 'both';
  totalPurchases: number;
  isVerified: boolean;
  badges: ('top-reviewer' | 'early-adopter' | 'super-fan' | 'helpful')[];
}

interface CommunityMessage {
  id: number;
  userId: number;
  message: string;
  timestamp: string;
  reactions: { [emoji: string]: number };
  userReactions: string[];
  messageType: 'text' | 'product-review' | 'question' | 'tip' | 'image' | 'file' | 'voice';
  attachments?: {
    type: 'image' | 'file' | 'voice';
    url: string;
    name: string;
    size?: number;
    duration?: number;
  }[];
  isHighlighted?: boolean;
  helpfulCount?: number;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  isEdited?: boolean;
  editedAt?: string;
  mentions?: number[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  translatedText?: string;
  originalLanguage?: string;
}

interface ProductCommunityChatRoomProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  currentUser: any;
  isMobile?: boolean;
}

export function ProductCommunityChatRoom({
  isOpen,
  onClose,
  product,
  currentUser,
  isMobile = false
}: ProductCommunityChatRoomProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showModernEmojiPicker, setShowModernEmojiPicker] = useState(false);
  const [showMembersList, setShowMembersList] = useState(false);
  const [messageFilter, setMessageFilter] = useState<'product-quality' | 'service' | 'reviews'>('product-quality');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  
  // Enhanced state for advanced features
  const [emojiPickerMode, setEmojiPickerMode] = useState<'quick' | 'full'>('quick');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<number | null>(null);
  const [userStatus, setUserStatus] = useState<'online' | 'away' | 'busy'>('online');
  
  // Performance metrics
  const [communityMetrics, setCommunityMetrics] = useState({
    totalMembers: 247,
    activeNow: 23,
    todayMessages: 156,
    satisfaction: 4.7,
    averageResponseTime: '3m 12s',
    helpfulAnswers: 89
  });

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);

  // Mock data initialization
  useEffect(() => {
    if (isOpen && product) {
      const mockMembers: CommunityMember[] = [
        {
          id: 1,
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          status: 'online',
          memberSince: '2024-01-15',
          purchaseStatus: 'both',
          totalPurchases: 3,
          isVerified: true,
          badges: ['top-reviewer', 'super-fan']
        },
        {
          id: 2,
          name: 'Maya Patel',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          status: 'online',
          memberSince: '2024-02-20',
          purchaseStatus: 'purchased',
          totalPurchases: 1,
          isVerified: false,
          badges: ['helpful']
        },
        {
          id: 3,
          name: 'Amara Okafor',
          avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
          status: 'away',
          memberSince: '2023-12-10',
          purchaseStatus: 'favorited',
          totalPurchases: 0,
          isVerified: true,
          badges: ['early-adopter']
        },
        {
          id: 4,
          name: 'Zara Williams',
          avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150',
          status: 'online',
          memberSince: '2024-03-01',
          purchaseStatus: 'both',
          totalPurchases: 5,
          isVerified: true,
          badges: ['top-reviewer', 'super-fan', 'helpful']
        }
      ];

      const mockMessages: CommunityMessage[] = [
        {
          id: 1,
          userId: 1,
          message: "Just received this dress and WOW! 😍 The fabric quality is amazing and the fit is perfect. The material feels premium and definitely worth every penny!",
          timestamp: '2024-12-19T10:30:00Z',
          reactions: { '😍': 8, '👏': 5, '🔥': 3 },
          userReactions: ['😍'],
          messageType: 'product-review',
          isHighlighted: true,
          helpfulCount: 12,
          status: 'read',
          sentiment: 'positive'
        },
        {
          id: 2,
          userId: 2,
          message: "Quick question about size - does this run true to size? I'm between M and L and the quality looks great but want to ensure the fit is right 🤔",
          timestamp: '2024-12-19T11:15:00Z',
          reactions: { '🤔': 3, '👍': 2 },
          userReactions: [],
          messageType: 'question',
          status: 'read',
          sentiment: 'neutral'
        },
        {
          id: 3,
          userId: 4,
          message: "@Maya I'd go with M! I'm similar size and M fits perfectly. The fabric has a nice stretch to it 💪",
          timestamp: '2024-12-19T11:18:00Z',
          reactions: { '💪': 4, '🙏': 6, '✨': 2 },
          userReactions: ['🙏'],
          messageType: 'tip',
          helpfulCount: 8,
          status: 'read',
          mentions: [2],
          sentiment: 'positive'
        },
        {
          id: 4,
          userId: 3,
          message: "Customer service was excellent! Fast shipping and they helped me pick the right size. Delivery was super quick too ✨",
          timestamp: '2024-12-19T12:45:00Z',
          reactions: { '✨': 7, '📦': 4, '🌟': 3 },
          userReactions: ['✨', '🌟'],
          messageType: 'tip',
          helpfulCount: 15,
          status: 'read',
          sentiment: 'positive'
        },
        {
          id: 5,
          userId: 1,
          message: "The material quality exceeded my expectations! The stitching is perfect and the fabric feels luxurious. Really impressed with the craftsmanship 👌",
          timestamp: '2024-12-19T13:20:00Z',
          reactions: { '👌': 5, '🔥': 3, '💯': 2 },
          userReactions: ['👌'],
          messageType: 'product-review',
          helpfulCount: 9,
          status: 'read',
          sentiment: 'positive'
        },
        {
          id: 6,
          userId: 2,
          message: "Had an issue with my order but their support team resolved it immediately! Really appreciate the quick help and friendly service 🙏",
          timestamp: '2024-12-19T14:10:00Z',
          reactions: { '🙏': 6, '❤️': 4, '⭐': 2 },
          userReactions: ['🙏'],
          messageType: 'tip',
          helpfulCount: 11,
          status: 'read',
          sentiment: 'positive'
        }
      ];

      setMembers(mockMembers);
      setMessages(mockMessages);
      setOnlineCount(mockMembers.filter(m => m.status === 'online').length);
      
      setCommunityMetrics(prev => ({
        ...prev,
        totalMembers: mockMembers.length,
        activeNow: mockMembers.filter(m => m.status === 'online').length
      }));
    }
  }, [isOpen, product]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !currentUser) return;

    const newMessage: CommunityMessage = {
      id: Date.now(),
      userId: currentUser.id || 999,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      reactions: {},
      userReactions: [],
      messageType: 'text',
      status: 'sending',
      sentiment: 'neutral'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setShowEmojiPicker(false);
    setShowModernEmojiPicker(false);
    setShowAttachmentMenu(false);

    setTimeout(() => inputRef.current?.focus(), 100);
  }, [message, currentUser]);

  const handleAddReaction = useCallback((messageId: number, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const newReactions = { ...msg.reactions };
        const newUserReactions = [...msg.userReactions];
        
        if (newUserReactions.includes(emoji)) {
          // Remove reaction
          newReactions[emoji] = (newReactions[emoji] || 1) - 1;
          if (newReactions[emoji] <= 0) delete newReactions[emoji];
          const index = newUserReactions.indexOf(emoji);
          newUserReactions.splice(index, 1);
        } else {
          // Add reaction
          newReactions[emoji] = (newReactions[emoji] || 0) + 1;
          newUserReactions.push(emoji);
        }
        
        return {
          ...msg,
          reactions: newReactions,
          userReactions: newUserReactions
        };
      }
      return msg;
    }));
    setActiveReactionMessageId(null);
  }, []);

  // 🎯 FIXED: Proper emoji picker handlers with correct prop names
  const handleEmojiSelect = useCallback((emoji: string) => {
    setMessage(prev => prev + emoji);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleEmojiPickerClose = useCallback(() => {
    setShowEmojiPicker(false);
    setShowModernEmojiPicker(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleEmojiButtonClick = useCallback(() => {
    if (emojiPickerMode === 'quick') {
      setShowEmojiPicker(!showEmojiPicker);
      setShowModernEmojiPicker(false);
    } else {
      setShowModernEmojiPicker(!showModernEmojiPicker);
      setShowEmojiPicker(false);
    }
  }, [emojiPickerMode, showEmojiPicker, showModernEmojiPicker]);

  const toggleEmojiPickerMode = useCallback(() => {
    setEmojiPickerMode(prev => prev === 'quick' ? 'full' : 'quick');
    setShowEmojiPicker(false);
    setShowModernEmojiPicker(false);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const filteredMessages = useMemo(() => {
    if (messageFilter === 'product-quality') {
      return messages.filter(msg => 
        msg.messageType === 'product-review' || 
        msg.messageType === 'question' ||
        msg.message.toLowerCase().includes('quality') ||
        msg.message.toLowerCase().includes('fabric') ||
        msg.message.toLowerCase().includes('material') ||
        msg.message.toLowerCase().includes('fit') ||
        msg.message.toLowerCase().includes('size')
      );
    }
    if (messageFilter === 'service') {
      return messages.filter(msg => 
        msg.messageType === 'tip' ||
        msg.message.toLowerCase().includes('shipping') ||
        msg.message.toLowerCase().includes('delivery') ||
        msg.message.toLowerCase().includes('support') ||
        msg.message.toLowerCase().includes('help') ||
        msg.message.toLowerCase().includes('service')
      );
    }
    if (messageFilter === 'reviews') {
      return messages.filter(msg => msg.messageType === 'product-review');
    }
    return messages;
  }, [messages, messageFilter]);

  const getMemberByUserId = useCallback((userId: number) => {
    return members.find(m => m.id === userId);
  }, [members]);

  if (!isOpen) return null;

  const containerClasses = isMobile 
    ? "fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md"
    : "fixed bottom-4 right-4 w-96 h-[600px] z-[9999] bg-white rounded-lg shadow-2xl border";

  return (
    <AnimatePresence>
      <motion.div
        className={containerClasses}
        initial={{ 
          opacity: 0, 
          ...(isMobile ? { y: '100%' } : { scale: 0.9, y: 20 })
        }}
        animate={{ 
          opacity: 1, 
          ...(isMobile ? { y: 0 } : { scale: 1, y: 0 })
        }}
        exit={{ 
          opacity: 0, 
          ...(isMobile ? { y: '100%' } : { scale: 0.9, y: 20 })
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="flex flex-col h-full text-white">
            {/* Enhanced Product Header */}
            <motion.div 
              className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-b-xl relative overflow-hidden flex-shrink-0"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{ position: 'relative', zIndex: 2 }}
            >
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-3">
                  <motion.img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                  <div>
                    <h3 className="font-heading font-bold text-lg leading-tight">{product.name}</h3>
                    <p className="text-white/80 text-sm font-body">${product.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 rounded-full p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Enhanced Community Stats */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">{communityMetrics.totalMembers} Members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.div 
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-sm">{communityMetrics.activeNow} Online</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                    <Star className="h-3 w-3 text-yellow-300" />
                    <span className="text-xs">{communityMetrics.satisfaction}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Chat Tabs - Following ChatRoom.tsx design consistency */}
            <motion.div 
              className="px-4 py-3 bg-black/40 mt-0 relative overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              style={{ 
                marginTop: 0, 
                position: 'relative', 
                zIndex: 1,
                backgroundImage: 'linear-gradient(135deg, rgba(88, 37, 239, 0.1) 0%, rgba(88, 37, 239, 0.05) 100%)'
              }}
            >
              {/* Background particles effect like ChatRoom.tsx */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`tab-particle-${i}`}
                    className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    animate={{
                      y: [0, -15, 0],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              <div className="flex gap-2 overflow-x-auto scrollbar-hide relative z-10">
                {([
                  { key: 'product-quality', label: '🏷️ Product Quality', icon: '🔍' },
                  { key: 'service', label: '🛎️ Service', icon: '💬' },
                  { key: 'reviews', label: '⭐ Reviews', icon: '⭐' }
                ] as const).map((tab, index) => (
                  <motion.div
                    key={tab.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  >
                    <Button
                      onClick={() => setMessageFilter(tab.key as any)}
                      variant={messageFilter === tab.key ? "default" : "ghost"}
                      size="sm"
                      className={`rounded-xl text-xs px-4 py-2 whitespace-nowrap font-body transition-all duration-300 ${
                        messageFilter === tab.key 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg border border-purple-400/30' 
                          : 'bg-white/10 text-white/80 hover:bg-white/20 hover:scale-105 border border-white/10'
                      }`}
                      style={{
                        backdropFilter: 'blur(10px)',
                        boxShadow: messageFilter === tab.key 
                          ? '0 4px 15px rgba(88, 37, 239, 0.3)' 
                          : '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transform: messageFilter === tab.key ? 'scale(1.05)' : 'scale(1)'
                      }}
                    >
                      <motion.span 
                        className="mr-2"
                        animate={messageFilter === tab.key ? {
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        {tab.icon}
                      </motion.span>
                      <span className="font-medium">{tab.label}</span>
                      {messageFilter === tab.key && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden relative" style={{ paddingBottom: '140px' }}>
              <div 
                className="h-full px-4 py-2 community-chat-scrollable"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <div className="space-y-4 relative z-10">
                  {filteredMessages.map((msg, index) => {
                    const member = getMemberByUserId(msg.userId);
                    const isCurrentUser = msg.userId === (currentUser?.id || 999);
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`${msg.isHighlighted ? 'bg-purple-500/20 rounded-xl p-3 border border-purple-400/30' : ''}`}
                        onMouseEnter={() => setHoveredMessageId(msg.id)}
                        onMouseLeave={() => setHoveredMessageId(null)}
                      >
                        <div className="flex gap-3">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative"
                          >
                            <Avatar className="w-8 h-8 border-2 border-white/20">
                              <img src={member?.avatar} alt={member?.name} className="w-full h-full object-cover" />
                            </Avatar>
                            {member?.status === 'online' && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
                            )}
                          </motion.div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-heading font-medium text-white text-sm">{member?.name}</span>
                              {member?.isVerified && (
                                <motion.div
                                  animate={{ rotate: [0, 360] }}
                                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                >
                                  <Shield className="h-3 w-3 text-blue-400" />
                                </motion.div>
                              )}
                              {member?.badges && member.badges.length > 0 && (
                                <div className="flex gap-1">
                                  {member.badges.slice(0, 2).map((badge) => (
                                    <Badge key={badge} className={`h-4 px-1 text-xs ${badge === 'top-reviewer' ? 'bg-yellow-500' : badge === 'super-fan' ? 'bg-red-500' : 'bg-green-500'}`}>
                                      {badge === 'top-reviewer' && <Star className="h-2 w-2" />}
                                      {badge === 'super-fan' && <Heart className="h-2 w-2" />}
                                      {badge === 'helpful' && <Gift className="h-2 w-2" />}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                              <p className="text-white/90 text-sm font-body leading-relaxed">{msg.message}</p>
                              {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {Object.entries(msg.reactions).map(([emoji, count]) => (
                                    <motion.button
                                      key={emoji}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleAddReaction(msg.id, emoji)}
                                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                        msg.userReactions?.includes(emoji) 
                                          ? 'bg-purple-500/30 border border-purple-400/50' 
                                          : 'bg-white/5 hover:bg-white/10'
                                      }`}
                                    >
                                      <span>{emoji}</span>
                                      <span className="text-white/70">{count}</span>
                                    </motion.button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* 🎯 INPUT WRAPPER CONTAINER WITH EMOJI PICKER POSITIONED ABOVE IT */}
            <div className="relative">
              {/* 🎯 CUSTOM MOBILE EMOJI PICKER - POSITIONED EXACTLY 0PX ABOVE INPUT WRAPPER CONTAINER */}
              <AnimatePresence>
                {(showEmojiPicker || showModernEmojiPicker) && (
                  <motion.div
                    initial={{ 
                      opacity: 0, 
                      scale: 0.95,
                      y: 20,  // Start 20px below to create "emerging from input wrapper" effect
                      transformOrigin: 'bottom center'
                    }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      y: 0,  // Move to final position (exactly 0px above input wrapper)
                      transformOrigin: 'bottom center'
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.95,
                      y: 10,  // Collapse back towards input wrapper
                      transformOrigin: 'bottom center'
                    }}
                    transition={{ 
                      type: "spring", 
                      damping: 25, 
                      stiffness: 300,
                      duration: 0.3
                    }}
                    className="absolute bottom-full left-0 right-0"
                    style={{ 
                      zIndex: 10000,  // 🎯 MAXIMUM Z-INDEX TO DISPLAY ABOVE ALL ELEMENTS
                      position: 'absolute',
                      marginBottom: '80px'  // 🎯 POSITIONED EXACTLY 80PX ABOVE INPUT WRAPPER
                    }}
                  >
                    {/* 🎯 CUSTOM MOBILE EMOJI PICKER CONTAINER */}
                    <div 
                      className="w-full bg-black/95 backdrop-blur-md border-t border-white/20"
                      style={{
                        height: '60vh',
                        maxHeight: '400px',
                        borderRadius: '24px 24px 0 0',
                        position: 'relative',
                        zIndex: 10000
                      }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b border-white/20">
                        <div className="flex items-center gap-3">
                          <motion.span 
                            className="text-2xl"
                            animate={{ 
                              rotate: [0, 15, -15, 10, -5, 0],
                              scale: [1, 1.1, 1.2, 1.1, 1, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          >
                            ✨
                          </motion.span>
                          <div>
                            <h3 className="font-heading font-bold text-lg text-white">Express Yourself</h3>
                            <p className="text-white/70 text-sm font-body">Choose the perfect emoji</p>
                          </div>
                        </div>
                        <Button
                          onClick={handleEmojiPickerClose}
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/10 rounded-full p-2"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Mode Toggle */}
                      <div className="flex p-4 gap-2">
                        <Button
                          onClick={() => setEmojiPickerMode('quick')}
                          variant="ghost"
                          size="sm"
                          className={`flex-1 rounded-full ${emojiPickerMode === 'quick' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/80'}`}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Quick
                        </Button>
                        <Button
                          onClick={() => setEmojiPickerMode('full')}
                          variant="ghost"
                          size="sm"
                          className={`flex-1 rounded-full ${emojiPickerMode === 'full' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/80'}`}
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Full
                        </Button>
                      </div>

                      {/* Emoji Content */}
                      <div className="flex-1 overflow-hidden px-4 pb-4">
                        {emojiPickerMode === 'quick' ? (
                          <div className="h-full">
                            {/* Quick Access Emojis */}
                            <h4 className="text-white font-medium mb-3">⚡ Quick Access</h4>
                            <div className="grid grid-cols-8 gap-2 mb-4">
                              {['😀', '😍', '🥰', '😘', '🤔', '👍', '❤️', '🔥', '✨', '🎉', '💯', '👏', '🙌', '💪', '👑', '🌟'].map((emoji) => (
                                <motion.button
                                  key={emoji}
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEmojiSelect(emoji)}
                                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-2xl flex items-center justify-center"
                                >
                                  {emoji}
                                </motion.button>
                              ))}
                            </div>

                            {/* Popular Categories */}
                            <h4 className="text-white font-medium mb-3">💎 Popular</h4>
                            <div className="grid grid-cols-8 gap-2">
                              {['😂', '🤣', '😊', '😉', '😎', '🤩', '🥳', '😋', '😜', '🤪', '🤗', '🤔', '😏', '😌', '😇', '🙃'].map((emoji) => (
                                <motion.button
                                  key={emoji}
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEmojiSelect(emoji)}
                                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-2xl flex items-center justify-center"
                                >
                                  {emoji}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full">
                            <h4 className="text-white font-medium mb-3">🌍 Full Emoji Library</h4>
                            <div className="grid grid-cols-8 gap-2 h-64 overflow-y-auto">
                              {[
                                '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗',
                                '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞',
                                '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
                                '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐',
                                '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
                                '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪', '🦵', '🦶', '👂'
                              ].map((emoji) => (
                                <motion.button
                                  key={emoji}
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEmojiSelect(emoji)}
                                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-xl flex items-center justify-center"
                                >
                                  {emoji}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 🎯 ACTUAL INPUT WRAPPER CONTAINER - POSITIONED WITH DARK BACKGROUND */}
              <div 
                className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-white/20"
                style={{ zIndex: 50 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={toggleEmojiPickerMode}
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-full"
                      title={`Switch to ${emojiPickerMode === 'quick' ? 'full' : 'quick'} emoji picker`}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleEmojiButtonClick}
                      variant="ghost"
                      size="sm"
                      className={`p-2 rounded-full ${showEmojiPicker || showModernEmojiPicker ? 'text-purple-400 bg-purple-500/20' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Input
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/60 rounded-full px-4 py-2"
                  />
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="btn-moema-primary rounded-full p-2 h-auto min-w-[44px]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Layout - Simplified for demonstration */
          <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold">{product.name}</h3>
                <Button onClick={onClose} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="h-full p-4">
                <p>Desktop chat layout would go here...</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button>Send</Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}