#!/bin/bash

# Buyers Portal Component Reorganization Script
# This script moves all buyers portal components to /components/buyers/

echo "🚀 Starting Buyers Portal Component Reorganization..."

# Create main buyers directory structure
mkdir -p components/buyers/core
mkdir -p components/buyers/layout
mkdir -p components/buyers/pages
mkdir -p components/buyers/mobile
mkdir -p components/buyers/shared
mkdir -p components/buyers/footer
mkdir -p components/buyers/streaming
mkdir -p components/buyers/chat
mkdir -p components/buyers/reviews
mkdir -p components/buyers/sharing

echo "✅ Created directory structure"

# Move core components
echo "📦 Moving core components..."
mv components/HomePage.tsx components/buyers/core/ 2>/dev/null || true
mv components/ProductCard.tsx components/buyers/core/ 2>/dev/null || true
mv components/ProductModal.tsx components/buyers/core/ 2>/dev/null || true
mv components/ShoppingCart.tsx components/buyers/core/ 2>/dev/null || true
mv components/FloatingChatButton.tsx components/buyers/core/ 2>/dev/null || true
mv components/FloatingToggleButton.tsx components/buyers/core/ 2>/dev/null || true
mv components/FloatingIncentiveBadge.tsx components/buyers/core/ 2>/dev/null || true

# Move layout components
echo "📦 Moving layout components..."
mv components/Header.tsx components/buyers/layout/ 2>/dev/null || true
mv components/Footer.tsx components/buyers/layout/ 2>/dev/null || true

# Move page components
echo "📦 Moving page components..."
mv components/pages/CheckoutPageWithLogistics.tsx components/buyers/pages/CheckoutPage.tsx 2>/dev/null || true
mv components/pages/ProductDetailsPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/FavoritesPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/MobileCartPageWithIncentives.tsx components/buyers/pages/MobileCartPage.tsx 2>/dev/null || true
mv components/pages/MobileFavoritesPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/OrdersPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/OrderDetailsPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/PackageTrackingPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/ProductReviewsPageEnhanced.tsx components/buyers/pages/ProductReviewsPage.tsx 2>/dev/null || true
mv components/pages/SharePage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/ShopCategoriesPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/WatchLiveStreamPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/StoreLocatorPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/GetDirectionsPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/BuyerProfilePage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/SignInPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/CreateAccountPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/AccessoriesPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/DressesPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/TopsPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/ContactUsPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/ShippingInfoPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/ReturnsPage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/SizeGuidePage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/RateExperiencePage.tsx components/buyers/pages/ 2>/dev/null || true
mv components/pages/ProductCommunityDemoPage.tsx components/buyers/pages/ 2>/dev/null || true

# Move mobile components
echo "📦 Moving mobile components..."
mv components/mobile/MobileHomeProductView.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/FloatingCategories.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/MobileSearchOverlay.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/MobileBottomNavigation.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/MobileIncentiveBalloon.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/MobileIncentiveBalloonStandalone.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/MobileIncentiveBalloonStandaloneFixed.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/MobilePageContainer.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/FloatingProductCommunityButton.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/QuickSocialActions.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/CommunityReviewsPreview.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/LiveViewersIndicator.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/ReviewActivityFeed.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/ReviewSocialStats.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/SocialActivityFeed.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/SocialProofBadges.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/SocialReviewCard.tsx components/buyers/mobile/ 2>/dev/null || true
mv components/mobile/TrendingReviewsCarousel.tsx components/buyers/mobile/ 2>/dev/null || true

# Move shared components
echo "📦 Moving shared components..."
mv components/shared/HomePageLayout.tsx components/buyers/shared/ 2>/dev/null || true
mv components/shared/HomePageLayoutComplete.tsx components/buyers/shared/ 2>/dev/null || true
mv components/shared/MobileShopView.tsx components/buyers/shared/ 2>/dev/null || true
mv components/shared/ShopDesktopLayout.tsx components/buyers/shared/ 2>/dev/null || true
mv components/shared/SophisticatedShopLayout.tsx components/buyers/shared/ 2>/dev/null || true

# Move footer components
echo "📦 Moving footer components..."
mv components/footer/FooterBrand.tsx components/buyers/footer/ 2>/dev/null || true
mv components/footer/FooterContact.tsx components/buyers/footer/ 2>/dev/null || true
mv components/footer/FooterCopyright.tsx components/buyers/footer/ 2>/dev/null || true
mv components/footer/FooterFeatureBar.tsx components/buyers/footer/ 2>/dev/null || true
mv components/footer/FooterNavigation.tsx components/buyers/footer/ 2>/dev/null || true

# Move streaming components
echo "📦 Moving streaming components..."
mv components/streaming/LiveStreamGrid.tsx components/buyers/streaming/ 2>/dev/null || true
mv components/streaming/LiveStreamGridFixedTablet.tsx components/buyers/streaming/ 2>/dev/null || true
mv components/streaming/MobileStreamViewer.tsx components/buyers/streaming/ 2>/dev/null || true
mv components/streaming/StreamCard.tsx components/buyers/streaming/ 2>/dev/null || true
mv components/streaming/StreamCategories.tsx components/buyers/streaming/ 2>/dev/null || true
mv components/streaming/ProductThumbnail.tsx components/buyers/streaming/ 2>/dev/null || true
mv components/streaming/JoinLiveStreamButton.tsx components/buyers/streaming/ 2>/dev/null || true
mv components/streaming/QuickWatchStreamButton.tsx components/buyers/streaming/ 2>/dev/null || true
mv components/streaming/WatchStreamButton.tsx components/buyers/streaming/ 2>/dev/null || true
mv components/streaming/MobileLiveStreamFloatingButtons.tsx components/buyers/streaming/ 2>/dev/null || true
mv components/streaming/EnhancedChatMessage.tsx components/buyers/streaming/ 2>/dev/null || true
mv components/streaming/EnhancedLiveChatInput.tsx components/buyers/streaming/ 2>/dev/null || true
mv components/streaming/ProductQuestionButton.tsx components/buyers/streaming/ 2>/dev/null || true
mv components/streaming/ProductQuestionInterface.tsx components/buyers/streaming/ 2>/dev/null || true
mv components/streaming/ProductQuestionMessage.tsx components/buyers/streaming/ 2>/dev/null || true

# Move chat components
echo "📦 Moving chat components..."
mv components/chat/ProductCommunityButton.tsx components/buyers/chat/ 2>/dev/null || true
mv components/chat/ProductCommunityChatRoomFixedIntegrated.tsx components/buyers/chat/ProductCommunityChatRoom.tsx 2>/dev/null || true
mv components/chat/CommunityManagementPanel.tsx components/buyers/chat/ 2>/dev/null || true
mv components/chat/EnhancedReviewInput.tsx components/buyers/chat/ 2>/dev/null || true
mv components/chat/MessageBubble.tsx components/buyers/chat/ 2>/dev/null || true
mv components/chat/MessageReactions.tsx components/buyers/chat/ 2>/dev/null || true
mv components/chat/PhoneCallInterface.tsx components/buyers/chat/ 2>/dev/null || true
mv components/chat/QuickReactionPicker.tsx components/buyers/chat/ 2>/dev/null || true
mv components/chat/SlidingRatingPrompt.tsx components/buyers/chat/ 2>/dev/null || true
mv components/chat/VideoCallInterface.tsx components/buyers/chat/ 2>/dev/null || true
mv components/chat/VoiceMessageInterface.tsx components/buyers/chat/ 2>/dev/null || true

# Move reviews components
echo "📦 Moving reviews components..."
mv components/reviews/ReviewSubmissionForm.tsx components/buyers/reviews/ 2>/dev/null || true
mv components/reviews/ReviewSummary.tsx components/buyers/reviews/ 2>/dev/null || true

# Move sharing components
echo "📦 Moving sharing components..."
mv components/sharing/FloatingShareButton.tsx components/buyers/sharing/ 2>/dev/null || true
mv components/sharing/ShareModal.tsx components/buyers/sharing/ 2>/dev/null || true
mv components/sharing/index.ts components/buyers/sharing/ 2>/dev/null || true

echo "✅ All components moved successfully!"
echo ""
echo "⚠️  IMPORTANT: You now need to update imports in:"
echo "   - App.tsx"
echo "   - AppRouter.tsx"
echo "   - All moved components"
echo ""
echo "🎉 Reorganization complete!"
