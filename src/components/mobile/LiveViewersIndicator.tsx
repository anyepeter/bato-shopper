import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BootstrapIcon } from '../BootstrapIcon';

interface LiveViewersIndicatorProps {
  productId: number;
}

export function LiveViewersIndicator({ productId }: LiveViewersIndicatorProps) {
  const [viewerCount, setViewerCount] = useState(0);
  const [recentViewers, setRecentViewers] = useState<string[]>([]);

  useEffect(() => {
    // Generate initial viewer count based on product ID for consistency
    const baseCount = 15 + (productId % 30);
    setViewerCount(baseCount);

    // Simulate real-time viewer changes
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(5, prev + change);
      });
    }, 3000);

    // Generate recent viewer names
    const names = ['Amara', 'Kwame', 'Zuri', 'Kofi', 'Nia', 'Jabari', 'Aisha', 'Malik', 'Ife', 'Sekou'];
    setRecentViewers(names.slice(0, 3));

    return () => clearInterval(interval);
  }, [productId]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md"
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Viewer avatars */}
      <div className="flex -space-x-2">
        {recentViewers.map((name, index) => (
          <motion.div
            key={name}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold"
            style={{
              background: `linear-gradient(135deg, ${['#5825efff', '#ec4899', '#10b981'][index % 3]}, ${['#6e29f6', '#f43f5e', '#059669'][index % 3]})`,
              color: 'white'
            }}
          >
            {name.charAt(0)}
          </motion.div>
        ))}
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-1.5">
        <motion.div
          className="w-2 h-2 rounded-full bg-green-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <span className="text-white font-body text-xs font-medium">
          {viewerCount} viewing
        </span>
      </div>
    </motion.div>
  );
}
