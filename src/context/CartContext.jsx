import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  const fetchCart = async () => {
    // Don't fetch if user not authenticated or auth still loading
    if (!user || authLoading) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      const result = await cartService.getCart();
      if (result.success) {
        setCartItems(result.data || []);
      } else {
        // Silently handle "not authenticated" errors during initial load
        if (result.error && (result.error.includes('authenticated') || result.error.includes('logged-in'))) {
          setCartItems([]);
        } else {
          console.error('Error fetching cart:', result.error);
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch cart when user changes
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchCart();
      } else {
        // ✅ Clear cart when user logs out
        setCartItems([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const addToCart = async (productId, quantity) => {
    try {
      const result = await cartService.addToCart(productId, quantity);
      if (result.success) {
        await fetchCart();
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to add to cart',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add to cart',
      };
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      const result = await cartService.removeFromCart(cartId);
      if (result.success) {
        await fetchCart();
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to remove from cart',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove from cart',
      };
    }
  };

  const updateCartQuantity = async (cartId, newQuantity) => {
    try {
      // Optimistic update: Show new quantity immediately in UI
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price }
            : item
        )
      );

      // Sync with backend
      const result = await cartService.updateCartQuantity(cartId, newQuantity);
      if (!result.success) {
        // If backend fails, refetch cart to restore correct state
        await fetchCart();
        return { success: false, error: result.error || 'Failed to update quantity' };
      }
      return { success: true };
    } catch (error) {
      // On error, refetch to restore correct cart state
      await fetchCart();
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update quantity',
      };
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        fetchCart,
        getCartTotal,
        getCartItemCount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

