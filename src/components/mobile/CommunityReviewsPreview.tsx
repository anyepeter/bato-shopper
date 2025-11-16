import { motion } from 'motion/react';
import { BootstrapIcon } from '../BootstrapIcon';
import { Product } from '../../types';

interface CommunityReviewsPreviewProps {
  product: Product;
  onViewAll?: () => void;
}

export function CommunityReviewsPreview({ product, onViewAll }: CommunityReviewsPreviewProps) {
  // Sample user reviews
  const topReviews = [
    {
      id: 1,
      userName: 'Amara K.',
      rating: 5,
      comment: 'Absolutely love this! The quality is amazing and fits perfectly.',
      verified: true,
      helpful: 24
    },
    {
      id: 2,
      userName: 'Kofi M.',
      rating: 5,
      comment: 'Beautiful design and great value. Highly recommend!',
      verified: true,
      helpful: 18
    },
    {
      id: 3,
      userName: 'Zuri A.',
      rating: 4,
      comment: 'Very nice! Runs a bit small, so size up.',
      verified: true,
      helpful: 12
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="backdrop-blur-md rounded-lg p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BootstrapIcon name="chat-quote-fill" className="w-5 h-5 text-[#5825efff]" />
          <h3 className="text-white font-body font-bold">Community Reviews</h3>
        </div>
        <motion.button
          onClick={onViewAll}
          className="text-[#5825efff] text-sm font-body font-medium"
          whileTap={{ scale: 0.95 }}
        >
          View All
        </motion.button>
      </div>

      {/* Rating Summary */}
      <div className="flex items-center gap-4 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-1">
          <span className="text-3xl font-bold text-white">{product.rating}</span>
          <BootstrapIcon name="star-fill" className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <BootstrapIcon
                key={i}
                name={i < Math.floor(product.rating) ? 'star-fill' : 'star'}
                className="w-4 h-4 text-yellow-400"
              />
            ))}
          </div>
          <p className="text-white/60 text-xs font-body">
            Based on {Math.floor(Math.random() * 500) + 100} reviews
          </p>
        </div>
      </div>

      {/* Top Reviews */}
      <div className="space-y-3">
        {topReviews.slice(0, 2).map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="p-3 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* User info */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #5825efff, #6e29f6)'
                  }}
                >
                  {review.userName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-white text-sm font-body font-medium">
                      {review.userName}
                    </span>
                    {review.verified && (
                      <BootstrapIcon 
                        name="patch-check-fill" 
                        className="w-3.5 h-3.5 text-green-500"
                        title="Verified Purchase"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <BootstrapIcon
                        key={i}
                        name="star-fill"
                        className="w-2.5 h-2.5 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Review text */}
            <p className="text-white/80 text-sm font-body mb-2 line-clamp-2">
              {review.comment}
            </p>

            {/* Helpful count */}
            <div className="flex items-center gap-1 text-white/60 text-xs font-body">
              <BootstrapIcon name="hand-thumbs-up" className="w-3 h-3" />
              <span>{review.helpful} found this helpful</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View more button */}
      <motion.button
        onClick={onViewAll}
        className="w-full mt-3 py-2 rounded-lg text-white font-body font-medium text-sm"
        style={{
          background: 'linear-gradient(135deg, #5825efff, #6e29f6)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Read All Reviews
      </motion.button>
    </motion.div>
  );
}
