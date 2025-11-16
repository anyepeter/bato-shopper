import { useState, useCallback, useEffect } from 'react';
import { Notification, NotificationType, NotificationChannel } from '../types';

interface NotificationSystemState {
  notifications: Notification[];
  notificationSettings: NotificationSettings;
  templates: NotificationTemplate[];
  campaigns: NotificationCampaign[];
  analytics: NotificationAnalytics;
  isLoading: boolean;
  error: string | null;
}

interface NotificationSettings {
  userId: string;
  preferences: UserNotificationPreferences;
  channels: ChannelSettings;
  globalSettings: GlobalNotificationSettings;
}

interface UserNotificationPreferences {
  orderUpdates: boolean;
  shippingAlerts: boolean;
  promotions: boolean;
  disputeUpdates: boolean;
  performanceReports: boolean;
  payoutNotifications: boolean;
  systemMaintenance: boolean;
  partnerOpportunities: boolean;
}

interface ChannelSettings {
  email: EmailSettings;
  sms: SMSSettings;
  push: PushSettings;
  inApp: InAppSettings;
}

interface EmailSettings {
  enabled: boolean;
  address: string;
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
  htmlFormat: boolean;
}

interface SMSSettings {
  enabled: boolean;
  phoneNumber: string;
  urgentOnly: boolean;
  timeZone: string;
  quietHours: { start: string; end: string };
}

interface PushSettings {
  enabled: boolean;
  deviceTokens: string[];
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

interface InAppSettings {
  enabled: boolean;
  showBadges: boolean;
  autoMarkAsRead: boolean;
  groupSimilar: boolean;
}

interface GlobalNotificationSettings {
  maxDailyNotifications: number;
  rateLimitPerHour: number;
  emergencyBypass: boolean;
  maintenanceMode: boolean;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  channels: NotificationChannel[];
  subject: string;
  bodyTemplate: string;
  variables: TemplateVariable[];
  styling: NotificationStyling;
  conditions: TriggerCondition[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'currency' | 'boolean';
  required: boolean;
  defaultValue?: any;
  description: string;
}

interface NotificationStyling {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  logoUrl?: string;
  customCSS?: string;
}

interface TriggerCondition {
  event: string;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in_array';
    value: any;
  }>;
  delay?: number; // Minutes
}

interface NotificationCampaign {
  id: string;
  name: string;
  description: string;
  targetAudience: AudienceSegment;
  template: NotificationTemplate;
  schedule: CampaignSchedule;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  metrics: CampaignMetrics;
  createdAt: Date;
  launchDate?: Date;
}

interface AudienceSegment {
  id: string;
  name: string;
  criteria: SegmentCriteria[];
  estimatedSize: number;
  userIds?: string[];
}

interface SegmentCriteria {
  field: string;
  operator: string;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

interface CampaignSchedule {
  type: 'immediate' | 'scheduled' | 'recurring';
  startDate?: Date;
  endDate?: Date;
  frequency?: 'daily' | 'weekly' | 'monthly';
  timeZone: string;
  sendTime?: string;
}

interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  unsubscribed: number;
  bounced: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

interface NotificationAnalytics {
  totalSent: number;
  deliveryRate: number;
  engagementRate: number;
  channelPerformance: ChannelPerformance[];
  typePerformance: TypePerformance[];
  userEngagement: UserEngagementMetrics;
  trends: NotificationTrends;
}

interface ChannelPerformance {
  channel: NotificationChannel;
  sent: number;
  delivered: number;
  engaged: number;
  deliveryRate: number;
  engagementRate: number;
  avgResponseTime: number;
}

interface TypePerformance {
  type: NotificationType;
  sent: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
  effectiveness: number;
}

interface UserEngagementMetrics {
  activeUsers: number;
  avgNotificationsPerUser: number;
  mostEngagedSegment: string;
  optOutRate: number;
  reEngagementSuccess: number;
}

interface NotificationTrends {
  daily: Array<{ date: string; sent: number; engaged: number }>;
  hourly: Array<{ hour: number; sent: number; engaged: number }>;
  performance: Array<{ metric: string; current: number; previous: number; change: number }>;
}

const initialState: NotificationSystemState = {
  notifications: [],
  notificationSettings: {
    userId: '',
    preferences: {
      orderUpdates: true,
      shippingAlerts: true,
      promotions: false,
      disputeUpdates: true,
      performanceReports: true,
      payoutNotifications: true,
      systemMaintenance: true,
      partnerOpportunities: true,
    },
    channels: {
      email: {
        enabled: true,
        address: '',
        frequency: 'instant',
        htmlFormat: true,
      },
      sms: {
        enabled: false,
        phoneNumber: '',
        urgentOnly: true,
        timeZone: 'Africa/Douala',
        quietHours: { start: '22:00', end: '08:00' },
      },
      push: {
        enabled: true,
        deviceTokens: [],
        soundEnabled: true,
        vibrationEnabled: true,
      },
      inApp: {
        enabled: true,
        showBadges: true,
        autoMarkAsRead: false,
        groupSimilar: true,
      },
    },
    globalSettings: {
      maxDailyNotifications: 50,
      rateLimitPerHour: 10,
      emergencyBypass: true,
      maintenanceMode: false,
    },
  },
  templates: [],
  campaigns: [],
  analytics: {
    totalSent: 0,
    deliveryRate: 0,
    engagementRate: 0,
    channelPerformance: [],
    typePerformance: [],
    userEngagement: {
      activeUsers: 0,
      avgNotificationsPerUser: 0,
      mostEngagedSegment: '',
      optOutRate: 0,
      reEngagementSuccess: 0,
    },
    trends: {
      daily: [],
      hourly: [],
      performance: [],
    },
  },
  isLoading: false,
  error: null,
};

export function useNotificationSystem() {
  const [state, setState] = useState<NotificationSystemState>(initialState);

  // 📤 SEND NOTIFICATION
  const sendNotification = useCallback(async (
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>,
    channels?: NotificationChannel[]
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get user settings to determine delivery channels
      const userSettings = await getUserNotificationSettings(userId);
      const deliveryChannels = channels || determineOptimalChannels(type, userSettings);

      // Create notification record
      const notification: Notification = {
        id: `notif_${Date.now()}`,
        userId,
        userType: 'customer', // Would be determined from user context
        type,
        channel: deliveryChannels,
        title,
        message,
        data: data || {},
        priority: determinePriority(type),
        status: 'pending',
        createdAt: new Date(),
      };

      setState(prev => ({
        ...prev,
        notifications: [...prev.notifications, notification],
        isLoading: false,
      }));

      // Send through each channel
      for (const channel of deliveryChannels) {
        await deliverThroughChannel(notification, channel, userSettings);
      }

      // Update notification status
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n =>
          n.id === notification.id
            ? { ...n, status: 'sent', sentAt: new Date() }
            : n
        ),
      }));

      return notification;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to send notification',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // 📨 BULK NOTIFICATION SENDING
  const sendBulkNotification = useCallback(async (
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>
  ) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const notifications: Notification[] = [];
      
      // Process in batches to avoid overwhelming the system
      const batchSize = 100;
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        
        const batchNotifications = await Promise.all(
          batch.map(async (userId) => {
            const notification: Notification = {
              id: `notif_${Date.now()}_${userId}`,
              userId,
              userType: 'customer',
              type,
              channel: ['email', 'push'], // Default channels for bulk
              title,
              message,
              data: data || {},
              priority: 'normal',
              status: 'pending',
              createdAt: new Date(),
            };

            // Send notification
            await simulateNotificationDelivery(notification);
            return { ...notification, status: 'sent' as const, sentAt: new Date() };
          })
        );

        notifications.push(...batchNotifications);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setState(prev => ({
        ...prev,
        notifications: [...prev.notifications, ...notifications],
        isLoading: false,
      }));

      return notifications;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to send bulk notifications',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // 🎯 SMART NOTIFICATION TARGETING
  const sendTargetedNotification = useCallback(async (
    segment: AudienceSegment,
    templateId: string,
    variables: Record<string, any>
  ) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const template = state.templates.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      // Get users in segment
      const targetUsers = await resolveAudienceSegment(segment);
      
      // Personalize message for each user
      const notifications = await Promise.all(
        targetUsers.map(async (user) => {
          const personalizedMessage = await personalizeTemplate(template, variables, user);
          
          return sendNotification(
            user.id,
            template.type,
            personalizedMessage.subject,
            personalizedMessage.body,
            variables,
            template.channels
          );
        })
      );

      setState(prev => ({ ...prev, isLoading: false }));
      return notifications;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to send targeted notification',
        isLoading: false,
      }));
      throw error;
    }
  }, [state.templates, sendNotification]);

  // ⚡ REAL-TIME EVENT-DRIVEN NOTIFICATIONS
  const triggerEventNotification = useCallback(async (
    event: string,
    eventData: Record<string, any>
  ) => {
    // Find templates that match this event
    const matchingTemplates = state.templates.filter(template =>
      template.conditions.some(condition => condition.event === event)
    );

    for (const template of matchingTemplates) {
      // Check if conditions are met
      const conditionsMet = await evaluateConditions(template.conditions, eventData);
      
      if (conditionsMet) {
        // Determine target users based on event data
        const targetUsers = await getEventTargetUsers(event, eventData);
        
        // Send notifications
        for (const userId of targetUsers) {
          // Apply delay if specified
          const delay = template.conditions[0]?.delay || 0;
          
          if (delay > 0) {
            setTimeout(async () => {
              await sendNotification(
                userId,
                template.type,
                template.subject,
                await renderTemplate(template.bodyTemplate, eventData),
                eventData,
                template.channels
              );
            }, delay * 60 * 1000);
          } else {
            await sendNotification(
              userId,
              template.type,
              template.subject,
              await renderTemplate(template.bodyTemplate, eventData),
              eventData,
              template.channels
            );
          }
        }
      }
    }
  }, [state.templates, sendNotification]);

  // 📊 NOTIFICATION ANALYTICS
  const getNotificationAnalytics = useCallback((timeRange: { from: Date; to: Date }) => {
    const filteredNotifications = state.notifications.filter(
      n => n.createdAt >= timeRange.from && n.createdAt <= timeRange.to
    );

    const totalSent = filteredNotifications.length;
    const delivered = filteredNotifications.filter(n => n.status === 'delivered').length;
    const read = filteredNotifications.filter(n => n.readAt).length;

    // Channel performance
    const channelPerformance: ChannelPerformance[] = ['email', 'sms', 'push', 'in_app']
      .map(channel => {
        const channelNotifications = filteredNotifications.filter(n => 
          n.channel.includes(channel as NotificationChannel)
        );
        const channelDelivered = channelNotifications.filter(n => n.status === 'delivered').length;
        const channelEngaged = channelNotifications.filter(n => n.readAt).length;

        return {
          channel: channel as NotificationChannel,
          sent: channelNotifications.length,
          delivered: channelDelivered,
          engaged: channelEngaged,
          deliveryRate: channelNotifications.length > 0 ? channelDelivered / channelNotifications.length : 0,
          engagementRate: channelDelivered > 0 ? channelEngaged / channelDelivered : 0,
          avgResponseTime: calculateAverageResponseTime(channelNotifications),
        };
      });

    // Type performance
    const typePerformance: TypePerformance[] = Object.keys(
      filteredNotifications.reduce((acc, n) => ({ ...acc, [n.type]: true }), {})
    ).map(type => {
      const typeNotifications = filteredNotifications.filter(n => n.type === type);
      const typeRead = typeNotifications.filter(n => n.readAt).length;

      return {
        type: type as NotificationType,
        sent: typeNotifications.length,
        opened: typeRead,
        clicked: Math.floor(typeRead * 0.3), // Mock click data
        openRate: typeNotifications.length > 0 ? typeRead / typeNotifications.length : 0,
        clickRate: typeRead > 0 ? Math.floor(typeRead * 0.3) / typeRead : 0,
        effectiveness: calculateEffectiveness(typeNotifications),
      };
    });

    return {
      totalSent,
      deliveryRate: totalSent > 0 ? delivered / totalSent : 0,
      engagementRate: delivered > 0 ? read / delivered : 0,
      channelPerformance,
      typePerformance,
      userEngagement: calculateUserEngagement(filteredNotifications),
      trends: generateNotificationTrends(filteredNotifications),
    };
  }, [state.notifications]);

  // ⚙️ SETTINGS MANAGEMENT
  const updateNotificationSettings = useCallback(async (
    userId: string,
    settings: Partial<NotificationSettings>
  ) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setState(prev => ({
        ...prev,
        notificationSettings: {
          ...prev.notificationSettings,
          ...settings,
          userId,
        },
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to update notification settings',
        isLoading: false,
      }));
    }
  }, []);

  // 📋 TEMPLATE MANAGEMENT
  const createNotificationTemplate = useCallback(async (
    template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newTemplate: NotificationTemplate = {
        ...template,
        id: `template_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setState(prev => ({
        ...prev,
        templates: [...prev.templates, newTemplate],
        isLoading: false,
      }));

      return newTemplate;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create notification template',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // 🎯 CAMPAIGN MANAGEMENT
  const createNotificationCampaign = useCallback(async (
    campaign: Omit<NotificationCampaign, 'id' | 'createdAt' | 'metrics'>
  ) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newCampaign: NotificationCampaign = {
        ...campaign,
        id: `campaign_${Date.now()}`,
        createdAt: new Date(),
        metrics: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          unsubscribed: 0,
          bounced: 0,
          deliveryRate: 0,
          openRate: 0,
          clickRate: 0,
          conversionRate: 0,
        },
      };

      setState(prev => ({
        ...prev,
        campaigns: [...prev.campaigns, newCampaign],
        isLoading: false,
      }));

      return newCampaign;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create notification campaign',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // Initialize notification system
  useEffect(() => {
    const initializeNotificationSystem = async () => {
      setState(prev => ({ ...prev, isLoading: true }));

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockTemplates = generateMockTemplates();
        const mockNotifications = generateMockNotifications();
        const mockCampaigns = generateMockCampaigns();

        setState(prev => ({
          ...prev,
          templates: mockTemplates,
          notifications: mockNotifications,
          campaigns: mockCampaigns,
          isLoading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to initialize notification system',
          isLoading: false,
        }));
      }
    };

    initializeNotificationSystem();
  }, []);

  return {
    // State
    ...state,
    
    // Notification Sending
    sendNotification,
    sendBulkNotification,
    sendTargetedNotification,
    
    // Event-Driven
    triggerEventNotification,
    
    // Settings
    updateNotificationSettings,
    
    // Templates
    createNotificationTemplate,
    
    // Campaigns
    createNotificationCampaign,
    
    // Analytics
    getNotificationAnalytics,
  };
}

// 🔧 HELPER FUNCTIONS

async function getUserNotificationSettings(userId: string): Promise<NotificationSettings> {
  // Mock implementation - would fetch from database
  return {
    userId,
    preferences: {
      orderUpdates: true,
      shippingAlerts: true,
      promotions: false,
      disputeUpdates: true,
      performanceReports: true,
      payoutNotifications: true,
      systemMaintenance: true,
      partnerOpportunities: true,
    },
    channels: {
      email: { enabled: true, address: 'user@example.com', frequency: 'instant', htmlFormat: true },
      sms: { enabled: false, phoneNumber: '', urgentOnly: true, timeZone: 'Africa/Douala', quietHours: { start: '22:00', end: '08:00' } },
      push: { enabled: true, deviceTokens: [], soundEnabled: true, vibrationEnabled: true },
      inApp: { enabled: true, showBadges: true, autoMarkAsRead: false, groupSimilar: true },
    },
    globalSettings: {
      maxDailyNotifications: 50,
      rateLimitPerHour: 10,
      emergencyBypass: true,
      maintenanceMode: false,
    },
  };
}

function determineOptimalChannels(type: NotificationType, settings: NotificationSettings): NotificationChannel[] {
  const channels: NotificationChannel[] = [];
  
  // Logic to determine best channels based on notification type and user preferences
  if (settings.channels.inApp.enabled && ['order_confirmation', 'delivery_notification'].includes(type)) {
    channels.push('in_app');
  }
  
  if (settings.channels.email.enabled && type !== 'security_alert') {
    channels.push('email');
  }
  
  if (settings.channels.push.enabled) {
    channels.push('push');
  }
  
  if (settings.channels.sms.enabled && ['security_alert', 'delivery_notification'].includes(type)) {
    channels.push('sms');
  }
  
  return channels.length > 0 ? channels : ['in_app']; // Fallback to in-app
}

function determinePriority(type: NotificationType): 'low' | 'normal' | 'high' | 'urgent' {
  switch (type) {
    case 'security_alert': return 'urgent';
    case 'payment_receipt':
    case 'order_confirmation': return 'high';
    case 'delivery_notification':
    case 'shipping_update': return 'normal';
    case 'promotion':
    case 'new_review': return 'low';
    default: return 'normal';
  }
}

async function deliverThroughChannel(
  notification: Notification,
  channel: NotificationChannel,
  settings: NotificationSettings
) {
  // Mock delivery implementation
  console.log(`Delivering notification ${notification.id} through ${channel}`);
  
  switch (channel) {
    case 'email':
      await simulateEmailDelivery(notification, settings.channels.email);
      break;
    case 'sms':
      await simulateSMSDelivery(notification, settings.channels.sms);
      break;
    case 'push':
      await simulatePushDelivery(notification, settings.channels.push);
      break;
    case 'in_app':
      await simulateInAppDelivery(notification);
      break;
  }
}

async function simulateEmailDelivery(notification: Notification, emailSettings: EmailSettings) {
  // Mock email delivery
  console.log(`Email sent to ${emailSettings.address}: ${notification.title}`);
}

async function simulateSMSDelivery(notification: Notification, smsSettings: SMSSettings) {
  // Mock SMS delivery
  console.log(`SMS sent to ${smsSettings.phoneNumber}: ${notification.message}`);
}

async function simulatePushDelivery(notification: Notification, pushSettings: PushSettings) {
  // Mock push notification delivery
  console.log(`Push notification sent: ${notification.title}`);
}

async function simulateInAppDelivery(notification: Notification) {
  // Mock in-app notification
  console.log(`In-app notification: ${notification.title}`);
}

async function simulateNotificationDelivery(notification: Notification) {
  // Mock notification delivery simulation
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
}

async function resolveAudienceSegment(segment: AudienceSegment): Promise<any[]> {
  // Mock implementation - would resolve users based on segment criteria
  return [
    { id: 'user_1', email: 'user1@example.com', preferences: {} },
    { id: 'user_2', email: 'user2@example.com', preferences: {} },
  ];
}

async function personalizeTemplate(template: NotificationTemplate, variables: Record<string, any>, user: any) {
  // Mock template personalization
  return {
    subject: template.subject.replace(/\{\{(\w+)\}\}/g, (match, key) => variables[key] || match),
    body: template.bodyTemplate.replace(/\{\{(\w+)\}\}/g, (match, key) => variables[key] || match),
  };
}

async function evaluateConditions(conditions: TriggerCondition[], eventData: Record<string, any>): Promise<boolean> {
  // Mock condition evaluation
  return true;
}

async function getEventTargetUsers(event: string, eventData: Record<string, any>): Promise<string[]> {
  // Mock user targeting based on event
  return ['user_1', 'user_2'];
}

async function renderTemplate(template: string, data: Record<string, any>): Promise<string> {
  // Mock template rendering
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match);
}

function calculateAverageResponseTime(notifications: Notification[]): number {
  const withResponse = notifications.filter(n => n.readAt && n.sentAt);
  if (withResponse.length === 0) return 0;
  
  const totalTime = withResponse.reduce((sum, n) => {
    const responseTime = n.readAt!.getTime() - n.sentAt!.getTime();
    return sum + responseTime;
  }, 0);
  
  return totalTime / withResponse.length / (1000 * 60); // Convert to minutes
}

function calculateEffectiveness(notifications: Notification[]): number {
  if (notifications.length === 0) return 0;
  
  const engaged = notifications.filter(n => n.readAt).length;
  return engaged / notifications.length;
}

function calculateUserEngagement(notifications: Notification[]): UserEngagementMetrics {
  const uniqueUsers = new Set(notifications.map(n => n.userId)).size;
  const avgNotificationsPerUser = uniqueUsers > 0 ? notifications.length / uniqueUsers : 0;
  
  return {
    activeUsers: uniqueUsers,
    avgNotificationsPerUser,
    mostEngagedSegment: 'Regular Customers',
    optOutRate: 0.05,
    reEngagementSuccess: 0.25,
  };
}

function generateNotificationTrends(notifications: Notification[]): NotificationTrends {
  // Generate mock trends data
  const daily = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sent: Math.floor(Math.random() * 100) + 50,
    engaged: Math.floor(Math.random() * 50) + 20,
  }));

  const hourly = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    sent: Math.floor(Math.random() * 20) + 5,
    engaged: Math.floor(Math.random() * 10) + 2,
  }));

  const performance = [
    { metric: 'Delivery Rate', current: 0.95, previous: 0.92, change: 0.03 },
    { metric: 'Open Rate', current: 0.68, previous: 0.65, change: 0.03 },
    { metric: 'Click Rate', current: 0.15, previous: 0.12, change: 0.03 },
  ];

  return { daily, hourly, performance };
}

function generateMockTemplates(): NotificationTemplate[] {
  return [
    {
      id: 'template_001',
      name: 'Order Confirmation',
      type: 'order_confirmation',
      channels: ['email', 'in_app'],
      subject: 'Order Confirmed - {{orderNumber}}',
      bodyTemplate: 'Thank you {{customerName}}! Your order {{orderNumber}} has been confirmed and will be processed shortly.',
      variables: [
        { name: 'customerName', type: 'string', required: true, description: 'Customer first name' },
        { name: 'orderNumber', type: 'string', required: true, description: 'Order number' },
      ],
      styling: {
        primaryColor: '#5825ef',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        buttonColor: '#5825ef',
      },
      conditions: [{
        event: 'order_created',
        conditions: [{ field: 'status', operator: 'equals', value: 'confirmed' }],
      }],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    },
  ];
}

function generateMockNotifications(): Notification[] {
  return [
    {
      id: 'notif_001',
      userId: 'user_1',
      userType: 'customer',
      type: 'order_confirmation',
      channel: ['email', 'in_app'],
      title: 'Order Confirmed',
      message: 'Your order #BTO12345 has been confirmed and will be processed shortly.',
      data: { orderId: 'order_001', orderNumber: 'BTO12345' },
      priority: 'high',
      status: 'delivered',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      readAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  ];
}

function generateMockCampaigns(): NotificationCampaign[] {
  return [
    {
      id: 'campaign_001',
      name: 'Summer Collection Launch',
      description: 'Announce the new summer collection to engaged customers',
      targetAudience: {
        id: 'segment_001',
        name: 'Engaged Customers',
        criteria: [
          { field: 'lastPurchase', operator: 'less_than', value: 30 },
          { field: 'totalOrders', operator: 'greater_than', value: 2 },
        ],
        estimatedSize: 1250,
      },
      template: {
        id: 'template_002',
        name: 'Product Launch',
        type: 'promotion',
        channels: ['email', 'push'],
        subject: 'New Summer Collection is Here! 🌞',
        bodyTemplate: 'Hi {{customerName}}, discover our stunning new summer collection with exclusive African-inspired designs.',
        variables: [],
        styling: {
          primaryColor: '#5825ef',
          backgroundColor: '#ffffff',
          textColor: '#333333',
          buttonColor: '#5825ef',
        },
        conditions: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      schedule: {
        type: 'scheduled',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        timeZone: 'Africa/Douala',
        sendTime: '10:00',
      },
      status: 'scheduled',
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        unsubscribed: 0,
        bounced: 0,
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0,
        conversionRate: 0,
      },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ];
}