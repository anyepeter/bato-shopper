import { motion } from 'motion/react';
import { BootstrapIcon } from '../BootstrapIcon';

interface ReviewSocialStatsProps {
  totalReviews: number;
  averageRating: number;
  verifiedPurchases: number;
}

export function ReviewSocialStats({ 
  totalReviews, 
  averageRating, 
  verifiedPurchases 
}: ReviewSocialStatsProps) {
  const stats = [
    {
      icon: 'star-fill',
      value: averageRating.toFixed(1),
      label: 'Rating',
      color: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.4)'
    },
    {
      icon: 'chat-left-text-fill',
      value: totalReviews,
      label: 'Reviews',
      color: '#5825efff',
      glow: 'rgba(88, 37, 239, 0.4)'
    },
    {
      icon: 'patch-check-fill',
      value: verifiedPurchases,
      label: 'Verified',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.4)'
    }
  ];

  return (
    <div className="flex justify-around py-4 px-2">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                boxShadow: `0 4px 12px ${stat.glow}`
              }}
              animate={{
                boxShadow: [
                  `0 4px 12px ${stat.glow}`,
                  `0 6px 20px ${stat.glow}`,
                  `0 4px 12px ${stat.glow}`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BootstrapIcon 
                name={stat.icon}
                className="w-6 h-6 text-white"
              />
            </motion.div>
            
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid ${stat.color}`
              }}
              animate={{
                scale: [1, 1.3],
                opacity: [0.6, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut'
              }}
            />
          </motion.div>

          <div className="text-center">
            <motion.div
              className="text-white font-heading text-xl"
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {stat.value}
            </motion.div>
            <div className="text-white/60 font-body text-xs">
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
