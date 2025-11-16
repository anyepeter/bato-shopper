import { Review, ReviewAnalytics } from "../types";

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: 1,
    productId: 1,
    productName: "Ankara Print Maxi Dress",
    userId: 101,
    userName: "Amara Johnson",
    userLocation: "Lagos, Nigeria",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150",
    rating: 5,
    title: "Absolutely stunning quality!",
    content: "This dress exceeded all my expectations! The Ankara print is vibrant and the fabric quality is exceptional. I wore it to a wedding and received so many compliments. The fit is perfect and it's incredibly comfortable to wear all day. Definitely ordering more from this collection!",
    images: [
      "https://images.unsplash.com/photo-1560563304-b53853ba0449?w=500",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"
    ],
    videos: [],
    isVerifiedPurchase: true,
    helpfulVotes: 24,
    totalVotes: 27,
    status: "approved",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
    productVariant: {
      size: "M",
      color: "Orange"
    }
  },
  {
    id: 2,
    productId: 1,
    productName: "Ankara Print Maxi Dress",
    userId: 102,
    userName: "Kemi Adebayo",
    userLocation: "Accra, Ghana",
    userAvatar: "https://images.unsplash.com/photo-1516239482977-b550ba7253f2?w=150",
    rating: 4,
    title: "Beautiful dress, minor sizing issue",
    content: "The dress is absolutely beautiful and the colors are vibrant. However, I found it runs slightly small. I ordered a Large but probably should have gone with XL. The quality is great though and I love the design. Customer service was helpful when I reached out.",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500"
    ],
    videos: [],
    isVerifiedPurchase: true,
    helpfulVotes: 18,
    totalVotes: 21,
    status: "approved",
    createdAt: "2025-01-14T15:45:00Z",
    updatedAt: "2025-01-14T15:45:00Z",
    adminResponse: {
      id: 1,
      reviewId: 2,
      adminId: 999,
      adminName: "Modish Style Support",
      content: "Thank you for your feedback! We appreciate you mentioning the sizing. We're updating our size guide to help future customers. Please reach out if you'd like to exchange for a different size!",
      isPublic: true,
      createdAt: "2025-01-14T16:30:00Z"
    },
    productVariant: {
      size: "L",
      color: "Blue"
    }
  },
  {
    id: 3,
    productId: 2,
    productName: "Traditional Kente Top",
    userId: 103,
    userName: "Fatima Al-Hassan",
    userLocation: "Cairo, Egypt",
    userAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
    rating: 5,
    title: "Perfect for cultural events!",
    content: "I bought this for a cultural celebration and it was perfect! The Kente pattern is authentic and beautiful. The fabric is comfortable and breathable. I've worn it multiple times and it still looks brand new. Highly recommend!",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500"
    ],
    videos: [],
    isVerifiedPurchase: true,
    helpfulVotes: 31,
    totalVotes: 33,
    status: "approved",
    createdAt: "2025-01-13T09:20:00Z",
    updatedAt: "2025-01-13T09:20:00Z",
    productVariant: {
      size: "S",
      color: "Gold"
    }
  },
  {
    id: 4,
    productId: 3,
    productName: "Bogolan Mud Cloth Skirt",
    userId: 104,
    userName: "Aisha Mohammed",
    userLocation: "Nairobi, Kenya",
    userAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150",
    rating: 3,
    title: "Good quality but limited styling options",
    content: "The skirt is well-made and the mud cloth pattern is authentic. However, I found it a bit difficult to style with different tops. The length is good but the fit is quite specific. Overall decent quality for the price point.",
    images: [],
    videos: [],
    isVerifiedPurchase: true,
    helpfulVotes: 8,
    totalVotes: 15,
    status: "approved",
    createdAt: "2025-01-12T14:15:00Z",
    updatedAt: "2025-01-12T14:15:00Z",
    productVariant: {
      size: "M",
      color: "Brown"
    }
  },
  {
    id: 5,
    productId: 4,
    productName: "Adinkra Symbol Necklace",
    userId: 105,
    userName: "Zara Okonkwo",
    userLocation: "London, UK",
    userAvatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150",
    rating: 5,
    title: "Stunning craftsmanship!",
    content: "This necklace is absolutely gorgeous! The Adinkra symbols are beautifully crafted and have such deep meaning. I wear it almost daily and get compliments constantly. The chain is sturdy and the pendant is the perfect size. Will definitely be ordering more jewelry from this collection!",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500"
    ],
    videos: [],
    isVerifiedPurchase: true,
    helpfulVotes: 42,
    totalVotes: 45,
    status: "approved",
    createdAt: "2025-01-11T11:00:00Z",
    updatedAt: "2025-01-11T11:00:00Z",
    productVariant: {
      color: "Gold"
    }
  },
  {
    id: 6,
    productId: 1,
    productName: "Ankara Print Maxi Dress",
    userId: 106,
    userName: "Grace Mensah",
    userLocation: "Toronto, Canada",
    userAvatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=150",
    rating: 2,
    title: "Disappointed with fabric quality",
    content: "I was really excited about this dress but was disappointed when it arrived. The fabric feels thinner than expected and the print seems to be fading after just one wash. For the price point, I expected better quality. The design is beautiful but execution could be improved.",
    images: [],
    videos: [],
    isVerifiedPurchase: true,
    helpfulVotes: 12,
    totalVotes: 18,
    status: "pending",
    createdAt: "2025-01-10T16:30:00Z",
    updatedAt: "2025-01-10T16:30:00Z",
    productVariant: {
      size: "L",
      color: "Red"
    }
  }
];

export const SAMPLE_REVIEW_ANALYTICS: ReviewAnalytics = {
  totalReviews: 247,
  averageRating: 4.3,
  ratingDistribution: {
    5: 124,
    4: 78,
    3: 28,
    2: 12,
    1: 5
  },
  newReviewsToday: 8,
  pendingReviews: 15,
  verifiedPurchaseRate: 0.89,
  mediaUploadRate: 0.67,
  averageReviewLength: 156,
  topKeywords: [
    { keyword: "quality", count: 89, sentiment: "positive" },
    { keyword: "beautiful", count: 76, sentiment: "positive" },
    { keyword: "comfortable", count: 54, sentiment: "positive" },
    { keyword: "sizing", count: 43, sentiment: "neutral" },
    { keyword: "fabric", count: 38, sentiment: "positive" },
    { keyword: "authentic", count: 32, sentiment: "positive" },
    { keyword: "vibrant", count: 28, sentiment: "positive" },
    { keyword: "small", count: 21, sentiment: "negative" },
    { keyword: "expensive", count: 18, sentiment: "negative" },
    { keyword: "perfect", count: 67, sentiment: "positive" }
  ],
  ratingTrends: [
    { date: "2025-01-01", averageRating: 4.1, totalReviews: 12 },
    { date: "2025-01-02", averageRating: 4.2, totalReviews: 8 },
    { date: "2025-01-03", averageRating: 4.3, totalReviews: 15 },
    { date: "2025-01-04", averageRating: 4.4, totalReviews: 11 },
    { date: "2025-01-05", averageRating: 4.2, totalReviews: 9 },
    { date: "2025-01-06", averageRating: 4.5, totalReviews: 14 },
    { date: "2025-01-07", averageRating: 4.3, totalReviews: 13 }
  ]
};