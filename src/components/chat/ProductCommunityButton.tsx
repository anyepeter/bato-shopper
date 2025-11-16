import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  Users, 
  Lock, 
  ShoppingBag, 
  Heart, 
  Crown,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { ProductCommunityChatRoomFixed } from './ProductCommunityChatRoomFixed';
import { CommunityManagementPanel } from './CommunityManagementPanel';
import { getCommunityByProductId, getUserEligibility } from '../../constants/productCommunityData';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
}

interface ProductCommunityButtonProps {
  product: Product;
  currentUser: any;
  isMobile?: boolean;
  onFavoriteProduct?: (productId: number) => void;
  onPurchaseProduct?: (productId: number) => void;
  className?: string;
  isFavorite?: boolean;
  isInCart?: boolean;
}

export function ProductCommunityButton({
  product,
  currentUser,
  isMobile = false,
  onFavoriteProduct,
  onPurchaseProduct,
  className = "",
  isFavorite = false,
  isInCart = false
}: ProductCommunityButtonProps) {
  const [showCommunityChat, setShowCommunityChat] = useState(false);
  const [showManagementPanel, setShowManagementPanel] = useState(false);
  const [showEligibilityCard, setShowEligibilityCard] = useState(false);
  const [forceEligible, setForceEligible] = useState(false);

  // Get community data and user eligibility
  const communityData = useMemo(() => getCommunityByProductId(product.id), [product.id]);
  const userEligibility = useMemo(() => {
    if (!currentUser) return { isEligible: false, reason: 'Please sign in to join product communities', purchaseStatus: 'none' as const };
    
    // 🔥 FIX: Check real-time favorites/cart state in addition to mock data
    const mockEligibility = getUserEligibility(currentUser.id, product.id);
    
    // If user has favorited or added to cart in real-time, grant eligibility
    if (forceEligible || isFavorite || isInCart) {
      let purchaseStatus: 'purchased' | 'favorited' | 'both' | 'none' = 'none';
      if (isInCart && isFavorite) {
        purchaseStatus = 'both';
      } else if (isInCart) {
        purchaseStatus = 'purchased';
      } else if (isFavorite) {
        purchaseStatus = 'favorited';
      }
      
      return {
        isEligible: true,
        reason: 'User has interacted with this product',
        purchaseStatus: purchaseStatus !== 'none' ? purchaseStatus : mockEligibility.purchaseStatus
      };
    }
    
    return mockEligibility;
  }, [currentUser, product.id, isFavorite, isInCart, forceEligible]);

  const handleJoinCommunity = useCallback(() => {
    // 🔥 FIX: For Desktop/Tablet, allow direct access if already eligible
    if (!userEligibility.isEligible) {
      setShowEligibilityCard(true);
      return;
    }
    setShowCommunityChat(true);
  }, [userEligibility.isEligible]);

  const handleManagementAccess = useCallback(() => {
    // Check if user is admin or moderator
    const isAdmin = currentUser?.isAdmin || currentUser?.role === 'moderator';
    if (isAdmin) {
      setShowManagementPanel(true);
    }
  }, [currentUser]);

  const handleFavoriteAction = useCallback(() => {
    if (onFavoriteProduct) {
      onFavoriteProduct(product.id);
      setShowEligibilityCard(false);
      // 🔥 FIX: Grant immediate eligibility and open chat
      setForceEligible(true);
      setTimeout(() => {
        setShowCommunityChat(true);
      }, 500);
    }
  }, [onFavoriteProduct, product.id]);

  const handlePurchaseAction = useCallback(() => {
    if (onPurchaseProduct) {
      onPurchaseProduct(product.id);
      setShowEligibilityCard(false);
      // 🔥 FIX: Grant immediate eligibility and open chat
      setForceEligible(true);
      setTimeout(() => {
        setShowCommunityChat(true);
      }, 500);
    }
  }, [onPurchaseProduct, product.id]);

  if (!communityData) {
    return null; // No community for this product
  }

  const getStatusBadge = () => {
    if (!userEligibility.isEligible) {
      return { text: 'Join to Access', color: 'bg-gray-500' };
    }
    
    switch (userEligibility.purchaseStatus) {
      case 'both':
        return { text: 'VIP Member', color: 'bg-purple-600' };
      case 'purchased':
        return { text: 'Buyer', color: 'bg-blue-600' };
      case 'favorited':
        return { text: 'Fan', color: 'bg-red-500' };
      default:
        return { text: 'Guest', color: 'bg-gray-500' };
    }
  };

  const statusBadge = getStatusBadge();
  const isAdmin = currentUser?.isAdmin || currentUser?.role === 'moderator';

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Main Community Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleJoinCommunity}
            variant="outline"
            className={`
              relative w-full h-auto p-4 flex flex-col gap-3 border-2 transition-all duration-300
              ${userEligibility.isEligible 
                ? 'border-purple-200 hover:border-purple-400 bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100' 
                : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'
              }
              ${isMobile ? 'rounded-xl' : 'rounded-lg'}
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${
                  userEligibility.isEligible ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <h4 className="font-heading font-bold text-sm text-gray-900">
                    Product Community
                  </h4>
                  <p className="text-xs text-gray-600">
                    Connect with other buyers
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className={`${statusBadge.color} text-white text-xs`}>
                {statusBadge.text}
              </Badge>
            </div>

            {/* Community Stats */}
            <div className="flex items-center justify-between w-full text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-700 font-medium">{communityData.memberCount}</span>
                  <span className="text-gray-500">members</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 font-medium">{communityData.onlineCount}</span>
                  <span className="text-gray-500">online</span>
                </div>
              </div>
              
              {userEligibility.isEligible && (
                <div className="text-xs text-purple-600 font-medium">
                  ✨ Join Chat
                </div>
              )}
            </div>

            {/* Activity Indicator */}
            <div 
              className="w-full bg-gray-200 h-1.5 overflow-hidden"
              style={{ borderRadius: '4px' }}
            >
              <motion.div
                className={`h-full ${
                  userEligibility.isEligible ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-400'
                }`}
                style={{ 
                  width: `${communityData.weeklyActivity}%`,
                  borderRadius: '4px'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${communityData.weeklyActivity}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            <div className="flex justify-between items-center w-full text-xs text-gray-500">
              <span>Community Activity</span>
              <span>{communityData.weeklyActivity}% this week</span>
            </div>

            {/* Access Status */}
            {!userEligibility.isEligible && (
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 rounded-lg p-2 w-full">
                <Lock className="h-3 w-3" />
                <span>Purchase or favorite this product to join</span>
              </div>
            )}
          </Button>
        </motion.div>

        {/* Admin Management Button */}
        {isAdmin && userEligibility.isEligible && (
          <motion.div
            className="absolute -top-1 -right-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={handleManagementAccess}
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0 rounded-full bg-purple-600 border-purple-600 text-white hover:bg-purple-700 shadow-lg"
              title="Community Management"
            >
              <Crown className="h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Eligibility Card Overlay */}
      <AnimatePresence>
        {showEligibilityCard && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEligibilityCard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="p-6 bg-white rounded-xl shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">
                    Join Product Community
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Connect with {communityData.memberCount} other buyers, share experiences, 
                    ask questions, and get styling tips for this product.
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handlePurchaseAction}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-12 flex items-center justify-center gap-3"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">Purchase Product</div>
                        <div className="text-xs text-purple-100">Get full community access</div>
                      </div>
                      <div className="text-xs bg-purple-500 px-2 py-1 rounded-full">
                        ${product.price}
                      </div>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleFavoriteAction}
                      variant="outline"
                      className="w-full border-2 border-red-200 hover:border-red-400 text-red-600 hover:bg-red-50 rounded-lg h-12 flex items-center justify-center gap-3"
                    >
                      <Heart className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">Add to Favorites</div>
                        <div className="text-xs text-red-500">Join as community fan</div>
                      </div>
                      <Sparkles className="h-4 w-4 text-red-400" />
                    </Button>
                  </motion.div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => setShowEligibilityCard(false)}
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Maybe Later
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Community Chat Room */}
      <ProductCommunityChatRoomFixed
        isOpen={showCommunityChat}
        onClose={() => setShowCommunityChat(false)}
        product={product}
        currentUser={currentUser}
        isMobile={isMobile}
      />

      {/* Community Management Panel */}
      <CommunityManagementPanel
        isOpen={showManagementPanel}
        onClose={() => setShowManagementPanel(false)}
        productId={product.id}
        productName={product.name}
        isMobile={isMobile}
      />
    </>
  );
}