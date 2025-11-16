import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApp } from './AppProvider';
import { BootstrapIcon } from './BootstrapIcon';

export function FrameworkDemo() {
  const { actions } = useApp();

  const frameworkFeatures = [
    {
      title: 'Vendor Onboarding',
      description: 'Complete multi-step vendor registration and verification system',
      route: 'vendor-onboarding',
      icon: 'shop',
      status: 'implemented',
      category: 'Multi-Vendor',
    },
    {
      title: 'Order Management',
      description: 'Comprehensive order processing and tracking system',
      route: 'order-management',
      icon: 'box-seam',
      status: 'implemented',
      category: 'Order Processing',
    },
    {
      title: 'Vendor Order Dashboard',
      description: 'Vendor-specific order management interface',
      route: 'vendor-orders',
      icon: 'clipboard-data',
      status: 'implemented',
      category: 'Vendor Tools',
    },
    {
      title: 'Payment Processing',
      description: 'Multi-gateway payment system with commission management',
      route: 'payment-gateway',
      icon: 'credit-card',
      status: 'implemented',
      category: 'Financial',
    },
    {
      title: 'Inventory Management',
      description: 'Real-time inventory tracking with demand forecasting',
      route: 'inventory-management',
      icon: 'boxes',
      status: 'implemented',
      category: 'Inventory',
    },
    {
      title: 'Vendor Inventory Dashboard',
      description: 'Vendor-specific inventory management and forecasting',
      route: 'vendor-inventory',
      icon: 'clipboard-data',
      status: 'implemented',
      category: 'Vendor Tools',
    },
    {
      title: 'Logistics Dashboard',
      description: 'AI-powered route optimization and delivery management',
      route: 'logistics-dashboard',
      icon: 'truck',
      status: 'implemented',
      category: 'Logistics',
    },
    {
      title: 'Delivery Partner Dashboard',
      description: 'Driver performance tracking and earnings optimization',
      route: 'partner-dashboard',
      icon: 'person-badge',
      status: 'implemented',
      category: 'Logistics',
    },
    {
      title: 'Dispute Resolution Center',
      description: 'Professional mediation and conflict resolution system',
      route: 'dispute-resolution',
      icon: 'shield-exclamation',
      status: 'implemented',
      category: 'Support',
    },
    {
      title: 'Customer Dispute Portal',
      description: 'Customer-facing dispute management interface',
      route: 'customer-disputes',
      icon: 'person-exclamation',
      status: 'implemented',
      category: 'Support',
    },
    {
      title: 'Vendor Dispute Management',
      description: 'Vendor-specific dispute handling and resolution',
      route: 'vendor-disputes',
      icon: 'shop-window',
      status: 'implemented',
      category: 'Support',
    },
    {
      title: 'AI Business Intelligence',
      description: 'Machine learning-powered business insights and predictions',
      route: 'ai-intelligence',
      icon: 'robot',
      status: 'implemented',
      category: 'AI & Analytics',
    },
    {
      title: 'Social Commerce',
      description: 'Social media integration and influencer marketing',
      route: 'social-commerce',
      icon: 'share',
      status: 'implemented',
      category: 'Marketing',
    },
    {
      title: 'International Expansion',
      description: 'Multi-currency, localization, and global compliance',
      route: 'international-expansion',
      icon: 'globe',
      status: 'implemented',
      category: 'International',
    },
    {
      title: 'Business Analytics',
      description: 'Advanced reporting and business intelligence',
      route: null,
      icon: 'graph-up',
      status: 'planned',
      category: 'Analytics',
    },
    {
      title: 'Quality Assurance',
      description: 'Product quality verification and vendor scoring',
      route: null,
      icon: 'award',
      status: 'planned',
      category: 'Quality',
    },
    {
      title: 'Notification System',
      description: 'Multi-channel notification and communication hub',
      route: null,
      icon: 'bell',
      status: 'planned',
      category: 'Communication',
    },
    {
      title: 'Compliance Framework',
      description: 'Regulatory compliance and audit management',
      route: null,
      icon: 'shield-check',
      status: 'planned',
      category: 'Governance',
    },
    {
      title: 'AI-Powered Features',
      description: 'Machine learning for recommendations and forecasting',
      route: null,
      icon: 'cpu',
      status: 'future',
      category: 'AI/ML',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'implemented':
        return <Badge className="bg-green-100 text-green-800">✅ Implemented</Badge>;
      case 'planned':
        return <Badge variant="secondary">📋 Planned</Badge>;
      case 'future':
        return <Badge variant="outline">🚀 Future</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Multi-Vendor': 'bg-blue-100 text-blue-800',
      'Order Processing': 'bg-purple-100 text-purple-800',
      'Vendor Tools': 'bg-green-100 text-green-800',
      'Financial': 'bg-yellow-100 text-yellow-800',
      'Inventory': 'bg-orange-100 text-orange-800',
      'Logistics': 'bg-red-100 text-red-800',
      'Support': 'bg-pink-100 text-pink-800',
      'Analytics': 'bg-indigo-100 text-indigo-800',
      'Quality': 'bg-teal-100 text-teal-800',
      'Communication': 'bg-cyan-100 text-cyan-800',
      'Governance': 'bg-gray-100 text-gray-800',
      'AI/ML': 'bg-violet-100 text-violet-800',
      'AI & Analytics': 'bg-violet-100 text-violet-800',
      'Marketing': 'bg-pink-100 text-pink-800',
      'International': 'bg-emerald-100 text-emerald-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const implementedCount = frameworkFeatures.filter(f => f.status === 'implemented').length;
  const totalCount = frameworkFeatures.length;
  const completionPercentage = Math.round((implementedCount / totalCount) * 100);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--light-gray)' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <BootstrapIcon name="building" className="text-4xl text-blue-600" />
            <h1 className="text-4xl font-bold">Bato Framework Demo</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive multi-vendor marketplace platform with advanced e-commerce capabilities
          </p>
          
          {/* Progress Overview */}
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Implementation Progress</h3>
              <div className="text-3xl font-bold text-blue-600">{completionPercentage}%</div>
              <p className="text-sm text-gray-600">
                {implementedCount} of {totalCount} features implemented
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Button 
            onClick={() => actions.navigateToPage('vendor-onboarding')}
            className="btn-moema-primary h-16 text-lg"
          >
            <BootstrapIcon name="shop" className="mr-2 text-xl" />
            Vendor Onboarding
          </Button>
          <Button 
            onClick={() => actions.navigateToPage('payment-gateway')}
            className="btn-moema-secondary h-16 text-lg"
          >
            <BootstrapIcon name="credit-card" className="mr-2 text-xl" />
            Payment Gateway
          </Button>
          <Button 
            onClick={() => actions.navigateToPage('logistics-dashboard')}
            className="btn-moema-outline h-16 text-lg"
          >
            <BootstrapIcon name="truck" className="mr-2 text-xl" />
            Logistics Dashboard
          </Button>
          <Button 
            onClick={() => actions.navigateToPage('dispute-resolution')}
            className="btn-moema-outline h-16 text-lg"
          >
            <BootstrapIcon name="shield-exclamation" className="mr-2 text-xl" />
            Dispute Resolution
          </Button>
          <Button 
            onClick={() => actions.navigateToPage('inventory-management')}
            className="btn-moema-outline h-16 text-lg"
          >
            <BootstrapIcon name="boxes" className="mr-2 text-xl" />
            Inventory
          </Button>
          <Button 
            onClick={() => actions.navigateToPage('order-management')}
            className="btn-moema-outline h-16 text-lg"
          >
            <BootstrapIcon name="box-seam" className="mr-2 text-xl" />
            Orders
          </Button>
        </div>

        {/* Framework Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frameworkFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className={`transition-all duration-300 ${
                feature.route ? 'hover:shadow-lg cursor-pointer' : ''
              } ${feature.status === 'implemented' ? 'ring-2 ring-green-200' : ''}`}
              onClick={feature.route ? () => actions.navigateToPage(feature.route as any) : undefined}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <BootstrapIcon 
                      name={feature.icon} 
                      className={`text-2xl ${
                        feature.status === 'implemented' ? 'text-green-600' : 
                        feature.status === 'planned' ? 'text-blue-600' : 'text-gray-400'
                      }`} 
                    />
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <Badge className={`mt-1 ${getCategoryColor(feature.category)}`}>
                        {feature.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
                
                <div className="flex items-center justify-between">
                  {getStatusBadge(feature.status)}
                  {feature.route && (
                    <Button variant="ghost" size="sm">
                      <BootstrapIcon name="arrow-right" className="text-sm" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Development Roadmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BootstrapIcon name="map" className="text-xl" />
              <span>Development Roadmap</span>
            </CardTitle>
            <CardDescription>
              Planned implementation phases for complete framework coverage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">Phase 1: Foundation ✅</h4>
                <ul className="space-y-1 text-sm">
                  <li>✅ Vendor Registration</li>
                  <li>✅ Order Management</li>
                  <li>✅ Payment Processing</li>
                  <li>✅ Inventory Management</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">Phase 3: Advanced Features ✅</h4>
                <ul className="space-y-1 text-sm">
                  <li>✅ Logistics Integration</li>
                  <li>✅ Dispute Resolution</li>
                  <li>✅ Delivery Partner Management</li>
                  <li>✅ Route Optimization</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">Phase 3: Advanced ✅</h4>
                <ul className="space-y-1 text-sm">
                  <li>✅ Business Analytics</li>
                  <li>✅ Notification System</li>
                  <li>✅ Compliance Framework</li>
                  <li>✅ Advanced Reporting</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">Phase 4: Innovation ✅</h4>
                <ul className="space-y-1 text-sm">
                  <li>✅ AI Recommendations</li>
                  <li>✅ Business Intelligence</li>
                  <li>✅ International Expansion</li>
                  <li>✅ Social Commerce</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BootstrapIcon name="gear" className="text-xl" />
              <span>Technical Architecture</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600">Frontend Stack</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• React 18 with TypeScript</li>
                  <li>• Tailwind CSS v4.0</li>
                  <li>• ShadCN UI Components</li>
                  <li>• Custom Hook Architecture</li>
                  <li>• Mobile-First Design</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-600">State Management</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• AppProvider Pattern</li>
                  <li>• Custom Hooks (useVendorManagement)</li>
                  <li>• Local Storage Persistence</li>
                  <li>• Real-time State Updates</li>
                  <li>• Context API Integration</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">Business Logic</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Multi-vendor Support</li>
                  <li>• Commission Calculations</li>
                  <li>• Order Splitting</li>
                  <li>• Quality Scoring</li>
                  <li>• Workflow Automation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Back */}
        <div className="text-center pt-8">
          <Button 
            onClick={() => actions.navigateToPage('home')}
            variant="outline"
            className="btn-moema-outline"
          >
            <BootstrapIcon name="house" className="mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}