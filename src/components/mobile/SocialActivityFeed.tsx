import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BootstrapIcon } from '../BootstrapIcon';
import { Product } from '../../types';

interface SocialActivity {
  id: string;
  type: 'purchase' | 'review' | 'favorite' | 'viewing' | 'live';
  userName: string;
  userAvatar?: string;
  productName: string;
  timestamp: Date;
  rating?: number;
  message?: string;
}

interface SocialActivityFeedProps {
  product: Product;
  position?: 'top' | 'bottom';
}

export function SocialActivityFeed({ product, position = 'top' }: SocialActivityFeedProps) {
  const [activities, setActivities] = useState<SocialActivity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<SocialActivity | null>(null);

  // Generate realistic social activities
  useEffect(() => {
    const names = ['Amara', 'Kwame', 'Zuri', 'Kofi', 'Nia', 'Jabari', 'Aisha', 'Malik'];
    const actions = [
      { type: 'purchase' as const, message: 'just purchased this' },
      { type: 'favorite' as const, message: 'added to favorites' },
      { type: 'review' as const, message: 'left a 5-star review', rating: 5 },
      { type: 'viewing' as const, message: 'is viewing this' },
    ];

    const generateActivity = (): SocialActivity => {
      const name = names[Math.floor(Math.random() * names.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      return {
        id: `${Date.now()}-${Math.random()}`,
        type: action.type,
        userName: name,
        productName: product.name,
        timestamp: new Date(),
        rating: action.rating,
        message: action.message
      };
    };

    // Initial activities
    const initial = Array.from({ length: 3 }, generateActivity);
    setActivities(initial);

    // Add new activities every 5-8 seconds
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev].slice(0, 5));
      setCurrentActivity(newActivity);
      
      // Clear current activity after 4 seconds
      setTimeout(() => setCurrentActivity(null), 4000);
    }, Math.random() * 3000 + 5000);

    return () => clearInterval(interval);
  }, [product]);

  const getActivityIcon = (type: SocialActivity['type']) => {
    switch (type) {
      case 'purchase': return 'bag-check-fill';
      case 'favorite': return 'heart-fill';
      case 'review': return 'star-fill';
      case 'viewing': return 'eye-fill';
      case 'live': return 'broadcast';
      default: return 'person-fill';
    }
  };

  const getActivityColor = (type: SocialActivity['type']) => {
    switch (type) {
      case 'purchase': return '#5825efff';
      case 'favorite': return '#ef4444';
      case 'review': return '#fbbf24';
      case 'viewing': return '#10b981';
      case 'live': return '#ec4899';
      default: return '#6b7280';
    }
  };

  return (
    <div 
      className="absolute left-0 right-0 z-20 pointer-events-none"
      style={{ 
        [position]: position === 'top' ? '80px' : '120px'
      }}
    >
      <AnimatePresence mode="wait">
        {currentActivity && (
          <motion.div
            key={currentActivity.id}
            initial={{ opacity: 0, y: position === 'top' ? -20 : 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? -20 : 20, scale: 0.8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mx-4 backdrop-blur-md rounded-lg p-3 pointer-events-auto"
            style={{
              background: 'rgba(0, 0, 0, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${getActivityColor(currentActivity.type)}, ${getActivityColor(currentActivity.type)}dd)`
                }}
              >
                <BootstrapIcon 
                  name={getActivityIcon(currentActivity.type)} 
                  className="w-5 h-5 text-white"
                />
              </div>

              {/* Activity Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-body text-sm">
                  <span className="font-bold">{currentActivity.userName}</span>
                  {' '}
                  <span className="text-white/80">{currentActivity.message}</span>
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

              {/* Time indicator */}
              <motion.div
                className="text-xs text-white/60 font-body"
                animate={{ opacity: [0.6, 1, 0.6] }}
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
