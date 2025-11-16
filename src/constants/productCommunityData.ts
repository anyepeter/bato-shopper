export interface ProductCommunity {
  productId: number;
  memberCount: number;
  onlineCount: number;
  totalMessages: number;
  weeklyActivity: number;
  communityHealth: number;
  topTags: string[];
  communityStats: {
    questionsAnswered: number;
    helpfulReviews: number;
    activeModerators: number;
    averageResponseTime: string;
  };
}

export interface CommunityMember {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  memberSince: string;
  purchaseStatus: 'purchased' | 'favorited' | 'both';
  totalPurchases: number;
  isVerified: boolean;
  badges: ('top-reviewer' | 'early-adopter' | 'super-fan' | 'helpful' | 'moderator')[];
  contributionScore: number;
  lastActive: string;
}

export interface CommunityMessage {
  id: number;
  userId: number;
  message: string;
  timestamp: string;
  reactions: { [emoji: string]: number };
  userReactions: string[];
  messageType: 'text' | 'product-review' | 'question' | 'tip' | 'announcement';
  attachments?: string[];
  isHighlighted?: boolean;
  helpfulCount?: number;
  isPinned?: boolean;
  replyToId?: number;
  tags?: string[];
}

export interface CommunityEvent {
  id: number;
  type: 'new_member' | 'milestone' | 'featured_review' | 'q_and_a' | 'product_update';
  title: string;
  description: string;
  timestamp: string;
  participants: number[];
  isActive: boolean;
}

// Mock data for product communities - Extended to cover more products
export const PRODUCT_COMMUNITIES: { [productId: number]: ProductCommunity } = {
  1: {
    productId: 1,
    memberCount: 128,
    onlineCount: 23,
    totalMessages: 1247,
    weeklyActivity: 89,
    communityHealth: 94,
    topTags: ['sizing', 'styling', 'care-tips', 'occasions', 'quality'],
    communityStats: {
      questionsAnswered: 156,
      helpfulReviews: 43,
      activeModerators: 2,
      averageResponseTime: '15 min'
    }
  },
  2: {
    productId: 2,
    memberCount: 89,
    onlineCount: 15,
    totalMessages: 823,
    weeklyActivity: 76,
    communityHealth: 91,
    topTags: ['fit', 'color', 'occasions', 'care'],
    communityStats: {
      questionsAnswered: 98,
      helpfulReviews: 29,
      activeModerators: 1,
      averageResponseTime: '22 min'
    }
  },
  3: {
    productId: 3,
    memberCount: 156,
    onlineCount: 31,
    totalMessages: 1569,
    weeklyActivity: 93,
    communityHealth: 96,
    topTags: ['styling', 'occasions', 'quality', 'value'],
    communityStats: {
      questionsAnswered: 203,
      helpfulReviews: 67,
      activeModerators: 3,
      averageResponseTime: '12 min'
    }
  },
  4: {
    productId: 4,
    memberCount: 72,
    onlineCount: 12,
    totalMessages: 567,
    weeklyActivity: 68,
    communityHealth: 88,
    topTags: ['comfort', 'versatile', 'style', 'fit'],
    communityStats: {
      questionsAnswered: 89,
      helpfulReviews: 24,
      activeModerators: 1,
      averageResponseTime: '18 min'
    }
  },
  5: {
    productId: 5,
    memberCount: 94,
    onlineCount: 18,
    totalMessages: 734,
    weeklyActivity: 82,
    communityHealth: 92,
    topTags: ['colors', 'fabric', 'styling', 'occasions'],
    communityStats: {
      questionsAnswered: 112,
      helpfulReviews: 31,
      activeModerators: 2,
      averageResponseTime: '16 min'
    }
  },
  6: {
    productId: 6,
    memberCount: 63,
    onlineCount: 9,
    totalMessages: 445,
    weeklyActivity: 59,
    communityHealth: 85,
    topTags: ['accessories', 'matching', 'care', 'styling'],
    communityStats: {
      questionsAnswered: 67,
      helpfulReviews: 18,
      activeModerators: 1,
      averageResponseTime: '25 min'
    }
  },
  7: {
    productId: 7,
    memberCount: 105,
    onlineCount: 21,
    totalMessages: 892,
    weeklyActivity: 75,
    communityHealth: 90,
    topTags: ['elegant', 'fit', 'occasions', 'quality'],
    communityStats: {
      questionsAnswered: 134,
      helpfulReviews: 39,
      activeModerators: 2,
      averageResponseTime: '14 min'
    }
  },
  8: {
    productId: 8,
    memberCount: 87,
    onlineCount: 16,
    totalMessages: 623,
    weeklyActivity: 71,
    communityHealth: 87,
    topTags: ['comfort', 'casual', 'versatile', 'colors'],
    communityStats: {
      questionsAnswered: 93,
      helpfulReviews: 27,
      activeModerators: 1,
      averageResponseTime: '20 min'
    }
  },
  9: {
    productId: 9,
    memberCount: 112,
    onlineCount: 24,
    totalMessages: 978,
    weeklyActivity: 85,
    communityHealth: 94,
    topTags: ['trendy', 'styling', 'fit', 'quality'],
    communityStats: {
      questionsAnswered: 145,
      helpfulReviews: 42,
      activeModerators: 2,
      averageResponseTime: '13 min'
    }
  },
  10: {
    productId: 10,
    memberCount: 78,
    onlineCount: 14,
    totalMessages: 556,
    weeklyActivity: 65,
    communityHealth: 86,
    topTags: ['accessories', 'statement', 'occasions', 'styling'],
    communityStats: {
      questionsAnswered: 81,
      helpfulReviews: 22,
      activeModerators: 1,
      averageResponseTime: '22 min'
    }
  }
};

// Mock community members
export const COMMUNITY_MEMBERS: CommunityMember[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    status: 'online',
    memberSince: '2024-01-15',
    purchaseStatus: 'both',
    totalPurchases: 3,
    isVerified: true,
    badges: ['top-reviewer', 'super-fan'],
    contributionScore: 245,
    lastActive: '2024-12-19T12:30:00Z'
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
    badges: ['helpful'],
    contributionScore: 78,
    lastActive: '2024-12-19T12:45:00Z'
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
    badges: ['early-adopter'],
    contributionScore: 156,
    lastActive: '2024-12-19T11:15:00Z'
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
    badges: ['top-reviewer', 'super-fan', 'helpful'],
    contributionScore: 312,
    lastActive: '2024-12-19T12:50:00Z'
  },
  {
    id: 5,
    name: 'Kemi Adebayo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'online',
    memberSince: '2024-01-08',
    purchaseStatus: 'purchased',
    totalPurchases: 2,
    isVerified: true,
    badges: ['moderator', 'helpful'],
    contributionScore: 189,
    lastActive: '2024-12-19T12:52:00Z'
  },
  {
    id: 6,
    name: 'Fatima Al-Rashid',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    status: 'offline',
    memberSince: '2024-02-14',
    purchaseStatus: 'both',
    totalPurchases: 4,
    isVerified: false,
    badges: ['super-fan'],
    contributionScore: 134,
    lastActive: '2024-12-19T10:30:00Z'
  }
];

// Mock community messages with varied content
export const COMMUNITY_MESSAGES: { [productId: number]: CommunityMessage[] } = {
  1: [
    {
      id: 1,
      userId: 1,
      message: "Just received this dress and WOW! 😍 The fabric quality is amazing and the fit is perfect. Definitely worth every penny! The African-inspired print is even more beautiful in person.",
      timestamp: '2024-12-19T10:30:00Z',
      reactions: { '😍': 8, '👏': 5, '🔥': 3, '💯': 4 },
      userReactions: ['😍'],
      messageType: 'product-review',
      isHighlighted: true,
      helpfulCount: 12,
      tags: ['quality', 'fit', 'print']
    },
    {
      id: 2,
      userId: 2,
      message: "Quick question - does this run true to size? I'm between M and L and not sure which to order 🤔 Any advice from fellow buyers?",
      timestamp: '2024-12-19T11:15:00Z',
      reactions: { '🤔': 3, '👍': 2 },
      userReactions: [],
      messageType: 'question',
      tags: ['sizing', 'advice']
    },
    {
      id: 3,
      userId: 4,
      message: "@Maya I'd go with M! I'm similar size and M fits perfectly. The fabric has a nice stretch to it 💪 Plus you can always return if needed!",
      timestamp: '2024-12-19T11:18:00Z',
      reactions: { '💪': 4, '🙏': 6, '✨': 2 },
      userReactions: ['🙏'],
      messageType: 'tip',
      helpfulCount: 8,
      replyToId: 2,
      tags: ['sizing', 'fabric']
    },
    {
      id: 4,
      userId: 3,
      message: "Pro tip: This pairs beautifully with gold accessories! I wore it to a wedding and got so many compliments ✨ The colors really pop with the right jewelry.",
      timestamp: '2024-12-19T12:45:00Z',
      reactions: { '✨': 7, '👗': 4, '🌟': 3 },
      userReactions: ['✨', '🌟'],
      messageType: 'tip',
      helpfulCount: 15,
      tags: ['styling', 'accessories', 'occasions']
    },
    {
      id: 5,
      userId: 5,
      message: "🔥 COMMUNITY UPDATE: We've hit 125 members! Thank you all for making this such a supportive space. Keep sharing your styling tips and honest reviews! 💜",
      timestamp: '2024-12-19T13:00:00Z',
      reactions: { '🎉': 12, '💜': 8, '👏': 6 },
      userReactions: ['🎉'],
      messageType: 'announcement',
      isPinned: true,
      tags: ['community', 'milestone']
    },
    {
      id: 6,
      userId: 6,
      message: "Care instructions question: Is this machine washable or dry clean only? The tag is a bit unclear and I want to make sure I don't damage it!",
      timestamp: '2024-12-19T13:15:00Z',
      reactions: { '🤷‍♀️': 2, '👍': 1 },
      userReactions: [],
      messageType: 'question',
      tags: ['care', 'washing']
    },
    {
      id: 7,
      userId: 1,
      message: "@Fatima Machine wash cold on delicate cycle! I've washed mine 3 times now and it still looks brand new. Air dry is best though! 🌟",
      timestamp: '2024-12-19T13:18:00Z',
      reactions: { '🌟': 5, '🙏': 3, '👍': 4 },
      userReactions: ['👍'],
      messageType: 'tip',
      helpfulCount: 7,
      replyToId: 6,
      tags: ['care', 'washing', 'maintenance']
    }
  ],
  2: [
    {
      id: 8,
      userId: 2,
      message: "Love the vibrant colors of this top! Perfect for summer events and the breathable fabric is a game-changer in this heat 🌞",
      timestamp: '2024-12-19T09:45:00Z',
      reactions: { '🌞': 6, '🔥': 4, '💚': 3 },
      userReactions: ['🌞'],
      messageType: 'product-review',
      tags: ['colors', 'summer', 'fabric']
    },
    {
      id: 9,
      userId: 4,
      message: "Has anyone tried styling this with denim? Looking for casual outfit inspiration! 👕",
      timestamp: '2024-12-19T10:20:00Z',
      reactions: { '👕': 2, '🤔': 1 },
      userReactions: [],
      messageType: 'question',
      tags: ['styling', 'casual', 'denim']
    }
  ],
  3: [
    {
      id: 10,
      userId: 3,
      message: "This accessory collection is absolutely stunning! The craftsmanship is incredible and each piece tells a story ✨",
      timestamp: '2024-12-19T08:30:00Z',
      reactions: { '✨': 9, '👑': 5, '💎': 4 },
      userReactions: ['✨'],
      messageType: 'product-review',
      isHighlighted: true,
      helpfulCount: 11,
      tags: ['craftsmanship', 'quality', 'story']
    }
  ]
};

// Mock community events
export const COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: 1,
    type: 'q_and_a',
    title: 'Styling Q&A Session',
    description: 'Join our styling experts for tips on mixing African prints with modern fashion',
    timestamp: '2024-12-20T18:00:00Z',
    participants: [1, 3, 4, 5],
    isActive: true
  },
  {
    id: 2,
    type: 'milestone',
    title: '100 Members Celebration',
    description: 'Celebrating our growing community with special offers and giveaways',
    timestamp: '2024-12-18T15:00:00Z',
    participants: [1, 2, 3, 4, 5, 6],
    isActive: false
  },
  {
    id: 3,
    type: 'featured_review',
    title: 'Review of the Week',
    description: 'Sarah\'s detailed review of the Ankara Evening Dress',
    timestamp: '2024-12-17T12:00:00Z',
    participants: [1],
    isActive: false
  }
];

// Utility functions for community data
export const getCommunityByProductId = (productId: number): ProductCommunity | null => {
  return PRODUCT_COMMUNITIES[productId] || null;
};

export const getMessagesForProduct = (productId: number): CommunityMessage[] => {
  return COMMUNITY_MESSAGES[productId] || [];
};

export const getMemberById = (memberId: number): CommunityMember | null => {
  return COMMUNITY_MEMBERS.find(member => member.id === memberId) || null;
};

export const getOnlineMembers = (): CommunityMember[] => {
  return COMMUNITY_MEMBERS.filter(member => member.status === 'online');
};

export const getTopContributors = (limit: number = 5): CommunityMember[] => {
  return COMMUNITY_MEMBERS
    .sort((a, b) => b.contributionScore - a.contributionScore)
    .slice(0, limit);
};

export const getUserEligibility = (userId: number | null, productId: number): {
  isEligible: boolean;
  reason: string;
  purchaseStatus: 'purchased' | 'favorited' | 'both' | 'none';
} => {
  // Mock eligibility check - in real app this would check actual purchase/favorites data
  const mockUserData: { [userId: number]: { purchased: number[], favorited: number[] } } = {
    1: { purchased: [1, 3, 7, 9], favorited: [1, 2, 3, 4, 5] },
    2: { purchased: [1, 2, 4, 6], favorited: [2, 5, 8] },
    3: { purchased: [5, 8], favorited: [1, 3, 6, 9, 10] },
    4: { purchased: [1, 2, 3, 7, 10], favorited: [1, 3, 4, 7] },
    5: { purchased: [1, 3, 5, 9], favorited: [1, 6, 8] },
    6: { purchased: [2, 3, 6, 8], favorited: [1, 2, 3, 5, 7, 9] },
    // Add default user data for non-signed-in users
    999: { purchased: [], favorited: [1, 4, 7] } // Default guest user
  };

  // If no user is signed in, use guest user behavior
  const effectiveUserId = userId || 999;
  const userData = mockUserData[effectiveUserId];
  
  if (!userData) {
    return {
      isEligible: false,
      reason: 'Please sign in to join product communities',
      purchaseStatus: 'none'
    };
  }

  const hasPurchased = userData.purchased.includes(productId);
  const hasFavorited = userData.favorited.includes(productId);

  if (hasPurchased && hasFavorited) {
    return {
      isEligible: true,
      reason: 'User has purchased and favorited this product',
      purchaseStatus: 'both'
    };
  } else if (hasPurchased) {
    return {
      isEligible: true,
      reason: 'User has purchased this product',
      purchaseStatus: 'purchased'
    };
  } else if (hasFavorited) {
    return {
      isEligible: true,
      reason: 'User has favorited this product',
      purchaseStatus: 'favorited'
    };
  }

  return {
    isEligible: false,
    reason: 'User must purchase or favorite this product to join the community',
    purchaseStatus: 'none'
  };
};

// Badge configurations
export const BADGE_CONFIG = {
  'top-reviewer': {
    name: 'Top Reviewer',
    icon: '⭐',
    color: 'bg-yellow-500',
    description: 'Consistently provides helpful product reviews'
  },
  'early-adopter': {
    name: 'Early Adopter',
    icon: '⚡',
    color: 'bg-purple-500',
    description: 'First to try new products and share feedback'
  },
  'super-fan': {
    name: 'Super Fan',
    icon: '❤️',
    color: 'bg-red-500',
    description: 'Highly engaged community member with multiple purchases'
  },
  'helpful': {
    name: 'Helpful',
    icon: '🎁',
    color: 'bg-green-500',
    description: 'Frequently helps other community members'
  },
  'moderator': {
    name: 'Moderator',
    icon: '🛡️',
    color: 'bg-blue-500',
    description: 'Community moderator helping maintain a positive environment'
  }
};