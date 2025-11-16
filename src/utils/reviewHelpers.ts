import { Review, ReviewFilters, ReviewSortOptions } from "../types";

export const filterAndSortReviews = (
  reviews: Review[],
  filters: ReviewFilters,
  searchQuery: string,
  sortOptions: ReviewSortOptions
): Review[] => {
  let filtered = [...reviews];

  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter(review => 
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply rating filter
  if (filters.rating && filters.rating.length > 0) {
    filtered = filtered.filter(review => filters.rating!.includes(review.rating));
  }

  // Apply media filter
  if (filters.hasMedia) {
    filtered = filtered.filter(review => review.images.length > 0 || review.videos.length > 0);
  }

  // Apply verified purchase filter
  if (filters.verifiedOnly) {
    filtered = filtered.filter(review => review.isVerifiedPurchase);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortOptions.sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest-rated':
        return b.rating - a.rating;
      case 'lowest-rated':
        return a.rating - b.rating;
      case 'most-helpful':
        return b.helpfulVotes - a.helpfulVotes;
      default:
        return 0;
    }
  });

  return filtered;
};

export const renderStars = (rating: number, interactive = false, size = 'h-6 w-6') => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    const isActive = i <= rating;
    const className = `${size} cursor-pointer transition-all duration-200 ${
      isActive 
        ? 'fill-yellow-400 text-yellow-400' 
        : 'text-gray-300 hover:text-yellow-300'
    } ${interactive ? 'hover:scale-110' : ''}`;
    
    stars.push({ id: i, isActive, className });
  }

  return stars;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const simulateFileUpload = (onProgress: (progress: number) => void): Promise<void> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
};