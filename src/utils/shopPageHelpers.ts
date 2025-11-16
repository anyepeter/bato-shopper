import { youtubeVideoIds, colorMap } from "../constants/shopPageConstants";
import { Product } from "../types";

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
  const index = (productId - 1) % youtubeVideoIds.length;
  return youtubeVideoIds[index];
};

// 🔥 UPDATED: Get YouTube embed URL with product-specific video support
export const getYouTubeEmbedUrl = (productId: number, product?: Product): string => {
  const videoId = getYouTubeVideoId(productId, product);
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`;
};

export const getColorCode = (colorName: string): string => {
  return colorMap[colorName.toLowerCase()] || '#6b7280';
};

export const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400">⭐</span>);
  }

  if (hasHalfStar) {
    stars.push(<span key="half" className="h-3 w-3 fill-yellow-400/50 text-yellow-400">⭐</span>);
  }

  const remainingStars = 5 - Math.ceil(rating);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<span key={`empty-${i}`} className="h-3 w-3 text-gray-300">☆</span>);
  }

  return stars;
};