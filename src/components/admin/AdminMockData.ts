// Mock data constants for Admin Dashboard
export const DASHBOARD_STATS = {
  totalUsers: 15847,
  totalOrders: 3294,
  totalRevenue: 284750,
  totalProducts: 1256,
  monthlyGrowth: 12.5,
  pendingDisputes: 8,
  securityAlerts: 3,
  lowStockItems: 23
};

export const RECENT_ORDERS = [
  { id: "ORD-001", customer: "Amara Johnson", amount: 129.99, status: "processing", date: "2024-01-15", items: 2 },
  { id: "ORD-002", customer: "Kemi Okonkwo", amount: 89.99, status: "shipped", date: "2024-01-15", items: 1 },
  { id: "ORD-003", customer: "Zara Ahmed", amount: 199.99, status: "delivered", date: "2024-01-14", items: 3 },
  { id: "ORD-004", customer: "Nia Williams", amount: 79.99, status: "pending", date: "2024-01-14", items: 1 },
  { id: "ORD-005", customer: "Adanna Okafor", amount: 159.99, status: "processing", date: "2024-01-13", items: 2 }
];

export const ALL_ORDERS = [
  ...RECENT_ORDERS,
  { id: "ORD-006", customer: "Folake Adebayo", amount: 229.99, status: "delivered", date: "2024-01-12", items: 4 },
  { id: "ORD-007", customer: "Chiamaka Nwosu", amount: 119.99, status: "cancelled", date: "2024-01-12", items: 2 },
  { id: "ORD-008", customer: "Keji Ogundimu", amount: 189.99, status: "shipped", date: "2024-01-11", items: 3 },
  { id: "ORD-009", customer: "Ngozi Okpara", amount: 99.99, status: "processing", date: "2024-01-11", items: 1 },
  { id: "ORD-010", customer: "Adunni Adeleke", amount: 149.99, status: "delivered", date: "2024-01-10", items: 2 }
];

export const TOP_PRODUCTS = [
  { id: 1, name: "Vibrant Ankara Maxi Dress", sales: 156, revenue: 14039.44, stock: 23, category: "Dresses", price: 89.99 },
  { id: 2, name: "Traditional African Print Top", sales: 134, revenue: 8039.66, stock: 45, category: "Tops", price: 59.99 },
  { id: 3, name: "Elegant African Print Ensemble", sales: 89, revenue: 11569.11, stock: 12, category: "Sets", price: 129.99 },
  { id: 4, name: "Modern African Fashion Dress", sales: 78, revenue: 7799.22, stock: 34, category: "Dresses", price: 99.99 },
  { id: 5, name: "Traditional Tribal Pattern Outfit", sales: 67, revenue: 8039.33, stock: 8, category: "Traditional", price: 119.99 }
];

export const ALL_PRODUCTS = [
  ...TOP_PRODUCTS,
  { id: 6, name: "Colorful African Textile Dress", sales: 45, revenue: 3599.55, stock: 28, category: "Dresses", price: 79.99 },
  { id: 7, name: "African Print Headwrap", sales: 234, revenue: 4679.66, stock: 67, category: "Accessories", price: 19.99 },
  { id: 8, name: "Kente Cloth Scarf", sales: 123, revenue: 3689.77, stock: 41, category: "Accessories", price: 29.99 },
  { id: 9, name: "Dashiki Traditional Shirt", sales: 89, revenue: 4449.11, stock: 19, category: "Tops", price: 49.99 },
  { id: 10, name: "African Beaded Jewelry Set", sales: 156, revenue: 7799.44, stock: 33, category: "Accessories", price: 49.99 }
];

export const RECENT_USERS = [
  { id: 1, name: "Adunni Adeleke", email: "adunni@email.com", joined: "2024-01-15", status: "active", orders: 3, totalSpent: 387.97 },
  { id: 2, name: "Chiamaka Nwosu", email: "chiamaka@email.com", joined: "2024-01-14", status: "active", orders: 1, totalSpent: 89.99 },
  { id: 3, name: "Folake Adebayo", email: "folake@email.com", joined: "2024-01-14", status: "pending", orders: 0, totalSpent: 0 },
  { id: 4, name: "Keji Ogundimu", email: "keji@email.com", joined: "2024-01-13", status: "active", orders: 5, totalSpent: 649.95 },
  { id: 5, name: "Ngozi Okpara", email: "ngozi@email.com", joined: "2024-01-13", status: "active", orders: 2, totalSpent: 259.98 }
];

export const ALL_USERS = [
  ...RECENT_USERS,
  { id: 6, name: "Zara Ahmed", email: "zara@email.com", joined: "2024-01-12", status: "active", orders: 4, totalSpent: 529.96 },
  { id: 7, name: "Amina Hassan", email: "amina@email.com", joined: "2024-01-11", status: "suspended", orders: 1, totalSpent: 79.99 },
  { id: 8, name: "Fatima Bello", email: "fatima@email.com", joined: "2024-01-10", status: "active", orders: 6, totalSpent: 789.94 },
  { id: 9, name: "Aisha Musa", email: "aisha@email.com", joined: "2024-01-09", status: "active", orders: 3, totalSpent: 369.97 },
  { id: 10, name: "Halima Yusuf", email: "halima@email.com", joined: "2024-01-08", status: "active", orders: 2, totalSpent: 199.98 }
];

export const SECURITY_ALERTS = [
  { id: 1, type: "login", message: "Multiple failed login attempts from IP 192.168.1.100", severity: "high", time: "2 minutes ago", status: "open" },
  { id: 2, type: "payment", message: "Suspicious payment activity detected", severity: "medium", time: "1 hour ago", status: "investigating" },
  { id: 3, type: "access", message: "Admin account accessed from new location", severity: "low", time: "3 hours ago", status: "resolved" },
  { id: 4, type: "data", message: "Unusual data export activity detected", severity: "high", time: "5 hours ago", status: "open" },
  { id: 5, type: "system", message: "Database connection timeout errors", severity: "medium", time: "1 day ago", status: "resolved" }
];

export const DISPUTES = [
  { id: 1, orderId: "ORD-001", customer: "Amara Johnson", issue: "Product not as described", status: "open", priority: "high", created: "2024-01-15", amount: 129.99 },
  { id: 2, orderId: "ORD-003", customer: "Zara Ahmed", issue: "Damaged during shipping", status: "investigating", priority: "medium", created: "2024-01-14", amount: 199.99 },
  { id: 3, orderId: "ORD-007", customer: "Chiamaka Nwosu", issue: "Wrong item received", status: "resolved", priority: "low", created: "2024-01-12", amount: 119.99 },
  { id: 4, orderId: "ORD-002", customer: "Kemi Okonkwo", issue: "Delayed delivery", status: "open", priority: "medium", created: "2024-01-11", amount: 89.99 },
  { id: 5, orderId: "ORD-005", customer: "Adanna Okafor", issue: "Refund request", status: "escalated", priority: "high", created: "2024-01-10", amount: 159.99 }
];

export const ANALYTICS_DATA = {
  revenueGrowth: [
    { month: "Jan", revenue: 45000, orders: 234 },
    { month: "Feb", revenue: 52000, orders: 267 },
    { month: "Mar", revenue: 48000, orders: 245 },
    { month: "Apr", revenue: 61000, orders: 312 },
    { month: "May", revenue: 55000, orders: 289 },
    { month: "Jun", revenue: 67000, orders: 345 }
  ],
  topCategories: [
    { name: "Dresses", sales: 1234, percentage: 35 },
    { name: "Tops", sales: 987, percentage: 28 },
    { name: "Accessories", sales: 756, percentage: 22 },
    { name: "Sets", sales: 432, percentage: 12 },
    { name: "Traditional", sales: 123, percentage: 3 }
  ],
  customerMetrics: {
    newCustomers: 234,
    returningCustomers: 567,
    customerRetention: 78.3,
    averageOrderValue: 86.45
  }
};