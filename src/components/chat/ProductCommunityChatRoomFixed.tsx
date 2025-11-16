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
  text: string; // Changed from 'message' to 'text' to match Message interface
  sender: 'user' | 'bot' | 'other'; // Added sender field for MessageBubble compatibility
  timestamp: Date; // Changed to Date object to match Message interface
  reactions: Array<{ emoji: string; count: number; users: string[] }>; // Updated to match MessageBubble format
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

interface ProductCommunityChatRoomFixedProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  currentUser: any;
  isMobile?: boolean;
}

export function ProductCommunityChatRoomFixed({
  isOpen,
  onClose,
  product,
  currentUser,
  isMobile = false
}: ProductCommunityChatRoomFixedProps) {
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



      // Mock quality chat messages
      const mockQualityMessages: CommunityMessage[] = [
        {
          id: 100,
          userId: 1,
          text: "The fabric feels premium! Cotton blend is soft and breathable. No pilling after multiple washes. 👌",
          sender: 'other',
          timestamp: new Date('2024-12-19T11:15:00Z'),
          reactions: [
            { emoji: '👍', count: 12, users: ['user1', 'user2'] },
            { emoji: '💯', count: 8, users: ['user3', 'user4'] }
          ],
          userReactions: [],
          messageType: 'text',
          status: 'read',
          sentiment: 'positive'
        },
        {
          id: 101,
          userId: 2,
          text: "Has anyone noticed any shrinkage? I'm worried about the care instructions.",
          sender: 'other',
          timestamp: new Date('2024-12-19T11:20:00Z'),
          reactions: [
            { emoji: '🤔', count: 3, users: ['user1'] }
          ],
          userReactions: [],
          messageType: 'question',
          status: 'read',
          sentiment: 'neutral'
        }
      ];

      // Mock services chat messages  
      const mockServicesMessages: CommunityMessage[] = [
        {
          id: 200,
          userId: 1,
          text: "Shipping was incredibly fast! Ordered yesterday and arrived today. Customer service was helpful when I had sizing questions. 📦",
          sender: 'other',
          timestamp: new Date('2024-12-19T12:30:00Z'),
          reactions: [
            { emoji: '⚡', count: 6, users: ['user1', 'user2'] },
            { emoji: '📦', count: 4, users: ['user3'] }
          ],
          userReactions: [],
          messageType: 'text',
          status: 'read',
          sentiment: 'positive'
        },
        {
          id: 201,
          userId: 2,
          text: "Need help with returns process. Can someone guide me through the steps?",
          sender: 'other',
          timestamp: new Date('2024-12-19T12:45:00Z'),
          reactions: [
            { emoji: '💭', count: 2, users: ['user1'] }
          ],
          userReactions: [],
          messageType: 'question',
          status: 'read',
          sentiment: 'neutral'
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
      setQualityMessages(mockQualityMessages);
      setServicesMessages(mockServicesMessages);
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
    } else if (isOpen && qualityInputRef.current && activeTab === 'quality') {
      setTimeout(() => qualityInputRef.current?.focus(), 300);
    } else if (isOpen && servicesInputRef.current && activeTab === 'services') {
      setTimeout(() => servicesInputRef.current?.focus(), 300);
    }
  }, [isOpen, activeTab]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [reviewMessages, qualityMessages, servicesMessages]);

  // ⭐ NEW: Dynamic Rating Prompt Handlers - DEFINED FIRST to prevent initialization errors
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

  // Handle quality chat message sending
  const handleSendQualityMessage = useCallback(() => {
    if (!qualityMessage.trim()) return;

    const user = currentUser || {
      id: Math.floor(Math.random() * 1000) + 10000,
      firstName: 'Guest',
      lastName: 'User',
      email: 'guest@bato.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    };

    const newMessage: CommunityMessage = {
      id: Date.now(),
      userId: user.id || 999,
      text: qualityMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      reactions: [],
      userReactions: [],
      messageType: 'text',
      status: 'sending',
      sentiment: 'neutral'
    };

    setQualityMessages(prev => [...prev, newMessage]);
    setQualityMessage('');
    setShowEmojiPicker(false);
    setShowModernEmojiPicker(false);

    setTimeout(() => qualityInputRef.current?.focus(), 100);
  }, [qualityMessage, currentUser]);

  // Handle services chat message sending
  const handleSendServicesMessage = useCallback(() => {
    if (!servicesMessage.trim()) return;

    const user = currentUser || {
      id: Math.floor(Math.random() * 1000) + 10000,
      firstName: 'Guest',
      lastName: 'User',
      email: 'guest@bato.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    };

    const newMessage: CommunityMessage = {
      id: Date.now(),
      userId: user.id || 999,
      text: servicesMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      reactions: [],
      userReactions: [],
      messageType: 'text',
      status: 'sending',
      sentiment: 'neutral'
    };

    setServicesMessages(prev => [...prev, newMessage]);
    setServicesMessage('');
    setShowEmojiPicker(false);
    setShowModernEmojiPicker(false);

    setTimeout(() => servicesInputRef.current?.focus(), 100);
  }, [servicesMessage, currentUser]);

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
      } else if (activeTab === 'quality') {
        handleSendQualityMessage();
      } else if (activeTab === 'services') {
        handleSendServicesMessage();
      }
    }
  }, [handleSendReviewTabMessage, handleSendQualityMessage, handleSendServicesMessage, activeTab]);

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
    } else if (activeTab === 'quality') {
      setQualityMessages(prev => prev.map(msg => {
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
    } else if (activeTab === 'services') {
      setServicesMessages(prev => prev.map(msg => {
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
                  <h3 className="text-white/80 font-medium text-sm mb-1 font-heading">Product Reviews</h3>
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
                            <p className="text-white text-sm font-medium font-heading">{review.userName}</p>
                            <p className="text-white/40 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating, false, undefined, 'w-3 h-3')}
                        </div>
                      </div>

                      {/* Review Content */}
                      <div>
                        <h4 className="text-white text-sm font-medium mb-1 font-heading">{review.title}</h4>
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

  // Function to render messages for different chat types using MessageBubble
  const renderChatMessages = useCallback((messagesList: CommunityMessage[], emptyMessage: string) => (
    <div className="flex-1 overflow-hidden relative" style={{ paddingBottom: '120px' }}>
      <div className="h-full px-4 py-2 overflow-y-auto community-chat-scrollable">
        <div className="space-y-4">
          {messagesList.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/60">{emptyMessage}</p>
              <p className="text-white/40 text-xs mt-2">Message count: {messagesList.length}</p>
            </div>
          )}
          <AnimatePresence>
            {messagesList.map((msg) => {
              // Determine if this message is from the current user
              const isCurrentUser = (currentUser?.id || 999) === msg.userId;
              
              // Convert CommunityMessage to Message format for MessageBubble
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
                  onReact={handleMessageReaction}
                  onReactionButtonClick={handleReactionButtonClick}
                  onHover={(messageId) => setHoveredMessageId(messageId)}
                  onHoverLeave={() => setHoveredMessageId(null)}
                  onReactionButtonClick={handleReactionButtonClick}
                  onMessageReaction={handleMessageReaction}
                  onMouseEnter={() => setHoveredMessageId(msg.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                />
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  ), [members, currentUser, hoveredMessageId, activeReactionMessageId, handleReactionButtonClick, handleMessageReaction]);

  // Function to render chat input for different tabs
  const renderChatInput = useCallback((
    inputValue: string,
    setInputValue: (value: string) => void,
    handleSend: () => void,
    inputRefEl: React.RefObject<HTMLInputElement>,
    placeholder: string
  ) => (
    <div 
      className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-white/20"
      style={{ zIndex: 50 }}
    >
      <div className="relative">
        {/* Emoji Picker */}
        {(showEmojiPicker || showModernEmojiPicker) && (
          <div 
            className="absolute bottom-full left-0 mb-2"
            style={{ 
              zIndex: 10000,
              position: 'absolute'
            }}
          >
            {emojiPickerMode === 'quick' && showEmojiPicker ? (
              <div 
                className="bg-black/90 backdrop-blur-md rounded-lg p-3 border border-white/20"
                style={{ 
                  zIndex: 10000,
                  position: 'relative'
                }}
              >
                <EmojiPicker 
                  onEmojiClick={handleEmojiClick}
                  style={{ 
                    zIndex: 10000,
                    position: 'relative'
                  }}
                />
              </div>
            ) : showModernEmojiPicker ? (
              <div 
                className="bg-black/90 backdrop-blur-md rounded-lg border border-white/20"
                style={{ 
                  zIndex: 10000,
                  position: 'relative'
                }}
              >
                <ModernEmojiPicker 
                  onEmojiClick={handleEmojiClick}
                  style={{ 
                    zIndex: 10000,
                    position: 'relative'
                  }}
                />
              </div>
            ) : null}
          </div>
        )}

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
            ref={inputRefEl}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/60 px-4 py-2"
            style={{ zIndex: 1, borderRadius: '4px' }}
          />
          
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="btn-moema-primary rounded-full p-2 h-auto min-w-[44px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  ), [showEmojiPicker, showModernEmojiPicker, emojiPickerMode, handleEmojiClick, handleEmojiButtonClick, toggleEmojiPickerMode, handleKeyPress]);

  if (!isOpen) return null;

  const containerClasses = isMobile 
    ? "fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md"
    : "fixed bottom-4 right-4 w-[480px] h-[700px] z-[9999] bg-white rounded-lg shadow-2xl border";

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
            {/* Header */}
            <div className="relative overflow-hidden flex-shrink-0 bg-gradient-to-r from-purple-600 to-blue-600">
              <div className="flex items-stretch justify-between relative z-10">
                <div className="flex items-center gap-4 p-4 flex-1">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="h-24 w-24 object-cover border-2 border-white/30 shadow-lg"
                    style={{ borderRadius: '4px' }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-xl leading-tight mb-2">{product.name}</h3>
                    <div className="flex items-center gap-3">
                      <p className="text-white text-lg font-heading font-medium">${product.price}</p>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-body text-white" style={{ borderRadius: '4px' }}>
                        In Stock
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 rounded-full p-2 m-4 h-10 w-10 flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-black/20 border-b border-white/20 rounded-none">
                <TabsTrigger value="reviews" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  ⭐ Reviews ({reviews.length})
                </TabsTrigger>
                <TabsTrigger value="quality" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  🔍 Quality
                </TabsTrigger>
                <TabsTrigger value="services" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  🛠️ Services
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quality" className="flex-1 flex flex-col">
                {renderChatMessages(qualityMessages, "No quality discussions yet. Ask about fabric, durability, fit!")}
                {renderChatInput(qualityMessage, setQualityMessage, handleSendQualityMessage, qualityInputRef, "Ask about quality, materials, durability...")}
              </TabsContent>

              <TabsContent value="services" className="flex-1 flex flex-col">
                {renderChatMessages(servicesMessages, "No service questions yet. Ask about shipping, returns, support!")}
                {renderChatInput(servicesMessage, setServicesMessage, handleSendServicesMessage, servicesInputRef, "Ask about shipping, returns, customer service...")}
              </TabsContent>

              <TabsContent value="reviews" className="flex-1 flex flex-col">
                {/* Reviews content - keeping existing implementation */}
                <div className="flex-1 overflow-hidden relative" style={{ paddingBottom: '120px' }}>
                  <div className="h-full px-4 py-2 overflow-y-auto community-chat-scrollable">
                    <div className="space-y-4">
                      {filteredAndSortedReviews.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-white/60">No reviews yet. Be the first to share your experience!</p>
                          <p className="text-white/40 text-xs mt-2">Review count: {reviews.length}</p>
                        </div>
                      )}
                      {filteredAndSortedReviews.map((review) => (
                        <div key={review.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10 border-2 border-white/20">
                              <img src={review.userAvatar} alt="" className="w-full h-full object-cover" />
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-heading font-medium text-white text-sm">{review.userName}</span>
                                {review.isVerifiedPurchase && (
                                  <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">
                                    Verified Purchase
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                {renderStars(review.rating)}
                                <span className="text-white/60 text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
                              </div>
                              <h4 className="font-heading font-medium text-white text-sm mb-1">{review.title}</h4>
                              <p className="text-white/80 text-sm leading-relaxed">{review.content}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <Button
                                  onClick={() => handleReviewHelpful(review.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-white/60 hover:text-white hover:bg-white/10 text-xs"
                                >
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  Helpful ({review.helpfulVotes})
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* ⭐ Enhanced Reviews Tab Input */}
                <div 
                  className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-white/20"
                  style={{ zIndex: 50 }}
                >
                  <div className="relative">
                    {/* Emoji Picker - same structure as renderChatInput */}
                    {(showEmojiPicker || showModernEmojiPicker) && (
                      <div 
                        className="absolute bottom-full left-0 mb-2"
                        style={{ 
                          zIndex: 10000,
                          position: 'absolute'
                        }}
                      >
                        {emojiPickerMode === 'quick' && showEmojiPicker ? (
                          <div 
                            className="bg-black/90 backdrop-blur-md rounded-lg p-3 border border-white/20"
                            style={{ 
                              zIndex: 10000,
                              position: 'relative'
                            }}
                          >
                            <EmojiPicker 
                              onEmojiClick={handleEmojiClick}
                              style={{ 
                                zIndex: 10000,
                                position: 'relative'
                              }}
                            />
                          </div>
                        ) : showModernEmojiPicker ? (
                          <div 
                            className="bg-black/90 backdrop-blur-md rounded-lg border border-white/20"
                            style={{ 
                              zIndex: 10000,
                              position: 'relative'
                            }}
                          >
                            <ModernEmojiPicker 
                              onEmojiClick={handleEmojiClick}
                              style={{ 
                                zIndex: 10000,
                                position: 'relative'
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                    )}

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
                      
                      {/* ⭐ Enhanced Input that triggers rating prompt */}
                      <Input
                        ref={reviewTabInputRef}
                        value={reviewTabMessage}
                        onChange={(e) => setReviewTabMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => {
                          setIsInputFocused(true);
                          setShowRatingPrompt(true);
                        }}
                        onBlur={() => setIsInputFocused(false)}
                        placeholder="Share your experience with this product..."
                        className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/60 px-4 py-2"
                        style={{ zIndex: 1, borderRadius: '4px' }}
                      />
                      
                      <Button
                        onClick={handleSendReviewTabMessage}
                        disabled={!reviewTabMessage.trim()}
                        className="btn-moema-primary rounded-full p-2 h-auto min-w-[44px]"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* ⭐ Sliding Rating Prompt */}
                    <SlidingRatingPrompt
                      isVisible={showRatingPrompt}
                      currentRating={preSubmissionRating}
                      onRatingSelect={handlePreSubmissionRatingSelect}
                      onClose={handleResetRatingPrompt}
                      productName={product.name}
                    />
                  </div>
                </div>
              </TabsContent>


            </Tabs>
          </div>
        ) : (
          // Desktop layout would go here (keeping existing implementation)
          <div className="flex flex-col h-full">
            {/* Desktop implementation would be similar but adapted for desktop */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-lg">{product.name}</h3>
                    <p className="text-gray-600 text-sm">${product.price}</p>
                  </div>
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <p className="p-4 text-center text-gray-500">Desktop layout not yet implemented for 5-tab interface</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}