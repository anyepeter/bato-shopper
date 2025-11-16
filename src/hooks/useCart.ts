import { useState } from "react";
import { CartItem, Product } from "../types";

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product: Product, size: string, color: string, incentive?: any) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.size === size && item.color === color && !item.incentive
    );

    if (existingItemIndex >= 0 && !incentive) {
      // Only merge if no incentive - incentive items should be separate
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      const newItem: CartItem = {
        id: Date.now(), // Unique cart item ID
        product,
        size,
        color,
        quantity: 1,
        incentive: incentive ? {
          offerId: incentive.offerId,
          offerTitle: incentive.offerTitle,
          discountType: incentive.discountType,
          discountValue: incentive.discountValue,
          originalPrice: product.price,
          discountedPrice: incentive.discountedPrice,
          description: incentive.description
        } : undefined
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  // New method specifically for adding with incentives
  const handleAddToCartWithIncentive = (product: Product, size: string, color: string, incentiveData: any) => {
    const newItem: CartItem = {
      id: Date.now(),
      product,
      size,
      color,
      quantity: 1,
      incentive: {
        offerId: incentiveData.offerId,
        offerTitle: incentiveData.offerTitle,
        discountType: incentiveData.discountType,
        discountValue: incentiveData.discountValue,
        originalPrice: product.price,
        discountedPrice: incentiveData.discountedPrice,
        description: incentiveData.description
      }
    };
    setCartItems([...cartItems, newItem]);
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // 🆕 NEW: Handle size and color updates
  const handleUpdateSizeColor = (cartItemId: number, newSize: string, newColor: string) => {
    const cartItem = cartItems.find(item => item.id === cartItemId);
    if (!cartItem) return;

    // Check if an item with the same product, size, and color already exists
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === cartItem.product.id && 
              item.size === newSize && 
              item.color === newColor &&
              item.id !== cartItemId
    );

    if (existingItemIndex >= 0) {
      // Merge quantities and remove the original item
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += cartItem.quantity;
      setCartItems(updatedItems.filter(item => item.id !== cartItemId));
    } else {
      // Update the current item's size and color
      setCartItems(cartItems.map(item =>
        item.id === cartItemId ? { ...item, size: newSize, color: newColor } : item
      ));
    }
  };

  // Fix: Ensure cartItems is always defined before calling reduce
  const cartItemsCount = cartItems && Array.isArray(cartItems) 
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0) 
    : 0;

  return {
    cartItems,
    cartItemsCount,
    isCartOpen,
    setIsCartOpen,
    handleAddToCart,
    handleAddToCartWithIncentive,
    handleUpdateQuantity,
    handleRemoveItem,
    handleUpdateSizeColor,
    setCartItems
  };
}