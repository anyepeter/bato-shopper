import React from 'react';
import { motion } from 'motion/react';
import { Package, Ruler, DollarSign, Truck, Star, ShoppingBag } from 'lucide-react';

interface ProductQuestionMessageProps {
  message: {
    id: string;
    user: string;
    text: string;
    timestamp: string;
    productId?: string;
    productName?: string;
    productImage?: string;
    questionType?: string;
  };
  className?: string;
}

const QUESTION_TYPE_ICONS = {
  sizing: Ruler,
  materials: Package,
  pricing: DollarSign,
  shipping: Truck,
  availability: ShoppingBag,
  styling: Star
};

const QUESTION_TYPE_COLORS = {
  sizing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  materials: 'bg-green-500/20 text-green-400 border-green-500/30',
  pricing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  shipping: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  availability: 'bg-red-500/20 text-red-400 border-red-500/30',
  styling: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
};

export const ProductQuestionMessage: React.FC<ProductQuestionMessageProps> = ({
  message,
  className = ''
}) => {
  const IconComponent = message.questionType 
    ? QUESTION_TYPE_ICONS[message.questionType as keyof typeof QUESTION_TYPE_ICONS] 
    : Package;
  
  const colorClass = message.questionType 
    ? QUESTION_TYPE_COLORS[message.questionType as keyof typeof QUESTION_TYPE_COLORS]
    : 'bg-gray-500/20 text-gray-400 border-gray-500/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${className}`}
    >
      {/* Product Reference Header */}
      {message.productName && (
        <motion.div
          className="flex items-center gap-2 p-2 rounded-lg border"
          style={{ 
            background: 'rgba(88, 37, 239, 0.1)',
            borderColor: 'rgba(88, 37, 239, 0.3)'
          }}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {message.productImage && (
            <img 
              src={message.productImage} 
              alt={message.productName}
              className="w-6 h-6 object-cover rounded"
              style={{ borderRadius: '4px' }}
            />
          )}
          <span className="text-[#5825efff] font-body text-xs font-medium">
            📦 {message.productName}
          </span>
          {message.questionType && IconComponent && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${colorClass}`}>
              <IconComponent size={10} />
              <span className="capitalize">{message.questionType}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Message Content */}
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #5825efff, #8a5cf6)' }}
        >
          <span className="text-white font-bold text-xs">
            {message.user.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Message Bubble */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading font-medium text-white text-sm">
              {message.user}
            </span>
            <span className="text-white/40 font-body text-xs">
              {message.timestamp}
            </span>
          </div>
          
          <motion.div
            className="p-3 rounded-lg border border-white/10"
            style={{ 
              background: 'rgba(88, 37, 239, 0.05)',
              borderLeft: '3px solid #5825efff'
            }}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-white font-body text-sm leading-relaxed">
              {message.text}
            </p>
          </motion.div>

          {/* Question Type Badge */}
          {message.questionType && (
            <motion.div
              className="flex items-center gap-1 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${colorClass}`}>
                {IconComponent && <IconComponent size={10} />}
                <span className="capitalize">Product Question</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Interaction Suggestions */}
      <motion.div
        className="flex items-center gap-2 pl-11"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button className="text-white/40 hover:text-white/60 font-body text-xs transition-colors">
          💬 Reply
        </button>
        <button className="text-white/40 hover:text-white/60 font-body text-xs transition-colors">
          👍 Helpful
        </button>
        <button className="text-white/40 hover:text-white/60 font-body text-xs transition-colors">
          🔗 Share
        </button>
      </motion.div>
    </motion.div>
  );
};