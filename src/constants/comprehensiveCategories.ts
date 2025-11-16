/**
 * Comprehensive E-commerce Categories System
 * Based on major platforms like Amazon, Alibaba, and AliExpress
 * Organized in Level 1 (Main), Level 2 (Subcategories), and Level 3 (Deep subcategories)
 */

export interface CategoryItem {
  key: string;
  label: string;
  emoji: string;
  description?: string;
  subcategories?: CategoryItem[];
}

export const comprehensiveCategories: CategoryItem[] = [
  {
    key: 'electronics',
    label: 'Electronics',
    emoji: '📱',
    description: 'Latest innovative gadgets and devices',
    subcategories: [
      {
        key: 'computers-tablets',
        label: 'Computers & Tablets',
        emoji: '💻',
        subcategories: [
          { key: 'laptops', label: 'Laptops', emoji: '💻' },
          { key: 'desktops', label: 'Desktops', emoji: '🖥️' },
          { key: 'monitors', label: 'Monitors', emoji: '🖥️' },
          { key: 'pc-gaming', label: 'PC Gaming', emoji: '🎮' },
          { key: 'tablets', label: 'Tablets', emoji: '📱' },
          { key: 'printers', label: 'Printers', emoji: '🖨️' },
          { key: 'computer-components', label: 'Computer Components', emoji: '🔧' },
          { key: 'networking-products', label: 'Networking Products', emoji: '📡' },
          { key: 'data-storage', label: 'Data Storage', emoji: '💾' },
          { key: 'software', label: 'Software', emoji: '💿' }
        ]
      },
      {
        key: 'tv-video',
        label: 'TV & Video',
        emoji: '📺',
        subcategories: [
          { key: 'televisions', label: 'Televisions', emoji: '📺' },
          { key: 'streaming-devices', label: 'Streaming Devices', emoji: '📱' },
          { key: 'home-theater', label: 'Home Theater Systems', emoji: '🔊' },
          { key: 'projectors', label: 'Projectors', emoji: '📽️' }
        ]
      },
      {
        key: 'headphones',
        label: 'Headphones',
        emoji: '🎧',
        subcategories: [
          { key: 'wireless-headphones', label: 'Wireless Headphones', emoji: '🎧' },
          { key: 'noise-canceling', label: 'Noise-Canceling', emoji: '🔇' },
          { key: 'earbuds', label: 'Earbuds', emoji: '🎵' },
          { key: 'gaming-headsets', label: 'Gaming Headsets', emoji: '🎮' }
        ]
      },
      {
        key: 'cameras',
        label: 'Cameras',
        emoji: '📷',
        subcategories: [
          { key: 'dslr-cameras', label: 'DSLR Cameras', emoji: '📷' },
          { key: 'mirrorless-cameras', label: 'Mirrorless Cameras', emoji: '📸' },
          { key: 'action-cameras', label: 'Action Cameras', emoji: '🎬' },
          { key: 'camera-accessories', label: 'Camera Accessories', emoji: '🔍' }
        ]
      },
      {
        key: 'cell-phones-accessories',
        label: 'Cell Phones & Accessories',
        emoji: '📱',
        subcategories: [
          { key: 'smartphones', label: 'Smartphones', emoji: '📱' },
          { key: 'phone-cases', label: 'Phone Cases', emoji: '🛡️' },
          { key: 'chargers', label: 'Chargers', emoji: '🔌' },
          { key: 'screen-protectors', label: 'Screen Protectors', emoji: '🛡️' }
        ]
      },
      {
        key: 'wearable-technology',
        label: 'Wearable Technology',
        emoji: '⌚',
        subcategories: [
          { key: 'smartwatches', label: 'Smartwatches', emoji: '⌚' },
          { key: 'fitness-trackers', label: 'Fitness Trackers', emoji: '🏃' },
          { key: 'health-monitors', label: 'Health Monitors', emoji: '❤️' }
        ]
      }
    ]
  },
  {
    key: 'home-kitchen',
    label: 'Home & Kitchen',
    emoji: '🏠',
    description: 'Essential items for household and cooking',
    subcategories: [
      {
        key: 'kitchen-dining',
        label: 'Kitchen & Dining',
        emoji: '🍽️',
        subcategories: [
          { key: 'cookware', label: 'Cookware', emoji: '🍳' },
          { key: 'kitchen-utensils', label: 'Kitchen Utensils', emoji: '🥄' },
          { key: 'dinnerware', label: 'Dinnerware', emoji: '🍽️' },
          { key: 'drinkware', label: 'Drinkware', emoji: '🥤' }
        ]
      },
      {
        key: 'furniture',
        label: 'Furniture',
        emoji: '🛋️',
        subcategories: [
          { key: 'living-room', label: 'Living Room', emoji: '🛋️' },
          { key: 'bedroom', label: 'Bedroom', emoji: '🛏️' },
          { key: 'dining-room', label: 'Dining Room', emoji: '🪑' },
          { key: 'office-furniture', label: 'Office Furniture', emoji: '🪑' }
        ]
      },
      {
        key: 'home-decor',
        label: 'Home Décor',
        emoji: '🎨',
        subcategories: [
          { key: 'wall-art', label: 'Wall Art', emoji: '🖼️' },
          { key: 'lighting', label: 'Lighting', emoji: '💡' },
          { key: 'candles', label: 'Candles', emoji: '🕯️' },
          { key: 'decorative-accents', label: 'Decorative Accents', emoji: '🏺' }
        ]
      },
      {
        key: 'bedding-bath',
        label: 'Bedding & Bath',
        emoji: '🛁',
        subcategories: [
          { key: 'bedding-sets', label: 'Bedding Sets', emoji: '🛏️' },
          { key: 'towels', label: 'Towels', emoji: '🛁' },
          { key: 'bath-accessories', label: 'Bath Accessories', emoji: '🧴' }
        ]
      },
      {
        key: 'small-appliances',
        label: 'Small Appliances',
        emoji: '🔌',
        subcategories: [
          { key: 'blenders', label: 'Blenders', emoji: '🥤' },
          { key: 'air-fryers', label: 'Air Fryers', emoji: '🍟' },
          { key: 'coffee-makers', label: 'Coffee Makers', emoji: '☕' },
          { key: 'microwaves', label: 'Microwaves', emoji: '📦' }
        ]
      },
      {
        key: 'storage-organization',
        label: 'Storage & Organization',
        emoji: '📦',
        subcategories: [
          { key: 'closet-organizers', label: 'Closet Organizers', emoji: '👗' },
          { key: 'storage-bins', label: 'Storage Bins', emoji: '📦' },
          { key: 'garage-storage', label: 'Garage Storage', emoji: '🏠' }
        ]
      }
    ]
  },
  {
    key: 'clothing-shoes-jewelry',
    label: 'Clothing, Shoes & Jewelry',
    emoji: '👗',
    description: 'Fashion and accessories for all styles',
    subcategories: [
      {
        key: 'womens-fashion',
        label: "Women's Fashion",
        emoji: '👗',
        subcategories: [
          { key: 'dresses', label: 'Dresses', emoji: '👗' },
          { key: 'tops-blouses', label: 'Tops & Blouses', emoji: '👚' },
          { key: 'pants-leggings', label: 'Pants & Leggings', emoji: '👖' },
          { key: 'activewear', label: 'Activewear', emoji: '🏃‍♀️' },
          { key: 'swimwear', label: 'Swimwear', emoji: '👙' },
          { key: 'lingerie', label: 'Lingerie', emoji: '🌸' }
        ]
      },
      {
        key: 'mens-fashion',
        label: "Men's Fashion",
        emoji: '👔',
        subcategories: [
          { key: 'shirts', label: 'Shirts', emoji: '👔' },
          { key: 'pants-jeans', label: 'Pants & Jeans', emoji: '👖' },
          { key: 'suits', label: 'Suits', emoji: '🤵' },
          { key: 'athletic-wear', label: 'Athletic Wear', emoji: '🏃‍♂️' },
          { key: 'swimwear-men', label: 'Swimwear', emoji: '🩱' }
        ]
      },
      {
        key: 'girls-fashion',
        label: "Girls' Fashion",
        emoji: '👧',
        subcategories: [
          { key: 'girls-dresses', label: 'Dresses', emoji: '👗' },
          { key: 'girls-tops', label: 'Tops', emoji: '👚' },
          { key: 'girls-bottoms', label: 'Bottoms', emoji: '👖' }
        ]
      },
      {
        key: 'boys-fashion',
        label: "Boys' Fashion",
        emoji: '👦',
        subcategories: [
          { key: 'boys-shirts', label: 'Shirts', emoji: '👔' },
          { key: 'boys-pants', label: 'Pants', emoji: '👖' },
          { key: 'boys-activewear', label: 'Activewear', emoji: '🏃‍♂️' }
        ]
      },
      {
        key: 'shoes',
        label: 'Shoes',
        emoji: '👠',
        subcategories: [
          { key: 'womens-shoes', label: "Women's Shoes", emoji: '👠' },
          { key: 'mens-shoes', label: "Men's Shoes", emoji: '👞' },
          { key: 'athletic-shoes', label: 'Athletic Shoes', emoji: '👟' },
          { key: 'boots', label: 'Boots', emoji: '🥾' }
        ]
      },
      {
        key: 'jewelry-watches',
        label: 'Jewelry & Watches',
        emoji: '💍',
        subcategories: [
          { key: 'necklaces', label: 'Necklaces', emoji: '📿' },
          { key: 'earrings', label: 'Earrings', emoji: '💎' },
          { key: 'bracelets', label: 'Bracelets', emoji: '💍' },
          { key: 'watches', label: 'Watches', emoji: '⌚' }
        ]
      }
    ]
  },
  {
    key: 'beauty-personal-care',
    label: 'Beauty & Personal Care',
    emoji: '💄',
    description: 'Self-care and grooming products',
    subcategories: [
      {
        key: 'makeup',
        label: 'Makeup',
        emoji: '💄',
        subcategories: [
          { key: 'foundation', label: 'Foundation', emoji: '💄' },
          { key: 'eyeshadow', label: 'Eyeshadow', emoji: '👁️' },
          { key: 'lipstick', label: 'Lipstick', emoji: '💋' },
          { key: 'mascara', label: 'Mascara', emoji: '👁️' }
        ]
      },
      {
        key: 'skincare',
        label: 'Skincare',
        emoji: '🧴',
        subcategories: [
          { key: 'moisturizers', label: 'Moisturizers', emoji: '🧴' },
          { key: 'serums', label: 'Serums', emoji: '💧' },
          { key: 'cleansers', label: 'Cleansers', emoji: '🧽' },
          { key: 'treatments', label: 'Treatments', emoji: '✨' }
        ]
      },
      {
        key: 'haircare',
        label: 'Haircare',
        emoji: '💇',
        subcategories: [
          { key: 'shampoo', label: 'Shampoo', emoji: '🧴' },
          { key: 'conditioner', label: 'Conditioner', emoji: '🧴' },
          { key: 'styling-products', label: 'Styling Products', emoji: '💇' }
        ]
      },
      {
        key: 'fragrance',
        label: 'Fragrance',
        emoji: '🌸',
        subcategories: [
          { key: 'perfume', label: 'Perfume', emoji: '🌸' },
          { key: 'cologne', label: 'Cologne', emoji: '🌿' },
          { key: 'body-spray', label: 'Body Spray', emoji: '💨' }
        ]
      },
      {
        key: 'oral-care',
        label: 'Oral Care',
        emoji: '🦷',
        subcategories: [
          { key: 'toothpaste', label: 'Toothpaste', emoji: '🦷' },
          { key: 'toothbrushes', label: 'Toothbrushes', emoji: '🪥' },
          { key: 'mouthwash', label: 'Mouthwash', emoji: '🌊' }
        ]
      },
      {
        key: 'shaving-grooming',
        label: 'Shaving & Grooming',
        emoji: '🪒',
        subcategories: [
          { key: 'razors', label: 'Razors', emoji: '🪒' },
          { key: 'grooming-kits', label: 'Grooming Kits', emoji: '✂️' },
          { key: 'aftershave', label: 'Aftershave', emoji: '🧴' }
        ]
      }
    ]
  },
  {
    key: 'books',
    label: 'Books',
    emoji: '📚',
    description: 'Literary works and educational materials',
    subcategories: [
      {
        key: 'fiction',
        label: 'Fiction',
        emoji: '📖',
        subcategories: [
          { key: 'romance', label: 'Romance', emoji: '💕' },
          { key: 'mystery', label: 'Mystery', emoji: '🕵️' },
          { key: 'sci-fi', label: 'Science Fiction', emoji: '🚀' },
          { key: 'fantasy', label: 'Fantasy', emoji: '🧙' }
        ]
      },
      {
        key: 'non-fiction',
        label: 'Non-Fiction',
        emoji: '📰',
        subcategories: [
          { key: 'self-help', label: 'Self-Help', emoji: '🌟' },
          { key: 'history', label: 'History', emoji: '🏛️' },
          { key: 'biography', label: 'Biography', emoji: '👤' },
          { key: 'business', label: 'Business', emoji: '💼' }
        ]
      },
      {
        key: 'childrens-books',
        label: "Children's Books",
        emoji: '👶',
        subcategories: [
          { key: 'picture-books', label: 'Picture Books', emoji: '🎨' },
          { key: 'chapter-books', label: 'Chapter Books', emoji: '📚' },
          { key: 'educational', label: 'Educational', emoji: '🎓' }
        ]
      },
      {
        key: 'textbooks',
        label: 'Textbooks',
        emoji: '🎓',
        subcategories: [
          { key: 'college-textbooks', label: 'College Textbooks', emoji: '🎓' },
          { key: 'k-12-textbooks', label: 'K-12 Textbooks', emoji: '📝' }
        ]
      },
      {
        key: 'cookbooks',
        label: 'Cookbooks',
        emoji: '👨‍🍳',
        subcategories: [
          { key: 'baking', label: 'Baking', emoji: '🧁' },
          { key: 'international-cuisine', label: 'International Cuisine', emoji: '🌍' },
          { key: 'healthy-cooking', label: 'Healthy Cooking', emoji: '🥗' }
        ]
      },
      {
        key: 'audiobooks',
        label: 'Audiobooks',
        emoji: '🎧',
        subcategories: [
          { key: 'fiction-audio', label: 'Fiction', emoji: '🎧' },
          { key: 'non-fiction-audio', label: 'Non-Fiction', emoji: '📱' }
        ]
      }
    ]
  },
  {
    key: 'health-household',
    label: 'Health & Household',
    emoji: '🏥',
    description: 'Health products and household essentials',
    subcategories: [
      {
        key: 'vitamins-supplements',
        label: 'Vitamins & Supplements',
        emoji: '💊',
        subcategories: [
          { key: 'multivitamins', label: 'Multivitamins', emoji: '💊' },
          { key: 'protein-supplements', label: 'Protein Supplements', emoji: '💪' },
          { key: 'herbal-supplements', label: 'Herbal Supplements', emoji: '🌿' }
        ]
      },
      {
        key: 'first-aid',
        label: 'First Aid',
        emoji: '🚑',
        subcategories: [
          { key: 'first-aid-kits', label: 'First Aid Kits', emoji: '🚑' },
          { key: 'bandages', label: 'Bandages', emoji: '🩹' },
          { key: 'pain-relief', label: 'Pain Relief', emoji: '💊' }
        ]
      },
      {
        key: 'cleaning-supplies',
        label: 'Cleaning Supplies',
        emoji: '🧽',
        subcategories: [
          { key: 'all-purpose-cleaners', label: 'All-Purpose Cleaners', emoji: '🧽' },
          { key: 'laundry-detergent', label: 'Laundry Detergent', emoji: '🧺' },
          { key: 'disinfectants', label: 'Disinfectants', emoji: '🦠' }
        ]
      }
    ]
  },
  {
    key: 'toys-games',
    label: 'Toys & Games',
    emoji: '🧸',
    description: 'Play and learning for all ages',
    subcategories: [
      {
        key: 'educational-toys',
        label: 'Educational Toys',
        emoji: '🎓',
        subcategories: [
          { key: 'stem-toys', label: 'STEM Toys', emoji: '🔬' },
          { key: 'learning-tablets', label: 'Learning Tablets', emoji: '📱' },
          { key: 'building-sets', label: 'Building Sets', emoji: '🧱' }
        ]
      },
      {
        key: 'action-figures',
        label: 'Action Figures',
        emoji: '🦸',
        subcategories: [
          { key: 'superhero-figures', label: 'Superhero Figures', emoji: '🦸' },
          { key: 'collectible-figures', label: 'Collectible Figures', emoji: '🎭' }
        ]
      },
      {
        key: 'board-games',
        label: 'Board Games',
        emoji: '🎲',
        subcategories: [
          { key: 'strategy-games', label: 'Strategy Games', emoji: '♟️' },
          { key: 'family-games', label: 'Family Games', emoji: '👨‍👩‍👧‍👦' },
          { key: 'card-games', label: 'Card Games', emoji: '🃏' }
        ]
      },
      {
        key: 'outdoor-toys',
        label: 'Outdoor Toys',
        emoji: '🏃',
        subcategories: [
          { key: 'playground-equipment', label: 'Playground Equipment', emoji: '🛝' },
          { key: 'sports-toys', label: 'Sports Toys', emoji: '⚽' },
          { key: 'water-toys', label: 'Water Toys', emoji: '💦' }
        ]
      }
    ]
  },
  {
    key: 'sports-outdoors',
    label: 'Sports & Outdoors',
    emoji: '⚽',
    description: 'Equipment for active lifestyles',
    subcategories: [
      {
        key: 'exercise-fitness',
        label: 'Exercise & Fitness',
        emoji: '💪',
        subcategories: [
          { key: 'home-gym-equipment', label: 'Home Gym Equipment', emoji: '🏋️' },
          { key: 'cardio-equipment', label: 'Cardio Equipment', emoji: '🏃' },
          { key: 'yoga-equipment', label: 'Yoga Equipment', emoji: '🧘' },
          { key: 'fitness-accessories', label: 'Fitness Accessories', emoji: '🎽' }
        ]
      },
      {
        key: 'camping-hiking',
        label: 'Camping & Hiking',
        emoji: '🏕️',
        subcategories: [
          { key: 'tents', label: 'Tents', emoji: '🏕️' },
          { key: 'backpacks', label: 'Backpacks', emoji: '🎒' },
          { key: 'sleeping-bags', label: 'Sleeping Bags', emoji: '🛌' },
          { key: 'camping-gear', label: 'Camping Gear', emoji: '🏕️' }
        ]
      },
      {
        key: 'cycling',
        label: 'Cycling',
        emoji: '🚴',
        subcategories: [
          { key: 'bikes', label: 'Bikes', emoji: '🚲' },
          { key: 'bike-accessories', label: 'Bike Accessories', emoji: '🔧' },
          { key: 'bike-safety', label: 'Bike Safety', emoji: '🪖' }
        ]
      },
      {
        key: 'fan-shop',
        label: 'Fan Shop',
        emoji: '🏆',
        subcategories: [
          { key: 'team-merchandise', label: 'Team Merchandise', emoji: '🏆' },
          { key: 'sports-memorabilia', label: 'Sports Memorabilia', emoji: '⚽' }
        ]
      },
      {
        key: 'fishing',
        label: 'Fishing',
        emoji: '🎣',
        subcategories: [
          { key: 'fishing-rods', label: 'Fishing Rods', emoji: '🎣' },
          { key: 'fishing-reels', label: 'Fishing Reels', emoji: '🎣' },
          { key: 'fishing-bait', label: 'Fishing Bait', emoji: '🪱' }
        ]
      },
      {
        key: 'team-sports',
        label: 'Team Sports',
        emoji: '⚽',
        subcategories: [
          { key: 'soccer', label: 'Soccer', emoji: '⚽' },
          { key: 'basketball', label: 'Basketball', emoji: '🏀' },
          { key: 'football', label: 'Football', emoji: '🏈' },
          { key: 'baseball', label: 'Baseball', emoji: '⚾' }
        ]
      }
    ]
  },
  {
    key: 'automotive',
    label: 'Automotive',
    emoji: '🚗',
    description: 'Vehicle accessories and parts',
    subcategories: [
      {
        key: 'car-accessories',
        label: 'Car Accessories',
        emoji: '🚗',
        subcategories: [
          { key: 'car-electronics', label: 'Car Electronics', emoji: '📻' },
          { key: 'car-care', label: 'Car Care', emoji: '🧽' },
          { key: 'interior-accessories', label: 'Interior Accessories', emoji: '🪑' }
        ]
      },
      {
        key: 'car-parts',
        label: 'Car Parts',
        emoji: '🔧',
        subcategories: [
          { key: 'engine-parts', label: 'Engine Parts', emoji: '⚙️' },
          { key: 'brake-parts', label: 'Brake Parts', emoji: '🛑' },
          { key: 'tires', label: 'Tires', emoji: '🛞' }
        ]
      },
      {
        key: 'tools-equipment',
        label: 'Tools & Equipment',
        emoji: '🔧',
        subcategories: [
          { key: 'hand-tools', label: 'Hand Tools', emoji: '🔧' },
          { key: 'power-tools', label: 'Power Tools', emoji: '⚡' },
          { key: 'diagnostic-tools', label: 'Diagnostic Tools', emoji: '📊' }
        ]
      }
    ]
  },
  {
    key: 'handmade',
    label: 'Handmade',
    emoji: '🎨',
    description: 'Unique, handcrafted products',
    subcategories: [
      {
        key: 'handmade-jewelry',
        label: 'Handmade Jewelry',
        emoji: '💍',
        subcategories: [
          { key: 'custom-jewelry', label: 'Custom Jewelry', emoji: '💎' },
          { key: 'artisan-rings', label: 'Artisan Rings', emoji: '💍' }
        ]
      },
      {
        key: 'handmade-home',
        label: 'Handmade Home',
        emoji: '🏠',
        subcategories: [
          { key: 'custom-furniture', label: 'Custom Furniture', emoji: '🪑' },
          { key: 'handmade-decor', label: 'Handmade Décor', emoji: '🎨' }
        ]
      },
      {
        key: 'handmade-clothing',
        label: 'Handmade Clothing',
        emoji: '👗',
        subcategories: [
          { key: 'custom-clothing', label: 'Custom Clothing', emoji: '✂️' },
          { key: 'handknit-items', label: 'Handknit Items', emoji: '🧶' }
        ]
      }
    ]
  },
  {
    key: 'industrial-scientific',
    label: 'Industrial & Scientific',
    emoji: '🔬',
    description: 'Professional-grade equipment and supplies',
    subcategories: [
      {
        key: 'lab-equipment',
        label: 'Lab Equipment',
        emoji: '🔬',
        subcategories: [
          { key: 'microscopes', label: 'Microscopes', emoji: '🔬' },
          { key: 'lab-supplies', label: 'Lab Supplies', emoji: '🧪' }
        ]
      },
      {
        key: 'industrial-supplies',
        label: 'Industrial Supplies',
        emoji: '⚙️',
        subcategories: [
          { key: 'safety-equipment', label: 'Safety Equipment', emoji: '🦺' },
          { key: 'industrial-tools', label: 'Industrial Tools', emoji: '🔧' }
        ]
      }
    ]
  },
  {
    key: 'grocery-gourmet',
    label: 'Grocery & Gourmet Food',
    emoji: '🍎',
    description: 'Fresh produce and specialty foods',
    subcategories: [
      {
        key: 'fresh-produce',
        label: 'Fresh Produce',
        emoji: '🥬',
        subcategories: [
          { key: 'fruits', label: 'Fruits', emoji: '🍎' },
          { key: 'vegetables', label: 'Vegetables', emoji: '🥕' }
        ]
      },
      {
        key: 'gourmet-snacks',
        label: 'Gourmet Snacks',
        emoji: '🍿',
        subcategories: [
          { key: 'nuts', label: 'Nuts', emoji: '🥜' },
          { key: 'chocolate', label: 'Chocolate', emoji: '🍫' }
        ]
      },
      {
        key: 'beverages',
        label: 'Beverages',
        emoji: '🥤',
        subcategories: [
          { key: 'coffee', label: 'Coffee', emoji: '☕' },
          { key: 'tea', label: 'Tea', emoji: '🍵' },
          { key: 'soft-drinks', label: 'Soft Drinks', emoji: '🥤' }
        ]
      }
    ]
  },
  {
    key: 'pet-supplies',
    label: 'Pet Supplies',
    emoji: '🐕',
    description: 'Everything for beloved pets',
    subcategories: [
      {
        key: 'dog-supplies',
        label: 'Dog Supplies',
        emoji: '🐕',
        subcategories: [
          { key: 'dog-food', label: 'Dog Food', emoji: '🍖' },
          { key: 'dog-toys', label: 'Dog Toys', emoji: '🎾' },
          { key: 'dog-accessories', label: 'Dog Accessories', emoji: '🦴' }
        ]
      },
      {
        key: 'cat-supplies',
        label: 'Cat Supplies',
        emoji: '🐱',
        subcategories: [
          { key: 'cat-food', label: 'Cat Food', emoji: '🐟' },
          { key: 'cat-toys', label: 'Cat Toys', emoji: '🧶' },
          { key: 'litter-boxes', label: 'Litter Boxes', emoji: '📦' }
        ]
      },
      {
        key: 'pet-health',
        label: 'Pet Health',
        emoji: '🏥',
        subcategories: [
          { key: 'vitamins', label: 'Vitamins', emoji: '💊' },
          { key: 'grooming', label: 'Grooming', emoji: '✂️' }
        ]
      }
    ]
  },
  {
    key: 'baby-products',
    label: 'Baby Products',
    emoji: '👶',
    description: 'Essentials for infants and toddlers',
    subcategories: [
      {
        key: 'baby-clothing',
        label: 'Baby Clothing',
        emoji: '👶',
        subcategories: [
          { key: 'bodysuits', label: 'Bodysuits', emoji: '👕' },
          { key: 'sleepwear', label: 'Sleepwear', emoji: '🌙' }
        ]
      },
      {
        key: 'baby-gear',
        label: 'Baby Gear',
        emoji: '🍼',
        subcategories: [
          { key: 'strollers', label: 'Strollers', emoji: '🚗' },
          { key: 'car-seats', label: 'Car Seats', emoji: '🪑' },
          { key: 'high-chairs', label: 'High Chairs', emoji: '🪑' }
        ]
      },
      {
        key: 'baby-toys',
        label: 'Baby Toys',
        emoji: '🧸',
        subcategories: [
          { key: 'rattles', label: 'Rattles', emoji: '🎵' },
          { key: 'soft-toys', label: 'Soft Toys', emoji: '🧸' }
        ]
      }
    ]
  },
  {
    key: 'musical-instruments',
    label: 'Musical Instruments',
    emoji: '🎸',
    description: 'Instruments for all skill levels',
    subcategories: [
      {
        key: 'guitars',
        label: 'Guitars',
        emoji: '🎸',
        subcategories: [
          { key: 'acoustic-guitars', label: 'Acoustic Guitars', emoji: '🎸' },
          { key: 'electric-guitars', label: 'Electric Guitars', emoji: '🎸' }
        ]
      },
      {
        key: 'keyboards-pianos',
        label: 'Keyboards & Pianos',
        emoji: '🎹',
        subcategories: [
          { key: 'digital-pianos', label: 'Digital Pianos', emoji: '🎹' },
          { key: 'synthesizers', label: 'Synthesizers', emoji: '🎛️' }
        ]
      },
      {
        key: 'drums',
        label: 'Drums',
        emoji: '🥁',
        subcategories: [
          { key: 'drum-sets', label: 'Drum Sets', emoji: '🥁' },
          { key: 'drum-accessories', label: 'Drum Accessories', emoji: '🥢' }
        ]
      }
    ]
  },
  {
    key: 'movies-tv-music',
    label: 'Movies & TV / Music',
    emoji: '🎬',
    description: 'Entertainment across all genres',
    subcategories: [
      {
        key: 'movies',
        label: 'Movies',
        emoji: '🎬',
        subcategories: [
          { key: 'action-movies', label: 'Action Movies', emoji: '💥' },
          { key: 'comedy-movies', label: 'Comedy Movies', emoji: '😂' },
          { key: 'drama-movies', label: 'Drama Movies', emoji: '🎭' }
        ]
      },
      {
        key: 'tv-shows',
        label: 'TV Shows',
        emoji: '📺',
        subcategories: [
          { key: 'tv-series', label: 'TV Series', emoji: '📺' },
          { key: 'documentaries', label: 'Documentaries', emoji: '🎥' }
        ]
      },
      {
        key: 'music',
        label: 'Music',
        emoji: '🎵',
        subcategories: [
          { key: 'pop-music', label: 'Pop Music', emoji: '🎤' },
          { key: 'rock-music', label: 'Rock Music', emoji: '🎸' },
          { key: 'classical-music', label: 'Classical Music', emoji: '🎻' }
        ]
      }
    ]
  },
  {
    key: 'software-video-games',
    label: 'Software & Video Games',
    emoji: '🎮',
    description: 'Digital entertainment and productivity',
    subcategories: [
      {
        key: 'video-games',
        label: 'Video Games',
        emoji: '🎮',
        subcategories: [
          { key: 'action-games', label: 'Action Games', emoji: '🎮' },
          { key: 'rpg-games', label: 'RPG Games', emoji: '🗡️' },
          { key: 'sports-games', label: 'Sports Games', emoji: '⚽' }
        ]
      },
      {
        key: 'productivity-software',
        label: 'Productivity Software',
        emoji: '💻',
        subcategories: [
          { key: 'office-software', label: 'Office Software', emoji: '📊' },
          { key: 'design-software', label: 'Design Software', emoji: '🎨' }
        ]
      }
    ]
  },
  {
    key: 'lawn-garden',
    label: 'Lawn & Garden',
    emoji: '🌱',
    description: 'Outdoor maintenance and gardening',
    subcategories: [
      {
        key: 'gardening-tools',
        label: 'Gardening Tools',
        emoji: '🌱',
        subcategories: [
          { key: 'hand-tools-garden', label: 'Hand Tools', emoji: '🔧' },
          { key: 'power-tools-garden', label: 'Power Tools', emoji: '⚡' }
        ]
      },
      {
        key: 'plants-seeds',
        label: 'Plants & Seeds',
        emoji: '🌸',
        subcategories: [
          { key: 'flower-seeds', label: 'Flower Seeds', emoji: '🌸' },
          { key: 'vegetable-seeds', label: 'Vegetable Seeds', emoji: '🥕' }
        ]
      },
      {
        key: 'outdoor-decor',
        label: 'Outdoor Décor',
        emoji: '🏡',
        subcategories: [
          { key: 'garden-statues', label: 'Garden Statues', emoji: '🗿' },
          { key: 'outdoor-lighting', label: 'Outdoor Lighting', emoji: '💡' }
        ]
      }
    ]
  },
  {
    key: 'office-products',
    label: 'Office Products',
    emoji: '📝',
    description: 'Supplies for productive work environments',
    subcategories: [
      {
        key: 'office-supplies',
        label: 'Office Supplies',
        emoji: '📝',
        subcategories: [
          { key: 'pens-pencils', label: 'Pens & Pencils', emoji: '✏️' },
          { key: 'paper-products', label: 'Paper Products', emoji: '📄' },
          { key: 'folders-binders', label: 'Folders & Binders', emoji: '📁' }
        ]
      },
      {
        key: 'office-furniture',
        label: 'Office Furniture',
        emoji: '🪑',
        subcategories: [
          { key: 'desks', label: 'Desks', emoji: '🪑' },
          { key: 'office-chairs', label: 'Office Chairs', emoji: '🪑' },
          { key: 'filing-cabinets', label: 'Filing Cabinets', emoji: '🗃️' }
        ]
      },
      {
        key: 'office-electronics',
        label: 'Office Electronics',
        emoji: '🖨️',
        subcategories: [
          { key: 'printers-office', label: 'Printers', emoji: '🖨️' },
          { key: 'calculators', label: 'Calculators', emoji: '🧮' },
          { key: 'shredders', label: 'Shredders', emoji: '📄' }
        ]
      }
    ]
  },
  {
    key: 'tools-home-improvement',
    label: 'Tools & Home Improvement',
    emoji: '🔨',
    description: 'Tools and supplies for DIY projects',
    subcategories: [
      {
        key: 'power-tools',
        label: 'Power Tools',
        emoji: '⚡',
        subcategories: [
          { key: 'drills', label: 'Drills', emoji: '🔧' },
          { key: 'saws', label: 'Saws', emoji: '🪚' },
          { key: 'sanders', label: 'Sanders', emoji: '🔧' }
        ]
      },
      {
        key: 'hand-tools',
        label: 'Hand Tools',
        emoji: '🔨',
        subcategories: [
          { key: 'hammers', label: 'Hammers', emoji: '🔨' },
          { key: 'screwdrivers', label: 'Screwdrivers', emoji: '🔧' },
          { key: 'wrenches', label: 'Wrenches', emoji: '🔧' }
        ]
      },
      {
        key: 'building-supplies',
        label: 'Building Supplies',
        emoji: '🧱',
        subcategories: [
          { key: 'lumber', label: 'Lumber', emoji: '🪵' },
          { key: 'hardware', label: 'Hardware', emoji: '🔩' },
          { key: 'paint-supplies', label: 'Paint Supplies', emoji: '🎨' }
        ]
      }
    ]
  }
];

// Helper function to get all categories in a flat structure for search
export const getAllCategories = (): CategoryItem[] => {
  const flatCategories: CategoryItem[] = [];
  
  const addCategories = (categories: CategoryItem[]) => {
    categories.forEach(category => {
      flatCategories.push(category);
      if (category.subcategories) {
        addCategories(category.subcategories);
      }
    });
  };
  
  addCategories(comprehensiveCategories);
  return flatCategories;
};

// Helper function to find a category by key
export const findCategoryByKey = (key: string): CategoryItem | null => {
  const allCategories = getAllCategories();
  return allCategories.find(category => category.key === key) || null;
};