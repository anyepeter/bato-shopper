import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, ThumbsUp, ThumbsDown, Flag, Share2, Heart, ShoppingCart, Filter, SortAsc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types';

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

interface ProductReviewsPageProps {
  product?: Product | null;
  onNavigateBack: () => void;
  onToggleFavorite?: (product: Product) => void;
  isFavorite?: (productId: number) => boolean;
  onAddToCart?: (product: Product, size: string, color: string) => void;
}

export function ProductReviewsPage({
  product,
  onNavigateBack,
  onToggleFavorite,
  isFavorite,
  onAddToCart
}: ProductReviewsPageProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock reviews data
  const mockReviews: Review[] = [
    {
      id: 1,
      userId: 1,
      userName: 'Sarah Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      rating: 5,
      title: 'Absolutely love this piece!',
      content: 'The quality is exceptional and the fit is perfect. The colors are vibrant and exactly as shown. I\'ve received so many compliments wearing this!',
      date: '2024-01-15',
      verified: true,
      helpful: 12,
      totalVotes: 15,
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
      content: 'Beautiful design and excellent craftsmanship. However, I would recommend ordering one size up as it runs small. The material is high quality and feels durable.',
      date: '2024-01-10',
      verified: true,
      helpful: 8,
      totalVotes: 10,
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
      content: 'Wore this to a wedding and felt absolutely stunning. The fabric drapes beautifully and the African-inspired print is authentic and gorgeous.',
      date: '2024-01-05',
      verified: true,
      helpful: 15,
      totalVotes: 16,
      images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'],
      size: 'S',
      color: 'Multi'
    }
  ];

  // Filter reviews by rating
  const filteredReviews = selectedRating 
    ? mockReviews.filter(review => review.rating === selectedRating)
    : mockReviews;

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

  const renderStars = (rating: number, size: string = 'h-4 w-4') => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${size} ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const calculateRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    mockReviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = calculateRatingDistribution();
  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center justify-between p-4"
          style={{ 
            background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
            paddingTop: '60px'
          }}
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onNavigateBack}
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </motion.button>

          <div className="text-center">
            <h1 className="text-white text-lg font-heading">Product Reviews</h1>
            <p className="text-white/70 text-sm font-body">{mockReviews.length} reviews</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <Filter className="h-5 w-5 text-white" />
          </motion.button>
        </motion.div>

        {/* Product Summary */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 py-3"
        >
          <div 
            className="flex gap-3 p-3 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-white font-heading text-sm mb-1">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{renderStars(averageRating)}</div>
                <span className="text-white/70 text-xs">
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

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-3"
            >
              <div className="flex gap-2 overflow-x-auto">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <motion.button
                    key={rating}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                    className="px-3 py-2 rounded-lg whitespace-nowrap text-xs"
                    style={{
                      backgroundColor: selectedRating === rating ? 'var(--primary-blue)' : 'rgba(255,255,255,0.1)',
                      color: selectedRating === rating ? 'white' : 'rgba(255,255,255,0.8)',
                      border: selectedRating === rating ? 'none' : '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{rating}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto pb-20" style={{ paddingTop: '10px' }}>
          <AnimatePresence mode="popLayout">
            {sortedReviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-96 px-6"
              >
                <Star className="h-20 w-20 text-white/30 mb-6" />
                <h3 className="text-white text-xl font-heading mb-2">No reviews found</h3>
                <p className="text-white/70 text-center font-body mb-6">
                  No reviews match your current filter. Try adjusting your selection.
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedRating(null)}
                  className="btn-moema btn-moema-primary"
                  style={{
                    backgroundColor: 'var(--primary-blue)',
                    color: 'white',
                    borderRadius: '25px',
                    padding: '15px 30px'
                  }}
                >
                  Show All Reviews
                </motion.button>
              </motion.div>
            ) : (
              <div className="space-y-4 px-4">
                {sortedReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    {/* Review Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-heading text-sm">{review.userName}</h4>
                          {review.verified && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">{renderStars(review.rating, 'h-3 w-3')}</div>
                          <span className="text-white/60 text-xs">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        {(review.size || review.color) && (
                          <div className="flex items-center gap-2 text-xs text-white/60">
                            {review.size && <span>Size: {review.size}</span>}
                            {review.color && <span>Color: {review.color}</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="mb-3">
                      <h5 className="text-white font-heading text-sm mb-2">{review.title}</h5>
                      <p className="text-white/80 text-sm leading-relaxed">{review.content}</p>
                    </div>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-3 overflow-x-auto">
                        {review.images.map((image, idx) => (
                          <img
                            key={idx}
                            src={image}
                            alt={`Review image ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        ))}
                      </div>
                    )}

                    {/* Review Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-white/60 text-xs">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{review.helpful}</span>
                        </button>
                        <button className="flex items-center gap-1 text-white/60 text-xs">
                          <Flag className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-white/40 text-xs">
                        {review.helpful} of {review.totalVotes} found helpful
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-20 right-4 flex flex-col gap-2">
          {onToggleFavorite && (
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => onToggleFavorite(product)}
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            >
              <Heart 
                className={`h-6 w-6 ${isFavorite?.(product.id) ? 'fill-red-400 text-red-400' : 'text-white'}`} 
              />
            </motion.button>
          )}
          
          {onAddToCart && (
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => onAddToCart(product, product.sizes?.[0] || '', product.colors?.[0] || '')}
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--primary-blue)' }}
            >
              <ShoppingCart className="h-6 w-6 text-white" />
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--light-gray)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-body">Back to Product</span>
          </button>
          
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg font-body text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Summary & Rating Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
              <div className="flex gap-4 mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="font-heading text-lg mb-2">{product.name}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{renderStars(averageRating)}</div>
                    <span className="text-gray-600 text-sm">
                      {averageRating.toFixed(1)} out of 5
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{mockReviews.length} reviews</p>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-8">{rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 rounded-full h-2"
                        style={{
                          width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / mockReviews.length) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {ratingDistribution[rating as keyof typeof ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Filters */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-heading text-lg mb-4">Filter by Rating</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedRating(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedRating === null ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  All Reviews ({mockReviews.length})
                </button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      selectedRating === rating ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{rating} Stars ({ratingDistribution[rating as keyof typeof ratingDistribution]})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Reviews List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {sortedReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-heading text-base">{review.userName}</h4>
                          {review.verified && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-gray-600 text-sm">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        {(review.size || review.color) && (
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {review.size && <span>Size: {review.size}</span>}
                            {review.color && <span>Color: {review.color}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <h5 className="font-heading text-lg mb-2">{review.title}</h5>
                    <p className="text-gray-700 leading-relaxed">{review.content}</p>
                  </div>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-3 mb-4">
                      {review.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Review image ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {/* Review Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <ThumbsUp className="h-4 w-4" />
                        <span className="text-sm">Helpful ({review.helpful})</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Flag className="h-4 w-4" />
                        <span className="text-sm">Report</span>
                      </button>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {review.helpful} of {review.totalVotes} found this helpful
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}