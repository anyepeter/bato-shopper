import { useState, useRef, useEffect } from "react";
import { AdminChatHeader } from "./AdminChatHeader";
import { AdminChatSidebar } from "./AdminChatSidebar";
import { AdminChatMessages } from "./AdminChatMessages";
import { motion, AnimatePresence } from "motion/react";

interface AdminChatRoomProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: any;
}

export function AdminChatRoom({ isOpen, onClose, currentUser }: AdminChatRoomProps) {
  // 🔥 MOBILE DETECTION STATE
  const [isMobile, setIsMobile] = useState(false);

  // 🔥 MOBILE DETECTION EFFECT
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Mobile breakpoint at 768px
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Comprehensive admin chat state
  const [activeConversations, setActiveConversations] = useState([
    {
      id: 1,
      customerId: "CUST-2024-001",
      customerName: "Sarah Johnson",
      customerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150",
      customerEmail: "sarah.johnson@email.com",
      priority: "high" as const,
      status: "active" as const,
      lastMessage: "I need help with sizing for the Ankara dress I'm interested in. Can you provide measurements for size M?",
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 2,
      tags: ["sizing", "product-inquiry"],
      orderHistory: [
        { id: "ORD-001", total: 120.00, date: "2024-01-15", status: "delivered" },
        { id: "ORD-002", total: 89.50, date: "2024-02-10", status: "shipped" }
      ],
      satisfaction: 4.5,
      totalOrders: 8,
      customerSince: "2023-06-15",
      preferredContact: "chat",
      timezone: "EST",
      language: "English",
      notes: "VIP customer - fashion blogger with 50k followers. Prefers detailed product information.",
      isTyping: false,
      conversationType: "general" as const
    },
    {
      id: 2,
      customerId: "CUST-2024-002", 
      customerName: "Amina Hassan",
      customerAvatar: "https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150",
      customerEmail: "amina.hassan@email.com",
      priority: "medium" as const,
      status: "waiting" as const,
      lastMessage: "Thank you for the recommendation! I'll check out the new collection.",
      lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
      unreadCount: 0,
      tags: ["product-recommendation", "resolved"],
      orderHistory: [
        { id: "ORD-003", total: 95.00, date: "2024-01-20", status: "delivered" }
      ],
      satisfaction: 5.0,
      totalOrders: 3,
      customerSince: "2024-01-01",
      preferredContact: "email",
      timezone: "GMT",
      language: "English",
      notes: "First-time buyer, very interested in traditional styles.",
      isTyping: false,
      conversationType: "support" as const
    },
    {
      id: 3,
      customerId: "CUST-2024-003",
      customerName: "Keisha Williams", 
      customerAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150",
      customerEmail: "keisha.williams@email.com",
      priority: "urgent" as const,
      status: "escalated" as const,
      lastMessage: "I still haven't received my order from last week. This is unacceptable!",
      lastMessageTime: new Date(Date.now() - 2 * 60 * 1000),
      unreadCount: 5,
      tags: ["shipping-issue", "escalated", "urgent"],
      orderHistory: [
        { id: "ORD-004", total: 156.00, date: "2024-02-18", status: "delayed" },
        { id: "ORD-005", total: 78.50, date: "2024-01-10", status: "delivered" }
      ],
      satisfaction: 2.0,
      totalOrders: 4,
      customerSince: "2023-12-05",
      preferredContact: "phone",
      timezone: "PST",
      language: "English",
      notes: "Customer experiencing shipping delays. Escalated to supervisor.",
      isTyping: true,
      conversationType: "complaint" as const
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState(activeConversations[0]);
  const [adminStatus, setAdminStatus] = useState<'online' | 'busy' | 'away'>('online');
  const [showNotifications, setShowNotifications] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'waiting' | 'escalated'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'priority' | 'unread'>('recent');

  // Performance tracking
  const [performanceMetrics, setPerformanceMetrics] = useState({
    averageResponseTime: '2m 34s',
    todayResolved: 23,
    customerSatisfaction: 4.8,
    activeChats: 3,
    waitingChats: 5,
    totalChatsToday: 47
  });

  // Notification handling
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'new_message' as const,
      title: 'New message from Keisha Williams',
      message: 'Customer is asking about shipping delay',
      timestamp: new Date(),
      priority: 'high' as const,
      conversationId: 3
    },
    {
      id: 2,
      type: 'escalation' as const,
      title: 'Chat escalated to supervisor',
      message: 'Shipping complaint requires manager attention',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      priority: 'urgent' as const,
      conversationId: 3
    }
  ]);

  // Auto-refresh conversations every 30 seconds
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        // In a real app, this would fetch from backend
        console.log('🔄 Refreshing admin chat conversations...');
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Filter and sort conversations
  const filteredConversations = activeConversations
    .filter(conv => {
      if (filterStatus !== 'all' && conv.status !== filterStatus) return false;
      if (searchQuery) {
        return conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               conv.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
               conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { urgent: 3, high: 2, medium: 1, low: 0 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'unread':
          return b.unreadCount - a.unreadCount;
        case 'recent':
        default:
          return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
      }
    });

  const handleConversationSelect = (conversation: typeof activeConversations[0]) => {
    setSelectedConversation(conversation);
    
    // Mark conversation as read
    setActiveConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleStatusChange = (newStatus: 'online' | 'busy' | 'away') => {
    setAdminStatus(newStatus);
    console.log(`🎯 Admin status changed to: ${newStatus}`);
  };

  const handleMessageSend = (messageText: string, conversationId: number) => {
    console.log(`📤 Sending admin message to conversation ${conversationId}: ${messageText}`);
    
    // Update conversation with new message
    setActiveConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: messageText,
              lastMessageTime: new Date(),
              status: 'active' as const
            }
          : conv
      )
    );
  };

  const handleConversationAction = (action: string, conversationId: number) => {
    console.log(`🎯 Admin action: ${action} on conversation ${conversationId}`);
    
    switch (action) {
      case 'escalate':
        setActiveConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? { ...conv, status: 'escalated' as const, priority: 'urgent' as const }
              : conv
          )
        );
        break;
      case 'resolve':
        setActiveConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? { ...conv, status: 'waiting' as const }
              : conv
          )
        );
        break;
      case 'transfer':
        console.log('🔄 Transferring conversation to another agent...');
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`absolute ${
            isMobile 
              ? 'inset-0' // 🔥 MOBILE: Full height (100%) - no margins at all
              : 'inset-4 md:inset-8 lg:inset-16' // Desktop: Normal insets
          } rounded-2xl overflow-hidden shadow-2xl flex flex-col`}
          style={{ backgroundColor: 'var(--pure-white)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Admin Chat Header with Orange Gradient */}
          <AdminChatHeader
            currentUser={currentUser}
            adminStatus={adminStatus}
            onStatusChange={handleStatusChange}
            performanceMetrics={performanceMetrics}
            notifications={notifications}
            showNotifications={showNotifications}
            onToggleNotifications={() => setShowNotifications(!showNotifications)}
            onClose={onClose}
            style={{ 
              background: 'linear-gradient(180deg, #5825ef, #5825ef)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }}
          />

          {/* Main Chat Interface */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar with conversation list - Hide on mobile if needed */}
            {(!isMobile || isSidebarCollapsed) && (
              <AdminChatSidebar
                conversations={filteredConversations}
                selectedConversation={selectedConversation}
                onConversationSelect={handleConversationSelect}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
                sortBy={sortBy}
                onSortChange={setSortBy}
                performanceMetrics={performanceMetrics}
              />
            )}

            {/* Main chat area */}
            <div className="flex-1 flex flex-col">
              <AdminChatMessages
                conversation={selectedConversation}
                currentUser={currentUser}
                onMessageSend={handleMessageSend}
                onConversationAction={handleConversationAction}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}