import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BootstrapIcon } from '../BootstrapIcon';

interface ReviewActivity {
  id: string;
  type: 'review' | 'helpful' | 'rating';
  userName: string;
  productName: string;
  rating?: number;
  timestamp: Date;
}

interface ReviewActivityFeedProps {
  productName: string;
}

export function ReviewActivityFeed({ productName }: ReviewActivityFeedProps) {
  const [currentActivity, setCurrentActivity] = useState<ReviewActivity | null>(null);

  useEffect(() => {
    const names = ['Amara', 'Kwame', 'Zuri', 'Kofi', 'Nia', 'Jabari', 'Aisha', 'Malik'];
    const activities: ReviewActivity['type'][] = ['review', 'helpful', 'rating'];

    const generateActivity = (): ReviewActivity => {
      const type = activities[Math.floor(Math.random() * activities.length)];
      const rating = type === 'rating' ? Math.floor(Math.random() * 2) + 4 : undefined;
      
      return {
        id: `${Date.now()}-${Math.random()}`,
        type,
        userName: names[Math.floor(Math.random() * names.length)],
        productName,
        rating,
        timestamp: new Date()
      };
    };

    // Show new activity every 6-10 seconds
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setCurrentActivity(newActivity);
      
      setTimeout(() => setCurrentActivity(null), 4000);
    }, Math.random() * 4000 + 6000);

    return () => clearInterval(interval);
  }, [productName]);

  const getActivityMessage = (activity: ReviewActivity) => {
    switch (activity.type) {
      case 'review':
        return `left a review`;
      case 'helpful':
        return `found a review helpful`;
      case 'rating':
        return `rated ${activity.rating} stars`;
      default:
        return '';
    }
  };

  const getActivityIcon = (type: ReviewActivity['type']) => {
    switch (type) {
      case 'review': return 'chat-left-text-fill';
      case 'helpful': return 'hand-thumbs-up-fill';
      case 'rating': return 'star-fill';
      default: return 'person-fill';
    }
  };

  return (
    <div 
      className="absolute top-20 left-0 right-0 z-30 pointer-events-none px-4"
      style={{ backgroundColor: 'transparent' }}
    >
      <AnimatePresence mode="wait">
        {currentActivity && (
          <motion.div
            key={currentActivity.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="backdrop-blur-md rounded-lg p-3 pointer-events-auto mx-auto max-w-sm"
            style={{
              background: 'rgba(88, 37, 239, 0.15)',
              border: '1px solid rgba(88, 37, 239, 0.3)',
              boxShadow: '0 8px 32px rgba(88, 37, 239, 0.2)'
            }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #5825efff, #6e29f6)'
                }}
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(88, 37, 239, 0.4)',
                    '0 0 0 8px rgba(88, 37, 239, 0)',
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <BootstrapIcon 
                  name={getActivityIcon(currentActivity.type)}
                  className="w-5 h-5 text-white"
                />
              </motion.div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-body text-sm">
                  <span className="font-bold">{currentActivity.userName}</span>
                  {' '}
                  <span className="text-white/90">{getActivityMessage(currentActivity)}</span>
                </p>
                {currentActivity.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: currentActivity.rating }).map((_, i) => (
                      <BootstrapIcon 
                        key={i}
                        name="star-fill"
                        className="w-3 h-3 text-yellow-400"
                      />
                    ))}
                  </div>
                )}
              </div>

              <motion.div
                className="text-xs text-white/70 font-body"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                now
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
