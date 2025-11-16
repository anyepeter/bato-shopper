export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  videoUrl?: string;
  category: 'dresses' | 'tops' | 'accessories';
  rating: number;
  reviewCount: number;
  description: string;
  sizes: string[];
  colors: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  discount?: number;
  fabric: string;
  care: string;
  origin: string;
  fit: string;
  sku: string;
  stockCount: number;
  tags: string[];
  relatedProducts?: number[];
}

export interface Review {
  id: number;
  productId: number;
  productName: string;
  userId: number;
  userName: string;
  userLocation: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  videos: string[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  totalVotes: number;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  updatedAt: string;
  adminResponse?: {
    id: number;
    reviewId: number;
    adminId: number;
    adminName: string;
    content: string;
    isPublic: boolean;
    createdAt: string;
  };
  productVariant: {
    size?: string;
    color?: string;
  };
}

// Additional review-related interfaces
export interface ReviewFilters {
  rating?: number;
  hasMedia?: boolean;
  verifiedOnly?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface ReviewSortOptions {
  sortBy: 'newest' | 'oldest' | 'highest-rated' | 'lowest-rated' | 'most-helpful';
  order: 'asc' | 'desc';
}

export interface ReviewAnalytics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  newReviewsToday: number;
  pendingReviews: number;
  verifiedPurchaseRate: number;
  mediaUploadRate: number;
  averageReviewLength: number;
  topKeywords: Array<{
    keyword: string;
    count: number;
    sentiment: 'positive' | 'negative' | 'neutral';
  }>;
  ratingTrends: Array<{
    date: string;
    averageRating: number;
    totalReviews: number;
  }>;
}

export interface CartItem {
  id: number;
  product: Product;
  size: string;
  color: string;
  quantity: number;
  // Incentive discount information
  incentive?: {
    offerId: string;
    offerTitle: string;
    discountType: 'percentage' | 'fixed' | 'bogo' | 'free_shipping';
    discountValue: number; // percentage (e.g., 25 for 25%) or fixed amount
    originalPrice: number;
    discountedPrice: number;
    description: string;
  };
}

export interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  sizes: string[];
  colors: string[];
  badge?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  discount?: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
  preferences?: {
    newsletter: boolean;
    smsNotifications: boolean;
    salesAlerts: boolean;
  };
  addresses?: Address[];
  // User type - can be customer, vendor, or platform-admin
  userType?: 'customer' | 'vendor' | 'platform-admin';
  // Legacy admin flag (kept for backward compatibility)
  isAdmin?: boolean;
  // Vendor-specific fields
  isVendor?: boolean;
  vendorId?: string;
  shopName?: string;
  shopDescription?: string;
  vendorLevel?: string;
  // Platform admin specific fields
  isPlatformAdmin?: boolean;
  adminLevel?: string;
  department?: string;
  jobTitle?: string;
  companyName?: string;
  location?: string;
  bio?: string;
  emergencyContact?: string;
  supervisorEmail?: string;
}

export interface Address {
  id: number;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
  hasReacted: boolean;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
}

export type PageType = 
  | 'home' 
  | 'new-arrivals' 
  | 'dresses' 
  | 'tops' 
  | 'accessories' 
  | 'contact' 
  | 'shipping' 
  | 'returns' 
  | 'size-guide'
  | 'store-locator'
  | 'profile'
  | 'checkout'
  | 'favorites'
  | 'mobile-cart'
  | 'mobile-favorites'
  | 'sign-in'
  | 'create-account'
  | 'admin-dashboard'
  | 'admin-sign-in'
  | 'admin-create-account'
  | 'admin-profile'
  | 'vendor-dashboard'
  | 'vendor-sign-in' 
  | 'vendor-create-account'
  | 'vendor-profile'
  | 'platform-admin-dashboard'
  | 'platform-admin-sign-in'
  | 'platform-admin-create-account' 
  | 'platform-admin-profile'
  | 'reviews'
  | 'product-reviews'
  | 'product-details'
  | 'live-streams'
  | 'stream-viewer'
  | 'admin-streams'
  | 'framework-demo'
  | 'vendor-onboarding'
  | 'order-management'
  | 'vendor-orders'
  | 'payment-gateway'
  | 'inventory-management'
  | 'vendor-inventory'
  | 'logistics-dashboard'
  | 'partner-dashboard'
  | 'dispute-resolution'
  | 'customer-disputes'
  | 'vendor-disputes'
  | 'ai-intelligence'
  | 'social-commerce'
  | 'international-expansion'
  | 'logistics-sign-in'
  | 'logistics-create-account'
  | 'logistics-profile'
  | 'watch-live-stream'
  | 'share'
  | 'package-tracking'
  | 'orders'
  | 'order-details'
  | 'shop-categories';

export type AdminView = 
  | 'dashboard' 
  | 'products' 
  | 'users' 
  | 'analytics' 
  | 'reviews' 
  | 'settings' 
  | 'security' 
  | 'disputes' 
  | 'shipping' 
  | 'notifications' 
  | 'integrations';

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
}

export interface Stream {
  id: string;
  title: string;
  description: string;
  thumbnailImage: string;
  isLive: boolean;
  viewerCount: number;
  category: string;
  startTime: Date;
  duration?: number;
  streamerName: string;
  streamerAvatar: string;
  products: Product[];
  tags: string[];
  featured: boolean;
}

export interface StreamAnalytics {
  streamViews: number;
  averageWatchTime: number;
  productClickThrough: number;
  chatEngagement: number;
  conversionRate: number;
  topPerformingProducts: Product[];
}

// ===== COMPREHENSIVE FRAMEWORK TYPES =====

// 🏪 VENDOR SYSTEM
export interface VendorRegistration {
  businessName: string;
  businessType: 'individual' | 'small_business' | 'enterprise';
  taxId: string;
  businessLicense: string;
  ownerFirstName: string;
  ownerLastName: string;
  email: string;
  phone: string;
  address: BusinessAddress;
  bankDetails: BankDetails;
  productCategories: string[];
  businessDescription: string;
  website?: string;
  socialMedia?: SocialMedia;
  subscriptionTier: 'basic' | 'professional' | 'enterprise';
}

export interface BusinessAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
}

export interface VendorProfile extends VendorRegistration {
  id: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  verificationLevel: 'unverified' | 'basic' | 'verified' | 'premium';
  qualityScore: number;
  performanceMetrics: VendorMetrics;
  subscriptionDetails: SubscriptionDetails;
  privileges: VendorPrivileges;
  createdAt: Date;
  lastActive: Date;
}

export interface VendorMetrics {
  totalSales: number;
  orderCount: number;
  averageRating: number;
  onTimeDeliveryRate: number;
  returnRate: number;
  responseTime: number;
  customerSatisfactionScore: number;
}

export interface SubscriptionDetails {
  plan: 'basic' | 'professional' | 'enterprise';
  monthlyFee: number;
  listingLimit: number;
  commissionRate: number;
  features: string[];
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: Date;
}

export interface VendorPrivileges {
  featuredListings: boolean;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
  bulkUploadTools: boolean;
  customStorefront: boolean;
  marketingTools: boolean;
  reducedCommissions: boolean;
}

// 📦 ORDER MANAGEMENT SYSTEM
export interface Order {
  id: string;
  customerId: string;
  customerDetails: CustomerInfo;
  items: OrderItem[];
  vendorOrders: VendorOrder[];
  totalAmount: number;
  tax: number;
  shippingCost: number;
  discount?: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentInfo;
  trackingNumbers: TrackingInfo[];
  estimatedDelivery: Date;
  actualDelivery?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  vendorId: string;
  productName: string;
  productImage: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  size?: string;
  color?: string;
  customizations?: Record<string, any>;
}

export interface VendorOrder {
  vendorId: string;
  vendorName: string;
  items: OrderItem[];
  subtotal: number;
  vendorCommission: number;
  platformCommission: number;
  status: OrderStatus;
  fulfillmentCenter?: string;
  shippingMethod: string;
  trackingNumber?: string;
}

export interface CustomerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PaymentInfo {
  method: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer';
  last4?: string;
  brand?: string;
  transactionId: string;
}

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  vendorId: string;
  status: ShippingStatus;
  estimatedDelivery: Date;
  trackingUrl: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'returned' 
  | 'refunded';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'refunded' 
  | 'partially_refunded';

export type ShippingStatus = 
  | 'label_created' 
  | 'picked_up' 
  | 'in_transit' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'exception' 
  | 'returned';

// 💰 FINANCIAL SYSTEM
export interface Commission {
  orderId: string;
  vendorId: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
  platformFee: number;
  vendorPayout: number;
  processingFee: number;
  status: 'pending' | 'processed' | 'paid' | 'disputed';
  payoutDate?: Date;
}

export interface VendorPayout {
  id: string;
  vendorId: string;
  period: { from: Date; to: Date };
  totalSales: number;
  totalCommissions: number;
  processingFees: number;
  netPayout: number;
  orders: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: string;
  processedAt?: Date;
}

// 📊 INVENTORY MANAGEMENT
export interface InventoryItem {
  id: string;
  productId: string;
  vendorId: string;
  sku: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderPoint: number;
  maxStockLevel: number;
  costPrice: number;
  lastUpdated: Date;
  location?: string;
  supplier?: SupplierInfo;
}

export interface SupplierInfo {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  leadTime: number;
  minimumOrderQuantity: number;
}

export interface StockAlert {
  id: string;
  productId: string;
  vendorId: string;
  type: 'low_stock' | 'out_of_stock' | 'overstock';
  currentLevel: number;
  threshold: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  resolvedAt?: Date;
}

// 🚚 LOGISTICS & SHIPPING
export interface ShippingCarrier {
  id: string;
  name: string;
  code: string;
  serviceTypes: ShippingService[];
  trackingUrl: string;
  apiCredentials?: Record<string, any>;
  isActive: boolean;
}

export interface ShippingService {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  maxWeight: number;
  maxDimensions: Dimensions;
  baseRate: number;
  rateStructure: 'flat' | 'weight_based' | 'zone_based';
  features: string[];
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'in' | 'cm';
}

export interface ShippingQuote {
  carrierId: string;
  serviceId: string;
  cost: number;
  estimatedDelivery: Date;
  transitTime: string;
}

// ⚖️ DISPUTE RESOLUTION
export interface Dispute {
  id: string;
  orderId: string;
  customerId: string;
  vendorId: string;
  type: DisputeType;
  subject: string;
  description: string;
  status: DisputeStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: DisputeCategory;
  evidence: Evidence[];
  timeline: DisputeEvent[];
  assignedMediator?: string;
  resolution?: DisputeResolution;
  createdAt: Date;
  resolvedAt?: Date;
}

export type DisputeType = 
  | 'product_quality' 
  | 'shipping_delay' 
  | 'incorrect_item' 
  | 'damaged_goods' 
  | 'not_received' 
  | 'return_refund' 
  | 'billing_issue' 
  | 'policy_violation';

export type DisputeStatus = 
  | 'open' 
  | 'investigation' 
  | 'mediation' 
  | 'resolution_pending' 
  | 'resolved' 
  | 'escalated' 
  | 'closed';

export type DisputeCategory = 
  | 'order_issues' 
  | 'payment_disputes' 
  | 'policy_violations' 
  | 'technical_issues' 
  | 'safety_concerns';

export interface Evidence {
  id: string;
  type: 'image' | 'document' | 'video' | 'text';
  url?: string;
  content?: string;
  description: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface DisputeEvent {
  id: string;
  action: string;
  description: string;
  performedBy: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface DisputeResolution {
  type: 'refund' | 'replacement' | 'credit' | 'policy_change' | 'no_action';
  amount?: number;
  description: string;
  actionItems: string[];
  followUpRequired: boolean;
  resolvedBy: string;
  approvedBy?: string;
}

// 📈 ANALYTICS & BUSINESS INTELLIGENCE
export interface SalesAnalytics {
  period: { from: Date; to: Date };
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: ProductPerformance[];
  topVendors: VendorPerformance[];
  revenueByCategory: CategoryRevenue[];
  salesTrends: TrendData[];
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  salesVolume: number;
  revenue: number;
  viewsToSales: number;
  returnRate: number;
  averageRating: number;
}

export interface VendorPerformance {
  vendorId: string;
  vendorName: string;
  totalSales: number;
  orderCount: number;
  averageRating: number;
  onTimeDelivery: number;
  customerSatisfaction: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  orderCount: number;
  growthRate: number;
}

export interface TrendData {
  date: Date;
  revenue: number;
  orders: number;
  visitors: number;
  conversionRate: number;
}

// 🔔 NOTIFICATION SYSTEM
export interface Notification {
  id: string;
  userId: string;
  userType: 'customer' | 'vendor' | 'admin';
  type: NotificationType;
  channel: NotificationChannel[];
  title: string;
  message: string;
  data?: Record<string, any>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  scheduledAt?: Date;
  sentAt?: Date;
  readAt?: Date;
  createdAt: Date;
}

export type NotificationType = 
  | 'order_confirmation' 
  | 'shipping_update' 
  | 'delivery_notification' 
  | 'payment_receipt' 
  | 'low_stock_alert' 
  | 'new_review' 
  | 'promotion' 
  | 'system_update' 
  | 'security_alert';

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

// 🛡️ COMPLIANCE & GOVERNANCE
export interface ComplianceRecord {
  id: string;
  type: 'data_protection' | 'financial' | 'product_safety' | 'tax' | 'trade';
  regulation: string;
  status: 'compliant' | 'non_compliant' | 'under_review' | 'pending';
  lastAuditDate: Date;
  nextAuditDate: Date;
  findings: ComplianceFinding[];
  actions: ComplianceAction[];
  responsibleParty: string;
}

export interface ComplianceFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  regulation: string;
  discoveredAt: Date;
  status: 'open' | 'in_progress' | 'resolved';
}

export interface ComplianceAction {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  completedAt?: Date;
}

// 🎯 QUALITY ASSURANCE
export interface QualityStandard {
  id: string;
  category: string;
  name: string;
  description: string;
  requirements: QualityRequirement[];
  minimumScore: number;
  isActive: boolean;
}

export interface QualityRequirement {
  id: string;
  name: string;
  description: string;
  weight: number;
  passingCriteria: string;
  testMethod: string;
}

export interface QualityAssessment {
  id: string;
  productId: string;
  vendorId: string;
  standardId: string;
  overallScore: number;
  requirements: RequirementResult[];
  status: 'passed' | 'failed' | 'needs_improvement';
  assessor: string;
  assessmentDate: Date;
  notes?: string;
}

export interface RequirementResult {
  requirementId: string;
  score: number;
  passed: boolean;
  notes?: string;
  evidence?: string[];
}

// AI & Recommendation Types
export interface RecommendationResult {
  id: string;
  product: Product;
  score: number;
  confidence: number;
  reason: string;
  modelUsed: string;
  context: Record<string, any>;
  generatedAt: Date;
  metrics: {
    relevanceScore: number;
    diversityScore: number;
    noveltyScore: number;
    businessValue: number;
  };
}

export interface RecommendationModel {
  id: string;
  name: string;
  type: 'collaborative_filtering' | 'content_based' | 'matrix_factorization' | 'deep_learning' | 'hybrid';
  accuracy: number;
  trainingData: number;
  lastTrained: Date;
  parameters: ModelParameters;
  isActive: boolean;
  performance: ModelPerformance;
}

export interface ModelParameters {
  learningRate: number;
  regularization: number;
  embeddingDimensions: number;
  epochs: number;
  batchSize: number;
  dropoutRate: number;
}

export interface ModelPerformance {
  precision: number;
  recall: number;
  f1Score: number;
  clickThroughRate: number;
  conversionRate: number;
  diversity: number;
  novelty: number;
  coverage: number;
}

export interface UserBehavior {
  id: string;
  userId: string;
  action: 'view' | 'click' | 'add_to_cart' | 'purchase' | 'like' | 'share' | 'search';
  productId?: string;
  timestamp: Date;
  sessionId: string;
  metadata?: Record<string, any>;
}

// Social Commerce Types
export interface SocialPost {
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

export interface InfluencerCampaign {
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
  };
  products: string[];
  campaign: {
    type: 'sponsored_post' | 'story' | 'reel' | 'live_stream' | 'giveaway';
    deliverables: string[];
    timeline: {
      start: Date;
      end: Date;
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