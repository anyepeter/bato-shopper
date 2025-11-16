import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  Star, 
  Users, 
  Eye,
  ShoppingBag,
  X,
  Send,
  Smile,
  Gift,
  Zap,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Maximize,
  MoreVertical
} from 'lucide-react';
import { BootstrapIcon } from '../BootstrapIcon';
import { useApp } from '../AppProvider';
import { SAMPLE_PRODUCTS } from '../../constants/products';
import { LIVE_STREAMS } from '../../constants/streamingData';
import { EnhancedLiveChatInput } from '../streaming/EnhancedLiveChatInput';
import { EnhancedChatMessage, LiveChatMessage } from '../streaming/EnhancedChatMessage';
import { ProductQuestionInterface } from '../streaming/ProductQuestionInterface';
import { ProductQuestionMessage } from '../streaming/ProductQuestionMessage';

interface WatchLiveStreamPageProps {
  streamId?: string;
  onNavigateBack?: () => void;
}

// Using the enhanced LiveChatMessage interface from EnhancedChatMessage component

export function WatchLiveStreamPage({ streamId, onNavigateBack }: WatchLiveStreamPageProps) {
  const { state, actions, cart, favorites } = useApp();
  const [currentStream] = useState(LIVE_STREAMS[0]); // Use first stream for demo
  const [featuredProducts] = useState(SAMPLE_PRODUCTS.slice(0, 6));
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerCount, setViewerCount] = useState(1247);
  const [likeCount, setLikeCount] = useState(892);
  const [isLiked, setIsLiked] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isProductQuestionOpen, setIsProductQuestionOpen] = useState(false);

  const videoRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const productCarouselRef = useRef<HTMLDivElement>(null);

  // Enhanced chat messages with reactions and attachments
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([
    { 
      id: 1, 
      user: 'FashionFan23', 
      message: 'This dress is gorgeous! 😍', 
      timestamp: new Date(Date.now() - 300000), 
      isVip: true,
      reactions: { '❤️': 5, '😍': 3 },
      userReactions: ['❤️']
    },
    { 
      id: 2, 
      user: 'StyleGuru', 
      message: 'Where can I buy this?', 
      timestamp: new Date(Date.now() - 240000),
      reactions: { '👍': 2 }
    },
    { 
      id: 3, 
      user: 'TrendSetter', 
      message: 'Love the colors!', 
      timestamp: new Date(Date.now() - 180000),
      reactions: { '🔥': 4, '❤️': 2 }
    },
    { 
      id: 4, 
      user: 'AfricanPrincess', 
      message: 'Beautiful African prints! 🔥', 
      timestamp: new Date(Date.now() - 120000), 
      isVip: true,
      reactions: { '🔥': 8, '👑': 3, '❤️': 6 }
    },
    { 
      id: 5, 
      user: 'StreamHost', 
      message: 'Thanks everyone for joining! Use code LIVE20 for 20% off', 
      timestamp: new Date(Date.now() - 60000), 
      isStreamer: true,
      reactions: { '🎉': 12, '❤️': 15, '🛍️': 8 }
    },
    { 
      id: 6, 
      user: 'SizeQueen', 
      message: 'What sizes are available for the blue dress?', 
      timestamp: new Date(Date.now() - 30000),
      productId: featuredProducts[1]?.id || '',
      productName: featuredProducts[1]?.name || '',
      productImage: featuredProducts[1]?.image || '',
      questionType: 'sizing',
      reactions: { '👍': 3 }
    },
    { 
      id: 7, 
      user: 'MaterialGirl', 
      message: 'Is this fabric stretchy and comfortable?', 
      timestamp: new Date(Date.now() - 15000),
      productId: featuredProducts[0]?.id || '',
      productName: featuredProducts[0]?.name || '',
      productImage: featuredProducts[0]?.image || '',
      questionType: 'materials',
      reactions: { '❤️': 2, '🤔': 1 }
    }
  ]);

  // Auto-increment viewer count
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll products
  useEffect(() => {
    if (!state.isMobile) return;
    
    const interval = setInterval(() => {
      setCurrentProductIndex(prev => (prev + 1) % featuredProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredProducts.length, state.isMobile]);

  // Tablet detection
  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1200);
    };
    
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  // Handle product swipe
  const handleProductSwipe = useCallback((direction: 'left' | 'right') => {
    if (direction === 'right' && currentProductIndex > 0) {
      setCurrentProductIndex(prev => prev - 1);
    } else if (direction === 'left' && currentProductIndex < featuredProducts.length - 1) {
      setCurrentProductIndex(prev => prev + 1);
    }
  }, [currentProductIndex, featuredProducts.length]);

  const handleProductPanEnd = useCallback((event: any, info: PanInfo) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        handleProductSwipe('right');
      } else {
        handleProductSwipe('left');
      }
    }
  }, [handleProductSwipe]);

  // Handle chat message send
  const handleSendMessage = useCallback(() => {
    if (!chatMessage.trim()) return;

    const newMessage: LiveChatMessage = {
      id: Date.now(),
      user: 'You',
      message: chatMessage,
      timestamp: new Date(),
      reactions: {},
      userReactions: []
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');

    // Auto-scroll to bottom
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  }, [chatMessage]);

  // Handle message reactions
  const handleReactionAdd = useCallback((messageId: number, emoji: string) => {
    setChatMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions } || {};
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        const userReactions = [...(msg.userReactions || [])];
        if (!userReactions.includes(emoji)) {
          userReactions.push(emoji);
        }
        return { ...msg, reactions, userReactions };
      }
      return msg;
    }));
  }, []);

  const handleReactionRemove = useCallback((messageId: number, emoji: string) => {
    setChatMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions } || {};
        if (reactions[emoji] > 1) {
          reactions[emoji] -= 1;
        } else {
          delete reactions[emoji];
        }
        const userReactions = (msg.userReactions || []).filter(r => r !== emoji);
        return { ...msg, reactions, userReactions };
      }
      return msg;
    }));
  }, []);

  const handleFileAttach = useCallback((file: File) => {
    console.log('File attached:', file.name);
    // Handle file upload logic here
  }, []);

  // Handle product question submission
  const handleSendProductQuestion = useCallback((productId: string, question: string, questionType: string) => {
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;

    const newMessage: LiveChatMessage = {
      id: Date.now(),
      user: 'You',
      message: question,
      timestamp: new Date(),
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      questionType,
      reactions: {},
      userReactions: []
    };

    setChatMessages(prev => [...prev, newMessage]);

    // Auto-scroll to new message
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  }, [featuredProducts]);

  // Get currently featured products for the question interface
  const getFeaturedProductsForQuestions = useCallback(() => {
    return featuredProducts.slice(0, 4).map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category || 'Fashion'
    }));
  }, [featuredProducts]);

  // Handle like button
  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  }, [isLiked]);

  const currentProduct = featuredProducts[currentProductIndex];

  const renderDesktopLayout = () => (
    <div className="flex h-screen" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)' }}>
      {/* Main Video Area - 70% */}
      <div className="flex-1 relative">
        <div 
          ref={videoRef}
          className="w-full h-full relative overflow-hidden"
          style={{ borderRadius: '3px' }}
        >
          {/* Video Background */}
          <motion.div 
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <img
              src={currentStream.thumbnailImage}
              alt={currentStream.title}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.8) contrast(1.1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          </motion.div>

          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 z-20 p-6">
            <div className="flex items-center justify-between">
              <motion.button
                onClick={onNavigateBack}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white backdrop-blur-md"
                style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={20} />
                <span className="font-body">Back</span>
              </motion.button>

              <div className="flex items-center gap-4">
                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-white backdrop-blur-md"
                  style={{ background: 'rgba(239, 68, 68, 0.8)' }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="font-body text-sm font-medium">LIVE</span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-white backdrop-blur-md"
                  style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                >
                  <Eye size={16} />
                  <span className="font-body text-sm">{viewerCount.toLocaleString()}</span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-6 right-6 z-20 flex gap-2">
            <motion.button
              onClick={() => setIsMuted(!isMuted)}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white backdrop-blur-md"
              style={{ background: 'rgba(0, 0, 0, 0.5)' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </motion.button>

            <motion.button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white backdrop-blur-md"
              style={{ background: 'rgba(0, 0, 0, 0.5)' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Maximize size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - 30% */}
      <div className="w-[30%] flex flex-col" style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #000000 100%)' }}>
        {/* Featured Product Section */}
        <div className="p-6 border-b border-white/10">
          <h3 className="font-heading text-lg font-bold text-white mb-4">Featured Products</h3>
          <div className="space-y-4">
            {featuredProducts.slice(0, 3).map((product, index) => (
              <motion.div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer group"
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                whileHover={{ background: 'rgba(255, 255, 255, 0.1)' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-body text-white text-sm font-medium line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-[#2b2bf7] font-bold text-lg">${product.price}</p>
                </div>
                <motion.button
                  onClick={() => cart.handleAddToCart(product, product.sizes?.[0] || '', product.colors?.[0] || '')}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #2b2bf7, #4040f8)' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ShoppingBag size={14} color="white" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interaction Buttons */}
        <div className="p-6 border-b border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              onClick={handleLike}
              className="flex items-center justify-center gap-2 p-3 rounded-lg font-body font-medium"
              style={{ 
                background: isLiked 
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Heart size={16} fill={isLiked ? 'white' : 'none'} />
              <span className="text-sm">{likeCount}</span>
            </motion.button>

            <motion.button
              className="flex items-center justify-center gap-2 p-3 rounded-lg font-body font-medium text-white"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 size={16} />
              <span className="text-sm">Share</span>
            </motion.button>
          </div>
        </div>

        {/* Live Chat */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-heading text-lg font-bold text-white">Live Chat</h3>
          </div>

          {/* Enhanced Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ maxHeight: '400px' }}
          >
            {chatMessages.map((msg) => (
              <EnhancedChatMessage
                key={msg.id}
                message={msg}
                onReactionAdd={handleReactionAdd}
                onReactionRemove={handleReactionRemove}
                onReply={(messageId) => console.log('Reply to message:', messageId)}
                onReport={(messageId) => console.log('Report message:', messageId)}
              />
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Say something..."
                className="flex-1 px-3 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:border-[#2b2bf7] focus:outline-none font-body"
                style={{ borderRadius: '3px', fontSize: '14px' }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <motion.button
                onClick={handleSendMessage}
                className="px-4 py-3 rounded-lg font-body font-medium flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(135deg, #2b2bf7, #4040f8)',
                  borderRadius: '3px',
                  minWidth: '48px'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!chatMessage.trim()}
              >
                <Send size={16} color="white" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileLayout = () => (
    <div className="h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)' }}>
      {/* Video Background */}
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <img
          src={currentStream.thumbnailImage}
          alt={currentStream.title}
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.7) contrast(1.1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </motion.div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-12 pb-4 px-4">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={onNavigateBack}
            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
            style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={20} color="white" />
          </motion.button>

          <div className="flex items-center gap-3">
            <motion.div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md"
              style={{ background: 'rgba(239, 68, 68, 0.8)' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-white font-body text-xs font-medium">LIVE</span>
            </motion.div>

            <motion.div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md"
              style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            >
              <Eye size={14} color="white" />
              <span className="text-white font-body text-xs">{viewerCount.toLocaleString()}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
        <motion.button
          onClick={handleLike}
          className="w-14 h-14 rounded-full flex flex-col items-center justify-center backdrop-blur-md"
          style={{ 
            background: isLiked 
              ? 'rgba(239, 68, 68, 0.8)' 
              : 'rgba(255, 255, 255, 0.2)'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart size={20} color="white" fill={isLiked ? 'white' : 'none'} />
          <span className="text-white text-xs font-body mt-1">{Math.floor(likeCount / 100)}K</span>
        </motion.button>

        <motion.button
          className="w-14 h-14 rounded-full flex flex-col items-center justify-center backdrop-blur-md"
          style={{ background: 'rgba(255, 255, 255, 0.2)' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Share2 size={20} color="white" />
          <span className="text-white text-xs font-body mt-1">Share</span>
        </motion.button>

        <motion.button
          onClick={() => setIsLiveChatOpen(!isLiveChatOpen)}
          className="w-14 h-14 rounded-full flex flex-col items-center justify-center backdrop-blur-md"
          style={{ 
            background: isLiveChatOpen 
              ? 'rgba(43, 43, 247, 0.8)' 
              : 'rgba(255, 255, 255, 0.2)'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageCircle size={20} color="white" />
          <span className="text-white text-xs font-body mt-1">Chat</span>
        </motion.button>

        <motion.button
          onClick={() => cart.handleAddToCart(currentProduct, currentProduct.sizes?.[0] || '', currentProduct.colors?.[0] || '')}
          className="w-14 h-14 rounded-full flex flex-col items-center justify-center backdrop-blur-md"
          style={{ background: 'linear-gradient(135deg, #2b2bf7, #4040f8)' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ShoppingBag size={20} color="white" />
          <span className="text-white text-xs font-body mt-1">Buy</span>
        </motion.button>
      </div>

      {/* Featured Products Carousel */}
      <div className="absolute bottom-32 left-0 right-0 z-20 px-4">
        <motion.div
          ref={productCarouselRef}
          drag="x"
          dragConstraints={{ left: -300, right: 0 }}
          onPanEnd={handleProductPanEnd}
          className="flex gap-4 cursor-grab active:cursor-grabbing"
          style={{ x: -currentProductIndex * 160 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="min-w-[140px] backdrop-blur-md rounded-lg p-3"
              style={{ 
                background: index === currentProductIndex 
                  ? 'rgba(43, 43, 247, 0.3)' 
                  : 'rgba(255, 255, 255, 0.1)',
                border: index === currentProductIndex 
                  ? '2px solid #2b2bf7' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-white font-body text-xs font-medium line-clamp-2 mb-1">
                {product.name}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-[#2b2bf7] font-bold text-sm">${product.price}</span>
                <div className="flex items-center gap-1">
                  <Star size={10} fill="#fbbf24" color="#fbbf24" />
                  <span className="text-white text-xs">{product.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Product Navigation Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {featuredProducts.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentProductIndex(index)}
              className="w-2 h-2 rounded-full"
              style={{
                background: index === currentProductIndex ? '#2b2bf7' : 'rgba(255, 255, 255, 0.4)'
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      {/* Stream Info */}
      <motion.div 
        className="absolute bottom-4 left-4 right-20 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="backdrop-blur-md rounded-lg p-4" style={{ background: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>
          <h2 className="font-heading text-lg font-bold text-white mb-1">
            {currentStream.title}
          </h2>
          <div className="flex items-center gap-3 text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">
                  {currentStream.streamerName.charAt(0)}
                </span>
              </div>
              <span className="font-body text-sm">{currentStream.streamerName}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Live Chat Overlay */}
      <AnimatePresence>
        {isLiveChatOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 right-0 z-40 rounded-t-2xl overflow-hidden flex flex-col"
            style={{ 
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px 16px 0 0',
              top: '25vh',
              bottom: '0px',
              height: '75vh',
              maxHeight: '75vh',
              marginBottom: '0px'
            }}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
              <h3 className="font-heading text-lg font-bold text-white">Live Chat</h3>
              <motion.button
                onClick={() => setIsLiveChatOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} color="white" />
              </motion.button>
            </div>

            {/* Enhanced Chat Messages - Mobile */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
            >
              {chatMessages.map((msg) => {
                // Render product questions with special styling
                if (msg.productId && msg.questionType) {
                  return (
                    <ProductQuestionMessage
                      key={msg.id}
                      message={{
                        id: msg.id.toString(),
                        user: msg.user,
                        text: msg.message,
                        timestamp: msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        productId: msg.productId,
                        productName: msg.productName,
                        productImage: msg.productImage,
                        questionType: msg.questionType
                      }}
                    />
                  );
                }
                
                // Render regular chat messages
                return (
                  <EnhancedChatMessage
                    key={msg.id}
                    message={msg}
                    onReactionAdd={handleReactionAdd}
                    onReactionRemove={handleReactionRemove}
                    onReply={(messageId) => console.log('Reply to message:', messageId)}
                    onReport={(messageId) => console.log('Report message:', messageId)}
                  />
                );
              })}
            </div>

            {/* Enhanced Chat Input - Mobile */}
            <div 
              className="p-4 border-t border-white/10 flex-shrink-0 bg-black/20 backdrop-blur-md" 
              style={{ 
                paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                minHeight: '80px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '0px',
                bottom: '0px'
              }}
            >
              <EnhancedLiveChatInput
                value={chatMessage}
                onChange={setChatMessage}
                onSend={handleSendMessage}
                onFileAttach={handleFileAttach}
                onProductQuestionClick={() => setIsProductQuestionOpen(true)}
                hasActiveProducts={featuredProducts.length > 0}
                placeholder="Type your message..."
                className="w-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderTabletLayout = () => (
    <div className="h-screen flex" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)' }}>
      {/* Main Video Area - 65% */}
      <div className="w-[65%] relative">
        <div 
          ref={videoRef}
          className="w-full h-full relative overflow-hidden"
          style={{ borderRadius: '3px' }}
        >
          {/* Video Background */}
          <motion.div 
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <img
              src={currentStream.thumbnailImage}
              alt={currentStream.title}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.8) contrast(1.1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          </motion.div>

          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 z-20 p-4">
            <div className="flex items-center justify-between">
              <motion.button
                onClick={onNavigateBack}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-white backdrop-blur-md"
                style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={18} />
                <span className="font-body text-sm">Back</span>
              </motion.button>

              <div className="flex items-center gap-3">
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white backdrop-blur-md"
                  style={{ background: 'rgba(239, 68, 68, 0.8)' }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span className="font-body text-sm font-medium">LIVE</span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white backdrop-blur-md"
                  style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                >
                  <Eye size={14} />
                  <span className="font-body text-sm">{viewerCount.toLocaleString()}</span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Featured Products Carousel - Bottom */}
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <div className="backdrop-blur-md rounded-lg p-4 mb-4" style={{ background: 'rgba(0, 0, 0, 0.6)', borderRadius: '3px' }}>
              <h3 className="font-heading text-white font-bold mb-3">Featured Products</h3>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="min-w-[120px] group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCurrentProductIndex(index)}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-white font-body text-xs font-medium line-clamp-2 mb-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[#2b2bf7] font-bold text-sm">${product.price}</span>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          cart.handleAddToCart(product, product.sizes?.[0] || '', product.colors?.[0] || '');
                        }}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #2b2bf7, #4040f8)' }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ShoppingBag size={12} color="white" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - 35% */}
      <div className="w-[35%] flex flex-col" style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #000000 100%)' }}>
        {/* Stream Info */}
        <div className="p-4 border-b border-white/10">
          <h2 className="font-heading text-xl font-bold text-white mb-2">
            {currentStream.title}
          </h2>
          <div className="flex items-center gap-3 text-white/80 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">
                  {currentStream.streamerName.charAt(0)}
                </span>
              </div>
              <span className="font-body">{currentStream.streamerName}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              onClick={handleLike}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-body font-medium"
              style={{ 
                background: isLiked 
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                borderRadius: '3px'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Heart size={16} fill={isLiked ? 'white' : 'none'} />
              <span className="text-sm">{likeCount}</span>
            </motion.button>

            <motion.button
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-body font-medium text-white"
              style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 size={16} />
              <span className="text-sm">Share</span>
            </motion.button>
          </div>
        </div>

        {/* Live Chat */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-heading text-lg font-bold text-white">Live Chat</h3>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ maxHeight: '300px' }}
          >
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  msg.isStreamer ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  msg.isVip ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                  'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`}>
                  {msg.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${
                      msg.isStreamer ? 'text-yellow-400' :
                      msg.isVip ? 'text-purple-400' :
                      'text-cyan-400'
                    }`}>
                      {msg.user}
                    </span>
                    {msg.isStreamer && (
                      <span className="text-xs px-1 py-0.5 bg-yellow-500 text-black rounded text-[10px] font-bold">
                        HOST
                      </span>
                    )}
                    {msg.isVip && (
                      <span className="text-xs px-1 py-0.5 bg-purple-500 text-white rounded text-[10px] font-bold">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-white/90 text-sm font-body mt-1">
                    {msg.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Say something..."
                className="flex-1 px-3 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:border-[#2b2bf7] focus:outline-none font-body"
                style={{ borderRadius: '3px', fontSize: '14px' }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <motion.button
                onClick={handleSendMessage}
                className="px-4 py-3 rounded-lg font-body font-medium flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(135deg, #2b2bf7, #4040f8)',
                  borderRadius: '3px',
                  minWidth: '48px'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!chatMessage.trim()}
              >
                <Send size={16} color="white" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render based on screen size
  return (
    <>
      {state.isMobile ? renderMobileLayout() : 
       isTablet ? renderTabletLayout() : 
       renderDesktopLayout()}
      
      {/* Product Question Interface */}
      <ProductQuestionInterface
        isOpen={isProductQuestionOpen}
        onClose={() => setIsProductQuestionOpen(false)}
        featuredProducts={getFeaturedProductsForQuestions()}
        onSendProductQuestion={handleSendProductQuestion}
      />
    </>
  );
}