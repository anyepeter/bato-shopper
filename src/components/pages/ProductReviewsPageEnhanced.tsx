import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Filter, Heart, ShoppingCart, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types';
import { BootstrapIcon } from '../BootstrapIcon';

// Import social components
import { ReviewActivityFeed } from '../mobile/ReviewActivityFeed';
import { ReviewSocialStats } from '../mobile/ReviewSocialStats';
import { SocialReviewCard } from '../mobile/SocialReviewCard';
import { TrendingReviewsCarousel } from '../mobile/TrendingReviewsCarousel';

// Import social reviews styles
import '../../styles/mobile-reviews-social.css';

interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  totalVotes: number;
  images?: string[];
  size?: string;
  color?: string;
}

interface ProductReviewsPageEnhancedProps {
  product?: Product | null;
  onNavigateBack: () => void;
  onToggleFavorite?: (product: Product) => void;
  isFavorite?: (productId: number) => boolean;
  onAddToCart?: (product: Product, size: string, color: string) => void;
}

export function ProductReviewsPageEnhanced({
  product,
  onNavigateBack,
  onToggleFavorite,
  isFavorite,
  onAddToCart
}: ProductReviewsPageEnhancedProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Enhanced mock reviews data with more social elements
  const mockReviews: Review[] = [
    {
      id: 1,
      userId: 1,
      userName: 'Sarah Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      rating: 5,
      title: 'Absolutely love this piece!',
      content: 'The quality is exceptional and the fit is perfect. The colors are vibrant and exactly as shown. I\'ve received so many compliments wearing this! Highly recommend for anyone looking for authentic African fashion.',
      date: '2024-01-15',
      verified: true,
      helpful: 24,
      totalVotes: 28,
      images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'],
      size: 'M',
      color: 'Blue'
    },
    {
      id: 2,
      userId: 2,
      userName: 'Michelle Chen',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      rating: 4,
      title: 'Great quality, runs a bit small',
      content: 'Beautiful design and excellent craftsmanship. However, I would recommend ordering one size up as it runs small. The material is high quality and feels durable. Perfect for both casual and formal occasions.',
      date: '2024-01-10',
      verified: true,
      helpful: 18,
      totalVotes: 22,
      size: 'L',
      color: 'Red'
    },
    {
      id: 3,
      userId: 3,
      userName: 'Aisha Mohammed',
      userAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
      rating: 5,
      title: 'Perfect for special occasions',
      content: 'Wore this to a wedding and felt absolutely stunning. The fabric drapes beautifully and the African-inspired print is authentic and gorgeous. Everyone asked where I got it from!',
      date: '2024-01-05',
      verified: true,
      helpful: 32,
      totalVotes: 35,
      images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'],
      size: 'S',
      color: 'Multi'
    },
    {
      id: 4,
      userId: 4,
      userName: 'Kwame Osei',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 5,
      title: 'Outstanding craftsmanship',
      content: 'The attention to detail is remarkable. You can tell this was made with care and expertise. The stitching is perfect and the fabric feels premium.',
      date: '2024-01-03',
      verified: true,
      helpful: 15,
      totalVotes: 18,
      size: 'XL',
      color: 'Black'
    },
    {
      id: 5,
      userId: 5,
      userName: 'Zuri Anderson',
      userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      rating: 5,
      title: 'Worth every penny!',
      content: 'I was hesitant about the price at first, but this exceeded all my expectations. The quality justifies the cost completely. Will definitely buy more from this brand.',
      date: '2024-01-01',
      verified: true,
      helpful: 28,
      totalVotes: 30,
      images: ['https://images.unsplash.com/photo-1594736797933-d0a9ba54d9f3?w=400'],
      size: 'M',
      color: 'Red'
    }
  ];

  // Filter reviews
  let filteredReviews = mockReviews;
  
  if (selectedRating) {
    filteredReviews = filteredReviews.filter(review => review.rating === selectedRating);
  }
  
  if (searchQuery) {
    filteredReviews = filteredReviews.filter(review => 
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;
  const verifiedCount = mockReviews.filter(r => r.verified).length;

  // Trending reviews for carousel
  const trendingReviews = [...mockReviews]
    .sort((a, b) => b.helpful - a.helpful)
    .slice(0, 3)
    .map(review => ({
      id: review.id,
      userName: review.userName,
      userAvatar: review.userAvatar,
      rating: review.rating,
      snippet: review.title,
      helpful: review.helpful
    }));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isMobile ? '#000000' : 'var(--light-gray)' }}>
        <div className="text-center">
          <p className={`${isMobile ? 'text-white' : 'text-gray-600'} font-body mb-4`}>
            No product selected for reviews
          </p>
          <button
            onClick={onNavigateBack}
            className="btn-moema btn-moema-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div 
        className="fixed inset-0 z-50 overflow-hidden"
        style={{ 
          backgroundColor: '#000000',
          fontFamily: 'var(--font-body)'
        }}
      >
        {/* Real-time Activity Feed */}
        <ReviewActivityFeed productName={product.name} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center justify-between p-4"
          style={{ 
            background: 'linear-gradient(180deg, #5825efff 0%, #6e29f6 100%)',
            paddingTop: '60px',
            boxShadow: '0 4px 20px rgba(88, 37, 239, 0.3)'
          }}
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onNavigateBack}
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </motion.button>

          <div className="text-center flex-1">
            <h1 className="text-white text-lg font-heading">Community Reviews</h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <BootstrapIcon name="people-fill" className="w-3.5 h-3.5 text-white/80" />
              <p className="text-white/80 text-xs font-body">
                {mockReviews.length} people shared their experience
              </p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ 
              backgroundColor: showFilters ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Filter className="h-5 w-5 text-white" />
          </motion.button>
        </motion.div>

        {/* Social Stats */}
        <ReviewSocialStats 
          totalReviews={mockReviews.length}
          averageRating={averageRating}
          verifiedPurchases={verifiedCount}
        />

        {/* Product Quick Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 py-3"
        >
          <div 
            className="flex gap-3 p-3 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(88, 37, 239, 0.15) 0%, rgba(110, 41, 246, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(88, 37, 239, 0.3)',
              borderRadius: '8px'
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-20 object-cover rounded-lg"
              style={{ borderRadius: '8px' }}
            />
            <div className="flex-1">
              <h3 className="text-white font-heading text-sm mb-1">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                    />
                  ))}
                </div>
                <span className="text-white/70 text-xs font-body">
                  {averageRating.toFixed(1)} ({mockReviews.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-heading text-lg">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-white/60 text-sm line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trending Reviews Carousel */}
        <TrendingReviewsCarousel reviews={trendingReviews} />

        {/* Search Bar */}
        <div className="px-4 py-3">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews..."
              className="w-full py-3 px-4 pr-10 rounded-lg text-white font-body text-sm placeholder-white/50"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px'
              }}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
          </motion.div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-3"
            >
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedRating(null)}
                  className="px-3 py-2 rounded-lg text-xs font-body"
                  style={{
                    backgroundColor: selectedRating === null ? '#5825efff' : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: selectedRating === null ? 'none' : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                >
                  All
                </motion.button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <motion.button
                    key={rating}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                    className="px-3 py-2 rounded-lg whitespace-nowrap text-xs font-body flex items-center gap-1"
                    style={{
                      backgroundColor: selectedRating === rating ? '#5825efff' : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      border: selectedRating === rating ? 'none' : '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                  >
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{rating}</span>
                  </motion.button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="mt-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-white font-body text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                >
                  <option value="newest" className="bg-gray-900">Newest First</option>
                  <option value="helpful" className="bg-gray-900">Most Helpful</option>
                  <option value="highest" className="bg-gray-900">Highest Rating</option>
                  <option value="lowest" className="bg-gray-900">Lowest Rating</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto" style={{ paddingTop: '10px', paddingBottom: '80px' }}>
          <AnimatePresence mode="popLayout">
            {sortedReviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-96 px-6"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BootstrapIcon name="search" className="w-20 h-20 text-white/30 mb-6" />
                </motion.div>
                <h3 className="text-white text-xl font-heading mb-2">No reviews found</h3>
                <p className="text-white/70 text-center font-body mb-6">
                  Try adjusting your search or filters
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedRating(null);
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 rounded-lg font-body"
                  style={{
                    backgroundColor: '#5825efff',
                    color: 'white',
                    borderRadius: '8px'
                  }}
                >
                  Show All Reviews
                </motion.button>
              </motion.div>
            ) : (
              <div className="space-y-4 px-4">
                {sortedReviews.map((review, index) => (
                  <SocialReviewCard 
                    key={review.id}
                    review={review}
                    index={index}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-24 right-4 flex flex-col gap-3 z-50">
          {onToggleFavorite && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onToggleFavorite(product)}
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ 
                background: isFavorite?.(product.id)
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
            >
              <Heart 
                className={`h-6 w-6 ${isFavorite?.(product.id) ? 'fill-white text-white' : 'text-white'}`} 
              />
            </motion.button>
          )}
          
          {onAddToCart && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onAddToCart(product, product.sizes?.[0] || '', product.colors?.[0] || '')}
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ 
                background: 'linear-gradient(135deg, #5825efff, #6e29f6)',
                boxShadow: '0 4px 20px rgba(88, 37, 239, 0.4)'
              }}
            >
              <ShoppingCart className="h-6 w-6 text-white" />
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  // Desktop view remains the same
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--light-gray)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-body">Back to Product</span>
          </button>
        </div>
        
        <div className="text-center py-20">
          <h2 className="text-2xl font-heading mb-4">Desktop version coming soon</h2>
          <p className="text-gray-600 font-body">
            Please view this page on mobile for the full social experience
          </p>
        </div>
      </div>
    </div>
  );
}
