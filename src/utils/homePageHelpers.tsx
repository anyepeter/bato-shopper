import { Star } from "lucide-react";
import { YOUTUBE_VIDEO_IDS } from "../constants/homePageConstants";
import { Product, Stream } from "../types";
import { MOCK_STREAMS, LIVE_STREAMS } from "../constants/streamingData";

export const getColorCode = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    'red': '#ef4444',
    'blue': '#3b82f6',
    'green': '#10b981',
    'yellow': '#f59e0b',
    'orange': '#f97316',
    'purple': '#8b5cf6',
    'pink': '#ec4899',
    'black': '#1f2937',
    'white': '#f9fafb',
    'brown': '#92400e',
    'gold': '#fbbf24',
    'multi': 'linear-gradient(45deg, #f97316, #dc2626, #fbbf24)'
  };
  return colorMap[colorName.toLowerCase()] || '#6b7280';
};

// 🔥 NEW: Extract YouTube video ID from various URL formats
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;
  
  // Handle YouTube Shorts URLs
  const shortsMatch = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  
  // Handle regular YouTube URLs
  const regularMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (regularMatch) return regularMatch[1];
  
  // Handle watch URLs with v parameter
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  
  return null;
};

// 🔥 UPDATED: Get YouTube video ID from product data or fallback to constants
export const getYouTubeVideoId = (productId: number, product?: Product): string => {
  // If product is provided, try to get video from its images array
  if (product && product.images && product.images.length > 0) {
    const videoUrl = product.images[0]; // First item should be the video URL
    const extractedId = extractYouTubeVideoId(videoUrl);
    if (extractedId) return extractedId;
  }
  
  // Fallback to constants for backward compatibility
  const index = (productId - 1) % YOUTUBE_VIDEO_IDS.length;
  return YOUTUBE_VIDEO_IDS[index];
};

// 🔥 UPDATED: Get YouTube embed URL with product-specific video support
export const getYouTubeEmbedUrl = (productId: number, product?: Product): string => {
  const videoId = getYouTubeVideoId(productId, product);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
  
  console.log('🎬 Video URL Generation:', {
    productId,
    productName: product?.name,
    videoUrl: product?.images?.[0],
    extractedVideoId: videoId,
    finalEmbedUrl: embedUrl
  });
  
  return embedUrl;
};

export const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
  }

  if (hasHalfStar) {
    stars.push(<Star key="half" className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />);
  }

  const remainingStars = 5 - Math.ceil(rating);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />);
  }

  return stars;
};

export const getHotProducts = (allFilteredProducts: Product[]): Product[] => {
  return allFilteredProducts
    .filter(product => 
      product.rating >= 4.7 || 
      product.badge === 'New' || 
      product.badge === 'Popular' ||
      product.price >= 100
    )
    .slice(0, 4);
};

export const getTrendingProducts = (allFilteredProducts: Product[]): Product[] => {
  return allFilteredProducts
    .filter(product => 
      product.badge === 'Sale' || 
      product.rating >= 4.5 ||
      product.originalPrice
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
};

export const getLayoutClasses = (isMobile: boolean, isTablet: boolean) => {
  if (isMobile) {
    return {
      container: 'flex flex-col gap-5 px-0',
      leftPanel: 'hidden',
      middlePanel: 'w-full px-5',
      rightPanel: 'w-full px-5 order-first'
    };
  }
  
  if (isTablet) {
    return {
      container: 'flex gap-5 max-w-[1600px] mx-auto px-5',
      leftPanel: 'w-1/3',
      middlePanel: 'w-2/3',
      rightPanel: 'hidden'
    };
  }
  
  return {
    container: 'flex gap-5 px-2.5',
    leftPanel: 'w-1/6',
    middlePanel: 'flex-1',
    rightPanel: 'w-1/6'
  };
};

export const getProductGridCols = (isMobile: boolean, isTablet: boolean): string => {
  if (isMobile) return 'grid-cols-1';
  if (isTablet) return 'grid-cols-2';
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
};

export const getCategoryIconSize = (isMobile: boolean): string => {
  if (isMobile) return '24px';
  return '48px'; // 🔥 REDUCED FROM 96px TO 48px (HALF SIZE)
};

// 🔥 NEW: Helper functions for Live Stream integration
export const getProductLiveStream = (productId: number): Stream | null => {
  return LIVE_STREAMS.find(stream => 
    stream.products.some(product => product.id === productId)
  ) || null;
};

export const isProductInLiveStream = (productId: number): boolean => {
  return getProductLiveStream(productId) !== null;
};

export const getProductStreamData = (productId: number): { 
  stream: Stream | null; 
  isLive: boolean; 
  viewerCount: number; 
} => {
  const stream = getProductLiveStream(productId);
  return {
    stream,
    isLive: stream?.isLive || false,
    viewerCount: stream?.viewerCount || 0
  };
};