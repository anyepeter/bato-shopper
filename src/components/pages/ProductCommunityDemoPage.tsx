import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageCircle, 
  Star, 
  ShoppingBag, 
  Heart,
  Zap,
  Shield,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  Send,
  Search,
  Filter,
  MoreHorizontal,
  ThumbsUp,
  X,
  Smile,
  Paperclip,
  Crown,
  CheckCircle,
  Activity,
  Share2,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ModernEmojiPicker } from '../ModernEmojiPicker';
import { 
  getCommunityByProductId, 
  getMessagesForProduct, 
  COMMUNITY_MEMBERS,
  CommunityMessage as ImportedCommunityMessage
} from '../../constants/productCommunityData';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
}

interface ProductCommunityDemoPageProps {
  onNavigateToPage: (page: string) => void;
  currentUser: any;
  isMobile?: boolean;
}

export function ProductCommunityDemoPage({
  onNavigateToPage,
  currentUser,
  isMobile = false
}: ProductCommunityDemoPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState<ImportedCommunityMessage[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'helpful'>('newest');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Demo products for community showcase
  const demoProducts: Product[] = [
    {
      id: 1,
      name: 'Elegant Ankara Evening Dress',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Traditional Kente Print Top',
      price: 45.99,
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=600&fit=crop',
      rating: 4.6
    },
    {
      id: 3,
      name: 'Handcrafted African Jewelry Set',
      price: 125.00,
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=600&fit=crop',
      rating: 4.9
    }
  ];

  // Load messages when product is selected
  useEffect(() => {
    if (selectedProduct) {
      const productMessages = getMessagesForProduct(selectedProduct.id);
      setMessages(productMessages);
    }
  }, [selectedProduct]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const communityData = selectedProduct ? getCommunityByProductId(selectedProduct.id) : null;
  const onlineMembers = COMMUNITY_MEMBERS.filter(m => m.status === 'online');

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !selectedProduct) return;

    const newMessage: ImportedCommunityMessage = {
      id: Date.now(),
      userId: currentUser?.id || 999,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      reactions: {},
      userReactions: [],
      messageType: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    inputRef.current?.focus();
  }, [message, selectedProduct, currentUser]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const filteredMessages = useMemo(() => {
    let filtered = messages;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(msg => 
        msg.message.toLowerCase().includes(query)
      );
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'popular':
          const aReactions = Object.values(a.reactions).reduce((sum, count) => sum + count, 0);
          const bReactions = Object.values(b.reactions).reduce((sum, count) => sum + count, 0);
          return bReactions - aReactions;
        case 'helpful':
          return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        default:
          return 0;
      }
    });
  }, [messages, searchQuery, sortBy]);

  // Product Selection View
  if (!selectedProduct) {
    return (
      <div 
        className="min-h-screen"
        style={{
          backgroundColor: '#000000',
          color: '#FFFFFF'
        }}
      >
        {/* Header */}
        <div 
          className="border-b"
          style={{
            backgroundColor: '#3f3f3fff',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => onNavigateToPage('home')}
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  style={{ borderRadius: '3px' }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="font-heading text-3xl text-white">Product Communities</h1>
                  <p className="font-body text-gray-400 mt-1">
                    Connect with buyers, share experiences, get authentic insights
                  </p>
                </div>
              </div>
              <Badge 
                className="bg-purple-600 text-white px-4 py-2"
                style={{ borderRadius: '3px' }}
              >
                <Users className="h-4 w-4 mr-2" />
                {COMMUNITY_MEMBERS.length} Total Members
              </Badge>
            </div>
          </div>
        </div>

        {/* Product Selection Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="font-heading text-2xl text-white mb-2">Select a Product Community</h2>
            <p className="font-body text-gray-400">
              Choose a product to join its community chat
            </p>
          </div>

          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {demoProducts.map((product, index) => {
              const community = getCommunityByProductId(product.id);
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: '#3f3f3fff',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px'
                    }}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-heading text-white mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating) 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-gray-600'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">({product.rating})</span>
                      </div>

                      <div className="text-2xl font-heading text-purple-400 mb-4">
                        ${product.price}
                      </div>

                      {community && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400 font-body">Members</span>
                            <span className="text-white font-body">{community.memberCount}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400 font-body">Online</span>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-white font-body">{community.onlineCount}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400 font-body">Activity</span>
                            <Badge 
                              className="bg-green-600/20 text-green-400 border-green-600/30"
                              style={{ borderRadius: '3px' }}
                            >
                              {community.weeklyActivity}%
                            </Badge>
                          </div>
                        </div>
                      )}

                      <Button 
                        className="w-full mt-4 text-white font-body"
                        style={{
                          backgroundColor: '#4040f8ff',
                          borderRadius: '3px'
                        }}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Join Community
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Community Features */}
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Shield className="h-6 w-6" />,
                title: 'Verified Members Only',
                description: 'Connect with real buyers and product owners'
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Instant Responses',
                description: 'Get answers within ~15 minutes'
              },
              {
                icon: <Award className="h-6 w-6" />,
                title: 'Earn Rewards',
                description: 'Get badges for helpful contributions'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card 
                  className="p-6"
                  style={{
                    backgroundColor: '#3f3f3fff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px'
                  }}
                >
                  <div className="text-purple-400 mb-3">{feature.icon}</div>
                  <h3 className="font-heading text-white mb-2">{feature.title}</h3>
                  <p className="font-body text-gray-400 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Community Chat View
  return (
    <div 
      className="h-screen flex flex-col"
      style={{
        backgroundColor: '#000000',
        color: '#FFFFFF'
      }}
    >
      {/* Header */}
      <div 
        className="border-b flex-shrink-0"
        style={{
          backgroundColor: '#3f3f3fff',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setSelectedProduct(null)}
                variant="ghost"
                className="text-white hover:bg-white/10"
                style={{ borderRadius: '3px' }}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 overflow-hidden"
                  style={{ borderRadius: '3px' }}
                >
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-heading text-white">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-400 font-body">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {communityData?.memberCount} members
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      {communityData?.onlineCount} online
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge 
                className="bg-purple-600 text-white font-body"
                style={{ borderRadius: '3px' }}
              >
                <Activity className="h-3 w-3 mr-1" />
                {communityData?.weeklyActivity}% Active
              </Badge>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                style={{ borderRadius: '3px' }}
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                style={{ borderRadius: '3px' }}
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div 
            className="border-b flex-shrink-0"
            style={{
              backgroundColor: '#3f3f3fff',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6">
                <TabsList 
                  className="bg-transparent border-b-0"
                  style={{ borderRadius: '0' }}
                >
                  <TabsTrigger 
                    value="chat"
                    className="data-[state=active]:bg-transparent data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 text-gray-400 font-body"
                    style={{ borderRadius: '0' }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Community Chat
                  </TabsTrigger>
                  <TabsTrigger 
                    value="members"
                    className="data-[state=active]:bg-transparent data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 text-gray-400 font-body"
                    style={{ borderRadius: '0' }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Members
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insights"
                    className="data-[state=active]:bg-transparent data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 text-gray-400 font-body"
                    style={{ borderRadius: '0' }}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Insights
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} className="h-full flex flex-col">
              <TabsContent value="chat" className="flex-1 flex flex-col m-0">
                {/* Search and Filter */}
                <div 
                  className="p-4 border-b"
                  style={{
                    backgroundColor: '#3f3f3fff',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-black/30 border-gray-700 text-white placeholder:text-gray-500 font-body"
                        style={{ borderRadius: '3px' }}
                      />
                    </div>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger 
                        className="w-[150px] bg-black/30 border-gray-700 text-white font-body"
                        style={{ borderRadius: '3px' }}
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="popular">Popular</SelectItem>
                        <SelectItem value="helpful">Most Helpful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {filteredMessages.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 font-body">
                          {searchQuery ? 'No messages found' : 'Be the first to start the conversation!'}
                        </p>
                      </div>
                    ) : (
                      filteredMessages.map((msg) => {
                        const member = COMMUNITY_MEMBERS.find(m => m.id === msg.userId);
                        
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${msg.isHighlighted ? 'bg-purple-900/20 p-3' : ''}`}
                            style={{ borderRadius: msg.isHighlighted ? '3px' : '0' }}
                          >
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <img src={member?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'} alt={member?.name || 'User'} />
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-heading text-white">{member?.name || 'Anonymous'}</span>
                                {member?.isVerified && (
                                  <CheckCircle className="h-4 w-4 text-blue-400" />
                                )}
                                {member?.badges.includes('top-reviewer') && (
                                  <Crown className="h-4 w-4 text-yellow-400" />
                                )}
                                <span className="text-xs text-gray-500 font-body">
                                  {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="font-body text-gray-300 mb-2">{msg.message}</p>
                              
                              {msg.messageType !== 'text' && (
                                <Badge 
                                  className="mb-2 bg-purple-600/20 text-purple-400 border-purple-600/30 font-body"
                                  style={{ borderRadius: '3px' }}
                                >
                                  {msg.messageType}
                                </Badge>
                              )}

                              <div className="flex items-center gap-3 text-sm">
                                <button className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors font-body">
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{msg.helpfulCount || 0}</span>
                                </button>
                                <button className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors font-body">
                                  <Smile className="h-4 w-4" />
                                  <span>{Object.values(msg.reactions).reduce((sum, count) => sum + count, 0)}</span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div 
                  className="p-4 border-t"
                  style={{
                    backgroundColor: '#3f3f3fff',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <Textarea
                        ref={inputRef}
                        placeholder="Share your thoughts with the community..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="min-h-[60px] max-h-[120px] bg-black/30 border-gray-700 text-white placeholder:text-gray-500 resize-none font-body"
                        style={{ borderRadius: '3px' }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-gray-400 hover:text-purple-400 hover:bg-white/10"
                        style={{ borderRadius: '3px' }}
                      >
                        <Smile className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-purple-400 hover:bg-white/10"
                        style={{ borderRadius: '3px' }}
                      >
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="text-white font-body"
                        style={{
                          backgroundColor: '#4040f8ff',
                          borderRadius: '3px'
                        }}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {showEmojiPicker && (
                    <div className="mt-3">
                      <ModernEmojiPicker onSelect={handleEmojiSelect} />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="members" className="flex-1 m-0">
                <ScrollArea className="h-full p-6">
                  <div className="space-y-4">
                    <h3 className="font-heading text-white mb-4">
                      Online Members ({onlineMembers.length})
                    </h3>
                    {onlineMembers.map((member) => (
                      <div 
                        key={member.id}
                        className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors"
                        style={{ borderRadius: '3px' }}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <img src={member.avatar} alt={member.name} />
                          </Avatar>
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-white">{member.name}</span>
                            {member.isVerified && (
                              <CheckCircle className="h-4 w-4 text-blue-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400 font-body">
                            <Badge 
                              className="bg-purple-600/20 text-purple-400 border-purple-600/30"
                              style={{ borderRadius: '3px' }}
                            >
                              {member.purchaseStatus}
                            </Badge>
                            {member.badges.map((badge) => (
                              <span key={badge} className="text-xs">
                                {badge === 'top-reviewer' && '⭐'}
                                {badge === 'super-fan' && '❤️'}
                                {badge === 'helpful' && '🎁'}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="insights" className="flex-1 m-0">
                <ScrollArea className="h-full p-6">
                  <div className="space-y-6">
                    <Card 
                      className="p-6"
                      style={{
                        backgroundColor: '#3f3f3fff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '3px'
                      }}
                    >
                      <h3 className="font-heading text-white mb-4">Community Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-3xl font-heading text-purple-400">{communityData?.memberCount}</div>
                          <div className="text-sm text-gray-400 font-body">Total Members</div>
                        </div>
                        <div>
                          <div className="text-3xl font-heading text-green-400">{communityData?.onlineCount}</div>
                          <div className="text-sm text-gray-400 font-body">Online Now</div>
                        </div>
                        <div>
                          <div className="text-3xl font-heading text-blue-400">{communityData?.totalMessages}</div>
                          <div className="text-sm text-gray-400 font-body">Messages</div>
                        </div>
                        <div>
                          <div className="text-3xl font-heading text-yellow-400">{communityData?.weeklyActivity}%</div>
                          <div className="text-sm text-gray-400 font-body">Weekly Activity</div>
                        </div>
                      </div>
                    </Card>

                    <Card 
                      className="p-6"
                      style={{
                        backgroundColor: '#3f3f3fff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '3px'
                      }}
                    >
                      <h3 className="font-heading text-white mb-4">Top Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {communityData?.topTags.map((tag) => (
                          <Badge 
                            key={tag}
                            className="bg-purple-600/20 text-purple-400 border-purple-600/30 font-body"
                            style={{ borderRadius: '3px' }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Sidebar - Community Info */}
        {!isMobile && (
          <div 
            className="w-80 border-l overflow-y-auto"
            style={{
              backgroundColor: '#3f3f3fff',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="p-6 space-y-6">
              {/* Product Info */}
              <div>
                <h3 className="font-heading text-white mb-3">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-body">Price</span>
                    <span className="text-white font-body">${selectedProduct.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-body">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-body">{selectedProduct.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Community Stats */}
              <div>
                <h3 className="font-heading text-white mb-3">Community Health</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400 font-body">Response Time</span>
                      <span className="text-white font-body">{communityData?.communityStats.averageResponseTime}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400 font-body">Questions Answered</span>
                      <span className="text-white font-body">{communityData?.communityStats.questionsAnswered}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400 font-body">Helpful Reviews</span>
                      <span className="text-white font-body">{communityData?.communityStats.helpfulReviews}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Quick Actions */}
              <div>
                <h3 className="font-heading text-white mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button 
                    className="w-full justify-start text-white font-body"
                    variant="ghost"
                    style={{ borderRadius: '3px' }}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Add to Favorites
                  </Button>
                  <Button 
                    className="w-full justify-start text-white font-body"
                    variant="ghost"
                    style={{ borderRadius: '3px' }}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    className="w-full justify-start text-white font-body"
                    variant="ghost"
                    style={{ borderRadius: '3px' }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Product
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
