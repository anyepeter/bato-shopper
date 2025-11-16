import { motion } from 'motion/react';
import { BootstrapIcon } from '../BootstrapIcon';
import { Product } from '../../types';

interface SocialProofBadgesProps {
  product: Product;
}

export function SocialProofBadges({ product }: SocialProofBadgesProps) {
  // Calculate social proof metrics
  const purchaseCount = Math.floor(Math.random() * 500) + 100;
  const favoriteCount = Math.floor(Math.random() * 300) + 50;
  const trendingScore = product.rating >= 4.5 ? 'trending' : null;
  const recentPurchases = Math.floor(Math.random() * 20) + 5;

  const badges = [
    trendingScore && {
      icon: 'fire',
      text: 'Trending',
      color: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.4)'
    },
    purchaseCount > 200 && {
      icon: 'heart-fill',
      text: `${favoriteCount}+ favorites`,
      color: '#ec4899',
      glow: 'rgba(236, 72, 153, 0.4)'
    },
    {
      icon: 'bag-check-fill',
      text: `${recentPurchases} bought today`,
      color: '#5825efff',
      glow: 'rgba(88, 37, 239, 0.4)'
    },
    product.rating >= 4.7 && {
      icon: 'star-fill',
      text: 'Highly Rated',
      color: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.4)'
    }
  ].filter(Boolean);

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            border: `1px solid ${badge.color}33`,
            boxShadow: `0 4px 12px ${badge.glow}`
          }}
        >
          <BootstrapIcon 
            name={badge.icon} 
            className="w-3.5 h-3.5"
            style={{ color: badge.color }}
          />
          <span 
            className="text-xs font-body font-medium"
            style={{ color: badge.color }}
          >
            {badge.text}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
