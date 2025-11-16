import React from 'react';

// Google Material Icons for E-commerce Categories
export const CategoryIcons = {
  // 🔍 Search functionality
  search: "search",
  
  // 📦 All Products - shows everything
  allProduct: "grid_view", // Alternative: "apps", "view_module"
  
  // 👗 Dresses - women's clothing
  dresses: "checkroom", // Alternative: "woman", "dress"
  
  // 👔 Tops - shirts and blouses  
  tops: "shirt", // Alternative: "clothing"
  
  // 👕👖 Sets - coordinated outfits
  sets: "layers", // Alternative: "collections", "library_books"
  
  // 🏛️ Traditional - cultural/heritage items
  traditional: "account_balance", // Alternative: "museum", "cultural_center"
  
  // 💍 Accessories - jewelry, bags, etc.
  accessories: "diamond", // Alternative: "jewelry", "watch", "handbag"
};

// Usage examples with Material Icons
export const CategoryIconExamples = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {/* Search */}
      <div className="flex items-center space-x-2">
        <span className="material-icons">search</span>
        <span>Search</span>
      </div>
      
      {/* All Products */}
      <div className="flex items-center space-x-2">
        <span className="material-icons">grid_view</span>
        <span>All Products</span>
      </div>
      
      {/* Dresses */}
      <div className="flex items-center space-x-2">
        <span className="material-icons">checkroom</span>
        <span>Dresses</span>
      </div>
      
      {/* Tops */}
      <div className="flex items-center space-x-2">
        <span className="material-icons">shirt</span>
        <span>Tops</span>
      </div>
      
      {/* Sets */}
      <div className="flex items-center space-x-2">
        <span className="material-icons">layers</span>
        <span>Sets</span>
      </div>
      
      {/* Traditional */}
      <div className="flex items-center space-x-2">
        <span className="material-icons">account_balance</span>
        <span>Traditional</span>
      </div>
      
      {/* Accessories */}
      <div className="flex items-center space-x-2">
        <span className="material-icons">diamond</span>
        <span>Accessories</span>
      </div>
    </div>
  );
};

// Alternative icon suggestions for each category
export const AlternativeIcons = {
  search: ["search", "find_in_page", "youtube_searched_for"],
  
  allProduct: [
    "grid_view",      // Grid layout
    "apps",           // App grid
    "view_module",    // Module view
    "dashboard",      // Dashboard view
    "category"        // Category icon
  ],
  
  dresses: [
    "checkroom",      // Clothing room
    "woman",          // Woman figure
    "dress",          // Direct dress icon (if available)
    "female",         // Female symbol
    "accessibility"   // Person icon
  ],
  
  tops: [
    "shirt",          // Shirt icon
    "clothing",       // General clothing
    "dry_cleaning",   // Clothing care
    "local_laundry_service" // Laundry/clothing
  ],
  
  sets: [
    "layers",         // Layered items
    "collections",    // Collection of items
    "library_books",  // Set of books (represents collection)
    "view_agenda",    // Agenda view (organized sets)
    "reorder"         // Organized list
  ],
  
  traditional: [
    "account_balance", // Classical building
    "museum",         // Museum icon
    "temple_buddhist", // Cultural/religious
    "castle",         // Heritage building
    "church",         // Traditional architecture
    "holiday_village" // Cultural village
  ],
  
  accessories: [
    "diamond",        // Jewelry/gems
    "watch",          // Timepiece
    "ring_volume",    // Ring shape
    "favorite",       // Heart (jewelry)
    "star",           // Star accessory
    "auto_awesome"    // Sparkle/glamour
  ]
};