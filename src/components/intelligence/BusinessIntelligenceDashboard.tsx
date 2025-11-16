import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { useRecommendationEngine } from '../../hooks/useRecommendationEngine';
import { BootstrapIcon } from '../BootstrapIcon';

interface BusinessIntelligenceDashboardProps {
  userRole?: 'admin' | 'vendor' | 'analyst';
  scope?: 'platform' | 'vendor';
  vendorId?: string;
}

export function BusinessIntelligenceDashboard({ 
  userRole = 'admin', 
  scope = 'platform',
  vendorId 
}: BusinessIntelligenceDashboardProps) {
  const {
    insights,
    models,
    personalizedRecommendations,
    trendingProducts,
    isLoading,
    error,
    getRecommendationAnalytics,
    generatePersonalizedRecommendations,
    analyzeTrendingProducts,
  } = useRecommendationEngine();

  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [marketInsights, setMarketInsights] = useState<any>(null);

  // AI-powered market analysis
  const marketAnalysis = React.useMemo(() => {
    return {
      revenueGrowth: {
        current: 23.5,
        predicted: 31.2,
        confidence: 0.87,
        factors: ['Seasonal trends', 'New product launches', 'Marketing campaigns'],
      },
      customerSegments: [
        { name: 'Premium Buyers', size: 15, value: 45, growth: 12.3 },
        { name: 'Regular Customers', size: 60, value: 35, growth: 8.7 },
        { name: 'Bargain Hunters', size: 25, value: 20, growth: 5.2 },
      ],
      productPerformance: {
        topCategories: [
          { name: 'Dresses', revenue: 125000, growth: 18.5, units: 1250 },
          { name: 'Tops', revenue: 89000, growth: 12.3, units: 1780 },
          { name: 'Accessories', revenue: 67000, growth: 22.1, units: 2340 },
        ],
        riskCategories: [
          { name: 'Winter Items', revenue: 23000, decline: -15.2, risk: 'high' },
        ],
      },
      demandForecasting: {
        nextMonth: {
          dresses: { demand: 1450, confidence: 0.91, trend: 'up' },
          tops: { demand: 1890, confidence: 0.85, trend: 'stable' },
          accessories: { demand: 2150, confidence: 0.78, trend: 'up' },
        },
        seasonalAdjustments: {
          summer: 1.35,
          fall: 0.95,
          winter: 0.72,
          spring: 1.18,
        },
      },
    };
  }, []);

  // AI-powered recommendations analytics
  const recommendationMetrics = React.useMemo(() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    return getRecommendationAnalytics({ from: thirtyDaysAgo, to: now });
  }, [getRecommendationAnalytics]);

  // Predictive analytics
  const generatePredictions = React.useCallback(async () => {
    try {
      // Simulate AI-powered predictions
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPredictions = [
        {
          id: 'pred_1',
          type: 'revenue',
          title: 'Revenue Forecast',
          prediction: '$156,000',
          confidence: 0.89,
          timeframe: 'Next 30 days',
          factors: ['Historical trends', 'Seasonal patterns', 'Marketing campaigns'],
          impact: 'high',
        },
        {
          id: 'pred_2',
          type: 'demand',
          title: 'Demand Spike Alert',
          prediction: '+45% for Dresses',
          confidence: 0.82,
          timeframe: 'Next 14 days',
          factors: ['Social media trends', 'Influencer partnerships', 'Weather patterns'],
          impact: 'medium',
        },
        {
          id: 'pred_3',
          type: 'churn',
          title: 'Customer Retention Risk',
          prediction: '12% at risk',
          confidence: 0.76,
          timeframe: 'Next 60 days',
          factors: ['Purchase frequency', 'Engagement metrics', 'Support interactions'],
          impact: 'high',
        },
        {
          id: 'pred_4',
          type: 'inventory',
          title: 'Stock Optimization',
          prediction: 'Reduce by 15%',
          confidence: 0.91,
          timeframe: 'Current',
          factors: ['Sales velocity', 'Carrying costs', 'Demand patterns'],
          impact: 'medium',
        },
      ];
      
      setPredictions(newPredictions);
    } catch (error) {
      console.error('Failed to generate predictions:', error);
    }
  }, []);

  // Real-time market insights
  const fetchMarketInsights = React.useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const insights = {
        competitorAnalysis: {
          pricePositioning: 'competitive',
          marketShare: '12.3%',
          growthRate: '+18.5%',
          recommendation: 'Maintain current pricing, focus on differentiation',
        },
        trendAnalysis: {
          emergingTrends: ['Sustainable fashion', 'Plus-size inclusivity', 'Color-blocking'],
          decliningTrends: ['Fast fashion', 'Synthetic materials'],
          opportunities: ['Eco-friendly collections', 'Custom sizing', 'Subscription boxes'],
        },
        customerSentiment: {
          overall: 'positive',
          score: 8.2,
          themes: ['Quality', 'Fit', 'Customer service'],
          concerns: ['Shipping times', 'Return process'],
        },
      };
      
      setMarketInsights(insights);
    } catch (error) {
      console.error('Failed to fetch market insights:', error);
    }
  }, []);

  const handleTimeRangeChange = (newRange: string) => {
    setTimeRange(newRange);
    // Trigger data refresh
    generatePredictions();
  };

  useEffect(() => {
    generatePredictions();
    fetchMarketInsights();
  }, [generatePredictions, fetchMarketInsights]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading AI-powered insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Business Intelligence Dashboard</h1>
          <p className="text-gray-600">AI-powered insights and predictive analytics</p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generatePredictions} className="btn-moema-secondary">
            <BootstrapIcon name="arrow-clockwise" className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">AI Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="market">Market Intelligence</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">AI Accuracy</p>
                    <p className="text-2xl font-bold">{(insights.averageRecommendationAccuracy * 100).toFixed(1)}%</p>
                  </div>
                  <BootstrapIcon name="robot" className="text-blue-600 text-2xl" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue Growth</p>
                    <p className="text-2xl font-bold">+{marketAnalysis.revenueGrowth.current}%</p>
                  </div>
                  <BootstrapIcon name="graph-up-arrow" className="text-green-600 text-2xl" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Prediction Confidence</p>
                    <p className="text-2xl font-bold">{(marketAnalysis.revenueGrowth.confidence * 100).toFixed(0)}%</p>
                  </div>
                  <BootstrapIcon name="shield-check" className="text-purple-600 text-2xl" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Models</p>
                    <p className="text-2xl font-bold">{models.filter(m => m.isActive).length}</p>
                  </div>
                  <BootstrapIcon name="cpu" className="text-orange-600 text-2xl" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Prediction */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth Prediction</CardTitle>
              <CardDescription>AI-powered revenue forecasting with confidence intervals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Growth Rate</p>
                    <p className="text-xl font-bold text-green-600">+{marketAnalysis.revenueGrowth.current}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Predicted Growth Rate</p>
                    <p className="text-xl font-bold text-blue-600">+{marketAnalysis.revenueGrowth.predicted}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Confidence Level</p>
                    <p className="text-xl font-bold text-purple-600">{(marketAnalysis.revenueGrowth.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
                
                <Progress value={marketAnalysis.revenueGrowth.confidence * 100} className="h-3" />
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Key Growth Factors</h4>
                  <ul className="text-sm space-y-1">
                    {marketAnalysis.revenueGrowth.factors.map((factor, index) => (
                      <li key={index} className="flex items-center">
                        <BootstrapIcon name="check" className="text-green-600 mr-2" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Segments */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Segment Analysis</CardTitle>
              <CardDescription>AI-identified customer segments and their value potential</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketAnalysis.customerSegments.map((segment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{segment.name}</h4>
                      <Badge variant="outline">+{segment.growth}% growth</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium ml-1">{segment.size}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg. Value:</span>
                        <span className="font-medium ml-1">${segment.value}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Growth:</span>
                        <span className="font-medium ml-1 text-green-600">+{segment.growth}%</span>
                      </div>
                    </div>
                    <Progress value={segment.value} className="mt-2 h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.map((prediction) => (
              <Card key={prediction.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{prediction.title}</h3>
                      <p className="text-sm text-gray-600">{prediction.timeframe}</p>
                    </div>
                    <Badge 
                      variant={prediction.impact === 'high' ? 'destructive' : 
                               prediction.impact === 'medium' ? 'secondary' : 'outline'}
                    >
                      {prediction.impact} impact
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <p className="text-2xl font-bold text-blue-600">{prediction.prediction}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-600 mr-2">Confidence:</span>
                      <Progress value={prediction.confidence * 100} className="flex-1 h-2" />
                      <span className="text-sm font-medium ml-2">{(prediction.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Contributing Factors:</h4>
                    <ul className="text-xs space-y-1">
                      {prediction.factors.map((factor: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <BootstrapIcon name="dot" className="mr-1" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendation Performance</CardTitle>
              <CardDescription>Analytics for the recommendation engine effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {(recommendationMetrics.clickThroughRate * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600">Click-Through Rate</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {(recommendationMetrics.conversionRate * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    ${recommendationMetrics.revenueImpact.toFixed(0)}
                  </div>
                  <p className="text-sm text-gray-600">Revenue Impact</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.topPerformingCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium capitalize">{category.category}</h4>
                      <p className="text-sm text-gray-600">
                        CTR: {(category.clickThroughRate * 100).toFixed(1)}% • 
                        CVR: {(category.conversionRate * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${category.revenueImpact.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          {marketInsights && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Competitive Analysis</CardTitle>
                  <CardDescription>AI-powered market positioning insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Market Share:</span>
                        <span className="font-bold ml-2">{marketInsights.competitorAnalysis.marketShare}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Growth Rate:</span>
                        <span className="font-bold ml-2 text-green-600">{marketInsights.competitorAnalysis.growthRate}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Price Position:</span>
                        <span className="font-bold ml-2 capitalize">{marketInsights.competitorAnalysis.pricePositioning}</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">AI Recommendation</h4>
                      <p className="text-sm">{marketInsights.competitorAnalysis.recommendation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trend Analysis</CardTitle>
                  <CardDescription>Emerging trends and opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 text-green-600">Emerging Trends</h4>
                      <ul className="space-y-2">
                        {marketInsights.trendAnalysis.emergingTrends.map((trend: string, index: number) => (
                          <li key={index} className="flex items-center text-sm">
                            <BootstrapIcon name="trending-up" className="text-green-600 mr-2" />
                            {trend}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 text-blue-600">Market Opportunities</h4>
                      <ul className="space-y-2">
                        {marketInsights.trendAnalysis.opportunities.map((opportunity: string, index: number) => (
                          <li key={index} className="flex items-center text-sm">
                            <BootstrapIcon name="lightbulb" className="text-blue-600 mr-2" />
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Sentiment Analysis</CardTitle>
                  <CardDescription>AI-powered sentiment tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Overall Sentiment</p>
                      <p className="text-2xl font-bold capitalize">{marketInsights.customerSentiment.overall}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{marketInsights.customerSentiment.score}/10</div>
                      <p className="text-sm text-gray-600">Satisfaction Score</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-green-600">Positive Themes</h4>
                      <ul className="text-sm space-y-1">
                        {marketInsights.customerSentiment.themes.map((theme: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <BootstrapIcon name="heart" className="text-green-600 mr-2" />
                            {theme}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-orange-600">Areas for Improvement</h4>
                      <ul className="text-sm space-y-1">
                        {marketInsights.customerSentiment.concerns.map((concern: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <BootstrapIcon name="exclamation-triangle" className="text-orange-600 mr-2" />
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Performance</CardTitle>
              <CardDescription>Active machine learning models and their performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{model.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{model.type.replace('_', ' ')}</p>
                      </div>
                      <Badge variant={model.isActive ? 'default' : 'secondary'}>
                        {model.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-bold text-blue-600">{(model.accuracy * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-bold text-green-600">{(model.performance.precision * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-600">Precision</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="font-bold text-purple-600">{(model.performance.recall * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-600">Recall</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <div className="font-bold text-orange-600">{(model.performance.f1Score * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-600">F1 Score</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600">
                      <p>Training Data: {model.trainingData.toLocaleString()} samples</p>
                      <p>Last Trained: {model.lastTrained.toLocaleDateString()}</p>
                      <p>CTR: {(model.performance.clickThroughRate * 100).toFixed(1)}% • CVR: {(model.performance.conversionRate * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert>
          <BootstrapIcon name="exclamation-triangle" className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}