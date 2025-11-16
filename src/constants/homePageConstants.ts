export const YOUTUBE_VIDEO_IDS = [
  'JLnjExtdyAs', '1YseVzwa0Rw', 'WJjx47FUgfs', 'F08tHtD_qfc',
  'thoWb5Fs3fw', 'h3kx0BxnPA0', 'QZP9nDVFF00', 'r7J7LJ1zhIk',
  'KHXwwiG7lug', 'MmRXT5ik4cE', 'JJbgGuf9nq8', 'HIC9LRab0zo',
  'o96D5B_KUvQ'
];

export const BRAND_DATA = [
  { id: 'modish-premium', name: 'Modish Premium', products: 45, rating: 4.8, featured: true, icon: '⭐', count: 45 },
  { id: 'african-heritage', name: 'African Heritage', products: 32, rating: 4.6, featured: false, icon: '🌍', count: 32 },
  { id: 'ankara-dreams', name: 'Ankara Dreams', products: 28, rating: 4.7, featured: true, icon: '✨', count: 28 },
  { id: 'traditional-elegance', name: 'Traditional Elegance', products: 19, rating: 4.5, featured: false, icon: '👑', count: 19 }
];

export const createFloatingCategories = (
  onToggleMobileSearch: () => void,
  setFilterCategory: (category: string) => void
) => [
  { 
    id: 'search',
    name: 'Search', 
    icon: 'search',
    action: onToggleMobileSearch
  },
  { 
    id: 'all',
    name: 'All Product', 
    icon: 'grid_view',
    action: () => setFilterCategory('all')
  },
  { 
    id: 'dresses',
    name: 'Dresses', 
    icon: 'checkroom',
    action: () => setFilterCategory('dresses')
  },
  { 
    id: 'tops',
    name: 'Tops', 
    icon: 'shirt',
    action: () => setFilterCategory('tops')
  },
  { 
    id: 'sets',
    name: 'Sets', 
    icon: 'layers',
    action: () => setFilterCategory('sets')
  },
  { 
    id: 'traditional',
    name: 'Traditional', 
    icon: 'account_balance',
    action: () => setFilterCategory('traditional')
  },
  { 
    id: 'accessories',
    name: 'Accessories', 
    icon: 'diamond',
    action: () => setFilterCategory('accessories')
  }
  // Share button entry removed - there's already a separate share button in mobile interaction buttons
];

export const createCategoryData = (allFilteredProducts: any[]) => [
  { id: 'all', name: 'All Products', count: allFilteredProducts.length, icon: '🌟' },
  { id: 'dresses', name: 'Dresses', count: allFilteredProducts.filter(p => p.category === 'dresses').length, icon: '👗' },
  { id: 'tops', name: 'Tops', count: allFilteredProducts.filter(p => p.category === 'tops').length, icon: '👚' },
  { id: 'sets', name: 'Sets', count: allFilteredProducts.filter(p => p.category === 'sets').length, icon: '👕' },
  { id: 'traditional', name: 'Traditional', count: allFilteredProducts.filter(p => p.category === 'traditional').length, icon: '🎭' },
  { id: 'accessories', name: 'Accessories', count: allFilteredProducts.filter(p => p.category === 'accessories').length, icon: '💎' }
];