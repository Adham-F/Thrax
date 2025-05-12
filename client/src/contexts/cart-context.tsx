import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { CartItemWithProduct, Product } from '@shared/schema';

interface CartContextType {
  cartItems: CartItemWithProduct[];
  isLoading: boolean;
  isCartOpen: boolean;
  totalItems: number;
  totalPrice: number;
  toggleCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (cartItemId: number) => void;
  updateQuantity: (cartItemId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch cart items for authenticated users
  const {
    data: cartItems = [],
    isLoading,
    refetch: refetchCart,
  } = useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart'],
    enabled: !!user, // Only fetch if user is logged in
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: number;
      quantity: number;
    }) => {
      if (!user) {
        throw new Error('You must be logged in to add items to cart');
      }
      const res = await apiRequest('POST', '/api/cart', {
        productId,
        quantity,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: 'Added to cart',
        description: 'Item has been added to your cart',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to add item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      cartItemId,
      quantity,
    }: {
      cartItemId: number;
      quantity: number;
    }) => {
      const res = await apiRequest('PUT', `/api/cart/${cartItemId}`, {
        quantity,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update quantity',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (cartItemId: number) => {
      await apiRequest('DELETE', `/api/cart/${cartItemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: 'Removed from cart',
        description: 'Item has been removed from your cart',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to remove item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', '/api/cart');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to clear cart',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Calculate total items and price
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to add items to your cart',
        variant: 'destructive',
      });
      return;
    }
    
    addToCartMutation.mutate({ productId: product.id, quantity });
    setIsCartOpen(true); // Open cart when adding item
  };

  const removeFromCart = (cartItemId: number) => {
    removeFromCartMutation.mutate(cartItemId);
  };

  const updateQuantity = (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;
    updateQuantityMutation.mutate({ cartItemId, quantity });
  };

  const clearCart = () => {
    clearCartMutation.mutate();
  };

  // Reset cart when user logs out
  useEffect(() => {
    if (!user) {
      setIsCartOpen(false);
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        isCartOpen,
        totalItems,
        totalPrice,
        toggleCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
