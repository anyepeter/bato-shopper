import { motion } from "motion/react";
import { Star } from "lucide-react";
import { Progress } from "../ui/progress";
import { ReviewAnalytics } from "../../types";
import { renderStars } from "../../utils/reviewHelpers";

interface ReviewSummaryProps {
  analytics: ReviewAnalytics;
}

export function ReviewSummary({ analytics }: ReviewSummaryProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 mb-8"
      style={{ 
        borderRadius: '3px',
        boxShadow: 'var(--shadow-standard-desktop)'
      }}
    >
      <div className="grid md:grid-cols-3 gap-8">
        {/* Average Rating */}
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <div className="text-6xl font-bold mb-2" style={{ color: '#5825efff' }}>
              {analytics.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center gap-1 mb-2">
              {renderStars(Math.round(analytics.averageRating)).map((star) => (
                <Star key={star.id} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 font-body">
              Based on {analytics.totalReviews} reviews
            </p>
          </motion.div>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-2">
          <h3 className="font-heading text-lg mb-4">Rating Breakdown</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <motion.div
                key={rating}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (6 - rating) }}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium font-body">{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div 
                    className="h-2 overflow-hidden"
                    style={{ 
                      backgroundColor: '#f3f4f6', 
                      borderRadius: '3px' 
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(analytics.ratingDistribution[rating as keyof typeof analytics.ratingDistribution] / analytics.totalReviews) * 100}%` 
                      }}
                      transition={{ delay: 0.3 + (0.1 * (6 - rating)), duration: 0.8 }}
                      className="h-full"
                      style={{ 
                        background: 'linear-gradient(135deg, #5825efff, #5825efff)',
                        borderRadius: '3px'
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-12 font-body">
                  {analytics.ratingDistribution[rating as keyof typeof analytics.ratingDistribution]}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}