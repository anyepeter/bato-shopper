import { BOT_RESPONSES } from '../constants/chatData';
import { Message, MessageReaction } from '../types';

// Generate bot response based on user message
export const getBotResponse = (userMessage: string): string => {
  const lowercaseMessage = userMessage.toLowerCase();
  
  for (const responseSet of BOT_RESPONSES) {
    if (responseSet.trigger.some(trigger => lowercaseMessage.includes(trigger))) {
      const randomResponse = responseSet.responses[Math.floor(Math.random() * responseSet.responses.length)];
      return randomResponse;
    }
  }
  
  // Default responses with afrocentric touch
  const defaultResponses = [
    "That's interesting! 🤔 Tell me more about what you're looking for. I'm here to help you find the perfect piece! ✨",
    "I'd love to help with that! 💫 Can you give me a bit more detail so I can assist you better? 👸🏾",
    "Great question! 🌟 Let me connect you with the right information. What specifically would you like to know? 🦋",
    "I'm learning every day! 📚 For detailed inquiries, I can connect you with our customer service team. Meanwhile, how can I help with our products? 💖"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

// Format timestamp for display
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

// Handle message reaction logic
export const handleMessageReaction = (
  messages: Message[],
  messageId: number,
  emoji: string
): Message[] => {
  return messages.map(msg => {
    if (msg.id === messageId) {
      const reactions = msg.reactions || [];
      const existingReaction = reactions.find(r => r.emoji === emoji);
      
      if (existingReaction) {
        // Toggle existing reaction
        if (existingReaction.hasReacted) {
          // Remove user's reaction
          const updatedReaction = {
            ...existingReaction,
            count: existingReaction.count - 1,
            hasReacted: false,
            users: existingReaction.users.filter(u => u !== 'You')
          };
          
          return {
            ...msg,
            reactions: updatedReaction.count === 0 
              ? reactions.filter(r => r.emoji !== emoji)
              : reactions.map(r => r.emoji === emoji ? updatedReaction : r)
          };
        } else {
          // Add user's reaction
          return {
            ...msg,
            reactions: reactions.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.count + 1, hasReacted: true, users: [...r.users, 'You'] }
                : r
            )
          };
        }
      } else {
        // Add new reaction
        const newReaction: MessageReaction = {
          emoji,
          count: 1,
          hasReacted: true,
          users: ['You']
        };
        
        return {
          ...msg,
          reactions: [...reactions, newReaction]
        };
      }
    }
    return msg;
  });
};

// Create a new user message
export const createUserMessage = (text: string): Message => ({
  id: Date.now(),
  text,
  sender: 'user',
  timestamp: new Date(),
  status: 'sending',
  reactions: []
});

// Create a new bot message
export const createBotMessage = (text: string): Message => ({
  id: Date.now() + 1,
  text,
  sender: 'bot',
  timestamp: new Date(),
  status: 'delivered',
  reactions: []
});

// Update message status
export const updateMessageStatus = (
  messages: Message[],
  messageId: number,
  status: 'sending' | 'sent' | 'delivered' | 'read'
): Message[] => {
  return messages.map(msg => 
    msg.id === messageId ? { ...msg, status } : msg
  );
};