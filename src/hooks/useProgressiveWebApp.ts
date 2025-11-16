import { useState, useCallback, useEffect } from 'react';

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  installPrompt: any;
  offlineData: OfflineData;
  syncQueue: SyncOperation[];
  notificationPermission: NotificationPermission;
  cacheStatus: CacheStatus;
  isLoading: boolean;
  error: string | null;
}

interface OfflineData {
  products: any[];
  cart: any[];
  favorites: any[];
  userProfile: any;
  searchHistory: string[];
  browsedCategories: string[];
  lastSyncTime: Date;
  pendingActions: PendingAction[];
}

interface SyncOperation {
  id: string;
  type: 'add_to_cart' | 'remove_from_cart' | 'add_favorite' | 'remove_favorite' | 'user_update' | 'order_create';
  data: any;
  timestamp: Date;
  retryCount: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
}

interface PendingAction {
  id: string;
  action: string;
  data: any;
  timestamp: Date;
  priority: 'low' | 'normal' | 'high';
}

interface CacheStatus {
  totalSize: number;
  availableSize: number;
  caches: CacheInfo[];
  lastUpdated: Date;
  autoCleanup: boolean;
}

interface CacheInfo {
  name: string;
  size: number;
  entries: number;
  lastAccessed: Date;
  type: 'static' | 'dynamic' | 'api' | 'images';
}

interface PWAMetrics {
  installationRate: number;
  engagementScore: number;
  offlineUsage: number;
  notificationClickRate: number;
  syncSuccessRate: number;
  cacheHitRate: number;
}

const initialState: PWAState = {
  isInstallable: false,
  isInstalled: false,
  isOnline: navigator.onLine,
  updateAvailable: false,
  installPrompt: null,
  offlineData: {
    products: [],
    cart: [],
    favorites: [],
    userProfile: null,
    searchHistory: [],
    browsedCategories: [],
    lastSyncTime: new Date(),
    pendingActions: [],
  },
  syncQueue: [],
  notificationPermission: 'default',
  cacheStatus: {
    totalSize: 0,
    availableSize: 0,
    caches: [],
    lastUpdated: new Date(),
    autoCleanup: true,
  },
  isLoading: false,
  error: null,
};

export function useProgressiveWebApp() {
  const [state, setState] = useState<PWAState>(initialState);

  // 📱 INSTALLATION MANAGEMENT
  const checkInstallability = useCallback(async () => {
    // Check if app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any)?.standalone ||
                       document.referrer.includes('android-app://');

    setState(prev => ({ ...prev, isInstalled }));

    // Check if installation prompt is available
    if (!isInstalled) {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setState(prev => ({
          ...prev,
          isInstallable: true,
          installPrompt: e,
        }));
      });
    }

    return isInstalled;
  }, []);

  const installApp = useCallback(async () => {
    if (!state.installPrompt) {
      throw new Error('Installation prompt not available');
    }

    try {
      const result = await state.installPrompt.prompt();
      const outcome = await result.userChoice;

      if (outcome === 'accepted') {
        setState(prev => ({
          ...prev,
          isInstalled: true,
          isInstallable: false,
          installPrompt: null,
        }));

        // Track installation
        await trackPWAEvent('install_accepted');
        
        return true;
      } else {
        await trackPWAEvent('install_dismissed');
        return false;
      }
    } catch (error) {
      console.error('Installation failed:', error);
      throw error;
    }
  }, [state.installPrompt]);

  // 🔄 SERVICE WORKER MANAGEMENT
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, updateAvailable: true }));
              }
            });
          }
        });

        // Listen for service worker messages
        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

        return registration;
      } catch (error) {
        console.error('Service worker registration failed:', error);
        throw error;
      }
    }
  }, []);

  const updateApp = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }, []);

  // 🌐 OFFLINE FUNCTIONALITY
  const cacheEssentialData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Cache critical app data for offline use
      const essentialProducts = await fetchEssentialProducts();
      const userCart = await fetchUserCart();
      const userFavorites = await fetchUserFavorites();
      const userProfile = await fetchUserProfile();

      const offlineData: OfflineData = {
        products: essentialProducts,
        cart: userCart,
        favorites: userFavorites,
        userProfile,
        searchHistory: getSearchHistory(),
        browsedCategories: getBrowsedCategories(),
        lastSyncTime: new Date(),
        pendingActions: [],
      };

      // Store in IndexedDB for offline access
      await storeOfflineData(offlineData);

      setState(prev => ({
        ...prev,
        offlineData,
        isLoading: false,
      }));

      return offlineData;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to cache essential data',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  const loadOfflineData = useCallback(async () => {
    try {
      const offlineData = await getStoredOfflineData();
      if (offlineData) {
        setState(prev => ({ ...prev, offlineData }));
      }
      return offlineData;
    } catch (error) {
      console.error('Failed to load offline data:', error);
      return null;
    }
  }, []);

  // 📤 BACKGROUND SYNC
  const addToSyncQueue = useCallback(async (operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount' | 'status'>) => {
    const syncOperation: SyncOperation = {
      ...operation,
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      retryCount: 0,
      status: 'pending',
    };

    setState(prev => ({
      ...prev,
      syncQueue: [...prev.syncQueue, syncOperation],
    }));

    // Store in IndexedDB
    await storeSyncOperation(syncOperation);

    // Try to sync immediately if online
    if (state.isOnline) {
      await processSyncQueue();
    }

    return syncOperation.id;
  }, [state.isOnline]);

  const processSyncQueue = useCallback(async () => {
    if (!state.isOnline || state.syncQueue.length === 0) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const pendingOperations = state.syncQueue.filter(op => op.status === 'pending');
      
      for (const operation of pendingOperations) {
        try {
          setState(prev => ({
            ...prev,
            syncQueue: prev.syncQueue.map(op =>
              op.id === operation.id ? { ...op, status: 'syncing' } : op
            ),
          }));

          await syncOperation(operation);

          setState(prev => ({
            ...prev,
            syncQueue: prev.syncQueue.map(op =>
              op.id === operation.id ? { ...op, status: 'completed' } : op
            ),
          }));

          // Remove completed operation
          await removeSyncOperation(operation.id);
        } catch (error) {
          const newRetryCount = operation.retryCount + 1;
          const maxRetries = 3;

          if (newRetryCount < maxRetries) {
            setState(prev => ({
              ...prev,
              syncQueue: prev.syncQueue.map(op =>
                op.id === operation.id 
                  ? { ...op, status: 'pending', retryCount: newRetryCount }
                  : op
              ),
            }));
          } else {
            setState(prev => ({
              ...prev,
              syncQueue: prev.syncQueue.map(op =>
                op.id === operation.id ? { ...op, status: 'failed' } : op
              ),
            }));
          }
        }
      }

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to process sync queue',
        isLoading: false,
      }));
    }
  }, [state.isOnline, state.syncQueue]);

  // 🔔 PUSH NOTIFICATIONS
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, notificationPermission: permission }));
      
      if (permission === 'granted') {
        await subscribeToNotifications();
      }
      
      return permission;
    }
    return 'denied';
  }, []);

  const subscribeToNotifications = useCallback(async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: getVapidPublicKey(),
          });

          // Send subscription to server
          await sendSubscriptionToServer(subscription);
          
          return subscription;
        }
      } catch (error) {
        console.error('Failed to subscribe to notifications:', error);
        throw error;
      }
    }
  }, []);

  const sendNotification = useCallback(async (title: string, options: any = {}) => {
    if (state.notificationPermission === 'granted') {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          return registration.showNotification(title, {
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            ...options,
          });
        }
      } else {
        return new Notification(title, options);
      }
    }
  }, [state.notificationPermission]);

  // 💾 CACHE MANAGEMENT
  const manageCaches = useCallback(async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        const cacheInfos: CacheInfo[] = [];
        let totalSize = 0;

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          const size = await estimateCacheSize(cache);
          
          totalSize += size;
          
          cacheInfos.push({
            name: cacheName,
            size,
            entries: keys.length,
            lastAccessed: new Date(),
            type: determineCacheType(cacheName),
          });
        }

        // Estimate available storage
        const storage = await navigator.storage.estimate();
        const availableSize = storage.quota ? storage.quota - (storage.usage || 0) : 0;

        setState(prev => ({
          ...prev,
          cacheStatus: {
            totalSize,
            availableSize,
            caches: cacheInfos,
            lastUpdated: new Date(),
            autoCleanup: prev.cacheStatus.autoCleanup,
          },
        }));

        // Auto cleanup if enabled and storage is low
        if (state.cacheStatus.autoCleanup && availableSize < 50 * 1024 * 1024) { // Less than 50MB
          await cleanupCaches();
        }

        return cacheInfos;
      } catch (error) {
        console.error('Failed to manage caches:', error);
        throw error;
      }
    }
  }, [state.cacheStatus.autoCleanup]);

  const cleanupCaches = useCallback(async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        
        // Remove old caches
        for (const cacheName of cacheNames) {
          if (cacheName.includes('old') || cacheName.includes('v1')) {
            await caches.delete(cacheName);
          }
        }

        // Clean up dynamic caches
        const dynamicCache = await caches.open('dynamic-cache');
        const requests = await dynamicCache.keys();
        
        // Keep only the most recent 100 dynamic entries
        if (requests.length > 100) {
          const toDelete = requests.slice(100);
          await Promise.all(toDelete.map(request => dynamicCache.delete(request)));
        }

        await manageCaches(); // Update cache status
      } catch (error) {
        console.error('Failed to cleanup caches:', error);
      }
    }
  }, [manageCaches]);

  // 📊 OFFLINE ANALYTICS
  const trackOfflineUsage = useCallback(async (action: string, data?: any) => {
    const offlineAction = {
      action,
      data,
      timestamp: new Date(),
      isOffline: !state.isOnline,
    };

    // Store offline analytics
    await storeOfflineAnalytics(offlineAction);

    // Queue for sync when online
    if (!state.isOnline) {
      await addToSyncQueue({
        type: 'analytics' as any,
        data: offlineAction,
      });
    }
  }, [state.isOnline, addToSyncQueue]);

  const getPWAMetrics = useCallback(async (): Promise<PWAMetrics> => {
    try {
      const offlineAnalytics = await getOfflineAnalytics();
      const installStats = await getInstallStats();
      const notificationStats = await getNotificationStats();

      return {
        installationRate: installStats.installRate || 0,
        engagementScore: calculateEngagementScore(offlineAnalytics),
        offlineUsage: calculateOfflineUsage(offlineAnalytics),
        notificationClickRate: notificationStats.clickRate || 0,
        syncSuccessRate: calculateSyncSuccessRate(),
        cacheHitRate: calculateCacheHitRate(),
      };
    } catch (error) {
      console.error('Failed to get PWA metrics:', error);
      return {
        installationRate: 0,
        engagementScore: 0,
        offlineUsage: 0,
        notificationClickRate: 0,
        syncSuccessRate: 0,
        cacheHitRate: 0,
      };
    }
  }, []);

  // 🔄 NETWORK STATUS MONITORING
  const handleOnlineStatus = useCallback(() => {
    const isOnline = navigator.onLine;
    setState(prev => ({ ...prev, isOnline }));

    if (isOnline) {
      // Sync pending operations when coming back online
      processSyncQueue();
    } else {
      // Cache current state when going offline
      cacheEssentialData();
    }
  }, [processSyncQueue, cacheEssentialData]);

  // Initialize PWA features
  useEffect(() => {
    const initializePWA = async () => {
      setState(prev => ({ ...prev, isLoading: true }));

      try {
        // Register service worker
        await registerServiceWorker();
        
        // Check installability
        await checkInstallability();
        
        // Load offline data
        await loadOfflineData();
        
        // Manage caches
        await manageCaches();
        
        // Check notification permission
        if ('Notification' in window) {
          setState(prev => ({ 
            ...prev, 
            notificationPermission: Notification.permission 
          }));
        }

        setState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to initialize PWA features',
          isLoading: false,
        }));
      }
    };

    initializePWA();

    // Set up event listeners
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Periodic sync and cache management
    const syncInterval = setInterval(() => {
      if (state.isOnline) {
        processSyncQueue();
      }
    }, 30000); // Every 30 seconds

    const cacheInterval = setInterval(() => {
      manageCaches();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      clearInterval(syncInterval);
      clearInterval(cacheInterval);
    };
  }, []);

  return {
    // State
    ...state,
    
    // Installation
    installApp,
    checkInstallability,
    
    // Service Worker
    updateApp,
    
    // Offline Functionality
    cacheEssentialData,
    loadOfflineData,
    
    // Background Sync
    addToSyncQueue,
    processSyncQueue,
    
    // Notifications
    requestNotificationPermission,
    sendNotification,
    
    // Cache Management
    manageCaches,
    cleanupCaches,
    
    // Analytics
    trackOfflineUsage,
    getPWAMetrics,
  };
}

// 🔧 HELPER FUNCTIONS

function handleServiceWorkerMessage(event: any) {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'CACHE_UPDATED':
        console.log('Cache updated');
        break;
      case 'BACKGROUND_SYNC':
        console.log('Background sync completed');
        break;
      default:
        console.log('Service worker message:', event.data);
    }
  }
}

async function trackPWAEvent(event: string) {
  // Track PWA-specific events
  console.log(`PWA Event: ${event}`);
}

async function fetchEssentialProducts() {
  // Fetch essential products for offline use
  return [
    { id: 1, name: 'Essential Product 1', price: 50 },
    { id: 2, name: 'Essential Product 2', price: 75 },
  ];
}

async function fetchUserCart() {
  return JSON.parse(localStorage.getItem('bato-cart') || '[]');
}

async function fetchUserFavorites() {
  return JSON.parse(localStorage.getItem('bato-favorites') || '[]');
}

async function fetchUserProfile() {
  return JSON.parse(localStorage.getItem('bato-user-profile') || 'null');
}

function getSearchHistory(): string[] {
  return JSON.parse(localStorage.getItem('bato-search-history') || '[]');
}

function getBrowsedCategories(): string[] {
  return JSON.parse(localStorage.getItem('bato-browsed-categories') || '[]');
}

async function storeOfflineData(data: OfflineData) {
  // Store in IndexedDB for offline access
  localStorage.setItem('bato-offline-data', JSON.stringify(data));
}

async function getStoredOfflineData(): Promise<OfflineData | null> {
  const stored = localStorage.getItem('bato-offline-data');
  return stored ? JSON.parse(stored) : null;
}

async function storeSyncOperation(operation: SyncOperation) {
  const stored = JSON.parse(localStorage.getItem('bato-sync-queue') || '[]');
  stored.push(operation);
  localStorage.setItem('bato-sync-queue', JSON.stringify(stored));
}

async function removeSyncOperation(operationId: string) {
  const stored = JSON.parse(localStorage.getItem('bato-sync-queue') || '[]');
  const filtered = stored.filter((op: SyncOperation) => op.id !== operationId);
  localStorage.setItem('bato-sync-queue', JSON.stringify(filtered));
}

async function syncOperation(operation: SyncOperation) {
  // Simulate API sync operation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  switch (operation.type) {
    case 'add_to_cart':
      console.log('Syncing add to cart:', operation.data);
      break;
    case 'add_favorite':
      console.log('Syncing add favorite:', operation.data);
      break;
    default:
      console.log('Syncing operation:', operation.type, operation.data);
  }
}

function getVapidPublicKey(): string {
  // Return VAPID public key for push notifications
  return 'BL7ELBUkqZpBGXxKhTQNZNj8QCTyOa8sHUhKX2EvsVLuQj8ZJ8YrQCj5xDlE3cUUEgOyOnKv2XRO7YE2lF2Q6M';
}

async function sendSubscriptionToServer(subscription: PushSubscription) {
  // Send subscription to server for push notifications
  console.log('Sending subscription to server:', subscription);
}

async function estimateCacheSize(cache: Cache): Promise<number> {
  // Estimate cache size (simplified)
  const keys = await cache.keys();
  return keys.length * 1024; // Rough estimate: 1KB per entry
}

function determineCacheType(cacheName: string): 'static' | 'dynamic' | 'api' | 'images' {
  if (cacheName.includes('static')) return 'static';
  if (cacheName.includes('api')) return 'api';
  if (cacheName.includes('images')) return 'images';
  return 'dynamic';
}

async function storeOfflineAnalytics(action: any) {
  const stored = JSON.parse(localStorage.getItem('bato-offline-analytics') || '[]');
  stored.push(action);
  // Keep only last 1000 entries
  if (stored.length > 1000) {
    stored.splice(0, stored.length - 1000);
  }
  localStorage.setItem('bato-offline-analytics', JSON.stringify(stored));
}

async function getOfflineAnalytics() {
  return JSON.parse(localStorage.getItem('bato-offline-analytics') || '[]');
}

async function getInstallStats() {
  return { installRate: 0.12 }; // Mock data
}

async function getNotificationStats() {
  return { clickRate: 0.08 }; // Mock data
}

function calculateEngagementScore(analytics: any[]): number {
  // Calculate engagement based on offline analytics
  const offlineActions = analytics.filter(a => a.isOffline).length;
  const totalActions = analytics.length;
  return totalActions > 0 ? (offlineActions / totalActions) * 100 : 0;
}

function calculateOfflineUsage(analytics: any[]): number {
  const offlineActions = analytics.filter(a => a.isOffline).length;
  return offlineActions;
}

function calculateSyncSuccessRate(): number {
  // Mock calculation
  return 0.95;
}

function calculateCacheHitRate(): number {
  // Mock calculation
  return 0.78;
}