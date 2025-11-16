import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BootstrapIcon } from '../BootstrapIcon';
import { Star } from 'lucide-react';

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

interface SocialReviewCardProps {
  review: Review;
  index: number;
}

export function SocialReviewCard({ review, index }: SocialReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const reactions = ['❤️', '👏', '🔥', '✨', '💯'];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };

  const handleVoteHelpful = () => {
    if (!hasVoted) {
      setHasVoted(true);
    }
  };

  const handleReaction = (emoji: string) => {
    setSelectedReaction(emoji);
    setShowReactions(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="p-4 rounded-lg relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(88, 37, 239, 0.1), transparent)',
        }}
        whileHover={{ opacity: 1, x: ['0%', '100%'] }}
        transition={{ duration: 0.8 }}
      />

      {/* Review Header */}
      <div className="flex items-start gap-3 mb-3 relative z-10">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={review.userAvatar}
            alt={review.userName}
            className="w-12 h-12 rounded-full object-cover"
            style={{
              border: '2px solid rgba(88, 37, 239, 0.3)'
            }}
          />
          {review.verified && (
            <motion.div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: '2px solid #000'
              }}
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BootstrapIcon name="check" className="w-2.5 h-2.5 text-white" />
            </motion.div>
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-heading text-sm truncate">{review.userName}</h4>
            {review.verified && (
              <motion.span
                className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
                whileHover={{ scale: 1.05 }}
              >
                <BootstrapIcon name="patch-check-fill" className="w-2.5 h-2.5" />
                Verified
              </motion.span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="text-white/60 text-xs">
              {new Date(review.date).toLocaleDateString()}
            </span>
          </div>

          {(review.size || review.color) && (
            <div className="flex items-center gap-2 text-xs text-white/60">
              {review.size && (
                <span className="px-2 py-0.5 rounded-full bg-white/10">
                  Size: {review.size}
                </span>
              )}
              {review.color && (
                <span className="px-2 py-0.5 rounded-full bg-white/10">
                  Color: {review.color}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-3 relative z-10">
        <h5 className="text-white font-heading text-sm mb-2">{review.title}</h5>
        <motion.div
          animate={{ height: isExpanded ? 'auto' : '3.5rem' }}
          className="overflow-hidden"
        >
          <p className="text-white/80 text-sm leading-relaxed font-body">
            {review.content}
          </p>
        </motion.div>
        {review.content.length > 100 && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs mt-1 font-body"
            style={{ color: '#5825efff' }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </motion.button>
        )}
      </div>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto relative z-10 pb-2">
          {review.images.map((image, idx) => (
            <motion.img
              key={idx}
              src={image}
              alt={`Review image ${idx + 1}`}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              style={{
                border: '1px solid rgba(255,255,255,0.1)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>
      )}

      {/* Social Actions */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          {/* Helpful Button */}
          <motion.button
            onClick={handleVoteHelpful}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: hasVoted 
                ? 'linear-gradient(135deg, #5825efff, #6e29f6)' 
                : 'rgba(255,255,255,0.1)',
              border: `1px solid ${hasVoted ? 'rgba(88, 37, 239, 0.5)' : 'rgba(255,255,255,0.2)'}`,
              color: hasVoted ? '#fff' : 'rgba(255,255,255,0.7)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BootstrapIcon 
              name={hasVoted ? 'hand-thumbs-up-fill' : 'hand-thumbs-up'}
              className="w-3.5 h-3.5"
            />
            <span className="text-xs font-body">
              {hasVoted ? review.helpful + 1 : review.helpful}
            </span>
          </motion.button>

          {/* Reaction Button */}
          <div className="relative">
            <motion.button
              onClick={() => setShowReactions(!showReactions)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: selectedReaction 
                  ? 'rgba(88, 37, 239, 0.2)' 
                  : 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {selectedReaction ? (
                <span className="text-sm">{selectedReaction}</span>
              ) : (
                <BootstrapIcon name="emoji-smile" className="w-3.5 h-3.5 text-white/70" />
              )}
            </motion.button>

            {/* Reactions Popup */}
            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute bottom-full left-0 mb-2 p-2 rounded-lg backdrop-blur-md flex gap-1"
                  style={{
                    background: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  {reactions.map((emoji) => (
                    <motion.button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className="text-lg hover:scale-125 transition-transform"
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Share Button */}
          <motion.button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BootstrapIcon name="share" className="w-3.5 h-3.5 text-white/70" />
          </motion.button>
        </div>

        <span className="text-white/40 text-xs font-body">
          {review.helpful} of {review.totalVotes} helpful
        </span>
      </div>
    </motion.div>
  );
}
