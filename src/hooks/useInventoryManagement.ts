import { useState, useCallback, useEffect } from 'react';
import { InventoryItem, StockAlert, SupplierInfo, Product } from '../types';

interface InventoryManagementState {
  inventory: InventoryItem[];
  stockAlerts: StockAlert[];
  suppliers: SupplierInfo[];
  isLoading: boolean;
  error: string | null;
  lowStockThreshold: number;
  demandForecast: DemandForecast[];
}

interface DemandForecast {
  productId: string;
  currentStock: number;
  projectedDemand: number;
  recommendedOrder: number;
  timeframe: 'weekly' | 'monthly';
  confidence: number;
  seasonalFactor: number;
}

interface InventoryUpdate {
  productId: string;
  vendorId: string;
  quantityChange: number;
  reason: 'sale' | 'restock' | 'adjustment' | 'return' | 'damage';
  notes?: string;
}

interface StockMovement {
  id: string;
  productId: string;
  vendorId: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  timestamp: Date;
  costPrice?: number;
  referenceId?: string;
}

const initialState: InventoryManagementState = {
  inventory: [],
  stockAlerts: [],
  suppliers: [],
  isLoading: false,
  error: null,
  lowStockThreshold: 10,
  demandForecast: [],
};

export function useInventoryManagement() {
  const [state, setState] = useState<InventoryManagementState>(initialState);

  // �� INVENTORY TRACKING
  const updateInventory = useCallback(async (update: InventoryUpdate) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const existingItem = state.inventory.find(
        item => item.productId === update.productId && item.vendorId === update.vendorId
      );

      if (existingItem) {
        const newQuantity = Math.max(0, existingItem.quantity + update.quantityChange);
        const newReservedQuantity = existingItem.reservedQuantity;
        const newAvailableQuantity = Math.max(0, newQuantity - newReservedQuantity);

        const updatedItem: InventoryItem = {
          ...existingItem,
          quantity: newQuantity,
          availableQuantity: newAvailableQuantity,
          lastUpdated: new Date(),
        };

        setState(prev => ({
          ...prev,
          inventory: prev.inventory.map(item =>
            item.id === existingItem.id ? updatedItem : item
          ),
          isLoading: false,
        }));

        // Check for stock alerts
        await checkStockLevels(updatedItem);
        
        // Record stock movement
        await recordStockMovement({
          productId: update.productId,
          vendorId: update.vendorId,
          type: update.quantityChange > 0 ? 'in' : 'out',
          quantity: Math.abs(update.quantityChange),
          reason: update.reason,
          notes: update.notes,
        });
      } else {
        console.warn('Inventory item not found:', update);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to update inventory',
        isLoading: false,
      }));
    }
  }, [state.inventory]);

  // 📊 STOCK LEVEL MONITORING
  const checkStockLevels = useCallback(async (item: InventoryItem) => {
    const alerts: StockAlert[] = [];

    // Low stock alert
    if (item.availableQuantity <= item.reorderPoint) {
      alerts.push({
        id: `alert_${Date.now()}_${item.id}`,
        productId: item.productId,
        vendorId: item.vendorId,
        type: item.availableQuantity === 0 ? 'out_of_stock' : 'low_stock',
        currentLevel: item.availableQuantity,
        threshold: item.reorderPoint,
        priority: item.availableQuantity === 0 ? 'critical' : 'high',
        createdAt: new Date(),
      });
    }

    // Overstock alert
    if (item.quantity > item.maxStockLevel) {
      alerts.push({
        id: `alert_${Date.now()}_overstock_${item.id}`,
        productId: item.productId,
        vendorId: item.vendorId,
        type: 'overstock',
        currentLevel: item.quantity,
        threshold: item.maxStockLevel,
        priority: 'medium',
        createdAt: new Date(),
      });
    }

    if (alerts.length > 0) {
      setState(prev => ({
        ...prev,
        stockAlerts: [
          ...prev.stockAlerts.filter(alert => 
            !(alert.productId === item.productId && alert.vendorId === item.vendorId)
          ),
          ...alerts,
        ],
      }));
    }
  }, []);

  // 📈 DEMAND FORECASTING
  const generateDemandForecast = useCallback(async (vendorId?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const inventoryToForecast = vendorId 
        ? state.inventory.filter(item => item.vendorId === vendorId)
        : state.inventory;

      const forecasts: DemandForecast[] = inventoryToForecast.map(item => {
        // Simulate ML-based demand forecasting
        const historicalAverage = 50; // Would be calculated from actual sales data
        const seasonalFactor = Math.random() * 0.4 + 0.8; // 0.8 - 1.2
        const trendFactor = Math.random() * 0.2 + 0.9; // 0.9 - 1.1
        
        const projectedDemand = Math.round(historicalAverage * seasonalFactor * trendFactor);
        const confidence = Math.random() * 0.3 + 0.7; // 70-100%
        
        const recommendedOrder = Math.max(0, 
          projectedDemand + item.reorderPoint - item.availableQuantity
        );

        return {
          productId: item.productId,
          currentStock: item.availableQuantity,
          projectedDemand,
          recommendedOrder,
          timeframe: 'monthly' as const,
          confidence,
          seasonalFactor,
        };
      });

      setState(prev => ({
        ...prev,
        demandForecast: forecasts,
        isLoading: false,
      }));

      return forecasts;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to generate demand forecast',
        isLoading: false,
      }));
      throw error;
    }
  }, [state.inventory]);

  // 🔄 AUTOMATIC REORDERING
  const triggerAutomaticReorder = useCallback(async (productId: string, vendorId: string) => {
    const item = state.inventory.find(i => i.productId === productId && i.vendorId === vendorId);
    const forecast = state.demandForecast.find(f => f.productId === productId);

    if (!item || !forecast || !item.supplier) {
      return;
    }

    try {
      const orderQuantity = Math.max(
        forecast.recommendedOrder,
        item.supplier.minimumOrderQuantity
      );

      // Simulate purchase order creation
      const purchaseOrder = {
        id: `po_${Date.now()}`,
        supplierId: item.supplier.id,
        vendorId,
        items: [{
          productId,
          quantity: orderQuantity,
          unitCost: item.costPrice,
          totalCost: orderQuantity * item.costPrice,
        }],
        status: 'pending',
        createdAt: new Date(),
        expectedDelivery: new Date(Date.now() + item.supplier.leadTime * 24 * 60 * 60 * 1000),
      };

      console.log('Purchase order created:', purchaseOrder);

      // Update stock alert to show reorder initiated
      setState(prev => ({
        ...prev,
        stockAlerts: prev.stockAlerts.map(alert =>
          alert.productId === productId && alert.vendorId === vendorId
            ? { ...alert, resolvedAt: new Date() }
            : alert
        ),
      }));

      return purchaseOrder;
    } catch (error) {
      console.error('Failed to create purchase order:', error);
      throw error;
    }
  }, [state.inventory, state.demandForecast]);

  // 📝 STOCK MOVEMENT TRACKING
  const recordStockMovement = useCallback(async (movement: Omit<StockMovement, 'id' | 'timestamp'>) => {
    const stockMovement: StockMovement = {
      ...movement,
      id: `movement_${Date.now()}`,
      timestamp: new Date(),
    };

    // In a real app, this would be saved to a database
    console.log('Stock movement recorded:', stockMovement);
    
    return stockMovement;
  }, []);

  // 📊 INVENTORY ANALYTICS
  const getInventoryAnalytics = useCallback((vendorId?: string) => {
    const relevantInventory = vendorId 
      ? state.inventory.filter(item => item.vendorId === vendorId)
      : state.inventory;

    const totalProducts = relevantInventory.length;
    const totalValue = relevantInventory.reduce((sum, item) => 
      sum + (item.quantity * item.costPrice), 0
    );
    
    const lowStockItems = relevantInventory.filter(item => 
      item.availableQuantity <= item.reorderPoint
    );
    
    const outOfStockItems = relevantInventory.filter(item => 
      item.availableQuantity === 0
    );

    const overstockItems = relevantInventory.filter(item => 
      item.quantity > item.maxStockLevel
    );

    const turnoverRate = calculateInventoryTurnover(relevantInventory);

    return {
      totalProducts,
      totalValue,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      overstockCount: overstockItems.length,
      turnoverRate,
      alertCounts: {
        critical: state.stockAlerts.filter(a => a.priority === 'critical').length,
        high: state.stockAlerts.filter(a => a.priority === 'high').length,
        medium: state.stockAlerts.filter(a => a.priority === 'medium').length,
        low: state.stockAlerts.filter(a => a.priority === 'low').length,
      },
      topMovingProducts: getTopMovingProducts(relevantInventory),
      slowMovingProducts: getSlowMovingProducts(relevantInventory),
    };
  }, [state.inventory, state.stockAlerts]);

  // 🔍 PRODUCT SEARCH AND FILTERING
  const searchInventory = useCallback((query: string, vendorId?: string) => {
    const filtered = state.inventory.filter(item => {
      const matchesVendor = !vendorId || item.vendorId === vendorId;
      const matchesSearch = !query || 
        item.sku.toLowerCase().includes(query.toLowerCase()) ||
        item.productId.toLowerCase().includes(query.toLowerCase());
      
      return matchesVendor && matchesSearch;
    });

    return filtered.sort((a, b) => {
      // Sort by urgency: out of stock, low stock, then normal
      if (a.availableQuantity === 0 && b.availableQuantity > 0) return -1;
      if (b.availableQuantity === 0 && a.availableQuantity > 0) return 1;
      if (a.availableQuantity <= a.reorderPoint && b.availableQuantity > b.reorderPoint) return -1;
      if (b.availableQuantity <= b.reorderPoint && a.availableQuantity > a.reorderPoint) return 1;
      return 0;
    });
  }, [state.inventory]);

  // Initialize inventory data
  useEffect(() => {
    const loadInventoryData = async () => {
      setState(prev => ({ ...prev, isLoading: true }));

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockInventory = generateMockInventory();
        const mockSuppliers = generateMockSuppliers();
        const mockAlerts = generateMockStockAlerts(mockInventory);

        setState(prev => ({
          ...prev,
          inventory: mockInventory,
          suppliers: mockSuppliers,
          stockAlerts: mockAlerts,
          isLoading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to load inventory data',
          isLoading: false,
        }));
      }
    };

    loadInventoryData();
  }, []);

  return {
    // State
    ...state,
    
    // Inventory Operations
    updateInventory,
    searchInventory,
    
    // Forecasting & Planning
    generateDemandForecast,
    triggerAutomaticReorder,
    
    // Analytics
    getInventoryAnalytics,
    
    // Monitoring
    checkStockLevels,
  };
}

// 🔧 HELPER FUNCTIONS
function calculateInventoryTurnover(inventory: InventoryItem[]): number {
  // Simplified turnover calculation
  // In reality, this would use COGS and average inventory over time
  const avgInventoryValue = inventory.reduce((sum, item) => 
    sum + (item.quantity * item.costPrice), 0
  ) / inventory.length;
  
  const estimatedCOGS = avgInventoryValue * 6; // Assuming 6x turnover annually
  return avgInventoryValue > 0 ? estimatedCOGS / avgInventoryValue : 0;
}

function getTopMovingProducts(inventory: InventoryItem[]) {
  // Mock implementation - would use actual sales data
  return inventory
    .filter(item => item.availableQuantity < item.reorderPoint)
    .slice(0, 5)
    .map(item => ({
      productId: item.productId,
      sku: item.sku,
      turnoverRate: Math.random() * 10 + 5,
    }));
}

function getSlowMovingProducts(inventory: InventoryItem[]) {
  // Mock implementation - would use actual sales data
  return inventory
    .filter(item => item.quantity > item.maxStockLevel * 0.8)
    .slice(0, 5)
    .map(item => ({
      productId: item.productId,
      sku: item.sku,
      turnoverRate: Math.random() * 2,
    }));
}

function generateMockInventory(): InventoryItem[] {
  return [
    {
      id: 'inv_001',
      productId: 'prod_1',
      vendorId: 'vendor_1',
      sku: 'ANK-001',
      quantity: 25,
      reservedQuantity: 5,
      availableQuantity: 20,
      reorderPoint: 10,
      maxStockLevel: 100,
      costPrice: 45.00,
      lastUpdated: new Date(),
      location: 'Warehouse A - Section 1',
      supplier: {
        id: 'supplier_1',
        name: 'African Heritage Textiles',
        contactEmail: 'orders@ahtextiles.com',
        contactPhone: '+1-555-0101',
        leadTime: 14,
        minimumOrderQuantity: 50,
      },
    },
    {
      id: 'inv_002',
      productId: 'prod_2',
      vendorId: 'vendor_1',
      sku: 'KNT-002',
      quantity: 5,
      reservedQuantity: 2,
      availableQuantity: 3,
      reorderPoint: 15,
      maxStockLevel: 75,
      costPrice: 32.00,
      lastUpdated: new Date(),
      location: 'Warehouse A - Section 2',
      supplier: {
        id: 'supplier_1',
        name: 'African Heritage Textiles',
        contactEmail: 'orders@ahtextiles.com',
        contactPhone: '+1-555-0101',
        leadTime: 14,
        minimumOrderQuantity: 50,
      },
    },
  ];
}

function generateMockSuppliers(): SupplierInfo[] {
  return [
    {
      id: 'supplier_1',
      name: 'African Heritage Textiles',
      contactEmail: 'orders@ahtextiles.com',
      contactPhone: '+1-555-0101',
      leadTime: 14,
      minimumOrderQuantity: 50,
    },
    {
      id: 'supplier_2',
      name: 'Kente Cloth Artisans',
      contactEmail: 'wholesale@kentecrafters.com',
      contactPhone: '+1-555-0102',
      leadTime: 21,
      minimumOrderQuantity: 25,
    },
  ];
}

function generateMockStockAlerts(inventory: InventoryItem[]): StockAlert[] {
  return inventory
    .filter(item => item.availableQuantity <= item.reorderPoint)
    .map(item => ({
      id: `alert_${item.id}`,
      productId: item.productId,
      vendorId: item.vendorId,
      type: item.availableQuantity === 0 ? 'out_of_stock' : 'low_stock',
      currentLevel: item.availableQuantity,
      threshold: item.reorderPoint,
      priority: item.availableQuantity === 0 ? 'critical' : 'high',
      createdAt: new Date(),
    }));
}