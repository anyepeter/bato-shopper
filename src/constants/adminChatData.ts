export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  priority: 'high' | 'medium' | 'low';
  unreadCount: number;
  waitingTime: number; // in minutes
  lastMessage?: string;
  lastMessageTime?: Date;
  isTyping?: boolean;
  department?: string;
  issueType?: string;
  customerSince?: string;
}

export interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface Message {
  id: number;
  text: string;
  sender: 'customer' | 'admin';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
}

export const MOCK_CHAT_USERS: ChatUser[] = [
  {
    id: '1',
    name: 'Fatima Ibrahim',
    email: 'fatima.ibrahim@email.com',
    status: 'online',
    priority: 'high',
    unreadCount: 3,
    waitingTime: 15,
    lastMessage: 'I need help with my recent order',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    department: 'Orders & Shipping',
    issueType: 'Order Issue',
    customerSince: '2022-03-15'
  },
  {
    id: '2',
    name: 'Aisha Thompson',
    email: 'aisha.thompson@email.com',
    status: 'away',
    priority: 'medium',
    unreadCount: 1,
    waitingTime: 8,
    lastMessage: 'What is your return policy?',
    lastMessageTime: new Date(Date.now() - 3 * 60 * 1000),
    department: 'Returns & Exchanges',
    issueType: 'Return Request',
    customerSince: '2023-01-22'
  },
  {
    id: '3',
    name: 'Zara Okafor',
    email: 'zara.okafor@email.com',
    status: 'online',
    priority: 'low',
    unreadCount: 0,
    waitingTime: 25,
    lastMessage: 'Thank you for your help!',
    lastMessageTime: new Date(Date.now() - 10 * 60 * 1000),
    department: 'Product Questions',
    issueType: 'Product Inquiry',
    customerSince: '2023-07-10'
  },
  {
    id: '4',
    name: 'Amara Williams',
    email: 'amara.williams@email.com',
    status: 'online',
    priority: 'high',
    unreadCount: 2,
    waitingTime: 5,
    lastMessage: 'My payment failed, please help',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 1000),
    department: 'Payment Issues',
    issueType: 'Payment Problem',
    customerSince: '2022-11-08'
  },
  {
    id: '5',
    name: 'Kemi Adebayo',
    email: 'kemi.adebayo@email.com',
    status: 'away',
    priority: 'medium',
    unreadCount: 1,
    waitingTime: 12,
    lastMessage: 'Size guide question',
    lastMessageTime: new Date(Date.now() - 7 * 60 * 1000),
    department: 'Product Questions',
    issueType: 'Size Guide',
    customerSince: '2023-02-14'
  }
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 1,
      text: 'Hello! I placed an order 3 days ago (Order #12345) but I haven\'t received any shipping confirmation. Can you please help me track my order?',
      sender: 'customer',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      reactions: [
        { emoji: '👋', users: ['admin'], count: 1 }
      ]
    },
    {
      id: 2,
      text: 'Hi Fatima! I\'d be happy to help you with your order. Let me look up Order #12345 for you right now.',
      sender: 'admin',
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      status: 'delivered',
      reactions: [
        { emoji: '🙏', users: ['customer'], count: 1 }
      ]
    },
    {
      id: 3,
      text: 'I can see that your order is currently being processed at our fulfillment center. It should ship out within the next 24 hours, and you\'ll receive a tracking number via email.',
      sender: 'admin',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'delivered'
    },
    {
      id: 4,
      text: 'Thank you so much! That\'s very helpful. I was getting worried since it\'s been a few days.',
      sender: 'customer',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      reactions: [
        { emoji: '😊', users: ['admin'], count: 1 }
      ]
    },
    {
      id: 5,
      text: 'I completely understand your concern! Is there anything else I can help you with today?',
      sender: 'admin',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'delivered'
    }
  ],
  '2': [
    {
      id: 1,
      text: 'Hi there! I bought a dress last week but it doesn\'t fit quite right. What is your return policy?',
      sender: 'customer',
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: 2,
      text: 'Hello Aisha! I\'d be happy to help you with your return. We offer free returns within 30 days of purchase for a full refund or exchange.',
      sender: 'admin',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      status: 'delivered',
      reactions: [
        { emoji: '👍', users: ['customer'], count: 1 }
      ]
    },
    {
      id: 3,
      text: 'That sounds perfect! How do I initiate the return process?',
      sender: 'customer',
      timestamp: new Date(Date.now() - 8 * 60 * 1000)
    }
  ],
  '3': [
    {
      id: 1,
      text: 'Hello! I\'m looking for a specific dress in size M. Do you have the Ankara print dress in blue available?',
      sender: 'customer',
      timestamp: new Date(Date.now() - 25 * 60 * 1000)
    },
    {
      id: 2,
      text: 'Hi Zara! Let me check our inventory for the blue Ankara print dress in size M.',
      sender: 'admin',
      timestamp: new Date(Date.now() - 22 * 60 * 1000),
      status: 'delivered'
    },
    {
      id: 3,
      text: 'Great news! We do have that dress in stock in size M. I can send you the direct link to purchase it.',
      sender: 'admin',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      status: 'delivered',
      reactions: [
        { emoji: '🎉', users: ['customer'], count: 1 },
        { emoji: '😍', users: ['customer'], count: 1 }
      ]
    },
    {
      id: 4,
      text: 'That would be wonderful! Thank you so much for checking.',
      sender: 'customer',
      timestamp: new Date(Date.now() - 18 * 60 * 1000)
    },
    {
      id: 5,
      text: 'You\'re very welcome! Here\'s the link: [Product Link]. Is there anything else I can help you with?',
      sender: 'admin',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'delivered'
    },
    {
      id: 6,
      text: 'Perfect! Thank you for your excellent service. I\'ll place the order now.',
      sender: 'customer',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      reactions: [
        { emoji: '❤️', users: ['admin'], count: 1 }
      ]
    }
  ],
  '4': [
    {
      id: 1,
      text: 'Help! I tried to place an order but my payment keeps failing. I\'ve tried different cards but nothing works.',
      sender: 'customer',
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    },
    {
      id: 2,
      text: 'Hi Amara! I\'m sorry to hear you\'re having payment issues. This can be frustrating. Let me help you resolve this right away.',
      sender: 'admin',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      status: 'delivered',
      reactions: [
        { emoji: '🙏', users: ['customer'], count: 1 }
      ]
    },
    {
      id: 3,
      text: 'Can you tell me what error message you\'re seeing when the payment fails?',
      sender: 'admin',
      timestamp: new Date(Date.now() - 6 * 60 * 1000),
      status: 'delivered'
    }
  ],
  '5': [
    {
      id: 1,
      text: 'Hi! I\'m interested in ordering a dress but I\'m not sure about the sizing. Can you help me with the size guide?',
      sender: 'customer',
      timestamp: new Date(Date.now() - 12 * 60 * 1000)
    },
    {
      id: 2,
      text: 'Hello Kemi! I\'d be happy to help you with sizing. Which dress are you interested in? Different styles may fit differently.',
      sender: 'admin',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      status: 'delivered'
    }
  ]
};