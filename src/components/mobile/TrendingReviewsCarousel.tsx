import { useState } from 'react';
import { motion } from 'motion/react';
import { BootstrapIcon } from '../BootstrapIcon';
import { Star } from 'lucide-react';

interface TrendingReview {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  snippet: string;
  helpful: number;
}

interface TrendingReviewsCarouselProps {
  reviews: TrendingReview[];
}

export function TrendingReviewsCarousel({ reviews }: TrendingReviewsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }).map((_, i) => (
      <Star
        key={i}
        className="h-3 w-3 fill-yellow-400 text-yellow-400"
      />
    ));
  };

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <BootstrapIcon name="fire" className="w-5 h-5 text-orange-500" />
          </motion.div>
          <h3 className="text-white font-heading text-base">Trending Reviews</h3>
        </div>
        <span className="text-white/60 font-body text-xs">
          {activeIndex + 1} / {reviews.length}
        </span>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-3 px-4"
          animate={{ x: `-${activeIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="min-w-full flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: index === activeIndex ? 1 : 0.5,
                scale: index === activeIndex ? 1 : 0.9
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="p-4 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(88, 37, 239, 0.2), rgba(110, 41, 246, 0.1))',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(88, 37, 239, 0.3)',
                  boxShadow: '0 8px 32px rgba(88, 37, 239, 0.2)'
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <motion.img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full object-cover"
                    style={{
                      border: '2px solid rgba(88, 37, 239, 0.5)'
                    }}
                    whileHover={{ scale: 1.1 }}
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-heading text-sm mb-1">
                      {review.userName}
                    </h4>
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <motion.div
                    className="flex items-center gap-1 px-2 py-1 rounded-full"
                    style={{
                      background: 'rgba(88, 37, 239, 0.3)',
                      border: '1px solid rgba(88, 37, 239, 0.5)'
                    }}
                    animate={{
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <BootstrapIcon name="hand-thumbs-up-fill" className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-body">{review.helpful}</span>
                  </motion.div>
                </div>
                <p className="text-white/90 text-sm leading-relaxed font-body italic">
                  "{review.snippet}"
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-3">
          {reviews.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveIndex(index)}
              className="rounded-full transition-all"
              style={{
                width: index === activeIndex ? '20px' : '6px',
                height: '6px',
                background: index === activeIndex 
                  ? 'linear-gradient(90deg, #5825efff, #6e29f6)' 
                  : 'rgba(255,255,255,0.3)'
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
