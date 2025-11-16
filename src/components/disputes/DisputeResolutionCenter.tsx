import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { useDisputeManagement } from '../../hooks/useDisputeManagement';
import { Dispute, Mediator, Evidence } from '../../types';
import { BootstrapIcon } from '../BootstrapIcon';

interface DisputeResolutionCenterProps {
  userRole?: 'customer' | 'vendor' | 'mediator' | 'admin';
  userId?: string;
}

export function DisputeResolutionCenter({ userRole = 'admin', userId }: DisputeResolutionCenterProps) {
  const {
    disputes,
    mediators,
    statistics,
    isLoading,
    error,
    createDispute,
    startMediation,
    proposeResolution,
    approveResolution,
    addEvidence,
    getDisputeAnalytics,
  } = useDisputeManagement();

  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter disputes based on user role and filters
  const filteredDisputes = React.useMemo(() => {
    let filtered = disputes;

    // Role-based filtering
    if (userRole === 'customer' && userId) {
      filtered = filtered.filter(d => d.customerId === userId);
    } else if (userRole === 'vendor' && userId) {
      filtered = filtered.filter(d => d.vendorId === userId);
    } else if (userRole === 'mediator' && userId) {
      filtered = filtered.filter(d => d.assignedMediator === userId);
    }

    // Status filtering
    if (filterStatus !== 'all') {
      filtered = filtered.filter(d => d.status === filterStatus);
    }

    // Priority filtering
    if (filterPriority !== 'all') {
      filtered = filtered.filter(d => d.priority === filterPriority);
    }

    // Search filtering
    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      // Sort by priority and then by creation date
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [disputes, userRole, userId, filterStatus, filterPriority, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return isMobile ? '#4040f8ff' : 'text-blue-600';
      case 'investigation': return isMobile ? '#FFE087' : 'text-yellow-600';
      case 'mediation': return isMobile ? '#5825efff' : 'text-purple-600';
      case 'resolution_pending': return isMobile ? '#FF6B35' : 'text-orange-600';
      case 'resolved': return isMobile ? '#0fa342' : 'text-green-600';
      case 'escalated': return isMobile ? '#e74c3c' : 'text-red-600';
      case 'closed': return isMobile ? '#868686' : 'text-gray-600';
      default: return isMobile ? '#868686' : 'text-gray-600';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'resolved': return 'default';
      case 'escalated': return 'destructive';
      case 'closed': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return isMobile ? '#e74c3c' : 'text-red-600';
      case 'high': return isMobile ? '#FF6B35' : 'text-orange-600';
      case 'medium': return isMobile ? '#FFE087' : 'text-yellow-600';
      case 'low': return isMobile ? '#0fa342' : 'text-green-600';
      default: return isMobile ? '#868686' : 'text-gray-600';
    }
  };

  const handleStartMediation = async (disputeId: string) => {
    try {
      await startMediation(disputeId, 'Mediation initiated by system');
      alert('Mediation started successfully');
    } catch (error) {
      console.error('Failed to start mediation:', error);
    }
  };

  const handleProposeResolution = async (disputeId: string, resolutionType: string, amount?: number) => {
    try {
      await proposeResolution(disputeId, {
        type: resolutionType as any,
        description: `Proposed ${resolutionType} resolution`,
        amount: amount || 0,
        actionItems: [`Process ${resolutionType}`],
        followUpRequired: true,
      });
      alert('Resolution proposed successfully');
    } catch (error) {
      console.error('Failed to propose resolution:', error);
    }
  };

  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center h-screen"
        style={{
          background: isMobile 
            ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'
            : 'var(--light-gray)'
        }}
      >
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              background: isMobile 
                ? 'conic-gradient(from 0deg, #4040f8ff, #5825efff, #4040f8ff)'
                : 'conic-gradient(from 0deg, #5825efff, #4040f8ff, #5825efff)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div 
              className="w-12 h-12 rounded-full"
              style={{ 
                backgroundColor: isMobile ? '#000000' : '#ffffff' 
              }}
            />
          </motion.div>
          <motion.p 
            className={`font-body ${isMobile ? 'text-white' : 'text-gray-600'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading your disputes...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Mobile TikTok-style layout
  if (isMobile) {
    return (
      <div 
        className="min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%, #000000 100%)',
          fontFamily: 'var(--font-body)'
        }}
      >
        {/* Mobile Header */}
        <motion.div 
          className="sticky top-0 z-50 p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(26,26,26,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(64, 64, 248, 0.2)'
          }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-xl font-bold text-white font-heading">
                💬 Help & Support
              </h1>
              <p className="text-sm text-gray-300 font-body">
                Track your disputes
              </p>
            </motion.div>
            
            <motion.button
              className="p-3 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #4040f8ff, #5825efff)',
                boxShadow: '0 4px 20px rgba(64, 64, 248, 0.3)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <BootstrapIcon name="plus" className="text-white text-lg" />
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Search Bar */}
        <motion.div 
          className="px-4 py-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div 
            className="relative"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(64, 64, 248, 0.3)'
            }}
          >
            <BootstrapIcon 
              name="search" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search disputes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-gray-400 border-0 focus:outline-none font-body"
              style={{ borderRadius: '8px' }}
            />
          </div>
        </motion.div>

        {/* Mobile Quick Filter Pills */}
        <motion.div 
          className="px-4 py-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {['all', 'open', 'investigation', 'mediation', 'resolved'].map((status, index) => (
              <motion.button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300 ${
                  filterStatus === status 
                    ? 'text-white' 
                    : 'text-gray-400'
                }`}
                style={{
                  background: filterStatus === status 
                    ? 'linear-gradient(135deg, #4040f8ff, #5825efff)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${filterStatus === status ? '#4040f8ff' : 'rgba(255, 255, 255, 0.2)'}`,
                  boxShadow: filterStatus === status ? '0 4px 15px rgba(64, 64, 248, 0.3)' : 'none'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Mobile Disputes List */}
        <div className="px-4 pb-20">
          <AnimatePresence>
            {filteredDisputes.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center py-20 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #4040f8ff, #5825efff)',
                    boxShadow: '0 10px 30px rgba(64, 64, 248, 0.3)'
                  }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <BootstrapIcon name="shield-check" className="text-white text-3xl" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2 font-heading">
                  All Clear! 🎉
                </h3>
                <p className="text-gray-300 font-body">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No disputes match your search'
                    : 'No active disputes found'
                  }
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredDisputes.map((dispute, index) => (
                  <MobileDisputeCard
                    key={dispute.id}
                    dispute={dispute}
                    index={index}
                    userRole={userRole}
                    onViewDetails={() => setSelectedDispute(dispute)}
                    onStartMediation={handleStartMediation}
                    onProposeResolution={handleProposeResolution}
                    getStatusColor={getStatusColor}
                    getPriorityColor={getPriorityColor}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Dispute Details Modal */}
        <AnimatePresence>
          {selectedDispute && (
            <MobileDisputeModal
              dispute={selectedDispute}
              userRole={userRole}
              onClose={() => setSelectedDispute(null)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop layout (existing code)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            {userRole === 'customer' ? 'My Disputes' : 
             userRole === 'vendor' ? 'Vendor Disputes' :
             userRole === 'mediator' ? 'Mediation Dashboard' :
             'Dispute Resolution Center'}
          </h1>
          <p className="text-gray-600 font-body">
            {userRole === 'customer' ? 'Track and manage your dispute cases' :
             userRole === 'vendor' ? 'Handle customer disputes for your products' :
             userRole === 'mediator' ? 'Mediate and resolve customer disputes' :
             'Comprehensive dispute management and resolution system'}
          </p>
        </div>
        
        {(userRole === 'customer' || userRole === 'vendor') && (
          <Button className="btn-moema-primary">
            <BootstrapIcon name="plus" className="mr-2" />
            Create New Dispute
          </Button>
        )}
      </div>

      {/* Statistics Overview */}
      {userRole === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-body">Total Disputes</p>
                  <p className="text-2xl font-bold font-heading">{statistics.totalDisputes}</p>
                </div>
                <BootstrapIcon name="exclamation-triangle" className="text-yellow-600 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-body">Resolution Rate</p>
                  <p className="text-2xl font-bold font-heading">{(statistics.resolutionRate * 100).toFixed(1)}%</p>
                </div>
                <BootstrapIcon name="check-circle" className="text-green-600 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-body">Avg Resolution Time</p>
                  <p className="text-2xl font-bold font-heading">{statistics.averageResolutionTime.toFixed(1)}h</p>
                </div>
                <BootstrapIcon name="clock" className="text-blue-600 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-body">Customer Satisfaction</p>
                  <p className="text-2xl font-bold font-heading">{statistics.customerSatisfactionScore.toFixed(1)}/5</p>
                </div>
                <BootstrapIcon name="star" className="text-purple-600 text-2xl" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Disputes</TabsTrigger>
          {userRole === 'admin' && <TabsTrigger value="mediators">Mediators</TabsTrigger>}
          {userRole === 'admin' && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
          <TabsTrigger value="templates">Resolution Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search disputes by ID, subject, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="font-body"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="investigation">Investigation</SelectItem>
                    <SelectItem value="mediation">Mediation</SelectItem>
                    <SelectItem value="resolution_pending">Resolution Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Disputes List */}
          <div className="space-y-4">
            {filteredDisputes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BootstrapIcon name="shield-check" className="text-gray-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 font-heading">No disputes found</h3>
                  <p className="text-gray-500 font-body">
                    {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Great! No active disputes at the moment.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredDisputes.map((dispute) => (
                <DisputeCard
                  key={dispute.id}
                  dispute={dispute}
                  userRole={userRole}
                  onViewDetails={() => setSelectedDispute(dispute)}
                  onStartMediation={handleStartMediation}
                  onProposeResolution={handleProposeResolution}
                  getStatusColor={getStatusColor}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                  getPriorityColor={getPriorityColor}
                />
              ))
            )}
          </div>
        </TabsContent>

        {userRole === 'admin' && (
          <TabsContent value="mediators" className="space-y-4">
            <MediatorsView mediators={mediators} />
          </TabsContent>
        )}

        {userRole === 'admin' && (
          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsView statistics={statistics} />
          </TabsContent>
        )}

        <TabsContent value="templates" className="space-y-4">
          <ResolutionTemplatesView />
        </TabsContent>
      </Tabs>

      {/* Dispute Details Modal */}
      {selectedDispute && (
        <DisputeDetailsModal
          dispute={selectedDispute}
          userRole={userRole}
          onClose={() => setSelectedDispute(null)}
          onAddEvidence={addEvidence}
          onProposeResolution={handleProposeResolution}
          onApproveResolution={approveResolution}
        />
      )}

      {error && (
        <Alert>
          <BootstrapIcon name="exclamation-triangle" className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Mobile Dispute Card Component
interface MobileDisputeCardProps {
  dispute: Dispute;
  index: number;
  userRole: string;
  onViewDetails: () => void;
  onStartMediation: (disputeId: string) => void;
  onProposeResolution: (disputeId: string, type: string, amount?: number) => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

function MobileDisputeCard({
  dispute,
  index,
  userRole,
  onViewDetails,
  onStartMediation,
  onProposeResolution,
  getStatusColor,
  getPriorityColor,
}: MobileDisputeCardProps) {
  const timeSinceCreated = Math.floor((Date.now() - dispute.createdAt.getTime()) / (1000 * 60 * 60));

  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.5,
        type: "spring",
        stiffness: 100 
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, ${getStatusColor(dispute.status)}20, ${getPriorityColor(dispute.priority)}20)`,
          animation: 'pulse 3s ease-in-out infinite'
        }}
      />

      <div className="relative p-4 space-y-4">
        {/* Header with status indicators */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getStatusColor(dispute.status) }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h3 className="text-white font-medium font-heading text-lg">
                {dispute.subject}
              </h3>
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <motion.span
                className="px-3 py-1 text-xs font-medium rounded-full"
                style={{
                  backgroundColor: getStatusColor(dispute.status),
                  color: '#ffffff'
                }}
                whileHover={{ scale: 1.05 }}
              >
                {dispute.status.replace('_', ' ').toUpperCase()}
              </motion.span>
              
              <motion.span
                className="px-3 py-1 text-xs font-medium rounded-full"
                style={{
                  backgroundColor: getPriorityColor(dispute.priority),
                  color: '#ffffff'
                }}
                whileHover={{ scale: 1.05 }}
              >
                {dispute.priority.toUpperCase()}
              </motion.span>
            </div>
          </div>

          <motion.div
            className="text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <p className="text-xs text-gray-400 font-body">
              {timeSinceCreated}h ago
            </p>
            {dispute.evidence.length > 0 && (
              <div className="flex items-center justify-end space-x-1 mt-1">
                <BootstrapIcon name="paperclip" className="text-gray-400 text-xs" />
                <span className="text-xs text-gray-400">{dispute.evidence.length}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm font-body line-clamp-2">
          {dispute.description}
        </p>

        {/* Meta information */}
        <div className="flex items-center justify-between text-xs text-gray-400 font-body">
          <span>Order #{dispute.orderId}</span>
          <span>ID: {dispute.id.substring(0, 8)}...</span>
        </div>

        {/* Action button */}
        <motion.button
          onClick={onViewDetails}
          className="w-full py-3 rounded-lg font-medium font-body text-white transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #4040f8ff, #5825efff)',
            boxShadow: '0 4px 15px rgba(64, 64, 248, 0.3)'
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 6px 20px rgba(64, 64, 248, 0.4)'
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <BootstrapIcon name="eye" className="text-sm" />
            <span>View Details</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}

// Mobile Dispute Modal Component
interface MobileDisputeModalProps {
  dispute: Dispute;
  userRole: string;
  onClose: () => void;
}

function MobileDisputeModal({ dispute, userRole, onClose }: MobileDisputeModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          border: '1px solid rgba(64, 64, 248, 0.3)'
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div 
            className="w-12 h-1 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
          />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white font-heading">
            Dispute Details
          </h2>
          <motion.button
            onClick={onClose}
            className="p-2 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <BootstrapIcon name="x" className="text-white" />
          </motion.button>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-6">
          {/* Status and Priority Pills */}
          <div className="flex items-center space-x-3">
            <span 
              className="px-4 py-2 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: '#4040f8ff' }}
            >
              {dispute.status.replace('_', ' ').toUpperCase()}
            </span>
            <span 
              className="px-4 py-2 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: '#5825efff' }}
            >
              {dispute.priority.toUpperCase()}
            </span>
          </div>

          {/* Dispute Information */}
          <div 
            className="p-4 rounded-lg space-y-3"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h3 className="text-lg font-bold text-white font-heading mb-3">
              {dispute.subject}
            </h3>
            <p className="text-gray-300 font-body leading-relaxed">
              {dispute.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
              <div>
                <p className="text-xs text-gray-400 font-body">Dispute ID</p>
                <p className="text-white font-medium">{dispute.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-body">Order ID</p>
                <p className="text-white font-medium">{dispute.orderId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-body">Created</p>
                <p className="text-white font-medium">
                  {dispute.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-body">Type</p>
                <p className="text-white font-medium capitalize">
                  {dispute.type.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Evidence Section */}
          {dispute.evidence.length > 0 && (
            <div 
              className="p-4 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <h4 className="text-white font-bold mb-3 font-heading">
                Evidence ({dispute.evidence.length})
              </h4>
              <div className="space-y-2">
                {dispute.evidence.map((evidence) => (
                  <div 
                    key={evidence.id}
                    className="flex items-center space-x-3 p-3 rounded-lg"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <BootstrapIcon 
                      name={evidence.type === 'image' ? 'image' : 'file-text'} 
                      className="text-gray-400" 
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        {evidence.description}
                      </p>
                      <p className="text-xs text-gray-400">
                        {evidence.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div 
            className="p-4 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h4 className="text-white font-bold mb-4 font-heading">Timeline</h4>
            <div className="space-y-4">
              {dispute.timeline.map((event, index) => (
                <div key={event.id} className="flex items-start space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: '#4040f8ff' }}
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">
                      {event.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {event.timestamp.toLocaleString()} • {event.performedBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              className="w-full py-4 rounded-lg font-medium font-body text-white"
              style={{
                background: 'linear-gradient(135deg, #4040f8ff, #5825efff)',
                boxShadow: '0 4px 15px rgba(64, 64, 248, 0.3)'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Evidence
            </motion.button>
            
            <motion.button
              className="w-full py-4 rounded-lg font-medium font-body"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Support
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Desktop Dispute Card Component (existing code remains the same)
interface DisputeCardProps {
  dispute: Dispute;
  userRole: string;
  onViewDetails: () => void;
  onStartMediation: (disputeId: string) => void;
  onProposeResolution: (disputeId: string, type: string, amount?: number) => void;
  getStatusColor: (status: string) => string;
  getStatusBadgeVariant: (status: string) => any;
  getPriorityColor: (priority: string) => string;
}

function DisputeCard({
  dispute,
  userRole,
  onViewDetails,
  onStartMediation,
  onProposeResolution,
  getStatusColor,
  getStatusBadgeVariant,
  getPriorityColor,
}: DisputeCardProps) {
  const timeSinceCreated = Math.floor((Date.now() - dispute.createdAt.getTime()) / (1000 * 60 * 60));

  return (
    <Card className="hover:shadow-lg transition-shadow" style={{ borderRadius: '3px' }}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold font-heading">{dispute.subject}</h3>
              <Badge variant={getStatusBadgeVariant(dispute.status)} className="capitalize">
                {dispute.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className={`capitalize ${getPriorityColor(dispute.priority)}`}>
                {dispute.priority}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2 font-body">{dispute.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500 font-body">
              <span>ID: {dispute.id}</span>
              <span>Order: {dispute.orderId}</span>
              <span>Created: {timeSinceCreated}h ago</span>
              {dispute.assignedMediator && <span>Mediator assigned</span>}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {dispute.evidence.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <BootstrapIcon name="paperclip" className="mr-1" />
                {dispute.evidence.length} evidence
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onViewDetails}
              className="font-body"
            >
              <BootstrapIcon name="eye" className="mr-1" />
              View Details
            </Button>
            
            {userRole === 'mediator' && dispute.status === 'investigation' && (
              <Button
                size="sm"
                className="btn-moema-secondary"
                onClick={() => onStartMediation(dispute.id)}
              >
                <BootstrapIcon name="play" className="mr-1" />
                Start Mediation
              </Button>
            )}
            
            {(userRole === 'admin' || userRole === 'mediator') && 
             dispute.status === 'mediation' && (
              <Button
                size="sm"
                className="btn-moema-primary"
                onClick={() => onProposeResolution(dispute.id, 'refund', 50)}
              >
                <BootstrapIcon name="check" className="mr-1" />
                Propose Resolution
              </Button>
            )}
          </div>
          
          <div className="text-xs text-gray-500 font-body">
            Type: <span className="capitalize">{dispute.type.replace('_', ' ')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mediators View Component (existing code)
function MediatorsView({ mediators }: { mediators: Mediator[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold font-heading">Mediation Team</h3>
        <Button className="btn-moema-secondary">
          <BootstrapIcon name="plus" className="mr-2" />
          Add Mediator
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mediators.map((mediator) => (
          <Card key={mediator.id} style={{ borderRadius: '3px' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BootstrapIcon name="person" className="text-blue-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold font-heading">{mediator.firstName} {mediator.lastName}</h4>
                  <p className="text-sm text-gray-600 font-body">{mediator.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant={mediator.availability === 'available' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {mediator.availability}
                    </Badge>
                    <span className="text-xs text-gray-500 font-body">
                      {mediator.activeDisputes}/{mediator.maxDisputes} cases
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-body">
                  <span>Success Rate:</span>
                  <span className="font-medium">{(mediator.successRate * 100).toFixed(1)}%</span>
                </div>
                <Progress value={mediator.successRate * 100} className="h-2" />

                <div className="flex justify-between text-sm font-body">
                  <span>Rating:</span>
                  <span className="font-medium">{mediator.rating}/5.0</span>
                </div>
                <Progress value={mediator.rating * 20} className="h-2" />

                <div className="text-xs text-gray-600 font-body">
                  <p>Specializations: {mediator.specializations.slice(0, 2).join(', ')}</p>
                  <p>Experience: {mediator.experience} years</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Analytics View Component (existing code)
function AnalyticsView({ statistics }: { statistics: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card style={{ borderRadius: '3px' }}>
          <CardHeader>
            <CardTitle className="font-heading">Top Dispute Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.topDisputeTypes.map((type: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="capitalize font-body">{type.type.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={type.percentage} className="w-20" />
                    <span className="text-sm font-medium font-body">{type.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderRadius: '3px' }}>
          <CardHeader>
            <CardTitle className="font-heading">Resolution Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between font-body">
              <span>Resolution Rate:</span>
              <span className="font-medium">{(statistics.resolutionRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between font-body">
              <span>Avg Resolution Time:</span>
              <span className="font-medium">{statistics.averageResolutionTime.toFixed(1)} hours</span>
            </div>
            <div className="flex justify-between font-body">
              <span>Customer Satisfaction:</span>
              <span className="font-medium">{statistics.customerSatisfactionScore.toFixed(1)}/5.0</span>
            </div>
            <div className="flex justify-between font-body">
              <span>Cost per Resolution:</span>
              <span className="font-medium">${statistics.costPerResolution.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Resolution Templates View Component (existing code)
function ResolutionTemplatesView() {
  return (
    <Card style={{ borderRadius: '3px' }}>
      <CardHeader>
        <CardTitle className="font-heading">Resolution Templates</CardTitle>
        <CardDescription className="font-body">
          Pre-defined resolution workflows for common dispute types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <BootstrapIcon name="file-text" className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 font-heading">Resolution Templates</h3>
          <p className="text-gray-500 font-body">
            Standardized resolution processes will be available here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Dispute Details Modal Component (existing code with font family updates)
function DisputeDetailsModal({ 
  dispute, 
  userRole, 
  onClose, 
  onAddEvidence, 
  onProposeResolution,
  onApproveResolution 
}: {
  dispute: Dispute;
  userRole: string;
  onClose: () => void;
  onAddEvidence: (disputeId: string, evidence: any) => void;
  onProposeResolution: (disputeId: string, type: string, amount?: number) => void;
  onApproveResolution: (disputeId: string, approvedBy: string, notes?: string) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" style={{ borderRadius: '3px' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold font-heading">Dispute Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <BootstrapIcon name="x" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 font-heading">Dispute Information</h3>
              <div className="space-y-2 text-sm font-body">
                <p><span className="font-medium">ID:</span> {dispute.id}</p>
                <p><span className="font-medium">Subject:</span> {dispute.subject}</p>
                <p><span className="font-medium">Status:</span> <Badge variant="outline">{dispute.status}</Badge></p>
                <p><span className="font-medium">Priority:</span> <Badge variant="outline">{dispute.priority}</Badge></p>
                <p><span className="font-medium">Type:</span> {dispute.type.replace('_', ' ')}</p>
                <p><span className="font-medium">Order ID:</span> {dispute.orderId}</p>
                <p><span className="font-medium">Created:</span> {dispute.createdAt.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 font-heading">Description</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded font-body">{dispute.description}</p>
            </div>

            {dispute.evidence.length > 0 && (
              <div>
                <h3 className="font-medium mb-2 font-heading">Evidence ({dispute.evidence.length})</h3>
                <div className="space-y-2">
                  {dispute.evidence.map((evidence) => (
                    <div key={evidence.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                      <BootstrapIcon name={evidence.type === 'image' ? 'image' : 'file-text'} />
                      <span className="flex-1 font-body">{evidence.description}</span>
                      <span className="text-xs text-gray-500 font-body">
                        {evidence.uploadedAt.toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 font-heading">Timeline</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {dispute.timeline.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-medium font-body">{event.description}</p>
                      <p className="text-xs text-gray-500 font-body">
                        {event.timestamp.toLocaleString()} • {event.performedBy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {dispute.resolution && (
              <div>
                <h3 className="font-medium mb-2 font-heading">Proposed Resolution</h3>
                <div className="p-3 bg-green-50 rounded text-sm">
                  <p className="font-body"><span className="font-medium">Type:</span> {dispute.resolution.type}</p>
                  <p className="font-body"><span className="font-medium">Description:</span> {dispute.resolution.description}</p>
                  {dispute.resolution.amount && (
                    <p className="font-body"><span className="font-medium">Amount:</span> ${dispute.resolution.amount}</p>
                  )}
                </div>
              </div>
            )}

            {(userRole === 'admin' || userRole === 'mediator') && (
              <div className="space-y-2">
                <h3 className="font-medium font-heading">Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="btn-moema-secondary">
                    Add Evidence
                  </Button>
                  {dispute.status === 'mediation' && (
                    <Button size="sm" className="btn-moema-primary">
                      Propose Resolution
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}