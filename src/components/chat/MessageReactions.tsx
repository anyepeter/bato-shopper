import { motion } from "motion/react";
import { MessageReaction } from "../../types";

interface MessageReactionsProps {
  reactions: MessageReaction[] | { [emoji: string]: number };
  userReactions?: string[];
  onReactionClick?: (emoji: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function MessageReactions({ 
  reactions, 
  userReactions = [], 
  onReactionClick, 
  className = "",
  size = 'md'
}: MessageReactionsProps) {
  // Handle empty reactions
  if (!reactions) return null;
  
  // Handle both array format (new) and object format (legacy)
  const reactionsArray: MessageReaction[] = Array.isArray(reactions) 
    ? reactions 
    : Object.entries(reactions).map(([emoji, count]) => ({
        emoji,
        count,
        users: [],
        hasReacted: userReactions.includes(emoji)
      }));
  
  if (reactionsArray.length === 0) return null;

  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-wrap gap-1 mt-2 ${className}`}
    >
      {reactionsArray.map((reaction) => {
        const hasReacted = reaction.hasReacted || userReactions.includes(reaction.emoji);
        return (
          <motion.button
            key={reaction.emoji}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReactionClick?.(reaction.emoji)}
            className={`flex items-center gap-1 ${sizeClasses} rounded-full transition-colors ${
              hasReacted 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
            title={`${reaction.count} reaction${reaction.count !== 1 ? 's' : ''} with ${reaction.emoji}`}
          >
            <span>{reaction.emoji}</span>
            <span className="font-medium">{reaction.count}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}