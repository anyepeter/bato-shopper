import { useState } from "react";
import { motion } from "motion/react";
import { 
  X, 
  Settings, 
  Bell, 
  BellOff, 
  User, 
  Clock, 
  MessageCircle, 
  Star,
  TrendingUp,
  Users,
  AlertCircle
} from "lucide-react";

interface AdminChatHeaderProps {
  currentUser: any;
  adminStatus: 'online' | 'busy' | 'away';
  onStatusChange: (status: 'online' | 'busy' | 'away') => void;
  performanceMetrics: {
    averageResponseTime: string;
    todayResolved: number;
    customerSatisfaction: number;
    activeChats: number;
    waitingChats: number;
    totalChatsToday: number;
  };
  notifications: Array<{
    id: number;
    type: 'new_message' | 'escalation' | 'system' | 'performance';
    title: string;
    message: string;
    timestamp: Date;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    conversationId?: number;
  }>;
  showNotifications: boolean;
  onToggleNotifications: () => void;
  onClose: () => void;
  style?: React.CSSProperties;
}

export function AdminChatHeader({
  currentUser,
  adminStatus,
  onStatusChange,
  performanceMetrics,
  notifications,
  showNotifications,
  onToggleNotifications,
  onClose,
  style
}: AdminChatHeaderProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#0fa342';
      case 'busy': return '#e74c3c';
      case 'away': return '#FFE087';
      default: return '#868686';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '●';
      case 'busy': return '●';
      case 'away': return '◐';
      default: return '○';
    }
  };

  const urgentNotifications = notifications.filter(n => n.priority === 'urgent' || n.priority === 'high');

  return (
    <div 
      className="flex items-center justify-between px-6 py-4 border-b relative"
      style={{
        ...style,
        borderColor: 'rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Left Section - Admin Info and Status */}
      <div className="flex items-center space-x-4">
        {/* Admin Avatar and Info */}
        <div className="flex items-center space-x-3">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2"
              style={{ 
                backgroundColor: currentUser?.avatar ? 'transparent' : 'var(--warning-yellow)',
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }}
            >
              {currentUser?.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span 
                  className="text-lg font-bold font-heading"
                  style={{ color: 'var(--primary-blue)' }}
                >
                  {currentUser?.firstName?.[0] || 'A'}
                </span>
              )}
            </div>
            
            {/* Status Indicator */}
            <div 
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
              style={{ 
                backgroundColor: getStatusColor(adminStatus),
                borderColor: 'var(--pure-white)',
                fontSize: '8px',
                color: 'var(--pure-white)'
              }}
            >
              {getStatusIcon(adminStatus)}
            </div>
          </motion.div>

          <div>
            <h3 
              className="font-semibold font-heading"
              style={{ 
                color: 'var(--pure-white)',
                fontFamily: 'var(--font-heading)'
              }}
            >
              {currentUser?.firstName} {currentUser?.lastName}
            </h3>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="text-sm opacity-90 font-body flex items-center space-x-1 px-2 py-1 rounded-md transition-colors"
                style={{ 
                  color: 'var(--pure-white)',
                  fontFamily: 'var(--font-body)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <span>{adminStatus.charAt(0).toUpperCase() + adminStatus.slice(1)}</span>
                <span style={{ color: getStatusColor(adminStatus) }}>●</span>
              </motion.button>
              
              <span 
                className="text-xs opacity-70"
                style={{ color: 'var(--pure-white)' }}
              >
                {currentUser?.adminLevel || 'Chat Administrator'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Change Menu */}
        {showStatusMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-full left-6 mt-2 p-2 rounded-xl shadow-lg z-50 min-w-[180px]"
            style={{
              backgroundColor: 'var(--pure-white)',
              border: '0.5px solid var(--border)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
            }}
          >
            {[
              { status: 'online', label: 'Online', color: '#0fa342' },
              { status: 'busy', label: 'Busy', color: '#e74c3c' },
              { status: 'away', label: 'Away', color: '#FFE087' }
            ].map((option) => (
              <motion.button
                key={option.status}
                whileHover={{ scale: 1.02, backgroundColor: 'var(--light-gray)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onStatusChange(option.status as any);
                  setShowStatusMenu(false);
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors font-body"
                style={{
                  backgroundColor: adminStatus === option.status ? 'var(--primary-extra-light-blue)' : 'transparent',
                  color: 'var(--black)'
                }}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: option.color }}
                />
                <span className="text-sm">{option.label}</span>
                {adminStatus === option.status && (
                  <span className="text-xs opacity-60 ml-auto">Current</span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Center Section - Quick Performance Metrics */}
      <div className="hidden lg:flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
            <div className="text-center">
              <div 
                className="text-lg font-semibold font-heading"
                style={{ color: 'var(--pure-white)' }}
              >
                {performanceMetrics.activeChats}
              </div>
              <div 
                className="text-xs opacity-80 font-body"
                style={{ color: 'var(--pure-white)' }}
              >
                Active
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
            <div className="text-center">
              <div 
                className="text-lg font-semibold font-heading"
                style={{ color: 'var(--pure-white)' }}
              >
                {performanceMetrics.averageResponseTime}
              </div>
              <div 
                className="text-xs opacity-80 font-body"
                style={{ color: 'var(--pure-white)' }}
              >
                Avg Response
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
            <div className="text-center">
              <div 
                className="text-lg font-semibold font-heading"
                style={{ color: 'var(--pure-white)' }}
              >
                {performanceMetrics.customerSatisfaction}
              </div>
              <div 
                className="text-xs opacity-80 font-body"
                style={{ color: 'var(--pure-white)' }}
              >
                Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center space-x-2">
        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="p-2 rounded-full relative"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            title="Notifications"
          >
            {showNotifications ? (
              <Bell className="h-5 w-5" style={{ color: 'var(--pure-white)' }} />
            ) : (
              <BellOff className="h-5 w-5" style={{ color: 'var(--pure-white)' }} />
            )}
            
            {urgentNotifications.length > 0 && (
              <div 
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ 
                  backgroundColor: '#e74c3c',
                  color: 'var(--pure-white)'
                }}
              >
                {urgentNotifications.length}
              </div>
            )}
          </motion.button>

          {/* Notification Menu */}
          {showNotificationMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full right-0 mt-2 p-4 rounded-xl shadow-lg z-50 w-80 max-h-96 overflow-y-auto"
              style={{
                backgroundColor: 'var(--pure-white)',
                border: '0.5px solid var(--border)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 
                  className="font-semibold font-heading"
                  style={{ color: 'var(--primary-blue)' }}
                >
                  Notifications
                </h4>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onToggleNotifications}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: showNotifications ? 'var(--primary-blue)' : 'var(--light-gray)',
                    color: showNotifications ? 'var(--pure-white)' : 'var(--medium-gray)'
                  }}
                >
                  {showNotifications ? 'On' : 'Off'}
                </motion.button>
              </div>

              <div className="space-y-3">
                {notifications.length > 0 ? notifications.slice(0, 5).map((notification) => (
                  <motion.div
                    key={notification.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 rounded-lg border"
                    style={{
                      backgroundColor: notification.priority === 'urgent' ? 'rgba(231, 76, 60, 0.1)' : 'var(--light-gray)',
                      borderColor: notification.priority === 'urgent' ? '#e74c3c' : 'var(--border)'
                    }}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        {notification.type === 'new_message' && <MessageCircle className="h-4 w-4 text-blue-500" />}
                        {notification.type === 'escalation' && <AlertCircle className="h-4 w-4 text-red-500" />}
                        {notification.type === 'system' && <Settings className="h-4 w-4 text-gray-500" />}
                        {notification.type === 'performance' && <TrendingUp className="h-4 w-4 text-green-500" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p 
                          className="text-sm font-medium font-body"
                          style={{ color: 'var(--black)' }}
                        >
                          {notification.title}
                        </p>
                        <p 
                          className="text-xs opacity-70 font-body mt-1"
                          style={{ color: 'var(--medium-gray)' }}
                        >
                          {notification.message}
                        </p>
                        <p 
                          className="text-xs opacity-50 font-body mt-1"
                          style={{ color: 'var(--medium-gray)' }}
                        >
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-4">
                    <p 
                      className="text-sm font-body opacity-60"
                      style={{ color: 'var(--medium-gray)' }}
                    >
                      No new notifications
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          title="Chat Settings"
        >
          <Settings className="h-5 w-5" style={{ color: 'var(--pure-white)' }} />
        </motion.button>

        {/* Close */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-2 rounded-full ml-2"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          title="Close Admin Chat"
        >
          <X className="h-5 w-5" style={{ color: 'var(--pure-white)' }} />
        </motion.button>
      </div>
    </div>
  );
}