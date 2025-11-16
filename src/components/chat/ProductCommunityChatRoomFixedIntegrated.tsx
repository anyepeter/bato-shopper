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
  FileText,
  Plus,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  UserCheck,
  MapPin,
  Calendar,
  Edit3,
  Check,
  RotateCcw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Avatar } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { MessageBubble } from './MessageBubble';
import { MessageReactions } from './MessageReactions';
import { ModernEmojiPicker } from '../ModernEmojiPicker';
import { EmojiPicker } from '../EmojiPicker';
import { SAMPLE_REVIEWS } from '../../constants/reviews';
import { Review, Message } from '../../types';
import { SlidingRatingPrompt } from './SlidingRatingPrompt';
import { EnhancedReviewInput } from './EnhancedReviewInput';

// Global review state - shared across the application
let globalReviews: Review[] = [...SAMPLE_REVIEWS];
let globalReviewListeners: Array<(reviews: Review[]) => void> = [];

// Global review state management
const addReviewGlobally = (review: Review) => {
  globalReviews = [review, ...globalReviews];
  globalReviewListeners.forEach(listener => listener([...globalReviews]));
};

const subscribeToGlobalReviews = (listener: (reviews: Review[]) => void) => {
  globalReviewListeners.push(listener);
  return () => {
    globalReviewListeners = globalReviewListeners.filter(l => l !== listener);
  };
};

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
  text: string;
  sender: 'user' | 'bot' | 'other';
  timestamp: Date;
  reactions: Array<{ emoji: string; count: number; users: string[] }>;
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

interface ProductCommunityChatRoomFixedIntegratedProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  currentUser: any;
  isMobile?: boolean;
}

export function ProductCommunityChatRoomFixedIntegrated({
  isOpen,
  onClose,
  product,
  currentUser,
  isMobile = false
}: ProductCommunityChatRoomFixedIntegratedProps) {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showModernEmojiPicker, setShowModernEmojiPicker] = useState(false);
  
  // Enhanced state for advanced features
  const [emojiPickerMode, setEmojiPickerMode] = useState<'quick' | 'full'>('quick');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<number | null>(null);
  const [userStatus, setUserStatus] = useState<'online' | 'away' | 'busy'>('online');
  
  // Review-specific state - synchronized with global reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [reviewSortBy, setReviewSortBy] = useState<'newest' | 'oldest' | 'highest_rated' | 'lowest_rated' | 'most_helpful'>('newest');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
    wouldRecommend: true
  });

  // Reviews tab message input state
  const [reviewTabMessage, setReviewTabMessage] = useState('');
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviewMessages, setReviewMessages] = useState<CommunityMessage[]>([]);

  // ⭐ NEW: Review Rating Management State for Mobile
  const [userReviewRatings, setUserReviewRatings] = useState<{ [reviewId: number]: number }>({});
  const [editingReviewRating, setEditingReviewRating] = useState<number | null>(null);
  const [tempRatingValue, setTempRatingValue] = useState<number>(0);
  const [ratingSubmissions, setRatingSubmissions] = useState<{ [reviewId: number]: boolean }>({});
  const [showRatingConfirmation, setShowRatingConfirmation] = useState<{ [reviewId: number]: boolean }>({});

  // ⭐ NEW: Dynamic Rating Prompt State for Mobile Input
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [preSubmissionRating, setPreSubmissionRating] = useState(5);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [hasSelectedRating, setHasSelectedRating] = useState(false);

  // Product Quality chat state
  const [qualityMessages, setQualityMessages] = useState<CommunityMessage[]>([]);
  const [qualityMessage, setQualityMessage] = useState('');
  const qualityInputRef = useRef<HTMLInputElement>(null);

  // Services chat state
  const [servicesMessages, setServicesMessages] = useState<CommunityMessage[]>([]);
  const [servicesMessage, setServicesMessage] = useState('');
  const servicesInputRef = useRef<HTMLInputElement>(null);
  
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
  const reviewTabInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to global reviews and filter by product
  useEffect(() => {
    const updateReviews = (allReviews: Review[]) => {
      const productReviews = allReviews.filter(review => review.productId === product.id);
      setReviews(productReviews);
    };
    
    // Initial load
    updateReviews(globalReviews);
    
    // Subscribe to changes
    const unsubscribe = subscribeToGlobalReviews(updateReviews);
    
    return unsubscribe;
  }, [product.id]);

  // ⭐ NEW: Dynamic Rating Prompt Handlers
  const handleResetRatingPrompt = useCallback(() => {
    setShowRatingPrompt(false);
    setHasSelectedRating(false);
    setPreSubmissionRating(5);
  }, []);

  const handlePreSubmissionRatingSelect = useCallback((rating: number) => {
    setPreSubmissionRating(rating);
    setHasSelectedRating(true);
    setShowRatingPrompt(false);
    // Focus back on input after rating selection
    setTimeout(() => reviewTabInputRef.current?.focus(), 100);
  }, []);

  // CRITICAL: Handle review tab message sending - creates reviews that appear on Product Reviews page
  const handleSendReviewTabMessage = useCallback(() => {
    console.log('🔥 REVIEW TAB: handleSendReviewTabMessage called!', { reviewTabMessage, messageLength: reviewTabMessage.length, trimmed: reviewTabMessage.trim() });
    
    if (!reviewTabMessage.trim()) {
      console.log('❌ REVIEW TAB: Message is empty, returning early');
      return;
    }

    // Use current user or fallback to guest user
    const user = currentUser || {
      id: Math.floor(Math.random() * 1000) + 10000,
      firstName: 'Guest',
      lastName: 'User',
      email: 'guest@bato.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      location: 'Unknown Location'
    };

    // Create a new review from the chat message
    const newReview: Review = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      userId: user.id || 999,
      userName: `${user.firstName || 'Anonymous'} ${user.lastName || 'User'}`.trim(),
      userLocation: user.location || 'Unknown Location',
      userAvatar: user.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      rating: hasSelectedRating ? preSubmissionRating : 5, // Use pre-submission rating if selected
      title: `Review from Community Chat`,
      content: reviewTabMessage.trim(),
      images: [],
      videos: [],
      isVerifiedPurchase: true, // Assume community chat users are verified
      helpfulVotes: 0,
      totalVotes: 0,
      status: 'approved', // Auto-approve chat-based reviews
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productVariant: {
        size: 'N/A',
        color: 'N/A'
      }
    };

    // Add to global reviews so it appears on Product Reviews page
    addReviewGlobally(newReview);

    // Also add as a chat message for immediate display in reviews tab
    const chatMessage: CommunityMessage = {
      id: Date.now() + 1,
      userId: user.id || 999,
      text: reviewTabMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      reactions: [],
      userReactions: [],
      messageType: 'product-review',
      status: 'sent',
      sentiment: 'positive'
    };

    setReviewMessages(prev => [...prev, chatMessage]);
    setReviewTabMessage('');
    setShowEmojiPicker(false);
    setShowModernEmojiPicker(false);

    // Reset rating prompt state after successful submission
    handleResetRatingPrompt();

    setTimeout(() => reviewTabInputRef.current?.focus(), 100);
  }, [reviewTabMessage, currentUser, product, hasSelectedRating, preSubmissionRating, handleResetRatingPrompt]);

  const handleEmojiClick = useCallback((emoji: string) => {
    if (activeTab === 'reviews') {
      setReviewTabMessage(prev => prev + emoji);
      setTimeout(() => reviewTabInputRef.current?.focus(), 100);
    } else if (activeTab === 'quality') {
      setQualityMessage(prev => prev + emoji);
      setTimeout(() => qualityInputRef.current?.focus(), 100);
    } else if (activeTab === 'services') {
      setServicesMessage(prev => prev + emoji);
      setTimeout(() => servicesInputRef.current?.focus(), 100);
    }
    setShowEmojiPicker(false);
    setShowModernEmojiPicker(false);
  }, [activeTab]);

  const handleEmojiButtonClick = useCallback(() => {
    if (emojiPickerMode === 'quick') {
      setShowEmojiPicker(!showEmojiPicker);
      setShowModernEmojiPicker(false);
    } else {
      setShowModernEmojiPicker(!showModernEmojiPicker);
      setShowEmojiPicker(false);
    }
  }, [emojiPickerMode, showEmojiPicker, showModernEmojiPicker]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (activeTab === 'reviews') {
        handleSendReviewTabMessage();
      }
    }
  }, [handleSendReviewTabMessage, activeTab]);

  // Mock data initialization
  useEffect(() => {
    if (isOpen && product) {
      // Mock review chat messages
      const mockReviewMessages: CommunityMessage[] = [
        {
          id: 300,
          userId: 1,
          text: "Just ordered this dress! Can't wait to see the quality. Sarah's review convinced me! ⭐⭐⭐⭐⭐",
          sender: 'other',
          timestamp: new Date('2024-12-19T10:30:00Z'),
          reactions: [
            { emoji: '🎉', count: 5, users: ['user1', 'user2'] },
            { emoji: '❤️', count: 8, users: ['user3', 'user4'] }
          ],
          userReactions: [],
          messageType: 'product-review',
          status: 'read',
          sentiment: 'positive'
        },
        {
          id: 301,
          userId: 2,
          text: "The sizing runs a bit small, but the quality is amazing! Definitely recommend sizing up. Worth every penny! 💕",
          sender: 'other',
          timestamp: new Date('2024-12-19T11:45:00Z'),
          reactions: [
            { emoji: '👍', count: 15, users: ['user1', 'user2'] },
            { emoji: '💯', count: 6, users: ['user3'] }
          ],
          userReactions: [],
          messageType: 'product-review',
          status: 'read',
          sentiment: 'positive'
        }
      ];

      setReviewMessages(mockReviewMessages);
    }
  }, [isOpen, product, currentUser]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`
            fixed z-[60] bg-white shadow-2xl border border-gray-200 overflow-hidden
            ${isMobile
              ? 'inset-0 rounded-none'
              : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[700px] rounded-lg'
            }
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-medium text-gray-900 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 font-body">Community Chat</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-50 border-b border-gray-200 rounded-none">
              <TabsTrigger value="reviews" className="data-[state=active]:bg-white">
                ⭐ Reviews
              </TabsTrigger>
              <TabsTrigger value="quality" className="data-[state=active]:bg-white">
                🏷️ Quality
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-white">
                📦 Services
              </TabsTrigger>
            </TabsList>

            {/* Reviews Tab Content */}
            <TabsContent value="reviews" className="flex-1 flex flex-col m-0 p-0">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4 space-y-4">
                {reviewMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={{
                      id: message.id,
                      text: message.text,
                      sender: message.sender,
                      timestamp: message.timestamp,
                      reactions: message.reactions,
                      userReactions: message.userReactions
                    }}
                    currentUser={currentUser}
                    onReactionClick={(emoji) => {
                      // Handle reaction logic here
                    }}
                    showReactions={true}
                  />
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* ⭐ ENHANCED: Review Input with Sliding Rating Prompt */}
              <div className="relative border-t border-gray-200">
                {/* Sliding Rating Prompt - Positioned above input */}
                <SlidingRatingPrompt
                  isVisible={showRatingPrompt}
                  currentRating={preSubmissionRating}
                  onRatingSelect={handlePreSubmissionRatingSelect}
                  onClose={() => setShowRatingPrompt(false)}
                  productName={product.name}
                />

                {/* Enhanced Review Input */}
                <EnhancedReviewInput
                  value={reviewTabMessage}
                  onChange={setReviewTabMessage}
                  onSend={handleSendReviewTabMessage}
                  onEmojiClick={handleEmojiButtonClick}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts about this product..."
                  productName={product.name}
                  isMobile={isMobile}
                  inputRef={reviewTabInputRef}
                  hasSelectedRating={hasSelectedRating}
                  preSubmissionRating={preSubmissionRating}
                  onRatingSelect={handlePreSubmissionRatingSelect}
                  showEmojiPicker={showEmojiPicker}
                />
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-16 left-4 right-4 z-10"
                >
                  <EmojiPicker
                    onEmojiSelect={handleEmojiClick}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                </motion.div>
              )}
            </TabsContent>

            {/* Quality Tab Content */}
            <TabsContent value="quality" className="flex-1 flex flex-col m-0 p-0">
              <div className="flex-1 p-4">
                <div className="text-center py-8">
                  <p className="text-gray-500 font-body">Quality discussion coming soon...</p>
                </div>
              </div>
            </TabsContent>

            {/* Services Tab Content */}
            <TabsContent value="services" className="flex-1 flex flex-col m-0 p-0">
              <div className="flex-1 p-4">
                <div className="text-center py-8">
                  <p className="text-gray-500 font-body">Services discussion coming soon...</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  );
}