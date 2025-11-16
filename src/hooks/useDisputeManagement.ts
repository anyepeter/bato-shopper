import { useState, useCallback, useEffect } from 'react';
import { Dispute, DisputeResolution, Evidence, DisputeEvent } from '../types';

interface DisputeManagementState {
  disputes: Dispute[];
  mediators: Mediator[];
  resolutionTemplates: ResolutionTemplate[];
  escalationRules: EscalationRule[];
  isLoading: boolean;
  error: string | null;
  statistics: DisputeStatistics;
}

interface Mediator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specializations: string[];
  languages: string[];
  experience: number;
  successRate: number;
  activeDisputes: number;
  maxDisputes: number;
  rating: number;
  certifications: string[];
  availability: 'available' | 'busy' | 'offline';
  hourlyRate: number;
}

interface ResolutionTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  steps: ResolutionStep[];
  estimatedTime: number;
  successRate: number;
  applicableTypes: string[];
}

interface ResolutionStep {
  id: string;
  title: string;
  description: string;
  type: 'investigation' | 'communication' | 'decision' | 'action';
  estimatedDuration: number;
  requiredEvidence: string[];
  automatable: boolean;
}

interface EscalationRule {
  id: string;
  name: string;
  conditions: EscalationCondition[];
  action: 'assign_mediator' | 'increase_priority' | 'notify_management' | 'legal_review';
  triggerAfterHours: number;
  description: string;
}

interface EscalationCondition {
  type: 'time_elapsed' | 'dispute_value' | 'customer_tier' | 'repeat_customer' | 'vendor_rating';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

interface DisputeStatistics {
  totalDisputes: number;
  openDisputes: number;
  resolvedDisputes: number;
  averageResolutionTime: number;
  resolutionRate: number;
  customerSatisfactionScore: number;
  mediatorUtilization: number;
  costPerResolution: number;
  topDisputeTypes: Array<{ type: string; count: number; percentage: number }>;
  monthlyTrends: Array<{ month: string; disputes: number; resolved: number; satisfaction: number }>;
}

const initialState: DisputeManagementState = {
  disputes: [],
  mediators: [],
  resolutionTemplates: [],
  escalationRules: [],
  isLoading: false,
  error: null,
  statistics: {
    totalDisputes: 0,
    openDisputes: 0,
    resolvedDisputes: 0,
    averageResolutionTime: 0,
    resolutionRate: 0,
    customerSatisfactionScore: 0,
    mediatorUtilization: 0,
    costPerResolution: 0,
    topDisputeTypes: [],
    monthlyTrends: [],
  },
};

export function useDisputeManagement() {
  const [state, setState] = useState<DisputeManagementState>(initialState);

  // 📝 DISPUTE CREATION AND MANAGEMENT
  const createDispute = useCallback(async (disputeData: Omit<Dispute, 'id' | 'status' | 'timeline' | 'createdAt'>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newDispute: Dispute = {
        ...disputeData,
        id: `dispute_${Date.now()}`,
        status: 'open',
        timeline: [{
          id: `event_${Date.now()}`,
          action: 'dispute_created',
          description: 'Dispute was created by customer',
          performedBy: disputeData.customerId,
          timestamp: new Date(),
          metadata: { initialType: disputeData.type },
        }],
        createdAt: new Date(),
      };

      setState(prev => ({
        ...prev,
        disputes: [...prev.disputes, newDispute],
        isLoading: false,
      }));

      // Auto-assign based on dispute type and complexity
      await autoAssignMediator(newDispute.id);
      
      // Check escalation rules
      await checkEscalationRules(newDispute.id);

      return newDispute;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create dispute',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // 🎯 AUTO-ASSIGNMENT ALGORITHM
  const autoAssignMediator = useCallback(async (disputeId: string) => {
    const dispute = state.disputes.find(d => d.id === disputeId);
    if (!dispute) return;

    // Find best available mediator based on specialization and workload
    const availableMediators = state.mediators.filter(m => 
      m.availability === 'available' &&
      m.activeDisputes < m.maxDisputes &&
      m.specializations.some(spec => 
        spec.toLowerCase().includes(dispute.type.toLowerCase()) ||
        spec.toLowerCase().includes(dispute.category.toLowerCase())
      )
    );

    if (availableMediators.length === 0) {
      // No specialized mediators available, use general mediator
      const generalMediators = state.mediators.filter(m => 
        m.availability === 'available' && m.activeDisputes < m.maxDisputes
      );
      
      if (generalMediators.length === 0) {
        await escalateDispute(disputeId, 'No mediators available');
        return;
      }
    }

    // Score mediators based on multiple factors
    const scoredMediators = availableMediators.map(mediator => ({
      mediator,
      score: calculateMediatorScore(mediator, dispute),
    })).sort((a, b) => b.score - a.score);

    const bestMediator = scoredMediators[0].mediator;

    // Assign mediator to dispute
    setState(prev => ({
      ...prev,
      disputes: prev.disputes.map(d =>
        d.id === disputeId
          ? { 
              ...d, 
              assignedMediator: bestMediator.id,
              status: 'investigation',
              timeline: [...d.timeline, {
                id: `event_${Date.now()}`,
                action: 'mediator_assigned',
                description: `Mediator ${bestMediator.firstName} ${bestMediator.lastName} assigned`,
                performedBy: 'system',
                timestamp: new Date(),
                metadata: { mediatorId: bestMediator.id },
              }],
            }
          : d
      ),
      mediators: prev.mediators.map(m =>
        m.id === bestMediator.id
          ? { ...m, activeDisputes: m.activeDisputes + 1 }
          : m
      ),
    }));

    // Notify mediator of assignment
    await notifyMediatorAssignment(bestMediator.id, disputeId);
  }, [state.disputes, state.mediators]);

  // ⚖️ MEDIATION PROCESS
  const startMediation = useCallback(async (disputeId: string, mediatorNotes?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setState(prev => ({
        ...prev,
        disputes: prev.disputes.map(d =>
          d.id === disputeId
            ? {
                ...d,
                status: 'mediation',
                timeline: [...d.timeline, {
                  id: `event_${Date.now()}`,
                  action: 'mediation_started',
                  description: 'Mediation process initiated',
                  performedBy: d.assignedMediator || 'system',
                  timestamp: new Date(),
                  metadata: { notes: mediatorNotes },
                }],
              }
            : d
        ),
        isLoading: false,
      }));

      // Start automated mediation workflow
      await initiateResolutionProcess(disputeId);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to start mediation',
        isLoading: false,
      }));
    }
  }, []);

  // 📋 RESOLUTION PROCESS
  const proposeResolution = useCallback(async (
    disputeId: string, 
    resolution: Omit<DisputeResolution, 'resolvedBy' | 'approvedBy'>
  ) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const dispute = state.disputes.find(d => d.id === disputeId);
      if (!dispute) throw new Error('Dispute not found');

      const proposedResolution: DisputeResolution = {
        ...resolution,
        resolvedBy: dispute.assignedMediator || 'system',
      };

      setState(prev => ({
        ...prev,
        disputes: prev.disputes.map(d =>
          d.id === disputeId
            ? {
                ...d,
                status: 'resolution_pending',
                resolution: proposedResolution,
                timeline: [...d.timeline, {
                  id: `event_${Date.now()}`,
                  action: 'resolution_proposed',
                  description: `Resolution proposed: ${resolution.type}`,
                  performedBy: dispute.assignedMediator || 'system',
                  timestamp: new Date(),
                  metadata: { resolutionType: resolution.type, amount: resolution.amount },
                }],
              }
            : d
        ),
        isLoading: false,
      }));

      // Notify involved parties
      await notifyResolutionProposed(disputeId, proposedResolution);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to propose resolution',
        isLoading: false,
      }));
    }
  }, [state.disputes]);

  // ✅ RESOLUTION APPROVAL
  const approveResolution = useCallback(async (disputeId: string, approvedBy: string, notes?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setState(prev => ({
        ...prev,
        disputes: prev.disputes.map(d =>
          d.id === disputeId && d.resolution
            ? {
                ...d,
                status: 'resolved',
                resolvedAt: new Date(),
                resolution: {
                  ...d.resolution,
                  approvedBy,
                },
                timeline: [...d.timeline, {
                  id: `event_${Date.now()}`,
                  action: 'resolution_approved',
                  description: 'Resolution approved and implemented',
                  performedBy: approvedBy,
                  timestamp: new Date(),
                  metadata: { notes },
                }],
              }
            : d
        ),
        isLoading: false,
      }));

      // Execute resolution actions
      await executeResolution(disputeId);
      
      // Update mediator availability
      const dispute = state.disputes.find(d => d.id === disputeId);
      if (dispute?.assignedMediator) {
        setState(prev => ({
          ...prev,
          mediators: prev.mediators.map(m =>
            m.id === dispute.assignedMediator
              ? { ...m, activeDisputes: Math.max(0, m.activeDisputes - 1) }
              : m
          ),
        }));
      }

      // Send completion notifications
      await notifyResolutionCompleted(disputeId);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to approve resolution',
        isLoading: false,
      }));
    }
  }, [state.disputes]);

  // 📈 ESCALATION MANAGEMENT
  const escalateDispute = useCallback(async (disputeId: string, reason: string) => {
    setState(prev => ({
      ...prev,
      disputes: prev.disputes.map(d =>
        d.id === disputeId
          ? {
              ...d,
              status: 'escalated',
              priority: 'urgent',
              timeline: [...d.timeline, {
                id: `event_${Date.now()}`,
                action: 'dispute_escalated',
                description: `Dispute escalated: ${reason}`,
                performedBy: 'system',
                timestamp: new Date(),
                metadata: { escalationReason: reason },
              }],
            }
          : d
      ),
    }));

    // Notify management
    await notifyManagementEscalation(disputeId, reason);
  }, []);

  // 📊 ANALYTICS AND REPORTING
  const getDisputeAnalytics = useCallback((timeRange: { from: Date; to: Date }) => {
    const filteredDisputes = state.disputes.filter(
      d => d.createdAt >= timeRange.from && d.createdAt <= timeRange.to
    );

    const totalDisputes = filteredDisputes.length;
    const resolvedDisputes = filteredDisputes.filter(d => d.status === 'resolved');
    const averageResolutionTime = resolvedDisputes.length > 0
      ? resolvedDisputes.reduce((sum, d) => {
          const resolutionTime = d.resolvedAt ? d.resolvedAt.getTime() - d.createdAt.getTime() : 0;
          return sum + resolutionTime;
        }, 0) / resolvedDisputes.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    const disputeTypeBreakdown = filteredDisputes.reduce((acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topDisputeTypes = Object.entries(disputeTypeBreakdown)
      .map(([type, count]) => ({
        type,
        count,
        percentage: (count / totalDisputes) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalDisputes,
      openDisputes: filteredDisputes.filter(d => ['open', 'investigation', 'mediation'].includes(d.status)).length,
      resolvedDisputes: resolvedDisputes.length,
      averageResolutionTime,
      resolutionRate: totalDisputes > 0 ? (resolvedDisputes.length / totalDisputes) : 0,
      customerSatisfactionScore: calculateCustomerSatisfaction(resolvedDisputes),
      mediatorUtilization: calculateMediatorUtilization(),
      costPerResolution: calculateAverageResolutionCost(resolvedDisputes),
      topDisputeTypes,
      monthlyTrends: generateMonthlyTrends(filteredDisputes),
    };
  }, [state.disputes, state.mediators]);

  // 🔍 EVIDENCE MANAGEMENT
  const addEvidence = useCallback(async (disputeId: string, evidence: Omit<Evidence, 'id' | 'uploadedAt'>) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newEvidence: Evidence = {
        ...evidence,
        id: `evidence_${Date.now()}`,
        uploadedAt: new Date(),
      };

      setState(prev => ({
        ...prev,
        disputes: prev.disputes.map(d =>
          d.id === disputeId
            ? {
                ...d,
                evidence: [...d.evidence, newEvidence],
                timeline: [...d.timeline, {
                  id: `event_${Date.now()}`,
                  action: 'evidence_added',
                  description: `New ${evidence.type} evidence added: ${evidence.description}`,
                  performedBy: evidence.uploadedBy,
                  timestamp: new Date(),
                  metadata: { evidenceType: evidence.type, evidenceId: newEvidence.id },
                }],
              }
            : d
        ),
        isLoading: false,
      }));

      return newEvidence;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to add evidence',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // Initialize dispute management system
  useEffect(() => {
    const initializeDisputeSystem = async () => {
      setState(prev => ({ ...prev, isLoading: true }));

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockMediators = generateMockMediators();
        const mockTemplates = generateMockResolutionTemplates();
        const mockRules = generateMockEscalationRules();
        const mockDisputes = generateMockDisputes();

        setState(prev => ({
          ...prev,
          mediators: mockMediators,
          resolutionTemplates: mockTemplates,
          escalationRules: mockRules,
          disputes: mockDisputes,
          isLoading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to initialize dispute system',
          isLoading: false,
        }));
      }
    };

    initializeDisputeSystem();
  }, []);

  // Update statistics periodically
  useEffect(() => {
    const updateStatistics = () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const analytics = getDisputeAnalytics({ from: thirtyDaysAgo, to: now });
      
      setState(prev => ({ ...prev, statistics: analytics }));
    };

    updateStatistics();
    const interval = setInterval(updateStatistics, 5 * 60 * 1000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [getDisputeAnalytics, state.disputes]);

  return {
    // State
    ...state,
    
    // Dispute Management
    createDispute,
    escalateDispute,
    
    // Mediation
    autoAssignMediator,
    startMediation,
    
    // Resolution
    proposeResolution,
    approveResolution,
    
    // Evidence
    addEvidence,
    
    // Analytics
    getDisputeAnalytics,
  };
}

// 🔧 HELPER FUNCTIONS

function calculateMediatorScore(mediator: Mediator, dispute: Dispute): number {
  let score = 100;
  
  // Success rate factor (0-40 points)
  score += (mediator.successRate - 0.5) * 80;
  
  // Experience factor (0-20 points)
  score += Math.min(mediator.experience * 2, 20);
  
  // Workload factor (-0 to -20 points)
  const workloadRatio = mediator.activeDisputes / mediator.maxDisputes;
  score -= workloadRatio * 20;
  
  // Specialization bonus (+15 points if specialized)
  const hasSpecialization = mediator.specializations.some(spec =>
    spec.toLowerCase().includes(dispute.type.toLowerCase())
  );
  if (hasSpecialization) score += 15;
  
  // Rating factor (0-15 points)
  score += (mediator.rating - 3) * 7.5;
  
  return Math.max(0, score);
}

async function checkEscalationRules(disputeId: string) {
  // Implementation would check escalation rules and trigger actions
  console.log(`Checking escalation rules for dispute: ${disputeId}`);
}

async function initiateResolutionProcess(disputeId: string) {
  // Implementation would start automated resolution workflow
  console.log(`Initiating resolution process for dispute: ${disputeId}`);
}

async function executeResolution(disputeId: string) {
  // Implementation would execute resolution actions (refunds, replacements, etc.)
  console.log(`Executing resolution for dispute: ${disputeId}`);
}

async function notifyMediatorAssignment(mediatorId: string, disputeId: string) {
  console.log(`Notifying mediator ${mediatorId} of dispute assignment: ${disputeId}`);
}

async function notifyResolutionProposed(disputeId: string, resolution: DisputeResolution) {
  console.log(`Notifying parties of proposed resolution for dispute: ${disputeId}`, resolution);
}

async function notifyResolutionCompleted(disputeId: string) {
  console.log(`Notifying parties of completed resolution for dispute: ${disputeId}`);
}

async function notifyManagementEscalation(disputeId: string, reason: string) {
  console.log(`Notifying management of escalated dispute: ${disputeId} - ${reason}`);
}

function calculateCustomerSatisfaction(resolvedDisputes: Dispute[]): number {
  // Mock calculation - would be based on actual customer feedback
  return 4.2 + Math.random() * 0.6;
}

function calculateMediatorUtilization(): number {
  // Mock calculation - would be based on actual mediator workload
  return 0.75 + Math.random() * 0.2;
}

function calculateAverageResolutionCost(resolvedDisputes: Dispute[]): number {
  // Mock calculation - would include mediator costs, refunds, etc.
  return 45 + Math.random() * 30;
}

function generateMonthlyTrends(disputes: Dispute[]) {
  // Generate mock monthly trends
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    disputes: Math.floor(Math.random() * 50) + 20,
    resolved: Math.floor(Math.random() * 45) + 15,
    satisfaction: 4.0 + Math.random() * 1.0,
  }));
}

function generateMockMediators(): Mediator[] {
  return [
    {
      id: 'mediator_001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@bato.com',
      specializations: ['product_quality', 'shipping_delay', 'billing_issue'],
      languages: ['English', 'French'],
      experience: 5,
      successRate: 0.89,
      activeDisputes: 3,
      maxDisputes: 8,
      rating: 4.7,
      certifications: ['Certified Mediator', 'E-commerce Resolution Specialist'],
      availability: 'available',
      hourlyRate: 75,
    },
    {
      id: 'mediator_002',
      firstName: 'Michael',
      lastName: 'Thompson',
      email: 'michael.thompson@bato.com',
      specializations: ['return_refund', 'damaged_goods', 'policy_violation'],
      languages: ['English', 'Spanish'],
      experience: 8,
      successRate: 0.92,
      activeDisputes: 5,
      maxDisputes: 10,
      rating: 4.8,
      certifications: ['Senior Mediator', 'Customer Relations Expert'],
      availability: 'busy',
      hourlyRate: 95,
    },
  ];
}

function generateMockResolutionTemplates(): ResolutionTemplate[] {
  return [
    {
      id: 'template_001',
      name: 'Product Quality Issue',
      category: 'product_issues',
      description: 'Standard resolution process for product quality complaints',
      steps: [
        {
          id: 'step_001',
          title: 'Initial Investigation',
          description: 'Review order details and customer complaint',
          type: 'investigation',
          estimatedDuration: 30,
          requiredEvidence: ['order_details', 'customer_photos'],
          automatable: true,
        },
        {
          id: 'step_002',
          title: 'Vendor Contact',
          description: 'Contact vendor for their response',
          type: 'communication',
          estimatedDuration: 60,
          requiredEvidence: ['vendor_response'],
          automatable: false,
        },
      ],
      estimatedTime: 90,
      successRate: 0.85,
      applicableTypes: ['product_quality', 'incorrect_item', 'damaged_goods'],
    },
  ];
}

function generateMockEscalationRules(): EscalationRule[] {
  return [
    {
      id: 'rule_001',
      name: 'High Value Dispute Auto-Escalation',
      conditions: [
        {
          type: 'dispute_value',
          operator: 'greater_than',
          value: 500,
        },
      ],
      action: 'assign_mediator',
      triggerAfterHours: 2,
      description: 'Automatically assign senior mediator for high-value disputes',
    },
  ];
}

function generateMockDisputes(): Dispute[] {
  return [
    {
      id: 'dispute_001',
      orderId: 'order_001',
      customerId: 'customer_1',
      vendorId: 'vendor_1',
      type: 'product_quality',
      subject: 'Received damaged African dress',
      description: 'The traditional Ankara dress I ordered arrived with tears in the fabric and loose threading. This is unacceptable quality for the price paid.',
      status: 'investigation',
      priority: 'high',
      category: 'order_issues',
      evidence: [
        {
          id: 'evidence_001',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
          description: 'Photo showing fabric damage',
          uploadedBy: 'customer_1',
          uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
      ],
      timeline: [
        {
          id: 'event_001',
          action: 'dispute_created',
          description: 'Customer reported damaged product',
          performedBy: 'customer_1',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          metadata: { channel: 'customer_portal' },
        },
        {
          id: 'event_002',
          action: 'mediator_assigned',
          description: 'Dispute assigned to Sarah Johnson',
          performedBy: 'system',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          metadata: { mediatorId: 'mediator_001' },
        },
      ],
      assignedMediator: 'mediator_001',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
  ];
}