import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Flag, 
  Trash2, 
  Pin, 
  Eye, 
  EyeOff, 
  MessageSquare,
  TrendingUp,
  Users,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

interface ModerationAction {
  id: number;
  type: 'warning' | 'mute' | 'ban' | 'delete' | 'pin' | 'highlight';
  targetUserId: number;
  targetMessageId?: number;
  reason: string;
  timestamp: string;
  moderatorId: number;
  status: 'pending' | 'completed' | 'reversed';
}

interface CommunityInsight {
  metric: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface CommunityManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
  isMobile?: boolean;
}

export function CommunityManagementPanel({
  isOpen,
  onClose,
  productId,
  productName,
  isMobile = false
}: CommunityManagementPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'moderation' | 'insights' | 'settings'>('overview');
  const [recentActions, setRecentActions] = useState<ModerationAction[]>([]);

  // Mock community insights
  const insights: CommunityInsight[] = [
    {
      metric: 'Active Members',
      value: '128',
      change: '+12%',
      trend: 'up',
      icon: <Users className="h-4 w-4" />
    },
    {
      metric: 'Messages Today',
      value: '47',
      change: '+8%',
      trend: 'up',
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      metric: 'Helpful Reactions',
      value: '156',
      change: '+23%',
      trend: 'up',
      icon: <Star className="h-4 w-4" />
    },
    {
      metric: 'Community Health',
      value: '94%',
      change: '+2%',
      trend: 'up',
      icon: <TrendingUp className="h-4 w-4" />
    }
  ];

  const handleModerationAction = useCallback((action: Omit<ModerationAction, 'id' | 'timestamp' | 'status'>) => {
    const newAction: ModerationAction = {
      ...action,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    setRecentActions(prev => [newAction, ...prev.slice(0, 9)]);
  }, []);

  if (!isOpen) return null;

  const containerClasses = isMobile 
    ? "fixed inset-0 z-[10001] bg-black/95 backdrop-blur-md"
    : "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] z-[10000] bg-white rounded-lg shadow-2xl border";

  return (
    <AnimatePresence>
      <motion.div
        className={containerClasses}
        initial={{ 
          opacity: 0, 
          ...(isMobile ? { y: '100%' } : { scale: 0.9 })
        }}
        animate={{ 
          opacity: 1, 
          ...(isMobile ? { y: 0 } : { scale: 1 })
        }}
        exit={{ 
          opacity: 0, 
          ...(isMobile ? { y: '100%' } : { scale: 0.9 })
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className={`flex flex-col h-full ${isMobile ? 'text-white' : ''}`}>
          {/* Header */}
          <div className={`p-4 border-b ${isMobile ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`font-heading font-bold text-lg ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                  Community Management
                </h2>
                <p className={`text-sm ${isMobile ? 'text-white/80' : 'text-gray-600'}`}>
                  {productName} - Product Community
                </p>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className={isMobile ? "text-white hover:bg-white/10" : ""}
              >
                ✕
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 mt-4 p-1 bg-black/10 rounded-lg">
              {(['overview', 'moderation', 'insights', 'settings'] as const).map((tab) => (
                <Button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  variant={activeTab === tab ? "default" : "ghost"}
                  size="sm"
                  className={`flex-1 text-xs ${
                    activeTab === tab 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : isMobile ? 'text-white/80 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  {insights.map((insight, index) => (
                    <motion.div
                      key={insight.metric}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`p-4 ${isMobile ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-lg ${isMobile ? 'bg-white/20' : 'bg-purple-100'}`}>
                            <div className={isMobile ? 'text-white' : 'text-purple-600'}>
                              {insight.icon}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                              {insight.value}
                            </p>
                            <p className={`text-sm ${
                              insight.trend === 'up' ? 'text-green-400' : 
                              insight.trend === 'down' ? 'text-red-400' : 
                              isMobile ? 'text-white/60' : 'text-gray-500'
                            }`}>
                              {insight.change}
                            </p>
                          </div>
                        </div>
                        <p className={`mt-2 text-sm font-medium ${isMobile ? 'text-white/90' : 'text-gray-700'}`}>
                          {insight.metric}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className={`font-heading font-bold mb-3 ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                    Recent Community Activity
                  </h3>
                  <div className="space-y-3">
                    {[
                      { user: 'Sarah J.', action: 'shared helpful sizing tip', time: '2m ago', type: 'positive' },
                      { user: 'Maya P.', action: 'asked about fabric care', time: '15m ago', type: 'neutral' },
                      { user: 'Zara W.', action: 'left 5-star review', time: '1h ago', type: 'positive' },
                      { user: 'Amara O.', action: 'joined the community', time: '2h ago', type: 'neutral' }
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          isMobile ? 'bg-white/10' : 'bg-gray-50'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'positive' ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                        <div className="flex-1">
                          <p className={`text-sm ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className={`text-xs ${isMobile ? 'text-white/60' : 'text-gray-500'}`}>
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'moderation' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className={`font-heading font-bold ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                    Moderation Tools
                  </h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Auto-moderation: Active
                  </Badge>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: <Pin className="h-4 w-4" />, label: 'Pin Message', color: 'blue' },
                    { icon: <Flag className="h-4 w-4" />, label: 'Report Content', color: 'red' },
                    { icon: <Eye className="h-4 w-4" />, label: 'Monitor Mode', color: 'gray' },
                    { icon: <Shield className="h-4 w-4" />, label: 'Admin Tools', color: 'purple' }
                  ].map((tool, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`p-4 h-auto flex flex-col gap-2 ${
                        isMobile ? 'border-white/20 text-white hover:bg-white/10' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-lg bg-${tool.color}-100 text-${tool.color}-600`}>
                        {tool.icon}
                      </div>
                      <span className="text-xs font-medium">{tool.label}</span>
                    </Button>
                  ))}
                </div>

                {/* Recent Moderation Actions */}
                <div>
                  <h4 className={`font-heading font-medium mb-3 ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                    Recent Actions
                  </h4>
                  <div className="space-y-2">
                    {recentActions.length === 0 ? (
                      <div className={`text-center py-8 ${isMobile ? 'text-white/60' : 'text-gray-500'}`}>
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent moderation actions needed</p>
                        <p className="text-xs">Community is healthy! 🎉</p>
                      </div>
                    ) : (
                      recentActions.map((action) => (
                        <div
                          key={action.id}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            isMobile ? 'bg-white/10' : 'bg-gray-50'
                          }`}
                        >
                          <div className="p-1.5 rounded-full bg-orange-100 text-orange-600">
                            <AlertTriangle className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                              {action.type} action on user {action.targetUserId}
                            </p>
                            <p className={`text-xs ${isMobile ? 'text-white/60' : 'text-gray-500'}`}>
                              {action.reason}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {action.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                <h3 className={`font-heading font-bold ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                  Community Analytics
                </h3>

                {/* Engagement Chart */}
                <Card className={`p-4 ${isMobile ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className={`h-4 w-4 ${isMobile ? 'text-white' : 'text-gray-600'}`} />
                    <h4 className={`font-heading font-medium ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                      Engagement Trends
                    </h4>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Daily Messages', value: 85, color: 'bg-blue-500' },
                      { label: 'Question Response Rate', value: 92, color: 'bg-green-500' },
                      { label: 'Helpful Reactions', value: 78, color: 'bg-purple-500' },
                      { label: 'Member Satisfaction', value: 94, color: 'bg-yellow-500' }
                    ].map((metric, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm ${isMobile ? 'text-white/90' : 'text-gray-700'}`}>
                            {metric.label}
                          </span>
                          <span className={`text-sm font-medium ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                            {metric.value}%
                          </span>
                        </div>
                        <div className={`w-full bg-gray-200 rounded-full h-2 ${isMobile ? 'bg-white/20' : ''}`}>
                          <motion.div
                            className={`h-2 rounded-full ${metric.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Top Contributors */}
                <div>
                  <h4 className={`font-heading font-medium mb-3 ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                    Top Contributors This Week
                  </h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Zara Williams', contributions: 12, badge: 'Super Helper' },
                      { name: 'Sarah Johnson', contributions: 8, badge: 'Top Reviewer' },
                      { name: 'Amara Okafor', contributions: 6, badge: 'Early Adopter' }
                    ].map((contributor, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isMobile ? 'bg-white/10' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                              {contributor.name}
                            </p>
                            <p className={`text-xs ${isMobile ? 'text-white/60' : 'text-gray-500'}`}>
                              {contributor.badge}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {contributor.contributions} posts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className={`font-heading font-bold ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                  Community Settings
                </h3>

                {/* Community Rules */}
                <div>
                  <h4 className={`font-heading font-medium mb-3 ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                    Community Guidelines
                  </h4>
                  <div className="space-y-2">
                    {[
                      '✅ Be respectful and constructive in all interactions',
                      '✅ Share honest product experiences and reviews',
                      '✅ Help fellow community members with questions',
                      '❌ No spam, promotional content, or off-topic discussions',
                      '❌ No offensive language or inappropriate behavior'
                    ].map((rule, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${isMobile ? 'bg-white/10' : 'bg-gray-50'}`}
                      >
                        <p className={`text-sm ${isMobile ? 'text-white/90' : 'text-gray-700'}`}>
                          {rule}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notification Settings */}
                <div>
                  <h4 className={`font-heading font-medium mb-3 ${isMobile ? 'text-white' : 'text-gray-900'}`}>
                    Notification Preferences
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'New member notifications', enabled: true },
                      { label: 'Message moderation alerts', enabled: true },
                      { label: 'Weekly community reports', enabled: false },
                      { label: 'Engagement milestone alerts', enabled: true }
                    ].map((setting, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isMobile ? 'bg-white/10' : 'bg-gray-50'
                        }`}
                      >
                        <span className={`text-sm ${isMobile ? 'text-white/90' : 'text-gray-700'}`}>
                          {setting.label}
                        </span>
                        <div className={`w-10 h-6 rounded-full transition-colors ${
                          setting.enabled ? 'bg-purple-600' : isMobile ? 'bg-white/20' : 'bg-gray-300'
                        }`}>
                          <div className={`w-4 h-4 rounded-full bg-white mt-1 transition-transform ${
                            setting.enabled ? 'translate-x-5' : 'translate-x-1'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}