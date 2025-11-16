import { useState, useEffect } from "react";
import { FavoriteItem, Product } from "../types";

export function useFavorites() {
  // Initialize from localStorage if available
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>(() => {
    try {
      const saved = localStorage.getItem('bato-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem('bato-favorites', JSON.stringify(favoriteItems));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favoriteItems]);

  const handleToggleFavorite = (product: Product) => {
    // Ensure favoriteItems is always an array
    const currentFavorites = favoriteItems || [];
    const existingFavoriteIndex = currentFavorites.findIndex(item => item.id === product.id);
    
    if (existingFavoriteIndex >= 0) {
      // Remove from favorites
      const updatedFavorites = currentFavorites.filter(item => item.id !== product.id);
      setFavoriteItems(updatedFavorites);
      console.log(`🔥 Removed product ${product.id} from favorites. New count: ${updatedFavorites.length}`);
    } else {
      // Add to favorites
      // Determine badge based on product properties
      let badge = '';
      if (product.isNew) badge = 'New';
      else if (product.isBestSeller) badge = 'Popular';
      else if (product.originalPrice && product.originalPrice > product.price) badge = 'Sale';

      const newFavorite: FavoriteItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        rating: product.rating,
        sizes: product.sizes || [],
        colors: product.colors || [],
        badge: badge || undefined,
        isNew: product.isNew,
        isBestSeller: product.isBestSeller,
        discount: product.discount
      };
      const updatedFavorites = [...currentFavorites, newFavorite];
      setFavoriteItems(updatedFavorites);
      console.log(`🔥 Added product ${product.id} (${product.name}) to favorites. New count: ${updatedFavorites.length}`);
    }
  };

  const handleRemoveFromFavorites = (productId: number) => {
    const currentFavorites = favoriteItems || [];
    const updatedFavorites = currentFavorites.filter(item => item.id !== productId);
    setFavoriteItems(updatedFavorites);
    console.log(`🔥 Removed product ${productId} from favorites via direct removal. New count: ${updatedFavorites.length}`);
  };

  const isFavorite = (productId: number) => {
    // Ensure favoriteItems is always an array before calling some
    return favoriteItems && Array.isArray(favoriteItems) 
      ? favoriteItems.some(item => item.id === productId)
      : false;
  };

  return {
    favoriteItems: favoriteItems || [], // Ensure it's always an array
    handleToggleFavorite,
    handleRemoveFromFavorites,
    isFavorite,
    setFavoriteItems
  };
}