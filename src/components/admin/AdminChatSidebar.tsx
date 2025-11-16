import { motion, AnimatePresence } from "motion/react";
import { Users, Clock, Search, MessageSquare, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface AdminChatSidebarProps {
  conversations: any[];
  selectedConversation: any;
  onConversationSelect: (conversation: any) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: 'all' | 'active' | 'waiting' | 'escalated';
  onFilterChange: (status: 'all' | 'active' | 'waiting' | 'escalated') => void;
  sortBy: 'recent' | 'priority' | 'unread';
  onSortChange: (sort: 'recent' | 'priority' | 'unread') => void;
  performanceMetrics: {
    activeChats: number;
    waitingChats: number;
    totalChatsToday: number;
  };
}

export function AdminChatSidebar({
  conversations,
  selectedConversation,
  onConversationSelect,
  isCollapsed,
  onToggleCollapse,
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  sortBy,
  onSortChange,
  performanceMetrics
}: AdminChatSidebarProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ width: 320 }}
        animate={{ width: 60 }}
        transition={{ type: "spring", damping: 20, stiffness: 150 }}
        className="bg-white border-r border-gray-200 flex flex-col items-center py-4"
        style={{ borderColor: 'var(--border)' }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <div className="flex flex-col items-center space-y-3">
          <div className="text-center">
            <div 
              className="text-lg font-semibold font-heading"
              style={{ color: 'var(--primary-blue)' }}
            >
              {performanceMetrics.activeChats}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--medium-gray)' }}
            >
              Active
            </div>
          </div>
          
          <div className="text-center">
            <div 
              className="text-lg font-semibold font-heading"
              style={{ color: 'var(--warning-yellow)' }}
            >
              {performanceMetrics.waitingChats}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--medium-gray)' }}
            >
              Waiting
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 60 }}
      animate={{ width: 320 }}
      transition={{ type: "spring", damping: 20, stiffness: 150 }}
      className="bg-white border-r border-gray-200 flex flex-col"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 
            className="text-lg font-semibold font-heading"
            style={{ color: 'var(--black)' }}
          >
            Chat Queue
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Users className="h-3 w-3 mr-1" />
            {performanceMetrics.activeChats}
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            {performanceMetrics.waitingChats}
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <MessageSquare className="h-3 w-3 mr-1" />
            {performanceMetrics.totalChatsToday}
          </Badge>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            style={{ borderRadius: '3px' }}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-1 mb-3">
          {['all', 'active', 'waiting', 'escalated'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange(status as any)}
              className="text-xs"
              style={{ borderRadius: '3px' }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex gap-1">
          {['recent', 'priority', 'unread'].map((sort) => (
            <Button
              key={sort}
              variant={sortBy === sort ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onSortChange(sort as any)}
              className="text-xs"
              style={{ borderRadius: '3px' }}
            >
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center">
            <MessageSquare 
              className="h-8 w-8 mx-auto mb-2 opacity-50"
              style={{ color: 'var(--medium-gray)' }}
            />
            <p 
              className="text-sm font-body"
              style={{ color: 'var(--medium-gray)' }}
            >
              No conversations found
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onConversationSelect(conversation)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? 'border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: selectedConversation?.id === conversation.id 
                    ? 'var(--primary-extra-light-blue)' 
                    : 'transparent',
                  borderRadius: '3px'
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={conversation.customerAvatar}
                      alt={conversation.customerName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {conversation.status === 'active' && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                    {conversation.unreadCount > 0 && (
                      <div 
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ 
                          backgroundColor: 'var(--primary-blue)',
                          color: 'var(--pure-white)'
                        }}
                      >
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 
                        className="text-sm font-medium font-heading truncate"
                        style={{ color: 'var(--black)' }}
                      >
                        {conversation.customerName}
                      </h3>
                      <span 
                        className="text-xs font-body"
                        style={{ color: 'var(--medium-gray)' }}
                      >
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    
                    <p 
                      className="text-xs font-body truncate"
                      style={{ color: 'var(--medium-gray)' }}
                    >
                      {conversation.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(conversation.priority)}`}>
                          {conversation.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(conversation.status)}`}>
                          {conversation.status.toUpperCase()}
                        </span>
                      </div>
                      
                      {conversation.isTyping && (
                        <div className="flex space-x-1">
                          <motion.div
                            className="w-1 h-1 rounded-full"
                            style={{ backgroundColor: 'var(--primary-blue)' }}
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-1 h-1 rounded-full"
                            style={{ backgroundColor: 'var(--primary-blue)' }}
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                          />
                          <motion.div
                            className="w-1 h-1 rounded-full"
                            style={{ backgroundColor: 'var(--primary-blue)' }}
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div 
        className="p-4 border-t"
        style={{ 
          backgroundColor: 'var(--light-gray)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="text-xs font-body" style={{ color: 'var(--medium-gray)' }}>
          <div className="flex justify-between mb-1">
            <span>Active:</span>
            <span className="font-medium">{performanceMetrics.activeChats}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Waiting:</span>
            <span className="font-medium">{performanceMetrics.waitingChats}</span>
          </div>
          <div className="flex justify-between">
            <span>Today Total:</span>
            <span className="font-medium">{performanceMetrics.totalChatsToday}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}