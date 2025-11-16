import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useSocialCommerce } from '../../hooks/useSocialCommerce';
import { BootstrapIcon } from '../BootstrapIcon';

export function SocialCommerceDashboard() {
  const {
    socialPosts,
    influencerCampaigns,
    userGeneratedContent,
    socialAnalytics,
    viralProducts,
    socialListening,
    isLoading,
    error,
    createSocialPost,
    createInfluencerCampaign,
    getSocialCommerceAnalytics,
  } = useSocialCommerce();

  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading social commerce data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Social Commerce Dashboard</h1>
          <p className="text-gray-600">Manage your social media presence and influencer partnerships</p>
        </div>
        
        <div className="flex space-x-2">
          <Button className="btn-moema-secondary">
            <BootstrapIcon name="plus" className="mr-2" />
            Create Post
          </Button>
          <Button className="btn-moema-primary">
            <BootstrapIcon name="people" className="mr-2" />
            Find Influencers
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Followers</p>
                <p className="text-2xl font-bold">{socialAnalytics.overview.totalFollowers.toLocaleString()}</p>
              </div>
              <BootstrapIcon name="people" className="text-blue-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold">{(socialAnalytics.overview.averageEngagementRate * 100).toFixed(1)}%</p>
              </div>
              <BootstrapIcon name="heart" className="text-red-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Social ROI</p>
                <p className="text-2xl font-bold">{socialAnalytics.overview.socialROI.toFixed(1)}x</p>
              </div>
              <BootstrapIcon name="graph-up" className="text-green-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Viral Products</p>
                <p className="text-2xl font-bold">{viralProducts.length}</p>
              </div>
              <BootstrapIcon name="fire" className="text-orange-600 text-2xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Social Posts</TabsTrigger>
          <TabsTrigger value="influencers">Influencers</TabsTrigger>
          <TabsTrigger value="ugc">User Generated</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Platform Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {socialAnalytics.platformBreakdown.map((platform) => (
                  <div key={platform.platform} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{platform.platform}</h4>
                      <Badge variant="outline">+{(platform.growthRate * 100).toFixed(1)}%</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Followers:</span>
                        <span className="font-medium ml-1">{platform.followers.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Posts:</span>
                        <span className="font-medium ml-1">{platform.posts}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Engagement:</span>
                        <span className="font-medium ml-1">{(platform.engagementRate * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-medium ml-1 text-green-600">${platform.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <Progress value={(platform.engagementRate * 100)} className="mt-2 h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Viral Products */}
          <Card>
            <CardHeader>
              <CardTitle>Trending Products</CardTitle>
              <CardDescription>Products with viral potential on social media</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {viralProducts.slice(0, 5).map((product) => (
                  <div key={product.productId} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">Product {product.productId}</h4>
                      <p className="text-sm text-gray-600">
                        {product.socialMentions} mentions • {product.trendingPlatforms.join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">{product.viralScore}</div>
                      <p className="text-xs text-gray-600">Viral Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Social Posts</CardTitle>
              <CardDescription>Latest posts across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {socialPosts.slice(0, 10).map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="capitalize">{post.platform}</Badge>
                        <span className="text-sm text-gray-600">{post.createdAt.toLocaleDateString()}</span>
                      </div>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm mb-3">{post.content.caption}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <BootstrapIcon name="heart" className="mr-1" />
                        {post.engagement.likes}
                      </span>
                      <span className="flex items-center">
                        <BootstrapIcon name="chat" className="mr-1" />
                        {post.engagement.comments}
                      </span>
                      <span className="flex items-center">
                        <BootstrapIcon name="share" className="mr-1" />
                        {post.engagement.shares}
                      </span>
                      <span className="flex items-center">
                        <BootstrapIcon name="eye" className="mr-1" />
                        {post.engagement.views || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="influencers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Influencer Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {influencerCampaigns.slice(0, 5).map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{campaign.name}</h4>
                        <p className="text-sm text-gray-600">@{campaign.influencer.username} • {campaign.influencer.followers.toLocaleString()} followers</p>
                      </div>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Reach:</span>
                        <span className="font-medium ml-1">{campaign.performance.reach.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Engagement:</span>
                        <span className="font-medium ml-1">{campaign.performance.engagement.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Conversions:</span>
                        <span className="font-medium ml-1">{campaign.performance.conversions}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">ROI:</span>
                        <span className="font-medium ml-1 text-green-600">{campaign.performance.roi.toFixed(1)}x</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ugc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Generated Content</CardTitle>
              <CardDescription>Customer posts featuring your products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userGeneratedContent.slice(0, 9).map((ugc) => (
                  <div key={ugc.id} className="border rounded-lg overflow-hidden">
                    {ugc.content.type === 'image' && (
                      <img src={ugc.content.url} alt="UGC" className="w-full h-48 object-cover" />
                    )}
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="capitalize">{ugc.platform}</Badge>
                        <Badge variant={ugc.isApproved ? 'default' : 'secondary'}>
                          {ugc.isApproved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm">{ugc.content.caption}</p>
                      <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <BootstrapIcon name="heart" className="mr-1" />
                          {ugc.engagement.likes}
                        </span>
                        {ugc.content.rating && (
                          <span className="flex items-center">
                            <BootstrapIcon name="star-fill" className="mr-1 text-yellow-500" />
                            {ugc.content.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Listening Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Brand Sentiment</h4>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{socialListening.sentimentScore}/10</div>
                    <p className="text-sm text-gray-600 capitalize">Overall {socialListening.sentiment}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Brand Mentions</h4>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{socialListening.brandMentions.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">This Month</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Trending Hashtags</h4>
                <div className="flex flex-wrap gap-2">
                  {socialListening.topHashtags.map((hashtag, index) => (
                    <Badge key={index} variant="outline" className="text-blue-600">
                      {hashtag.tag} • {hashtag.volume.toLocaleString()}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}