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

interface ProductCommunityChatRoomFixedEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  currentUser: any;
  isMobile?: boolean;
}

export function ProductCommunityChatRoomFixedEnhanced({
  isOpen,
  onClose,
  product,
  currentUser,
  isMobile = false
}: ProductCommunityChatRoomFixedEnhancedProps) {
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

  // ⭐ NEW: Review Rating Management State
  const [userReviewRatings, setUserReviewRatings] = useState<{ [reviewId: number]: number }>({});
  const [editingReviewRating, setEditingReviewRating] = useState<number | null>(null);
  const [tempRatingValue, setTempRatingValue] = useState<number>(0);
  const [ratingSubmissions, setRatingSubmissions] = useState<{ [reviewId: number]: boolean }>({});
  const [showRatingConfirmation, setShowRatingConfirmation] = useState<{ [reviewId: number]: boolean }>({});

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

  // Filter and sort reviews based on search and sort criteria
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    // Apply search filter
    if (reviewSearchQuery.trim()) {
      const query = reviewSearchQuery.toLowerCase();
      filtered = filtered.filter(review => 
        review.title.toLowerCase().includes(query) ||
        review.content.toLowerCase().includes(query) ||
        review.userName.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (reviewSortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest_rated':
          return b.rating - a.rating;
        case 'lowest_rated':
          return a.rating - b.rating;
        case 'most_helpful':
          return b.helpfulVotes - a.helpfulVotes;
        default:
          return 0;
      }
    });

    return sorted;
  }, [reviews, reviewSearchQuery, reviewSortBy]);

  // Calculate review summary
  const reviewSummary = useMemo(() => {
    if (reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / total;

    const distribution = reviews.reduce((acc, review) => {
      acc[review.rating as keyof typeof acc]++;
      return acc;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

    return { averageRating: average, totalReviews: total, distribution };
  }, [reviews]);

  // Mock data initialization
  useEffect(() => {
    if (isOpen && product) {
      // Create current user or guest user member
      const user = currentUser || {
        id: Math.floor(Math.random() * 1000) + 10000,
        firstName: 'Guest',
        lastName: 'User',
        email: 'guest@bato.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
      };

      const currentUserMember: CommunityMember = {
        id: user.id || 999,
        name: `${user.firstName || 'Guest'} ${user.lastName || 'User'}`.trim(),
        avatar: user.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        status: 'online',
        memberSince: new Date().toISOString(),
        purchaseStatus: 'favorited',
        totalPurchases: currentUser ? 1 : 0,
        isVerified: !!currentUser,
        badges: currentUser ? ['helpful'] : []
      };

      const mockMembers: CommunityMember[] = [
        currentUserMember,
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
        }
      ];

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

      setMembers(mockMembers);
      setReviewMessages(mockReviewMessages);
      
      setCommunityMetrics(prev => ({
        ...prev,
        totalMembers: mockMembers.length,
        activeNow: mockMembers.filter(m => m.status === 'online').length
      }));
    }
  }, [isOpen, product, currentUser]);

  useEffect(() => {
    if (isOpen && reviewTabInputRef.current && activeTab === 'reviews') {
      setTimeout(() => reviewTabInputRef.current?.focus(), 300);
    }
  }, [isOpen, activeTab]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [reviewMessages]);

  // CRITICAL: Handle review tab message sending - creates reviews that appear on Product Reviews page
  const handleSendReviewTabMessage = useCallback(() => {
    if (!reviewTabMessage.trim()) {
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
      rating: 5, // Default 5-star rating for chat messages
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

    setTimeout(() => reviewTabInputRef.current?.focus(), 100);
  }, [reviewTabMessage, currentUser, product]);

  const handleEmojiClick = useCallback((emoji: string) => {
    if (activeTab === 'reviews') {
      setReviewTabMessage(prev => prev + emoji);
      setTimeout(() => reviewTabInputRef.current?.focus(), 100);
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

  const toggleEmojiPickerMode = useCallback(() => {
    setEmojiPickerMode(prev => prev === 'quick' ? 'full' : 'quick');
    setShowEmojiPicker(false);
    setShowModernEmojiPicker(false);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (activeTab === 'reviews') {
        handleSendReviewTabMessage();
      }
    }
  }, [handleSendReviewTabMessage, activeTab]);

  const handleReviewSubmit = useCallback(() => {
    if (!newReview.title.trim() || !newReview.content.trim()) return;

    // Use current user or fallback to guest user
    const user = currentUser || {
      id: Math.floor(Math.random() * 1000) + 10000,
      firstName: 'Guest',
      lastName: 'User',
      email: 'guest@bato.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      location: 'Unknown Location'
    };

    const review: Review = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      userId: user.id || 999,
      userName: `${user.firstName || 'Anonymous'} ${user.lastName || 'User'}`.trim(),
      userLocation: user.location || 'Unknown Location',
      userAvatar: user.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      images: [],
      videos: [],
      isVerifiedPurchase: true,
      helpfulVotes: 0,
      totalVotes: 0,
      status: 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productVariant: {
        size: 'M',
        color: 'Blue'
      }
    };

    addReviewGlobally(review);
    setNewReview({ rating: 5, title: '', content: '', wouldRecommend: true });
    setShowReviewForm(false);
  }, [newReview, currentUser, product]);

  const handleReviewHelpful = useCallback((reviewId: number) => {
    const updatedReviews = globalReviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpfulVotes: review.helpfulVotes + 1, totalVotes: review.totalVotes + 1 }
        : review
    );
    globalReviews = updatedReviews;
    globalReviewListeners.forEach(listener => listener([...globalReviews]));
  }, []);

  const renderStars = useCallback((rating: number, interactive = false, onRatingChange?: (rating: number) => void, size = 'w-4 h-4') => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors duration-200' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  }, []);

  // ⭐ NEW: Review Rating Handlers
  const handleStartReviewRating = useCallback((reviewId: number) => {
    setEditingReviewRating(reviewId);
    setTempRatingValue(userReviewRatings[reviewId] || 5);
  }, [userReviewRatings]);

  const handleCancelReviewRating = useCallback(() => {
    setEditingReviewRating(null);
    setTempRatingValue(0);
  }, []);

  const handleConfirmReviewRating = useCallback((reviewId: number) => {
    if (tempRatingValue > 0) {
      setUserReviewRatings(prev => ({ ...prev, [reviewId]: tempRatingValue }));
      setRatingSubmissions(prev => ({ ...prev, [reviewId]: true }));
      setShowRatingConfirmation(prev => ({ ...prev, [reviewId]: true }));
      setEditingReviewRating(null);
      setTempRatingValue(0);

      // Create a new review from this rating
      const user = currentUser || {
        id: Math.floor(Math.random() * 1000) + 10000,
        firstName: 'Guest',
        lastName: 'User',
        email: 'guest@bato.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        location: 'Unknown Location'
      };

      const originalReview = globalReviews.find(r => r.id === reviewId);
      if (originalReview) {
        const userRatingReview: Review = {
          id: Date.now(),
          productId: product.id,
          productName: product.name,
          userId: user.id || 999,
          userName: `${user.firstName || 'Anonymous'} ${user.lastName || 'User'}`.trim(),
          userLocation: user.location || 'Unknown Location',
          userAvatar: user.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          rating: tempRatingValue,
          title: `Rating for "${originalReview.title}"`,
          content: `I rated this review ${tempRatingValue} out of 5 stars. ${originalReview.content.substring(0, 50)}...`,
          images: [],
          videos: [],
          isVerifiedPurchase: true,
          helpfulVotes: 0,
          totalVotes: 0,
          status: 'approved',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          productVariant: {
            size: 'N/A',
            color: 'N/A'
          }
        };

        // Add to global reviews
        addReviewGlobally(userRatingReview);
      }

      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setShowRatingConfirmation(prev => ({ ...prev, [reviewId]: false }));
      }, 3000);
    }
  }, [tempRatingValue, currentUser, product]);

  const handleEditReviewRating = useCallback((reviewId: number) => {
    setEditingReviewRating(reviewId);
    setTempRatingValue(userReviewRatings[reviewId] || 5);
  }, [userReviewRatings]);

  const handleTempRatingChange = useCallback((rating: number) => {
    setTempRatingValue(rating);
  }, []);

  // Message reaction handler
  const handleMessageReaction = useCallback((messageId: number, emoji: string) => {
    if (activeTab === 'reviews') {
      setReviewMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            existingReaction.count += 1;
            existingReaction.users.push(currentUser?.firstName || 'Anonymous');
          } else {
            msg.reactions.push({ emoji, count: 1, users: [currentUser?.firstName || 'Anonymous'] });
          }
        }
        return msg;
      }));
    }
    setActiveReactionMessageId(null);
  }, [activeTab, currentUser]);

  const handleReactionButtonClick = useCallback((messageId: number) => {
    setActiveReactionMessageId(activeReactionMessageId === messageId ? null : messageId);
  }, [activeReactionMessageId]);

  // ⭐ NEW: Enhanced Reviews Tab Content Renderer with Rating Functionality
  const renderReviewsTabContent = useCallback(() => {
    if (activeTab !== 'reviews') return null;

    return (
      <div className="flex-1 overflow-hidden relative" style={{ paddingBottom: '120px' }}>
        <div className="h-full px-4 py-2 overflow-y-auto community-chat-scrollable">
          <div className="space-y-4">
            {/* Chat Messages */}
            <AnimatePresence>
              {reviewMessages.map((msg) => {
                const isCurrentUser = (currentUser?.id || 999) === msg.userId;
                
                const messageForBubble = {
                  id: msg.id,
                  text: msg.text,
                  sender: isCurrentUser ? 'user' as const : 'bot' as const,
                  timestamp: msg.timestamp,
                  status: msg.status || 'delivered' as const,
                  reactions: msg.reactions ? msg.reactions.map(r => ({
                    emoji: r.emoji,
                    count: r.count,
                    users: r.users,
                    hasReacted: r.users.includes(currentUser?.firstName || 'Anonymous')
                  })) : []
                };
                
                return (
                  <MessageBubble
                    key={msg.id}
                    message={messageForBubble}
                    isHovered={hoveredMessageId === msg.id}
                    activeReactionMessageId={activeReactionMessageId}
                    onReactionClick={(emoji) => handleMessageReaction(msg.id, emoji)}
                    onReactionButtonClick={() => handleReactionButtonClick(msg.id)}
                    onMouseEnter={() => setHoveredMessageId(msg.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                  />
                );
              })}
            </AnimatePresence>

            {/* ⭐ NEW: Product Reviews with Rating Functionality */}
            {filteredAndSortedReviews.length > 0 && (
              <div className="space-y-4 mt-6">
                <div className="text-center">
                  <h3 className="text-white/80 text-sm mb-1 font-heading">Product Reviews</h3>
                  <p className="text-white/50 text-xs">Rate and interact with customer reviews</p>
                </div>

                <AnimatePresence>
                  {filteredAndSortedReviews.slice(0, 5).map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 space-y-3"
                    >
                      {/* Review Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img 
                            src={review.userAvatar} 
                            alt={review.userName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-white text-sm font-heading">{review.userName}</p>
                            <p className="text-white/40 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating, false, undefined, 'w-3 h-3')}
                        </div>
                      </div>

                      {/* Review Content */}
                      <div>
                        <h4 className="text-white text-sm mb-1 font-heading">{review.title}</h4>
                        <p className="text-white/70 text-sm leading-relaxed font-body line-clamp-2">{review.content}</p>
                      </div>

                      {/* ⭐ NEW: User Rating Interface */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="text-white/60 text-xs font-body">Rate this review:</span>
                          
                          {editingReviewRating === review.id ? (
                            // Rating Edit Mode
                            <div className="flex items-center gap-2">
                              {renderStars(tempRatingValue, true, handleTempRatingChange, 'w-4 h-4')}
                              <div className="flex items-center gap-1 ml-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleConfirmReviewRating(review.id)}
                                  disabled={tempRatingValue === 0}
                                  className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-md"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleCancelReviewRating}
                                  className="h-6 px-2 text-xs text-white/60 hover:text-white hover:bg-white/10 border-0 rounded-md"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ) : userReviewRatings[review.id] ? (
                            // Show Existing Rating
                            <div className="flex items-center gap-2">
                              {renderStars(userReviewRatings[review.id], false, undefined, 'w-4 h-4')}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditReviewRating(review.id)}
                                className="h-6 px-2 text-xs text-white/60 hover:text-white hover:bg-white/10 border-0 rounded-md"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            // Initial Rate Button
                            <Button
                              size="sm"
                              onClick={() => handleStartReviewRating(review.id)}
                              className="h-6 px-3 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-md font-body"
                            >
                              <Star className="w-3 h-3 mr-1" />
                              Rate
                            </Button>
                          )}
                        </div>

                        {/* Rating Confirmation */}
                        <AnimatePresence>
                          {showRatingConfirmation[review.id] && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1 text-green-400 text-xs"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Rated!
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Review Actions */}
                      <div className="flex items-center gap-3 pt-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReviewHelpful(review.id)}
                          className="text-white/60 hover:text-white hover:bg-white/10 text-xs h-6 px-2 border-0 rounded-md"
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Helpful ({review.helpfulVotes})
                        </Button>
                        <div className="flex items-center gap-1 text-white/40 text-xs">
                          {review.isVerifiedPurchase && (
                            <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30 text-xs px-1 py-0 h-4">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Empty State */}
            {reviewMessages.length === 0 && filteredAndSortedReviews.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/60 font-body">Start the conversation! Share your thoughts about this product.</p>
                <p className="text-white/40 text-xs mt-2">Message count: {reviewMessages.length}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    );
  }, [
    activeTab, 
    reviewMessages, 
    filteredAndSortedReviews, 
    currentUser, 
    hoveredMessageId, 
    activeReactionMessageId,
    userReviewRatings,
    editingReviewRating,
    tempRatingValue,
    showRatingConfirmation,
    handleMessageReaction,
    handleReactionButtonClick,
    handleStartReviewRating,
    handleEditReviewRating,
    handleConfirmReviewRating,
    handleCancelReviewRating,
    handleTempRatingChange,
    handleReviewHelpful,
    renderStars
  ]);

  if (!isOpen) return null;

  // Mobile Layout
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
        >
          <div className="h-full flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-3">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <div>
                  <h2 className="text-white text-sm font-heading">{product.name}</h2>
                  <p className="text-white/60 text-xs font-body">{members.length} members</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-black/20 border-b border-white/10 rounded-none h-12">
                <TabsTrigger 
                  value="reviews" 
                  className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 text-white/60 text-sm"
                >
                  ⭐ Reviews
                </TabsTrigger>
                <TabsTrigger 
                  value="quality" 
                  className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 text-white/60 text-sm"
                >
                  📦 Quality
                </TabsTrigger>
                <TabsTrigger 
                  value="services" 
                  className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 text-white/60 text-sm"
                >
                  🚚 Services
                </TabsTrigger>
              </TabsList>

              {/* ⭐ Enhanced Reviews Tab Content */}
              <TabsContent value="reviews" className="flex-1 flex flex-col h-[calc(100vh-240px)] mt-4">
                {renderReviewsTabContent()}
              </TabsContent>

              <TabsContent value="quality" className="flex-1 flex flex-col h-[calc(100vh-240px)] mt-4">
                <div className="text-center py-8">
                  <p className="text-white/60 font-body">Quality discussions will appear here.</p>
                </div>
              </TabsContent>

              <TabsContent value="services" className="flex-1 flex flex-col h-[calc(100vh-240px)] mt-4">
                <div className="text-center py-8">
                  <p className="text-white/60 font-body">Service discussions will appear here.</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Mobile Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={reviewTabInputRef}
                    value={reviewTabMessage}
                    onChange={(e) => setReviewTabMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share your review or ask a question..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full pr-20 font-body"
                  />
                  
                  {/* Emoji Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleEmojiButtonClick}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-white/60 hover:text-white hover:bg-white/10 p-1 h-8 w-8 rounded-full"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                  
                  {/* Send Button */}
                  <Button
                    onClick={handleSendReviewTabMessage}
                    disabled={!reviewTabMessage.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-1 h-8 w-8 rounded-full border-0 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Emoji Pickers */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-20 left-4 right-4 z-10"
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </motion.div>
                )}
                
                {showModernEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-20 left-4 right-4 z-10"
                  >
                    <ModernEmojiPicker onEmojiClick={handleEmojiClick} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Desktop Layout (placeholder)
  return (
    <div className="text-white p-8">
      <h2>Desktop layout not implemented in this enhanced version</h2>
      <p>This component focuses on mobile rating functionality.</p>
      <Button onClick={onClose} className="mt-4">
        Close
      </Button>
    </div>
  );
}