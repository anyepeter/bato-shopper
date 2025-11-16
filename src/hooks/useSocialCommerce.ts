import { useState, useCallback, useEffect } from 'react';

interface SocialCommerceState {
  socialPosts: SocialPost[];
  influencerCampaigns: InfluencerCampaign[];
  userGeneratedContent: UGCPost[];
  socialAnalytics: SocialAnalytics;
  viralProducts: ViralProduct[];
  socialListening: SocialListeningData;
  isLoading: boolean;
  error: string | null;
}

interface SocialPost {
  id: string;
  platform: 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'youtube';
  productId: string;
  content: {
    caption: string;
    images: string[];
    videos?: string[];
    hashtags: string[];
    mentions: string[];
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
    saves?: number;
  };
  performance: {
    reach: number;
    impressions: number;
    clickThroughRate: number;
    conversionRate: number;
    revenue: number;
  };
  author: {
    id: string;
    username: string;
    followers: number;
    isInfluencer: boolean;
    tier?: 'nano' | 'micro' | 'macro' | 'mega';
  };
  createdAt: Date;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
}

interface InfluencerCampaign {
  id: string;
  name: string;
  description: string;
  influencer: {
    id: string;
    username: string;
    platform: string;
    followers: number;
    engagementRate: number;
    niche: string[];
    tier: 'nano' | 'micro' | 'macro' | 'mega';
    demographics: {
      ageGroups: Record<string, number>;
      genders: Record<string, number>;
      locations: Record<string, number>;
    };
  };
  products: string[];
  campaign: {
    type: 'sponsored_post' | 'story' | 'reel' | 'live_stream' | 'giveaway';
    deliverables: string[];
    timeline: {
      start: Date;
      end: Date;
      milestones: CampaignMilestone[];
    };
    compensation: {
      type: 'monetary' | 'product' | 'commission' | 'hybrid';
      amount: number;
      commission: number;
    };
  };
  performance: {
    reach: number;
    engagement: number;
    conversions: number;
    revenue: number;
    roi: number;
  };
  status: 'proposed' | 'negotiating' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
}

interface CampaignMilestone {
  id: string;
  title: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'overdue';
  deliverable: string;
}

interface UGCPost {
  id: string;
  userId: string;
  productId: string;
  platform: string;
  content: {
    type: 'image' | 'video' | 'story' | 'review';
    url: string;
    caption: string;
    rating?: number;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  sentiment: 'positive' | 'neutral' | 'negative';
  isApproved: boolean;
  isFeatureWorthy: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

interface SocialAnalytics {
  overview: {
    totalFollowers: number;
    totalPosts: number;
    averageEngagementRate: number;
    totalReach: number;
    socialROI: number;
  };
  platformBreakdown: PlatformAnalytics[];
  topPerformingContent: SocialPost[];
  viralTrends: ViralTrend[];
  influencerPerformance: InfluencerPerformance[];
  ugcMetrics: UGCMetrics;
}

interface PlatformAnalytics {
  platform: string;
  followers: number;
  posts: number;
  engagementRate: number;
  reach: number;
  conversions: number;
  revenue: number;
  growthRate: number;
}

interface ViralTrend {
  id: string;
  hashtag: string;
  platform: string;
  volume: number;
  growth: number;
  relevanceScore: number;
  products: string[];
  opportunity: 'high' | 'medium' | 'low';
}

interface InfluencerPerformance {
  influencerId: string;
  username: string;
  campaignsCompleted: number;
  totalReach: number;
  avgEngagementRate: number;
  conversions: number;
  revenue: number;
  roi: number;
  rating: number;
}

interface UGCMetrics {
  totalPosts: number;
  approvedPosts: number;
  averageRating: number;
  sentimentBreakdown: Record<string, number>;
  topProducts: Array<{ productId: string; posts: number; avgRating: number }>;
}

interface ViralProduct {
  productId: string;
  viralScore: number;
  socialMentions: number;
  hashtagReach: number;
  influencerMentions: number;
  ugcPosts: number;
  trendingPlatforms: string[];
  viralityFactors: string[];
  projectedGrowth: number;
}

interface SocialListeningData {
  brandMentions: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  topHashtags: Array<{ tag: string; volume: number; sentiment: string }>;
  competitorComparison: Array<{ competitor: string; mentions: number; sentiment: number }>;
  emergingTrends: Array<{ trend: string; growth: number; relevance: number }>;
  crisisAlerts: Array<{ alert: string; severity: 'low' | 'medium' | 'high'; timestamp: Date }>;
}

const initialState: SocialCommerceState = {
  socialPosts: [],
  influencerCampaigns: [],
  userGeneratedContent: [],
  socialAnalytics: {
    overview: {
      totalFollowers: 0,
      totalPosts: 0,
      averageEngagementRate: 0,
      totalReach: 0,
      socialROI: 0,
    },
    platformBreakdown: [],
    topPerformingContent: [],
    viralTrends: [],
    influencerPerformance: [],
    ugcMetrics: {
      totalPosts: 0,
      approvedPosts: 0,
      averageRating: 0,
      sentimentBreakdown: {},
      topProducts: [],
    },
  },
  viralProducts: [],
  socialListening: {
    brandMentions: 0,
    sentiment: 'neutral',
    sentimentScore: 0,
    topHashtags: [],
    competitorComparison: [],
    emergingTrends: [],
    crisisAlerts: [],
  },
  isLoading: false,
  error: null,
};

export function useSocialCommerce() {
  const [state, setState] = useState<SocialCommerceState>(initialState);

  // 📱 SOCIAL POST MANAGEMENT
  const createSocialPost = useCallback(async (
    productId: string,
    platform: string,
    content: any,
    scheduleTime?: Date
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newPost: SocialPost = {
        id: `post_${Date.now()}`,
        platform: platform as any,
        productId,
        content: {
          caption: content.caption,
          images: content.images || [],
          videos: content.videos || [],
          hashtags: content.hashtags || [],
          mentions: content.mentions || [],
        },
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0,
          saves: 0,
        },
        performance: {
          reach: 0,
          impressions: 0,
          clickThroughRate: 0,
          conversionRate: 0,
          revenue: 0,
        },
        author: {
          id: 'brand_account',
          username: 'bato_official',
          followers: 25000,
          isInfluencer: false,
        },
        createdAt: new Date(),
        status: scheduleTime ? 'scheduled' : 'published',
      };

      setState(prev => ({
        ...prev,
        socialPosts: [...prev.socialPosts, newPost],
        isLoading: false,
      }));

      // Simulate post performance tracking
      setTimeout(() => {
        trackPostPerformance(newPost.id);
      }, 5000);

      return newPost;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create social post',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // 🌟 INFLUENCER CAMPAIGN MANAGEMENT
  const createInfluencerCampaign = useCallback(async (campaignData: Omit<InfluencerCampaign, 'id' | 'createdAt' | 'performance'>) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newCampaign: InfluencerCampaign = {
        ...campaignData,
        id: `campaign_${Date.now()}`,
        performance: {
          reach: 0,
          engagement: 0,
          conversions: 0,
          revenue: 0,
          roi: 0,
        },
        createdAt: new Date(),
      };

      setState(prev => ({
        ...prev,
        influencerCampaigns: [...prev.influencerCampaigns, newCampaign],
        isLoading: false,
      }));

      // Auto-outreach to influencer
      await sendInfluencerProposal(newCampaign);

      return newCampaign;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create influencer campaign',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // 📸 USER-GENERATED CONTENT MANAGEMENT
  const moderateUGC = useCallback(async (ugcId: string, action: 'approve' | 'reject' | 'feature') => {
    setState(prev => ({
      ...prev,
      userGeneratedContent: prev.userGeneratedContent.map(ugc =>
        ugc.id === ugcId
          ? {
              ...ugc,
              moderationStatus: action === 'reject' ? 'rejected' : 'approved',
              isApproved: action !== 'reject',
              isFeatureWorthy: action === 'feature',
            }
          : ugc
      ),
    }));

    // Send notification to user
    await notifyUserOfModerationDecision(ugcId, action);
  }, []);

  // 🔥 VIRAL PRODUCT TRACKING
  const trackViralProducts = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate viral tracking algorithm
      const viralProducts = await calculateViralScores();
      
      setState(prev => ({
        ...prev,
        viralProducts,
        isLoading: false,
      }));

      return viralProducts;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to track viral products',
        isLoading: false,
      }));
    }
  }, []);

  // 🎯 HASHTAG OPTIMIZATION
  const optimizeHashtags = useCallback(async (productId: string, platform: string) => {
    try {
      // AI-powered hashtag recommendations
      const productData = await getProductData(productId);
      const trendingHashtags = await getTrendingHashtags(platform);
      const competitorHashtags = await getCompetitorHashtags(productData.category);
      
      // Optimization algorithm
      const optimizedHashtags = await calculateOptimalHashtags({
        productData,
        trendingHashtags,
        competitorHashtags,
        platform,
      });

      return optimizedHashtags;
    } catch (error) {
      console.error('Failed to optimize hashtags:', error);
      return [];
    }
  }, []);

  // 📊 SOCIAL LISTENING
  const performSocialListening = useCallback(async (keywords: string[]) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const listeningData = await analyzeSocialConversations(keywords);
      
      setState(prev => ({
        ...prev,
        socialListening: listeningData,
        isLoading: false,
      }));

      // Check for crisis alerts
      if (listeningData.crisisAlerts.length > 0) {
        await triggerCrisisResponse(listeningData.crisisAlerts);
      }

      return listeningData;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to perform social listening',
        isLoading: false,
      }));
    }
  }, []);

  // 🏆 INFLUENCER DISCOVERY
  const discoverInfluencers = useCallback(async (criteria: {
    niche: string[];
    followerRange: { min: number; max: number };
    engagementRate: { min: number };
    location?: string;
    budget: { min: number; max: number };
  }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // AI-powered influencer matching
      const influencers = await findMatchingInfluencers(criteria);
      
      return influencers.map(influencer => ({
        ...influencer,
        matchScore: calculateInfluencerMatchScore(influencer, criteria),
        estimatedROI: predictInfluencerROI(influencer, criteria.budget),
        audienceAlignment: calculateAudienceAlignment(influencer),
      }));
    } catch (error) {
      console.error('Failed to discover influencers:', error);
      return [];
    }
  }, []);

  // 📈 SOCIAL COMMERCE ANALYTICS
  const getSocialCommerceAnalytics = useCallback((timeRange: { from: Date; to: Date }) => {
    const filteredPosts = state.socialPosts.filter(
      post => post.createdAt >= timeRange.from && post.createdAt <= timeRange.to
    );

    const totalReach = filteredPosts.reduce((sum, post) => sum + post.performance.reach, 0);
    const totalRevenue = filteredPosts.reduce((sum, post) => sum + post.performance.revenue, 0);
    const avgEngagementRate = filteredPosts.length > 0
      ? filteredPosts.reduce((sum, post) => {
          const totalEngagement = post.engagement.likes + post.engagement.comments + post.engagement.shares;
          return sum + (totalEngagement / post.performance.impressions || 0);
        }, 0) / filteredPosts.length
      : 0;

    const platformPerformance = calculatePlatformPerformance(filteredPosts);
    const influencerROI = calculateInfluencerROI(state.influencerCampaigns, timeRange);
    const ugcImpact = calculateUGCImpact(state.userGeneratedContent, timeRange);

    return {
      totalReach,
      totalRevenue,
      avgEngagementRate,
      platformPerformance,
      influencerROI,
      ugcImpact,
      viralProducts: state.viralProducts.slice(0, 10),
      trendingHashtags: state.socialListening.topHashtags.slice(0, 20),
      sentimentScore: state.socialListening.sentimentScore,
    };
  }, [state.socialPosts, state.influencerCampaigns, state.userGeneratedContent, state.viralProducts, state.socialListening]);

  // 🚀 VIRAL MARKETING CAMPAIGNS
  const launchViralCampaign = useCallback(async (
    campaignType: 'challenge' | 'giveaway' | 'user_generated' | 'hashtag_contest',
    campaignData: any
  ) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const viralCampaign = await createViralCampaign(campaignType, campaignData);
      
      // Cross-platform launch
      await launchOnAllPlatforms(viralCampaign);
      
      // Influencer activation
      await activateInfluencersForCampaign(viralCampaign);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      return viralCampaign;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to launch viral campaign',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // Initialize social commerce system
  useEffect(() => {
    const initializeSocialCommerce = async () => {
      setState(prev => ({ ...prev, isLoading: true }));

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockSocialPosts = generateMockSocialPosts();
        const mockInfluencerCampaigns = generateMockInfluencerCampaigns();
        const mockUGC = generateMockUGC();
        const mockAnalytics = generateMockSocialAnalytics();
        const mockViralProducts = generateMockViralProducts();
        const mockSocialListening = generateMockSocialListening();

        setState(prev => ({
          ...prev,
          socialPosts: mockSocialPosts,
          influencerCampaigns: mockInfluencerCampaigns,
          userGeneratedContent: mockUGC,
          socialAnalytics: mockAnalytics,
          viralProducts: mockViralProducts,
          socialListening: mockSocialListening,
          isLoading: false,
        }));

        // Start background monitoring
        startSocialMonitoring();
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to initialize social commerce',
          isLoading: false,
        }));
      }
    };

    initializeSocialCommerce();
  }, []);

  return {
    // State
    ...state,
    
    // Social Post Management
    createSocialPost,
    
    // Influencer Campaigns
    createInfluencerCampaign,
    discoverInfluencers,
    
    // UGC Management
    moderateUGC,
    
    // Viral Tracking
    trackViralProducts,
    launchViralCampaign,
    
    // Optimization
    optimizeHashtags,
    
    // Social Listening
    performSocialListening,
    
    // Analytics
    getSocialCommerceAnalytics,
  };
}

// 🔧 HELPER FUNCTIONS

async function trackPostPerformance(postId: string) {
  // Simulate performance tracking
  console.log(`Tracking performance for post: ${postId}`);
}

async function sendInfluencerProposal(campaign: InfluencerCampaign) {
  console.log(`Sending proposal to ${campaign.influencer.username}`);
}

async function notifyUserOfModerationDecision(ugcId: string, action: string) {
  console.log(`Notifying user about UGC ${ugcId}: ${action}`);
}

async function calculateViralScores(): Promise<ViralProduct[]> {
  return [
    {
      productId: 'prod_1',
      viralScore: 92,
      socialMentions: 1540,
      hashtagReach: 125000,
      influencerMentions: 45,
      ugcPosts: 230,
      trendingPlatforms: ['tiktok', 'instagram'],
      viralityFactors: ['Trending hashtag', 'Influencer boost', 'User challenges'],
      projectedGrowth: 35,
    },
  ];
}

async function getProductData(productId: string) {
  return {
    id: productId,
    name: 'African Print Dress',
    category: 'dresses',
    tags: ['african', 'print', 'dress', 'traditional'],
  };
}

async function getTrendingHashtags(platform: string) {
  const hashtagMap = {
    instagram: ['#AfricanFashion', '#OOTD', '#Style', '#Fashion'],
    tiktok: ['#AfricanTok', '#Fashion', '#StyleChallenge', '#OOTD'],
    facebook: ['#AfricanStyle', '#Fashion', '#Traditional'],
  };
  return hashtagMap[platform] || [];
}

async function getCompetitorHashtags(category: string) {
  return ['#Competitor1', '#Competitor2'];
}

async function calculateOptimalHashtags(data: any) {
  return [
    { hashtag: '#AfricanFashion', score: 95, reach: 150000 },
    { hashtag: '#TraditionalStyle', score: 87, reach: 89000 },
    { hashtag: '#OOTD', score: 82, reach: 245000 },
  ];
}

async function analyzeSocialConversations(keywords: string[]): Promise<SocialListeningData> {
  return {
    brandMentions: 1254,
    sentiment: 'positive',
    sentimentScore: 8.2,
    topHashtags: [
      { tag: '#BatoStyle', volume: 15420, sentiment: 'positive' },
      { tag: '#AfricanFashion', volume: 12650, sentiment: 'positive' },
    ],
    competitorComparison: [
      { competitor: 'Competitor A', mentions: 890, sentiment: 7.1 },
      { competitor: 'Competitor B', mentions: 650, sentiment: 6.8 },
    ],
    emergingTrends: [
      { trend: 'Sustainable Fashion', growth: 23, relevance: 85 },
      { trend: 'Plus Size Fashion', growth: 18, relevance: 78 },
    ],
    crisisAlerts: [],
  };
}

async function triggerCrisisResponse(alerts: any[]) {
  console.log('Crisis response triggered:', alerts);
}

async function findMatchingInfluencers(criteria: any) {
  return [
    {
      id: 'inf_1',
      username: 'african_style_queen',
      platform: 'instagram',
      followers: 85000,
      engagementRate: 0.045,
      niche: ['fashion', 'african'],
      tier: 'micro',
    },
  ];
}

function calculateInfluencerMatchScore(influencer: any, criteria: any): number {
  return 85; // Mock score
}

function predictInfluencerROI(influencer: any, budget: any): number {
  return 3.2; // Mock ROI
}

function calculateAudienceAlignment(influencer: any): number {
  return 0.78; // Mock alignment score
}

function calculatePlatformPerformance(posts: SocialPost[]) {
  return posts.reduce((acc, post) => {
    const platform = post.platform;
    if (!acc[platform]) {
      acc[platform] = { reach: 0, revenue: 0, posts: 0 };
    }
    acc[platform].reach += post.performance.reach;
    acc[platform].revenue += post.performance.revenue;
    acc[platform].posts += 1;
    return acc;
  }, {} as Record<string, any>);
}

function calculateInfluencerROI(campaigns: InfluencerCampaign[], timeRange: any): number {
  const filteredCampaigns = campaigns.filter(
    c => c.createdAt >= timeRange.from && c.createdAt <= timeRange.to
  );
  
  const totalSpent = filteredCampaigns.reduce((sum, c) => sum + c.campaign.compensation.amount, 0);
  const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.performance.revenue, 0);
  
  return totalSpent > 0 ? totalRevenue / totalSpent : 0;
}

function calculateUGCImpact(ugc: UGCPost[], timeRange: any) {
  const filteredUGC = ugc.filter(
    post => post.createdAt >= timeRange.from && post.createdAt <= timeRange.to
  );
  
  return {
    totalPosts: filteredUGC.length,
    approvedPosts: filteredUGC.filter(p => p.isApproved).length,
    avgRating: filteredUGC.reduce((sum, p) => sum + (p.content.rating || 0), 0) / filteredUGC.length,
  };
}

async function createViralCampaign(type: string, data: any) {
  return {
    id: `viral_${Date.now()}`,
    type,
    data,
    status: 'active',
  };
}

async function launchOnAllPlatforms(campaign: any) {
  console.log('Launching viral campaign on all platforms:', campaign.id);
}

async function activateInfluencersForCampaign(campaign: any) {
  console.log('Activating influencers for campaign:', campaign.id);
}

function startSocialMonitoring() {
  console.log('🔍 Social monitoring started...');
}

function generateMockSocialPosts(): SocialPost[] {
  return [
    {
      id: 'post_1',
      platform: 'instagram',
      productId: 'prod_1',
      content: {
        caption: 'Stunning African print dress perfect for any occasion! #AfricanFashion #OOTD #BatoStyle',
        images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'],
        hashtags: ['#AfricanFashion', '#OOTD', '#BatoStyle'],
        mentions: ['@fashioninfluencer'],
      },
      engagement: {
        likes: 1240,
        comments: 89,
        shares: 156,
        views: 15420,
        saves: 234,
      },
      performance: {
        reach: 12500,
        impressions: 18750,
        clickThroughRate: 0.034,
        conversionRate: 0.012,
        revenue: 450,
      },
      author: {
        id: 'brand_account',
        username: 'bato_official',
        followers: 25000,
        isInfluencer: false,
      },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'published',
    },
  ];
}

function generateMockInfluencerCampaigns(): InfluencerCampaign[] {
  return [
    {
      id: 'campaign_1',
      name: 'Summer Collection Launch',
      description: 'Showcase new summer African prints collection',
      influencer: {
        id: 'inf_1',
        username: 'african_style_queen',
        platform: 'instagram',
        followers: 85000,
        engagementRate: 0.045,
        niche: ['fashion', 'african', 'lifestyle'],
        tier: 'micro',
        demographics: {
          ageGroups: { '18-24': 35, '25-34': 45, '35-44': 20 },
          genders: { female: 85, male: 15 },
          locations: { 'West Africa': 60, 'US': 25, 'Europe': 15 },
        },
      },
      products: ['prod_1', 'prod_2', 'prod_3'],
      campaign: {
        type: 'sponsored_post',
        deliverables: ['3 Instagram posts', '5 Instagram stories', '1 Reel'],
        timeline: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          milestones: [
            {
              id: 'milestone_1',
              title: 'First post',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              status: 'pending',
              deliverable: 'Instagram post',
            },
          ],
        },
        compensation: {
          type: 'hybrid',
          amount: 1500,
          commission: 0.1,
        },
      },
      performance: {
        reach: 45000,
        engagement: 2850,
        conversions: 24,
        revenue: 2160,
        roi: 1.44,
      },
      status: 'active',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];
}

function generateMockUGC(): UGCPost[] {
  return [
    {
      id: 'ugc_1',
      userId: 'user_1',
      productId: 'prod_1',
      platform: 'instagram',
      content: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
        caption: 'Love my new African print dress from @bato_official! #BatoStyle',
        rating: 5,
      },
      engagement: {
        likes: 245,
        comments: 18,
        shares: 12,
      },
      sentiment: 'positive',
      isApproved: true,
      isFeatureWorthy: true,
      moderationStatus: 'approved',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];
}

function generateMockSocialAnalytics(): SocialAnalytics {
  return {
    overview: {
      totalFollowers: 125000,
      totalPosts: 450,
      averageEngagementRate: 0.038,
      totalReach: 2500000,
      socialROI: 3.2,
    },
    platformBreakdown: [
      {
        platform: 'Instagram',
        followers: 85000,
        posts: 280,
        engagementRate: 0.042,
        reach: 1500000,
        conversions: 1240,
        revenue: 125000,
        growthRate: 0.18,
      },
      {
        platform: 'TikTok',
        followers: 40000,
        posts: 170,
        engagementRate: 0.065,
        reach: 1000000,
        conversions: 890,
        revenue: 78000,
        growthRate: 0.35,
      },
    ],
    topPerformingContent: [],
    viralTrends: [
      {
        id: 'trend_1',
        hashtag: '#AfricanFashionChallenge',
        platform: 'tiktok',
        volume: 125000,
        growth: 45,
        relevanceScore: 92,
        products: ['prod_1', 'prod_2'],
        opportunity: 'high',
      },
    ],
    influencerPerformance: [],
    ugcMetrics: {
      totalPosts: 1540,
      approvedPosts: 1298,
      averageRating: 4.6,
      sentimentBreakdown: { positive: 85, neutral: 12, negative: 3 },
      topProducts: [
        { productId: 'prod_1', posts: 340, avgRating: 4.8 },
        { productId: 'prod_2', posts: 280, avgRating: 4.5 },
      ],
    },
  };
}

function generateMockViralProducts(): ViralProduct[] {
  return [
    {
      productId: 'prod_1',
      viralScore: 92,
      socialMentions: 1540,
      hashtagReach: 125000,
      influencerMentions: 45,
      ugcPosts: 230,
      trendingPlatforms: ['tiktok', 'instagram'],
      viralityFactors: ['Trending hashtag', 'Influencer boost', 'User challenges'],
      projectedGrowth: 35,
    },
  ];
}

function generateMockSocialListening(): SocialListeningData {
  return {
    brandMentions: 1254,
    sentiment: 'positive',
    sentimentScore: 8.2,
    topHashtags: [
      { tag: '#BatoStyle', volume: 15420, sentiment: 'positive' },
      { tag: '#AfricanFashion', volume: 12650, sentiment: 'positive' },
    ],
    competitorComparison: [
      { competitor: 'Competitor A', mentions: 890, sentiment: 7.1 },
    ],
    emergingTrends: [
      { trend: 'Sustainable Fashion', growth: 23, relevance: 85 },
    ],
    crisisAlerts: [],
  };
}